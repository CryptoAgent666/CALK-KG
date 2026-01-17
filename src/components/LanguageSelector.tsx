import React, { useState } from 'react';
import { Languages, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../i18n/translations';

const LanguageSelector = () => {
  const { language, switchLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'ru' as Language, name: 'Русский', flag: '🇷🇺' },
    { code: 'ky' as Language, name: 'Кыргызча', flag: '🇰🇬' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageSelect = (langCode: Language) => {
    switchLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-50"
      >
        <Languages className="h-4 w-4" />
        <span className="text-sm font-medium">{currentLanguage?.flag} {currentLanguage?.name}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center space-x-3 ${
                    language === lang.code ? 'bg-red-50 text-red-600' : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.name}</span>
                  {language === lang.code && (
                    <span className="ml-auto text-red-600">&#10003;</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
