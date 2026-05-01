import React from 'react';
import { CalculatorArticle, ArticleSection } from './CalculatorArticle';
import { useLanguage } from '../contexts/LanguageContext';

export const PassportCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();

  return (
    <CalculatorArticle lastUpdated="2026-03-23">
      <ArticleSection titleKey="passport_brief_title">
        <p className="mb-4 leading-relaxed text-gray-700">
          {t('passport_brief_intro')}
        </p>
        <p className="leading-relaxed text-gray-700">
          {t('passport_brief_urgent')}
        </p>
      </ArticleSection>

      <ArticleSection titleKey="passport_key_amounts_title">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-blue-50 p-4">
            <h4 className="mb-3 font-semibold text-sm">{t('passport_id_card')}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t('passport_id_first_standard')}</span>
                <strong>1 103 {t('passport_som')}</strong>
              </div>
              <div className="flex justify-between">
                <span>{t('passport_id_exchange')}</span>
                <strong>1 868 {t('passport_som')}</strong>
              </div>
              <div className="flex justify-between">
                <span>{t('passport_id_loss')}</span>
                <strong>2 068 {t('passport_som')}</strong>
              </div>
              <div className="flex justify-between">
                <span>{t('passport_id_most_urgent')}</span>
                <strong>2 672-3 637 {t('passport_som')}</strong>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-red-50 p-4">
            <h4 className="mb-3 font-semibold text-sm">{t('passport_foreign')}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t('passport_foreign_standard')}</span>
                <strong>2 981 {t('passport_som')}</strong>
              </div>
              <div className="flex justify-between">
                <span>{t('passport_foreign_name_change')}</span>
                <strong>3 081 {t('passport_som')}</strong>
              </div>
              <div className="flex justify-between">
                <span>{t('passport_foreign_loss')}</span>
                <strong>3 181 {t('passport_som')}</strong>
              </div>
              <div className="flex justify-between">
                <span>{t('passport_foreign_most_urgent')}</span>
                <strong>4 550-4 750 {t('passport_som')}</strong>
              </div>
            </div>
          </div>
        </div>
      </ArticleSection>

      <ArticleSection titleKey="passport_considerations_title">
        <ul className="list-disc space-y-2 pl-6 text-sm text-gray-700">
          <li>{t('passport_consideration_1')}</li>
          <li>{t('passport_consideration_2')}</li>
          <li>{t('passport_consideration_3')}</li>
        </ul>
      </ArticleSection>

      <ArticleSection titleKey="passport_where_to_check_title">
        <p className="text-sm text-gray-700">
          {t('passport_where_to_check_text')}
        </p>
      </ArticleSection>

      <div className="mt-8 rounded-lg border border-red-200 bg-gradient-to-r from-red-50 to-red-100 p-6">
        <p className="mb-2 text-sm text-gray-600">{t('passport_source_label')}</p>
        <p className="text-xs text-gray-500">
          {t('passport_source_text')}
        </p>
      </div>
    </CalculatorArticle>
  );
};
