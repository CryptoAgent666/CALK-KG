import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  isAdFree,
  onAdFreeChange,
  purchasesAvailable,
  buyRemoveAds,
  restorePurchases,
} from '../lib/purchases';
import { useRemoveAdsPrice } from '../hooks/useRemoveAdsPrice';

/**
 * Постоянная точка входа «Убрать рекламу» в футере — ТОЛЬКО в нативном
 * приложении (на сайте и в старых бинарях — null). Флотовый паттерн (calk.uz,
 * US/AU): плашка над баннером закрываемая, тост — эпизодный, кнопка в меню
 * требует открыть меню; футер же доступен всегда и держит Restore в постоянной
 * досягаемости (Apple Guideline 3.1.1). Исчезает после покупки.
 */
export function RemoveAdsFooterLink() {
  const { t } = useLanguage();
  const [applies, setApplies] = useState(false);
  const price = useRemoveAdsPrice();
  const [busy, setBusy] = useState<'buy' | 'restore' | null>(null);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    const compute = () => setApplies(purchasesAvailable() && !isAdFree());
    compute();
    return onAdFreeChange(compute);
  }, []);

  // Как и в остальных поверхностях: мёртвой кнопки с ценой быть не должно.
  if (!applies || price.status === 'unavailable') return null;

  const buy = async () => {
    if (busy) return;
    setBusy('buy');
    setNote(null);
    const r = await buyRemoveAds();
    setBusy(null);
    if (r === 'failed' || r === 'unavailable') setNote(t('removeads_footer_failed'));
    // 'ok' → onAdFreeChange скрывает весь блок; 'cancelled' → молчим
  };

  const restore = async () => {
    if (busy) return;
    setBusy('restore');
    setNote(null);
    const ok = await restorePurchases();
    setBusy(null);
    setNote(ok ? t('removeads_footer_done') : t('removeads_footer_failed'));
  };

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <button
        type="button"
        onClick={buy}
        disabled={busy !== null}
        className="text-left text-gray-400 transition-colors hover:text-white disabled:opacity-60"
      >
        {busy === 'buy' ? t('removeads_processing') : `${t('removeads_remove')} — ${price.price}`}
      </button>
      <button
        type="button"
        onClick={restore}
        disabled={busy !== null}
        className="text-xs text-gray-500 transition-colors hover:text-white disabled:opacity-60"
      >
        {busy === 'restore' ? t('removeads_restoring') : t('removeads_restore')}
      </button>
      {note && <span className="text-xs text-gray-400">{note}</span>}
    </div>
  );
}
