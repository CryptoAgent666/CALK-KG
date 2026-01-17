import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Smartphone, Check, ExternalLink, TrendingDown, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import HreflangTags from '../components/HreflangTags';
import { mobileTariffs, operatorInfo, calculateTariffCost, MobileTariff } from '../data/mobileTariffs';

interface TariffResult extends MobileTariff {
  calculatedCost: {
    baseCost: number;
    extraMinutesCost: number;
    extraSMSCost: number;
    extraGBCost: number;
    totalCost: number;
  };
}

const MobileTariffsCalculatorPage = () => {
  const { language, t } = useLanguage();

  // User usage inputs
  const [usageMinutes, setUsageMinutes] = useState(500);
  const [usageSMS, setUsageSMS] = useState(50);
  const [usageGB, setUsageGB] = useState(10);

  // Filter options
  const [selectedOperators, setSelectedOperators] = useState<string[]>(['megacom', 'beeline', 'o']);
  const [maxBudget, setMaxBudget] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'price' | 'internet' | 'minutes'>('price');

  // Calculate results
  const results = useMemo<TariffResult[]>(() => {
    let filtered = mobileTariffs.filter(tariff => 
      selectedOperators.includes(tariff.operator)
    );

    // Calculate costs for each tariff
    const withCosts = filtered.map(tariff => ({
      ...tariff,
      calculatedCost: calculateTariffCost(tariff, usageMinutes, usageSMS, usageGB)
    }));

    // Apply budget filter
    if (maxBudget) {
      withCosts.filter(t => t.calculatedCost.totalCost <= maxBudget);
    }

    // Sort
    withCosts.sort((a, b) => {
      if (sortBy === 'price') {
        return a.calculatedCost.totalCost - b.calculatedCost.totalCost;
      } else if (sortBy === 'internet') {
        const aGB = a.internetGB === 'unlimited' ? 999 : a.internetGB;
        const bGB = b.internetGB === 'unlimited' ? 999 : b.internetGB;
        return bGB - aGB;
      } else {
        const aMin = a.minutes === 'unlimited' ? 999999 : a.minutes;
        const bMin = b.minutes === 'unlimited' ? 999999 : b.minutes;
        return bMin - aMin;
      }
    });

    return withCosts;
  }, [usageMinutes, usageSMS, usageGB, selectedOperators, maxBudget, sortBy]);

  const toggleOperator = (operator: string) => {
    setSelectedOperators(prev =>
      prev.includes(operator)
        ? prev.filter(op => op !== operator)
        : [...prev, operator]
    );
  };

  const bestTariff = results[0];

  const formatValue = (value: number | 'unlimited') => {
    if (value === 'unlimited') {
      return language === 'ky' ? '∞ Чексиз' : '∞ Безлимит';
    }
    return value;
  };

  return (
    <>
      <Helmet>
        <title>{t('mobile_tariffs_title')} - Calk.KG</title>
        <meta name="description" content={t('mobile_tariffs_description')} />
        <meta property="og:title" content={`${t('mobile_tariffs_title')} - Calk.KG`} />
        <meta property="og:description" content={t('mobile_tariffs_description')} />
      </Helmet>

      <HreflangTags path="/calculator/mobile-tariffs" />

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 py-8 px-4 print:bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Smartphone className="w-16 h-16 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('mobile_tariffs_title')}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('mobile_tariffs_subtitle')}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Filters */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {t('mobile_tariffs_usage')}
                </h2>

                {/* Minutes */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('mobile_tariffs_minutes')}
                  </label>
                  <input
                    type="number"
                    value={usageMinutes}
                    onChange={(e) => setUsageMinutes(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    min="0"
                  />
                  <div className="flex gap-2 mt-2">
                    {[300, 500, 1000, 2000].map(val => (
                      <button
                        key={val}
                        onClick={() => setUsageMinutes(val)}
                        className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SMS */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('mobile_tariffs_sms')}
                  </label>
                  <input
                    type="number"
                    value={usageSMS}
                    onChange={(e) => setUsageSMS(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    min="0"
                  />
                  <div className="flex gap-2 mt-2">
                    {[0, 50, 100, 200].map(val => (
                      <button
                        key={val}
                        onClick={() => setUsageSMS(val)}
                        className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Internet GB */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('mobile_tariffs_internet')} (ГБ)
                  </label>
                  <input
                    type="number"
                    value={usageGB}
                    onChange={(e) => setUsageGB(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    min="0"
                  />
                  <div className="flex gap-2 mt-2">
                    {[5, 10, 20, 50].map(val => (
                      <button
                        key={val}
                        onClick={() => setUsageGB(val)}
                        className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                      >
                        {val} ГБ
                      </button>
                    ))}
                  </div>
                </div>

                {/* Operators */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t('mobile_tariffs_operators')}
                  </label>
                  {Object.entries(operatorInfo).map(([key, info]) => (
                    <label
                      key={key}
                      className="flex items-center p-3 mb-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                      style={{
                        borderColor: selectedOperators.includes(key) ? info.color : '#e5e7eb'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedOperators.includes(key)}
                        onChange={() => toggleOperator(key)}
                        className="w-4 h-4 rounded focus:ring-2"
                        style={{ accentColor: info.color }}
                      />
                      <span className="ml-3 font-medium" style={{ color: info.color }}>
                        {info.name}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('mobile_tariffs_sort')}
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="price">{t('mobile_tariffs_by_price')}</option>
                    <option value="internet">{t('mobile_tariffs_by_internet')}</option>
                    <option value="minutes">{t('mobile_tariffs_by_minutes')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Column - Results */}
            <div className="lg:col-span-2">
              {results.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                  <Smartphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">
                    {t('mobile_tariffs_no_results')}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((tariff, index) => {
                    const isBest = index === 0;
                    const operator = operatorInfo[tariff.operator];
                    const hasExtra = tariff.calculatedCost.extraMinutesCost > 0 || 
                                    tariff.calculatedCost.extraSMSCost > 0 || 
                                    tariff.calculatedCost.extraGBCost > 0;

                    return (
                      <div
                        key={tariff.id}
                        className={`bg-white rounded-2xl shadow-xl p-6 ${
                          isBest ? 'ring-2 ring-green-500' : ''
                        }`}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            {(isBest || tariff.recommended || tariff.popular) && (
                              <div className="flex gap-2 mb-2">
                                {isBest && (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                    <TrendingDown className="w-4 h-4" />
                                    {t('mobile_tariffs_cheapest')}
                                  </span>
                                )}
                                {tariff.recommended && (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    <Star className="w-4 h-4" />
                                    {t('mobile_tariffs_recommended')}
                                  </span>
                                )}
                                {tariff.popular && !tariff.recommended && (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                    🔥 {t('mobile_tariffs_popular')}
                                  </span>
                                )}
                              </div>
                            )}
                            <div className="flex items-center gap-3">
                              <h3 className="text-2xl font-bold" style={{ color: operator.color }}>
                                {operator.name}
                              </h3>
                              <span className="text-xl font-semibold text-gray-700">
                                {language === 'ky' ? tariff.nameKy : tariff.name}
                              </span>
                            </div>
                          </div>
                          <a
                            href={operator.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        </div>

                        {/* Main Info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">{t('mobile_tariffs_minutes')}</p>
                            <p className="text-lg font-bold text-gray-900">
                              {formatValue(tariff.minutes)}
                            </p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">{t('mobile_tariffs_sms')}</p>
                            <p className="text-lg font-bold text-gray-900">
                              {formatValue(tariff.sms)}
                            </p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">{t('mobile_tariffs_internet')}</p>
                            <p className="text-lg font-bold text-gray-900">
                              {formatValue(tariff.internetGB)} ГБ
                            </p>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">{t('mobile_tariffs_price')}</p>
                            <p className="text-2xl font-bold text-green-600">
                              {tariff.calculatedCost.totalCost.toFixed(0)} ⊆
                            </p>
                          </div>
                        </div>

                        {/* Extra costs warning */}
                        {hasExtra && (
                          <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                            <p className="text-sm text-yellow-800 font-medium mb-1">
                              ⚠️ {t('mobile_tariffs_extra_charges')}
                            </p>
                            <div className="text-xs text-yellow-700 space-y-1">
                              {tariff.calculatedCost.extraMinutesCost > 0 && (
                                <p>• {t('mobile_tariffs_minutes')}: +{tariff.calculatedCost.extraMinutesCost.toFixed(0)} ⊆</p>
                              )}
                              {tariff.calculatedCost.extraSMSCost > 0 && (
                                <p>• {t('mobile_tariffs_sms')}: +{tariff.calculatedCost.extraSMSCost.toFixed(0)} ⊆</p>
                              )}
                              {tariff.calculatedCost.extraGBCost > 0 && (
                                <p>• {t('mobile_tariffs_internet')}: +{tariff.calculatedCost.extraGBCost.toFixed(0)} ⊆</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Features */}
                        <div className="pt-4 border-t border-gray-200">
                          <ul className="grid md:grid-cols-2 gap-2">
                            {(language === 'ky' ? tariff.featuresKy : tariff.features).slice(0, 4).map((feature, i) => (
                              <li key={i} className="text-sm text-gray-700 flex items-start">
                                <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Best offer summary */}
              {bestTariff && results.length > 1 && (
                <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                  <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5" />
                    💡 {t('mobile_tariffs_best_choice')}
                  </h3>
                  <p className="text-green-800">
                    {t('mobile_tariffs_save_with')} <strong>{operatorInfo[bestTariff.operator].name} {language === 'ky' ? bestTariff.nameKy : bestTariff.name}</strong> — {t('mobile_tariffs_only')} <strong>{bestTariff.calculatedCost.totalCost.toFixed(0)} ⊆</strong> {t('mobile_tariffs_per_month')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Educational Content */}
          {(language === 'ru' || language === 'ky') && (
            <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t('mobile_tariffs_guide_title')}
              </h2>
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {t('mobile_tariffs_guide_subtitle1')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t('mobile_tariffs_guide_text1')}
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {t('mobile_tariffs_guide_subtitle2')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t('mobile_tariffs_guide_text2')}
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {t('mobile_tariffs_guide_subtitle3')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t('mobile_tariffs_guide_text3')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileTariffsCalculatorPage;
