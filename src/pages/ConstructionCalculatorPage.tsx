import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Home as HomeIcon, Hammer, DollarSign, Package } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import HreflangTags from '../components/HreflangTags';
import FAQSchema from '../components/FAQSchema';
import { ConstructionCalculatorArticle } from '../components/ConstructionCalculatorArticle';
import {
  MATERIALS,
  CONSTRUCTION_TYPES,
  calculateMaterials,
  calculateDeliveryCost,
  getMaterialById,
  CONSTRUCTION_EXAMPLES,
  DELIVERY_COST
} from '../data/constructionData';

interface MaterialResult {
  materialId: string;
  quantity: number;
  cost: number;
}

const ConstructionCalculatorPage = () => {
  const { language, t, getLocalizedPath } = useLanguage();
  
  const [constructionType, setConstructionType] = useState<string>('wall-brick');
  const [area, setArea] = useState<string>('100');
  const [distance, setDistance] = useState<string>('10');
  
  const [materials, setMaterials] = useState<MaterialResult[]>([]);
  const [totalMaterialsCost, setTotalMaterialsCost] = useState<number>(0);
  const [deliveryCost, setDeliveryCost] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  
  useEffect(() => {
    const areaNum = parseFloat(area);
    const distanceNum = parseFloat(distance);
    
    if (isNaN(areaNum) || areaNum <= 0) {
      setMaterials([]);
      return;
    }
    
    const calculatedMaterials = calculateMaterials(constructionType, areaNum);
    setMaterials(calculatedMaterials);
    
    const totalMat = calculatedMaterials.reduce((sum, mat) => sum + mat.cost, 0);
    setTotalMaterialsCost(totalMat);
    
    const delivery = calculateDeliveryCost(totalMat, distanceNum);
    setDeliveryCost(delivery);
    
    setTotalCost(totalMat + delivery);
  }, [constructionType, area, distance]);
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const formatQuantity = (value: number, unit: string): string => {
    if (unit === 'шт' || unit === 'метр') {
      return value.toFixed(0);
    }
    return value.toFixed(2);
  };
  
  const loadExample = (exampleId: string) => {
    const example = CONSTRUCTION_EXAMPLES.find(ex => ex.id === exampleId);
    if (example) {
      setConstructionType(example.constructionType);
      setArea(example.area.toString());
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{t('construction_calc_title')} - Calk.KG</title>
        <meta name="description" content={t('construction_calc_description')} />
        <meta property="og:title" content={`${t('construction_calc_title')} - Calk.KG`} />
        <meta property="og:description" content={t('construction_calc_description')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/construction" : "https://calk.kg/calculator/construction"} />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/construction" : "https://calk.kg/calculator/construction"} />
      </Helmet>
      <HreflangTags path="/calculator/construction" />
      <FAQSchema translationPrefix="construction" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to={getLocalizedPath("/")} className="flex items-center space-x-2 text-gray-600 hover:text-yellow-600 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>{t('back')}</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <Link to={getLocalizedPath("/")} className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-2 rounded-lg">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">Calk.KG</span>
              </Link>
            </div>
            <Link to={getLocalizedPath("/")} className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
              <HomeIcon className="h-4 w-4" />
              <span>{t('home')}</span>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Hammer className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{t('construction_calc_title')}</h1>
              <p className="text-yellow-100 text-lg">{t('construction_calc_subtitle')}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Current Prices */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('construction_prices_title')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {MATERIALS.slice(0, 8).map(material => (
              <div key={material.id} className="bg-yellow-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-600 mb-1">{t(material.nameKey)}</p>
                <p className="text-lg font-bold text-yellow-600">{material.pricePerUnit} {t('som')}</p>
                <p className="text-xs text-gray-500">{material.unit}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">{t('construction_price_note')}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('construction_select_type')}</h2>
              
              {/* Construction Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('construction_select_type')}
                </label>
                <select
                  value={constructionType}
                  onChange={(e) => setConstructionType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  {CONSTRUCTION_TYPES.map(type => (
                    <option key={type.id} value={type.id}>{t(type.nameKey)}</option>
                  ))}
                </select>
              </div>
              
              {/* Area */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('construction_area')}
                </label>
                <input
                  type="number"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  min="1"
                />
                <p className="text-xs text-gray-500 mt-2">
                  {constructionType === 'foundation' ? t('construction_area_m3') : t('construction_area_m2')}
                </p>
              </div>
              
              {/* Distance */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('construction_distance')}
                </label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  min="0"
                />
              </div>
            </div>
            
            {/* Examples */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">{t('construction_examples_title')}</h3>
              <div className="space-y-2">
                {CONSTRUCTION_EXAMPLES.map(example => (
                  <button
                    key={example.id}
                    onClick={() => loadExample(example.id)}
                    className="w-full text-left px-4 py-2 bg-white rounded-lg hover:bg-yellow-100 transition-colors text-sm"
                  >
                    {t(example.titleKey)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Delivery Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">💡 {t('construction_delivery')}</h3>
              <p className="text-sm text-gray-700">
                {t('construction_delivery_minimum_text')
                  .replace('{minCost}', DELIVERY_COST.minCost.toString())
                  .replace('{costPerKm}', DELIVERY_COST.costPerKm.toString())}
              </p>
              <p className="text-sm text-green-600 mt-2">
                {t('construction_delivery_free_text')
                  .replace('{amount}', formatCurrency(DELIVERY_COST.freeDeliveryFrom))
                  .replace('{free}', t('construction_delivery_free'))}
              </p>
            </div>
          </div>
          
          {/* Results Section */}
          <div className="space-y-6">
            {materials.length > 0 ? (
              <>
                {/* Materials List */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('construction_materials_needed')}</h3>
                  <div className="space-y-3">
                    {materials.map((mat, idx) => {
                      const material = getMaterialById(mat.materialId);
                      if (!material) return null;
                      
                      return (
                        <div key={idx} className="flex justify-between items-center pb-3 border-b">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{t(material.nameKey)}</p>
                            <p className="text-sm text-gray-500">
                              {formatQuantity(mat.quantity, material.unit)} {material.unit} × {material.pricePerUnit} {t('som')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{formatCurrency(mat.cost)} {t('som')}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Total */}
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-8 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-yellow-100 mb-1">{t('construction_total_cost')}</p>
                      <p className="text-4xl font-bold">{formatCurrency(totalCost)} {t('som')}</p>
                    </div>
                    <DollarSign className="h-12 w-12 opacity-50" />
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t('construction_total_materials')}</span>
                      <span className="font-medium">{formatCurrency(totalMaterialsCost)} {t('som')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{t('construction_delivery')}</span>
                      <span className="font-medium">
                        {deliveryCost === 0 ? t('construction_delivery_free') : `${formatCurrency(deliveryCost)} ${t('som')}`}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Package className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">{t('construction_fill_data')}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Tips & FAQ */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('construction_tips_title')}</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="bg-yellow-100 rounded-full p-2 flex-shrink-0">
                    <Hammer className="h-4 w-4 text-yellow-600" />
                  </div>
                  <p className="text-gray-700 text-sm">{t(`construction_tip_${i}`)}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('faq_title')}</h2>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i}>
                  <h3 className="font-medium text-gray-900 mb-2">{t(`construction_faq_q${i}`)}</h3>
                  <p className="text-sm text-gray-600">{t(`construction_faq_a${i}`)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Информационная статья под калькулятором */}
      <ConstructionCalculatorArticle />
    </div>
  );
};

export default ConstructionCalculatorPage;
