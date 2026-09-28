import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Info, Home, Search, Car, AlertTriangle, Scale, Clock, Shield, CreditCard, FileText } from 'lucide-react';
import ActionButtons from '../components/ActionButtons';
import SchemaMarkup from '../components/SchemaMarkup';
import HreflangTags from '../components/HreflangTags';
import FAQSchema from '../components/FAQSchema';
import { useLanguage } from '../contexts/LanguageContext';
import {
  generateCalculatorSchema,
  generateBreadcrumbSchema,
  generateSoftwareApplicationSchema
} from '../utils/schemaGenerator';
import { formatVerifiedMonth } from '../utils/dateFormatter';
import { TRAFFIC_FINES, TrafficFine as TrafficFineData } from '../data/trafficFines';
import { TrafficFinesCalculatorArticle } from '../components/TrafficFinesCalculatorArticle';

// Интерфейс для отображения штрафов
interface TrafficFine {
  id: string;
  category: string;
  name: string;
  fine: number;
  article: string;
  notes: string;
  // Скидка 70% (ст.563 ч.5 КоП). Берётся из notesId: раньше искали «скидка 70%»
  // в тексте примечания, и на кыргызской версии скидка не показывалась нигде.
  discount: boolean;
  keywords: string[];
}

const OSAGO_URL = 'https://polisonline.kg/';

const TrafficFinesCalculatorPage = () => {
  const { language, t, getLocalizedPath} = useLanguage();

  // Функция для получения переведенных штрафов
  const getTranslatedFines = (): TrafficFine[] => {
    return TRAFFIC_FINES.map(fine => ({
      id: fine.id,
      category: t(`traffic_cat_${fine.categoryId}` as any),
      name: t(`traffic_${fine.id}` as any),
      fine: fine.fine,
      article: fine.article,
      notes: t(`traffic_note_${fine.notesId}` as any),
      discount: fine.notesId.startsWith('discount_70'),
      keywords: fine.keywords
    }));
  };

  // Использовать переведенные штрафы
  const PDD_FINES_KG = getTranslatedFines();

  React.useEffect(() => {
    document.title = t('traffic_fines_calc_title') + " | Calk.KG";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('traffic_fines_calc_subtitle'));
    }
  }, [t]);

  // Генерация схем для страницы справочника штрафов
  const generateSchemas = () => {
    const currentUrl = language === 'ky' ? "https://calk.kg/ky/calculator/traffic-fines/" : "https://calk.kg/calculator/traffic-fines/";
    const homeUrl = language === 'ky' ? "https://calk.kg/ky" : "https://calk.kg";
    
    const calculatorSchema = generateCalculatorSchema({
      url: currentUrl,
      title: t('traffic_fines_calc_title'),
      description: t('traffic_fines_calc_subtitle'),
      calculatorName: t('traffic_fines_calc_title'),
      category: t('nav_other'),
      language,
      inputProperties: ["violationType", "searchTerm"],
      outputProperties: ["fineAmount", "discountAmount", "legalBasis"]
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: homeUrl },
      { name: t('nav_other'), url: `${homeUrl}?category=other` },
      { name: t('traffic_fines_calc_title'), url: currentUrl }
    ]);

    return [calculatorSchema, breadcrumbSchema];
  };

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFine, setSelectedFine] = useState<TrafficFine | null>(null);
  const [filteredFines, setFilteredFines] = useState<TrafficFine[]>([]);
  const [showAllFines, setShowAllFines] = useState<boolean>(true);

  // Фильтрация штрафов по поисковому запросу
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFines([]);
      return;
    }

    const filtered = PDD_FINES_KG.filter(fine => {
      const searchLower = searchTerm.toLowerCase();
      return (
        fine.name.toLowerCase().includes(searchLower) ||
        fine.category.toLowerCase().includes(searchLower) ||
        fine.keywords.some(keyword => keyword.includes(searchLower))
      );
    });

    setFilteredFines(filtered);
  }, [searchTerm]);

  // Группировка штрафов по категориям
  const getGroupedFines = () => {
    const grouped: { [key: string]: TrafficFine[] } = {};
    
    PDD_FINES_KG.forEach(fine => {
      if (!grouped[fine.category]) {
        grouped[fine.category] = [];
      }
      grouped[fine.category].push(fine);
    });

    return grouped;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-KG', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Расчет скидки при быстрой оплате
  const calculateDiscountedFine = (originalFine: number, hasDiscount: boolean) => {
    if (!hasDiscount) return originalFine;
    return originalFine * 0.3; // 70% скидка = платим 30%
  };

  const detailsRef = useRef<HTMLDivElement>(null);

  const handleFineSelect = (fine: TrafficFine) => {
    setSelectedFine(fine);
    setSearchTerm('');
    setFilteredFines([]);
  };

  // Карточка штрафа стоит над таблицей — без прокрутки клик по строке внизу
  // выглядел бы как «ничего не произошло».
  useEffect(() => {
    if (selectedFine) detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [selectedFine]);

  const hasDiscount = selectedFine ? selectedFine.discount : false;
  const discountedAmount = selectedFine ? calculateDiscountedFine(selectedFine.fine, hasDiscount) : 0;

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

  const currentMonth = formatVerifiedMonth(language, 'traffic-fines');
  const groupedFines = getGroupedFines();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org микроразметка */}
      <Helmet>
        <title>{t('traffic_fines_calc_title')} | Calk.KG</title>
        <meta name="description" content={t('traffic_fines_calc_subtitle')} />
        <meta name="keywords" content={t('traffic_fines_keywords')} />
        <meta property="og:title" content={`${t('traffic_fines_calc_title')} | Calk.KG`} />
        <meta property="og:description" content={t('traffic_fines_calc_subtitle')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/traffic-fines/" : "https://calk.kg/calculator/traffic-fines/"} />
        <meta property="og:image" content="https://calk.kg/og-images/traffic-fines.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta property="og:site_name" content="Calk.KG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('traffic_fines_calc_title')} | Calk.KG`} />
        <meta name="twitter:description" content={t('traffic_fines_calc_subtitle')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/traffic-fines.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/traffic-fines/" : "https://calk.kg/calculator/traffic-fines/"} />
      </Helmet>
      <HreflangTags path="/calculator/traffic-fines" />
      <FAQSchema translationPrefix="trafficfines" />
      {/* Schema.org микроразметка */}
      {generateSchemas().map((schema, index) => (
        <SchemaMarkup key={index} schema={schema} />
      ))}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to={getLocalizedPath("/")} 
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>{t('back')}</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <Link to={getLocalizedPath("/")} className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-red-600 to-red-700 p-2 rounded-lg">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">Calk.KG</span>
              </Link>
            </div>
            <Link 
              to={getLocalizedPath("/")}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>{t('home')}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Car className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{t('traffic_fines_calc_title')}</h1>
              <p className="text-red-100 text-lg">{t('traffic_fines_calc_subtitle')}</p>
            </div>
          </div>
          
          {/* Data Currency Notice */}
          <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3">
            <Scale className="h-5 w-5 text-amber-200" />
            <span className="text-amber-100 text-sm">
              {t('traffic_data_actual')} {currentMonth} • {t('traffic_based_on')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Проверка и оплата — первое, что ищут по «штрафы kg / штраф кж»:
            сам штраф по номеру показывает только госреестр, поэтому ведём туда. */}
        <section aria-labelledby="fines-check-title" className="bg-white rounded-xl shadow-sm border border-red-100 p-6 sm:p-8 mb-12">
          <h2 id="fines-check-title" className="text-2xl font-semibold text-gray-900 mb-3">{t('traffic_check_title')}</h2>
          <p className="text-gray-600 mb-6">{t('traffic_check_intro')}</p>
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <a
              href={language === 'ky' ? 'https://carcheck.gov.kg/ky' : 'https://carcheck.gov.kg/ru'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
              {t('traffic_check_button')}
            </a>
            <a
              href="https://egov.kg/ru/gov-services/2607"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:border-red-300 hover:text-red-700 transition-colors"
            >
              <FileText className="h-5 w-5" aria-hidden="true" />
              {t('traffic_check_egov')}
            </a>
          </div>
          <p className="text-xs text-gray-500 mb-8">{t('traffic_check_source')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-5">
              <h3 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" aria-hidden="true" />
                {t('traffic_check_discount_title')}
              </h3>
              <p className="text-sm text-green-800 leading-relaxed">{t('traffic_check_discount_text')}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-5">
              <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-gray-600" aria-hidden="true" />
                {t('traffic_check_pay_title')}
              </h3>
              <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                <li>{t('traffic_payment_2')}</li>
                <li>{t('traffic_payment_3')}</li>
                <li>{t('traffic_payment_1')}</li>
              </ul>
              <p className="text-sm text-gray-600 mt-3">{t('traffic_check_pay_note')}</p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('traffic_search_title')}</h2>

          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={t('traffic_search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg"
            />
          </div>

          {/* Search Results */}
          {searchTerm && filteredFines.length > 0 && (
            <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
              {filteredFines.map((fine, index) => (
                <button
                  key={index}
                  onClick={() => handleFineSelect(fine)}
                  className="w-full text-left p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="text-sm text-red-600 font-medium mb-1">{fine.category}</div>
                      <div className="text-gray-900 font-medium mb-1">{fine.name}</div>
                      <div className="text-xs text-gray-500">{fine.article}</div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-red-600">
                        {formatCurrency(fine.fine)} {t('traffic_som')}
                      </div>
                      {fine.discount && (
                        <div className="text-xs text-green-600">
                          {formatCurrency(calculateDiscountedFine(fine.fine, true))} {t('traffic_with_discount')}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {searchTerm && filteredFines.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>{t('traffic_not_found').replace('{searchTerm}', searchTerm)}</p>
              <p className="text-sm mt-1">{t('traffic_try_different')}</p>
            </div>
          )}

          {/* Browse All Categories Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAllFines(!showAllFines)}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              {showAllFines ? t('traffic_hide_categories') : t('traffic_show_categories')}
            </button>
          </div>
        </div>

        {/* Selected Fine Details */}
        {selectedFine && (
          <div ref={detailsRef} className="bg-white rounded-xl shadow-sm p-8 mb-12 scroll-mt-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Scale className="h-6 w-6 text-red-600 mr-3" />
              {t('traffic_fine_info')}
            </h2>

            <div className="space-y-6">
              {/* Fine Amount */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-8 text-white text-center">
                <div className="flex items-center justify-center mb-2">
                  <Car className="h-6 w-6 mr-2" />
                  <span className="text-red-100">{t('traffic_fine_amount')}</span>
                </div>
                <p className="text-5xl font-bold mb-2">
                  {formatCurrency(selectedFine.fine)} {t('traffic_som')}
                </p>
                {hasDiscount && (
                  <p className="text-red-100">
                    {t('traffic_quick_payment')} {formatCurrency(discountedAmount)} {t('traffic_som')}
                  </p>
                )}
              </div>

              {/* Violation Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-700 mb-3">{t('traffic_details')}</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500">{t('traffic_category')}</div>
                      <div className="font-medium text-red-600">{selectedFine.category}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{t('traffic_violation')}</div>
                      <div className="font-medium text-gray-900">{selectedFine.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{t('traffic_legal_basis')}</div>
                      <div className="font-medium text-gray-900">{selectedFine.article}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-700 mb-3">{t('traffic_important_info')}</h4>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600 leading-relaxed">
                      {selectedFine.notes}
                    </div>

                    {selectedFine.id.startsWith('no_insurance') && (
                      <a href={OSAGO_URL} target="_blank" rel="noopener" className="inline-block text-sm font-medium text-blue-700 hover:underline">
                        {t('traffic_osago_link')} →
                      </a>
                    )}

                    {hasDiscount && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-800">{t('traffic_discount_title')}</span>
                        </div>
                        <div className="text-sm text-green-700">
                          {t('traffic_fine_size')} <strong>{formatCurrency(selectedFine.fine)} {t('traffic_som')}</strong><br/>
                          {t('traffic_to_pay')} <strong>{formatCurrency(discountedAmount)} {t('traffic_som')}</strong><br/>
                          {t('traffic_savings')} <strong>{formatCurrency(selectedFine.fine - discountedAmount)} {t('traffic_som')}</strong>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Таблица штрафов — видна сразу и попадает в пререндер. Раньше список был
            спрятан за кнопкой, и по «таблица штрафов ПДД» Google не видел ни строки. */}
        {showAllFines && (
          <section aria-labelledby="fines-table-title" className="bg-white rounded-xl shadow-sm p-4 sm:p-8 mb-12">
            <h2 id="fines-table-title" className="text-xl font-semibold text-gray-900 mb-6">{t('traffic_table_title')}</h2>

            <div className="space-y-8">
              {Object.entries(groupedFines).map(([category, fines]) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-3" aria-hidden="true"></span>
                    {category}
                  </h3>
                  <table className="w-full text-sm table-fixed">
                    <thead>
                      <tr className="text-left text-gray-500 border-b border-gray-200">
                        <th scope="col" className="py-2 pr-3 font-medium">{t('traffic_table_col_violation')}</th>
                        <th scope="col" className="hidden sm:table-cell w-28 py-2 pr-3 font-medium">{t('traffic_table_col_article')}</th>
                        <th scope="col" className="w-24 sm:w-28 py-2 pr-3 font-medium text-right">{t('traffic_table_col_fine')}</th>
                        <th scope="col" className="w-24 sm:w-32 py-2 font-medium text-right">{t('traffic_table_col_discount')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fines.map(fine => (
                        <tr key={fine.id} className="border-b border-gray-100 last:border-b-0 align-top">
                          <td className="py-3 pr-3">
                            <button
                              type="button"
                              onClick={() => handleFineSelect(fine)}
                              className="text-left font-medium text-gray-900 hover:text-red-600 transition-colors"
                            >
                              {fine.name}
                            </button>
                            <span className="sm:hidden block text-xs text-gray-500 mt-1">{fine.article}</span>
                            {fine.id.startsWith('no_insurance') && (
                              <a href={OSAGO_URL} target="_blank" rel="noopener" className="block mt-1 text-xs font-medium text-blue-700 hover:underline">
                                {t('traffic_osago_link')} →
                              </a>
                            )}
                          </td>
                          <td className="hidden sm:table-cell py-3 pr-3 text-gray-500 whitespace-nowrap">{fine.article}</td>
                          <td className="py-3 pr-3 text-right font-semibold text-red-600 whitespace-nowrap">
                            {formatCurrency(fine.fine)} {t('traffic_som')}
                          </td>
                          <td className="py-3 text-right text-green-700 whitespace-nowrap">
                            {fine.discount ? `${formatCurrency(calculateDiscountedFine(fine.fine, true))} ${t('traffic_som')}` : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Statistics */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-12">
          <h3 className="font-medium text-gray-900 mb-6">{t('traffic_statistics')}</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {PDD_FINES_KG.length}
              </div>
              <div className="text-gray-600">{t('traffic_violation_types')}</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {Object.keys(groupedFines).length}
              </div>
              <div className="text-gray-600">{t('traffic_categories_count')}</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {formatCurrency(Math.min(...PDD_FINES_KG.map(f => f.fine)))} - {formatCurrency(Math.max(...PDD_FINES_KG.map(f => f.fine)))}
              </div>
              <div className="text-gray-600">{t('traffic_fine_range')}</div>
            </div>
          </div>
        </div>

        {/* Quick Examples */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-12">
          <h3 className="font-medium text-gray-900 mb-4">{t('traffic_frequent_violations')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              PDD_FINES_KG.find(f => f.keywords.includes("превышение")),
              PDD_FINES_KG.find(f => f.keywords.includes("светофор")),
              PDD_FINES_KG.find(f => f.keywords.includes("парковка")),
              PDD_FINES_KG.find(f => f.keywords.includes("телефон")),
              PDD_FINES_KG.find(f => f.keywords.includes("ремень")),
              PDD_FINES_KG.find(f => f.keywords.includes("алкоголь"))
            ].filter(Boolean).map((fine, index) => (
              <button
                key={index}
                onClick={() => handleFineSelect(fine!)}
                className="text-left p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium text-sm">
                    {fine!.name.length > 40 ? fine!.name.substring(0, 40) + '...' : fine!.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-red-600 font-semibold">
                    {formatCurrency(fine!.fine)} {t('traffic_som')}
                  </div>
                  <div className="text-xs text-gray-500">
                    {fine!.article}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Other Calculators */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-12">
          <h3 className="font-medium text-gray-900 mb-4">{t('other_calculators')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to={getLocalizedPath("/calculator/customs/")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-red-50 p-2 rounded-lg group-hover:bg-red-100 transition-colors">
                  <Car className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-red-600">{t('traffic_customs_calc')}</div>
                  <div className="text-sm text-gray-500">{t('traffic_customs_desc')}</div>
                </div>
              </div>
            </Link>
            <Link
              to={getLocalizedPath("/calculator/auto-loan/")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-red-50 p-2 rounded-lg group-hover:bg-red-100 transition-colors">
                  <Car className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-red-600">{t('traffic_auto_loan')}</div>
                  <div className="text-sm text-gray-500">{t('traffic_auto_loan_desc')}</div>
                </div>
              </div>
            </Link>
            <Link
              to={getLocalizedPath("/calculator/passport/")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-red-600">{t('traffic_passport_cost')}</div>
                  <div className="text-sm text-gray-500">{t('traffic_passport_desc')}</div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-2">{t('traffic_disclaimer_title')}</p>
              <p className="mb-2">
                <strong>{t('traffic_disclaimer_1')}</strong> {t('traffic_disclaimer_2')} {currentMonth}.
                {t('traffic_disclaimer_3')}
              </p>
              <p>
                {t('traffic_disclaimer_4')}
                <strong> {t('traffic_disclaimer_5')}</strong>
                {t('traffic_disclaimer_6')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <TrafficFinesCalculatorArticle />
    </div>
  );
};

export default TrafficFinesCalculatorPage;