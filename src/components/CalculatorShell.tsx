import React from 'react';
import { Helmet } from 'react-helmet-async';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { AuthorByline } from './AuthorByline';
import GovSources from './GovSources';

interface CalculatorShellProps {
  /** Маршрут калькулятора: calculator/<slug>/ */
  slug: string;
  /** База ключей переводов: <base>_calc_title, <base>_calc_subtitle, <base>_calc_description, <base>_faq_qN/aN */
  base: string;
  icon: LucideIcon;
  /** Tailwind-классы градиента шапки, например 'from-teal-600 to-teal-700' */
  gradient: string;
  /** Дата последней проверки содержимого, YYYY-MM-DD (подпись «Проверено редакцией») */
  lastUpdated: string;
  faqCount?: number;
  children: React.ReactNode;
}

/**
 * Каркас страниц калькуляторов, добавленных с 28.09.2026. Общая шапка сайта и
 * хлебные крошки уже есть в CalculatorPageWrapper, поэтому здесь только hero,
 * содержимое, FAQ и блок источников. JSON-LD (Calculator, FAQPage, Breadcrumb)
 * вставляет пререндер из <base>_* ключей мастер-файла translations.ts.
 */
const CalculatorShell = ({ slug, base, icon: Icon, gradient, lastUpdated, faqCount = 0, children }: CalculatorShellProps) => {
  const { language, t } = useLanguage();
  const url = `https://calk.kg${language === 'ky' ? '/ky' : ''}/calculator/${slug}/`;
  const title = t(`${base}_calc_title` as any);
  const description = t(`${base}_calc_description` as any);
  const faqs = Array.from({ length: faqCount }, (_, i) => ({
    q: t(`${base}_faq_q${i + 1}` as any),
    a: t(`${base}_faq_a${i + 1}` as any)
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{`${title} | Calk.KG`}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`${title} | Calk.KG`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <link rel="canonical" href={url} />
      </Helmet>

      <section className={`bg-gradient-to-r ${gradient} text-white`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-lg shrink-0">
              <Icon className="h-8 w-8" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
              <p className="text-white/85 text-lg mt-2">{t(`${base}_calc_subtitle` as any)}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {children}

        {faqs.length > 0 && (
          <section aria-labelledby={`${slug}-faq`} className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
            <h2 id={`${slug}-faq`} className="text-2xl font-semibold text-gray-900 mb-6">{t('faq_title')}</h2>
            <div className="space-y-6">
              {faqs.map(faq => (
                <div key={faq.q}>
                  <h3 className="font-medium text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
          <AuthorByline lastUpdated={lastUpdated} />
          <GovSources slug={slug} />
        </div>
      </div>
    </div>
  );
};

export default CalculatorShell;
