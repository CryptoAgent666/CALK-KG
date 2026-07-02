import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Info, Home, Car, AlertTriangle, Calendar, DollarSign } from 'lucide-react';
import ActionButtons from '../components/ActionButtons';
import { CustomsCalculatorArticle } from '../components/CustomsCalculatorArticle';
import SchemaMarkup from '../components/SchemaMarkup';
import HreflangTags from '../components/HreflangTags';
import FAQSchema from '../components/FAQSchema';
import { useLanguage } from '../contexts/LanguageContext';
import {
  generateCalculatorSchema,
  generateBreadcrumbSchema,
  generateSoftwareApplicationSchema
} from '../utils/schemaGenerator';
import { formatCurrentMonth } from '../utils/dateFormatter';

type VehicleType = 'passenger' | 'electric' | 'hybrid' | 'truck' | 'motorcycle';

interface CustomsResults {
  customsStoicostValue: number;
  customsFee: number;
  customsDuty: number;
  exciseTax: number;
  vat: number;
  totalCost: number;
  benefitAmount?: number; // Сумма льготы для EV/Hybrid
}

interface AdditionalCosts {
  delivery: number;
  broker: number;
  registration: number;
  insurance: number;
  inspection: number;
  total: number;
}

// Актуальные ставки таможенных пошлин КР согласно единым тарифам ЕАЭС (2026)
// С учетом льгот для электромобилей и гибридов
const getDutyRate = (
  year: number, 
  engineVolume: number, 
  vehicleType: VehicleType = 'passenger',
  truckWeight?: number
): { dutyRate: number; exciseRate: number } => {
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;

  // Электромобили: ЛЬГОТА - 0% пошлина до 2027 года
  if (vehicleType === 'electric') {
    return { dutyRate: 0, exciseRate: 0 };
  }

  // Гибриды: стандартная ставка ЕАЭС 15% (нов.) / 20% (б/у). Спец-ставки «10% на гибриды» нет;
  // 0% — только чистые EV и последовательные (serial) гибриды (код 8703 80 000 5, квота, с 22.01.2026).
  // Авто в КР НЕ облагаются акцизом (НК КР ст.334 — нет ТН ВЭД 8703 в перечне подакцизных).
  if (vehicleType === 'hybrid') {
    return { dutyRate: age <= 3 ? 0.15 : 0.20, exciseRate: 0 };
  }

  // Грузовые автомобили: фиксированная ставка + зависит от веса
  if (vehicleType === 'truck') {
    const weight = truckWeight || 3.5;
    if (weight <= 5) return { dutyRate: 0.15, exciseRate: 0 };
    if (weight <= 20) return { dutyRate: 0.15, exciseRate: 0 };
    return { dutyRate: 0.15, exciseRate: 0 };
  }

  // Мотоциклы: упрощенная схема
  if (vehicleType === 'motorcycle') {
    if (engineVolume <= 250) return { dutyRate: 0.10, exciseRate: 0 };
    if (engineVolume <= 500) return { dutyRate: 0.15, exciseRate: 0 };
    if (engineVolume <= 800) return { dutyRate: 0.15, exciseRate: 0 };
    return { dutyRate: 0.15, exciseRate: 0 };
  }

  // Легковые автомобили: стандартные ставки ЕАЭС
  // Новые автомобили (до 3 лет)
  if (age <= 3) {
    if (engineVolume <= 1000) return { dutyRate: 0.15, exciseRate: 0 };
    if (engineVolume <= 1500) return { dutyRate: 0.15, exciseRate: 0 };
    if (engineVolume <= 1800) return { dutyRate: 0.15, exciseRate: 0 };
    if (engineVolume <= 2300) return { dutyRate: 0.15, exciseRate: 0 };
    if (engineVolume <= 3000) return { dutyRate: 0.15, exciseRate: 0 };
    return { dutyRate: 0.15, exciseRate: 0 };
  }
  // Подержанные автомобили (старше 3 лет)
  else {
    if (engineVolume <= 1000) return { dutyRate: 0.20, exciseRate: 0 };
    if (engineVolume <= 1500) return { dutyRate: 0.20, exciseRate: 0 };
    if (engineVolume <= 1800) return { dutyRate: 0.20, exciseRate: 0 };
    if (engineVolume <= 2300) return { dutyRate: 0.20, exciseRate: 0 };
    if (engineVolume <= 3000) return { dutyRate: 0.20, exciseRate: 0 };
    return { dutyRate: 0.20, exciseRate: 0 };
  }
};

const CustomsCalculatorPage = () => {
  const { t, language, getLocalizedPath } = useLanguage();

  const [vehicleType, setVehicleType] = useState<VehicleType>('passenger');
  const [year, setYear] = useState<string>('');
  const [engineVolume, setEngineVolume] = useState<string>('');
  const [customsValue, setCustomsValue] = useState<string>('');
  const [truckWeight, setTruckWeight] = useState<string>('3.5');
  
  // Additional costs
  const [deliveryCost, setDeliveryCost] = useState<string>('');
  const [brokerFee, setBrokerFee] = useState<string>('300');
  const [registrationFee, setRegistrationFee] = useState<string>('150');
  const [insuranceCost, setInsuranceCost] = useState<string>('100');
  const [inspectionCost, setInspectionCost] = useState<string>('50');
  
  const [results, setResults] = useState<CustomsResults>({
    customsStoicostValue: 0,
    customsFee: 0,
    customsDuty: 0,
    exciseTax: 0,
    vat: 0,
    totalCost: 0,
    benefitAmount: 0
  });

  const [additionalCosts, setAdditionalCosts] = useState<AdditionalCosts>({
    delivery: 0,
    broker: 0,
    registration: 0,
    insurance: 0,
    inspection: 0,
    total: 0
  });

  // Расчет таможенных платежей
  const calculateCustoms = (
    carYear: number, 
    volume: number, 
    value: number, 
    type: VehicleType = 'passenger',
    weight?: number
  ): CustomsResults => {
    if (value <= 0 || carYear <= 0 || volume <= 0) {
      return { 
        customsStoicostValue: value, 
        customsFee: 0, 
        customsDuty: 0, 
        exciseTax: 0, 
        vat: 0, 
        totalCost: 0,
        benefitAmount: 0 
      };
    }

    // Получаем ставки из матрицы с учетом типа ТС
    const { dutyRate, exciseRate } = getDutyRate(carYear, volume, type, weight);

    // 1. Таможенный сбор (0.4% от стоимости)
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

    // 6. Рассчитываем сумму льготы (для EV и Hybrid)
    let benefitAmount = 0;
    if (type === 'electric') {
      // Для электромобилей: экономия на пошлине (15-20%)
      const standardRate = carYear && (new Date().getFullYear() - carYear) <= 3 ? 0.15 : 0.20;
      benefitAmount = value * standardRate;
    }
    // Параллельные/смешанные гибриды льготы НЕ имеют (платят полную ставку 15%/20%).
    // 0% — только чистые EV и последовательные гибриды (отдельная льгота ЕЭК).

    return {
      customsStoicostValue: value,
      customsFee,
      customsDuty,
      exciseTax,
      vat,
      totalCost,
      benefitAmount
    };
  };

  // Расчет дополнительных расходов
  const calculateAdditionalCosts = (
    delivery: number,
    broker: number,
    registration: number,
    insurance: number,
    inspection: number
  ): AdditionalCosts => {
    const total = delivery + broker + registration + insurance + inspection;
    return { delivery, broker, registration, insurance, inspection, total };
  };

  // Обновление результатов таможенных платежей
  useEffect(() => {
    const carYear = parseInt(year) || 0;
    const volume = parseInt(engineVolume) || 0;
    const value = parseFloat(customsValue) || 0;
    const weight = parseFloat(truckWeight) || 3.5;

    if (carYear > 0 && volume > 0 && value > 0) {
      setResults(calculateCustoms(carYear, volume, value, vehicleType, weight));
    } else {
      setResults({ 
        customsStoicostValue: value, 
        customsFee: 0, 
        customsDuty: 0, 
        exciseTax: 0, 
        vat: 0, 
        totalCost: 0,
        benefitAmount: 0 
      });
    }
  }, [year, engineVolume, customsValue, vehicleType, truckWeight]);

  // Обновление дополнительных расходов
  useEffect(() => {
    const delivery = parseFloat(deliveryCost) || 0;
    const broker = parseFloat(brokerFee) || 0;
    const registration = parseFloat(registrationFee) || 0;
    const insurance = parseFloat(insuranceCost) || 0;
    const inspection = parseFloat(inspectionCost) || 0;

    setAdditionalCosts(calculateAdditionalCosts(delivery, broker, registration, insurance, inspection));
  }, [deliveryCost, brokerFee, registrationFee, insuranceCost, inspectionCost]);

  // Генерация схем для страницы таможенного калькулятора
  const generateSchemas = () => {
    const currentUrl = language === 'ky' ? "https://calk.kg/ky/calculator/customs/" : "https://calk.kg/calculator/customs/";
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
        <title>{t('customs_calc_title')} | Calk.KG</title>
        <meta name="description" content={t('customs_calc_description')} />
        <meta name="keywords" content={t('customs_calc_keywords')} />
        <meta property="og:title" content={`${t('customs_calc_title')} | Calk.KG`} />
        <meta property="og:description" content={t('customs_calc_description')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/customs/" : "https://calk.kg/calculator/customs/"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/customs.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta property="og:site_name" content="Calk.KG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('customs_calc_title')} | Calk.KG`} />
        <meta name="twitter:description" content={t('customs_calc_description')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/customs.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/customs/" : "https://calk.kg/calculator/customs/"} />
      </Helmet>
      <HreflangTags path="/calculator/customs" />
      <FAQSchema translationPrefix="customs" />
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
              
              {/* Vehicle Type */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('customs_vehicle_type')}
                  </label>
                  <Tooltip text={t('customs_vehicle_type_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg print:text-base"
                >
                  <option value="passenger">{t('customs_type_passenger')}</option>
                  <option value="electric">⚡ {t('customs_type_electric')}</option>
                  <option value="hybrid">🔋 {t('customs_type_hybrid')}</option>
                  <option value="truck">🚛 {t('customs_type_truck')}</option>
                  <option value="motorcycle">🏍️ {t('customs_type_motorcycle')}</option>
                </select>
                {vehicleType === 'electric' && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">
                      {t('customs_ev_benefit_title')}
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      {t('customs_ev_benefit_text')}
                    </p>
                  </div>
                )}
                {vehicleType === 'hybrid' && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      {t('customs_hybrid_benefit_text')}
                    </p>
                  </div>
                )}
              </div>

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

              {/* Engine Volume / Truck Weight */}
              {vehicleType === 'truck' ? (
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      {t('customs_truck_weight')}
                    </label>
                    <Tooltip text={t('customs_truck_weight_tooltip')}>
                      <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                    </Tooltip>
                  </div>
                  <input
                    type="text"
                    value={truckWeight}
                    onChange={(e) => setTruckWeight(e.target.value)}
                    placeholder="3.5"
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg print:text-base"
                  />
                </div>
              ) : null}

              {/* Engine Volume */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {vehicleType === 'motorcycle' ? t('customs_moto_engine') : t('customs_engine_volume')}
                  </label>
                  <Tooltip text={vehicleType === 'motorcycle' ? t('customs_moto_tooltip') : t('customs_engine_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={engineVolume}
                  onChange={handleEngineVolumeChange}
                  placeholder={vehicleType === 'motorcycle' ? '750' : t('placeholder_example_amount')}
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

            {/* Additional Costs Section */}
            <div className="bg-white rounded-xl shadow-sm p-8 print:shadow-none print:border print:break-inside-avoid">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('customs_additional_costs')}</h2>
              <p className="text-sm text-gray-600 mb-6">{t('customs_additional_costs_subtitle')}</p>
              
              {/* Delivery Cost */}
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('customs_delivery_cost')} (USD)
                  </label>
                  <Tooltip text={t('customs_delivery_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={deliveryCost}
                  onChange={(e) => setDeliveryCost(e.target.value)}
                  placeholder="1000-3000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Broker Fee */}
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('customs_broker_fee')} (USD)
                  </label>
                  <Tooltip text={t('customs_broker_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={brokerFee}
                  onChange={(e) => setBrokerFee(e.target.value)}
                  placeholder="200-500"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Registration */}
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('customs_registration_fee')} (USD)
                  </label>
                  <Tooltip text={t('customs_registration_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={registrationFee}
                  onChange={(e) => setRegistrationFee(e.target.value)}
                  placeholder="150"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Insurance */}
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('customs_insurance_cost')} (USD)
                  </label>
                  <Tooltip text={t('customs_insurance_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={insuranceCost}
                  onChange={(e) => setInsuranceCost(e.target.value)}
                  placeholder="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Inspection */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('customs_inspection_cost')} (USD)
                  </label>
                  <Tooltip text={t('customs_inspection_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={inspectionCost}
                  onChange={(e) => setInspectionCost(e.target.value)}
                  placeholder="50"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Total Additional */}
              {additionalCosts.total > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">{t('customs_additional_only')}:</span>
                    <span className="text-xl font-bold text-orange-600">
                      ${formatCurrency(additionalCosts.total)}
                    </span>
                  </div>
                </div>
              )}
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

                  {/* Benefit Badge (for EV/Hybrid) */}
                  {results.benefitAmount && results.benefitAmount > 0 && (
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                      <div className="text-center">
                        <div className="text-green-100 mb-1">
                          {vehicleType === 'electric' ? '⚡ ' + t('customs_ev_benefit_title') : '🔋 ' + t('customs_hybrid_benefit_text').split(':')[0]}
                        </div>
                        <p className="text-3xl font-bold">
                          ${formatCurrency(results.benefitAmount)}
                        </p>
                        <p className="text-sm text-green-100 mt-2">
                          {t('customs_customs_payments')} {vehicleType === 'electric' ? '(0%)' : '(10%)'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Total Cost */}
                  <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <span className="text-red-100">{t('customs_customs_only')}:</span>
                        <Tooltip text={t('customs_total_to_pay_tooltip')}>
                          <Info className="h-4 w-4 text-red-200 ml-2 cursor-help" />
                        </Tooltip>
                      </div>
                      <p className="text-4xl font-bold">
                        ${formatCurrency(results.totalCost)}
                      </p>
                    </div>
                  </div>

                  {/* Summary with Additional Costs */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-700 mb-3">{t('customs_total_cost')}:</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>{t('customs_car_cost')}:</span>
                        <span>${formatCurrency(results.customsStoicostValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('customs_customs_only')}:</span>
                        <span>${formatCurrency(results.totalCost)}</span>
                      </div>
                      {additionalCosts.total > 0 && (
                        <div className="flex justify-between text-orange-600">
                          <span>{t('customs_additional_only')}:</span>
                          <span>${formatCurrency(additionalCosts.total)}</span>
                        </div>
                      )}
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-medium text-gray-900">
                          <span>{t('customs_full_cost')}:</span>
                          <span>${formatCurrency(results.customsStoicostValue + results.totalCost)}</span>
                        </div>
                      </div>
                      {additionalCosts.total > 0 && (
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-bold text-indigo-600 text-base">
                            <span>{t('customs_total_with_additional')}:</span>
                            <span>${formatCurrency(results.customsStoicostValue + results.totalCost + additionalCosts.total)}</span>
                          </div>
                        </div>
                      )}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { year: 2022, volume: 0, value: 25000, type: 'electric' as VehicleType, label: t('customs_example_electric'), emoji: '⚡' },
                { year: 2020, volume: 1800, value: 18000, type: 'hybrid' as VehicleType, label: t('customs_example_hybrid'), emoji: '🔋' },
                { year: 2018, volume: 3000, value: 15000, type: 'truck' as VehicleType, label: t('customs_example_truck'), emoji: '🚛', weight: 3.5 },
                { year: 2021, volume: 750, value: 8000, type: 'motorcycle' as VehicleType, label: t('customs_example_moto'), emoji: '🏍️' },
                { year: 2020, volume: 1500, value: 15000, type: 'passenger' as VehicleType, label: `2020, 1500${t('unit_cm3')}`, emoji: '🚗' },
                { year: 2015, volume: 2000, value: 12000, type: 'passenger' as VehicleType, label: `2015, 2000${t('unit_cm3')}`, emoji: '🚗' }
              ].map((example, index) => {
                const exampleResult = calculateCustoms(example.year, example.volume, example.value, example.type, example.weight);
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setVehicleType(example.type);
                      setYear(example.year.toString());
                      setEngineVolume(example.volume.toString());
                      setCustomsValue(example.value.toString());
                      if (example.weight) setTruckWeight(example.weight.toString());
                    }}
                    className="text-left p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-2xl">{example.emoji}</span>
                      <span className="text-xs text-gray-500">
                        ${formatCurrency(example.value)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">{example.label}</div>
                    <div className="text-right">
                      <div className="text-red-600 font-semibold">
                        ${formatCurrency(exampleResult.totalCost)}
                      </div>
                      {exampleResult.benefitAmount && exampleResult.benefitAmount > 0 && (
                        <div className="text-xs text-green-600">
                          💰 -{formatCurrency(exampleResult.benefitAmount)}
                        </div>
                      )}
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
                  <p className="text-gray-700">{t('customs_no_excise_note')}</p>
                </div>

                {/* Used Cars */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-orange-700 mb-4">{t('customs_guide_used_cars_title')}</h3>
                  <p className="text-gray-700 mb-3">{t('customs_guide_used_cars_rate')}</p>
                  <p className="text-gray-700">{t('customs_no_excise_note')}</p>
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

              <details className="group bg-green-50 rounded-lg p-6 hover:bg-green-100 transition-colors">
                <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  <span>⚡ {t('customs_faq_q7')}</span>
                  <span className="text-green-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">{t('customs_faq_a7')}</p>
              </details>

              <details className="group bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  <span>🚛 {t('customs_faq_q8')}</span>
                  <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">{t('customs_faq_a8')}</p>
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
        <style>{`
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


      {/* Информационная статья под калькулятором */}
      <CustomsCalculatorArticle />
export default CustomsCalculatorPage;