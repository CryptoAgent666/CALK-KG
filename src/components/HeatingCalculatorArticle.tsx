import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CalculatorArticle, ArticleSection, ArticleSubsection, FAQItem } from './CalculatorArticle';

export const HeatingCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();

  return (
      <CalculatorArticle lastUpdated="2026-03-23">
      <ArticleSection title={t('heating_article_what_title')}>
        <p className="text-gray-700 leading-relaxed mb-4">
          {t('heating_article_what_intro')}
        </p>
        <p className="text-gray-700 leading-relaxed">
          {t('heating_article_season_note')}
        </p>
      </ArticleSection>

      <ArticleSection title={t('heating_article_tariffs_title')}>
        <div className="bg-orange-50 p-4 rounded-lg mb-4">
          <p className="text-sm font-semibold mb-3">{t('heating_provider')}</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{t('heating_central')}</span>
              <strong>{t('heating_central_rate')}</strong>
            </div>
            <div className="flex justify-between">
              <span>{t('heating_consumption_rate')}</span>
              <strong>{t('heating_consumption_value')}</strong>
            </div>
          </div>
        </div>
      </ArticleSection>

      {/* Пример расчёта */}
      <ArticleSection title={t('heating_example_title')}>
        <p>{t('heating_example_intro')}</p>

        <ArticleSubsection title={t('heating_example_2room_title')}>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <p><strong>{t('heating_example_2room_area')}</strong></p>
            <p><strong>{t('heating_example_2room_norm')}</strong></p>
            <p><strong>{t('heating_example_2room_tariff')}</strong></p>
            <p><strong>{t('heating_example_2room_calc')}</strong></p>
            <p className="pl-4 font-mono">{t('heating_example_2room_volume')}</p>
            <p className="pl-4 font-mono">{t('heating_example_2room_cost')}</p>
            <p className="text-lg font-bold text-green-700">{t('heating_example_2room_total')}</p>
          </div>
        </ArticleSubsection>

        <ArticleSubsection title={t('heating_example_3room_title')}>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <p><strong>{t('heating_example_3room_area')}</strong></p>
            <p><strong>{t('heating_example_3room_calc')}</strong></p>
            <p className="pl-4 font-mono">{t('heating_example_3room_volume')}</p>
            <p className="pl-4 font-mono">{t('heating_example_3room_cost')}</p>
            <p className="text-lg font-bold text-green-700">{t('heating_example_3room_total')}</p>
          </div>
        </ArticleSubsection>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>{t('heating_example_season_note')}</strong>
          </p>
        </div>
      </ArticleSection>

      <ArticleSection title={t('heating_article_cost_title')}>
        <p className="text-gray-700 mb-3">{t('heating_cost_by_size_intro')}</p>
        <div className="space-y-2">
          <div className="bg-gray-50 p-3 rounded-lg flex justify-between text-sm">
            <span>{t('heating_1_room')}</span>
            <strong>{t('heating_1_room_cost')}</strong>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg flex justify-between text-sm">
            <span>{t('heating_2_rooms')}</span>
            <strong>{t('heating_2_rooms_cost')}</strong>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg flex justify-between text-sm">
            <span>{t('heating_3_rooms')}</span>
            <strong>{t('heating_3_rooms_cost')}</strong>
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-600">{t('heating_season_duration')}</p>
      </ArticleSection>

      {/* Горячая вода */}
      <ArticleSection title={t('heating_hot_water_title')}>
        <p>{t('heating_hot_water_intro')}</p>
        <div className="mt-3 space-y-3">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">{t('heating_hot_water_meter_title')}</h4>
            <ul className="text-sm space-y-1">
              <li>{t('heating_hot_water_meter_tariff')}</li>
              <li>{t('heating_hot_water_meter_avg')}</li>
              <li>{t('heating_hot_water_meter_cost')}</li>
            </ul>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">{t('heating_hot_water_norm_title')}</h4>
            <ul className="text-sm space-y-1">
              <li>{t('heating_hot_water_norm_rate')}</li>
              <li>{t('heating_hot_water_norm_family')}</li>
              <li>{t('heating_hot_water_norm_saving')}</li>
            </ul>
          </div>
        </div>
      </ArticleSection>

      {/* Как снизить расходы */}
      <ArticleSection title={t('heating_reduce_title')}>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🪟</span>
            <div>
              <h4 className="font-semibold text-gray-900">{t('heating_reduce_windows_title')}</h4>
              <p className="text-sm text-gray-700">
                {t('heating_reduce_windows_desc')}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🌡️</span>
            <div>
              <h4 className="font-semibold text-gray-900">{t('heating_reduce_reflectors_title')}</h4>
              <p className="text-sm text-gray-700">
                {t('heating_reduce_reflectors_desc')}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔧</span>
            <div>
              <h4 className="font-semibold text-gray-900">{t('heating_reduce_flush_title')}</h4>
              <p className="text-sm text-gray-700">
                {t('heating_reduce_flush_desc')}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <h4 className="font-semibold text-gray-900">{t('heating_reduce_meter_title')}</h4>
              <p className="text-sm text-gray-700">
                {t('heating_reduce_meter_desc')}
              </p>
            </div>
          </div>
        </div>
      </ArticleSection>

      <ArticleSection title={t('heating_article_alternatives_title')}>
        <p className="text-gray-700 mb-3">{t('heating_alternatives_intro')}</p>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-semibold text-sm mb-1">{t('heating_alt_gas')}</h4>
            <p className="text-xs text-gray-600">{t('heating_alt_gas_desc')}</p>
          </div>
          <div className="bg-amber-50 p-3 rounded-lg">
            <h4 className="font-semibold text-sm mb-1">{t('heating_alt_electric')}</h4>
            <p className="text-xs text-gray-600">{t('heating_alt_electric_desc')}</p>
          </div>
        </div>
      </ArticleSection>

      <ArticleSection title={t('heating_article_faq_title')}>
        <div className="space-y-4">
          <FAQItem questionKey="heating_faq_q1" answerKey="heating_faq_a1" />
          <FAQItem questionKey="heating_faq_q2" answerKey="heating_faq_a2" />
          <FAQItem questionKey="heating_faq_q3" answerKey="heating_faq_a3" />
          <FAQItem questionKey="heating_faq_q4" answerKey="heating_faq_a4" />
          <FAQItem questionKey="heating_faq_q5" answerKey="heating_faq_a5" />
          <FAQItem
            question={t('heating_faq_q6')}
            answer={
              <>
                <p>{t('heating_faq_a6_intro')}</p>
                <ol className="list-decimal pl-6 mt-2 space-y-1 text-sm">
                  <li>{t('heating_faq_a6_step1')}</li>
                  <li>{t('heating_faq_a6_step2')}</li>
                  <li>{t('heating_faq_a6_step3')}</li>
                  <li>{t('heating_faq_a6_step4')}</li>
                  <li>{t('heating_faq_a6_step5')}</li>
                </ol>
              </>
            }
          />
        </div>
      </ArticleSection>

      <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
        <p className="text-sm text-gray-600 mb-2">{t('heating_sources_label')}</p>
        <p className="text-xs text-gray-500">{t('heating_updated')}</p>
      </div>
    </CalculatorArticle>
  );
};
