import React from 'react';
import { CalculatorArticle, ArticleSection, FAQItem } from './CalculatorArticle';
import { useLanguage } from '../contexts/LanguageContext';

export const PatentCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();
  return (
  <CalculatorArticle lastUpdated="2026-03-23" slug="patent">
    <ArticleSection title={t('patent_article_what_title')}>
      <p className="text-gray-700 leading-relaxed mb-4">
        {t('patent_article_what_intro')}
      </p>
      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-sm font-semibold mb-2">{t('patent_cost_range')}</p>
        <p className="text-xs text-gray-600">{t('patent_cost_factors')}</p>
      </div>
    </ArticleSection>

    <ArticleSection title={t('patent_article_types_title')}>
      <p className="text-gray-700 mb-3">{t('patent_types_intro')}</p>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">{t('patent_cat_1_title')}</h4>
          <ul className="text-xs space-y-1">
            <li>{t('patent_cat_1_ex_1')}</li>
            <li>{t('patent_cat_1_ex_2')}</li>
            <li>{t('patent_cat_1_ex_3')}</li>
          </ul>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">{t('patent_cat_2_title')}</h4>
          <ul className="text-xs space-y-1">
            <li>{t('patent_cat_2_ex_1')}</li>
            <li>{t('patent_cat_2_ex_2')}</li>
            <li>{t('patent_cat_2_ex_3')}</li>
          </ul>
        </div>
      </div>
    </ArticleSection>

    <ArticleSection title={t('patent_article_calculation_title')}>
      <p className="text-gray-700 mb-3">{t('patent_calculation_intro')}</p>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm font-mono">{t('patent_formula')}</p>
      </div>
      <ul className="list-disc pl-6 space-y-2 text-sm mt-3">
        <li>{t('patent_factor_1')}</li>
        <li>{t('patent_factor_2')}</li>
        <li>{t('patent_factor_3')}</li>
      </ul>
    </ArticleSection>

    <ArticleSection title={t('patent_article_procedure_title')}>
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
          <p className="text-sm text-gray-700">{t('patent_reg_step_1')}</p>
        </div>
        <div className="flex items-start space-x-3">
          <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
          <p className="text-sm text-gray-700">{t('patent_reg_step_2')}</p>
        </div>
        <div className="flex items-start space-x-3">
          <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
          <p className="text-sm text-gray-700">{t('patent_reg_step_3')}</p>
        </div>
      </div>
    </ArticleSection>

    <ArticleSection title={t('patent_article_faq_title')}>
      <div className="space-y-4">
        <FAQItem questionKey="patent_faq_q1" answerKey="patent_faq_a1" />
        <FAQItem questionKey="patent_faq_q2" answerKey="patent_faq_a2" />
        <FAQItem questionKey="patent_faq_q3" answerKey="patent_faq_a3" />
        <FAQItem questionKey="patent_faq_q4" answerKey="patent_faq_a4" />
        <FAQItem questionKey="patent_faq_q5" answerKey="patent_faq_a5" />
      </div>
    </ArticleSection>

    <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
      <p className="text-sm text-gray-600 mb-2">{t('patent_sources_label')}</p>
    </div>
  </CalculatorArticle>
  );
};
