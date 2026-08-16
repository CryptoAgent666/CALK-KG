// Native AdMob banner — runs only inside the Capacitor apps (iOS/Android).
// On the web Capacitor.isNativePlatform() is false, so this is a no-op there.
// Plugin is dynamically imported so it never bloats the web bundle.
import { Capacitor } from '@capacitor/core';
import { isAdFree, onAdFreeChange } from './purchases';

// Google's official TEST ad units (safe during development — never click real ads).
const TEST_BANNER = {
  ios: 'ca-app-pub-3940256099942544/2934735716',
  android: 'ca-app-pub-3940256099942544/6300978111',
};
const TEST_INTERSTITIAL = {
  ios: 'ca-app-pub-3940256099942544/4411468910',
  android: 'ca-app-pub-3940256099942544/1033173712',
};
const TEST_REWARDED = {
  ios: 'ca-app-pub-3940256099942544/1712485313',
  android: 'ca-app-pub-3940256099942544/5224354917',
};
// Live KG ad units.
const PROD_BANNER = {
  ios: 'ca-app-pub-4859241862365215/5907853241',
  android: 'ca-app-pub-4859241862365215/2108777250',
};
// ⚠️ Пусто = интерстишал выключен (prepare пропускается, баннер работает как раньше).
// Заполнить ID из AdMob: приложение Calk.KG (iOS/Android) → Ad units → Interstitial.
const PROD_INTERSTITIAL = {
  ios: '',
  android: '',
};
// ⚠️ Пусто = rewarded выключен (кнопка «12 часов без рекламы» не показывается).
// Заполнить ID из AdMob: приложение Calk.KG (iOS/Android) → Ad units → Rewarded.
const PROD_REWARDED = {
  ios: '',
  android: '',
};

// ── Временное отключение рекламы за просмотр rewarded-ролика ─────────────────
// Награда: N часов без баннера и интерстишелов НА ЭТОМ УСТРОЙСТВЕ (в отличие
// от покупки ad_free это локальный localStorage-таймер, между устройствами не
// синхронизируется — и не должен). Намеренно НЕ конкурирует с покупкой: даёт
// распробовать жизнь без рекламы и подводит к «навсегда за $1.99».
//
// Длительность — единственный источник правды, UI-тексты подставляют {h} из
// этой константы. 6 часов: покрывает «полдня» задач (справедливо за 30-сек
// ролик), но к следующему дню реклама возвращается — rewarded-показы копятся,
// а покупка «навсегда» не обесценивается. 12–24 ч = один ролик закрывает все
// сессии эпизодического пользователя и режет и рекламу, и покупки.
export const TEMP_AD_FREE_HOURS = 6;
const TEMP_AD_FREE_KEY = 'ads_free_until';

// Схема calk.kz: интерстишал не чаще раза в 3 минуты и не раньше 3-й навигации
// (не доставать сразу после запуска). Лимиты — UX + требования сторов.
const INTERSTITIAL_MIN_INTERVAL_MS = 3 * 60 * 1000;
const INTERSTITIAL_MIN_NAVIGATIONS = 3;
const INTERSTITIAL_LAST_KEY = 'ads_last_interstitial';

/** После каждого 3-го интерстишела шлётся это событие — RemoveAdsToast показывает
 *  предложение купить отключение рекламы (момент, когда она только что помешала). */
export const SUGGEST_REMOVE_ADS_EVENT = 'calk:suggest-remove-ads';

let interstitialReady = false;
let navCount = 0;
let interstitialShownCount = 0;
let sdkInitialized = false;
let adsReturnTimer: ReturnType<typeof setTimeout> | undefined;

function useTestAdsNow(): boolean {
  return import.meta.env.DEV || import.meta.env.VITE_ADMOB_TEST === '1';
}

function platformKey(): 'ios' | 'android' {
  return Capacitor.getPlatform() === 'ios' ? 'ios' : 'android';
}

function interstitialId(): string {
  return (useTestAdsNow() ? TEST_INTERSTITIAL : PROD_INTERSTITIAL)[platformKey()];
}

function rewardedId(): string {
  return (useTestAdsNow() ? TEST_REWARDED : PROD_REWARDED)[platformKey()];
}

// Зеркало в памяти: если localStorage недоступен (приватный режим), награда
// всё равно живёт до конца сессии.
let tempUntilMem = 0;

/** Таймстамп окончания временного (за ролик) периода без рекламы, 0 если нет. */
export function tempAdFreeUntil(): number {
  let stored = 0;
  try { stored = Number(localStorage.getItem(TEMP_AD_FREE_KEY) || '0'); } catch { /* mem-фолбэк */ }
  return Math.max(stored, tempUntilMem);
}

/** Активен ли временный период без рекламы (за просмотр ролика). */
export function tempAdFreeActive(): boolean {
  return Date.now() < tempAdFreeUntil();
}

/** Rewarded доступен в этой сборке? (native + ID юнита создан). Гейт для кнопки в UI. */
export function rewardedAvailable(): boolean {
  return Capacitor.isNativePlatform() && !!rewardedId();
}

/** Когда период истечёт — вернуть рекламу (баннер + интерстишалы) без перезапуска. */
function scheduleAdsReturn(): void {
  const left = tempAdFreeUntil() - Date.now();
  if (left <= 0) return;
  clearTimeout(adsReturnTimer);
  adsReturnTimer = setTimeout(() => {
    if (!isAdFree() && !tempAdFreeActive()) void initNativeAds();
  }, left + 1000);
}

async function prepareInterstitial(): Promise<void> {
  const adId = interstitialId();
  if (!adId) return; // боевой ID ещё не создан в AdMob
  try {
    const { AdMob } = await import('@capacitor-community/admob');
    await AdMob.prepareInterstitial({ adId, isTesting: useTestAdsNow() });
    interstitialReady = true;
  } catch {
    interstitialReady = false;
  }
}

/**
 * Показать интерстишал при смене маршрута, если можно (частотный лимит +
 * минимум навигаций). На вебе, у купивших и без готового объявления — no-op.
 */
export async function maybeShowInterstitial(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  if (isAdFree() || tempAdFreeActive()) return;
  navCount += 1;
  if (navCount < INTERSTITIAL_MIN_NAVIGATIONS || !interstitialReady) return;

  const last = Number(localStorage.getItem(INTERSTITIAL_LAST_KEY) || '0');
  if (Date.now() - last < INTERSTITIAL_MIN_INTERVAL_MS) return;

  try {
    const { AdMob } = await import('@capacitor-community/admob');
    await AdMob.showInterstitial();
    localStorage.setItem(INTERSTITIAL_LAST_KEY, String(Date.now()));
    interstitialReady = false;

    // Ненавязчивое предложение убрать рекламу — после каждого 3-го показа.
    interstitialShownCount += 1;
    if (interstitialShownCount % 3 === 0) {
      window.dispatchEvent(new CustomEvent(SUGGEST_REMOVE_ADS_EVENT));
    }

    void prepareInterstitial(); // подготовить следующий
  } catch {
    /* реклама не критична */
  }
}

export type WatchAdResult = 'ok' | 'cancelled' | 'unavailable' | 'failed';

/**
 * Показать rewarded-ролик и, если досмотрен, выдать TEMP_AD_FREE_HOURS часов
 * без рекламы. Награда — ТОЛЬКО по событию Rewarded (пользователь досмотрел),
 * закрытие раньше времени = 'cancelled', ничего не выдаём (правила AdMob).
 */
export async function watchAdForTempAdFree(): Promise<WatchAdResult> {
  if (!rewardedAvailable()) return 'unavailable';
  if (isAdFree() || tempAdFreeActive()) return 'ok'; // выдавать нечего — уже без рекламы
  try {
    const { AdMob, RewardAdPluginEvents } = await import('@capacitor-community/admob');
    if (!sdkInitialized) {
      await AdMob.initialize();
      sdkInitialized = true;
    }
    await AdMob.prepareRewardVideoAd({ adId: rewardedId(), isTesting: useTestAdsNow() });

    let rewarded = false;
    const handles = [
      await AdMob.addListener(RewardAdPluginEvents.Rewarded, () => { rewarded = true; }),
    ];
    // Ждём закрытия ролика (или провала показа). Страховочный таймаут — чтобы
    // кнопка не зависла в busy, если платформа не пришлёт Dismissed.
    const closed = new Promise<void>((resolve) => {
      const finish = () => resolve();
      void AdMob.addListener(RewardAdPluginEvents.Dismissed, finish).then((h) => handles.push(h));
      void AdMob.addListener(RewardAdPluginEvents.FailedToShow, finish).then((h) => handles.push(h));
      setTimeout(finish, 5 * 60 * 1000);
    });

    await AdMob.showRewardVideoAd();
    await closed;
    handles.forEach((h) => { void h.remove(); });

    if (!rewarded) return 'cancelled';

    // Выдать награду: таймстамп + мгновенно спрятать баннер + таймер возврата.
    tempUntilMem = Date.now() + TEMP_AD_FREE_HOURS * 3600_000;
    try {
      localStorage.setItem(TEMP_AD_FREE_KEY, String(tempUntilMem));
    } catch { /* приватный режим — mem-зеркало доживёт до конца сессии */ }
    void hideBanner();
    scheduleAdsReturn();
    return 'ok';
  } catch (e) {
    console.error('[admob] rewarded не показался:', e);
    return 'failed';
  }
}

/** Скрыть и убрать баннер (после покупки «Убрать рекламу» посреди сессии). */
async function hideBanner(): Promise<void> {
  try {
    const { AdMob } = await import('@capacitor-community/admob');
    await AdMob.hideBanner();
    await AdMob.removeBanner();
  } catch {
    /* ignore */
  }
}

export async function initNativeAds(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  // Пользователь купил «Убрать рекламу» → не грузим и не показываем ничего.
  // isAdFree() читает localStorage-кэш синхронно, поэтому у купивших баннер
  // не мелькает даже до ответа RevenueCat (initPurchases стартует раньше в main.tsx).
  if (isAdFree()) return;
  // Идёт временный период без рекламы (за ролик) → ничего не показываем,
  // но ставим таймер: по истечении этот же init вернёт баннер без перезапуска.
  if (tempAdFreeActive()) {
    scheduleAdsReturn();
    return;
  }
  try {
    const { AdMob, BannerAdSize, BannerAdPosition } = await import('@capacitor-community/admob');
    if (!sdkInitialized) {
      await AdMob.initialize();
      sdkInitialized = true;
    }

    // Test ads: in dev server, OR when built with VITE_ADMOB_TEST=1 (safe device testing).
    const ids = useTestAdsNow() ? TEST_BANNER : PROD_BANNER;

    await AdMob.showBanner({
      adId: ids[platformKey()],
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
    });

    // Первый интерстишал готовим заранее (показ — maybeShowInterstitial при навигации).
    void prepareInterstitial();

    // Если пользователь купит «Убрать рекламу» во время сессии — убрать баннер сразу.
    onAdFreeChange((adFree) => { if (adFree) void hideBanner(); });
  } catch (err) {
    // Never let an ad failure break the app.
    console.warn('[admob] init/banner failed:', err);
  }
}
