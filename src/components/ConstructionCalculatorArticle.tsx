import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CalculatorArticle, ArticleSection, FAQItem } from './CalculatorArticle';

export const ConstructionCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();

  return (
      <CalculatorArticle lastUpdated="2026-03-23" slug="construction">
      <ArticleSection title={t('construction_article_prices_title')}>
        <p>{t('construction_prices_intro')}</p>
        <div className="grid md:grid-cols-2 gap-3 mt-4 text-sm">
          <div className="bg-orange-50 p-3 rounded-lg"><strong>{t('construction_brick_red')}</strong> {t('construction_brick_red_price')}</div>
          <div className="bg-orange-50 p-3 rounded-lg"><strong>{t('construction_brick_silicate')}</strong> {t('construction_brick_silicate_price')}</div>
          <div className="bg-gray-100 p-3 rounded-lg"><strong>{t('construction_cement_m400')}</strong> {t('construction_cement_m400_price')}</div>
          <div className="bg-gray-100 p-3 rounded-lg"><strong>{t('construction_cement_m500')}</strong> {t('construction_cement_m500_price')}</div>
          <div className="bg-yellow-50 p-3 rounded-lg"><strong>{t('construction_sand')}</strong> {t('construction_sand_price')}</div>
          <div className="bg-blue-50 p-3 rounded-lg"><strong>{t('construction_gravel')}</strong> {t('construction_gravel_price')}</div>
          <div className="bg-red-50 p-3 rounded-lg"><strong>{t('construction_rebar')}</strong> {t('construction_rebar_price')}</div>
          <div className="bg-green-50 p-3 rounded-lg"><strong>{t('construction_foam_block')}</strong> {t('construction_foam_block_price')}</div>
        </div>
      </ArticleSection>

      <ArticleSection title={t('construction_article_calculation_title')}>
        <p><strong>{t('construction_brick_norm_title')}</strong></p>
        <ul className="list-disc pl-6 space-y-2 mt-2 text-sm">
          <li><strong>{t('construction_wall_05')}</strong> {t('construction_wall_05_details')}</li>
          <li><strong>{t('construction_wall_1')}</strong> {t('construction_wall_1_details')}</li>
          <li><strong>{t('construction_wall_15')}</strong> {t('construction_wall_15_details')}</li>
          <li><strong>{t('construction_wall_2')}</strong> {t('construction_wall_2_details')}</li>
        </ul>
        <p className="mt-3 text-sm"><strong>{t('construction_example')}</strong> {t('construction_example_text')} <strong>1,224 {t('construction_example_result')}</strong></p>
      </ArticleSection>

      <ArticleSection title={t('construction_article_faq_title')}>
        <div className="space-y-4">
          <FAQItem 
            question={t('construction_faq_q1')}
            answer={t('construction_faq_a1')}
          />
          <FAQItem 
            question={t('construction_faq_q2')}
            answer={t('construction_faq_a2')}
          />
          <FAQItem 
            question={t('construction_faq_q3')}
            answer={t('construction_faq_a3')}
          />
          <FAQItem 
            question={t('construction_faq_q4')}
            answer={t('construction_faq_a4')}
          />
        </div>
      </ArticleSection>

      <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
        <p className="font-semibold text-gray-900 text-lg">{t('construction_footer_title')}</p>
        <p className="mt-2 text-gray-700">{t('construction_footer_desc')}</p>
      </div>
    </CalculatorArticle>
  );
};
