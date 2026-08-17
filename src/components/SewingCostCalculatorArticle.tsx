import React from 'react';
import { CalculatorArticle, ArticleSection, FAQItem } from './CalculatorArticle';
import { useLanguage } from '../contexts/LanguageContext';

export const SewingCostCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();
  return (
  <CalculatorArticle lastUpdated="2026-03-23" slug="sewing-cost">
    <ArticleSection title={t('sewingcost_article_what_title')}>
      <p className="text-gray-700 leading-relaxed mb-4">
        {t('sewingcost_article_what_intro')}
      </p>
      <p className="text-gray-700 leading-relaxed">
        {t('sewingcost_article_components_note')}
      </p>
    </ArticleSection>

    <ArticleSection title={t('sewingcost_article_cost_title')}>
      <div className="bg-purple-50 p-4 rounded-lg mb-4">
        <p className="text-sm font-semibold mb-3">{t('sewingcost_components_title')}</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>{t('sewingcost_fabric')}</span>
            <strong>{t('sewingcost_fabric_cost')}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t('sewingcost_accessories')}</span>
            <strong>{t('sewingcost_accessories_cost')}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t('sewingcost_labor')}</span>
            <strong>{t('sewingcost_labor_cost')}</strong>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600">{t('sewingcost_markup_note')}</p>
    </ArticleSection>

    <ArticleSection title={t('sewingcost_article_formula_title')}>
      <p className="text-gray-700 mb-3">{t('sewingcost_formula_intro')}</p>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm font-mono">{t('sewingcost_formula')}</p>
      </div>
    </ArticleSection>

    <ArticleSection title={t('sewingcost_article_examples_title')}>
      <div className="space-y-4">
        <div className="bg-pink-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">{t('sewingcost_example_1_title')}</h4>
          <p className="text-sm">{t('sewingcost_example_1_desc')}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">{t('sewingcost_example_2_title')}</h4>
          <p className="text-sm">{t('sewingcost_example_2_desc')}</p>
        </div>
      </div>
    </ArticleSection>

    <ArticleSection title={t('sewingcost_article_where_to_buy_title')}>
      <p className="text-gray-700 mb-3">{t('sewingcost_where_intro')}</p>
      <div className="space-y-2">
        <div className="flex items-start space-x-3">
          <span className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></span>
          <p className="text-sm text-gray-700">{t('sewingcost_where_1')}</p>
        </div>
        <div className="flex items-start space-x-3">
          <span className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></span>
          <p className="text-sm text-gray-700">{t('sewingcost_where_2')}</p>
        </div>
        <div className="flex items-start space-x-3">
          <span className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></span>
          <p className="text-sm text-gray-700">{t('sewingcost_where_3')}</p>
        </div>
      </div>
    </ArticleSection>

    <ArticleSection title={t('sewingcost_article_faq_title')}>
      <div className="space-y-4">
        <FAQItem questionKey="sewingcost_faq_q1" answerKey="sewingcost_faq_a1" />
        <FAQItem questionKey="sewingcost_faq_q2" answerKey="sewingcost_faq_a2" />
        <FAQItem questionKey="sewingcost_faq_q3" answerKey="sewingcost_faq_a3" />
        <FAQItem questionKey="sewingcost_faq_q4" answerKey="sewingcost_faq_a4" />
      </div>
    </ArticleSection>

    <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
      <p className="text-sm text-gray-600 mb-2">{t('sewingcost_sources_label')}</p>
    </div>
  </CalculatorArticle>
  );
};
