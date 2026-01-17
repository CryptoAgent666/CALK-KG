import React, { useState } from 'react';
import { Share2, Printer, Copy, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ActionButtonsProps {
  resultText: string;
  calculatorName: string;
  showPrint?: boolean;
}

const ActionButtons = ({ resultText, calculatorName, showPrint = true }: ActionButtonsProps) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState<'share' | 'result' | null>(null);

  const handleShare = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      setCopied('share');
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Ошибка копирования URL:', err);
    }
  };

  const handleCopyResult = async () => {
    try {
      await navigator.clipboard.writeText(resultText);
      setCopied('result');
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Ошибка копирования результата:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex items-center flex-wrap gap-3 print:hidden">
      {/* Share Button */}
      <button
        onClick={handleShare}
        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        title={t('share')}
      >
        {copied === 'share' ? (
          <>
            <Check className="h-4 w-4" />
            <span>{t('copied')}</span>
          </>
        ) : (
          <>
            <Share2 className="h-4 w-4" />
            <span>{t('share')}</span>
          </>
        )}
      </button>

      {/* Copy Result Button */}
      <button
        onClick={handleCopyResult}
        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        title={t('copy')}
      >
        {copied === 'result' ? (
          <>
            <Check className="h-4 w-4" />
            <span>{t('copied')}</span>
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            <span>{t('copy')}</span>
          </>
        )}
      </button>

      {/* Print Button */}
      {showPrint && (
        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          title={t('print')}
        >
          <Printer className="h-4 w-4" />
          <span>{t('print')}</span>
        </button>
      )}
    </div>
  );
};

export default ActionButtons;