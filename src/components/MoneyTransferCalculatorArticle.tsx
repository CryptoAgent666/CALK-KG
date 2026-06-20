import React from 'react';
import { CalculatorArticle, ArticleSection, FAQItem } from './CalculatorArticle';
import { useLanguage } from '../contexts/LanguageContext';

export const MoneyTransferCalculatorArticle: React.FC = () => {
  const { language, t } = useLanguage();
  
  return (
    <CalculatorArticle lastUpdated="2026-03-23" slug="money-transfer">
    <ArticleSection title={t('moneytransfer_article_what_title')}>
      <p className="text-gray-700 leading-relaxed mb-4">
        {t('moneytransfer_article_what_intro')}
      </p>
      <p className="text-gray-700 leading-relaxed">
        {t('moneytransfer_article_comparison_note')}
      </p>
    </ArticleSection>

    <ArticleSection title={t('moneytransfer_article_transfers_title')}>
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <p className="text-sm font-semibold mb-3">{t('moneytransfer_systems_title')}</p>
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-sm">{t('moneytransfer_koronapay')}</h4>
            <p className="text-xs text-gray-600">{t('moneytransfer_koronapay_desc')}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm">{t('moneytransfer_golden_crown')}</h4>
            <p className="text-xs text-gray-600">{t('moneytransfer_golden_crown_desc')}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm">{t('moneytransfer_contact')}</h4>
            <p className="text-xs text-gray-600">{t('moneytransfer_contact_desc')}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm">{t('moneytransfer_western_union')}</h4>
            <p className="text-xs text-gray-600">{t('moneytransfer_western_union_desc')}</p>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600">{t('moneytransfer_rates_note')}</p>
    </ArticleSection>

    <ArticleSection title={t('moneytransfer_article_comparison_title')}>
      <p className="text-gray-700 mb-3">{t('moneytransfer_comparison_intro')}</p>
      <div className="space-y-2">
        <div className="flex items-start space-x-3">
          <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
          <p className="text-sm text-gray-700">{t('moneytransfer_factor_1')}</p>
        </div>
        <div className="flex items-start space-x-3">
          <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
          <p className="text-sm text-gray-700">{t('moneytransfer_factor_2')}</p>
        </div>
        <div className="flex items-start space-x-3">
          <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
          <p className="text-sm text-gray-700">{t('moneytransfer_factor_3')}</p>
        </div>
        <div className="flex items-start space-x-3">
          <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
          <p className="text-sm text-gray-700">{t('moneytransfer_factor_4')}</p>
        </div>
      </div>
    </ArticleSection>

    <ArticleSection title={t('moneytransfer_article_tips_title')}>
      <ul className="list-disc pl-6 space-y-2 text-sm">
        <li>{t('moneytransfer_tip_1')}</li>
        <li>{t('moneytransfer_tip_2')}</li>
        <li>{t('moneytransfer_tip_3')}</li>
        <li>{t('moneytransfer_tip_4')}</li>
      </ul>
    </ArticleSection>

    <ArticleSection title={t('moneytransfer_article_faq_title')}>
      <div className="space-y-4">
        <FAQItem questionKey="moneytransfer_faq_q1" answerKey="moneytransfer_faq_a1" />
        <FAQItem questionKey="moneytransfer_faq_q2" answerKey="moneytransfer_faq_a2" />
        <FAQItem questionKey="moneytransfer_faq_q3" answerKey="moneytransfer_faq_a3" />
        <FAQItem questionKey="moneytransfer_faq_q4" answerKey="moneytransfer_faq_a4" />
      </div>
    </ArticleSection>

    <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
      <p className="text-sm text-gray-600 mb-2">{t('moneytransfer_sources_label')}</p>
      <p className="text-xs text-gray-500">{t('moneytransfer_updated')}</p>
    </div>
    </CalculatorArticle>
  );
};
