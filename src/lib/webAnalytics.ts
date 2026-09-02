// Google Analytics 4 — WEB ONLY, зеркало схемы webAds.ts.
//
// ⚠️ Почему не сниппетом в index.html: этот файл собирается и в нативные
// сборки (build:app использует тот же index.html), а GA внутри приложения
// означает трекинг без ATT-промпта — реджект 5.1.2, класс calk.nz. Здесь же
// стоит статическое сравнение import.meta.env.VITE_CALK_PLATFORM, поэтому в
// app-бандле terser выкидывает и код, и сам домен googletagmanager.com.
//
// Согласие: на сайте опубликован CMP AdSense «calk.kg — GDPR (EEA/UK/CH)»,
// он же управляет Consent Mode. До ответа пользователя из EEA/UK/CH аналитика
// и рекламные сигналы стоят denied — CMP поднимет их сам после согласия. Вне
// этих стран согласие на аналитику не требуется, поэтому там granted сразу:
// глобальный denied обнулил бы статистику по основной, киргизской аудитории.
const GA_ID = 'G-G8TN6EWCXH';

// Страны, где действует GDPR/UK GDPR/швейцарский FADP — по ним CMP и настроен.
const CONSENT_REGIONS = [
  'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT',
  'LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE',
  'IS','LI','NO', 'GB', 'CH',
];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function initWebAnalytics(): void {
  if (import.meta.env.VITE_CALK_PLATFORM === 'app') return;

  // Легаси-WebView старых сборок приложения: там UA помечен CalkKG/N.
  const ua = navigator.userAgent || '';
  const m = ua.match(/CalkKG(?:-App)?\/(\d+)/);
  if (m && parseInt(m[1], 10) >= 2) return;

  window.dataLayer = window.dataLayer || [];
  // Официальный сниппет пушит именно объект `arguments` (array-like), а не
  // массив — сохраняем это дословно, чтобы не зависеть от того, как gtag.js
  // разбирает очередь. Отсюда обычная function, а не стрелка.
  function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  }

  // Кладём в window: официальный сниппет объявляет gtag глобально, и на этот
  // контракт рассчитывает всё, что позже захочет слать события
  // (gtag('event', …)). Без него аналитика работала бы только на просмотры.
  const g = gtag as unknown as (...args: unknown[]) => void;
  window.gtag = g;

  // Consent Mode до загрузки библиотеки — иначе первые хиты уйдут без учёта согласия.
  g('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    region: CONSENT_REGIONS,
  });
  g('consent', 'default', {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted',
  });

  g('js', new Date());
  g('config', GA_ID);

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}
