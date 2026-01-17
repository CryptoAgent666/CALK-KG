import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Info, Home, Printer, Shield, TrendingUp, Receipt, Car } from 'lucide-react';
import ActionButtons from '../components/ActionButtons';
import SchemaMarkup from '../components/SchemaMarkup';
import HreflangTags from '../components/HreflangTags';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  generateCalculatorSchema, 
  generateBreadcrumbSchema, 
  generateSoftwareApplicationSchema 
} from '../utils/schemaGenerator';

const SalaryCalculatorPage = () => {
  const { language, t, getLocalizedPath} = useLanguage();

  React.useEffect(() => {
    document.title = t('salary_calc_title') + " - Calk.KG";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('salary_calc_description'));
    }
  }, [t]);

  const [grossSalary, setGrossSalary] = useState<string>('');
  const [taxRate, setTaxRate] = useState<number>(10); // 10% standard, 5% for PVT
  const [results, setResults] = useState({
    grossAmount: 0,
    socialFund: 0,
    taxableBase: 0,
    incomeTax: 0,
    netSalary: 0
  });

  const calculateSalary = (gross: number, rate: number) => {
    // Step 1: Social Fund contribution (10%)
    const socialFund = gross * 0.10;
    
    // Step 2: Taxable base
    const taxableBase = gross - socialFund;
    
    // Step 3: Income tax (10% or 5% for PVT)
    const incomeTax = taxableBase * (rate / 100);
    
    // Step 4: Net salary
    const netSalary = gross - socialFund - incomeTax;
    
    return {
      grossAmount: gross,
      socialFund,
      taxableBase,
      incomeTax,
      netSalary
    };
  };

  useEffect(() => {
    const gross = parseFloat(grossSalary) || 0;
    if (gross > 0) {
      setResults(calculateSalary(gross, taxRate));
    } else {
      setResults({
        grossAmount: 0,
        socialFund: 0,
        taxableBase: 0,
        incomeTax: 0,
        netSalary: 0
      });
    }
  }, [grossSalary, taxRate]);

  // Генерация схем для страницы калькулятора зарплаты
  const generateSchemas = () => {
    const currentUrl = language === 'ky' ? "https://calk.kg/ky/calculator/salary" : "https://calk.kg/calculator/salary";
    const homeUrl = language === 'ky' ? "https://calk.kg/ky" : "https://calk.kg";
    
    const calculatorSchema = generateCalculatorSchema({
      url: currentUrl,
      title: t('salary_calc_title'),
      description: t('salary_calc_subtitle'),
      calculatorName: t('salary_calc_title'),
      category: t('nav_finance'),
      language,
      inputProperties: ["grossSalary", "taxRate"],
      outputProperties: ["netSalary", "socialFund", "incomeTax"]
    });

    const softwareSchema = generateSoftwareApplicationSchema({
      url: currentUrl,
      title: t('salary_calc_title'),
      description: t('salary_calc_subtitle'),
      calculatorName: t('salary_calc_title'),
      category: "FinanceApplication",
      inputProperties: [t('salary_input_gross'), t('salary_tax_rate')],
      outputProperties: [t('salary_net_amount'), t('salary_social_fund'), t('salary_income_tax')]
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: homeUrl },
      { name: t('nav_finance'), url: `${homeUrl}?category=finance` },
      { name: t('salary_calc_title'), url: currentUrl }
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

  const handleGrossSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal points
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setGrossSalary(value);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Tooltip component
  const Tooltip = ({ children, text }: { children: React.ReactNode; text: string }) => (
    <div className="group relative inline-flex items-center">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
        {text}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );

  // Calculate percentages for visualization
  const totalDeductions = results.socialFund + results.incomeTax;
  const netPercentage = results.grossAmount > 0 ? (results.netSalary / results.grossAmount) * 100 : 0;
  const socialFundPercentage = results.grossAmount > 0 ? (results.socialFund / results.grossAmount) * 100 : 0;
  const taxPercentage = results.grossAmount > 0 ? (results.incomeTax / results.grossAmount) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org микроразметка */}
      <Helmet>
        <title>{t('salary_calc_title')} - Calk.KG</title>
        <meta name="description" content={t('salary_calc_subtitle')} />
        <meta name="keywords" content={t('salary_calc_keywords')} />
        <meta property="og:title" content={`${t('salary_calc_title')} - Calk.KG`} />
        <meta property="og:description" content={t('salary_calc_subtitle')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/salary" : "https://calk.kg/calculator/salary"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/salary.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('salary_calc_title')} - Calk.KG`} />
        <meta name="twitter:description" content={t('salary_calc_subtitle')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/salary.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/salary" : "https://calk.kg/calculator/salary"} />
      </Helmet>
      <HreflangTags path="/calculator/salary" />
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
              <Calculator className="h-8 w-8 print:text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold print:text-2xl">{t('salary_calc_title')}</h1>
              <p className="text-red-100 text-lg print:text-gray-600">{t('salary_calc_subtitle')}</p>
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
              
              {/* Gross Salary Input */}
              <div className="mb-8">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('salary_input_gross')}
                  </label>
                  <Tooltip text={t('salary_input_gross_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={grossSalary}
                  onChange={handleGrossSalaryChange}
                  placeholder={t('placeholder_enter_salary')}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg print:text-base"
                />
              </div>

              {/* Tax Rate Selection */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('salary_tax_rate')}
                  </label>
                  <Tooltip text={t('tooltip_salary_tax_rate')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="taxRate"
                      value="10"
                      checked={taxRate === 10}
                      onChange={() => setTaxRate(10)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500"
                    />
                    <div>
                      <span className="text-gray-900 font-medium">{t('salary_tax_standard')}</span>
                      <p className="text-sm text-gray-500">{t('salary_tax_standard_desc')}</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="taxRate"
                      value="5"
                      checked={taxRate === 5}
                      onChange={() => setTaxRate(5)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500"
                    />
                    <div>
                      <span className="text-gray-900 font-medium">{t('salary_tax_pvt')}</span>
                      <p className="text-sm text-gray-500">{t('salary_tax_pvt_desc')}</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Info Block */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-2">{t('calculation_order')}</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>{t('salary_calc_step1')} (<Link to={getLocalizedPath("/calculator/social-fund")} className="text-blue-600 hover:text-blue-800 underline">{t('salary_calc_step1_link')}</Link>)</li>
                      <li>{t('salary_calc_step2')}</li>
                      <li>{t('salary_calc_step3')}</li>
                      <li>{t('salary_calc_step4')}</li>
                    </ol>
                    <p className="mt-3">
                      💡 <strong>{t('useful_know')}</strong> {t('salary_calc_tip')}
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
                <h2 className="text-xl font-semibold text-gray-900">{t('salary_results_title')}</h2>
                {results.grossAmount > 0 && (
                  <ActionButtons
                    calculatorName={t('salary_calc_name')}
                    resultText={`${t('salary_calc_name')} - ${t('result_text_intro')}
${t('salary_gross_amount')} ${formatCurrency(results.grossAmount)} KGS
${t('salary_social_fund')} ${formatCurrency(results.socialFund)} KGS
${t('salary_income_tax')} ${formatCurrency(results.incomeTax)} KGS
${t('salary_net_amount')} ${formatCurrency(results.netSalary)} KGS

${t('calculated_on_site')} Calk.KG`}
                  />
                )}
              </div>
              
              {results.grossAmount > 0 ? (
                <div className="space-y-8">
                  {/* Salary Visualization */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                      {t('salary_distribution_title')}
                      <Tooltip text={t('tooltip_salary_chart')}>
                        <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                      </Tooltip>
                    </h3>
                    <div className="space-y-4">
                      {/* Net Salary Bar */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">{t('salary_net_pay')}</span>
                          <span className="text-sm font-medium text-green-600">
                            {netPercentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${netPercentage}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Social Fund Bar */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">{t('salary_social_fund_deductions')}</span>
                          <span className="text-sm font-medium text-orange-600">
                            {socialFundPercentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${socialFundPercentage}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Income Tax Bar */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">{t('salary_income_tax_label')}</span>
                          <span className="text-sm font-medium text-red-600">
                            {taxPercentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${taxPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gross Amount */}
                  <div className="flex justify-between items-center py-4 border-b border-gray-100">
                    <div className="flex items-center">
                      <span className="text-gray-600 text-lg">{t('salary_gross_amount')}</span>
                      <Tooltip text={t('tooltip_salary_gross')}>
                        <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                      </Tooltip>
                    </div>
                    <span className="text-xl font-semibold text-gray-900">
                      {formatCurrency(results.grossAmount)} KGS
                    </span>
                  </div>

                  {/* Deductions */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700 text-lg">{t('salary_deductions')}</h3>
                    
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <span className="text-gray-700">{t('salary_social_fund')}</span>
                          <Tooltip text={t('tooltip_salary_social')}>
                            <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-red-600 font-semibold text-lg">
                          -{formatCurrency(results.socialFund)} KGS
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{t('salary_mandatory_pension')}</p>
                    </div>
                    
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <span className="text-gray-700">{t('salary_income_tax')} ({taxRate}%):</span>
                          <Tooltip text={t('tooltip_salary_income_tax')}>
                            <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-red-600 font-semibold text-lg">
                          -{formatCurrency(results.incomeTax)} KGS
                        </span>
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm text-gray-500">
                          {t('salary_taxable_base')}: {formatCurrency(results.taxableBase)} KGS
                        </p>
                        <Tooltip text={t('tooltip_salary_taxable')}>
                          <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                        </Tooltip>
                      </div>
                    </div>
                  </div>

                  {/* Net Salary */}
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <p className="text-green-100">{t('salary_net_amount')}</p>
                        <Tooltip text={t('tooltip_salary_net')}>
                          <Info className="h-4 w-4 text-green-200 ml-2 cursor-help" />
                        </Tooltip>
                      </div>
                      <p className="text-4xl font-bold">
                        {formatCurrency(results.netSalary)} KGS
                      </p>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-700 mb-3">{t('salary_additional_info')}</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>{t('salary_total_deductions')}</span>
                        <span>{formatCurrency(results.socialFund + results.incomeTax)} KGS</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('salary_tax_burden')}</span>
                        <span>
                          {results.grossAmount > 0 ? 
                            (((results.socialFund + results.incomeTax) / results.grossAmount) * 100).toFixed(1) 
                            : 0}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('salary_net_percentage')}</span>
                        <span>
                          {results.grossAmount > 0 ? 
                            ((results.netSalary / results.grossAmount) * 100).toFixed(1) 
                            : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <Calculator className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">{t('salary_enter_amount')}</p>
                </div>
              )}
            </div>

            {/* Additional Sections */}
            <div className="space-y-12">
              {/* Other Calculators */}
              <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
                <h3 className="font-medium text-gray-900 mb-4">{t('other_calculators')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Link
                    to={getLocalizedPath("/calculator/social-fund")}
                    className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                        <Shield className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 group-hover:text-red-600">{t('social_fund_link_title')}</div>
                        <div className="text-sm text-gray-500">{t('social_fund_link_desc')}</div>
                      </div>
                    </div>
                  </Link>
                  <Link
                    to={getLocalizedPath("/calculator/pension")}
                    className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 group-hover:text-red-600">{t('pension_link_title')}</div>
                        <div className="text-sm text-gray-500">{t('pension_link_desc')}</div>
                      </div>
                    </div>
                  </Link>
                  <Link
                    to={getLocalizedPath("/calculator/single-tax")}
                    className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                        <Receipt className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 group-hover:text-red-600">{t('single_tax_link_title')}</div>
                        <div className="text-sm text-gray-500">{t('single_tax_link_desc')}</div>
                      </div>
                    </div>
                  </Link>
                  <Link
                    to={getLocalizedPath("/calculator/taxi-tax")}
                    className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <Car className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 group-hover:text-red-600">{t('taxi_tax_link_title')}</div>
                        <div className="text-sm text-gray-500">{t('taxi_tax_link_desc')}</div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Quick Examples */}
              <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
                <h3 className="font-medium text-gray-900 mb-4">{t('calculation_examples')}</h3>
                <div className="space-y-3">
                  {[30000, 50000, 100000, 150000].map(amount => {
                    const example = calculateSalary(amount, taxRate);
                    return (
                      <button
                        key={amount}
                        onClick={() => setGrossSalary(amount.toString())}
                        className="w-full text-left p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">
                            {formatCurrency(amount)} KGS
                          </span>
                          <div className="text-right">
                            <div className="text-green-600 font-semibold">
                              {formatCurrency(example.netSalary)} KGS
                            </div>
                            <div className="text-xs text-gray-500">
                              -{formatCurrency(example.socialFund + example.incomeTax)} {t('deductions_text')}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
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
          .print\\:py-2 {
            padding-top: 0.5rem !important;
            padding-bottom: 0.5rem !important;
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

      {/* Educational Content Section - Russian and Kyrgyz */}
      {(language === 'ru' || language === 'ky') && (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="space-y-12">
          {/* Main Educational Content */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('salary_guide_title')}</h2>

            <div className="prose max-w-none">
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">{t('salary_how_formed')}</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {t('salary_how_formed_text')}
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">{t('salary_mandatory_deductions')}</h3>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="space-y-4">
                  <div className="border-l-4 border-red-600 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-1">{t('salary_income_tax_title')}</h4>
                    <p className="text-sm text-gray-700">
                      {t('salary_income_tax_desc')}
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-600 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-1">{t('salary_social_contribution_title')}</h4>
                    <p className="text-sm text-gray-700">
                      {t('salary_social_contribution_desc')}
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">{t('salary_mnd_title')}</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {t('salary_mnd_text')}
              </p>
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">{t('salary_calculation_example')}</h4>
                <div className="space-y-2 text-gray-700">
                  <p>{t('salary_calc_example_1')}</p>
                  <p>{t('salary_calc_example_2')}</p>
                  <p>{t('salary_calc_example_3')}</p>
                  <p>{t('salary_calc_example_4')}</p>
                  <p className="font-semibold">{t('salary_calc_example_5')}</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">{t('salary_min_wage_title')}</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {t('salary_min_wage_text')}
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">{t('salary_employer_contribs_title')}</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {t('salary_employer_contribs_text')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('salary_social_fund_contrib')}</h4>
                  <p className="text-sm text-gray-700">
                    {t('salary_social_fund_desc')}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('salary_medical_insurance')}</h4>
                  <p className="text-sm text-gray-700">
                    {t('salary_medical_insurance_desc')}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                <strong>{t('salary_employer_note')}</strong>
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">{t('salary_tax_benefits_title')}</h3>
              <div className="bg-yellow-50 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">{t('salary_who_gets_benefits')}</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-3">•</span>
                    <span>{t('salary_benefit_veterans')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-3">•</span>
                    <span>{t('salary_benefit_disabled')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-3">•</span>
                    <span>{t('salary_benefit_parents')}</span>
                  </li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">{t('salary_faq_title')}</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('salary_faq_q1')}</h4>
                  <p className="text-gray-700">
                    {t('salary_faq_a1')}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('salary_faq_q2')}</h4>
                  <p className="text-gray-700">
                    {t('salary_faq_a2')}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('salary_faq_q3')}</h4>
                  <p className="text-gray-700">
                    {t('salary_faq_a3')}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('salary_faq_q4')}</h4>
                  <p className="text-gray-700">
                    {t('salary_faq_a4')}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-5">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('salary_faq_q5')}</h4>
                  <p className="text-gray-700">
                    {t('salary_faq_a5')}
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">{t('salary_worker_rights_title')}</h3>
              <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">{t('salary_worker_rights_intro')}</h4>
                <ul className="space-y-2 text-gray-700 list-decimal list-inside">
                  <li>{t('salary_right_1')}</li>
                  <li>{t('salary_right_2')}</li>
                  <li>{t('salary_right_3')}</li>
                  <li>{t('salary_right_4')}</li>
                  <li>{t('salary_right_5')}</li>
                  <li>{t('salary_right_6')}</li>
                  <li>{t('salary_right_7')}</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">{t('salary_useful_links_title')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('salary_link_social_fund')}</h4>
                  <p className="text-sm text-gray-700 mb-2">{t('salary_link_social_fund_desc')}</p>
                  <a href="https://sf.gov.kg" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700 text-sm">
                    sf.gov.kg →
                  </a>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('salary_link_tax_service')}</h4>
                  <p className="text-sm text-gray-700 mb-2">{t('salary_link_tax_service_desc')}</p>
                  <a href="https://sts.gov.kg" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700 text-sm">
                    sts.gov.kg →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <Info className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-2">{t('salary_important_notice')}</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>{t('salary_notice_1')}</li>
                  <li>{t('salary_notice_2')}</li>
                  <li>{t('salary_notice_3')}</li>
                  <li>{t('salary_notice_4')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default SalaryCalculatorPage;