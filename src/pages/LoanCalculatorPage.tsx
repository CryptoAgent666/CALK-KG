import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Info, Home, Printer, DollarSign, TrendingUp, Building2, Car } from 'lucide-react';
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
  rate: number;
  isUserOffer?: boolean;
}

interface LoanResults {
  monthlyPayment: number;
  totalAmount: number;
  overpayment: number;
  effectiveRate: number;
}

const LoanCalculatorPage = () => {
  const { t, language, getLocalizedPath} = useLanguage();

  React.useEffect(() => {
    document.title = t('loan_calc_title') + " - Calk.KG";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('loan_calc_description'));
    }
  }, [t]);

  const [loanAmount, setLoanAmount] = useState<string>('');
  const [loanTerm, setLoanTerm] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  
  const [results, setResults] = useState<LoanResults>({
    monthlyPayment: 0,
    totalAmount: 0,
    overpayment: 0,
    effectiveRate: 0
  });

  // Банки Кыргызстана с индикативными ставками
  const bankOffers: BankOffer[] = [
    { nameKey: 'bank_ayil', rate: 17.5 },
    { nameKey: 'bank_dos_kredo', rate: 22.0 },
    { nameKey: 'bank_fkur', rate: 19.5 },
    { nameKey: 'bank_cbk', rate: 20.0 },
    { nameKey: 'bank_optima', rate: 18.5 },
    { nameKey: 'bank_bta', rate: 21.0 },
    { nameKey: 'bank_asia', rate: 19.0 },
    { nameKey: 'bank_econom', rate: 23.0 }
  ];

  // Расчет аннуитетного платежа
  const calculateLoan = (amount: number, termMonths: number, annualRate: number): LoanResults => {
    if (amount <= 0 || termMonths <= 0 || annualRate < 0) {
      return { monthlyPayment: 0, totalAmount: 0, overpayment: 0, effectiveRate: 0 };
    }

    const monthlyRate = annualRate / 12 / 100;
    
    let monthlyPayment: number;
    if (monthlyRate === 0) {
      // Если ставка 0%, то просто делим сумму на количество месяцев
      monthlyPayment = amount / termMonths;
    } else {
      // Формула аннуитетного платежа
      monthlyPayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                      (Math.pow(1 + monthlyRate, termMonths) - 1);
    }
    
    const totalAmount = monthlyPayment * termMonths;
    const overpayment = totalAmount - amount;
    const effectiveRate = (overpayment / amount) * 100;

    return {
      monthlyPayment,
      totalAmount,
      overpayment,
      effectiveRate
    };
  };

  // Обновление результатов при изменении входных данных
  useEffect(() => {
    const amount = parseFloat(loanAmount) || 0;
    const term = parseInt(loanTerm) || 0;
    const rate = parseFloat(interestRate) || 0;

    if (amount > 0 && term > 0 && rate >= 0) {
      setResults(calculateLoan(amount, term, rate));
    } else {
      setResults({ monthlyPayment: 0, totalAmount: 0, overpayment: 0, effectiveRate: 0 });
    }
  }, [loanAmount, loanTerm, interestRate]);

  // Генерация схем для страницы кредитного калькулятора
  const generateSchemas = () => {
    const currentUrl = language === 'ky' ? "https://calk.kg/ky/calculator/loan" : "https://calk.kg/calculator/loan";
    const homeUrl = language === 'ky' ? "https://calk.kg/ky" : "https://calk.kg";
    
    const calculatorSchema = generateCalculatorSchema({
      url: currentUrl,
      title: t('loan_calc_title'),
      description: t('loan_calc_subtitle'),
      calculatorName: t('loan_calc_title'),
      category: t('nav_finance'),
      language,
      inputProperties: ["loanAmount", "loanTerm", "interestRate"],
      outputProperties: ["monthlyPayment", "totalAmount", "overpayment"]
    });

    const softwareSchema = generateSoftwareApplicationSchema({
      url: currentUrl,
      title: t('loan_calc_title'),
      description: t('loan_calc_subtitle'),
      calculatorName: t('loan_calc_title'),
      category: "FinanceApplication",
      inputProperties: [t('loan_amount'), t('loan_term'), t('loan_rate')],
      outputProperties: [t('loan_monthly_payment'), t('loan_total_cost'), t('loan_overpayment')]
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: homeUrl },
      { name: t('nav_finance'), url: `${homeUrl}?category=finance` },
      { name: t('loan_calc_title'), url: currentUrl }
    ]);

    return [calculatorSchema, softwareSchema, breadcrumbSchema];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-KG', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setLoanAmount(value);
    }
  };

  const handleTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setLoanTerm(value);
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
  const loanAmountNum = parseFloat(loanAmount) || 0;
  const principalPercentage = loanAmountNum > 0 && results.totalAmount > 0 ? 
    (loanAmountNum / results.totalAmount) * 100 : 0;
  const interestPercentage = 100 - principalPercentage;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org микроразметка */}
      <Helmet>
        <title>{t('loan_calc_title')} - Calk.KG</title>
        <meta name="description" content={t('loan_calc_subtitle')} />
        <meta name="keywords" content={t('loan_calc_keywords')} />
        <meta property="og:title" content={`${t('loan_calc_title')} - Calk.KG`} />
        <meta property="og:description" content={t('loan_calc_subtitle')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/loan" : "https://calk.kg/calculator/loan"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/loan.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('loan_calc_title')} - Calk.KG`} />
        <meta name="twitter:description" content={t('loan_calc_subtitle')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/loan.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/loan" : "https://calk.kg/calculator/loan"} />
      </Helmet>
      <HreflangTags path="/calculator/loan" />
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
              <DollarSign className="h-8 w-8 print:text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold print:text-2xl">{t('loan_calc_title')}</h1>
              <p className="text-red-100 text-lg print:text-gray-600">{t('loan_calc_subtitle')}</p>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('calc_parameters')}</h2>
              
              {/* Loan Amount */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('loan_amount')}
                  </label>
                  <Tooltip text={t('loan_amount_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={loanAmount}
                  onChange={handleAmountChange}
                  placeholder={t('placeholder_enter_loan_amount')}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg print:text-base"
                />
              </div>

              {/* Loan Term */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('loan_term')}
                  </label>
                  <Tooltip text={t('loan_term_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={loanTerm}
                  onChange={handleTermChange}
                  placeholder={t('placeholder_enter_term_months')}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg print:text-base"
                />
              </div>

              {/* Interest Rate */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('loan_rate')}
                  </label>
                  <Tooltip text={t('loan_rate_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={interestRate}
                  onChange={handleRateChange}
                  placeholder={t('placeholder_enter_rate')}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg print:text-base"
                />
              </div>

              {/* Info Block */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-2">{t('loan_how_to_use')}</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>{t('loan_step_1')}</li>
                      <li>{t('loan_step_2')}</li>
                      <li>{t('loan_step_3')}</li>
                      <li>{t('loan_step_4')}</li>
                    </ol>
                    <p className="mt-3">
                      💡 <strong>{t('useful_know')}</strong> {t('loan_tip_specialized')} <Link to={getLocalizedPath("/calculator/auto-loan")} className="text-blue-600 hover:text-blue-800 underline">{t('auto_loan_link_title').toLowerCase()}</Link> {t('loan_for_car')} <Link to={getLocalizedPath("/calculator/mortgage")} className="text-blue-600 hover:text-blue-800 underline">{t('mortgage_link_title').toLowerCase()}</Link> {t('loan_for_property')}
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
                <h2 className="text-xl font-semibold text-gray-900">{t('calc_results')}</h2>
                {results.monthlyPayment > 0 && (
                  <ActionButtons
                    calculatorName={t('schema_loan_calc')}
                    resultText={`Потребительский кредит - Результаты расчета:
Сумма кредита: ${formatCurrency(parseFloat(loanAmount) || 0)} KGS
Срок кредита: ${loanTerm} месяцев
Процентная ставка: ${interestRate}%
Ежемесячный платеж: ${formatCurrency(results.monthlyPayment)} KGS
Переплата: ${formatCurrency(results.overpayment)} KGS
Общая сумма выплат: ${formatCurrency(results.totalAmount)} KGS

Расчет выполнен на сайте Calk.KG`}
                  />
                )}
              </div>
              
              {results.monthlyPayment > 0 ? (
                <div className="space-y-6">
                  {/* Monthly Payment */}
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white text-center">
                    <div className="flex items-center justify-center mb-2">
                      <DollarSign className="h-6 w-6 mr-2" />
                      <span className="text-green-100">{t('loan_monthly_payment')}</span>
                    </div>
                    <p className="text-4xl font-bold mb-2">
                      {formatCurrency(results.monthlyPayment)} KGS
                    </p>
                  </div>

                  {/* Loan Structure Visualization */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      {t('loan_structure')}
                    </h3>
                    <div className="space-y-4">
                      {/* Principal Amount Bar */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">{t('loan_principal_debt')}</span>
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
                          <span className="text-sm text-gray-600">{t('loan_interest')}</span>
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
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-gray-700 font-medium">{t('loan_principal')}</span>
                          <Tooltip text={t('tooltip_loan_principal')}>
                            <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-blue-600 font-semibold">
                          {formatCurrency(parseFloat(loanAmount) || 0)} KGS
                        </span>
                      </div>
                    </div>

                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-gray-700 font-medium">{t('loan_overpayment')}</span>
                          <Tooltip text={t('tooltip_loan_interest')}>
                            <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-red-600 font-semibold">
                          {formatCurrency(results.overpayment)} KGS
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-gray-700 font-medium">{t('loan_total_cost')}</span>
                          <Tooltip text={t('tooltip_loan_total')}>
                            <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-gray-900 font-semibold">
                          {formatCurrency(results.totalAmount)} KGS
                        </span>
                      </div>
                    </div>

                    <div className="bg-amber-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-gray-700 font-medium">{t('effective_rate')}</span>
                          <Tooltip text={t('effective_rate_tooltip')}>
                            <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-amber-600 font-semibold">
                          {results.effectiveRate.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <DollarSign className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">{t('enter_params')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="mt-12 space-y-12">
          {/* Other Calculators */}
          <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
            <h3 className="font-medium text-gray-900 mb-4">{t('calc_other_calculators')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to={getLocalizedPath("/calculator/mortgage")}
                className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                    <Home className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('mortgage_link_title')}</div>
                    <div className="text-sm text-gray-500">{t('mortgage_link_desc')}</div>
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

          {/* Bank Comparison Section */}
          {results.monthlyPayment > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
              <div className="flex items-center mb-6">
                <Building2 className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {t('compare_offer')}
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('bank_name')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('rate_column')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('monthly_payment_column')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('overpayment_column')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('total_payment_column')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* User's Offer */}
                    <tr className="bg-green-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {t('your_offer')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {interestRate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {formatCurrency(results.monthlyPayment)} KGS
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {formatCurrency(results.overpayment)} KGS
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {formatCurrency(results.totalAmount)} KGS
                      </td>
                    </tr>
                    
                    {/* Bank Offers */}
                    {bankOffers.map((bank, index) => {
                      const bankResults = calculateLoan(
                        parseFloat(loanAmount) || 0,
                        parseInt(loanTerm) || 0,
                        bank.rate
                      );
                      
                      const userRate = parseFloat(interestRate) || 0;
                      const isBetter = bank.rate < userRate;
                      const isWorse = bank.rate > userRate;
                      
                      return (
                        <tr key={index} className={isBetter ? 'bg-blue-50' : isWorse ? 'bg-red-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {t(bank.nameKey)} <span className="text-xs text-gray-500">({t('indicative')})</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {bank.rate}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(bankResults.monthlyPayment)} KGS
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(bankResults.overpayment)} KGS
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(bankResults.totalAmount)} KGS
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
                  <strong>{t('important')}</strong> {t('loan_bank_rates_notice')}
                </p>
              </div>
            </div>
          )}

          {/* Quick Examples */}
          <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
            <h3 className="font-medium text-gray-900 mb-4">{t('popular_requests')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { amount: 500000, term: 24, rate: 20 },
                { amount: 1000000, term: 36, rate: 18 },
                { amount: 2000000, term: 60, rate: 22 }
              ].map((example, index) => {
                const exampleResult = calculateLoan(example.amount, example.term, example.rate);
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setLoanAmount(example.amount.toString());
                      setLoanTerm(example.term.toString());
                      setInterestRate(example.rate.toString());
                    }}
                    className="text-left p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">
                        {formatCurrency(example.amount)} KGS
                      </span>
                      <span className="text-xs text-gray-500">
                        {example.term} {t('per_month_short')} • {example.rate}%
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-semibold">
                        {formatCurrency(exampleResult.monthlyPayment)} KGS/{t('per_month')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {t('overpayment_text')} {formatCurrency(exampleResult.overpayment)} KGS
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Educational Content - About Consumer Loans */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('loan_guide_title')}</h2>

            <div className="prose max-w-none">
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">{t('loan_what_is')}</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {t('loan_what_is_text')}
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">{t('loan_types_title')}</h3>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-3">•</span>
                    <span>{t('loan_type_1')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-3">•</span>
                    <span>{t('loan_type_2')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-3">•</span>
                    <span>{t('loan_type_3')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-3">•</span>
                    <span>{t('loan_type_4')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-3">•</span>
                    <span>{t('loan_type_5')}</span>
                  </li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">{t('loan_how_to_choose')}</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {t('loan_how_to_choose_text')}
              </p>
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <ul className="space-y-2 text-gray-700">
                  <li>{t('loan_interest_rate')}</li>
                  <li>{t('loan_commission_issue')}</li>
                  <li>{t('loan_commission_service')}</li>
                  <li>{t('loan_penalty_late')}</li>
                  <li>{t('loan_commission_early')}</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">{t('loan_requirements_title')}</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {t('loan_requirements_text')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('loan_general_requirements')}</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>{t('loan_citizenship')}</li>
                    <li>{t('loan_age')}</li>
                    <li>{t('loan_registration')}</li>
                    <li>{t('loan_credit_history')}</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('loan_documents_title')}</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>{t('loan_passport')}</li>
                    <li>{t('loan_inn')}</li>
                    <li>{t('loan_income')}</li>
                    <li>{t('loan_work_book')}</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">{t('loan_tips_title')}</h3>
              <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">{t('loan_expert_tips')}</h4>
                <ol className="space-y-2 text-gray-700 list-decimal list-inside">
                  <li>{t('loan_tip_1')}</li>
                  <li>{t('loan_tip_2')}</li>
                  <li>{t('loan_tip_3')}</li>
                  <li>{t('loan_tip_4')}</li>
                  <li>{t('loan_tip_5')}</li>
                  <li>{t('loan_tip_6')}</li>
                  <li>{t('loan_tip_7')}</li>
                  <li>{t('loan_tip_8')}</li>
                </ol>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">{t('loan_faq_title')}</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('loan_faq_q1')}</h4>
                  <p className="text-gray-700">
                    {t('loan_faq_a1')}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('loan_faq_q2')}</h4>
                  <p className="text-gray-700">
                    {t('loan_faq_a2')}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('loan_faq_q3')}</h4>
                  <p className="text-gray-700">
                    {t('loan_faq_a3')}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('loan_faq_q4')}</h4>
                  <p className="text-gray-700">
                    {t('loan_faq_a4')}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('loan_faq_q5')}</h4>
                  <p className="text-gray-700">
                    {t('loan_faq_a5')}
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">{t('loan_alternatives_title')}</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {t('loan_alternatives_text')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('loan_alt_credit_card')}</h4>
                  <p className="text-sm text-gray-700">
                    {t('loan_alt_credit_card_desc')}
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('loan_alt_microcredit')}</h4>
                  <p className="text-sm text-gray-700">
                    {t('loan_alt_microcredit_desc')}
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('loan_alt_savings')}</h4>
                  <p className="text-sm text-gray-700">
                    {t('loan_alt_savings_desc')}
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('loan_alt_help')}</h4>
                  <p className="text-sm text-gray-700">
                    {t('loan_alt_help_desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <Info className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-2">{t('loan_important_notice')}</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>{t('loan_notice_1')}</li>
                  <li>{t('loan_notice_2')}</li>
                  <li>{t('loan_notice_3')}</li>
                  <li>{t('loan_notice_4')}</li>
                </ul>
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

export default LoanCalculatorPage;