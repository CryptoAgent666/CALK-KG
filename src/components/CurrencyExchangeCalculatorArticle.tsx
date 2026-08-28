import React from 'react';
import { CalculatorArticle, ArticleSection, FAQItem } from './CalculatorArticle';
import { useLanguage } from '../contexts/LanguageContext';

export const CurrencyExchangeCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();
  return (
  <CalculatorArticle lastUpdated="2026-08-29" slug="currency-exchange">
    <ArticleSection title={t('currency_article_what_title')}>
      <p className="text-gray-700 leading-relaxed mb-4">
        {t('currency_article_what_intro')}
      </p>
      <p className="text-gray-700 leading-relaxed">
        {t('currency_article_source_note')}
      </p>
    </ArticleSection>

    <ArticleSection title={t('currency_article_exchange_title')}>
      <div className="bg-green-50 p-4 rounded-lg mb-4">
        <p className="text-sm font-semibold mb-3">{t('currency_typical_rates')}</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>USD {t('currency_dollar')}</span>
            <strong>{t('currency_usd_rate')}</strong>
          </div>
          <div className="flex justify-between">
            <span>EUR {t('currency_euro')}</span>
            <strong>{t('currency_eur_rate')}</strong>
          </div>
          <div className="flex justify-between">
            <span>RUB {t('currency_ruble')}</span>
            <strong>{t('currency_rub_rate')}</strong>
          </div>
          <div className="flex justify-between">
            <span>KZT {t('currency_tenge')}</span>
            <strong>{t('currency_kzt_rate')}</strong>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600">{t('currency_rates_update_note')}</p>
    </ArticleSection>

    <ArticleSection title={t('currency_article_where_title')}>
      <p className="text-gray-700 mb-3">{t('currency_where_intro')}</p>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-semibold text-sm mb-1">{t('currency_where_banks')}</h4>
          <p className="text-xs text-gray-600">{t('currency_where_banks_desc')}</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <h4 className="font-semibold text-sm mb-1">{t('currency_where_exchangers')}</h4>
          <p className="text-xs text-gray-600">{t('currency_where_exchangers_desc')}</p>
        </div>
      </div>
    </ArticleSection>

    <ArticleSection title={t('currency_article_tips_title')}>
      <p className="text-gray-700 mb-3">{t('currency_tips_intro')}</p>
      <ul className="list-disc pl-6 space-y-2 text-sm">
        <li>{t('currency_tip_1')}</li>
        <li>{t('currency_tip_2')}</li>
        <li>{t('currency_tip_3')}</li>
        <li>{t('currency_tip_4')}</li>
      </ul>
    </ArticleSection>

    <ArticleSection title={t('currency_article_faq_title')}>
      <div className="space-y-4">
        <FAQItem questionKey="currency_faq_q1" answerKey="currency_faq_a1" />
        <FAQItem questionKey="currency_faq_q2" answerKey="currency_faq_a2" />
        <FAQItem questionKey="currency_faq_q3" answerKey="currency_faq_a3" />
        <FAQItem questionKey="currency_faq_q4" answerKey="currency_faq_a4" />
      </div>
    </ArticleSection>

    <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
      <p className="text-sm text-gray-600 mb-2">{t('currency_sources_label')}</p>
    </div>
  </CalculatorArticle>
  );
};
