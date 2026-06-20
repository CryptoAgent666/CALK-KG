import React from 'react';
import { CalculatorArticle, ArticleSection, FAQItem } from './CalculatorArticle';
import { useLanguage } from '../contexts/LanguageContext';

export const CalorieCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();
  return (
  <CalculatorArticle lastUpdated="2026-03-23" slug="calorie">
    <ArticleSection title={t('calorie_article_what_title')}>
      <p className="text-gray-700 leading-relaxed mb-4">
        {t('calorie_article_what_intro')}
      </p>
      <p className="text-gray-700 leading-relaxed">
        {t('calorie_article_bmr_tdee_note')}
      </p>
    </ArticleSection>

    <ArticleSection title={t('calorie_article_nutrition_title')}>
      <div className="bg-green-50 p-4 rounded-lg mb-4">
        <p className="text-sm font-semibold mb-3">{t('calorie_average_norms')}</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>{t('calorie_men_label')}</span>
            <strong>{t('calorie_men_range')}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t('calorie_women_label')}</span>
            <strong>{t('calorie_women_range')}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t('calorie_children_label')}</span>
            <strong>{t('calorie_children_range')}</strong>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600">{t('calorie_factors_note')}</p>
    </ArticleSection>

    <ArticleSection title={t('calorie_article_formulas_title')}>
      <p className="text-gray-700 mb-3">{t('calorie_formulas_intro')}</p>
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <div>
          <h4 className="font-semibold text-sm mb-1">{t('calorie_formula_men_title')}</h4>
          <p className="text-xs font-mono text-gray-600">{t('calorie_formula_men')}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-1">{t('calorie_formula_women_title')}</h4>
          <p className="text-xs font-mono text-gray-600">{t('calorie_formula_women')}</p>
        </div>
      </div>
      <p className="text-xs text-gray-600 mt-2">{t('calorie_formula_note')}</p>
    </ArticleSection>

    <ArticleSection title={t('calorie_article_activity_title')}>
      <p className="text-gray-700 mb-3">{t('calorie_activity_intro')}</p>
      <div className="space-y-2">
        <div className="bg-gray-50 p-3 rounded-lg flex justify-between text-sm">
          <span>{t('calorie_activity_sedentary')}</span>
          <strong>{t('calorie_activity_sedentary_coef')}</strong>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg flex justify-between text-sm">
          <span>{t('calorie_activity_light')}</span>
          <strong>{t('calorie_activity_light_coef')}</strong>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg flex justify-between text-sm">
          <span>{t('calorie_activity_moderate')}</span>
          <strong>{t('calorie_activity_moderate_coef')}</strong>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg flex justify-between text-sm">
          <span>{t('calorie_activity_active')}</span>
          <strong>{t('calorie_activity_active_coef')}</strong>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg flex justify-between text-sm">
          <span>{t('calorie_activity_very_active')}</span>
          <strong>{t('calorie_activity_very_active_coef')}</strong>
        </div>
      </div>
    </ArticleSection>

    <ArticleSection title={t('calorie_article_goals_title')}>
      <div className="grid md:grid-cols-3 gap-3">
        <div className="bg-red-50 p-3 rounded-lg">
          <h4 className="font-semibold text-sm mb-1">{t('calorie_goal_lose')}</h4>
          <p className="text-xs text-gray-600">{t('calorie_goal_lose_desc')}</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <h4 className="font-semibold text-sm mb-1">{t('calorie_goal_maintain')}</h4>
          <p className="text-xs text-gray-600">{t('calorie_goal_maintain_desc')}</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-semibold text-sm mb-1">{t('calorie_goal_gain')}</h4>
          <p className="text-xs text-gray-600">{t('calorie_goal_gain_desc')}</p>
        </div>
      </div>
    </ArticleSection>

    <ArticleSection title={t('calorie_article_faq_title')}>
      <div className="space-y-4">
        <FAQItem questionKey="calorie_faq_q1" answerKey="calorie_faq_a1" />
        <FAQItem questionKey="calorie_faq_q2" answerKey="calorie_faq_a2" />
        <FAQItem questionKey="calorie_faq_q3" answerKey="calorie_faq_a3" />
        <FAQItem questionKey="calorie_faq_q4" answerKey="calorie_faq_a4" />
        <FAQItem questionKey="calorie_faq_q5" answerKey="calorie_faq_a5" />
      </div>
    </ArticleSection>

    <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
      <p className="text-sm text-gray-600 mb-2">{t('calorie_sources_label')}</p>
      <p className="text-xs text-gray-500">{t('calorie_updated')}</p>
    </div>
  </CalculatorArticle>
  );
};
