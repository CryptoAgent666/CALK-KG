import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowDownUp, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrencyRates } from '../hooks/useCurrencyRates';
import HreflangTags from '../components/HreflangTags';
import CurrencyChart from '../components/CurrencyChart';

const CurrencyExchangePage = () => {
  const { language, t } = useLanguage();
  const { rates, loading, error, convert, getHistory, refresh } = useCurrencyRates();
  
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('KGS');
  const [fromAmount, setFromAmount] = useState('100');
  const [toAmount, setToAmount] = useState('');
  const [chartPeriod, setChartPeriod] = useState<7 | 30>(30);
  const [chartCurrency, setChartCurrency] = useState('USD');

  const currencies = [
    { code: 'KGS', name: 'Кыргызский сом', nameKy: 'Кыргыз сом', flag: '🇰🇬' },
    { code: 'USD', name: rates.USD.name, nameKy: rates.USD.nameKy, flag: '🇺🇸' },
    { code: 'EUR', name: rates.EUR.name, nameKy: rates.EUR.nameKy, flag: '🇪🇺' },
    { code: 'RUB', name: rates.RUB.name, nameKy: rates.RUB.nameKy, flag: '🇷🇺' },
    { code: 'KZT', name: rates.KZT.name, nameKy: rates.KZT.nameKy, flag: '🇰🇿' },
    { code: 'CNY', name: rates.CNY.name, nameKy: rates.CNY.nameKy, flag: '🇨🇳' }
  ];

  useEffect(() => {
    if (!loading && fromAmount) {
      const amount = parseFloat(fromAmount) || 0;
      const result = convert(amount, fromCurrency, toCurrency);
      setToAmount(result.toFixed(2));
    }
  }, [fromAmount, fromCurrency, toCurrency, loading, convert]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
  };

  const handleQuickAmount = (amount: number) => {
    setFromAmount(amount.toString());
  };

  const getRate = (from: string, to: string): string => {
    if (from === to) return '1.00';
    const result = convert(1, from, to);
    return result.toFixed(4);
  };

  const popularPairs = [
    { from: 'USD', to: 'KGS' },
    { from: 'RUB', to: 'KGS' },
    { from: 'EUR', to: 'KGS' },
    { from: 'KZT', to: 'KGS' }
  ];

  return (
    <>
      <Helmet>
        <title>{t('currency_exchange_title')} - Calk.KG</title>
        <meta name="description" content={t('currency_exchange_description')} />
        <meta property="og:title" content={`${t('currency_exchange_title')} - Calk.KG`} />
        <meta property="og:description" content={t('currency_exchange_description')} />
      </Helmet>
      
      <HreflangTags path="/calculator/currency-exchange" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 print:bg-white">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('currency_exchange_title')}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('currency_exchange_subtitle')}
            </p>
            {rates.date && (
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-blue-800">
                  {t('currency_info_note')} {new Date(rates.date).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'ky-KG', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            )}
          </div>

          {/* Main Calculator */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-6 items-end">
              {/* From Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('currency_from')}
                </label>
                <div className="space-y-3">
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  >
                    {currencies.map((curr) => (
                      <option key={curr.code} value={curr.code}>
                        {curr.flag} {curr.code} - {language === 'ky' ? curr.nameKy : curr.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-4 text-2xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center md:pb-4">
                <button
                  onClick={handleSwapCurrencies}
                  className="p-4 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
                  title={t('currency_swap')}
                >
                  <ArrowDownUp className="w-6 h-6 text-blue-600" />
                </button>
              </div>

              {/* To Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('currency_to')}
                </label>
                <div className="space-y-3">
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  >
                    {currencies.map((curr) => (
                      <option key={curr.code} value={curr.code}>
                        {curr.flag} {curr.code} - {language === 'ky' ? curr.nameKy : curr.name}
                      </option>
                    ))}
                  </select>
                  <div className="px-4 py-4 text-2xl font-bold bg-gray-50 border border-gray-200 rounded-lg text-green-600">
                    {loading ? '...' : toAmount}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Amounts */}
            <div className="mt-6 flex flex-wrap gap-2">
              {[10, 50, 100, 500, 1000, 5000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleQuickAmount(amount)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  {amount}
                </button>
              ))}
            </div>

            {/* Exchange Rate */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-center text-gray-700">
                1 {fromCurrency} = <span className="font-bold text-blue-600">{getRate(fromCurrency, toCurrency)}</span> {toCurrency}
              </p>
              <button
                onClick={refresh}
                className="mx-auto mt-2 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {t('currency_refresh')}
              </button>
            </div>
          </div>

          {/* Popular Pairs */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('currency_popular_pairs')}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {popularPairs.map((pair) => {
                const rate = getRate(pair.from, pair.to);
                const fromCurr = currencies.find(c => c.code === pair.from);
                const toCurr = currencies.find(c => c.code === pair.to);
                
                return (
                  <div
                    key={`${pair.from}-${pair.to}`}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                    onClick={() => {
                      setFromCurrency(pair.from);
                      setToCurrency(pair.to);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{fromCurr?.flag}</span>
                        <span className="font-semibold">{pair.from}</span>
                        <span className="text-gray-400">→</span>
                        <span className="text-2xl">{toCurr?.flag}</span>
                        <span className="font-semibold">{pair.to}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">{rate}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Currency Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {t('currency_chart_title')}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setChartPeriod(7)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    chartPeriod === 7
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t('currency_chart_7days')}
                </button>
                <button
                  onClick={() => setChartPeriod(30)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    chartPeriod === 30
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t('currency_chart_30days')}
                </button>
              </div>
            </div>

            {/* Currency selector for chart */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('currency_chart_select')}
              </label>
              <select
                value={chartCurrency}
                onChange={(e) => setChartCurrency(e.target.value)}
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {currencies.filter(c => c.code !== 'KGS').map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.flag} {curr.code} - {language === 'ky' ? curr.nameKy : curr.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Chart component */}
            {!loading && (
              <CurrencyChart
                data={getHistory(chartCurrency, chartPeriod)}
                currencyCode={chartCurrency}
                color="#2563eb"
              />
            )}
            
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>

          {/* Educational Content */}
          {(language === 'ru' || language === 'ky') && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t('currency_guide_title')}
              </h2>
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {t('currency_guide_subtitle1')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t('currency_guide_text1')}
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {t('currency_guide_subtitle2')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t('currency_guide_text2')}
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {t('currency_guide_subtitle3')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t('currency_guide_text3')}
                </p>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">{t('currency_sources')}</h4>
                <ul className="space-y-1">
                  <li>
                    <a href="https://www.nbkr.kg" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {t('currency_source_nbkr')}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* FAQ */}
          {(language === 'ru' || language === 'ky') && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t('faq_title')}
              </h2>
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="border-b border-gray-200 pb-4 last:border-0">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {t(`currency_faq_q${num}`)}
                    </h3>
                    <p className="text-gray-600">
                      {t(`currency_faq_a${num}`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CurrencyExchangePage;
