import React from 'react';
import { CalculatorArticle, ArticleSection, FAQItem } from './CalculatorArticle';
import { useLanguage } from '../contexts/LanguageContext';

export const WeddingCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();
  return (
  <CalculatorArticle lastUpdated="2026-03-23" slug="wedding">
    <ArticleSection title={t('wedding_article_what_title')}>
      <p className="text-gray-700 leading-relaxed mb-4">
        {t('wedding_article_what_intro')}
      </p>
      <p className="text-gray-700 leading-relaxed">
        {t('wedding_article_planning_note')}
      </p>
    </ArticleSection>

    <ArticleSection title={t('wedding_article_cost_title')}>
      <div className="bg-pink-50 p-4 rounded-lg mb-4">
        <p className="text-sm font-semibold mb-3">{t('wedding_budget_ranges')}</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>{t('wedding_modest')}</span>
            <strong>{t('wedding_modest_cost')}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t('wedding_average')}</span>
            <strong>{t('wedding_average_cost')}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t('wedding_luxury')}</span>
            <strong>{t('wedding_luxury_cost')}</strong>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600">{t('wedding_main_expenses_note')}</p>
    </ArticleSection>

    <ArticleSection title={t('wedding_article_breakdown_title')}>
      <p className="text-gray-700 mb-3">{t('wedding_breakdown_intro')}</p>
      <div className="space-y-2">
        <div className="bg-red-50 p-3 rounded-lg flex justify-between text-sm">
          <span>{t('wedding_expense_venue')}</span>
          <strong>{t('wedding_expense_venue_percent')}</strong>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg flex justify-between text-sm">
          <span>{t('wedding_expense_cars')}</span>
          <strong>{t('wedding_expense_cars_percent')}</strong>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg flex justify-between text-sm">
          <span>{t('wedding_expense_outfits')}</span>
          <strong>{t('wedding_expense_outfits_percent')}</strong>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg flex justify-between text-sm">
          <span>{t('wedding_expense_photo')}</span>
          <strong>{t('wedding_expense_photo_percent')}</strong>
        </div>
        <div className="bg-green-50 p-3 rounded-lg flex justify-between text-sm">
          <span>{t('wedding_expense_other')}</span>
          <strong>{t('wedding_expense_other_percent')}</strong>
        </div>
      </div>
    </ArticleSection>

    <ArticleSection title={t('wedding_article_saving_title')}>
      <p className="text-gray-700 mb-3">{t('wedding_saving_intro')}</p>
      <ul className="list-disc pl-6 space-y-2 text-sm">
        <li>{t('wedding_saving_tip_1')}</li>
        <li>{t('wedding_saving_tip_2')}</li>
        <li>{t('wedding_saving_tip_3')}</li>
        <li>{t('wedding_saving_tip_4')}</li>
        <li>{t('wedding_saving_tip_5')}</li>
      </ul>
    </ArticleSection>

    <ArticleSection title={t('wedding_article_examples_title')}>
      <div className="space-y-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">{t('wedding_example_1_title')}</h4>
          <p className="text-sm">{t('wedding_example_1_desc')}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">{t('wedding_example_2_title')}</h4>
          <p className="text-sm">{t('wedding_example_2_desc')}</p>
        </div>
      </div>
    </ArticleSection>

    <ArticleSection title={t('wedding_article_faq_title')}>
      <div className="space-y-4">
        <FAQItem questionKey="wedding_faq_q1" answerKey="wedding_faq_a1" />
        <FAQItem questionKey="wedding_faq_q2" answerKey="wedding_faq_a2" />
        <FAQItem questionKey="wedding_faq_q3" answerKey="wedding_faq_a3" />
        <FAQItem questionKey="wedding_faq_q4" answerKey="wedding_faq_a4" />
        <FAQItem questionKey="wedding_faq_q5" answerKey="wedding_faq_a5" />
      </div>
    </ArticleSection>

    <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
      <p className="text-sm text-gray-600 mb-2">{t('wedding_sources_label')}</p>
    </div>
  </CalculatorArticle>
  );
};
