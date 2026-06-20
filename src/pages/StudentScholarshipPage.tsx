import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Home as HomeIcon, GraduationCap, DollarSign, Award, BookOpen } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import HreflangTags from '../components/HreflangTags';
import FAQSchema from '../components/FAQSchema';
import { ScholarshipCalculatorArticle } from '../components/ScholarshipCalculatorArticle';
import {
  SCHOLARSHIP_TYPES,
  UNIVERSITIES,
  SCIENTIFIC_BONUSES,
  calculateScholarship,
  SCHOLARSHIP_EXAMPLES,
  GPA_MULTIPLIERS
} from '../data/scholarshipData';

const StudentScholarshipPage = () => {
  const { language, t, getLocalizedPath } = useLanguage();
  
  const [scholarshipType, setScholarshipType] = useState<string>('academic');
  const [university, setUniversity] = useState<string>('knu');
  const [gpa, setGpa] = useState<string>('4.0');
  const [selectedBonuses, setSelectedBonuses] = useState<string[]>([]);
  
  const [results, setResults] = useState({
    baseAmount: 0,
    gpaMultiplier: 0,
    universityCoefficient: 0,
    scholarshipAmount: 0,
    bonusesAmount: 0,
    totalAmount: 0
  });
  
  useEffect(() => {
    const gpaNum = parseFloat(gpa);
    if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 5) {
      return;
    }
    
    const calculated = calculateScholarship(
      scholarshipType,
      gpaNum,
      university,
      selectedBonuses
    );
    
    setResults(calculated);
  }, [scholarshipType, university, gpa, selectedBonuses]);

  const selectedScholarship = SCHOLARSHIP_TYPES.find(s => s.id === scholarshipType);
  const isOneTime = !!selectedScholarship?.isOneTime;
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const toggleBonus = (bonusId: string) => {
    if (selectedBonuses.includes(bonusId)) {
      setSelectedBonuses(selectedBonuses.filter(id => id !== bonusId));
    } else {
      setSelectedBonuses([...selectedBonuses, bonusId]);
    }
  };
  
  const loadExample = (exampleId: string) => {
    const example = SCHOLARSHIP_EXAMPLES.find(ex => ex.id === exampleId);
    if (example) {
      setScholarshipType(example.scholarshipType);
      setUniversity(example.university);
      setGpa(example.gpa.toString());
      setSelectedBonuses(example.bonuses);
    }
  };
  
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
        {/* Current Scholarship Amounts */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('scholarship_base_amounts_title')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {SCHOLARSHIP_TYPES.map(type => (
              <div key={type.id} className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-600 mb-1">{t(type.nameKey)}</p>
                <p className="text-lg font-bold text-blue-600">{type.baseAmount} {t('som')}</p>
                <p className="text-xs text-gray-500">{type.isOneTime ? t('scholarship_one_time') : `/${t('month')}`}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('scholarship_select_type')}</h2>
              
              {/* Scholarship Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('scholarship_select_type')}
                </label>
                <select
                  value={scholarshipType}
                  onChange={(e) => setScholarshipType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {SCHOLARSHIP_TYPES.map(type => (
                    <option key={type.id} value={type.id}>{t(type.nameKey)}</option>
                  ))}
                </select>
              </div>
              
              {/* University */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('scholarship_select_university')}
                </label>
                <select
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {UNIVERSITIES.map(uni => (
                    <option key={uni.id} value={uni.id}>{t(uni.nameKey)}</option>
                  ))}
                </select>
              </div>
              
              {/* GPA */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('scholarship_gpa')}
                </label>
                <input
                  type="number"
                  value={gpa}
                  onChange={(e) => setGpa(e.target.value)}
                  placeholder="4.0"
                  step="0.1"
                  min="0"
                  max="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-2">{t('scholarship_gpa_tooltip')}</p>
              </div>
              
              {/* Scientific Bonuses */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('scholarship_bonuses')}
                </label>
                <div className="space-y-2">
                  {SCIENTIFIC_BONUSES.map(bonus => (
                    <label key={bonus.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedBonuses.includes(bonus.id)}
                        onChange={() => toggleBonus(bonus.id)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="flex-1 text-sm text-gray-700">{t(bonus.nameKey)}</span>
                      <span className="text-sm font-semibold text-blue-600">+{bonus.amount} {t('som')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Examples */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">{t('scholarship_examples_title')}</h3>
              <div className="space-y-2">
                {SCHOLARSHIP_EXAMPLES.map(example => (
                  <button
                    key={example.id}
                    onClick={() => loadExample(example.id)}
                    className="w-full text-left px-4 py-2 bg-white rounded-lg hover:bg-blue-100 transition-colors text-sm"
                  >
                    {t(example.titleKey)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* GPA Info */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">{t('scholarship_gpa_coefficients_title')}</h3>
              <div className="space-y-2 text-sm">
                {GPA_MULTIPLIERS.map((range, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="text-gray-700">
                      {range.minGPA.toFixed(1)} - {range.maxGPA === 5 ? '5.0' : range.maxGPA.toFixed(1)}
                    </span>
                    <span className="font-semibold text-green-600">
                      {range.multiplier === 0 ? t('scholarship_no_coefficient') : `×${range.multiplier}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Results Section */}
          <div className="space-y-6">
            {results.totalAmount > 0 ? (
              <>
                {/* Main Result */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-blue-100 mb-1">{t('scholarship_total')}</p>
                      <p className="text-4xl font-bold">{formatCurrency(results.totalAmount)} {t('som')}</p>
                    </div>
                    <DollarSign className="h-12 w-12 opacity-50" />
                  </div>
                  {isOneTime ? (
                    <div className="bg-white/20 rounded-lg p-4 text-sm">
                      {t('scholarship_one_time_note')}
                    </div>
                  ) : (
                    <div className="bg-white/20 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{t('scholarship_per_semester')}</span>
                        <span className="font-medium">{formatCurrency(results.totalAmount * 5)} {t('som')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{t('scholarship_per_year')}</span>
                        <span className="font-medium">{formatCurrency(results.totalAmount * 10)} {t('som')}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Breakdown */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('scholarship_detailed_calculation')}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b">
                      <div>
                        <p className="font-medium text-gray-900">{t('scholarship_base_amount')}</p>
                        <p className="text-sm text-gray-500">{t('scholarship_base_amount_desc')}</p>
                      </div>
                      <p className="font-semibold text-gray-900">{formatCurrency(results.baseAmount)} {t('som')}</p>
                    </div>
                    
                    {!isOneTime && (
                      <>
                        <div className="flex justify-between items-center pb-3 border-b">
                          <div>
                            <p className="font-medium text-gray-900">{t('scholarship_gpa_multiplier')}</p>
                            <p className="text-sm text-gray-500">{t('scholarship_gpa_desc')} {parseFloat(gpa).toFixed(1)}</p>
                          </div>
                          <p className="font-semibold text-blue-600">×{results.gpaMultiplier.toFixed(1)}</p>
                        </div>

                        <div className="flex justify-between items-center pb-3 border-b">
                          <div>
                            <p className="font-medium text-gray-900">{t('scholarship_university_coefficient')}</p>
                            <p className="text-sm text-gray-500">{t(`university_${university}`)}</p>
                          </div>
                          <p className="font-semibold text-blue-600">×{results.universityCoefficient.toFixed(1)}</p>
                        </div>
                      </>
                    )}
                    
                    <div className="flex justify-between items-center pb-3 border-b">
                      <div>
                        <p className="font-medium text-gray-900">{t('scholarship_amount')}</p>
                        <p className="text-sm text-gray-500">{t('scholarship_amount_desc')}</p>
                      </div>
                      <p className="font-semibold text-gray-900">{formatCurrency(results.scholarshipAmount)} {t('som')}</p>
                    </div>
                    
                    {results.bonusesAmount > 0 && (
                      <div className="flex justify-between items-center pb-3 border-b">
                        <div>
                          <p className="font-medium text-gray-900">{t('scholarship_bonuses_amount')}</p>
                          <p className="text-sm text-gray-500">{t('scholarship_bonuses_desc')}</p>
                        </div>
                        <p className="font-semibold text-green-600">+{formatCurrency(results.bonusesAmount)} {t('som')}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-3 bg-blue-50 rounded-lg p-3">
                      <p className="font-bold text-gray-900">{t('scholarship_total')}</p>
                      <p className="font-bold text-blue-600 text-xl">{formatCurrency(results.totalAmount)} {t('som')}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                {parseFloat(gpa) < 3.0 ? (
                  <>
                    <Award className="h-20 w-20 text-red-300 mx-auto mb-4" />
                    <p className="text-red-600 text-lg font-semibold mb-2">
                      {t('scholarship_no_scholarship')}
                    </p>
                    <p className="text-gray-500">
                      {t('scholarship_gpa_too_low')}
                    </p>
                  </>
                ) : (
                  <>
                    <BookOpen className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">
                      {t('scholarship_select_all')}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Educational Content */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Conditions */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('scholarship_conditions_title')}</h2>
            <div className="space-y-4">
              {['academic', 'social', 'named', 'president'].map(type => (
                <div key={type} className="flex items-start space-x-3">
                  <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                    <Award className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-gray-700 text-sm">{t(`scholarship_condition_${type}`)}</p>
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

      {/* Информационная статья под калькулятором */}
      <ScholarshipCalculatorArticle />
    </div>
  );
};

export default StudentScholarshipPage;
