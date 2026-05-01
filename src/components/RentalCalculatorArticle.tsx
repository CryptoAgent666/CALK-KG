import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CalculatorArticle, ArticleSection, ArticleSubsection, FAQItem } from './CalculatorArticle';

/**
 * Информационная статья для калькулятора аренды жилья
 * Содержит цены по районам Бишкека, советы, сравнение аренды vs ипотеки
 */
export const RentalCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();

  return (
      <CalculatorArticle lastUpdated="2026-03-23">
      {/* Цены на аренду по районам */}
      <ArticleSection title={t('rental_article_prices_title')}>
        <p>{t('rental_prices_intro')}</p>
        
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-gray-900 mb-3">{t('rental_center_title')}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t('rental_studio')}</span>
                <span className="font-bold">25,000-30,000 {t('som')}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('rental_1room')}</span>
                <span className="font-bold">30,000-40,000 {t('som')}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('rental_2room')}</span>
                <span className="font-bold">45,000-60,000 {t('som')}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('rental_3room')}</span>
                <span className="font-bold">65,000-80,000 {t('som')}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-gray-900 mb-3">{t('rental_asanbay_title')}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t('rental_studio')}</span>
                <span className="font-bold">18,000-22,000 {t('som')}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('rental_1room')}</span>
                <span className="font-bold">22,000-28,000 {t('som')}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('rental_2room')}</span>
                <span className="font-bold">32,000-42,000 {t('som')}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('rental_3room')}</span>
                <span className="font-bold">48,000-58,000 {t('som')}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-3">{t('rental_jal_title')}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t('rental_studio')}</span>
                <span className="font-bold">15,000-19,000 {t('som')}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('rental_1room')}</span>
                <span className="font-bold">19,000-25,000 {t('som')}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('rental_2room')}</span>
                <span className="font-bold">29,000-38,000 {t('som')}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('rental_3room')}</span>
                <span className="font-bold">42,000-52,000 {t('som')}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-gray-900 mb-3">{t('rental_alamedin_title')}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t('rental_studio')}</span>
                <span className="font-bold">12,000-16,000 {t('som')}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('rental_1room')}</span>
                <span className="font-bold">16,000-22,000 {t('som')}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('rental_2room')}</span>
                <span className="font-bold">25,000-33,000 {t('som')}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('rental_3room')}</span>
                <span className="font-bold">38,000-48,000 {t('som')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>💡 {t('rental_prices_note')}</strong> {t('rental_prices_note_text')}
          </p>
        </div>
      </ArticleSection>

      {/* Дополнительные расходы */}
      <ArticleSection title={t('rental_article_expenses_title')}>
        <p>{t('rental_expenses_intro')}</p>
        
        <div className="space-y-3 mt-4">
          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
            <span className="text-2xl">💰</span>
            <div>
              <h4 className="font-semibold text-gray-900">{t('rental_deposit_title')}</h4>
              <p className="text-sm text-gray-700">
                {t('rental_deposit_text')} <strong>{t('rental_deposit_amount')}</strong>{t('rental_deposit_text2')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
            <span className="text-2xl">🤝</span>
            <div>
              <h4 className="font-semibold text-gray-900">{t('rental_commission_title')}</h4>
              <p className="text-sm text-gray-700">
                {t('rental_commission_text')} <strong>{t('rental_commission_amount')}</strong>{t('rental_commission_text2')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="font-semibold text-gray-900">{t('rental_utilities_title')}</h4>
              <p className="text-sm text-gray-700 mb-2">
                <strong>{t('rental_utilities_amount')}</strong> {t('rental_utilities_text')}
              </p>
              <ul className="list-disc pl-6 text-xs space-y-1">
                <li>{t('rental_utility_electric')}</li>
                <li>{t('rental_utility_water')}</li>
                <li>{t('rental_utility_gas')}</li>
                <li>{t('rental_utility_internet')}</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <span className="text-2xl">🔧</span>
            <div>
              <h4 className="font-semibold text-gray-900">{t('rental_repair_title')}</h4>
              <p className="text-sm text-gray-700">
                {t('rental_repair_text')} <strong>{t('rental_repair_amount')}</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">{t('rental_initial_title')}</h4>
          <p className="text-sm text-gray-700">
            {t('rental_initial_intro')} <strong>{t('rental_initial_example')}</strong> {t('rental_initial_intro2')}
          </p>
          <ul className="list-disc pl-6 text-sm mt-2 space-y-1">
            <li>{t('rental_initial_first')}</li>
            <li>{t('rental_initial_deposit')}</li>
            <li>{t('rental_initial_commission')}</li>
            <li>{t('rental_initial_utilities')}</li>
          </ul>
          <p className="text-lg font-bold text-gray-900 mt-2">{t('rental_initial_total')}</p>
        </div>
      </ArticleSection>

      {/* Аренда vs Ипотека */}
      <ArticleSection title={t('rental_article_vs_mortgage_title')}>
        <p>{t('rental_vs_intro')}</p>
        
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="bg-blue-50 p-5 rounded-lg border-2 border-blue-300">
            <h4 className="font-semibold text-gray-900 mb-3 text-lg">{t('rental_vs_rent_title')}</h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">{t('rental_vs_rent_desc')}</p>
                <p className="text-2xl font-bold text-blue-600">{t('rental_vs_rent_price')}</p>
              </div>
              <div className="space-y-1">
                <p>{t('rental_vs_rent_utilities')}</p>
                <p className="font-bold">{t('rental_vs_rent_total')}</p>
              </div>
              <div className="pt-3 border-t border-blue-200">
                <p className="font-bold text-blue-600">{t('rental_vs_rent_10y')}</p>
                <p className="text-xs text-gray-600 mt-1">{t('rental_vs_rent_result')}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-5 rounded-lg border-2 border-green-300">
            <h4 className="font-semibold text-gray-900 mb-3 text-lg">{t('rental_vs_mortgage_title')}</h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">{t('rental_vs_mortgage_desc')}</p>
                <p className="text-xs text-gray-600">{t('rental_vs_mortgage_downpayment')}</p>
                <p className="text-2xl font-bold text-green-600">{t('rental_vs_mortgage_payment')}</p>
                <p className="text-xs text-gray-600">{t('rental_vs_mortgage_credit')}</p>
              </div>
              <div className="space-y-1">
                <p>{t('rental_vs_mortgage_utilities')}</p>
                <p className="font-bold">{t('rental_vs_mortgage_total')}</p>
              </div>
              <div className="pt-3 border-t border-green-200">
                <p className="font-bold text-green-600">{t('rental_vs_mortgage_10y')}</p>
                <p className="text-xs text-gray-600 mt-1">{t('rental_vs_mortgage_result')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-300">
          <h4 className="font-semibold text-gray-900 mb-2">{t('rental_vs_conclusion_title')}</h4>
          <p className="text-sm text-gray-700">
            {t('rental_vs_conclusion_text')} <strong>{t('rental_vs_conclusion_better')}</strong>{t('rental_vs_conclusion_text2')}
          </p>
        </div>

        <ArticleSubsection title={t('rental_when_rent_title')}>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>
              <strong>{t('rental_when_rent_1')}</strong> {t('rental_when_rent_1_text')}
            </li>
            <li>
              <strong>{t('rental_when_rent_2')}</strong> {t('rental_when_rent_2_text')}
            </li>
            <li>
              <strong>{t('rental_when_rent_3')}</strong> {t('rental_when_rent_3_text')}
            </li>
            <li>
              <strong>{t('rental_when_rent_4')}</strong> {t('rental_when_rent_4_text')}
            </li>
            <li>
              <strong>{t('rental_when_rent_5')}</strong> {t('rental_when_rent_5_text')}
            </li>
          </ul>
        </ArticleSubsection>

        <ArticleSubsection title={t('rental_when_mortgage_title')}>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>
              <strong>{t('rental_when_mortgage_1')}</strong> {t('rental_when_mortgage_1_text')}
            </li>
            <li>
              <strong>{t('rental_when_mortgage_2')}</strong> {t('rental_when_mortgage_2_text')}
            </li>
            <li>
              <strong>{t('rental_when_mortgage_3')}</strong> {t('rental_when_mortgage_3_text')}
            </li>
            <li>
              <strong>{t('rental_when_mortgage_4')}</strong> {t('rental_when_mortgage_4_text')}
            </li>
            <li>
              <strong>{t('rental_when_mortgage_5')}</strong> {t('rental_when_mortgage_5_text')}
            </li>
          </ul>
        </ArticleSubsection>
      </ArticleSection>

      {/* Советы */}
      <ArticleSection title={t('rental_article_tips_title')}>
        <ol className="list-decimal pl-6 space-y-3 text-sm">
          <li>
            <strong>{t('rental_tips_1')}</strong> {t('rental_tips_1_text')}
          </li>
          <li>
            <strong>{t('rental_tips_2')}</strong> {t('rental_tips_2_text')}
          </li>
          <li>
            <strong>{t('rental_tips_3')}</strong> {t('rental_tips_3_text')}
          </li>
          <li>
            <strong>{t('rental_tips_4')}</strong> {t('rental_tips_4_text')}
          </li>
          <li>
            <strong>{t('rental_tips_5')}</strong> {t('rental_tips_5_text')}
          </li>
          <li>
            <strong>{t('rental_tips_6')}</strong> {t('rental_tips_6_text')}
          </li>
          <li>
            <strong>{t('rental_tips_7')}</strong> {t('rental_tips_7_text')}
          </li>
          <li>
            <strong>{t('rental_tips_8')}</strong> {t('rental_tips_8_text')}
          </li>
          <li>
            <strong>{t('rental_tips_9')}</strong> {t('rental_tips_9_text')}
          </li>
          <li>
            <strong>{t('rental_tips_10')}</strong> {t('rental_tips_10_text')}
          </li>
        </ol>
      </ArticleSection>

      {/* FAQ */}
      <ArticleSection title={t('rental_article_faq_title')}>
        <div className="space-y-4">
          <FAQItem 
            question={t('rental_full_faq_q1')}
            answer={t('rental_full_faq_a1')}
          />
          
          <FAQItem 
            question={t('rental_full_faq_q2')}
            answer={t('rental_full_faq_a2')}
          />
          
          <FAQItem 
            question={t('rental_full_faq_q3')}
            answer={t('rental_full_faq_a3')}
          />
          
          <FAQItem 
            question={t('rental_full_faq_q4')}
            answer={t('rental_full_faq_a4')}
          />
          
          <FAQItem 
            question={t('rental_full_faq_q5')}
            answer={t('rental_full_faq_a5')}
          />
          
          <FAQItem 
            question={t('rental_full_faq_q6')}
            answer={t('rental_full_faq_a6')}
          />
        </div>
      </ArticleSection>

      {/* Заключение */}
      <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
        <p className="font-semibold text-gray-900 text-lg">
          {t('rental_footer_title')}
        </p>
        <p className="mt-2 text-gray-700">
          {t('rental_footer_desc')}
        </p>
      </div>
    </CalculatorArticle>
  );
};
