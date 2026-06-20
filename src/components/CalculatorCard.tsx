import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Calculator } from '../types/calculator';

interface CalculatorCardProps {
  calculator: Calculator;
  /** Optional href: when provided, card renders as a real <a> (Link) for SEO and accessibility */
  href?: string;
  /** Fallback onClick for legacy usages without href */
  onClick?: () => void;
}

const CalculatorCard = ({ calculator, href, onClick }: CalculatorCardProps) => {
  const { t, language } = useLanguage();

  const IconComponent = calculator.icon;

  const title = language === 'ky' ? calculator.titleKy : calculator.title;
  const description = language === 'ky' ? calculator.descriptionKy : calculator.description;
  const categoryName = language === 'ky' ? calculator.categoryNameKy : calculator.categoryName;

  const cardClass = "bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-red-200 transition-all duration-300 group cursor-pointer block no-underline";

  const inner = (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className={`p-3 rounded-lg ${calculator.bgColor}`}>
          <IconComponent className={`h-6 w-6 ${calculator.iconColor}`} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
            {title}
          </h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {categoryName}
          </span>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
        {description}
      </p>

      <div className="flex items-center justify-end">
        <div className="flex items-center text-red-600 text-sm font-medium group-hover:text-red-700 transition-colors">
          {t('calculator_open')}
          <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );

  // Render as proper <a> via Link when href is provided (SEO + accessibility win:
  // crawlable internal link, right-click → open in new tab, screen readers announce
  // it as a link). Falls back to onClick div for legacy callers.
  if (href) {
    return (
      <Link to={href} className={cardClass} aria-label={title}>
        {inner}
      </Link>
    );
  }

  return (
    <div className={cardClass} onClick={onClick} role="button" tabIndex={0}>
      {inner}
    </div>
  );
};

export default CalculatorCard;