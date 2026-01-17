import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Info, Home, Printer, Heart, Users, Music, Camera, Video, Cake, Gift, MapPin, TrendingUp, CheckCircle, Building2, Car, CreditCard } from 'lucide-react';
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

// Конфигурация региональных цен на банкет - актуализированные цены 2026
const BANQUET_PRICES = {
  'bishkek': { nameKey: 'wedding_region_bishkek', price: 1800 },
  'osh': { nameKey: 'wedding_region_osh', price: 1000 },
  'batken': { nameKey: 'wedding_region_batken', price: 500 },
  'naryn': { nameKey: 'wedding_region_naryn', price: 700 },
  'jalal-abad': { nameKey: 'wedding_region_jalal_abad', price: 900 },
  'karakol': { nameKey: 'wedding_region_karakol', price: 800 },
  'talas': { nameKey: 'wedding_region_talas', price: 650 },
  'tokmok': { nameKey: 'wedding_region_tokmok', price: 750 },
  'cholpon-ata': { nameKey: 'wedding_region_cholpon_ata', price: 1100 },
  'kara-balta': { nameKey: 'wedding_region_kara_balta', price: 700 },
  'kant': { nameKey: 'wedding_region_kant', price: 750 },
  'balykchy': { nameKey: 'wedding_region_balykchy', price: 850 }
};

type Region = keyof typeof BANQUET_PRICES;

interface Service {
  id: string;
  name: string;
  placeholder: string;
  enabled: boolean;
  cost: number;
}

interface WeddingResults {
  guestCount: number;
  banquetCostPerGuest: number;
  banquetTotal: number;
  servicesTotal: number;
  otherExpensesTotal: number;
  grandTotal: number;
}

const WeddingCalculatorPage = () => {
  const { t, language, getLocalizedPath} = useLanguage();

  // Генерация схем для страницы калькулятора тоя
  const generateSchemas = () => {
    const currentUrl = language === 'ky' ? "https://calk.kg/ky/calculator/wedding" : "https://calk.kg/calculator/wedding";
    const homeUrl = language === 'ky' ? "https://calk.kg/ky" : "https://calk.kg";
    
    const calculatorSchema = generateCalculatorSchema({
      url: currentUrl,
      title: t('wedding_calc_title'),
      description: t('wedding_calc_subtitle'),
      calculatorName: t('wedding_calc_title'),
      category: t('category_other'),
      language,
      inputProperties: ["region", "guestCount", "services", "expenses"],
      outputProperties: ["banquetCost", "totalCost", "budgetStructure"]
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: homeUrl },
      { name: t('nav_other'), url: `${homeUrl}?category=other` },
      { name: t('wedding_calc_title'), url: currentUrl }
    ]);

    return [calculatorSchema, breadcrumbSchema];
  };
  React.useEffect(() => {
    document.title = t('wedding_calc_title') + " - Calk.KG";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('wedding_calc_description'));
    }
  }, [t]);

  const [selectedRegion, setSelectedRegion] = useState<Region>('bishkek');
  const [guestCount, setGuestCount] = useState<string>('50');
  const [banquetPricePerGuest, setBanquetPricePerGuest] = useState<string>('1800');
  
  // Услуги с чеклистом
  const [services, setServices] = useState<Service[]>([
    { id: 'tamada', name: t('wedding_service_tamada'), placeholder: t('wedding_service_tamada_placeholder'), enabled: false, cost: 0 },
    { id: 'music', name: t('wedding_service_music'), placeholder: t('wedding_service_music_placeholder'), enabled: false, cost: 0 },
    { id: 'photo', name: t('wedding_service_photo'), placeholder: t('wedding_service_photo_placeholder'), enabled: false, cost: 0 },
    { id: 'video', name: t('wedding_service_video'), placeholder: t('wedding_service_video_placeholder'), enabled: false, cost: 0 },
    { id: 'show', name: t('wedding_service_show'), placeholder: t('wedding_service_show_placeholder'), enabled: false, cost: 0 }
  ]);

  // Прочие расходы с чеклистом
  const [otherExpenses, setOtherExpenses] = useState<Service[]>([
    { id: 'meat', name: t('wedding_expense_meat'), placeholder: t('wedding_expense_meat_placeholder'), enabled: false, cost: 0 },
    { id: 'drinks', name: t('wedding_expense_drinks'), placeholder: t('wedding_expense_drinks_placeholder'), enabled: false, cost: 0 },
    { id: 'fruits', name: t('wedding_expense_fruits'), placeholder: t('wedding_expense_fruits_placeholder'), enabled: false, cost: 0 },
    { id: 'decor', name: t('wedding_expense_decor'), placeholder: t('wedding_expense_decor_placeholder'), enabled: false, cost: 0 },
    { id: 'cake', name: t('wedding_expense_cake'), placeholder: t('wedding_expense_cake_placeholder'), enabled: false, cost: 0 },
    { id: 'invitations', name: t('wedding_expense_invitations'), placeholder: t('wedding_expense_invitations_placeholder'), enabled: false, cost: 0 }
  ]);
  
  const [results, setResults] = useState<WeddingResults>({
    guestCount: 0,
    banquetCostPerGuest: 0,
    banquetTotal: 0,
    servicesTotal: 0,
    otherExpensesTotal: 0,
    grandTotal: 0
  });

  // Обновление переводов при смене языка
  useEffect(() => {
    setServices(prev => [
      { id: 'tamada', name: t('wedding_service_tamada'), placeholder: t('wedding_service_tamada_placeholder'), enabled: prev[0]?.enabled || false, cost: prev[0]?.cost || 0 },
      { id: 'music', name: t('wedding_service_music'), placeholder: t('wedding_service_music_placeholder'), enabled: prev[1]?.enabled || false, cost: prev[1]?.cost || 0 },
      { id: 'photo', name: t('wedding_service_photo'), placeholder: t('wedding_service_photo_placeholder'), enabled: prev[2]?.enabled || false, cost: prev[2]?.cost || 0 },
      { id: 'video', name: t('wedding_service_video'), placeholder: t('wedding_service_video_placeholder'), enabled: prev[3]?.enabled || false, cost: prev[3]?.cost || 0 },
      { id: 'show', name: t('wedding_service_show'), placeholder: t('wedding_service_show_placeholder'), enabled: prev[4]?.enabled || false, cost: prev[4]?.cost || 0 }
    ]);

    setOtherExpenses(prev => [
      { id: 'meat', name: t('wedding_expense_meat'), placeholder: t('wedding_expense_meat_placeholder'), enabled: prev[0]?.enabled || false, cost: prev[0]?.cost || 0 },
      { id: 'drinks', name: t('wedding_expense_drinks'), placeholder: t('wedding_expense_drinks_placeholder'), enabled: prev[1]?.enabled || false, cost: prev[1]?.cost || 0 },
      { id: 'fruits', name: t('wedding_expense_fruits'), placeholder: t('wedding_expense_fruits_placeholder'), enabled: prev[2]?.enabled || false, cost: prev[2]?.cost || 0 },
      { id: 'decor', name: t('wedding_expense_decor'), placeholder: t('wedding_expense_decor_placeholder'), enabled: prev[3]?.enabled || false, cost: prev[3]?.cost || 0 },
      { id: 'cake', name: t('wedding_expense_cake'), placeholder: t('wedding_expense_cake_placeholder'), enabled: prev[4]?.enabled || false, cost: prev[4]?.cost || 0 },
      { id: 'invitations', name: t('wedding_expense_invitations'), placeholder: t('wedding_expense_invitations_placeholder'), enabled: prev[5]?.enabled || false, cost: prev[5]?.cost || 0 }
    ]);
  }, [language]);

  // Автозаполнение цены банкета при смене региона
  useEffect(() => {
    const regionData = BANQUET_PRICES[selectedRegion];
    setBanquetPricePerGuest(regionData.price.toString());
  }, [selectedRegion]);

  // Расчет общей стоимости тоя
  const calculateWeddingCost = (): WeddingResults => {
    const guests = parseInt(guestCount) || 0;
    const banquetPrice = parseFloat(banquetPricePerGuest) || 0;
    
    const banquetTotal = guests * banquetPrice;
    
    const servicesTotal = (services || []).reduce((sum, service) => {
      return sum + (service?.enabled ? (service.cost || 0) : 0);
    }, 0);
    
    const otherExpensesTotal = (otherExpenses || []).reduce((sum, expense) => {
      return sum + (expense?.enabled ? (expense.cost || 0) : 0);
    }, 0);
    
    const grandTotal = banquetTotal + servicesTotal + otherExpensesTotal;

    return {
      guestCount: guests,
      banquetCostPerGuest: banquetPrice,
      banquetTotal,
      servicesTotal,
      otherExpensesTotal,
      grandTotal
    };
  };

  // Обновление результатов при изменении данных
  useEffect(() => {
    setResults(calculateWeddingCost());
  }, [guestCount, banquetPricePerGuest, services, otherExpenses]);

  // Обновление услуги
  const updateService = (id: string, field: 'enabled' | 'cost', value: boolean | number) => {
    setServices(prev => prev.map(service => 
      service.id === id ? { ...service, [field]: value } : service
    ));
  };

  // Обновление прочих расходов
  const updateOtherExpense = (id: string, field: 'enabled' | 'cost', value: boolean | number) => {
    setOtherExpenses(prev => prev.map(expense => 
      expense.id === id ? { ...expense, [field]: value } : expense
    ));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-KG', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleGuestCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setGuestCount(value);
    }
  };

  const handleBanquetPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setBanquetPricePerGuest(value);
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
  const currentRegionData = BANQUET_PRICES[selectedRegion];

  // Расчет процентов для визуализации
  const banquetPercentage = results.grandTotal > 0 ? (results.banquetTotal / results.grandTotal) * 100 : 0;
  const servicesPercentage = results.grandTotal > 0 ? (results.servicesTotal / results.grandTotal) * 100 : 0;
  const otherPercentage = results.grandTotal > 0 ? (results.otherExpensesTotal / results.grandTotal) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org микроразметка */}
      <Helmet>
        <title>{t('wedding_calc_title')} - Calk.KG</title>
        <meta name="description" content={t('wedding_calc_subtitle')} />
        <meta name="keywords" content={t('wedding_keywords')} />
        <meta property="og:title" content={`${t('wedding_calc_title')} - Calk.KG`} />
        <meta property="og:description" content={t('wedding_calc_subtitle')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/wedding" : "https://calk.kg/calculator/wedding"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/wedding.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('wedding_calc_title')} - Calk.KG`} />
        <meta name="twitter:description" content={t('wedding_calc_subtitle')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/wedding.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/wedding" : "https://calk.kg/calculator/wedding"} />
      </Helmet>
      <HreflangTags path="/calculator/wedding" />
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
      <div className="bg-gradient-to-r from-pink-600 to-pink-700 text-white print:bg-white print:text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 print:py-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="bg-white/20 p-4 rounded-xl print:bg-pink-100">
                <Heart className="h-10 w-10 print:text-pink-600" />
              </div>
              <div className="bg-white/20 p-4 rounded-xl print:bg-pink-100">
                <Gift className="h-10 w-10 print:text-pink-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 print:text-2xl">{t('wedding_calc_title')}</h1>
            <p className="text-xl text-pink-100 max-w-3xl mx-auto leading-relaxed print:text-gray-600">
              {t('wedding_calc_subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 print:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:gap-6">
          
          {/* Основная информация */}
          <div className="bg-white rounded-2xl shadow-xl p-8 print:shadow-none print:border">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <MapPin className="h-6 w-6 text-pink-600 mr-3" />
              {t('wedding_main_info')}
            </h2>
            
            {/* Регион */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <label className="block text-lg font-semibold text-gray-700">
                  {t('wedding_region')}
                </label>
                <Tooltip text={t('wedding_region_tooltip')}>
                  <Info className="h-5 w-5 text-gray-400 ml-2 cursor-help" />
                </Tooltip>
              </div>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value as Region)}
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-pink-500/25 focus:border-pink-500 text-lg font-medium transition-all"
              >
                {Object.entries(BANQUET_PRICES).map(([key, regionData]) => (
                  <option key={key} value={key}>
                    {t(regionData.nameKey)}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-2">
                {t('text_average_price')} {t('text_banquet')}: {formatCurrency(currentRegionData.price)} {t('text_per_guest')}
              </p>
            </div>

            {/* Количество гостей */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <label className="block text-lg font-semibold text-gray-700">
                  {t('wedding_guests')}
                </label>
                <Tooltip text={t('wedding_guests_tooltip')}>
                  <Info className="h-5 w-5 text-gray-400 ml-2 cursor-help" />
                </Tooltip>
              </div>
              <input
                type="text"
                value={guestCount}
                onChange={handleGuestCountChange}
                placeholder={t('placeholder_enter_guests')}
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-pink-500/25 focus:border-pink-500 text-lg font-medium transition-all"
              />
            </div>

            {/* Стоимость банкета */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <label className="block text-lg font-semibold text-gray-700">
                  {t('wedding_price_per_guest')}
                </label>
                <Tooltip text={t('wedding_price_per_guest_tooltip')}>
                  <Info className="h-5 w-5 text-gray-400 ml-2 cursor-help" />
                </Tooltip>
              </div>
              <input
                type="text"
                value={banquetPricePerGuest}
                onChange={handleBanquetPriceChange}
                className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-pink-500/25 focus:border-pink-500 text-lg font-medium transition-all"
              />
            </div>

            {/* Банкет - промежуточный итог */}
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">{t('wedding_banquet_cost')}</div>
                <div className="text-3xl font-bold text-pink-600">
                  {formatCurrency(results.banquetTotal)} сом
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {guestCount || 0} {t('text_guests_multiply')} × {formatCurrency(parseFloat(banquetPricePerGuest) || 0)} {t('kgs')}
                </div>
              </div>
            </div>
          </div>

          {/* Услуги */}
          <div className="bg-white rounded-2xl shadow-xl p-8 print:shadow-none print:border">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <Music className="h-6 w-6 text-pink-600 mr-3" />
              {t('wedding_services')}
            </h2>
            
            <div className="space-y-6">
              {services.map((service) => (
                <div key={service.id} className="border border-gray-200 rounded-xl p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3 mb-4">
                    <input
                      type="checkbox"
                      checked={service.enabled}
                      onChange={(e) => updateService(service.id, 'enabled', e.target.checked)}
                      className="h-5 w-5 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <label className="text-lg font-medium text-gray-900 cursor-pointer flex-1">
                      {service.name}
                    </label>
                  </div>
                  
                  {service.enabled && (
                    <input
                      type="number"
                      min="0"
                      value={service.cost}
                      onChange={(e) => updateService(service.id, 'cost', parseFloat(e.target.value) || 0)}
                      placeholder={service.placeholder}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Услуги - промежуточный итог */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">{t('wedding_total_services')}</div>
                <div className="text-3xl font-bold text-blue-600">
                  {formatCurrency(results.servicesTotal)} сом
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Выбрано: {services.filter(s => s.enabled).length} из {services.length}
                </div>
              </div>
            </div>
          </div>

          {/* Прочие расходы */}
          <div className="bg-white rounded-2xl shadow-xl p-8 print:shadow-none print:border">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <Cake className="h-6 w-6 text-pink-600 mr-3" />
              {t('wedding_other_expenses')}
            </h2>
            
            <div className="space-y-6">
              {otherExpenses.map((expense) => (
                <div key={expense.id} className="border border-gray-200 rounded-xl p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3 mb-4">
                    <input
                      type="checkbox"
                      checked={expense.enabled}
                      onChange={(e) => updateOtherExpense(expense.id, 'enabled', e.target.checked)}
                      className="h-5 w-5 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <label className="text-lg font-medium text-gray-900 cursor-pointer flex-1">
                      {expense.name}
                    </label>
                  </div>
                  
                  {expense.enabled && (
                    <input
                      type="number"
                      min="0"
                      value={expense.cost}
                      onChange={(e) => updateOtherExpense(expense.id, 'cost', parseFloat(e.target.value) || 0)}
                      placeholder={expense.placeholder}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Прочие расходы - промежуточный итог */}
            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">{t('wedding_total_other')}</div>
                <div className="text-3xl font-bold text-amber-600">
                  {formatCurrency(results.otherExpensesTotal)} сом
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Выбрано: {otherExpenses.filter(e => e.enabled).length} из {otherExpenses.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Итоговый результат */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 md:p-12 print:shadow-none print:border">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{t('wedding_detailed_estimate')}</h2>
            {results.grandTotal > 0 && (
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors print:hidden"
              >
                <Printer className="h-5 w-5" />
                <span>{t('wedding_print_estimate')}</span>
              </button>
            )}
          </div>

          {results.grandTotal > 0 ? (
            <div className="space-y-8">
              {/* Общая стоимость */}
              <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl p-10 text-white text-center">
                <div className="flex items-center justify-center mb-4">
                  <Heart className="h-10 w-10 mr-4" />
                  <span className="text-2xl text-pink-100">{t('wedding_grand_total')}</span>
                </div>
                <p className="text-7xl font-bold mb-4">
                  {formatCurrency(results.grandTotal)} сом
                </p>
                <p className="text-pink-100 text-xl">
                  {currentRegionData.name} • {guestCount || 0} гостей
                </p>
              </div>

              {/* Структура бюджета */}
              <div className="bg-gray-50 rounded-xl p-8">
                <h3 className="font-semibold text-gray-900 mb-6 flex items-center text-xl">
                  <TrendingUp className="h-6 w-6 mr-3" />
                  {t('wedding_budget_structure')}
                </h3>
                
                <div className="space-y-6">
                  {/* Банкет */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-700 font-medium">{t('wedding_banquet')}</span>
                      <span className="text-lg font-semibold text-pink-600">
                        {formatCurrency(results.banquetTotal)} {t('text_som')} ({banquetPercentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-pink-500 to-pink-600 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${banquetPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Услуги */}
                  {results.servicesTotal > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-700 font-medium">{t('wedding_services_label')}</span>
                        <span className="text-lg font-semibold text-blue-600">
                          {formatCurrency(results.servicesTotal)} {t('text_som')} ({servicesPercentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500"
                          style={{ width: `${servicesPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Прочие расходы */}
                  {results.otherExpensesTotal > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-700 font-medium">{t('wedding_expenses_label')}</span>
                        <span className="text-lg font-semibold text-amber-600">
                          {formatCurrency(results.otherExpensesTotal)} {t('text_som')} ({otherPercentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-gradient-to-r from-amber-500 to-amber-600 h-4 rounded-full transition-all duration-500"
                          style={{ width: `${otherPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Детализированная смета */}
              <div className="bg-gray-50 rounded-xl p-8">
                <h3 className="font-semibold text-gray-900 mb-6 text-xl">{t('wedding_detailed_estimate')}</h3>
                
                <div className="space-y-6">
                  {/* Банкет детализация */}
                  <div className="bg-white rounded-lg p-6">
                    <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                      <Users className="h-5 w-5 text-pink-600 mr-2" />
                      {t('wedding_banquet')}
                    </h4>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {guestCount || 0} {t('text_guests')} × {formatCurrency(parseFloat(banquetPricePerGuest) || 0)} {t('text_som')}
                      </span>
                      <span className="text-xl font-bold text-pink-600">
                        {formatCurrency(results.banquetTotal)} {t('text_som')}
                      </span>
                    </div>
                  </div>

                  {/* Услуги детализация */}
                  {services.some(s => s.enabled) && (
                    <div className="bg-white rounded-lg p-6">
                      <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                        <Music className="h-5 w-5 text-blue-600 mr-2" />
                        {t('wedding_services_label')}
                      </h4>
                      <div className="space-y-3">
                        {services.filter(s => s.enabled).map((service) => (
                          <div key={service.id} className="flex justify-between items-center">
                            <span className="text-gray-600">{service.name}</span>
                            <span className="font-semibold text-blue-600">
                              {formatCurrency(service.cost)} {t('text_som')}
                            </span>
                          </div>
                        ))}
                        <div className="border-t pt-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-800">{t('wedding_total_services')}:</span>
                            <span className="text-xl font-bold text-blue-600">
                              {formatCurrency(results.servicesTotal)} {t('text_som')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Прочие расходы детализация */}
                  {otherExpenses.some(e => e.enabled) && (
                    <div className="bg-white rounded-lg p-6">
                      <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                        <Cake className="h-5 w-5 text-amber-600 mr-2" />
                        {t('wedding_expenses_label')}
                      </h4>
                      <div className="space-y-3">
                        {otherExpenses.filter(e => e.enabled).map((expense) => (
                          <div key={expense.id} className="flex justify-between items-center">
                            <span className="text-gray-600">{expense.name}</span>
                            <span className="font-semibold text-amber-600">
                              {formatCurrency(expense.cost)} {t('text_som')}
                            </span>
                          </div>
                        ))}
                        <div className="border-t pt-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-800">{t('wedding_total_other_label')}:</span>
                            <span className="text-xl font-bold text-amber-600">
                              {formatCurrency(results.otherExpensesTotal)} {t('text_som')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <Heart className="h-20 w-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-xl">{t('wedding_fill_data')}</p>
            </div>
          )}
        </div>

        {/* Готовые сценарии */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-8 print:hidden">
          <h3 className="font-medium text-gray-900 mb-6 text-xl">{t('wedding_ready_scenarios')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: t('wedding_modest_celebration'),
                guests: 30,
                services: ['tamada'],
                others: ['drinks', 'fruits'],
                description: t('wedding_family_celebration')
              },
              {
                name: t('wedding_average_wedding'),
                guests: 80,
                services: ['tamada', 'music', 'photo'],
                others: ['meat', 'drinks', 'fruits', 'cake'],
                description: t('wedding_classic_wedding')
              },
              {
                name: t('wedding_large_wedding'),
                guests: 150,
                services: ['tamada', 'music', 'photo', 'video', 'show'],
                others: ['meat', 'drinks', 'fruits', 'decor', 'cake', 'invitations'],
                description: t('wedding_luxurious_celebration')
              }
            ].map((scenario, index) => {
              // Расчет примерной стоимости сценария
              const scenarioBanquet = scenario.guests * currentRegionData.price;
              const scenarioServicesAvg = scenario.services.length * 20000; // Примерно 20к за услугу
              const scenarioOthersAvg = scenario.others.length * 25000; // Примерно 25к за расход
              const scenarioTotal = scenarioBanquet + scenarioServicesAvg + scenarioOthersAvg;

              return (
                <button
                  key={index}
                  onClick={() => {
                    setGuestCount(scenario.guests.toString());
                    // Включить соответствующие услуги
                    setServices(prev => prev.map(service => ({
                      ...service,
                      enabled: scenario.services.includes(service.id),
                      cost: scenario.services.includes(service.id) ? 20000 : 0
                    })));
                    // Включить соответствующие расходы
                    setOtherExpenses(prev => prev.map(expense => ({
                      ...expense,
                      enabled: scenario.others.includes(expense.id),
                      cost: scenario.others.includes(expense.id) ? 25000 : 0
                    })));
                  }}
                  className="text-left p-6 rounded-xl hover:bg-gray-50 transition-colors border-2 border-gray-200 hover:border-pink-300 group"
                >
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 mb-2">{scenario.name}</div>
                    <div className="text-3xl font-bold text-pink-600 mb-2">
                      ~{formatCurrency(scenarioTotal)} {t('text_som')}
                    </div>
                    <div className="text-sm text-gray-500 mb-3">{scenario.description}</div>
                    <div className="text-xs text-gray-400">
                      {scenario.guests} {t('text_guests')} • {scenario.services.length + scenario.others.length} {t('wedding_services_plural')}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Региональное сравнение */}
        {results.grandTotal > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
            <div className="flex items-center mb-6">
              <MapPin className="h-6 w-6 text-red-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                {t('wedding_regional_comparison')}
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('wedding_region_label')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('wedding_price_per_guest_label')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('wedding_banquet_cost_label')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('wedding_total_cost_wedding')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Текущий выбор */}
                  <tr className="bg-green-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {currentRegionData.name} <span className="text-xs text-gray-500">({t('wedding_your_choice')})</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {formatCurrency(currentRegionData.price)} {t('text_som')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {formatCurrency(results.banquetTotal)} {t('text_som')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {formatCurrency(results.grandTotal)} {t('text_som')}
                    </td>
                  </tr>
                  
                  {/* Другие регионы */}
                  {Object.entries(BANQUET_PRICES)
                    .filter(([key]) => key !== selectedRegion)
                    .sort(([,a], [,b]) => a.price - b.price)
                    .map(([regionKey, regionData]) => {
                      const otherBanquetCost = results.guestCount * regionData.price;
                      const otherTotalCost = otherBanquetCost + results.servicesTotal + results.otherExpensesTotal;
                      const isCheaper = otherTotalCost < results.grandTotal;
                      const isMoreExpensive = otherTotalCost > results.grandTotal;
                      
                      return (
                        <tr key={regionKey} className={isCheaper ? 'bg-blue-50' : isMoreExpensive ? 'bg-red-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {t(regionData.nameKey)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(regionData.price)} {t('text_som')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(otherBanquetCost)} {t('text_som')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(otherTotalCost)} {t('text_som')}
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
                  <span>{t('wedding_cheaper_options')}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-50 border border-red-200 rounded mr-2"></div>
                  <span>{t('wedding_expensive_options')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Другие калькуляторы */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-8 print:hidden">
          <h3 className="font-medium text-gray-900 mb-4">{t('other_calculators')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to={getLocalizedPath("/calculator/housing")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-pink-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-pink-600">{t('wedding_housing_cost')}</div>
                  <div className="text-sm text-gray-500">{t('wedding_apartment_prices')}</div>
                </div>
              </div>
            </Link>
            <Link
              to={getLocalizedPath("/calculator/auto-loan")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-pink-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-red-50 p-2 rounded-lg group-hover:bg-red-100 transition-colors">
                  <Car className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-pink-600">{t('wedding_auto_credit')}</div>
                  <div className="text-sm text-gray-500">{t('wedding_car_credit')}</div>
                </div>
              </div>
            </Link>
            <Link
              to={getLocalizedPath("/calculator/salary")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-pink-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-pink-600">{t('salary_calc_title')}</div>
                  <div className="text-sm text-gray-500">{t('salary_calc_subtitle')}</div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Матрица цен */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
          <h3 className="font-medium text-gray-900 mb-6">{t('wedding_average_prices_regions')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(BANQUET_PRICES)
              .sort(([,a], [,b]) => b.price - a.price)
              .map(([regionKey, regionData]) => (
                <div 
                  key={regionKey}
                  className={`p-6 rounded-xl border-2 ${
                    regionKey === selectedRegion 
                      ? 'border-pink-400 bg-pink-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 mb-2">
                      {t(regionData.nameKey)}
                    </div>
                    <div className="text-2xl font-bold text-pink-600 mb-2">
                      {formatCurrency(regionData.price)} {t('text_som')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {t('wedding_per_one_guest')}
                    </div>
                    {results.guestCount > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="text-sm font-medium text-gray-900">
                          {t('wedding_for_guests')} {results.guestCount} {t('wedding_guests_plural')}: {formatCurrency(results.guestCount * regionData.price)} {t('text_som')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Советы по планированию */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
          <h3 className="font-medium text-gray-900 mb-6">{t('wedding_planning_tips')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-gray-800 mb-3">{t('wedding_how_to_save')}</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>{t('wedding_tip_weekdays')}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>{t('wedding_tip_season')}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>{t('wedding_tip_combine')}</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>{t('wedding_tip_package')}</span>
                </li>
              </ul>
              <p className="mt-4 text-sm">
                💰 <strong>{t('wedding_financing_tip')}</strong> {t('wedding_financing_text')}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-3">{t('wedding_what_to_consider')}</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>{t('wedding_consider_book')}</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>{t('wedding_consider_reserve')}</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>{t('wedding_consider_menu')}</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>{t('wedding_consider_whats_included')}</span>
                </li>
              </ul>
              <p className="mt-4 text-sm">
                🏠 <strong>{t('wedding_after_wedding')}</strong> {t('wedding_after_wedding_text')}
              </p>
            </div>
          </div>
        </div>

        {/* Важный дисклеймер */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-xl p-8">
          <div className="flex items-start space-x-4">
            <Info className="h-8 w-8 text-yellow-600 flex-shrink-0 mt-1" />
            <div className="text-sm text-yellow-800">
              <p className="font-bold mb-3 text-lg">{t('wedding_disclaimer_title')}</p>
              <div className="space-y-2">
                <p>
                  <strong>{t('wedding_disclaimer_attention')}</strong> {t('wedding_disclaimer_text1')}
                </p>
                <p>
                  {t('wedding_disclaimer_text2')}
                </p>
                <p>
                  {t('wedding_disclaimer_text3')}
                </p>
              </div>
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
          .print\\:text-pink-600 {
            color: #EC4899 !important;
          }
          .print\\:bg-pink-100 {
            background-color: #FCE7F3 !important;
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

export default WeddingCalculatorPage;