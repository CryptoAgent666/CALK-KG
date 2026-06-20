import React from 'react';
import { CalculatorArticle, ArticleSection, FAQItem } from './CalculatorArticle';
import { useLanguage } from '../contexts/LanguageContext';

export const TaxiTaxCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();
  return (
  <CalculatorArticle lastUpdated="2026-03-23" slug="taxi-tax">
    <ArticleSection title={t('taxitax_article_what_title')}>
      <p className="text-gray-700 leading-relaxed mb-4">
        {t('taxitax_article_what_intro')}
      </p>
      <p className="text-gray-700 leading-relaxed">
        {t('taxitax_article_legal_note')}
      </p>
    </ArticleSection>

    <ArticleSection title={t('taxitax_article_tax_title')}>
      <div className="bg-yellow-50 p-4 rounded-lg mb-4">
        <p className="text-sm font-semibold mb-3">{t('taxitax_options_title')}</p>
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-sm">{t('taxitax_patent_title')}</h4>
            <p className="text-xs text-gray-600">{t('taxitax_patent_desc')}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm">{t('taxitax_single_title')}</h4>
            <p className="text-xs text-gray-600">{t('taxitax_single_desc')}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm">{t('taxitax_ort_title')}</h4>
            <p className="text-xs text-gray-600">{t('taxitax_ort_desc')}</p>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600">{t('taxitax_recommendation')}</p>
    </ArticleSection>

    <ArticleSection title={t('taxitax_article_comparison_title')}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">{t('taxitax_table_income')}</th>
              <th className="p-2 text-left">{t('taxitax_table_patent')}</th>
              <th className="p-2 text-left">{t('taxitax_table_single')}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">{t('taxitax_income_20k')}</td>
              <td className="p-2 bg-green-50">{t('taxitax_income_20k_patent')}</td>
              <td className="p-2">{t('taxitax_income_20k_single')}</td>
            </tr>
            <tr className="border-b">
              <td className="p-2">{t('taxitax_income_40k')}</td>
              <td className="p-2">{t('taxitax_income_40k_patent')}</td>
              <td className="p-2 bg-green-50">{t('taxitax_income_40k_single')}</td>
            </tr>
            <tr>
              <td className="p-2">{t('taxitax_income_60k')}</td>
              <td className="p-2">{t('taxitax_income_60k_patent')}</td>
              <td className="p-2 bg-green-50">{t('taxitax_income_60k_single')}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </ArticleSection>

    <ArticleSection title={t('taxitax_article_registration_title')}>
      <p className="text-gray-700 mb-3">{t('taxitax_registration_intro')}</p>
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <span className="bg-yellow-100 text-yellow-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
          <p className="text-sm text-gray-700">{t('taxitax_reg_step_1')}</p>
        </div>
        <div className="flex items-start space-x-3">
          <span className="bg-yellow-100 text-yellow-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
          <p className="text-sm text-gray-700">{t('taxitax_reg_step_2')}</p>
        </div>
        <div className="flex items-start space-x-3">
          <span className="bg-yellow-100 text-yellow-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
          <p className="text-sm text-gray-700">{t('taxitax_reg_step_3')}</p>
        </div>
      </div>
    </ArticleSection>

    <ArticleSection title={t('taxitax_article_faq_title')}>
      <div className="space-y-4">
        <FAQItem questionKey="taxitax_faq_q1" answerKey="taxitax_faq_a1" />
        <FAQItem questionKey="taxitax_faq_q2" answerKey="taxitax_faq_a2" />
        <FAQItem questionKey="taxitax_faq_q3" answerKey="taxitax_faq_a3" />
        <FAQItem questionKey="taxitax_faq_q4" answerKey="taxitax_faq_a4" />
        <FAQItem questionKey="taxitax_faq_q5" answerKey="taxitax_faq_a5" />
      </div>
    </ArticleSection>

    <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
      <p className="text-sm text-gray-600 mb-2">{t('taxitax_sources_label')}</p>
      <p className="text-xs text-gray-500">{t('taxitax_updated')}</p>
    </div>
  </CalculatorArticle>
  );
};
