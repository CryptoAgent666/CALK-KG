import React, { useEffect, useState } from 'react';
import { Sparkles, PlayCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  isAdFree,
  onAdFreeChange,
  buyRemoveAds,
  restorePurchases,
  purchasesAvailable,
  getRemoveAdsPrice,
  REMOVE_ADS_FALLBACK_PRICE,
} from '../lib/purchases';
import {
  rewardedAvailable,
  watchAdForTempAdFree,
  tempAdFreeActive,
  tempAdFreeUntil,
  TEMP_AD_FREE_HOURS,
} from '../lib/admob';

/**
 * Блок «Убрать рекламу навсегда» + «Восстановить покупку».
 * Подключён в Header → мобильное slide-out меню.
 * Рендерится ТОЛЬКО в нативном приложении с модулем покупок (на сайте и в старых
 * бинарях — null). Скрывается в компакт-вид, когда реклама уже отключена.
 * Кнопка восстановления обязательна для Apple (Guideline 3.1.1).
 * Портировано с calk.kz (схема RevenueCat: entitlement ad_free ↔ product removeads).
 */
export function RemoveAdsButton() {
  const { t } = useLanguage();
  const [adFree, setAdFree] = useState(isAdFree());
  const [busy, setBusy] = useState<'buy' | 'restore' | 'watch' | null>(null);
  // tick — перечитать tempAdFreeActive() после награды/истечения при рендере.
  const [, setTick] = useState(0);
  const [watchFailed, setWatchFailed] = useState(false);
  // Цена: 'loading' — показываем запасную, тап разрешён; null после загрузки —
  // стор ничего не отдал, оффер прячем (иначе тап ведёт в тупик).
  const [price, setPrice] = useState<string | null>(REMOVE_ADS_FALLBACK_PRICE);

  useEffect(() => onAdFreeChange(setAdFree), []);
  useEffect(() => {
    if (!purchasesAvailable()) return;
    let alive = true;
    void getRemoveAdsPrice().then((p) => { if (alive) setPrice(p); });
    return () => { alive = false; };
  }, []);

  // Только в приложении С нативным модулем покупок.
  if (!purchasesAvailable()) return null;

  if (adFree) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm font-medium text-green-700">
        {t('removeads_disabled')}
      </div>
    );
  }

  const buy = async () => {
    setBusy('buy');
    try { await buyRemoveAds(); } finally { setBusy(null); }
  };
  const restore = async () => {
    setBusy('restore');
    try { await restorePurchases(); } finally { setBusy(null); }
  };
  const watch = async () => {
    setBusy('watch');
    setWatchFailed(false);
    try {
      const result = await watchAdForTempAdFree();
      if (result === 'failed' || result === 'unavailable') setWatchFailed(true);
    } finally {
      setBusy(null);
      setTick((n) => n + 1); // перечитать tempAdFreeActive()
    }
  };

  const tempActive = tempAdFreeActive();
  const tempUntilLabel = tempActive
    ? new Date(tempAdFreeUntil()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
      {price !== null && (
        <>
          <p className="mb-3 text-center text-sm font-semibold leading-snug text-blue-900">
            {t('removeads_pitch')}
          </p>
          <button
            onClick={buy}
            disabled={busy !== null}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
          >
            <Sparkles className="h-4 w-4" />
            {busy === 'buy' ? t('removeads_processing') : `${t('removeads_forever')} — ${price}`}
          </button>
          <p className="mt-2 text-center text-xs text-gray-500">{t('removeads_one_time')}</p>
          {/* Бесплатная альтернатива: ролик = TEMP_AD_FREE_HOURS часов без рекламы.
              Даёт распробовать тишину и подводит к покупке навсегда. Пока идёт
              выданный период — вместо кнопки показываем «до какого часа». */}
          {rewardedAvailable() && (tempActive ? (
            <p className="mt-2 text-center text-xs font-medium text-green-700">
              {t('removeads_temp_until').replace('{time}', tempUntilLabel)}
            </p>
          ) : (
            <button
              onClick={watch}
              disabled={busy !== null}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-blue-300 bg-white px-4 py-2.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50 disabled:opacity-60"
            >
              <PlayCircle className="h-4 w-4" />
              {busy === 'watch'
                ? t('removeads_watch_loading')
                : t('removeads_watch').replace('{h}', String(TEMP_AD_FREE_HOURS))}
            </button>
          ))}
          {watchFailed && (
            <p className="mt-1 text-center text-xs text-red-600">{t('removeads_watch_failed')}</p>
          )}
        </>
      )}
      {/* Стор не отдал продукт. Без этой строки остаётся рамка с одинокой кнопкой
          «Восстановить покупку» — предложение восстановить то, что даже не
          предлагали купить. Саму кнопку убирать нельзя: Apple 3.1.1. */}
      {price === null && (
        <p className="text-center text-xs text-gray-500">{t('removeads_unavailable')}</p>
      )}
      <button
        onClick={restore}
        disabled={busy !== null}
        className="mt-2 w-full text-center text-xs text-blue-700 underline disabled:opacity-60"
      >
        {busy === 'restore' ? t('removeads_restoring') : t('removeads_restore')}
      </button>
    </div>
  );
}
