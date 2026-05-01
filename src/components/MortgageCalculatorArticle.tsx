import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CalculatorArticle, ArticleSection, ArticleSubsection, FAQItem } from './CalculatorArticle';

/**
 * Информационная статья для ипотечного калькулятора
 * Содержит условия ипотеки в КР, банки, программы, документы, советы
 */
export const MortgageCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();

  return (
      <CalculatorArticle lastUpdated="2026-03-23">
      {/* Условия ипотеки в КР */}
      <ArticleSection title={t('mortgage_article_conditions_title')}>
        <p>{t('mortgage_article_conditions_intro')}</p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li><strong>{t('mortgage_article_conditions_rate')}</strong> {t('mortgage_article_conditions_rate_val')}</li>
          <li><strong>{t('mortgage_article_conditions_term')}</strong> {t('mortgage_article_conditions_term_val')}</li>
          <li><strong>{t('mortgage_article_conditions_downpayment')}</strong> {t('mortgage_article_conditions_downpayment_val')}</li>
          <li><strong>{t('mortgage_article_conditions_max')}</strong> {t('mortgage_article_conditions_max_val')} {t('som')} {t('mortgage_article_conditions_max_val2')}</li>
          <li><strong>{t('mortgage_article_conditions_currency')}</strong> {t('som')} {t('mortgage_article_conditions_currency_val')}</li>
        </ul>
      </ArticleSection>

      {/* Банки с ипотекой */}
      <ArticleSection title={t('mortgage_article_banks_title')}>
        <p>{t('mortgage_article_banks_intro')}</p>

        <div className="space-y-4 mt-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">🏦 RSK Bank</h4>
            <ul className="list-disc pl-6 text-sm space-y-1">
              <li>{t('mortgage_article_bank_rate')} <strong>13.5% - 16.0%</strong> {t('mortgage_article_bank_rate_annual')}</li>
              <li>{t('mortgage_article_bank_term')} 25 {t('mortgage_article_bank_term_years')}</li>
              <li>{t('mortgage_article_bank_downpayment')} 20%</li>
              <li>{t('mortgage_article_rsk_program')}</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">🏦 Айыл Банк</h4>
            <ul className="list-disc pl-6 text-sm space-y-1">
              <li>{t('mortgage_article_bank_rate')} <strong>14.0% - 16.5%</strong> {t('mortgage_article_bank_rate_annual')}</li>
              <li>{t('mortgage_article_bank_term')} 20 {t('mortgage_article_bank_term_years')}</li>
              <li>{t('mortgage_article_bank_downpayment')} 30%</li>
              <li>{t('mortgage_article_ayyl_program')}</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">🏦 Оптима Банк</h4>
            <ul className="list-disc pl-6 text-sm space-y-1">
              <li>{t('mortgage_article_bank_rate')} <strong>14.0% - 16.0%</strong> {t('mortgage_article_bank_rate_annual')}</li>
              <li>{t('mortgage_article_bank_term')} 15 {t('mortgage_article_bank_term_years')}</li>
              <li>{t('mortgage_article_bank_downpayment')} 30%</li>
              <li>{t('mortgage_article_optima_program')}</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">🏦 ФКУР</h4>
            <ul className="list-disc pl-6 text-sm space-y-1">
              <li>{t('mortgage_article_bank_rate')} <strong>14.5% - 17.0%</strong> {t('mortgage_article_bank_rate_annual')}</li>
              <li>{t('mortgage_article_bank_term')} 20 {t('mortgage_article_bank_term_years')}</li>
              <li>{t('mortgage_article_bank_downpayment')} 30%</li>
              <li>{t('mortgage_article_fkur_program')}</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">🏦 БТА Банк</h4>
            <ul className="list-disc pl-6 text-sm space-y-1">
              <li>{t('mortgage_article_bank_rate')} <strong>16.0% - 19.0%</strong> {t('mortgage_article_bank_rate_annual')}</li>
              <li>{t('mortgage_article_bank_term')} 15 {t('mortgage_article_bank_term_years')}</li>
              <li>{t('mortgage_article_bank_downpayment')} 30%</li>
              <li>{t('mortgage_article_bta_program')}</li>
            </ul>
          </div>
        </div>
      </ArticleSection>

      {/* Государственные программы */}
      <ArticleSection title={t('mortgage_article_government_title')}>
        <ArticleSubsection title={`🏘️ ${t('mortgage_article_affordable_title')}`}>
          <p>{t('mortgage_article_affordable_intro')}</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li><strong>{t('mortgage_article_bank_rate')}</strong> {t('mortgage_article_affordable_rate')}</li>
            <li><strong>{t('mortgage_article_bank_downpayment')}</strong> {t('mortgage_article_affordable_downpayment')}</li>
            <li><strong>{t('mortgage_article_conditions_term')}</strong> {t('mortgage_article_affordable_term')}</li>
            <li><strong>{t('mortgage_article_affordable_condition')}</strong></li>
            <li><strong>{t('mortgage_article_affordable_banks')}</strong></li>
          </ul>
        </ArticleSubsection>

        <ArticleSubsection title={`👨‍👩‍👧 ${t('mortgage_article_young_title')}`}>
          <p>{t('mortgage_article_young_intro')}</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li><strong>{t('mortgage_article_bank_downpayment')}</strong> {t('mortgage_article_young_downpayment')}</li>
            <li><strong>{t('mortgage_article_bank_rate')}</strong> {t('mortgage_article_young_rate')}</li>
            <li>{t('mortgage_article_young_grace')}</li>
          </ul>
        </ArticleSubsection>

        <ArticleSubsection title={`🏛️ ${t('mortgage_article_budget_title')}`}>
          <p>{t('mortgage_article_budget_intro')}</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li><strong>{t('mortgage_article_bank_rate')}</strong> {t('mortgage_article_budget_rate')}</li>
            <li><strong>{t('mortgage_article_bank_downpayment')}</strong> {t('mortgage_article_budget_downpayment')}</li>
            <li><strong>{t('mortgage_article_budget_income')}</strong></li>
          </ul>
        </ArticleSubsection>
      </ArticleSection>

      {/* Формула расчёта */}
      <ArticleSection title={t('mortgage_article_howto_title')}>
        <p>{t('mortgage_article_formula_intro')}</p>

        <div className="bg-gray-100 p-4 rounded-lg mt-4 font-mono text-sm">
          <p className="mb-2"><strong>{t('mortgage_article_formula_monthly')}</strong> =</p>
          <p className="ml-4">S × (i × (1 + i)^n) / ((1 + i)^n − 1)</p>
          <p className="mt-4 text-xs font-sans">
            {t('mortgage_article_formula_where')}<br/>
            {t('mortgage_article_formula_s')}<br/>
            {t('mortgage_article_formula_i')}<br/>
            {t('mortgage_article_formula_n')}
          </p>
        </div>

        <ArticleSubsection title={t('mortgage_article_example_title')}>
          <p>{t('mortgage_article_example_intro')} <strong>3,000,000 {t('som')}</strong></p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>{t('mortgage_article_example_downpayment')} <strong>900,000 {t('som')}</strong></li>
            <li>{t('mortgage_article_example_loan')} <strong>2,100,000 {t('som')}</strong></li>
            <li>{t('mortgage_article_example_rate')} <strong>{t('mortgage_article_example_rate_val')}</strong></li>
            <li>{t('mortgage_article_example_term')} <strong>{t('mortgage_article_example_term_val')}</strong></li>
          </ul>
          <p className="mt-3"><strong>{t('mortgage_article_example_result')}</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>{t('mortgage_article_example_monthly')} <strong>~29,400 {t('som')}</strong></li>
            <li>{t('mortgage_article_example_total')} <strong>~5,292,000 {t('som')}</strong></li>
            <li>{t('mortgage_article_example_overpay')} <strong>~3,192,000 {t('som')}</strong> {t('mortgage_article_example_overpay_pct')}</li>
          </ul>
        </ArticleSubsection>
      </ArticleSection>

      {/* Необходимые документы */}
      <ArticleSection title={t('mortgage_article_documents_title')}>
        <p>{t('mortgage_article_docs_intro')}</p>

        <div className="space-y-3 mt-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">📋 {t('mortgage_article_docs_main_title')}</h4>
            <ul className="list-disc pl-6 text-sm space-y-1">
              <li>{t('mortgage_article_docs_main_1')}</li>
              <li>{t('mortgage_article_docs_main_2')}</li>
              <li>{t('mortgage_article_docs_main_3')}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">💼 {t('mortgage_article_docs_income_title')}</h4>
            <ul className="list-disc pl-6 text-sm space-y-1">
              <li>{t('mortgage_article_docs_income_1')}</li>
              <li>{t('mortgage_article_docs_income_2')}</li>
              <li>{t('mortgage_article_docs_income_3')}</li>
              <li>{t('mortgage_article_docs_income_4')}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">🏠 {t('mortgage_article_docs_property_title')}</h4>
            <ul className="list-disc pl-6 text-sm space-y-1">
              <li>{t('mortgage_article_docs_property_1')}</li>
              <li>{t('mortgage_article_docs_property_2')}</li>
              <li>{t('mortgage_article_docs_property_3')}</li>
              <li>{t('mortgage_article_docs_property_4')}</li>
              <li>{t('mortgage_article_docs_property_5')}</li>
            </ul>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-600">
          <strong>📌</strong> {t('mortgage_article_docs_note')}
        </p>
      </ArticleSection>

      {/* Советы */}
      <ArticleSection title={t('mortgage_article_tips_title')}>
        <ol className="list-decimal pl-6 space-y-3">
          <li>
            <strong>{t('mortgage_article_tip1')}</strong> {t('mortgage_article_tip1_desc')}
          </li>
          <li>
            <strong>{t('mortgage_article_tip2')}</strong>
            <ul className="list-disc pl-6 mt-1 text-sm">
              <li>{t('mortgage_article_tip2_1')} {t('som')}</li>
              <li>{t('mortgage_article_tip2_2')}</li>
              <li>{t('mortgage_article_tip2_3')} {t('som')}</li>
              <li>{t('mortgage_article_tip2_4')}</li>
            </ul>
          </li>
          <li>
            <strong>{t('mortgage_article_tip3')}</strong> {t('mortgage_article_tip3_desc')}
          </li>
          <li>
            <strong>{t('mortgage_article_tip4')}</strong> {t('mortgage_article_tip4_desc')}
          </li>
          <li>
            <strong>{t('mortgage_article_tip5')}</strong> {t('mortgage_article_tip5_desc')}
          </li>
          <li>
            <strong>{t('mortgage_article_tip6')}</strong> {t('mortgage_article_tip6_desc')}
          </li>
          <li>
            <strong>{t('mortgage_article_tip7')}</strong> {t('mortgage_article_tip7_desc')}
          </li>
        </ol>
      </ArticleSection>

      {/* FAQ */}
      <ArticleSection title={t('mortgage_article_faq_title')}>
        <div className="space-y-4">
          <FAQItem
            questionKey="mortgage_faq_q1"
            answerKey="mortgage_faq_a1"
          />

          <FAQItem
            questionKey="mortgage_faq_q2"
            answerKey="mortgage_faq_a2"
          />

          <FAQItem
            questionKey="mortgage_faq_q3"
            answer={
              <>
                <p>{t('mortgage_faq_a3_intro')}</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>{t('mortgage_faq_a3_1')}</strong> {t('mortgage_faq_a3_1_desc')}</li>
                  <li><strong>{t('mortgage_faq_a3_2')}</strong> {t('mortgage_faq_a3_2_desc')}</li>
                  <li><strong>{t('mortgage_faq_a3_3')}</strong> {t('mortgage_faq_a3_3_desc')}</li>
                </ul>
              </>
            }
          />

          <FAQItem
            questionKey="mortgage_faq_q4"
            answer={
              <>
                {t('mortgage_faq_a4')} {t('som')} {t('mortgage_faq_a4_2')}
              </>
            }
          />

          <FAQItem
            questionKey="mortgage_faq_q5"
            answerKey="mortgage_faq_a5"
          />

          <FAQItem
            questionKey="mortgage_faq_q6"
            answerKey="mortgage_faq_a6"
          />

          <FAQItem
            questionKey="mortgage_faq_q7"
            answerKey="mortgage_faq_a7"
          />

          <FAQItem
            questionKey="mortgage_faq_q8"
            answerKey="mortgage_faq_a8"
          />
        </div>
      </ArticleSection>

      {/* Заключение */}
      <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
        <p className="font-semibold text-gray-900 text-lg">
          💡 {t('mortgage_article_conclusion1')}
        </p>
        <p className="mt-2 text-gray-700">
          {t('mortgage_article_conclusion2')}
        </p>
      </div>
    </CalculatorArticle>
  );
};
