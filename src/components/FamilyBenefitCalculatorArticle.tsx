import React from 'react';
import { CalculatorArticle, ArticleSection, FAQItem } from './CalculatorArticle';
import { useLanguage } from '../contexts/LanguageContext';

export const FamilyBenefitCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();
  return (
  <CalculatorArticle lastUpdated="2026-03-23" slug="family-benefit">
    <ArticleSection title={t('familybenefit_article_what_title')}>
      <p className="text-gray-700 leading-relaxed mb-4">
        {t('familybenefit_article_what_intro')}
      </p>
      <p className="text-gray-700 leading-relaxed">
        {t('familybenefit_article_who_eligible')}
      </p>
    </ArticleSection>

    <ArticleSection title={t('familybenefit_article_benefits_title')}>
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <p className="text-sm font-semibold mb-3">{t('familybenefit_amounts_title')}</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>{t('familybenefit_birth_benefit')}</span>
            <strong>{t('familybenefit_birth_amount')}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t('familybenefit_under_3')}</span>
            <strong>{t('familybenefit_under_3_amount')}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t('familybenefit_large_family')}</span>
            <strong>{t('familybenefit_large_family_amount')}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t('familybenefit_pregnancy')}</span>
            <strong>{t('familybenefit_pregnancy_amount')}</strong>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600">{t('familybenefit_income_threshold_note')}</p>
    </ArticleSection>

    <ArticleSection title={t('familybenefit_article_eligibility_title')}>
      <p className="text-gray-700 mb-3">{t('familybenefit_eligibility_intro')}</p>
      <div className="bg-amber-50 p-4 rounded-lg">
        <ul className="text-sm space-y-2">
          <li>{t('familybenefit_eligibility_1')}</li>
          <li>{t('familybenefit_eligibility_2')}</li>
          <li>{t('familybenefit_eligibility_3')}</li>
          <li>{t('familybenefit_eligibility_4')}</li>
        </ul>
      </div>
    </ArticleSection>

    <ArticleSection title={t('familybenefit_article_documents_title')}>
      <p className="text-gray-700 mb-3">{t('familybenefit_documents_intro')}</p>
      <ul className="list-disc pl-6 space-y-2 text-sm">
        <li>{t('familybenefit_doc_1')}</li>
        <li>{t('familybenefit_doc_2')}</li>
        <li>{t('familybenefit_doc_3')}</li>
        <li>{t('familybenefit_doc_4')}</li>
        <li>{t('familybenefit_doc_5')}</li>
      </ul>
    </ArticleSection>

    <ArticleSection title={t('familybenefit_article_procedure_title')}>
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
          <p className="text-sm text-gray-700">{t('familybenefit_proc_step_1')}</p>
        </div>
        <div className="flex items-start space-x-3">
          <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
          <p className="text-sm text-gray-700">{t('familybenefit_proc_step_2')}</p>
        </div>
        <div className="flex items-start space-x-3">
          <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
          <p className="text-sm text-gray-700">{t('familybenefit_proc_step_3')}</p>
        </div>
      </div>
    </ArticleSection>

    <ArticleSection title={t('familybenefit_article_faq_title')}>
      <div className="space-y-4">
        <FAQItem questionKey="familybenefit_faq_q1" answerKey="familybenefit_faq_a1" />
        <FAQItem questionKey="familybenefit_faq_q2" answerKey="familybenefit_faq_a2" />
        <FAQItem questionKey="familybenefit_faq_q3" answerKey="familybenefit_faq_a3" />
        <FAQItem questionKey="familybenefit_faq_q4" answerKey="familybenefit_faq_a4" />
        <FAQItem questionKey="familybenefit_faq_q5" answerKey="familybenefit_faq_a5" />
      </div>
    </ArticleSection>

    <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
      <p className="text-sm text-gray-600 mb-2">{t('familybenefit_sources_label')}</p>
    </div>
  </CalculatorArticle>
  );
};
