import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CalculatorArticle, ArticleSection, ArticleSubsection, FAQItem } from './CalculatorArticle';

/**
 * Информационная статья для калькулятора больничного листа
 * Содержит правила расчёта, проценты по стажу, виды больничных
 */
export const SickLeaveCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();

  return (
      <CalculatorArticle lastUpdated="2026-03-23">
      {/* Как рассчитывается больничный */}
      <ArticleSection title={t('sick_article_howto_title')}>
        <p>{t('sick_payment_factors')}</p>
        
        <div className="space-y-4 mt-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-2">{t('sick_avg_salary_title')}</h4>
            <p className="text-sm text-gray-700">
              {t('sick_avg_salary_desc')}
            </p>
            <p className="text-xs text-gray-600 mt-2 font-mono">
              {t('sick_avg_salary_formula')}
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-gray-900 mb-2">{t('sick_experience_title')}</h4>
            <p className="text-sm text-gray-700">
              {t('sick_experience_desc')}
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">{t('sick_formula_title')}</h4>
          <div className="space-y-2 font-mono text-sm">
            <p><strong>1.</strong> {t('sick_formula_step_1')}</p>
            <p><strong>2.</strong> {t('sick_formula_step_2')}</p>
            <p><strong>3.</strong> {t('sick_formula_step_3')}</p>
          </div>
        </div>
      </ArticleSection>

      {/* Проценты по стажу */}
      <ArticleSection title={t('sick_article_percentage_title')}>
        <p>{t('sick_percentage_intro')}</p>
        
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📉</span>
              <h4 className="font-semibold text-gray-900">{t('sick_exp_less_3')}</h4>
            </div>
            <p className="text-3xl font-bold text-red-600">60%</p>
            <p className="text-sm text-gray-700 mt-2">{t('sick_from_avg')}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📊</span>
              <h4 className="font-semibold text-gray-900">{t('sick_exp_3_5')}</h4>
            </div>
            <p className="text-3xl font-bold text-yellow-600">80%</p>
            <p className="text-sm text-gray-700 mt-2">{t('sick_from_avg')}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📈</span>
              <h4 className="font-semibold text-gray-900">{t('sick_exp_5_8')}</h4>
            </div>
            <p className="text-3xl font-bold text-green-600">100%</p>
            <p className="text-sm text-gray-700 mt-2">{t('sick_from_avg')}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">⭐</span>
              <h4 className="font-semibold text-gray-900">{t('sick_exp_more_8')}</h4>
            </div>
            <p className="text-3xl font-bold text-blue-600">100%</p>
            <p className="text-sm text-gray-700 mt-2">{t('sick_from_avg')}</p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>🤰 {t('sick_pregnancy_important')}</strong> {t('sick_pregnancy_note')} <strong>100%</strong> {t('sick_pregnancy_note_full')}
          </p>
        </div>
      </ArticleSection>

      {/* Виды больничных */}
      <ArticleSection title={t('sick_article_types_title')}>
        <div className="space-y-4">
          <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
            <h4 className="font-semibold text-gray-900 mb-2">{t('sick_type_illness_title')}</h4>
            <p className="text-sm text-gray-700 mb-2">
              {t('sick_type_illness_desc')}
            </p>
            <p className="text-sm"><strong>{t('sick_payment_label')}</strong> {t('sick_type_illness_payment')}</p>
          </div>

          <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg">
            <h4 className="font-semibold text-gray-900 mb-2">{t('sick_type_work_injury_title')}</h4>
            <p className="text-sm text-gray-700 mb-2">
              {t('sick_type_work_injury_desc')}
            </p>
            <p className="text-sm"><strong>{t('sick_payment_label')}</strong> {t('sick_type_work_injury_payment')}</p>
          </div>

          <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
            <h4 className="font-semibold text-gray-900 mb-2">{t('sick_type_child_title')}</h4>
            <p className="text-sm text-gray-700 mb-2">
              {t('sick_type_child_desc')}
            </p>
            <p className="text-sm"><strong>{t('sick_payment_label')}</strong> {t('sick_type_child_payment')}</p>
          </div>

          <div className="border-l-4 border-pink-500 bg-pink-50 p-4 rounded-r-lg">
            <h4 className="font-semibold text-gray-900 mb-2">{t('sick_type_pregnancy_title')}</h4>
            <p className="text-sm text-gray-700 mb-2">{t('sick_type_pregnancy_desc')}</p>
            <ul className="list-disc pl-6 text-sm space-y-1">
              <li><strong>{t('sick_type_pregnancy_normal')}</strong> {t('sick_type_pregnancy_normal_days')}</li>
              <li><strong>{t('sick_type_pregnancy_complicated')}</strong> {t('sick_type_pregnancy_complicated_days')}</li>
              <li><strong>{t('sick_type_pregnancy_multiple')}</strong> {t('sick_type_pregnancy_multiple_days')}</li>
            </ul>
            <p className="text-sm mt-2"><strong>{t('sick_payment_label')}</strong> {t('sick_type_pregnancy_payment')}</p>
          </div>
        </div>
      </ArticleSection>

      {/* Примеры расчёта */}
      <ArticleSection title={t('sick_article_examples_title')}>
        <ArticleSubsection title={t('sick_example_1_title')}>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <p><strong>{t('sick_example_data_title')}</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>{t('sick_example_1_data_1')}</li>
              <li>{t('sick_example_1_data_2')} <strong>80%</strong></li>
              <li>{t('sick_example_1_data_3')}</li>
            </ul>
            <p className="mt-3"><strong>{t('sick_example_calc_title')}</strong></p>
            <div className="font-mono text-xs space-y-1 bg-white p-3 rounded">
              <p>{t('sick_example_1_calc_1')} <strong>{t('sick_example_1_calc_1_val')}</strong></p>
              <p>{t('sick_example_1_calc_2')} <strong>{t('sick_example_1_calc_2_val')}</strong></p>
              <p>{t('sick_example_1_calc_3')}</p>
              <p className="text-lg font-bold text-green-600">{t('sick_example_result')} {t('sick_example_1_result_val')}</p>
            </div>
          </div>
        </ArticleSubsection>

        <ArticleSubsection title={t('sick_example_2_title')}>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <p><strong>{t('sick_example_data_title')}</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>{t('sick_example_2_data_1')}</li>
              <li>{t('sick_example_2_data_2')} <strong>100%</strong></li>
              <li>{t('sick_example_2_data_3')}</li>
            </ul>
            <p className="mt-3"><strong>{t('sick_example_calc_title')}</strong></p>
            <div className="font-mono text-xs space-y-1 bg-white p-3 rounded">
              <p>{t('sick_example_2_calc_1')} <strong>{t('sick_example_2_calc_1_val')}</strong></p>
              <p>{t('sick_example_2_calc_2')} <strong>{t('sick_example_2_calc_2_val')}</strong></p>
              <p>{t('sick_example_2_calc_3')}</p>
              <p className="text-lg font-bold text-green-600">{t('sick_example_result')} {t('sick_example_2_result_val')}</p>
            </div>
          </div>
        </ArticleSubsection>

        <ArticleSubsection title={t('sick_example_3_title')}>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <p><strong>{t('sick_example_data_title')}</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>{t('sick_example_3_data_1')}</li>
              <li>{t('sick_example_3_data_2')} <strong>100%</strong></li>
              <li>{t('sick_example_3_data_3')}</li>
            </ul>
            <p className="mt-3"><strong>{t('sick_example_calc_title')}</strong></p>
            <div className="font-mono text-xs space-y-1 bg-white p-3 rounded">
              <p>{t('sick_example_3_calc_1')} <strong>{t('sick_example_3_calc_1_val')}</strong></p>
              <p>{t('sick_example_3_calc_2')} <strong>{t('sick_example_3_calc_2_val')}</strong></p>
              <p>{t('sick_example_3_calc_3')}</p>
              <p className="text-lg font-bold text-green-600">{t('sick_example_result')} {t('sick_example_3_result_val')}</p>
            </div>
          </div>
        </ArticleSubsection>
      </ArticleSection>

      {/* FAQ */}
      <ArticleSection title={t('sick_article_faq_title')}>
        <div className="space-y-4">
          <FAQItem 
            question={t('sick_faq_q1')}
            answer={t('sick_faq_a1')}
          />
          
          <FAQItem 
            question={t('sick_faq_q2')}
            answer={t('sick_faq_a2')}
          />
          
          <FAQItem 
            question={t('sick_faq_q3')}
            answer={t('sick_faq_a3')}
          />
          
          <FAQItem 
            question={t('sick_faq_q4')}
            answer={
              <>
                <p>{t('sick_faq_a4_intro')}</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>{t('sick_faq_a4_illness')}</strong> {t('sick_faq_a4_illness_val')}</li>
                  <li><strong>{t('sick_faq_a4_injury')}</strong> {t('sick_faq_a4_injury_val')}</li>
                  <li><strong>{t('sick_faq_a4_child')}</strong> {t('sick_faq_a4_child_val')}</li>
                  <li><strong>{t('sick_faq_a4_pregnancy')}</strong> {t('sick_faq_a4_pregnancy_val')}</li>
                </ul>
              </>
            }
          />
          
          <FAQItem 
            question={t('sick_faq_q5')}
            answer={t('sick_faq_a5')}
          />
        </div>
      </ArticleSection>

      {/* Заключение */}
      <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
        <p className="font-semibold text-gray-900 text-lg">
          {t('sick_footer_title')}
        </p>
        <p className="mt-2 text-gray-700">
          {t('sick_footer_desc')}
        </p>
      </div>
    </CalculatorArticle>
  );
};
