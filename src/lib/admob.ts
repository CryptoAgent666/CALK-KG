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

function useTestAdsNow(): boolean {
  return import.meta.env.DEV || import.meta.env.VITE_ADMOB_TEST === '1';
}

function interstitialId(): string {
  const platform = Capacitor.getPlatform() === 'ios' ? 'ios' : 'android';
  return (useTestAdsNow() ? TEST_INTERSTITIAL : PROD_INTERSTITIAL)[platform];
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
  if (isAdFree()) return;
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
  try {
    const { AdMob, BannerAdSize, BannerAdPosition } = await import('@capacitor-community/admob');
    await AdMob.initialize();

    const platform = Capacitor.getPlatform() === 'ios' ? 'ios' : 'android';
    // Test ads: in dev server, OR when built with VITE_ADMOB_TEST=1 (safe device testing).
    const ids = useTestAdsNow() ? TEST_BANNER : PROD_BANNER;

    await AdMob.showBanner({
      adId: ids[platform],
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
