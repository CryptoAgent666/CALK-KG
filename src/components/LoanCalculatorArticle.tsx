import React from 'react';
import { CalculatorArticle, ArticleSection, FAQItem } from './CalculatorArticle';
import { useLanguage } from '../contexts/LanguageContext';

export const LoanCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <CalculatorArticle lastUpdated="2026-03-23" slug="loan">
    <ArticleSection title={t('loan_article_what_title')}>
      <p className="text-gray-700 leading-relaxed mb-4">
        {t('loan_article_what_intro')}
      </p>
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm font-semibold mb-2">{t('loan_article_types_label')}</p>
        <ul className="text-sm space-y-2">
          <li><strong>{t('loan_type_consumer')}</strong> {t('loan_type_consumer_desc')}</li>
          <li><strong>{t('loan_type_express')}</strong> {t('loan_type_express_desc')}</li>
          <li><strong>{t('loan_type_secured')}</strong> {t('loan_type_secured_desc')}</li>
        </ul>
      </div>
    </ArticleSection>

    <ArticleSection title={t('loan_article_rates_title')}>
      <div className="bg-amber-50 p-4 rounded-lg mb-4">
        <p className="text-sm font-semibold mb-2">{t('loan_rates_typical')}</p>
        <ul className="text-sm space-y-2">
          <li><strong>{t('loan_rate_range')}</strong> 18-28% {t('per_year')}</li>
          <li><strong>{t('loan_term_range')}</strong> {t('loan_term_6mo_5yr')}</li>
          <li><strong>{t('loan_amount_range')}</strong> {t('loan_amount_10k_500k')}</li>
          <li><strong>{t('loan_no_collateral')}</strong> {t('loan_no_collateral_limit')}</li>
        </ul>
      </div>
      <p className="text-sm text-gray-600">{t('loan_rate_factors')}</p>
    </ArticleSection>

    <ArticleSection title={t('loan_article_formula_title')}>
      <p className="text-gray-700 mb-3">{t('loan_formula_intro')}</p>
      <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm mb-3">
        {t('loan_formula_annuity')}
      </div>
      <p className="text-sm text-gray-600">{t('loan_formula_explanation')}</p>
    </ArticleSection>

    <ArticleSection title={t('loan_article_examples_title')}>
      <div className="space-y-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">{t('loan_example_1_title')}</h4>
          <p className="text-sm">{t('loan_example_1_desc')}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">{t('loan_example_2_title')}</h4>
          <p className="text-sm">{t('loan_example_2_desc')}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">{t('loan_example_3_title')}</h4>
          <p className="text-sm">{t('loan_example_3_desc')}</p>
        </div>
      </div>
    </ArticleSection>

    <ArticleSection title={t('loan_article_documents_title')}>
      <p className="text-gray-700 mb-3">{t('loan_documents_intro')}</p>
      <ul className="list-disc pl-6 space-y-2 text-sm">
        <li>{t('loan_doc_passport')}</li>
        <li>{t('loan_doc_income')}</li>
        <li>{t('loan_doc_employment')}</li>
        <li>{t('loan_doc_social_fund')}</li>
        <li>{t('loan_doc_tin')}</li>
      </ul>
    </ArticleSection>

    <ArticleSection title={t('loan_article_faq_title')}>
      <div className="space-y-4">
        <FAQItem questionKey="loan_faq_q1" answerKey="loan_faq_a1" />
        <FAQItem questionKey="loan_faq_q2" answerKey="loan_faq_a2" />
        <FAQItem questionKey="loan_faq_q3" answerKey="loan_faq_a3" />
        <FAQItem questionKey="loan_faq_q4" answerKey="loan_faq_a4" />
        <FAQItem questionKey="loan_faq_q5" answerKey="loan_faq_a5" />
      </div>
    </ArticleSection>

    <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
      <p className="text-sm text-gray-600 mb-2">{t('loan_sources_label')}</p>
    </div>
    </CalculatorArticle>
  );
};
