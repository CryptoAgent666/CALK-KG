import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CalculatorArticle, ArticleSection, FAQItem } from './CalculatorArticle';

export const DepositCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();

  return (
      <CalculatorArticle lastUpdated="2026-03-23">
      <ArticleSection title={t('deposit_article_rates_title')}>
        <div className="space-y-3">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold">{t('deposit_rates_kgs_title')}</h4>
            <ul className="text-sm mt-2 space-y-1">
              <li>3 месяца: <strong>8-12%</strong> годовых</li>
              <li>6 месяцев: <strong>10-14%</strong> годовых</li>
              <li>12 месяцев: <strong>12-16%</strong> годовых</li>
            </ul>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold">{t('deposit_rates_usd_title')}</h4>
            <ul className="text-sm mt-2 space-y-1">
              <li>6 месяцев: <strong>2-4%</strong> годовых</li>
              <li>12 месяцев: <strong>3-5%</strong> годовых</li>
            </ul>
          </div>
        </div>
      </ArticleSection>

      <ArticleSection title={t('deposit_article_capitalization_title')}>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li><strong>Ежемесячная</strong> — проценты добавляются каждый месяц, доход максимальный</li>
          <li><strong>Ежеквартальная</strong> — каждые 3 месяца</li>
          <li><strong>В конце срока</strong> — при закрытии вклада</li>
        </ul>
        <p className="mt-3 text-sm text-gray-600">
          <strong>Пример:</strong> Вклад 100,000 {t('som')} под 15% на год с ежемесячной капитализацией даст ~116,075 {t('som')} (на 1,075 {t('som')} больше, чем без капитализации).
        </p>
      </ArticleSection>

      <ArticleSection title={t('deposit_article_faq_title')}>
        <div className="space-y-4">
          <FAQItem 
            question={t('deposit_faq_q1')}
            answer={t('deposit_faq_a1')}
          />
          <FAQItem 
            question={t('deposit_faq_q2')}
            answer={t('deposit_faq_a2')}
          />
          <FAQItem 
            question={t('deposit_faq_q3')}
            answer={t('deposit_faq_a3')}
          />
        </div>
      </ArticleSection>

      <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
        <p className="font-semibold text-gray-900 text-lg">💰 Депозитный калькулятор — рассчитайте доход от вклада</p>
      </div>
    </CalculatorArticle>
  );
};
