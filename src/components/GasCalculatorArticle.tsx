import React from 'react';
import { CalculatorArticle, ArticleSection, ArticleSubsection, FAQItem } from './CalculatorArticle';
import { useLanguage } from '../contexts/LanguageContext';

export const GasCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();
  return (
  <CalculatorArticle lastUpdated="2026-03-23" slug="gas">
    <ArticleSection title={t('gas_article_what_title')}>
      <p className="text-gray-700 leading-relaxed mb-4">
        {t('gas_article_what_intro')}
      </p>
      <p className="text-gray-700 leading-relaxed">
        {t('gas_article_advantages_note')}
      </p>
    </ArticleSection>

    <ArticleSection title={t('gas_article_tariffs_title')}>
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <p className="text-sm font-semibold mb-3">{t('gas_tariffs_by_city')}</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>{t('gas_bishkek')}</span>
            <strong>{t('gas_bishkek_rate')}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t('gas_osh')}</span>
            <strong>{t('gas_osh_rate')}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t('gas_other_cities')}</span>
            <strong>{t('gas_other_cities_rate')}</strong>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600">{t('gas_avg_consumption')}</p>
    </ArticleSection>

    <ArticleSection titleKey="gas_calc_how_title">
      <p>{t('gas_calc_how_intro')}</p>

      <ArticleSubsection title={t('gas_example1_title')}>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
          <p><strong>{t('gas_example1_consumption_label')}</strong> {t('gas_example1_consumption_value')}</p>
          <p><strong>{t('gas_example1_tariff_label')}</strong> {t('gas_example1_tariff_value')}</p>
          <p><strong>{t('gas_example1_calc_label')}</strong></p>
          <p className="pl-4 font-mono">12 м³ × 14.50 = 174 {t('electricity_som')}/{t('gas_month_short')}</p>
          <p className="text-lg font-bold text-green-700">{t('gas_example1_total')}</p>
        </div>
      </ArticleSubsection>

      <ArticleSubsection title={t('gas_example2_title')}>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
          <p><strong>{t('gas_example2_area_label')}</strong> {t('gas_example2_area_value')}</p>
          <p><strong>{t('gas_example2_tariff_label')}</strong> {t('gas_example2_tariff_value')}</p>
          <p><strong>{t('gas_example2_calc_label')}</strong></p>
          <p className="pl-4 font-mono">500 м³ × 11.60 = 5,800 {t('electricity_som')}/{t('gas_month_short')}</p>
          <p className="text-lg font-bold text-green-700">{t('gas_example2_total')}</p>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {t('gas_example2_season_note')}
        </p>
      </ArticleSubsection>
    </ArticleSection>

    <ArticleSection title={t('gas_article_connection_title')}>
      <p className="text-gray-700 mb-3">{t('gas_connection_intro')}</p>
      <div className="bg-amber-50 p-4 rounded-lg">
        <ul className="space-y-2 text-sm">
          <li>{t('gas_connection_cost_range')}</li>
          <li>{t('gas_connection_payback')}</li>
          <li>{t('gas_connection_benefit')}</li>
        </ul>
      </div>
    </ArticleSection>

    <ArticleSection titleKey="gas_vs_electricity_title">
      <p>{t('gas_vs_electricity_intro')}</p>
      <div className="mt-4 space-y-3">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">{t('gas_heating_option_title')}</h4>
          <ul className="text-sm space-y-1">
            <li>{t('gas_heating_consumption')}</li>
            <li>{t('gas_heating_tariff')}</li>
            <li>{t('gas_heating_cost')}</li>
            <li>{t('gas_heating_season')}</li>
          </ul>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">{t('gas_electric_option_title')}</h4>
          <ul className="text-sm space-y-1">
            <li>{t('gas_electric_consumption')}</li>
            <li>{t('gas_electric_tariff')}</li>
            <li>{t('gas_electric_cost')}</li>
            <li>{t('gas_electric_season')}</li>
          </ul>
        </div>
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>{t('gas_comparison_conclusion_label')}</strong> {t('gas_comparison_conclusion_text')}
          </p>
        </div>
      </div>
    </ArticleSection>

    <ArticleSection title={t('gas_article_safety_title')}>
      <p className="text-gray-700 mb-3">{t('gas_safety_intro')}</p>
      <ul className="list-disc pl-6 space-y-2 text-sm">
        <li>{t('gas_safety_1')}</li>
        <li>{t('gas_safety_2')}</li>
        <li>{t('gas_safety_3')}</li>
        <li>{t('gas_safety_4')}</li>
      </ul>
    </ArticleSection>

    <ArticleSection titleKey="gas_meters_payment_title">
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📅</span>
          <div>
            <h4 className="font-semibold text-gray-900">{t('gas_meter_deadline_title')}</h4>
            <p className="text-sm text-gray-700">
              {t('gas_meter_deadline_text')}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-2xl">💳</span>
          <div>
            <h4 className="font-semibold text-gray-900">{t('gas_payment_methods_title')}</h4>
            <p className="text-sm text-gray-700">
              {t('gas_payment_methods_text')}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔧</span>
          <div>
            <h4 className="font-semibold text-gray-900">{t('gas_maintenance_title')}</h4>
            <p className="text-sm text-gray-700">
              {t('gas_maintenance_text')}
            </p>
          </div>
        </div>
      </div>
    </ArticleSection>

    <ArticleSection title={t('gas_article_faq_title')}>
      <div className="space-y-4">
        <FAQItem questionKey="gas_faq_q1" answerKey="gas_faq_a1" />
        <FAQItem questionKey="gas_faq_q2" answerKey="gas_faq_a2" />
        <FAQItem questionKey="gas_faq_q3" answerKey="gas_faq_a3" />
        <FAQItem questionKey="gas_faq_q4" answerKey="gas_faq_a4" />
        <FAQItem questionKey="gas_faq_q5" answerKey="gas_faq_a5" />
        <FAQItem questionKey="gas_faq_q6" answerKey="gas_faq_a6" />
      </div>
    </ArticleSection>

    <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
      <p className="text-sm text-gray-600 mb-2">{t('gas_sources_label')}</p>
      <p className="text-xs text-gray-500">{t('gas_updated')}</p>
    </div>
  </CalculatorArticle>
  );
};
