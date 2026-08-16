import React, { useEffect, useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SUGGEST_REMOVE_ADS_EVENT } from '../lib/admob';
import {
  isAdFree,
  onAdFreeChange,
  buyRemoveAds,
  purchasesAvailable,
  getRemoveAdsPrice,
} from '../lib/purchases';

const AUTO_HIDE_MS = 6000;

/**
 * Тост «Надоела реклама? Убрать за …» сверху экрана. Порт с calk.kz.
 * Появляется по событию из admob.ts — после каждого 3-го интерстишела, в момент,
 * когда реклама только что помешала (там конверсия лучшая), автоскрытие 6 с.
 * Рендерится только в приложении с модулем покупок, пока реклама не куплена
 * и стор отдаёт цену (без цены оффер — тупик, см. RemoveAdsButton).
 */
export function RemoveAdsToast() {
  const { t } = useLanguage();
  const [adFree, setAdFree] = useState(isAdFree());
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [price, setPrice] = useState<string | null>(null);

  useEffect(() => onAdFreeChange(setAdFree), []);

  useEffect(() => {
    if (!purchasesAvailable()) return;
    let alive = true;
    void getRemoveAdsPrice().then((p) => { if (alive) setPrice(p); });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!purchasesAvailable()) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onSuggest = () => {
      if (isAdFree()) return;
      setVisible(true);
      clearTimeout(timer);
      timer = setTimeout(() => setVisible(false), AUTO_HIDE_MS);
    };
    window.addEventListener(SUGGEST_REMOVE_ADS_EVENT, onSuggest);
    return () => {
      window.removeEventListener(SUGGEST_REMOVE_ADS_EVENT, onSuggest);
      clearTimeout(timer);
    };
  }, []);

  // price === null покрывает и «ещё грузится», и «стор не отдал» — тост не место
  // для запасной цены: он живёт 6 секунд и обязан вести в рабочую покупку.
  if (!purchasesAvailable() || adFree || !visible || price === null) return null;

  const buy = async () => {
    setBusy(true);
    try {
      const result = await buyRemoveAds();
      // Успех или «покупать нечего» — закрыть (тост с мёртвой кнопкой висеть
      // не должен). Отмену пользователя оставляем на экране.
      if (result === 'ok' || result === 'unavailable') setVisible(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed left-1/2 z-[60] w-[92%] max-w-sm -translate-x-1/2 rounded-xl bg-gray-900 px-4 py-3 text-white shadow-2xl"
      style={{ top: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}
      role="alert"
    >
      <div className="flex items-center gap-3">
        <Sparkles className="h-5 w-5 flex-shrink-0 text-amber-400" />
        <div className="flex-1 text-sm">
          <div className="font-semibold">{t('removeads_tired')}</div>
          <button onClick={buy} disabled={busy} className="text-blue-300 underline disabled:opacity-70">
            {busy ? t('removeads_processing') : `${t('removeads_remove_for')} ${price}`}
          </button>
        </div>
        <button onClick={() => setVisible(false)} aria-label={t('close_menu')} className="p-1 opacity-70 hover:opacity-100">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
