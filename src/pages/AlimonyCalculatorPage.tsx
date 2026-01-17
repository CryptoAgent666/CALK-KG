import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Info, Home, Printer, Users, Heart, Scale, AlertTriangle, MapPin, CreditCard, TrendingUp } from 'lucide-react';
import ActionButtons from '../components/ActionButtons';
import SchemaMarkup from '../components/SchemaMarkup';
import HreflangTags from '../components/HreflangTags';
import { useLanguage } from '../contexts/LanguageContext';
import {
  generateCalculatorSchema,
  generateBreadcrumbSchema,
  generateSoftwareApplicationSchema
} from '../utils/schemaGenerator';
import { formatCurrentMonth } from '../utils/dateFormatter';

// Конфигурация средних зарплат по регионам КР
const REGIONAL_AVERAGE_SALARY = {
  'bishkek': { nameKey: 'city_bishkek', salary: 32500 },
  'osh': { nameKey: 'city_osh', salary: 25800 },
  'osh-region': { nameKey: 'region_osh', salary: 24200 },
  'jalal-abad': { nameKey: 'city_jalal_abad', salary: 26100 },
  'jalal-abad-region': { nameKey: 'region_jalal_abad', salary: 23800 },
  'issyk-kul': { nameKey: 'region_issyk_kul', salary: 27300 },
  'naryn': { nameKey: 'region_naryn', salary: 24800 },
  'talas': { nameKey: 'region_talas', salary: 25200 },
  'chui': { nameKey: 'region_chui', salary: 28900 },
  'batken': { nameKey: 'region_batken', salary: 23100 }
};

// Процентные ставки алиментов по законодательству КР
const ALIMONY_RATES = {
  1: { rate: 0.25, descriptionKey: 'alimony_one_child' },
  2: { rate: 0.33, descriptionKey: 'alimony_two_children' },
  3: { rate: 0.50, descriptionKey: 'alimony_three_plus_children' }
};

type CalculationMethod = 'known-income' | 'regional-average';
type Region = keyof typeof REGIONAL_AVERAGE_SALARY;

interface AlimonyResults {
  baseAmount: number;
  childrenCount: number;
  appliedRate: number;
  alimonyAmount: number;
  calculationMethod: string;
  regionName?: string;
}

const AlimonyCalculatorPage = () => {
  const { language, t, getLocalizedPath } = useLanguage();

  React.useEffect(() => {
    document.title = t('alimony_calc_title') + " - Calk.KG";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('alimony_calc_description'));
    }
  }, [t]);

  // Генерация схем для страницы калькулятора алиментов
  const generateSchemas = () => {
    const currentUrl = language === 'ky' ? "https://calk.kg/ky/calculator/alimony" : "https://calk.kg/calculator/alimony";
    const homeUrl = language === 'ky' ? "https://calk.kg/ky" : "https://calk.kg";
    
    const calculatorSchema = generateCalculatorSchema({
      url: currentUrl,
      title: t('alimony_calc_title'),
      description: t('alimony_calc_subtitle'),
      calculatorName: t('alimony_calc_title'),
      category: t('nav_other'),
      language,
      inputProperties: ["childrenCount", "income", "calculationMethod"],
      outputProperties: ["alimonyAmount", "appliedRate"]
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: homeUrl },
      { name: t('nav_other'), url: `${homeUrl}?category=other` },
      { name: t('alimony_calc_title'), url: currentUrl }
    ]);

    return [calculatorSchema, breadcrumbSchema];
  };

  const [calculationMethod, setCalculationMethod] = useState<CalculationMethod>('known-income');
  const [childrenCount, setChildrenCount] = useState<number>(1);
  const [knownIncome, setKnownIncome] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<Region>('bishkek');
  
  const [results, setResults] = useState<AlimonyResults>({
    baseAmount: 0,
    childrenCount: 1,
    appliedRate: 0.25,
    alimonyAmount: 0,
    calculationMethod: t('alimony_method_known')
  });

  // Расчет алиментов
  const calculateAlimony = (
    method: CalculationMethod,
    children: number,
    income: number,
    region: Region
  ): AlimonyResults => {
    if (children < 1 || children > 10) {
      return {
        baseAmount: 0,
        childrenCount: children,
        appliedRate: 0,
        alimonyAmount: 0,
        calculationMethod: method === 'known-income' ? t('alimony_method_known') : t('alimony_method_regional')
      };
    }

    // Определение ставки алиментов
    const rateKey = children > 3 ? 3 : children;
    const rateInfo = ALIMONY_RATES[rateKey as keyof typeof ALIMONY_RATES];
    
    // Определение базы для расчета
    let baseAmount = 0;
    let regionName = '';
    let methodDescription = '';

    if (method === 'known-income') {
      baseAmount = income;
      methodDescription = t('alimony_method_known');
    } else {
      const regionData = REGIONAL_AVERAGE_SALARY[region];
      baseAmount = regionData.salary;
      regionName = t(regionData.nameKey);
      methodDescription = `${t('alimony_method_regional')} (${regionName})`;
    }

    // Расчет алиментов
    const alimonyAmount = baseAmount * rateInfo.rate;

    return {
      baseAmount,
      childrenCount: children,
      appliedRate: rateInfo.rate,
      alimonyAmount,
      calculationMethod: methodDescription,
      regionName
    };
  };

  // Обновление результатов
  useEffect(() => {
    const income = calculationMethod === 'known-income' ? (parseFloat(knownIncome) || 0) : 0;
    
    if (calculationMethod === 'known-income' && income <= 0) {
      setResults({
        baseAmount: 0,
        childrenCount,
        appliedRate: ALIMONY_RATES[childrenCount > 3 ? 3 : childrenCount as keyof typeof ALIMONY_RATES].rate,
        alimonyAmount: 0,
        calculationMethod: t('alimony_method_known')
      });
      return;
    }

    setResults(calculateAlimony(calculationMethod, childrenCount, income, selectedRegion));
  }, [calculationMethod, childrenCount, knownIncome, selectedRegion]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-KG', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setKnownIncome(value);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Tooltip component
  const Tooltip = ({ children, text }: { children: React.ReactNode; text: string }) => (
    <div className="group relative inline-flex items-center">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 max-w-xs">
        {text}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );

  const currentMonth = formatCurrentMonth(language);

  // Получение ставки для текущего количества детей
  const currentRateInfo = ALIMONY_RATES[childrenCount > 3 ? 3 : childrenCount as keyof typeof ALIMONY_RATES];

  // Функция для получения локализованного описания ставки
  const getRateDescription = (count: number): string => {
    if (count === 1) return t('alimony_rate_desc_1');
    if (count === 2) return t('alimony_rate_desc_2');
    return t('alimony_rate_desc_3');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org микроразметка */}
      <Helmet>
        <title>{t('alimony_calc_title')} - Calk.KG</title>
        <meta name="description" content={t('alimony_calc_subtitle')} />
        <meta name="keywords" content={t('alimony_keywords')} />
        <meta property="og:title" content={`${t('alimony_calc_title')} - Calk.KG`} />
        <meta property="og:description" content={t('alimony_calc_subtitle')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/alimony" : "https://calk.kg/calculator/alimony"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/alimony.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('alimony_calc_title')} - Calk.KG`} />
        <meta name="twitter:description" content={t('alimony_calc_subtitle')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/alimony.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/alimony" : "https://calk.kg/calculator/alimony"} />
      </Helmet>
      {/* Schema.org микроразметка */}
      {generateSchemas().map((schema, index) => (
        <SchemaMarkup key={index} schema={schema} />
      ))}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 print:shadow-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                to={getLocalizedPath('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors print:hidden"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>{t('back')}</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 print:hidden"></div>
              <Link to={getLocalizedPath('/')} className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-red-600 to-red-700 p-2 rounded-lg">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">Calk.KG</span>
              </Link>
            </div>
            <Link
              to={getLocalizedPath('/')}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors print:hidden"
            >
              <Home className="h-4 w-4" />
              <span>{t('home')}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white print:bg-white print:text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 print:py-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white/20 p-3 rounded-lg print:bg-red-100">
              <Heart className="h-8 w-8 print:text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold print:text-2xl">{t('alimony_calc_title')}</h1>
              <p className="text-red-100 text-lg print:text-gray-600">{t('alimony_calc_subtitle')}</p>
            </div>
          </div>
          
          {/* Data Currency Notice */}
          <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3 print:hidden">
            <Scale className="h-5 w-5 text-amber-200" />
            <span className="text-amber-100 text-sm">
              {t('alimony_data_current')} {currentMonth} • {t('alimony_calculation_nature')}
            </span>
          </div>
        </div>
      </div>

      {/* Legal Warning Banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div className="text-sm text-yellow-800">
              <p className="font-bold mb-2">{t('alimony_legal_warning_title')}</p>
              <p className="mb-2" dangerouslySetInnerHTML={{ __html: t('alimony_legal_warning_text1') }} />
              <p dangerouslySetInnerHTML={{ __html: t('alimony_legal_warning_text2') }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 print:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 print:gap-6">
          {/* Input Section */}
          <div className="space-y-8 print:break-inside-avoid">
            <div className="bg-white rounded-xl shadow-sm p-8 print:shadow-none print:border">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('alimony_calculation_params')}</h2>
              
              {/* Children Count */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('alimony_children_count')}
                  </label>
                  <Tooltip text={t('alimony_children_count_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <select
                  value={childrenCount}
                  onChange={(e) => setChildrenCount(parseInt(e.target.value))}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg print:text-base"
                >
                  {[1, 2, 3, 4, 5].map(count => (
                    <option key={count} value={count}>
                      {count === 1 ? t('alimony_child_1') :
                       count === 2 ? t('alimony_children_2') :
                       count === 3 ? t('alimony_children_3') :
                       count === 4 ? t('alimony_children_4') : t('alimony_children_5')}
                    </option>
                  ))}
                </select>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center text-sm text-blue-800">
                    <Scale className="h-4 w-4 mr-2" />
                    <span>
                      {t('alimony_applied_rate')}: <strong>{(currentRateInfo.rate * 100)}%</strong> {t('alimony_rate_description')} ({getRateDescription(childrenCount > 3 ? 3 : childrenCount).toLowerCase()})
                    </span>
                  </div>
                </div>
              </div>

              {/* Calculation Method */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('alimony_calculation_method')}
                  </label>
                  <Tooltip text={t('alimony_method_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <div className="space-y-4">
                  <label className="flex items-start space-x-3 cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                    <input
                      type="radio"
                      name="calculationMethod"
                      value="known-income"
                      checked={calculationMethod === 'known-income'}
                      onChange={() => setCalculationMethod('known-income')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 mt-1"
                    />
                    <div>
                      <span className="text-gray-900 font-medium">{t('alimony_method_known_income')}</span>
                      <p className="text-sm text-gray-500 mt-1">
                        {t('alimony_method_known_income_desc')}
                      </p>
                    </div>
                  </label>
                  <label className="flex items-start space-x-3 cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                    <input
                      type="radio"
                      name="calculationMethod"
                      value="regional-average"
                      checked={calculationMethod === 'regional-average'}
                      onChange={() => setCalculationMethod('regional-average')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 mt-1"
                    />
                    <div>
                      <span className="text-gray-900 font-medium">{t('alimony_method_regional_avg')}</span>
                      <p className="text-sm text-gray-500 mt-1">
                        {t('alimony_method_regional_avg_desc')}
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Dynamic Input Fields */}
              {calculationMethod === 'known-income' ? (
                <div className="mb-8">
                  <div className="flex items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      {t('alimony_monthly_income')}
                    </label>
                    <Tooltip text={t('alimony_monthly_income_tooltip')}>
                      <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                    </Tooltip>
                  </div>
                  <input
                    type="text"
                    value={knownIncome}
                    onChange={handleIncomeChange}
                    placeholder={t('placeholder_enter_income')}
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg print:text-base"
                  />
                </div>
              ) : (
                <div className="mb-8">
                  <div className="flex items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      {t('alimony_region')}
                    </label>
                    <Tooltip text={t('alimony_region_tooltip')}>
                      <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                    </Tooltip>
                  </div>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value as Region)}
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg print:text-base"
                  >
                    {Object.entries(REGIONAL_AVERAGE_SALARY).map(([key, data]) => (
                      <option key={key} value={key}>
                        {t(data.nameKey)} - {formatCurrency(data.salary)} {t('text_som')}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Legal Framework Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-2">{t('alimony_legal_framework')}</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>{t('alimony_family_code')}</li>
                      <li>{t('alimony_execution_law')}</li>
                      <li>{t('alimony_government_resolutions')}</li>
                    </ul>
                    <p className="mt-3 text-xs" dangerouslySetInnerHTML={{ __html: t('alimony_rates_info') }} />
                    <p className="mt-3" dangerouslySetInnerHTML={{ __html: t('alimony_social_support') }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-8 print:shadow-none print:border print:break-inside-avoid">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">{t('alimony_calculation_results')}</h2>
                {results.alimonyAmount > 0 && (
                  <ActionButtons
                    calculatorName={t('alimony_calc_title')}
                    resultText={`${t('alimony_calc_title')} - ${t('alimony_calculation_results')}:
${t('alimony_children_count_label')}: ${childrenCount}
${t('alimony_calculation_base')}: ${formatCurrency(results.baseAmount)} сом
${t('alimony_rate_label')}: ${(results.appliedRate * 100)}%
${t('alimony_method_label')}: ${results.calculationMethod}
${t('alimony_approximate_amount')}: ${formatCurrency(results.alimonyAmount)} сом в месяц

${t('alimony_calculation_nature')}.
Расчет выполнен на сайте Calk.KG`}
                  />
                )}
              </div>
              
              {results.alimonyAmount > 0 ? (
                <div className="space-y-8">
                  {/* Main Result */}
                  <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl p-8 text-white text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Heart className="h-6 w-6 mr-2" />
                      <span className="text-pink-100">{t('alimony_approximate_amount')}:</span>
                    </div>
                    <p className="text-5xl font-bold mb-2">
                      {formatCurrency(results.alimonyAmount)} сом
                    </p>
                    <p className="text-pink-100">
                      {t('alimony_per_month')} {childrenCount === 1 ? t('alimony_per_month_child_1') : t('alimony_per_month_children').replace('{count}', childrenCount.toString())}
                    </p>
                  </div>

                  {/* Calculation Breakdown */}
                  <div className="space-y-6">
                    <h3 className="font-medium text-gray-700 text-lg">{t('alimony_calculation_details')}:</h3>

                    {/* Base Amount */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <span className="text-gray-700 font-medium">{t('alimony_calculation_base')}:</span>
                          <Tooltip text={t('alimony_calculation_base_tooltip')}>
                            <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-xl font-semibold text-gray-900">
                          {formatCurrency(results.baseAmount)} сом
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {t('alimony_method_label')}: {results.calculationMethod}
                        {results.regionName && ` • ${results.regionName}`}
                      </div>
                    </div>

                    {/* Applied Rate */}
                    <div className="bg-blue-50 rounded-lg p-6">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <span className="text-gray-700 font-medium">{t('alimony_rate_label')}:</span>
                          <Tooltip text={t('alimony_rate_tooltip')}>
                            <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-2xl font-bold text-blue-600">
                          {(results.appliedRate * 100)}%
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {getRateDescription(childrenCount > 3 ? 3 : childrenCount)} {t('alimony_according_to_code')}
                      </div>
                    </div>

                    {/* Calculation Formula */}
                    <div className="bg-pink-50 rounded-lg p-6">
                      <div className="flex items-center mb-3">
                        <Calculator className="h-5 w-5 text-pink-600 mr-2" />
                        <span className="text-gray-700 font-medium">{t('alimony_formula')}:</span>
                      </div>
                      <div className="text-lg text-gray-900 font-mono bg-white p-4 rounded border">
                        {formatCurrency(results.baseAmount)} × {(results.appliedRate * 100)}% = {formatCurrency(results.alimonyAmount)} сом
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-700 mb-3">{t('alimony_additional_info')}:</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>{t('alimony_children_count_label')}:</span>
                        <span>{childrenCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('alimony_method_used')}:</span>
                        <span>{results.calculationMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('alimony_legal_basis')}:</span>
                        <span>{t('alimony_family_code_kr')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('alimony_payment_frequency')}:</span>
                        <span>{t('alimony_monthly')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <Heart className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    {calculationMethod === 'known-income'
                      ? t('alimony_enter_income')
                      : t('alimony_select_region')
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Alimony Rates Reference */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
          <h3 className="font-medium text-gray-900 mb-6">{t('alimony_rates_title')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(ALIMONY_RATES).map(([count, rateInfo]) => (
              <div 
                key={count}
                className={`p-6 rounded-xl border-2 ${
                  parseInt(count) === (childrenCount > 3 ? 3 : childrenCount) 
                    ? 'border-pink-400 bg-pink-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {(rateInfo.rate * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">
                    {getRateDescription(parseInt(count))}
                  </div>
                  {parseInt(count) === (childrenCount > 3 ? 3 : childrenCount) && (
                    <div className="mt-2">
                      <span className="text-xs bg-pink-600 text-white px-2 py-1 rounded-full">
                        {t('alimony_applied_badge')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Sections */}
        <div className="mt-12 space-y-12">
          {/* Regional Comparison */}
          {calculationMethod === 'regional-average' && results.alimonyAmount > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
              <div className="flex items-center mb-6">
                <MapPin className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {t('alimony_regional_comparison')}
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('alimony_region_column')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('alimony_avg_salary_column')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('alimony_amount_column')} ({(currentRateInfo.rate * 100)}%)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Current Selection */}
                    <tr className="bg-green-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {t(REGIONAL_AVERAGE_SALARY[selectedRegion].nameKey)} <span className="text-xs text-gray-500">{t('your_choice')}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {formatCurrency(REGIONAL_AVERAGE_SALARY[selectedRegion].salary)} сом
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {formatCurrency(results.alimonyAmount)} сом
                      </td>
                    </tr>
                    
                    {/* Other Regions */}
                    {Object.entries(REGIONAL_AVERAGE_SALARY)
                      .filter(([key]) => key !== selectedRegion)
                      .sort(([,a], [,b]) => b.salary - a.salary)
                      .map(([regionKey, regionData]) => {
                        const regionAlimony = regionData.salary * currentRateInfo.rate;
                        const isHigher = regionAlimony > results.alimonyAmount;
                        const isLower = regionAlimony < results.alimonyAmount;
                        
                        return (
                          <tr key={regionKey} className={isHigher ? 'bg-blue-50' : isLower ? 'bg-red-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {t(regionData.nameKey)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(regionData.salary)} сом
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(regionAlimony)} сом
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded mr-2"></div>
                    <span>{t('alimony_higher_legend')}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-50 border border-red-200 rounded mr-2"></div>
                    <span>{t('alimony_lower_legend')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Examples */}
          <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
            <h3 className="font-medium text-gray-900 mb-4">{t('calculation_examples')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { children: 1, income: 50000, method: 'known-income' as CalculationMethod },
                { children: 2, region: 'bishkek' as Region, method: 'regional-average' as CalculationMethod },
                { children: 3, income: 75000, method: 'known-income' as CalculationMethod }
              ].map((example, index) => {
                const exampleResult = calculateAlimony(
                  example.method, 
                  example.children, 
                  example.method === 'known-income' ? (example as any).income : 0,
                  example.method === 'regional-average' ? (example as any).region : 'bishkek'
                );
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setChildrenCount(example.children);
                      setCalculationMethod(example.method);
                      if (example.method === 'known-income') {
                        setKnownIncome(((example as any).income).toString());
                      } else {
                        setSelectedRegion((example as any).region);
                      }
                    }}
                    className="text-left p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium text-sm">
                        {example.children === 1 ? t('alimony_child_1') : t('alimony_children_2').replace('2', example.children.toString())}
                      </span>
                      <span className="text-xs text-gray-500">
                        {(ALIMONY_RATES[example.children > 3 ? 3 : example.children as keyof typeof ALIMONY_RATES].rate * 100)}%
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-pink-600 font-semibold">
                        {formatCurrency(exampleResult.alimonyAmount)} сом
                      </div>
                      <div className="text-xs text-gray-500">
                        {example.method === 'known-income'
                          ? `${t('alimony_with_income')} ${formatCurrency((example as any).income)}`
                          : `${t('alimony_by_avg_salary')} ${t(REGIONAL_AVERAGE_SALARY[(example as any).region].nameKey)}`
                        }
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Important Legal Notice */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-8">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
              <div className="text-sm text-red-800">
                <p className="font-bold mb-3 text-lg">{t('alimony_mandatory_reading')}</p>
                <div className="space-y-2">
                  <p dangerouslySetInnerHTML={{ __html: t('alimony_not_legal_advice') }} />
                  <p dangerouslySetInnerHTML={{ __html: t('alimony_court_decision') }} />
                  <p dangerouslySetInnerHTML={{ __html: t('alimony_seek_legal_help') }} />
                </div>
              </div>
            </div>
          </div>

          {/* Other Calculators */}
          <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
            <h3 className="font-medium text-gray-900 mb-4">{t('other_calculators')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to={getLocalizedPath('/calculator/family-benefit')}
                className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-50 p-2 rounded-lg group-hover:bg-gray-100 transition-colors">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('alimony_other_calc_family_benefit')}</div>
                    <div className="text-sm text-gray-500">{t('alimony_other_calc_family_benefit_desc')}</div>
                  </div>
                </div>
              </Link>
              <Link
                to={getLocalizedPath('/calculator/salary')}
                className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('alimony_other_calc_salary')}</div>
                    <div className="text-sm text-gray-500">{t('alimony_other_calc_salary_desc')}</div>
                  </div>
                </div>
              </Link>
              <Link
                to={getLocalizedPath('/calculator/pension')}
                className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('alimony_other_calc_pension')}</div>
                    <div className="text-sm text-gray-500">{t('alimony_other_calc_pension_desc')}</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Regional Salary Data Reference */}
          <div className="bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
            <h3 className="font-medium text-gray-900 mb-6">{t('alimony_regional_salary_reference')} ({currentMonth.split(' ')[1]} г.)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(REGIONAL_AVERAGE_SALARY)
                .sort(([,a], [,b]) => b.salary - a.salary)
                .map(([regionKey, regionData]) => (
                  <div 
                    key={regionKey}
                    className={`p-4 rounded-lg border ${
                      regionKey === selectedRegion && calculationMethod === 'regional-average'
                        ? 'border-green-400 bg-green-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-medium text-gray-900 mb-1">
                        {t(regionData.nameKey)}
                      </div>
                      <div className="text-lg font-bold text-gray-800">
                        {formatCurrency(regionData.salary)} сом
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {t('alimony_avg_salary_per_month')}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-6 text-xs text-gray-500">
              <p>
                {t('alimony_salary_disclaimer')} {currentMonth}.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style jsx>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          .print\\:bg-white {
            background-color: white !important;
            -webkit-print-color-adjust: exact;
          }
          .print\\:text-gray-900 {
            color: #111827 !important;
          }
          .print\\:text-gray-600 {
            color: #4B5563 !important;
          }
          .print\\:text-red-600 {
            color: #DC2626 !important;
          }
          .print\\:bg-red-100 {
            background-color: #FEE2E2 !important;
            -webkit-print-color-adjust: exact;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border {
            border: 1px solid #E5E7EB !important;
          }
          .print\\:py-6 {
            padding-top: 1.5rem !important;
            padding-bottom: 1.5rem !important;
          }
          .print\\:text-2xl {
            font-size: 1.5rem !important;
            line-height: 2rem !important;
          }
          .print\\:text-base {
            font-size: 1rem !important;
            line-height: 1.5rem !important;
          }
          .print\\:gap-6 {
            gap: 1.5rem !important;
          }
          .print\\:break-inside-avoid {
            break-inside: avoid !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AlimonyCalculatorPage;