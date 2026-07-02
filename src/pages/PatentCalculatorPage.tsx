import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Info, Home, Printer, Building2, MapPin, Search, AlertTriangle, Calendar, Receipt, Car, CreditCard } from 'lucide-react';
import ActionButtons from '../components/ActionButtons';
import SchemaMarkup from '../components/SchemaMarkup';
import HreflangTags from '../components/HreflangTags';
import FAQSchema from '../components/FAQSchema';
import { useLanguage } from '../contexts/LanguageContext';
import { PatentCalculatorArticle } from '../components/PatentCalculatorArticle';
import {
  generateCalculatorSchema,
  generateBreadcrumbSchema,
  generateSoftwareApplicationSchema
} from '../utils/schemaGenerator';
import { formatCurrentMonth } from '../utils/dateFormatter';

// ============================================================================
// КОНФИГУРАЦИЯ ТАРИФОВ НА ПАТЕНТЫ ДЛЯ ИП В КЫРГЫЗСТАНЕ
// ============================================================================
// АКТУАЛЬНО НА: Май 2026 (тарифы 2026 года, без изменений с января)
// ИСТОЧНИК: Налоговая служба КР (salyk.kg), Постановления местных кенешей
// ПОСЛЕДНЕЕ ОБНОВЛЕНИЕ: 03.05.2026 (проверка актуальности)
// 
// ⚠️ ВНИМАНИЕ: Ставки патента устанавливаются местными кенешами и могут 
// отличаться от указанных. Перед оплатой обязательно уточните актуальные 
// тарифы в районной налоговой инспекции по месту деятельности.
//
// СТРУКТУРА: Регион → Вид деятельности → Стоимость (сом/месяц)
// ============================================================================
const PATENT_RATES = {
  'bishkek': {
    nameKey: 'region_bishkek',
    activities: {
      'hairdresser-1': { nameKey: 'activity_hairdresser_1', cost: 2000 },
      'taxi-1': { nameKey: 'activity_taxi_1', cost: 500 },
      'shoe-repair-1': { nameKey: 'activity_shoe_repair_1', cost: 1000 },
      'tailoring-1': { nameKey: 'activity_tailoring_1', cost: 700 },
      'photo-services-1': { nameKey: 'activity_photo_services_1', cost: 3000 },
      'computer-repair-1': { nameKey: 'activity_computer_repair_1', cost: 3000 },
      'tutoring': { nameKey: 'activity_tutoring', cost: 600 },
      'electronics-repair': { nameKey: 'activity_electronics_repair', cost: 2000 }
    }
  },
  'osh': {
    nameKey: 'region_osh',
    activities: {
      'hairdresser-1': { nameKey: 'activity_hairdresser_1', cost: 2000 },
      'taxi-1': { nameKey: 'activity_taxi_1', cost: 500 },
      'shoe-repair-1': { nameKey: 'activity_shoe_repair_1', cost: 1000 },
      'tailoring-1': { nameKey: 'activity_tailoring_1', cost: 700 },
      'photo-services-1': { nameKey: 'activity_photo_services_1', cost: 3000 },
      'tutoring': { nameKey: 'activity_tutoring', cost: 600 },
      'electronics-repair': { nameKey: 'activity_electronics_repair', cost: 2000 },
      'computer-repair-1': { nameKey: 'activity_computer_repair_1', cost: 3000 }
    }
  },
  'jalal-abad': {
    nameKey: 'region_jalal_abad',
    activities: {
      'hairdresser-1': { nameKey: 'activity_hairdresser_1', cost: 2000 },
      'taxi-1': { nameKey: 'activity_taxi_1', cost: 500 },
      'shoe-repair-1': { nameKey: 'activity_shoe_repair_1', cost: 1000 },
      'tailoring-1': { nameKey: 'activity_tailoring_1', cost: 700 },
      'tutoring': { nameKey: 'activity_tutoring', cost: 600 },
      'electronics-repair': { nameKey: 'activity_electronics_repair', cost: 2000 },
      'computer-repair-1': { nameKey: 'activity_computer_repair_1', cost: 3000 },
      'photo-services-1': { nameKey: 'activity_photo_services_1', cost: 3000 },
    }
  },
  'karakol': {
    nameKey: 'region_karakol',
    activities: {
      'hairdresser-1': { nameKey: 'activity_hairdresser_1', cost: 2000 },
      'taxi-1': { nameKey: 'activity_taxi_1', cost: 500 },
      'shoe-repair-1': { nameKey: 'activity_shoe_repair_1', cost: 1000 },
      'tailoring-1': { nameKey: 'activity_tailoring_1', cost: 700 },
    }
  },
  'tokmok': {
    nameKey: 'region_tokmok',
    activities: {
      'hairdresser-1': { nameKey: 'activity_hairdresser_1', cost: 2000 },
      'taxi-1': { nameKey: 'activity_taxi_1', cost: 500 },
      'shoe-repair-1': { nameKey: 'activity_shoe_repair_1', cost: 1000 },
      'tailoring-1': { nameKey: 'activity_tailoring_1', cost: 700 }
    }
  },
  'naryn': {
    nameKey: 'region_naryn',
    activities: {
      'hairdresser-1': { nameKey: 'activity_hairdresser_1', cost: 2000 },
      'taxi-1': { nameKey: 'activity_taxi_1', cost: 500 },
      'shoe-repair-1': { nameKey: 'activity_shoe_repair_1', cost: 1000 },
      'tailoring-1': { nameKey: 'activity_tailoring_1', cost: 700 }
    }
  },
  'talas': {
    nameKey: 'region_talas',
    activities: {
      'hairdresser-1': { nameKey: 'activity_hairdresser_1', cost: 2000 },
      'taxi-1': { nameKey: 'activity_taxi_1', cost: 500 },
      'shoe-repair-1': { nameKey: 'activity_shoe_repair_1', cost: 1000 },
      'tailoring-1': { nameKey: 'activity_tailoring_1', cost: 700 }
    }
  },
  'batken': {
    nameKey: 'region_batken',
    activities: {
      'hairdresser-1': { nameKey: 'activity_hairdresser_1', cost: 2000 },
      'taxi-1': { nameKey: 'activity_taxi_1', cost: 500 },
      'shoe-repair-1': { nameKey: 'activity_shoe_repair_1', cost: 1000 },
      'tailoring-1': { nameKey: 'activity_tailoring_1', cost: 700 }
    }
  },
  'osh-region': {
    nameKey: 'region_osh_region',
    activities: {
      'hairdresser-1': { nameKey: 'activity_hairdresser_1', cost: 2000 },
      'taxi-1': { nameKey: 'activity_taxi_1', cost: 500 },
      'tailoring-1': { nameKey: 'activity_tailoring_1', cost: 700 }
    }
  },
  'jalal-abad-region': {
    nameKey: 'region_jalal_abad_region',
    activities: {
      'hairdresser-1': { nameKey: 'activity_hairdresser_1', cost: 2000 },
      'taxi-1': { nameKey: 'activity_taxi_1', cost: 500 },
      'tailoring-1': { nameKey: 'activity_tailoring_1', cost: 700 }
    }
  },
  'issyk-kul-region': {
    nameKey: 'region_issyk_kul_region',
    activities: {
      'hairdresser-1': { nameKey: 'activity_hairdresser_1', cost: 2000 },
      'taxi-1': { nameKey: 'activity_taxi_1', cost: 500 },
      'tailoring-1': { nameKey: 'activity_tailoring_1', cost: 700 }
    }
  },
  'naryn-region': {
    nameKey: 'region_naryn_region',
    activities: {
      'hairdresser-1': { nameKey: 'activity_hairdresser_1', cost: 2000 },
      'taxi-1': { nameKey: 'activity_taxi_1', cost: 500 },
      'tailoring-1': { nameKey: 'activity_tailoring_1', cost: 700 }
    }
  },
  'talas-region': {
    nameKey: 'region_talas_region',
    activities: {
      'hairdresser-1': { nameKey: 'activity_hairdresser_1', cost: 2000 },
      'taxi-1': { nameKey: 'activity_taxi_1', cost: 500 },
      'tailoring-1': { nameKey: 'activity_tailoring_1', cost: 700 }
    }
  },
  'chui-region': {
    nameKey: 'region_chui_region',
    activities: {
      'hairdresser-1': { nameKey: 'activity_hairdresser_1', cost: 2000 },
      'taxi-1': { nameKey: 'activity_taxi_1', cost: 500 },
      'tailoring-1': { nameKey: 'activity_tailoring_1', cost: 700 },
      'tutoring': { nameKey: 'activity_tutoring', cost: 600 },
      'electronics-repair': { nameKey: 'activity_electronics_repair', cost: 2000 },
      'computer-repair-1': { nameKey: 'activity_computer_repair_1', cost: 3000 },
      'photo-services-1': { nameKey: 'activity_photo_services_1', cost: 3000 },
      'shoe-repair-1': { nameKey: 'activity_shoe_repair_1', cost: 1000 },
    }
  },
  'batken-region': {
    nameKey: 'region_batken_region',
    activities: {
      'hairdresser-1': { nameKey: 'activity_hairdresser_1', cost: 2000 },
      'taxi-1': { nameKey: 'activity_taxi_1', cost: 500 },
      'tailoring-1': { nameKey: 'activity_tailoring_1', cost: 700 }
    }
  }
};

type Region = keyof typeof PATENT_RATES;

interface PatentResults {
  regionKey: string;
  activityKey: string;
  monthlyCost: number;
  yearlyCost: number;
  hasData: boolean;
}

interface PatentEntry {
  id: string;
  region: Region;
  activity: string;
  monthlyCost: number;
}

interface ComparisonData {
  monthlyRevenue: number;
  singleTaxRate: number;
  patentCost: number;
  singleTaxCost: number;
  recommended: 'patent' | 'single-tax';
  economy: number;
  breakEvenPoint: number;
}

interface PaymentSchedule {
  month: number;
  amount: number;
  deadline: string;
}

const PatentCalculatorPage = () => {
  const { language, t, getLocalizedPath} = useLanguage();

  React.useEffect(() => {
    document.title = t('patent_calc_title') + " | Calk.KG";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('patent_calc_description'));
    }
  }, [t]);

  // Генерация схем для страницы калькулятора патентов
  const generateSchemas = () => {
    const currentUrl = language === 'ky' ? "https://calk.kg/ky/calculator/patent/" : "https://calk.kg/calculator/patent/";
    const homeUrl = language === 'ky' ? "https://calk.kg/ky" : "https://calk.kg";
    
    const calculatorSchema = generateCalculatorSchema({
      url: currentUrl,
      title: t('patent_calc_title'),
      description: t('patent_calc_subtitle'),
      calculatorName: t('patent_calc_title'),
      category: t('nav_finance'),
      language,
      inputProperties: ["region", "activityType"],
      outputProperties: ["monthlyCost", "yearlyCost"]
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: homeUrl },
      { name: t('nav_finance'), url: `${homeUrl}?category=finance` },
      { name: t('patent_calc_title'), url: currentUrl }
    ]);

    return [calculatorSchema, breadcrumbSchema];
  };

  const [selectedRegion, setSelectedRegion] = useState<Region>('bishkek');
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const [results, setResults] = useState<PatentResults>({
    regionKey: '',
    activityKey: '',
    monthlyCost: 0,
    yearlyCost: 0,
    hasData: false
  });

  // Новые state для расширенного функционала
  const [mode, setMode] = useState<'single' | 'multi' | 'comparison'>('single');
  
  // Для сравнения с единым налогом
  const [monthlyRevenue, setMonthlyRevenue] = useState<string>('50000');
  const [expensesPercent, setExpensesPercent] = useState<string>('30');
  
  // Для нескольких патентов
  const [patents, setPatents] = useState<PatentEntry[]>([]);
  
  // Для календаря оплаты
  const [paymentFrequency, setPaymentFrequency] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

  // Получение доступных видов деятельности для выбранного региона
  const getAvailableActivities = (region: Region) => {
    return Object.entries(PATENT_RATES[region].activities).map(([key, activity]) => ({
      id: key,
      nameKey: activity.nameKey,
      cost: activity.cost
    }));
  };

  // Фильтрация видов деятельности по поисковому запросу
  const getFilteredActivities = () => {
    const activities = getAvailableActivities(selectedRegion);
    if (!searchTerm) return activities;

    return activities.filter(activity =>
      t(activity.nameKey).toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Сброс выбранной деятельности при смене региона
  useEffect(() => {
    setSelectedActivity('');
    setSearchTerm('');
  }, [selectedRegion]);

  // Расчет стоимости патента
  useEffect(() => {
    if (selectedRegion && selectedActivity) {
      const regionData = PATENT_RATES[selectedRegion];
      const activityData = regionData.activities[selectedActivity as keyof typeof regionData.activities];

      if (activityData) {
        setResults({
          regionKey: regionData.nameKey,
          activityKey: activityData.nameKey,
          monthlyCost: activityData.cost,
          yearlyCost: activityData.cost * 12,
          hasData: true
        });
      } else {
        setResults({
          regionKey: regionData.nameKey,
          activityKey: '',
          monthlyCost: 0,
          yearlyCost: 0,
          hasData: false
        });
      }
    } else {
      setResults({
        regionKey: '',
        activityKey: '',
        monthlyCost: 0,
        yearlyCost: 0,
        hasData: false
      });
    }
  }, [selectedRegion, selectedActivity]);

  // Функции для расширенного функционала
  
  // Расчет сравнения с единым налогом
  const calculateComparison = (revenue: number, patentCost: number): ComparisonData => {
    const singleTaxRate = 0.02; // услуги 2% (единый налог по видам: 1% торговля/такси, 2% услуги, 3-5% общепит)
    const singleTaxCost = revenue * singleTaxRate;
    const economy = Math.abs(patentCost - singleTaxCost);
    const recommended = patentCost < singleTaxCost ? 'patent' : 'single-tax';
    const breakEvenPoint = patentCost / singleTaxRate;
    
    return {
      monthlyRevenue: revenue,
      singleTaxRate: singleTaxRate * 100,
      patentCost,
      singleTaxCost,
      recommended,
      economy,
      breakEvenPoint
    };
  };

  // Добавить патент в список
  const addPatent = () => {
    if (selectedActivity && results.hasData) {
      const newPatent: PatentEntry = {
        id: Date.now().toString(),
        region: selectedRegion,
        activity: selectedActivity,
        monthlyCost: results.monthlyCost
      };
      setPatents([...patents, newPatent]);
      // Сбросить выбранную активность после добавления
      setSelectedActivity('');
    }
  };

  // Удалить патент из списка
  const removePatent = (id: string) => {
    setPatents(patents.filter(p => p.id !== id));
  };

  // Рассчитать общую стоимость всех патентов
  const calculateTotalPatentsCost = () => {
    return patents.reduce((sum, patent) => sum + patent.monthlyCost, 0);
  };

  // Генерация календаря оплаты
  const generatePaymentSchedule = (monthlyCost: number, frequency: string): PaymentSchedule[] => {
    const schedule: PaymentSchedule[] = [];
    const year = new Date().getFullYear();
    
    if (frequency === 'monthly') {
      for (let month = 1; month <= 12; month++) {
        schedule.push({
          month,
          amount: monthlyCost,
          deadline: `25.${month < 10 ? '0' + month : month}.${year}`
        });
      }
    } else if (frequency === 'quarterly') {
      for (let quarter = 1; quarter <= 4; quarter++) {
        const month = quarter * 3;
        schedule.push({
          month,
          amount: monthlyCost * 3,
          deadline: `25.${month < 10 ? '0' + month : month}.${year}`
        });
      }
    } else {
      schedule.push({
        month: 12,
        amount: monthlyCost * 12,
        deadline: `25.12.${year}`
      });
    }
    
    return schedule;
  };

  const getMonthName = (monthNum: number) => {
    const months = [
      'patent_month_jan', 'patent_month_feb', 'patent_month_mar', 'patent_month_apr',
      'patent_month_may', 'patent_month_jun', 'patent_month_jul', 'patent_month_aug',
      'patent_month_sep', 'patent_month_oct', 'patent_month_nov', 'patent_month_dec'
    ];
    return t(months[monthNum - 1]);
  };

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
  const filteredActivities = getFilteredActivities();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org микроразметка */}
      <Helmet>
        <title>{t('patent_calc_title')} | Calk.KG</title>
        <meta name="description" content={t('patent_calc_subtitle')} />
        <meta name="keywords" content={t('patent_keywords')} />
        <meta property="og:title" content={`${t('patent_calc_title')} | Calk.KG`} />
        <meta property="og:description" content={t('patent_calc_subtitle')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/patent/" : "https://calk.kg/calculator/patent/"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/patent.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta property="og:site_name" content="Calk.KG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('patent_calc_title')} | Calk.KG`} />
        <meta name="twitter:description" content={t('patent_calc_subtitle')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/patent.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/patent/" : "https://calk.kg/calculator/patent/"} />
      </Helmet>
      <HreflangTags path="/calculator/patent" />
      <FAQSchema translationPrefix="patent" />
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
              <Building2 className="h-8 w-8 print:text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold print:text-2xl">{t('patent_calc_title')}</h1>
              <p className="text-red-100 text-lg print:text-gray-600">{t('patent_calc_subtitle')}</p>
            </div>
          </div>
          
          {/* Data Currency Notice */}
          <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3 print:hidden">
            <Calendar className="h-5 w-5 text-amber-200" />
            <span className="text-amber-100 text-sm">
              {t('patent_rates_actual')} {currentMonth} • {t('patent_rates_info')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 print:py-6">
        {/* Mode Switcher */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 print:hidden">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setMode('single')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                mode === 'single'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('patent_single_mode')}
            </button>
            <button
              onClick={() => setMode('multi')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                mode === 'multi'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('patent_multi_mode')}
            </button>
            <button
              onClick={() => setMode('comparison')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                mode === 'comparison'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('patent_vs_single_tax')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 print:gap-6">
          {/* Input Section */}
          <div className="space-y-8 print:break-inside-avoid">
            <div className="bg-white rounded-xl shadow-sm p-8 print:shadow-none print:border">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('patent_parameters')}</h2>
              
              {/* Region Selection */}
              <div className="mb-8">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('patent_region_city')}
                  </label>
                  <Tooltip text={t('patent_region_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value as Region)}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg print:text-base"
                >
                  {Object.entries(PATENT_RATES).map(([key, region]) => (
                    <option key={key} value={key}>{t(region.nameKey)}</option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-2">
                  {t('patent_available_activities')} {Object.keys(PATENT_RATES[selectedRegion].activities).length}
                </p>
              </div>

              {/* Activity Search */}
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('patent_search_activity')}
                  </label>
                  <Tooltip text={t('patent_search_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('placeholder_search_activities')}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              {/* Activity Selection */}
              <div className="mb-8">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('patent_activity_type')}
                  </label>
                  <Tooltip text={t('patent_activity_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>

                {filteredActivities.length > 0 ? (
                  <select
                    value={selectedActivity}
                    onChange={(e) => setSelectedActivity(e.target.value)}
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg print:text-base"
                  >
                    <option value="">{t('patent_select_activity')}</option>
                    {filteredActivities.map((activity) => (
                      <option key={activity.id} value={activity.id}>
                        {t(activity.nameKey)} - {formatCurrency(activity.cost)} {t('patent_som_per_month')}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>{t('patent_no_results')} "{searchTerm}" {t('patent_nothing_found')}</p>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-red-600 text-sm hover:text-red-700 transition-colors mt-2"
                    >
                      {t('patent_clear_search')}
                    </button>
                  </div>
                )}
              </div>

              {/* Info Block */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-2">{t('patent_info_title')}</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>{t('patent_info_monthly')}</li>
                      <li>{t('patent_info_local_rates')}</li>
                      <li>{t('patent_info_multiple_months')}</li>
                      <li>{t('patent_info_exempts')}</li>
                    </ul>
                    <p className="mt-3">
                      💡 <strong>{t('patent_tax_regime_choice')}</strong> {t('patent_compare_with_single_tax')}
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
                <h2 className="text-xl font-semibold text-gray-900">{t('patent_cost')}</h2>
                {results.hasData && (
                  <button
                    onClick={handlePrint}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors print:hidden"
                  >
                    <Printer className="h-4 w-4" />
                    <span>{t('print')}</span>
                  </button>
                )}
              </div>
              
              {results.hasData ? (
                <div className="space-y-6">
                  {/* Monthly Cost - Main Result */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 text-white text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Building2 className="h-6 w-6 mr-2" />
                      <span className="text-blue-100">{t('patent_monthly_cost_label')}</span>
                    </div>
                    <p className="text-5xl font-bold mb-2">
                      {formatCurrency(results.monthlyCost)} {t('patent_som')}
                    </p>
                    <p className="text-blue-100">
                      {t(results.regionKey)}
                    </p>
                  </div>

                  {/* Activity Details */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <span className="text-gray-700 font-medium">{t('patent_activity_label')}</span>
                        <Tooltip text={t('patent_activity_specific_tooltip')}>
                          <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                        </Tooltip>
                      </div>
                    </div>
                    <p className="text-gray-900 text-sm leading-relaxed">
                      {t(results.activityKey)}
                    </p>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700 text-lg">{t('patent_cost_breakdown')}</h3>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">{t('patent_for_1_month')}</span>
                        <span className="text-blue-600 font-semibold text-lg">
                          {formatCurrency(results.monthlyCost)} {t('patent_som')}
                        </span>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <span className="text-gray-700">{t('patent_for_12_months')}</span>
                          <Tooltip text={t('patent_annual_tooltip')}>
                            <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                          </Tooltip>
                        </div>
                        <span className="text-green-600 font-semibold text-lg">
                          {formatCurrency(results.yearlyCost)} {t('patent_som')}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatCurrency(results.monthlyCost)} {t('patent_calculation_formula')} {formatCurrency(results.yearlyCost)} {t('patent_som')}
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-700 mb-3">{t('patent_additional_info')}</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>{t('patent_region_label')}</span>
                        <span>{t(results.regionKey)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('patent_validity_period')}</span>
                        <span>{t('patent_validity_1_month')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('patent_tax_burden')}</span>
                        <span>{t('patent_tax_fixed')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('patent_exemption')}</span>
                        <span>{t('patent_exemption_text')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <Building2 className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    {selectedRegion ? t('patent_select_for_calculation') : t('patent_select_region_activity')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="mt-12 space-y-12">
          {/* Comparison Mode - Patent vs Single Tax */}
          {mode === 'comparison' && results.hasData && (
            <div className="space-y-6">
              {/* Revenue Input */}
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('patent_comparison_title')}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('patent_monthly_revenue')}
                    </label>
                    <input
                      type="number"
                      value={monthlyRevenue}
                      onChange={(e) => setMonthlyRevenue(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="50000"
                    />
                    <p className="text-xs text-gray-500 mt-1">{t('patent_monthly_revenue_tooltip')}</p>
                  </div>
                </div>

                {/* Comparison Results */}
                {(() => {
                  const comparison = calculateComparison(parseFloat(monthlyRevenue) || 0, results.monthlyCost);
                  return (
                    <div className="space-y-6">
                      {/* Comparison Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b-2">{t('patent_regime')}</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b-2">{t('patent_monthly_payment')}</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b-2">{t('patent_yearly_payment')}</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b-2">{t('patent_tax_rate')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className={comparison.recommended === 'patent' ? 'bg-green-50' : ''}>
                              <td className="px-4 py-4 border-b">
                                <div className="flex items-center">
                                  <Receipt className="h-5 w-5 text-blue-600 mr-2" />
                                  <span className="font-medium">{t('patent_option')}</span>
                                  {comparison.recommended === 'patent' && (
                                    <span className="ml-2 px-2 py-1 bg-green-600 text-white text-xs rounded-full">{t('patent_recommended')}</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-4 border-b font-semibold text-blue-600">
                                {formatCurrency(comparison.patentCost)} {t('patent_som')}
                              </td>
                              <td className="px-4 py-4 border-b">
                                {formatCurrency(comparison.patentCost * 12)} {t('patent_som')}
                              </td>
                              <td className="px-4 py-4 border-b text-gray-600">{t('patent_fixed_amount')}</td>
                            </tr>
                            <tr className={comparison.recommended === 'single-tax' ? 'bg-green-50' : ''}>
                              <td className="px-4 py-4 border-b">
                                <div className="flex items-center">
                                  <CreditCard className="h-5 w-5 text-purple-600 mr-2" />
                                  <span className="font-medium">{t('patent_single_tax_option')}</span>
                                  {comparison.recommended === 'single-tax' && (
                                    <span className="ml-2 px-2 py-1 bg-green-600 text-white text-xs rounded-full">{t('patent_recommended')}</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-4 border-b font-semibold text-purple-600">
                                {formatCurrency(comparison.singleTaxCost)} {t('patent_som')}
                              </td>
                              <td className="px-4 py-4 border-b">
                                {formatCurrency(comparison.singleTaxCost * 12)} {t('patent_som')}
                              </td>
                              <td className="px-4 py-4 border-b text-gray-600">3% {t('patent_from_revenue')}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Economy Banner */}
                      <div className={`rounded-xl p-6 ${comparison.recommended === 'patent' ? 'bg-blue-50 border-2 border-blue-200' : 'bg-purple-50 border-2 border-purple-200'}`}>
                        <div className="flex items-start">
                          <Info className={`h-6 w-6 ${comparison.recommended === 'patent' ? 'text-blue-600' : 'text-purple-600'} mr-3 flex-shrink-0 mt-1`} />
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                              {comparison.recommended === 'patent' ? t('patent_profit_with_patent') : t('patent_profit_with_single')} {formatCurrency(comparison.economy)} {t('patent_som')} {t('patent_per_year')}
                            </h3>
                            <p className="text-sm text-gray-700">
                              {t('patent_when_profitable_text')}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Break-even Point */}
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-900 mb-3">{t('patent_when_profitable_title')}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">{t('patent_breakeven_point')}:</p>
                            <p className="text-2xl font-bold text-amber-600">
                              {formatCurrency(comparison.breakEvenPoint)} {t('patent_som')} {t('patent_per_month')}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">{t('patent_your_revenue')}:</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {formatCurrency(comparison.monthlyRevenue)} {t('patent_som')} {t('patent_per_month')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Multi-Patent Mode */}
          {mode === 'multi' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('patent_multi_patents_title')}</h2>
                <p className="text-gray-600 mb-6">{t('patent_multi_note')}</p>

                {/* Add Patent Button */}
                {results.hasData && (
                  <button
                    onClick={addPatent}
                    className="w-full md:w-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 mb-6"
                  >
                    <Building2 className="h-5 w-5" />
                    <span>{t('patent_add_patent')}</span>
                  </button>
                )}

                {/* Patents List */}
                {patents.length > 0 && (
                  <div className="space-y-4 mb-6">
                    {patents.map((patent) => (
                      <div key={patent.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {t(PATENT_RATES[patent.region].activities[patent.activity as keyof typeof PATENT_RATES[typeof patent.region]['activities']].nameKey)}
                          </p>
                          <p className="text-sm text-gray-600">{t(PATENT_RATES[patent.region].nameKey)}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-semibold text-blue-600">
                            {formatCurrency(patent.monthlyCost)} {t('patent_som')}
                          </span>
                          <button
                            onClick={() => removePatent(patent.id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            {t('patent_remove_patent')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Total Cost */}
                {patents.length > 0 && (
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 mb-1">{t('patent_total_patents')}: {patents.length}</p>
                        <p className="text-sm text-blue-100">{t('patent_total_cost_all')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold">{formatCurrency(calculateTotalPatentsCost())} {t('patent_som')}</p>
                        <p className="text-sm text-blue-100">{t('patent_per_month')}</p>
                        <p className="text-xl font-semibold mt-2">{formatCurrency(calculateTotalPatentsCost() * 12)} {t('patent_som')} / {t('patent_per_year')}</p>
                      </div>
                    </div>
                  </div>
                )}

                {patents.length === 0 && !results.hasData && (
                  <div className="text-center py-12 text-gray-500">
                    <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p>{t('patent_select_region_activity')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment Calendar - показываем в режиме single, если есть результат */}
          {mode === 'single' && results.hasData && (
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Calendar className="h-6 w-6 text-red-600 mr-3" />
                {t('patent_payment_calendar')}
              </h2>

              {/* Frequency Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">{t('patent_payment_frequency')}</label>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setPaymentFrequency('monthly')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      paymentFrequency === 'monthly'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t('patent_payment_monthly')}
                  </button>
                  <button
                    onClick={() => setPaymentFrequency('quarterly')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      paymentFrequency === 'quarterly'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t('patent_payment_quarterly')}
                  </button>
                  <button
                    onClick={() => setPaymentFrequency('yearly')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      paymentFrequency === 'yearly'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t('patent_payment_yearly')}
                  </button>
                </div>
              </div>

              {/* Payment Schedule */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700">
                  {t('patent_payment_schedule')} {new Date().getFullYear()}
                </h3>
                {generatePaymentSchedule(results.monthlyCost, paymentFrequency).map((payment, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-4">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {paymentFrequency === 'monthly' && getMonthName(payment.month)}
                          {paymentFrequency === 'quarterly' && `${t('patent_quarter_' + (payment.month / 3))}`}
                          {paymentFrequency === 'yearly' && t('patent_payment_yearly')}
                        </p>
                        <p className="text-sm text-gray-600">{t('patent_payment_deadline')}: {payment.deadline}</p>
                      </div>
                    </div>
                    <span className="text-lg font-semibold text-blue-600">
                      {formatCurrency(payment.amount)} {t('patent_som')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Payment Info */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>{t('patent_payment_where')}:</strong> {t('patent_payment_where_text')}
                </p>
              </div>
            </div>
          )}

          {/* Regional Comparison - показываем только в single режиме */}
          {mode === 'single' && results.hasData && (
            <div className="bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
              <div className="flex items-center mb-6">
                <MapPin className="h-6 w-6 text-red-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {t('patent_regional_comparison')}
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('patent_region_city_header')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('patent_cost_header')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('patent_difference_with_choice')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Current Selection */}
                    <tr className="bg-green-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {t(results.regionKey)} <span className="text-xs text-gray-500">{t('patent_your_choice')}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {formatCurrency(results.monthlyCost)} {t('patent_som_per_month')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {t('patent_base_rate')}
                      </td>
                    </tr>
                    
                    {/* Other Regions */}
                    {Object.entries(PATENT_RATES)
                      .filter(([key]) => key !== selectedRegion)
                      .filter(([key, region]) => selectedActivity in region.activities)
                      .sort(([,a], [,b]) => {
                        const costA = a.activities[selectedActivity as keyof typeof a.activities]?.cost || 0;
                        const costB = b.activities[selectedActivity as keyof typeof b.activities]?.cost || 0;
                        return costA - costB;
                      })
                      .map(([regionKey, regionData]) => {
                        const activityData = regionData.activities[selectedActivity as keyof typeof regionData.activities];
                        if (!activityData) return null;
                        
                        const difference = activityData.cost - results.monthlyCost;
                        const isCheaper = difference < 0;
                        const isMoreExpensive = difference > 0;
                        
                        return (
                          <tr key={regionKey} className={isCheaper ? 'bg-blue-50' : isMoreExpensive ? 'bg-red-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {t(regionData.nameKey)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(activityData.cost)} {t('patent_som_per_month')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={difference === 0 ? 'text-gray-500' : difference < 0 ? 'text-green-600' : 'text-red-600'}>
                                {difference === 0 ? t('patent_same') :
                                 difference < 0 ? `${formatCurrency(Math.abs(difference))} ${t('patent_cheaper')}` :
                                 `${formatCurrency(difference)} ${t('patent_more_expensive')}`}
                              </span>
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
                    <span>{t('patent_cheaper_rates')}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-50 border border-red-200 rounded mr-2"></div>
                    <span>{t('patent_more_expensive_rates')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Examples */}
          <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
            <h3 className="font-medium text-gray-900 mb-4">{t('patent_popular_activities')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { activity: 'hairdresser-1', region: 'bishkek' as Region },
                { activity: 'taxi-1', region: 'osh' as Region }
              ].map((example, index) => {
                const regionData = PATENT_RATES[example.region];
                const activityData = regionData.activities[example.activity as keyof typeof regionData.activities];

                if (!activityData) return null;

                return (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedRegion(example.region);
                      setSelectedActivity(example.activity);
                      setSearchTerm('');
                    }}
                    className="text-left p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium text-sm">
                        {t(regionData.nameKey)}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-600 font-semibold">
                        {formatCurrency(activityData.cost)} {t('patent_som_per_month')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatCurrency(activityData.cost * 12)} {t('patent_som')}/{t('year')}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Full Activity Matrix */}
          <div className="bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
            <h3 className="font-medium text-gray-900 mb-6">{t('patent_full_matrix')}</h3>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('patent_activity_type_full')}
                    </th>
                    {Object.entries(PATENT_RATES).map(([key, region]) => (
                      <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t(region.nameKey)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Получаем все уникальные виды деятельности */}
                  {Array.from(new Set(
                    Object.values(PATENT_RATES).flatMap(region =>
                      Object.entries(region.activities).map(([key, activity]) => ({
                        id: key,
                        nameKey: activity.nameKey
                      }))
                    )
                  )).map((activity) => (
                    <tr key={activity.id} className={selectedActivity === activity.id ? 'bg-green-50' : ''}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs">
                        {t(activity.nameKey)}
                      </td>
                      {Object.entries(PATENT_RATES).map(([regionKey, regionData]) => {
                        const activityData = regionData.activities[activity.id as keyof typeof regionData.activities];
                        return (
                          <td key={regionKey} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {activityData ? formatCurrency(activityData.cost) : '—'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Other Calculators */}
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
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('related_single_tax')}</div>
                    <div className="text-sm text-gray-500">{t('related_single_tax_desc')}</div>
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
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('related_taxi_tax')}</div>
                    <div className="text-sm text-gray-500">{t('patent_aggregator_tax')}</div>
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
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('related_salary_calc')}</div>
                    <div className="text-sm text-gray-500">{t('related_salary_desc')}</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Important Notice - Enhanced */}
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 shadow-md">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-8 w-8 text-red-600 flex-shrink-0 mt-1 animate-pulse" />
              <div className="text-sm text-red-900">
                <p className="font-bold text-lg mb-3 text-red-700">{t('patent_important_notice')}</p>
                <p className="mb-3 font-semibold">
                  {t('patent_calculation_preliminary')}
                </p>
                <p className="mb-3">
                  {t('patent_rates_based_on')} {currentMonth}.
                </p>
                <p className="mb-3">
                  {t('patent_official_info')} <strong className="text-red-700">{t('patent_district_gns')}</strong> {t('patent_by_location')}
                </p>
                <div className="bg-red-100 border-l-4 border-red-500 p-3 mt-3">
                  <p className="font-bold text-red-800">{t('patent_rates_warning')}</p>
                  <p className="mt-2 text-red-700">{t('patent_check_local_tax')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* How to Buy Patent */}
          <div className="bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
            <h3 className="font-medium text-gray-900 mb-6">{t('patent_how_to_buy')}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium text-gray-800 mb-3">{t('patent_required_documents')}</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('patent_doc_application')}
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('patent_doc_passport')}
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('patent_doc_registration')}
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('patent_doc_payment')}
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-3">{t('patent_where_to_apply')}</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('patent_where_district_office')}
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('patent_where_service_center')}
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('patent_where_online')}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
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

      <PatentCalculatorArticle />
    </div>
  );
};

export default PatentCalculatorPage;