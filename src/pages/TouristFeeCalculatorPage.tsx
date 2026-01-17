import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Info, Home, Printer, MapPin, Users, Calendar, DollarSign, Building, Zap, Droplets, Flame } from 'lucide-react';
import ActionButtons from '../components/ActionButtons';
import SchemaMarkup from '../components/SchemaMarkup';
import HreflangTags from '../components/HreflangTags';
import { useLanguage } from '../contexts/LanguageContext';
import {
  generateCalculatorSchema,
  generateBreadcrumbSchema
} from '../utils/schemaGenerator';
import { formatCurrentMonth } from '../utils/dateFormatter';

// Конфигурация туристических сборов - легко обновляемая структура
const TOURIST_FEE_RATES = {
  'bishkek': {
    nameKey: 'tourist_city_bishkek',
    rate: 100,
    descriptionKey: 'tourist_desc_bishkek'
  },
  'cholpon-ata': {
    nameKey: 'tourist_city_cholpon_ata',
    rate: 150,
    descriptionKey: 'tourist_desc_cholpon_ata'
  },
  'karakol': {
    nameKey: 'tourist_city_karakol',
    rate: 120,
    descriptionKey: 'tourist_desc_karakol'
  },
  'osh': {
    nameKey: 'tourist_city_osh',
    rate: 80,
    descriptionKey: 'tourist_desc_osh'
  },
  'naryn': {
    nameKey: 'tourist_city_naryn',
    rate: 90,
    descriptionKey: 'tourist_desc_naryn'
  },
  'jalal-abad': {
    nameKey: 'tourist_city_jalal_abad',
    rate: 70,
    descriptionKey: 'tourist_desc_jalal_abad'
  },
  'bokonbaevo': {
    nameKey: 'tourist_city_bokonbaevo',
    rate: 130,
    descriptionKey: 'tourist_desc_bokonbaevo'
  },
  'kochkor': {
    nameKey: 'tourist_city_kochkor',
    rate: 110,
    descriptionKey: 'tourist_desc_kochkor'
  }
};

type City = keyof typeof TOURIST_FEE_RATES;

interface TouristFeeResults {
  city: string;
  touristCount: number;
  daysCount: number;
  dailyRate: number;
  totalFee: number;
  hasData: boolean;
}

const TouristFeeCalculatorPage = () => {
  const { language, t, getLocalizedPath} = useLanguage();

  // Генерация схем для страницы калькулятора турсбора
  const generateSchemas = () => {
    const currentUrl = language === 'ky' ? "https://calk.kg/ky/calculator/tourist-fee" : "https://calk.kg/calculator/tourist-fee";
    const homeUrl = language === 'ky' ? "https://calk.kg/ky" : "https://calk.kg";
    
    const calculatorSchema = generateCalculatorSchema({
      url: currentUrl,
      title: t('tourist_calc_title'),
      description: t('tourist_calc_desc'),
      calculatorName: t('tourist_calc_name'),
      category: t('nav_other'),
      language,
      inputProperties: ["city", "touristCount", "daysCount"],
      outputProperties: ["dailyRate", "totalFee"]
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: homeUrl },
      { name: t('nav_other'), url: `${homeUrl}?category=other` },
      { name: t('tourist_breadcrumb'), url: currentUrl }
    ]);

    return [calculatorSchema, breadcrumbSchema];
  };
  React.useEffect(() => {
    document.title = t('tourist_fee_calc_title') + " - Calk.KG";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('tourist_fee_calc_description'));
    }
  }, [t]);

  const [selectedCity, setSelectedCity] = useState<City>('bishkek');
  const [touristCount, setTouristCount] = useState<number>(2);
  const [daysCount, setDaysCount] = useState<number>(3);
  
  const [results, setResults] = useState<TouristFeeResults>({
    city: '',
    touristCount: 0,
    daysCount: 0,
    dailyRate: 0,
    totalFee: 0,
    hasData: false
  });

  // Расчет туристического сбора
  const calculateTouristFee = (
    city: City,
    tourists: number,
    days: number
  ): TouristFeeResults => {
    if (tourists <= 0 || days <= 0) {
      return {
        city: t(TOURIST_FEE_RATES[city].nameKey),
        touristCount: tourists,
        daysCount: days,
        dailyRate: TOURIST_FEE_RATES[city].rate,
        totalFee: 0,
        hasData: false
      };
    }

    const cityData = TOURIST_FEE_RATES[city];
    const totalFee = tourists * days * cityData.rate;

    return {
      city: cityData.name,
      touristCount: tourists,
      daysCount: days,
      dailyRate: cityData.rate,
      totalFee,
      hasData: true
    };
  };

  // Обновление результатов
  useEffect(() => {
    setResults(calculateTouristFee(selectedCity, touristCount, daysCount));
  }, [selectedCity, touristCount, daysCount]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-KG', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleTouristCountChange = (value: number) => {
    setTouristCount(Math.max(1, Math.min(50, value))); // От 1 до 50 туристов
  };

  const handleDaysCountChange = (value: number) => {
    setDaysCount(Math.max(1, Math.min(365, value))); // От 1 до 365 дней
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
  const currentCityData = TOURIST_FEE_RATES[selectedCity];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org микроразметка */}
      <Helmet>
        <title>{t('tourist_fee_calc_title')} - Calk.KG</title>
        <meta name="description" content={t('tourist_fee_calc_description')} />
        <meta name="keywords" content={t('tourist_keywords')} />
        <meta property="og:title" content={`${t('tourist_fee_calc_title')} - Calk.KG`} />
        <meta property="og:description" content={t('tourist_fee_calc_subtitle')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/tourist-fee" : "https://calk.kg/calculator/tourist-fee"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/tourist-fee.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('tourist_fee_calc_title')} - Calk.KG`} />
        <meta name="twitter:description" content={t('tourist_fee_calc_subtitle')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/tourist-fee.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/tourist-fee" : "https://calk.kg/calculator/tourist-fee"} />
      </Helmet>
      <HreflangTags path="/calculator/tourist-fee" />
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
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white print:bg-white print:text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 print:py-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="bg-white/20 p-4 rounded-xl print:bg-green-100">
                <MapPin className="h-10 w-10 print:text-green-600" />
              </div>
              <div className="bg-white/20 p-4 rounded-xl print:bg-green-100">
                <Building className="h-10 w-10 print:text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 print:text-2xl">
              Калькулятор туристического сбора
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed print:text-gray-600">
              Быстрый расчет размера туристического сбора для гостиниц и туристов в Кыргызстане
            </p>
          </div>
        </div>
      </div>

      {/* Main Calculator */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 print:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 print:gap-6">
          
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 print:shadow-none print:border">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('tourist_placement_params')}</h2>
            
            {/* City Selection */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <label className="block text-lg font-semibold text-gray-700">
                  Город / Курортная зона
                </label>
                <Tooltip text={t('tooltip_tourist_city')}>
                  <Info className="h-5 w-5 text-gray-400 ml-2 cursor-help" />
                </Tooltip>
              </div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value as City)}
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-500/25 focus:border-green-500 text-lg font-medium transition-all"
              >
                {Object.entries(TOURIST_FEE_RATES).map(([key, cityData]) => (
                  <option key={key} value={key}>
                    {t(cityData.nameKey)} - {formatCurrency(cityData.rate)} {t('som_per_person_day')}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-2">
                {t(currentCityData.descriptionKey)}
              </p>
            </div>

            {/* Tourist Count */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <label className="block text-lg font-semibold text-gray-700">
                    Количество туристов
                  </label>
                  <Tooltip text={t('tooltip_guest_count')}>
                    <Info className="h-5 w-5 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <span className="text-2xl font-bold text-green-600">{touristCount}</span>
              </div>
              
              {/* Slider */}
              <div className="mb-4">
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={touristCount}
                  onChange={(e) => handleTouristCountChange(parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>25</span>
                  <span>{t('tourist_50_tourists')}</span>
                </div>
              </div>

              {/* Number Input */}
              <input
                type="number"
                value={touristCount}
                onChange={(e) => handleTouristCountChange(parseInt(e.target.value) || 1)}
                min="1"
                max="50"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center text-lg"
              />
            </div>

            {/* Days Count */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <label className="block text-lg font-semibold text-gray-700">
                    Количество дней пребывания
                  </label>
                  <Tooltip text={t('tooltip_stay_duration')}>
                    <Info className="h-5 w-5 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <span className="text-2xl font-bold text-green-600">{daysCount}</span>
              </div>
              
              {/* Slider */}
              <div className="mb-4">
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={Math.min(daysCount, 30)}
                  onChange={(e) => handleDaysCountChange(parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>15</span>
                  <span>{t('tourist_30_days')}</span>
                </div>
              </div>

              {/* Number Input */}
              <input
                type="number"
                value={daysCount}
                onChange={(e) => handleDaysCountChange(parseInt(e.target.value) || 1)}
                min="1"
                max="365"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center text-lg"
              />
            </div>

            {/* Current Rate Info */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <Info className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div className="text-sm text-green-800">
                  <p className="font-semibold mb-2">{t('tourist_fee_rate_in')} {currentCityData.name}:</p>
                  <p className="text-2xl font-bold text-green-700 mb-2">
                    {formatCurrency(currentCityData.rate)} {t('som_per_person_day')}
                  </p>
                  <p>{currentCityData.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 print:shadow-none print:border">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">{t('tourist_fee_calculation')}</h2>
                {results.hasData && (
                  <button
                    onClick={handlePrint}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors print:hidden"
                  >
                    <Printer className="h-4 w-4" />
                    <span>{t('print')}</span>
                  </button>
                )}
              </div>
              
              {results.hasData ? (
                <div className="space-y-8">
                  {/* Main Result */}
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white text-center">
                    <div className="flex items-center justify-center mb-4">
                      <DollarSign className="h-8 w-8 mr-3" />
                      <span className="text-xl text-green-100">{t('tourist_total_to_pay')}</span>
                    </div>
                    <p className="text-6xl font-bold mb-4">
                      {formatCurrency(results.totalFee)} сом
                    </p>
                    <p className="text-green-100 text-lg">
                      за {touristCount} {touristCount === 1 ? 'туриста' : 'туристов'} на {daysCount} {daysCount === 1 ? 'день' : daysCount <= 4 ? 'дня' : 'дней'}
                    </p>
                  </div>

                  {/* Calculation Breakdown */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Calculator className="h-5 w-5 mr-2" />
                      Детализация расчета
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t('tourist_city_label')}</span>
                        <span className="font-medium text-gray-900">{results.city}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t('tourist_fee_rate_label')}</span>
                        <span className="font-medium text-gray-900">{formatCurrency(results.dailyRate)} {t('som_per_person_day')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t('tourist_guests_count')}</span>
                        <span className="font-medium text-gray-900">{results.touristCount} {t('persons_short_dot')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t('tourist_stay_days')}</span>
                        <span className="font-medium text-gray-900">{results.daysCount} дней</span>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                          <p className="text-center text-gray-700 mb-2">{t('tourist_calculation_formula')}</p>
                          <p className="text-center text-lg font-mono text-gray-900">
                            {results.touristCount} × {results.daysCount} × {formatCurrency(results.dailyRate)} = {formatCurrency(results.totalFee)} сом
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <MapPin className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">{t('tourist_specify_guests')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Other Calculators */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-8 print:hidden">
          <h3 className="font-medium text-gray-900 mb-4">{t('other_calculators')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to={getLocalizedPath("/calculator/electricity")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-green-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-amber-50 p-2 rounded-lg group-hover:bg-amber-100 transition-colors">
                  <Zap className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-green-600">{t('tourist_electricity')}</div>
                  <div className="text-sm text-gray-500">{t('tourist_electricity_desc')}</div>
                </div>
              </div>
            </Link>
            <Link
              to={getLocalizedPath("/calculator/water")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-green-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <Droplets className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-green-600">{t('tourist_water')}</div>
                  <div className="text-sm text-gray-500">{t('tourist_water_desc')}</div>
                </div>
              </div>
            </Link>
            <Link
              to={getLocalizedPath("/calculator/heating")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-green-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-amber-50 p-2 rounded-lg group-hover:bg-amber-100 transition-colors">
                  <Flame className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-green-600">{t('tourist_heating')}</div>
                  <div className="text-sm text-gray-500">{t('tourist_heating_desc')}</div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Regional Comparison */}
        {results.hasData && (
          <div className="mt-12 bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
            <div className="flex items-center mb-6">
              <MapPin className="h-6 w-6 text-red-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                Сравнение ставок по городам КР
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Город / Курорт
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('tourist_fee_rate_label')} ({t('som_per_person_day')})
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('tourist_fee_for')} {touristCount} {t('tourist_short')} × {daysCount} {t('days_unit')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Current Selection */}
                  <tr className="bg-green-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {currentCityData.name} <span className="text-xs text-gray-500">{t('your_choice')}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {formatCurrency(currentCityData.rate)} {t('text_som')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {formatCurrency(results.totalFee)} {t('text_som')}
                    </td>
                  </tr>
                  
                  {/* Other Cities */}
                  {Object.entries(TOURIST_FEE_RATES)
                    .filter(([key]) => key !== selectedCity)
                    .sort(([,a], [,b]) => b.rate - a.rate)
                    .map(([cityKey, cityData]) => {
                      const otherCityFee = touristCount * daysCount * cityData.rate;
                      const isCheaper = otherCityFee < results.totalFee;
                      const isMoreExpensive = otherCityFee > results.totalFee;
                      
                      return (
                        <tr key={cityKey} className={isCheaper ? 'bg-blue-50' : isMoreExpensive ? 'bg-red-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {cityData.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(cityData.rate)} сом
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(otherCityFee)} сом
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
                  <span>{t('tourist_lower_rates')}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-50 border border-red-200 rounded mr-2"></div>
                  <span>{t('tourist_higher_rates')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Examples */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-8 print:hidden">
          <h3 className="font-medium text-gray-900 mb-4">{t('tourist_popular_scenarios')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { city: 'cholpon-ata' as City, tourists: 2, days: 3, labelKey: 'tourist_example_couple' },
              { city: 'karakol' as City, tourists: 4, days: 5, labelKey: 'tourist_example_family' },
              { city: 'bishkek' as City, tourists: 1, days: 2, labelKey: 'tourist_example_business' },
              { city: 'bokonbaevo' as City, tourists: 6, days: 7, labelKey: 'tourist_example_ecotour' }
            ].map((example, index) => {
              const exampleResult = calculateTouristFee(example.city, example.tourists, example.days);
              return (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedCity(example.city);
                    setTouristCount(example.tourists);
                    setDaysCount(example.days);
                  }}
                  className="text-left p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-green-200"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium text-sm">
                      {t(example.labelKey)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {example.tourists} чел × {example.days} дн
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-green-600 font-semibold">
                      {formatCurrency(exampleResult.totalFee)} сом
                    </div>
                    <div className="text-xs text-gray-500">
                      {t(TOURIST_FEE_RATES[example.city].nameKey)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Who Pays Info */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
          <h3 className="font-medium text-gray-900 mb-6">{t('tourist_who_pays_title')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-gray-800 mb-3">{t('tourist_who_must_pay')}</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Иностранные граждане и лица без гражданства
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Граждане других стран ЕАЭС (по усмотрению города)
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Граждане КР освобождены от сбора
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-3">{t('tourist_payment_procedure')}</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Сбор взимается при заселении в отель
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Оплачивается наличными или картой
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Выдается квитанция об оплате
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Средства идут на развитие туризма
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Cities Rate Matrix */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
          <h3 className="font-medium text-gray-900 mb-6">{t('tourist_rates_by_cities')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(TOURIST_FEE_RATES)
              .sort(([,a], [,b]) => b.rate - a.rate)
              .map(([cityKey, cityData]) => (
                <div 
                  key={cityKey}
                  className={`p-6 rounded-xl border-2 ${
                    cityKey === selectedCity 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 mb-2">
                      {cityData.name}
                    </div>
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {formatCurrency(cityData.rate)} {t('text_som')}
                    </div>
                    <div className="text-xs text-gray-500 mb-3">
                      {t('per_person_per_day')}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {cityData.description}
                    </p>
                    {results.hasData && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="text-sm font-medium text-gray-900">
                          За ваше пребывание: {formatCurrency(touristCount * daysCount * cityData.rate)} сом
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Information Block */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-8">
          <div className="flex items-start space-x-4">
            <Info className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
            <div className="text-sm text-blue-800">
              <p className="font-bold mb-3 text-lg">ℹ️ {t('tourist_about_fee')}</p>
              <div className="space-y-2">
                <p>
                  <strong>{t('tourist_fee_about')}</strong> {t('tourist_fee_about_desc')}
                </p>
                <p>
                  {t('tourist_funds_about')} <strong>{t('tourist_infrastructure')}</strong>, 
                  {t('tourist_infrastructure_desc')}
                </p>
                <p>
                  <strong>{t('tourist_preliminary')}</strong> {t('tourist_check_admin')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Info className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-2">{t('tourist_important_info')}</p>
              <p className="mb-2">
                <strong>{t('tourist_rates_current')} {currentMonth}.</strong> {t('tourist_rates_change')}
              </p>
              <p>
                {t('tourist_contact_info')} <strong>{t('tourist_local_admin_bold')}</strong> {t('tourist_or_accommodation_full')}
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
          background: #059669;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #059669;
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
          .print\\:text-green-600 {
            color: #059669 !important;
          }
          .print\\:bg-green-100 {
            background-color: #D1FAE5 !important;
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

export default TouristFeeCalculatorPage;