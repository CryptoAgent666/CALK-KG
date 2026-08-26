import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { History, Smartphone, TrendingUp, Wrench, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import SchemaMarkup from '../components/SchemaMarkup';
import HreflangTags from '../components/HreflangTags';
import { useLanguage } from '../contexts/LanguageContext';
import type { TranslationKey } from '../i18n';
import { generateBreadcrumbSchema } from '../utils/schemaGenerator';
import { SITE_UPDATES, type SiteUpdateType } from '../data/siteUpdates';

const MONTHS_RU_GENITIVE = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

// Кыргызская дата пишется так же, как в политике конфиденциальности:
// «2026-жылдын 18-августу». Названия месяцев на сайте везде русскоязычные
// (см. MONTHS_KY в utils/dateFormatter.ts) — не расходимся с ними и здесь.
const MONTHS_KY_NOMINATIVE = [
  'январы', 'февралы', 'марты', 'апрели', 'майы', 'июну',
  'июлу', 'августу', 'сентябры', 'октябры', 'ноябры', 'декабры'
];

const formatUpdateDate = (iso: string, language: 'ru' | 'ky'): string => {
  const [year, month, day] = iso.split('-');
  const monthIndex = Number(month) - 1;

  return language === 'ky'
    ? `${year}-жылдын ${Number(day)}-${MONTHS_KY_NOMINATIVE[monthIndex]}`
    : `${Number(day)} ${MONTHS_RU_GENITIVE[monthIndex]} ${year}`;
};

const TYPE_STYLE: Record<
  SiteUpdateType,
  { badge: string; icon: React.ElementType; dot: string; labelKey: TranslationKey }
> = {
  app: { badge: 'bg-violet-100 text-violet-800', icon: Smartphone, dot: 'bg-violet-500', labelKey: 'updates_type_app' },
  rate: { badge: 'bg-red-100 text-red-800', icon: TrendingUp, dot: 'bg-red-500', labelKey: 'updates_type_rate' },
  fix: { badge: 'bg-amber-100 text-amber-800', icon: Wrench, dot: 'bg-amber-500', labelKey: 'updates_type_fix' },
  feature: { badge: 'bg-emerald-100 text-emerald-800', icon: Sparkles, dot: 'bg-emerald-500', labelKey: 'updates_type_feature' },
};

const UpdatesPage = () => {
  const { t, language, getLocalizedPath } = useLanguage();

  const canonicalUrl = language === 'ky' ? 'https://calk.kg/ky/updates/' : 'https://calk.kg/updates/';

  // Заголовок и описание проставляются императивно, как в AboutPage/SitemapPage.
  // Разметку <head> для поисковиков отдаёт пререндер (scripts/generate-static-html.js);
  // react-helmet-async в рантайме на этом сайте ничего в <head> не добавляет (по той же
  // причине HreflangTags давно сделан no-op), поэтому при переходе внутри SPA без этого
  // эффекта во вкладке остался бы заголовок предыдущей страницы.
  React.useEffect(() => {
    document.title = t('updates_page_title');
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('updates_page_description'));
    }
  }, [t]);


  // dateModified берём из САМОЙ СВЕЖЕЙ записи журнала, а не из new Date().
  // Ровно эту ошибку — «дата свежести, которая обновляется сама» — мы чинили
  // 18.08.2026 на 15 калькуляторах; повторять её на странице про честность
  // данных было бы смешно. Поэтому generateWebPageSchema здесь не используется.
  const latestDate = SITE_UPDATES.reduce(
    (latest, update) => (update.date > latest ? update.date : latest),
    SITE_UPDATES[0]?.date ?? '',
  );

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: t('updates_page_title'),
      description: t('updates_page_description'),
      url: canonicalUrl,
      inLanguage: language === 'ky' ? 'ky-KG' : 'ru-RU',
      dateModified: latestDate,
      isPartOf: { '@type': 'WebSite', name: 'Calk.KG', url: 'https://calk.kg' },
      publisher: { '@type': 'Organization', name: 'Calk.KG', url: 'https://calk.kg' },
    },
    generateBreadcrumbSchema([
      { name: t('nav_home'), url: 'https://calk.kg' },
      { name: t('nav_updates'), url: canonicalUrl },
    ]),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{t('updates_page_title')}</title>
        <meta name="description" content={t('updates_page_description')} />
        <meta property="og:title" content={t('updates_page_title')} />
        <meta property="og:description" content={t('updates_page_description')} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/home.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? 'ky_KG' : 'ru_RU'} />
        <meta property="og:site_name" content="Calk.KG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('updates_page_title')} />
        <meta name="twitter:description" content={t('updates_page_description')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/home.png" />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <HreflangTags path="/updates" />
      {schemas.map((schema, index) => (
        <SchemaMarkup key={index} schema={schema} />
      ))}

      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="flex items-center space-x-3 mb-5">
            <div className="bg-white/20 p-3 rounded-xl">
              <History className="h-8 w-8" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold">{t('updates_hero_title')}</h1>
          </div>
          <p className="text-red-50 text-lg leading-relaxed max-w-2xl">
            {t('updates_hero_subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 mb-10 flex items-start space-x-3">
          <ShieldCheck className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
          <p className="text-gray-700 leading-relaxed">{t('updates_intro')}</p>
        </div>

        <ol className="relative border-l-2 border-gray-200 ml-3 sm:ml-4 space-y-8">
          {SITE_UPDATES.map((update, index) => {
            const style = TYPE_STYLE[update.type];
            const Icon = style.icon;
            const text = language === 'ky' ? update.ky : update.ru;

            return (
              <li key={`${update.date}-${index}`} className="ml-6 sm:ml-8">
                <span
                  className={`absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-gray-50 ${style.dot}`}
                  aria-hidden="true"
                />
                <article className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-sm">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${style.badge}`}>
                      <Icon className="h-3.5 w-3.5" />
                      {t(style.labelKey)}
                    </span>
                    <time dateTime={update.date} className="text-sm text-gray-500">
                      {formatUpdateDate(update.date, language)}
                    </time>
                  </div>

                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 leading-snug">
                    {text.title}
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{text.description}</p>

                  {update.link && (
                    <Link
                      to={getLocalizedPath(update.link)}
                      className="inline-flex items-center gap-1.5 mt-4 text-red-600 hover:text-red-700 font-medium hover:underline"
                    >
                      {t('updates_open_calculator')}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </article>
              </li>
            );
          })}
        </ol>

        <div className="mt-12 bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('updates_note_title')}</h2>
          <p className="text-gray-700 leading-relaxed">{t('updates_note_text')}</p>
        </div>
      </div>
    </div>
  );
};

export default UpdatesPage;
