import React from 'react';
import { CalculatorArticle, ArticleSection, FAQItem } from './CalculatorArticle';
import { useLanguage } from '../contexts/LanguageContext';

export const AlimonyCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();
  return (
  <CalculatorArticle lastUpdated="2026-03-23" slug="alimony">
    <ArticleSection title={t('alimony_article_what_title')}>
      <p className="text-gray-700 leading-relaxed mb-4">
        {t('alimony_article_what_intro')}
      </p>
      <p className="text-gray-700 leading-relaxed">
        {t('alimony_article_legal_basis')}
      </p>
    </ArticleSection>

    <ArticleSection title={t('alimony_article_amount_title')}>
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <p className="text-sm font-semibold mb-2">{t('alimony_from_income')}</p>
        <ul className="text-sm space-y-2">
          <li><strong>{t('alimony_1_child')}</strong> {t('alimony_1_child_percent')}</li>
          <li><strong>{t('alimony_2_children')}</strong> {t('alimony_2_children_percent')}</li>
          <li><strong>{t('alimony_3_children')}</strong> {t('alimony_3_children_percent')}</li>
        </ul>
      </div>
      <p className="text-sm text-gray-600">{t('alimony_minimum_note')}</p>
    </ArticleSection>

    <ArticleSection title={t('alimony_article_fixed_title')}>
      <p className="text-gray-700 mb-3">{t('alimony_fixed_intro')}</p>
      <div className="bg-amber-50 p-4 rounded-lg">
        <ul className="text-sm space-y-2">
          <li>{t('alimony_fixed_case_1')}</li>
          <li>{t('alimony_fixed_case_2')}</li>
          <li>{t('alimony_fixed_case_3')}</li>
        </ul>
      </div>
    </ArticleSection>

    <ArticleSection title={t('alimony_article_procedure_title')}>
      <p className="text-gray-700 mb-3">{t('alimony_procedure_intro')}</p>
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <span className="bg-red-100 text-red-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
          <p className="text-sm text-gray-700">{t('alimony_step_1')}</p>
        </div>
        <div className="flex items-start space-x-3">
          <span className="bg-red-100 text-red-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
          <p className="text-sm text-gray-700">{t('alimony_step_2')}</p>
        </div>
        <div className="flex items-start space-x-3">
          <span className="bg-red-100 text-red-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
          <p className="text-sm text-gray-700">{t('alimony_step_3')}</p>
        </div>
        <div className="flex items-start space-x-3">
          <span className="bg-red-100 text-red-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
          <p className="text-sm text-gray-700">{t('alimony_step_4')}</p>
        </div>
      </div>
    </ArticleSection>

    <ArticleSection title={t('alimony_article_examples_title')}>
      <div className="space-y-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">{t('alimony_example_1_title')}</h4>
          <p className="text-sm">{t('alimony_example_1_desc')}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">{t('alimony_example_2_title')}</h4>
          <p className="text-sm">{t('alimony_example_2_desc')}</p>
        </div>
      </div>
    </ArticleSection>

    <ArticleSection title={t('alimony_article_faq_title')}>
      <div className="space-y-4">
        <FAQItem questionKey="alimony_faq_q1" answerKey="alimony_faq_a1" />
        <FAQItem questionKey="alimony_faq_q2" answerKey="alimony_faq_a2" />
        <FAQItem questionKey="alimony_faq_q3" answerKey="alimony_faq_a3" />
        <FAQItem questionKey="alimony_faq_q4" answerKey="alimony_faq_a4" />
        <FAQItem questionKey="alimony_faq_q5" answerKey="alimony_faq_a5" />
      </div>
    </ArticleSection>

    <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
      <p className="text-sm text-gray-600 mb-2">{t('alimony_sources_label')}</p>
      <p className="text-xs text-gray-500">{t('alimony_updated')}</p>
    </div>
  </CalculatorArticle>
  );
};
