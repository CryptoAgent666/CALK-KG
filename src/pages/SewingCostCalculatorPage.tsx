import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, ArrowLeft, Info, Home, Printer, Scissors, Plus, Trash2, Shirt, Package, Clock, Building2, Receipt, CreditCard, TrendingUp } from 'lucide-react';
import ActionButtons from '../components/ActionButtons';
import SchemaMarkup from '../components/SchemaMarkup';
import HreflangTags from '../components/HreflangTags';
import { useLanguage } from '../contexts/LanguageContext';
import {
  generateCalculatorSchema,
  generateBreadcrumbSchema
} from '../utils/schemaGenerator';
import { formatCurrentMonth } from '../utils/dateFormatter';

interface Material {
  id: string;
  name: string;
  consumption: number; // метры
  pricePerMeter: number; // {t('sewing_som')} за метр
  cost: number; // итоговая стоимость
}

interface Accessory {
  id: string;
  name: string;
  quantity: number; // штуки
  pricePerPiece: number; // {t('sewing_som')} за штуку
  cost: number; // итоговая стоимость
}

interface SewingResults {
  materialsCost: number;
  accessoriesCost: number;
  laborCost: number;
  totalCost: number;
}

const SewingCostCalculatorPage = () => {
  const { language, t, getLocalizedPath} = useLanguage();

  // Генерация схем для страницы калькулятора себестоимости
  const generateSchemas = () => {
    const currentUrl = language === 'ky' ? "https://calk.kg/ky/calculator/sewing-cost" : "https://calk.kg/calculator/sewing-cost";
    const homeUrl = language === 'ky' ? "https://calk.kg/ky" : "https://calk.kg";

    const calculatorSchema = generateCalculatorSchema({
      url: currentUrl,
      title: t('sewing_calc_title'),
      description: t('sewing_calc_subtitle'),
      calculatorName: t('sewing_calc_name'),
      category: t('nav_construction'),
      language,
      inputProperties: ["materials", "accessories", "laborTime", "hourlyRate"],
      outputProperties: ["materialsCost", "accessoriesCost", "laborCost", "totalCost"]
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: homeUrl },
      { name: t('nav_construction'), url: `${homeUrl}?category=construction` },
      { name: t('sewing_calc_title'), url: currentUrl }
    ]);

    return [calculatorSchema, breadcrumbSchema];
  };

  const [materials, setMaterials] = useState<Material[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [workTimeMinutes, setWorkTimeMinutes] = useState<string>('');
  const [hourlyRate, setHourlyRate] = useState<string>('');
  
  const [results, setResults] = useState<SewingResults>({
    materialsCost: 0,
    accessoriesCost: 0,
    laborCost: 0,
    totalCost: 0
  });

  const materialTemplates = [
    { name: t('sewing_mat_main_fabric'), consumption: 1.5, pricePerMeter: 350 },
    { name: t('sewing_mat_lining'), consumption: 0.8, pricePerMeter: 180 },
    { name: t('sewing_mat_interlining'), consumption: 0.3, pricePerMeter: 120 },
    { name: t('sewing_mat_fleece'), consumption: 0.2, pricePerMeter: 90 }
  ];

  const accessoryTemplates = [
    { name: t('sewing_acc_buttons'), quantity: 8, pricePerPiece: 15 },
    { name: t('sewing_acc_zipper'), quantity: 1, pricePerPiece: 85 },
    { name: t('sewing_acc_thread'), quantity: 2, pricePerPiece: 45 },
    { name: t('sewing_acc_label'), quantity: 1, pricePerPiece: 8 }
  ];

  // Добавление нового материала
  const addMaterial = (template?: typeof materialTemplates[0]) => {
    const newMaterial: Material = {
      id: Date.now().toString(),
      name: template?.name || '',
      consumption: template?.consumption || 0,
      pricePerMeter: template?.pricePerMeter || 0,
      cost: 0
    };
    
    if (template) {
      newMaterial.cost = newMaterial.consumption * newMaterial.pricePerMeter;
    }
    
    setMaterials([...materials, newMaterial]);
  };

  // Добавление новой фурнитуры
  const addAccessory = (template?: typeof accessoryTemplates[0]) => {
    const newAccessory: Accessory = {
      id: Date.now().toString(),
      name: template?.name || '',
      quantity: template?.quantity || 0,
      pricePerPiece: template?.pricePerPiece || 0,
      cost: 0
    };
    
    if (template) {
      newAccessory.cost = newAccessory.quantity * newAccessory.pricePerPiece;
    }
    
    setAccessories([...accessories, newAccessory]);
  };

  // Обновление материала
  const updateMaterial = (id: string, field: keyof Material, value: any) => {
    setMaterials(prev => prev.map(material => {
      if (material.id === id) {
        const updated = { ...material, [field]: value };
        if (field === 'consumption' || field === 'pricePerMeter') {
          updated.cost = updated.consumption * updated.pricePerMeter;
        }
        return updated;
      }
      return material;
    }));
  };

  // Обновление фурнитуры
  const updateAccessory = (id: string, field: keyof Accessory, value: any) => {
    setAccessories(prev => prev.map(accessory => {
      if (accessory.id === id) {
        const updated = { ...accessory, [field]: value };
        if (field === 'quantity' || field === 'pricePerPiece') {
          updated.cost = updated.quantity * updated.pricePerPiece;
        }
        return updated;
      }
      return accessory;
    }));
  };

  // Удаление материала
  const removeMaterial = (id: string) => {
    setMaterials(prev => prev.filter(material => material.id !== id));
  };

  // Удаление фурнитуры
  const removeAccessory = (id: string) => {
    setAccessories(prev => prev.filter(accessory => accessory.id !== id));
  };

  // Расчет себестоимости
  useEffect(() => {
    // Себестоимость материалов
    const materialsCost = materials.reduce((sum, material) => sum + material.cost, 0);
    
    // Себестоимость фурнитуры
    const accessoriesCost = accessories.reduce((sum, accessory) => sum + accessory.cost, 0);
    
    // Стоимость работы
    const timeMinutes = parseFloat(workTimeMinutes) || 0;
    const hourRate = parseFloat(hourlyRate) || 0;
    const laborCost = (timeMinutes / 60) * hourRate;
    
    // Итоговая себестоимость
    const totalCost = materialsCost + accessoriesCost + laborCost;

    setResults({
      materialsCost,
      accessoriesCost,
      laborCost,
      totalCost
    });
  }, [materials, accessories, workTimeMinutes, hourlyRate]);

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

  const currentMonth = formatCurrentMonth(language);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org микроразметка */}
      <Helmet>
        <title>{t('sewing_calc_title')} - Calk.KG</title>
        <meta name="description" content={t('sewing_calc_description')} />
        <meta name="keywords" content={t('sewing_keywords')} />
        <meta property="og:title" content={`${t('sewing_calc_title')} - Calk.KG`} />
        <meta property="og:description" content={t('sewing_calc_description')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/sewing-cost" : "https://calk.kg/calculator/sewing-cost"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/sewing-cost.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('sewing_cost_calc_title')} - Calk.KG`} />
        <meta name="twitter:description" content={t('sewing_cost_calc_subtitle')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/sewing-cost.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/sewing-cost" : "https://calk.kg/calculator/sewing-cost"} />
      </Helmet>
      <HreflangTags path="/calculator/sewing-cost" />
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
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white print:bg-white print:text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 print:py-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white/20 p-3 rounded-lg print:bg-purple-100">
              <Scissors className="h-8 w-8 print:text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold print:text-2xl">{t('sewing_calc_title')}</h1>
              <p className="text-purple-100 text-lg print:text-gray-600">{t('sewing_calc_subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 print:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:gap-6">
          
          {/* Materials Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 print:shadow-none print:border print:break-inside-avoid">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Package className="h-6 w-6 text-purple-600 mr-2" />
                {t('sewing_materials_ui')}
              </h2>
              <div className="flex space-x-2 print:hidden">
                <button
                  onClick={() => addMaterial()}
                  className="flex items-center space-x-2 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>{t('sewing_add_material')}</span>
                </button>
              </div>
            </div>

            {/* Material Templates */}
            {materials.length === 0 && (
              <div className="mb-6 print:hidden">
                <p className="text-sm text-gray-600 mb-3">{t('sewing_add_from_template')}</p>
                <div className="grid grid-cols-2 gap-2">
                  {materialTemplates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => addMaterial(template)}
                      className="text-xs p-2 bg-gray-100 hover:bg-purple-50 rounded border hover:border-purple-200 transition-colors"
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Materials List */}
            <div className="space-y-4">
              {materials.map((material, index) => (
                <div key={material.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-700">{t('sewing_materials_ui')} {index + 1}</span>
                    <button
                      onClick={() => removeMaterial(material.id)}
                      className="text-red-600 hover:text-red-700 transition-colors print:hidden"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder={t('sewing_material_name')}
                      value={material.name}
                      onChange={(e) => updateMaterial(material.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">{t('sewing_consumption')}</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={material.consumption}
                          onChange={(e) => updateMaterial(material.id, 'consumption', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">{t('sewing_price_per_meter')}</label>
                        <input
                          type="number"
                          min="0"
                          value={material.pricePerMeter}
                          onChange={(e) => updateMaterial(material.id, 'pricePerMeter', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                        />
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-2">
                      <div className="text-xs text-gray-600">{t('sewing_materials_cost')}</div>
                      <div className="font-semibold text-purple-600">
                        {formatCurrency(material.cost)} {t('sewing_som')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {materials.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">{t('sewing_add_material')}</p>
                </div>
              )}
            </div>

            {/* Materials Total */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">{t('sewing_materials_cost')}</span>
                <span className="text-xl font-bold text-purple-600">
                  {formatCurrency(results.materialsCost)} {t('sewing_som')}
                </span>
              </div>
            </div>
          </div>

          {/* Accessories Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 print:shadow-none print:border print:break-inside-avoid">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Shirt className="h-6 w-6 text-purple-600 mr-2" />
                {t('sewing_accessories_ui')}
              </h2>
              <div className="flex space-x-2 print:hidden">
                <button
                  onClick={() => addAccessory()}
                  className="flex items-center space-x-2 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>{t('sewing_add_accessory')}</span>
                </button>
              </div>
            </div>

            {/* Accessory Templates */}
            {accessories.length === 0 && (
              <div className="mb-6 print:hidden">
                <p className="text-sm text-gray-600 mb-3">{t('sewing_add_from_template')}</p>
                <div className="grid grid-cols-2 gap-2">
                  {accessoryTemplates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => addAccessory(template)}
                      className="text-xs p-2 bg-gray-100 hover:bg-purple-50 rounded border hover:border-purple-200 transition-colors"
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Accessories List */}
            <div className="space-y-4">
              {accessories.map((accessory, index) => (
                <div key={accessory.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-700">{t('sewing_accessories_ui')} {index + 1}</span>
                    <button
                      onClick={() => removeAccessory(accessory.id)}
                      className="text-red-600 hover:text-red-700 transition-colors print:hidden"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder={t('sewing_accessory_name')}
                      value={accessory.name}
                      onChange={(e) => updateAccessory(accessory.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">{t('sewing_quantity')}</label>
                        <input
                          type="number"
                          min="0"
                          value={accessory.quantity}
                          onChange={(e) => updateAccessory(accessory.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">{t('sewing_price_per_piece')}</label>
                        <input
                          type="number"
                          min="0"
                          value={accessory.pricePerPiece}
                          onChange={(e) => updateAccessory(accessory.id, 'pricePerPiece', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                        />
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-2">
                      <div className="text-xs text-gray-600">{t('sewing_accessories_cost')}</div>
                      <div className="font-semibold text-purple-600">
                        {formatCurrency(accessory.cost)} {t('sewing_som')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {accessories.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Shirt className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">{t('sewing_add_accessory')}</p>
                </div>
              )}
            </div>

            {/* Accessories Total */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">{t('sewing_accessories_cost')}</span>
                <span className="text-xl font-bold text-purple-600">
                  {formatCurrency(results.accessoriesCost)} {t('sewing_som')}
                </span>
              </div>
            </div>
          </div>

          {/* Labor and Results Section */}
          <div className="space-y-6">
            {/* Labor Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 print:shadow-none print:border">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Clock className="h-6 w-6 text-purple-600 mr-2" />
                {t('sewing_labor_params')}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {t('sewing_time_per_item')}
                    </label>
                    <Tooltip text={t('tooltip_sewing_time')}>
                      <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                    </Tooltip>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={workTimeMinutes}
                    onChange={(e) => setWorkTimeMinutes(e.target.value)}
                    placeholder={t('placeholder_example_120')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {t('sewing_hourly_rate_label')}
                    </label>
                    <Tooltip text={t('tooltip_seamstress_rate')}>
                      <Info className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                    </Tooltip>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    placeholder={t('placeholder_example_200')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                {results.laborCost > 0 && (
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">{t('sewing_work_cost_calc')}</div>
                    <div className="text-sm text-gray-700 mb-2">
                      {workTimeMinutes} мин = {((parseFloat(workTimeMinutes) || 0) / 60).toFixed(1)} часов
                    </div>
                    <div className="font-semibold text-purple-600">
                      Стоимость: {formatCurrency(results.laborCost)} {t('sewing_som')}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 print:shadow-none print:border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">{t('sewing_total_cost_title')}</h2>
                {results.totalCost > 0 && (
                  <button
                    onClick={handlePrint}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors print:hidden"
                  >
                    <Printer className="h-4 w-4" />
                    <span>{t('print')}</span>
                  </button>
                )}
              </div>

              {results.totalCost > 0 ? (
                <div className="space-y-6">
                  {/* Cost Breakdown */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <div className="flex items-center">
                        <Package className="h-5 w-5 text-purple-600 mr-2" />
                        <span className="text-gray-700">{t('sewing_materials_ui')}</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(results.materialsCost)} {t('sewing_som')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <div className="flex items-center">
                        <Shirt className="h-5 w-5 text-purple-600 mr-2" />
                        <span className="text-gray-700">{t('sewing_accessories_ui')}</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(results.accessoriesCost)} {t('sewing_som')}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-purple-600 mr-2" />
                        <span className="text-gray-700">{t('sewing_work_ui')}</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(results.laborCost)} {t('sewing_som')}
                      </span>
                    </div>
                  </div>

                  {/* Total Cost */}
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Calculator className="h-6 w-6 mr-2" />
                      <span className="text-purple-100">{t('sewing_item_cost')}</span>
                    </div>
                    <p className="text-4xl font-bold">
                      {formatCurrency(results.totalCost)} {t('sewing_som')}
                    </p>
                  </div>

                  {/* Cost Structure */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-700 mb-3">{t('sewing_cost_structure_title')}</h4>
                    <div className="space-y-3">
                      {/* Materials Percentage */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">{t('sewing_materials_label')}</span>
                          <span className="text-sm font-medium text-purple-600">
                            {results.totalCost > 0 ? ((results.materialsCost / results.totalCost) * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: results.totalCost > 0 ? `${(results.materialsCost / results.totalCost) * 100}%` : '0%' }}
                          ></div>
                        </div>
                      </div>

                      {/* Accessories Percentage */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">{t('sewing_accessories_label')}</span>
                          <span className="text-sm font-medium text-purple-600">
                            {results.totalCost > 0 ? ((results.accessoriesCost / results.totalCost) * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: results.totalCost > 0 ? `${(results.accessoriesCost / results.totalCost) * 100}%` : '0%' }}
                          ></div>
                        </div>
                      </div>

                      {/* Labor Percentage */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">{t('sewing_work_label')}</span>
                          <span className="text-sm font-medium text-purple-600">
                            {results.totalCost > 0 ? ((results.laborCost / results.totalCost) * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: results.totalCost > 0 ? `${(results.laborCost / results.totalCost) * 100}%` : '0%' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-700 mb-3">{t('sewing_additional_info')}</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>{t('sewing_materials_count')}</span>
                        <span>{materials.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('sewing_accessories_count')}</span>
                        <span>{accessories.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('sewing_production_time')}</span>
                        <span>{workTimeMinutes ? `${workTimeMinutes} мин (${((parseFloat(workTimeMinutes) || 0) / 60).toFixed(1)} ч)` : '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('sewing_hourly_rate_label')}</span>
                        <span>{hourlyRate ? `${formatCurrency(parseFloat(hourlyRate))} {t('sewing_som')}/ч` : '—'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <Calculator className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">{t('sewing_add_components')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="mt-12 space-y-12">
          {/* Quick Templates */}
          <div className="bg-white rounded-xl shadow-sm p-8 print:hidden">
            <h3 className="font-medium text-gray-900 mb-6">{t('sewing_ready_templates')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  nameKey: 'sewing_template_shirt',
                  materials: [
                    { nameKey: 'sewing_cotton_main', consumption: 1.8, pricePerMeter: 420 },
                    { nameKey: 'sewing_interfacing_collar', consumption: 0.2, pricePerMeter: 150 }
                  ],
                  accessories: [
                    { nameKey: 'sewing_buttons', quantity: 12, pricePerPiece: 18 },
                    { nameKey: 'sewing_thread', quantity: 2, pricePerPiece: 35 }
                  ],
                  time: 180,
                  rate: 250
                },
                {
                  nameKey: 'sewing_template_dress',
                  materials: [
                    { nameKey: 'sewing_jersey_main', consumption: 2.2, pricePerMeter: 650 },
                    { nameKey: 'sewing_lining', consumption: 1.5, pricePerMeter: 280 }
                  ],
                  accessories: [
                    { nameKey: 'sewing_invisible_zipper', quantity: 1, pricePerPiece: 120 },
                    { nameKey: 'sewing_thread', quantity: 3, pricePerPiece: 45 }
                  ],
                  time: 300,
                  rate: 280
                },
                {
                  nameKey: 'sewing_template_jacket',
                  materials: [
                    { nameKey: 'sewing_raincoat_fabric', consumption: 1.2, pricePerMeter: 380 },
                    { nameKey: 'sewing_insulation', consumption: 1.0, pricePerMeter: 220 },
                    { nameKey: 'sewing_lining', consumption: 1.1, pricePerMeter: 190 }
                  ],
                  accessories: [
                    { nameKey: 'sewing_main_zipper', quantity: 1, pricePerPiece: 95 },
                    { nameKey: 'sewing_snaps', quantity: 4, pricePerPiece: 25 }
                  ],
                  time: 240,
                  rate: 300
                }
              ].map((template, index) => {
                const templateTotalCost = 
                  template.materials.reduce((sum, m) => sum + (m.consumption * m.pricePerMeter), 0) +
                  template.accessories.reduce((sum, a) => sum + (a.quantity * a.pricePerPiece), 0) +
                  ((template.time / 60) * template.rate);

                return (
                  <button
                    key={index}
                    onClick={() => {
                      // Очистить текущие данные
                      setMaterials([]);
                      setAccessories([]);
                      
                      // Добавить материалы из шаблона
                      const newMaterials = template.materials.map((m, idx) => ({
                        id: `material-${Date.now()}-${idx}`,
                        name: t(m.nameKey),
                        consumption: m.consumption,
                        pricePerMeter: m.pricePerMeter,
                        cost: m.consumption * m.pricePerMeter
                      }));
                      
                      // Добавить фурнитуру из шаблона
                      const newAccessories = template.accessories.map((a, idx) => ({
                        id: `accessory-${Date.now()}-${idx}`,
                        name: t(a.nameKey),
                        quantity: a.quantity,
                        pricePerPiece: a.pricePerPiece,
                        cost: a.quantity * a.pricePerPiece
                      }));
                      
                      // Установить данные
                      setMaterials(newMaterials);
                      setAccessories(newAccessories);
                      setWorkTimeMinutes(template.time.toString());
                      setHourlyRate(template.rate.toString());
                    }}
                    className="text-left p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-purple-200 group"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">
                        {t(template.nameKey)}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-purple-600 font-semibold">
                        {formatCurrency(templateTotalCost)} {t('sewing_som')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {template.time} {t('unit_min')} • {template.rate} {t('sewing_som')}/{t('unit_h')}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Business Tips */}
          <div className="bg-white rounded-xl shadow-sm p-8 print:break-inside-avoid">
            <h3 className="font-medium text-gray-900 mb-6">{t('sewing_pricing_tips')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium text-gray-800 mb-3">{t('sewing_full_cost_structure')}</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span><strong>{t('sewing_cost_price')}</strong> - {t('sewing_cost_price_desc')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span><strong>{t('sewing_overhead_costs')}</strong> - {t('sewing_overhead_desc')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span><strong>{t('sewing_profit')}</strong> - {t('sewing_profit_desc')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span><strong>{t('sewing_taxes')}</strong> - {t('sewing_taxes_desc')} (<Link to={getLocalizedPath("/calculator/single-tax")} className="text-purple-600 hover:text-purple-800 underline">{t('sewing_single_tax')}</Link> {t('or')} <Link to={getLocalizedPath("/calculator/patent")} className="text-purple-600 hover:text-purple-800 underline">{t('sewing_patent')}</Link>)</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-3">{t('sewing_recommendations')}</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('sewing_update_materials')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('sewing_account_waste')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('sewing_analyze_competitors')}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{t('sewing_track_time')} <Link to={getLocalizedPath("/calculator/salary")} className="text-green-600 hover:text-green-800 underline">{t('sewing_seamstress_salary')}</Link></span>
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
                to={getLocalizedPath("/calculator/single-tax")}
                className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-purple-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                    <Receipt className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-purple-600">{t('sewing_single_tax_title')}</div>
                    <div className="text-sm text-gray-500">{t('sewing_single_tax_desc')}</div>
                  </div>
                </div>
              </Link>
              <Link
                to={getLocalizedPath("/calculator/patent")}
                className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-purple-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                    <Building2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-purple-600">{t('sewing_patent_title')}</div>
                    <div className="text-sm text-gray-500">{t('sewing_patent_desc')}</div>
                  </div>
                </div>
              </Link>
              <Link
                to={getLocalizedPath("/calculator/salary")}
                className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-purple-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-purple-600">{t('sewing_salary_calc_title')}</div>
                    <div className="text-sm text-gray-500">{t('sewing_salary_calc_desc')}</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <Info className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-2">{t('sewing_important_info')}</p>
                <p className="mb-2">
                  <strong>{t('sewing_basic_calc')}</strong> {t('sewing_basic_calc_desc')} 
                  Для формирования финальной продажной цены необходимо добавить накладные расходы, прибыль и налоги.
                </p>
                <p>
                  Рекомендуется регулярно обновлять цены на материалы и корректировать временные нормы 
                  на основе фактических данных вашего производства.
                </p>
              </div>
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
          .print\\:text-purple-600 {
            color: #9333EA !important;
          }
          .print\\:bg-purple-100 {
            background-color: #F3E8FF !important;
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

export default SewingCostCalculatorPage;