import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Info, Home, Printer, Shield, Users, CreditCard, TrendingUp, Receipt, ExternalLink, Lightbulb } from 'lucide-react';
import ActionButtons from '../components/ActionButtons';
import SchemaMarkup from '../components/SchemaMarkup';
import HreflangTags from '../components/HreflangTags';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  generateCalculatorSchema, 
  generateBreadcrumbSchema,
  generateSoftwareApplicationSchema 
} from '../utils/schemaGenerator';

const SocialFundCalculatorPage = () => {
  const { language, t, getLocalizedPath} = useLanguage();

  React.useEffect(() => {
    document.title = t('social_fund_calc_title') + " - Calk.KG";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('social_fund_calc_description'));
    }
  }, [t]);

  // Генерация схем для страницы калькулятора соцфонда
  const generateSchemas = () => {
    const currentUrl = language === 'ky' ? "https://calk.kg/ky/calculator/social-fund" : "https://calk.kg/calculator/social-fund";
    const homeUrl = language === 'ky' ? "https://calk.kg/ky" : "https://calk.kg";
    
    const calculatorSchema = generateCalculatorSchema({
      url: currentUrl,
      title: t('social_fund_calc_title'),
      description: t('social_fund_calc_subtitle'),
      calculatorName: t('social_fund_calc_title'),
      category: t('nav_finance'),
      language,
      inputProperties: ["grossSalary"],
      outputProperties: ["employeeDeductions", "employerContributions", "netSalary"]
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: homeUrl },
      { name: t('nav_finance'), url: `${homeUrl}?category=finance` },
      { name: t('social_fund_calc_title'), url: currentUrl }
    ]);

    return [calculatorSchema, breadcrumbSchema];
  };

  const [grossSalary, setGrossSalary] = useState<string>('');
  const [results, setResults] = useState({
    grossAmount: 0,
    // Удержания с работника
    employeePF: 0,
    employeeGNPF: 0,
    totalEmployeeDeductions: 0,
    // Взносы работодателя
    employerPF: 0,
    employerFOMS: 0,
    employerFOT: 0,
    totalEmployerContributions: 0,
    // Итоговая сводка
    salaryAfterDeductions: 0,
    totalEmployeeCost: 0
  });

  const calculateSocialFund = (gross: number) => {
    // Удержания с работника (10%)
    const employeePF = gross * 0.08;      // 8% - Пенсионный фонд
    const employeeGNPF = gross * 0.02;    // 2% - ГНПФ
    const totalEmployeeDeductions = gross * 0.10;
    
    // Взносы работодателя (17.25%)
    const employerPF = gross * 0.15;      // 15% - Пенсионный фонд
    const employerFOMS = gross * 0.02;    // 2% - ФОМС
    const employerFOT = gross * 0.0025;   // 0.25% - ФОТ
    const totalEmployerContributions = gross * 0.1725;
    
    // Итоговая сводка
    const salaryAfterDeductions = gross - totalEmployeeDeductions;
    const totalEmployeeCost = gross + totalEmployerContributions;
    
    return {
      grossAmount: gross,
      employeePF,
      employeeGNPF,
      totalEmployeeDeductions,
      employerPF,
      employerFOMS,
      employerFOT,
      totalEmployerContributions,
      salaryAfterDeductions,
      totalEmployeeCost
    };
  };

  useEffect(() => {
    const gross = parseFloat(grossSalary) || 0;
    if (gross >= 0) {
      setResults(calculateSocialFund(gross));
    }
  }, [grossSalary]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-KG', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleGrossSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
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
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 max-w-xs">
        {text}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );

  // Процентные расчеты для визуализации
  const employeePercentage = results.grossAmount > 0 ? (results.totalEmployeeDeductions / results.totalEmployeeCost) * 100 : 0;
  const employerPercentage = results.grossAmount > 0 ? (results.totalEmployerContributions / results.totalEmployeeCost) * 100 : 0;
  const netPercentage = results.grossAmount > 0 ? (results.salaryAfterDeductions / results.totalEmployeeCost) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org микроразметка */}
      <Helmet>
        <title>{t('social_fund_calc_title')} - Calk.KG</title>
        <meta name="description" content={t('social_fund_calc_subtitle')} />
        <meta name="keywords" content={t('social_fund_keywords')} />
        <meta property="og:title" content={`${t('social_fund_calc_title')} - Calk.KG`} />
        <meta property="og:description" content={t('social_fund_calc_subtitle')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/social-fund" : "https://calk.kg/calculator/social-fund"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/social-fund.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('social_fund_calc_title')} - Calk.KG`} />
        <meta name="twitter:description" content={t('social_fund_calc_subtitle')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/social-fund.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/social-fund" : "https://calk.kg/calculator/social-fund"} />
      </Helmet>
      {/* Schema.org микроразметка */}
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
              <Shield className="h-8 w-8 print:text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold print:text-2xl">{t('social_fund_calc_title')}</h1>
              <p className="text-red-100 text-lg print:text-gray-600">{t('social_fund_calc_subtitle')}</p>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('social_fund_input_data')}</h2>

              {/* Gross Salary Input */}
              <div className="mb-8">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('social_fund_gross_salary')}
                  </label>
                  <Tooltip text={t('tooltip_social_gross')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={grossSalary}
                  onChange={handleGrossSalaryChange}
                  placeholder={t('social_fund_enter_salary')}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg print:text-base"
                />
              </div>

              {/* Info Block */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-2">{t('social_fund_structure_title')}</p>
                    <div className="space-y-2">
                      <div>
                        <p className="font-medium">{t('social_fund_employee_deductions')}</p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>{t('social_fund_pension_8')}</li>
                          <li>{t('social_fund_gnpf_2')}</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium mt-3">{t('social_fund_employer_contributions')}</p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>{t('social_fund_pension_15')}</li>
                          <li>{t('social_fund_foms_2')}</li>
                          <li>{t('social_fund_fot_025')}</li>
                        </ul>
                      </div>
                    </div>
                    <p className="mt-3">
                      💡 <strong>{t('social_fund_related_calcs')}</strong> {t('social_fund_related_text')}
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
                <h2 className="text-xl font-semibold text-gray-900">{t('social_fund_results')}</h2>
                {results.grossAmount > 0 && (
                  <button
                    onClick={handlePrint}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors print:hidden"
                  >
                    <Printer className="h-4 w-4" />
                    <span>{t('print')}</span>
                  </button>
                )}
              </div>
              
              {results.grossAmount > 0 ? (
                <div className="space-y-8">
                  {/* Visualization */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                      {t('social_fund_expense_structure')}
                      <Tooltip text={t('tooltip_social_chart')}>
                        <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                      </Tooltip>
                    </h3>
                    <div className="space-y-4">
                      {/* Net Salary Bar */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">{t('social_fund_after_deductions')}</span>
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

                      {/* Employee Deductions Bar */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">{t('social_fund_employee_title')}</span>
                          <span className="text-sm font-medium text-orange-600">
                            {employeePercentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${employeePercentage}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Employer Contributions Bar */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">{t('social_fund_employer_title')}</span>
                          <span className="text-sm font-medium text-red-600">
                            {employerPercentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${employerPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gross Amount */}
                  <div className="flex justify-between items-center py-4 border-b border-gray-100">
                    <div className="flex items-center">
                      <span className="text-gray-600 text-lg">{t('social_fund_gross_amount')}</span>
                      <Tooltip text={t('tooltip_social_salary_gross')}>
                        <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                      </Tooltip>
                    </div>
                    <span className="text-xl font-semibold text-gray-900">
                      {formatCurrency(results.grossAmount)} KGS
                    </span>
                  </div>

                  {/* Employee Deductions Block */}
                  <div className="bg-orange-50 rounded-xl p-6">
                    <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                      <Users className="h-5 w-5 text-orange-600 mr-2" />
                      {t('social_fund_employee_block')}
                      <Tooltip text={t('tooltip_social_deductions')}>
                        <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                      </Tooltip>
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-gray-700">{t('social_fund_pension_fund')}</span>
                          <Tooltip text={t('tooltip_social_pension')}>
                            <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-orange-600 font-semibold">
                          -{formatCurrency(results.employeePF)} KGS
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-gray-700">{t('social_fund_gnpf')}</span>
                          <Tooltip text={t('tooltip_social_gnpf')}>
                            <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-orange-600 font-semibold">
                          -{formatCurrency(results.employeeGNPF)} KGS
                        </span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-900 font-medium">{t('social_fund_total_deducted')}</span>
                          <span className="text-orange-600 font-bold text-lg">
                            -{formatCurrency(results.totalEmployeeDeductions)} KGS
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Employer Contributions Block */}
                  <div className="bg-red-50 rounded-xl p-6">
                    <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                      <Shield className="h-5 w-5 text-red-600 mr-2" />
                      {t('social_fund_employer_block')}
                      <Tooltip text={t('tooltip_social_employer')}>
                        <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                      </Tooltip>
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-gray-700">{t('social_fund_employer_pension')}</span>
                          <Tooltip text={t('tooltip_social_employer_pension')}>
                            <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-red-600 font-semibold">
                          +{formatCurrency(results.employerPF)} KGS
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-gray-700">{t('social_fund_foms')}</span>
                          <Tooltip text={t('tooltip_social_foms')}>
                            <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-red-600 font-semibold">
                          +{formatCurrency(results.employerFOMS)} KGS
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-gray-700">{t('social_fund_fot')}</span>
                          <Tooltip text={t('tooltip_social_fot')}>
                            <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-red-600 font-semibold">
                          +{formatCurrency(results.employerFOT)} KGS
                        </span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-900 font-medium">{t('social_fund_total_charged')}</span>
                          <span className="text-red-600 font-bold text-lg">
                            +{formatCurrency(results.totalEmployerContributions)} KGS
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Block */}
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <h3 className="font-medium mb-4 flex items-center">
                      <Calculator className="h-5 w-5 mr-2" />
                      {t('social_fund_summary')}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-green-100">{t('social_fund_salary_after')}</span>
                          <Tooltip text={t('tooltip_social_after_deductions')}>
                            <Info className="h-4 w-4 text-green-200 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-white font-bold text-lg">
                          {formatCurrency(results.salaryAfterDeductions)} KGS
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-green-100">{t('social_fund_total_cost')}</span>
                          <Tooltip text={t('tooltip_social_total_cost')}>
                            <Info className="h-4 w-4 text-green-200 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-white font-bold text-lg">
                          {formatCurrency(results.totalEmployeeCost)} KGS
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-700 mb-3">{t('social_fund_additional_info')}</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>{t('social_fund_employer_burden')}</span>
                        <span>{((results.totalEmployerContributions / results.grossAmount) * 100).toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('social_fund_employee_rate')}</span>
                        <span>10%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('social_fund_employer_rate')}</span>
                        <span>17.25%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('social_fund_total_burden')}</span>
                        <span>27.25%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <Shield className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">{t('social_fund_enter_for_calc')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="mt-12 space-y-12">
          {/* Quick Examples */}
          <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
            <h3 className="font-medium text-gray-900 mb-4">{t('social_fund_examples')}</h3>
            <div className="space-y-3">
              {[50000, 75000, 100000, 150000].map(amount => {
                const example = calculateSocialFund(amount);
                return (
                  <button
                    key={amount}
                    onClick={() => setGrossSalary(amount.toString())}
                    className="w-full text-left p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">
                        {formatCurrency(amount)} KGS
                      </span>
                      <div className="text-right">
                        <div className="text-green-600 font-semibold">
                          {formatCurrency(example.salaryAfterDeductions)} KGS
                        </div>
                        <div className="text-xs text-gray-500">
                          {t('social_fund_after_label')}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>{t('social_fund_deducted')} -{formatCurrency(example.totalEmployeeDeductions)}</span>
                      <span>{t('social_fund_employer_label')}: +{formatCurrency(example.totalEmployerContributions)}</span>
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
                to={getLocalizedPath("/calculator/salary")}
                className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('related_salary_calc')}</div>
                    <div className="text-sm text-gray-500">{t('net_salary')}</div>
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
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('related_pension_calc')}</div>
                    <div className="text-sm text-gray-500">{t('related_pension_desc')}</div>
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
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('related_single_tax')}</div>
                    <div className="text-sm text-gray-500">{t('related_single_tax_ip_desc')}</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
            <h3 className="font-medium text-gray-900 mb-6 flex items-center">
              <Lightbulb className="h-5 w-5 text-yellow-600 mr-2" />
              {t('social_fund_tips_title')}
            </h3>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {num}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {t(`social_fund_tip_${num}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Useful Links */}
          <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
            <h3 className="font-medium text-gray-900 mb-6 flex items-center">
              <ExternalLink className="h-5 w-5 text-red-600 mr-2" />
              {t('social_fund_useful_links')}
            </h3>
            <div className="space-y-4">
              <a
                href="https://socfond.kg"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-lg border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                      {t('social_fund_link_sotsf')}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {t('social_fund_link_sotsf_desc')}
                    </p>
                  </div>
                  <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors flex-shrink-0 ml-2" />
                </div>
              </a>

              <a
                href="https://lk.socfond.kg"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-lg border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                      {t('social_fund_link_cabinet')}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {t('social_fund_link_cabinet_desc')}
                    </p>
                  </div>
                  <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors flex-shrink-0 ml-2" />
                </div>
              </a>

              <a
                href="https://gnpf.kg"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-lg border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                      {t('social_fund_link_gnpf')}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {t('social_fund_link_gnpf_desc')}
                    </p>
                  </div>
                  <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors flex-shrink-0 ml-2" />
                </div>
              </a>
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

export default SocialFundCalculatorPage;