import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Info, Home, Printer, Star, TrendingUp, CheckCircle, XCircle, AlertTriangle, Calendar, Heart, Users, CreditCard } from 'lucide-react';
import SchemaMarkup from '../components/SchemaMarkup';
import HreflangTags from '../components/HreflangTags';
import { useLanguage } from '../contexts/LanguageContext';
import {
  generateCalculatorSchema,
  generateBreadcrumbSchema
} from '../utils/schemaGenerator';
import { formatCurrentMonth } from '../utils/dateFormatter';

// Конфигурация закята - легко редактируемая
const ZAKAT_CONFIG = {
  // Нисаб - стоимость 85 граммов золота
  nisab_gold_grams: 85,
  // Ставка закята
  zakat_rate: 0.025, // 2.5%
  // Текущая стоимость 1 грамма золота (легко обновляемое значение)
  gold_price_per_gram: 6000 // сом за грамм
};

interface ZakatResults {
  goldPrice: number;
  nisabThreshold: number;
  totalAssets: number;
  totalObligations: number;
  netAssets: number;
  mustPayZakat: boolean;
  zakatAmount: number;
}

const ZakatCalculatorPage = () => {
  const { language, t, getLocalizedPath} = useLanguage();

  // Генерация схем для страницы калькулятора закята
  const generateSchemas = () => {
    const currentUrl = language === 'ky' ? "https://calk.kg/ky/calculator/zakat" : "https://calk.kg/calculator/zakat";
    const homeUrl = language === 'ky' ? "https://calk.kg/ky" : "https://calk.kg";

    const calculatorSchema = generateCalculatorSchema({
      url: currentUrl,
      title: t('zakat_calc_title'),
      description: t('zakat_calc_subtitle'),
      calculatorName: t('zakat_calc_title'),
      category: t('nav_other'),
      language,
      inputProperties: ["goldPrice", "assets", "obligations"],
      outputProperties: ["zakatAmount", "nisabThreshold", "hasRight"]
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: homeUrl },
      { name: t('nav_other'), url: `${homeUrl}?category=other` },
      { name: t('zakat_calc_title'), url: currentUrl }
    ]);

    return [calculatorSchema, breadcrumbSchema];
  };

  React.useEffect(() => {
    document.title = t('zakat_calc_title') + " - Calk.KG";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('zakat_calc_description'));
    }
  }, [t]);

  const [goldPrice, setGoldPrice] = useState<string>(ZAKAT_CONFIG.gold_price_per_gram.toString());
  
  // Активы
  const [cashMoney, setCashMoney] = useState<string>('');
  const [goldSilver, setGoldSilver] = useState<string>('');
  const [businessGoods, setBusinessGoods] = useState<string>('');
  const [investments, setInvestments] = useState<string>('');
  const [rentalIncome, setRentalIncome] = useState<string>('');
  const [receivableDebts, setReceivableDebts] = useState<string>('');
  
  // Обязательства
  const [payableDebts, setPayableDebts] = useState<string>('');
  
  const [results, setResults] = useState<ZakatResults>({
    goldPrice: ZAKAT_CONFIG.gold_price_per_gram,
    nisabThreshold: 0,
    totalAssets: 0,
    totalObligations: 0,
    netAssets: 0,
    mustPayZakat: false,
    zakatAmount: 0
  });

  // Расчет закята
  const calculateZakat = (
    gold: number,
    cash: number,
    goldAssets: number,
    business: number,
    invest: number,
    rental: number,
    receivable: number,
    payable: number
  ): ZakatResults => {
    // Расчет нисаба
    const nisabThreshold = gold * ZAKAT_CONFIG.nisab_gold_grams;
    
    // Общие активы
    const totalAssets = cash + goldAssets + business + invest + rental + receivable;
    
    // Чистые активы (активы минус обязательства)
    const netAssets = Math.max(0, totalAssets - payable);
    
    // Проверка обязанности платить закят
    const mustPayZakat = netAssets >= nisabThreshold;
    
    // Расчет суммы закята
    const zakatAmount = mustPayZakat ? netAssets * ZAKAT_CONFIG.zakat_rate : 0;

    return {
      goldPrice: gold,
      nisabThreshold,
      totalAssets,
      totalObligations: payable,
      netAssets,
      mustPayZakat,
      zakatAmount
    };
  };

  // Обновление результатов
  useEffect(() => {
    const gold = parseFloat(goldPrice) || 0;
    const cash = parseFloat(cashMoney) || 0;
    const goldAssets = parseFloat(goldSilver) || 0;
    const business = parseFloat(businessGoods) || 0;
    const invest = parseFloat(investments) || 0;
    const rental = parseFloat(rentalIncome) || 0;
    const receivable = parseFloat(receivableDebts) || 0;
    const payable = parseFloat(payableDebts) || 0;

    setResults(calculateZakat(gold, cash, goldAssets, business, invest, rental, receivable, payable));
  }, [goldPrice, cashMoney, goldSilver, businessGoods, investments, rentalIncome, receivableDebts, payableDebts]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-KG', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleNumberInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setter(value);
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

  // Процентные расчеты для визуализации
  const assetsPercentage = results.netAssets > 0 ? (results.totalAssets / (results.totalAssets + results.totalObligations)) * 100 : 0;
  const obligationsPercentage = 100 - assetsPercentage;
  const zakatPercentage = results.netAssets > 0 ? (results.zakatAmount / results.netAssets) * 100 : 0;
  const remainingPercentage = 100 - zakatPercentage;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org микроразметка */}
      <Helmet>
        <title>{t('zakat_calc_title')} - Calk.KG</title>
        <meta name="description" content={t('zakat_calc_description')} />
        <meta name="keywords" content={t('zakat_keywords')} />
        <meta property="og:title" content={`${t('zakat_calc_title')} - Calk.KG`} />
        <meta property="og:description" content={t('zakat_calc_subtitle')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/zakat" : "https://calk.kg/calculator/zakat"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/zakat.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('zakat_calc_title')} - Calk.KG`} />
        <meta name="twitter:description" content={t('zakat_calc_subtitle')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/zakat.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/zakat" : "https://calk.kg/calculator/zakat"} />
      </Helmet>
      <HreflangTags path="/calculator/zakat" />
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 print:py-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white/20 p-3 rounded-lg print:bg-green-100">
              <Star className="h-8 w-8 print:text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold print:text-2xl">{t('zakat_calc_title')}</h1>
              <p className="text-green-100 text-lg print:text-gray-600">{t('zakat_calc_subtitle')}</p>
            </div>
          </div>
          
          {/* Islamic Notice */}
          <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3 print:hidden">
            <Star className="h-5 w-5 text-amber-200" />
            <span className="text-amber-100 text-sm">
              {t('zakat_calculation_current_for')} {currentMonth} • {t('zakat_islamic_pillar')}
            </span>
          </div>
        </div>
      </div>

      {/* Religious Warning Banner */}
      <div className="bg-green-50 border-l-4 border-green-400 p-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start space-x-3">
            <Star className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
            <div className="text-sm text-green-800">
              <p className="font-bold mb-2">{t('zakat_religious_warning_title')}</p>
              <p className="mb-2" dangerouslySetInnerHTML={{ __html: t('zakat_religious_warning_text1') }} />
              <p dangerouslySetInnerHTML={{ __html: t('zakat_religious_warning_text2') }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 print:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 print:gap-6">
          {/* Input Section */}
          <div className="space-y-8 print:break-inside-avoid">
            
            {/* Gold Price Setting */}
            <div className="bg-white rounded-xl shadow-sm p-8 print:shadow-none print:border">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('zakat_basic_params')}</h2>

              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('zakat_gold_price_label')}
                  </label>
                  <Tooltip text={t('tooltip_zakat_gold_price')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={goldPrice}
                  onChange={handleNumberInputChange(setGoldPrice)}
                  placeholder={t('placeholder_enter_gold_price')}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg print:text-base"
                />
                <p className="text-sm text-gray-500 mt-2">
                  {t('zakat_nisab_equals')} {goldPrice ? formatCurrency(parseFloat(goldPrice) * ZAKAT_CONFIG.nisab_gold_grams) : 0} сом
                  ({ZAKAT_CONFIG.nisab_gold_grams} {t('zakat_grams_gold')})
                </p>
              </div>

              {/* Educational Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Info className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div className="text-sm text-green-800">
                    <p className="font-medium mb-2">{t('about_zakat')}</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>{t('zakat_info_1')}</li>
                      <li>{t('zakat_info_2')}</li>
                      <li>{t('zakat_info_3')}</li>
                      <li>{t('zakat_info_4')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Assets Section */}
            <div className="bg-white rounded-xl shadow-sm p-8 print:shadow-none print:border">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('zakat_your_assets')}</h2>

              {/* Cash Money */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('zakat_cash_label')}
                  </label>
                  <Tooltip text={t('tooltip_zakat_cash')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={cashMoney}
                  onChange={handleNumberInputChange(setCashMoney)}
                  placeholder={t('placeholder_enter_value')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Gold and Silver */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('zakat_jewelry_label')}
                  </label>
                  <Tooltip text={t('tooltip_zakat_jewelry')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={goldSilver}
                  onChange={handleNumberInputChange(setGoldSilver)}
                  placeholder={t('placeholder_enter_value')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Business Goods */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('zakat_business_goods_label')}
                  </label>
                  <Tooltip text={t('tooltip_zakat_business')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={businessGoods}
                  onChange={handleNumberInputChange(setBusinessGoods)}
                  placeholder={t('placeholder_enter_value')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Investments */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('zakat_investments_label')}
                  </label>
                  <Tooltip text={t('tooltip_zakat_investments')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={investments}
                  onChange={handleNumberInputChange(setInvestments)}
                  placeholder={t('placeholder_enter_value')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Rental Income */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('zakat_rental_income_label')}
                  </label>
                  <Tooltip text={t('tooltip_zakat_rental')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={rentalIncome}
                  onChange={handleNumberInputChange(setRentalIncome)}
                  placeholder={t('placeholder_enter_value')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Receivable Debts */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('zakat_receivable_debts_label')}
                  </label>
                  <Tooltip text={t('tooltip_zakat_receivables')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={receivableDebts}
                  onChange={handleNumberInputChange(setReceivableDebts)}
                  placeholder={t('placeholder_enter_value')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Obligations Section */}
            <div className="bg-white rounded-xl shadow-sm p-8 print:shadow-none print:border">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('zakat_your_obligations')}</h2>

              {/* Payable Debts */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('zakat_payable_debts_label')}
                  </label>
                  <Tooltip text={t('tooltip_zakat_debts')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={payableDebts}
                  onChange={handleNumberInputChange(setPayableDebts)}
                  placeholder={t('placeholder_enter_value')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Current Calculation Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-700 mb-3">{t('zakat_current_calculations')}</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>{t('zakat_total_assets_label')}</span>
                    <span>{formatCurrency(results.totalAssets)} сом</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('zakat_obligations_label')}</span>
                    <span>{formatCurrency(results.totalObligations)} сом</span>
                  </div>
                  <div className="flex justify-between font-medium text-gray-900">
                    <span>{t('zakat_net_assets_label')}</span>
                    <span>{formatCurrency(results.netAssets)} сом</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('zakat_nisab_threshold')}</span>
                    <span>{formatCurrency(results.nisabThreshold)} сом</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-8 print:shadow-none print:border print:break-inside-avoid">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">{t('zakat_calculation_result')}</h2>
                {(results.totalAssets > 0 || results.totalObligations > 0) && (
                  <button
                    onClick={handlePrint}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors print:hidden"
                  >
                    <Printer className="h-4 w-4" />
                    <span>{t('print')}</span>
                  </button>
                )}
              </div>
              
              {results.totalAssets > 0 || results.totalObligations > 0 ? (
                <div className="space-y-8">
                  {/* Main Result */}
                  <div className={`rounded-xl p-8 text-white text-center ${
                    results.mustPayZakat 
                      ? 'bg-gradient-to-r from-green-500 to-green-600' 
                      : 'bg-gradient-to-r from-gray-500 to-gray-600'
                  }`}>
                    <div className="flex items-center justify-center mb-4">
                      {results.mustPayZakat ? (
                        <CheckCircle className="h-8 w-8 mr-3" />
                      ) : (
                        <XCircle className="h-8 w-8 mr-3" />
                      )}
                      <span className={`text-xl font-semibold ${results.mustPayZakat ? 'text-green-100' : 'text-gray-100'}`}>
                        {results.mustPayZakat ? t('zakat_must_pay') : t('zakat_not_required')}
                      </span>
                    </div>
                    {results.mustPayZakat ? (
                      <>
                        <p className="text-green-100 mb-2">{t('zakat_amount_to_pay')}</p>
                        <p className="text-5xl font-bold mb-2">
                          {formatCurrency(results.zakatAmount)} сом
                        </p>
                        <p className="text-green-100">{t('zakat_annually')}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-100 mb-2">{t('zakat_below_nisab')}</p>
                        <p className="text-3xl font-bold">
                          {formatCurrency(results.netAssets)} сом &lt; {formatCurrency(results.nisabThreshold)} сом
                        </p>
                      </>
                    )}
                  </div>

                  {/* Assets vs Obligations Visualization */}
                  {(results.totalAssets > 0 || results.totalObligations > 0) && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        {t('zakat_structure_property')}
                      </h3>
                      <div className="space-y-4">
                        {/* Assets Bar */}
                        {results.totalAssets > 0 && (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600">{t('zakat_total_assets_calc')}</span>
                              <span className="text-sm font-medium text-blue-600">
                                {formatCurrency(results.totalAssets)} сом
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${assetsPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Obligations Bar */}
                        {results.totalObligations > 0 && (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600">{t('zakat_obligations_label')}</span>
                              <span className="text-sm font-medium text-red-600">
                                -{formatCurrency(results.totalObligations)} сом
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${obligationsPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Zakat Distribution Visualization */}
                  {results.mustPayZakat && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-medium text-gray-900 mb-4">{t('zakat_distribution_net_assets')}</h3>
                      <div className="space-y-4">
                        {/* Remaining Assets Bar */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">{t('zakat_remains_with_you')}</span>
                            <span className="text-sm font-medium text-gray-600">
                              {remainingPercentage.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-gray-500 to-gray-600 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${remainingPercentage}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Zakat Amount Bar */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">{t('zakat_rate')}</span>
                            <span className="text-sm font-medium text-green-600">
                              {zakatPercentage.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${zakatPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Calculation Breakdown */}
                  <div className="space-y-6">
                    <h3 className="font-medium text-gray-700 text-lg">{t('zakat_step_by_step')}</h3>

                    {/* Nisab Calculation */}
                    <div className="bg-amber-50 rounded-lg p-6">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <span className="text-gray-700 font-medium">{t('zakat_nisab_calculation')}</span>
                          <Tooltip text={t('tooltip_zakat_nisab')}>
                            <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-2xl font-bold text-amber-600">
                          {formatCurrency(results.nisabThreshold)} сом
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {t('zakat_formula')} {formatCurrency(results.goldPrice)} сом/г × {ZAKAT_CONFIG.nisab_gold_grams} г = {formatCurrency(results.nisabThreshold)} сом
                      </div>
                    </div>

                    {/* Assets Calculation */}
                    <div className="bg-blue-50 rounded-lg p-6">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <span className="text-gray-700 font-medium">{t('zakat_total_assets_calc')}</span>
                          <Tooltip text={t('tooltip_zakat_total_assets')}>
                            <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-xl font-semibold text-blue-600">
                          {formatCurrency(results.totalAssets)} сом
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 space-y-1">
                        <div className="flex justify-between">
                          <span>{t('zakat_cash_money')}</span>
                          <span>{formatCurrency(parseFloat(cashMoney) || 0)} сом</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('zakat_gold_jewelry')}</span>
                          <span>{formatCurrency(parseFloat(goldSilver) || 0)} сом</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('zakat_business_goods')}</span>
                          <span>{formatCurrency(parseFloat(businessGoods) || 0)} сом</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('zakat_investments_calc')}</span>
                          <span>{formatCurrency(parseFloat(investments) || 0)} сом</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('zakat_rental_income')}</span>
                          <span>{formatCurrency(parseFloat(rentalIncome) || 0)} сом</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('zakat_receivable_debts')}</span>
                          <span>{formatCurrency(parseFloat(receivableDebts) || 0)} сом</span>
                        </div>
                      </div>
                    </div>

                    {/* Net Assets Calculation */}
                    <div className="bg-green-50 rounded-lg p-6">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <span className="text-gray-700 font-medium">{t('zakat_net_assets_calc')}</span>
                          <Tooltip text={t('tooltip_zakat_net_assets')}>
                            <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-2xl font-bold text-green-600">
                          {formatCurrency(results.netAssets)} сом
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {t('zakat_formula')} {formatCurrency(results.totalAssets)} - {formatCurrency(results.totalObligations)} = {formatCurrency(results.netAssets)} сом
                      </div>
                    </div>

                    {/* Zakat Calculation */}
                    {results.mustPayZakat && (
                      <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center">
                            <span className="text-gray-700 font-medium">{t('zakat_calculation_2_5')}</span>
                            <Tooltip text={t('tooltip_zakat_amount')}>
                              <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                            </Tooltip>
                          </div>
                          <span className="text-3xl font-bold text-green-600">
                            {formatCurrency(results.zakatAmount)} сом
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {t('zakat_formula')} {formatCurrency(results.netAssets)} × 2.5% = {formatCurrency(results.zakatAmount)} сом
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-700 mb-3">{t('summary')}</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>{t('zakat_gold_price_summary')}</span>
                        <span>{formatCurrency(results.goldPrice)} сом/г</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('zakat_nisab_label')} ({ZAKAT_CONFIG.nisab_gold_grams} {t('zakat_gold_grams')}):</span>
                        <span>{formatCurrency(results.nisabThreshold)} сом</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('zakat_your_assets')}</span>
                        <span>{formatCurrency(results.netAssets)} сом</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('zakat_status')}</span>
                        <span className={results.mustPayZakat ? 'text-green-600 font-medium' : 'text-gray-600 font-medium'}>
                          {results.mustPayZakat ? t('zakat_required') : t('zakat_not_needed')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <Star className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    {t('zakat_enter_assets_prompt')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="mt-12 space-y-12">
          {/* Quick Examples */}
          <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
            <h3 className="font-medium text-gray-900 mb-4">{t('zakat_calculation_examples')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  label: t('zakat_example_family_savings'),
                  cash: 800000, gold: 200000, business: 0, investments: 0, rental: 0, receivable: 0, debts: 100000
                },
                {
                  label: t('zakat_example_entrepreneur'),
                  cash: 300000, gold: 150000, business: 500000, investments: 0, rental: 0, receivable: 200000, debts: 200000
                },
                {
                  label: t('zakat_example_investor'),
                  cash: 500000, gold: 100000, business: 0, investments: 1000000, rental: 600000, receivable: 0, debts: 300000
                }
              ].map((example, index) => {
                const exampleResult = calculateZakat(
                  parseFloat(goldPrice) || 0,
                  example.cash, example.gold, example.business, 
                  example.investments, example.rental, example.receivable, example.debts
                );
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setCashMoney(example.cash.toString());
                      setGoldSilver(example.gold.toString());
                      setBusinessGoods(example.business.toString());
                      setInvestments(example.investments.toString());
                      setRentalIncome(example.rental.toString());
                      setReceivableDebts(example.receivable.toString());
                      setPayableDebts(example.debts.toString());
                    }}
                    className="text-left p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-green-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium text-sm">
                        {example.label}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${exampleResult.mustPayZakat ? 'text-green-600' : 'text-gray-600'}`}>
                        {exampleResult.mustPayZakat ? `${formatCurrency(exampleResult.zakatAmount)} сом` : t('zakat_not_needed')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {t('zakat_net_assets_short')} {formatCurrency(exampleResult.netAssets)} сом
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Who Should Receive Zakat */}
          <div className="bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
            <h3 className="font-medium text-gray-900 mb-6">{t('zakat_who_receives')}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium text-gray-800 mb-3">{t('zakat_eight_categories')}</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('zakat_category_poor')}
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('zakat_category_collectors')}
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('zakat_category_new_muslims')}
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('zakat_category_slaves')}
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('zakat_category_debtors')}
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('zakat_category_allah_path')}
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('zakat_category_travelers')}
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-3">{t('zakat_kg_organizations')}</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('zakat_org_spiritual_board')}
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('zakat_org_mosques')}
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('zakat_org_charity')}
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('zakat_org_islamic_centers')}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Important Islamic Notice */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-8">
            <div className="flex items-start space-x-4">
              <Star className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
              <div className="text-sm text-green-800">
                <p className="font-bold mb-3 text-lg">{t('zakat_religious_notice_title')}</p>
                <div className="space-y-2">
                  <p dangerouslySetInnerHTML={{ __html: t('zakat_religious_notice_text1') }} />
                  <p dangerouslySetInnerHTML={{ __html: t('zakat_religious_notice_text2') }} />
                  <p dangerouslySetInnerHTML={{ __html: t('zakat_religious_notice_text3') }} />
                </div>
              </div>
            </div>
          </div>

          {/* Other Calculators */}
          <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
            <h3 className="font-medium text-gray-900 mb-4">{t('other_calculators')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to={getLocalizedPath("/calculator/family-benefit")}
                className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-green-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-50 p-2 rounded-lg group-hover:bg-gray-100 transition-colors">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-green-600">{t('zakat_other_calc_family_benefit')}</div>
                    <div className="text-sm text-gray-500">{t('zakat_other_calc_family_benefit_desc')}</div>
                  </div>
                </div>
              </Link>
              <Link
                to={getLocalizedPath("/calculator/alimony")}
                className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-green-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-50 p-2 rounded-lg group-hover:bg-gray-100 transition-colors">
                    <Users className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-green-600">{t('zakat_other_calc_alimony')}</div>
                    <div className="text-sm text-gray-500">{t('zakat_other_calc_alimony_desc')}</div>
                  </div>
                </div>
              </Link>
              <Link
                to={getLocalizedPath("/calculator/salary")}
                className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-green-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-green-600">{t('zakat_other_calc_salary')}</div>
                    <div className="text-sm text-gray-500">{t('zakat_other_calc_salary_desc')}</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Conditions for Zakat */}
          <div className="bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
            <h3 className="font-medium text-gray-900 mb-6">{t('zakat_conditions_title')}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">{t('zakat_condition_nisab_title')}</h4>
                <p className="text-sm text-gray-600">
                  {t('zakat_condition_nisab_desc')}
                </p>
              </div>

              <div className="text-center p-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">{t('zakat_condition_haul_title')}</h4>
                <p className="text-sm text-gray-600">
                  {t('zakat_condition_haul_desc')}
                </p>
              </div>

              <div className="text-center p-4">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-8 w-8 text-amber-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">{t('zakat_condition_growth_title')}</h4>
                <p className="text-sm text-gray-600">
                  {t('zakat_condition_growth_desc')}
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

export default ZakatCalculatorPage;