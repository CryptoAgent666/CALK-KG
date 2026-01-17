import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import CalculatorCard from './CalculatorCard';
import CategoryFilter from './CategoryFilter';
import { Calculator } from '../types/calculator';

interface CalculatorGridProps {
  calculators: Calculator[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const calculatorRoutes: Record<string, string> = {
  'currency-exchange': '/calculator/currency-exchange',
  'money-transfer': '/calculator/money-transfer',
  'salary-calculator': '/calculator/salary',
  'single-tax-calculator': '/calculator/single-tax',
  'property-tax-calculator': '/calculator/property-tax',
  'social-fund-calculator': '/calculator/social-fund',
  'pension-calculator': '/calculator/pension',
  'loan-calculator': '/calculator/loan',
  'mortgage-calculator': '/calculator/mortgage',
  'auto-loan-calculator': '/calculator/auto-loan',
  'deposit-calculator': '/calculator/deposit',
  'customs-calculator': '/calculator/customs',
  'electricity-calculator': '/calculator/electricity',
  'water-calculator': '/calculator/water',
  'heating-calculator': '/calculator/heating',
  'gas-calculator': '/calculator/gas',
  'alimony-calculator': '/calculator/alimony',
  'family-benefit-calculator': '/calculator/family-benefit',
  'patent-calculator': '/calculator/patent',
  'traffic-fines-calculator': '/calculator/traffic-fines',
  'zakat-calculator': '/calculator/zakat',
  'taxi-tax-calculator': '/calculator/taxi-tax',
  'passport-calculator': '/calculator/passport',
  'tourist-fee-calculator': '/calculator/tourist-fee',
  'calorie-calculator': '/calculator/calorie',
  'sewing-cost-calculator': '/calculator/sewing-cost',
  'housing-calculator': '/calculator/housing',
  'wedding-calculator': '/calculator/wedding',
};

const CalculatorGrid = ({ calculators, selectedCategory, setSelectedCategory }: CalculatorGridProps) => {
  const { t, getLocalizedPath } = useLanguage();
  const navigate = useNavigate();

  const handleCalculatorClick = (calculatorId: string) => {
    const route = calculatorRoutes[calculatorId];
    if (route) {
      navigate(getLocalizedPath(route));
    }
  };

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
        {calculators.map((calculator) => (
          <CalculatorCard
            key={calculator.id}
            calculator={calculator}
            onClick={() => handleCalculatorClick(calculator.id)}
          />
        ))}
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
