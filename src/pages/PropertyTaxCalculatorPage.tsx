import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Info, Home, Printer, Building, Shield, CreditCard, Receipt } from 'lucide-react';
import ActionButtons from '../components/ActionButtons';
import SchemaMarkup from '../components/SchemaMarkup';
import HreflangTags from '../components/HreflangTags';
import { useLanguage } from '../contexts/LanguageContext';
import {
  generateCalculatorSchema,
  generateBreadcrumbSchema,
  generateSoftwareApplicationSchema
} from '../utils/schemaGenerator';

type PropertyType = 'apartment' | 'house';

const PropertyTaxCalculatorPage = () => {
  const { language, t, getLocalizedPath} = useLanguage();

  React.useEffect(() => {
    document.title = t('property_tax_calc_title') + " - Calk.KG";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('property_tax_calc_description'));
    }
  }, [t]);

  const generateSchemas = () => {
    const currentUrl = language === 'ky' ? "https://calk.kg/ky/calculator/property-tax" : "https://calk.kg/calculator/property-tax";
    const homeUrl = language === 'ky' ? "https://calk.kg/ky" : "https://calk.kg";

    const calculatorSchema = generateCalculatorSchema({
      url: currentUrl,
      title: t('property_tax_calc_title'),
      description: t('property_tax_calc_subtitle'),
      calculatorName: t('property_tax_calc_title'),
      category: t('nav_finance'),
      language,
      inputProperties: ["propertyType", "totalArea", "taxRate"],
      outputProperties: ["taxableArea", "taxAmount"]
    });

    const softwareSchema = generateSoftwareApplicationSchema({
      url: currentUrl,
      title: t('property_tax_calc_title'),
      description: t('property_tax_calc_subtitle'),
      calculatorName: t('property_tax_calc_title'),
      category: "FinanceApplication",
      inputProperties: [t('property_tax_property_type'), t('property_tax_total_area'), t('property_tax_rate')],
      outputProperties: [t('property_tax_taxable_area'), t('property_tax_annual_tax')]
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: homeUrl },
      { name: t('nav_finance'), url: `${homeUrl}?category=finance` },
      { name: t('property_tax_calc_title'), url: currentUrl }
    ]);

    return [calculatorSchema, softwareSchema, breadcrumbSchema];
  };

  const [propertyType, setPropertyType] = useState<PropertyType>('apartment');
  const [city, setCity] = useState<string>('bishkek');
  const [taxRate, setTaxRate] = useState<string>('');
  const [totalArea, setTotalArea] = useState<string>('');
  const [applyBenefit, setApplyBenefit] = useState<boolean>(true);

  const [results, setResults] = useState({
    totalArea: 0,
    benefitArea: 0,
    taxableArea: 0,
    taxRate: 0,
    taxAmount: 0
  });

  const cities = [
    { id: 'bishkek', name: t('property_tax_city_bishkek') },
    { id: 'osh', name: t('property_tax_city_osh') },
    { id: 'jalal-abad', name: t('property_tax_city_jalal_abad') },
    { id: 'karakol', name: t('property_tax_city_karakol') },
    { id: 'tokmok', name: t('property_tax_city_tokmok') },
    { id: 'naryn', name: t('property_tax_city_naryn') },
    { id: 'talas', name: t('property_tax_city_talas') },
    { id: 'batken', name: t('property_tax_city_batken') },
    { id: 'other', name: t('property_tax_city_other') }
  ];

  const calculateTax = (
    area: number,
    rate: number,
    type: PropertyType,
    benefit: boolean
  ) => {
    let benefitArea = 0;
    let taxableArea = area;

    if (benefit) {
      benefitArea = type === 'apartment' ? 80 : 150;
      taxableArea = Math.max(0, area - benefitArea);
    }

    const taxAmount = taxableArea * rate;

    return {
      totalArea: area,
      benefitArea: benefit ? benefitArea : 0,
      taxableArea,
      taxRate: rate,
      taxAmount
    };
  };

  useEffect(() => {
    const area = parseFloat(totalArea) || 0;
    const rate = parseFloat(taxRate) || 0;

    if (area >= 0 && rate >= 0) {
      setResults(calculateTax(area, rate, propertyType, applyBenefit));
    } else {
      setResults({
        totalArea: area,
        benefitArea: 0,
        taxableArea: 0,
        taxRate: rate,
        taxAmount: 0
      });
    }
  }, [totalArea, taxRate, propertyType, applyBenefit]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-KG', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setTotalArea(value);
    }
  };

  const handleTaxRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setTaxRate(value);
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

  const getBenefitAreaName = () => {
    return propertyType === 'apartment' ? '80 м²' : '150 м²';
  };

  const taxPercentage = results.totalArea > 0 ? (results.taxableArea / results.totalArea) * 100 : 0;
  const benefitPercentage = results.totalArea > 0 ? (results.benefitArea / results.totalArea) * 100 : 0;
  const remainingPercentage = 100 - taxPercentage - benefitPercentage;

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{t('property_tax_calc_title')} - Calk.KG</title>
        <meta name="description" content={t('property_tax_calc_subtitle')} />
        <meta name="keywords" content={t('property_tax_keywords')} />
        <meta property="og:title" content={`${t('property_tax_calc_title')} - Calk.KG`} />
        <meta property="og:description" content={t('property_tax_calc_subtitle')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/property-tax" : "https://calk.kg/calculator/property-tax"} />
        <meta property="og:image" content="https://calk.kg/og-images/property-tax.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('property_tax_calc_title')} - Calk.KG`} />
        <meta name="twitter:description" content={t('property_tax_calc_subtitle')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/property-tax.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/property-tax" : "https://calk.kg/calculator/property-tax"} />
      </Helmet>
      <HreflangTags path="/calculator/property-tax" />
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
              <Building className="h-8 w-8 print:text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold print:text-2xl">{t('property_tax_calc_title')}</h1>
              <p className="text-red-100 text-lg print:text-gray-600">{t('property_tax_calc_subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 print:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 print:gap-6">
          <div className="space-y-8 print:break-inside-avoid">
            <div className="bg-white rounded-xl shadow-sm p-8 print:shadow-none print:border">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('property_tax_input_data')}</h2>

              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('property_tax_property_type')}
                  </label>
                  <Tooltip text={t('property_tax_property_type_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                    <input
                      type="radio"
                      name="propertyType"
                      value="apartment"
                      checked={propertyType === 'apartment'}
                      onChange={() => setPropertyType('apartment')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500"
                    />
                    <div>
                      <span className="text-gray-900 font-medium">{t('property_tax_apartment')}</span>
                      <p className="text-sm text-gray-500">{t('property_tax_apartment_benefit')}</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                    <input
                      type="radio"
                      name="propertyType"
                      value="house"
                      checked={propertyType === 'house'}
                      onChange={() => setPropertyType('house')}
                      className="h-4 w-4 text-red-600 focus:ring-red-500"
                    />
                    <div>
                      <span className="text-gray-900 font-medium">{t('property_tax_house')}</span>
                      <p className="text-sm text-gray-500">{t('property_tax_house_benefit')}</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('property_tax_city')}
                  </label>
                  <Tooltip text={t('property_tax_city_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg print:text-base"
                >
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-8">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('property_tax_rate')}
                  </label>
                  <Tooltip text={t('property_tax_rate_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={taxRate}
                  onChange={handleTaxRateChange}
                  placeholder={t('property_tax_rate_placeholder')}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg print:text-base"
                />
                <p className="text-sm text-gray-500 mt-2">
                  {t('property_tax_rate_info')}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('property_tax_total_area')}
                  </label>
                  <Tooltip text={t('property_tax_total_area_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={totalArea}
                  onChange={handleAreaChange}
                  placeholder={t('property_tax_total_area_placeholder')}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg print:text-base"
                />
              </div>

              <div className="mb-8">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="applyBenefit"
                    checked={applyBenefit}
                    onChange={(e) => setApplyBenefit(e.target.checked)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <div className="flex items-center">
                    <label htmlFor="applyBenefit" className="text-sm font-medium text-gray-700 cursor-pointer">
                      {t('property_tax_apply_benefit')}
                    </label>
                    <Tooltip text={t('property_tax_apply_benefit_tooltip')}>
                      <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                    </Tooltip>
                  </div>
                </div>
                {applyBenefit && (
                  <p className="text-sm text-gray-500 mt-2 ml-7">
                    {t('property_tax_benefit_for')} {propertyType === 'apartment' ? t('property_tax_benefit_apartment') : t('property_tax_benefit_house')}: {getBenefitAreaName()}
                  </p>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-2">{t('property_tax_calculation_order')}</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>{t('property_tax_calc_step1')}</li>
                      <li>{t('property_tax_calc_step2')}</li>
                      <li>{t('property_tax_calc_step3')}</li>
                    </ol>
                    <p className="mt-3">
                      {t('property_tax_purchase_tip')} {' '}
                      <Link to={getLocalizedPath("/calculator/housing")} className="text-blue-600 hover:text-blue-800 underline">{t('property_tax_housing_calc')}</Link> {t('property_tax_or_calc')} {' '}
                      <Link to={getLocalizedPath("/calculator/mortgage")} className="text-blue-600 hover:text-blue-800 underline">{t('property_tax_mortgage_calc')}</Link> {t('property_tax_for_purchase')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-8 print:shadow-none print:border print:break-inside-avoid">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">{t('property_tax_results')}</h2>
                {results.totalArea > 0 && results.taxRate > 0 && (
                  <ActionButtons
                    calculatorName={t('property_tax_calc_title')}
                    resultText={`${t('property_tax_calc_title')} - ${t('property_tax_results')}:
${t('property_tax_total_area_label')} ${formatCurrency(results.totalArea)} м²
${t('property_tax_benefit_area_label')} ${formatCurrency(results.benefitArea)} м²
${t('property_tax_taxable_area_label')} ${formatCurrency(results.taxableArea)} м²
${t('property_tax_rate')}: ${formatCurrency(results.taxRate)} сом/м²
${t('property_tax_annual_tax')} ${formatCurrency(results.taxAmount)} KGS

Расчет выполнен на сайте Calk.KG`}
                  />
                )}
              </div>

              {results.totalArea > 0 && results.taxRate > 0 ? (
                <div className="space-y-8">
                  {results.totalArea > 0 && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                        {t('property_tax_area_distribution')}
                        <Tooltip text={t('property_tax_area_distribution_tooltip')}>
                          <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                        </Tooltip>
                      </h3>
                      <div className="space-y-4">
                        {results.taxableArea > 0 && (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600">{t('property_tax_taxable_area')}</span>
                              <span className="text-sm font-medium text-red-600">
                                {formatCurrency(results.taxableArea)} м² ({taxPercentage.toFixed(1)}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${taxPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {applyBenefit && results.benefitArea > 0 && (
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600">{t('property_tax_benefit_area')}</span>
                              <span className="text-sm font-medium text-green-600">
                                {formatCurrency(results.benefitArea)} м² ({benefitPercentage.toFixed(1)}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${benefitPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-4 border-b border-gray-100">
                    <div className="flex items-center">
                      <span className="text-gray-600 text-lg">{t('property_tax_total_area_label')}</span>
                      <Tooltip text={t('property_tax_total_area_tooltip_result')}>
                        <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                      </Tooltip>
                    </div>
                    <span className="text-xl font-semibold text-gray-900">
                      {formatCurrency(results.totalArea)} м²
                    </span>
                  </div>

                  {applyBenefit && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <span className="text-gray-700">{t('property_tax_benefit_area_label')}</span>
                          <Tooltip text={t('property_tax_benefit_area_tooltip')}>
                            <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-green-600 font-semibold text-lg">
                          -{formatCurrency(results.benefitArea)} м²
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {propertyType === 'apartment' ? t('property_tax_apartment_area') : t('property_tax_house_area')}
                      </p>
                    </div>
                  )}

                  <div className="bg-amber-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <span className="text-gray-700">{t('property_tax_taxable_area_label')}</span>
                        <Tooltip text={t('property_tax_taxable_area_tooltip')}>
                          <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                        </Tooltip>
                      </div>
                      <span className="text-amber-600 font-semibold text-lg">
                        {formatCurrency(results.taxableArea)} м²
                      </span>
                    </div>
                    {applyBenefit && (
                      <p className="text-sm text-gray-500">
                        {formatCurrency(results.totalArea)} м² - {formatCurrency(results.benefitArea)} м² = {formatCurrency(results.taxableArea)} м²
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center py-4 border-b border-gray-100">
                    <div className="flex items-center">
                      <span className="text-gray-600 text-lg">{t('property_tax_applied_rate')}</span>
                      <Tooltip text={t('property_tax_applied_rate_tooltip')}>
                        <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                      </Tooltip>
                    </div>
                    <span className="text-xl font-semibold text-gray-900">
                      {formatCurrency(results.taxRate)} сом/м²
                    </span>
                  </div>

                  <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <p className="text-red-100">{t('property_tax_annual_tax')}</p>
                        <Tooltip text={t('property_tax_annual_tax_tooltip')}>
                          <Info className="h-4 w-4 text-red-200 ml-2 cursor-help" />
                        </Tooltip>
                      </div>
                      <p className="text-4xl font-bold">
                        {formatCurrency(results.taxAmount)} KGS
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-700 mb-3">{t('property_tax_additional_info')}</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>{t('property_tax_object_type')}</span>
                        <span>{propertyType === 'apartment' ? t('property_tax_apartment_short') : t('property_tax_house_short')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('property_tax_city')}</span>
                        <span>{cities.find(c => c.id === city)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('property_tax_calculation_formula')}</span>
                        <span>
                          {formatCurrency(results.taxableArea)} м² × {formatCurrency(results.taxRate)} сом = {formatCurrency(results.taxAmount)} сом
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <Building className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">{t('property_tax_enter_data')}</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
              <h3 className="font-medium text-gray-900 mb-4">{t('calculation_examples')}</h3>
              <div className="space-y-3">
                {[
                  { area: 60, rate: 50, type: 'apartment' as PropertyType, benefit: true },
                  { area: 120, rate: 70, type: 'apartment' as PropertyType, benefit: true },
                  { area: 180, rate: 60, type: 'house' as PropertyType, benefit: true },
                  { area: 250, rate: 80, type: 'house' as PropertyType, benefit: true }
                ].map((example, index) => {
                  const exampleResult = calculateTax(example.area, example.rate, example.type, example.benefit);
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setTotalArea(example.area.toString());
                        setTaxRate(example.rate.toString());
                        setPropertyType(example.type);
                        setApplyBenefit(example.benefit);
                      }}
                      className="w-full text-left p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 font-medium">
                          {example.type === 'apartment' ? t('property_tax_apartment_short') : t('property_tax_house_short')} {example.area} м² • {example.rate} сом/м²
                        </span>
                        <div className="text-right">
                          <div className="text-red-600 font-semibold">
                            {formatCurrency(exampleResult.taxAmount)} KGS
                          </div>
                          <div className="text-xs text-gray-500">
                            с {exampleResult.taxableArea} м²
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {exampleResult.benefitArea > 0 && `${t('property_tax_benefit_label')} ${exampleResult.benefitArea} м²`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-12">
          <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
            <h3 className="font-medium text-gray-900 mb-4">{t('calculation_examples')}</h3>
            <div className="space-y-3">
              {[
                { area: 60, rate: 50, type: 'apartment' as PropertyType, benefit: true },
                { area: 120, rate: 70, type: 'apartment' as PropertyType, benefit: true },
                { area: 180, rate: 60, type: 'house' as PropertyType, benefit: true },
                { area: 250, rate: 80, type: 'house' as PropertyType, benefit: true }
              ].map((example, index) => {
                const exampleResult = calculateTax(example.area, example.rate, example.type, example.benefit);
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setTotalArea(example.area.toString());
                      setTaxRate(example.rate.toString());
                      setPropertyType(example.type);
                      setApplyBenefit(example.benefit);
                    }}
                    className="w-full text-left p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">
                        {example.type === 'apartment' ? t('property_tax_apartment_short') : t('property_tax_house_short')} {example.area} м² • {example.rate} сом/м²
                      </span>
                      <div className="text-right">
                        <div className="text-red-600 font-semibold">
                          {formatCurrency(exampleResult.taxAmount)} KGS
                        </div>
                        <div className="text-xs text-gray-500">
                          с {exampleResult.taxableArea} м²
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {exampleResult.benefitArea > 0 && `${t('property_tax_benefit_label')} ${exampleResult.benefitArea} м²`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
            <h3 className="font-medium text-gray-900 mb-4">{t('other_calculators')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to={getLocalizedPath("/calculator/single-tax")}
                className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                    <Receipt className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('property_tax_single_tax_link')}</div>
                    <div className="text-sm text-gray-500">{t('property_tax_single_tax_desc')}</div>
                  </div>
                </div>
              </Link>
              <Link
                to={getLocalizedPath("/calculator/salary")}
                className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('property_tax_salary_link')}</div>
                    <div className="text-sm text-gray-500">{t('property_tax_salary_desc')}</div>
                  </div>
                </div>
              </Link>
              <Link
                to={getLocalizedPath("/calculator/social-fund")}
                className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('property_tax_social_fund_link')}</div>
                    <div className="text-sm text-gray-500">{t('property_tax_social_fund_desc')}</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <Info className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-2">{t('property_tax_important_info')}</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>{t('property_tax_info1')}</li>
                  <li>{t('property_tax_info2')}</li>
                  <li><strong>{t('property_tax_info3')}</strong></li>
                  <li>{t('property_tax_info4')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Guide & FAQ */}
        {(language === 'ru' || language === 'ky') && (
          <>
            <div className="mt-12 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-8 border border-blue-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('property_guide_title')}</h2>
              <p className="text-lg text-gray-700 mb-8">{t('property_guide_intro')}</p>
              
              <div className="space-y-8">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-blue-700 mb-4">{t('property_guide_law_title')}</h3>
                  <p className="text-gray-700">{t('property_guide_law_text')}</p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-blue-700 mb-4">{t('property_guide_rates_title')}</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start"><span className="text-blue-600 font-bold mr-2">•</span>{t('property_rate_bishkek')}</li>
                    <li className="flex items-start"><span className="text-blue-600 font-bold mr-2">•</span>{t('property_rate_osh')}</li>
                    <li className="flex items-start"><span className="text-blue-600 font-bold mr-2">•</span>{t('property_rate_jalal')}</li>
                    <li className="flex items-start"><span className="text-blue-600 font-bold mr-2">•</span>{t('property_rate_karakol')}</li>
                    <li className="flex items-start"><span className="text-blue-600 font-bold mr-2">•</span>{t('property_rate_other')}</li>
                  </ul>
                  <p className="mt-3 text-sm text-gray-600 italic">{t('property_rate_note')}</p>
                </div>

                <div className="bg-green-50 rounded-lg p-6 shadow-sm border border-green-200">
                  <h3 className="text-2xl font-bold text-green-700 mb-4">✅ {t('property_guide_benefits_title')}</h3>
                  <div className="space-y-3">
                    {[1,2,3,4,5].map(i => (<div key={i} className="bg-white p-4 rounded"><span className="text-green-600 font-bold mr-2">→</span>{t(`property_benefit_${i}`)}</div>))}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-blue-700 mb-4">🧮 {t('property_guide_calc_title')}</h3>
                  <div className="space-y-2 text-gray-700">
                    {[1,2,3,4,5].map(i => (<p key={i} className="pl-4">{t(`property_calc_step${i}`)}</p>))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">❓ {t('property_faq_title')}</h2>
              <div className="space-y-6">
                {[1,2,3,4,5,6].map(i => (
                  <details key={i} className="group bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                    <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                      <span>{t(`property_faq_q${i}`)}</span>
                      <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <p className="mt-4 text-gray-700 leading-relaxed">{t(`property_faq_a${i}`)}</p>
                  </details>
                ))}
              </div>
            </div>

            <div className="mt-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8 border border-blue-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">💡 {t('property_tips_title')}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[1,2,3,4,5,6].map(i => (<div key={i} className="flex items-start space-x-3 bg-white p-4 rounded-lg"><span className="text-2xl">🏠</span><p className="text-gray-700">{t(`property_tip_${i}`)}</p></div>))}
              </div>
            </div>

            <div className="mt-12 bg-red-50 rounded-xl shadow-lg p-8 border-2 border-red-200">
              <h2 className="text-3xl font-bold text-red-900 mb-6">⚠️ {t('property_mistakes_title')}</h2>
              <div className="space-y-3">
                {[1,2,3,4,5].map(i => (<div key={i} className="flex items-start space-x-3 bg-white p-4 rounded-lg border-l-4 border-red-500"><span className="text-red-600 font-bold text-xl">✗</span><p className="text-gray-800">{t(`property_mistake_${i}`)}</p></div>))}
              </div>
            </div>
          </>
        )}
      </div>

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

export default PropertyTaxCalculatorPage;
