/**
 * Воронка IAP «Убрать рекламу» → self-hosted DATA_HUB. Порт с calk.kz.
 *
 * Fire-and-forget, БЕЗ секрета в клиенте: эндпоинт публичный по дизайну
 * (см. fleet-registry: allowlist приложений и типов, рейт-лимит по IP,
 * обрезка полей — всё на сервере). Успех покупки отдельно НЕ шлём — он
 * приходит RevenueCat-вебхуком, rollup сводит buy_rate = покупки ÷ показы.
 *
 * На вебе не вызывается: все точки вызова стоят за purchasesAvailable().
 */
const TELEMETRY_URL = 'https://mydatahub.duckdns.org/webhooks/app-telemetry';
const APP_ID = 'calk.kg';

export type IapFunnelEvent =
  | 'paywall_shown'
  | 'purchase_tapped'
  | 'purchase_cancelled'
  | 'purchase_failed'
  | 'purchase_unavailable';

/** Доп. поля события. Сервер принимает только allowlist (platform, code),
 *  каждое режется до 64 символов — длинное сообщение об ошибке ужимаем сами. */
export interface IapEventDetail {
  platform?: string;
  code?: string;
}

function uuid(): string {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  } catch { /* ignore */ }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/** Отправить один шаг воронки. Никогда не бросает и не блокирует UI покупки.
 *  Без platform и code причину провала не установить (урок calk.kz 16.08.2026:
 *  5/5 тапов ушли в purchase_failed, а гадать пришлось между старым OTA,
 *  устройством без Play-сервисов и несконфигуренным SDK). */
export function emitIap(type: IapFunnelEvent, detail?: IapEventDetail): void {
  try {
    void fetch(TELEMETRY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: {
        id: uuid(), type, app: APP_ID, ts: Date.now(),
        ...(detail?.platform ? { platform: detail.platform } : {}),
        ...(detail?.code ? { code: String(detail.code).slice(0, 64) } : {}),
      } }),
      keepalive: true,
    }).catch(() => { /* никогда не мешать UI покупки */ });
  } catch {
    /* ignore */
  }
}
