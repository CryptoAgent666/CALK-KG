import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Home as HomeIcon, Fuel, TrendingDown, DollarSign, Car } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import HreflangTags from '../components/HreflangTags';
import FAQSchema from '../components/FAQSchema';
import { FuelCalculatorArticle } from '../components/FuelCalculatorArticle';
import {
  FUEL_TYPES,
  VEHICLE_TYPES,
  POPULAR_ROUTES,
  getFuelPrice,
  calculateTripCost,
  calculateFuelNeeded,
  calculateSavings,
  calculateYearlyExpenses,
  FUEL_EXAMPLES
} from '../data/fuelData';

interface FuelResults {
  fuelNeeded: number;
  tripCost: number;
  costPerKm: number;
  monthlyExpense?: number;
  yearlyExpense?: number;
}

const FuelCalculatorPage = () => {
  const { language, t, getLocalizedPath } = useLanguage();
  
  const [fuelType, setFuelType] = useState<string>('ai-95');
  const [vehicleType, setVehicleType] = useState<string>('sedan');
  const [customConsumption, setCustomConsumption] = useState<string>('8.5');
  const [distance, setDistance] = useState<string>('100');
  const [monthlyKm, setMonthlyKm] = useState<string>('1000');
  const [compareMode, setCompareMode] = useState<boolean>(false);
  
  // For comparison
  const [fuelType2, setFuelType2] = useState<string>('gas');
  const [vehicleType2, setVehicleType2] = useState<string>('taxi');
  const [customConsumption2, setCustomConsumption2] = useState<string>('9');
  
  const [results, setResults] = useState<FuelResults | null>(null);
  const [results2, setResults2] = useState<FuelResults | null>(null);
  
  const selectedVehicle = VEHICLE_TYPES.find(v => v.id === vehicleType);
  const consumption = vehicleType === 'custom' ? parseFloat(customConsumption) : (selectedVehicle?.avgConsumption || 10);
  const fuelPrice = getFuelPrice(fuelType);
  
  const selectedVehicle2 = VEHICLE_TYPES.find(v => v.id === vehicleType2);
  const consumption2 = vehicleType2 === 'custom' ? parseFloat(customConsumption2) : (selectedVehicle2?.avgConsumption || 10);
  const fuelPrice2 = getFuelPrice(fuelType2);
  
  useEffect(() => {
    const dist = parseFloat(distance);
    const monthly = parseFloat(monthlyKm);
    
    if (isNaN(dist) || dist <= 0) {
      setResults(null);
      return;
    }
    
    const fuelNeeded = calculateFuelNeeded(dist, consumption);
    const tripCost = calculateTripCost(dist, consumption, fuelPrice);
    const costPerKm = tripCost / dist;
    const monthlyExpense = !isNaN(monthly) && monthly > 0 ? calculateTripCost(monthly, consumption, fuelPrice) : undefined;
    const yearlyExpense = monthlyExpense ? monthlyExpense * 12 : undefined;
    
    setResults({
      fuelNeeded,
      tripCost,
      costPerKm,
      monthlyExpense,
      yearlyExpense
    });
    
    if (compareMode) {
      const fuelNeeded2 = calculateFuelNeeded(dist, consumption2);
      const tripCost2 = calculateTripCost(dist, consumption2, fuelPrice2);
      const costPerKm2 = tripCost2 / dist;
      const monthlyExpense2 = !isNaN(monthly) && monthly > 0 ? calculateTripCost(monthly, consumption2, fuelPrice2) : undefined;
      const yearlyExpense2 = monthlyExpense2 ? monthlyExpense2 * 12 : undefined;
      
      setResults2({
        fuelNeeded: fuelNeeded2,
        tripCost: tripCost2,
        costPerKm: costPerKm2,
        monthlyExpense: monthlyExpense2,
        yearlyExpense: yearlyExpense2
      });
    }
  }, [fuelType, vehicleType, customConsumption, distance, monthlyKm, consumption, fuelPrice, compareMode, fuelType2, vehicleType2, customConsumption2, consumption2, fuelPrice2]);
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const loadRoute = (routeId: string) => {
    const route = POPULAR_ROUTES.find(r => r.id === routeId);
    if (route) {
      setDistance(route.distance.toString());
    }
  };
  
  const loadExample = (exampleId: string) => {
    const example = FUEL_EXAMPLES.find(ex => ex.id === exampleId);
    if (example) {
      setDistance(example.distance.toString());
      setCustomConsumption(example.consumption.toString());
      setVehicleType('custom');
      setFuelType(example.fuelType);
    }
  };
  
  const savings = results && results2 ? calculateSavings(
    parseFloat(distance),
    consumption,
    fuelPrice,
    consumption2,
    fuelPrice2
  ) : 0;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{t('fuel_calc_title')} - Calk.KG</title>
        <meta name="description" content={t('fuel_calc_description')} />
        <meta property="og:title" content={`${t('fuel_calc_title')} - Calk.KG`} />
        <meta property="og:description" content={t('fuel_calc_description')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/fuel" : "https://calk.kg/calculator/fuel"} />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/fuel" : "https://calk.kg/calculator/fuel"} />
      </Helmet>
      <HreflangTags path="/calculator/fuel" />
      <FAQSchema translationPrefix="fuel" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to={getLocalizedPath("/")} className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>{t('back')}</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <Link to={getLocalizedPath("/")} className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-2 rounded-lg">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">Calk.KG</span>
              </Link>
            </div>
            <Link to={getLocalizedPath("/")} className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
              <HomeIcon className="h-4 w-4" />
              <span>{t('home')}</span>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Fuel className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{t('fuel_calc_title')}</h1>
              <p className="text-orange-100 text-lg">{t('fuel_calc_subtitle')}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Current Fuel Prices */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('fuel_current_prices')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {FUEL_TYPES.map(fuel => (
              <div key={fuel.id} className="bg-orange-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">{t(fuel.nameKey)}</p>
                <p className="text-2xl font-bold text-orange-600">{fuel.price} {t('fuel_som_per_liter')}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">{t('fuel_price_note')}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">{compareMode ? t('fuel_car_1') : t('fuel_select_type')}</h2>
                <button
                  onClick={() => setCompareMode(!compareMode)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                >
                  {compareMode ? '✕' : '🔄'} {t('fuel_comparison_mode')}
                </button>
              </div>
              
              {/* Fuel Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fuel_select_type')}
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {FUEL_TYPES.map(fuel => (
                    <option key={fuel.id} value={fuel.id}>
                      {t(fuel.nameKey)} — {fuel.price} {t('fuel_som_per_liter')}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Vehicle Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fuel_select_vehicle')}
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {VEHICLE_TYPES.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>{t(vehicle.nameKey)}</option>
                  ))}
                </select>
              </div>
              
              {/* Custom Consumption */}
              {vehicleType === 'custom' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('fuel_consumption')}
                  </label>
                  <input
                    type="number"
                    value={customConsumption}
                    onChange={(e) => setCustomConsumption(e.target.value)}
                    placeholder="8.5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    min="1"
                    step="0.1"
                  />
                </div>
              )}
              
              {/* Distance */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fuel_distance')}
                </label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  min="1"
                />
              </div>
              
              {/* Monthly KM */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fuel_monthly_km')}
                </label>
                <input
                  type="number"
                  value={monthlyKm}
                  onChange={(e) => setMonthlyKm(e.target.value)}
                  placeholder="1000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  min="0"
                />
              </div>
            </div>
            
            {/* Comparison Car 2 */}
            {compareMode && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('fuel_car_2')}</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('fuel_select_type')}
                  </label>
                  <select
                    value={fuelType2}
                    onChange={(e) => setFuelType2(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    {FUEL_TYPES.map(fuel => (
                      <option key={fuel.id} value={fuel.id}>
                        {t(fuel.nameKey)} — {fuel.price} {t('fuel_som_per_liter')}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('fuel_select_vehicle')}
                  </label>
                  <select
                    value={vehicleType2}
                    onChange={(e) => setVehicleType2(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    {VEHICLE_TYPES.map(vehicle => (
                      <option key={vehicle.id} value={vehicle.id}>{t(vehicle.nameKey)}</option>
                    ))}
                  </select>
                </div>
                
                {vehicleType2 === 'custom' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('fuel_consumption')}
                    </label>
                    <input
                      type="number"
                      value={customConsumption2}
                      onChange={(e) => setCustomConsumption2(e.target.value)}
                      placeholder="9"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      min="1"
                      step="0.1"
                    />
                  </div>
                )}
              </div>
            )}
            
            {/* Popular Routes */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">{t('fuel_popular_routes')}</h3>
              <div className="space-y-2">
                {POPULAR_ROUTES.slice(0, 6).map(route => (
                  <button
                    key={route.id}
                    onClick={() => loadRoute(route.id)}
                    className="w-full text-left px-4 py-2 bg-white rounded-lg hover:bg-orange-100 transition-colors text-sm"
                  >
                    {route.from} → {route.to} ({route.distance} км)
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Results Section */}
          <div className="space-y-6">
            {results ? (
              <>
                {!compareMode ? (
                  <>
                    {/* Single Car Results */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-8 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-orange-100 mb-1">{t('fuel_trip_cost')}</p>
                          <p className="text-4xl font-bold">{formatCurrency(results.tripCost)} {t('som')}</p>
                        </div>
                        <DollarSign className="h-12 w-12 opacity-50" />
                      </div>
                      <div className="bg-white/20 rounded-lg p-4">
                        <p className="text-orange-100 text-sm mb-1">{t('fuel_needed')}</p>
                        <p className="text-2xl font-bold">{results.fuelNeeded.toFixed(1)} {t('fuel_liters')}</p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('fuel_results')}</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center pb-3 border-b">
                          <span className="text-gray-600">{t('fuel_cost_per_km')}</span>
                          <span className="font-semibold text-gray-900">
                            {results.costPerKm.toFixed(2)} {t('som')}
                          </span>
                        </div>
                        {results.monthlyExpense && (
                          <div className="flex justify-between items-center pb-3 border-b">
                            <span className="text-gray-600">{t('fuel_monthly_expenses')}</span>
                            <span className="font-semibold text-orange-600">
                              {formatCurrency(results.monthlyExpense)} {t('som')}
                            </span>
                          </div>
                        )}
                        {results.yearlyExpense && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">{t('fuel_yearly_expenses')}</span>
                            <span className="font-semibold text-red-600">
                              {formatCurrency(results.yearlyExpense)} {t('som')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Comparison Results */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-900 mb-3">{t('fuel_car_1')}</h3>
                        <p className="text-3xl font-bold text-blue-600 mb-2">{formatCurrency(results.tripCost)} {t('som')}</p>
                        <p className="text-sm text-gray-600">{results.fuelNeeded.toFixed(1)} л</p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-900 mb-3">{t('fuel_car_2')}</h3>
                        <p className="text-3xl font-bold text-green-600 mb-2">{formatCurrency(results2?.tripCost || 0)} {t('som')}</p>
                        <p className="text-sm text-gray-600">{results2?.fuelNeeded.toFixed(1)} л</p>
                      </div>
                    </div>
                    
                    <div className={`rounded-xl p-6 text-white ${savings >= 0 ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}>
                      <h3 className="font-semibold mb-2">{t('fuel_savings')}</h3>
                      <p className="text-3xl font-bold mb-2">
                        {savings >= 0 ? t('fuel_cheaper_by') : t('fuel_more_expensive')} {formatCurrency(Math.abs(savings))} {t('som')}
                      </p>
                      <p className="text-sm opacity-90">{t('fuel_per_trip')}</p>
                      
                      {results.monthlyExpense && results2?.monthlyExpense && (
                        <div className="mt-4 pt-4 border-t border-white/20">
                          <p className="text-sm mb-1">{t('fuel_per_month')}: {formatCurrency(Math.abs((results.monthlyExpense - results2.monthlyExpense)))} {t('som')}</p>
                          <p className="text-sm">{t('fuel_per_year')}: {formatCurrency(Math.abs((results.yearlyExpense! - results2.yearlyExpense!)))} {t('som')}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Fuel className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">{t('fuel_fill_data')}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Tips & FAQ */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('fuel_tips_title')}</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="bg-orange-100 rounded-full p-2 flex-shrink-0">
                    <TrendingDown className="h-4 w-4 text-orange-600" />
                  </div>
                  <p className="text-gray-700 text-sm">{t(`fuel_tip_${i}`)}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('faq_title')}</h2>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i}>
                  <h3 className="font-medium text-gray-900 mb-2">{t(`fuel_faq_q${i}`)}</h3>
                  <p className="text-sm text-gray-600">{t(`fuel_faq_a${i}`)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Информационная статья под калькулятором */}
        <FuelCalculatorArticle />
      </div>
    </div>
  );
};

export default FuelCalculatorPage;
