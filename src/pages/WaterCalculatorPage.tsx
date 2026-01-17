import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Info, Home, Printer, Droplets, TrendingUp, MapPin, Zap, Flame } from 'lucide-react';
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

// Конфигурация тарифов - легко редактируемая структура
const WATER_TARIFFS = {
  'bishkek': {
    nameKey: 'region_bishkek',
    tariffs: {
      'population': { water: 8.10, sewerage: 3.25, nameKey: 'tariff_population' },
      'budget': { water: 9.10, sewerage: 4.25, nameKey: 'tariff_budget' },
      'commercial': { water: 13.00, sewerage: 6.00, nameKey: 'tariff_commercial_enterprises' }
    }
  },
  'osh': {
    nameKey: 'region_osh',
    tariffs: {
      'population': { water: 12.96, sewerage: 0, nameKey: 'tariff_population' },
      'budget': { water: 15.50, sewerage: 0, nameKey: 'tariff_budget' },
      'commercial': { water: 28.50, sewerage: 0, nameKey: 'tariff_commercial_enterprises' }
    }
  },
  'karakol': {
    nameKey: 'region_karakol',
    tariffs: {
      'population': { water: 7.50, sewerage: 2.80, nameKey: 'tariff_population' },
      'budget': { water: 8.50, sewerage: 3.50, nameKey: 'tariff_budget' },
      'commercial': { water: 11.50, sewerage: 5.20, nameKey: 'tariff_commercial_enterprises' }
    }
  },
  'jalal-abad': {
    nameKey: 'region_jalal_abad',
    tariffs: {
      'population': { water: 9.20, sewerage: 3.80, nameKey: 'tariff_population' },
      'budget': { water: 10.50, sewerage: 4.50, nameKey: 'tariff_budget' },
      'commercial': { water: 15.80, sewerage: 7.20, nameKey: 'tariff_commercial_enterprises' }
    }
  },
  'tokmok': {
    nameKey: 'region_tokmok',
    tariffs: {
      'population': { water: 6.80, sewerage: 2.50, nameKey: 'tariff_population' },
      'budget': { water: 7.80, sewerage: 3.20, nameKey: 'tariff_budget' },
      'commercial': { water: 10.50, sewerage: 4.80, nameKey: 'tariff_commercial_enterprises' }
    }
  },
  'naryn': {
    nameKey: 'region_naryn',
    tariffs: {
      'population': { water: 5.90, sewerage: 2.10, nameKey: 'tariff_population' },
      'budget': { water: 6.90, sewerage: 2.80, nameKey: 'tariff_budget' },
      'commercial': { water: 9.20, sewerage: 4.10, nameKey: 'tariff_commercial_enterprises' }
    }
  },
  'talas': {
    nameKey: 'region_talas',
    tariffs: {
      'population': { water: 6.50, sewerage: 2.30, nameKey: 'tariff_population' },
      'budget': { water: 7.50, sewerage: 3.00, nameKey: 'tariff_budget' },
      'commercial': { water: 10.00, sewerage: 4.50, nameKey: 'tariff_commercial_enterprises' }
    }
  },
  'batken': {
    nameKey: 'region_batken',
    tariffs: {
      'population': { water: 7.20, sewerage: 2.90, nameKey: 'tariff_population' },
      'budget': { water: 8.20, sewerage: 3.70, nameKey: 'tariff_budget' },
      'commercial': { water: 11.80, sewerage: 5.50, nameKey: 'tariff_commercial_enterprises' }
    }
  }
};

type City = keyof typeof WATER_TARIFFS;
type ConsumerCategory = 'population' | 'budget' | 'commercial';

interface WaterResults {
  consumption: number;
  waterCost: number;
  sewerageeCost: number;
  totalCost: number;
  waterRate: number;
  sewerageRate: number;
}

const WaterCalculatorPage = () => {
  const { language, t, getLocalizedPath } = useLanguage();

  React.useEffect(() => {
    document.title = t('water_calc_title') + " - Calk.KG";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('water_calc_description'));
    }
  }, [t]);

  // Генерация схем для страницы калькулятора воды
  const generateSchemas = () => {
    const currentUrl = language === 'ky' ? "https://calk.kg/ky/calculator/water" : "https://calk.kg/calculator/water";
    const homeUrl = language === 'ky' ? "https://calk.kg/ky" : "https://calk.kg";
    
    const calculatorSchema = generateCalculatorSchema({
      url: currentUrl,
      title: t('water_calc_title'),
      description: t('water_calc_subtitle'),
      calculatorName: t('water_calc_title'),
      category: t('nav_utilities'),
      language,
      inputProperties: ["consumption", "city", "category"],
      outputProperties: ["waterCost", "sewerageСost", "totalCost"]
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: homeUrl },
      { name: t('nav_utilities'), url: `${homeUrl}?category=utilities` },
      { name: t('water_calc_title'), url: currentUrl }
    ]);

    return [calculatorSchema, breadcrumbSchema];
  };

  const [city, setCity] = useState<City>('bishkek');
  const [category, setCategory] = useState<ConsumerCategory>('population');
  const [consumption, setConsumption] = useState<number>(15);
  
  const [results, setResults] = useState<WaterResults>({
    consumption: 0,
    waterCost: 0,
    sewerageeCost: 0,
    totalCost: 0,
    waterRate: 0,
    sewerageRate: 0
  });

  // Расчет стоимости водоснабжения и канализации
  const calculateWaterBill = (volume: number, selectedCity: City, selectedCategory: ConsumerCategory): WaterResults => {
    if (volume <= 0) {
      return {
        consumption: 0,
        waterCost: 0,
        sewerageeCost: 0,
        totalCost: 0,
        waterRate: 0,
        sewerageRate: 0
      };
    }

    const tariff = WATER_TARIFFS[selectedCity].tariffs[selectedCategory];
    
    const waterCost = volume * tariff.water;
    const sewerageeCost = volume * tariff.sewerage;
    const totalCost = waterCost + sewerageeCost;

    return {
      consumption: volume,
      waterCost,
      sewerageeCost,
      totalCost,
      waterRate: tariff.water,
      sewerageRate: tariff.sewerage
    };
  };

  // Обновление результатов
  useEffect(() => {
    setResults(calculateWaterBill(consumption, city, category));
  }, [consumption, city, category]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-KG', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleConsumptionChange = (value: number) => {
    setConsumption(Math.max(0, Math.min(500, value))); // Ограничение от 0 до 500 м³
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
  const currentTariff = WATER_TARIFFS[city].tariffs[category];

  // Расчет процентов для визуализации
  const waterPercentage = results.totalCost > 0 ? (results.waterCost / results.totalCost) * 100 : 0;
  const seweragePercentage = 100 - waterPercentage;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org микроразметка */}
      <Helmet>
        <title>{t('water_calc_title')} - Calk.KG</title>
        <meta name="description" content={t('water_calc_subtitle')} />
        <meta name="keywords" content={t('water_keywords')} />
        <meta property="og:title" content={`${t('water_calc_title')} - Calk.KG`} />
        <meta property="og:description" content={t('water_calc_subtitle')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/water" : "https://calk.kg/calculator/water"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/water.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('water_calc_title')} - Calk.KG`} />
        <meta name="twitter:description" content={t('water_calc_subtitle')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/water.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/water" : "https://calk.kg/calculator/water"} />
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
              <Droplets className="h-8 w-8 print:text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold print:text-2xl">{t('water_calc_title')}</h1>
              <p className="text-red-100 text-lg print:text-gray-600">{t('water_calc_subtitle')}</p>
            </div>
          </div>
          
          {/* Current Location */}
          <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3 print:hidden">
            <MapPin className="h-5 w-5 text-blue-200" />
            <span className="text-blue-100 text-sm">
              {t('water_current_region')} {t(WATER_TARIFFS[city].nameKey as any)} • {t(currentTariff.nameKey as any)}
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
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('water_calculation_params')}</h2>

              {/* City Selection */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('water_city_region')}
                  </label>
                  <Tooltip text={t('water_city_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value as City)}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg print:text-base"
                >
                  {Object.entries(WATER_TARIFFS).map(([key, cityData]) => (
                    <option key={key} value={key}>{t(cityData.nameKey as any)}</option>
                  ))}
                </select>
              </div>

              {/* Consumer Category */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('water_consumer_category')}
                  </label>
                  <Tooltip text={t('water_category_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ConsumerCategory)}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg print:text-base"
                >
                  {Object.entries(WATER_TARIFFS[city].tariffs).map(([key, tariff]) => (
                    <option key={key} value={key}>{t(tariff.nameKey as any)}</option>
                  ))}
                </select>
              </div>

              {/* Consumption Slider */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <label className="block text-sm font-medium text-gray-700">
                      {t('water_monthly_consumption')}
                    </label>
                    <Tooltip text={t('water_consumption_tooltip')}>
                      <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                    </Tooltip>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{consumption}</span>
                </div>

                {/* Slider */}
                <div className="mb-4">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="1"
                    value={consumption}
                    onChange={(e) => handleConsumptionChange(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>250</span>
                    <span>500 {t('water_cubic_meters')}</span>
                  </div>
                </div>

                {/* Number Input */}
                <div className="mt-4">
                  <input
                    type="number"
                    value={consumption}
                    onChange={(e) => handleConsumptionChange(parseInt(e.target.value) || 0)}
                    min="0"
                    max="500"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-center text-lg"
                  />
                </div>
              </div>

              {/* Current Tariff Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-2">{t('text_current_tariffs_for')} {t(WATER_TARIFFS[city].nameKey as any)}:</p>
                    <div className="space-y-1">
                      <p>• {t('water_cold_water')}: {formatCurrency(currentTariff.water)} {t('water_som_per_cubic')}</p>
                      {currentTariff.sewerage > 0 ? (
                        <p>• {t('water_sewerage')}: {formatCurrency(currentTariff.sewerage)} {t('water_som_per_cubic')}</p>
                      ) : (
                        <p>• {t('water_sewerage')}: {t('water_sewerage_included')}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-8 print:shadow-none print:border print:break-inside-avoid">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">{t('water_bill_details')}</h2>
                {results.totalCost > 0 && (
                  <ActionButtons
                    calculatorName={t('water_calc_name_full')}
                    resultText={`${t('water_results_title')}
${t('water_city')} ${t(WATER_TARIFFS[city].nameKey as any)}
${t('water_category')} ${t(currentTariff.nameKey as any)}
${t('water_consumption')} ${consumption} ${t('water_cubic_meters')}
${t('water_cold_water_cost')} ${formatCurrency(results.waterCost)} ${t('water_som')}
${t('water_sewerage_cost')} ${formatCurrency(results.sewerageeCost)} ${t('water_som')}
${t('water_monthly_payment')} ${formatCurrency(results.totalCost)} ${t('water_som')}

${t('water_calculated_on')}`}
                  />
                )}
              </div>
              
              {results.totalCost > 0 ? (
                <div className="space-y-6">
                  {/* Total Cost - Main Result */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 text-white text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Droplets className="h-6 w-6 mr-2" />
                      <span className="text-blue-100">{t('water_monthly_payment')}</span>
                    </div>
                    <p className="text-5xl font-bold mb-2">
                      {formatCurrency(results.totalCost)} {t('water_som')}
                    </p>
                    <p className="text-blue-100">
                      {consumption} {t('water_cubic_meters')} • {t(WATER_TARIFFS[city].nameKey as any)}
                    </p>
                  </div>

                  {/* Service Structure Visualization */}
                  {results.sewerageeCost > 0 && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        {t('water_payment_structure')}
                      </h3>
                      <div className="space-y-4">
                        {/* Water Cost Bar */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">{t('water_cold_water_full')}</span>
                            <span className="text-sm font-medium text-blue-600">
                              {waterPercentage.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${waterPercentage}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Sewerage Cost Bar */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">{t('water_sewerage_full')}</span>
                            <span className="text-sm font-medium text-cyan-600">
                              {seweragePercentage.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${seweragePercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Detailed Breakdown */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700 text-lg">{t('water_bill_breakdown')}</h3>
                    
                    {/* Consumption Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 font-medium">{t('water_monthly_consumption_label')}</span>
                        <span className="text-xl font-semibold text-gray-900">
                          {results.consumption} {t('water_cubic_meters')}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {t('water_city')} {t(WATER_TARIFFS[city].nameKey as any)} • {t('water_category')} {t(currentTariff.nameKey as any)}
                      </div>
                    </div>

                    {/* Water Cost */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <span className="text-gray-700">{t('water_cold_water_label')}</span>
                          <Tooltip text={t('water_cold_water_tooltip')}>
                            <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-blue-600 font-semibold text-lg">
                          {formatCurrency(results.waterCost)} {t('water_som')}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {consumption} {t('water_cubic_meters')} × {formatCurrency(results.waterRate)} {t('water_som_per_cubic')} = {formatCurrency(results.waterCost)} {t('water_som')}
                      </div>
                    </div>

                    {/* Sewerage Cost */}
                    {results.sewerageeCost > 0 ? (
                      <div className="bg-cyan-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <span className="text-gray-700">{t('water_sewerage_wastewater')}</span>
                            <Tooltip text={t('water_sewerage_tooltip')}>
                              <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                            </Tooltip>
                          </div>
                          <span className="text-cyan-600 font-semibold text-lg">
                            {formatCurrency(results.sewerageeCost)} {t('water_som')}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {consumption} {t('water_cubic_meters')} × {formatCurrency(results.sewerageRate)} {t('water_som_per_cubic')} = {formatCurrency(results.sewerageeCost)} {t('water_som')}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <Info className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700 font-medium">
                            {t('water_sewerage_included_tariff')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-700 mb-3">{t('summary')}</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>{t('city_label')}</span>
                        <span>{t(WATER_TARIFFS[city].nameKey as any)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('category_label')}</span>
                        <span>{t(currentTariff.nameKey as any)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('consumption_label')}</span>
                        <span>{consumption} {t('cubic_meter')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('text_average_tariff')}:</span>
                        <span>
                          {consumption > 0 ? formatCurrency(results.totalCost / consumption) : 0} {t('som_per_cubic')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <Droplets className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">{t('set_consumption_for_calculation')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="mt-12 space-y-12">
          {/* Regional Comparison */}
          {results.totalCost > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
              <div className="flex items-center mb-6">
                <MapPin className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {t('compare_regional_tariffs')}
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('city_region')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('water_water_tariff')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('water_sewerage_tariff')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('cost_for')} {consumption} {t('cubic_meter')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Current Selection */}
                    <tr className="bg-green-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {t(WATER_TARIFFS[city].nameKey as any)} <span className="text-xs text-gray-500">{t('your_choice')}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {formatCurrency(currentTariff.water)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {currentTariff.sewerage > 0 ? formatCurrency(currentTariff.sewerage) : t('included')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {formatCurrency(results.totalCost)} {t('som')}
                      </td>
                    </tr>
                    
                    {/* Other Cities */}
                    {Object.entries(WATER_TARIFFS)
                      .filter(([key]) => key !== city)
                      .map(([cityKey, cityData]) => {
                        const otherTariff = cityData.tariffs[category];
                        const otherResult = calculateWaterBill(consumption, cityKey as City, category);
                        const isCheaper = otherResult.totalCost < results.totalCost;
                        const isMoreExpensive = otherResult.totalCost > results.totalCost;
                        
                        return (
                          <tr key={cityKey} className={isCheaper ? 'bg-blue-50' : isMoreExpensive ? 'bg-red-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {t(cityData.nameKey as any)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(otherTariff.water)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {otherTariff.sewerage > 0 ? formatCurrency(otherTariff.sewerage) : t('included')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(otherResult.totalCost)} {t('som')}
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
                    <span>{t('cheaper_tariffs')}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-50 border border-red-200 rounded mr-2"></div>
                    <span>{t('more_expensive_tariffs')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Examples */}
          <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
            <h3 className="font-medium text-gray-900 mb-4">{t('typical_consumption_examples')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { consumption: 5, labelKey: 'single_resident', category: 'population' as ConsumerCategory },
                { consumption: 15, labelKey: 'family_3_4_people', category: 'population' as ConsumerCategory },
                { consumption: 25, labelKey: 'large_family', category: 'population' as ConsumerCategory },
                { consumption: 50, labelKey: 'small_business', category: 'commercial' as ConsumerCategory }
              ].map((example, index) => {
                const exampleResult = calculateWaterBill(example.consumption, city, example.category);
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
                        {t(example.labelKey)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {example.consumption} {t('cubic_meter')}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-600 font-semibold">
                        {formatCurrency(exampleResult.totalCost)} {t('som')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatCurrency(exampleResult.totalCost / example.consumption)} {t('som_per_cubic')}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Other Calculators */}
          <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
            <h3 className="font-medium text-gray-900 mb-4">{t('other_calculators')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to={getLocalizedPath('/calculator/electricity')}
                className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-50 p-2 rounded-lg group-hover:bg-amber-100 transition-colors">
                    <Zap className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('electricity_calc_name')}</div>
                    <div className="text-sm text-gray-500">{t('electricity_calc_title')}</div>
                  </div>
                </div>
              </Link>
              <Link
                to={getLocalizedPath('/calculator/gas')}
                className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-50 p-2 rounded-lg group-hover:bg-orange-100 transition-colors">
                    <Flame className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('gas_calc_name')}</div>
                    <div className="text-sm text-gray-500">{t('gas_calc_title')}</div>
                  </div>
                </div>
              </Link>
              <Link
                to={getLocalizedPath('/calculator/heating')}
                className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-50 p-2 rounded-lg group-hover:bg-amber-100 transition-colors">
                    <Flame className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('heating_calc_name')}</div>
                    <div className="text-sm text-gray-500">{t('heating_calc_title')}</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Educational Content Section - Russian only */}
          {language === 'ru' && (
          <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('water_guide_title')}</h2>

            {/* Section 1: Understanding Water Tariffs */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('water_tariff_formation')}</h3>
              <p className="text-gray-700 mb-4">
                {t('water_tariff_formation_text')}
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <p className="text-gray-700">
                  <strong>{t('text_important')}:</strong> В большинстве городов КР действует двухкомпонентный тариф:
                  отдельно за холодное водоснабжение и отдельно за водоотведение (канализацию).
                </p>
              </div>
              <p className="text-gray-700">
                {t('water_volume_details')}
              </p>
            </div>

            {/* Section 2: Tariff Categories */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('water_consumer_categories')}</h3>

              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">1. {t('water_category_population')}</h4>
                  <p className="text-gray-700 text-sm mb-3">
                    {t('water_category_population_desc')}
                  </p>
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-sm text-gray-700 mb-2"><strong>{t('water_examples_for_population')}</strong></p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• {t('water_bishkek_example')}</li>
                      <li>• {t('water_osh_example')}</li>
                      <li>• {t('water_karakol_example')}</li>
                    </ul>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">2. {t('water_category_budget')}</h4>
                  <p className="text-gray-700 text-sm mb-3">
                    {t('water_category_budget_desc')}
                  </p>
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-sm text-gray-600">
                      {t('water_budget_tariffs')}
                    </p>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">3. {t('water_category_commercial')}</h4>
                  <p className="text-gray-700 text-sm mb-3">
                    {t('water_category_commercial_desc')}
                  </p>
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-sm text-gray-600">
                      {t('water_commercial_tariffs')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Water Meters */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('water_meters_title')}</h3>

              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-3">{t('water_why_meter')}</h4>
                  <div className="bg-green-50 rounded p-4 mb-3">
                    <p className="text-gray-700 mb-2"><strong>{t('water_save_up_to')}</strong></p>
                    <p className="text-sm text-gray-600">
                      {t('water_no_meter_calc')}
                    </p>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li><strong>{t('water_without_meter')}</strong> {t('water_example_without_meter')}</li>
                    <li><strong>{t('water_with_meter')}</strong> {t('water_example_with_meter')}</li>
                    <li className="text-green-600 font-medium">{t('water_saving')}</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-3">{t('water_install_title')}</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><strong>{t('water_step1')}</strong> {t('water_step1_desc')}</p>
                    <p><strong>{t('water_step2')}</strong> {t('water_step2_desc')}</p>
                    <p><strong>{t('water_step3')}</strong> {t('water_step3_desc')}</p>
                    <p><strong>{t('water_step4')}</strong> {t('water_step4_desc')}</p>
                  </div>
                  <div className="bg-blue-50 rounded p-3 mt-3">
                    <p className="text-xs text-gray-600">
                      <strong>{t('water_payback')}</strong> {t('water_payback_desc')}
                    </p>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-3">{t('water_readings_title')}</h4>
                  <div className="bg-gray-50 rounded p-4">
                    <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
                      <li>{t('water_readings_step1')}</li>
                      <li>{t('water_readings_step2')}</li>
                      <li>{t('water_readings_step3')}</li>
                      <li>{t('water_readings_step4')}</li>
                      <li>{t('water_readings_step5')}</li>
                    </ol>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    <p><strong>{t('text_example')}:</strong> {t('text_current_readings')} 00847, {t('text_previous_readings')} 00832 → {t('text_consumption')}: {t('water_15_m3')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Water Saving */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('water_saving_tips')}</h3>

              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900 mb-1">{t('water_tip1_title')}</h4>
                  <p className="text-gray-700 text-sm">
                    {t('water_tip1_text')}
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900 mb-1">{t('water_tip2_title')}</h4>
                  <p className="text-gray-700 text-sm">
                    {t('water_tip2_text')}
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900 mb-1">{t('water_tip3_title')}</h4>
                  <p className="text-gray-700 text-sm">
                    {t('water_tip3_text')}
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900 mb-1">{t('water_tip4_title')}</h4>
                  <p className="text-gray-700 text-sm">
                    {t('water_tip4_text')}
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900 mb-1">{t('water_tip5_title')}</h4>
                  <p className="text-gray-700 text-sm">
                    {t('water_tip5_text')}
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900 mb-1">{t('water_tip6_title')}</h4>
                  <p className="text-gray-700 text-sm">
                    {t('water_tip6_text')}
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900 mb-1">{t('water_tip7_title')}</h4>
                  <p className="text-gray-700 text-sm">
                    {t('water_tip7_text')}
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900 mb-1">{t('water_tip8_title')}</h4>
                  <p className="text-gray-700 text-sm">
                    {t('water_tip8_text')}
                  </p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-5 mt-4">
                <p className="text-gray-700">
                  <strong>{t('water_total_savings')}</strong> {t('water_total_savings_desc')}
                  расход воды на 30-40%, что составляет 50-100 сомов в месяц или 600-1200 сомов в год!
                </p>
              </div>
            </div>

            {/* Section 5: FAQ */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('water_faq_title')}</h3>

              <div className="space-y-4">
                <details className="border border-gray-200 rounded-lg p-5 cursor-pointer hover:bg-gray-50">
                  <summary className="font-semibold text-gray-900">
                    Что делать, если счетчик неисправен?
                  </summary>
                  <p className="text-gray-700 mt-3 text-sm">
                    Сообщите в водоканал в течение 3 дней. До замены счетчика расчет будет вестись
                    по среднему потреблению за последние 6 месяцев. Замена счетчика производится
                    за счет владельца жилья. Стоимость: 2000-4000 сом (счетчик + установка + опломбировка).
                  </p>
                </details>

                <details className="border border-gray-200 rounded-lg p-5 cursor-pointer hover:bg-gray-50">
                  <summary className="font-semibold text-gray-900">
                    Как часто нужно поверять счетчик?
                  </summary>
                  <p className="text-gray-700 mt-3 text-sm">
                    Холодная вода: каждые 6 лет. Горячая вода: каждые 4 года. Дата следующей поверки
                    указана в паспорте счетчика. Поверку проводят аккредитованные организации.
                    Стоимость: 500-1000 сом. Без своевременной поверки счетчик считается неисправным.
                  </p>
                </details>

                <details className="border border-gray-200 rounded-lg p-5 cursor-pointer hover:bg-gray-50">
                  <summary className="font-semibold text-gray-900">
                    Можно ли получить льготы на воду?
                  </summary>
                  <p className="text-gray-700 mt-3 text-sm">
                    Да, льготы предоставляются: ветеранам ВОВ и труда (50% скидка), инвалидам 1-2 группы
                    (30-50%), многодетным семьям (в некоторых регионах). Для получения льготы обратитесь
                    в отдел соцзащиты по месту жительства со справками, затем в водоканал.
                  </p>
                </details>

                <details className="border border-gray-200 rounded-lg p-5 cursor-pointer hover:bg-gray-50">
                  <summary className="font-semibold text-gray-900">
                    Могут ли отключить воду за неуплату?
                  </summary>
                  <p className="text-gray-700 mt-3 text-sm">
                    Да, при задолженности за 2-3 месяца. Перед отключением направляется письменное
                    уведомление за 10 дней. Исключения: семьи с детьми до 3 лет, инвалидами 1 группы,
                    в период карантина. Для возобновления подачи погасите долг и оплатите повторное
                    подключение (обычно 200-500 сом).
                  </p>
                </details>

                <details className="border border-gray-200 rounded-lg p-5 cursor-pointer hover:bg-gray-50">
                  <summary className="font-semibold text-gray-900">
                    Почему вода мутная или с запахом?
                  </summary>
                  <p className="text-gray-700 mt-3 text-sm">
                    Причины: профилактика/ремонт водопровода (временно), старые трубы в доме (ржавчина),
                    повышенное содержание хлора (обеззараживание). Решения: установите фильтры, дайте
                    воде отстояться 2-3 часа, обратитесь в водоканал для проверки качества. Экстренная
                    линия водоканала: 150 (Бишкек).
                  </p>
                </details>

                <details className="border border-gray-200 rounded-lg p-5 cursor-pointer hover:bg-gray-50">
                  <summary className="font-semibold text-gray-900">
                    Сколько воды потребляет средняя семья?
                  </summary>
                  <div className="text-gray-700 mt-3 text-sm">
                    <p className="mb-2">{t('water_avg_consumption')}</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-gray-600">
                      <li>{t('water_person1')}</li>
                      <li>{t('water_person2')}</li>
                      <li>{t('water_person3')}</li>
                      <li>{t('water_person4')}</li>
                      <li>{t('water_person5')}</li>
                    </ul>
                    <p className="mt-2 text-xs">{t('water_calc_for_bishkek')}</p>
                  </div>
                </details>

                <details className="border border-gray-200 rounded-lg p-5 cursor-pointer hover:bg-gray-50">
                  <summary className="font-semibold text-gray-900">
                    Как проверить правильность начислений?
                  </summary>
                  <p className="text-gray-700 mt-3 text-sm">
                    {t('text_formula')}: ({t('text_current_readings')} - {t('text_previous_readings')}) × тариф = {t('text_sum_to_pay')}.
                    {t('text_example')}: (847 - 832) × 11,35 = 15 × 11,35 = 170,25 сом. Сверьте с квитанцией.
                    При расхождении обратитесь в водоканал с заявлением о перерасчете, приложите
                    копии квитанций и фото показаний счетчика.
                  </p>
                </details>
              </div>
            </div>

            {/* Section 6: Contact Info */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('water_contacts_title')}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{t('water_contact_bishkek')}</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>☎ {t('water_hotline')}</p>
                    <p>☎ +996 (312) 66-11-00</p>
                    <p>📍 {t('water_bishkek_address')}</p>
                    <p>🌐 vodokanal.kg</p>
                    <p>📱 {t('water_app')}</p>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{t('water_contact_osh')}</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>☎ +996 (3222) 5-26-65</p>
                    <p>📍 {t('water_osh_address')}</p>
                    <p>⏰ Пн-Пт: 8:00-17:00</p>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{t('water_contact_karakol')}</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>☎ +996 (3922) 5-00-71</p>
                    <p>📍 {t('water_karakol_address')}</p>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{t('water_contact_jalalabad')}</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>☎ +996 (3722) 5-18-94</p>
                    <p>📍 {t('water_jalalabad_address')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

          {/* Tariff Matrix Display */}
          <div className="bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
            <h3 className="font-medium text-gray-900 mb-6">{t('water_tariffs_title')}</h3>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('city_label').replace(':', '')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('population_water')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('population_sewerage')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('enterprises_water')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('enterprises_sewerage')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(WATER_TARIFFS).map(([cityKey, cityData]) => (
                    <tr key={cityKey} className={cityKey === city ? 'bg-green-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {t(cityData.nameKey as any)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(cityData.tariffs.population.water)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cityData.tariffs.population.sewerage > 0 ?
                          formatCurrency(cityData.tariffs.population.sewerage) :
                          t('included')
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(cityData.tariffs.commercial.water)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cityData.tariffs.commercial.sewerage > 0 ?
                          formatCurrency(cityData.tariffs.commercial.sewerage) :
                          t('included')
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              <p className="font-medium mb-2">{t('water_important_info')}</p>
              <p className="mb-2">
                <strong>{t('water_tariffs_actual')} {currentMonth}.</strong> {t('water_preliminary_calc')}
              </p>
              <p>
                {t('water_for_exact_info')}
              </p>
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
          background: #2563eb;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #2563eb;
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

export default WaterCalculatorPage;