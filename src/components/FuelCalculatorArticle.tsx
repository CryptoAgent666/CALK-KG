import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CalculatorArticle, ArticleSection, ArticleSubsection, FAQItem } from './CalculatorArticle';

/**
 * Информационная статья для калькулятора расхода топлива
 * ПОЛНОСТЬЮ ПЕРЕВЕДЕНА на кыргызский
 */
export const FuelCalculatorArticle: React.FC = () => {
  const { t } = useLanguage();

  return (
      <CalculatorArticle lastUpdated="2026-07-03" slug="fuel">
      {/* Актуальные цены на топливо */}
      <ArticleSection title={t('fuel_article_prices_title')}>
        <p>{t('fuel_article_prices_intro')}</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>{t('fuel_benzin_92')}</strong> — <strong>79.9 {t('fuel_som_per_liter')}</strong></li>
          <li><strong>{t('fuel_benzin_95')}</strong> — <strong>88.5 {t('fuel_som_per_liter')}</strong></li>
          <li><strong>{t('fuel_diesel')}</strong> — <strong>93.9 {t('fuel_som_per_liter')}</strong></li>
          <li><strong>{t('fuel_gas')}</strong> — <strong>45.8 {t('fuel_som_per_liter')}</strong></li>
        </ul>
        <p className="mt-4">
          <strong>{t('fuel_important')}</strong> {t('fuel_regions_note')}
        </p>
      </ArticleSection>

      {/* Как рассчитать расход топлива */}
      <ArticleSection title={t('fuel_article_howto_title')}>
        <p>{t('fuel_howto_intro')}</p>
        
        <ArticleSubsection title={t('fuel_formula_title')}>
          <p className="font-mono bg-gray-100 p-3 rounded">
            <strong>{t('fuel_consumption')}</strong> = {t('fuel_formula_consumption')}
          </p>
        </ArticleSubsection>

        <ArticleSubsection title={t('fuel_example_title')}>
          <p>{t('fuel_example_text')}</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>{t('fuel_consumed')}</li>
            <li>{t('fuel_distance')}</li>
            <li>{t('fuel_result')} <strong>{t('fuel_result_value')}</strong></li>
          </ul>
        </ArticleSubsection>

        <ArticleSubsection title={t('fuel_cost_formula_title')}>
          <p className="font-mono bg-gray-100 p-3 rounded">
            {t('fuel_cost_formula')}
          </p>
        </ArticleSubsection>

        <ArticleSubsection title={t('fuel_cost_example_title')}>
          <p>{t('fuel_cost_example_text')}</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>{t('fuel_cost_need')} <strong>{t('fuel_cost_need_value')}</strong></li>
            <li>{t('fuel_cost_total')} <strong>{t('fuel_cost_total_value')}</strong></li>
          </ul>
        </ArticleSubsection>
      </ArticleSection>

      {/* Средний расход по типам авто */}
      <ArticleSection title={t('fuel_article_average_title')}>
        <p>{t('fuel_average_intro')}</p>
        
        <div className="mt-4">
          <h4 className="font-semibold mb-2">{t('fuel_average_subtitle')}</h4>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>{t('fuel_average_small_label')}</strong> {t('fuel_average_small_desc')}</li>
            <li><strong>{t('fuel_average_sedan_label')}</strong> {t('fuel_average_sedan_desc')}</li>
            <li><strong>{t('fuel_average_suv_label')}</strong> {t('fuel_average_suv_desc')}</li>
            <li><strong>{t('fuel_average_minivan_label')}</strong> {t('fuel_average_minivan_desc')}</li>
            <li><strong>{t('fuel_average_truck_label')}</strong> {t('fuel_average_truck_desc')}</li>
            <li><strong>{t('fuel_average_taxi_label')}</strong> {t('fuel_average_taxi_desc')}</li>
          </ul>
        </div>
      </ArticleSection>

      {/* Популярные маршруты */}
      <ArticleSection title={t('fuel_article_routes_title')}>
        <ArticleSubsection title={t('fuel_route_bishkek_osh')}>
          <p>{t('fuel_route_bishkek_osh_desc')}</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>{t('fuel_route_bishkek_osh_item_1')}</li>
            <li>{t('fuel_route_bishkek_osh_item_2')}</li>
            <li>{t('fuel_route_bishkek_osh_item_3')}</li>
          </ul>
        </ArticleSubsection>

        <ArticleSubsection title={t('fuel_route_bishkek_issykkul')}>
          <p>{t('fuel_route_bishkek_issykkul_desc')}</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>{t('fuel_route_bishkek_issykkul_item_1')}</li>
            <li>{t('fuel_route_bishkek_issykkul_item_2')}</li>
            <li>{t('fuel_route_bishkek_issykkul_item_3')}</li>
          </ul>
        </ArticleSubsection>

        <ArticleSubsection title={t('fuel_route_bishkek_talas')}>
          <p>{t('fuel_route_bishkek_talas_desc')}</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>{t('fuel_route_bishkek_talas_item_1')}</li>
            <li>{t('fuel_route_bishkek_talas_item_2')}</li>
            <li>{t('fuel_route_bishkek_talas_item_3')}</li>
          </ul>
        </ArticleSubsection>

        <ArticleSubsection title={t('fuel_route_bishkek_naryn')}>
          <p>{t('fuel_route_bishkek_naryn_desc')}</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>{t('fuel_route_bishkek_naryn_item_1')}</li>
            <li>{t('fuel_route_bishkek_naryn_item_2')}</li>
            <li>{t('fuel_route_bishkek_naryn_item_3')}</li>
          </ul>
        </ArticleSubsection>

        <ArticleSubsection title={t('fuel_route_bishkek_karakol')}>
          <p>{t('fuel_route_bishkek_karakol_desc')}</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>{t('fuel_route_bishkek_karakol_item_1')}</li>
            <li>{t('fuel_route_bishkek_karakol_item_2')}</li>
            <li>{t('fuel_route_bishkek_karakol_item_3')}</li>
          </ul>
        </ArticleSubsection>
      </ArticleSection>

      {/* Бензин vs Газ */}
      <ArticleSection title={t('fuel_article_gas_vs_benzin_title')}>
        <p>{t('fuel_gas_vs_intro')}</p>

        <ArticleSubsection title={t('fuel_gas_vs_example_title')}>
          <p><strong>{t('fuel_gas_vs_car1_label')}</strong> {t('fuel_gas_vs_car1_desc')}</p>
          <p><strong>{t('fuel_gas_vs_car2_label')}</strong> {t('fuel_gas_vs_car2_desc')}</p>
          
          <div className="mt-4">
            <p><strong>{t('fuel_gas_vs_trip_title')}</strong></p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>{t('fuel_gas_vs_trip_item_1')}</li>
              <li>{t('fuel_gas_vs_trip_item_2')}</li>
              <li><strong className="text-green-600">{t('fuel_gas_vs_trip_item_3')}</strong></li>
            </ul>
          </div>

          <div className="mt-4">
            <p><strong>{t('fuel_gas_vs_year_title')}</strong></p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>{t('fuel_gas_vs_year_item_1')}</li>
              <li>{t('fuel_gas_vs_year_item_2')}</li>
              <li><strong className="text-green-600">{t('fuel_gas_vs_year_item_3')}</strong></li>
            </ul>
          </div>

          <p className="mt-4">
            <strong>{t('fuel_gas_vs_conclusion_label')}</strong> {t('fuel_gas_vs_conclusion_text')}
          </p>
        </ArticleSubsection>
      </ArticleSection>

      {/* Советы по экономии */}
      <ArticleSection title={t('fuel_article_tips_title')}>
        <ol className="list-decimal pl-6 space-y-3">
          <li>{t('fuel_saving_tip_1')}</li>
          <li>{t('fuel_saving_tip_2')}</li>
          <li>{t('fuel_saving_tip_3')}</li>
          <li>{t('fuel_saving_tip_4')}</li>
          <li>{t('fuel_saving_tip_5')}</li>
          <li>{t('fuel_saving_tip_6')}</li>
          <li>{t('fuel_saving_tip_7')}</li>
          <li>{t('fuel_saving_tip_8')}</li>
          <li>{t('fuel_saving_tip_9')}</li>
          <li>{t('fuel_saving_tip_10')}</li>
        </ol>
      </ArticleSection>

      {/* FAQ */}
      <ArticleSection title={t('fuel_article_faq_title')}>
        <div className="space-y-4">
          <FAQItem question={t('fuel_faq_q1')} answer={t('fuel_faq_a1')} />
          <FAQItem question={t('fuel_faq_q2')} answer={t('fuel_faq_a2')} />
          <FAQItem question={t('fuel_faq_q3')} answer={t('fuel_faq_a3')} />
          <FAQItem question={t('fuel_faq_q4')} answer={t('fuel_faq_a4')} />
          <FAQItem question={t('fuel_faq_q5')} answer={t('fuel_faq_a5')} />
          <FAQItem question={t('fuel_faq_q6')} answer={t('fuel_faq_a6')} />
          <FAQItem question={t('fuel_faq_q7')} answer={t('fuel_faq_a7')} />
          <FAQItem question={t('fuel_faq_q8')} answer={t('fuel_faq_a8')} />
        </div>
      </ArticleSection>

      {/* Полезные ссылки */}
      <ArticleSection title={t('fuel_article_links_title')}>
        <ul className="list-disc pl-6 space-y-2">
          <li>{t('fuel_links_1')}</li>
          <li>{t('fuel_links_2')}</li>
          <li>{t('fuel_links_3')}</li>
        </ul>
        <p className="mt-6 font-semibold text-gray-900">
          {t('fuel_article_cta')}
        </p>
      </ArticleSection>
    </CalculatorArticle>
  );
};
