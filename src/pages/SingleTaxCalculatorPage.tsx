import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Info, Home, Printer, Receipt, TrendingUp, DollarSign, Building2, Users } from 'lucide-react';
import ActionButtons from '../components/ActionButtons';
import SchemaMarkup from '../components/SchemaMarkup';
import HreflangTags from '../components/HreflangTags';
import { useLanguage } from '../contexts/LanguageContext';
import {
  generateCalculatorSchema,
  generateBreadcrumbSchema,
  generateSoftwareApplicationSchema
} from '../utils/schemaGenerator';

const SINGLE_TAX_RATES = {
  'trade_goods': {
    nameKey: 'activity_trade_goods',
    rate: 4,
    descriptionKey: 'activity_trade_goods_desc'
  },
  'services': {
    nameKey: 'activity_services',
    rate: 6,
    descriptionKey: 'activity_services_desc'
  },
  'production': {
    nameKey: 'activity_production',
    rate: 4,
    descriptionKey: 'activity_production_desc'
  },
  'catering': {
    nameKey: 'activity_catering',
    rate: 6,
    descriptionKey: 'activity_catering_desc'
  }
};

const TURNOVER_LIMIT = 12000000;

type ActivityType = keyof typeof SINGLE_TAX_RATES;

interface SingleTaxResults {
  monthlyRevenue: number;
  annualRevenue: number;
  taxRate: number;
  monthlyTax: number;
  annualTax: number;
  canUseSingleTax: boolean;
  netIncome: number;
}

const SingleTaxCalculatorPage = () => {
  const { t, language, getLocalizedPath} = useLanguage();

  React.useEffect(() => {
    document.title = t('single_tax_calc_title') + " - Calk.KG";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('single_tax_calc_description'));
    }
  }, [t]);

  const [monthlyRevenue, setMonthlyRevenue] = useState<string>('');
  const [activityType, setActivityType] = useState<ActivityType>('trade_goods');

  const [results, setResults] = useState<SingleTaxResults>({
    monthlyRevenue: 0,
    annualRevenue: 0,
    taxRate: 0,
    monthlyTax: 0,
    annualTax: 0,
    canUseSingleTax: true,
    netIncome: 0
  });

  const calculateSingleTax = (revenue: number, activity: ActivityType): SingleTaxResults => {
    if (revenue <= 0) {
      return {
        monthlyRevenue: 0,
        annualRevenue: 0,
        taxRate: 0,
        monthlyTax: 0,
        annualTax: 0,
        canUseSingleTax: true,
        netIncome: 0
      };
    }

    const annualRevenue = revenue * 12;
    const canUseSingleTax = annualRevenue <= TURNOVER_LIMIT;
    const taxRate = SINGLE_TAX_RATES[activity].rate;
    const monthlyTax = revenue * (taxRate / 100);
    const annualTax = monthlyTax * 12;
    const netIncome = revenue - monthlyTax;

    return {
      monthlyRevenue: revenue,
      annualRevenue,
      taxRate,
      monthlyTax,
      annualTax,
      canUseSingleTax,
      netIncome
    };
  };

  useEffect(() => {
    const revenue = parseFloat(monthlyRevenue) || 0;
    setResults(calculateSingleTax(revenue, activityType));
  }, [monthlyRevenue, activityType]);

  const generateSchemas = () => {
    const currentUrl = language === 'ky' ? "https://calk.kg/ky/calculator/single-tax" : "https://calk.kg/calculator/single-tax";
    const homeUrl = language === 'ky' ? "https://calk.kg/ky" : "https://calk.kg";

    const calculatorSchema = generateCalculatorSchema({
      url: currentUrl,
      title: t('single_tax_calc_title'),
      description: t('single_tax_calc_subtitle'),
      calculatorName: t('single_tax_calc_title'),
      category: t('nav_finance'),
      language,
      inputProperties: ["monthlyRevenue", "activityType"],
      outputProperties: ["monthlyTax", "annualTax"]
    });

    const softwareSchema = generateSoftwareApplicationSchema({
      url: currentUrl,
      title: t('single_tax_calc_title'),
      description: t('single_tax_calc_subtitle'),
      calculatorName: t('single_tax_calc_title'),
      category: "FinanceApplication",
      inputProperties: [t('single_tax_revenue'), t('single_tax_activity')],
      outputProperties: [t('single_tax_monthly'), t('single_tax_annual')]
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: homeUrl },
      { name: t('nav_finance'), url: `${homeUrl}?category=finance` },
      { name: t('single_tax_calc_title'), url: currentUrl }
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

  const handleRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setMonthlyRevenue(value);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const Tooltip = ({ children, text }: { children: React.ReactNode; text: string }) => (
    <div className="group relative inline-flex items-center">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 max-w-xs">
        {text}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );

  const currentActivity = SINGLE_TAX_RATES[activityType];
  const hasData = results.monthlyRevenue > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{t('single_tax_calc_title')} - Calk.KG</title>
        <meta name="description" content={t('single_tax_calc_subtitle')} />
        <meta name="keywords" content={t('single_tax_keywords')} />
        <meta property="og:title" content={`${t('single_tax_calc_title')} - Calk.KG`} />
        <meta property="og:description" content={t('single_tax_calc_subtitle')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/single-tax" : "https://calk.kg/calculator/single-tax"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/single-tax.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('single_tax_calc_title')} - Calk.KG`} />
        <meta name="twitter:description" content={t('single_tax_calc_subtitle')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/single-tax.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/single-tax" : "https://calk.kg/calculator/single-tax"} />
      </Helmet>
      <HreflangTags path="/calculator/single-tax" />
      {generateSchemas().map((schema, index) => (
        <SchemaMarkup key={index} schema={schema} />
      ))}

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

      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white print:bg-white print:text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 print:py-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white/20 p-3 rounded-lg print:bg-red-100">
              <Receipt className="h-8 w-8 print:text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold print:text-2xl">{t('single_tax_calc_title')}</h1>
              <p className="text-red-100 text-lg print:text-gray-600">{t('single_tax_calc_subtitle')}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3 print:hidden">
            <Info className="h-5 w-5 text-amber-200" />
            <span className="text-amber-100 text-sm">
              Ставки актуальны на 2026 год. Лимит годовой выручки: {formatCurrency(TURNOVER_LIMIT)} сом.
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 print:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 print:gap-6">
          <div className="space-y-8 print:break-inside-avoid">
            <div className="bg-white rounded-xl shadow-sm p-8 print:shadow-none print:border">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('calc_parameters')}</h2>

              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('single_tax_revenue')}
                  </label>
                  <Tooltip text={t('single_tax_revenue_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={monthlyRevenue}
                  onChange={handleRevenueChange}
                  placeholder={t('single_tax_revenue_placeholder')}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg"
                />
                <div className="mt-2 flex gap-2">
                  {[50000, 100000, 300000, 500000].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setMonthlyRevenue(amount.toString())}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-red-400 hover:bg-red-50 transition-colors"
                    >
                      {formatCurrency(amount)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('single_tax_activity')}
                  </label>
                  <Tooltip text={t('single_tax_activity_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value as ActivityType)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  {Object.entries(SINGLE_TAX_RATES).map(([key, config]) => (
                    <option key={key} value={key}>
                      {t(config.nameKey)} ({config.rate}%)
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-sm text-gray-500">{t(currentActivity.descriptionKey)}</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 print:break-inside-avoid">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-2">{t('single_tax_info_title')}</p>
                  <ul className="space-y-1 text-blue-800">
                    <li>• {t('single_tax_info_1')}</li>
                    <li>• {t('single_tax_info_2')}</li>
                    <li>• {t('single_tax_info_3')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">{t('calc_results')}</h2>
                {hasData && (
                  <button
                    onClick={handlePrint}
                    className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors print:hidden"
                  >
                    <Printer className="h-5 w-5" />
                    <span className="text-sm">{t('print')}</span>
                  </button>
                )}
              </div>

              {hasData ? (
                <div className="space-y-6">
                  {!results.canUseSingleTax && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Info className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-red-800">
                          <p className="font-medium">{t('single_tax_limit_exceeded')}</p>
                          <p className="mt-1">{t('single_tax_limit_exceeded_desc')}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-red-100">{t('single_tax_monthly')}:</span>
                      <Receipt className="h-6 w-6 text-red-200" />
                    </div>
                    <div className="text-4xl font-bold mb-2">
                      {formatCurrency(results.monthlyTax)} {t('som')}
                    </div>
                    <div className="text-sm text-red-100">
                      {currentActivity.rate}% {t('from_revenue')}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600">{t('single_tax_monthly_revenue')}:</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(results.monthlyRevenue)} {t('som')}</span>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600">{t('single_tax_rate')}:</span>
                      <span className="font-semibold text-gray-900">{results.taxRate}%</span>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-600">{t('single_tax_net_income')}:</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(results.netIncome)} {t('som')}</span>
                    </div>

                    <div className="flex justify-between items-center py-3 bg-blue-50 rounded-lg px-4">
                      <span className="text-gray-700">{t('single_tax_annual')}:</span>
                      <span className="font-semibold text-blue-600">{formatCurrency(results.annualTax)} {t('som')}</span>
                    </div>

                    <div className="flex justify-between items-center py-3 bg-green-50 rounded-lg px-4">
                      <span className="text-gray-700">{t('single_tax_annual_revenue')}:</span>
                      <span className="font-semibold text-green-600">{formatCurrency(results.annualRevenue)} {t('som')}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <Receipt className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">{t('enter_parameters')}</p>
                </div>
              )}
            </div>

            {hasData && <ActionButtons onPrint={handlePrint} />}
          </div>
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
          <h3 className="font-medium text-gray-900 mb-6">{t('single_tax_rates_table')}</h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('activity_type')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('tax_rate')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('example_100k')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('example_500k')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(SINGLE_TAX_RATES).map(([key, config]) => {
                  const isCurrentActivity = key === activityType;
                  const tax100k = 100000 * (config.rate / 100);
                  const tax500k = 500000 * (config.rate / 100);

                  return (
                    <tr key={key} className={isCurrentActivity ? 'bg-red-50' : ''}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {t(config.nameKey)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {config.rate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(tax100k)} {t('som')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(tax500k)} {t('som')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('single_tax_guide_title')}</h2>

          <div className="prose max-w-none">
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">{t('single_tax_what_is_title')}</h3>
              <p className="text-gray-700 mb-4">
                {t('single_tax_what_is_text')}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">{t('single_tax_who_can_title')}</h3>
              <p className="text-gray-700 mb-4">
                {t('single_tax_who_can_text')}
              </p>

              <h4 className="font-semibold text-gray-900 mb-3">{t('single_tax_requirements_title')}</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                <li>{t('single_tax_req_1')}</li>
                <li>{t('single_tax_req_2')}</li>
                <li>{t('single_tax_req_3')}</li>
                <li>{t('single_tax_req_4')}</li>
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">{t('single_tax_rates_2026_title')}</h3>
              <p className="text-gray-700 mb-4">{t('single_tax_rates_2026_intro')}</p>

              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">{t('single_tax_rate_trade')}</h4>
                  <p className="text-sm text-gray-700">{t('single_tax_rate_trade_desc')}</p>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">{t('single_tax_rate_production')}</h4>
                  <p className="text-sm text-gray-700">{t('single_tax_rate_production_desc')}</p>
                </div>
                <div className="bg-green-50 border-l-4 border-green-500 p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">{t('single_tax_rate_services')}</h4>
                  <p className="text-sm text-gray-700">{t('single_tax_rate_services_desc')}</p>
                </div>
                <div className="bg-green-50 border-l-4 border-green-500 p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">{t('single_tax_rate_catering')}</h4>
                  <p className="text-sm text-gray-700">{t('single_tax_rate_catering_desc')}</p>
                </div>
              </div>
            </div>

            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('single_tax_advantages_title')}</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start"><span className="text-green-600 mr-2">✓</span>{t('single_tax_adv_1')}</li>
                  <li className="flex items-start"><span className="text-green-600 mr-2">✓</span>{t('single_tax_adv_2')}</li>
                  <li className="flex items-start"><span className="text-green-600 mr-2">✓</span>{t('single_tax_adv_3')}</li>
                  <li className="flex items-start"><span className="text-green-600 mr-2">✓</span>{t('single_tax_adv_4')}</li>
                  <li className="flex items-start"><span className="text-green-600 mr-2">✓</span>{t('single_tax_adv_5')}</li>
                  <li className="flex items-start"><span className="text-green-600 mr-2">✓</span>{t('single_tax_adv_6')}</li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('single_tax_disadvantages_title')}</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start"><span className="text-red-600 mr-2">✗</span>{t('single_tax_dis_1')}</li>
                  <li className="flex items-start"><span className="text-red-600 mr-2">✗</span>{t('single_tax_dis_2')}</li>
                  <li className="flex items-start"><span className="text-red-600 mr-2">✗</span>{t('single_tax_dis_3')}</li>
                  <li className="flex items-start"><span className="text-red-600 mr-2">✗</span>{t('single_tax_dis_4')}</li>
                </ul>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">{t('single_tax_comparison_title')}</h3>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">{t('single_tax_vs_general')}</h4>
                <p className="text-gray-700">{t('single_tax_vs_general_text')}</p>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">{t('single_tax_vs_patent')}</h4>
                <p className="text-gray-700">{t('single_tax_vs_patent_text')}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">{t('single_tax_how_to_pay_title')}</h3>
              <p className="text-gray-700 mb-4">{t('single_tax_how_to_pay_text')}</p>

              <h4 className="font-semibold text-gray-900 mb-3">{t('single_tax_payment_methods')}</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                <li>{t('single_tax_payment_1')}</li>
                <li>{t('single_tax_payment_2')}</li>
                <li>{t('single_tax_payment_3')}</li>
                <li>{t('single_tax_payment_4')}</li>
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">{t('single_tax_examples_title')}</h3>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('single_tax_example_1_title')}</h4>
                  <p className="text-gray-700">{t('single_tax_example_1_text')}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('single_tax_example_2_title')}</h4>
                  <p className="text-gray-700">{t('single_tax_example_2_text')}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('single_tax_example_3_title')}</h4>
                  <p className="text-gray-700">{t('single_tax_example_3_text')}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">{t('single_tax_faq_title')}</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('single_tax_faq_q1')}</h4>
                  <p className="text-gray-700">{t('single_tax_faq_a1')}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('single_tax_faq_q2')}</h4>
                  <p className="text-gray-700">{t('single_tax_faq_a2')}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('single_tax_faq_q3')}</h4>
                  <p className="text-gray-700">{t('single_tax_faq_a3')}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('single_tax_faq_q4')}</h4>
                  <p className="text-gray-700">{t('single_tax_faq_a4')}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('single_tax_faq_q5')}</h4>
                  <p className="text-gray-700">{t('single_tax_faq_a5')}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">{t('single_tax_tips_title')}</h3>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">💡 {t('single_tax_tip_1')}</li>
                  <li className="flex items-start">💡 {t('single_tax_tip_2')}</li>
                  <li className="flex items-start">💡 {t('single_tax_tip_3')}</li>
                  <li className="flex items-start">💡 {t('single_tax_tip_4')}</li>
                  <li className="flex items-start">💡 {t('single_tax_tip_5')}</li>
                </ul>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">{t('single_tax_useful_links_title')}</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Building2 className="h-5 w-5 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t('single_tax_link_nts')}</h4>
                    <p className="text-sm text-gray-700 mb-2">{t('single_tax_link_nts_desc')}</p>
                    <a href="https://salyk.kg" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700 text-sm underline">
                      salyk.kg →
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t('single_tax_link_cabinet')}</h4>
                    <p className="text-sm text-gray-700">{t('single_tax_link_cabinet_desc')}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Receipt className="h-5 w-5 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t('single_tax_link_law')}</h4>
                    <p className="text-sm text-gray-700">{t('single_tax_link_law_desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-sm p-8 print:hidden">
          <h3 className="font-medium text-gray-900 mb-4">{t('other_calculators')}:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to={getLocalizedPath("/calculator/salary")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-red-600">{t('salary_calc_title')}</div>
                  <div className="text-sm text-gray-500">{t('salary_subtitle')}</div>
                </div>
              </div>
            </Link>
            <Link
              to={getLocalizedPath("/calculator/patent")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-red-600">{t('patent_calc_title')}</div>
                  <div className="text-sm text-gray-500">{t('patent_subtitle')}</div>
                </div>
              </div>
            </Link>
            <Link
              to={getLocalizedPath("/calculator/social-fund")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-purple-50 p-2 rounded-lg group-hover:bg-purple-100 transition-colors">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-red-600">{t('social_fund_calc_title')}</div>
                  <div className="text-sm text-gray-500">{t('social_fund_subtitle')}</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-yellow-50 border-t border-yellow-200 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-2">{t('legal_notice')}</p>
              <ul className="space-y-1">
                <li>• {t('single_tax_notice_1')}</li>
                <li>• {t('single_tax_notice_2')}</li>
                <li>• {t('single_tax_notice_3')}</li>
                <li>• {t('single_tax_notice_4')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTaxCalculatorPage;
