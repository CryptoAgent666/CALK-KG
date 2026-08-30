import React, { useEffect, useState } from 'react';
import { Calculator, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const DISMISS_KEY = 'calk-app-banner-v1';
const COOKIE_CONSENT_KEY = 'calk-cookie-consent-v1'; // тот же ключ, что в CookieConsentBanner

const STORE_LINKS = {
  ios: 'https://apps.apple.com/app/id6771220038',
  android: 'https://play.google.com/store/apps/details?id=kg.calk.app',
} as const;

type MobileOS = 'ios' | 'android' | null;

/**
 * Определяем ТОЛЬКО телефон/планшет. Desktop не трогаем — там ставить нечего.
 * iPadOS 13+ представляется Macintosh, отличаем по наличию мультитача.
 */
function detectMobileOS(): MobileOS {
  if (typeof navigator === 'undefined') return null;
  const ua = navigator.userAgent || '';

  if (/android/i.test(ua)) return 'android';
  if (/iPhone|iPod/i.test(ua)) return 'ios';
  if (/iPad/i.test(ua)) return 'ios';
  if (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return 'ios'; // iPadOS 13+
  return null;
}

/**
 * Предложение установить приложение — показывается посетителям с телефона и
 * ведёт в «свой» магазин: iOS → App Store, Android → Google Play.
 *
 * ⚠️ Это ПЛАШКА снизу, а не полноэкранное модальное окно. Google с 2017 года
 * понижает мобильные страницы за intrusive interstitial — всплывающее окно,
 * перекрывающее контент сразу после перехода из поиска. Баннер, который не
 * закрывает текст и закрывается одним тапом, под санкцию не подпадает.
 * Полноэкранный вариант стоил бы позиций в мобильной выдаче — а это основной
 * источник трафика сайта.
 *
 * ⚠️ Класс google-anno-skip обязателен: AdSense Auto ads (аннотации) линкуют
 * слова прямо внутри нашего интерфейса — на проде подпись «35 калькуляторов»
 * превратилась в рекламную ссылку <a class="google-anno">. Это документированный
 * опт-аут Google; тот же класс стоит на баннере cookie.
 *
 * ⚠️ В нативные сборки не попадает: на месте использования стоит статический
 * гейт по VITE_CALK_PLATFORM (идиома бейджей сторов в Footer). Без него ссылка
 * на Google Play уехала бы в iOS-бинарь — реджект 2.3.10, класс CRYPTOCALK.
 */
const AppInstallBanner = () => {
  const { language } = useLanguage();
  const [os, setOs] = useState<MobileOS>(null);

  useEffect(() => {
    if (import.meta.env.VITE_CALK_PLATFORM === 'app') return;

    const detected = detectMobileOS();
    if (!detected) return;

    try {
      if (window.localStorage.getItem(DISMISS_KEY)) return;
      // Пока висит баннер про cookie, вторую плашку снизу не показываем:
      // два блока друг на друге съедают экран телефона, а согласие важнее.
      if (!window.localStorage.getItem(COOKIE_CONSENT_KEY)) return;
    } catch {
      // Storage недоступен (инкогнито/квота) — не навязываемся, показ пропускаем:
      // без памяти о закрытии баннер возвращался бы на каждой странице.
      return;
    }

    setOs(detected);
  }, []);

  const dismiss = () => {
    try {
      window.localStorage.setItem(DISMISS_KEY, 'dismissed');
    } catch {
      /* не критично — плашка скроется хотя бы на эту сессию */
    }
    setOs(null);
  };

  if (!os) return null;

  // Текст одинаков для обеих платформ — различается только магазин в ссылке
  // (STORE_LINKS[os]), поэтому подпись про «iPhone/Android» не дублируем.
  const content = language === 'ky'
    ? { title: 'Calk.kg тиркемеси', subtitle: '35 калькулятор', cta: 'Орнотуу', close: 'Жабуу' }
    : { title: 'Приложение Calk.kg', subtitle: '35 калькуляторов', cta: 'Установить', close: 'Закрыть' };

  return (
    <div className="google-anno-skip fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur sm:hidden">
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        {/* Логотип рисуем иконкой, как в шапке и футере: файл
            public/apple-touch-icon.png — это SVG с расширением .png, в <img> он
            отдаётся как битая картинка. */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-red-600">
          <Calculator className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold leading-tight text-gray-900">{content.title}</p>
          <p className="text-xs leading-tight text-gray-600">{content.subtitle}</p>
        </div>
        <a
          href={STORE_LINKS[os]}
          target="_blank"
          rel="noopener noreferrer"
          onClick={dismiss}
          className="inline-flex min-h-[44px] shrink-0 items-center rounded-lg bg-red-600 px-3.5 text-sm font-medium text-white hover:bg-red-700"
        >
          {content.cta}
        </a>
        <button
          type="button"
          onClick={dismiss}
          aria-label={content.close}
          className="-mr-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default AppInstallBanner;
