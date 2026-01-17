import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Info, Home, Printer, Car, Smartphone, DollarSign, Clock, Receipt, Building2, CreditCard } from 'lucide-react';
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

const TaxiTaxCalculatorPage = () => {
  const { language, t, getLocalizedPath} = useLanguage();

  // Генерация схем для страницы калькулятора налога для таксистов
  const generateSchemas = () => {
    const currentUrl = language === 'ky' ? "https://calk.kg/ky/calculator/taxi-tax" : "https://calk.kg/calculator/taxi-tax";
    const homeUrl = language === 'ky' ? "https://calk.kg/ky" : "https://calk.kg";
    
    const calculatorSchema = generateCalculatorSchema({
      url: currentUrl,
      title: t('taxi_calc_title'),
      description: t('taxi_calc_subtitle'),
      calculatorName: t('taxi_calc_title'),
      category: t('nav_finance'),
      language,
      inputProperties: ["income"],
      outputProperties: ["taxAmount"]
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: homeUrl },
      { name: t('nav_finance'), url: `${homeUrl}?category=finance` },
      { name: t('taxi_calc_title'), url: currentUrl }
    ]);

    return [calculatorSchema, breadcrumbSchema];
  };
  React.useEffect(() => {
    document.title = t('taxi_calc_title') + " - Calk.KG";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('taxi_tax_calc_description'));
    }
  }, [t]);

  const [income, setIncome] = useState<string>('');
  const [taxAmount, setTaxAmount] = useState<number>(0);

  // Расчет налога в реальном времени
  useEffect(() => {
    const incomeValue = parseFloat(income) || 0;
    setTaxAmount(incomeValue * 0.01); // 1% налог
  }, [income]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-KG', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Разрешаем только цифры и точку
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setIncome(value);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org микроразметка */}
      <Helmet>
        <title>{t('taxi_calc_title')} - Calk.KG</title>
        <meta name="description" content={t('taxi_calc_subtitle')} />
        <meta name="keywords" content={t('taxi_keywords')} />
        <meta property="og:title" content={`${t('taxi_calc_title')} - Calk.KG`} />
        <meta property="og:description" content={t('taxi_calc_subtitle')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/taxi-tax" : "https://calk.kg/calculator/taxi-tax"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/taxi-tax.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('taxi_tax_calc_title')} - Calk.KG`} />
        <meta name="twitter:description" content={t('taxi_tax_calc_subtitle')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/taxi-tax.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/taxi-tax" : "https://calk.kg/calculator/taxi-tax"} />
      </Helmet>
      <HreflangTags path="/calculator/taxi-tax" />
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
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white print:bg-white print:text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 print:py-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="bg-white/20 p-4 rounded-xl print:bg-blue-100">
                <Car className="h-10 w-10 print:text-blue-600" />
              </div>
              <div className="bg-white/20 p-4 rounded-xl print:bg-blue-100">
                <Smartphone className="h-10 w-10 print:text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 print:text-2xl">
              {t('taxi_calc_title')}
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed print:text-gray-600">
              {t('taxi_calc_subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Calculator */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 print:py-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 print:shadow-none print:border">
          
          {/* Calculator Title */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <DollarSign className="h-8 w-8 text-blue-600 mr-2" />
              <h2 className="text-3xl font-bold text-gray-900">{t('taxi_calc_header')}</h2>
            </div>
            <p className="text-gray-600">
              {t('taxi_calc_description')}
            </p>
          </div>

          {/* Action Buttons */}
          {taxAmount > 0 && (
            <div className="flex justify-center mb-8">
              <ActionButtons
                calculatorName={t('taxi_calc_name_full')}
                resultText={`${t('taxi_results_title')}
${t('taxi_income_amount')} ${formatCurrency(parseFloat(income) || 0)} ${t('taxi_som')}
${t('taxi_tax_to_withhold')} ${formatCurrency(taxAmount)} ${t('taxi_som')}

${t('taxi_calculated_on')}`}
              />
            </div>
          )}

          {/* Income Input */}
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <label className="block text-lg font-semibold text-gray-700">
                {t('taxi_income_input')}
              </label>
              <Tooltip text={t('taxi_income_tooltip')}>
                <Info className="h-5 w-5 text-gray-400 ml-2 cursor-help" />
              </Tooltip>
            </div>
            <input
              type="text"
              value={income}
              onChange={handleIncomeChange}
              placeholder={t('taxi_income_placeholder')}
              className="w-full px-6 py-6 text-2xl font-medium border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/25 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Result */}
          <div className="mb-12">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white text-center">
              <div className="flex items-center justify-center mb-4">
                <Calculator className="h-8 w-8 mr-3" />
                <span className="text-xl text-blue-100">{t('taxi_tax_amount')}</span>
              </div>
              <p className="text-6xl font-bold mb-4">
                {formatCurrency(taxAmount)} {t('taxi_som')}
              </p>
              <p className="text-blue-100 text-lg">
                {t('taxi_percent_from_income')} {income && `(${formatCurrency(parseFloat(income) || 0)} ${t('taxi_som')})`}
              </p>
            </div>
          </div>

          {/* Quick Calculation Examples */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">{t('taxi_quick_examples')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1000, 5000, 10000, 20000, 50000, 100000, 150000, 200000].map(amount => (
                <button
                  key={amount}
                  onClick={() => setIncome(amount.toString())}
                  className="p-4 bg-gray-50 hover:bg-blue-50 rounded-xl transition-colors border border-gray-200 hover:border-blue-300"
                >
                  <div className="text-center">
                    <p className="mb-3">
                      💼 <strong>{t('taxi_alternatives')}</strong> {t('taxi_compare_with')} <Link to={getLocalizedPath("/calculator/patent")} className="text-blue-600 hover:text-blue-800 underline">{t('taxi_patent_system')}</Link> {t('taxi_or')} <Link to={getLocalizedPath("/calculator/single-tax")} className="text-blue-600 hover:text-blue-800 underline">{t('taxi_single_tax_ip')}</Link> {t('taxi_choose_optimal')}
                    </p>
                    <div className="font-semibold text-gray-900 text-sm">
                      {formatCurrency(amount)} {t('taxi_som')}
                    </div>
                    <div className="text-blue-600 font-bold text-sm">
                      {t('taxi_tax_label')} {formatCurrency(amount * 0.01)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Print Button */}
          {taxAmount > 0 && (
            <div className="text-center mb-8 print:hidden">
              <button
                onClick={handlePrint}
                className="inline-flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors"
              >
                <Printer className="h-5 w-5" />
                <span>{t('taxi_print_calc')}</span>
              </button>
            </div>
          )}

          {/* Formula Explanation */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-3">{t('taxi_how_calc_works')}</p>
                <div className="bg-white rounded-lg p-4 mb-3">
                  <div className="text-lg font-mono text-center text-gray-900">
                    {t('taxi_formula')}
                  </div>
                </div>
                <p>
                  <strong>{t('taxi_examples')}</strong><br/>
                  • {t('taxi_income_example_1')}<br/>
                  • {t('taxi_income_example_2')}<br/>
                  • {t('taxi_income_example_3')}
                </p>
              </div>
            </div>
          </div>

          {/* Information Block */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <Smartphone className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-2">{t('taxi_new_regime_title')}</p>
                <p className="mb-3">
                  {t('taxi_new_regime_desc')} <strong>1%</strong>.
                  {t('taxi_new_regime_desc_2')}
                </p>
                <div className="space-y-1 text-xs">
                  <p><strong>{t('taxi_who_pays')}</strong> {t('taxi_who_pays_desc')}</p>
                  <p><strong>{t('taxi_tax_rate')}</strong> {t('taxi_tax_rate_desc')}</p>
                  <p><strong>{t('taxi_withholding')}</strong> {t('taxi_withholding_desc')}</p>
                  <p><strong>{t('taxi_period')}</strong> {t('taxi_period_desc')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Who is Covered */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <Car className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div className="text-sm text-green-800">
                <p className="font-semibold mb-2">{t('taxi_who_covered')}</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>{t('taxi_covered_1')}</li>
                  <li>{t('taxi_covered_2')}</li>
                  <li>{t('taxi_covered_3')}</li>
                  <li>{t('taxi_covered_4')}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How it Works */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <Clock className="h-6 w-6 text-gray-600 flex-shrink-0 mt-1" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-2">{t('taxi_how_withholding')}</p>
                <div className="space-y-2">
                  <p>{t('taxi_withholding_step_1')}</p>
                  <p>{t('taxi_withholding_step_2')}</p>
                  <p>{t('taxi_withholding_step_3')}</p>
                  <p>{t('taxi_withholding_step_4')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison with other regimes */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-gray-900 mb-4">{t('taxi_comparison_title')}</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-medium text-gray-700">{t('taxi_comparison_regime')}</th>
                    <th className="text-left py-2 font-medium text-gray-700">{t('taxi_comparison_rate')}</th>
                    <th className="text-left py-2 font-medium text-gray-700">{t('taxi_comparison_features')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-blue-50">
                    <td className="py-3 font-medium text-blue-800">{t('taxi_regime_aggregator')}</td>
                    <td className="py-3 text-blue-600">{t('taxi_regime_aggregator_rate')}</td>
                    <td className="py-3 text-gray-600">{t('taxi_regime_aggregator_feature')}</td>
                  </tr>
                  <tr>
                    <td className="py-3">{t('taxi_regime_patent')}</td>
                    <td className="py-3">{t('taxi_regime_patent_rate')}</td>
                    <td className="py-3 text-gray-600">{t('taxi_regime_patent_feature')}</td>
                  </tr>
                  <tr>
                    <td className="py-3">{t('taxi_regime_regular')}</td>
                    <td className="py-3">{t('taxi_regime_regular_rate')}</td>
                    <td className="py-3 text-gray-600">{t('taxi_regime_regular_feature')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {t('taxi_patent_cost_note')}
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mt-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 print:hidden">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('taxi_new_regime_benefits')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('taxi_why_aggregators_better')}
          </p>
        </div>

        {/* Other Calculators */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-8 print:hidden">
          <h3 className="font-medium text-gray-900 mb-4">{t('other_calculators')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to={getLocalizedPath("/calculator/single-tax")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-blue-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                  <Receipt className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">{t('taxi_single_tax_calc')}</div>
                  <div className="text-sm text-gray-500">{t('taxi_single_tax_desc')}</div>
                </div>
              </div>
            </Link>
            <Link
              to={getLocalizedPath("/calculator/patent")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-blue-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                  <Building2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">{t('taxi_patent_calc')}</div>
                  <div className="text-sm text-gray-500">{t('taxi_patent_desc')}</div>
                </div>
              </div>
            </Link>
            <Link
              to={getLocalizedPath("/calculator/salary")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-blue-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">{t('taxi_salary_calc')}</div>
                  <div className="text-sm text-gray-500">{t('taxi_salary_desc')}</div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Other Calculators */}
        <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
          <h3 className="font-medium text-gray-900 mb-4">{t('other_calculators')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to={getLocalizedPath("/calculator/single-tax")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-blue-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                  <Receipt className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">{t('taxi_single_tax_calc')}</div>
                  <div className="text-sm text-gray-500">{t('taxi_single_tax_desc')}</div>
                </div>
              </div>
            </Link>
            <Link
              to={getLocalizedPath("/calculator/patent")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-blue-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                  <Building2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">{t('taxi_patent_calc')}</div>
                  <div className="text-sm text-gray-500">{t('taxi_patent_desc')}</div>
                </div>
              </div>
            </Link>
            <Link
              to={getLocalizedPath("/calculator/salary")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-blue-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">{t('taxi_salary_calc')}</div>
                  <div className="text-sm text-gray-500">{t('taxi_salary_desc')}</div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center bg-white rounded-xl p-8 shadow-sm">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('taxi_low_rate')}</h3>
            <p className="text-gray-600">
              {t('taxi_low_rate_desc')}
            </p>
          </div>

          <div className="text-center bg-white rounded-xl p-8 shadow-sm">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('taxi_automation')}</h3>
            <p className="text-gray-600">
              {t('taxi_automation_desc')}
            </p>
          </div>

          <div className="text-center bg-white rounded-xl p-8 shadow-sm">
            <div className="bg-amber-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <Calculator className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('taxi_simplicity')}</h3>
            <p className="text-gray-600">
              {t('taxi_simplicity_desc')}
            </p>
          </div>
        </div>
      </div>

      {/* How to Register */}
      <div className="mt-12 bg-white py-16 print:hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('taxi_register_title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('taxi_register_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">{t('taxi_documents_title')}</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                  <span className="text-gray-700">{t('taxi_doc_1')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                  <span className="text-gray-700">{t('taxi_doc_2')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">3</span>
                  <span className="text-gray-700">{t('taxi_doc_3')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">4</span>
                  <span className="text-gray-700">{t('taxi_doc_4')}</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">{t('taxi_where_title')}</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold">📍</span>
                  <span className="text-gray-700">{t('taxi_where_1')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold">🌐</span>
                  <span className="text-gray-700">{t('taxi_where_2')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold">📞</span>
                  <span className="text-gray-700">{t('taxi_where_3')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold">💬</span>
                  <span className="text-gray-700">{t('taxi_where_4')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Notice */}
      <div className="mt-12 bg-yellow-50 border-t border-yellow-200 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start space-x-3">
            <Info className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-2">{t('taxi_legal_notice_title')}</p>
              <p className="mb-2">
                {t('taxi_legal_notice_1')} {currentMonth}. {t('taxi_legal_notice_2')}
              </p>
              <p>
                {t('taxi_legal_notice_3')} <strong>{t('taxi_legal_notice_gns')}</strong> {t('taxi_legal_notice_4')}
              </p>
            </div>
          </div>

          {/* Educational Guide Section */}
          <div className="mt-12 bg-gradient-to-br from-white to-green-50 rounded-xl shadow-lg p-8 border border-green-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('taxi_guide_title')}</h2>
            
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-8">{t('taxi_guide_intro')}</p>

              <div className="space-y-8">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-green-700 mb-4">{t('taxi_guide_how_title')}</h3>
                  <p className="text-gray-700">{t('taxi_guide_how_text')}</p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-green-700 mb-4">{t('taxi_guide_platforms_title')}</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start"><span className="text-green-600 font-bold mr-2">✓</span>{t('taxi_platform_1')}</li>
                    <li className="flex items-start"><span className="text-green-600 font-bold mr-2">✓</span>{t('taxi_platform_2')}</li>
                    <li className="flex items-start"><span className="text-green-600 font-bold mr-2">✓</span>{t('taxi_platform_3')}</li>
                    <li className="flex items-start"><span className="text-green-600 font-bold mr-2">✓</span>{t('taxi_platform_4')}</li>
                    <li className="flex items-start"><span className="text-green-600 font-bold mr-2">✓</span>{t('taxi_platform_5')}</li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-6 shadow-sm border border-green-200">
                  <h3 className="text-2xl font-bold text-green-700 mb-4">💰 {t('taxi_guide_benefits_title')}</h3>
                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded"><span className="text-green-600 font-bold mr-2">→</span>{t('taxi_benefit_1')}</div>
                    <div className="bg-white p-4 rounded"><span className="text-green-600 font-bold mr-2">→</span>{t('taxi_benefit_2')}</div>
                    <div className="bg-white p-4 rounded"><span className="text-green-600 font-bold mr-2">→</span>{t('taxi_benefit_3')}</div>
                    <div className="bg-white p-4 rounded"><span className="text-green-600 font-bold mr-2">→</span>{t('taxi_benefit_4')}</div>
                    <div className="bg-white p-4 rounded"><span className="text-green-600 font-bold mr-2">→</span>{t('taxi_benefit_5')}</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-green-700 mb-4">📊 {t('taxi_guide_comparison_title')}</h3>
                  <div className="space-y-3">
                    <div className="bg-green-50 border-l-4 border-green-500 p-4"><p className="text-gray-800">✓ {t('taxi_comp_aggregator')}</p></div>
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4"><p className="text-gray-800">⚖️ {t('taxi_comp_patent')}</p></div>
                    <div className="bg-red-50 border-l-4 border-red-500 p-4"><p className="text-gray-800">✗ {t('taxi_comp_ip')}</p></div>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4"><p className="text-gray-800 font-semibold">💡 {t('taxi_comp_conclusion')}</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">❓ {t('taxi_faq_title')}</h2>
            <div className="space-y-6">
              {[1,2,3,4,5,6].map(i => (
                <details key={i} className="group bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                  <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                    <span>{t(`taxi_faq_q${i}`)}</span>
                    <span className="text-green-600 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-4 text-gray-700 leading-relaxed">{t(`taxi_faq_a${i}`)}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Practical Tips */}
          <div className="mt-12 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-8 border border-green-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">💡 {t('taxi_tips_title')}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="flex items-start space-x-3 bg-white p-4 rounded-lg">
                  <span className="text-2xl">🚕</span>
                  <p className="text-gray-700">{t(`taxi_tip_${i}`)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="mt-12 bg-red-50 rounded-xl shadow-lg p-8 border-2 border-red-200">
            <h2 className="text-3xl font-bold text-red-900 mb-6">⚠️ {t('taxi_mistakes_title')}</h2>
            <div className="space-y-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="flex items-start space-x-3 bg-white p-4 rounded-lg border-l-4 border-red-500">
                  <span className="text-red-600 font-bold text-xl">✗</span>
                  <p className="text-gray-800">{t(`taxi_mistake_${i}`)}</p>
                </div>
              ))}
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
          .print\\:text-blue-600 {
            color: #2563EB !important;
          }
          .print\\:bg-blue-100 {
            background-color: #DBEAFE !important;
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
        }
      `}</style>
    </div>
  );
};

export default TaxiTaxCalculatorPage;