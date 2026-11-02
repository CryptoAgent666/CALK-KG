import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Home as HomeIcon, GraduationCap, DollarSign, Award } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import HreflangTags from '../components/HreflangTags';
import FAQSchema from '../components/FAQSchema';
import { formatVerifiedMonth } from '../utils/dateFormatter';
import {
  SCHOLARSHIP_RATES as RATES,
  SCHOLARSHIP_EXAMPLES,
  MONTHS_IN_SEMESTER,
  MONTHS_IN_ACADEMIC_YEAR,
  aspirantRate,
  calculateScholarship,
  usesGrades,
  type EducationLevel,
  type Grades,
  type PrimaryTerm,
  type ScholarshipInput
} from '../data/scholarshipData';

const LEVELS: EducationLevel[] = ['higher', 'secondary', 'primary', 'aspirant', 'ordinator'];
const SOURCE_URL = 'https://cbd.minjust.gov.kg/7-10776/edition/18725/ru';

const StudentScholarshipPage = () => {
  const { language, t, getLocalizedPath } = useLanguage();

  const [input, setInput] = useState<ScholarshipInput>({
    level: 'higher',
    pedagogical: false,
    course: 1,
    grades: 'excellent',
    primaryTerm: 'one_year',
    social: false,
    disability: false,
    ordinatorRural: false
  });

  const update = (patch: Partial<ScholarshipInput>) => setInput(prev => {
    const next = { ...prev, ...patch };
    // Оценки «хорошие и отличные» и «только хорошие» есть только в начальном профессиональном.
    if (next.level !== 'primary' && (next.grades === 'mixed' || next.grades === 'good')) next.grades = 'other';
    const maxCourse = next.level === 'aspirant' ? 3 : 4;
    if (next.course > maxCourse) next.course = maxCourse;
    return next;
  });

  const { level, pedagogical, course, grades, primaryTerm, social, disability, ordinatorRural } = input;
  const results = calculateScholarship(input);
  const graded = usesGrades(level);
  const showCourse = level === 'aspirant' || (level === 'higher' && pedagogical && !social);
  const gradeOptions: Grades[] = level === 'primary' ? ['excellent', 'mixed', 'good', 'other'] : ['excellent', 'other'];
  const firstCourseNote = (level === 'higher' || level === 'secondary') && !social;

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  };
  const som = (value: number): string => `${formatCurrency(value)} ${t('som')}`;

  const ratesTable: Array<{ key: string; amount: string }> = [
    { key: 'scholarship_rate_higher', amount: som(RATES.higher) },
    { key: 'scholarship_rate_higher_ped', amount: `${formatCurrency(RATES.higherPedagogical[0])}–${som(RATES.higherPedagogical[3])}` },
    { key: 'scholarship_rate_secondary', amount: som(RATES.secondary) },
    { key: 'scholarship_rate_secondary_ped', amount: som(RATES.secondaryPedagogical) },
    { key: 'scholarship_rate_primary_1', amount: `${RATES.primary.one_year.excellent} / ${RATES.primary.one_year.mixed} / ${som(RATES.primary.one_year.good)}` },
    { key: 'scholarship_rate_primary_2', amount: `${RATES.primary.two_three_years.excellent} / ${RATES.primary.two_three_years.mixed} / ${som(RATES.primary.two_three_years.good)}` },
    { key: 'scholarship_rate_social', amount: som(RATES.social) },
    { key: 'scholarship_rate_aspirant', amount: `${formatCurrency(aspirantRate(1))}–${som(aspirantRate(3))}` },
    { key: 'scholarship_rate_ordinator', amount: som(RATES.ordinator) }
  ];

  const selectClass = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
  const checkRow = 'flex items-start space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors';
  const checkClass = 'w-5 h-5 mt-0.5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500';

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{t('scholarship_calc_title')} | Calk.KG</title>
        <meta name="description" content={t('scholarship_calc_description')} />
        <meta property="og:title" content={`${t('scholarship_calc_title')} | Calk.KG`} />
        <meta property="og:description" content={t('scholarship_calc_description')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/scholarship/" : "https://calk.kg/calculator/scholarship/"} />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/scholarship/" : "https://calk.kg/calculator/scholarship/"} />
      </Helmet>
      <HreflangTags path="/calculator/scholarship" />
      <FAQSchema translationPrefix="scholarship" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to={getLocalizedPath("/")} className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>{t('back')}</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <Link to={getLocalizedPath("/")} className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">Calk.KG</span>
              </Link>
            </div>
            <Link to={getLocalizedPath("/")} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <HomeIcon className="h-4 w-4" />
              <span>{t('home')}</span>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <GraduationCap className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{t('scholarship_calc_title')}</h1>
              <p className="text-blue-100 text-lg">{t('scholarship_calc_subtitle')}</p>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('scholarship_params_title')}</h2>

              <div className="mb-6">
                <label htmlFor="scholarship-level" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('scholarship_level')}
                </label>
                <select
                  id="scholarship-level"
                  value={level}
                  onChange={(e) => update({ level: e.target.value as EducationLevel })}
                  className={selectClass}
                >
                  {LEVELS.map(item => (
                    <option key={item} value={item}>{t(`scholarship_level_${item}` as any)}</option>
                  ))}
                </select>
              </div>

              {graded && (
                <label className={`${checkRow} mb-4`}>
                  <input type="checkbox" checked={social} onChange={(e) => update({ social: e.target.checked })} className={checkClass} />
                  <span className="text-sm text-gray-700">{t('scholarship_social_check')}</span>
                </label>
              )}

              {graded && !social && level !== 'primary' && (
                <label className={`${checkRow} mb-4`}>
                  <input type="checkbox" checked={pedagogical} onChange={(e) => update({ pedagogical: e.target.checked })} className={checkClass} />
                  <span className="text-sm text-gray-700">{t('scholarship_pedagogical')}</span>
                </label>
              )}

              {showCourse && (
                <div className="mb-6">
                  <label htmlFor="scholarship-course" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('scholarship_course')}
                  </label>
                  <select
                    id="scholarship-course"
                    value={course}
                    onChange={(e) => update({ course: Number(e.target.value) })}
                    className={selectClass}
                  >
                    {(level === 'aspirant' ? [1, 2, 3] : [1, 2, 3, 4]).map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              )}

              {level === 'primary' && !social && (
                <div className="mb-6">
                  <label htmlFor="scholarship-term" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('scholarship_primary_term')}
                  </label>
                  <select
                    id="scholarship-term"
                    value={primaryTerm}
                    onChange={(e) => update({ primaryTerm: e.target.value as PrimaryTerm })}
                    className={selectClass}
                  >
                    <option value="one_year">{t('scholarship_term_one_year')}</option>
                    <option value="two_three_years">{t('scholarship_term_two_three_years')}</option>
                  </select>
                </div>
              )}

              {graded && !social && (
                <div className="mb-6">
                  <label htmlFor="scholarship-grades" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('scholarship_grades')}
                  </label>
                  <select
                    id="scholarship-grades"
                    value={grades}
                    onChange={(e) => update({ grades: e.target.value as Grades })}
                    className={selectClass}
                  >
                    {gradeOptions.map(item => (
                      <option key={item} value={item}>{t(`scholarship_grades_${item}` as any)}</option>
                    ))}
                  </select>
                </div>
              )}

              {graded && !social && (
                <label className={checkRow}>
                  <input type="checkbox" checked={disability} onChange={(e) => update({ disability: e.target.checked })} className={checkClass} />
                  <span className="text-sm text-gray-700">{t('scholarship_disability_check')}</span>
                </label>
              )}

              {level === 'ordinator' && (
                <label className={checkRow}>
                  <input type="checkbox" checked={ordinatorRural} onChange={(e) => update({ ordinatorRural: e.target.checked })} className={checkClass} />
                  <span className="text-sm text-gray-700">{t('scholarship_ordinator_rural')}</span>
                </label>
              )}
            </div>

            {/* Examples */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">{t('scholarship_examples_title')}</h3>
              <div className="space-y-2">
                {SCHOLARSHIP_EXAMPLES.map(example => (
                  <button
                    key={example.id}
                    onClick={() => update(example.input)}
                    className="w-full text-left px-4 py-2 bg-white rounded-lg hover:bg-blue-100 transition-colors text-sm"
                  >
                    {t(example.titleKey as any)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {results.eligible ? (
              <>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-blue-100 mb-1">{t('scholarship_total')}</p>
                      <p className="text-4xl font-bold">{som(results.totalAmount)}</p>
                    </div>
                    <DollarSign className="h-12 w-12 opacity-50" />
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t('scholarship_per_semester')}</span>
                      <span className="font-medium">{som(results.totalAmount * MONTHS_IN_SEMESTER)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{t('scholarship_per_year')}</span>
                      <span className="font-medium">{som(results.totalAmount * MONTHS_IN_ACADEMIC_YEAR)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('scholarship_detailed_calculation')}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b">
                      <p className="font-medium text-gray-900">{t(social && graded ? 'scholarship_social' : 'scholarship_base_amount')}</p>
                      <p className="font-semibold text-gray-900">{som(results.baseAmount)}</p>
                    </div>
                    {results.disabilityBonus > 0 && (
                      <div className="flex justify-between items-center pb-3 border-b">
                        <p className="font-medium text-gray-900">{t('scholarship_disability_bonus')}</p>
                        <p className="font-semibold text-green-600">+{som(results.disabilityBonus)}</p>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-3 bg-blue-50 rounded-lg p-3">
                      <p className="font-bold text-gray-900">{t('scholarship_total')}</p>
                      <p className="font-bold text-blue-600 text-xl">{som(results.totalAmount)}</p>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-gray-600 list-disc list-inside">
                    {firstCourseNote && <li>{t('scholarship_note_first_course')}</li>}
                    {social && graded && <li>{t('scholarship_note_social')}</li>}
                    {level === 'ordinator' && ordinatorRural && <li>{t('scholarship_note_contract')}</li>}
                    <li>{t('scholarship_note_highland')}</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Award className="h-20 w-20 text-red-300 mx-auto mb-4" />
                <p className="text-red-600 text-lg font-semibold mb-2">{t('scholarship_no_scholarship')}</p>
                <p className="text-gray-500">{t(level === 'primary' ? 'scholarship_reason_primary' : 'scholarship_reason_excellent')}</p>
              </div>
            )}

            {/* President */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-2">{t('scholarship_president')}</h3>
              <p className="text-sm text-gray-700">{t('scholarship_president_text')}</p>
            </div>
          </div>
        </div>

        {/* Current Scholarship Amounts */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('scholarship_base_amounts_title')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                {ratesTable.map(row => (
                  <tr key={row.key}>
                    <td className="py-2 pr-4 text-gray-700">{t(row.key as any)}</td>
                    <td className="py-2 text-right font-semibold text-blue-600 whitespace-nowrap">{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            {t('scholarship_source_prefix')}{' '}
            <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              {t('scholarship_source_law')}
            </a>
            . {t('scholarship_verified')} {formatVerifiedMonth(language, 'scholarship')}.
          </p>
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
            {t('scholarship_raise_2027')}
          </p>
        </div>

        {/* Educational Content */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Conditions */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('scholarship_conditions_title')}</h2>
            <div className="space-y-4">
              {['academic', 'social', 'first_year', 'named'].map(type => (
                <div key={type} className="flex items-start space-x-3">
                  <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                    <Award className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-gray-700 text-sm">{t(`scholarship_condition_${type}` as any)}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Tips */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('scholarship_tips_title')}</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                    <GraduationCap className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-gray-700 text-sm">{t(`scholarship_tip_${i}`)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* FAQ */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('faq_title')}</h2>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i}>
                <h3 className="font-medium text-gray-900 mb-2">{t(`scholarship_faq_q${i}`)}</h3>
                <p className="text-sm text-gray-600">{t(`scholarship_faq_a${i}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default StudentScholarshipPage;
