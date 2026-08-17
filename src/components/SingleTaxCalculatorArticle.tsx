import React from 'react';
import { CalculatorArticle, ArticleSection, ArticleSubsection, FAQItem } from './CalculatorArticle';
import { useLanguage } from '../contexts/LanguageContext';

export const SingleTaxCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();
  return (
  <CalculatorArticle lastUpdated="2026-03-23" slug="single-tax">
    <ArticleSection title={t('singletax_article_what_title')}>
      <p className="text-gray-700 leading-relaxed mb-4">
        {t('singletax_article_what_intro')}
      </p>
      <p className="text-gray-700 leading-relaxed">
        {t('singletax_article_who_eligible')}
      </p>
    </ArticleSection>

    <ArticleSection title={t('singletax_article_tax_title')}>
      <div className="bg-green-50 p-4 rounded-lg mb-4">
        <p className="text-sm font-semibold mb-3">{t('singletax_rates_by_activity')}</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>{t('singletax_trade')}</span>
            <strong>{t('singletax_trade_rate')}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t('singletax_production')}</span>
            <strong>{t('singletax_production_rate')}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t('singletax_services')}</span>
            <strong>{t('singletax_services_rate')}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t('singletax_catering')}</span>
            <strong>{t('singletax_catering_rate')}</strong>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600">{t('singletax_turnover_note')}</p>
    </ArticleSection>

    <ArticleSection title={t('singletax_detailed_examples_title')}>
      <p>{t('singletax_detailed_examples_intro')}</p>

      <ArticleSubsection title={t('singletax_example_shop_title')}>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
          <p><strong>{t('singletax_activity_type')}:</strong> {t('singletax_activity_trade')}</p>
          <p><strong>{t('singletax_monthly_revenue')}:</strong> 800,000 {t('singletax_som')}</p>
          <p><strong>{t('singletax_cash_part')}:</strong> 500,000 {t('singletax_som')} | <strong>{t('singletax_noncash_part')}:</strong> 300,000 {t('singletax_som')}</p>
          <p><strong>{t('singletax_rates_label')}:</strong></p>
          <p className="pl-4">{t('singletax_cash_rate_note')}</p>
          <p className="pl-4">{t('singletax_noncash_rate_05')}</p>
          <p><strong>{t('singletax_calculation_label')}:</strong></p>
          <p className="pl-4 font-mono">{t('singletax_calc_shop_noncash')}</p>
          <p className="text-lg font-bold text-green-700">{t('singletax_monthly_tax')}: 1,500 {t('singletax_som')}</p>
        </div>
      </ArticleSubsection>

      <ArticleSubsection title={t('singletax_example_cafe_title')}>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
          <p><strong>{t('singletax_activity_type')}:</strong> {t('singletax_activity_catering')}</p>
          <p><strong>{t('singletax_monthly_revenue')}:</strong> 1,200,000 {t('singletax_som')} ({t('singletax_all_noncash')})</p>
          <p><strong>{t('singletax_catering_noncash_rate')}:</strong> 4%</p>
          <p><strong>{t('singletax_calculation_label')}:</strong></p>
          <p className="pl-4 font-mono">1,200,000 × 4% = 48,000 {t('singletax_som')}</p>
          <p className="text-lg font-bold text-green-700">{t('singletax_monthly_tax')}: 48,000 {t('singletax_som')}</p>
        </div>
      </ArticleSubsection>

      <ArticleSubsection title={t('singletax_example_it_title')}>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
          <p><strong>{t('singletax_activity_type')}:</strong> {t('singletax_activity_services')}</p>
          <p><strong>{t('singletax_monthly_revenue')}:</strong> 500,000 {t('singletax_som')} ({t('singletax_all_noncash')})</p>
          <p><strong>{t('singletax_services_noncash_rate')}:</strong> 4%</p>
          <p><strong>{t('singletax_calculation_label')}:</strong></p>
          <p className="pl-4 font-mono">500,000 × 4% = 20,000 {t('singletax_som')}</p>
          <p className="text-lg font-bold text-green-700">{t('singletax_monthly_tax')}: 20,000 {t('singletax_som')}</p>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {t('singletax_comparison_note')}
        </p>
      </ArticleSubsection>
    </ArticleSection>

    <ArticleSection title={t('singletax_article_advantages_title')}>
      <p className="text-gray-700 mb-3">{t('singletax_advantages_intro')}</p>
      <ul className="list-disc pl-6 space-y-2 text-sm">
        <li>{t('singletax_adv_1')}</li>
        <li>{t('singletax_adv_2')}</li>
        <li>{t('singletax_adv_3')}</li>
        <li>{t('singletax_adv_4')}</li>
      </ul>
    </ArticleSection>

    <ArticleSection title={t('singletax_how_to_switch_title')}>
      <p>{t('singletax_how_to_switch_intro')}</p>
      <div className="mt-4 space-y-3">
        <div className="flex items-start gap-3">
          <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">1</span>
          <div>
            <h4 className="font-semibold text-gray-900">{t('singletax_step1_title')}</h4>
            <p className="text-sm text-gray-700">
              {t('singletax_step1_desc')}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">2</span>
          <div>
            <h4 className="font-semibold text-gray-900">{t('singletax_step2_title')}</h4>
            <p className="text-sm text-gray-700">
              {t('singletax_step2_desc')}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">3</span>
          <div>
            <h4 className="font-semibold text-gray-900">{t('singletax_step3_title')}</h4>
            <p className="text-sm text-gray-700">
              {t('singletax_step3_desc')}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">4</span>
          <div>
            <h4 className="font-semibold text-gray-900">{t('singletax_step4_title')}</h4>
            <p className="text-sm text-gray-700">
              {t('singletax_step4_desc')}
            </p>
          </div>
        </div>
      </div>
    </ArticleSection>

    <ArticleSection title={t('singletax_vs_general_title')}>
      <p>{t('singletax_vs_general_intro')}</p>
      <div className="mt-4 overflow-x-auto">
        <div className="space-y-3">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">{t('singletax_single_tax_label')}</h4>
            <ul className="text-sm space-y-1">
              <li>{t('singletax_single_rate')}</li>
              <li>{t('singletax_single_replaces')}</li>
              <li>{t('singletax_single_reporting')}</li>
              <li>{t('singletax_single_accountant')}</li>
              <li>{t('singletax_single_limit')}</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">{t('singletax_general_system_label')}</h4>
            <ul className="text-sm space-y-1">
              <li>{t('singletax_general_income_tax')}</li>
              <li>{t('singletax_general_sales_tax')}</li>
              <li>{t('singletax_general_vat')}</li>
              <li>{t('singletax_general_reporting')}</li>
              <li>{t('singletax_general_accountant')}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>{t('singletax_conclusion_label')}:</strong> {t('singletax_conclusion_text')}
        </p>
      </div>
    </ArticleSection>

    <ArticleSection title={t('singletax_article_examples_title')}>
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">{t('singletax_example_1_title')}</h4>
          <p className="text-sm">{t('singletax_example_1_desc')}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">{t('singletax_example_2_title')}</h4>
          <p className="text-sm">{t('singletax_example_2_desc')}</p>
        </div>
      </div>
    </ArticleSection>

    <ArticleSection title={t('singletax_article_faq_title')}>
      <div className="space-y-4">
        <FAQItem questionKey="singletax_faq_q1" answerKey="singletax_faq_a1" />
        <FAQItem questionKey="singletax_faq_q2" answerKey="singletax_faq_a2" />
        <FAQItem questionKey="singletax_faq_q3" answerKey="singletax_faq_a3" />
        <FAQItem questionKey="singletax_faq_q4" answerKey="singletax_faq_a4" />
        <FAQItem questionKey="singletax_faq_q5" answerKey="singletax_faq_a5" />
        <FAQItem questionKey="singletax_faq_q6" answerKey="singletax_faq_a6" />
        <FAQItem questionKey="singletax_faq_q7" answerKey="singletax_faq_a7" />
      </div>
    </ArticleSection>

    <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
      <p className="text-sm text-gray-600 mb-2">{t('singletax_sources_label')}</p>
    </div>
  </CalculatorArticle>
  );
};
