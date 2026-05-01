import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CalculatorArticle, ArticleSection, ArticleSubsection, FAQItem } from './CalculatorArticle';

export const ElectricityCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();

  return (
      <CalculatorArticle lastUpdated="2026-03-23">
      <ArticleSection title={t('electricity_article_tariffs_title')}>
        <div className="space-y-3">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900">{t('electricity_article_tariff_population_title')}</h4>
            <ul className="text-sm mt-2 space-y-1">
              <li>{t('electricity_article_tariff_population_item_1')}</li>
              <li>{t('electricity_article_tariff_population_item_2')}</li>
            </ul>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900">{t('electricity_article_tariff_highland_title')}</h4>
            <ul className="text-sm mt-2 space-y-1">
              <li>{t('electricity_article_tariff_highland_item_1')}</li>
              <li>{t('electricity_article_tariff_highland_item_2')}</li>
            </ul>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900">{t('electricity_article_tariff_low_income_title')}</h4>
            <ul className="text-sm mt-2 space-y-1">
              <li>{t('electricity_article_tariff_low_income_item_1')}</li>
              <li>{t('electricity_article_tariff_low_income_item_2')}</li>
            </ul>
          </div>
        </div>
      </ArticleSection>

      <ArticleSection titleKey="electricity_calc_how_title">
        <p>
          {t('electricity_calc_how_intro')}
        </p>

        <ArticleSubsection title={t('electricity_example_title')}>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <p><strong>{t('electricity_step1_label')}</strong> {t('electricity_step1_text')}</p>
            <p className="pl-4 font-mono">700 × 1.37 = 959 {t('electricity_som')}</p>
            <p><strong>{t('electricity_step2_label')}</strong> {t('electricity_step2_text')}</p>
            <p className="pl-4 font-mono">150 × 2.60 = 390 {t('electricity_som')}</p>
            <p><strong>{t('electricity_step3_label')}</strong> {t('electricity_step3_text')}</p>
            <p className="pl-4 font-mono text-lg font-bold text-green-700">959 + 390 = 1,349 {t('electricity_som')}</p>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            {t('electricity_example_note')}
          </p>
        </ArticleSubsection>

        <ArticleSubsection title={t('electricity_avg_by_housing_title')}>
          <div className="space-y-2">
            <div className="bg-gray-50 p-3 rounded-lg flex justify-between text-sm">
              <span>{t('electricity_housing_1room')}</span>
              <strong>{t('electricity_housing_1room_kwh')}</strong>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg flex justify-between text-sm">
              <span>{t('electricity_housing_2room')}</span>
              <strong>{t('electricity_housing_2room_kwh')}</strong>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg flex justify-between text-sm">
              <span>{t('electricity_housing_3room')}</span>
              <strong>{t('electricity_housing_3room_kwh')}</strong>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg flex justify-between text-sm">
              <span>{t('electricity_housing_private')}</span>
              <strong>{t('electricity_housing_private_kwh')}</strong>
            </div>
          </div>
        </ArticleSubsection>
      </ArticleSection>

      <ArticleSection title={t('electricity_article_consumption_title')}>
        <p className="text-sm">{t('electricity_consumption_intro')}</p>
        <ul className="list-disc pl-6 space-y-2 text-sm mt-3">
          <li>{t('electricity_consumption_item_1')}</li>
          <li>{t('electricity_consumption_item_2')}</li>
          <li>{t('electricity_consumption_item_3')}</li>
          <li>{t('electricity_consumption_item_4')}</li>
        </ul>
      </ArticleSection>

      <ArticleSection titleKey="electricity_reduce_costs_title">
        <p>{t('electricity_reduce_costs_intro')}</p>
        <div className="space-y-4 mt-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-2">{t('electricity_led_title')}</h4>
            <p className="text-sm text-gray-700">
              {t('electricity_led_text')}
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-gray-900 mb-2">{t('electricity_efficient_tech_title')}</h4>
            <p className="text-sm text-gray-700">
              {t('electricity_efficient_tech_text')}
            </p>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-gray-900 mb-2">{t('electricity_insulation_title')}</h4>
            <p className="text-sm text-gray-700">
              {t('electricity_insulation_text')}
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-gray-900 mb-2">{t('electricity_multi_tariff_title')}</h4>
            <p className="text-sm text-gray-700">
              {t('electricity_multi_tariff_text')}
            </p>
          </div>
        </div>
      </ArticleSection>

      <ArticleSection title={t('electricity_article_tips_title')}>
        <ol className="list-decimal pl-6 space-y-2 text-sm">
          <li>{t('electricity_tip_1')}</li>
          <li>{t('electricity_tip_2')}</li>
          <li>{t('electricity_tip_3')}</li>
          <li>{t('electricity_tip_4')}</li>
          <li>{t('electricity_tip_5')}</li>
        </ol>
      </ArticleSection>

      <ArticleSection titleKey="electricity_meters_payment_title">
        <p>{t('electricity_meters_payment_intro')}</p>
        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📅</span>
            <div>
              <h4 className="font-semibold text-gray-900">{t('electricity_meter_deadline_title')}</h4>
              <p className="text-sm text-gray-700">
                {t('electricity_meter_deadline_text')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">💳</span>
            <div>
              <h4 className="font-semibold text-gray-900">{t('electricity_payment_methods_title')}</h4>
              <p className="text-sm text-gray-700">
                {t('electricity_payment_methods_text')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="font-semibold text-gray-900">{t('electricity_penalties_title')}</h4>
              <p className="text-sm text-gray-700">
                {t('electricity_penalties_text')}
              </p>
            </div>
          </div>
        </div>
      </ArticleSection>

      <ArticleSection title={t('electricity_article_faq_title')}>
        <div className="space-y-4">
          <FAQItem
            questionKey="electricity_faq_q1"
            answerKey="electricity_faq_a1"
          />
          <FAQItem
            questionKey="electricity_faq_q2"
            answerKey="electricity_faq_a2"
          />
          <FAQItem
            questionKey="electricity_faq_q3"
            answerKey="electricity_faq_a3"
          />
          <FAQItem
            questionKey="electricity_faq_q7"
            answerKey="electricity_faq_a7"
          />
          <FAQItem
            questionKey="electricity_faq_q8"
            answerKey="electricity_faq_a8"
          />
          <FAQItem
            questionKey="electricity_faq_q9"
            answerKey="electricity_faq_a9"
          />
        </div>
      </ArticleSection>

      <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
        <p className="font-semibold text-gray-900 text-lg">{t('electricity_footer_callout')}</p>
        <p className="mt-2 text-gray-700">{t('electricity_footer_subtitle')}</p>
      </div>
    </CalculatorArticle>
  );
};
