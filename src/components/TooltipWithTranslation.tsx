import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface TooltipProps {
  children: React.ReactNode;
  textKey: string;
}

const TooltipWithTranslation = ({ children, textKey }: TooltipProps) => {
  const { t, language } = useLanguage();

  const tooltipKey = language === 'ky' ? `${textKey}_ky` : textKey;
  const text = t(tooltipKey as any);

  return (
    <div className="group relative inline-flex items-center">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 max-w-xs">
        {text}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );
};

export default TooltipWithTranslation;
