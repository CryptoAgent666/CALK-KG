import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Info, Home, Printer, Receipt, DollarSign, Building2, Users } from 'lucide-react';
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

type LocalizedCopy = {
  ru: string;
  ky: string;
};

type PaymentType = 'cash' | 'cashless';

const PAYMENT_LABELS: Record<PaymentType, LocalizedCopy> = {
  cash: {
    ru: 'Наличные',
    ky: 'Нак акча'
  },
  cashless: {
    ru: 'Безналичные',
    ky: 'Нак эмес'
  }
};

const SINGLE_TAX_CONFIG = {
  trade_0_percent: {
    name: {
      ru: 'ИП до 15 млн сом (ставка 0%)',
      ky: 'ЖИ 15 млн сомго чейин (0% чен)'
    },
    description: {
      ru: 'Для ИП с ККМ, не более 2 наёмных работников, один торговый объект, уплата страховых взносов, без экспорта/импорта. Ставка 0% (ст. 423 ч.8 НК КР)',
      ky: 'ККМ менен ЖИ, 2ден ашпаган жалданма кызматкер, бир соода объекти, камсыздандыруу төлөмдөрү менен, экспорт/импортсуз. 0% чен (НК 423-берене 8-б.)'
    },
    turnoverLabel: {
      ru: 'до 15 млн сом в год (ИП с ККМ)',
      ky: 'жылына 15 млн сомго чейин (ККМ менен ЖИ)'
    },
    rates: {
      cash: 0,
      cashless: 0
    },
    minAnnualRevenue: 0,
    maxAnnualRevenue: 15000000
  },
  trade_up_to_50m: {
    name: {
      ru: 'Торговля до 50 млн сом в год',
      ky: 'Жылына 50 млн сомго чейин соода'
    },
    description: {
      ru: 'Торговая деятельность с оборотом до 50 млн сом за 12 мес: 0,5% независимо от формы оплаты (ст. 423 ч.1 п.1 «а» НК КР). Кроме особой зоны, импортёров/экспортёров/дистрибьюторов, лекарств и ГСМ',
      ky: 'Жүгүртүүсү 12 айда 50 млн сомго чейинки соода: төлөм формасына карабай 0,5% (НК 423-берене 1-б. 1-п. «а»). Атайын зона, импорт/экспорт/дистрибьютор, дары жана ГСМ кирбейт'
    },
    turnoverLabel: {
      ru: 'до 50 млн сом в год',
      ky: 'жылына 50 млн сомго чейин'
    },
    rates: {
      cash: 0.5,
      cashless: 0.5
    },
    minAnnualRevenue: 0,
    maxAnnualRevenue: 50000000
  },
  trade_over_50m: {
    name: {
      ru: 'Торговля свыше 50 млн сом (или импорт/экспорт)',
      ky: 'Соода 50 млн сомдон жогору (же импорт/экспорт)'
    },
    description: {
      ru: 'Оборот свыше 50 млн сом за 12 мес, а также импортёры, экспортёры, дистрибьюторы: 4% наличными / 2% безналичными (ст. 423 ч.1 п.1 «б» НК КР)',
      ky: 'Жүгүртүүсү 12 айда 50 млн сомдон жогору, ошондой эле импортёрлор, экспортёрлор, дистрибьюторлор: нак 4% / нак эмес 2% (НК 423-берене 1-б. 1-п. «б»)'
    },
    turnoverLabel: {
      ru: 'свыше 50 млн сом в год',
      ky: 'жылына 50 млн сомдон жогору'
    },
    rates: {
      cash: 4,
      cashless: 2
    },
    minAnnualRevenue: 50000000
  },
  agriculture: {
    name: {
      ru: 'Сельское хозяйство / переработка / производство',
      ky: 'Айыл чарба / кайра иштетүү / өндүрүш'
    },
    description: {
      ru: 'Льготная производственная группа: 4% наличные и 2% безналичные',
      ky: 'Жеңилдетилген өндүрүш тобу: нак акча 4%, нак эмес 2%'
    },
    turnoverLabel: {
      ru: 'спецрежим по виду деятельности',
      ky: 'ишмердик түрү боюнча атайын режим'
    },
    rates: {
      cash: 4,
      cashless: 2
    }
  },
  other: {
    name: {
      ru: 'Прочие виды деятельности',
      ky: 'Башка ишмердиктер'
    },
    description: {
      ru: 'Базовый режим: 6% наличные и 4% безналичные',
      ky: 'Негизги режим: нак акча 6%, нак эмес 4%'
    },
    turnoverLabel: {
      ru: 'общий режим единого налога',
      ky: 'бирдиктүү салыктын жалпы режими'
    },
    rates: {
      cash: 6,
      cashless: 4
    }
  },
  catering: {
    name: {
      ru: 'Общепит / сауна / бильярд',
      ky: 'Коомдук тамактануу / сауна / бильярд'
    },
    description: {
      ru: 'Для общепита и отдельных сервисных направлений ставка 8% независимо от формы оплаты',
      ky: 'Коомдук тамактануу жана айрым тейлөө багыттары үчүн төлөм формасына карабай 8%'
    },
    turnoverLabel: {
      ru: 'спецрежим по виду деятельности',
      ky: 'ишмердик түрү боюнча атайын режим'
    },
    rates: {
      cash: 8,
      cashless: 8
    }
  },
  ecommerce: {
    name: {
      ru: 'Электронная торговля',
      ky: 'Электрондук соода'
    },
    description: {
      ru: 'Для e-commerce в мартовском обновлении указана безналичная ставка 2%',
      ky: 'Марттагы жаңыртууда e-commerce үчүн 2% нак эмес чен көрсөтүлгөн'
    },
    turnoverLabel: {
      ru: 'по правилам электронной торговли',
      ky: 'электрондук соода эрежелери боюнча'
    },
    rates: {
      cash: null,
      cashless: 2
    }
  },
  pvt: {
    name: {
      ru: 'Резиденты ПВТ',
      ky: 'ЖТП резиденттери'
    },
    description: {
      ru: 'Для резидентов ПВТ в обновлении указана ставка 1% на безналичную выручку',
      ky: 'ЖТП резиденттери үчүн жаңыртууда нак эмес түшүмгө 1% чен көрсөтүлгөн'
    },
    turnoverLabel: {
      ru: 'по условиям ПВТ',
      ky: 'ЖТП шарттары боюнча'
    },
    rates: {
      cash: null,
      cashless: 1
    }
  },
  jewelry: {
    name: {
      ru: 'Ювелирные изделия',
      ky: 'Зер буюмдары'
    },
    description: {
      ru: 'Льготная ставка 0.25% для наличной и безналичной выручки',
      ky: 'Нак жана нак эмес түшүм үчүн 0.25% жеңилдетилген чен'
    },
    turnoverLabel: {
      ru: 'спецрежим для ювелирной деятельности',
      ky: 'зер ишмердиги үчүн атайын режим'
    },
    rates: {
      cash: 0.25,
      cashless: 0.25
    }
  }
} as const;

type ActivityType = keyof typeof SINGLE_TAX_CONFIG;

interface SingleTaxResults {
  monthlyRevenue: number;
  annualRevenue: number;
  taxRate: number | null;
  monthlyTax: number;
  annualTax: number;
  paymentSupported: boolean;
  turnoverInRange: boolean;
  netIncome: number;
}

const SingleTaxCalculatorPage = () => {
  const { t, language, getLocalizedPath } = useLanguage();
  const getLocalized = (copy: LocalizedCopy) => language === 'ky' ? copy.ky : copy.ru;

  React.useEffect(() => {
    document.title = `${t('single_tax_calc_title')} | Calk.KG`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('single_tax_calc_description'));
    }
  }, [t]);

  const [monthlyRevenue, setMonthlyRevenue] = useState<string>('');
  const [activityType, setActivityType] = useState<ActivityType>('other');
  const [paymentType, setPaymentType] = useState<PaymentType>('cashless');

  const [results, setResults] = useState<SingleTaxResults>({
    monthlyRevenue: 0,
    annualRevenue: 0,
    taxRate: 0,
    monthlyTax: 0,
    annualTax: 0,
    paymentSupported: true,
    turnoverInRange: true,
    netIncome: 0
  });

  const currentActivity = SINGLE_TAX_CONFIG[activityType];

  const calculateSingleTax = (revenue: number, activity: ActivityType, payment: PaymentType): SingleTaxResults => {
    if (revenue <= 0) {
      return {
        monthlyRevenue: 0,
        annualRevenue: 0,
        taxRate: 0,
        monthlyTax: 0,
        annualTax: 0,
        paymentSupported: true,
        turnoverInRange: true,
        netIncome: 0
      };
    }

    const config = SINGLE_TAX_CONFIG[activity];
    const annualRevenue = revenue * 12;
    const taxRate = config.rates[payment];
    const paymentSupported = taxRate !== null;
    const turnoverInRange =
      (config.minAnnualRevenue === undefined || annualRevenue >= config.minAnnualRevenue) &&
      (config.maxAnnualRevenue === undefined || annualRevenue <= config.maxAnnualRevenue);

    if (!paymentSupported) {
      return {
        monthlyRevenue: revenue,
        annualRevenue,
        taxRate: null,
        monthlyTax: 0,
        annualTax: 0,
        paymentSupported: false,
        turnoverInRange,
        netIncome: revenue
      };
    }

    const monthlyTax = revenue * (taxRate / 100);
    const annualTax = monthlyTax * 12;

    return {
      monthlyRevenue: revenue,
      annualRevenue,
      taxRate,
      monthlyTax,
      annualTax,
      paymentSupported,
      turnoverInRange,
      netIncome: revenue - monthlyTax
    };
  };

  useEffect(() => {
    const revenue = parseFloat(monthlyRevenue) || 0;
    setResults(calculateSingleTax(revenue, activityType, paymentType));
  }, [monthlyRevenue, activityType, paymentType]);

  const generateSchemas = () => {
    const currentUrl = language === 'ky' ? 'https://calk.kg/ky/calculator/single-tax/' : 'https://calk.kg/calculator/single-tax/';
    const homeUrl = language === 'ky' ? 'https://calk.kg/ky' : 'https://calk.kg';

    const calculatorSchema = generateCalculatorSchema({
      url: currentUrl,
      title: t('single_tax_calc_title'),
      description: t('single_tax_calc_subtitle'),
      calculatorName: t('single_tax_calc_title'),
      category: t('nav_finance'),
      language,
      inputProperties: ['monthlyRevenue', 'activityType', 'paymentType'],
      outputProperties: ['monthlyTax', 'annualTax', 'netIncome']
    });

    const softwareSchema = generateSoftwareApplicationSchema({
      url: currentUrl,
      title: t('single_tax_calc_title'),
      description: t('single_tax_calc_subtitle'),
      calculatorName: t('single_tax_calc_title'),
      category: 'FinanceApplication',
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

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('ru-KG', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);

  const formatRate = (rate: number | null) => {
    if (rate === null) {
      return language === 'ky' ? 'каралган эмес' : 'не предусмотрено';
    }
    return `${rate}%`;
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
      <div className="absolute bottom-full left-1/2 z-10 mb-2 max-w-xs -translate-x-1/2 transform rounded-lg bg-gray-800 px-3 py-2 text-sm text-white opacity-0 transition-opacity duration-200 pointer-events-none group-hover:opacity-100 whitespace-nowrap">
        {text}
        <div className="absolute left-1/2 top-full -translate-x-1/2 transform border-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );

  const hasData = results.monthlyRevenue > 0;
  const turnoverNote = getLocalized(currentActivity.turnoverLabel);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{t('single_tax_calc_title')} | Calk.KG</title>
        <meta name="description" content={t('single_tax_calc_subtitle')} />
        <meta name="keywords" content={t('single_tax_keywords')} />
        <meta property="og:title" content={`${t('single_tax_calc_title')} | Calk.KG`} />
        <meta property="og:description" content={t('single_tax_calc_subtitle')} />
        <meta property="og:url" content={language === 'ky' ? 'https://calk.kg/ky/calculator/single-tax/' : 'https://calk.kg/calculator/single-tax/'} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/single-tax.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? 'ky_KG' : 'ru_RU'} />
        <meta property="og:site_name" content="Calk.KG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('single_tax_calc_title')} | Calk.KG`} />
        <meta name="twitter:description" content={t('single_tax_calc_subtitle')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/single-tax.png" />
        <link rel="canonical" href={language === 'ky' ? 'https://calk.kg/ky/calculator/single-tax/' : 'https://calk.kg/calculator/single-tax/'} />
      </Helmet>
      <HreflangTags path="/calculator/single-tax" />
      <FAQSchema translationPrefix="singletax" />
      {generateSchemas().map((schema, index) => (
        <SchemaMarkup key={index} schema={schema} />
      ))}

      <header className="border-b border-gray-100 bg-white shadow-sm print:shadow-none">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Link to={getLocalizedPath('/')} className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-red-600 print:hidden">
              <ArrowLeft className="h-5 w-5" />
              <span>{t('back')}</span>
            </Link>
            <div className="h-6 w-px bg-gray-300 print:hidden"></div>
            <Link to={getLocalizedPath('/')} className="flex items-center space-x-2">
              <div className="rounded-lg bg-gradient-to-r from-red-600 to-red-700 p-2">
                <Calculator className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">Calk.KG</span>
            </Link>
          </div>
          <Link to={getLocalizedPath('/')} className="flex items-center space-x-2 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 print:hidden">
            <Home className="h-4 w-4" />
            <span>{t('home')}</span>
          </Link>
        </div>
      </header>

      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white print:bg-white print:text-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 print:py-6">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-white/20 p-3 print:bg-red-100">
              <Receipt className="h-8 w-8 print:text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold md:text-4xl print:text-2xl">{t('single_tax_calc_title')}</h1>
              <p className="text-lg text-red-100 print:text-gray-600">{t('single_tax_calc_subtitle')}</p>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-white/10 p-3 text-sm text-red-50 print:hidden">
            {language === 'ky'
              ? 'Март 2026 жаңыртуусу: калькулятор эми нак/нак эмес түшүмдү, соода коридорлорун жана атайын чендерди өзүнчө эсептейт.'
              : 'Обновление марта 2026: калькулятор отдельно учитывает наличную/безналичную выручку, торговые коридоры и специальные ставки.'}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 print:py-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 print:gap-6">
          <div className="space-y-8 print:break-inside-avoid">
            <div className="rounded-xl bg-white p-8 shadow-sm print:border print:shadow-none">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">{t('calc_parameters')}</h2>

              <div className="mb-6">
                <div className="mb-3 flex items-center">
                  <label className="block text-sm font-medium text-gray-700">{t('single_tax_revenue')}</label>
                  <Tooltip text={t('single_tax_revenue_tooltip')}>
                    <Info className="ml-2 h-4 w-4 cursor-help text-gray-400" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={monthlyRevenue}
                  onChange={handleRevenueChange}
                  placeholder={t('single_tax_revenue_placeholder')}
                  className="w-full rounded-lg border border-gray-300 px-4 py-4 text-lg focus:border-red-500 focus:ring-2 focus:ring-red-500"
                />
                <div className="mt-2 flex gap-2">
                  {[100000, 300000, 500000, 1000000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setMonthlyRevenue(amount.toString())}
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors hover:border-red-400 hover:bg-red-50"
                    >
                      {formatCurrency(amount)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="mb-3 flex items-center">
                  <label className="block text-sm font-medium text-gray-700">
                    {language === 'ky' ? 'Түшүмдүн түрү' : 'Форма выручки'}
                  </label>
                  <Tooltip
                    text={
                      language === 'ky'
                        ? 'Айрым режимдерде жаңыртылган маалыматта нак эмес түшүм үчүн гана чен көрсөтүлгөн.'
                        : 'Для части режимов в обновлении указаны ставки только для безналичной выручки.'
                    }
                  >
                    <Info className="ml-2 h-4 w-4 cursor-help text-gray-400" />
                  </Tooltip>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {(['cash', 'cashless'] as PaymentType[]).map((payment) => (
                    <button
                      key={payment}
                      onClick={() => setPaymentType(payment)}
                      className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                        paymentType === payment
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-300 text-gray-700 hover:border-red-300 hover:bg-red-50'
                      }`}
                    >
                      {getLocalized(PAYMENT_LABELS[payment])}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="mb-3 flex items-center">
                  <label className="block text-sm font-medium text-gray-700">{t('single_tax_activity')}</label>
                  <Tooltip text={t('single_tax_activity_tooltip')}>
                    <Info className="ml-2 h-4 w-4 cursor-help text-gray-400" />
                  </Tooltip>
                </div>
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value as ActivityType)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-500"
                >
                  {Object.entries(SINGLE_TAX_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>
                      {getLocalized(config.name)}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-sm text-gray-500">{getLocalized(currentActivity.description)}</p>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
                <div className="flex items-start space-x-3">
                  <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                  <div className="text-sm text-blue-900">
                    <p className="mb-2 font-medium">
                      {language === 'ky' ? 'Бул калькулятор эмнени текшерет' : 'Что учитывает калькулятор'}
                    </p>
                    <ul className="space-y-1 text-blue-800">
                      <li>• {language === 'ky' ? 'Айлык түшүмдү жылдык жүгүртүүгө айландырат' : 'Переводит месячную выручку в годовой оборот'}</li>
                      <li>• {language === 'ky' ? 'Нак жана нак эмес ставкаларды өзүнчө текшерет' : 'Проверяет ставки отдельно для наличной и безналичной выручки'}</li>
                      <li>• {language === 'ky' ? 'Соода үчүн 30 млн жана 50 млн коридорлорун текшерет' : 'Проверяет торговые коридоры 30 млн и 50 млн сом'}</li>
                      <li>• {language === 'ky' ? 'Чен берилбеген режимдер боюнча эскертет' : 'Предупреждает, если для выбранной формы оплаты ставка не указана'}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-xl bg-white p-8 shadow-sm print:border print:shadow-none">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">{t('calc_results')}</h2>
                {hasData && (
                  <button onClick={handlePrint} className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-red-600 print:hidden">
                    <Printer className="h-5 w-5" />
                    <span className="text-sm">{t('print')}</span>
                  </button>
                )}
              </div>

              {hasData ? (
                <div className="space-y-6">
                  {!results.paymentSupported && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                      <p className="font-medium">
                        {language === 'ky' ? 'Бул режим үчүн тандалган төлөм формасына чен көрсөтүлгөн эмес.' : 'Для выбранной формы оплаты ставка по этому режиму не указана.'}
                      </p>
                      <p className="mt-1">
                        {language === 'ky'
                          ? 'Таңдалган жаңыртууда бул активдүүлүк үчүн башка төлөм формасын колдонуу талап кылынышы мүмкүн.'
                          : 'В мартовском обновлении для этой активности указана ставка только для другой формы оплаты.'}
                      </p>
                    </div>
                  )}

                  {!results.turnoverInRange && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                      <p className="font-medium">
                        {language === 'ky' ? 'Жылдык жүгүртүү тандалган коридорго дал келбейт.' : 'Годовой оборот не попадает в выбранный коридор.'}
                      </p>
                      <p className="mt-1">
                        {language === 'ky' ? 'Бул режим үчүн күтүлгөн диапазон:' : 'Ожидаемый диапазон для этого режима:'} {turnoverNote}.
                      </p>
                    </div>
                  )}

                  <div className="rounded-xl bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-red-100">{t('single_tax_monthly')}:</span>
                      <Receipt className="h-6 w-6 text-red-200" />
                    </div>
                    <div className="mb-2 text-4xl font-bold">
                      {results.paymentSupported ? `${formatCurrency(results.monthlyTax)} ${t('som')}` : '—'}
                    </div>
                    <div className="text-sm text-red-100">
                      {language === 'ky' ? 'Чен:' : 'Ставка:'} {formatRate(results.taxRate)}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-200 py-3">
                      <span className="text-gray-600">{language === 'ky' ? 'Ишмердик' : 'Режим'}</span>
                      <span className="font-semibold text-gray-900">{getLocalized(currentActivity.name)}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-200 py-3">
                      <span className="text-gray-600">{language === 'ky' ? 'Төлөм формасы' : 'Форма оплаты'}</span>
                      <span className="font-semibold text-gray-900">{getLocalized(PAYMENT_LABELS[paymentType])}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-200 py-3">
                      <span className="text-gray-600">{t('single_tax_monthly_revenue')}:</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(results.monthlyRevenue)} {t('som')}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-200 py-3">
                      <span className="text-gray-600">{t('single_tax_annual_revenue')}:</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(results.annualRevenue)} {t('som')}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-200 py-3">
                      <span className="text-gray-600">{t('single_tax_rate')}:</span>
                      <span className="font-semibold text-gray-900">{formatRate(results.taxRate)}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-200 py-3">
                      <span className="text-gray-600">{t('single_tax_annual')}:</span>
                      <span className="font-semibold text-blue-600">{results.paymentSupported ? `${formatCurrency(results.annualTax)} ${t('som')}` : '—'}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-green-50 px-4 py-3">
                      <span className="text-gray-700">{t('single_tax_net_income')}:</span>
                      <span className="font-semibold text-green-600">{formatCurrency(results.netIncome)} {t('som')}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center">
                  <Receipt className="mx-auto mb-4 h-20 w-20 text-gray-300" />
                  <p className="text-lg text-gray-500">{t('enter_parameters')}</p>
                </div>
              )}
            </div>

            {hasData && (
              <ActionButtons
                onPrint={handlePrint}
                calculatorName={t('single_tax_calc_title')}
                resultText={`${getLocalized(currentActivity.name)}
${language === 'ky' ? 'Айлык түшүм:' : 'Месячная выручка:'} ${formatCurrency(results.monthlyRevenue)} ${t('som')}
${language === 'ky' ? 'Төлөм формасы:' : 'Форма оплаты:'} ${getLocalized(PAYMENT_LABELS[paymentType])}
${language === 'ky' ? 'Чен:' : 'Ставка:'} ${formatRate(results.taxRate)}
${language === 'ky' ? 'Айлык салык:' : 'Налог в месяц:'} ${results.paymentSupported ? formatCurrency(results.monthlyTax) : '—'} ${results.paymentSupported ? t('som') : ''}`}
              />
            )}
          </div>
        </div>

        <div className="mt-12 rounded-xl bg-white p-8 shadow-sm print:break-inside-avoid">
          <h3 className="mb-6 font-medium text-gray-900">{t('single_tax_rates_table')}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t('activity_type')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {language === 'ky' ? 'Нак акча' : 'Наличные'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {language === 'ky' ? 'Нак эмес' : 'Безналичные'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {language === 'ky' ? 'Коридор / шарт' : 'Коридор / условие'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {Object.entries(SINGLE_TAX_CONFIG).map(([key, config]) => (
                  <tr key={key} className={key === activityType ? 'bg-red-50' : ''}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{getLocalized(config.name)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatRate(config.rates.cash)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatRate(config.rates.cashless)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{getLocalized(config.turnoverLabel)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              {language === 'ky' ? 'Эмне өзгөрдү' : 'Что изменилось'}
            </h3>
            <p className="text-sm text-gray-700">
              {language === 'ky'
                ? 'Эски 4%/6% модели жетишсиз болуп калды: эми форма оплаты, соода коридору жана атайын категория маанилүү.'
                : 'Старой модели 4%/6% больше недостаточно: теперь важны форма оплаты, торговый коридор и специальные категории.'}
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              {language === 'ky' ? 'Кантип окуу керек' : 'Как читать расчёт'}
            </h3>
            <p className="text-sm text-gray-700">
              {language === 'ky'
                ? 'Адегенде ишмердикти, андан кийин түшүмдүн формасын тандаңыз. Соода болсо, жылдык жүгүртүү кайсы диапазонго түшөрүн сөзсүз текшериңиз.'
                : 'Сначала выберите вид деятельности, затем форму выручки. Для торговли обязательно проверьте, в какой годовой диапазон попадает оборот.'}
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              {language === 'ky' ? 'Кайда сак болуу керек' : 'Где нужна осторожность'}
            </h3>
            <p className="text-sm text-gray-700">
              {language === 'ky'
                ? 'Эгер документте нак акча үчүн чен көрсөтүлбөсө, калькулятор салыкты нөл кылып эмес, эскертүү берип токтотот.'
                : 'Если в документе не указана наличная ставка, калькулятор не придумывает процент, а показывает предупреждение.'}
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-xl bg-white p-8 shadow-sm print:hidden">
          <h3 className="mb-4 font-medium text-gray-900">{t('other_calculators')}:</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link to={getLocalizedPath('/calculator/salary')} className="group rounded-lg border border-gray-200 p-4 transition-colors hover:border-red-200 hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-green-50 p-2 transition-colors group-hover:bg-green-100">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-red-600">{t('salary_calc_title')}</div>
                  <div className="text-sm text-gray-500">{t('salary_subtitle')}</div>
                </div>
              </div>
            </Link>
            <Link to={getLocalizedPath('/calculator/patent')} className="group rounded-lg border border-gray-200 p-4 transition-colors hover:border-red-200 hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-blue-50 p-2 transition-colors group-hover:bg-blue-100">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-red-600">{t('patent_calc_title')}</div>
                  <div className="text-sm text-gray-500">{t('patent_subtitle')}</div>
                </div>
              </div>
            </Link>
            <Link to={getLocalizedPath('/calculator/social-fund')} className="group rounded-lg border border-gray-200 p-4 transition-colors hover:border-red-200 hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-purple-50 p-2 transition-colors group-hover:bg-purple-100">
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

      <div className="border-t border-yellow-200 bg-yellow-50 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-start space-x-3">
            <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
            <div className="text-sm text-yellow-800">
              <p className="mb-2 font-medium">{t('legal_notice')}</p>
              <ul className="space-y-1">
                <li>• {language === 'ky' ? 'Чендер 13.03.2026 файлындагы март жаңыртуусуна ылайык киргизилди.' : 'Ставки внесены по мартовскому обновлению из файла на 13.03.2026.'}</li>
                <li>• {language === 'ky' ? 'Бул эсептөө ККМ, отчеттуулук жана кошумча талаптарды алмаштырбайт.' : 'Расчёт не заменяет требования по ККМ, отчётности и отраслевым условиям.'}</li>
                <li>• {language === 'ky' ? 'Эгер режим боюнча күмөн болсо, ГНС же бухгалтер менен тактаңыз.' : 'При сомнениях по режиму уточняйте условия в ГНС или у бухгалтера.'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTaxCalculatorPage;
