import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, User, Activity, Target, Info, Printer } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ContentBlock from '../components/ContentBlock';
import HreflangTags from '../components/HreflangTags';

type Gender = 'male' | 'female';
type ActivityLevel = 'minimal' | 'low' | 'medium' | 'high' | 'extreme';
type Goal = 'lose' | 'maintain' | 'gain';

interface CalorieResults {
  bmr: number;
  dailyCalories: number;
  proteins: number;
  fats: number;
  carbs: number;
  hasData: boolean;
}

const ACTIVITY_MULTIPLIERS = {
  minimal: 1.2,
  low: 1.375,
  medium: 1.55,
  high: 1.725,
  extreme: 1.9
};

const GOAL_MULTIPLIERS = {
  lose: 0.8,
  maintain: 1.0,
  gain: 1.2
};

export default function CalorieCalculatorPage() {
  const { t, language } = useLanguage();
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState<string>('30');
  const [height, setHeight] = useState<string>('170');
  const [weight, setWeight] = useState<string>('70');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('medium');
  const [goal, setGoal] = useState<Goal>('maintain');
  const [results, setResults] = useState<CalorieResults>({
    bmr: 0,
    dailyCalories: 0,
    proteins: 0,
    fats: 0,
    carbs: 0,
    hasData: false
  });

  const calculateCalories = () => {
    const ageNum = parseFloat(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (!ageNum || !heightNum || !weightNum || ageNum <= 0 || heightNum <= 0 || weightNum <= 0) {
      return;
    }

    let bmr: number;

    if (gender === 'male') {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }

    const activityMultiplier = ACTIVITY_MULTIPLIERS[activityLevel];
    const goalMultiplier = GOAL_MULTIPLIERS[goal];
    const dailyCalories = bmr * activityMultiplier * goalMultiplier;

    const proteins = (dailyCalories * 0.3) / 4;
    const fats = (dailyCalories * 0.3) / 9;
    const carbs = (dailyCalories * 0.4) / 4;

    setResults({
      bmr: Math.round(bmr),
      dailyCalories: Math.round(dailyCalories),
      proteins: Math.round(proteins),
      fats: Math.round(fats),
      carbs: Math.round(carbs),
      hasData: true
    });
  };

  useEffect(() => {
    if (age && height && weight) {
      calculateCalories();
    }
  }, [gender, age, height, weight, activityLevel, goal]);

  const handlePrint = () => {
    window.print();
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('ru-RU');
  };

  return (
    <>
      <Helmet>
        <title>{t('calorie_calc_title')} - Calk.KG</title>
        <meta name="description" content={t('calorie_calc_description')} />
        <meta name="keywords" content={t('calorie_keywords')} />
        <meta property="og:title" content={`${t('calorie_calc_title')} - Calk.KG`} />
        <meta property="og:description" content={t('calorie_calc_description')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/calorie" : "https://calk.kg/calculator/calorie"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/calorie.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('calorie_calc_title')} - Calk.KG`} />
        <meta name="twitter:description" content={t('calorie_calc_description')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/calorie.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/calorie" : "https://calk.kg/calculator/calorie"} />
      </Helmet>
      <HreflangTags path="/calculator/calorie" />

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4 print:bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 print:mb-4">
            <div className="flex items-center justify-center mb-4 print:mb-2">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-2xl shadow-lg print:shadow-none">
                <Calculator className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('calorie_calc_title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('calorie_calc_subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 print:shadow-none print:border">
              <div className="flex items-center mb-6">
                <User className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">{t('calorie_personal_data')}</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t('calorie_gender')}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setGender('male')}
                      className={`py-3 px-4 rounded-lg font-medium transition-all ${
                        gender === 'male'
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {t('calorie_male')}
                    </button>
                    <button
                      onClick={() => setGender('female')}
                      className={`py-3 px-4 rounded-lg font-medium transition-all ${
                        gender === 'female'
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {t('calorie_female')}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('calorie_age')}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                      min="10"
                      max="100"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                      {t('calorie_age_years')}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('calorie_height')}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                      min="100"
                      max="250"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                      {t('calorie_height_cm')}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('calorie_weight')}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                      min="30"
                      max="300"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                      {t('calorie_weight_kg')}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Activity className="inline h-5 w-5 mr-1" />
                    {t('calorie_activity_level')}
                  </label>
                  <select
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                  >
                    <option value="minimal">{t('calorie_activity_minimal')}</option>
                    <option value="low">{t('calorie_activity_low')}</option>
                    <option value="medium">{t('calorie_activity_medium')}</option>
                    <option value="high">{t('calorie_activity_high')}</option>
                    <option value="extreme">{t('calorie_activity_extreme')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Target className="inline h-5 w-5 mr-1" />
                    {t('calorie_goal')}
                  </label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value as Goal)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                  >
                    <option value="lose">{t('calorie_goal_lose')}</option>
                    <option value="maintain">{t('calorie_goal_maintain')}</option>
                    <option value="gain">{t('calorie_goal_gain')}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {results.hasData && (
                <>
                  <div className="bg-white rounded-2xl shadow-xl p-8 print:shadow-none print:border">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">{t('calorie_results')}</h2>
                      <button
                        onClick={handlePrint}
                        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors print:hidden"
                      >
                        <Printer className="h-4 w-4" />
                        <span>{t('print')}</span>
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700 font-medium">{t('calorie_bmr')}</span>
                          <span className="text-2xl font-bold text-green-700">
                            {formatNumber(results.bmr)} {t('calorie_kcal')}
                          </span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700 font-medium">{t('calorie_daily_calories')}</span>
                          <span className="text-3xl font-bold text-blue-700">
                            {formatNumber(results.dailyCalories)} {t('calorie_kcal')}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mt-2">
                          {t('calorie_kcal_per_day')}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 text-lg">{t('calorie_distribution')}</h3>

                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">{t('calorie_proteins')}</span>
                            <span className="text-xl font-bold text-purple-700">
                              {formatNumber(results.proteins)} {t('calorie_grams')}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">30% • 4 {t('calorie_kcal')}/{t('calorie_grams')}</div>
                        </div>

                        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">{t('calorie_fats')}</span>
                            <span className="text-xl font-bold text-orange-700">
                              {formatNumber(results.fats)} {t('calorie_grams')}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">30% • 9 {t('calorie_kcal')}/{t('calorie_grams')}</div>
                        </div>

                        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">{t('calorie_carbs')}</span>
                            <span className="text-xl font-bold text-yellow-700">
                              {formatNumber(results.carbs)} {t('calorie_grams')}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">40% • 4 {t('calorie_kcal')}/{t('calorie_grams')}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 print:break-inside-avoid">
                    <div className="flex items-start space-x-3">
                      <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-3">{t('calorie_recommendations')}</h3>
                        <ul className="space-y-2 text-sm text-blue-800">
                          <li>• {t('calorie_rec_proteins')}</li>
                          <li>• {t('calorie_rec_fats')}</li>
                          <li>• {t('calorie_rec_carbs')}</li>
                          <li>• {t('calorie_rec_water')}</li>
                          <li>• {t('calorie_rec_meals')}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-12 bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
            <div className="flex items-start space-x-3 mb-6">
              <Info className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('calorie_info_title')}</h3>
                <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                  <div className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>{t('calorie_info_1')}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>{t('calorie_info_2')}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>{t('calorie_info_3')}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>{t('calorie_info_4')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Educational Guide Section */}
          <div className="mt-12 bg-gradient-to-br from-white to-green-50 rounded-xl shadow-lg p-8 border border-green-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('calorie_guide_title')}</h2>
            
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {t('calorie_guide_intro')}
              </p>

              <div className="space-y-8">
                {/* How it works */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-green-700 mb-4 flex items-center">
                    <Calculator className="h-6 w-6 mr-2" />
                    {t('calorie_guide_how_title')}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {t('calorie_guide_how_text')}
                  </p>
                </div>

                {/* BMR Formula */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-green-700 mb-4">{t('calorie_guide_bmr_title')}</h3>
                  <p className="text-gray-700 mb-4">{t('calorie_guide_bmr_text')}</p>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 space-y-2">
                    <p className="font-mono text-sm text-blue-900">👨 {t('calorie_guide_bmr_male')}</p>
                    <p className="font-mono text-sm text-pink-900">👩 {t('calorie_guide_bmr_female')}</p>
                  </div>
                </div>

                {/* Activity Levels */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-green-700 mb-4 flex items-center">
                    <Activity className="h-6 w-6 mr-2" />
                    {t('calorie_guide_activity_title')}
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-600 font-bold mr-2">→</span>
                      <span>{t('calorie_guide_activity_minimal')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 font-bold mr-2">→</span>
                      <span>{t('calorie_guide_activity_low')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 font-bold mr-2">→</span>
                      <span>{t('calorie_guide_activity_medium')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 font-bold mr-2">→</span>
                      <span>{t('calorie_guide_activity_high')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 font-bold mr-2">→</span>
                      <span>{t('calorie_guide_activity_extreme')}</span>
                    </li>
                  </ul>
                </div>

                {/* Goals */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-green-700 mb-4 flex items-center">
                    <Target className="h-6 w-6 mr-2" />
                    {t('calorie_guide_goals_title')}
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-red-50 border-l-4 border-red-500 p-4">
                      <p className="text-gray-800">🔻 {t('calorie_guide_goal_lose')}</p>
                    </div>
                    <div className="bg-gray-50 border-l-4 border-gray-500 p-4">
                      <p className="text-gray-800">➖ {t('calorie_guide_goal_maintain')}</p>
                    </div>
                    <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4">
                      <p className="text-gray-800">📈 {t('calorie_guide_goal_gain')}</p>
                    </div>
                  </div>
                </div>

                {/* Macros Distribution */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-2xl font-bold text-green-700 mb-4">{t('calorie_guide_macros_title')}</h3>
                  <div className="space-y-3">
                    <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                      <p className="text-gray-800">🥩 {t('calorie_guide_macros_proteins')}</p>
                    </div>
                    <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
                      <p className="text-gray-800">🥑 {t('calorie_guide_macros_fats')}</p>
                    </div>
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                      <p className="text-gray-800">🍞 {t('calorie_guide_macros_carbs')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">❓ {t('calorie_faq_title')}</h2>
            <div className="space-y-6">
              <details className="group bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  <span>{t('calorie_faq_q1')}</span>
                  <span className="text-green-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">{t('calorie_faq_a1')}</p>
              </details>

              <details className="group bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  <span>{t('calorie_faq_q2')}</span>
                  <span className="text-green-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">{t('calorie_faq_a2')}</p>
              </details>

              <details className="group bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  <span>{t('calorie_faq_q3')}</span>
                  <span className="text-green-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">{t('calorie_faq_a3')}</p>
              </details>

              <details className="group bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  <span>{t('calorie_faq_q4')}</span>
                  <span className="text-green-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">{t('calorie_faq_a4')}</p>
              </details>

              <details className="group bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  <span>{t('calorie_faq_q5')}</span>
                  <span className="text-green-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">{t('calorie_faq_a5')}</p>
              </details>

              <details className="group bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <summary className="font-semibold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                  <span>{t('calorie_faq_q6')}</span>
                  <span className="text-green-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">{t('calorie_faq_a6')}</p>
              </details>
            </div>
          </div>

          {/* Practical Tips */}
          <div className="mt-12 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-8 border border-green-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">💡 {t('calorie_tips_title')}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 bg-white p-4 rounded-lg">
                <span className="text-2xl">⚖️</span>
                <p className="text-gray-700">{t('calorie_tips_1')}</p>
              </div>
              <div className="flex items-start space-x-3 bg-white p-4 rounded-lg">
                <span className="text-2xl">🍽️</span>
                <p className="text-gray-700">{t('calorie_tips_2')}</p>
              </div>
              <div className="flex items-start space-x-3 bg-white p-4 rounded-lg">
                <span className="text-2xl">💧</span>
                <p className="text-gray-700">{t('calorie_tips_3')}</p>
              </div>
              <div className="flex items-start space-x-3 bg-white p-4 rounded-lg">
                <span className="text-2xl">🥗</span>
                <p className="text-gray-700">{t('calorie_tips_4')}</p>
              </div>
              <div className="flex items-start space-x-3 bg-white p-4 rounded-lg">
                <span className="text-2xl">🥦</span>
                <p className="text-gray-700">{t('calorie_tips_5')}</p>
              </div>
              <div className="flex items-start space-x-3 bg-white p-4 rounded-lg">
                <span className="text-2xl">🌅</span>
                <p className="text-gray-700">{t('calorie_tips_6')}</p>
              </div>
              <div className="flex items-start space-x-3 bg-white p-4 rounded-lg">
                <span className="text-2xl">📱</span>
                <p className="text-gray-700">{t('calorie_tips_7')}</p>
              </div>
              <div className="flex items-start space-x-3 bg-white p-4 rounded-lg">
                <span className="text-2xl">🍕</span>
                <p className="text-gray-700">{t('calorie_tips_8')}</p>
              </div>
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="mt-12 bg-red-50 rounded-xl shadow-lg p-8 border-2 border-red-200">
            <h2 className="text-3xl font-bold text-red-900 mb-6">⚠️ {t('calorie_mistakes_title')}</h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 bg-white p-4 rounded-lg border-l-4 border-red-500">
                <span className="text-red-600 font-bold text-xl">✗</span>
                <p className="text-gray-800">{t('calorie_mistake_1')}</p>
              </div>
              <div className="flex items-start space-x-3 bg-white p-4 rounded-lg border-l-4 border-red-500">
                <span className="text-red-600 font-bold text-xl">✗</span>
                <p className="text-gray-800">{t('calorie_mistake_2')}</p>
              </div>
              <div className="flex items-start space-x-3 bg-white p-4 rounded-lg border-l-4 border-red-500">
                <span className="text-red-600 font-bold text-xl">✗</span>
                <p className="text-gray-800">{t('calorie_mistake_3')}</p>
              </div>
              <div className="flex items-start space-x-3 bg-white p-4 rounded-lg border-l-4 border-red-500">
                <span className="text-red-600 font-bold text-xl">✗</span>
                <p className="text-gray-800">{t('calorie_mistake_4')}</p>
              </div>
              <div className="flex items-start space-x-3 bg-white p-4 rounded-lg border-l-4 border-red-500">
                <span className="text-red-600 font-bold text-xl">✗</span>
                <p className="text-gray-800">{t('calorie_mistake_5')}</p>
              </div>
            </div>
          </div>

          <ContentBlock />
        </div>
      </div>
    </>
  );
}
