import React from 'react';
import { CalculatorArticle, ArticleSection, ArticleSubsection, FAQItem } from './CalculatorArticle';
import { useLanguage } from '../contexts/LanguageContext';

export const PropertyTaxCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();
  return (
  <CalculatorArticle lastUpdated="2026-03-23" slug="property-tax">
    <ArticleSection title={t('propertytax_article_what_title')}>
      <p className="text-gray-700 leading-relaxed mb-4">
        {t('propertytax_article_what_intro')}
      </p>
      <p className="text-gray-700 leading-relaxed">
        {t('propertytax_article_legal_basis')}
      </p>
    </ArticleSection>

    <ArticleSection title={t('propertytax_article_tax_title')}>
      <div className="bg-orange-50 p-4 rounded-lg mb-4">
        <p className="text-sm font-semibold mb-3">{t('propertytax_exemption_title')}</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>{t('propertytax_exemption_apartment')}</span>
            <strong>{t('propertytax_exemption_apartment_area')}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t('propertytax_exemption_house')}</span>
            <strong>{t('propertytax_exemption_house_area')}</strong>
          </div>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <p><strong>{t('propertytax_rate_label')}</strong> {t('propertytax_rate_value')}</p>
        <p><strong>{t('propertytax_deadline_label')}</strong> {t('propertytax_deadline_value')}</p>
      </div>
    </ArticleSection>

    <ArticleSection title={t('propertytax_article_calculation_title')}>
      <p className="text-gray-700 mb-3">{t('propertytax_calculation_intro')}</p>
      <div className="bg-gray-50 p-4 rounded-lg mb-3">
        <p className="text-sm font-mono">{t('propertytax_formula')}</p>
      </div>
      <p className="text-sm text-gray-600">{t('propertytax_formula_explanation')}</p>
    </ArticleSection>

    <ArticleSection title={t('propertytax_detailed_examples_title')}>
      <p>{t('propertytax_detailed_examples_intro')}</p>

      <ArticleSubsection title={t('propertytax_example_apt65_title')}>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
          <p><strong>{t('propertytax_total_area')}:</strong> 65 {t('propertytax_sqm')}</p>
          <p><strong>{t('propertytax_exempt_area_apt')}:</strong> 20 {t('propertytax_sqm')}</p>
          <p><strong>{t('propertytax_taxable_area')}:</strong> 65 − 20 = 45 {t('propertytax_sqm')}</p>
          <p><strong>{t('propertytax_tax_rate_label')}:</strong> {t('propertytax_tax_rate_035')}</p>
          <p><strong>{t('propertytax_assessed_value_sqm_bishkek_apt')}:</strong> ~18,000 {t('propertytax_som')}</p>
          <p><strong>{t('propertytax_effective_rate_label')}:</strong> 18,000 × 0.35% = 63 {t('propertytax_som')}/{t('propertytax_sqm')}</p>
          <p><strong>{t('propertytax_calculation_label')}:</strong></p>
          <p className="pl-4 font-mono">45 {t('propertytax_sqm')} × 63 {t('propertytax_som')}/{t('propertytax_sqm')} = 2,835 {t('propertytax_som_year')}</p>
          <p className="text-lg font-bold text-green-700">{t('propertytax_annual_tax')}: ~2,835 {t('propertytax_som')}</p>
        </div>
      </ArticleSubsection>

      <ArticleSubsection title={t('propertytax_example_house150_title')}>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
          <p><strong>{t('propertytax_total_area')}:</strong> 150 {t('propertytax_sqm')}</p>
          <p><strong>{t('propertytax_exempt_area_house')}:</strong> 35 {t('propertytax_sqm')}</p>
          <p><strong>{t('propertytax_taxable_area')}:</strong> 150 − 35 = 115 {t('propertytax_sqm')}</p>
          <p><strong>{t('propertytax_assessed_value_sqm_bishkek_house')}:</strong> ~15,000 {t('propertytax_som')}</p>
          <p><strong>{t('propertytax_effective_rate_label')}:</strong> 15,000 × 0.35% = 52.5 {t('propertytax_som')}/{t('propertytax_sqm')}</p>
          <p><strong>{t('propertytax_calculation_label')}:</strong></p>
          <p className="pl-4 font-mono">115 {t('propertytax_sqm')} × 52.5 {t('propertytax_som')}/{t('propertytax_sqm')} = 6,037 {t('propertytax_som_year')}</p>
          <p className="text-lg font-bold text-green-700">{t('propertytax_annual_tax')}: ~6,037 {t('propertytax_som')}</p>
        </div>
      </ArticleSubsection>

      <ArticleSubsection title={t('propertytax_example_apt40_title')}>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
          <p><strong>{t('propertytax_total_area')}:</strong> 40 {t('propertytax_sqm')}</p>
          <p><strong>{t('propertytax_exempt_area_label')}:</strong> 20 {t('propertytax_sqm')}</p>
          <p><strong>{t('propertytax_taxable_area')}:</strong> 40 − 20 = 20 {t('propertytax_sqm')}</p>
          <p><strong>{t('propertytax_effective_rate_label')}:</strong> 18,000 × 0.35% = 63 {t('propertytax_som')}/{t('propertytax_sqm')}</p>
          <p><strong>{t('propertytax_calculation_label')}:</strong></p>
          <p className="pl-4 font-mono">20 {t('propertytax_sqm')} × 63 {t('propertytax_som')}/{t('propertytax_sqm')} = 1,260 {t('propertytax_som_year')}</p>
          <p className="text-lg font-bold text-green-700">{t('propertytax_annual_tax')}: ~1,260 {t('propertytax_som')} (~105 {t('propertytax_som_month')})</p>
        </div>
      </ArticleSubsection>
    </ArticleSection>

    <ArticleSection title={t('propertytax_article_examples_title')}>
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">{t('propertytax_example_1_title')}</h4>
          <p className="text-sm">{t('propertytax_example_1_desc')}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">{t('propertytax_example_2_title')}</h4>
          <p className="text-sm">{t('propertytax_example_2_desc')}</p>
        </div>
      </div>
    </ArticleSection>

    <ArticleSection title={t('propertytax_payment_title')}>
      <p>{t('propertytax_payment_intro')}</p>
      <div className="mt-4 space-y-3">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-2">{t('propertytax_payment_online_title')}</h4>
          <p className="text-sm text-gray-700">
            {t('propertytax_payment_online_desc')}
          </p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <h4 className="font-semibold text-gray-900 mb-2">{t('propertytax_payment_bank_title')}</h4>
          <p className="text-sm text-gray-700">
            {t('propertytax_payment_bank_desc')}
          </p>
        </div>
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
          <h4 className="font-semibold text-gray-900 mb-2">{t('propertytax_payment_deadlines_title')}</h4>
          <p className="text-sm text-gray-700">
            {t('propertytax_payment_deadlines_desc')}
          </p>
        </div>
      </div>
    </ArticleSection>

    <ArticleSection title={t('propertytax_article_benefits_title')}>
      <p className="text-gray-700 mb-3">{t('propertytax_benefits_intro')}</p>
      <ul className="list-disc pl-6 space-y-2 text-sm">
        <li>{t('propertytax_benefit_1')}</li>
        <li>{t('propertytax_benefit_2')}</li>
        <li>{t('propertytax_benefit_3')}</li>
      </ul>
    </ArticleSection>

    <ArticleSection title={t('propertytax_assessed_value_title')}>
      <p>{t('propertytax_assessed_value_intro')}</p>
      <div className="mt-3 space-y-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🏢</span>
          <div>
            <h4 className="font-semibold text-gray-900">{t('propertytax_how_determined_title')}</h4>
            <p className="text-sm text-gray-700">
              {t('propertytax_how_determined_desc')}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-2xl">📋</span>
          <div>
            <h4 className="font-semibold text-gray-900">{t('propertytax_how_find_title')}</h4>
            <p className="text-sm text-gray-700">
              {t('propertytax_how_find_desc')}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚖️</span>
          <div>
            <h4 className="font-semibold text-gray-900">{t('propertytax_disagree_title')}</h4>
            <p className="text-sm text-gray-700">
              {t('propertytax_disagree_desc')}
            </p>
          </div>
        </div>
      </div>
    </ArticleSection>

    <ArticleSection title={t('propertytax_article_faq_title')}>
      <div className="space-y-4">
        <FAQItem questionKey="propertytax_faq_q1" answerKey="propertytax_faq_a1" />
        <FAQItem questionKey="propertytax_faq_q2" answerKey="propertytax_faq_a2" />
        <FAQItem questionKey="propertytax_faq_q3" answerKey="propertytax_faq_a3" />
        <FAQItem questionKey="propertytax_faq_q4" answerKey="propertytax_faq_a4" />
        <FAQItem questionKey="propertytax_faq_q5" answerKey="propertytax_faq_a5" />
        <FAQItem questionKey="propertytax_faq_q6" answerKey="propertytax_faq_a6" />
        <FAQItem questionKey="propertytax_faq_q7" answerKey="propertytax_faq_a7" />
      </div>
    </ArticleSection>

    <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
      <p className="text-sm text-gray-600 mb-2">{t('propertytax_sources_label')}</p>
      <p className="text-xs text-gray-500">{t('propertytax_updated')}</p>
    </div>
  </CalculatorArticle>
  );
};
