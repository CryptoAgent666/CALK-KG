import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CalculatorArticle, ArticleSection, FAQItem } from './CalculatorArticle';

export const CropCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();

  return (
      <CalculatorArticle lastUpdated="2026-03-23" slug="crop-yield">
      <ArticleSection title={t('crop_article_yield_title')}>
        <p>{t('crop_yield_intro')}</p>
        <div className="grid md:grid-cols-2 gap-3 mt-4 text-sm">
          <div className="bg-yellow-50 p-3 rounded-lg"><strong>{t('crop_wheat')}</strong> {t('crop_wheat_value')}</div>
          <div className="bg-orange-50 p-3 rounded-lg"><strong>{t('crop_potato')}</strong> {t('crop_potato_value')}</div>
          <div className="bg-red-50 p-3 rounded-lg"><strong>{t('crop_tomato')}</strong> {t('crop_tomato_value')}</div>
          <div className="bg-green-50 p-3 rounded-lg"><strong>{t('crop_cucumber')}</strong> {t('crop_cucumber_value')}</div>
          <div className="bg-purple-50 p-3 rounded-lg"><strong>{t('crop_apple')}</strong> {t('crop_apple_value')}</div>
          <div className="bg-blue-50 p-3 rounded-lg"><strong>{t('crop_corn')}</strong> {t('crop_corn_value')}</div>
        </div>
        <p className="mt-3 text-sm text-gray-600"><strong>{t('crop_note')}</strong> {t('crop_note_text')}</p>
      </ArticleSection>

      <ArticleSection title={t('crop_article_regions_title')}>
        <div className="bg-gray-100 p-4 rounded-lg">
          <ul className="space-y-2 text-sm">
            <li><strong>{t('crop_region_chui')}</strong> {t('crop_region_chui_desc')}</li>
            <li><strong>{t('crop_region_issyk')}</strong> {t('crop_region_issyk_desc')}</li>
            <li><strong>{t('crop_region_jalal')}</strong> {t('crop_region_jalal_desc')}</li>
            <li><strong>{t('crop_region_osh')}</strong> {t('crop_region_osh_desc')}</li>
            <li><strong>{t('crop_region_naryn')}</strong> {t('crop_region_naryn_desc')}</li>
            <li><strong>{t('crop_region_batken')}</strong> {t('crop_region_batken_desc')}</li>
            <li><strong>{t('crop_region_talas')}</strong> {t('crop_region_talas_desc')}</li>
          </ul>
        </div>
      </ArticleSection>

      <ArticleSection title={t('crop_article_profitability_title')}>
        <div className="bg-blue-50 p-4 rounded-lg text-sm">
          <p><strong>{t('crop_example_title')}</strong></p>
          <div className="mt-3 space-y-2">
            <p><strong>{t('crop_example_income')}</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>{t('crop_example_income_1')}</li>
              <li>{t('crop_example_income_2')}</li>
              <li>{t('crop_example_income_3')}</li>
              <li><strong>{t('crop_example_income_total')}</strong></li>
            </ul>
            <p className="mt-2"><strong>{t('crop_example_expenses')}</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>{t('crop_example_expense_1')}</li>
              <li>{t('crop_example_expense_2')}</li>
              <li>{t('crop_example_expense_3')}</li>
              <li>{t('crop_example_expense_4')}</li>
              <li>{t('crop_example_expense_5')}</li>
              <li><strong>{t('crop_example_expense_total')}</strong></li>
            </ul>
            <p className="mt-3 font-bold text-green-600 text-lg">{t('crop_example_profit')}</p>
          </div>
        </div>
      </ArticleSection>

      <ArticleSection title={t('crop_article_faq_title')}>
        <div className="space-y-4">
          <FAQItem question={t('crop_faq_q1')} answer={t('crop_faq_a1')} />
          <FAQItem question={t('crop_faq_q2')} answer={t('crop_faq_a2')} />
          <FAQItem question={t('crop_faq_q3')} answer={t('crop_faq_a3')} />
        </div>
      </ArticleSection>

      <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
        <p className="font-semibold text-gray-900 text-lg">{t('crop_footer_title')}</p>
        <p className="mt-2 text-gray-700">{t('crop_footer_desc')}</p>
      </div>
    </CalculatorArticle>
  );
};
