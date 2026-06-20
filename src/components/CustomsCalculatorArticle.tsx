import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CalculatorArticle, ArticleSection, FAQItem } from './CalculatorArticle';

export const CustomsCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();
  
  return (
      <CalculatorArticle lastUpdated="2026-03-23" slug="customs">
      <ArticleSection title={t('customs_article_duties_title')}>
        <p className="text-sm mb-3">{t('customs_article_intro')}</p>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">{t('customs_article_cars_title')}</h4>
          <ul className="text-sm space-y-1">
            <li>{t('customs_article_cars_item_1')}</li>
            <li>{t('customs_article_cars_item_2')}</li>
          </ul>
        </div>
        <div className="bg-green-50 p-4 rounded-lg mt-3">
          <h4 className="font-semibold mb-2">{t('customs_article_electric_title')}</h4>
          <p className="text-sm"><strong>{t('customs_article_electric_highlight')}</strong> {t('customs_article_electric_text')}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg mt-3">
          <h4 className="font-semibold mb-2">{t('customs_article_hybrid_title')}</h4>
          <p className="text-sm">{t('customs_article_hybrid_text')}</p>
        </div>
      </ArticleSection>

      <ArticleSection title={t('customs_article_example_title')}>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
          <p><strong>{t('customs_example_1_label')}</strong> {t('customs_example_1_value')}</p>
          <p><strong>{t('customs_example_2_label')}</strong> {t('customs_example_2_value')}</p>
          <p><strong>{t('customs_example_3_label')}</strong> {t('customs_example_3_value')}</p>
          <p><strong>{t('customs_example_4_label')}</strong> {t('customs_example_4_value')}</p>
          <p className="text-lg font-bold text-red-600 mt-3">{t('customs_example_total')}</p>
          <p className="text-xs text-gray-600">
            {t('customs_example_total_cost_prefix')} <strong>{t('customs_example_total_cost_value')}</strong>
          </p>
        </div>
      </ArticleSection>

      <ArticleSection title={t('customs_article_faq_title')}>
        <div className="space-y-4">
          <FAQItem 
            question={t('customs_faq_q1')}
            answer={t('customs_faq_a1')}
          />
          <FAQItem 
            question={t('customs_faq_q2')}
            answer={t('customs_faq_a2')}
          />
          <FAQItem 
            question={t('customs_faq_q3')}
            answer={t('customs_faq_a3')}
          />
        </div>
      </ArticleSection>

      <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
        <p className="font-semibold text-gray-900 text-lg">{t('customs_footer_callout')}</p>
      </div>
    </CalculatorArticle>
  );
};
