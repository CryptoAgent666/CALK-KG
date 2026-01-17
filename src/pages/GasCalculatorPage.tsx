import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Info, Home, Printer, Flame, TrendingUp, Zap, Droplets } from 'lucide-react';
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

// Актуальные тарифы на природный газ в Кыргызстане (2024-2026)
// Источник: ОАО "Кыргызгаз", Госагентство по регулированию ТЭК
const TARIFF_CONFIG = {
  'residential': {
    nameKey: 'tariff_population',
    rate: 14.50,
    descriptionKey: 'gas_desc_residential'
  },
  'residential_heating': {
    nameKey: 'tariff_population_heating',
    rate: 11.60,
    descriptionKey: 'gas_desc_residential_heating'
  },
  'commercial': {
    nameKey: 'tariff_commercial',
    rate: 18.30,
    descriptionKey: 'gas_desc_commercial'
  },
  'industrial': {
    nameKey: 'tariff_industrial',
    rate: 16.80,
    descriptionKey: 'gas_desc_industrial'
  }
};

type ConsumerCategory = 'residential' | 'residential_heating' | 'commercial' | 'industrial';

interface GasResults {
  consumption: number;
  totalCost: number;
  averageRate: number;
}

const GasCalculatorPage = () => {
  const { t, language, getLocalizedPath} = useLanguage();

  React.useEffect(() => {
    document.title = t('gas_calc_title') + " - Calk.KG";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('gas_calc_description'));
    }
  }, [t]);

  const [consumption, setConsumption] = useState<number>(100);
  const [category, setCategory] = useState<ConsumerCategory>('residential');

  const [results, setResults] = useState<GasResults>({
    consumption: 0,
    totalCost: 0,
    averageRate: 0
  });

  // Расчёт стоимости газа (без сезонных коэффициентов - тарифы фиксированные)
  const calculateGas = (m3: number, categoryType: ConsumerCategory): GasResults => {
    if (m3 <= 0) {
      return {
        consumption: 0,
        totalCost: 0,
        averageRate: 0
      };
    }

    const tariff = TARIFF_CONFIG[categoryType];
    const totalCost = m3 * tariff.rate;

    return {
      consumption: m3,
      totalCost,
      averageRate: tariff.rate
    };
  };

  useEffect(() => {
    setResults(calculateGas(consumption, category));
  }, [consumption, category]);

  const generateSchemas = () => {
    const currentUrl = language === 'ky' ? "https://calk.kg/ky/calculator/gas" : "https://calk.kg/calculator/gas";
    const homeUrl = language === 'ky' ? "https://calk.kg/ky" : "https://calk.kg";

    const calculatorSchema = generateCalculatorSchema({
      url: currentUrl,
      title: t('gas_calc_title'),
      description: t('gas_calc_subtitle'),
      calculatorName: t('gas_calc_title'),
      category: t('nav_utilities'),
      language,
      inputProperties: ["consumption", "category"],
      outputProperties: ["monthlyCost", "averageRate"]
    });

    const softwareSchema = generateSoftwareApplicationSchema({
      url: currentUrl,
      title: t('gas_calc_title'),
      description: t('gas_calc_subtitle'),
      calculatorName: t('gas_calc_title'),
      category: "UtilityApplication",
      inputProperties: [t('gas_consumption'), t('gas_category')],
      outputProperties: [t('gas_monthly_cost'), t('gas_average_rate')]
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: homeUrl },
      { name: t('nav_utilities'), url: `${homeUrl}?category=utilities` },
      { name: t('gas_calc_title'), url: currentUrl }
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
    setConsumption(Math.max(0, Math.min(1000, value)));
  };

  const handlePrint = () => {
    window.print();
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{t('gas_calc_title')} - Calk.KG</title>
        <meta name="description" content={t('gas_calc_subtitle')} />
        <meta name="keywords" content={t('gas_calc_keywords')} />
        <meta property="og:title" content={`${t('gas_calc_title')} - Calk.KG`} />
        <meta property="og:description" content={t('gas_calc_subtitle')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/gas" : "https://calk.kg/calculator/gas"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/gas.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('gas_calc_title')} - Calk.KG`} />
        <meta name="twitter:description" content={t('gas_calc_subtitle')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/gas.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/gas" : "https://calk.kg/calculator/gas"} />
      </Helmet>
      <HreflangTags path="/calculator/gas" />
      {generateSchemas().map((schema, index) => (
        <SchemaMarkup key={index} schema={schema} />
      ))}

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

      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white print:bg-white print:text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 print:py-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white/20 p-3 rounded-lg print:bg-red-100">
              <Flame className="h-8 w-8 print:text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold print:text-2xl">{t('gas_calc_title')}</h1>
              <p className="text-red-100 text-lg print:text-gray-600">{t('gas_calc_subtitle')}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3 print:hidden">
            <Info className="h-5 w-5 text-amber-200" />
            <span className="text-amber-100 text-sm">
              {t('info_current_month_tariffs')} {currentMonth}. {t('info_calculation_preliminary')}.
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 print:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 print:gap-6">
          <div className="space-y-8 print:break-inside-avoid">
            <div className="bg-white rounded-xl shadow-sm p-8 print:shadow-none print:border">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('calc_parameters')}</h2>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <label className="block text-sm font-medium text-gray-700">
                      {t('gas_consumption')}
                    </label>
                    <Tooltip text={t('gas_consumption_tooltip')}>
                      <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                    </Tooltip>
                  </div>
                  <span className="text-2xl font-bold text-red-600">{consumption}</span>
                </div>

                <div className="mb-4">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="5"
                    value={consumption}
                    onChange={(e) => handleConsumptionChange(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>0 {t('unit_m3')}</span>
                    <span>500 {t('unit_m3')}</span>
                    <span>1000 {t('unit_m3')}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {[50, 100, 200, 500].map(value => (
                    <button
                      key={value}
                      onClick={() => setConsumption(value)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-red-400 hover:bg-red-50 transition-colors"
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('gas_category')}
                  </label>
                  <Tooltip text={t('gas_category_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ConsumerCategory)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                >
                  {Object.entries(TARIFF_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>
                      {t(config.nameKey)} ({config.rate} {t('unit_som_m3')})
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 print:break-inside-avoid">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-2">{t('gas_info_title')}</p>
                  <ul className="space-y-1 text-blue-800">
                    <li>• {t('gas_info_1')}</li>
                    <li>• {t('gas_info_2')}</li>
                    <li>• {t('gas_info_3')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">{t('calc_results')}</h2>
                <button
                  onClick={handlePrint}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors print:hidden"
                >
                  <Printer className="h-5 w-5" />
                  <span className="text-sm">{t('print')}</span>
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-red-100">{t('gas_monthly_cost')}:</span>
                    <Flame className="h-6 w-6 text-red-200" />
                  </div>
                  <div className="text-4xl font-bold mb-2">
                    {formatCurrency(results.totalCost)} {t('som')}
                  </div>
                  <div className="text-sm text-red-100">
                    {t('for')} {consumption} {t('m3_per_month')}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">{t('gas_consumption')}:</span>
                    <span className="font-semibold text-gray-900">{consumption} {t('unit_m3')}</span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">{t('gas_base_tariff')}:</span>
                    <span className="font-semibold text-gray-900">{currentTariff.rate} {t('unit_som_m3')}</span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">{t('gas_category')}:</span>
                    <span className="font-semibold text-gray-900">{t(currentTariff.nameKey)}</span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">{t('gas_calculation_formula')}:</span>
                    <span className="font-semibold text-gray-900">{consumption} × {currentTariff.rate} = {formatCurrency(results.totalCost)}</span>
                  </div>

                  <div className="flex justify-between items-center py-3 bg-red-50 rounded-lg px-4">
                    <span className="font-semibold text-gray-900">{t('total_payment')}:</span>
                    <span className="text-2xl font-bold text-red-600">{formatCurrency(results.totalCost)} {t('som')}</span>
                  </div>

                  <div className="flex justify-between items-center py-3 bg-blue-50 rounded-lg px-4">
                    <span className="text-gray-700">{t('annual_cost')}:</span>
                    <span className="font-semibold text-blue-600">{formatCurrency(results.totalCost * 12)} {t('som')}</span>
                  </div>
                </div>
              </div>
            </div>

            <ActionButtons onPrint={handlePrint} />
          </div>
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
          <h3 className="font-medium text-gray-900 mb-6">{t('gas_tariff_table')}</h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('consumer_category')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('tariff')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('cost_for_100_m3')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('cost_for_500_m3')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(TARIFF_CONFIG).map(([key, config]) => {
                  const isCurrentCategory = key === category;
                  const cost100 = 100 * config.rate;
                  const cost500 = 500 * config.rate;

                  return (
                    <tr key={key} className={isCurrentCategory ? 'bg-red-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {t(config.nameKey)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {config.rate} {t('unit_som_m3')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(cost100)} {t('som')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(cost500)} {t('som')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Источник тарифов */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>{t('tariff_source')}:</strong> ОАО «Кыргызгаз», {t('tariffs_actual')} {currentMonth}.
              {' '}
              <a 
                href="https://kyrgyzgaz.kg" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-700 underline"
              >
                kyrgyzgaz.kg →
              </a>
            </p>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-sm p-8 print:hidden">
          <h3 className="font-medium text-gray-900 mb-4">{t('other_calculators')}:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to={getLocalizedPath("/calculator/electricity")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-50 p-2 rounded-lg group-hover:bg-yellow-100 transition-colors">
                  <Zap className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-red-600">{t('electricity_calc_title')}</div>
                  <div className="text-sm text-gray-500">{t('utilities_electricity')}</div>
                </div>
              </div>
            </Link>
            <Link
              to={getLocalizedPath("/calculator/water")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <Droplets className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-red-600">{t('water_calc_title')}</div>
                  <div className="text-sm text-gray-500">{t('utilities_water')}</div>
                </div>
              </div>
            </Link>
            <Link
              to={getLocalizedPath("/calculator/heating")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-orange-50 p-2 rounded-lg group-hover:bg-orange-100 transition-colors">
                  <Flame className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-red-600">{t('heating_calc_title')}</div>
                  <div className="text-sm text-gray-500">{t('utilities_heating')}</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-yellow-50 border-t border-yellow-200 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-2">{t('legal_notice')}</p>
              <ul className="space-y-1">
                <li>• {t('gas_notice_1')}</li>
                <li>• {t('gas_notice_2')}</li>
                <li>• {t('gas_notice_3')}</li>
                <li>• {t('gas_notice_4')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GasCalculatorPage;
