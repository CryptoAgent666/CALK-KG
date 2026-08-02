import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Home as HomeIcon, Heart, Info, TrendingDown, DollarSign } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import HreflangTags from '../components/HreflangTags';
import FAQSchema from '../components/FAQSchema';
import { SickLeaveCalculatorArticle } from '../components/SickLeaveCalculatorArticle';
import {
  SICK_LEAVE_TYPES,
  EXPERIENCE_RATES,
  getPaymentPercentByExperience,
  calculateAverageDailyWage,
  calculateSickLeaveBreakdown,
  MIN_MONTHLY_WAGE,
  RATE_FROM_DAY11_MONTHLY,
  MATERNITY_RATE_FROM_DAY11_MONTHLY,
  SICK_LEAVE_EXAMPLES
} from '../data/sickLeaveData';

interface SickLeaveResults {
  averageDailyWage: number;
  paymentPercent: number;
  totalPayment: number;
  afterTax: number;
  first10Pay: number;
  fromDay11Pay: number;
}

const SickLeaveCalculatorPage = () => {
  const { language, t, getLocalizedPath } = useLanguage();
  
  const [sickLeaveType, setSickLeaveType] = useState<string>('illness');
  const [experienceYears, setExperienceYears] = useState<string>('5');
  const [totalEarnings, setTotalEarnings] = useState<string>('60000');
  const [daysOnLeave, setDaysOnLeave] = useState<string>('10');
  
  const [results, setResults] = useState<SickLeaveResults | null>(null);
  
  const selectedType = SICK_LEAVE_TYPES.find(type => type.id === sickLeaveType);
  
  useEffect(() => {
    const earnings = parseFloat(totalEarnings);
    const days = parseInt(daysOnLeave);
    const experience = parseFloat(experienceYears);
    
    if (isNaN(earnings) || isNaN(days) || earnings <= 0 || days <= 0) {
      setResults(null);
      return;
    }
    
    // Среднедневной заработок: заработок за 3 месяца ÷ рабочие дни (≈66)
    const avgDailyWage = calculateAverageDailyWage(earnings);

    // Определяем процент оплаты
    let paymentPercent = 100;
    if (selectedType?.dependsOnExperience) {
      paymentPercent = getPaymentPercentByExperience(experience);
    } else {
      paymentPercent = selectedType?.paymentPercent || 100;
    }

    // Плательщик один — работодатель (п.45 Положения). Разбивка по ПЕРИОДАМ:
    //  • обычный больничный: 10 раб. дней по стажу, далее 100 РП/мес (п.37 подп.2);
    //  • беременность и роды: 10 раб. дней полностью, далее 20 РП/мес из
    //    республиканского бюджета (п.63 подп.1).
    const isMaternity = !selectedType?.dependsOnExperience;
    const { first10Pay, fromDay11Pay, total: totalPayment } = calculateSickLeaveBreakdown(
      avgDailyWage,
      days,
      paymentPercent,
      isMaternity ? MATERNITY_RATE_FROM_DAY11_MONTHLY : RATE_FROM_DAY11_MONTHLY
    );

    // Пособие НЕ облагается подоходным налогом (НК ст.191 ч.3 п.1 и ч.4 п.1),
    // поэтому «на руки» равно начисленной сумме.
    const afterTax = totalPayment;

    setResults({
      averageDailyWage: avgDailyWage,
      paymentPercent,
      totalPayment,
      afterTax,
      first10Pay,
      fromDay11Pay
    });
  }, [sickLeaveType, experienceYears, totalEarnings, daysOnLeave, selectedType]);
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const loadExample = (exampleId: string) => {
    const example = SICK_LEAVE_EXAMPLES.find(ex => ex.id === exampleId);
    if (example) {
      setSickLeaveType(example.sickLeaveType);
      setExperienceYears(example.experienceYears.toString());
      setTotalEarnings(example.totalEarnings.toString());
      setDaysOnLeave(example.daysOnSickLeave.toString());
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{t('sick_calc_title')} | Calk.KG</title>
        <meta name="description" content={t('sick_calc_description')} />
        <meta property="og:title" content={`${t('sick_calc_title')} | Calk.KG`} />
        <meta property="og:description" content={t('sick_calc_description')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/sick-leave/" : "https://calk.kg/calculator/sick-leave/"} />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/sick-leave/" : "https://calk.kg/calculator/sick-leave/"} />
      </Helmet>
      <HreflangTags path="/calculator/sick-leave" />
      <FAQSchema translationPrefix="sick_calc" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to={getLocalizedPath("/")} className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>{t('back')}</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <Link to={getLocalizedPath("/")} className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-pink-600 to-pink-700 p-2 rounded-lg">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">Calk.KG</span>
              </Link>
            </div>
            <Link to={getLocalizedPath("/")} className="flex items-center space-x-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors">
              <HomeIcon className="h-4 w-4" />
              <span>{t('home')}</span>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-pink-600 to-pink-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Heart className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{t('sick_calc_title')}</h1>
              <p className="text-pink-100 text-lg">{t('sick_calc_subtitle')}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('sick_select_type')}</h2>
              
              {/* Sick Leave Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('sick_select_type')}
                </label>
                <select
                  value={sickLeaveType}
                  onChange={(e) => setSickLeaveType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  {SICK_LEAVE_TYPES.map(type => (
                    <option key={type.id} value={type.id}>{t(type.nameKey)}</option>
                  ))}
                </select>
              </div>
              
              {/* Experience Years */}
              {selectedType?.dependsOnExperience && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('sick_experience_years')}
                  </label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    placeholder="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    min="0"
                    step="0.5"
                  />
                  <div className="mt-2 text-xs text-gray-500 space-y-1">
                    <p>• {t('sick_experience_0_3')}</p>
                    <p>• {t('sick_experience_3_5')}</p>
                    <p>• {t('sick_experience_5_8')}</p>
                  </div>
                </div>
              )}
              
              {/* Total Earnings */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('sick_total_earnings')}
                </label>
                <input
                  type="number"
                  value={totalEarnings}
                  onChange={(e) => setTotalEarnings(e.target.value)}
                  placeholder="60000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  min="0"
                />
                <p className="mt-2 text-xs text-gray-500">
                  {t('sick_total_earnings_example')}
                </p>
              </div>
              
              {/* Days on Leave */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('sick_days_on_leave')}
                </label>
                <input
                  type="number"
                  value={daysOnLeave}
                  onChange={(e) => setDaysOnLeave(e.target.value)}
                  placeholder="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  min="1"
                  max={selectedType?.maxDays || 30}
                />
                {selectedType && (
                  <p className="mt-2 text-xs text-gray-500">
                    {t('sick_max_days').replace('{days}', selectedType.maxDays.toString())}
                  </p>
                )}
              </div>
            </div>
            
            {/* Examples */}
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">{t('sick_examples_title')}</h3>
              <div className="space-y-2">
                {SICK_LEAVE_EXAMPLES.map(example => (
                  <button
                    key={example.id}
                    onClick={() => loadExample(example.id)}
                    className="w-full text-left px-4 py-2 bg-white rounded-lg hover:bg-pink-100 transition-colors text-sm"
                  >
                    {t(example.titleKey)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Results Section */}
          <div className="space-y-6">
            {results ? (
              <>
                {/* Main Result */}
                <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl p-8 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-pink-100 mb-1">{t('sick_total_payment')}</p>
                      <p className="text-4xl font-bold">{formatCurrency(results.totalPayment)} {t('som')}</p>
                    </div>
                    <DollarSign className="h-12 w-12 opacity-50" />
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <p className="text-pink-100 text-sm mb-1">{t('sick_after_tax')}</p>
                    <p className="text-2xl font-bold">{formatCurrency(results.afterTax)} {t('som')}</p>
                  </div>
                </div>
                
                {/* Breakdown */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('sick_results')}</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-gray-600">{t('sick_average_daily_wage')}</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(results.averageDailyWage)} {t('som')}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-gray-600">{t('sick_payment_percent')}</span>
                      <span className="font-semibold text-pink-600">
                        {results.paymentPercent}%
                      </span>
                    </div>
                    
                    {selectedType?.dependsOnExperience && (
                      <>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-700">{t('sick_first_10_days')}</span>
                            <span className="font-medium text-blue-600">
                              {formatCurrency(results.first10Pay)} {t('som')}
                            </span>
                          </div>
                        </div>

                        {results.fromDay11Pay > 0 && (
                          <div className="bg-green-50 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-700">{t('sick_after_10_days')}</span>
                              <span className="font-medium text-green-600">
                                {formatCurrency(results.fromDay11Pay)} {t('som')}
                              </span>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                {/* Important Info */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Info className="h-5 w-5 mr-2 text-yellow-600" />
                    {t('sick_important_info')}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>• {t('sick_info_1')}</p>
                    <p>• {t('sick_info_2')}</p>
                    <p>• {t('sick_info_3')}</p>
                    <p>• {t('sick_info_4')}</p>
                    {!selectedType?.dependsOnExperience && <p>• {t('sick_info_5')}</p>}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Heart className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">{t('sick_fill_data')}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* How to Calculate & FAQ */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* How to Calculate */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('sick_how_to_calculate')}</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-pink-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-pink-600">1</span>
                </div>
                <p className="text-gray-700">{t('sick_step_1')}</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-pink-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-pink-600">2</span>
                </div>
                <p className="text-gray-700">{t('sick_step_2')}</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-pink-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-pink-600">3</span>
                </div>
                <p className="text-gray-700">{t('sick_step_3')}</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-pink-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-pink-600">4</span>
                </div>
                <p className="text-gray-700">{t('sick_step_4')}</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-pink-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-pink-600">5</span>
                </div>
                <p className="text-gray-700">{t('sick_step_5')}</p>
              </div>
            </div>
          </div>
          
          {/* FAQ */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('faq_title')}</h2>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i}>
                  <h3 className="font-medium text-gray-900 mb-2">{t(`sick_faq_q${i}`)}</h3>
                  <p className="text-sm text-gray-600">{t(`sick_faq_a${i}`)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Информационная статья под калькулятором */}
      <SickLeaveCalculatorArticle />
    </div>
  );
};

export default SickLeaveCalculatorPage;
