import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Info, Home, Printer, Car, AlertTriangle, Calendar, DollarSign } from 'lucide-react';
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

interface CustomsResults {
  customsStoicostValue: number;
  customsFee: number;
  customsDuty: number;
  exciseTax: number;
  vat: number;
  totalCost: number;
}

// Актуальные ставки таможенных пошлин КР согласно единым тарифам ЕАЭС (2026)
const getDutyRate = (year: number, engineVolume: number): { dutyRate: number; exciseRate: number } => {
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;

  // Ставки согласно единым тарифам ЕАЭС для легковых автомобилей
  // Новые автомобили (до 3 лет)
  if (age <= 3) {
    // Новые автомобили: базовая ставка 15%
    if (engineVolume <= 1000) return { dutyRate: 0.15, exciseRate: 0 };
    if (engineVolume <= 1500) return { dutyRate: 0.15, exciseRate: 0 };
    if (engineVolume <= 1800) return { dutyRate: 0.15, exciseRate: 0.01 };
    if (engineVolume <= 2300) return { dutyRate: 0.15, exciseRate: 0.05 };
    if (engineVolume <= 3000) return { dutyRate: 0.15, exciseRate: 0.08 };
    return { dutyRate: 0.15, exciseRate: 0.10 };
  }
  // Подержанные автомобили (старше 3 лет): базовая ставка 20%
  else {
    if (engineVolume <= 1000) return { dutyRate: 0.20, exciseRate: 0 };
    if (engineVolume <= 1500) return { dutyRate: 0.20, exciseRate: 0.01 };
    if (engineVolume <= 1800) return { dutyRate: 0.20, exciseRate: 0.02 };
    if (engineVolume <= 2300) return { dutyRate: 0.20, exciseRate: 0.06 };
    if (engineVolume <= 3000) return { dutyRate: 0.20, exciseRate: 0.10 };
    return { dutyRate: 0.20, exciseRate: 0.15 };
  }
};

const CustomsCalculatorPage = () => {
  const { t, language, getLocalizedPath } = useLanguage();


  const [year, setYear] = useState<string>('');
  const [engineVolume, setEngineVolume] = useState<string>('');
  const [customsValue, setCustomsValue] = useState<string>('');
  
  const [results, setResults] = useState<CustomsResults>({
    customsStoicostValue: 0,
    customsFee: 0,
    customsDuty: 0,
    exciseTax: 0,
    vat: 0,
    totalCost: 0
  });

  // Расчет таможенных платежей
  const calculateCustoms = (carYear: number, volume: number, value: number): CustomsResults => {
    if (value <= 0 || carYear <= 0 || volume <= 0) {
      return { customsStoicostValue: value, customsFee: 0, customsDuty: 0, exciseTax: 0, vat: 0, totalCost: 0 };
    }

    // Получаем ставки из матрицы
    const { dutyRate, exciseRate } = getDutyRate(carYear, volume);

    // 1. Таможенный сбор (примерно 0.4% от стоимости)
    const customsFee = value * 0.004;

    // 2. Таможенная пошлина (по ставке из матрицы)
    const customsDuty = value * dutyRate;

    // 3. Акцизный налог (если применимо)
    const exciseTax = value * exciseRate;

    // 4. НДС 12% от суммы всех предыдущих платежей
    const taxBase = value + customsFee + customsDuty + exciseTax;
    const vat = taxBase * 0.12;

    // 5. Итоговая сумма
    const totalCost = customsFee + customsDuty + exciseTax + vat;

    return {
      customsStoicostValue: value,
      customsFee,
      customsDuty,
      exciseTax,
      vat,
      totalCost
    };
  };

  // Обновление результатов
  useEffect(() => {
    const carYear = parseInt(year) || 0;
    const volume = parseInt(engineVolume) || 0;
    const value = parseFloat(customsValue) || 0;

    if (carYear > 0 && volume > 0 && value > 0) {
      setResults(calculateCustoms(carYear, volume, value));
    } else {
      setResults({ customsStoicostValue: value, customsFee: 0, customsDuty: 0, exciseTax: 0, vat: 0, totalCost: 0 });
    }
  }, [year, engineVolume, customsValue]);

  // Генерация схем для страницы таможенного калькулятора
  const generateSchemas = () => {
    const currentUrl = language === 'ky' ? "https://calk.kg/ky/calculator/customs" : "https://calk.kg/calculator/customs";
    const homeUrl = language === 'ky' ? "https://calk.kg/ky" : "https://calk.kg";
    
    const calculatorSchema = generateCalculatorSchema({
      url: currentUrl,
      title: t('customs_calc_title'),
      description: t('customs_calc_subtitle'),
      calculatorName: t('customs_calc_title'),
      category: t('nav_auto'),
      language,
      inputProperties: ["year", "engineVolume", "customsValue"],
      outputProperties: ["customsFee", "customsDuty", "exciseTax", "vat", "totalCost"]
    });

    const softwareSchema = generateSoftwareApplicationSchema({
      url: currentUrl,
      title: t('customs_calc_title'),
      description: t('customs_calc_subtitle'),
      calculatorName: t('customs_calc_title'),
      category: "AutomotiveApplication",
      inputProperties: [t('schema_year_manufacture'), t('schema_engine_volume'), t('schema_customs_value')],
      outputProperties: [t('schema_customs_fee'), t('schema_duty'), t('schema_excise'), t('schema_vat'), t('schema_total_cost')]
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: homeUrl },
      { name: t('nav_auto'), url: `${homeUrl}?category=auto` },
      { name: t('customs_calc_title'), url: currentUrl }
    ]);

    return [calculatorSchema, softwareSchema, breadcrumbSchema];
  };

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: currency === 'USD' ? 2 : 0,
      maximumFractionDigits: currency === 'USD' ? 2 : 0
    }).format(amount);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d{4}$|^\d{0,3}$/.test(value)) {
      setYear(value);
    }
  };

  const handleEngineVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*$/.test(value)) {
      setEngineVolume(value);
    }
  };

  const handleCustomsValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setCustomsValue(value);
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

  const currentYear = new Date().getFullYear();
  const currentMonth = formatCurrentMonth(language);
  
  // Генерация списка лет
  const generateYearOptions = () => {
    const years = [];
    for (let year = currentYear; year >= 1990; year--) {
      years.push(year);
    }
    return years;
  };

  // Расчет возраста автомобиля
  const carAge = year ? currentYear - parseInt(year) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org микроразметка */}
      <Helmet>
        <title>{t('customs_calc_title')} - Calk.KG</title>
        <meta name="description" content={t('customs_calc_description')} />
        <meta name="keywords" content={t('customs_calc_keywords')} />
        <meta property="og:title" content={`${t('customs_calc_title')} - Calk.KG`} />
        <meta property="og:description" content={t('customs_calc_description')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/customs" : "https://calk.kg/calculator/customs"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/customs.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('customs_calc_title')} - Calk.KG`} />
        <meta name="twitter:description" content={t('customs_calc_description')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/customs.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/customs" : "https://calk.kg/calculator/customs"} />
      </Helmet>
      <HreflangTags path="/calculator/customs" />
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
              <Car className="h-8 w-8 print:text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold print:text-2xl">{t('customs_calc_title')}</h1>
              <p className="text-red-100 text-lg print:text-gray-600">{t('customs_calc_subtitle')}</p>
            </div>
          </div>
          
          {/* Data Currency Notice */}
          <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3 print:hidden">
            <Calendar className="h-5 w-5 text-amber-200" />
            <span className="text-amber-100 text-sm">
              {t('customs_data_current_on')} {currentMonth}
            </span>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div className="text-sm text-yellow-800">
              <p className="font-bold mb-2">⚠️ {t('customs_important_banner_title')}</p>
              <p className="mb-2">
                {t('customs_important_banner_text1')} <strong>{t('customs_important_banner_new')}</strong> {t('customs_up_to_3_years')} <strong>{t('customs_important_banner_used')}</strong>.
              </p>
              <p>
                {t('customs_important_banner_text2')} <a href="https://www.customs.gov.kg" target="_blank" rel="noopener noreferrer" className="underline font-medium">www.customs.gov.kg</a>
              </p>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('customs_car_data')}</h2>
              
              {/* Year */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('customs_year_label')}
                  </label>
                  <Tooltip text={t('customs_year_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg print:text-base"
                >
                  <option value="">{t('customs_year_select')}</option>
                  {generateYearOptions().map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                {carAge > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    {t('customs_car_age')}: {carAge} {t('customs_car_age_years')}
                  </p>
                )}
              </div>

              {/* Engine Volume */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('customs_engine_volume')}
                  </label>
                  <Tooltip text={t('customs_engine_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={engineVolume}
                  onChange={handleEngineVolumeChange}
                  placeholder={t('placeholder_example_amount')}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg print:text-base"
                />
              </div>

              {/* Customs Value */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('customs_value_label')}
                  </label>
                  <Tooltip text={t('customs_value_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={customsValue}
                  onChange={handleCustomsValueChange}
                  placeholder={t('placeholder_enter_usd_cost')}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg print:text-base"
                />
              </div>

              {/* Info Block */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-2">{t('customs_how_to_title')}</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>{t('customs_how_to_1')}</li>
                      <li>{t('customs_how_to_2')}</li>
                      <li>{t('customs_how_to_3')}</li>
                      <li>{t('customs_how_to_4')}</li>
                    </ol>
                    <p className="mt-3">
                      💡 <strong>{t('customs_planning_car')}</strong> {t('customs_after_customs')}
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
                <h2 className="text-xl font-semibold text-gray-900">{t('customs_calculation_details')}</h2>
                {results.totalCost > 0 && (
                  <ActionButtons
                    calculatorName={t('schema_customs_calc')}
                    resultText={`${t('customs_calc_results')}:
${t('year_of_manufacture')}: ${year}
${t('engine_volume')}: ${engineVolume} ${t('unit_cm3')}
${t('customs_value')}: $${formatCurrency(results.customsStoicostValue)}
${t('customs_fee')}: $${formatCurrency(results.customsFee)}
${t('customs_duty')}: $${formatCurrency(results.customsDuty)}
${t('excise_tax')}: $${formatCurrency(results.exciseTax)}
${t('vat')}: $${formatCurrency(results.vat)}
${t('total_to_pay')}: $${formatCurrency(results.totalCost)}
${t('full_price')}: $${formatCurrency(results.customsStoicostValue + results.totalCost)}

${t('calculated_on_calk')}`}
                  />
                )}
              </div>
              
              {results.totalCost > 0 ? (
                <div className="space-y-6">
                  {/* Customs Value */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-gray-700 font-medium">{t('customs_value')}:</span>
                        <Tooltip text={t('customs_value_base')}>
                          <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                        </Tooltip>
                      </div>
                      <span className="text-xl font-semibold text-gray-900">
                        ${formatCurrency(results.customsStoicostValue)}
                      </span>
                    </div>
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700 text-lg">{t('customs_payments')}:</h3>

                    {/* Customs Fee */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <span className="text-gray-700">{t('customs_fee_percent')}:</span>
                          <Tooltip text={t('customs_fee_tooltip')}>
                            <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-blue-600 font-semibold">
                          ${formatCurrency(results.customsFee)}
                        </span>
                      </div>
                    </div>

                    {/* Customs Duty */}
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <span className="text-gray-700">{t('customs_duty')}:</span>
                          <Tooltip text={t('customs_duty_tooltip')}>
                            <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-orange-600 font-semibold">
                          ${formatCurrency(results.customsDuty)}
                        </span>
                      </div>
                    </div>

                    {/* Excise Tax */}
                    {results.exciseTax > 0 && (
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <span className="text-gray-700">{t('customs_excise')}:</span>
                            <Tooltip text={t('customs_excise_tooltip')}>
                              <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                            </Tooltip>
                          </div>
                          <span className="text-purple-600 font-semibold">
                            ${formatCurrency(results.exciseTax)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* VAT */}
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <span className="text-gray-700">{t('customs_vat')}:</span>
                          <Tooltip text={t('customs_vat_tooltip')}>
                            <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-red-600 font-semibold">
                          ${formatCurrency(results.vat)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {t('customs_vat_base')}: ${formatCurrency(results.customsStoicostValue + results.customsFee + results.customsDuty + results.exciseTax)}
                      </div>
                    </div>
                  </div>

                  {/* Total Cost */}
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <span className="text-green-100">{t('customs_total_to_pay')}:</span>
                        <Tooltip text={t('customs_total_to_pay_tooltip')}>
                          <Info className="h-4 w-4 text-green-200 ml-2 cursor-help" />
                        </Tooltip>
                      </div>
                      <p className="text-4xl font-bold">
                        ${formatCurrency(results.totalCost)}
                      </p>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-700 mb-3">{t('customs_total_cost')}:</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>{t('customs_car_cost')}:</span>
                        <span>${formatCurrency(results.customsStoicostValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('customs_customs_payments')}:</span>
                        <span>${formatCurrency(results.totalCost)}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-medium text-gray-900">
                          <span>{t('customs_full_cost')}:</span>
                          <span>${formatCurrency(results.customsStoicostValue + results.totalCost)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <Car className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">{t('customs_enter_data')}</p>
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
                to={getLocalizedPath('/calculator/auto-loan')}
                className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-red-50 p-2 rounded-lg group-hover:bg-red-100 transition-colors">
                    <Car className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('customs_auto_loan')}</div>
                    <div className="text-sm text-gray-500">{t('customs_auto_loan_desc')}</div>
                  </div>
                </div>
              </Link>
              <Link
                to={getLocalizedPath('/calculator/loan')}
                className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('customs_loan')}</div>
                    <div className="text-sm text-gray-500">{t('customs_loan_desc')}</div>
                  </div>
                </div>
              </Link>
              <Link
                to={getLocalizedPath('/calculator/traffic-fines')}
                className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-50 p-2 rounded-lg group-hover:bg-gray-100 transition-colors">
                    <Car className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('customs_traffic_fines')}</div>
                    <div className="text-sm text-gray-500">{t('customs_traffic_fines_desc')}</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Quick Examples */}
          <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
            <h3 className="font-medium text-gray-900 mb-4">{t('customs_examples')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { year: 2020, volume: 1500, value: 15000 },
                { year: 2015, volume: 2000, value: 12000 },
                { year: 2010, volume: 2500, value: 8000 }
              ].map((example, index) => {
                const exampleResult = calculateCustoms(example.year, example.volume, example.value);
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setYear(example.year.toString());
                      setEngineVolume(example.volume.toString());
                      setCustomsValue(example.value.toString());
                    }}
                    className="text-left p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">
                        {example.year}, {example.volume}{t('unit_cm3')}
                      </span>
                      <span className="text-xs text-gray-500">
                        ${formatCurrency(example.value)}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-red-600 font-semibold">
                        ${formatCurrency(exampleResult.totalCost)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {t('customs_to_pay')}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Final Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-2">{t('customs_important_info')}</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>{t('customs_notice_1')}</li>
                  <li>{t('customs_notice_2')}</li>
                  <li>{t('customs_notice_3')}</li>
                  <li><strong>{t('customs_notice_4')}</strong></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Educational Guide Section */}
          <div className="mt-12 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-8 border border-blue-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('customs_guide_title')}</h2>
            
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {t('customs_guide_intro')}
              </p>

              <div className="space-y-8">
                {/* How it works */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-blue-700 mb-4 flex items-center">
                    <Calculator className="h-6 w-6 mr-2" />
                    {t('customs_guide_how_title')}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {t('customs_guide_how_text')}
                  </p>
                </div>

                {/* EAEU Tariffs */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-blue-700 mb-4">{t('customs_guide_eaeu_title')}</h3>
                  <p className="text-gray-700 mb-4">{t('customs_guide_eaeu_text')}</p>
                </div>

                {/* New Cars */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-green-700 mb-4 flex items-center">
                    <Car className="h-6 w-6 mr-2" />
                    {t('customs_guide_new_cars_title')}
                  </h3>
                  <p className="text-gray-700 mb-3">{t('customs_guide_new_cars_rate')}</p>
                  <p className="text-gray-700 font-semibold mb-2">{t('customs_guide_new_cars_excise')}</p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-600 font-bold mr-2">•</span>
                      <span>{t('customs_excise_0')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 font-bold mr-2">•</span>
                      <span>{t('customs_excise_1')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 font-bold mr-2">•</span>
                      <span>{t('customs_excise_2')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 font-bold mr-2">•</span>
                      <span>{t('customs_excise_3')}</span>
                    </li>
                  </ul>
                </div>

                {/* Used Cars */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-orange-700 mb-4">{t('customs_guide_used_cars_title')}</h3>
                  <p className="text-gray-700 mb-3">{t('customs_guide_used_cars_rate')}</p>
                  <p className="text-gray-700 font-semibold mb-2">{t('customs_guide_used_cars_excise')}</p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">•</span>
                      <span>{t('customs_used_excise_0')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">•</span>
                      <span>{t('customs_used_excise_1')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">•</span>
                      <span>{t('customs_used_excise_2')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">•</span>
                      <span>{t('customs_used_excise_3')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">•</span>
                      <span>{t('customs_used_excise_4')}</span>
                    </li>
                  </ul>
                </div>

                {/* Components */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-blue-700 mb-4 flex items-center">
                    <DollarSign className="h-6 w-6 mr-2" />
                    {t('customs_guide_components_title')}
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                      <p className="text-gray-800">💰 {t('customs_component_fee')}</p>
                    </div>
                    <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                      <p className="text-gray-800">📋 {t('customs_component_duty')}</p>
                    </div>
                    <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
                      <p className="text-gray-800">🔥 {t('customs_component_excise')}</p>
                    </div>
                    <div className="bg-green-50 border-l-4 border-green-500 p-4">
                      <p className="text-gray-800">💵 {t('customs_component_vat')}</p>
                    </div>
                  </div>
                </div>

                {/* Valuation */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-blue-700 mb-4">{t('customs_guide_valuation_title')}</h3>
                  <p className="text-gray-700 mb-3">{t('customs_valuation_text')}</p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-blue-600 font-bold mr-2">1.</span>
                      <span>{t('customs_valuation_1')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 font-bold mr-2">2.</span>
                      <span>{t('customs_valuation_2')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 font-bold mr-2">3.</span>
                      <span>{t('customs_valuation_3')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 font-bold mr-2">4.</span>
                      <span>{t('customs_valuation_4')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">❓ {t('customs_faq_title')}</h2>
            <div className="space-y-6">
              <details className="group bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  <span>{t('customs_faq_q1')}</span>
                  <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">{t('customs_faq_a1')}</p>
              </details>

              <details className="group bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  <span>{t('customs_faq_q2')}</span>
                  <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">{t('customs_faq_a2')}</p>
              </details>

              <details className="group bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  <span>{t('customs_faq_q3')}</span>
                  <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">{t('customs_faq_a3')}</p>
              </details>

              <details className="group bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  <span>{t('customs_faq_q4')}</span>
                  <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">{t('customs_faq_a4')}</p>
              </details>

              <details className="group bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  <span>{t('customs_faq_q5')}</span>
                  <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">{t('customs_faq_a5')}</p>
              </details>

              <details className="group bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  <span>{t('customs_faq_q6')}</span>
                  <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">{t('customs_faq_a6')}</p>
              </details>
            </div>
          </div>

          {/* Practical Tips */}
          <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8 border border-blue-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">💡 {t('customs_tips_title')}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 bg-white p-4 rounded-lg">
                <span className="text-2xl">🔍</span>
                <p className="text-gray-700">{t('customs_tip_1')}</p>
              </div>
              <div className="flex items-start space-x-3 bg-white p-4 rounded-lg">
                <span className="text-2xl">💰</span>
                <p className="text-gray-700">{t('customs_tip_2')}</p>
              </div>
              <div className="flex items-start space-x-3 bg-white p-4 rounded-lg">
                <span className="text-2xl">📄</span>
                <p className="text-gray-700">{t('customs_tip_3')}</p>
              </div>
              <div className="flex items-start space-x-3 bg-white p-4 rounded-lg">
                <span className="text-2xl">🌍</span>
                <p className="text-gray-700">{t('customs_tip_4')}</p>
              </div>
              <div className="flex items-start space-x-3 bg-white p-4 rounded-lg">
                <span className="text-2xl">♻️</span>
                <p className="text-gray-700">{t('customs_tip_5')}</p>
              </div>
              <div className="flex items-start space-x-3 bg-white p-4 rounded-lg">
                <span className="text-2xl">🧾</span>
                <p className="text-gray-700">{t('customs_tip_6')}</p>
              </div>
              <div className="flex items-start space-x-3 bg-white p-4 rounded-lg">
                <span className="text-2xl">💵</span>
                <p className="text-gray-700">{t('customs_tip_7')}</p>
              </div>
              <div className="flex items-start space-x-3 bg-white p-4 rounded-lg">
                <span className="text-2xl">📝</span>
                <p className="text-gray-700">{t('customs_tip_8')}</p>
              </div>
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="mt-12 bg-red-50 rounded-xl shadow-lg p-8 border-2 border-red-200">
            <h2 className="text-3xl font-bold text-red-900 mb-6">⚠️ {t('customs_mistakes_title')}</h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 bg-white p-4 rounded-lg border-l-4 border-red-500">
                <span className="text-red-600 font-bold text-xl">✗</span>
                <p className="text-gray-800">{t('customs_mistake_1')}</p>
              </div>
              <div className="flex items-start space-x-3 bg-white p-4 rounded-lg border-l-4 border-red-500">
                <span className="text-red-600 font-bold text-xl">✗</span>
                <p className="text-gray-800">{t('customs_mistake_2')}</p>
              </div>
              <div className="flex items-start space-x-3 bg-white p-4 rounded-lg border-l-4 border-red-500">
                <span className="text-red-600 font-bold text-xl">✗</span>
                <p className="text-gray-800">{t('customs_mistake_3')}</p>
              </div>
              <div className="flex items-start space-x-3 bg-white p-4 rounded-lg border-l-4 border-red-500">
                <span className="text-red-600 font-bold text-xl">✗</span>
                <p className="text-gray-800">{t('customs_mistake_4')}</p>
              </div>
              <div className="flex items-start space-x-3 bg-white p-4 rounded-lg border-l-4 border-red-500">
                <span className="text-red-600 font-bold text-xl">✗</span>
                <p className="text-gray-800">{t('customs_mistake_5')}</p>
              </div>
            </div>
          </div>

          {/* Official Links */}
          <div className="mt-12 bg-gray-50 rounded-xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🔗 {t('customs_official_links')}</h2>
            <div className="space-y-3 text-gray-700">
              <p className="flex items-center">
                <span className="mr-2">📍</span>
                {t('customs_link_1')}
              </p>
              <p className="flex items-center">
                <span className="mr-2">📍</span>
                {t('customs_link_2')}
              </p>
              <p className="flex items-center">
                <span className="mr-2">📍</span>
                {t('customs_link_3')}
              </p>
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
    </div>
  );
};

export default CustomsCalculatorPage;