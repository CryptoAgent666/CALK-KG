import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface RelatedCalculator {
  path: string;
  titleKey: string;
  icon: string;
}

interface RelatedCalculatorsProps {
  calculators: RelatedCalculator[];
}

export const RelatedCalculators: React.FC<RelatedCalculatorsProps> = ({ calculators }) => {
  const { t, getLocalizedPath } = useLanguage();

  return (
    <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Calculator className="w-6 h-6 text-blue-600" />
        {t('related_calculators_title')}
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {calculators.map((calc) => (
          <Link
            key={calc.path}
            to={getLocalizedPath(calc.path)}
            className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <span className="text-2xl">{calc.icon}</span>
            <span className="font-medium text-gray-800">{t(calc.titleKey)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
