import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CalculatorArticle, ArticleSection, ArticleSubsection, FAQItem } from './CalculatorArticle';

/**
 * Информационная статья для калькулятора зарплаты
 * Содержит информацию о налогах, отчислениях, правах работника в КР
 */
export const SalaryCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();

  return (
      <CalculatorArticle lastUpdated="2026-03-23" slug="salary">
      {/* Что учитывает калькулятор */}
      <ArticleSection title={t('salary_article_howto_title')}>
        <p>{t('salary_article_intro')}</p>

        <div className="space-y-4 mt-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-2">💼 {t('salary_article_socfund_title')}</h4>
            <p className="text-sm text-gray-700">
              {t('salary_article_socfund_desc')}
            </p>
            <p className="text-xs text-gray-600 mt-2">
              <strong>💡</strong> {t('salary_article_socfund_example')} {t('som')} → {t('salary_article_socfund_deduction')} {t('som')}
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-gray-900 mb-2">🏛️ {t('salary_article_tax_title')}</h4>
            <p className="text-sm text-gray-700">
              {t('salary_article_tax_desc')}
            </p>
            <ul className="list-disc pl-6 text-sm mt-2 space-y-1">
              <li><strong>{t('salary_article_tax_standard')}</strong></li>
              <li><strong>{t('salary_article_tax_pvt')}</strong></li>
            </ul>
            <p className="text-xs text-gray-600 mt-2">
              <strong>💡</strong> {t('salary_article_tax_example')} {t('som')} → {t('salary_article_tax_deduction')} {t('som')}
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">📊 {t('salary_article_formula_title')}</h4>
          <div className="font-mono text-sm space-y-2">
            <p><strong>{t('salary_article_formula_1')}</strong> = {t('salary_article_formula_1_desc')}</p>
            <p><strong>{t('salary_article_formula_2')}</strong> = {t('salary_article_formula_2_desc')}</p>
            <p><strong>{t('salary_article_formula_3')}</strong> = {t('salary_article_formula_3_desc')}</p>
            <p><strong>{t('salary_article_formula_4')}</strong> = {t('salary_article_formula_4_desc')}</p>
          </div>
        </div>
      </ArticleSection>

      {/* Пример расчёта */}
      <ArticleSection title={t('salary_article_examples_title')}>
        <ArticleSubsection title={`${t('salary_article_example1_title')} ${t('som')}`}>
          <div className="space-y-2 text-sm">
            <p><strong>{t('salary_article_gross')}</strong> 30,000 {t('som')}</p>
            <p>↓ {t('salary_article_socfund_10')} −3,000 {t('som')}</p>
            <p><strong>{t('salary_article_tax_base')}</strong> 27,000 {t('som')}</p>
            <p>↓ {t('salary_article_income_tax_10')} −2,700 {t('som')}</p>
            <p className="text-lg font-bold text-green-600">💰 {t('salary_article_net_30')} {t('som')} {t('salary_article_net_30_pct')}</p>
          </div>
        </ArticleSubsection>

        <ArticleSubsection title={`${t('salary_article_example2_title')} ${t('som')}`}>
          <div className="space-y-2 text-sm">
            <p><strong>{t('salary_article_gross')}</strong> 50,000 {t('som')}</p>
            <p>↓ {t('salary_article_socfund_10')} −5,000 {t('som')}</p>
            <p><strong>{t('salary_article_tax_base')}</strong> 45,000 {t('som')}</p>
            <p>↓ {t('salary_article_income_tax_10')} −4,500 {t('som')}</p>
            <p className="text-lg font-bold text-green-600">💰 {t('salary_article_net_50')} {t('som')} {t('salary_article_net_50_pct')}</p>
          </div>
        </ArticleSubsection>

        <ArticleSubsection title={`${t('salary_article_example3_title')} ${t('som')}`}>
          <div className="space-y-2 text-sm">
            <p><strong>{t('salary_article_gross')}</strong> 100,000 {t('som')}</p>
            <p>↓ {t('salary_article_socfund_10')} −10,000 {t('som')}</p>
            <p><strong>{t('salary_article_tax_base')}</strong> 90,000 {t('som')}</p>
            <p>↓ {t('salary_article_income_tax_10')} −9,000 {t('som')}</p>
            <p className="text-lg font-bold text-green-600">💰 {t('salary_article_net_100')} {t('som')} {t('salary_article_net_100_pct')}</p>
          </div>
        </ArticleSubsection>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>💡 {t('salary_article_rule_81')}</strong> {t('salary_article_rule_81_desc')}
          </p>
        </div>
      </ArticleSection>

      {/* Минимальная зарплата */}
      <ArticleSection title={t('salary_article_minimum_title')}>
        <p>
          {t('salary_article_mrot_intro')} <strong>{t('salary_article_mrot_amount')} {t('som')}</strong> {t('salary_article_mrot_period')}
        </p>

        <div className="mt-4 space-y-3">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">📌 {t('salary_article_mrot_what_title')}</h4>
            <ul className="list-disc pl-6 text-sm space-y-1">
              <li>{t('salary_article_mrot_1')}</li>
              <li>{t('salary_article_mrot_2')}</li>
              <li>{t('salary_article_mrot_3')}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">💰 {t('salary_article_mrot_net_title')}</h4>
            <ul className="list-disc pl-6 text-sm space-y-1">
              <li>{t('salary_article_mrot_gross')} {t('som')}</li>
              <li>{t('salary_article_mrot_socfund')} {t('som')}</li>
              <li>{t('salary_article_mrot_tax')} {t('som')}</li>
              <li><strong>{t('salary_article_mrot_net')} {t('som')}</strong></li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>⚠️</strong> {t('salary_article_mrot_warning')} {t('som')}. {t('salary_article_mrot_warning2')} {t('som')} {t('salary_article_mrot_warning3')}
          </p>
        </div>
      </ArticleSection>

      {/* Права работника */}
      <ArticleSection title={t('salary_article_rights_title')}>
        <p>{t('salary_article_rights_intro')}</p>

        <div className="space-y-3 mt-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📄</span>
            <div>
              <h4 className="font-semibold text-gray-900">{t('salary_article_right1_title')}</h4>
              <p className="text-sm text-gray-700">
                {t('salary_article_right1_desc')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">💰</span>
            <div>
              <h4 className="font-semibold text-gray-900">{t('salary_article_right2_title')}</h4>
              <p className="text-sm text-gray-700">
                {t('salary_article_right2_desc')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <h4 className="font-semibold text-gray-900">{t('salary_article_right3_title')}</h4>
              <p className="text-sm text-gray-700">
                {t('salary_article_right3_desc')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">🏥</span>
            <div>
              <h4 className="font-semibold text-gray-900">{t('salary_article_right4_title')}</h4>
              <p className="text-sm text-gray-700">
                {t('salary_article_right4_desc')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">🔍</span>
            <div>
              <h4 className="font-semibold text-gray-900">{t('salary_article_right5_title')}</h4>
              <p className="text-sm text-gray-700">
                {t('salary_article_right5_desc')} <a href="https://sf.gov.kg" target="_blank" rel="noopener" className="text-blue-600 hover:underline">sf.gov.kg</a> {t('salary_article_right5_desc2')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl">📝</span>
            <div>
              <h4 className="font-semibold text-gray-900">{t('salary_article_right6_title')}</h4>
              <p className="text-sm text-gray-700">
                {t('salary_article_right6_desc')}
              </p>
            </div>
          </div>
        </div>
      </ArticleSection>

      {/* FAQ */}
      <ArticleSection title={t('salary_article_faq_title')}>
        <div className="space-y-4">
          <FAQItem
            questionKey="salary_faq_q1"
            answerKey="salary_faq_a1"
          />

          <FAQItem
            questionKey="salary_faq_q2"
            answerKey="salary_faq_a2"
          />

          <FAQItem
            questionKey="salary_faq_q3"
            answer={
              <>
                <p>{t('salary_faq_a3_intro')}</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>{t('salary_faq_a3_1')}</strong> <a href="https://sf.gov.kg" target="_blank" rel="noopener" className="text-blue-600 hover:underline">sf.gov.kg</a></li>
                  <li><strong>{t('salary_faq_a3_2')}</strong> {t('salary_faq_a3_2_note')}</li>
                  <li><strong>{t('salary_faq_a3_3')}</strong> {t('salary_faq_a3_3_note')}</li>
                </ul>
                <p className="mt-2">
                  {t('salary_faq_a3_outro')}
                </p>
              </>
            }
          />

          <FAQItem
            questionKey="salary_faq_q4"
            answer={
              <>
                <p>{t('salary_faq_a4_intro')}</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>{t('salary_faq_a4_1')}</strong></li>
                  <li><strong>{t('salary_faq_a4_2')}</strong></li>
                  <li><strong>{t('salary_faq_a4_3')}</strong></li>
                  <li><strong>{t('salary_faq_a4_4')}</strong></li>
                </ul>
              </>
            }
          />

          <FAQItem
            questionKey="salary_faq_q5"
            answer={
              <>
                <p>{t('salary_faq_a5_intro')}</p>
                <ol className="list-decimal pl-6 mt-2 space-y-2">
                  <li>
                    <strong>{t('salary_faq_a5_1')}</strong> {t('salary_faq_a5_1_desc')}
                  </li>
                  <li>
                    <strong>{t('salary_faq_a5_2')}</strong> {t('salary_faq_a5_2_desc')}
                  </li>
                  <li>
                    <strong>{t('salary_faq_a5_3')}</strong> {t('salary_faq_a5_3_desc')}
                  </li>
                  <li>
                    <strong>{t('salary_faq_a5_4')}</strong> {t('salary_faq_a5_4_desc')}
                  </li>
                </ol>
                <p className="mt-2 text-sm text-gray-600">
                  <strong>⚠️</strong> {t('salary_faq_a5_note')}
                </p>
              </>
            }
          />

          <FAQItem
            questionKey="salary_faq_q6"
            answer={
              <>
                <p>
                  {t('salary_faq_a6_intro')} {t('som')}{t('salary_faq_a6_intro2')}
                </p>
                <p className="mt-2"><strong>{t('salary_faq_a6_danger')}</strong></p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>{t('salary_faq_a6_1')}</li>
                  <li>{t('salary_faq_a6_2')}</li>
                  <li>{t('salary_faq_a6_3')}</li>
                  <li>{t('salary_faq_a6_4')}</li>
                  <li>{t('salary_faq_a6_5')}</li>
                </ul>
              </>
            }
          />

          <FAQItem
            questionKey="salary_faq_q7"
            answerKey="salary_faq_a7"
          />
        </div>
      </ArticleSection>

      {/* Полезные ссылки */}
      <ArticleSection title={t('salary_article_links_title')}>
        <ul className="space-y-2">
          <li>
            <a href="https://sf.gov.kg" target="_blank" rel="noopener" className="text-blue-600 hover:underline flex items-center gap-2">
              <span>🏛️</span>
              <span><strong>{t('salary_article_link1')}</strong> {t('salary_article_link1_desc')}</span>
            </a>
          </li>
          <li>
            <a href="https://sts.gov.kg" target="_blank" rel="noopener" className="text-blue-600 hover:underline flex items-center gap-2">
              <span>📊</span>
              <span><strong>{t('salary_article_link2')}</strong> {t('salary_article_link2_desc')}</span>
            </a>
          </li>
          <li>
            <span className="flex items-center gap-2">
              <span>📞</span>
              <span><strong>{t('salary_article_link3')}</strong> {t('salary_article_link3_desc')}</span>
            </span>
          </li>
        </ul>
      </ArticleSection>

      {/* Заключение */}
      <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
        <p className="font-semibold text-gray-900 text-lg">
          💼 {t('salary_article_conclusion1')}
        </p>
        <p className="mt-2 text-gray-700">
          {t('salary_article_conclusion2')}
        </p>
      </div>
    </CalculatorArticle>
  );
};
