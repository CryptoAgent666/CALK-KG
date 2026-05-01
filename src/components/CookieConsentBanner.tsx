import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const CONSENT_KEY = 'calk-cookie-consent-v1';

const CookieConsentBanner = () => {
  const { language, getLocalizedPath } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(CONSENT_KEY);
    if (!saved) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    window.localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  const content = language === 'ky'
    ? {
        title: 'Биз cookie файлдарын колдонобуз',
        description: 'Сайттын иштешин жакшыртуу, аналитика жана жарнама үчүн cookie колдонулат. Улантуу менен сиз cookie колдонууга макул болосуз.',
        more: 'Толугураак',
        accept: 'Макулмун'
      }
    : {
        title: 'Мы используем cookie',
        description: 'Cookie нужны для корректной работы сайта, аналитики и показа рекламы. Продолжая использовать сайт, вы соглашаетесь с использованием cookie.',
        more: 'Подробнее',
        accept: 'Принять'
      };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="text-sm text-gray-700">
          <p className="font-semibold text-gray-900">{content.title}</p>
          <p>
            {content.description}{' '}
            <Link to={getLocalizedPath('/privacy-policy')} className="text-red-600 hover:text-red-700 underline">
              {content.more}
            </Link>
          </p>
        </div>
        <button
          type="button"
          onClick={acceptCookies}
          className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          {content.accept}
        </button>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
