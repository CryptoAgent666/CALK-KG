import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Info, Home, Printer, DollarSign, TrendingUp, Building2, ChevronDown, ChevronUp, Car } from 'lucide-react';
import ActionButtons from '../components/ActionButtons';
import SchemaMarkup from '../components/SchemaMarkup';
import HreflangTags from '../components/HreflangTags';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  generateCalculatorSchema, 
  generateBreadcrumbSchema, 
  generateSoftwareApplicationSchema 
} from '../utils/schemaGenerator';

interface BankOffer {
  nameKey: string;
  minRate: number;
  maxRate: number;
  maxTerm: number;
}

interface LoanResults {
  loanAmount: number;
  monthlyPayment: number;
  totalAmount: number;
  overpayment: number;
}

interface PaymentScheduleItem {
  month: number;
  date: string;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

const MortgageCalculatorPage = () => {
  const { t, language, getLocalizedPath} = useLanguage();

  React.useEffect(() => {
    document.title = t('mortgage_calc_title') + " - Calk.KG";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('mortgage_calc_description'));
    }
  }, [t]);

  const [propertyValue, setPropertyValue] = useState<string>('');
  const [downPaymentAmount, setDownPaymentAmount] = useState<string>('');
  const [downPaymentPercent, setDownPaymentPercent] = useState<string>('');
  const [loanTermYears, setLoanTermYears] = useState<string>('15');
  const [interestRate, setInterestRate] = useState<string>('');
  
  const [showSchedule, setShowSchedule] = useState<boolean>(false);
  const [scheduleFilter, setScheduleFilter] = useState<string>('all');
  
  const [results, setResults] = useState<LoanResults>({
    loanAmount: 0,
    monthlyPayment: 0,
    totalAmount: 0,
    overpayment: 0
  });

  const [paymentSchedule, setPaymentSchedule] = useState<PaymentScheduleItem[]>([]);

  // Банки Кыргызстана с ипотечными ставками
  const bankOffers: BankOffer[] = [
    { nameKey: 'bank_ayil', minRate: 14.0, maxRate: 16.5, maxTerm: 20 },
    { nameKey: 'bank_dos_kredo', minRate: 15.5, maxRate: 18.0, maxTerm: 15 },
    { nameKey: 'bank_fkur', minRate: 14.5, maxRate: 17.0, maxTerm: 20 },
    { nameKey: 'bank_cbk', minRate: 15.0, maxRate: 17.5, maxTerm: 20 },
    { nameKey: 'bank_optima', minRate: 14.0, maxRate: 16.0, maxTerm: 15 },
    { nameKey: 'bank_bta', minRate: 16.0, maxRate: 19.0, maxTerm: 15 },
    { nameKey: 'bank_asia', minRate: 15.0, maxRate: 17.0, maxTerm: 20 },
    { nameKey: 'bank_rsk', minRate: 13.5, maxRate: 16.0, maxTerm: 25 }
  ];

  const termOptions = [
    { value: '5', label: t('mortgage_term_5_years') },
    { value: '10', label: t('mortgage_term_10_years') },
    { value: '15', label: t('mortgage_term_15_years') },
    { value: '20', label: t('mortgage_term_20_years') },
    { value: '25', label: t('mortgage_term_25_years') }
  ];

  // Расчет ипотеки
  const calculateMortgage = (
    propertyVal: number, 
    downPayment: number, 
    termYears: number, 
    annualRate: number
  ): LoanResults => {
    if (propertyVal <= 0 || downPayment >= propertyVal || termYears <= 0 || annualRate < 0) {
      return { loanAmount: 0, monthlyPayment: 0, totalAmount: 0, overpayment: 0 };
    }

    const loanAmount = propertyVal - downPayment;
    const termMonths = termYears * 12;
    const monthlyRate = annualRate / 12 / 100;
    
    let monthlyPayment: number;
    if (monthlyRate === 0) {
      monthlyPayment = loanAmount / termMonths;
    } else {
      monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                      (Math.pow(1 + monthlyRate, termMonths) - 1);
    }
    
    const totalAmount = monthlyPayment * termMonths;
    const overpayment = totalAmount - loanAmount;

    return {
      loanAmount,
      monthlyPayment,
      totalAmount,
      overpayment
    };
  };

  // Генерация графика платежей
  const generatePaymentSchedule = (
    loanAmount: number,
    monthlyPayment: number,
    termMonths: number,
    monthlyRate: number
  ): PaymentScheduleItem[] => {
    if (loanAmount <= 0 || monthlyPayment <= 0) return [];

    const schedule: PaymentScheduleItem[] = [];
    let remainingBalance = loanAmount;
    const startDate = new Date();

    for (let month = 1; month <= termMonths; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance = Math.max(0, remainingBalance - principalPayment);

      const paymentDate = new Date(startDate.getFullYear(), startDate.getMonth() + month, 1);
      
      schedule.push({
        month,
        date: paymentDate.toLocaleDateString('ru-KG', { year: 'numeric', month: '2-digit' }),
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: remainingBalance
      });
    }

    return schedule;
  };

  // Обновление расчетов
  useEffect(() => {
    const propertyVal = parseFloat(propertyValue) || 0;
    const downPayment = parseFloat(downPaymentAmount) || 0;
    const termYears = parseInt(loanTermYears) || 0;
    const rate = parseFloat(interestRate) || 0;

    if (propertyVal > 0 && downPayment >= 0 && downPayment < propertyVal && termYears > 0 && rate >= 0) {
      const newResults = calculateMortgage(propertyVal, downPayment, termYears, rate);
      setResults(newResults);

      if (newResults.loanAmount > 0) {
        const monthlyRate = rate / 12 / 100;
        const termMonths = termYears * 12;
        const schedule = generatePaymentSchedule(newResults.loanAmount, newResults.monthlyPayment, termMonths, monthlyRate);
        setPaymentSchedule(schedule);
      }
    } else {
      setResults({ loanAmount: 0, monthlyPayment: 0, totalAmount: 0, overpayment: 0 });
      setPaymentSchedule([]);
    }
  }, [propertyValue, downPaymentAmount, loanTermYears, interestRate]);

  // Генерация схем для страницы ипотечного калькулятора
  const generateSchemas = () => {
    const currentUrl = language === 'ky' ? "https://calk.kg/ky/calculator/mortgage" : "https://calk.kg/calculator/mortgage";
    const homeUrl = language === 'ky' ? "https://calk.kg/ky" : "https://calk.kg";

    const calculatorSchema = generateCalculatorSchema({
      url: currentUrl,
      title: t('mortgage_calc_title'),
      description: t('mortgage_calc_description'),
      calculatorName: t('mortgage_calc_title'),
      category: t('category_finance'),
      inputProperties: ["propertyValue", "downPayment", "loanTerm", "interestRate"],
      outputProperties: ["monthlyPayment", "totalAmount", "overpayment", "paymentSchedule"]
    });

    const softwareSchema = generateSoftwareApplicationSchema({
      url: currentUrl,
      title: t('mortgage_calc_title'),
      description: t('mortgage_calc_description'),
      calculatorName: t('mortgage_calc_title'),
      category: "FinanceApplication",
      inputProperties: [t('mortgage_property_value'), t('mortgage_down_payment'), t('mortgage_loan_term'), t('mortgage_interest_rate')],
      outputProperties: [t('mortgage_monthly_payment'), t('mortgage_total_amount'), t('mortgage_overpayment'), t('mortgage_payment_schedule')]
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('home'), url: "https://calk.kg" },
      { name: t('category_finance'), url: `${homeUrl}?category=finance` },
      { name: t('mortgage_calc_title'), url: currentUrl }
    ]);

    return [calculatorSchema, softwareSchema, breadcrumbSchema];
  };

  // Связка первоначального взноса (сумма <-> процент)
  const handleDownPaymentAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setDownPaymentAmount(value);
      const propertyVal = parseFloat(propertyValue) || 0;
      const downPayment = parseFloat(value) || 0;
      if (propertyVal > 0 && downPayment >= 0) {
        const percent = (downPayment / propertyVal) * 100;
        setDownPaymentPercent(percent.toFixed(1));
      }
    }
  };

  const handleDownPaymentPercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setDownPaymentPercent(value);
      const propertyVal = parseFloat(propertyValue) || 0;
      const percent = parseFloat(value) || 0;
      if (propertyVal > 0 && percent >= 0 && percent <= 100) {
        const amount = (propertyVal * percent) / 100;
        setDownPaymentAmount(amount.toString());
      }
    }
  };

  const handlePropertyValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setPropertyValue(value);
      // Пересчитать первоначальный взнос если задан процент
      const percent = parseFloat(downPaymentPercent) || 0;
      const propertyVal = parseFloat(value) || 0;
      if (propertyVal > 0 && percent > 0) {
        const amount = (propertyVal * percent) / 100;
        setDownPaymentAmount(amount.toString());
      }
    }
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setInterestRate(value);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-KG', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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

  // Фильтрация графика платежей
  const getFilteredSchedule = () => {
    if (scheduleFilter === 'all') return paymentSchedule;
    
    const year = parseInt(scheduleFilter);
    const startMonth = (year - 1) * 12 + 1;
    const endMonth = year * 12;
    
    return paymentSchedule.filter(item => item.month >= startMonth && item.month <= endMonth);
  };

  // Расчет процентов для диаграммы
  const propertyVal = parseFloat(propertyValue) || 0;
  const downPayment = parseFloat(downPaymentAmount) || 0;
  const loanPercentage = propertyVal > 0 ? (results.loanAmount / propertyVal) * 100 : 0;
  const downPaymentPercentage = propertyVal > 0 ? (downPayment / propertyVal) * 100 : 0;
  const principalPercentage = results.totalAmount > 0 ? (results.loanAmount / results.totalAmount) * 100 : 0;
  const interestPercentage = 100 - principalPercentage;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org микроразметка */}
      <Helmet>
        <title>{t('mortgage_calc_title')} - Calk.KG</title>
        <meta name="description" content={t('mortgage_calc_description')} />
        <meta name="keywords" content={t('mortgage_calc_keywords')} />
        <meta property="og:title" content={`${t('mortgage_calc_title')} - Calk.KG`} />
        <meta property="og:description" content={t('mortgage_calc_subtitle')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/mortgage" : "https://calk.kg/calculator/mortgage"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/mortgage.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('mortgage_calc_title')} - Calk.KG`} />
        <meta name="twitter:description" content={t('mortgage_calc_subtitle')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/mortgage.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/mortgage" : "https://calk.kg/calculator/mortgage"} />
      </Helmet>
      <HreflangTags path="/calculator/mortgage" />
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
              <Home className="h-8 w-8 print:text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold print:text-2xl">{t('mortgage_calc_title')}</h1>
              <p className="text-red-100 text-lg print:text-gray-600">{t('mortgage_calc_subtitle')}</p>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('mortgage_parameters')}</h2>

              {/* Property Value */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('mortgage_property_value')}
                  </label>
                  <Tooltip text={t('mortgage_property_value_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={propertyValue}
                  onChange={handlePropertyValueChange}
                  placeholder={t('mortgage_property_value_placeholder')}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg print:text-base"
                />
              </div>

              {/* Down Payment */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('mortgage_down_payment')}
                  </label>
                  <Tooltip text={t('mortgage_down_payment_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">{t('mortgage_down_payment_amount')}</label>
                    <input
                      type="text"
                      value={downPaymentAmount}
                      onChange={handleDownPaymentAmountChange}
                      placeholder={t('mortgage_down_payment_amount_placeholder')}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">{t('mortgage_down_payment_percent')}</label>
                    <input
                      type="text"
                      value={downPaymentPercent}
                      onChange={handleDownPaymentPercentChange}
                      placeholder={t('mortgage_down_payment_percent_placeholder')}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Loan Term */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('mortgage_loan_term')}
                  </label>
                  <Tooltip text={t('mortgage_loan_term_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <select
                  value={loanTermYears}
                  onChange={(e) => setLoanTermYears(e.target.value)}
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
                    {t('mortgage_interest_rate')}
                  </label>
                  <Tooltip text={t('mortgage_interest_rate_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={interestRate}
                  onChange={handleRateChange}
                  placeholder={t('mortgage_interest_rate_placeholder')}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg print:text-base"
                />
              </div>

              {/* Info Block */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-2">{t('mortgage_info_features')}</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>{t('mortgage_info_min_down_payment')}</li>
                      <li>{t('mortgage_info_max_term')}</li>
                      <li>{t('mortgage_info_insurance')}</li>
                      <li>{t('mortgage_info_early_repayment')}</li>
                    </ul>
                    <p className="mt-3">
                      💡 <strong>{t('useful_to_know')}</strong> {t('mortgage_info_tip_intro')} <Link to={getLocalizedPath("/calculator/housing")} className="text-blue-600 hover:text-blue-800 underline">{t('mortgage_info_tip_housing_cost')}</Link> {t('mortgage_info_tip_and')} <Link to={getLocalizedPath("/calculator/property-tax")} className="text-blue-600 hover:text-blue-800 underline">{t('mortgage_info_tip_property_tax')}</Link>.
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
                <h2 className="text-xl font-semibold text-gray-900">{t('mortgage_results_title')}</h2>
                {results.monthlyPayment > 0 && (
                  <ActionButtons
                    calculatorName={t('mortgage_calc_name')}
                    resultText={`${t('mortgage_result_template_intro')}
${t('mortgage_result_property_value')} ${formatCurrency(parseFloat(propertyValue) || 0)} KGS
${t('mortgage_result_down_payment')} ${formatCurrency(parseFloat(downPaymentAmount) || 0)} KGS
${t('mortgage_result_loan_amount')} ${formatCurrency(results.loanAmount)} KGS
${t('mortgage_result_loan_term')} ${loanTermYears} ${t('mortgage_years_short')}
${t('mortgage_result_interest_rate')} ${interestRate}%
${t('mortgage_result_monthly_payment')} ${formatCurrency(results.monthlyPayment)} KGS
${t('mortgage_result_overpayment')} ${formatCurrency(results.overpayment)} KGS
${t('mortgage_result_total_payment')} ${formatCurrency(results.totalAmount)} KGS

${t('calculated_on_site')} Calk.KG`}
                  />
                )}
              </div>
              
              {results.monthlyPayment > 0 ? (
                <div className="space-y-6">
                  {/* Key Results */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white text-center">
                      <div className="flex items-center justify-center mb-2">
                        <DollarSign className="h-5 w-5 mr-2" />
                        <span className="text-green-100">{t('mortgage_monthly_payment')}</span>
                      </div>
                      <p className="text-3xl font-bold">
                        {formatCurrency(results.monthlyPayment)} KGS
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Home className="h-5 w-5 mr-2" />
                        <span className="text-blue-100">{t('mortgage_loan_amount')}</span>
                      </div>
                      <p className="text-3xl font-bold">
                        {formatCurrency(results.loanAmount)} KGS
                      </p>
                    </div>
                  </div>

                  {/* Property Structure Visualization */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      {t('mortgage_property_structure')}
                    </h3>
                    <div className="space-y-4">
                      {/* Down Payment Bar */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">{t('mortgage_down_payment_label')}</span>
                          <span className="text-sm font-medium text-green-600">
                            {downPaymentPercentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${downPaymentPercentage}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Loan Amount Bar */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">{t('mortgage_loan_amount_label')}</span>
                          <span className="text-sm font-medium text-blue-600">
                            {loanPercentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${loanPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Credit Structure Visualization */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-medium text-gray-900 mb-4">{t('mortgage_credit_structure')}</h3>
                    <div className="space-y-4">
                      {/* Principal Bar */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">{t('principal_debt')}</span>
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
                          <span className="text-sm text-gray-600">{t('interest')}</span>
                          <span className="text-sm font-medium text-red-600">
                            {interestPercentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${interestPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Results */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-amber-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-gray-700 font-medium">{t('overpayment_interest')}</span>
                          <Tooltip text={t('overpayment_interest_tooltip')}>
                            <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-amber-600 font-semibold">
                          {formatCurrency(results.overpayment)} KGS
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-gray-700 font-medium">{t('mortgage_total_payments')}</span>
                          <Tooltip text={t('mortgage_total_payments_tooltip')}>
                            <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-gray-900 font-semibold">
                          {formatCurrency(results.totalAmount)} KGS
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <Home className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">{t('mortgage_enter_params')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="mt-12 space-y-12">
          {/* Payment Schedule */}
          {paymentSchedule.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm print:break-inside-avoid">
              <div className="p-8 print:p-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">{t('mortgage_payment_schedule')}</h2>
                  <button
                    onClick={() => setShowSchedule(!showSchedule)}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors print:hidden"
                  >
                    <span>{showSchedule ? t('mortgage_hide_schedule') : t('mortgage_show_schedule')}</span>
                    {showSchedule ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>

                {showSchedule && (
                  <>
                    {/* Filter */}
                    <div className="mb-6 print:hidden">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('mortgage_schedule_filter')}
                      </label>
                      <select
                        value={scheduleFilter}
                        onChange={(e) => setScheduleFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="all">{t('mortgage_schedule_show_all')}</option>
                        {Array.from({ length: parseInt(loanTermYears) }, (_, i) => i + 1).map(year => (
                          <option key={year} value={year}>{t('mortgage_schedule_year')} {year}</option>
                        ))}
                      </select>
                    </div>

                    {/* Schedule Table */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('mortgage_schedule_payment_num')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('mortgage_schedule_date')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('mortgage_schedule_payment')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('mortgage_schedule_principal')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('mortgage_schedule_interest')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {t('mortgage_schedule_balance')}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {getFilteredSchedule().map((item) => (
                            <tr key={item.month} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {item.month}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {item.date}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                {formatCurrency(item.payment)} KGS
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                                {formatCurrency(item.principal)} KGS
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                                {formatCurrency(item.interest)} KGS
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatCurrency(item.balance)} KGS
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {scheduleFilter !== 'all' && (
                      <p className="text-sm text-gray-500 mt-4">
                        {t('mortgage_schedule_year_info').replace('{year}', scheduleFilter).replace('{total}', loanTermYears)}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Bank Comparison Section */}
          {results.monthlyPayment > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
              <div className="flex items-center mb-6">
                <Building2 className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {t('mortgage_bank_comparison')}
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('mortgage_bank_name')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('mortgage_bank_rate_range')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('mortgage_bank_max_term')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('mortgage_bank_monthly_min')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('mortgage_bank_overpayment_min')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* User's Offer */}
                    <tr className="bg-green-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {t('mortgage_your_offer')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {interestRate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {loanTermYears} {t('mortgage_years_short')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {formatCurrency(results.monthlyPayment)} KGS
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {formatCurrency(results.overpayment)} KGS
                      </td>
                    </tr>

                    {/* Bank Offers */}
                    {bankOffers.map((bank, index) => {
                      const termYears = Math.min(parseInt(loanTermYears), bank.maxTerm);
                      const bankResults = calculateMortgage(
                        parseFloat(propertyValue) || 0,
                        parseFloat(downPaymentAmount) || 0,
                        termYears,
                        bank.minRate
                      );

                      const userRate = parseFloat(interestRate) || 0;
                      const isBetter = bank.minRate < userRate;
                      const isWorse = bank.minRate > userRate;

                      return (
                        <tr key={index} className={isBetter ? 'bg-blue-50' : isWorse ? 'bg-red-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {t(bank.nameKey)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {bank.minRate}% - {bank.maxRate}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {t('mortgage_up_to')} {bank.maxTerm} {t('mortgage_years_short')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(bankResults.monthlyPayment)} KGS
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(bankResults.overpayment)} KGS
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
                    <span>{t('mortgage_better_offer_legend')}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-50 border border-red-200 rounded mr-2"></div>
                    <span>{t('mortgage_worse_offer_legend')}</span>
                  </div>
                </div>
                <p className="mt-3">
                  <strong>{t('important')}</strong> {t('mortgage_bank_rates_notice')}
                </p>
              </div>
            </div>
          )}

          {/* Quick Examples */}
          <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
            <h3 className="font-medium text-gray-900 mb-4">{t('mortgage_popular_scenarios')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { property: 3000000, downPayment: 600000, term: 15, rate: 15 },
                { property: 5000000, downPayment: 1000000, term: 20, rate: 16 },
                { property: 8000000, downPayment: 2000000, term: 25, rate: 14.5 }
              ].map((example, index) => {
                const exampleResult = calculateMortgage(example.property, example.downPayment, example.term, example.rate);
                const downPaymentPercent = (example.downPayment / example.property) * 100;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setPropertyValue(example.property.toString());
                      setDownPaymentAmount(example.downPayment.toString());
                      setDownPaymentPercent(downPaymentPercent.toFixed(1));
                      setLoanTermYears(example.term.toString());
                      setInterestRate(example.rate.toString());
                    }}
                    className="text-left p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">
                        {formatCurrency(example.property)} KGS
                      </span>
                      <span className="text-xs text-gray-500">
                        {example.term} {t('mortgage_years_short')} • {example.rate}%
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-semibold">
                        {formatCurrency(exampleResult.monthlyPayment)} {t('mortgage_per_month_short')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {t('mortgage_down_payment_short')} {formatCurrency(example.downPayment)} KGS ({downPaymentPercent.toFixed(0)}%)
                      </div>
                      <div className="text-xs text-gray-500">
                        {t('mortgage_overpayment_short')} {formatCurrency(exampleResult.overpayment)} KGS
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
                to={getLocalizedPath("/calculator/loan")}
                className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('loan_link_title')}</div>
                    <div className="text-sm text-gray-500">{t('loan_link_desc')}</div>
                  </div>
                </div>
              </Link>
              <Link
                to={getLocalizedPath("/calculator/auto-loan")}
                className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-red-50 p-2 rounded-lg group-hover:bg-red-100 transition-colors">
                    <Car className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('auto_loan_link_title')}</div>
                    <div className="text-sm text-gray-500">{t('auto_loan_link_desc')}</div>
                  </div>
                </div>
              </Link>
              <Link
                to={getLocalizedPath("/calculator/deposit")}
                className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('deposit_link_title')}</div>
                    <div className="text-sm text-gray-500">{t('deposit_link_desc')}</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Educational Content Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('mortgage_guide_title')}</h2>

            {/* Section 1: What is Mortgage */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('mortgage_what_is')}</h3>
              <div className="prose max-w-none text-gray-700 space-y-3">
                <p>
                  <strong>{t('mortgage_calc_short')}</strong> — {t('mortgage_what_is_content')}
                </p>
                <p>
                  {t('mortgage_what_is_kr_context')}
                </p>
                <p className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <strong>{t('mortgage_how_works_title')}</strong> {t('mortgage_how_works_content')}
                </p>
              </div>
            </div>

            {/* Section 2: Types of Mortgage */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('mortgage_types')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🏢 {t('mortgage_type_new_building')}</h4>
                  <p className="text-sm text-gray-600">
                    {t('mortgage_type_new_building_desc')}
                  </p>
                  <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                    <li>{t('mortgage_type_new_rate')}</li>
                    <li>{t('mortgage_type_new_term')}</li>
                    <li>{t('mortgage_type_new_down')}</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🏠 {t('mortgage_type_secondary')}</h4>
                  <p className="text-sm text-gray-600">
                    {t('mortgage_type_secondary_desc')}
                  </p>
                  <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                    <li>{t('mortgage_type_secondary_rate')}</li>
                    <li>{t('mortgage_type_secondary_term')}</li>
                    <li>{t('mortgage_type_secondary_down')}</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🏗️ {t('mortgage_type_construction')}</h4>
                  <p className="text-sm text-gray-600">
                    {t('mortgage_type_construction_desc')}
                  </p>
                  <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                    <li>{t('mortgage_type_construction_rate')}</li>
                    <li>{t('mortgage_type_construction_term')}</li>
                    <li>{t('mortgage_type_construction_down')}</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🏘️ {t('mortgage_type_government')}</h4>
                  <p className="text-sm text-gray-600">
                    {t('mortgage_type_government_desc')}
                  </p>
                  <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                    <li>{t('mortgage_type_government_rate')}</li>
                    <li>{t('mortgage_type_government_term')}</li>
                    <li>{t('mortgage_type_government_down')}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3: How to Choose Mortgage */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('mortgage_how_to_choose')}</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t('mortgage_choose_step1_title')}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {t('mortgage_choose_step1_content')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t('mortgage_choose_step2_title')}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {t('mortgage_choose_step2_content')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t('mortgage_choose_step3_title')}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {t('mortgage_choose_step3_content')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t('mortgage_choose_step4_title')}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {t('mortgage_choose_step4_content')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">5</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t('mortgage_choose_step5_title')}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {t('mortgage_choose_step5_content')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">6</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t('mortgage_choose_step6_title')}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {t('mortgage_choose_step6_content')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Requirements */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('mortgage_requirements_title')}</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{t('mortgage_requirements_general')}</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        {t('mortgage_requirements_general_1')}
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        {t('mortgage_requirements_general_2')}
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        {t('mortgage_requirements_general_3')}
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        {t('mortgage_requirements_general_4')}
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        {t('mortgage_requirements_general_5')}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{t('mortgage_requirements_additional')}</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        {t('mortgage_requirements_additional_1')}
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        {t('mortgage_requirements_additional_2')}
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        {t('mortgage_requirements_additional_3')}
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        {t('mortgage_requirements_additional_4')}
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        {t('mortgage_requirements_additional_5')}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Documents */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('mortgage_documents_title')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">{t('mortgage_documents_borrower')}</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• {t('mortgage_documents_borrower_1')}</li>
                    <li>• {t('mortgage_documents_borrower_2')}</li>
                    <li>• {t('mortgage_documents_borrower_3')}</li>
                    <li>• {t('mortgage_documents_borrower_4')}</li>
                    <li>• {t('mortgage_documents_borrower_5')}</li>
                    <li>• {t('mortgage_documents_borrower_6')}</li>
                    <li>• {t('mortgage_documents_borrower_7')}</li>
                  </ul>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">{t('mortgage_documents_property')}</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• {t('mortgage_documents_property_1')}</li>
                    <li>• {t('mortgage_documents_property_2')}</li>
                    <li>• {t('mortgage_documents_property_3')}</li>
                    <li>• {t('mortgage_documents_property_4')}</li>
                    <li>• {t('mortgage_documents_property_5')}</li>
                    <li>• {t('mortgage_documents_property_6')}</li>
                    <li>• {t('mortgage_documents_property_7')}</li>
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                {t('mortgage_documents_tip')}
              </p>
            </div>

            {/* Section 6: Tips */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('mortgage_tips_title')}</h3>
              <div className="space-y-3">
                <div className="bg-green-50 border-l-4 border-green-500 p-4">
                  <h4 className="font-semibold text-green-900 mb-1">{t('mortgage_tips_1_title')}</h4>
                  <p className="text-sm text-green-800">
                    {t('mortgage_tips_1_content')}
                  </p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <h4 className="font-semibold text-blue-900 mb-1">{t('mortgage_tips_2_title')}</h4>
                  <p className="text-sm text-blue-800">
                    {t('mortgage_tips_2_content')}
                  </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
                  <h4 className="font-semibold text-amber-900 mb-1">{t('mortgage_tips_3_title')}</h4>
                  <p className="text-sm text-amber-800">
                    {t('mortgage_tips_3_content')}
                  </p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <h4 className="font-semibold text-red-900 mb-1">{t('mortgage_tips_4_title')}</h4>
                  <p className="text-sm text-red-800">
                    {t('mortgage_tips_4_content')}
                  </p>
                </div>

                <div className="bg-gray-50 border-l-4 border-gray-500 p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">{t('mortgage_tips_5_title')}</h4>
                  <p className="text-sm text-gray-800">
                    {t('mortgage_tips_5_content')}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 7: FAQ */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('mortgage_faq_title')}</h3>
              <div className="space-y-4">
                <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
                  <summary className="font-semibold text-gray-900">{t('mortgage_faq_q1')}</summary>
                  <p className="mt-2 text-sm text-gray-600">
                    {t('mortgage_faq_a1')}
                  </p>
                </details>

                <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
                  <summary className="font-semibold text-gray-900">{t('mortgage_faq_q2')}</summary>
                  <p className="mt-2 text-sm text-gray-600">
                    {t('mortgage_faq_a2')}
                  </p>
                </details>

                <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
                  <summary className="font-semibold text-gray-900">{t('mortgage_faq_q3')}</summary>
                  <p className="mt-2 text-sm text-gray-600">
                    {t('mortgage_faq_a3')}
                  </p>
                </details>

                <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
                  <summary className="font-semibold text-gray-900">{t('mortgage_faq_q4')}</summary>
                  <p className="mt-2 text-sm text-gray-600">
                    {t('mortgage_faq_a4')}
                  </p>
                </details>

                <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
                  <summary className="font-semibold text-gray-900">{t('mortgage_faq_q5')}</summary>
                  <p className="mt-2 text-sm text-gray-600">
                    {t('mortgage_faq_a5')}
                  </p>
                </details>

                <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
                  <summary className="font-semibold text-gray-900">{t('mortgage_faq_q6')}</summary>
                  <p className="mt-2 text-sm text-gray-600">
                    {t('mortgage_faq_a6')}
                  </p>
                </details>

                <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
                  <summary className="font-semibold text-gray-900">{t('mortgage_faq_q7')}</summary>
                  <p className="mt-2 text-sm text-gray-600">
                    {t('mortgage_faq_a7')}
                  </p>
                </details>
              </div>
            </div>

            {/* Section 8: Alternatives */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('mortgage_alternatives_title')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('mortgage_alternatives_1_title')}</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {t('mortgage_alternatives_1_desc')}
                  </p>
                  <p className="text-xs text-green-600 font-medium">
                    {t('mortgage_alternatives_1_pros')}
                  </p>
                  <p className="text-xs text-red-600">
                    {t('mortgage_alternatives_1_cons')}
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('mortgage_alternatives_2_title')}</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {t('mortgage_alternatives_2_desc')}
                  </p>
                  <p className="text-xs text-green-600 font-medium">
                    {t('mortgage_alternatives_2_pros')}
                  </p>
                  <p className="text-xs text-red-600">
                    {t('mortgage_alternatives_2_cons')}
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('mortgage_alternatives_3_title')}</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {t('mortgage_alternatives_3_desc')}
                  </p>
                  <p className="text-xs text-green-600 font-medium">
                    {t('mortgage_alternatives_3_pros')}
                  </p>
                  <p className="text-xs text-red-600">
                    {t('mortgage_alternatives_3_cons')}
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('mortgage_alternatives_4_title')}</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {t('mortgage_alternatives_4_desc')}
                  </p>
                  <p className="text-xs text-green-600 font-medium">
                    {t('mortgage_alternatives_4_pros')}
                  </p>
                  <p className="text-xs text-red-600">
                    {t('mortgage_alternatives_4_cons')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <Info className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-2">{t('mortgage_important_notice_title')}</p>
                <p className="mb-2">
                  {t('mortgage_important_notice_1')}
                </p>
                <p>
                  {t('mortgage_important_notice_2')}
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
            .print\\:p-4 {
              padding: 1rem !important;
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

export default MortgageCalculatorPage;