import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { gzipSync, brotliCompressSync, constants as zlibConstants } from 'zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');
const srcDir = join(__dirname, '..', 'src');
const publicDir = join(__dirname, '..', 'public');
const ogDir = join(publicDir, 'og-images');

const appPath = join(srcDir, 'App.tsx');
// Серверный бандл страниц: `vite build --ssr src/entry-server.tsx` (шаг npm run build).
const ssrEntryPath = join(__dirname, '..', 'dist-ssr', 'entry-server.js');
const translationsPath = join(srcDir, 'i18n', 'translations.ts');

const languages = [
  { code: 'ru', prefix: '', ogLocale: 'ru_RU' },
  { code: 'ky', prefix: '/ky', ogLocale: 'ky_KG' }
];

// Overrides ONLY for calculators whose translation key does NOT follow the
// default normalization (slug.replace('-', '_')).
// Default: property-tax → property_tax_calc_title (matches translations).
const slugOverrides = {
  'crop-yield': 'crop_calc',
  'rental': 'rent_calc',
  'sick-leave': 'sick_calc',
  'sewing-cost': 'sewingcost',
  'money-transfer': 'moneytransfer',
  'currency-exchange': 'currency',
  'mobile-tariffs': 'mobiletariffs',
  'family-benefit': 'familybenefit',
  'traffic-fines': 'trafficfines',
  'taxi-tax': 'taxitax',
  // Removed: property-tax, single-tax, social-fund — default normalization works for them.
};

// Calculator slug -> category mapping for breadcrumbs and schemas
const calculatorCategories = {
  'construction': { ru: 'Строительство', ky: 'Курулуш', cat: 'construction' },
  'fuel': { ru: 'Автомобили', ky: 'Автоунаа', cat: 'auto' },
  'sick-leave': { ru: 'Социальные выплаты', ky: 'Социалдык төлөмдөр', cat: 'social' },
  'scholarship': { ru: 'Образование', ky: 'Билим берүү', cat: 'social' },
  'rental': { ru: 'Недвижимость', ky: 'Кыймылсыз мүлк', cat: 'construction' },
  'crop-yield': { ru: 'Сельское хозяйство', ky: 'Айыл чарба', cat: 'other' },
  'currency-exchange': { ru: 'Финансы', ky: 'Каржы', cat: 'finance' },
  'money-transfer': { ru: 'Финансы', ky: 'Каржы', cat: 'finance' },
  'mobile-tariffs': { ru: 'Финансы', ky: 'Каржы', cat: 'finance' },
  'loan': { ru: 'Финансы', ky: 'Каржы', cat: 'finance' },
  'mortgage': { ru: 'Финансы', ky: 'Каржы', cat: 'finance' },
  'deposit': { ru: 'Финансы', ky: 'Каржы', cat: 'finance' },
  'salary': { ru: 'Финансы', ky: 'Каржы', cat: 'finance' },
  'single-tax': { ru: 'Финансы', ky: 'Каржы', cat: 'finance' },
  'social-fund': { ru: 'Финансы', ky: 'Каржы', cat: 'finance' },
  'pension': { ru: 'Финансы', ky: 'Каржы', cat: 'finance' },
  'auto-loan': { ru: 'Автомобили', ky: 'Автоунаа', cat: 'auto' },
  'customs': { ru: 'Автомобили', ky: 'Автоунаа', cat: 'auto' },
  'electricity': { ru: 'Коммунальные', ky: 'Коммуналдык', cat: 'utilities' },
  'water': { ru: 'Коммунальные', ky: 'Коммуналдык', cat: 'utilities' },
  'gas': { ru: 'Коммунальные', ky: 'Коммуналдык', cat: 'utilities' },
  'heating': { ru: 'Коммунальные', ky: 'Коммуналдык', cat: 'utilities' },
  'property-tax': { ru: 'Финансы', ky: 'Каржы', cat: 'finance' },
  'alimony': { ru: 'Социальные', ky: 'Социалдык', cat: 'social' },
  'family-benefit': { ru: 'Социальные выплаты', ky: 'Социалдык төлөмдөр', cat: 'social' },
  'patent': { ru: 'Финансы', ky: 'Каржы', cat: 'finance' },
  'traffic-fines': { ru: 'Автомобили', ky: 'Автоунаа', cat: 'auto' },
  'zakat': { ru: 'Разное', ky: 'Башка', cat: 'other' },
  'calorie': { ru: 'Разное', ky: 'Башка', cat: 'other' },
  'taxi-tax': { ru: 'Финансы', ky: 'Каржы', cat: 'finance' },
  'passport': { ru: 'Разное', ky: 'Башка', cat: 'other' },
  'sewing-cost': { ru: 'Разное', ky: 'Башка', cat: 'other' },
  'housing': { ru: 'Коммунальные', ky: 'Коммуналдык', cat: 'utilities' },
  'wedding': { ru: 'Разное', ky: 'Башка', cat: 'other' }
};

const staticMetaKeys = {
  about: { titleKey: 'about_page_title', descriptionKey: 'about_page_description' },
  contact: { titleKey: 'contact_title', descriptionKey: 'contact_description' },
  'privacy-policy': { titleKey: 'pp_title', descriptionKey: 'privacy_policy_description' },
  'terms-of-service': { titleKey: 'tos_title', descriptionKey: 'terms_of_service_description' },
  disclaimer: { titleKey: 'disclaimer_title', descriptionKey: 'disclaimer_description' },
  sitemap: { titleKey: 'sitemap_page_title', descriptionKey: 'sitemap_meta_description' },
  updates: { titleKey: 'updates_page_title', descriptionKey: 'updates_page_description' }
};

const DEFAULT_HOME_DESCRIPTION_RU = 'Более 35 бесплатных калькуляторов для жителей Кыргызстана: зарплата, кредиты, ипотека, налоги, коммунальные услуги. Точные расчеты по законам КР.';

const loadTranslations = () => {
  const source = readFileSync(translationsPath, 'utf-8');
  const sanitized = source
    .replace(/export const translations\s*=\s*/, 'return ')
    .replace(/export type[\s\S]*$/, '');
  return new Function(sanitized)();
};

const translations = loadTranslations();

const getTranslation = (lang, key, fallback = '') =>
  translations?.[lang]?.[key] ?? translations?.ru?.[key] ?? fallback;

const findTranslationKey = (base, suffixes) =>
  suffixes
    .map(suffix => `${base}${suffix}`)
    .find(key => translations?.ru?.[key] || translations?.ky?.[key]);

const getCalculatorMeta = (slug, lang) => {
  const overrideBase = slugOverrides[slug];
  const defaultBase = slug.replace(/-/g, '_');
  // Try both override base AND default normalized slug — some translations use
  // mixed conventions (e.g. currency_faq_q1 but currency_exchange_title).
  const bases = overrideBase && overrideBase !== defaultBase
    ? [overrideBase, defaultBase]
    : [defaultBase];

  const tryFindKey = (suffixes) => {
    for (const b of bases) {
      const key = findTranslationKey(b, suffixes);
      if (key) return key;
    }
    return null;
  };

  const titleKey = tryFindKey(['_calc_title', '_title']);
  const descriptionKey = tryFindKey(['_calc_description', '_description']);
  const base = overrideBase || defaultBase;

  if (!titleKey) {
    console.warn(`[prerender] Missing title key for calculator: ${slug}`);
  }
  if (!descriptionKey) {
    console.warn(`[prerender] Missing description key for calculator: ${slug}`);
  }

  const title = titleKey
    ? getTranslation(lang, titleKey, getTranslation('ru', titleKey, slug))
    : `${slug} - Calk.KG`;
  const description = descriptionKey
    ? getTranslation(lang, descriptionKey, getTranslation('ru', descriptionKey, DEFAULT_HOME_DESCRIPTION_RU))
    : DEFAULT_HOME_DESCRIPTION_RU;

  return { title, description };
};

const getStaticMeta = (slug, lang) => {
  const keys = staticMetaKeys[slug];
  if (!keys) {
    return { title: 'Calk.KG', description: DEFAULT_HOME_DESCRIPTION_RU };
  }
  return {
    title: getTranslation(lang, keys.titleKey, 'Calk.KG'),
    description: getTranslation(lang, keys.descriptionKey, DEFAULT_HOME_DESCRIPTION_RU)
  };
};

const getHomeMeta = (lang) => {
  const title = `${getTranslation(lang, 'site_name', 'Calk.KG')} - ${getTranslation(lang, 'site_tagline', 'Калькуляторы Кыргызстана')}`;
  const description = getTranslation(lang, 'hero_description', DEFAULT_HOME_DESCRIPTION_RU);
  return { title, description };
};

const getOgImage = (slug) => {
  if (!slug) {
    return 'https://calk.kg/og-images/home.png';
  }
  // Prefer PNG for social media compatibility (Facebook, Twitter, LinkedIn)
  const pngFilename = `${slug}.png`;
  const pngPath = join(ogDir, pngFilename);
  if (existsSync(pngPath)) {
    return `https://calk.kg/og-images/${pngFilename}`;
  }
  // Fallback to SVG if PNG not available
  const svgFilename = `${slug}.svg`;
  const svgPath = join(ogDir, svgFilename);
  return existsSync(svgPath)
    ? `https://calk.kg/og-images/${svgFilename}`
    : 'https://calk.kg/og-images/home.png';
};

const getRoutesFromApp = () => {
  const source = readFileSync(appPath, 'utf-8');
  const matches = [...source.matchAll(/path:\s*'([^']+)'/g)].map(match => match[1]);
  const calculatorPaths = [...new Set(matches.filter(path => path.startsWith('calculator/')))];
  const staticPaths = [...new Set(matches.filter(path => !path.startsWith('calculator/')))];

  return { calculatorPaths, staticPaths };
};

const buildRoutes = () => {
  const { calculatorPaths, staticPaths } = getRoutesFromApp();
  const baseRoutes = [
    { path: '/', type: 'home', slug: 'home' },
    ...staticPaths.map(path => ({ path: `/${path}`, type: 'static', slug: path })),
    ...calculatorPaths.map(path => {
      const slug = path.replace('calculator/', '');
      return { path: `/${path}`, type: 'calculator', slug };
    })
  ];

  return languages.flatMap(language => baseRoutes.map(route => {
    const fullPath = route.path === '/'
      ? (language.prefix || '/')
      : `${language.prefix}${route.path}`;

    return {
      ...route,
      path: fullPath,
      lang: language.code,
      ogLocale: language.ogLocale
    };
  }));
};

// --- FAQ extraction helpers ---

function extractFaqs(base, lang) {
  const faqs = [];
  for (let i = 1; i <= 10; i++) {
    const q = getTranslation(lang, `${base}_faq_q${i}`, '');
    const a = getTranslation(lang, `${base}_faq_a${i}`, '');
    if (q && a) {
      faqs.push({ question: q, answer: a });
    }
  }
  return faqs;
}

// --- JSON-LD schema generators (mirroring src/utils/schemaGenerator.ts) ---

function escapeJsonString(str) {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

function buildBreadcrumbSchema(items) {
  // Skip emission when items are missing required fields or there are < 2
  // levels — Google Search Console flags such schemas as "Missing field
  // 'itemListElement'" because a single-item BreadcrumbList carries no
  // navigation hierarchy.
  const validItems = (items || []).filter(i => i && i.name && i.url);
  if (validItems.length < 2) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": validItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

function buildFAQPageSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

function buildHowToSchema({ name, description, url, language, slug }) {
  // Generic HowTo steps applicable to all calculators.
  // For more specific steps, override in i18n with keys: `${slug}_howto_step_N`.
  const stepsRu = [
    { name: 'Введите данные', text: `Заполните поля в калькуляторе "${name}" актуальными значениями.` },
    { name: 'Получите расчёт', text: 'Калькулятор автоматически рассчитает результат на основе введённых данных.' },
    { name: 'Изучите детализацию', text: 'Посмотрите подробную разбивку расчёта со всеми коэффициентами и ставками.' },
    { name: 'Сохраните или поделитесь', text: 'Скопируйте результат, распечатайте или поделитесь ссылкой через iOS/Android share.' }
  ];
  const stepsKy = [
    { name: 'Маалыматтарды киргизиңиз', text: `"${name}" калькуляторунун талааларын актуалдуу маанилер менен толтуруңуз.` },
    { name: 'Эсептөөнү алыңыз', text: 'Калькулятор киргизилген маалыматтардын негизинде натыйжаны автоматтык түрдө эсептейт.' },
    { name: 'Толук маалыматты карап чыгыңыз', text: 'Бардык коэффициенттер жана ставкалар менен эсептөөнүн толук маалыматын караңыз.' },
    { name: 'Сактаңыз же бөлүшүңүз', text: 'Натыйжаны көчүрүңүз, басып чыгарыңыз же iOS/Android share аркылуу шилтеме менен бөлүшүңүз.' }
  ];

  const steps = language === 'ky' ? stepsKy : stepsRu;

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "inLanguage": language || "ru",
    "totalTime": "PT1M",
    "tool": {
      "@type": "HowToTool",
      "name": name,
      "url": url
    },
    "step": steps.map((step, idx) => ({
      "@type": "HowToStep",
      "position": idx + 1,
      "name": step.name,
      "text": step.text,
      "url": `${url}#step-${idx + 1}`
    }))
  };
}

function buildWebPageSchema({ name, description, url, language, breadcrumb }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": name,
    "description": description,
    "url": url,
    "inLanguage": language || "ru",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Calk.KG",
      "url": "https://calk.kg"
    },
    "author": {
      "@type": "Organization",
      "name": "Calk.KG",
      "url": "https://calk.kg"
    },
    "dateModified": new Date().toISOString().split('T')[0],
    "breadcrumb": breadcrumb ? { "@id": `${url}#breadcrumb` } : undefined,
    "mainEntity": {
      "@type": "Thing",
      "name": name,
      "description": description
    }
  };
}

function buildCalculatorSchema({ name, description, url, language, category }) {
  return {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "Calculator"],
    "name": name,
    "description": description,
    "url": url,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Any",
    "browserRequirements": "Requires JavaScript",
    "inLanguage": language || "ru",
    "isAccessibleForFree": true,
    "creator": {
      "@type": "Organization",
      "name": "Calk.KG",
      "url": "https://calk.kg"
    },
    "audience": {
      "@type": "Audience",
      "geographicArea": {
        "@type": "Country",
        "name": "Кыргызстан"
      }
    },
    "about": {
      "@type": "Thing",
      "name": category
    },
    "usageInfo": url,
    "softwareVersion": "2026.1",
    "dateModified": new Date().toISOString().split('T')[0]
  };
}

function jsonLdScriptTag(schema) {
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

// --- Content & schema injection ---

const decodeEntities = (str) => str
  .replace(/&nbsp;/g, ' ')
  .replace(/&quot;/g, '"')
  .replace(/&#x27;|&#39;/g, "'")
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&amp;/g, '&');

const normalizeText = (str) => decodeEntities(String(str).replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

// Видимый текст пререндеренной страницы — для сверки FAQ-разметки с контентом.
const visibleTextOf = (appHtml) => normalizeText(
  appHtml.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ')
);

function injectCalculatorSchemas(html, route, visibleText) {
  if (route.type !== 'calculator') return html;

  const base = slugOverrides[route.slug] || route.slug.replace(/-/g, '_');
  const lang = route.lang;
  const pathForUrl = route.path === '/' ? '' : route.path;
  const pageUrl = `https://calk.kg${pathForUrl}`;
  const langPrefix = lang === 'ky' ? '/ky' : '';

  const calcTitle = getTranslation(lang, `${base}_calc_title`, '') ||
                    getTranslation(lang, `${base}_title`, route.slug);
  const calcDescription = getTranslation(lang, `${base}_calc_description`, '') ||
                          getTranslation(lang, `${base}_description`, '');
  // FAQ-разметка допустима только для вопросов, которые видны на странице. FAQ здесь
  // из translations.ts, а страница рендерится из translations-ru/ky — тексты
  // расходятся, поэтому оставляем лишь пары, найденные в пререндеренном HTML.
  const faqs = extractFaqs(base, lang).filter(faq =>
    visibleText.includes(normalizeText(faq.question)) &&
    visibleText.includes(normalizeText(faq.answer).slice(0, 80))
  );
  const catInfo = calculatorCategories[route.slug];
  const categoryName = catInfo ? catInfo[lang] || catInfo.ru : (lang === 'ky' ? 'Башка' : 'Разное');

  // --- Inject JSON-LD schemas into <head> ---
  const schemas = [];

  // 1. BreadcrumbList
  const homeName = lang === 'ky' ? 'Башкы бет' : 'Главная';
  const homeUrl = langPrefix ? `https://calk.kg${langPrefix}` : 'https://calk.kg';
  const categorySuffix = catInfo ? catInfo.cat : 'all';
  const categoryUrl = `${homeUrl}?category=${categorySuffix}`;
  schemas.push(buildBreadcrumbSchema([
    { name: homeName, url: homeUrl },
    { name: categoryName, url: categoryUrl },
    { name: calcTitle, url: pageUrl }
  ]));

  // 2. FAQPage (only if FAQs exist)
  if (faqs.length > 0) {
    schemas.push(buildFAQPageSchema(faqs));
  }

  // 3. WebPage schema — required by SEO audits for content pages
  schemas.push(buildWebPageSchema({
    name: calcTitle,
    description: calcDescription,
    url: pageUrl,
    language: lang,
    breadcrumb: true
  }));

  // 4. HowTo schema — for AI search citations ("Как рассчитать...")
  schemas.push(buildHowToSchema({
    name: calcTitle,
    description: calcDescription,
    url: pageUrl,
    language: lang,
    slug: route.slug
  }));

  // 5. Calculator schema
  schemas.push(buildCalculatorSchema({
    name: calcTitle,
    description: calcDescription,
    url: pageUrl,
    language: lang,
    category: categoryName
  }));

  // Strip existing JSON-LD schemas (React + template) to prevent duplicates
  // before injecting authoritative SSG schemas. We keep ONE WebSite + Organization
  // schema (these are not page-specific) by removing only the duplicated types.
  const PAGE_SCHEMA_TYPES = ['BreadcrumbList', 'FAQPage', 'WebPage', 'HowTo', 'WebApplication', 'Calculator', 'SoftwareApplication'];
  html = html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>\s*/g, (match, body) => {
    try {
      const parsed = JSON.parse(body.trim());
      const items = Array.isArray(parsed) ? parsed : [parsed];
      const types = items.map(i => Array.isArray(i['@type']) ? i['@type'] : [i['@type']]).flat();
      // Drop if this block contains any of our page-specific types (we'll re-inject)
      if (types.some(t => PAGE_SCHEMA_TYPES.includes(t))) {
        return '';
      }
      return match;
    } catch (e) {
      // Malformed JSON-LD — keep it as-is to avoid breaking other tooling
      return match;
    }
  });

  // Filter nulls — some builders (e.g. buildBreadcrumbSchema) return null when
  // their input is malformed. Emitting `<script>null</script>` would create an
  // invalid JSON-LD block flagged by Google Search Console.
  const validSchemas = schemas.filter(s => s !== null && s !== undefined);
  const jsonLdBlock = validSchemas.map(s => `    ${jsonLdScriptTag(s)}`).join('\n');
  html = html.replace('</head>', `${jsonLdBlock}\n  </head>`);

  return html;
}

function generateHtml(templateHtml, route, appHtml) {
  let html = templateHtml;
  // Add trailing slash for calculator/static pages to match nginx behavior
  // (nginx 301-redirects /calculator/X to /calculator/X/)
  // Home and /ky stay as-is.
  const pathForUrl = route.path === '/' ? '' :
    (route.type === 'home' ? route.path :
      (route.path.endsWith('/') ? route.path : `${route.path}/`));

  let meta;
  if (route.type === 'home') {
    meta = getHomeMeta(route.lang);
  } else if (route.type === 'static') {
    meta = getStaticMeta(route.slug, route.lang);
  } else {
    meta = getCalculatorMeta(route.slug, route.lang);
  }

  // Ensure brand suffix is present in title for SEO consistency
  if (meta.title && !meta.title.includes('Calk.KG') && !meta.title.includes('Calk.kg')) {
    meta.title = `${meta.title} | Calk.KG`;
  }

  const ogImage = getOgImage(route.slug);

  // Escape HTML attribute values: double quotes inside the description (e.g. «"на
  // руки"») would otherwise terminate the attribute early. This previously truncated
  // salary's <meta description> after the first inner quote (48 bytes instead of ~199).
  const attrEscape = (s) =>
    String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  const safeTitle = attrEscape(meta.title);
  const safeDescription = attrEscape(meta.description);
  const safeOgImage = attrEscape(ogImage);

  if (/<html[^>]*lang=/.test(html)) {
    html = html.replace(/<html[^>]*lang="[^"]*"/, `<html lang="${route.lang}"`);
  } else {
    html = html.replace('<html', `<html lang="${route.lang}"`);
  }

  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${safeTitle}</title>`
  );

  html = html.replace(
    /<meta name="description" content=".*?".*?\/>/,
    `<meta name="description" content="${safeDescription}" />`
  );

  html = html
    .replace(/<meta property="og:[^"]+"[^>]*>\s*/g, '')
    .replace(/<meta name="twitter:[^"]+"[^>]*>\s*/g, '')
    .replace(/<link rel="canonical"[^>]*>\s*/g, '')
    .replace(/<link rel="alternate" hreflang="[^"]*"[^>]*>\s*/g, '');

  // Per-page hreflang URLs. langPath is the path WITHOUT /ky prefix.
  const langPath = route.lang === 'ky' && pathForUrl.startsWith('/ky')
    ? (pathForUrl.slice(3) || '')
    : pathForUrl;
  const ruHref = `https://calk.kg${langPath || ''}`;
  const kyHref = `https://calk.kg/ky${langPath || '/'}`;
  // Home /ky case: ensure /ky points to /ky (not /ky/)
  const kyHrefFinal = langPath === '' ? 'https://calk.kg/ky' : kyHref;

  // Alternate locale for og: ky pages list ru as alt and vice versa
  const ogLocaleAlt = route.ogLocale === 'ky_KG' ? 'ru_RU' : 'ky_KG';
  const ogTags = `
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:url" content="https://calk.kg${pathForUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${safeOgImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${safeTitle}" />
    <meta property="og:locale" content="${route.ogLocale}" />
    <meta property="og:locale:alternate" content="${ogLocaleAlt}" />
    <meta property="og:site_name" content="Calk.KG" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <meta name="twitter:image" content="${safeOgImage}" />
    <meta name="twitter:image:alt" content="${safeTitle}" />
    <link rel="canonical" href="https://calk.kg${pathForUrl}" />
    <link rel="alternate" hreflang="ru" href="${ruHref}" />
    <link rel="alternate" hreflang="ky" href="${kyHrefFinal}" />
    <link rel="alternate" hreflang="x-default" href="${ruHref}" />
    <meta name="apple-itunes-app" content="app-id=6771220038" />`;

  // apple-itunes-app — нативный Smart App Banner Safari на iOS: узкая полоса
  // над страницей со ссылкой в App Store. Живёт только здесь, в пререндере, а он
  // запускается лишь в веб-сборке (`npm run build`); `build:app` его не вызывает,
  // поэтому внутрь приложения тег не попадает.
  html = html.replace(
    '</head>',
    `${ogTags}\n  </head>`
  );
  
  // Тело страницы — настоящий рендер React (dist-ssr). Всё, что шаблон или
  // статический плагин vite положили в #root, заменяется целиком. main.tsx
  // удаляет #static-content до монтирования приложения.
  const withBody = html.replace(
    /<div id="root">[\s\S]*<\/div>(\s*<\/body>)/,
    (_match, bodyEnd) => `<div id="root"><div id="static-content">${appHtml}</div></div>${bodyEnd}`
  );
  if (withBody === html) {
    throw new Error(`[prerender] #root not found in template for ${route.path}`);
  }
  html = withBody;

  html = injectCalculatorSchemas(html, route, visibleTextOf(appHtml));

  return html;
}

// Готовые .gz/.br рядом с HTML: vite-plugin-compression сжимает файлы ДО этого
// скрипта, и без перезаписи рядом лежали бы архивы старой версии страницы.
function writeHtml(filePath, html) {
  const buffer = Buffer.from(html, 'utf-8');
  writeFileSync(filePath, buffer);
  writeFileSync(`${filePath}.gz`, gzipSync(buffer, { level: 9 }));
  writeFileSync(`${filePath}.br`, brotliCompressSync(buffer, {
    params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 11 }
  }));
}

async function generateStaticHtml() {
  if (!existsSync(ssrEntryPath)) {
    throw new Error('[prerender] dist-ssr/entry-server.js not found — run: vite build --ssr src/entry-server.tsx');
  }
  const { render } = await import(pathToFileURL(ssrEntryPath).href);
  const templateHtml = readFileSync(join(distDir, 'index.html'), 'utf-8');
  const routes = buildRoutes();

  console.log('Generating static HTML files...\n');

  for (const route of routes) {
    // Рендерим по каноническому URL (со слешем), как его открывает браузер.
    const renderUrl = route.type === 'home' || route.path.endsWith('/') ? route.path : `${route.path}/`;
    const appHtml = await render(renderUrl);
    // Гарды пререндера: нулевые байты (баг потокового рендера React 18 на кириллице)
    // и спиннер Suspense вместо страницы не должны уйти на сайт.
    if (appHtml.includes('\u0000')) {
      throw new Error(`[prerender] NUL bytes in rendered HTML for ${renderUrl}`);
    }
    if (appHtml.includes('animate-spin rounded-full h-16')) {
      throw new Error(`[prerender] Suspense fallback instead of page content for ${renderUrl}`);
    }
    const html = generateHtml(templateHtml, route, appHtml);
    const normalizedPath = route.path.replace(/^\/+/, '');

    if (!normalizedPath) {
      writeHtml(join(distDir, 'index.html'), html);
      console.log(`  / -> dist/index.html`);
      continue;
    }

    const dirPath = join(distDir, normalizedPath);
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
    writeHtml(join(dirPath, 'index.html'), html);
    console.log(`  ${route.path} -> dist/${normalizedPath}/index.html`);
  }

  console.log(`\nGenerated ${routes.length} static HTML files.`);
}

await generateStaticHtml();
