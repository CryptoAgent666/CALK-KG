import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Home, Sprout, TrendingUp, DollarSign, Info, TrendingDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import HreflangTags from '../components/HreflangTags';
import FAQSchema from '../components/FAQSchema';
import { CropCalculatorArticle } from '../components/CropCalculatorArticle';
import { CROPS, REGION_COEFFICIENTS, FERTILIZER_QUALITY, CULTIVATION_METHOD, getCropById } from '../data/cropData';

interface CropResults {
  // Урожай
  expectedYield: number; // т/га с учётом всех коэффициентов
  totalYield: number; // общий урожай в тоннах
  
  // Затраты
  seedCost: number;
  fertilizerCost: number;
  fuelCost: number;
  laborCost: number;
  otherCosts: number;
  totalCosts: number;
  costPerHa: number;
  costPerTon: number;
  
  // Доходы
  totalIncome: number;
  netProfit: number;
  roi: number; // рентабельность в %
  profitable: boolean;
}

const CropYieldCalculatorPage = () => {
  const { language, t, getLocalizedPath } = useLanguage();
  
  const [selectedCrop, setSelectedCrop] = useState<string>('wheat');
  const [area, setArea] = useState<string>('10');
  const [region, setRegion] = useState<string>('chui');
  const [fertilizerQuality, setFertilizerQuality] = useState<string>('basic');
  const [cultivationMethod, setCultivationMethod] = useState<string>('mechanized');
  const [pricePerTon, setPricePerTon] = useState<string>('');
  
  const [results, setResults] = useState<CropResults | null>(null);
  
  // Установить начальную цену при выборе культуры
  useEffect(() => {
    const crop = getCropById(selectedCrop);
    if (crop) {
      setPricePerTon(crop.pricePerTon.toString());
    }
  }, [selectedCrop]);
  
  // Расчёт результатов
  useEffect(() => {
    const crop = getCropById(selectedCrop);
    if (!crop || !area || parseFloat(area) <= 0) {
      setResults(null);
      return;
    }
    
    const areaNum = parseFloat(area);
    const priceNum = parseFloat(pricePerTon) || crop.pricePerTon;
    
    // Коэффициенты
    const regionCoef = REGION_COEFFICIENTS[region] || 1.0;
    const fertilizerCoef = FERTILIZER_QUALITY[fertilizerQuality]?.coefficient || 1.0;
    const fertilizerCostMultiplier = FERTILIZER_QUALITY[fertilizerQuality]?.cost || 1.0;
    const cultivationCoef = CULTIVATION_METHOD[cultivationMethod]?.coefficient || 1.0;
    const cultivationCostMultiplier = CULTIVATION_METHOD[cultivationMethod]?.costMultiplier || 1.0;
    
    // Урожайность с учётом всех факторов
    const expectedYield = crop.avgYield * regionCoef * fertilizerCoef * cultivationCoef;
    const totalYield = expectedYield * areaNum;
    
    // Затраты
    const seedCost = crop.seedCost * areaNum;
    const fertilizerCost = crop.fertilizerCost * areaNum * fertilizerCostMultiplier;
    const fuelCost = crop.fuelCost * areaNum;
    const laborCost = crop.laborCost * areaNum * cultivationCostMultiplier;
    const otherCosts = crop.otherCosts * areaNum;
    const totalCosts = seedCost + fertilizerCost + fuelCost + laborCost + otherCosts;
    const costPerHa = totalCosts / areaNum;
    const costPerTon = totalYield > 0 ? totalCosts / totalYield : 0;
    
    // Доходы
    const totalIncome = totalYield * priceNum;
    const netProfit = totalIncome - totalCosts;
    const roi = totalCosts > 0 ? (netProfit / totalCosts) * 100 : 0;
    const profitable = netProfit > 0;
    
    setResults({
      expectedYield,
      totalYield,
      seedCost,
      fertilizerCost,
      fuelCost,
      laborCost,
      otherCosts,
      totalCosts,
      costPerHa,
      costPerTon,
      totalIncome,
      netProfit,
      roi,
      profitable
    });
  }, [selectedCrop, area, region, fertilizerQuality, cultivationMethod, pricePerTon]);
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const formatNumber = (value: number, decimals: number = 1): string => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  };
  
  const crop = getCropById(selectedCrop);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{t('crop_calc_title')} - Calk.KG</title>
        <meta name="description" content={t('crop_calc_description')} />
        <meta name="keywords" content={t('crop_keywords')} />
        <meta property="og:title" content={`${t('crop_calc_title')} - Calk.KG`} />
        <meta property="og:description" content={t('crop_calc_description')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/crop-yield" : "https://calk.kg/calculator/crop-yield"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/crop-yield.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/crop-yield" : "https://calk.kg/calculator/crop-yield"} />
      </Helmet>
      <HreflangTags path="/calculator/crop-yield" />
      <FAQSchema translationPrefix="crop_calc" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to={getLocalizedPath("/")} className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>{t('back')}</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <Link to={getLocalizedPath("/")} className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-green-600 to-green-700 p-2 rounded-lg">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">Calk.KG</span>
              </Link>
            </div>
            <Link to={getLocalizedPath("/")} className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <Home className="h-4 w-4" />
              <span>{t('home')}</span>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Sprout className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{t('crop_calc_title')}</h1>
              <p className="text-green-100 text-lg">{t('crop_calc_subtitle')}</p>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('crop_parameters')}</h2>
              
              {/* Crop Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('crop_select_culture')}
                </label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <optgroup label="🌾 Зерновые">
                    {CROPS.filter(c => c.category === 'grain').map(c => (
                      <option key={c.id} value={c.id}>{t(c.nameKey)}</option>
                    ))}
                  </optgroup>
                  <optgroup label="🥔 Корнеплоды">
                    {CROPS.filter(c => c.category === 'root').map(c => (
                      <option key={c.id} value={c.id}>{t(c.nameKey)}</option>
                    ))}
                  </optgroup>
                  <optgroup label="🥬 Овощи">
                    {CROPS.filter(c => c.category === 'vegetable').map(c => (
                      <option key={c.id} value={c.id}>{t(c.nameKey)}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
              
              {/* Area */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('crop_area')}
                </label>
                <input
                  type="number"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="10"
                  min="0.1"
                  step="0.1"
                />
                <p className="text-xs text-gray-500 mt-1">{t('crop_area_tooltip')}</p>
              </div>
              
              {/* Region */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('crop_region')}
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {Object.keys(REGION_COEFFICIENTS).map(r => (
                    <option key={r} value={r}>{t(`crop_region_${r.replace('-', '_')}`)}</option>
                  ))}
                </select>
              </div>
              
              {/* Fertilizer Quality */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('crop_fertilizer_quality')}
                </label>
                <select
                  value={fertilizerQuality}
                  onChange={(e) => setFertilizerQuality(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {Object.keys(FERTILIZER_QUALITY).map(f => (
                    <option key={f} value={f}>{t(`crop_fertilizer_${f}`)}</option>
                  ))}
                </select>
              </div>
              
              {/* Cultivation Method */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('crop_cultivation_method')}
                </label>
                <select
                  value={cultivationMethod}
                  onChange={(e) => setCultivationMethod(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {Object.keys(CULTIVATION_METHOD).map(m => (
                    <option key={m} value={m}>{t(`crop_cultivation_${m}`)}</option>
                  ))}
                </select>
              </div>
              
              {/* Price per ton */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('crop_price_per_ton')} ({t('som')})
                </label>
                <input
                  type="number"
                  value={pricePerTon}
                  onChange={(e) => setPricePerTon(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder={crop?.pricePerTon.toString()}
                  min="0"
                />
              </div>
            </div>
            
            {/* Season Info */}
            {crop && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">{t('crop_season_info')}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('crop_planting_season')}:</span>
                    <span className="font-medium">{t(`crop_season_${crop.plantingSeason}`)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('crop_harvest_season')}:</span>
                    <span className="font-medium">{t(`crop_season_${crop.harvestSeason}`)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('crop_growth_period')}:</span>
                    <span className="font-medium">{crop.growthPeriod} {t('crop_days')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Results Section */}
          <div className="space-y-6">
            {results ? (
              <>
                {/* Profitability Banner */}
                <div className={`rounded-xl p-6 text-white ${results.profitable ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {results.profitable ? (
                        <TrendingUp className="h-6 w-6" />
                      ) : (
                        <TrendingDown className="h-6 w-6" />
                      )}
                      <h3 className="text-xl font-semibold">
                        {results.profitable ? t('crop_profitable') : t('crop_unprofitable')}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="text-sm opacity-90">{t('crop_roi')}</p>
                      <p className="text-3xl font-bold">{formatNumber(results.roi, 1)}%</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="opacity-75">{t('crop_total_income')}</p>
                      <p className="text-lg font-semibold">{formatCurrency(results.totalIncome)} {t('som')}</p>
                    </div>
                    <div>
                      <p className="opacity-75">{t('crop_net_profit')}</p>
                      <p className="text-lg font-semibold">{formatCurrency(results.netProfit)} {t('som')}</p>
                    </div>
                  </div>
                </div>
                
                {/* Yield */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('crop_expected_yield')}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-green-50 rounded-lg p-4">
                      <span className="text-gray-700">{t('crop_yield_per_ha')}</span>
                      <span className="text-2xl font-bold text-green-600">{formatNumber(results.expectedYield, 2)} т/га</span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-50 rounded-lg p-4">
                      <span className="text-gray-700">{t('crop_total_yield')}</span>
                      <span className="text-xl font-semibold text-gray-900">{formatNumber(results.totalYield, 1)} {t('crop_tons')}</span>
                    </div>
                  </div>
                </div>
                
                {/* Costs */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('crop_cost_breakdown')}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('crop_cost_seeds')}</span>
                      <span className="font-medium">{formatCurrency(results.seedCost)} {t('som')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('crop_cost_fertilizer')}</span>
                      <span className="font-medium">{formatCurrency(results.fertilizerCost)} {t('som')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('crop_cost_fuel')}</span>
                      <span className="font-medium">{formatCurrency(results.fuelCost)} {t('som')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('crop_cost_labor')}</span>
                      <span className="font-medium">{formatCurrency(results.laborCost)} {t('som')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('crop_cost_other')}</span>
                      <span className="font-medium">{formatCurrency(results.otherCosts)} {t('som')}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between font-semibold">
                      <span className="text-gray-900">{t('crop_total_costs')}</span>
                      <span className="text-lg text-red-600">{formatCurrency(results.totalCosts)} {t('som')}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 bg-gray-50 rounded p-2">
                      <span>{t('crop_cost_per_ha')}</span>
                      <span>{formatCurrency(results.costPerHa)} {t('som_per_ha')}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 bg-gray-50 rounded p-2">
                      <span>{t('crop_cost_per_ton')}</span>
                      <span>{formatCurrency(results.costPerTon)} {t('som_per_ton')}</span>
                    </div>
                  </div>
                </div>
                
                {/* Recommendations */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">{t('crop_recommendations')}</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      <span>{t('crop_rec_fertilizer')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      <span>{t('crop_rec_mechanization')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      <span>{t('crop_rec_region')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      <span>{t('crop_rec_storage')}</span>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Sprout className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">{t('crop_select_culture')}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Tips and FAQ */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tips */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('crop_tips_title')}</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                    <Sprout className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-gray-700 text-sm">{t(`crop_tip_${i}`)}</p>
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
                  <h3 className="font-medium text-gray-900 mb-2">{t(`crop_faq_q${i}`)}</h3>
                  <p className="text-sm text-gray-600">{t(`crop_faq_a${i}`)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Информационная статья под калькулятором */}
      <CropCalculatorArticle />
    </div>
  );
};

export default CropYieldCalculatorPage;
