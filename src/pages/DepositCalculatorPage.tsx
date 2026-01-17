import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Info, Home, Printer, DollarSign, TrendingUp, Banknote, Building2, Car } from 'lucide-react';
import SchemaMarkup from '../components/SchemaMarkup';
import HreflangTags from '../components/HreflangTags';
import { useLanguage } from '../contexts/LanguageContext';
import {
  generateCalculatorSchema,
  generateBreadcrumbSchema
} from '../utils/schemaGenerator';

interface BankOffer {
  nameKey: string;
  minRate: number;
  maxRate: number;
  currency: string[];
}

interface DepositResults {
  principal: number;
  interestEarned: number;
  finalAmount: number;
  monthlyGrowth: MonthlyGrowthItem[];
}

interface MonthlyGrowthItem {
  month: number;
  balance: number;
  interestAdded: number;
}

type Currency = 'KGS' | 'USD' | 'EUR' | 'RUB';
type InterestType = 'simple' | 'compound';

const DepositCalculatorPage = () => {
  const { t, language, getLocalizedPath } = useLanguage();

  React.useEffect(() => {
    document.title = t('deposit_calc_title') + " - Calk.KG";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('deposit_calc_description'));
    }
  }, [t]);

  // Генерация схем для страницы депозитного калькулятора
  const generateSchemas = () => {
    const currentUrl = language === 'ky' ? "https://calk.kg/ky/calculator/deposit" : "https://calk.kg/calculator/deposit";
    const homeUrl = language === 'ky' ? "https://calk.kg/ky" : "https://calk.kg";
    
    const calculatorSchema = generateCalculatorSchema({
      url: currentUrl,
      title: t('deposit_calc_title'),
      description: t('deposit_calc_subtitle'),
      calculatorName: t('deposit_calc_title'),
      category: t('nav_finance'),
      language,
      inputProperties: ["principal", "rate", "term", "currency", "interestType"],
      outputProperties: ["interestEarned", "finalAmount"]
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: homeUrl },
      { name: t('nav_finance'), url: `${homeUrl}?category=finance` },
      { name: t('deposit_calc_title'), url: currentUrl }
    ]);

    return [calculatorSchema, breadcrumbSchema];
  };

  const [principal, setPrincipal] = useState<string>('');
  const [currency, setCurrency] = useState<Currency>('KGS');
  const [termMonths, setTermMonths] = useState<string>('12');
  const [annualRate, setAnnualRate] = useState<string>('');
  const [interestType, setInterestType] = useState<InterestType>('compound');
  
  const [results, setResults] = useState<DepositResults>({
    principal: 0,
    interestEarned: 0,
    finalAmount: 0,
    monthlyGrowth: []
  });

  // Банки Кыргызстана с депозитными ставками
  const bankOffers: BankOffer[] = [
    { nameKey: 'bank_bakay', minRate: 10, maxRate: 14, currency: ['KGS', 'USD'] },
    { nameKey: 'bank_mbank', minRate: 12, maxRate: 17, currency: ['KGS'] },
    { nameKey: 'bank_ayil', minRate: 8, maxRate: 13, currency: ['KGS', 'USD', 'EUR'] },
    { nameKey: 'bank_dos_kredo', minRate: 9, maxRate: 15, currency: ['KGS', 'USD'] },
    { nameKey: 'bank_fkur', minRate: 11, maxRate: 16, currency: ['KGS'] },
    { nameKey: 'bank_optima', minRate: 9.5, maxRate: 14.5, currency: ['KGS', 'USD'] },
    { nameKey: 'bank_asia', minRate: 8.5, maxRate: 13.5, currency: ['KGS', 'USD', 'EUR'] },
    { nameKey: 'bank_econom', minRate: 10.5, maxRate: 15.5, currency: ['KGS'] }
  ];

  const currencies = [
    { code: 'KGS' as Currency, name: t('currency_kgs'), symbol: 'KGS' },
    { code: 'USD' as Currency, name: t('currency_usd'), symbol: 'USD' },
    { code: 'EUR' as Currency, name: t('currency_eur'), symbol: 'EUR' },
    { code: 'RUB' as Currency, name: t('currency_rub'), symbol: 'RUB' }
  ];

  const termOptions = [
    { value: '3', label: t('term_3_months') },
    { value: '6', label: t('term_6_months') },
    { value: '12', label: t('term_12_months') },
    { value: '18', label: t('term_18_months') },
    { value: '24', label: t('term_24_months') },
    { value: '36', label: t('term_36_months') }
  ];

  // Расчет депозита
  const calculateDeposit = (
    principalAmount: number,
    rate: number,
    months: number,
    type: InterestType
  ): DepositResults => {
    if (principalAmount <= 0 || rate <= 0 || months <= 0) {
      return { principal: principalAmount, interestEarned: 0, finalAmount: principalAmount, monthlyGrowth: [] };
    }

    const monthlyGrowth: MonthlyGrowthItem[] = [];
    let currentBalance = principalAmount;
    let totalInterest = 0;

    if (type === 'simple') {
      // Простой процент - начисляется только в конце срока
      const simpleInterest = principalAmount * (rate / 100) * (months / 12);
      const finalAmount = principalAmount + simpleInterest;

      // Для визуализации создаем равномерное распределение
      for (let month = 1; month <= months; month++) {
        const proportionalInterest = simpleInterest * (month / months);
        monthlyGrowth.push({
          month,
          balance: principalAmount + (month === months ? simpleInterest : 0),
          interestAdded: month === months ? simpleInterest : 0
        });
      }

      return {
        principal: principalAmount,
        interestEarned: simpleInterest,
        finalAmount,
        monthlyGrowth
      };
    } else {
      // Сложный процент - капитализация каждый месяц
      const monthlyRate = rate / 100 / 12;
      
      for (let month = 1; month <= months; month++) {
        const monthlyInterest = currentBalance * monthlyRate;
        currentBalance += monthlyInterest;
        totalInterest += monthlyInterest;
        
        monthlyGrowth.push({
          month,
          balance: currentBalance,
          interestAdded: monthlyInterest
        });
      }

      return {
        principal: principalAmount,
        interestEarned: totalInterest,
        finalAmount: currentBalance,
        monthlyGrowth
      };
    }
  };

  // Обновление результатов
  useEffect(() => {
    const principalAmount = parseFloat(principal) || 0;
    const rate = parseFloat(annualRate) || 0;
    const months = parseInt(termMonths) || 0;

    if (principalAmount > 0 && rate > 0 && months > 0) {
      setResults(calculateDeposit(principalAmount, rate, months, interestType));
    } else {
      setResults({ principal: principalAmount, interestEarned: 0, finalAmount: principalAmount, monthlyGrowth: [] });
    }
  }, [principal, annualRate, termMonths, interestType]);

  const formatCurrency = (amount: number, curr: Currency = currency) => {
    return new Intl.NumberFormat('ru-KG', {
      style: 'decimal',
      minimumFractionDigits: curr === 'KGS' ? 0 : 2,
      maximumFractionDigits: curr === 'KGS' ? 0 : 2
    }).format(amount);
  };

  const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setPrincipal(value);
    }
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAnnualRate(value);
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

  // Расчет процентов для диаграммы
  const principalPercentage = results.finalAmount > 0 ? (results.principal / results.finalAmount) * 100 : 0;
  const interestPercentage = 100 - principalPercentage;

  // Сравнение простого и сложного процента
  const simpleInterestResult = calculateDeposit(parseFloat(principal) || 0, parseFloat(annualRate) || 0, parseInt(termMonths) || 0, 'simple');
  const compoundInterestResult = calculateDeposit(parseFloat(principal) || 0, parseFloat(annualRate) || 0, parseInt(termMonths) || 0, 'compound');
  const differenceAmount = compoundInterestResult.interestEarned - simpleInterestResult.interestEarned;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org микроразметка */}
      <Helmet>
        <title>{t('deposit_calc_title')} - Calk.KG</title>
        <meta name="description" content={t('deposit_calc_description')} />
        <meta name="keywords" content={t('deposit_calc_keywords')} />
        <meta property="og:title" content={`${t('deposit_calc_title')} - Calk.KG`} />
        <meta property="og:description" content={t('deposit_calc_subtitle')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/deposit" : "https://calk.kg/calculator/deposit"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/deposit.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('deposit_calc_title')} - Calk.KG`} />
        <meta name="twitter:description" content={t('deposit_calc_subtitle')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/deposit.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/deposit" : "https://calk.kg/calculator/deposit"} />
      </Helmet>
      <HreflangTags path="/calculator/deposit" />
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
              <TrendingUp className="h-8 w-8 print:text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold print:text-2xl">{t('deposit_calc_title')}</h1>
              <p className="text-red-100 text-lg print:text-gray-600">{t('deposit_calc_subtitle')}</p>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('deposit_params_title')}</h2>
              
              {/* Principal Amount */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('deposit_amount_label')}
                  </label>
                  <Tooltip text={t('tooltip_deposit_amount')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={principal}
                  onChange={handlePrincipalChange}
                  placeholder={t('placeholder_enter_deposit')}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg print:text-base"
                />
              </div>

              {/* Currency */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('deposit_currency_label')}
                  </label>
                  <Tooltip text={t('tooltip_deposit_currency')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg print:text-base"
                >
                  {currencies.map(curr => (
                    <option key={curr.code} value={curr.code}>
                      {curr.name} ({curr.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* Term */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('deposit_term_label')}
                  </label>
                  <Tooltip text={t('tooltip_deposit_term')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <select
                  value={termMonths}
                  onChange={(e) => setTermMonths(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg print:text-base"
                >
                  {termOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Interest Rate */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('deposit_rate_label')}
                  </label>
                  <Tooltip text={t('tooltip_deposit_rate')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={annualRate}
                  onChange={handleRateChange}
                  placeholder={t('placeholder_enter_rate_percent')}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg print:text-base"
                />
              </div>

              {/* Interest Type */}
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('deposit_interest_type_label')}
                  </label>
                  <Tooltip text={t('tooltip_deposit_type')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                    <input
                      type="radio"
                      name="interestType"
                      value="compound"
                      checked={interestType === 'compound'}
                      onChange={() => setInterestType('compound')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500"
                    />
                    <div>
                      <span className="text-gray-900 font-medium">{t('interest_type_compound_title')}</span>
                      <p className="text-sm text-gray-500">{t('interest_type_compound_desc')}</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                    <input
                      type="radio"
                      name="interestType"
                      value="simple"
                      checked={interestType === 'simple'}
                      onChange={() => setInterestType('simple')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500"
                    />
                    <div>
                      <span className="text-gray-900 font-medium">{t('interest_type_simple_title')}</span>
                      <p className="text-sm text-gray-500">{t('interest_type_simple_desc')}</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Info Block */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-2">{t('capitalization_advantage_title')}</p>
                    <p className="mb-2">
                      {t('capitalization_advantage_text1')}
                    </p>
                    <p>
                      {t('capitalization_advantage_text2')}
                    </p>
                    <p className="mt-3">
                      💰 <strong>{t('budget_planning_title')}</strong> {t('budget_planning_text')}
                      <Link to={getLocalizedPath('/calculator/loan')} className="text-blue-600 hover:text-blue-800 underline">{t('consumer_credit')}</Link>,
                      <Link to={getLocalizedPath('/calculator/mortgage')} className="text-blue-600 hover:text-blue-800 underline">{t('mortgage')}</Link> {t('or')}
                      <Link to={getLocalizedPath('/calculator/auto-loan')} className="text-blue-600 hover:text-blue-800 underline">{t('auto_credit')}</Link>.
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
                <h2 className="text-xl font-semibold text-gray-900">{t('calculation_results')}</h2>
                {results.finalAmount > results.principal && (
                  <button
                    onClick={handlePrint}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors print:hidden"
                  >
                    <Printer className="h-4 w-4" />
                    <span>{t('print')}</span>
                  </button>
                )}
              </div>
              
              {results.finalAmount > results.principal ? (
                <div className="space-y-8">
                  {/* Key Results */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Banknote className="h-5 w-5 mr-2" />
                        <span className="text-green-100">{t('interest_income_label')}</span>
                      </div>
                      <p className="text-3xl font-bold">
                        +{formatCurrency(results.interestEarned)} {currency}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white text-center">
                      <div className="flex items-center justify-center mb-2">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        <span className="text-blue-100">{t('total_amount_label')}</span>
                      </div>
                      <p className="text-3xl font-bold">
                        {formatCurrency(results.finalAmount)} {currency}
                      </p>
                    </div>
                  </div>

                  {/* Deposit Structure Visualization */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                      <DollarSign className="h-5 w-5 mr-2" />
                      {t('total_structure_title')}
                    </h3>
                    <div className="space-y-4">
                      {/* Principal Bar */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">{t('your_deposit')}</span>
                          <span className="text-sm font-medium text-blue-600">
                            {principalPercentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${principalPercentage}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Interest Bar */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">{t('earned_interest')}</span>
                          <span className="text-sm font-medium text-green-600">
                            {interestPercentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${interestPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comparison Block */}
                  {differenceAmount > 0 && (
                    <div className="bg-amber-50 rounded-xl p-6">
                      <h3 className="font-medium text-gray-900 mb-4">{t('interest_comparison_title')}</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-700">{t('simple_interest_end_term')}</span>
                          <span className="font-medium text-gray-900">
                            +{formatCurrency(simpleInterestResult.interestEarned)} {currency}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">{t('compound_interest_capitalization')}</span>
                          <span className="font-medium text-green-600">
                            +{formatCurrency(compoundInterestResult.interestEarned)} {currency}
                          </span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between">
                            <span className="text-gray-900 font-medium">{t('capitalization_benefit')}</span>
                            <span className="font-bold text-green-600">
                              +{formatCurrency(differenceAmount)} {currency}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-700 mb-3">{t('additional_info')}</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>{t('initial_amount')}</span>
                        <span>{formatCurrency(results.principal)} {currency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('placement_term')}</span>
                        <span>{termMonths} {t('months_short')} ({Math.round(parseInt(termMonths) / 12 * 10) / 10} {t('years_short')})</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('interest_rate')}</span>
                        <span>{annualRate}% {t('per_annum')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('profitability')}</span>
                        <span>{((results.interestEarned / results.principal) * 100).toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <TrendingUp className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">{t('enter_deposit_params')}</p>
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
                to={getLocalizedPath('/calculator/loan')}
                className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('loan_calculator')}</div>
                    <div className="text-sm text-gray-500">{t('consumer_loans')}</div>
                  </div>
                </div>
              </Link>
              <Link
                to={getLocalizedPath('/calculator/mortgage')}
                className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                    <Building2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('mortgage_calculator')}</div>
                    <div className="text-sm text-gray-500">{t('real_estate_loan')}</div>
                  </div>
                </div>
              </Link>
              <Link
                to={getLocalizedPath('/calculator/auto-loan')}
                className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-red-50 p-2 rounded-lg group-hover:bg-red-100 transition-colors">
                    <Car className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('auto_loan')}</div>
                    <div className="text-sm text-gray-500">{t('car_loan')}</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Bank Comparison Section */}
          {results.finalAmount > results.principal && (
            <div className="bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
              <div className="flex items-center mb-6">
                <Banknote className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {t('compare_bank_offers')}
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('bank_offer_col')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('rate_col')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('deposit_income_col')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('total_sum_col')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* User's Result */}
                    <tr className="bg-green-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {t('your_calculation')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {annualRate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        +{formatCurrency(results.interestEarned)} {currency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {formatCurrency(results.finalAmount)} {currency}
                      </td>
                    </tr>
                    
                    {/* Bank Offers */}
                    {bankOffers
                      .filter(bank => bank.currency.includes(currency))
                      .map((bank, index) => {
                        const bankResult = calculateDeposit(
                          parseFloat(principal) || 0,
                          bank.maxRate,
                          parseInt(termMonths) || 0,
                          'compound'
                        );
                        
                        const userRate = parseFloat(annualRate) || 0;
                        const isBetter = bank.maxRate > userRate;
                        const isWorse = bank.maxRate < userRate;
                        
                        return (
                          <tr key={index} className={isBetter ? 'bg-blue-50' : isWorse ? 'bg-red-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {t(bank.nameKey)} <span className="text-xs text-gray-500">({t('up_to')})</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {t('up_to')} {bank.maxRate}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              +{formatCurrency(bankResult.interestEarned)} {currency}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(bankResult.finalAmount)} {currency}
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
                    <span>{t('better_offer')}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-50 border border-red-200 rounded mr-2"></div>
                    <span>{t('worse_offer')}</span>
                  </div>
                </div>
                <p className="mt-3">
                  <strong>{t('important')}</strong> {t('bank_rates_disclaimer')}
                </p>
              </div>
            </div>
          )}

          {/* Quick Examples */}
          <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
            <h3 className="font-medium text-gray-900 mb-4">{t('popular_deposits')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { amount: 100000, term: 12, rate: 12, curr: 'KGS' as Currency },
                { amount: 5000, term: 18, rate: 8, curr: 'USD' as Currency },
                { amount: 500000, term: 24, rate: 14, curr: 'KGS' as Currency }
              ].map((example, index) => {
                const exampleResult = calculateDeposit(example.amount, example.rate, example.term, 'compound');
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setPrincipal(example.amount.toString());
                      setTermMonths(example.term.toString());
                      setAnnualRate(example.rate.toString());
                      setCurrency(example.curr);
                      setInterestType('compound');
                    }}
                    className="text-left p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">
                        {formatCurrency(example.amount, example.curr)} {example.curr}
                      </span>
                      <span className="text-xs text-gray-500">
                        {example.term} {t('months_short')} • {example.rate}%
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-semibold">
                        +{formatCurrency(exampleResult.interestEarned, example.curr)} {example.curr}
                      </div>
                      <div className="text-xs text-gray-500">
                        {t('total')}: {formatCurrency(exampleResult.finalAmount, example.curr)} {example.curr}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Educational Content Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('deposit_guide_title')}</h2>

            {/* Section 1: Basics */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('deposit_what_is')}</h3>
              <p className="text-gray-700 mb-4">
                {t('deposit_guide_intro')}
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <p className="text-gray-700">
                  <strong>{t('deposit_guide_advantage')}</strong> {t('deposit_guide_insurance')}
                </p>
              </div>
              <p className="text-gray-700">
                {t('deposit_guide_how_works')}
              </p>
            </div>

            {/* Section 2: Types */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('deposit_types')}</h3>

              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('deposit_type_1_title')}</h4>
                  <p className="text-gray-700 mb-2">
                    {t('deposit_type_1_desc')}
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>{t('deposit_type_1_rates')}</li>
                    <li>{t('deposit_type_1_min')}</li>
                    <li>{t('deposit_type_1_suitable')}</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('deposit_type_2_title')}</h4>
                  <p className="text-gray-700 mb-2">
                    {t('deposit_type_2_desc')}
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>{t('deposit_type_2_rates')}</li>
                    <li>{t('deposit_type_2_liquidity')}</li>
                    <li>{t('deposit_type_2_suitable')}</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('deposit_type_3_title')}</h4>
                  <p className="text-gray-700 mb-2">
                    {t('deposit_type_3_desc')}
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>{t('deposit_type_3_rates')}</li>
                    <li>{t('deposit_type_3_refill')}</li>
                    <li>{t('deposit_type_3_suitable')}</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('deposit_type_4_title')}</h4>
                  <p className="text-gray-700 mb-2">
                    {t('deposit_type_4_desc')}
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                    <li>{t('deposit_type_4_rates')}</li>
                    <li>{t('deposit_type_4_benefits')}</li>
                    <li>{t('deposit_type_4_available')}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3: Simple vs Compound Interest */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('deposit_simple_vs_compound')}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="border border-gray-200 rounded-lg p-5 bg-amber-50">
                  <h4 className="font-semibold text-gray-900 mb-3">{t('deposit_simple_interest_title')}</h4>
                  <p className="text-gray-700 mb-3">
                    {t('deposit_simple_interest_desc')}
                  </p>
                  <div className="bg-white rounded p-3 mb-3">
                    <p className="text-sm text-gray-600 mb-1">{t('deposit_simple_interest_example')}</p>
                    <p className="text-lg font-semibold text-gray-900">{t('deposit_simple_interest_income')}</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {t('deposit_simple_interest_suitable')}
                  </p>
                </div>

                <div className="border border-green-300 rounded-lg p-5 bg-green-50">
                  <h4 className="font-semibold text-gray-900 mb-3">{t('deposit_compound_interest_title')}</h4>
                  <p className="text-gray-700 mb-3">
                    {t('deposit_compound_interest_desc')}
                  </p>
                  <div className="bg-white rounded p-3 mb-3">
                    <p className="text-sm text-gray-600 mb-1">{t('deposit_compound_interest_example')}</p>
                    <p className="text-lg font-semibold text-green-700">{t('deposit_compound_interest_income')}</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    <strong>{t('deposit_compound_interest_benefit')}</strong> {t('deposit_compound_interest_extra')}
                  </p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                <h4 className="font-semibold text-gray-900 mb-2">{t('deposit_compound_formula_title')}</h4>
                <p className="text-gray-700 mb-2">
                  {t('deposit_compound_formula')}
                </p>
                <p className="text-sm text-gray-600">
                  {t('deposit_compound_frequency')}
                </p>
              </div>
            </div>

            {/* Section 4: Choosing Currency */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('deposit_currency_title')}</h3>

              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-lg mr-4">
                      <span className="text-2xl font-bold text-blue-700">KGS</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{t('deposit_currency_kgs_title')}</h4>
                      <p className="text-gray-700 mb-3">
                        {t('deposit_currency_kgs_desc')}
                      </p>
                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-sm text-gray-700 mb-1"><strong>{t('deposit_currency_kgs_pros_title')}</strong></p>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          <li>{t('deposit_currency_kgs_pros_1')}</li>
                          <li>{t('deposit_currency_kgs_pros_2')}</li>
                          <li>{t('deposit_currency_kgs_pros_3')}</li>
                        </ul>
                        <p className="text-sm text-gray-700 mt-2 mb-1"><strong>{t('deposit_currency_kgs_cons_title')}</strong></p>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          <li>{t('deposit_currency_kgs_cons_1')}</li>
                          <li>{t('deposit_currency_kgs_cons_2')}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-lg mr-4">
                      <span className="text-2xl font-bold text-green-700">USD</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{t('deposit_currency_usd_title')}</h4>
                      <p className="text-gray-700 mb-3">
                        {t('deposit_currency_usd_desc')}
                      </p>
                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-sm text-gray-700 mb-1"><strong>{t('deposit_currency_usd_pros_title')}</strong></p>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          <li>{t('deposit_currency_usd_pros_1')}</li>
                          <li>{t('deposit_currency_usd_pros_2')}</li>
                          <li>{t('deposit_currency_usd_pros_3')}</li>
                        </ul>
                        <p className="text-sm text-gray-700 mt-2 mb-1"><strong>{t('deposit_currency_usd_cons_title')}</strong></p>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          <li>{t('deposit_currency_usd_cons_1')}</li>
                          <li>{t('deposit_currency_usd_cons_2')}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-lg mr-4">
                      <span className="text-2xl font-bold text-purple-700">EUR</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{t('deposit_currency_eur_title')}</h4>
                      <p className="text-gray-700 mb-3">
                        {t('deposit_currency_eur_desc')}
                      </p>
                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-sm text-gray-700 mb-1"><strong>{t('deposit_currency_eur_when_title')}</strong></p>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          <li>{t('deposit_currency_eur_when_1')}</li>
                          <li>{t('deposit_currency_eur_when_2')}</li>
                          <li>{t('deposit_currency_eur_when_3')}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 mt-4">
                <p className="text-gray-700">
                  <strong>{t('deposit_currency_expert_title')}</strong> {t('deposit_currency_expert')}
                </p>
              </div>
            </div>

            {/* Section 5: How to Choose */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('deposit_choose_bank_title')}</h3>

              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900 mb-1">{t('deposit_choose_bank_1_title')}</h4>
                  <p className="text-gray-700 text-sm">
                    {t('deposit_choose_bank_1_desc')}
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900 mb-1">{t('deposit_choose_bank_2_title')}</h4>
                  <p className="text-gray-700 text-sm">
                    {t('deposit_choose_bank_2_desc')}
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900 mb-1">{t('deposit_choose_bank_3_title')}</h4>
                  <p className="text-gray-700 text-sm">
                    {t('deposit_choose_bank_3_desc')}
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900 mb-1">{t('deposit_choose_bank_4_title')}</h4>
                  <p className="text-gray-700 text-sm">
                    {t('deposit_choose_bank_4_desc')}
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900 mb-1">{t('deposit_choose_bank_5_title')}</h4>
                  <p className="text-gray-700 text-sm">
                    {t('deposit_choose_bank_5_desc')}
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900 mb-1">{t('deposit_choose_bank_6_title')}</h4>
                  <p className="text-gray-700 text-sm">
                    {t('deposit_choose_bank_6_desc')}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-5 mt-4">
                <h4 className="font-semibold text-gray-900 mb-3">{t('deposit_top_banks_title')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-white rounded p-3 border border-gray-200">
                    <p className="font-medium text-gray-900">{t('deposit_top_bank_1')}</p>
                    <p className="text-sm text-gray-600">{t('deposit_top_bank_1_rate')}</p>
                  </div>
                  <div className="bg-white rounded p-3 border border-gray-200">
                    <p className="font-medium text-gray-900">{t('deposit_top_bank_2')}</p>
                    <p className="text-sm text-gray-600">{t('deposit_top_bank_2_rate')}</p>
                  </div>
                  <div className="bg-white rounded p-3 border border-gray-200">
                    <p className="font-medium text-gray-900">{t('deposit_top_bank_3')}</p>
                    <p className="text-sm text-gray-600">{t('deposit_top_bank_3_rate')}</p>
                  </div>
                  <div className="bg-white rounded p-3 border border-gray-200">
                    <p className="font-medium text-gray-900">{t('deposit_top_bank_4')}</p>
                    <p className="text-sm text-gray-600">{t('deposit_top_bank_4_rate')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 6: Step by Step Guide */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('deposit_steps_title')}</h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 text-red-700 font-bold rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{t('deposit_step_1_title')}</h4>
                    <p className="text-gray-700 text-sm">
                      {t('deposit_step_1_desc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 text-red-700 font-bold rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{t('deposit_step_2_title')}</h4>
                    <p className="text-gray-700 text-sm">
                      {t('deposit_step_2_desc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 text-red-700 font-bold rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{t('deposit_step_3_title')}</h4>
                    <p className="text-gray-700 text-sm">
                      {t('deposit_step_3_desc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 text-red-700 font-bold rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    4
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{t('deposit_step_4_title')}</h4>
                    <p className="text-gray-700 text-sm">
                      {t('deposit_step_4_desc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 text-red-700 font-bold rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    5
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{t('deposit_step_5_title')}</h4>
                    <p className="text-gray-700 text-sm">
                      {t('deposit_step_5_desc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 text-red-700 font-bold rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    6
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{t('deposit_step_6_title')}</h4>
                    <p className="text-gray-700 text-sm">
                      {t('deposit_step_6_desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 7: Required Documents */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('deposit_docs_title')}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-3">{t('deposit_docs_individual_title')}</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">✓</span>
                      <span className="text-gray-700">{t('deposit_docs_individual_1')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">✓</span>
                      <span className="text-gray-700">{t('deposit_docs_individual_2')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">✓</span>
                      <span className="text-gray-700">{t('deposit_docs_individual_3')}</span>
                    </li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-3">{t('deposit_docs_legal_title')}</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">✓</span>
                      <span className="text-gray-700">{t('deposit_docs_legal_1')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">✓</span>
                      <span className="text-gray-700">{t('deposit_docs_legal_2')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">✓</span>
                      <span className="text-gray-700">{t('deposit_docs_legal_3')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">✓</span>
                      <span className="text-gray-700">{t('deposit_docs_legal_4')}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mt-4">
                <p className="text-gray-700">
                  <strong>{t('deposit_docs_online_title')}</strong> {t('deposit_docs_online')}
                </p>
              </div>
            </div>

            {/* Section 8: Tax and Insurance */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('deposit_tax_title')}</h3>

              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-3">{t('deposit_tax_subtitle')}</h4>
                  <p className="text-gray-700 mb-3">
                    {t('deposit_tax_desc')}
                  </p>
                  <div className="bg-gray-50 rounded p-4">
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>{t('deposit_tax_important')}</strong> {t('deposit_tax_auto')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t('deposit_tax_example')}
                    </p>
                  </div>
                </div>

                <div className="border border-green-300 rounded-lg p-5 bg-green-50">
                  <h4 className="font-semibold text-gray-900 mb-3">{t('deposit_insurance_title')}</h4>
                  <p className="text-gray-700 mb-3">
                    {t('deposit_insurance_desc')}
                  </p>
                  <div className="bg-white rounded p-4 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700">{t('deposit_insurance_amount')}</span>
                      <span className="font-bold text-green-700 text-xl">{t('deposit_insurance_sum')}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {t('deposit_insurance_per')}
                    </p>
                  </div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><strong>{t('deposit_insurance_covered_title')}</strong></p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                      <li>{t('deposit_insurance_covered_1')}</li>
                      <li>{t('deposit_insurance_covered_2')}</li>
                      <li>{t('deposit_insurance_covered_3')}</li>
                    </ul>
                    <p className="mt-3"><strong>{t('deposit_insurance_when_title')}</strong></p>
                    <p className="text-gray-600 ml-4">
                      {t('deposit_insurance_when')}
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
                  <p className="text-gray-700">
                    <strong>{t('deposit_insurance_tip')}</strong> {t('deposit_insurance_tip_text')}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 9: Expert Tips */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('deposit_strategies_title')}</h3>

              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('deposit_strategy_1_title')}</h4>
                  <p className="text-gray-700 mb-3">
                    {t('deposit_strategy_1_desc')}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>{t('deposit_strategy_1_benefit')}</strong> {t('deposit_strategy_1_benefit_text')}
                  </p>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('deposit_strategy_2_title')}</h4>
                  <p className="text-gray-700 mb-3">
                    {t('deposit_strategy_2_desc')}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>{t('deposit_strategy_2_benefit')}</strong> {t('deposit_strategy_2_benefit_text')}
                  </p>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('deposit_strategy_3_title')}</h4>
                  <p className="text-gray-700 mb-3">
                    {t('deposit_strategy_3_desc')}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>{t('deposit_strategy_3_benefit')}</strong> {t('deposit_strategy_3_benefit_text')}
                  </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('deposit_strategy_4_title')}</h4>
                  <p className="text-gray-700 mb-3">
                    {t('deposit_strategy_4_desc')}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>{t('deposit_strategy_4_benefit')}</strong> {t('deposit_strategy_4_benefit_text')}
                  </p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('deposit_strategy_5_title')}</h4>
                  <p className="text-gray-700 mb-3">
                    {t('deposit_strategy_5_desc')}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>{t('deposit_strategy_5_benefit')}</strong> {t('deposit_strategy_5_benefit_text')}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 10: FAQ */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('deposit_faq_title')}</h3>

              <div className="space-y-4">
                <details className="border border-gray-200 rounded-lg p-5 cursor-pointer hover:bg-gray-50">
                  <summary className="font-semibold text-gray-900">
                    {t('deposit_faq_1_q')}
                  </summary>
                  <p className="text-gray-700 mt-3 text-sm">
                    {t('deposit_faq_1_a')}
                  </p>
                </details>

                <details className="border border-gray-200 rounded-lg p-5 cursor-pointer hover:bg-gray-50">
                  <summary className="font-semibold text-gray-900">
                    {t('deposit_faq_2_q')}
                  </summary>
                  <p className="text-gray-700 mt-3 text-sm">
                    {t('deposit_faq_2_a')}
                  </p>
                </details>

                <details className="border border-gray-200 rounded-lg p-5 cursor-pointer hover:bg-gray-50">
                  <summary className="font-semibold text-gray-900">
                    {t('deposit_faq_3_q')}
                  </summary>
                  <p className="text-gray-700 mt-3 text-sm">
                    {t('deposit_faq_3_a')}
                  </p>
                </details>

                <details className="border border-gray-200 rounded-lg p-5 cursor-pointer hover:bg-gray-50">
                  <summary className="font-semibold text-gray-900">
                    {t('deposit_faq_4_q')}
                  </summary>
                  <p className="text-gray-700 mt-3 text-sm">
                    {t('deposit_faq_4_a')}
                  </p>
                </details>

                <details className="border border-gray-200 rounded-lg p-5 cursor-pointer hover:bg-gray-50">
                  <summary className="font-semibold text-gray-900">
                    {t('deposit_faq_5_q')}
                  </summary>
                  <p className="text-gray-700 mt-3 text-sm">
                    {t('deposit_faq_5_a')}
                  </p>
                </details>

                <details className="border border-gray-200 rounded-lg p-5 cursor-pointer hover:bg-gray-50">
                  <summary className="font-semibold text-gray-900">
                    {t('deposit_faq_6_q')}
                  </summary>
                  <p className="text-gray-700 mt-3 text-sm">
                    {t('deposit_faq_6_a')}
                  </p>
                </details>

                <details className="border border-gray-200 rounded-lg p-5 cursor-pointer hover:bg-gray-50">
                  <summary className="font-semibold text-gray-900">
                    {t('deposit_faq_7_q')}
                  </summary>
                  <p className="text-gray-700 mt-3 text-sm">
                    {t('deposit_faq_7_a')}
                  </p>
                </details>

                <details className="border border-gray-200 rounded-lg p-5 cursor-pointer hover:bg-gray-50">
                  <summary className="font-semibold text-gray-900">
                    {t('deposit_faq_8_q')}
                  </summary>
                  <p className="text-gray-700 mt-3 text-sm">
                    {t('deposit_faq_8_a')}
                  </p>
                </details>

                <details className="border border-gray-200 rounded-lg p-5 cursor-pointer hover:bg-gray-50">
                  <summary className="font-semibold text-gray-900">
                    {t('deposit_faq_9_q')}
                  </summary>
                  <p className="text-gray-700 mt-3 text-sm">
                    {t('deposit_faq_9_a')}
                  </p>
                </details>

                <details className="border border-gray-200 rounded-lg p-5 cursor-pointer hover:bg-gray-50">
                  <summary className="font-semibold text-gray-900">
                    {t('deposit_faq_10_q')}
                  </summary>
                  <p className="text-gray-700 mt-3 text-sm">
                    {t('deposit_faq_10_a')}
                  </p>
                </details>
              </div>
            </div>

            {/* Section 11: Risks and Alternatives */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('deposit_risks_title')}</h3>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">{t('deposit_risks_subtitle')}</h4>
                <div className="space-y-3">
                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <h5 className="font-medium text-gray-900 mb-1">{t('deposit_risk_1_title')}</h5>
                    <p className="text-sm text-gray-700">
                      {t('deposit_risk_1_desc')}
                    </p>
                  </div>

                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <h5 className="font-medium text-gray-900 mb-1">{t('deposit_risk_2_title')}</h5>
                    <p className="text-sm text-gray-700">
                      {t('deposit_risk_2_desc')}
                    </p>
                  </div>

                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <h5 className="font-medium text-gray-900 mb-1">{t('deposit_risk_3_title')}</h5>
                    <p className="text-sm text-gray-700">
                      {t('deposit_risk_3_desc')}
                    </p>
                  </div>

                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <h5 className="font-medium text-gray-900 mb-1">{t('deposit_risk_4_title')}</h5>
                    <p className="text-sm text-gray-700">
                      {t('deposit_risk_4_desc')}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">{t('deposit_alternatives_title')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">{t('deposit_alternative_1_title')}</h5>
                    <p className="text-sm text-gray-700 mb-2">
                      {t('deposit_alternative_1_desc')}
                    </p>
                    <p className="text-xs text-gray-600">{t('deposit_alternative_1_risk')}</p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">{t('deposit_alternative_2_title')}</h5>
                    <p className="text-sm text-gray-700 mb-2">
                      {t('deposit_alternative_2_desc')}
                    </p>
                    <p className="text-xs text-gray-600">{t('deposit_alternative_2_risk')}</p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">{t('deposit_alternative_3_title')}</h5>
                    <p className="text-sm text-gray-700 mb-2">
                      {t('deposit_alternative_3_desc')}
                    </p>
                    <p className="text-xs text-gray-600">{t('deposit_alternative_3_risk')}</p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">{t('deposit_alternative_4_title')}</h5>
                    <p className="text-sm text-gray-700 mb-2">
                      {t('deposit_alternative_4_desc')}
                    </p>
                    <p className="text-xs text-gray-600">{t('deposit_alternative_4_risk')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mt-4">
                <p className="text-gray-700">
                  <strong>{t('deposit_alternatives_recommendation')}</strong> {t('deposit_alternatives_recommendation_text')}
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-sm text-gray-600">
            <p className="mb-2">
              <strong>{t('deposit_disclaimer_title')}</strong> {t('deposit_disclaimer_1')}
            </p>
            <p>
              {t('deposit_disclaimer_2')}
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
  );
};

export default DepositCalculatorPage;