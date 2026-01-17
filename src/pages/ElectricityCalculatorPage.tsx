import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Info, Home, Printer, Zap, TrendingUp, Droplets, Flame } from 'lucide-react';
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

// Актуальные тарифы на электроэнергию в Кыргызстане (2024-2026)
// Источник: ОАО "Северэлектро", Госагентство по регулированию ТЭК
// Последнее обновление: декабрь 2024
const TARIFF_CONFIG = {
  'general': {
    nameKey: 'tariff_general_population',
    limit: 700,
    rate1: 0.77,  // до 700 кВт·ч
    rate2: 2.16   // свыше 700 кВт·ч
  },
  'highland': {
    nameKey: 'tariff_highland_residents',
    limit: 1000,
    rate1: 0.77,  // до 1000 кВт·ч (льгота для высокогорья)
    rate2: 2.16   // свыше 1000 кВт·ч
  },
  'lowIncome': {
    nameKey: 'tariff_low_income_families',
    limit: 700,
    rate1: 0.50,  // льготный тариф до 700 кВт·ч
    rate2: 2.16   // свыше 700 кВт·ч
  }
};

type ConsumerCategory = 'general' | 'highland' | 'lowIncome';

interface ElectricityResults {
  consumption: number;
  withinLimit: number;
  withinLimitCost: number;
  beyondLimit: number;
  beyondLimitCost: number;
  totalCost: number;
  averageRate: number;
}

const ElectricityCalculatorPage = () => {
  const { t, language, getLocalizedPath} = useLanguage();

  React.useEffect(() => {
    document.title = t('electricity_calc_title') + " - Calk.KG";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('electricity_calc_description'));
    }
  }, [t]);

  const [consumption, setConsumption] = useState<number>(300);
  const [category, setCategory] = useState<ConsumerCategory>('general');
  
  const [results, setResults] = useState<ElectricityResults>({
    consumption: 0,
    withinLimit: 0,
    withinLimitCost: 0,
    beyondLimit: 0,
    beyondLimitCost: 0,
    totalCost: 0,
    averageRate: 0
  });

  // Расчет стоимости электроэнергии
  const calculateElectricity = (kWh: number, categoryType: ConsumerCategory): ElectricityResults => {
    if (kWh <= 0) {
      return {
        consumption: 0,
        withinLimit: 0,
        withinLimitCost: 0,
        beyondLimit: 0,
        beyondLimitCost: 0,
        totalCost: 0,
        averageRate: 0
      };
    }

    const tariff = TARIFF_CONFIG[categoryType];
    
    // Все категории имеют лимит с двухступенчатым тарифом
    const withinLimit = Math.min(kWh, tariff.limit);
    const beyondLimit = Math.max(0, kWh - tariff.limit);
    
    const withinLimitCost = withinLimit * tariff.rate1;
    const beyondLimitCost = beyondLimit * tariff.rate2;
    const totalCost = withinLimitCost + beyondLimitCost;
    const averageRate = totalCost / kWh;

    return {
      consumption: kWh,
      withinLimit,
      withinLimitCost,
      beyondLimit,
      beyondLimitCost,
      totalCost,
      averageRate
    };
  };

  // Обновление результатов
  useEffect(() => {
    setResults(calculateElectricity(consumption, category));
  }, [consumption, category]);

  // Генерация схем для страницы калькулятора электроэнергии
  const generateSchemas = () => {
    const currentUrl = language === 'ky' ? "https://calk.kg/ky/calculator/electricity" : "https://calk.kg/calculator/electricity";
    const homeUrl = language === 'ky' ? "https://calk.kg/ky" : "https://calk.kg";
    
    const calculatorSchema = generateCalculatorSchema({
      url: currentUrl,
      title: t('electricity_calc_title'),
      description: t('electricity_calc_subtitle'),
      calculatorName: t('electricity_calc_title'),
      category: t('nav_utilities'),
      language,
      inputProperties: ["consumption", "category"],
      outputProperties: ["monthlyCost", "averageRate"]
    });

    const softwareSchema = generateSoftwareApplicationSchema({
      url: currentUrl,
      title: t('electricity_calc_title'),
      description: t('electricity_calc_subtitle'),
      calculatorName: t('electricity_calc_title'),
      category: "UtilityApplication",
      inputProperties: [t('electricity_consumption'), t('electricity_category')],
      outputProperties: [t('electricity_monthly_cost'), t('electricity_average_rate')]
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: homeUrl },
      { name: t('nav_utilities'), url: `${homeUrl}?category=utilities` },
      { name: t('electricity_calc_title'), url: currentUrl }
    ]);

    return [calculatorSchema, softwareSchema, breadcrumbSchema];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-KG', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleConsumptionChange = (value: number) => {
    setConsumption(Math.max(0, Math.min(3000, value))); // Ограничение от 0 до 3000 кВт·ч
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

  const currentTariff = TARIFF_CONFIG[category];
  const currentMonth = formatCurrentMonth(language);

  // Расчет процентов для визуализации
  const withinLimitPercentage = results.totalCost > 0 ? (results.withinLimitCost / results.totalCost) * 100 : 0;
  const beyondLimitPercentage = 100 - withinLimitPercentage;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org микроразметка */}
      <Helmet>
        <title>{t('electricity_calc_title')} - Calk.KG</title>
        <meta name="description" content={t('electricity_calc_subtitle')} />
        <meta name="keywords" content={t('electricity_calc_keywords')} />
        <meta property="og:title" content={`${t('electricity_calc_title')} - Calk.KG`} />
        <meta property="og:description" content={t('electricity_calc_subtitle')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/electricity" : "https://calk.kg/calculator/electricity"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/electricity.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('electricity_calc_title')} - Calk.KG`} />
        <meta name="twitter:description" content={t('electricity_calc_subtitle')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/electricity.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/electricity" : "https://calk.kg/calculator/electricity"} />
      </Helmet>
      <HreflangTags path="/calculator/electricity" />
      {generateSchemas().map((schema, index) => (
        <SchemaMarkup key={index} schema={schema} />
      ))}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 print:shadow-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to={getLocalizedPath("/")} 
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors print:hidden"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>{t('back')}</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 print:hidden"></div>
              <Link to={getLocalizedPath("/")} className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-red-600 to-red-700 p-2 rounded-lg">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">Calk.KG</span>
              </Link>
            </div>
            <Link 
              to={getLocalizedPath("/")}
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
              <Zap className="h-8 w-8 print:text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold print:text-2xl">{t('electricity_calc_title')}</h1>
              <p className="text-red-100 text-lg print:text-gray-600">{t('electricity_calc_subtitle')}</p>
            </div>
          </div>
          
          {/* Актуальность данных */}
          <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3 print:hidden">
            <Info className="h-5 w-5 text-amber-200" />
            <span className="text-amber-100 text-sm">
              {t('electricity_tariffs_actual')} {currentMonth}. {t('electricity_calculation_preliminary')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 print:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 print:gap-6">
          {/* Input Section */}
          <div className="space-y-8 print:break-inside-avoid">
            <div className="bg-white rounded-xl shadow-sm p-8 print:shadow-none print:border">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('calc_parameters')}</h2>
              
              {/* Consumption Slider */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <label className="block text-sm font-medium text-gray-700">
                      {t('electricity_consumption')}
                    </label>
                    <Tooltip text={t('electricity_consumption_tooltip')}>
                      <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                    </Tooltip>
                  </div>
                  <span className="text-2xl font-bold text-red-600">{consumption}</span>
                </div>
                
                {/* Slider */}
                <div className="mb-4">
                  <input
                    type="range"
                    min="0"
                    max="3000"
                    step="10"
                    value={consumption}
                    onChange={(e) => handleConsumptionChange(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>1500</span>
                    <span>3000 {t('electricity_kwh_max')}</span>
                  </div>
                </div>

                {/* Number Input */}
                <div className="mt-4">
                  <input
                    type="number"
                    value={consumption}
                    onChange={(e) => handleConsumptionChange(parseInt(e.target.value) || 0)}
                    min="0"
                    max="3000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-center text-lg"
                  />
                </div>
              </div>

              {/* Category Selection */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('electricity_category')}
                  </label>
                  <Tooltip text={t('electricity_category_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <div className="space-y-3">
                  {Object.entries(TARIFF_CONFIG).map(([key, tariff]) => (
                    <label 
                      key={key}
                      className="flex items-start space-x-3 cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={key}
                        checked={category === key}
                        onChange={() => setCategory(key as ConsumerCategory)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 mt-1"
                      />
                      <div className="flex-1">
                        <span className="text-gray-900 font-medium block">
                          {key === 'general' && t('electricity_general')}
                          {key === 'highland' && t('electricity_highland')}
                          {key === 'lowIncome' && t('electricity_low_income')}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">{tariff.description}</p>
                        <div className="text-xs text-gray-400 mt-1">
                          {tariff.limit ? (
                            <>{t('electricity_up_to')} {tariff.limit} {t('electricity_kwh_max')}: {tariff.rate1} {t('electricity_som_per_kwh')}, {t('electricity_above')} {tariff.rate2} {t('electricity_som_per_kwh')}</>
                          ) : (
                            <>{t('electricity_unified_tariff')} {tariff.rate} {t('electricity_som_per_kwh')}</>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Info Block */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-2">{t('electricity_tariffication_features')}</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>{t('electricity_feature_1')}</li>
                      <li>{t('electricity_feature_2')}</li>
                      <li>{t('electricity_feature_3')}</li>
                    </ul>
                    <p className="mt-3">
                      💡 <strong>{t('electricity_save_utilities')}</strong> {t('electricity_also_calculate')}
                      <Link to={getLocalizedPath("/calculator/water")} className="text-blue-600 hover:text-blue-800 underline"> {t('electricity_water_pay')}</Link>,
                      <Link to={getLocalizedPath("/calculator/gas")} className="text-blue-600 hover:text-blue-800 underline"> {t('electricity_natural_gas')}</Link> {t('electricity_heating_and')}
                      <Link to={getLocalizedPath("/calculator/heating")} className="text-blue-600 hover:text-blue-800 underline"> {t('electricity_heating')}</Link> {t('electricity_for_full_budget')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-8 print:shadow-none print:border print:break-inside-avoid">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">{t('calc_calculation_details')}</h2>
                {results.totalCost > 0 && (
                  <ActionButtons
                    calculatorName={t('schema_electricity_calc')}
                    resultText={`${t('electricity_calc_name')} - ${t('result_text_intro')}
${t('monthly_consumption')}: ${results.consumption} кВт·ч
${t('consumer_category')}: ${t(TARIFF_CONFIG[category].nameKey as any)}
${t('electricity_monthly_cost')}: ${formatCurrency(results.totalCost)} ${t('kgs')}
${t('electricity_average_rate')}: ${formatCurrency(results.averageRate)} сом/кВт·ч

${t('calculated_on_site')} Calk.KG`}
                  />
                )}
              </div>
              
              {results.totalCost > 0 ? (
                <div className="space-y-6">
                  {/* Total Cost - Main Result */}
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-8 text-white text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Zap className="h-6 w-6 mr-2" />
                      <span className="text-amber-100">{t('electricity_monthly_cost')}</span>
                    </div>
                    <p className="text-5xl font-bold mb-2">
                      {formatCurrency(results.totalCost)} {t('electricity_som')}
                    </p>
                    <p className="text-amber-100">
                      {t('electricity_average_rate')} {formatCurrency(results.averageRate)} {t('electricity_som_per_kwh')}
                    </p>
                  </div>

                  {/* Cost Structure Visualization */}
                  {currentTariff.limit && results.beyondLimit > 0 && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        {t('electricity_cost_structure')}
                      </h3>
                      <div className="space-y-4">
                        {/* Within Limit Bar */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">{t('electricity_within_limit')}</span>
                            <span className="text-sm font-medium text-green-600">
                              {withinLimitPercentage.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${withinLimitPercentage}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Beyond Limit Bar */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">{t('electricity_beyond_limit')}</span>
                            <span className="text-sm font-medium text-red-600">
                              {beyondLimitPercentage.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${beyondLimitPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Detailed Breakdown */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700 text-lg">{t('calc_step_by_step')}</h3>
                    
                    {/* Consumption Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 font-medium">{t('electricity_consumption_month')}</span>
                        <span className="text-xl font-semibold text-gray-900">
                          {results.consumption} {t('electricity_kwh_max')}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {t('consumer_category')}: {t(currentTariff.nameKey as any)}
                      </div>
                    </div>

                    {/* Within Limit */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <span className="text-gray-700">
                            {currentTariff.limit ? `${t('electricity_within_limit_full')} ${currentTariff.limit} ${t('electricity_kwh_max')}):` : t('electricity_general_consumption')}
                          </span>
                          <Tooltip text={currentTariff.limit ? t('electricity_within_limit_tooltip') : t('electricity_general_consumption_tooltip')}>
                            <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-green-600 font-semibold">
                          {formatCurrency(results.withinLimitCost)} {t('electricity_som')}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {results.withinLimit} {t('electricity_kwh_max')} × {currentTariff.limit ? currentTariff.rate1 : currentTariff.rate} {t('electricity_som')} = {formatCurrency(results.withinLimitCost)} {t('electricity_som')}
                      </div>
                    </div>

                    {/* Beyond Limit */}
                    {results.beyondLimit > 0 && (
                      <div className="bg-red-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <span className="text-gray-700">{t('beyond_limit_text')}</span>
                            <Tooltip text={t('electricity_beyond_limit_tooltip')}>
                              <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                            </Tooltip>
                          </div>
                          <span className="text-red-600 font-semibold">
                            {formatCurrency(results.beyondLimitCost)} {t('electricity_som')}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {results.beyondLimit} {t('electricity_kwh_max')} × {currentTariff.rate2} {t('electricity_som')} = {formatCurrency(results.beyondLimitCost)} {t('electricity_som')}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-700 mb-3">{t('calc_summary')}</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>{t('monthly_consumption')}</span>
                        <span>{results.consumption} {t('electricity_kwh_max')}</span>
                      </div>
                      {currentTariff.limit && (
                        <>
                          <div className="flex justify-between">
                            <span>{t('preferential_limit')}</span>
                            <span>{currentTariff.limit} {t('electricity_kwh_max')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t('beyond_limit_text')}</span>
                            <span>{results.beyondLimit} {t('electricity_kwh_max')}</span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between">
                        <span>{t('electricity_average_rate')}</span>
                        <span>{formatCurrency(results.averageRate)} {t('electricity_som_per_kwh')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <Zap className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">{t('setup_consumption')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="mt-12 space-y-12">
          {/* Other Calculators */}
          <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
            <h3 className="font-medium text-gray-900 mb-4">{t('other_calculators')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to={getLocalizedPath("/calculator/water")}
                className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <Droplets className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('water_link_title')}</div>
                    <div className="text-sm text-gray-500">{t('water_link_desc')}</div>
                  </div>
                </div>
              </Link>
              <Link
                to={getLocalizedPath("/calculator/gas")}
                className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-50 p-2 rounded-lg group-hover:bg-orange-100 transition-colors">
                    <Flame className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('gas_link_title')}</div>
                    <div className="text-sm text-gray-500">{t('gas_link_desc')}</div>
                  </div>
                </div>
              </Link>
              <Link
                to={getLocalizedPath("/calculator/heating")}
                className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-50 p-2 rounded-lg group-hover:bg-amber-100 transition-colors">
                    <Flame className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('heating_link_title')}</div>
                    <div className="text-sm text-gray-500">{t('heating_link_desc')}</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Quick Examples */}
          <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
            <h3 className="font-medium text-gray-900 mb-4">{t('electricity_examples_title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { consumption: 150, labelKey: 'electricity_economical_home', category: 'general' as ConsumerCategory },
                { consumption: 350, labelKey: 'electricity_average_family', category: 'general' as ConsumerCategory },
                { consumption: 800, labelKey: 'electricity_low_income_family', category: 'lowIncome' as ConsumerCategory },
                { consumption: 1200, labelKey: 'electricity_highland_area', category: 'highland' as ConsumerCategory }
              ].map((example, index) => {
                const exampleResult = calculateElectricity(example.consumption, example.category);
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setConsumption(example.consumption);
                      setCategory(example.category);
                    }}
                    className="text-left p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium text-sm">
                        {t(example.labelKey as any)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {example.consumption} {t('electricity_kwh_max')}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-amber-600 font-semibold">
                        {formatCurrency(exampleResult.totalCost)} {t('electricity_som')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatCurrency(exampleResult.averageRate)} {t('electricity_som_per_kwh')}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Info className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-2">{t('electricity_important_info')}</p>
              <p className="mb-2">
                {t('electricity_tariffs_actual')} {currentMonth}. {t('electricity_disclaimer_full')}
              </p>
              <p className="text-sm">
                <strong>{t('tariff_source')}:</strong> ОАО «Северэлектро», Госагентство по регулированию ТЭК.
                {' '}
                <a 
                  href="https://severelectro.kg/services/tariff/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-yellow-700 hover:text-yellow-900 underline"
                >
                  severelectro.kg →
                </a>
              </p>
            </div>
          </div>

          {/* Educational Guide Section */}
          <div className="mt-12 bg-gradient-to-br from-white to-yellow-50 rounded-xl shadow-lg p-8 border border-yellow-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('electricity_guide_title')}</h2>
            
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {t('electricity_guide_intro')}
              </p>

              <div className="space-y-8">
                {/* Tariffs 2026 */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-yellow-700 mb-4">{t('electricity_guide_tariffs_title')}</h3>
                  <p className="text-gray-700 mb-4">{t('electricity_guide_tariffs_text')}</p>
                </div>

                {/* General Tariff */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-green-700 mb-4">{t('electricity_tariff_general_title')}</h3>
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-3">
                    <p className="text-gray-800 font-semibold">{t('electricity_tariff_general_rate')}</p>
                  </div>
                  <p className="text-gray-700">{t('electricity_tariff_general_text')}</p>
                </div>

                {/* Highland Tariff */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-blue-700 mb-4">{t('electricity_tariff_highland_title')}</h3>
                  <div className="space-y-2 mb-3">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                      <p className="text-gray-800">{t('electricity_tariff_highland_limit')}</p>
                    </div>
                    <div className="bg-red-50 border-l-4 border-red-500 p-4">
                      <p className="text-gray-800">{t('electricity_tariff_highland_over')}</p>
                    </div>
                  </div>
                  <p className="text-gray-700">{t('electricity_tariff_highland_text')}</p>
                </div>

                {/* Low Income Tariff */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-purple-700 mb-4">{t('electricity_tariff_lowincome_title')}</h3>
                  <div className="space-y-2 mb-3">
                    <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                      <p className="text-gray-800">{t('electricity_tariff_lowincome_limit')}</p>
                    </div>
                    <div className="bg-red-50 border-l-4 border-red-500 p-4">
                      <p className="text-gray-800">{t('electricity_tariff_lowincome_over')}</p>
                    </div>
                  </div>
                  <p className="text-gray-700">{t('electricity_tariff_lowincome_text')}</p>
                </div>

                {/* Average Consumption */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-yellow-700 mb-4">{t('electricity_guide_consumption_title')}</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start"><span className="text-yellow-600 font-bold mr-2">•</span><span>{t('electricity_consumption_1person')}</span></li>
                    <li className="flex items-start"><span className="text-yellow-600 font-bold mr-2">•</span><span>{t('electricity_consumption_2person')}</span></li>
                    <li className="flex items-start"><span className="text-yellow-600 font-bold mr-2">•</span><span>{t('electricity_consumption_family')}</span></li>
                    <li className="flex items-start"><span className="text-yellow-600 font-bold mr-2">•</span><span>{t('electricity_consumption_heating')}</span></li>
                    <li className="flex items-start"><span className="text-yellow-600 font-bold mr-2">•</span><span>{t('electricity_consumption_appliances')}</span></li>
                  </ul>
                </div>

                {/* Saving Tips */}
                <div className="bg-green-50 rounded-lg p-6 shadow-sm border border-green-200">
                  <h3 className="text-2xl font-bold text-green-700 mb-4">💡 {t('electricity_guide_saving_title')}</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded"><span className="text-green-600 font-bold mr-2">✓</span>{t('electricity_saving_led')}</div>
                    <div className="bg-white p-3 rounded"><span className="text-green-600 font-bold mr-2">✓</span>{t('electricity_saving_appliances')}</div>
                    <div className="bg-white p-3 rounded"><span className="text-green-600 font-bold mr-2">✓</span>{t('electricity_saving_standby')}</div>
                    <div className="bg-white p-3 rounded"><span className="text-green-600 font-bold mr-2">✓</span>{t('electricity_saving_windows')}</div>
                    <div className="bg-white p-3 rounded"><span className="text-green-600 font-bold mr-2">✓</span>{t('electricity_saving_washing')}</div>
                    <div className="bg-white p-3 rounded"><span className="text-green-600 font-bold mr-2">✓</span>{t('electricity_saving_fridge')}</div>
                    <div className="bg-white p-3 rounded"><span className="text-green-600 font-bold mr-2">✓</span>{t('electricity_saving_lighting')}</div>
                    <div className="bg-white p-3 rounded"><span className="text-green-600 font-bold mr-2">✓</span>{t('electricity_saving_timing')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">❓ {t('electricity_faq_title')}</h2>
            <div className="space-y-6">
              <details className="group bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  <span>{t('electricity_faq_q1')}</span>
                  <span className="text-yellow-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">{t('electricity_faq_a1')}</p>
              </details>

              <details className="group bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  <span>{t('electricity_faq_q2')}</span>
                  <span className="text-yellow-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">{t('electricity_faq_a2')}</p>
              </details>

              <details className="group bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  <span>{t('electricity_faq_q3')}</span>
                  <span className="text-yellow-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">{t('electricity_faq_a3')}</p>
              </details>

              <details className="group bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  <span>{t('electricity_faq_q4')}</span>
                  <span className="text-yellow-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">{t('electricity_faq_a4')}</p>
              </details>

              <details className="group bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  <span>{t('electricity_faq_q5')}</span>
                  <span className="text-yellow-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">{t('electricity_faq_a5')}</p>
              </details>

              <details className="group bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  <span>{t('electricity_faq_q6')}</span>
                  <span className="text-yellow-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">{t('electricity_faq_a6')}</p>
              </details>
            </div>
          </div>

          {/* Practical Tips */}
          <div className="mt-12 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-lg p-8 border border-yellow-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">💡 {t('electricity_tips_title')}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="flex items-start space-x-3 bg-white p-4 rounded-lg">
                  <span className="text-2xl">⚡</span>
                  <p className="text-gray-700">{t(`electricity_tips_${i === 1 ? 'meters' : i === 2 ? 'payment' : i === 3 ? 'mobile' : i === 4 ? 'peaks' : i === 5 ? 'wiring' : i === 6 ? 'complaints' : i === 7 ? 'compensation' : 'safety'}`)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="mt-12 bg-red-50 rounded-xl shadow-lg p-8 border-2 border-red-200">
            <h2 className="text-3xl font-bold text-red-900 mb-6">⚠️ {t('electricity_mistakes_title')}</h2>
            <div className="space-y-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="flex items-start space-x-3 bg-white p-4 rounded-lg border-l-4 border-red-500">
                  <span className="text-red-600 font-bold text-xl">✗</span>
                  <p className="text-gray-800">{t(`electricity_mistake_${i}`)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Energy Companies */}
          <div className="mt-12 bg-gray-50 rounded-xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🏢 {t('electricity_companies_title')}</h2>
            <div className="space-y-3 text-gray-700">
              {[1,2,3,4,5].map(i => (
                <p key={i} className="flex items-center">
                  <span className="mr-2">📍</span>
                  {t(`electricity_company_${i}`)}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #dc2626;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #dc2626;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

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

export default ElectricityCalculatorPage;