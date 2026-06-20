import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Check, ExternalLink, Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrencyRates } from '../hooks/useCurrencyRates';
import HreflangTags from '../components/HreflangTags';
import FAQSchema from '../components/FAQSchema';
import { transferServices, calculateCommission, applyExchangeMarkup } from '../data/transferServices';
import { MoneyTransferCalculatorArticle } from '../components/MoneyTransferCalculatorArticle';

interface TransferResult {
  serviceId: string;
  serviceName: string;
  commission: number;
  exchangeRate: number;
  totalCost: number;
  received: number;
  deliveryTime: string;
}

const MoneyTransferCalculatorPage = () => {
  const { language, t } = useLanguage();
  const { rates, loading } = useCurrencyRates();
  
  const [sendAmount, setSendAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('KGS');
  const [selectedServices, setSelectedServices] = useState<string[]>(['koronapay', 'golden-crown', 'contact']);
  const [results, setResults] = useState<TransferResult[]>([]);

  const currencies = [
    { code: 'USD', name: 'Доллар США', nameKy: 'АКШ доллары', flag: '🇺🇸' },
    { code: 'EUR', name: 'Евро', nameKy: 'Евро', flag: '🇪🇺' },
    { code: 'RUB', name: 'Российский рубль', nameKy: 'Орус рубли', flag: '🇷🇺' },
    { code: 'KZT', name: 'Казахстанский тенге', nameKy: 'Казак теңгеси', flag: '🇰🇿' },
    { code: 'KGS', name: 'Кыргызский сом', nameKy: 'Кыргыз сом', flag: '🇰🇬' }
  ];

  useEffect(() => {
    if (!loading && sendAmount) {
      calculateResults();
    }
  }, [sendAmount, fromCurrency, toCurrency, selectedServices, loading, rates]);

  const calculateResults = () => {
    const amount = parseFloat(sendAmount) || 0;
    if (amount <= 0) return;

    // Получаем базовый курс обмена
    let baseRate = 1;
    if (fromCurrency !== toCurrency) {
      // Конвертация через сомы
      let amountInKGS = amount;
      
      if (fromCurrency !== 'KGS') {
        const fromRate = rates[fromCurrency as keyof typeof rates];
        if (fromRate && typeof fromRate !== 'string') {
          amountInKGS = amount * fromRate.rate;
        }
      }
      
      if (toCurrency !== 'KGS') {
        const toRate = rates[toCurrency as keyof typeof rates];
        if (toRate && typeof toRate !== 'string') {
          baseRate = amountInKGS / toRate.rate;
        } else {
          baseRate = amountInKGS;
        }
      } else {
        baseRate = amountInKGS / amount;
      }
    }

    const newResults: TransferResult[] = transferServices
      .filter(service => selectedServices.includes(service.id))
      .map(service => {
        const commission = calculateCommission(service, amount);
        const exchangeRate = applyExchangeMarkup(baseRate, service.exchangeRateMarkup);
        const totalCost = amount + commission;
        const received = amount * exchangeRate;
        
        return {
          serviceId: service.id,
          serviceName: service.name,
          commission,
          exchangeRate,
          totalCost,
          received,
          deliveryTime: language === 'ky' ? service.deliveryTimeKy : service.deliveryTime
        };
      })
      .sort((a, b) => b.received - a.received); // Сортируем по выгоде

    setResults(newResults);
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const bestService = results[0];

  // Format a received amount with space thousands separators + 2 decimals,
  // e.g. 86138.25 → "86 138.25". Matches the site-wide number style instead
  // of a raw toFixed() which omits grouping for large sums.
  const formatReceived = (n: number): string => {
    const [intPart, decPart] = n.toFixed(2).split('.');
    const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${grouped}.${decPart}`;
  };

  return (
    <>
      <Helmet>
        <title>{t('money_transfer_title')} | Calk.KG</title>
        <meta name="description" content={t('money_transfer_description')} />
        <meta property="og:title" content={`${t('money_transfer_title')} | Calk.KG`} />
        <meta property="og:description" content={t('money_transfer_description')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/calculator/money-transfer/" : "https://calk.kg/calculator/money-transfer/"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/money-transfer.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta property="og:site_name" content="Calk.KG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('money_transfer_title')} | Calk.KG`} />
        <meta name="twitter:description" content={t('money_transfer_description')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/money-transfer.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/calculator/money-transfer/" : "https://calk.kg/calculator/money-transfer/"} />
      </Helmet>
      
      <HreflangTags path="/calculator/money-transfer" />
      <FAQSchema translationPrefix="moneytransfer" />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-8 px-4 print:bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('money_transfer_title')}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('money_transfer_subtitle')}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Input */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {t('money_transfer_params')}
                </h2>

                {/* Amount */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('money_transfer_amount')}
                  </label>
                  <input
                    type="number"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    className="w-full px-4 py-3 text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="100"
                  />
                </div>

                {/* From Currency */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('money_transfer_from')}
                  </label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {currencies.map(curr => (
                      <option key={curr.code} value={curr.code}>
                        {curr.flag} {curr.code} - {language === 'ky' ? curr.nameKy : curr.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* To Currency */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('money_transfer_to')}
                  </label>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {currencies.map(curr => (
                      <option key={curr.code} value={curr.code}>
                        {curr.flag} {curr.code} - {language === 'ky' ? curr.nameKy : curr.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Services Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t('money_transfer_services')}
                  </label>
                  <div className="space-y-2">
                    {transferServices.map(service => (
                      <label
                        key={service.id}
                        className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        style={{
                          borderColor: selectedServices.includes(service.id) ? service.color : '#e5e7eb'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(service.id)}
                          onChange={() => toggleService(service.id)}
                          className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                        />
                        <span className="ml-3 font-medium">{service.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Results */}
            <div className="lg:col-span-2">
              {results.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                  <Info className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">
                    {t('money_transfer_select_services')}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((result, index) => {
                    const service = transferServices.find(s => s.id === result.serviceId)!;
                    const isBest = index === 0;
                    
                    return (
                      <div
                        key={result.serviceId}
                        className={`bg-white rounded-2xl shadow-xl p-6 ${
                          isBest ? 'ring-2 ring-green-500' : ''
                        }`}
                      >
                        {isBest && (
                          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            <Check className="w-4 h-4" />
                            {t('money_transfer_best_rate')}
                          </div>
                        )}

                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold" style={{ color: service.color }}>
                              {service.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {t('money_transfer_delivery')}: {result.deliveryTime}
                            </p>
                          </div>
                          <a
                            href={service.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        </div>

                        <div className="grid md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">{t('money_transfer_commission')}</p>
                            <p className="text-lg font-bold text-gray-900">
                              ${result.commission.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">{t('money_transfer_rate')}</p>
                            <p className="text-lg font-bold text-gray-900">
                              {result.exchangeRate.toFixed(4)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">{t('money_transfer_total_cost')}</p>
                            <p className="text-lg font-bold text-red-600">
                              ${result.totalCost.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">{t('money_transfer_received')}</p>
                            <p className="text-xl font-bold text-green-600">
                              {formatReceived(result.received)} {toCurrency}
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-600 mb-2">{t('money_transfer_features')}:</p>
                          <ul className="grid md:grid-cols-2 gap-2">
                            {(language === 'ky' ? service.featuresKy : service.features).slice(0, 3).map((feature, i) => (
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

              {/* Comparison Info */}
              {results.length > 1 && bestService && (
                <div className="mt-6 bg-blue-50 rounded-xl p-6">
                  <h3 className="font-bold text-blue-900 mb-2">
                    💡 {t('money_transfer_comparison')}
                  </h3>
                  <p className="text-blue-800">
                    {t('money_transfer_best_service')}: <strong>{bestService.serviceName}</strong>
                    <br />
                    {t('money_transfer_receive')}: <strong>{formatReceived(bestService.received)} {toCurrency}</strong>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Educational Content */}
          {(language === 'ru' || language === 'ky') && (
            <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t('money_transfer_guide_title')}
              </h2>
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {t('money_transfer_guide_subtitle1')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t('money_transfer_guide_text1')}
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {t('money_transfer_guide_subtitle2')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t('money_transfer_guide_text2')}
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {t('money_transfer_guide_subtitle3')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t('money_transfer_guide_text3')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <MoneyTransferCalculatorArticle />
    </>
  );
};

export default MoneyTransferCalculatorPage;
