import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Home as HomeIcon, Building, DollarSign, TrendingUp, Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import HreflangTags from '../components/HreflangTags';
import FAQSchema from '../components/FAQSchema';
import { RentalCalculatorArticle } from '../components/RentalCalculatorArticle';
import { 
  DISTRICTS, 
  APARTMENT_TYPES, 
  getRentPrice, 
  calculateUtilities,
  ADDITIONAL_COSTS,
  MORTGAGE_CONDITIONS,
  calculateMortgagePayment
} from '../data/rentalData';

interface RentalResults {
  monthlyRent: number;
  utilities: number;
  totalMonthly: number;
  deposit: number;
  agencyFee: number;
  initialCosts: number;
  yearlyTotal: number;
}

interface MortgageComparison {
  apartmentCost: number;
  downPayment: number;
  loanAmount: number;
  monthlyPayment: number;
  total10Years: number;
  total15Years: number;
}

const RentalCalculatorPage = () => {
  const { language, t, getLocalizedPath } = useLanguage();
  
  const [selectedDistrict, setSelectedDistrict] = useState<string>('center');
  const [apartmentType, setApartmentType] = useState<string>('one-room');
  const [season, setSeason] = useState<'winter' | 'summer'>('winter');
  const [eliteHousing, setEliteHousing] = useState<boolean>(false);
  const [showComparison, setShowComparison] = useState<boolean>(false);
  
  const [rentalResults, setRentalResults] = useState<RentalResults | null>(null);
  const [mortgageResults, setMortgageResults] = useState<MortgageComparison | null>(null);
  
  // Расчет аренды
  useEffect(() => {
    const baseRent = getRentPrice(selectedDistrict, apartmentType);
    if (!baseRent) return;
    
    const district = DISTRICTS.find(d => d.id === selectedDistrict);
    const prestigeMultiplier = eliteHousing && district ? district.prestigeCoefficient : 1.0;
    
    const monthlyRent = baseRent * prestigeMultiplier;
    const utilities = calculateUtilities(apartmentType, season);
    const totalMonthly = monthlyRent + utilities;
    const deposit = monthlyRent * ADDITIONAL_COSTS.deposit;
    const agencyFee = monthlyRent * ADDITIONAL_COSTS.agencyFee;
    const initialCosts = deposit + agencyFee + monthlyRent; // первый месяц + залог + комиссия
    const yearlyTotal = totalMonthly * 12;
    
    setRentalResults({
      monthlyRent,
      utilities,
      totalMonthly,
      deposit,
      agencyFee,
      initialCosts,
      yearlyTotal
    });
  }, [selectedDistrict, apartmentType, season, eliteHousing]);
  
  // Расчет ипотеки для сравнения
  useEffect(() => {
    if (!showComparison || !rentalResults) return;
    
    const pricePerSqm = MORTGAGE_CONDITIONS.pricePerSqmByDistrict[selectedDistrict as keyof typeof MORTGAGE_CONDITIONS.pricePerSqmByDistrict] || 80000;
    const typeKey = apartmentType === 'one-room' ? 'oneRoom' : 
                    apartmentType === 'two-room' ? 'twoRoom' : 
                    apartmentType === 'three-room' ? 'threeRoom' : 'studio';
    const area = MORTGAGE_CONDITIONS.averageArea[typeKey as keyof typeof MORTGAGE_CONDITIONS.averageArea];
    
    const apartmentCost = pricePerSqm * area;
    const downPayment = apartmentCost * (MORTGAGE_CONDITIONS.downPaymentPercent / 100);
    const loanAmount = apartmentCost - downPayment;
    const monthlyPayment = calculateMortgagePayment(
      loanAmount,
      MORTGAGE_CONDITIONS.interestRate,
      MORTGAGE_CONDITIONS.termYears
    );
    
    const total10Years = monthlyPayment * 12 * 10 + downPayment;
    const total15Years = monthlyPayment * 12 * 15 + downPayment;
    
    setMortgageResults({
      apartmentCost,
      downPayment,
      loanAmount,
      monthlyPayment,
      total10Years,
      total15Years
    });
  }, [showComparison, selectedDistrict, apartmentType, rentalResults]);
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const district = DISTRICTS.find(d => d.id === selectedDistrict);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{t('rent_calc_title')} | Calk.KG</title>
        <meta name="description" content={t('rent_calc_description')} />
        <meta property="og:title" content={`${t('rent_calc_title')} | Calk.KG`} />
        <meta property="og:description" content={t('rent_calc_description')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/rental/" : "https://calk.kg/calculator/rental/"} />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/rental/" : "https://calk.kg/calculator/rental/"} />
      </Helmet>
      <HreflangTags path="/calculator/rental" />
      <FAQSchema translationPrefix="rent_calc" />
      
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
              <Building className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{t('rent_calc_title')}</h1>
              <p className="text-blue-100 text-lg">{t('rent_calc_subtitle')}</p>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('rent_select_district')}</h2>
              
              {/* District Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('rent_select_district')}
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {DISTRICTS.map(d => (
                    <option key={d.id} value={d.id}>{t(d.nameKey)}</option>
                  ))}
                </select>
              </div>
              
              {/* Apartment Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('rent_select_type')}
                </label>
                <select
                  value={apartmentType}
                  onChange={(e) => setApartmentType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {APARTMENT_TYPES.map(type => (
                    <option key={type.id} value={type.id}>{t(type.nameKey)}</option>
                  ))}
                </select>
              </div>
              
              {/* Season */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('rent_season')}
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSeason('winter')}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                      season === 'winter'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t('rent_season_winter')}
                  </button>
                  <button
                    onClick={() => setSeason('summer')}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                      season === 'summer'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t('rent_season_summer')}
                  </button>
                </div>
              </div>
              
              {/* Elite Housing */}
              <div className="mb-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={eliteHousing}
                    onChange={(e) => setEliteHousing(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">{t('rent_elite_housing')}</span>
                </label>
              </div>
              
              {/* Compare with Mortgage */}
              <div>
                <button
                  onClick={() => setShowComparison(!showComparison)}
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  {showComparison ? '❌' : '📊'} {t('rent_vs_mortgage')}
                </button>
              </div>
            </div>
            
            {/* District Features */}
            {district && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">{t('rent_district_features')}</h3>
                <div className="flex flex-wrap gap-2">
                  {district.features.map((feature, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-blue-200">
                      {t(feature)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Results Section */}
          <div className="space-y-6">
            {rentalResults && (
              <>
                {/* Monthly Costs */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('rent_total_monthly')}</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{t('rent_monthly_rent')}</span>
                      <span className="text-xl font-semibold text-blue-600">
                        {formatCurrency(rentalResults.monthlyRent)} {t('som')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{t('rent_utilities')}</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(rentalResults.utilities)} {t('som')}
                      </span>
                    </div>
                    <div className="border-t pt-3 flex justify-between items-center">
                      <span className="font-semibold text-gray-900">{t('rent_total_monthly')}</span>
                      <span className="text-2xl font-bold text-green-600">
                        {formatCurrency(rentalResults.totalMonthly)} {t('som')}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Initial Costs */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('rent_initial_costs')}</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('rent_deposit')}</span>
                      <span className="font-medium">{formatCurrency(rentalResults.deposit)} {t('som')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('rent_agency_fee')}</span>
                      <span className="font-medium">{formatCurrency(rentalResults.agencyFee)} {t('som')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('rent_monthly_rent')} (1 {t('months_short')})</span>
                      <span className="font-medium">{formatCurrency(rentalResults.monthlyRent)} {t('som')}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between">
                      <span className="font-semibold text-gray-900">{t('rent_initial_costs')}</span>
                      <span className="text-xl font-bold text-red-600">
                        {formatCurrency(rentalResults.initialCosts)} {t('som')}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Yearly Total */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 mb-1">{t('rent_yearly_total')}</p>
                      <p className="text-3xl font-bold">{formatCurrency(rentalResults.yearlyTotal)} {t('som')}</p>
                    </div>
                    <DollarSign className="h-12 w-12 opacity-50" />
                  </div>
                </div>
              </>
            )}
            
            {/* Mortgage Comparison */}
            {showComparison && mortgageResults && rentalResults && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('rent_vs_mortgage')}</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">{t('rent_option')}</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(rentalResults.totalMonthly)}
                    </p>
                    <p className="text-xs text-gray-500">{t('rent_monthly_payment')}</p>
                    <div className="mt-3 text-xs text-gray-600">
                      <p>{t('rent_years_label').replace('{years}', '10')}: {formatCurrency(rentalResults.yearlyTotal * 10)} {t('som')}</p>
                      <p className="text-red-600 font-medium mt-1">❌ {t('rent_property_not_yours')}</p>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">{t('rent_mortgage_option')}</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatCurrency(mortgageResults.monthlyPayment)}
                    </p>
                    <p className="text-xs text-gray-500">{t('rent_monthly_payment')}</p>
                    <div className="mt-3 text-xs text-gray-600">
                      <p>{t('rent_years_label').replace('{years}', '10')}: {formatCurrency(mortgageResults.total10Years)} {t('som')}</p>
                      <p className="text-green-600 font-medium mt-1">✅ {t('rent_property_yours')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('rent_apartment_cost')}</span>
                    <span className="font-medium">{formatCurrency(mortgageResults.apartmentCost)} {t('som')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('rent_initial_payment')}</span>
                    <span className="font-medium text-red-600">{formatCurrency(mortgageResults.downPayment)} {t('som')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('rent_total_15_years')}</span>
                    <span className="font-medium">{formatCurrency(mortgageResults.total15Years)} {t('som')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Tips and FAQ */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tips */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('rent_tips_title')}</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                    <Building className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-gray-700 text-sm">{t(`rent_tip_${i}`)}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* FAQ */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('faq_title')}</h2>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i}>
                  <h3 className="font-medium text-gray-900 mb-2">{t(`rent_faq_q${i}`)}</h3>
                  <p className="text-sm text-gray-600">{t(`rent_faq_a${i}`)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Информационная статья под калькулятором */}
      <RentalCalculatorArticle />
    </div>
  );
};

export default RentalCalculatorPage;
