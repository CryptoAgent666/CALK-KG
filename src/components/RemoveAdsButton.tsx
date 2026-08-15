import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
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
  const [busy, setBusy] = useState<'buy' | 'restore' | null>(null);
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
        </>
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
