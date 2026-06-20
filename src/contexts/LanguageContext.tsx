import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { translations, loadKyTranslations, isKyLoaded, Language, TranslationKey } from '../i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  getLocalizedPath: (path: string) => string;
  getPathWithoutLangPrefix: (path: string) => string;
  switchLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

const KY_PREFIX = '/ky';

export const getLanguageFromPath = (pathname: string): Language => {
  return pathname.startsWith(KY_PREFIX) ? 'ky' : 'ru';
};

export const removeLanguagePrefix = (pathname: string): string => {
  if (pathname.startsWith(KY_PREFIX)) {
    const pathWithoutPrefix = pathname.slice(KY_PREFIX.length);
    return pathWithoutPrefix || '/';
  }
  return pathname;
};

export const addLanguagePrefix = (pathname: string, lang: Language): string => {
  const cleanPath = removeLanguagePrefix(pathname);
  if (lang === 'ky') {
    return cleanPath === '/' ? KY_PREFIX : `${KY_PREFIX}${cleanPath}`;
  }
  return cleanPath;
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [language, setLanguageState] = useState<Language>(() => {
    return getLanguageFromPath(window.location.pathname);
  });
  const [kyReady, setKyReady] = useState(isKyLoaded());

  useEffect(() => {
    const langFromPath = getLanguageFromPath(location.pathname);
    if (langFromPath !== language) {
      setLanguageState(langFromPath);
    }
  }, [location.pathname]);

  // Lazy-load Kyrgyz translations when needed
  useEffect(() => {
    if (language === 'ky' && !kyReady) {
      loadKyTranslations().then(() => setKyReady(true));
    }
  }, [language, kyReady]);

  useEffect(() => {
    const titles = {
      ru: 'Calk.KG - Лучшие онлайн калькуляторы для Кыргызстана | Бесплатные расчеты 2026',
      ky: 'Calk.KG - Кыргызстан үчүн эң мыкты онлайн калькуляторлор | Акысыз эсептөөлөр 2026'
    };

    const basePath = removeLanguagePrefix(location.pathname);
    if (basePath === '/' || basePath === '') {
      document.title = titles[language];
    }

    const descriptions = {
      ru: 'Более 25 бесплатных калькуляторов для жителей Кыргызстана: зарплата, кредиты, ипотека, налоги, коммунальные услуги. Точные расчеты по законам КР. Используют 50,000+ человек!',
      ky: 'Кыргызстандын тургундары үчүн 25тен ашык акысыз калькуляторлор: маяна, кредиттер, ипотека, салыктар, коммуналдык кызматтар. КР мыйзамдары боюнча так эсептөөлөр. 50,000+ адам колдонот!'
    };

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && (basePath === '/' || basePath === '')) {
      metaDescription.setAttribute('content', descriptions[language]);
    }

    document.documentElement.lang = language;
  }, [language, location.pathname]);

  const setLanguage = useCallback((lang: Language) => {
    if (lang !== language) {
      setLanguageState(lang);
      try {
        localStorage.setItem('calk-language', lang);
      } catch {
        // Storage unavailable (private mode / quota) — language still updates in memory
      }
    }
  }, [language]);

  const switchLanguage = useCallback((lang: Language) => {
    if (lang !== language) {
      const newPath = addLanguagePrefix(location.pathname, lang);
      const searchParams = location.search;
      navigate(newPath + searchParams, { replace: true });
    }
  }, [language, location.pathname, location.search, navigate]);

  const getLocalizedPath = useCallback((path: string): string => {
    return addLanguagePrefix(path, language);
  }, [language]);

  const getPathWithoutLangPrefix = useCallback((path: string): string => {
    return removeLanguagePrefix(path);
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    const value = translations[language][key] ?? translations.ru[key];
    if (!value && import.meta.env.DEV) {
      console.warn(`[i18n] Missing translation key: ${key}`);
    }
    return value || key;
  }, [language, kyReady]);

  const contextValue = useMemo(() => ({
    language,
    setLanguage,
    t,
    getLocalizedPath,
    getPathWithoutLangPrefix,
    switchLanguage
  }), [language, setLanguage, t, getLocalizedPath, getPathWithoutLangPrefix, switchLanguage]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
