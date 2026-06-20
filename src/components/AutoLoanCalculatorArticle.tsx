import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CalculatorArticle, ArticleSection, FAQItem } from './CalculatorArticle';

export const AutoLoanCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();
  
  return (
      <CalculatorArticle lastUpdated="2026-03-23" slug="auto-loan">
      <ArticleSection title={t('autoloan_article_conditions_title')}>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li><strong>{t('autoloan_conditions_rate_label')}</strong> {t('autoloan_conditions_rate_value')}</li>
          <li><strong>{t('autoloan_conditions_term_label')}</strong> {t('autoloan_conditions_term_value')}</li>
          <li><strong>{t('autoloan_conditions_down_payment_label')}</strong> {t('autoloan_conditions_down_payment_value')}</li>
          <li><strong>{t('autoloan_conditions_max_amount_label')}</strong> {t('autoloan_conditions_max_amount_value')}</li>
          <li><strong>{t('autoloan_conditions_casco_label')}</strong> {t('autoloan_conditions_casco_value')}</li>
        </ul>
      </ArticleSection>

      <ArticleSection title={t('autoloan_article_vs_consumer_title')}>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">{t('autoloan_compare_auto_title')}</h4>
            <p className="text-xs mb-2"><strong>{t('autoloan_compare_auto_rate_label')}</strong> {t('autoloan_compare_auto_rate_value')}</p>
            <p className="text-xs mb-2"><strong>{t('autoloan_compare_auto_cons_label')}</strong> {t('autoloan_compare_auto_cons_value')}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">{t('autoloan_compare_consumer_title')}</h4>
            <p className="text-xs mb-2"><strong>{t('autoloan_compare_consumer_rate_label')}</strong> {t('autoloan_compare_consumer_rate_value')}</p>
            <p className="text-xs mb-2"><strong>{t('autoloan_compare_consumer_pros_label')}</strong> {t('autoloan_compare_consumer_pros_value')}</p>
          </div>
        </div>
      </ArticleSection>

      <ArticleSection title={t('autoloan_article_faq_title')}>
        <div className="space-y-4">
          <FAQItem 
            question={t('auto_loan_faq_q1')}
            answer={t('auto_loan_faq_a1')}
          />
          <FAQItem 
            question={t('auto_loan_faq_q2')}
            answer={t('auto_loan_faq_a2')}
          />
          <FAQItem 
            question={t('auto_loan_faq_q3')}
            answer={t('auto_loan_faq_a3')}
          />
        </div>
      </ArticleSection>

      <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
        <p className="font-semibold text-gray-900 text-lg">{t('autoloan_footer_callout')}</p>
      </div>
    </CalculatorArticle>
  );
};
