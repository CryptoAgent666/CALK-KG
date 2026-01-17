import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Info, Home, Printer, DollarSign, TrendingUp, Car, Building2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import SchemaMarkup from '../components/SchemaMarkup';
import HreflangTags from '../components/HreflangTags';
import {
  generateCalculatorSchema,
  generateBreadcrumbSchema,
  generateSoftwareApplicationSchema
} from '../utils/schemaGenerator';

interface BankOffer {
  nameKey: string;
  rate: number;
  maxTerm: number;
}

interface LoanResults {
  loanAmount: number;
  monthlyPayment: number;
  overpayment: number;
  totalCost: number;
}

const AutoLoanCalculatorPage = () => {
  const { t, language, getLocalizedPath } = useLanguage();

  const termOptions = [
    { value: '12', label: t('term_12_months') },
    { value: '24', label: t('term_24_months') },
    { value: '36', label: t('term_36_months') },
    { value: '48', label: t('term_48_months') },
    { value: '60', label: t('term_60_months') }
  ];

  const [carPrice, setCarPrice] = useState<string>('');
  const [downPaymentAmount, setDownPaymentAmount] = useState<string>('');
  const [downPaymentPercent, setDownPaymentPercent] = useState<string>('');
  const [loanTermMonths, setLoanTermMonths] = useState<string>('36');
  const [interestRate, setInterestRate] = useState<string>('');
  
  const [results, setResults] = useState<LoanResults>({
    loanAmount: 0,
    monthlyPayment: 0,
    overpayment: 0,
    totalCost: 0
  });

  // Банки Кыргызстана с автокредитными ставками
  const bankOffers: BankOffer[] = [
    { nameKey: 'bank_ayil', rate: 17.0, maxTerm: 60 },
    { nameKey: 'bank_rsk', rate: 21.0, maxTerm: 48 },
    { nameKey: 'bank_dos_kredo', rate: 19.5, maxTerm: 60 },
    { nameKey: 'bank_fkur', rate: 18.0, maxTerm: 48 },
    { nameKey: 'bank_optima', rate: 17.5, maxTerm: 60 },
    { nameKey: 'bank_bta', rate: 20.0, maxTerm: 36 },
    { nameKey: 'bank_asia', rate: 18.5, maxTerm: 48 },
    { nameKey: 'bank_econom', rate: 22.0, maxTerm: 36 }
  ];

  // Расчет автокредита
  const calculateAutoLoan = (
    carValue: number, 
    downPayment: number, 
    termMonths: number, 
    annualRate: number
  ): LoanResults => {
    if (carValue <= 0 || downPayment >= carValue || termMonths <= 0 || annualRate < 0) {
      return { loanAmount: 0, monthlyPayment: 0, overpayment: 0, totalCost: carValue };
    }

    const loanAmount = carValue - downPayment;
    const monthlyRate = annualRate / 12 / 100;
    
    let monthlyPayment: number;
    if (monthlyRate === 0) {
      monthlyPayment = loanAmount / termMonths;
    } else {
      monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                      (Math.pow(1 + monthlyRate, termMonths) - 1);
    }
    
    const totalPayments = monthlyPayment * termMonths;
    const overpayment = totalPayments - loanAmount;
    const totalCost = carValue + overpayment;

    return {
      loanAmount,
      monthlyPayment,
      overpayment,
      totalCost
    };
  };

  // Обновление результатов при изменении входных данных
  useEffect(() => {
    const car = parseFloat(carPrice) || 0;
    const downPayment = parseFloat(downPaymentAmount) || 0;
    const term = parseInt(loanTermMonths) || 0;
    const rate = parseFloat(interestRate) || 0;

    if (car > 0 && downPayment >= 0 && downPayment < car && term > 0 && rate >= 0) {
      setResults(calculateAutoLoan(car, downPayment, term, rate));
    } else {
      setResults({ loanAmount: 0, monthlyPayment: 0, overpayment: 0, totalCost: car });
    }
  }, [carPrice, downPaymentAmount, loanTermMonths, interestRate]);

  // Генерация схем для страницы автокредитного калькулятора
  const generateSchemas = () => {
    const currentUrl = language === 'ky' ? "https://calk.kg/ky/calculator/auto-loan" : "https://calk.kg/calculator/auto-loan";
    const homeUrl = language === 'ky' ? "https://calk.kg/ky" : "https://calk.kg";

    const calculatorSchema = generateCalculatorSchema({
      url: currentUrl,
      title: t('auto_loan_calc_title'),
      description: t('auto_loan_calc_subtitle'),
      calculatorName: t('auto_loan_calc_title'),
      category: t('nav_auto'),
      inputProperties: ["carPrice", "downPayment", "loanTerm", "interestRate"],
      outputProperties: ["monthlyPayment", "totalCost", "overpayment"]
    });

    const softwareSchema = generateSoftwareApplicationSchema({
      url: currentUrl,
      title: t('auto_loan_calc_title'),
      description: t('auto_loan_calc_subtitle'),
      calculatorName: t('auto_loan_calc_title'),
      category: "AutomotiveApplication",
      inputProperties: [t('schema_car_price'), t('schema_down_payment'), t('schema_loan_term'), t('schema_interest_rate')],
      outputProperties: [t('schema_monthly_payment'), t('schema_total_cost'), t('schema_overpayment')]
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: homeUrl },
      { name: t('nav_auto'), url: `${homeUrl}?category=auto` },
      { name: t('auto_loan_calc_title'), url: currentUrl }
    ]);

    return [calculatorSchema, softwareSchema, breadcrumbSchema];
  };

  // Связка первоначального взноса (сумма <-> процент)
  const handleDownPaymentAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setDownPaymentAmount(value);
      const car = parseFloat(carPrice) || 0;
      const downPayment = parseFloat(value) || 0;
      if (car > 0 && downPayment >= 0) {
        const percent = (downPayment / car) * 100;
        setDownPaymentPercent(percent.toFixed(1));
      }
    }
  };

  const handleDownPaymentPercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setDownPaymentPercent(value);
      const car = parseFloat(carPrice) || 0;
      const percent = parseFloat(value) || 0;
      if (car > 0 && percent >= 0 && percent <= 100) {
        const amount = (car * percent) / 100;
        setDownPaymentAmount(amount.toString());
      }
    }
  };

  const handleCarPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setCarPrice(value);
      // Пересчитать первоначальный взнос если задан процент
      const percent = parseFloat(downPaymentPercent) || 0;
      const car = parseFloat(value) || 0;
      if (car > 0 && percent > 0) {
        const amount = (car * percent) / 100;
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

  // Расчет процентов для диаграммы
  const carVal = parseFloat(carPrice) || 0;
  const downPayment = parseFloat(downPaymentAmount) || 0;
  const downPaymentPercentage = carVal > 0 ? (downPayment / results.totalCost) * 100 : 0;
  const loanPercentage = results.totalCost > 0 ? (results.loanAmount / results.totalCost) * 100 : 0;
  const overpaymentPercentage = results.totalCost > 0 ? (results.overpayment / results.totalCost) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org микроразметка */}
      <Helmet>
        <title>{t('auto_loan_calc_title')} - Calk.KG</title>
        <meta name="description" content={t('auto_loan_calc_description')} />
        <meta name="keywords" content={t('auto_loan_calc_keywords')} />
        <meta property="og:title" content={`${t('auto_loan_calc_title')} - Calk.KG`} />
        <meta property="og:description" content={t('auto_loan_calc_subtitle')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/auto-loan" : "https://calk.kg/calculator/auto-loan"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/auto-loan.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('auto_loan_calc_title')} - Calk.KG`} />
        <meta name="twitter:description" content={t('auto_loan_calc_subtitle')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/auto-loan.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/auto-loan" : "https://calk.kg/calculator/auto-loan"} />
      </Helmet>
      <HreflangTags path="/calculator/auto-loan" />
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
              <h1 className="text-3xl md:text-4xl font-bold print:text-2xl">{t('auto_loan_calc_title')}</h1>
              <p className="text-red-100 text-lg print:text-gray-600">{t('auto_loan_calc_subtitle')}</p>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('auto_loan_params')}</h2>

              {/* Car Price */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('car_price')}
                  </label>
                  <Tooltip text={t('car_price_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={carPrice}
                  onChange={handleCarPriceChange}
                  placeholder={t('car_price_placeholder')}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg print:text-base"
                />
              </div>

              {/* Down Payment */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('down_payment')}
                  </label>
                  <Tooltip text={t('down_payment_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">{t('down_payment_amount')}</label>
                    <input
                      type="text"
                      value={downPaymentAmount}
                      onChange={handleDownPaymentAmountChange}
                      placeholder={t('down_payment_amount_placeholder')}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">{t('down_payment_percent')}</label>
                    <input
                      type="text"
                      value={downPaymentPercent}
                      onChange={handleDownPaymentPercentChange}
                      placeholder={t('down_payment_percent_placeholder')}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Loan Term */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('auto_loan_term')}
                  </label>
                  <Tooltip text={t('auto_loan_term_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <select
                  value={loanTermMonths}
                  onChange={(e) => setLoanTermMonths(e.target.value)}
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
                    {t('auto_annual_rate')}
                  </label>
                  <Tooltip text={t('auto_annual_rate_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={interestRate}
                  onChange={handleRateChange}
                  placeholder={t('auto_annual_rate_placeholder')}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg print:text-base"
                />
              </div>

              {/* Info Block */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-2">{t('auto_loan_features')}</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>{t('auto_loan_feature_1')}</li>
                      <li>{t('auto_loan_feature_2')}</li>
                      <li>{t('auto_loan_feature_3')}</li>
                      <li>{t('auto_loan_feature_4')}</li>
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
                <h2 className="text-xl font-semibold text-gray-900">{t('auto_calculation_results')}</h2>
                {results.monthlyPayment > 0 && (
                  <button
                    onClick={handlePrint}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors print:hidden"
                  >
                    <Printer className="h-4 w-4" />
                    <span>{t('print')}</span>
                  </button>
                )}
              </div>
              
              {results.monthlyPayment > 0 ? (
                <div className="space-y-6">
                  {/* Monthly Payment - главный результат */}
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-8 text-white text-center">
                    <div className="flex items-center justify-center mb-2">
                      <DollarSign className="h-6 w-6 mr-2" />
                      <span className="text-green-100">{t('auto_monthly_payment')}</span>
                    </div>
                    <p className="text-5xl font-bold mb-2">
                      {formatCurrency(results.monthlyPayment)} KGS
                    </p>
                  </div>

                  {/* Car Cost Structure Visualization */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      {t('car_cost_structure')}
                    </h3>
                    <div className="space-y-4">
                      {/* Down Payment Bar */}
                      {downPayment > 0 && (
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">{t('down_payment_label')}</span>
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
                      )}

                      {/* Loan Amount Bar */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">{t('auto_loan_amount_label')}</span>
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

                      {/* Overpayment Bar */}
                      {results.overpayment > 0 && (
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">{t('auto_overpayment_label')}</span>
                            <span className="text-sm font-medium text-red-600">
                              {overpaymentPercentage.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${overpaymentPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Detailed Results */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-gray-700 font-medium">{t('auto_loan_amount_label')}:</span>
                          <Tooltip text={t('auto_loan_amount_tooltip_short')}>
                            <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-blue-600 font-semibold">
                          {formatCurrency(results.loanAmount)} KGS
                        </span>
                      </div>
                    </div>

                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-gray-700 font-medium">{t('auto_overpayment_label')}:</span>
                          <Tooltip text={t('auto_overpayment_tooltip_short')}>
                            <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-red-600 font-semibold">
                          {formatCurrency(results.overpayment)} KGS
                        </span>
                      </div>
                    </div>

                    <div className="bg-amber-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-gray-700 font-medium">{t('total_car_cost')}</span>
                          <Tooltip text={t('total_car_cost_tooltip')}>
                            <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-amber-600 font-semibold">
                          {formatCurrency(results.totalCost)} KGS
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">{t('auto_loan_term_label')}</span>
                        <span className="text-gray-900 font-semibold">
                          {loanTermMonths} {t('months_short')} ({Math.round(parseInt(loanTermMonths) / 12 * 10) / 10} {t('years_unit')})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <Car className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">{t('enter_auto_loan_params')}</p>
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
                to={getLocalizedPath('/calculator/customs')}
                className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-red-50 p-2 rounded-lg group-hover:bg-red-100 transition-colors">
                    <Car className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('related_customs_calc')}</div>
                    <div className="text-sm text-gray-500">{t('related_customs_desc')}</div>
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
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('related_loan_calc')}</div>
                    <div className="text-sm text-gray-500">{t('related_loan_desc')}</div>
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
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('related_mortgage_calc')}</div>
                    <div className="text-sm text-gray-500">{t('related_mortgage_desc')}</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Bank Comparison Section */}
          {results.monthlyPayment > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
              <div className="flex items-center mb-6">
                <Car className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {t('auto_compare_bank_offers')}
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('auto_bank_offer_column')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('rate_column')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('auto_max_term_column')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('monthly_payment_column')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('overpayment_column')}
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
                        {Math.round(parseInt(loanTermMonths) / 12 * 10) / 10} {t('years_unit')}
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
                      const termMonths = Math.min(parseInt(loanTermMonths), bank.maxTerm);
                      const bankResults = calculateAutoLoan(
                        parseFloat(carPrice) || 0,
                        parseFloat(downPaymentAmount) || 0,
                        termMonths,
                        bank.rate
                      );
                      
                      const userRate = parseFloat(interestRate) || 0;
                      const isBetter = bank.rate < userRate;
                      const isWorse = bank.rate > userRate;
                      
                      return (
                        <tr key={index} className={isBetter ? 'bg-blue-50' : isWorse ? 'bg-red-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {t(bank.nameKey)} <span className="text-xs text-gray-500">{t('indicative')}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {bank.rate}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {t('up_to')} {Math.round(bank.maxTerm / 12)} {t('years_unit')}
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
                    <span>{t('auto_better_offer_legend')}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-50 border border-red-200 rounded mr-2"></div>
                    <span>{t('auto_worse_offer_legend')}</span>
                  </div>
                </div>
                <p className="mt-3">
                  <strong>{t('auto_preliminary_calculation')}</strong> {t('auto_bank_rates_disclaimer')}
                </p>
              </div>
            </div>
          )}

          {/* Quick Examples */}
          <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
            <h3 className="font-medium text-gray-900 mb-4">{t('auto_popular_scenarios')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { car: 1500000, downPayment: 300000, term: 36, rate: 18 },
                { car: 2500000, downPayment: 500000, term: 48, rate: 17.5 },
                { car: 4000000, downPayment: 1000000, term: 60, rate: 19 }
              ].map((example, index) => {
                const exampleResult = calculateAutoLoan(example.car, example.downPayment, example.term, example.rate);
                const downPaymentPercent = (example.downPayment / example.car) * 100;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setCarPrice(example.car.toString());
                      setDownPaymentAmount(example.downPayment.toString());
                      setDownPaymentPercent(downPaymentPercent.toFixed(1));
                      setLoanTermMonths(example.term.toString());
                      setInterestRate(example.rate.toString());
                    }}
                    className="text-left p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">
                        {formatCurrency(example.car)} KGS
                      </span>
                      <span className="text-xs text-gray-500">
                        {example.term} мес. • {example.rate}%
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-semibold">
                        {formatCurrency(exampleResult.monthlyPayment)} KGS/мес
                      </div>
                      <div className="text-xs text-gray-500">
                        взнос: {formatCurrency(example.downPayment)} KGS ({downPaymentPercent.toFixed(0)}%)
                      </div>
                      <div className="text-xs text-gray-500">
                        переплата: {formatCurrency(exampleResult.overpayment)} KGS
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Educational Content - Russian and Kyrgyz */}
          {(language === 'ru' || language === 'ky') && (
            <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('auto_loan_guide_title')}</h2>

              {/* Section 1: What is Auto Loan */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('auto_loan_what_is')}</h3>
                <p className="text-gray-700 mb-4">
                  {t('auto_loan_description')}
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <p className="text-gray-700">
                    <strong>{t('auto_loan_features_title')}</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2 text-gray-700">
                    <li>{t('auto_loan_feature_1')}</li>
                    <li>{t('auto_loan_feature_2')}</li>
                    <li>{t('auto_loan_feature_3')}</li>
                    <li>{t('auto_loan_feature_4')}</li>
                  </ul>
                </div>
              </div>

              {/* Section 2: How to Choose */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('auto_loan_how_choose')}</h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-5">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      {t('auto_loan_compare_rates_title')}
                    </h4>
                    <p className="text-gray-700">
                      {t('auto_loan_compare_rates_desc')}
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-5">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      {t('auto_loan_calculate_load_title')}
                    </h4>
                    <p className="text-gray-700">
                      {t('auto_loan_calculate_load_desc')}
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-5">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      {t('auto_loan_choose_term_title')}
                    </h4>
                    <p className="text-gray-700">
                      {t('auto_loan_choose_term_desc')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3: Important Factors */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('auto_loan_important_factors')}</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">•</span>
                      <div>
                        <strong>{t('auto_loan_hidden_fees_title')}</strong>{' '}
                        {t('auto_loan_hidden_fees_desc')}
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">•</span>
                      <div>
                        <strong>{t('auto_loan_early_repayment_title')}</strong>{' '}
                        {t('auto_loan_early_repayment_desc')}
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">•</span>
                      <div>
                        <strong>{t('auto_loan_insurance_title')}</strong>{' '}
                        {t('auto_loan_insurance_desc')}
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">•</span>
                      <div>
                        <strong>{t('auto_loan_vehicle_condition_title')}</strong>{' '}
                        {t('auto_loan_vehicle_condition_desc')}
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 4: How to Save */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('auto_loan_saving_tips')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {t('auto_loan_increase_down_payment_title')}
                    </h4>
                    <p className="text-sm text-gray-700">
                      {t('auto_loan_increase_down_payment_desc')}
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {t('auto_loan_early_repayment_tip_title')}
                    </h4>
                    <p className="text-sm text-gray-700">
                      {t('auto_loan_repay_early_tip')}
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {t('auto_loan_compare_offers_title')}
                    </h4>
                    <p className="text-sm text-gray-700">
                      {t('auto_loan_compare_offers_desc')}
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {t('auto_loan_improve_credit_title')}
                    </h4>
                    <p className="text-sm text-gray-700">
                      {t('auto_loan_improve_credit_desc_alt')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 5: FAQ */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('auto_loan_faq')}</h3>
                <div className="space-y-4">
                  <details className="border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                      {t('auto_loan_faq_q1')}
                    </summary>
                    <p className="mt-3 text-gray-700">
                      {t('auto_loan_faq_a1')}
                    </p>
                  </details>

                  <details className="border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                      {t('auto_loan_faq_q2')}
                    </summary>
                    <p className="mt-3 text-gray-700">
                      {t('auto_loan_faq_a2')}
                    </p>
                  </details>

                  <details className="border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                      {t('auto_loan_faq_q3')}
                    </summary>
                    <p className="mt-3 text-gray-700">
                      {t('auto_loan_faq_a3')}
                    </p>
                  </details>

                  <details className="border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                      {t('auto_loan_faq_q4')}
                    </summary>
                    <p className="mt-3 text-gray-700">
                      {t('auto_loan_faq_a4')}
                    </p>
                  </details>

                  <details className="border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                      {t('auto_loan_faq_q5')}
                    </summary>
                    <p className="mt-3 text-gray-700">
                      {t('auto_loan_faq_a5')}
                    </p>
                  </details>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <p className="text-sm text-gray-600">
                  <strong>{t('auto_loan_disclaimer_title')}</strong>{' '}
                  {t('auto_loan_disclaimer_text')}
                </p>
              </div>
            </div>
          )}
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

export default AutoLoanCalculatorPage;