import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Info, Home, Printer, Heart, Users, Shield, DollarSign, CreditCard, TrendingUp } from 'lucide-react';
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

// Конфигурация пособия - легко обновляемая структура
const BENEFIT_CONFIG = {
  benefitAmount: 1200, // сом на ребенка в месяц
  incomeThreshold: 1000, // сом на человека в месяц
  minimumAge: 0, // месяцев (с рождения)
  maximumAge: 16 * 12, // месяцев (до 16 лет включительно)
  applicationPeriod: 'Круглогодично'
};

interface BenefitResults {
  totalIncome: number;
  familySize: number;
  childrenCount: number;
  incomePerPerson: number;
  isEligible: boolean;
  benefitAmount: number;
  reasons: string[];
}

const FamilyBenefitCalculatorPage = () => {
  const { language, t, getLocalizedPath} = useLanguage();

  React.useEffect(() => {
    document.title = t('family_benefit_calc_title') + " - Calk.KG";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('family_benefit_calc_description'));
    }
  }, [t]);

  // Генерация схем для страницы калькулятора пособия
  const generateSchemas = () => {
    const currentUrl = language === 'ky' ? "https://calk.kg/ky/calculator/family-benefit" : "https://calk.kg/calculator/family-benefit";
    const homeUrl = language === 'ky' ? "https://calk.kg/ky" : "https://calk.kg";
    
    const calculatorSchema = generateCalculatorSchema({
      url: currentUrl,
      title: t('family_benefit_calc_title'),
      description: t('family_benefit_calc_subtitle'),
      calculatorName: t('family_benefit_calc_title'),
      category: t('nav_other'),
      language,
      inputProperties: ["familyIncome", "familySize", "childrenAges"],
      outputProperties: ["eligibility", "benefitAmount", "incomePerPerson"]
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: homeUrl },
      { name: t('nav_other'), url: `${homeUrl}?category=other` },
      { name: t('family_benefit_calc_title'), url: currentUrl }
    ]);

    return [calculatorSchema, breadcrumbSchema];
  };

  const [totalIncome, setTotalIncome] = useState<string>('');
  const [familySize, setFamilySize] = useState<number>(3);
  const [childrenAges, setChildrenAges] = useState<number[]>([5, 10]); // возраст детей в годах
  
  const [results, setResults] = useState<BenefitResults>({
    totalIncome: 0,
    familySize: 0,
    childrenCount: 0,
    incomePerPerson: 0,
    isEligible: false,
    benefitAmount: 0,
    reasons: []
  });

  // Расчет права на пособие
  const calculateBenefit = (
    income: number,
    family: number,
    children: number[]
  ): BenefitResults => {
    const incomePerPerson = family > 0 ? income / family : 0;
    
    // Проверка права на пособие
    const isIncomeEligible = incomePerPerson <= BENEFIT_CONFIG.incomeThreshold;
    
    // Подсчет детей, имеющих право на пособие (до 16 лет)
    const eligibleChildren = children.filter(age => age >= 0 && age < 16).length;
    
    const reasons: string[] = [];

    if (!isIncomeEligible) {
      reasons.push(`${t('family_income_exceeds_threshold')} (${Math.round(incomePerPerson)} сом) ${t('threshold')} ${BENEFIT_CONFIG.incomeThreshold} сом`);
    }

    if (eligibleChildren === 0) {
      reasons.push(t('family_no_children_eligible'));
    }
    
    const isEligible = isIncomeEligible && eligibleChildren > 0;
    const benefitAmount = isEligible ? eligibleChildren * BENEFIT_CONFIG.benefitAmount : 0;

    return {
      totalIncome: income,
      familySize: family,
      childrenCount: eligibleChildren,
      incomePerPerson,
      isEligible,
      benefitAmount,
      reasons
    };
  };

  // Обновление возраста ребенка
  const updateChildAge = (index: number, age: number) => {
    const newAges = [...childrenAges];
    newAges[index] = Math.max(0, Math.min(20, age)); // от 0 до 20 лет
    setChildrenAges(newAges);
  };

  // Добавление ребенка
  const addChild = () => {
    if (childrenAges.length < 10) { // максимум 10 детей
      setChildrenAges([...childrenAges, 5]);
      setFamilySize(prev => prev + 1);
    }
  };

  // Удаление ребенка
  const removeChild = (index: number) => {
    if (childrenAges.length > 1) {
      const newAges = childrenAges.filter((_, i) => i !== index);
      setChildrenAges(newAges);
      setFamilySize(prev => Math.max(1, prev - 1));
    }
  };

  // Обновление результатов
  useEffect(() => {
    const income = parseFloat(totalIncome) || 0;
    setResults(calculateBenefit(income, familySize, childrenAges));
  }, [totalIncome, familySize, childrenAges]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-KG', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setTotalIncome(value);
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
        <title>{t('family_benefit_calc_title')} - Calk.KG</title>
        <meta name="description" content={t('family_benefit_calc_description')} />
        <meta name="keywords" content={t('family_benefit_keywords')} />
        <meta property="og:title" content={`${t('family_benefit_calc_title')} - Calk.KG`} />
        <meta property="og:description" content={t('family_benefit_calc_subtitle')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/family-benefit" : "https://calk.kg/calculator/family-benefit"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/family-benefit.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('family_benefit_calc_title')} - Calk.KG`} />
        <meta name="twitter:description" content={t('family_benefit_calc_subtitle')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/family-benefit.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/family-benefit" : "https://calk.kg/calculator/family-benefit"} />
      </Helmet>
      <HreflangTags path="/calculator/family-benefit" />
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
              <Heart className="h-8 w-8 print:text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold print:text-2xl">{t('family_benefit_calc_title')}</h1>
              <p className="text-red-100 text-lg print:text-gray-600">{t('family_benefit_calc_subtitle')}</p>
            </div>
          </div>
          
          {/* Data Currency Notice */}
          <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3 print:hidden">
            <Shield className="h-5 w-5 text-amber-200" />
            <span className="text-amber-100 text-sm">
              {t('data_current_as_of')} {currentMonth} • {t('calculation_preliminary_nature')}
            </span>
          </div>
        </div>
      </div>

      {/* Legal Warning Banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start space-x-3">
            <Info className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div className="text-sm text-yellow-800">
              <p className="font-bold mb-2">⚖️ {t('important_notice')}</p>
              <p className="mb-2">
                {t('calculation_preliminary_info')} {t('not_official_decision')}
              </p>
              <p>
                {t('final_decision_by_authorities')}
              </p>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('family_data_title')}</h2>

              {/* Total Income */}
              <div className="mb-8">
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('family_monthly_income')}
                  </label>
                  <Tooltip text={t('family_monthly_income_tooltip')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={totalIncome}
                  onChange={handleIncomeChange}
                  placeholder={t('family_income_placeholder')}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg print:text-base"
                />
              </div>

              {/* Family Size */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <label className="block text-sm font-medium text-gray-700">
                      {t('family_size_label')}
                    </label>
                    <Tooltip text={t('family_size_tooltip')}>
                      <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                    </Tooltip>
                  </div>
                  <span className="text-xl font-bold text-red-600">{familySize} {t('family_size_unit')}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={familySize}
                  onChange={(e) => setFamilySize(parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>8</span>
                  <span>{t('family_size_max')}</span>
                </div>
              </div>

              {/* Children Ages */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <label className="block text-sm font-medium text-gray-700">
                      {t('family_children_age_label')}
                    </label>
                    <Tooltip text={t('family_children_age_tooltip')}>
                      <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                    </Tooltip>
                  </div>
                  <button
                    onClick={addChild}
                    className="text-red-600 text-sm hover:text-red-700 transition-colors print:hidden"
                  >
                    {t('family_add_child')}
                  </button>
                </div>

                <div className="space-y-3">
                  {childrenAges.map((age, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600 w-16">{t('family_child_number')} {index + 1}:</span>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={age}
                        onChange={(e) => updateChildAge(index, parseInt(e.target.value) || 0)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                      <span className="text-sm text-gray-500 w-12">{t('years_short')}</span>
                      {childrenAges.length > 1 && (
                        <button
                          onClick={() => removeChild(index)}
                          className="text-red-600 text-sm hover:text-red-700 transition-colors print:hidden"
                        >
                          {t('family_remove_child')}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Eligibility Criteria Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-2">{t('family_eligibility_criteria')}</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>{t('family_criterion_1')} {BENEFIT_CONFIG.incomeThreshold} сом</li>
                      <li>{t('family_criterion_2')}</li>
                      <li>{t('family_criterion_3')} {BENEFIT_CONFIG.benefitAmount} сом на каждого ребенка</li>
                      <li>{t('family_criterion_4')}</li>
                    </ul>
                    <p className="mt-3">
                      👨‍👩‍👧‍👦 <strong>{t('family_additional_support')}</strong> {t('family_additional_support_text')} <Link to={getLocalizedPath("/calculator/alimony")} className="text-blue-600 hover:text-blue-800 underline">{t('family_alimony_calculator_link')}</Link>. {t('family_for_working_parents')} <Link to={getLocalizedPath("/calculator/salary")} className="text-blue-600 hover:text-blue-800 underline">{t('family_salary_calculator_link')}</Link>.
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
                <h2 className="text-xl font-semibold text-gray-900">{t('family_check_result')}</h2>
                {(results.isEligible || results.reasons.length > 0) && (
                  <ActionButtons
                    calculatorName={t('family_benefit_calc_name_full')}
                    resultText={`${t('family_calculation_text_prefix')}
${t('family_total_income')} ${formatCurrency(results.totalIncome)} сом
${t('family_size_label')}: ${results.familySize} ${t('person')}
${t('family_income_per_person')} ${formatCurrency(Math.round(results.incomePerPerson))} сом
${t('family_children_under_16')} ${results.childrenCount}
${t('family_result_check_colon')} ${results.isEligible ? t('family_has_right_yes') : t('family_has_right_no')}
${results.isEligible ? `${t('family_total_benefit_per_month')}: ${formatCurrency(results.benefitAmount)} ${t('som_per_month')}` : `${t('family_refusal_reasons')}: ${results.reasons.join(', ')}`}

${t('family_result_calculation_site')}`}
                  />
                )}
              </div>
              
              {(results.isEligible || results.reasons.length > 0) ? (
                <div className="space-y-8">
                  {/* Main Result */}
                  <div className={`rounded-xl p-8 text-white text-center ${
                    results.isEligible 
                      ? 'bg-gradient-to-r from-green-500 to-green-600' 
                      : 'bg-gradient-to-r from-red-500 to-red-600'
                  }`}>
                    <div className="flex items-center justify-center mb-2">
                      <Heart className="h-6 w-6 mr-2" />
                      <span className={results.isEligible ? 'text-green-100' : 'text-red-100'}>
                        {t('family_result_check_colon')}
                      </span>
                    </div>
                    <p className="text-5xl font-bold mb-2">
                      {results.isEligible ? t('family_has_right') : t('family_no_right')}
                    </p>
                    <p className={`text-lg ${results.isEligible ? 'text-green-100' : 'text-red-100'}`}>
                      {results.isEligible
                        ? `${t('family_benefit_amount_per_month')} ${formatCurrency(results.benefitAmount)} ${t('som_per_month')}`
                        : `${t('family_benefit_amount_per_month')} ${t('family_by_provided_data')}`
                      }
                    </p>
                  </div>

                  {/* Income Analysis */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                      <DollarSign className="h-5 w-5 mr-2" />
                      {t('family_income_analysis')}
                    </h3>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t('family_total_income')}</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(results.totalIncome)} сом
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t('family_size_label')}:</span>
                        <span className="font-semibold text-gray-900">
                          {results.familySize} {t('person')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t('family_income_per_person')}</span>
                        <span className={`font-semibold ${
                          results.incomePerPerson <= BENEFIT_CONFIG.incomeThreshold
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}>
                          {formatCurrency(Math.round(results.incomePerPerson))} сом
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t('family_threshold_income')}</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(BENEFIT_CONFIG.incomeThreshold)} сом
                        </span>
                      </div>
                    </div>

                    {/* Income Threshold Visualization */}
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">{t('family_income_vs_threshold')}</span>
                        <span className={`text-sm font-medium ${
                          results.incomePerPerson <= BENEFIT_CONFIG.incomeThreshold
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}>
                          {results.incomePerPerson > 0
                            ? `${((results.incomePerPerson / BENEFIT_CONFIG.incomeThreshold) * 100).toFixed(1)}%`
                            : '0%'
                          }
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            results.incomePerPerson <= BENEFIT_CONFIG.incomeThreshold
                              ? 'bg-gradient-to-r from-green-500 to-green-600'
                              : 'bg-gradient-to-r from-red-500 to-red-600'
                          }`}
                          style={{
                            width: `${Math.min(100, (results.incomePerPerson / BENEFIT_CONFIG.incomeThreshold) * 100)}%`
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{t('zero_som')}</span>
                        <span>{BENEFIT_CONFIG.incomeThreshold} сом ({t('threshold')})</span>
                      </div>
                    </div>
                  </div>

                  {/* Children Analysis */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      {t('family_children_analysis')}
                    </h3>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t('family_total_children')}</span>
                        <span className="font-semibold text-gray-900">
                          {childrenAges.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t('family_children_under_16')}</span>
                        <span className={`font-semibold ${
                          results.childrenCount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {results.childrenCount}
                        </span>
                      </div>

                      {/* Children List */}
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">{t('family_children_ages')}</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {childrenAges.map((age, index) => (
                            <div
                              key={index}
                              className={`p-2 rounded text-center text-sm ${
                                age < 16
                                  ? 'bg-green-100 text-green-800 border border-green-200'
                                  : 'bg-red-100 text-red-800 border border-red-200'
                              }`}
                            >
                              {age} {t('years_short')} {age < 16 ? '✓' : '✗'}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Benefit Calculation */}
                  {results.isEligible ? (
                    <div className="bg-green-50 rounded-xl p-6">
                      <h3 className="font-medium text-gray-900 mb-4">{t('family_benefit_calculation')}</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">{t('family_eligible_children')}</span>
                          <span className="font-semibold text-green-600">
                            {results.childrenCount}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">{t('family_benefit_per_child')}</span>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(BENEFIT_CONFIG.benefitAmount)} сом
                          </span>
                        </div>
                        <div className="border-t pt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-900 font-medium">{t('family_total_benefit_per_month')}</span>
                            <span className="text-2xl font-bold text-green-600">
                              {formatCurrency(results.benefitAmount)} сом
                            </span>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 mt-4">
                          <div className="text-center text-gray-700 text-sm">
                            {results.childrenCount} {t('family_total_children').toLowerCase()} × {BENEFIT_CONFIG.benefitAmount} сом = {formatCurrency(results.benefitAmount)} {t('som_per_month')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 rounded-xl p-6">
                      <h3 className="font-medium text-gray-900 mb-4">{t('family_refusal_reasons')}</h3>
                      <ul className="space-y-2">
                        {results.reasons.map((reason, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-red-800 text-sm">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Additional Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-700 mb-3">{t('family_additional_info')}</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>{t('family_assignment_period')}</span>
                        <span>{t('family_months_12')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('family_children_age_for_benefit')}</span>
                        <span>{t('family_age_0_to_16')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('family_threshold_income')}</span>
                        <span>{formatCurrency(BENEFIT_CONFIG.incomeThreshold)} {t('som_per_person')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('family_criterion_3')}</span>
                        <span>{formatCurrency(BENEFIT_CONFIG.benefitAmount)} {t('som_per_child')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <Heart className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">{t('family_enter_data_prompt')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="mt-12 space-y-12">
          {/* Quick Examples */}
          <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
            <h3 className="font-medium text-gray-900 mb-4">{t('family_examples_title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { income: 2500, family: 4, children: [3, 8], label: t('family_example_2children'), hasRight: true },
                { income: 4500, family: 5, children: [2, 6, 12], label: t('family_example_many_children'), hasRight: false },
                { income: 1800, family: 3, children: [5], label: t('family_example_single_mother'), hasRight: true },
                { income: 3200, family: 6, children: [1, 4, 9, 15], label: t('family_example_large_family'), hasRight: true }
              ].map((example, index) => {
                const exampleResult = calculateBenefit(example.income, example.family, example.children);
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setTotalIncome(example.income.toString());
                      setFamilySize(example.family);
                      setChildrenAges(example.children);
                    }}
                    className="text-left p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium text-sm">
                        {example.label}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        exampleResult.isEligible
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {exampleResult.isEligible ? t('family_has_right_badge') : t('family_no_right_badge')}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${
                        exampleResult.isEligible ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {exampleResult.isEligible
                          ? `${formatCurrency(exampleResult.benefitAmount)} ${t('som_per_month')}`
                          : '0 сом'
                        }
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatCurrency(Math.round(exampleResult.incomePerPerson))} {t('som_per_person')}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Important Legal Notice */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-8">
            <div className="flex items-start space-x-4">
              <Info className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
              <div className="text-sm text-red-800">
                <p className="font-bold mb-3 text-lg">⚖️ {t('family_legal_notice_title')}</p>
                <div className="space-y-2">
                  <p>
                    <strong>{t('family_legal_text_1')}</strong> {t('family_calculation_orientation')}
                  </p>
                  <p>
                    {t('family_legal_text_2')}
                  </p>
                  <p>
                    <strong>{t('family_legal_text_3')}</strong> {t('family_contact_for_info')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How to Apply */}
          <div className="bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
            <h3 className="font-medium text-gray-900 mb-6">{t('family_how_to_apply')}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium text-gray-800 mb-3">{t('family_required_docs')}</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('family_doc_application')}
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('family_doc_income')}
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('family_doc_birth_certificates')}
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('family_doc_family_composition')}
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('family_doc_passports')}
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-3">{t('family_where_to_apply')}</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('family_apply_social_protection')}
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('family_apply_service_centers')}
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {t('family_apply_ail_okmotu')}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Other Calculators */}
          <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
            <h3 className="font-medium text-gray-900 mb-4">{t('other_calculators')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to={getLocalizedPath("/calculator/alimony")}
                className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-50 p-2 rounded-lg group-hover:bg-gray-100 transition-colors">
                    <Users className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-red-600">{t('related_alimony_calc')}</div>
                    <div className="text-sm text-gray-500">{t('related_alimony_desc')}</div>
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

export default FamilyBenefitCalculatorPage;