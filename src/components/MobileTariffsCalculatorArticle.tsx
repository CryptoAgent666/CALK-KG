import React from 'react';
import { CalculatorArticle, ArticleSection, FAQItem } from './CalculatorArticle';
import { useLanguage } from '../contexts/LanguageContext';

export const MobileTariffsCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();
  return (
  <CalculatorArticle lastUpdated="2026-03-23">
    <ArticleSection title={t('mobiletariffs_article_what_title')}>
      <p className="text-gray-700 leading-relaxed mb-4">
        {t('mobiletariffs_article_what_intro')}
      </p>
      <p className="text-gray-700 leading-relaxed">
        {t('mobiletariffs_article_comparison_note')}
      </p>
    </ArticleSection>

    <ArticleSection title={t('mobiletariffs_article_operators_title')}>
      <div className="grid md:grid-cols-3 gap-3 mb-4">
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="font-bold text-sm mb-2">{t('mobile_beeline_name')}</h4>
          <p className="text-xs text-gray-600 mb-2">{t('mobile_beeline_desc')}</p>
          <p className="text-xs font-semibold">{t('mobile_beeline_popular')}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <h4 className="font-bold text-sm mb-2">{t('mobile_megacom_name')}</h4>
          <p className="text-xs text-gray-600 mb-2">{t('mobile_megacom_desc')}</p>
          <p className="text-xs font-semibold">{t('mobile_megacom_popular')}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-bold text-sm mb-2">{t('mobile_o_name')}</h4>
          <p className="text-xs text-gray-600 mb-2">{t('mobile_o_desc')}</p>
          <p className="text-xs font-semibold">{t('mobile_o_popular')}</p>
        </div>
      </div>
      <p className="text-sm text-gray-600">{t('mobile_avg_bill_note')}</p>
    </ArticleSection>

    <ArticleSection title={t('mobiletariffs_article_types_title')}>
      <p className="text-gray-700 mb-3">{t('mobiletariffs_types_intro')}</p>
      <div className="space-y-3">
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-semibold text-sm mb-1">{t('mobile_type_unlimited')}</h4>
          <p className="text-xs text-gray-600">{t('mobile_type_unlimited_desc')}</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <h4 className="font-semibold text-sm mb-1">{t('mobile_type_package')}</h4>
          <p className="text-xs text-gray-600">{t('mobile_type_package_desc')}</p>
        </div>
        <div className="bg-amber-50 p-3 rounded-lg">
          <h4 className="font-semibold text-sm mb-1">{t('mobile_type_prepaid')}</h4>
          <p className="text-xs text-gray-600">{t('mobile_type_prepaid_desc')}</p>
        </div>
      </div>
    </ArticleSection>

    <ArticleSection title={t('mobiletariffs_article_tips_title')}>
      <ul className="list-disc pl-6 space-y-2 text-sm">
        <li>{t('mobile_tip_1')}</li>
        <li>{t('mobile_tip_2')}</li>
        <li>{t('mobile_tip_3')}</li>
        <li>{t('mobile_tip_4')}</li>
      </ul>
    </ArticleSection>

    <ArticleSection title={t('mobiletariffs_article_faq_title')}>
      <div className="space-y-4">
        <FAQItem questionKey="mobile_faq_q1" answerKey="mobile_faq_a1" />
        <FAQItem questionKey="mobile_faq_q2" answerKey="mobile_faq_a2" />
        <FAQItem questionKey="mobile_faq_q3" answerKey="mobile_faq_a3" />
        <FAQItem questionKey="mobile_faq_q4" answerKey="mobile_faq_a4" />
      </div>
    </ArticleSection>

    <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
      <p className="text-sm text-gray-600 mb-2">{t('mobile_sources_label')}</p>
      <p className="text-xs text-gray-500">{t('mobile_updated')}</p>
    </div>
  </CalculatorArticle>
  );
};
