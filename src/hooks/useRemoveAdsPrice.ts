import { useEffect, useState } from 'react';
import { getRemoveAdsPrice, purchasesAvailable, REMOVE_ADS_FALLBACK_PRICE } from '../lib/purchases';

export type RemoveAdsPrice =
  | { status: 'loading'; price: string }      // цена ещё едет — показываем запасную, тап разрешён
  | { status: 'ready'; price: string }        // живая цена из стора
  | { status: 'unavailable'; price: null };   // стор ничего не отдал — оффер показывать НЕЛЬЗЯ

/**
 * Цена «Убрать рекламу» для UI (порт с calk.kz).
 *
 * «Ещё грузится» и «стор ничего не отдал» — разные состояния: в первом
 * показываем запасную цену, во втором оффер прячем, иначе тап ведёт в тупик
 * («продукт ещё активируется»). Плашка над баннером и футер-ссылка держат
 * одно состояние вместо копипасты (кнопка в меню и тост — своё, старше хука).
 */
export function useRemoveAdsPrice(): RemoveAdsPrice {
  const [state, setState] = useState<RemoveAdsPrice>(() =>
    purchasesAvailable()
      ? { status: 'loading', price: REMOVE_ADS_FALLBACK_PRICE }
      : { status: 'unavailable', price: null }
  );

  useEffect(() => {
    if (!purchasesAvailable()) return;
    let alive = true;
    void getRemoveAdsPrice().then((price) => {
      if (!alive) return;
      setState(price ? { status: 'ready', price } : { status: 'unavailable', price: null });
    });
    return () => { alive = false; };
  }, []);

  return state;
}
