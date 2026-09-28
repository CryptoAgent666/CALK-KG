import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import CalculatorCard from './CalculatorCard';
import CategoryFilter from './CategoryFilter';
import { Calculator } from '../types/calculator';
import { calculatorRoutes } from '../data/calculatorRoutes';

interface CalculatorGridProps {
  calculators: Calculator[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}


const CalculatorGrid = ({ calculators, selectedCategory, setSelectedCategory }: CalculatorGridProps) => {
  const { t, getLocalizedPath } = useLanguage();

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {t('calculator_grid_title')}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('calculator_grid_description')}
        </p>
      </div>

      <CategoryFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {calculators.map((calculator) => {
          const route = calculatorRoutes[calculator.id];
          const href = route ? getLocalizedPath(route) : undefined;
          return (
            <CalculatorCard
              key={calculator.id}
              calculator={calculator}
              href={href}
            />
          );
        })}
      </div>

      {calculators.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">
            {t('no_calculators_found') || 'Калькуляторы не найдены'}
          </p>
        </div>
      )}
      </section>
    </>
  );
};

export default CalculatorGrid;
