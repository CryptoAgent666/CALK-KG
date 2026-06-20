import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CalculatorArticle, ArticleSection, FAQItem } from './CalculatorArticle';

export const ScholarshipCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();

  return (
      <CalculatorArticle lastUpdated="2026-03-23" slug="scholarship">
      <ArticleSection title={t('scholarship_article_types_title')}>
        <div className="space-y-3">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900">{t('scholarship_academic_title')}</h4>
            <p className="text-sm text-gray-700 mt-1">{t('scholarship_academic_desc')} <strong>{t('scholarship_academic_amount')}</strong>{t('scholarship_academic_text')}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900">{t('scholarship_presidential_title')}</h4>
            <p className="text-sm text-gray-700 mt-1">{t('scholarship_presidential_desc')} <strong>{t('scholarship_presidential_amount')}</strong>{t('scholarship_presidential_text')}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900">{t('scholarship_social_title')}</h4>
            <p className="text-sm text-gray-700 mt-1">{t('scholarship_social_desc')} <strong>{t('scholarship_social_amount')}</strong>{t('scholarship_social_text')}</p>
          </div>
        </div>
      </ArticleSection>

      <ArticleSection title={t('scholarship_article_gpa_title')}>
        <div className="bg-gray-100 p-4 rounded-lg">
          <ul className="space-y-2 text-sm">
            <li><strong>{t('scholarship_gpa_40')}</strong> {t('scholarship_gpa_40_coef')}</li>
            <li><strong>{t('scholarship_gpa_367')}</strong> {t('scholarship_gpa_367_coef')}</li>
            <li><strong>{t('scholarship_gpa_333')}</strong> {t('scholarship_gpa_333_coef')}</li>
            <li><strong>{t('scholarship_gpa_30')}</strong> {t('scholarship_gpa_30_coef')}</li>
            <li><strong>{t('scholarship_gpa_below')}</strong> {t('scholarship_gpa_below_text')}</li>
          </ul>
        </div>
        <p className="mt-3 text-sm text-gray-600"><strong>{t('scholarship_gpa_note')}</strong> {t('scholarship_gpa_note_text')}</p>
      </ArticleSection>

      <ArticleSection title={t('scholarship_article_example_title')}>
        <div className="bg-blue-50 p-4 rounded-lg text-sm">
          <p><strong>{t('scholarship_example_student')}</strong></p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>{t('scholarship_example_base')}</li>
            <li>{t('scholarship_example_gpa')}</li>
            <li>{t('scholarship_example_uni')}</li>
            <li>{t('scholarship_example_pub')}</li>
          </ul>
          <p className="mt-3 font-mono">{t('scholarship_example_calc')} <strong className="text-green-600 text-lg">{t('scholarship_example_result')}</strong></p>
        </div>
      </ArticleSection>

      <ArticleSection title={t('scholarship_article_faq_title')}>
        <div className="space-y-4">
          <FAQItem question={t('scholarship_faq_q1')} answer={t('scholarship_faq_a1')} />
          <FAQItem question={t('scholarship_faq_q2')} answer={t('scholarship_faq_a2')} />
          <FAQItem question={t('scholarship_faq_q3')} answer={t('scholarship_faq_a3')} />
        </div>
      </ArticleSection>

      <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
        <p className="font-semibold text-gray-900 text-lg">{t('scholarship_footer_title')}</p>
        <p className="mt-2 text-gray-700">{t('scholarship_footer_desc')}</p>
      </div>
    </CalculatorArticle>
  );
};
