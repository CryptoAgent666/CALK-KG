import React from 'react';
import { CalculatorArticle, ArticleSection, FAQItem } from './CalculatorArticle';
import { useLanguage } from '../contexts/LanguageContext';

export const HousingCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();
  return (
  <CalculatorArticle lastUpdated="2026-03-23">
    <ArticleSection title={t('housing_article_what_title')}>
      <p className="text-gray-700 leading-relaxed mb-4">
        {t('housing_article_what_intro')}
      </p>
      <p className="text-gray-700 leading-relaxed">
        {t('housing_article_components_note')}
      </p>
    </ArticleSection>

    <ArticleSection title={t('housing_article_utilities_title')}>
      <div className="bg-orange-50 p-4 rounded-lg mb-4">
        <p className="text-sm font-semibold mb-3">{t('housing_avg_2room_title')}</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>{t('housing_electricity')}</span>
            <strong>{t('housing_electricity_cost')}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t('housing_water')}</span>
            <strong>{t('housing_water_cost')}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t('housing_heating')}</span>
            <strong>{t('housing_heating_cost')}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t('housing_gas')}</span>
            <strong>{t('housing_gas_cost')}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t('housing_garbage')}</span>
            <strong>{t('housing_garbage_cost')}</strong>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-orange-200">
          <div className="flex justify-between text-sm font-bold">
            <span>{t('housing_total_label')}</span>
            <span>{t('housing_total_cost')}</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600">{t('housing_seasonal_note')}</p>
    </ArticleSection>

    <ArticleSection title={t('housing_article_saving_title')}>
      <p className="text-gray-700 mb-3">{t('housing_saving_intro')}</p>
      <div className="space-y-2">
        <div className="flex items-start space-x-3">
          <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
          <p className="text-sm text-gray-700">{t('housing_saving_tip_1')}</p>
        </div>
        <div className="flex items-start space-x-3">
          <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
          <p className="text-sm text-gray-700">{t('housing_saving_tip_2')}</p>
        </div>
        <div className="flex items-start space-x-3">
          <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
          <p className="text-sm text-gray-700">{t('housing_saving_tip_3')}</p>
        </div>
        <div className="flex items-start space-x-3">
          <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
          <p className="text-sm text-gray-700">{t('housing_saving_tip_4')}</p>
        </div>
      </div>
    </ArticleSection>

    <ArticleSection title={t('housing_article_tariffs_title')}>
      <p className="text-gray-700 mb-3">{t('housing_tariffs_intro')}</p>
      <div className="bg-blue-50 p-4 rounded-lg">
        <ul className="space-y-2 text-sm">
          <li>{t('housing_tariff_electricity')}</li>
          <li>{t('housing_tariff_water')}</li>
          <li>{t('housing_tariff_heating')}</li>
          <li>{t('housing_tariff_gas')}</li>
        </ul>
      </div>
    </ArticleSection>

    <ArticleSection title={t('housing_article_faq_title')}>
      <div className="space-y-4">
        <FAQItem questionKey="housing_faq_q1" answerKey="housing_faq_a1" />
        <FAQItem questionKey="housing_faq_q2" answerKey="housing_faq_a2" />
        <FAQItem questionKey="housing_faq_q3" answerKey="housing_faq_a3" />
        <FAQItem questionKey="housing_faq_q4" answerKey="housing_faq_a4" />
        <FAQItem questionKey="housing_faq_q5" answerKey="housing_faq_a5" />
      </div>
    </ArticleSection>

    <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
      <p className="text-sm text-gray-600 mb-2">{t('housing_sources_label')}</p>
      <p className="text-xs text-gray-500">{t('housing_updated')}</p>
    </div>
  </CalculatorArticle>
  );
};
