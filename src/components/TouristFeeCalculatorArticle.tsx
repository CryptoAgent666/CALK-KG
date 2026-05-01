import React from 'react';
import { CalculatorArticle, ArticleSection, FAQItem } from './CalculatorArticle';
import { useLanguage } from '../contexts/LanguageContext';

export const TouristFeeCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();
  return (
  <CalculatorArticle lastUpdated="2026-03-23">
    <ArticleSection title={t('touristfee_article_what_title')}>
      <p className="text-gray-700 leading-relaxed mb-4">
        {t('touristfee_article_what_intro')}
      </p>
      <p className="text-gray-700 leading-relaxed">
        {t('touristfee_article_legal_basis')}
      </p>
    </ArticleSection>

    <ArticleSection title={t('touristfee_article_fee_title')}>
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <p className="text-sm font-semibold mb-3">{t('touristfee_rates_title')}</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>{t('touristfee_issykkul_adults')}</span>
            <strong>{t('touristfee_issykkul_adults_cost')}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t('touristfee_issykkul_children')}</span>
            <strong>{t('touristfee_issykkul_children_cost')}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t('touristfee_other_regions')}</span>
            <strong>{t('touristfee_other_regions_cost')}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t('touristfee_children_under_7')}</span>
            <strong>{t('touristfee_children_under_7_cost')}</strong>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600">{t('touristfee_payment_note')}</p>
    </ArticleSection>

    <ArticleSection title={t('touristfee_article_exemptions_title')}>
      <p className="text-gray-700 mb-3">{t('touristfee_exemptions_intro')}</p>
      <ul className="list-disc pl-6 space-y-2 text-sm">
        <li>{t('touristfee_exemption_1')}</li>
        <li>{t('touristfee_exemption_2')}</li>
        <li>{t('touristfee_exemption_3')}</li>
        <li>{t('touristfee_exemption_4')}</li>
      </ul>
    </ArticleSection>

    <ArticleSection title={t('touristfee_article_procedure_title')}>
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
          <p className="text-sm text-gray-700">{t('touristfee_proc_step_1')}</p>
        </div>
        <div className="flex items-start space-x-3">
          <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
          <p className="text-sm text-gray-700">{t('touristfee_proc_step_2')}</p>
        </div>
        <div className="flex items-start space-x-3">
          <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
          <p className="text-sm text-gray-700">{t('touristfee_proc_step_3')}</p>
        </div>
      </div>
    </ArticleSection>

    <ArticleSection title={t('touristfee_article_faq_title')}>
      <div className="space-y-4">
        <FAQItem questionKey="touristfee_faq_q1" answerKey="touristfee_faq_a1" />
        <FAQItem questionKey="touristfee_faq_q2" answerKey="touristfee_faq_a2" />
        <FAQItem questionKey="touristfee_faq_q3" answerKey="touristfee_faq_a3" />
        <FAQItem questionKey="touristfee_faq_q4" answerKey="touristfee_faq_a4" />
        <FAQItem questionKey="touristfee_faq_q5" answerKey="touristfee_faq_a5" />
      </div>
    </ArticleSection>

    <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
      <p className="text-sm text-gray-600 mb-2">{t('touristfee_sources_label')}</p>
      <p className="text-xs text-gray-500">{t('touristfee_updated')}</p>
    </div>
  </CalculatorArticle>
  );
};
