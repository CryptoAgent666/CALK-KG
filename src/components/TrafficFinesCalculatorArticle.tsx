import React from 'react';
import { CalculatorArticle, ArticleSection, FAQItem } from './CalculatorArticle';
import { useLanguage } from '../contexts/LanguageContext';

export const TrafficFinesCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();
  return (
  <CalculatorArticle lastUpdated="2026-03-23" slug="traffic-fines">
    <ArticleSection title={t('trafficfines_article_what_title')}>
      <p className="text-gray-700 leading-relaxed mb-4">
        {t('trafficfines_article_what_intro')}
      </p>
      <p className="text-gray-700 leading-relaxed">
        {t('trafficfines_article_discount_note')}
      </p>
    </ArticleSection>

    <ArticleSection title={t('trafficfines_article_fines_title')}>
      <div className="bg-red-50 p-4 rounded-lg mb-4">
        <p className="text-sm font-semibold mb-3">{t('trafficfines_popular_title')}</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>{t('trafficfines_speeding')}</span>
            <strong>{t('trafficfines_speeding_amount')}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t('trafficfines_drunk')}</span>
            <strong>{t('trafficfines_drunk_amount')}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t('trafficfines_no_insurance')}</span>
            <strong>{t('trafficfines_no_insurance_amount')}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t('trafficfines_red_light')}</span>
            <strong>{t('trafficfines_red_light_amount')}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t('trafficfines_parking')}</span>
            <strong>{t('trafficfines_parking_amount')}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t('trafficfines_phone')}</span>
            <strong>{t('trafficfines_phone_amount')}</strong>
          </div>
        </div>
      </div>
      <div className="bg-green-100 p-3 rounded-lg">
        <p className="text-sm font-semibold text-green-800">{t('trafficfines_discount_50')}</p>
      </div>
    </ArticleSection>

    <ArticleSection title={t('trafficfines_article_how_to_check_title')}>
      <p className="text-gray-700 mb-3">{t('trafficfines_check_intro')}</p>
      <div className="space-y-2">
        <div className="flex items-start space-x-3">
          <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
          <p className="text-sm text-gray-700">{t('trafficfines_check_method_1')}</p>
        </div>
        <div className="flex items-start space-x-3">
          <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
          <p className="text-sm text-gray-700">{t('trafficfines_check_method_2')}</p>
        </div>
        <div className="flex items-start space-x-3">
          <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
          <p className="text-sm text-gray-700">{t('trafficfines_check_method_3')}</p>
        </div>
      </div>
    </ArticleSection>

    <ArticleSection title={t('trafficfines_article_payment_title')}>
      <p className="text-gray-700 mb-3">{t('trafficfines_payment_intro')}</p>
      <ul className="list-disc pl-6 space-y-2 text-sm">
        <li>{t('trafficfines_payment_method_1')}</li>
        <li>{t('trafficfines_payment_method_2')}</li>
        <li>{t('trafficfines_payment_method_3')}</li>
        <li>{t('trafficfines_payment_method_4')}</li>
      </ul>
    </ArticleSection>

    <ArticleSection title={t('trafficfines_article_faq_title')}>
      <div className="space-y-4">
        <FAQItem questionKey="trafficfines_faq_q1" answerKey="trafficfines_faq_a1" />
        <FAQItem questionKey="trafficfines_faq_q2" answerKey="trafficfines_faq_a2" />
        <FAQItem questionKey="trafficfines_faq_q3" answerKey="trafficfines_faq_a3" />
        <FAQItem questionKey="trafficfines_faq_q4" answerKey="trafficfines_faq_a4" />
        <FAQItem questionKey="trafficfines_faq_q5" answerKey="trafficfines_faq_a5" />
      </div>
    </ArticleSection>

    <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
      <p className="text-sm text-gray-600 mb-2">{t('trafficfines_sources_label')}</p>
    </div>
  </CalculatorArticle>
  );
};
