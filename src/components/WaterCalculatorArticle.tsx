import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CalculatorArticle, ArticleSection, ArticleSubsection, FAQItem } from './CalculatorArticle';

export const WaterCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();

  return (
      <CalculatorArticle lastUpdated="2026-03-23">
      <ArticleSection title={t('water_article_what_title')}>
        <p className="text-gray-700 leading-relaxed mb-4">
          {t('water_article_what_intro')}
        </p>
        <p className="text-gray-700 leading-relaxed">
          {t('water_article_provider_note')}
        </p>
      </ArticleSection>

      <ArticleSection title={t('water_article_tariffs_title')}>
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <p className="text-sm font-semibold mb-3">{t('water_bishkekvodokanal')}</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{t('water_cold_water')}</span>
              <strong>{t('water_cold_water_rate')}</strong>
            </div>
            <div className="flex justify-between">
              <span>{t('water_sewerage')}</span>
              <strong>{t('water_sewerage_rate')}</strong>
            </div>
            <div className="flex justify-between border-t border-blue-200 pt-2">
              <span className="font-semibold">{t('water_total_label')}</span>
              <strong>{t('water_total_rate')}</strong>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600">{t('water_avg_person_consumption')}</p>
      </ArticleSection>

      {/* Пример расчёта */}
      <ArticleSection title={t('water_example_title')}>
        <p>{t('water_example_intro')}</p>

        <ArticleSubsection title={t('water_example_meter_title')}>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <p><strong>{t('water_example_meter_family')}</strong></p>
            <p><strong>{t('water_example_meter_tariff')}</strong></p>
            <p className="pl-4">{t('water_example_meter_cold')}</p>
            <p className="pl-4">{t('water_example_meter_sewerage')}</p>
            <p><strong>{t('water_example_meter_calc')}</strong></p>
            <p className="pl-4 font-mono">{t('water_example_meter_water_calc')}</p>
            <p className="pl-4 font-mono">{t('water_example_meter_sewer_calc')}</p>
            <p className="text-lg font-bold text-green-700">{t('water_example_meter_total')}</p>
          </div>
        </ArticleSubsection>

        <ArticleSubsection title={t('water_example_norm_title')}>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <p><strong>{t('water_example_norm_standard')}</strong></p>
            <p><strong>{t('water_example_norm_family')}</strong></p>
            <p className="pl-4 font-mono">{t('water_example_norm_volume')}</p>
            <p className="pl-4 font-mono">{t('water_example_norm_water_calc')}</p>
            <p className="pl-4 font-mono">{t('water_example_norm_sewer_calc')}</p>
            <p className="text-lg font-bold text-orange-600">{t('water_example_norm_total')}</p>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {t('water_example_norm_tip')}
          </p>
        </ArticleSubsection>
      </ArticleSection>

      <ArticleSection title={t('water_article_consumption_title')}>
        <p className="text-gray-700 mb-3">{t('water_consumption_intro')}</p>
        <div className="space-y-2">
          <div className="bg-gray-50 p-3 rounded-lg flex justify-between text-sm">
            <span>{t('water_1_person')}</span>
            <strong>{t('water_1_person_cost')}</strong>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg flex justify-between text-sm">
            <span>{t('water_2_people')}</span>
            <strong>{t('water_2_people_cost')}</strong>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg flex justify-between text-sm">
            <span>{t('water_3_people')}</span>
            <strong>{t('water_3_people_cost')}</strong>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg flex justify-between text-sm">
            <span>{t('water_4_people')}</span>
            <strong>{t('water_4_people_cost')}</strong>
          </div>
        </div>
      </ArticleSection>

      {/* Установка счётчика */}
      <ArticleSection title={t('water_meter_title')}>
        <p>{t('water_meter_intro')}</p>
        <div className="mt-4 space-y-3">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-2">{t('water_meter_cost_title')}</h4>
            <p className="text-sm text-gray-700">
              {t('water_meter_cost_desc')}
            </p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-gray-900 mb-2">{t('water_meter_verification_title')}</h4>
            <p className="text-sm text-gray-700">
              {t('water_meter_verification_desc')}
            </p>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-gray-900 mb-2">{t('water_meter_contact_title')}</h4>
            <p className="text-sm text-gray-700">
              {t('water_meter_contact_desc')}
            </p>
          </div>
        </div>
      </ArticleSection>

      <ArticleSection title={t('water_article_saving_title')}>
        <p className="text-gray-700 mb-3">{t('water_saving_intro')}</p>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>{t('water_saving_tip_1')}</li>
          <li>{t('water_saving_tip_2')}</li>
          <li>{t('water_saving_tip_3')}</li>
          <li>{t('water_saving_tip_4')}</li>
          <li>{t('water_saving_tip_5')}</li>
        </ul>
      </ArticleSection>

      {/* Качество воды */}
      <ArticleSection title={t('water_quality_title')}>
        <p>{t('water_quality_intro')}</p>
        <div className="mt-3 space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🏙️</span>
            <div>
              <h4 className="font-semibold text-gray-900">{t('water_quality_bishkek_title')}</h4>
              <p className="text-sm text-gray-700">
                {t('water_quality_bishkek_desc')}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🏔️</span>
            <div>
              <h4 className="font-semibold text-gray-900">{t('water_quality_mountain_title')}</h4>
              <p className="text-sm text-gray-700">
                {t('water_quality_mountain_desc')}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔧</span>
            <div>
              <h4 className="font-semibold text-gray-900">{t('water_quality_complaints_title')}</h4>
              <p className="text-sm text-gray-700">
                {t('water_quality_complaints_desc')}
              </p>
            </div>
          </div>
        </div>
      </ArticleSection>

      <ArticleSection title={t('water_article_faq_title')}>
        <div className="space-y-4">
          <FAQItem questionKey="water_faq_q1" answerKey="water_faq_a1" />
          <FAQItem questionKey="water_faq_q2" answerKey="water_faq_a2" />
          <FAQItem questionKey="water_faq_q3" answerKey="water_faq_a3" />
          <FAQItem questionKey="water_faq_q4" answerKey="water_faq_a4" />
          <FAQItem questionKey="water_faq_q5" answerKey="water_faq_a5" />
          <FAQItem questionKey="water_faq_q6" answerKey="water_faq_a6" />
        </div>
      </ArticleSection>

      <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
        <p className="text-sm text-gray-600 mb-2">{t('water_sources_label')}</p>
        <p className="text-xs text-gray-500">{t('water_updated')}</p>
      </div>
    </CalculatorArticle>
  );
};
