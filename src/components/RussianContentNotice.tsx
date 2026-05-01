import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Компонент-обёртка для временного отображения русского контента
 * в кыргызской версии с уведомлением
 */
export const RussianContentNotice: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  
  return (
    <>
      {language === 'ky' && (
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p className="text-sm text-blue-900">
            📝 <strong>Эскертүү:</strong> Бул макала орус тилинде жазылган. 
            Кыргызча котормосу жакында кошулат.
          </p>
          <p className="text-xs text-blue-700 mt-1">
            <em>Примечание: Эта статья на русском языке. Перевод на кыргызский будет добавлен в ближайшее время.</em>
          </p>
        </div>
      )}
      {children}
    </>
  );
};
