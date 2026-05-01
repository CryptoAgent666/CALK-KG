import React from 'react';
import { CalculatorArticle, ArticleSection } from './CalculatorArticle';
import { useLanguage } from '../contexts/LanguageContext';

export const SocialFundCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();

  return (
    <CalculatorArticle lastUpdated="2026-03-23">
      <ArticleSection titleKey="socialfund_rates_title">
        <p className="mb-4 leading-relaxed text-gray-700">
          {t('socialfund_rates_intro')}
        </p>
        <p className="leading-relaxed text-gray-700">
          {t('socialfund_rates_employer')}
        </p>
      </ArticleSection>

      <ArticleSection titleKey="socialfund_categories_title">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-green-50 p-4">
            <h4 className="mb-2 font-semibold text-sm">{t('socialfund_reduced_mode')}</h4>
            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
              <li>{t('socialfund_reduced_employer_rate')}</li>
              <li>{t('socialfund_reduced_breakdown')}</li>
              <li>{t('socialfund_reduced_applies')}</li>
            </ul>
          </div>
          <div className="rounded-lg bg-red-50 p-4">
            <h4 className="mb-2 font-semibold text-sm">{t('socialfund_standard_mode')}</h4>
            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
              <li>{t('socialfund_standard_employer_rate')}</li>
              <li>{t('socialfund_standard_breakdown')}</li>
              <li>{t('socialfund_standard_applies')}</li>
            </ul>
          </div>
        </div>
      </ArticleSection>

      <ArticleSection titleKey="socialfund_shows_title">
        <ul className="list-disc space-y-2 pl-6 text-sm text-gray-700">
          <li>{t('socialfund_shows_1')}</li>
          <li>{t('socialfund_shows_2')}</li>
          <li>{t('socialfund_shows_3')}</li>
          <li>{t('socialfund_shows_4')}</li>
        </ul>
      </ArticleSection>

      <ArticleSection titleKey="socialfund_note_title">
        <p className="text-sm text-gray-700">
          {t('socialfund_note_text')}
        </p>
      </ArticleSection>

      <div className="mt-8 rounded-lg border border-red-200 bg-gradient-to-r from-red-50 to-red-100 p-6">
        <p className="mb-2 text-sm text-gray-600">{t('socialfund_source_label')}</p>
        <p className="text-xs text-gray-500">
          {t('socialfund_source_text')}
        </p>
      </div>
    </CalculatorArticle>
  );
};
