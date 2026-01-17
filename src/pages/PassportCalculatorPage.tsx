import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Info, Home, Printer, CreditCard, FileText, Clock, Building, Car, Receipt, Users } from 'lucide-react';
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

const getPassportFees = (t: any) => ({
  'id-card': {
    name: t('passport_doc_id_card'),
    causes: {
      'normal': {
        name: t('passport_cause_normal'),
        urgency: {
          '18': { days: t('passport_days_18'), cost: 650 },
          '8': { days: t('passport_days_8'), cost: 1950 },
          '4': { days: t('passport_days_4'), cost: 2800 },
          '2': { days: t('passport_days_2'), cost: 3500 }
        }
      },
      'loss': {
        name: t('passport_cause_loss'),
        urgency: {
          '18': { days: t('passport_days_18'), cost: 1150 },
          '8': { days: t('passport_days_8'), cost: 2450 },
          '4': { days: t('passport_days_4'), cost: 3300 },
          '2': { days: t('passport_days_2'), cost: 4000 }
        }
      }
    }
  },
  'passport': {
    name: t('passport_doc_foreign'),
    causes: {
      'normal': {
        name: t('passport_cause_normal'),
        urgency: {
          '18': { days: t('passport_days_18'), cost: 950 },
          '8': { days: t('passport_days_8'), cost: 2500 },
          '4': { days: t('passport_days_4'), cost: 3800 },
          '2': { days: t('passport_days_2'), cost: 4500 }
        }
      },
      'loss': {
        name: t('passport_cause_loss'),
        urgency: {
          '18': { days: t('passport_days_18'), cost: 1450 },
          '8': { days: t('passport_days_8'), cost: 3000 },
          '4': { days: t('passport_days_4'), cost: 4300 },
          '2': { days: t('passport_days_2'), cost: 5000 }
        }
      }
    }
  }
});

type DocumentType = 'id-card' | 'passport';
type CauseType = 'normal' | 'loss';
type UrgencyType = '18' | '8' | '4' | '2';

interface PassportResults {
  documentType: string;
  causeType: string;
  urgencyType: string;
  deliveryTime: string;
  cost: number;
  hasResult: boolean;
}

const PassportCalculatorPage = () => {
  const { language, t, getLocalizedPath} = useLanguage();
  const PASSPORT_FEES = getPassportFees(t);

  // Генерация схем для страницы калькулятора паспортов
  const generateSchemas = () => {
    const currentUrl = language === 'ky' ? "https://calk.kg/ky/calculator/passport" : "https://calk.kg/calculator/passport";
    const homeUrl = language === 'ky' ? "https://calk.kg/ky" : "https://calk.kg";
    
    const calculatorSchema = generateCalculatorSchema({
      url: currentUrl,
      title: t('passport_calc_title'),
      description: t('passport_calc_subtitle'),
      calculatorName: t('passport_calc_title'),
      category: t('nav_other'),
      language,
      inputProperties: ["documentType", "causeType", "urgencyType"],
      outputProperties: ["cost", "deliveryTime"]
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: homeUrl },
      { name: t('nav_other'), url: `${homeUrl}?category=other` },
      { name: t('passport_calc_title'), url: currentUrl }
    ]);

    return [calculatorSchema, breadcrumbSchema];
  };

  React.useEffect(() => {
    document.title = t('passport_calc_title') + " - Calk.KG";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('passport_calc_description'));
    }
  }, [t]);

  const [documentType, setDocumentType] = useState<DocumentType>('id-card');
  const [causeType, setCauseType] = useState<CauseType>('normal');
  const [urgencyType, setUrgencyType] = useState<UrgencyType>('18');
  
  const [results, setResults] = useState<PassportResults>({
    documentType: '',
    causeType: '',
    urgencyType: '',
    deliveryTime: '',
    cost: 0,
    hasResult: false
  });

  // Расчет стоимости паспорта
  const calculatePassportCost = (
    docType: DocumentType,
    cause: CauseType,
    urgency: UrgencyType
  ): PassportResults => {
    const documentData = PASSPORT_FEES[docType];
    const causeData = documentData.causes[cause];
    const urgencyData = causeData.urgency[urgency];

    return {
      documentType: documentData.name,
      causeType: causeData.name,
      urgencyType: urgency,
      deliveryTime: urgencyData.days,
      cost: urgencyData.cost,
      hasResult: true
    };
  };

  // Обновление результатов при изменении входных данных
  useEffect(() => {
    if (documentType && causeType && urgencyType) {
      setResults(calculatePassportCost(documentType, causeType, urgencyType));
    }
  }, [documentType, causeType, urgencyType]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-KG', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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

  // Получение доступных вариантов срочности для выбранной комбинации
  const getAvailableUrgencyOptions = () => {
    if (!documentType || !causeType) return [];

    const causeData = PASSPORT_FEES[documentType].causes[causeType];
    return Object.entries(causeData.urgency).map(([key, data]) => ({
      value: key,
      label: `${data.days} - ${formatCurrency(data.cost)} ${t('passport_som')}`,
      days: data.days,
      cost: data.cost
    }));
  };

  const urgencyOptions = getAvailableUrgencyOptions();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org микроразметка */}
      <Helmet>
        <title>{t('passport_calc_title')} - Calk.KG</title>
        <meta name="description" content={t('passport_calc_subtitle')} />
        <meta name="keywords" content={t('passport_keywords')} />
        <meta property="og:title" content={`${t('passport_calc_title')} - Calk.KG`} />
        <meta property="og:description" content={t('passport_calc_subtitle')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/passport" : "https://calk.kg/calculator/passport"} />
        <meta property="og:image" content="https://calk.kg/og-images/passport.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('passport_calc_title')} - Calk.KG`} />
        <meta name="twitter:description" content={t('passport_calc_subtitle')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/passport.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/passport" : "https://calk.kg/calculator/passport"} />
      </Helmet>
      <HreflangTags path="/calculator/passport" />
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
                <CreditCard className="h-10 w-10 print:text-blue-600" />
              </div>
              <div className="bg-white/20 p-4 rounded-xl print:bg-blue-100">
                <FileText className="h-10 w-10 print:text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 print:text-2xl">
              {t('passport_calc_title')}
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed print:text-gray-600">
              {t('passport_calc_subtitle')}
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
              <Building className="h-8 w-8 text-blue-600 mr-2" />
              <h2 className="text-3xl font-bold text-gray-900">{t('passport_calc_result')}</h2>
            </div>
            <p className="text-gray-600">
              {t('passport_enter_params')}
            </p>
          </div>

          {/* Document Type Selection */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <label className="block text-lg font-semibold text-gray-700">
                {t('passport_doc_type')}
              </label>
              <Tooltip text={t('tooltip_passport_type')}>
                <Info className="h-5 w-5 text-gray-400 ml-2 cursor-help" />
              </Tooltip>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`cursor-pointer p-6 rounded-xl border-2 transition-all ${
                documentType === 'id-card'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}>
                <input
                  type="radio"
                  name="documentType"
                  value="id-card"
                  checked={documentType === 'id-card'}
                  onChange={() => setDocumentType('id-card')}
                  className="sr-only"
                />
                <div className="text-center">
                  <CreditCard className={`h-12 w-12 mx-auto mb-3 ${
                    documentType === 'id-card' ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <span className="text-lg font-semibold text-gray-900">{t('passport_doc_id_card')}</span>
                  <p className="text-sm text-gray-500 mt-1">{language === 'ky' ? 'КР жарандарынын жеке күбөлүгү' : 'Удостоверение личности гражданина КР'}</p>
                </div>
              </label>

              <label className={`cursor-pointer p-6 rounded-xl border-2 transition-all ${
                documentType === 'passport'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}>
                <input
                  type="radio"
                  name="documentType"
                  value="passport"
                  checked={documentType === 'passport'}
                  onChange={() => setDocumentType('passport')}
                  className="sr-only"
                />
                <div className="text-center">
                  <FileText className={`h-12 w-12 mx-auto mb-3 ${
                    documentType === 'passport' ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <span className="text-lg font-semibold text-gray-900">{t('passport_doc_foreign')}</span>
                  <p className="text-sm text-gray-500 mt-1">{language === 'ky' ? 'КРдан тышкары чыгуу үчүн' : 'Для выезда за пределы КР'}</p>
                </div>
              </label>
            </div>
          </div>

          {/* Cause Selection */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <label className="block text-lg font-semibold text-gray-700">
                {t('passport_cause_type')}
              </label>
              <Tooltip text={t('tooltip_passport_reason')}>
                <Info className="h-5 w-5 text-gray-400 ml-2 cursor-help" />
              </Tooltip>
            </div>
            <select
              value={causeType}
              onChange={(e) => setCauseType(e.target.value as CauseType)}
              className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/25 focus:border-blue-500 text-lg font-medium transition-all"
            >
              {Object.entries(PASSPORT_FEES[documentType].causes).map(([key, cause]) => (
                <option key={key} value={key}>
                  {cause.name}
                </option>
              ))}
            </select>
          </div>

          {/* Urgency Selection */}
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <label className="block text-lg font-semibold text-gray-700">
                {t('passport_urgency')}
              </label>
              <Tooltip text={t('tooltip_passport_term')}>
                <Info className="h-5 w-5 text-gray-400 ml-2 cursor-help" />
              </Tooltip>
            </div>
            <select
              value={urgencyType}
              onChange={(e) => setUrgencyType(e.target.value as UrgencyType)}
              className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/25 focus:border-blue-500 text-lg font-medium transition-all"
            >
              {urgencyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Result */}
          {results.hasResult && (
            <>
              <div className="mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white text-center">
                  <div className="flex items-center justify-center mb-4">
                    <CreditCard className="h-8 w-8 mr-3" />
                    <span className="text-xl text-blue-100">{t('passport_total_cost')}</span>
                  </div>
                  <p className="text-6xl font-bold mb-4">
                    {formatCurrency(results.cost)} {t('passport_som')}
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-blue-100">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      <span>{results.deliveryTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Details */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">{t('passport_calc_details')}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('passport_selected_doc')}</span>
                    <span className="font-medium text-gray-900">{results.documentType}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('passport_selected_cause')}</span>
                    <span className="font-medium text-gray-900">{results.causeType}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('passport_delivery_time')}</span>
                    <span className="font-medium text-gray-900">{results.deliveryTime}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 font-semibold">{language === 'ky' ? 'Мамлекеттик баж:' : 'Государственная пошлина:'}</span>
                      <span className="text-2xl font-bold text-blue-600">{formatCurrency(results.cost)} {t('passport_som')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Print Button */}
              <div className="text-center mb-8 print:hidden">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors"
                >
                  <Printer className="h-5 w-5" />
                  <span>{t('print')}</span>
                </button>
              </div>
            </>
          )}

          {/* Quick Examples */}
          <div className="mb-8 print:hidden">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">{t('passport_quick_calc')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { doc: 'id-card' as DocumentType, cause: 'normal' as CauseType, urgency: '18' as UrgencyType, label: t('passport_id_normal') },
                { doc: 'passport' as DocumentType, cause: 'normal' as CauseType, urgency: '18' as UrgencyType, label: t('passport_foreign_normal') },
                { doc: 'id-card' as DocumentType, cause: 'normal' as CauseType, urgency: '4' as UrgencyType, label: t('passport_id_urgent') },
                { doc: 'passport' as DocumentType, cause: 'loss' as CauseType, urgency: '8' as UrgencyType, label: t('passport_foreign_urgent') }
              ].map((example, index) => {
                const exampleResult = calculatePassportCost(example.doc, example.cause, example.urgency);
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setDocumentType(example.doc);
                      setCauseType(example.cause);
                      setUrgencyType(example.urgency);
                    }}
                    className="text-left p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-blue-300"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium text-sm">
                        {example.label}
                      </span>
                      <div className="text-right">
                        <div className="text-blue-600 font-semibold">
                          {formatCurrency(exampleResult.cost)} {t('passport_som')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {exampleResult.deliveryTime}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Information Block */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-2">{t('passport_features_title')}</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>{t('passport_feature_1')}</li>
                  <li>{t('passport_feature_2')}</li>
                  <li>{t('passport_feature_3')}</li>
                  <li>{t('passport_feature_4')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Other Calculators */}
        <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
          <h3 className="font-medium text-gray-900 mb-4">{t('passport_other_calculators')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to={getLocalizedPath("/calculator/traffic-fines")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-blue-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-gray-50 p-2 rounded-lg group-hover:bg-gray-100 transition-colors">
                  <Car className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">{t('other_calc_traffic_fines')}</div>
                  <div className="text-sm text-gray-500">{t('other_calc_traffic_fines_desc')}</div>
                </div>
              </div>
            </Link>
            <Link
              to={getLocalizedPath("/calculator/single-tax")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-blue-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                  <Receipt className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">{t('other_calc_single_tax')}</div>
                  <div className="text-sm text-gray-500">{t('other_calc_single_tax_desc')}</div>
                </div>
              </div>
            </Link>
            <Link
              to={getLocalizedPath("/calculator/family-benefit")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-blue-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-gray-50 p-2 rounded-lg group-hover:bg-gray-100 transition-colors">
                  <Users className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">{t('other_calc_family_benefit')}</div>
                  <div className="text-sm text-gray-500">{t('other_calc_family_benefit_desc')}</div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Other Calculators */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-8 print:hidden">
          <h3 className="font-medium text-gray-900 mb-4">{t('passport_other_calculators')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to={getLocalizedPath("/calculator/traffic-fines")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-blue-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-gray-50 p-2 rounded-lg group-hover:bg-gray-100 transition-colors">
                  <Car className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">{t('other_calc_traffic_fines')}</div>
                  <div className="text-sm text-gray-500">{t('other_calc_traffic_fines_desc')}</div>
                </div>
              </div>
            </Link>
            <Link
              to={getLocalizedPath("/calculator/single-tax")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-blue-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                  <Receipt className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">{t('other_calc_single_tax')}</div>
                  <div className="text-sm text-gray-500">{t('other_calc_single_tax_desc')}</div>
                </div>
              </div>
            </Link>
            <Link
              to={getLocalizedPath("/calculator/family-benefit")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-blue-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-gray-50 p-2 rounded-lg group-hover:bg-gray-100 transition-colors">
                  <Users className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">{t('other_calc_family_benefit')}</div>
                  <div className="text-sm text-gray-500">{t('other_calc_family_benefit_desc')}</div>
                </div>
              </div>
            </Link>
          </div>
        </div>

      </div>

      {/* Full Price Matrix */}
      <div className="mt-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 print:py-6">
        <div className="bg-white rounded-xl shadow-sm p-8 print:shadow-none print:border">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {t('passport_fee_matrix')}
          </h2>
          
          <div className="space-y-8">
            {Object.entries(PASSPORT_FEES).map(([docKey, docData]) => (
              <div key={docKey} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  {docKey === 'id-card' ? (
                    <CreditCard className="h-6 w-6 text-blue-600 mr-3" />
                  ) : (
                    <FileText className="h-6 w-6 text-blue-600 mr-3" />
                  )}
                  {docData.name}
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('passport_table_reason')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('passport_table_18_days')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('passport_table_8_days')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('passport_table_4_days')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('passport_table_2_days')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(docData.causes).map(([causeKey, causeData]) => {
                        const isCurrentSelection = docKey === documentType && causeKey === causeType;
                        return (
                          <tr key={causeKey} className={isCurrentSelection ? 'bg-blue-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {causeData.name}
                            </td>
                            {Object.entries(causeData.urgency).map(([urgencyKey, urgencyData]) => {
                              const isCurrentCell = isCurrentSelection && urgencyKey === urgencyType;
                              return (
                                <td key={urgencyKey} className={`px-6 py-4 whitespace-nowrap text-sm ${
                                  isCurrentCell ? 'font-bold text-blue-600' : 'text-gray-900'
                                }`}>
                                  {formatCurrency(urgencyData.cost)} {t('passport_som')}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How to Apply */}
      <div className="mt-12 bg-white py-16 print:hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('passport_how_to_get')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('passport_how_to_get_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">{t('passport_required_docs')}</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                  <span className="text-gray-700">{t('passport_doc_1')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                  <span className="text-gray-700">{t('passport_doc_2')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">3</span>
                  <span className="text-gray-700">{t('passport_doc_3')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">4</span>
                  <span className="text-gray-700">{t('passport_doc_4')}</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">{t('passport_where_to_apply')}</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold">📍</span>
                  <span className="text-gray-700">{t('passport_apply_1')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold">🌐</span>
                  <span className="text-gray-700">{t('passport_apply_2')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold">📞</span>
                  <span className="text-gray-700">{t('passport_apply_3')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold">⏰</span>
                  <span className="text-gray-700">{t('passport_apply_4')}</span>
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
              <p className="font-semibold mb-2">{t('passport_important_title')}</p>
              <p className="mb-2">
                <strong>{t('passport_important_calc')}</strong> {t('passport_important_current')} {currentMonth}.
                {t('passport_important_payment')}
              </p>
              <p>
                {t('passport_important_contact')} <strong>{t('passport_important_con')}</strong> {t('passport_important_or')}
                <strong> tunduk.gov.kg</strong>.
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

export default PassportCalculatorPage;