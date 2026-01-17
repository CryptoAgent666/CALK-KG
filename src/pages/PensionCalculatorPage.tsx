import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Info, Home, Printer, TrendingUp, ChevronRight, ChevronLeft, PieChart, Plus, Trash2, Shield, CreditCard } from 'lucide-react';
import ActionButtons from '../components/ActionButtons';
import SchemaMarkup from '../components/SchemaMarkup';
import HreflangTags from '../components/HreflangTags';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  generateCalculatorSchema, 
  generateBreadcrumbSchema,
  generateSoftwareApplicationSchema 
} from '../utils/schemaGenerator';

type Gender = 'male' | 'female';
type EmploymentType = 'employee' | 'entrepreneur' | 'farmer';
type Step = 'basic' | 'experience' | 'forecast' | 'results';

interface WorkPeriod {
  id: string;
  startMonth: number;
  startYear: number;
  endMonth: number;
  endYear: number;
  salary: number;
  employmentType: EmploymentType;
}

interface PensionResults {
  basePart: number;
  insurancePart1: number;
  insurancePart2: number;
  totalPension: number;
  yearsToRetirement: number;
  totalContributions: number;
}

const PensionCalculatorPage = () => {
  const { language, t, getLocalizedPath} = useLanguage();

  React.useEffect(() => {
    document.title = t('pension_calc_title') + " - Calk.KG";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('pension_calc_description'));
    }
  }, [t]);

  // Генерация схем для страницы пенсионного калькулятора
  const generateSchemas = () => {
    const currentUrl = language === 'ky' ? "https://calk.kg/ky/calculator/pension" : "https://calk.kg/calculator/pension";
    const homeUrl = language === 'ky' ? "https://calk.kg/ky" : "https://calk.kg";
    
    const calculatorSchema = generateCalculatorSchema({
      url: currentUrl,
      title: t('pension_calc_title'),
      description: t('pension_calc_subtitle'),
      calculatorName: t('pension_calc_title'),
      category: t('nav_finance'),
      language,
      inputProperties: ["birthDate", "workExperience", "currentSalary", "retirementAge"],
      outputProperties: ["basePart", "insurancePart1", "insurancePart2", "totalPension"]
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: homeUrl },
      { name: t('nav_finance'), url: `${homeUrl}?category=finance` },
      { name: t('pension_calc_title'), url: currentUrl }
    ]);

    return [calculatorSchema, breadcrumbSchema];
  };

  const [currentStep, setCurrentStep] = useState<Step>('basic');
  
  // Basic data
  const [gender, setGender] = useState<Gender>('male');
  const [birthDate, setBirthDate] = useState<string>('');
  
  // Work experience
  const [workPeriods, setWorkPeriods] = useState<WorkPeriod[]>([]);
  
  // Forecast data
  const [currentSalary, setCurrentSalary] = useState<string>('');
  const [retirementAge, setRetirementAge] = useState<number>(63);
  
  // Results
  const [results, setResults] = useState<PensionResults>({
    basePart: 0,
    insurancePart1: 0,
    insurancePart2: 0,
    totalPension: 0,
    yearsToRetirement: 0,
    totalContributions: 0
  });

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Calculate current age
  const getCurrentAge = (): number => {
    if (!birthDate) return 0;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Get default retirement age
  const getDefaultRetirementAge = (): number => {
    return gender === 'male' ? 63 : 58;
  };

  useEffect(() => {
    setRetirementAge(getDefaultRetirementAge());
  }, [gender]);

  // Calculate total work experience in months
  const getTotalExperienceMonths = (): number => {
    return workPeriods.reduce((total, period) => {
      const startDate = new Date(period.startYear, period.startMonth - 1);
      const endDate = new Date(period.endYear, period.endMonth - 1);
      const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                        (endDate.getMonth() - startDate.getMonth()) + 1;
      return total + monthsDiff;
    }, 0);
  };

  // Calculate experience before 1996
  const getExperienceBefore1996 = (): { months: number, avgSalary: number } => {
    let totalMonths = 0;
    let totalSalary = 0;
    let validPeriods = 0;

    workPeriods.forEach(period => {
      const startDate = new Date(period.startYear, period.startMonth - 1);
      const endDate = new Date(period.endYear, period.endMonth - 1);
      const cutoffDate = new Date(1996, 0, 1); // 1 января 1996

      if (startDate < cutoffDate) {
        const actualEndDate = endDate < cutoffDate ? endDate : cutoffDate;
        const monthsDiff = (actualEndDate.getFullYear() - startDate.getFullYear()) * 12 + 
                          (actualEndDate.getMonth() - startDate.getMonth()) + 1;
        
        totalMonths += monthsDiff;
        totalSalary += period.salary;
        validPeriods++;
      }
    });

    return {
      months: totalMonths,
      avgSalary: validPeriods > 0 ? totalSalary / validPeriods : 0
    };
  };

  // Add new work period
  const addWorkPeriod = () => {
    const newPeriod: WorkPeriod = {
      id: Date.now().toString(),
      startMonth: 1,
      startYear: currentYear - 5,
      endMonth: currentMonth,
      endYear: currentYear,
      salary: 50000,
      employmentType: 'employee'
    };
    setWorkPeriods([...workPeriods, newPeriod]);
  };

  // Update work period
  const updateWorkPeriod = (id: string, field: keyof WorkPeriod, value: any) => {
    setWorkPeriods(prev => prev.map(period => 
      period.id === id ? { ...period, [field]: value } : period
    ));
  };

  // Remove work period
  const removeWorkPeriod = (id: string) => {
    setWorkPeriods(prev => prev.filter(period => period.id !== id));
  };

  // Calculate pension
  const calculatePension = () => {
    const currentAge = getCurrentAge();
    const yearsToRetirement = Math.max(0, retirementAge - currentAge);
    const totalExperienceMonths = getTotalExperienceMonths();
    const experienceBefore1996 = getExperienceBefore1996();
    const salary = parseFloat(currentSalary) || 0;

    // Базовая часть (фиксированная сумма при минимальном стаже)
    const minRequiredMonths = 180; // 15 лет
    const basePart = totalExperienceMonths >= minRequiredMonths ? 3000 : 0;

    // Страховая часть 1 (за стаж до 1996)
    const insurancePart1 = experienceBefore1996.months > 0 ? 
      (experienceBefore1996.avgSalary * 0.01 * Math.min(experienceBefore1996.months / 12, 25)) : 0;

    // Страховая часть 2 (накопления после 1996)
    // Рассчитываем накопленные взносы за прошлые периоды
    let pastContributions = 0;
    workPeriods.forEach(period => {
      const startDate = new Date(period.startYear, period.startMonth - 1);
      const endDate = new Date(period.endYear, period.endMonth - 1);
      const cutoffDate = new Date(1996, 0, 1);
      
      if (endDate >= cutoffDate) {
        const actualStartDate = startDate > cutoffDate ? startDate : cutoffDate;
        const monthsDiff = (endDate.getFullYear() - actualStartDate.getFullYear()) * 12 + 
                          (endDate.getMonth() - actualStartDate.getMonth()) + 1;
        
        // 10% взносы в пенсионный фонд
        pastContributions += period.salary * 0.10 * monthsDiff;
      }
    });

    // Прогнозируемые взносы до выхода на пенсию
    const futureContributions = salary * 0.10 * 12 * yearsToRetirement;
    const totalContributions = pastContributions + futureContributions;

    // Ожидаемый период дожития (15 лет = 180 месяцев)
    const expectedLifespan = 180;
    const insurancePart2 = totalContributions / expectedLifespan;

    const totalPension = basePart + insurancePart1 + insurancePart2;

    setResults({
      basePart,
      insurancePart1,
      insurancePart2,
      totalPension,
      yearsToRetirement,
      totalContributions
    });
  };

  useEffect(() => {
    if (currentStep === 'results') {
      calculatePension();
    }
  }, [currentStep, workPeriods, currentSalary, retirementAge, birthDate, gender]);

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

  // Navigation helpers
  const canGoNext = () => {
    switch (currentStep) {
      case 'basic':
        return birthDate !== '' && gender;
      case 'experience':
        return true; // Можно продолжить даже без стажа
      case 'forecast':
        return currentSalary !== '' && retirementAge > getCurrentAge();
      default:
        return false;
    }
  };

  const nextStep = () => {
    const steps: Step[] = ['basic', 'experience', 'forecast', 'results'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: Step[] = ['basic', 'experience', 'forecast', 'results'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const stepTitles = {
    basic: t('pension_step_basic'),
    experience: t('pension_step_experience'),
    forecast: t('pension_step_forecast'),
    results: t('pension_step_results')
  };

  const months = [
    { value: 1, name: t('month_january') }, { value: 2, name: t('month_february') }, { value: 3, name: t('month_march') },
    { value: 4, name: t('month_april') }, { value: 5, name: t('month_may') }, { value: 6, name: t('month_june') },
    { value: 7, name: t('month_july') }, { value: 8, name: t('month_august') }, { value: 9, name: t('month_september') },
    { value: 10, name: t('month_october') }, { value: 11, name: t('month_november') }, { value: 12, name: t('month_december') }
  ];

  // Generate years for dropdowns
  const generateYears = (startYear: number, endYear: number) => {
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org микроразметка */}
      <Helmet>
        <title>{t('pension_calc_title')} - Calk.KG</title>
        <meta name="description" content={t('pension_calc_subtitle')} />
        <meta name="keywords" content={t('pension_keywords')} />
        <meta property="og:title" content={`${t('pension_calc_title')} - Calk.KG`} />
        <meta property="og:description" content={t('pension_calc_subtitle')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/pension" : "https://calk.kg/calculator/pension"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/pension.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('pension_calc_title')} - Calk.KG`} />
        <meta name="twitter:description" content={t('pension_calc_subtitle')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/pension.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/pension" : "https://calk.kg/calculator/pension"} />
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
              <TrendingUp className="h-8 w-8 print:text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold print:text-2xl">{t('pension_calc_title')}</h1>
              <p className="text-red-100 text-lg print:text-gray-600">{t('pension_calc_subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {['basic', 'experience', 'forecast', 'results'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                  ${currentStep === step ? 'bg-red-600 text-white' : 
                    ['basic', 'experience', 'forecast', 'results'].indexOf(currentStep) > index ? 
                    'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'}
                `}>
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep === step ? 'text-red-600' : 
                  ['basic', 'experience', 'forecast', 'results'].indexOf(currentStep) > index ?
                  'text-green-600' : 'text-gray-500'
                }`}>
                  {stepTitles[step as Step]}
                </span>
                {index < 3 && (
                  <ChevronRight className="h-5 w-5 text-gray-300 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 print:py-6">
        
        {/* Step 1: Basic Data */}
        {currentStep === 'basic' && (
          <div className="bg-white rounded-xl shadow-sm p-8 print:shadow-none print:border">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('pension_step_1_title')}</h2>

            <div className="space-y-6">
              {/* Gender Selection */}
              <div>
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('pension_gender_label')}
                  </label>
                  <Tooltip text={t('tooltip_pension_gender')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === 'male'}
                      onChange={(e) => setGender(e.target.value as Gender)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-gray-700">{t('pension_gender_male')}</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === 'female'}
                      onChange={(e) => setGender(e.target.value as Gender)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-gray-700">{t('pension_gender_female')}</span>
                  </label>
                </div>
              </div>

              {/* Birth Date */}
              <div>
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('pension_birth_date')}
                  </label>
                  <Tooltip text={t('tooltip_pension_birth')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                {birthDate && (
                  <p className="text-sm text-gray-500 mt-2">
                    {t('pension_current_age')} {getCurrentAge()} {t('pension_years')}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Work Experience */}
        {currentStep === 'experience' && (
          <div className="bg-white rounded-xl shadow-sm p-8 print:shadow-none print:border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">{t('pension_step_2_title')}</h2>
              <button
                onClick={addWorkPeriod}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>{t('pension_add_period')}</span>
              </button>
            </div>

            <div className="space-y-6">
              {workPeriods.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>{t('pension_no_periods')}</p>
                  <p className="text-sm mt-1">{t('pension_no_periods_hint')}</p>
                </div>
              ) : (
                workPeriods.map((period, index) => (
                  <div key={period.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">{t('pension_period_title')} {index + 1}</h3>
                      <button
                        onClick={() => removeWorkPeriod(period.id)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Start Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('pension_start_date')}
                        </label>
                        <div className="flex space-x-2">
                          <select
                            value={period.startMonth}
                            onChange={(e) => updateWorkPeriod(period.id, 'startMonth', parseInt(e.target.value))}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          >
                            {months.map(month => (
                              <option key={month.value} value={month.value}>{month.name}</option>
                            ))}
                          </select>
                          <select
                            value={period.startYear}
                            onChange={(e) => updateWorkPeriod(period.id, 'startYear', parseInt(e.target.value))}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          >
                            {generateYears(1970, currentYear).map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* End Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('pension_end_date')}
                        </label>
                        <div className="flex space-x-2">
                          <select
                            value={period.endMonth}
                            onChange={(e) => updateWorkPeriod(period.id, 'endMonth', parseInt(e.target.value))}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          >
                            {months.map(month => (
                              <option key={month.value} value={month.value}>{month.name}</option>
                            ))}
                          </select>
                          <select
                            value={period.endYear}
                            onChange={(e) => updateWorkPeriod(period.id, 'endYear', parseInt(e.target.value))}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          >
                            {generateYears(1970, currentYear).map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Salary */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('pension_avg_salary')}
                        </label>
                        <input
                          type="number"
                          value={period.salary}
                          onChange={(e) => updateWorkPeriod(period.id, 'salary', parseFloat(e.target.value) || 0)}
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>

                      {/* Employment Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('pension_employment_type')}
                        </label>
                        <select
                          value={period.employmentType}
                          onChange={(e) => updateWorkPeriod(period.id, 'employmentType', e.target.value as EmploymentType)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                          <option value="employee">{t('pension_employment_employee')}</option>
                          <option value="entrepreneur">{t('pension_employment_entrepreneur')}</option>
                          <option value="farmer">{t('pension_employment_farmer')}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {workPeriods.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-2">{t('pension_experience_summary')}</h4>
                  <p className="text-sm text-gray-600">
                    {t('pension_total_experience')} {Math.floor(getTotalExperienceMonths() / 12)} {t('pension_years')} {getTotalExperienceMonths() % 12} {t('pension_months')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Forecast */}
        {currentStep === 'forecast' && (
          <div className="bg-white rounded-xl shadow-sm p-8 print:shadow-none print:border">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('pension_step_3_title')}</h2>

            <div className="space-y-6">
              {/* Current Salary */}
              <div>
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('pension_current_salary')}
                  </label>
                  <Tooltip text={t('tooltip_pension_salary')}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <input
                  type="number"
                  value={currentSalary}
                  onChange={(e) => setCurrentSalary(e.target.value)}
                  min="0"
                  placeholder={t('placeholder_enter_pension_salary')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Retirement Age */}
              <div>
                <div className="flex items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('pension_planned_age')}
                  </label>
                  <Tooltip text={`${language === 'ky' ? 'Стандарттык пенсия жашы' : 'Стандартный возраст выхода на пенсию'}: ${getDefaultRetirementAge()} ${t('pension_years')} ${language === 'ky' ? (gender === 'male' ? 'эркектер үчүн' : 'аялдар үчүн') : (gender === 'male' ? 'для мужчин' : 'для женщин')}`}>
                    <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                  </Tooltip>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(parseInt(e.target.value) || getDefaultRetirementAge())}
                    min={getCurrentAge() + 1}
                    max="70"
                    className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <span className="text-gray-600">{t('pension_years')}</span>
                  {retirementAge !== getDefaultRetirementAge() && (
                    <button
                      onClick={() => setRetirementAge(getDefaultRetirementAge())}
                      className="text-red-600 text-sm hover:text-red-700 transition-colors"
                    >
                      {t('pension_reset_to_default')}
                    </button>
                  )}
                </div>
                {birthDate && (
                  <p className="text-sm text-gray-500 mt-2">
                    {t('pension_until_retirement')} {Math.max(0, retirementAge - getCurrentAge())} {t('pension_years')}
                  </p>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-2">{t('pension_about_calc')}</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>{t('pension_info_structure')}</li>
                      <li>{t('pension_info_base_guarantee')}</li>
                      <li>{t('pension_calc_info_3')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {currentStep === 'results' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-8 print:shadow-none print:border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">{t('pension_results_title')}</h2>
                <button
                  onClick={handlePrint}
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors print:hidden"
                >
                  <Printer className="h-4 w-4" />
                  <span>{t('print')}</span>
                </button>
              </div>

              {/* Total Pension Amount */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-8 text-white text-center mb-8">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-6 w-6 mr-2" />
                  <span className="text-green-100">{t('pension_your_forecast')}</span>
                </div>
                <p className="text-5xl font-bold mb-2">
                  {formatCurrency(results.totalPension)} KGS
                </p>
                <p className="text-green-100">{t('pension_per_month')}</p>
              </div>

              {/* Pension Components Visualization */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="font-medium text-gray-900 mb-6 flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  {t('pension_structure')}
                </h3>
                
                <div className="space-y-6">
                  {/* Base Part */}
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                        <span className="font-medium text-gray-700">{t('pension_base_short')}</span>
                        <Tooltip text={t('tooltip_pension_base')}>
                          <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                        </Tooltip>
                      </div>
                      <span className="text-xl font-semibold text-blue-600">
                        {formatCurrency(results.basePart)} KGS
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: results.totalPension > 0 ? `${(results.basePart / results.totalPension) * 100}%` : '0%' }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {getTotalExperienceMonths() >= 180 ?
                        t('pension_base_part_desc') :
                        t('pension_base_part_no')
                      }
                    </p>
                  </div>

                  {/* Insurance Part 1 */}
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-orange-500 rounded mr-3"></div>
                        <span className="font-medium text-gray-700">{t('pension_insurance_1_short')}</span>
                        <Tooltip text={t('tooltip_pension_insurance_old')}>
                          <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                        </Tooltip>
                      </div>
                      <span className="text-xl font-semibold text-orange-600">
                        {formatCurrency(results.insurancePart1)} KGS
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: results.totalPension > 0 ? `${(results.insurancePart1 / results.totalPension) * 100}%` : '0%' }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {t('pension_exp_before_1996')} {Math.floor(getExperienceBefore1996().months / 12)} {t('pension_years')} {getExperienceBefore1996().months % 12} {language === 'ky' ? 'ай' : 'мес.'}
                    </p>
                  </div>

                  {/* Insurance Part 2 */}
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                        <span className="font-medium text-gray-700">{t('pension_insurance_2_short')}</span>
                        <Tooltip text={t('tooltip_pension_insurance_new')}>
                          <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                        </Tooltip>
                      </div>
                      <span className="text-xl font-semibold text-green-600">
                        {formatCurrency(results.insurancePart2)} KGS
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: results.totalPension > 0 ? `${(results.insurancePart2 / results.totalPension) * 100}%` : '0%' }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {t('pension_total_accumulated')} {formatCurrency(results.totalContributions)} KGS {t('pension_for_period')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-700 mb-3">{t('pension_additional_info')}</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>{t('pension_info_current_age')}</span>
                      <span>{getCurrentAge()} {t('pension_years')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('pension_info_years_to_retire')}</span>
                      <span>{results.yearsToRetirement} {t('pension_years')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('pension_info_total_experience')}</span>
                      <span>{Math.floor(getTotalExperienceMonths() / 12)} {t('pension_years')} {getTotalExperienceMonths() % 12} {language === 'ky' ? 'ай' : 'мес.'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('pension_info_min_experience')}</span>
                      <span>{getTotalExperienceMonths() >= 180 ? t('pension_info_completed') : t('pension_info_not_completed')}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-700 mb-3">{t('pension_structure_title')}</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>{t('pension_structure_base')}</span>
                      <span>{results.totalPension > 0 ? ((results.basePart / results.totalPension) * 100).toFixed(1) : 0}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('pension_structure_insurance_1')}</span>
                      <span>{results.totalPension > 0 ? ((results.insurancePart1 / results.totalPension) * 100).toFixed(1) : 0}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('pension_structure_insurance_2')}</span>
                      <span>{results.totalPension > 0 ? ((results.insurancePart2 / results.totalPension) * 100).toFixed(1) : 0}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notice - Усиленный дисклеймер */}
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <Info className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div className="text-sm text-red-800">
                  <p className="font-bold text-lg mb-3">⚠️ {t('pension_important_notice')}</p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li><strong>{t('pension_disclaimer_approximate')}:</strong> {t('pension_disclaimer_approximate_text')}</li>
                    <li><strong>{t('pension_disclaimer_formula')}:</strong> {t('pension_disclaimer_formula_text')}</li>
                    <li><strong>{t('pension_disclaimer_official')}:</strong> {t('pension_disclaimer_official_text')}</li>
                  </ul>
                  <p className="mt-4 p-3 bg-white rounded-lg border border-red-200">
                    <strong>{t('pension_disclaimer_recommendation')}:</strong> {t('pension_disclaimer_recommendation_text')}
                    {' '}
                    <a 
                      href="https://socfond.kg" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-700 underline font-medium"
                    >
                      socfond.kg →
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Info about pension calculation */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-2">{t('pension_how_calculated')}</p>
                  <p className="mb-2">{t('pension_calculation_method_text')}</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>{t('pension_component_base')}</li>
                    <li>{t('pension_component_insurance1')}</li>
                    <li>{t('pension_component_insurance2')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-8 print:hidden">
          <button
            onClick={prevStep}
            disabled={currentStep === 'basic'}
            className={`
              flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors
              ${currentStep === 'basic' 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }
            `}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>{t('back')}</span>
          </button>

          {currentStep !== 'results' && (
            <button
              onClick={nextStep}
              disabled={!canGoNext()}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors
                ${!canGoNext()
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
                }
              `}
            >
              <span>{t('pension_next')}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
        {/* Educational Content - Russian and Kyrgyz */}
        {(language === 'ru' || language === 'ky') && (
        <div className="mt-12 bg-white rounded-xl shadow-sm p-8 print:hidden">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('pension_guide_title')}</h2>

          {/* Section 1: Pension System Overview */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('pension_system_overview')}</h3>
            <p className="text-gray-700 mb-4">
              {t('pension_educational_intro')}
            </p>
            <div className="space-y-3">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-gray-700">
                  <strong>{t('pension_base_pension')}</strong> {t('pension_base_pension_desc')}
                </p>
              </div>
              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <p className="text-gray-700">
                  <strong>{t('pension_accumulative_pension')}</strong> {t('pension_accumulative_desc')}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Contributions */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('pension_contributions_2026')}</h3>

            <div className="border border-gray-200 rounded-lg p-5 mb-4">
              <h4 className="font-semibold text-gray-900 mb-3">{t('pension_contributions_question')}</h4>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="bg-gray-50 rounded p-3">
                  <p className="font-medium mb-2">{t('pension_employer_pays')}</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>{t('pension_employer_npf')}</strong> {t('pension_employer_npf_desc')}</li>
                    <li><strong>{t('pension_employer_social')}</strong> - {t('pension_employer_social_desc')}</li>
                    <li>{t('pension_extra_2')}</li>
                    <li>{t('pension_total_employer')} <strong>{t('pension_total_employer_percent')}</strong></li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <p className="font-medium mb-2">{t('pension_employee_pays')}</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>{t('pension_employee_pays_none')}</strong></li>
                    <li>{t('pension_employee_pays_desc')}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-gray-700 text-sm">
                <strong>{t('pension_example_label')}</strong> {t('pension_example_text')}
              </p>
            </div>
          </div>

          {/* Section 3: Retirement Age */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('pension_retirement_age_title')}</h3>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-gray-900 mb-3">{t('pension_age_2026')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">{t('pension_men')}</p>
                    <p className="text-2xl font-bold text-blue-600">{t('pension_men_age')}</p>
                    <p className="text-xs text-gray-600 mt-1">{t('pension_men_future')}</p>
                  </div>
                  <div className="bg-pink-50 rounded p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">{t('pension_women')}</p>
                    <p className="text-2xl font-bold text-pink-600">{t('pension_women_age')}</p>
                    <p className="text-xs text-gray-600 mt-1">{t('pension_women_future')}</p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-gray-900 mb-3">{t('pension_min_experience_title')}</h4>
                <div className="bg-gray-50 rounded p-4">
                  <p className="text-gray-700 mb-2">
                    <strong>{t('pension_min_experience_years')}</strong> - {t('pension_min_experience_desc')}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t('pension_min_experience_note')}
                  </p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-gray-900 mb-3">{t('pension_early_title')}</h4>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>{t('pension_early_intro')}</p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                    <li>{t('pension_early_harmful')}</li>
                    <li>{t('pension_early_mothers')}</li>
                    <li>{t('pension_early_disabled_mothers')}</li>
                    <li>{t('pension_early_dangerous')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Pension Calculation */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('pension_calculation')}</h3>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-gray-900 mb-3">{t('pension_calculation_formula')}</h4>
                <div className="bg-white rounded p-4">
                  <p className="text-center text-lg font-medium text-gray-800 mb-3">
                    {t('pension_formula_title')}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-700 mb-1">{t('pension_base_part_formula')}</p>
                      <p className="text-gray-600">{t('pension_formula_base_amount')}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 mb-1">{t('pension_formula_accumulative')}</p>
                      <p className="text-gray-600">{t('pension_formula_accumulative_calc')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-gray-900 mb-3">{t('pension_calculation_example')}</h4>
                <div className="bg-gray-50 rounded p-4 space-y-2 text-sm text-gray-700">
                  <p><strong>{t('pension_example_data')}</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                    <li>{t('pension_example_start_age')}</li>
                    <li>{t('pension_example_avg_salary')}</li>
                    <li>{t('pension_example_exp')}</li>
                    <li>{t('pension_example_contributions')}</li>
                    <li>{t('pension_example_yield')}</li>
                  </ul>
                  <div className="border-t border-gray-300 pt-3 mt-3">
                    <p className="font-medium mb-2">{t('pension_example_result')}</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>{t('pension_example_accumulated')}</li>
                      <li>{t('pension_example_monthly')} <strong className="text-green-600">{t('pension_example_monthly_amount')}</strong></li>
                      <li>{t('pension_example_base')} <strong>{t('pension_example_base_amount')}</strong></li>
                      <li><strong className="text-blue-600 text-lg">{t('pension_example_total')} {t('pension_example_total_amount')}</strong></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>{t('pension_important_note')}</strong> {t('pension_important_text')}
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: NPF (Pension Funds) */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('pension_npf_title')}</h3>

            <p className="text-gray-700 mb-4">
              {t('pension_npf_desc')}
            </p>

            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{t('pension_npf_largest')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 rounded p-3">
                    <p className="font-medium">{t('pension_npf_kyrgyzstan')}</p>
                    <p className="text-xs text-gray-600">{t('pension_npf_yield_2024')} 7,8% {t('pension_npf_yield_percent')}</p>
                    <p className="text-xs text-gray-600">☎ +996 (312) 62-44-22</p>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <p className="font-medium">{t('pension_npf_dostuk')}</p>
                    <p className="text-xs text-gray-600">{t('pension_npf_yield_2024')} 8,2% {t('pension_npf_yield_percent')}</p>
                    <p className="text-xs text-gray-600">☎ +996 (312) 66-11-55</p>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <p className="font-medium">{t('pension_npf_kyzylbash')}</p>
                    <p className="text-xs text-gray-600">{t('pension_npf_yield_2024')} 7,5% {t('pension_npf_yield_percent')}</p>
                    <p className="text-xs text-gray-600">☎ +996 (312) 61-00-09</p>
                  </div>
                  <div className="bg-gray-50 rounded p-3">
                    <p className="font-medium">{t('pension_npf_ishenim')}</p>
                    <p className="text-xs text-gray-600">{t('pension_npf_yield_2024')} 8,0% {t('pension_npf_yield_percent')}</p>
                    <p className="text-xs text-gray-600">☎ +996 (312) 90-15-15</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>{t('pension_npf_check')}</strong> {t('pension_npf_check_text')}
                </p>
              </div>
            </div>
          </div>

          {/* Section 6: FAQ */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('pension_faq_title')}</h3>

            <div className="space-y-4">
              <details className="border border-gray-200 rounded-lg p-5 cursor-pointer hover:bg-gray-50">
                <summary className="font-semibold text-gray-900">
                  {t('pension_faq_withdraw')}
                </summary>
                <p className="text-gray-700 mt-3 text-sm">
                  {t('pension_faq_withdraw_answer')} {t('pension_inherits_info')}
                </p>
              </details>

              <details className="border border-gray-200 rounded-lg p-5 cursor-pointer hover:bg-gray-50">
                <summary className="font-semibold text-gray-900">
                  {t('pension_faq_unofficial')}
                </summary>
                <p className="text-gray-700 mt-3 text-sm">
                  {t('pension_faq_unofficial_answer')}
                </p>
              </details>

              <details className="border border-gray-200 rounded-lg p-5 cursor-pointer hover:bg-gray-50">
                <summary className="font-semibold text-gray-900">
                  {t('pension_faq_voluntary')}
                </summary>
                <p className="text-gray-700 mt-3 text-sm">
                  {t('pension_faq_voluntary_answer')}
                </p>
              </details>

              <details className="border border-gray-200 rounded-lg p-5 cursor-pointer hover:bg-gray-50">
                <summary className="font-semibold text-gray-900">
                  {t('pension_faq_entrepreneur')}
                </summary>
                <p className="text-gray-700 mt-3 text-sm">
                  {t('pension_faq_entrepreneur_answer')}
                </p>
              </details>

              <details className="border border-gray-200 rounded-lg p-5 cursor-pointer hover:bg-gray-50">
                <summary className="font-semibold text-gray-900">
                  {t('pension_faq_solidarity')}
                </summary>
                <p className="text-gray-700 mt-3 text-sm">
                  {t('pension_faq_solidarity_answer')} {t('pension_faq_solidarity_answer_2')}
                </p>
              </details>

              <details className="border border-gray-200 rounded-lg p-5 cursor-pointer hover:bg-gray-50">
                <summary className="font-semibold text-gray-900">
                  {t('pension_faq_apply')}
                </summary>
                <div className="text-gray-700 mt-3 text-sm space-y-2">
                  <p><strong>{t('pension_faq_apply_timeline')}</strong></p>
                  <ol className="list-decimal list-inside ml-4 space-y-1">
                    <li>{t('pension_faq_apply_step1')}</li>
                    <li>{t('pension_faq_apply_step2')}</li>
                    <li>{t('pension_faq_apply_step3')}</li>
                    <li>{t('pension_faq_apply_step4')}</li>
                    <li>{t('pension_faq_apply_step5')}</li>
                  </ol>
                  <p className="mt-2"><strong>{t('pension_faq_apply_phone')}</strong> {t('pension_faq_apply_phone_number')}</p>
                </div>
              </details>
            </div>
          </div>

          {/* Section 7: Tips */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('pension_increase_tips')}</h3>

            <div className="space-y-3">
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <h4 className="font-semibold text-gray-900 mb-1">{t('pension_increase_tip1')}</h4>
                <p className="text-gray-700 text-sm">
                  {t('pension_increase_tip1_desc')}
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4 py-2">
                <h4 className="font-semibold text-gray-900 mb-1">{t('pension_increase_tip2')}</h4>
                <p className="text-gray-700 text-sm">
                  {t('pension_increase_tip2_desc')}
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4 py-2">
                <h4 className="font-semibold text-gray-900 mb-1">{t('pension_increase_tip3')}</h4>
                <p className="text-gray-700 text-sm">
                  {t('pension_increase_tip3_desc')}
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4 py-2">
                <h4 className="font-semibold text-gray-900 mb-1">{t('pension_increase_tip4')}</h4>
                <p className="text-gray-700 text-sm">
                  {t('pension_increase_tip4_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Other Calculators */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-8 print:hidden">
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
                  <div className="font-medium text-gray-900 group-hover:text-red-600">{t('pension_related_calc_salary')}</div>
                  <div className="text-sm text-gray-500">{t('pension_related_calc_salary_desc')}</div>
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
                  <div className="font-medium text-gray-900 group-hover:text-red-600">{t('pension_related_calc_social')}</div>
                  <div className="text-sm text-gray-500">{t('pension_related_calc_social_desc')}</div>
                </div>
              </div>
            </Link>
            <Link
              to={getLocalizedPath("/calculator/deposit")}
              className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-red-600">{t('pension_related_calc_deposit')}</div>
                  <div className="text-sm text-gray-500">{t('pension_related_calc_deposit_desc')}</div>
                </div>
              </div>
            </Link>
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
        }
      `}</style>
    </div>
  );
};

export default PensionCalculatorPage;