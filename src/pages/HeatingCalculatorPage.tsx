import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Info, Home, Printer, Flame, TrendingUp, MapPin, Users, Droplets, Zap } from 'lucide-react';
import ActionButtons from '../components/ActionButtons';
import { HeatingCalculatorArticle } from '../components/HeatingCalculatorArticle';
import SchemaMarkup from '../components/SchemaMarkup';
import HreflangTags from '../components/HreflangTags';
import FAQSchema from '../components/FAQSchema';
import { useLanguage } from '../contexts/LanguageContext';
import {
  generateCalculatorSchema,
  generateBreadcrumbSchema
} from '../utils/schemaGenerator';
import { formatVerifiedMonth } from '../utils/dateFormatter';

// Конфигурация тарифов - легко редактируемая структура
// АКТУАЛЬНО НА: Отопительный сезон 2025–2026 (тарифы с 01.03.2026)
// Источник: Приказ Департамента по регулированию ТЭК при МЭ КР №42 от 10.03.2026;
//           bishkek.gov.kg/ru/tariffs/2
//
// ВАЖНО: в Кыргызстане НЕТ отдельных тарифов на отопление по городам — действует
// ЕДИНЫЙ национальный тариф на тепловую энергию для населения:
//   • до 80 м² (социальная норма) ........ 1950,00 сом/Гкал
//   • свыше 80 м² (по себестоимости) ...... 5998,17 сом/Гкал
// Горячая вода тарифицируется по той же тепловой энергии (1950 сом/Гкал).
// Центральное (от ТЭЦ) отопление и ГВС реально есть только в Бишкеке и Оше.
const HEAT_TARIFF_SOCIAL = 1950.00;     // сом/Гкал — площадь до 80 м²
const HEAT_TARIFF_ABOVE_NORM = 5998.17; // сом/Гкал — площадь свыше 80 м²
const SOCIAL_NORM_AREA = 80;            // м² — граница социальной нормы
const HEAT_NORM_GCAL_PER_M2 = 0.0206;   // Гкал/м² в месяц (сезонная средняя: 3.6 Гкал/сезон ÷ 35 м² ÷ 5 мес — методика Бишкектеплосети)
// ГВС: официальный тариф МП «Бишкектеплосеть» по счётчику (Приказ Деп. по рег. ТЭК №42 от 10.03.2026).
const HOT_WATER_TARIFF_PER_M3 = 141.89;     // сом/м³ по счётчику
const HOT_WATER_NORM_M3_PER_PERSON = 4.8;   // тонн/чел в месяц — норматив ГВС (тот же приказ)
// Ставка по нормативу взята из приказа НАПРЯМУЮ, а не выведена умножением: 4,8 × 141,89 = 681,072,
// и округление дало бы 681,07, тогда как в самом приказе стоит 681,08. Первоисточник важнее вывода.
const HOT_WATER_PER_PERSON = 681.08;        // сом/чел в месяц

// Единый национальный набор тарифов (одинаков для всех городов с центральным отоплением)
const NATIONAL_HEATING_TARIFF = {
  heating: {
    // Социальный тариф за 1 Гкал (до 80 м²)
    tariff_per_gcal: HEAT_TARIFF_SOCIAL,
    // Тариф за 1 Гкал свыше социальной нормы (по себестоимости)
    tariff_per_gcal_above: HEAT_TARIFF_ABOVE_NORM,
    // Норматив потребления тепла на 1 кв.м в месяц (Гкал)
    standard_gcal_per_m2: HEAT_NORM_GCAL_PER_M2
  },
  hot_water: {
    // Тариф за 1 м³ по счётчику
    tariff_per_m3: HOT_WATER_TARIFF_PER_M3,
    // Норматив на одного человека в месяц (сом)
    standard_per_person: HOT_WATER_PER_PERSON
  }
};

const HEATING_TARIFFS = {
  'bishkek': { nameKey: 'city_bishkek', ...NATIONAL_HEATING_TARIFF },
  'osh': { nameKey: 'city_osh', ...NATIONAL_HEATING_TARIFF }
};

type City = keyof typeof HEATING_TARIFFS;
type HotWaterPaymentMethod = 'meter' | 'standard';

interface HeatingResults {
  area: number;
  heatingCost: number;
  socialHeatingCost: number;
  aboveHeatingCost: number;
  hotWaterCost: number;
  totalCost: number;
  heatingConsumption: number;
  hotWaterConsumption: number;
}

const HeatingCalculatorPage = () => {
  const { language, t, getLocalizedPath} = useLanguage();

  // Генерация схем для страницы калькулятора отопления
  const generateSchemas = () => {
    const currentUrl = language === 'ky' ? "https://calk.kg/ky/calculator/heating/" : "https://calk.kg/calculator/heating/";
    const homeUrl = language === 'ky' ? "https://calk.kg/ky" : "https://calk.kg";
    
    const calculatorSchema = generateCalculatorSchema({
      url: currentUrl,
      title: t('heating_calc_title'),
      description: t('heating_calc_subtitle'),
      calculatorName: t('heating_calc_title'),
      category: t('nav_utilities'),
      language,
      inputProperties: ["area", "city", "season"],
      outputProperties: ["heatingCost", "hotWaterCost", "totalCost"]
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: homeUrl },
      { name: t('nav_utilities'), url: `${homeUrl}?category=utilities` },
      { name: t('heating_calc_title'), url: currentUrl }
    ]);

    return [calculatorSchema, breadcrumbSchema];
  };

  const [city, setCity] = useState<City>('bishkek');
  const [area, setArea] = useState<number>(60);
  const [hotWaterMethod, setHotWaterMethod] = useState<HotWaterPaymentMethod>('standard');
  const [hotWaterMeterConsumption, setHotWaterMeterConsumption] = useState<number>(5);
  const [residentCount, setResidentCount] = useState<number>(3);
  
  const [results, setResults] = useState<HeatingResults>({
    area: 0,
    heatingCost: 0,
    socialHeatingCost: 0,
    aboveHeatingCost: 0,
    hotWaterCost: 0,
    totalCost: 0,
    heatingConsumption: 0,
    hotWaterConsumption: 0
  });

  // Расчет стоимости отопления и ГВС
  const calculateHeating = (
    selectedCity: City,
    apartmentArea: number,
    method: HotWaterPaymentMethod,
    meterConsumption: number,
    residents: number
  ): HeatingResults => {
    if (apartmentArea <= 0) {
      return {
        area: apartmentArea,
        heatingCost: 0,
        socialHeatingCost: 0,
        aboveHeatingCost: 0,
        hotWaterCost: 0,
        totalCost: 0,
        heatingConsumption: 0,
        hotWaterConsumption: 0
      };
    }

    const tariff = HEATING_TARIFFS[selectedCity];

    // Расчёт отопления: до 80 м² — по социальному тарифу, площадь свыше — по
    // себестоимости. Тепловая энергия делится пропорционально площади
    // (как в официальном примере мэрии Бишкека: 80 м² по 1950, остальное по 5998,17).
    const socialArea = Math.min(apartmentArea, SOCIAL_NORM_AREA);
    const aboveArea = Math.max(0, apartmentArea - SOCIAL_NORM_AREA);
    const heatingConsumption = apartmentArea * tariff.heating.standard_gcal_per_m2;
    const socialHeatingCost = socialArea * tariff.heating.standard_gcal_per_m2 * tariff.heating.tariff_per_gcal;
    const aboveHeatingCost = aboveArea * tariff.heating.standard_gcal_per_m2 * tariff.heating.tariff_per_gcal_above;
    const heatingCost = socialHeatingCost + aboveHeatingCost;

    // Расчет горячей воды
    let hotWaterCost = 0;
    let hotWaterConsumption = 0;

    if (method === 'meter') {
      hotWaterConsumption = meterConsumption;
      hotWaterCost = meterConsumption * tariff.hot_water.tariff_per_m3;
    } else {
      hotWaterCost = residents * tariff.hot_water.standard_per_person;
      // Примерное потребление для информации
      hotWaterConsumption = residents * 2.5; // ~2.5 м³ на человека
    }

    const totalCost = heatingCost + hotWaterCost;

    return {
      area: apartmentArea,
      heatingCost,
      socialHeatingCost,
      aboveHeatingCost,
      hotWaterCost,
      totalCost,
      heatingConsumption,
      hotWaterConsumption
    };
  };

  // Обновление результатов
  useEffect(() => {
    setResults(calculateHeating(city, area, hotWaterMethod, hotWaterMeterConsumption, residentCount));
  }, [city, area, hotWaterMethod, hotWaterMeterConsumption, residentCount]);

  React.useEffect(() => {
    document.title = t('heating_calc_title') + " | Calk.KG";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('heating_calc_description'));
    }
  }, [t]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-KG', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleAreaChange = (value: number) => {
    setArea(Math.max(0, Math.min(500, value))); // Ограничение от 0 до 500 м²
  };

  const handleMeterConsumptionChange = (value: number) => {
    setHotWaterMeterConsumption(Math.max(0, Math.min(100, value))); // Ограничение от 0 до 100 м³
  };

  const handleResidentCountChange = (value: number) => {
    setResidentCount(Math.max(1, Math.min(20, value))); // Ограничение от 1 до 20 человек
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

  const currentMonth = formatVerifiedMonth(language, 'heating');
  const currentTariff = HEATING_TARIFFS[city];

  // Расчет процентов для визуализации
  const heatingPercentage = results.totalCost > 0 ? (results.heatingCost / results.totalCost) * 100 : 0;
  const hotWaterPercentage = 100 - heatingPercentage;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org микроразметка */}
      <Helmet>
        <title>{t('heating_calc_title')} | Calk.KG</title>
        <meta name="description" content={t('heating_calc_subtitle')} />
        <meta name="keywords" content={t('heating_keywords')} />
        <meta property="og:title" content={`${t('heating_calc_title')} | Calk.KG`} />
        <meta property="og:description" content={t('heating_calc_subtitle')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/heating/" : "https://calk.kg/calculator/heating/"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/heating.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta property="og:site_name" content="Calk.KG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('heating_calc_title')} | Calk.KG`} />
        <meta name="twitter:description" content={t('heating_calc_subtitle')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/heating.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/heating/" : "https://calk.kg/calculator/heating/"} />
      </Helmet>
      <HreflangTags path="/calculator/heating" />
      <FAQSchema translationPrefix="heating" />
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
              <Flame className="h-8 w-8 print:text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold print:text-2xl">{t('heating_calc_title')}</h1>
              <p className="text-red-100 text-lg print:text-gray-600">{t('heating_calc_subtitle')}</p>
            </div>
          </div>
          
          {/* Current Location */}
          <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3 print:hidden">
            <MapPin className="h-5 w-5 text-amber-200" />
            <span className="text-amber-100 text-sm">
              {t('heating_current_region')} {t(currentTariff.nameKey)} • {t('heating_tariffs_actual')} {currentMonth}
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
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('heating_calc_params')}</h2>

              {/* City Selection */}
              <div className="mb-8">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('heating_city_region')}
                  </label>
                  <Tooltip text={t('tooltip_heating_city')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value as City)}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg print:text-base"
                >
                  {Object.entries(HEATING_TARIFFS).map(([key, cityData]) => (
                    <option key={key} value={key}>{t(cityData.nameKey)}</option>
                  ))}
                </select>
              </div>

              {/* Heating Section */}
              <div className="mb-8 p-6 bg-amber-50 rounded-xl border border-amber-200">
                <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                  <Flame className="h-5 w-5 text-amber-600 mr-2" />
                  {t('heating_title')}
                </h3>

                {/* Area Slider */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <label className="block text-sm font-medium text-gray-700">
                        {t('heating_heated_area')}
                      </label>
                      <Tooltip text={t('tooltip_heating_area')}>
                        <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                      </Tooltip>
                    </div>
                    <span className="text-2xl font-bold text-amber-600">{area}</span>
                  </div>
                  
                  {/* Slider */}
                  <div className="mb-4">
                    <input
                      type="range"
                      min="0"
                      max="500"
                      step="5"
                      value={area}
                      onChange={(e) => handleAreaChange(parseInt(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-heating"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>250</span>
                      <span>500 {t('unit_sqm')}</span>
                    </div>
                  </div>

                  {/* Number Input */}
                  <div className="mt-4">
                    <input
                      type="number"
                      value={area}
                      onChange={(e) => handleAreaChange(parseInt(e.target.value) || 0)}
                      min="0"
                      max="500"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-center text-lg"
                    />
                  </div>
                </div>

                {/* Heating Calculation Info */}
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>{t('heating_standard_consumption')}</span>
                      <span>{currentTariff.heating.standard_gcal_per_m2} {t('heating_gcal')}/{t('unit_sqm')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('heating_tariff_per_gcal')}</span>
                      <span>{formatCurrency(currentTariff.heating.tariff_per_gcal)} {t('text_som')}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>{t('heating_consumption_for')} {area} {t('unit_sqm')}:</span>
                      <span>{(area * currentTariff.heating.standard_gcal_per_m2).toFixed(3)} {t('heating_gcal')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hot Water Section */}
              <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                  <Droplets className="h-5 w-5 text-blue-600 mr-2" />
                  {t('heating_hot_water_title')}
                </h3>

                {/* Payment Method Selection */}
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      {t('heating_payment_method')}
                    </label>
                    <Tooltip text={t('tooltip_heating_water_method')}>
                      <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                    </Tooltip>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-white transition-colors">
                      <input
                        type="radio"
                        name="hotWaterMethod"
                        value="meter"
                        checked={hotWaterMethod === 'meter'}
                        onChange={() => setHotWaterMethod('meter')}
                        className="h-4 w-4 text-red-600 focus:ring-red-500"
                      />
                      <div>
                        <span className="text-gray-900 font-medium">{t('heating_by_meter')}</span>
                        <p className="text-sm text-gray-500">{t('heating_by_meter_desc')}</p>
                      </div>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-white transition-colors">
                      <input
                        type="radio"
                        name="hotWaterMethod"
                        value="standard"
                        checked={hotWaterMethod === 'standard'}
                        onChange={() => setHotWaterMethod('standard')}
                        className="h-4 w-4 text-red-600 focus:ring-red-500"
                      />
                      <div>
                        <span className="text-gray-900 font-medium">{t('heating_by_standard')}</span>
                        <p className="text-sm text-gray-500">{t('heating_by_standard_desc')}</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Dynamic Input Fields */}
                {hotWaterMethod === 'meter' ? (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <label className="block text-sm font-medium text-gray-700">
                          {t('heating_hot_water_consumption')}
                        </label>
                        <Tooltip text={t('tooltip_heating_water_meter')}>
                          <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                        </Tooltip>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">{hotWaterMeterConsumption}</span>
                    </div>
                    
                    {/* Slider */}
                    <div className="mb-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={hotWaterMeterConsumption}
                        onChange={(e) => handleMeterConsumptionChange(parseInt(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-water"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0</span>
                        <span>50</span>
                        <span>100 {t('unit_m3')}</span>
                      </div>
                    </div>

                    <input
                      type="number"
                      value={hotWaterMeterConsumption}
                      onChange={(e) => handleMeterConsumptionChange(parseInt(e.target.value) || 0)}
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-center text-lg"
                    />
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <label className="block text-sm font-medium text-gray-700">
                          {t('heating_residents_count')}
                        </label>
                        <Tooltip text={t('tooltip_heating_residents')}>
                          <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                        </Tooltip>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">{residentCount}</span>
                    </div>

                    {/* Slider */}
                    <div className="mb-4">
                      <input
                        type="range"
                        min="1"
                        max="20"
                        step="1"
                        value={residentCount}
                        onChange={(e) => handleResidentCountChange(parseInt(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-residents"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1</span>
                        <span>10</span>
                        <span>20 {t('heating_residents_unit')}</span>
                      </div>
                    </div>

                    <input
                      type="number"
                      value={residentCount}
                      onChange={(e) => handleResidentCountChange(parseInt(e.target.value) || 1)}
                      min="1"
                      max="20"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-center text-lg"
                    />
                  </div>
                )}

                {/* Hot Water Calculation Info */}
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600 space-y-1">
                    {hotWaterMethod === 'meter' ? (
                      <>
                        <div className="flex justify-between">
                          <span>{t('heating_tariff_by_meter_label')}</span>
                          <span>{formatCurrency(currentTariff.hot_water.tariff_per_m3)} {t('heating_som_m3')}</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>{t('heating_to_pay_for')} {hotWaterMeterConsumption} {t('unit_m3')}:</span>
                          <span>{formatCurrency(hotWaterMeterConsumption * currentTariff.hot_water.tariff_per_m3)} {t('text_som')}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span>{t('heating_standard_per_person_label')}</span>
                          <span>{formatCurrency(currentTariff.hot_water.standard_per_person)} {t('heating_som_person')}</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>{t('heating_to_pay_for_people')} {residentCount} {t('heating_people_unit')}:</span>
                          <span>{formatCurrency(residentCount * currentTariff.hot_water.standard_per_person)} {t('text_som')}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Info Block */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-2">{t('heating_calc_features')}</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>{t('heating_calc_note_1')}</li>
                      <li>{t('heating_calc_note_2_full')}</li>
                      <li>{t('heating_calc_note_3_full')}</li>
                      <li>{t('heating_calc_note_4_full')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-8 print:shadow-none print:border print:break-inside-avoid">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">{t('heating_bill_details')}</h2>
                {results.totalCost > 0 && (
                  <button
                    onClick={handlePrint}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors print:hidden"
                  >
                    <Printer className="h-4 w-4" />
                    <span>{t('print')}</span>
                  </button>
                )}
              </div>
              
              {results.totalCost > 0 ? (
                <div className="space-y-6">
                  {/* Total Cost - Main Result */}
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-8 text-white text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Flame className="h-6 w-6 mr-2" />
                      <span className="text-amber-100">{t('heating_payment_monthly')}</span>
                    </div>
                    <p className="text-5xl font-bold mb-2">
                      {formatCurrency(results.totalCost)} {t('text_som')}
                    </p>
                    <p className="text-amber-100">
                      {area} {t('unit_sqm')} • {t(currentTariff.nameKey)}
                    </p>
                  </div>

                  {/* Service Structure Visualization */}
                  {results.heatingCost > 0 && results.hotWaterCost > 0 && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        {t('heating_payment_structure')}
                      </h3>
                      <div className="space-y-4">
                        {/* Heating Cost Bar */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">{t('heating_cost_label')}</span>
                            <span className="text-sm font-medium text-amber-600">
                              {heatingPercentage.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-amber-500 to-amber-600 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${heatingPercentage}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Hot Water Cost Bar */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">{t('heating_hot_water')}</span>
                            <span className="text-sm font-medium text-blue-600">
                              {hotWaterPercentage.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${hotWaterPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Detailed Breakdown */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700 text-lg">{t('heating_bill_details')}:</h3>
                    
                    {/* Heating Cost */}
                    <div className="bg-amber-50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Flame className="h-5 w-5 text-amber-600 mr-2" />
                          <span className="text-gray-700 font-medium">{t('heating_cost_title')}</span>
                          <Tooltip text={t('heating_cost_calculation_note')}>
                            <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-amber-600 font-semibold text-xl">
                          {formatCurrency(results.heatingCost)} {t('text_som')}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex justify-between">
                          <span>{t('heating_area_result')}</span>
                          <span>{area} {t('unit_sqm')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('heating_norm_result')}</span>
                          <span>{currentTariff.heating.standard_gcal_per_m2} {t('heating_gcal')}/{t('unit_sqm')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('heating_consumption_result')}</span>
                          <span>{results.heatingConsumption.toFixed(3)} {t('heating_gcal')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('heating_tariff_result')}</span>
                          <span>{formatCurrency(currentTariff.heating.tariff_per_gcal)} {t('heating_som_gcal')}</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          {area > SOCIAL_NORM_AREA ? (
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span>{t('heating_within_norm')}</span>
                                <span>{SOCIAL_NORM_AREA} × {currentTariff.heating.standard_gcal_per_m2} × {formatCurrency(currentTariff.heating.tariff_per_gcal)} = {formatCurrency(results.socialHeatingCost)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>{t('heating_above_norm')}</span>
                                <span>{area - SOCIAL_NORM_AREA} × {currentTariff.heating.standard_gcal_per_m2} × {formatCurrency(currentTariff.heating.tariff_per_gcal_above)} = {formatCurrency(results.aboveHeatingCost)}</span>
                              </div>
                              <div className="flex justify-between font-medium border-t pt-1">
                                <span>{t('heating_calc_formula')}</span>
                                <span>{formatCurrency(results.heatingCost)} {t('text_som')}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-between font-medium">
                              <span>{t('heating_calc_formula')}</span>
                              <span>
                                {area} × {currentTariff.heating.standard_gcal_per_m2} × {formatCurrency(currentTariff.heating.tariff_per_gcal)} = {formatCurrency(results.heatingCost)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Hot Water Cost */}
                    <div className="bg-blue-50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Droplets className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="text-gray-700 font-medium">{t('heating_hot_water_cost_title')}</span>
                          <Tooltip text={`${t('heating_hot_water_cost_note')} ${hotWaterMethod === 'meter' ? t('heating_by_meter_short') : t('heating_by_standard_short')}`}>
                            <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-blue-600 font-semibold text-xl">
                          {formatCurrency(results.hotWaterCost)} {t('text_som')}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        {hotWaterMethod === 'meter' ? (
                          <>
                            <div className="flex justify-between">
                              <span>{t('heating_consumption_result')}</span>
                              <span>{hotWaterMeterConsumption} {t('unit_m3')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t('heating_tariff_result')}</span>
                              <span>{formatCurrency(currentTariff.hot_water.tariff_per_m3)} {t('heating_som_m3')}</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                              <div className="flex justify-between font-medium">
                                <span>{t('heating_calc_formula')}</span>
                                <span>
                                  {hotWaterMeterConsumption} × {formatCurrency(currentTariff.hot_water.tariff_per_m3)} = {formatCurrency(results.hotWaterCost)}
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between">
                              <span>{t('heating_residents_result')}</span>
                              <span>{residentCount} {t('heating_people_unit')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t('heating_norm_result')}</span>
                              <span>{formatCurrency(currentTariff.hot_water.standard_per_person)} {t('heating_som_person')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t('heating_approx_cons')}</span>
                              <span>~{results.hotWaterConsumption.toFixed(1)} {t('unit_m3')}</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                              <div className="flex justify-between font-medium">
                                <span>{t('heating_calc_formula')}</span>
                                <span>
                                  {residentCount} × {formatCurrency(currentTariff.hot_water.standard_per_person)} = {formatCurrency(results.hotWaterCost)}
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-700 mb-3">{t('heating_summary_label')}</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>{t('heating_city_label')}</span>
                        <span>{t(currentTariff.nameKey)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('heating_area_heated')}</span>
                        <span>{area} {t('unit_sqm')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('heating_gws')}</span>
                        <span>
                          {hotWaterMethod === 'meter'
                            ? `${t('heating_by_meter_with_value')} (${hotWaterMeterConsumption} ${t('unit_m3')})`
                            : `${t('heating_by_standard_with_value')} (${residentCount} ${t('heating_people_unit')})`
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('heating_season_period')}</span>
                        <span>{t('heating_season_months')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <Flame className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">{t('set_area_for_calculation')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Regional Comparison */}
        {results.totalCost > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
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
                      {t('heating_title')} ({t('som_per_gcal')})
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('heating_hot_water_short')} ({t('som_per_cubic')})
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('cost_for_area')} {area} {t('unit_sqm')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Current Selection */}
                  <tr className="bg-green-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {t(currentTariff.nameKey)} <span className="text-xs text-gray-500">{t('your_choice')}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {formatCurrency(currentTariff.heating.tariff_per_gcal)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {formatCurrency(currentTariff.hot_water.tariff_per_m3)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {formatCurrency(results.totalCost)} {t('text_som')}
                    </td>
                  </tr>
                  
                  {/* Other Cities */}
                  {Object.entries(HEATING_TARIFFS)
                    .filter(([key]) => key !== city)
                    .map(([cityKey, cityData]) => {
                      const otherResult = calculateHeating(
                        cityKey as City, 
                        area, 
                        hotWaterMethod, 
                        hotWaterMeterConsumption, 
                        residentCount
                      );
                      const isCheaper = otherResult.totalCost < results.totalCost;
                      const isMoreExpensive = otherResult.totalCost > results.totalCost;
                      
                      return (
                        <tr key={cityKey} className={isCheaper ? 'bg-blue-50' : isMoreExpensive ? 'bg-red-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {t(cityData.nameKey)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(cityData.heating.tariff_per_gcal)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(cityData.hot_water.tariff_per_m3)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(otherResult.totalCost)} {t('text_som')}
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
                  <span>{t('heating_cheaper_tariffs')}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-50 border border-red-200 rounded mr-2"></div>
                  <span>{t('heating_expensive_tariffs')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Examples */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-8 print:hidden">
          <h3 className="font-medium text-gray-900 mb-4">{t('heating_examples_title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { area: 40, method: 'standard' as HotWaterPaymentMethod, residents: 2, labelKey: 'heating_example_1room' },
              { area: 60, method: 'meter' as HotWaterPaymentMethod, consumption: 4, labelKey: 'heating_example_2room' },
              { area: 80, method: 'standard' as HotWaterPaymentMethod, residents: 4, labelKey: 'heating_example_3room' }
            ].map((example, index) => {
              const exampleResult = calculateHeating(
                city, 
                example.area, 
                example.method, 
                example.method === 'meter' ? (example as any).consumption || 5 : 5,
                example.method === 'standard' ? example.residents || 3 : 3
              );
              return (
                <button
                  key={index}
                  onClick={() => {
                    setArea(example.area);
                    setHotWaterMethod(example.method);
                    if (example.method === 'meter') {
                      setHotWaterMeterConsumption((example as any).consumption || 5);
                    } else {
                      setResidentCount(example.residents || 3);
                    }
                  }}
                  className="text-left p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium text-sm">
                      {t(example.labelKey)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {example.area} {t('unit_sqm')}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-amber-600 font-semibold">
                      {formatCurrency(exampleResult.totalCost)} {t('som')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {t('heating_example_heating')} {formatCurrency(exampleResult.heatingCost)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {t('heating_example_gws')} {formatCurrency(exampleResult.hotWaterCost)}
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
              to={getLocalizedPath("/calculator/electricity")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-amber-50 p-2 rounded-lg group-hover:bg-amber-100 transition-colors">
                  <Zap className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-red-600">{t('heating_electricity')}</div>
                  <div className="text-sm text-gray-500">{t('heating_electricity_desc')}</div>
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
                  <div className="font-medium text-gray-900 group-hover:text-red-600">{t('heating_water_supply')}</div>
                  <div className="text-sm text-gray-500">{t('heating_water_supply_desc')}</div>
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
                  <div className="font-medium text-gray-900 group-hover:text-red-600">{t('heating_natural_gas')}</div>
                  <div className="text-sm text-gray-500">{t('heating_natural_gas_desc')}</div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Educational Content - Russian and Kyrgyz */}
        {(language === 'ru' || language === 'ky') && (
        <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('heating_guide_title')}</h2>

          {/* Section 1: Understanding Heating */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('heating_how_works')}</h3>
            <p className="text-gray-700 mb-4">
              {t('heating_how_it_works_text')}
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <p className="text-gray-700">
                <strong>{t('heating_gcal_definition')}</strong> - {t('heating_gcal_description')}
              </p>
            </div>
          </div>

          {/* Section 2: Tariff Structure */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('heating_tariff_structure')}</h3>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-gray-900 mb-2">{t('heating_category_heating')}</h4>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>{t('heating_two_ways')}</p>
                  <div className="bg-gray-50 rounded p-3">
                    <p className="mb-2"><strong>{t('heating_method_a')}</strong></p>
                    <p className="text-gray-600 mb-2">{t('heating_method_a_formula')}</p>
                    <p className="text-xs text-gray-500">{t('heating_example_gcal')}</p>
                  </div>
                  <div className="bg-gray-50 rounded p-3 mt-2">
                    <p className="mb-2"><strong>{t('heating_method_b')}</strong></p>
                    <p className="text-gray-600 mb-2">{t('heating_method_b_formula')}</p>
                    <p className="text-xs text-gray-500">{t('heating_example_sqm')}</p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-gray-900 mb-2">{t('heating_category_hot_water')}</h4>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>{t('heating_two_ways')}</p>
                  <div className="bg-gray-50 rounded p-3">
                    <p className="mb-2"><strong>{t('heating_hw_method_a')}</strong></p>
                    <p className="text-gray-600 mb-2">{t('heating_hw_method_a_formula')}</p>
                    <p className="text-xs text-gray-500">{t('heating_example_hw_meter')}</p>
                  </div>
                  <div className="bg-gray-50 rounded p-3 mt-2">
                    <p className="mb-2"><strong>{t('heating_hw_method_b')}</strong></p>
                    <p className="text-gray-600 mb-2">{t('heating_hw_method_b_formula')}</p>
                    <p className="text-xs text-gray-500">{t('heating_example_hw_person')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Installation of Meters */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('heating_meter_install_title')}</h3>

            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                <h4 className="font-semibold text-gray-900 mb-3">{t('heating_hw_meter_economy')}</h4>
                <div className="text-sm text-gray-700">
                  <p className="mb-2">{t('heating_real_consumption')}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    <div className="bg-white rounded p-3">
                      <p className="text-xs text-gray-500 mb-1">{t('heating_by_standard_label')}</p>
                      <p className="font-medium">{t('heating_example_hw_meter_calc')}</p>
                    </div>
                    <div className="bg-white rounded p-3">
                      <p className="text-xs text-gray-500 mb-1">{t('heating_by_meter_3m3')}</p>
                      <p className="font-medium text-green-600">{t('heating_example_hw_meter_savings')}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-green-700 font-medium">{t('heating_savings_full')}</p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-gray-900 mb-3">{t('heating_how_to_install')}</h4>
                <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2">
                  <li>{t('heating_install_step1')}</li>
                  <li>{t('heating_install_step2')}</li>
                  <li>{t('heating_install_step3')}</li>
                  <li>{t('heating_install_step4')}</li>
                  <li>{t('heating_install_step5')}</li>
                </ol>
                <div className="bg-blue-50 rounded p-3 mt-3">
                  <p className="text-xs text-gray-600">
                    {t('heating_payback_period')}
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-gray-900 mb-3">{t('heating_building_meter')}</h4>
                <p className="text-sm text-gray-700 mb-3">
                  {t('heating_home_meter_desc')}
                </p>
                <div className="bg-yellow-50 rounded p-3">
                  <p className="text-xs text-gray-600">
                    <strong>{t('heating_important')}</strong> {t('heating_home_meter_decision')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Energy Saving */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('heating_saving_title')}</h3>

            <div className="space-y-3">
              <div className="border-l-4 border-orange-500 pl-4 py-2">
                <h4 className="font-semibold text-gray-900 mb-1">{t('heating_tip1_title')}</h4>
                <p className="text-gray-700 text-sm">
                  {t('heating_saving_tip1_desc')}
                </p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4 py-2">
                <h4 className="font-semibold text-gray-900 mb-1">{t('heating_saving_tip2_title')}</h4>
                <p className="text-gray-700 text-sm">
                  {t('heating_saving_tip2_desc')}
                </p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4 py-2">
                <h4 className="font-semibold text-gray-900 mb-1">{t('heating_saving_tip3_title')}</h4>
                <p className="text-gray-700 text-sm">
                  {t('heating_saving_tip3_desc')}
                </p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4 py-2">
                <h4 className="font-semibold text-gray-900 mb-1">{t('heating_tip4_title')}</h4>
                <p className="text-gray-700 text-sm">
                  {t('heating_saving_tip4_desc')}
                </p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4 py-2">
                <h4 className="font-semibold text-gray-900 mb-1">5. {t('heating_install_reflective_screens')}</h4>
                <p className="text-gray-700 text-sm">
                  {t('heating_saving_tip5_desc')}
                </p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4 py-2">
                <h4 className="font-semibold text-gray-900 mb-1">{t('heating_tip6_title')}</h4>
                <p className="text-gray-700 text-sm">
                  {t('heating_saving_tip6_desc')}
                </p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4 py-2">
                <h4 className="font-semibold text-gray-900 mb-1">{t('heating_tip7_title')}</h4>
                <p className="text-gray-700 text-sm">
                  {t('heating_saving_tip7_desc')}
                </p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-5 mt-4">
              <p className="text-gray-700">
                <strong>{t('heating_total_savings')}</strong> {t('heating_total_savings_desc')} {t('heating_total_savings_extra')}
              </p>
            </div>
          </div>

          {/* Section 5: FAQ */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('heating_faq_title')}</h3>

            <div className="space-y-4">
              <details className="border border-gray-200 rounded-lg p-5 cursor-pointer hover:bg-gray-50">
                <summary className="font-semibold text-gray-900">
                  {t('heating_faq_q1')}
                </summary>
                <p className="text-gray-700 mt-3 text-sm">
                  {t('heating_faq_a1')}
                </p>
              </details>

              <details className="border border-gray-200 rounded-lg p-5 cursor-pointer hover:bg-gray-50">
                <summary className="font-semibold text-gray-900">
                  {t('heating_faq_q2')}
                </summary>
                <p className="text-gray-700 mt-3 text-sm">
                  {t('heating_faq_a2')}
                </p>
              </details>

              <details className="border border-gray-200 rounded-lg p-5 cursor-pointer hover:bg-gray-50">
                <summary className="font-semibold text-gray-900">
                  {t('heating_faq_q3')}
                </summary>
                <p className="text-gray-700 mt-3 text-sm">
                  {t('heating_faq_a3')}
                </p>
              </details>

              <details className="border border-gray-200 rounded-lg p-5 cursor-pointer hover:bg-gray-50">
                <summary className="font-semibold text-gray-900">
                  {t('heating_faq_q4')}
                </summary>
                <p className="text-gray-700 mt-3 text-sm">
                  {t('heating_faq_a4')}
                </p>
              </details>

              <details className="border border-gray-200 rounded-lg p-5 cursor-pointer hover:bg-gray-50">
                <summary className="font-semibold text-gray-900">
                  {t('heating_faq_q5')}
                </summary>
                <p className="text-gray-700 mt-3 text-sm">
                  {t('heating_faq_a5')}
                </p>
              </details>

              <details className="border border-gray-200 rounded-lg p-5 cursor-pointer hover:bg-gray-50">
                <summary className="font-semibold text-gray-900">
                  {t('heating_faq_q6')}
                </summary>
                <div className="text-gray-700 mt-3 text-sm">
                  <p className="mb-2"><strong>{t('heating_faq_a6_title')}</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-gray-600">
                    <li>{t('heating_faq_a6_item1')}</li>
                    <li>{t('heating_faq_a6_item2')}</li>
                    <li>{t('heating_faq_a6_item3')}</li>
                    <li><strong>{t('text_total')} {t('heating_faq_a6_total1')}</strong></li>
                    <li><strong>{t('text_total')} {t('heating_faq_a6_total2')}</strong></li>
                    <li>{t('heating_faq_a6_season')}</li>
                  </ul>
                </div>
              </details>
            </div>
          </div>

          {/* Section 6: Contacts */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('heating_contacts_title')}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{t('heating_contact_bishkek')}</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>☎ {t('heating_emergency_line')}</p>
                  <p>☎ +996 (312) 62-02-02</p>
                  <p>📍 {t('heating_bishkek_address')}</p>
                  <p>⏰ {t('heating_24h')}</p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{t('heating_osh_teploenergo')}</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>☎ +996 (3222) 5-11-11</p>
                  <p>📍 {t('heating_osh_address')}</p>
                  <p>⏰ {t('heating_contact_osh_hours')}</p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{t('heating_karakol_teploseti')}</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>☎ +996 (3922) 5-22-33</p>
                  <p>📍 {t('heating_karakol_address')}</p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{t('heating_tec_bishkek')}</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>☎ +996 (312) 54-40-10</p>
                  <p>📍 {t('heating_tec_address')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Method Comparison */}
        {results.totalCost > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
            <h3 className="font-medium text-gray-900 mb-6">{t('heating_payment_comparison')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-6 rounded-xl border-2 ${hotWaterMethod === 'meter' ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">{t('heating_by_meter')}</h4>
                  {hotWaterMethod === 'meter' && (
                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">{t('heating_current_choice')}</span>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{t('heating_consumption')}</span>
                    <span>{hotWaterMeterConsumption} {t('unit_m3')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('heating_tariff')}</span>
                    <span>{formatCurrency(currentTariff.hot_water.tariff_per_m3)} {t('unit_som_m3')}</span>
                  </div>
                  <div className="flex justify-between font-medium text-blue-600">
                    <span>{t('heating_to_pay')}</span>
                    <span>{formatCurrency(hotWaterMeterConsumption * currentTariff.hot_water.tariff_per_m3)} {t('text_som')}</span>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl border-2 ${hotWaterMethod === 'standard' ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">{t('heating_by_standard')}</h4>
                  {hotWaterMethod === 'standard' && (
                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">{t('current_selection')}</span>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{t('residents_label')}</span>
                    <span>{residentCount} {t('persons_short')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('standard_label')}</span>
                    <span>{formatCurrency(currentTariff.hot_water.standard_per_person)} {t('som_per_person')}</span>
                  </div>
                  <div className="flex justify-between font-medium text-blue-600">
                    <span>{t('to_payment')}</span>
                    <span>{formatCurrency(residentCount * currentTariff.hot_water.standard_per_person)} {t('text_som')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>{t('heating_advice')}</strong> {t('heating_advice_desc')} {t('heating_meter_threshold', { value: (currentTariff.hot_water.standard_per_person / currentTariff.hot_water.tariff_per_m3).toFixed(1) })}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Info className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-2">{t('heating_important_info')}</p>
              <p className="mb-2">
                <strong>{t('heating_tariffs_current')} {currentMonth}.</strong> {t('heating_preliminary_calc')}
              </p>
              <p>
                {t('heating_for_exact_info')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Slider Styles */}
      <style>{`
        .slider-heating::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #f59e0b;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider-heating::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #f59e0b;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider-water::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider-water::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider-residents::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #7c3aed;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider-residents::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #7c3aed;
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


      {/* Информационная статья под калькулятором */}
      <HeatingCalculatorArticle />
export default HeatingCalculatorPage;