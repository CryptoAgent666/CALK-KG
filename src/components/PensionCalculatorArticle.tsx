import React from 'react';
import { CalculatorArticle, ArticleSection, ArticleSubsection, FAQItem } from './CalculatorArticle';
import { useLanguage } from '../contexts/LanguageContext';

export const PensionCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();
  return (
  <CalculatorArticle lastUpdated="2026-03-23">
    <ArticleSection title={t('pension_article_what_title')}>
      <p className="text-gray-700 leading-relaxed mb-4">
        {t('pension_article_what_intro')}
      </p>
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm font-semibold mb-2">{t('pension_stats_title')}</p>
        <ul className="text-sm space-y-2">
          <li>{t('pension_avg_amount')} <strong>7,500-9,000 {t('som_month')}</strong></li>
          <li>{t('pension_min_amount')} <strong>3,000 {t('som_month')}</strong></li>
          <li>{t('pension_retirement_age_men')} <strong>63 {t('years')}</strong></li>
          <li>{t('pension_retirement_age_women')} <strong>58 {t('years')}</strong></li>
        </ul>
      </div>
    </ArticleSection>

    <ArticleSection title={t('pension_article_formula_title')}>
      <p className="text-gray-700 mb-3">{t('pension_formula_intro')}</p>
      <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm mb-3">
        {t('pension_formula_text')}
      </div>
      <p className="text-sm text-gray-600 mb-3">{t('pension_formula_explanation')}</p>
      <ul className="list-disc pl-6 space-y-2 text-sm">
        <li>{t('pension_formula_component_1')}</li>
        <li>{t('pension_formula_component_2')}</li>
        <li>{t('pension_formula_component_3')}</li>
      </ul>
    </ArticleSection>

    <ArticleSection titleKey="pension_detailed_examples_title">
      <p>{t('pension_detailed_examples_intro')}</p>

      <ArticleSubsection title={t('pension_example1_subtitle')}>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
          <p><strong>{t('pension_base_part_label')}:</strong> {t('pension_example1_base')}</p>
          <p><strong>{t('pension_insurance_part_label')}:</strong></p>
          <p className="pl-4">{t('pension_example1_pre96_years')}</p>
          <p className="pl-4">{t('pension_example1_avg_salary')}</p>
          <p className="pl-4 font-mono">{t('pension_example1_replacement')}</p>
          <p><strong>{t('pension_funded_part_label')}:</strong></p>
          <p className="pl-4">{t('pension_example1_contributions')}</p>
          <p className="pl-4 font-mono">{t('pension_example1_monthly')}</p>
          <p className="text-lg font-bold text-green-700">{t('pension_example1_total')}</p>
        </div>
      </ArticleSubsection>

      <ArticleSubsection title={t('pension_example2_subtitle')}>
        <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
          <p><strong>{t('pension_base_part_label')}:</strong> {t('pension_example2_base')}</p>
          <p><strong>{t('pension_example2_experience')}:</strong> {t('pension_example2_experience_val')}</p>
          <p><strong>{t('pension_example2_salary')}:</strong> 25,000 {t('som')}</p>
          <p><strong>{t('pension_funded_part_short')}:</strong></p>
          <p className="pl-4">{t('pension_example2_contributions')}</p>
          <p className="pl-4 font-mono">{t('pension_example2_monthly')}</p>
          <p className="text-lg font-bold text-green-700">{t('pension_example2_total')}</p>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {t('pension_detailed_examples_note')}
        </p>
      </ArticleSubsection>
    </ArticleSection>

    <ArticleSection title={t('pension_article_requirements_title')}>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">{t('pension_req_men_title')}</h4>
          <ul className="text-sm space-y-1">
            <li>{t('pension_req_men_age')}</li>
            <li>{t('pension_req_men_service')}</li>
          </ul>
        </div>
        <div className="bg-pink-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">{t('pension_req_women_title')}</h4>
          <ul className="text-sm space-y-1">
            <li>{t('pension_req_women_age')}</li>
            <li>{t('pension_req_women_service')}</li>
          </ul>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-3">{t('pension_early_retirement_note')}</p>
    </ArticleSection>

    <ArticleSection titleKey="pension_types_title">
      <p>{t('pension_types_intro')}</p>
      <div className="mt-4 space-y-3">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-2">{t('pension_type_age_title')}</h4>
          <p className="text-sm text-gray-700">
            {t('pension_type_age_desc')}
          </p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <h4 className="font-semibold text-gray-900 mb-2">{t('pension_type_disability_title')}</h4>
          <p className="text-sm text-gray-700">
            {t('pension_type_disability_desc')}
          </p>
        </div>
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
          <h4 className="font-semibold text-gray-900 mb-2">{t('pension_type_survivor_title')}</h4>
          <p className="text-sm text-gray-700">
            {t('pension_type_survivor_desc')}
          </p>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-gray-900 mb-2">{t('pension_type_social_title')}</h4>
          <p className="text-sm text-gray-700">
            {t('pension_type_social_desc')}
          </p>
        </div>
      </div>
    </ArticleSection>

    <ArticleSection title={t('pension_article_examples_title')}>
      <div className="space-y-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">{t('pension_example_1_title')}</h4>
          <p className="text-sm">{t('pension_example_1_desc')}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">{t('pension_example_2_title')}</h4>
          <p className="text-sm">{t('pension_example_2_desc')}</p>
        </div>
      </div>
    </ArticleSection>

    <ArticleSection title={t('pension_article_how_to_increase_title')}>
      <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
        <li>{t('pension_increase_tip_1')}</li>
        <li>{t('pension_increase_tip_2')}</li>
        <li>{t('pension_increase_tip_3')}</li>
        <li>{t('pension_increase_tip_4')}</li>
      </ul>
    </ArticleSection>

    <ArticleSection titleKey="pension_howto_title">
      <p>{t('pension_howto_intro')}</p>
      <div className="mt-4 space-y-3">
        <div className="flex items-start gap-3">
          <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">1</span>
          <div>
            <h4 className="font-semibold text-gray-900">{t('pension_howto_step1_title')}</h4>
            <p className="text-sm text-gray-700">
              {t('pension_howto_step1_desc')}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">2</span>
          <div>
            <h4 className="font-semibold text-gray-900">{t('pension_howto_step2_title')}</h4>
            <p className="text-sm text-gray-700">
              {t('pension_howto_step2_desc')}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">3</span>
          <div>
            <h4 className="font-semibold text-gray-900">{t('pension_howto_step3_title')}</h4>
            <p className="text-sm text-gray-700">
              {t('pension_howto_step3_desc')}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">4</span>
          <div>
            <h4 className="font-semibold text-gray-900">{t('pension_howto_step4_title')}</h4>
            <p className="text-sm text-gray-700">
              {t('pension_howto_step4_desc')}
            </p>
          </div>
        </div>
      </div>
    </ArticleSection>

    <ArticleSection titleKey="pension_check_title">
      <p>{t('pension_check_intro')}</p>
      <div className="mt-3 space-y-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💻</span>
          <div>
            <h4 className="font-semibold text-gray-900">{t('pension_check_online_title')}</h4>
            <p className="text-sm text-gray-700">
              {t('pension_check_online_desc')}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-2xl">📱</span>
          <div>
            <h4 className="font-semibold text-gray-900">{t('pension_check_app_title')}</h4>
            <p className="text-sm text-gray-700">
              {t('pension_check_app_desc')}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-2xl">🏢</span>
          <div>
            <h4 className="font-semibold text-gray-900">{t('pension_check_office_title')}</h4>
            <p className="text-sm text-gray-700">
              {t('pension_check_office_desc')}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>{t('pension_check_important_label')}:</strong> {t('pension_check_important_text')}
        </p>
      </div>
    </ArticleSection>

    <ArticleSection title={t('pension_article_faq_title')}>
      <div className="space-y-4">
        <FAQItem questionKey="pension_faq_q1" answerKey="pension_faq_a1" />
        <FAQItem questionKey="pension_faq_q2" answerKey="pension_faq_a2" />
        <FAQItem questionKey="pension_faq_q3" answerKey="pension_faq_a3" />
        <FAQItem questionKey="pension_faq_q4" answerKey="pension_faq_a4" />
        <FAQItem questionKey="pension_faq_q5" answerKey="pension_faq_a5" />
        <FAQItem questionKey="pension_faq_q6" answerKey="pension_faq_a6" />
        <FAQItem questionKey="pension_faq_q7" answerKey="pension_faq_a7" />
      </div>
    </ArticleSection>

    <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
      <p className="text-sm text-gray-600 mb-2">{t('pension_sources_label')}</p>
      <p className="text-xs text-gray-500">{t('pension_updated')}</p>
    </div>
  </CalculatorArticle>
  );
};
