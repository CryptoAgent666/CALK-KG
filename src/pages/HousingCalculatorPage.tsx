import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Info, Home, Printer, Building, MapPin, TrendingUp, DollarSign, Car, Receipt, CreditCard } from 'lucide-react';
import ActionButtons from '../components/ActionButtons';
import SchemaMarkup from '../components/SchemaMarkup';
import HreflangTags from '../components/HreflangTags';
import { useLanguage } from '../contexts/LanguageContext';
import {
  generateCalculatorSchema,
  generateBreadcrumbSchema
} from '../utils/schemaGenerator';
import { formatCurrentMonth } from '../utils/dateFormatter';

const getCityPrices = (t: (key: string) => string) => ({
  'bishkek': {
    name: t('city_bishkek'),
    prices: {
      'buy-apartment': 105000,
      'buy-house': 146000,
      'build-house': 95000
    }
  },
  'osh': {
    name: t('city_osh'),
    prices: {
      'buy-apartment': 88000,
      'buy-house': 115000,
      'build-house': 78000
    }
  },
  'cholpon-ata': {
    name: t('city_cholpon_ata'),
    prices: {
      'buy-apartment': 120000,
      'buy-house': 160000,
      'build-house': 105000
    }
  },
  'jalal-abad': {
    name: t('city_jalal_abad'),
    prices: {
      'buy-apartment': 75000,
      'buy-house': 98000,
      'build-house': 68000
    }
  },
  'karakol': {
    name: t('city_karakol'),
    prices: {
      'buy-apartment': 85000,
      'buy-house': 110000,
      'build-house': 72000
    }
  },
  'tokmok': {
    name: t('city_tokmok'),
    prices: {
      'buy-apartment': 65000,
      'buy-house': 85000,
      'build-house': 58000
    }
  },
  'naryn': {
    name: t('city_naryn'),
    prices: {
      'buy-apartment': 55000,
      'buy-house': 72000,
      'build-house': 48000
    }
  },
  'talas': {
    name: t('city_talas'),
    prices: {
      'buy-apartment': 60000,
      'buy-house': 78000,
      'build-house': 52000
    }
  },
  'batken': {
    name: t('city_batken'),
    prices: {
      'buy-apartment': 50000,
      'buy-house': 65000,
      'build-house': 45000
    }
  },
  'kant': {
    name: t('city_kant'),
    prices: {
      'buy-apartment': 70000,
      'buy-house': 90000,
      'build-house': 62000
    }
  },
  'kara-balta': {
    name: t('city_kara_balta'),
    prices: {
      'buy-apartment': 68000,
      'buy-house': 88000,
      'build-house': 60000
    }
  },
  'balykchy': {
    name: t('city_balykchy'),
    prices: {
      'buy-apartment': 72000,
      'buy-house': 92000,
      'build-house': 63000
    }
  }
});

type City = 'bishkek' | 'osh' | 'cholpon-ata' | 'jalal-abad' | 'karakol' | 'tokmok' | 'naryn' | 'talas' | 'batken' | 'kant' | 'kara-balta' | 'balykchy';
type OperationType = 'buy-apartment' | 'buy-house' | 'build-house';

interface HousingResults {
  city: string;
  operationType: string;
  area: number;
  pricePerMeter: number;
  totalCost: number;
  hasData: boolean;
}

const HousingCalculatorPage = () => {
  const { language, t, getLocalizedPath} = useLanguage();
  const HOUSING_PRICES = getCityPrices(t);

  // Генерация схем для страницы калькулятора жилья
  const generateSchemas = () => {
    const currentUrl = language === 'ky' ? "https://calk.kg/ky/calculator/housing" : "https://calk.kg/calculator/housing";
    const homeUrl = language === 'ky' ? "https://calk.kg/ky" : "https://calk.kg";
    
    const calculatorSchema = generateCalculatorSchema({
      url: currentUrl,
      title: t('housing_calc_title'),
      description: t('housing_calc_subtitle'),
      calculatorName: t('housing_calc_title'),
      category: t('nav_construction'),
      language,
      inputProperties: ["operationType", "city", "area"],
      outputProperties: ["totalCost", "pricePerMeter"]
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: homeUrl },
      { name: t('nav_construction'), url: `${homeUrl}?category=construction` },
      { name: t('housing_calc_title'), url: currentUrl }
    ]);

    return [calculatorSchema, breadcrumbSchema];
  };
  React.useEffect(() => {
    document.title = t('housing_calc_title') + " - Calk.KG";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('housing_calc_description'));
    }
  }, [t]);

  const [selectedCity, setSelectedCity] = useState<City>('bishkek');
  const [operationType, setOperationType] = useState<OperationType>('buy-apartment');
  const [area, setArea] = useState<string>('');
  
  const [results, setResults] = useState<HousingResults>({
    city: '',
    operationType: '',
    area: 0,
    pricePerMeter: 0,
    totalCost: 0,
    hasData: false
  });

  const operationOptions = [
    {
      id: 'buy-apartment' as OperationType,
      title: t('housing_buy_apartment'),
      description: t('housing_buy_apartment_desc'),
      icon: '🏢'
    },
    {
      id: 'buy-house' as OperationType,
      title: t('housing_buy_house'),
      description: t('housing_buy_house_desc'),
      icon: '🏠'
    },
    {
      id: 'build-house' as OperationType,
      title: t('housing_build_house'),
      description: t('housing_build_house_desc'),
      icon: '🏗️'
    }
  ];

  // Расчет стоимости жилья
  const calculateHousingCost = (
    city: City,
    operation: OperationType,
    squareMeters: number
  ): HousingResults => {
    if (squareMeters <= 0) {
      return {
        city: HOUSING_PRICES[city].name,
        operationType: operationOptions.find(op => op.id === operation)?.title || '',
        area: squareMeters,
        pricePerMeter: HOUSING_PRICES[city].prices[operation],
        totalCost: 0,
        hasData: false
      };
    }

    const pricePerMeter = HOUSING_PRICES[city].prices[operation];
    const totalCost = squareMeters * pricePerMeter;

    return {
      city: HOUSING_PRICES[city].name,
      operationType: operationOptions.find(op => op.id === operation)?.title || '',
      area: squareMeters,
      pricePerMeter,
      totalCost,
      hasData: true
    };
  };

  // Обновление результатов при изменении параметров
  useEffect(() => {
    const areaNum = parseFloat(area);
    if (!isNaN(areaNum) && areaNum > 0) {
      const result = calculateHousingCost(selectedCity, operationType, areaNum);
      setResults(result);
    } else {
      setResults(prev => ({ ...prev, hasData: false }));
    }
  }, [selectedCity, operationType, area]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-KG', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setArea(value);
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
  const currentCityData = HOUSING_PRICES[selectedCity];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org микроразметка */}
      <Helmet>
        <title>{t('housing_calc_title')} - Calk.KG</title>
        <meta name="description" content={t('housing_calc_subtitle')} />
        <meta name="keywords" content={t('housing_keywords')} />
        <meta property="og:title" content={`${t('housing_calc_title')} - Calk.KG`} />
        <meta property="og:description" content={t('housing_calc_subtitle')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/housing" : "https://calk.kg/calculator/housing"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/housing.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('housing_calc_title')} - Calk.KG`} />
        <meta name="twitter:description" content={t('housing_calc_subtitle')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/housing.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/housing" : "https://calk.kg/calculator/housing"} />
      </Helmet>
      <HreflangTags path="/calculator/housing" />
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
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white print:bg-white print:text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 print:py-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="bg-white/20 p-4 rounded-xl print:bg-blue-100">
                <Building className="h-10 w-10 print:text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 print:text-2xl">
              {t('housing_page_title')}
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed print:text-gray-600">
              {t('housing_page_subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Calculator */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 print:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 print:gap-6">
          
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 print:shadow-none print:border">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('housing_calc_params')}</h2>

            {/* Operation Type Selection */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <label className="block text-lg font-semibold text-gray-700">
                  {t('housing_operation_type')}
                </label>
                <Tooltip text={t('tooltip_housing_type')}>
                  <Info className="h-5 w-5 text-gray-400 ml-2 cursor-help" />
                </Tooltip>
              </div>
              <div className="space-y-3">
                {operationOptions.map((option) => (
                  <label 
                    key={option.id}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center space-x-4 ${
                      operationType === option.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="operationType"
                      value={option.id}
                      checked={operationType === option.id}
                      onChange={() => setOperationType(option.id)}
                      className="sr-only"
                    />
                    <div className="text-2xl">{option.icon}</div>
                    <div className="flex-1">
                      <span className="text-lg font-semibold text-gray-900">{option.title}</span>
                      <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                      <div className="text-sm font-medium text-blue-600 mt-2">
                        {formatCurrency(currentCityData.prices[option.id])} {t('housing_som')}/м²
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* City Selection */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <label className="block text-lg font-semibold text-gray-700">
                  {t('housing_city_region')}
                </label>
                <Tooltip text={t('tooltip_housing_city')}>
                  <Info className="h-5 w-5 text-gray-400 ml-2 cursor-help" />
                </Tooltip>
              </div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value as City)}
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/25 focus:border-blue-500 text-lg font-medium transition-all"
              >
                {Object.entries(HOUSING_PRICES).map(([key, cityData]) => (
                  <option key={key} value={key}>
                    {cityData.name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-2">
                {t('housing_avg_price')} {formatCurrency(currentCityData.prices[operationType])} {t('housing_som')}
              </p>
            </div>

            {/* Area Input */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <label className="block text-lg font-semibold text-gray-700">
                  {t('housing_desired_area')}
                </label>
                <Tooltip text={t('tooltip_housing_area')}>
                  <Info className="h-5 w-5 text-gray-400 ml-2 cursor-help" />
                </Tooltip>
              </div>
              <input
                type="text"
                value={area}
                onChange={handleAreaChange}
                placeholder={t('placeholder_enter_area')}
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/25 focus:border-blue-500 text-lg font-medium transition-all"
              />
            </div>

            {/* Current Rate Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-2">{t('housing_current_params')}</p>
                  <div className="space-y-1">
                    <p>• {t('housing_city')} {currentCityData.name}</p>
                    <p>• {t('housing_operation')} {operationOptions.find(op => op.id === operationType)?.title}</p>
                    <p>• {t('housing_avg_price')} {formatCurrency(currentCityData.prices[operationType])} {t('housing_som')}/м²</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 print:shadow-none print:border">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">{t('housing_calc_result')}</h2>
                {results.hasData && (
                  <ActionButtons
                    calculatorName={t('housing_calc_name')}
                    resultText={`${t('housing_result_text')}
${t('housing_city')} ${results.city}
${t('housing_type_label')} ${results.operationType}
${t('housing_area')} ${formatCurrency(results.area)} м²
${t('housing_price_per_m2')} ${formatCurrency(results.pricePerMeter)} ${t('housing_som')}
${t('housing_estimated_cost')} ${formatCurrency(results.totalCost)} ${t('housing_som')}

${t('water_calculated_on')}`}
                  />
                )}
              </div>
              
              {results.hasData ? (
                <div className="space-y-8">
                  {/* Main Result */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white text-center">
                    <div className="flex items-center justify-center mb-4">
                      <Building className="h-8 w-8 mr-3" />
                      <span className="text-xl text-blue-100">{t('housing_estimated_cost')}</span>
                    </div>
                    <p className="text-6xl font-bold mb-4">
                      {formatCurrency(results.totalCost)} {t('housing_som')}
                    </p>
                    <p className="text-blue-100 text-lg">
                      {results.area} м² • {results.city}
                    </p>
                  </div>

                  {/* Calculation Breakdown */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Calculator className="h-5 w-5 mr-2" />
                      {t('housing_calc_breakdown')}
                    </h3>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t('housing_city')}</span>
                        <span className="font-medium text-gray-900">{results.city}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t('housing_type_label')}</span>
                        <span className="font-medium text-gray-900">{results.operationType}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t('housing_area')}</span>
                        <span className="font-medium text-gray-900">{formatCurrency(results.area)} м²</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t('housing_price_per_m2')}</span>
                        <span className="font-medium text-gray-900">{formatCurrency(results.pricePerMeter)} {t('housing_som')}</span>
                      </div>

                      <div className="border-t pt-4">
                        <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                          <p className="text-center text-gray-700 mb-2">{t('housing_calc_formula')}</p>
                          <p className="text-center text-lg font-mono text-gray-900">
                            {formatCurrency(results.area)} м² × {formatCurrency(results.pricePerMeter)} {t('housing_som')} = {formatCurrency(results.totalCost)} {t('housing_som')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <Building className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">{t('housing_enter_area')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Regional Comparison */}
        {results.hasData && (
          <div className="mt-12 bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
            <div className="flex items-center mb-6">
              <MapPin className="h-6 w-6 text-red-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                {t('housing_compare_cities')}
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('housing_city_region')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('housing_price_per_m2')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('housing_area')} {area} м²
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('housing_difference_with_choice')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Current Selection */}
                  <tr className="bg-green-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {currentCityData.name} <span className="text-xs text-gray-500">{t('housing_your_choice')}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {formatCurrency(currentCityData.prices[operationType])} {t('housing_som')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {formatCurrency(results.totalCost)} {t('housing_som')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {t('housing_base_cost')}
                    </td>
                  </tr>
                  
                  {/* Other Cities */}
                  {Object.entries(HOUSING_PRICES)
                    .filter(([key]) => key !== selectedCity)
                    .sort(([,a], [,b]) => a.prices[operationType] - b.prices[operationType])
                    .map(([cityKey, cityData]) => {
                      const otherCityCost = parseFloat(area) * cityData.prices[operationType];
                      const difference = otherCityCost - results.totalCost;
                      const isCheaper = difference < 0;
                      const isMoreExpensive = difference > 0;
                      
                      return (
                        <tr key={cityKey} className={isCheaper ? 'bg-blue-50' : isMoreExpensive ? 'bg-red-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {cityData.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(cityData.prices[operationType])} {t('housing_som')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(otherCityCost)} {t('housing_som')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={difference === 0 ? 'text-gray-500' : difference < 0 ? 'text-green-600' : 'text-red-600'}>
                              {difference === 0 ? t('housing_same') :
                               difference < 0 ? `${formatCurrency(Math.abs(difference))} ${t('housing_som')} ${t('housing_cheaper')}` :
                               `${formatCurrency(difference)} ${t('housing_som')} ${t('housing_more_expensive')}`}
                            </span>
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
                  <span>{t('housing_cheaper_variants')}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-50 border border-red-200 rounded mr-2"></div>
                  <span>{t('housing_expensive_variants')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Examples */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-8 print:hidden">
          <h3 className="font-medium text-gray-900 mb-4">{t('housing_popular_variants')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { area: 60, city: 'bishkek' as City, operation: 'buy-apartment' as OperationType, label: t('housing_ex_apt_bishkek') },
              { area: 120, city: 'osh' as City, operation: 'buy-house' as OperationType, label: t('housing_ex_house_osh') },
              { area: 150, city: 'cholpon-ata' as City, operation: 'build-house' as OperationType, label: t('housing_ex_build_cholpon') },
              { area: 80, city: 'karakol' as City, operation: 'buy-apartment' as OperationType, label: t('housing_ex_apt_karakol') }
            ].map((example, index) => {
              const exampleResult = calculateHousingCost(example.city, example.operation, example.area);
              return (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedCity(example.city);
                    setOperationType(example.operation);
                    setArea(example.area.toString());
                  }}
                  className="text-left p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-blue-200"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium text-sm">
                      {example.label}
                    </span>
                    <span className="text-xs text-gray-500">
                      {example.area} м²
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-blue-600 font-semibold">
                      {formatCurrency(exampleResult.totalCost)} {t('housing_som')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatCurrency(exampleResult.pricePerMeter)} {t('housing_som')}/м²
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Matrix Display */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
          <h3 className="font-medium text-gray-900 mb-6">{t('housing_price_matrix')}</h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('housing_city_region')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('housing_buy_apartment')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('housing_buy_house')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('housing_build_house')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(HOUSING_PRICES)
                  .sort(([,a], [,b]) => b.prices['buy-apartment'] - a.prices['buy-apartment'])
                  .map(([cityKey, cityData]) => {
                    const isCurrentCity = cityKey === selectedCity;
                    return (
                      <tr key={cityKey} className={isCurrentCity ? 'bg-green-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {cityData.name}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                          isCurrentCity && operationType === 'buy-apartment' ? 'font-bold text-blue-600' : 'text-gray-900'
                        }`}>
                          {formatCurrency(cityData.prices['buy-apartment'])}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                          isCurrentCity && operationType === 'buy-house' ? 'font-bold text-blue-600' : 'text-gray-900'
                        }`}>
                          {formatCurrency(cityData.prices['buy-house'])}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                          isCurrentCity && operationType === 'build-house' ? 'font-bold text-blue-600' : 'text-gray-900'
                        }`}>
                          {formatCurrency(cityData.prices['build-house'])}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Other Calculators */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-8 print:hidden">
          <h3 className="font-medium text-gray-900 mb-4">{t('other_calculators')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to={getLocalizedPath("/calculator/mortgage")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-blue-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                  <Building className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">{t('mortgage_calc_title')}</div>
                  <div className="text-sm text-gray-500">{t('mortgage_calc_subtitle')}</div>
                </div>
              </div>
            </Link>
            <Link
              to={getLocalizedPath("/calculator/property-tax")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-blue-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                  <Receipt className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">{t('property_tax_calc_title')}</div>
                  <div className="text-sm text-gray-500">{t('property_tax_calc_subtitle')}</div>
                </div>
              </div>
            </Link>
            <Link
              to={getLocalizedPath("/calculator/salary")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-blue-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">{t('salary_calc_title')}</div>
                  <div className="text-sm text-gray-500">{t('salary_calc_subtitle')}</div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Market Analysis */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
          <h3 className="font-medium text-gray-900 mb-6">{t('housing_market_analysis')}</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-medium text-gray-800 mb-3">{t('housing_most_expensive')}</h4>
              <div className="space-y-2">
                {Object.entries(HOUSING_PRICES)
                  .sort(([,a], [,b]) => b.prices['buy-apartment'] - a.prices['buy-apartment'])
                  .slice(0, 5)
                  .map(([cityKey, cityData], index) => (
                    <div key={cityKey} className="flex justify-between items-center p-2 bg-red-50 rounded">
                      <span className="text-sm text-gray-700">{index + 1}. {cityData.name}</span>
                      <span className="text-sm font-medium text-red-600">
                        {formatCurrency(cityData.prices['buy-apartment'])} {t('housing_som')}/м²
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-3">{t('housing_most_affordable')}</h4>
              <div className="space-y-2">
                {Object.entries(HOUSING_PRICES)
                  .sort(([,a], [,b]) => a.prices['buy-apartment'] - b.prices['buy-apartment'])
                  .slice(0, 5)
                  .map(([cityKey, cityData], index) => (
                    <div key={cityKey} className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-sm text-gray-700">{index + 1}. {cityData.name}</span>
                      <span className="text-sm font-medium text-green-600">
                        {formatCurrency(cityData.prices['buy-apartment'])} {t('housing_som')}/м²
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-3">{t('housing_avg_prices')}</h4>
              <div className="space-y-2">
                {['buy-apartment', 'buy-house', 'build-house'].map((opType) => {
                  const avgPrice = Object.values(HOUSING_PRICES).reduce((sum, city) =>
                    sum + city.prices[opType as OperationType], 0) / Object.values(HOUSING_PRICES).length;
                  const opName = operationOptions.find(op => op.id === opType)?.title;

                  return (
                    <div key={opType} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{opName}</span>
                      <span className="text-sm font-medium text-gray-600">
                        {formatCurrency(avgPrice)} {t('housing_som')}/м²
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Information Block */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-8">
          <div className="flex items-start space-x-4">
            <Info className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
            <div className="text-sm text-blue-800">
              <p className="font-bold mb-3 text-lg">{t('housing_info_title')}</p>
              <div className="space-y-2">
                <p>
                  {t('housing_info_text1')}
                </p>
                <p>
                  {t('housing_info_text2')}
                </p>
                <p>
                  {t('housing_info_text3').replace('{month}', currentMonth)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Disclaimer */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Info className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-2">{t('housing_warning_title')}</p>
              <p className="mb-2">
                {t('housing_warning_text1')}
              </p>
              <p>
                {t('housing_warning_text2')}
              </p>
              <p className="mt-2">
                {t('housing_warning_text3')}
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
          .print\\:text-blue-600 {
            color: #2563EB !important;
          }
          .print\\:bg-blue-100 {
            background-color: #DBEAFE !important;
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

export default HousingCalculatorPage;