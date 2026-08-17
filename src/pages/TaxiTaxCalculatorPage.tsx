import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Info, Home, Printer, Car, Smartphone, DollarSign, Clock, Receipt, Building2, CreditCard, Shield } from 'lucide-react';
import ActionButtons from '../components/ActionButtons';
import SchemaMarkup from '../components/SchemaMarkup';
import HreflangTags from '../components/HreflangTags';
import FAQSchema from '../components/FAQSchema';
import { useLanguage } from '../contexts/LanguageContext';
import {
  generateCalculatorSchema,
  generateBreadcrumbSchema
} from '../utils/schemaGenerator';
import { formatVerifiedMonth } from '../utils/dateFormatter';

interface TaxiTaxResults {
  income: number;
  incomeTax: number;
  socialFund: number;
  totalWithheld: number;
  netAfterWithholding: number;
}

const TaxiTaxCalculatorPage = () => {
  const { language, t, getLocalizedPath } = useLanguage();

  const generateSchemas = () => {
    const currentUrl = language === 'ky' ? 'https://calk.kg/ky/calculator/taxi-tax/' : 'https://calk.kg/calculator/taxi-tax/';
    const homeUrl = language === 'ky' ? 'https://calk.kg/ky' : 'https://calk.kg';

    const calculatorSchema = generateCalculatorSchema({
      url: currentUrl,
      title: t('taxi_calc_title'),
      description: t('taxi_calc_subtitle'),
      calculatorName: t('taxi_calc_title'),
      category: t('nav_finance'),
      language,
      inputProperties: ['income'],
      outputProperties: ['incomeTax', 'socialFund', 'totalWithheld', 'netAfterWithholding']
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: homeUrl },
      { name: t('nav_finance'), url: `${homeUrl}?category=finance` },
      { name: t('taxi_calc_title'), url: currentUrl }
    ]);

    return [calculatorSchema, breadcrumbSchema];
  };

  React.useEffect(() => {
    document.title = `${t('taxi_calc_title')} | Calk.KG`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('taxi_tax_calc_description'));
    }
  }, [t]);

  const [income, setIncome] = useState<string>('');
  const [results, setResults] = useState<TaxiTaxResults>({
    income: 0,
    incomeTax: 0,
    socialFund: 0,
    totalWithheld: 0,
    netAfterWithholding: 0
  });

  useEffect(() => {
    const incomeValue = parseFloat(income) || 0;
    const incomeTax = incomeValue * 0.01;
    const socialFund = incomeValue * 0.01;
    const totalWithheld = incomeTax + socialFund;

    setResults({
      income: incomeValue,
      incomeTax,
      socialFund,
      totalWithheld,
      netAfterWithholding: incomeValue - totalWithheld
    });
  }, [income]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('ru-KG', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setIncome(value);
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

  const currentMonth = formatVerifiedMonth(language, 'taxi-tax');
  const hasData = results.income > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{t('taxi_calc_title')} | Calk.KG</title>
        <meta name="description" content={t('taxi_calc_subtitle')} />
        <meta name="keywords" content={t('taxi_keywords')} />
        <meta property="og:title" content={`${t('taxi_calc_title')} | Calk.KG`} />
        <meta property="og:description" content={t('taxi_calc_subtitle')} />
        <meta property="og:url" content={language === 'ky' ? 'https://calk.kg/ky/calculator/taxi-tax/' : 'https://calk.kg/calculator/taxi-tax/'} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/taxi-tax.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? 'ky_KG' : 'ru_RU'} />
        <meta property="og:site_name" content="Calk.KG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('taxi_tax_calc_title')} | Calk.KG`} />
        <meta name="twitter:description" content={t('taxi_tax_calc_subtitle')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/taxi-tax.png" />
        <link rel="canonical" href={language === 'ky' ? 'https://calk.kg/ky/calculator/taxi-tax/' : 'https://calk.kg/calculator/taxi-tax/'} />
      </Helmet>
      <HreflangTags path="/calculator/taxi-tax" />
      <FAQSchema translationPrefix="taxitax" />
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

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white print:bg-white print:text-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 print:py-6">
          <div className="text-center">
            <div className="mb-6 flex items-center justify-center space-x-3">
              <div className="rounded-xl bg-white/20 p-4 print:bg-blue-100">
                <Car className="h-10 w-10 print:text-blue-600" />
              </div>
              <div className="rounded-xl bg-white/20 p-4 print:bg-blue-100">
                <Smartphone className="h-10 w-10 print:text-blue-600" />
              </div>
            </div>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl print:text-2xl">{t('taxi_calc_title')}</h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-blue-100 print:text-gray-600">{t('taxi_calc_subtitle')}</p>
            <div className="mx-auto mt-6 max-w-3xl rounded-xl bg-white/10 p-4 text-left text-sm text-blue-50 print:hidden">
              {language === 'ky'
                ? 'Агрегатор аркылуу иштеген такси жана курьерлерде 1% киреше салыгынын үстүнө 1% соцтөгүм кармалат — бардыгы 2%.'
                : 'Для такси и курьеров через агрегатор помимо 1% подоходного налога удерживается ещё 1% социальных взносов — всего 2%.'}
            </div>
            {/* Ставка временная и повышается по графику, зашитому в самом законе.
                Без этого таксист, планирующий доход на 2028 год, считает по 1%,
                хотя к тому времени будет 2%, а с 2030-го — 5%.
                Сверено вербатим 02.08.2026: НК КР ст.197 ч.3 (подоходный) и
                Закон КР №8 «О тарифах страховых взносов» ст.7 п.5 (соцвзнос). */}
            <div className="mx-auto mt-3 max-w-3xl rounded-xl bg-amber-400/20 p-4 text-left text-sm text-blue-50 print:hidden">
              {language === 'ky'
                ? 'Көңүл буруңуз: чен убактылуу. 31.12.2027-ге чейин — 1% + 1%; 2028–2029-жылдары — 2% + 2%; 2030-жылдан тартып — 5% + 5% (КР СК 197-берене 3-бөлүк, КР №8 Мыйзамы 7-берене 5-пункт).'
                : 'Обратите внимание: ставка временная. До 31.12.2027 — 1% + 1%; в 2028–2029 годах — 2% + 2%; с 2030 года — 5% + 5% (НК КР ст. 197 ч. 3 и Закон КР № 8 «О тарифах страховых взносов» ст. 7 п. 5).'}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 print:py-6">
        <div className="rounded-2xl bg-white p-8 shadow-xl print:border print:shadow-none md:p-12">
          <div className="mb-10 text-center">
            <div className="mb-4 flex items-center justify-center">
              <DollarSign className="mr-2 h-8 w-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">{t('taxi_calc_header')}</h2>
            </div>
            <p className="text-gray-600">{t('taxi_calc_description')}</p>
          </div>

          {hasData && (
            <div className="mb-8 flex justify-center">
              <ActionButtons
                onPrint={handlePrint}
                calculatorName={t('taxi_calc_name_full')}
                resultText={`${t('taxi_results_title')}
${language === 'ky' ? 'Түшүм:' : 'Доход:'} ${formatCurrency(results.income)} ${t('taxi_som')}
${language === 'ky' ? 'Киреше салыгы 1%:' : 'Подоходный налог 1%:'} ${formatCurrency(results.incomeTax)} ${t('taxi_som')}
${language === 'ky' ? 'Соцтөгүм 1%:' : 'Соцвзнос 1%:'} ${formatCurrency(results.socialFund)} ${t('taxi_som')}
${language === 'ky' ? 'Жалпы кармоо 2%:' : 'Итого удержание 2%:'} ${formatCurrency(results.totalWithheld)} ${t('taxi_som')}`}
              />
            </div>
          )}

          <div className="mb-10">
            <div className="mb-4 flex items-center">
              <label className="block text-lg font-semibold text-gray-700">{t('taxi_income_input')}</label>
              <Tooltip
                text={
                  language === 'ky'
                    ? 'Агрегатор аркылуу өткөн айлык түшүмдү киргизиңиз. Калькулятор 1% киреше салыгын жана 1% соцтөгүмдү өзүнчө көрсөтөт.'
                    : 'Введите месячный доход через агрегатор. Калькулятор отдельно покажет 1% подоходного налога и 1% соцвзносов.'
                }
              >
                <Info className="ml-2 h-5 w-5 cursor-help text-gray-400" />
              </Tooltip>
            </div>
            <input
              type="text"
              value={income}
              onChange={handleIncomeChange}
              placeholder={t('taxi_income_placeholder')}
              className="w-full rounded-xl border-2 border-gray-300 px-6 py-6 text-2xl font-medium transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/25"
            />
          </div>

          <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 p-8 text-center text-white">
            <div className="mb-4 flex items-center justify-center">
              <Calculator className="mr-3 h-8 w-8" />
              <span className="text-xl text-blue-100">
                {language === 'ky' ? 'Жалпы кармоо' : 'Общее удержание'}
              </span>
            </div>
            <p className="mb-4 text-6xl font-bold">{formatCurrency(results.totalWithheld)} {t('taxi_som')}</p>
            <p className="text-lg text-blue-100">
              {language === 'ky' ? '1% киреше салыгы + 1% соцтөгүм' : '1% подоходный налог + 1% социальные взносы'}
            </p>
          </div>

          <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-6">
              <div className="mb-2 text-sm text-orange-700">
                {language === 'ky' ? 'Киреше салыгы' : 'Подоходный налог'}
              </div>
              <div className="text-2xl font-bold text-orange-600">{formatCurrency(results.incomeTax)} {t('taxi_som')}</div>
            </div>
            <div className="rounded-xl border border-purple-200 bg-purple-50 p-6">
              <div className="mb-2 text-sm text-purple-700">
                {language === 'ky' ? 'Соцтөгүм' : 'Социальные взносы'}
              </div>
              <div className="text-2xl font-bold text-purple-600">{formatCurrency(results.socialFund)} {t('taxi_som')}</div>
            </div>
            <div className="rounded-xl border border-green-200 bg-green-50 p-6">
              <div className="mb-2 text-sm text-green-700">
                {language === 'ky' ? 'Колдо калган сумма' : 'Остаётся на руки'}
              </div>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(results.netAfterWithholding)} {t('taxi_som')}</div>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="mb-6 text-center text-lg font-semibold text-gray-900">{t('taxi_quick_examples')}</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[10000, 30000, 50000, 100000, 150000, 200000, 300000, 500000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setIncome(amount.toString())}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50"
                >
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-900">{formatCurrency(amount)} {t('taxi_som')}</div>
                    <div className="mt-2 text-sm text-blue-600">
                      {language === 'ky' ? 'Кармоо:' : 'Удержание:'} {formatCurrency(amount * 0.02)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
            <div className="flex items-start space-x-3">
              <Info className="mt-1 h-6 w-6 flex-shrink-0 text-blue-600" />
              <div className="text-sm text-blue-800">
                <p className="mb-3 font-semibold">
                  {language === 'ky' ? 'Формула' : 'Формула расчёта'}
                </p>
                <div className="mb-3 rounded-lg bg-white p-4 text-center font-mono text-lg text-gray-900">
                  {language === 'ky' ? 'Жалпы кармоо = Түшүм x 1% + Түшүм x 1%' : 'Общее удержание = Доход x 1% + Доход x 1%'}
                </div>
                <p>
                  <strong>{language === 'ky' ? 'Мисал:' : 'Пример:'}</strong>{' '}
                  {language === 'ky'
                    ? `100 000 сом түшүм болсо, 1 000 сом киреше салыгы, 1 000 сом соцтөгүм, жалпысынан 2 000 сом кармалат.`
                    : `При доходе 100 000 сом удержание составит 1 000 сом подоходного налога и 1 000 сом соцвзносов, всего 2 000 сом.`}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-start space-x-3">
              <Smartphone className="mt-1 h-6 w-6 flex-shrink-0 text-amber-600" />
              <div className="text-sm text-amber-800">
                <p className="mb-2 font-semibold">
                  {language === 'ky' ? 'Кимге тиешелүү' : 'Кому подходит режим'}
                </p>
                <ul className="space-y-1">
                  <li>• {language === 'ky' ? 'Яндекс Go, Namba, Glovo жана башка агрегаторлор аркылуу иштегендерге' : 'Тем, кто работает через Яндекс Go, Namba, Glovo и другие агрегаторы'}</li>
                  <li>• {language === 'ky' ? 'Такси айдоочуларына жана жеткирүү курьерлерине' : 'Водителям такси и курьерам доставки'}</li>
                  <li>• {language === 'ky' ? 'Кармоону агрегатор өзү жүргүзгөн учурларга' : 'Сценариям, когда удержание делает сам агрегатор'}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h4 className="mb-4 font-semibold text-gray-900">
              {language === 'ky' ? 'Башка режимдер менен салыштыруу' : 'Сравнение с другими режимами'}
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 text-left font-medium text-gray-700">{language === 'ky' ? 'Режим' : 'Режим'}</th>
                    <th className="py-2 text-left font-medium text-gray-700">{language === 'ky' ? 'Жүктөм' : 'Нагрузка'}</th>
                    <th className="py-2 text-left font-medium text-gray-700">{language === 'ky' ? 'Комментарий' : 'Комментарий'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-blue-50">
                    <td className="py-3 font-medium text-blue-800">{language === 'ky' ? 'Агрегатор режими' : 'Режим через агрегатор'}</td>
                    <td className="py-3 text-blue-600">2%</td>
                    <td className="py-3 text-gray-600">
                      {language === 'ky' ? '1% салык + 1% соцтөгүм, автоматтык кармоо' : '1% налог + 1% соцвзнос, автоматическое удержание'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3">{t('taxi_regime_patent')}</td>
                    <td className="py-3">{language === 'ky' ? 'фикс ставка' : 'фиксированная ставка'}</td>
                    <td className="py-3 text-gray-600">
                      {language === 'ky' ? 'Патенттин өзүнчө баасы жана отчет талаптары болушу мүмкүн' : 'Может быть выгоден при стабильной загрузке, но требует отдельной проверки стоимости патента'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3">{t('taxi_regime_regular')}</td>
                    <td className="py-3">{language === 'ky' ? 'режимге жараша' : 'зависит от режима'}</td>
                    <td className="py-3 text-gray-600">
                      {language === 'ky' ? 'Эгер агрегатор кармабаса, башка салык режимин тандоо керек' : 'Если агрегатор не удерживает налог, нужно выбирать другой налоговый режим'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-xl bg-white p-8 shadow-sm print:hidden">
          <h3 className="mb-4 font-medium text-gray-900">{t('other_calculators')}</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link to={getLocalizedPath('/calculator/single-tax')} className="group rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-200 hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-green-50 p-2 transition-colors group-hover:bg-green-100">
                  <Receipt className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">{t('taxi_single_tax_calc')}</div>
                  <div className="text-sm text-gray-500">{t('taxi_single_tax_desc')}</div>
                </div>
              </div>
            </Link>
            <Link to={getLocalizedPath('/calculator/patent')} className="group rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-200 hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-green-50 p-2 transition-colors group-hover:bg-green-100">
                  <Building2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">{t('taxi_patent_calc')}</div>
                  <div className="text-sm text-gray-500">{t('taxi_patent_desc')}</div>
                </div>
              </div>
            </Link>
            <Link to={getLocalizedPath('/calculator/salary')} className="group rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-200 hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-green-50 p-2 transition-colors group-hover:bg-green-100">
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
      </div>

      <div className="border-t border-yellow-200 bg-yellow-50 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-start space-x-3">
            <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
            <div className="text-sm text-yellow-800">
              <p className="mb-2 font-medium">{t('legal_notice')}</p>
              <ul className="space-y-1">
                <li>• {language === 'ky' ? `Калькулятор ${currentMonth} карата 1% + 1% моделин көрсөтөт.` : `Калькулятор отражает модель 1% + 1% по состоянию на ${currentMonth}.`}</li>
                <li>• {language === 'ky' ? 'Эгер агрегатор кармоону жасабаса, өзүнчө режим тандап, бухгалтер менен тактоо керек.' : 'Если агрегатор не делает удержание автоматически, нужно отдельно выбрать налоговый режим и уточнить расчёт у бухгалтера.'}</li>
                <li>• {language === 'ky' ? 'Бул эсептөө айлык түшүм боюнча ыкчам баалоо үчүн берилген.' : 'Расчёт предназначен для быстрой оценки по месячному доходу.'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxiTaxCalculatorPage;
