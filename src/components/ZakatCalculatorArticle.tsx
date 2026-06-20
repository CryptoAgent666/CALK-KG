import React from 'react';
import { CalculatorArticle, ArticleSection, FAQItem } from './CalculatorArticle';
import { useLanguage } from '../contexts/LanguageContext';

export const ZakatCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();
  return (
  <CalculatorArticle lastUpdated="2026-03-23" slug="zakat">
    <ArticleSection title={t('zakat_article_what_title')}>
      <p className="text-gray-700 leading-relaxed mb-4">
        {t('zakat_article_what_intro')}
      </p>
      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-sm font-semibold mb-2">{t('zakat_rate_label')}</p>
        <p className="text-sm">{t('zakat_rate_value')}</p>
        <p className="text-sm mt-2">{t('zakat_nisab_2026')}</p>
        <p className="text-xs mt-1 text-gray-600">{t('zakat_nisab_gold')}</p>
      </div>
    </ArticleSection>

    <ArticleSection title={t('zakat_article_conditions_title')}>
      <p className="text-gray-700 mb-3">{t('zakat_conditions_intro')}</p>
      <ul className="list-disc pl-6 space-y-2 text-sm">
        <li>{t('zakat_condition_1')}</li>
        <li>{t('zakat_condition_2')}</li>
        <li>{t('zakat_condition_3')}</li>
        <li>{t('zakat_condition_4')}</li>
      </ul>
    </ArticleSection>

    <ArticleSection title={t('zakat_article_types_title')}>
      <p className="text-gray-700 mb-3">{t('zakat_types_intro')}</p>
      <div className="space-y-3">
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-semibold text-sm">{t('zakat_type_money_title')}</h4>
          <p className="text-xs text-gray-600">{t('zakat_type_money_desc')}</p>
        </div>
        <div className="bg-amber-50 p-3 rounded-lg">
          <h4 className="font-semibold text-sm">{t('zakat_type_gold_title')}</h4>
          <p className="text-xs text-gray-600">{t('zakat_type_gold_desc')}</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <h4 className="font-semibold text-sm">{t('zakat_type_goods_title')}</h4>
          <p className="text-xs text-gray-600">{t('zakat_type_goods_desc')}</p>
        </div>
      </div>
    </ArticleSection>

    <ArticleSection title={t('zakat_article_examples_title')}>
      <div className="space-y-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">{t('zakat_example_1_title')}</h4>
          <p className="text-sm">{t('zakat_example_1_desc')}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">{t('zakat_example_2_title')}</h4>
          <p className="text-sm">{t('zakat_example_2_desc')}</p>
        </div>
      </div>
    </ArticleSection>

    <ArticleSection title={t('zakat_article_distribution_title')}>
      <p className="text-gray-700 mb-3">{t('zakat_distribution_intro')}</p>
      <div className="grid md:grid-cols-2 gap-3">
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li>{t('zakat_recipient_1')}</li>
          <li>{t('zakat_recipient_2')}</li>
          <li>{t('zakat_recipient_3')}</li>
          <li>{t('zakat_recipient_4')}</li>
        </ul>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li>{t('zakat_recipient_5')}</li>
          <li>{t('zakat_recipient_6')}</li>
          <li>{t('zakat_recipient_7')}</li>
          <li>{t('zakat_recipient_8')}</li>
        </ul>
      </div>
    </ArticleSection>

    <ArticleSection title={t('zakat_article_faq_title')}>
      <div className="space-y-4">
        <FAQItem questionKey="zakat_faq_q1" answerKey="zakat_faq_a1" />
        <FAQItem questionKey="zakat_faq_q2" answerKey="zakat_faq_a2" />
        <FAQItem questionKey="zakat_faq_q3" answerKey="zakat_faq_a3" />
        <FAQItem questionKey="zakat_faq_q4" answerKey="zakat_faq_a4" />
        <FAQItem questionKey="zakat_faq_q5" answerKey="zakat_faq_a5" />
      </div>
    </ArticleSection>

    <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
      <p className="text-sm text-gray-600 mb-2">{t('zakat_sources_label')}</p>
      <p className="text-xs text-gray-500">{t('zakat_updated')}</p>
    </div>
  </CalculatorArticle>
  );
};
