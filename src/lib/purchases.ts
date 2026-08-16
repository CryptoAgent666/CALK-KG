import { Capacitor } from '@capacitor/core';

/**
 * RevenueCat: разовая покупка «Убрать рекламу» (non-consumable / durable one-time).
 * Портировано с calk.kz (проверено там end-to-end в июле 2026, sandbox iOS+Android).
 *
 * Модель: в дашборде RevenueCat entitlement `ad_free` привязан к продукту
 * `removeads_KG` (App Store non-consumable + Google Play one-time durable, у КАЖДОЙ
 * платформы своя запись продукта, обе привязаны к entitlement). Покупка одна,
 * навсегда, привязана к Apple ID / Google-аккаунту → переживает переустановку
 * и работает на всех устройствах пользователя (через restore).
 *
 * - На вебе (сайт calk.kg) — полный no-op: нативный плагин не грузится.
 * - Статус ad-free кэшируется в localStorage, чтобы isAdFree() отвечал
 *   СИНХРОННО и мгновенно (важно для гейта рекламы до ответа сети / офлайн).
 *
 * ⚠️ Это нативный плагин — доедет до пользователей только новой сборкой в
 *    стор (НЕ через OTA). IAP ревьюится вместе со сборкой.
 * Полный чек-лист настройки консолей: docs/IAP-SETUP.md
 */

const ENTITLEMENT_ID = 'ad_free';
const CACHE_KEY = 'calk_ad_free';

/**
 * Product ID «Убрать рекламу» — РАЗНЫЙ НА ПЛАТФОРМАХ, регистр отличается.
 *
 * ⚠️ iOS: `removeads_KG`. В App Store Connect product ID уникален в пределах
 * ВСЕГО аккаунта разработчика, а короткий `removeads` уже занят приложением
 * calk.kz — отсюда суффикс.
 *
 * ⚠️ Android: `removeads_kg` — строчными. Google Play не принимает заглавные
 * буквы в ID: «Must start with a number or lowercase letter. Can contain
 * numbers, lowercase letters, underscores and full stops.»
 *
 * ⚠️ Product ID в Play нельзя изменить или переиспользовать после создания.
 *
 * Значения ДОЛЖНЫ совпадать с product ID в консоли соответствующей платформы
 * и с записями продукта в RevenueCat (Product catalog → две записи, обе
 * привязаны к entitlement `ad_free`). Несовпадение = стор возвращает пустой
 * список → цена null → оффер скрыт, покупка невозможна (молчаливый отказ).
 */
const PRODUCT_IDS = {
  ios: 'removeads_KG',
  android: 'removeads_kg',
} as const;

function removeAdsProductId(): string {
  return Capacitor.getPlatform() === 'ios' ? PRODUCT_IDS.ios : PRODUCT_IDS.android;
}

/**
 * Покупки доступны только когда в БИНАРЕ зарегистрирован нативный модуль
 * RevenueCat. Критично: JS-бандл может прилететь и в старые сборки без
 * RevenueCat — без этого гейта там показывались бы мёртвые кнопки
 * «Убрать рекламу» (native bridge отсутствует, покупка невозможна).
 */
export function purchasesAvailable(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('Purchases');
}

/** Запасная цена для UI, пока RevenueCat не вернул локализованную (getRemoveAdsPrice).
 *  Живая цена приходит из стора автоматически и уже локализована — это значение
 *  видно лишь на миг загрузки и офлайн.
 *  ⚠️ Цена продукта задана в USD (1,99): кыргызского сома нет в списке валют
 *  Google Play, стор сам конвертирует для покупателя. Держать в синхроне с
 *  консолями: App Store Connect и Play → purchase option `removeads-kg`. */
export const REMOVE_ADS_FALLBACK_PRICE = '$1.99';

// Публичные SDK-ключи RevenueCat (Project Settings → API keys, по одному на
// платформу). Их МОЖНО держать в клиенте — это НЕ секретные `sk_`-ключи.
// Задать через .env (VITE_RC_*) или вписать напрямую вместо плейсхолдеров.
const RC_API_KEYS = {
  ios: import.meta.env.VITE_RC_IOS_KEY ?? 'appl_XXXXXXXXXXXXXXXXXXXXXXXX',
  android: import.meta.env.VITE_RC_ANDROID_KEY ?? 'goog_XXXXXXXXXXXXXXXXXXXXXXXX',
};

function readCache(): boolean {
  try { return localStorage.getItem(CACHE_KEY) === '1'; } catch { return false; }
}
function writeCache(v: boolean): void {
  try { localStorage.setItem(CACHE_KEY, v ? '1' : '0'); } catch { /* ignore */ }
}

let adFree = readCache();
const listeners = new Set<(v: boolean) => void>();

/** Синхронно: реклама отключена? Читает кэш — мгновенно и офлайн. */
export function isAdFree(): boolean {
  return adFree;
}

/** Подписка на изменение статуса (UI, скрытие баннера после покупки). Возвращает unsubscribe. */
export function onAdFreeChange(cb: (v: boolean) => void): () => void {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}

function setAdFree(v: boolean): void {
  if (v === adFree) return;
  adFree = v;
  writeCache(v);
  listeners.forEach((cb) => { try { cb(v); } catch { /* ignore */ } });
}

async function loadSdk() {
  return import('@revenuecat/purchases-capacitor');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function hasEntitlement(customerInfo: any): boolean {
  return !!customerInfo?.entitlements?.active?.[ENTITLEMENT_ID];
}

/** Инициализация RevenueCat при старте приложения. No-op на вебе и в бинарях без модуля. */
export async function initPurchases(): Promise<void> {
  if (!purchasesAvailable()) return;

  let Purchases: typeof import('@revenuecat/purchases-capacitor').Purchases;
  try {
    ({ Purchases } = await loadSdk());
  } catch {
    return;
  }

  try {
    const platform = Capacitor.getPlatform();
    const apiKey = platform === 'ios' ? RC_API_KEYS.ios : RC_API_KEYS.android;
    await Purchases.configure({ apiKey });

    // Любые изменения entitlement (покупка, restore, синк с другого устройства).
    await Purchases.addCustomerInfoUpdateListener((info) => {
      setAdFree(hasEntitlement(info));
    });

    // Актуализировать статус из стора (тихо подтягивает и уже совершённые покупки).
    try {
      const { customerInfo } = await Purchases.getCustomerInfo();
      setAdFree(hasEntitlement(customerInfo));
    } catch {
      /* офлайн — остаёмся на закэшированном значении */
    }
  } catch {
    /* конфиг не удался → безопасный дефолт: реклама показывается */
  }
}

type PurchasesSdk = Awaited<ReturnType<typeof loadSdk>>['Purchases'];
type ProductCategory = NonNullable<Parameters<PurchasesSdk['getProducts']>[0]['type']>;

/**
 * КРИТИЧНО: `type` обязателен (грабля, найденная на calk.kz/calk.uz).
 *
 * Нативный Android-плагин при отсутствии параметра подставляет подписку
 * (PurchasesPlugin.kt: `val type = call.getString("type") ?: "SUBSCRIPTION"`),
 * то есть спрашивает у Google Play подписку `removeads`, которой не существует —
 * «Убрать рекламу» это разовая покупка. Play возвращает пустой список → цена
 * null → покупка невозможна. На iOS параметр игнорируется, поэтому там всё
 * работает и без него — баг виден только на Android.
 *
 * Enum PRODUCT_CATEGORY лежит в транзитивной зависимости SDK, поэтому берём
 * литерал, а тип выводим из сигнатуры самого getProducts.
 */
const NON_SUBSCRIPTION = 'NON_SUBSCRIPTION' as ProductCategory;

/** Единая точка запроса продукта — и для цены, и для покупки (тип не разъедется). */
async function fetchRemoveAdsProduct(Purchases: PurchasesSdk) {
  const { products } = await Purchases.getProducts({
    productIdentifiers: [removeAdsProductId()],
    type: NON_SUBSCRIPTION,
  });
  return products[0] ?? null;
}

/** Локализованная цена продукта (напр. «199,00 сом»), или null если стор её не отдал. */
export async function getRemoveAdsPrice(): Promise<string | null> {
  if (!purchasesAvailable()) return null;
  try {
    const { Purchases } = await loadSdk();
    const product = await fetchRemoveAdsProduct(Purchases);
    return product?.priceString ?? null;
  } catch {
    return null;
  }
}

/**
 * Результат покупки. Голый boolean не годится: «пользователь передумал» и
 * «стор не отдал продукт» требуют разного разговора с пользователем.
 */
export type BuyResult = 'ok' | 'cancelled' | 'unavailable' | 'failed';

/** Купить «Убрать рекламу». */
export async function buyRemoveAds(): Promise<BuyResult> {
  if (!purchasesAvailable()) return 'unavailable';
  try {
    const { Purchases } = await loadSdk();
    const product = await fetchRemoveAdsProduct(Purchases);
    if (!product) return 'unavailable';
    const { customerInfo } = await Purchases.purchaseStoreProduct({ product });
    const ok = hasEntitlement(customerInfo);
    setAdFree(ok);
    return ok ? 'ok' : 'failed';
  } catch (e) {
    // Отмена пользователем — не ошибка.
    const cancelled = !!(e as { userCancelled?: boolean })?.userCancelled;
    return cancelled ? 'cancelled' : 'failed';
  }
}

/** Восстановить покупку — ОБЯЗАТЕЛЬНАЯ кнопка для Apple (Guideline 3.1.1). */
export async function restorePurchases(): Promise<boolean> {
  if (!purchasesAvailable()) return false;
  try {
    const { Purchases } = await loadSdk();
    const { customerInfo } = await Purchases.restorePurchases();
    const ok = hasEntitlement(customerInfo);
    setAdFree(ok);
    return ok;
  } catch {
    return false;
  }
}
