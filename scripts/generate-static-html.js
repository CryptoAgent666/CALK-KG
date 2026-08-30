import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');
const srcDir = join(__dirname, '..', 'src');
const publicDir = join(__dirname, '..', 'public');
const ogDir = join(publicDir, 'og-images');

const appPath = join(srcDir, 'App.tsx');
const translationsPath = join(srcDir, 'i18n', 'translations.ts');

const languages = [
  { code: 'ru', prefix: '', ogLocale: 'ru_RU' },
  { code: 'ky', prefix: '/ky', ogLocale: 'ky_KG' }
];

// Overrides ONLY for calculators whose translation key does NOT follow the
// default normalization (slug.replace('-', '_')).
// Default: property-tax → property_tax_calc_title (matches translations).
// Gov-source mapping — must mirror src/data/govSources.ts to keep SSG content
// and React-rendered content in sync.
const GOV_SOURCES = {
  sti: { ru: ['Налоговая служба КР', 'sti.gov.kg'], ky: ['КРнын Салык кызматы', 'sti.gov.kg'] },
  sf: { ru: ['Социальный фонд КР', 'sf.gov.kg'], ky: ['КРнын Социалдык фонду', 'sf.gov.kg'] },
  mlsp: { ru: ['Министерство труда КР', 'mlsp.gov.kg'], ky: ['КРнын Эмгек министрлиги', 'mlsp.gov.kg'] },
  minfin: { ru: ['Министерство финансов КР', 'minfin.kg'], ky: ['КРнын Каржы министрлиги', 'minfin.kg'] },
  customs: { ru: ['Таможенная служба КР', 'customs.gov.kg'], ky: ['КРнын Бажы кызматы', 'customs.gov.kg'] },
  nbkr: { ru: ['Национальный банк КР', 'nbkr.kg'], ky: ['КРнын Улуттук банкы', 'nbkr.kg'] },
  toktom: { ru: ['Правовая база Токтом', 'toktom.kg'], ky: ['Токтом укуктук базасы', 'toktom.kg'] },
  stat: { ru: ['Нацстатком КР', 'stat.gov.kg'], ky: ['КРнын Улуттук статкомитети', 'stat.gov.kg'] },
  grs: { ru: ['Государственная регистрационная служба', 'grs.gov.kg'], ky: ['Мамлекеттик каттоо кызматы', 'grs.gov.kg'] },
  patrol: { ru: ['Минздрав КР', 'med.kg'], ky: ['КРнын Саламаттык сактоо министрлиги', 'med.kg'] }
};

const CALCULATOR_SOURCES = {
  'salary': ['sti', 'sf', 'mlsp', 'toktom'],
  'single-tax': ['sti', 'toktom'],
  'property-tax': ['sti', 'toktom'],
  'patent': ['sti', 'toktom'],
  'taxi-tax': ['sti', 'sf', 'toktom'],
  'loan': ['nbkr', 'toktom'],
  'mortgage': ['nbkr', 'toktom'],
  'auto-loan': ['nbkr', 'toktom'],
  'deposit': ['nbkr', 'toktom'],
  'currency-exchange': ['nbkr', 'stat'],
  'money-transfer': ['nbkr', 'toktom'],
  'mobile-tariffs': ['minfin', 'stat'],
  'pension': ['sf', 'mlsp', 'toktom'],
  'alimony': ['mlsp', 'toktom'],
  'family-benefit': ['mlsp', 'sf', 'toktom'],
  'sick-leave': ['sf', 'mlsp', 'toktom'],
  'social-fund': ['sf', 'toktom'],
  'scholarship': ['mlsp', 'toktom'],
  'electricity': ['minfin', 'toktom'],
  'water': ['toktom', 'minfin'],
  'gas': ['minfin', 'toktom'],
  'heating': ['toktom', 'minfin'],
  'housing': ['toktom', 'stat'],
  'customs': ['customs', 'minfin', 'toktom'],
  'fuel': ['minfin', 'toktom'],
  'traffic-fines': ['toktom', 'mlsp'],
  'passport': ['grs', 'toktom'],
  'construction': ['stat', 'minfin'],
  'crop-yield': ['stat', 'mlsp'],
  'rental': ['stat', 'toktom'],
  'zakat': ['nbkr', 'stat'],
  'calorie': ['patrol', 'stat'],
  'sewing-cost': ['stat', 'minfin'],
  'wedding': ['stat', 'toktom']
};

// Pick 4-5 related calculators from same category for internal linking + SEO.
function buildRelatedCalculatorsHtml(slug, lang, langPrefix) {
  const currentCat = calculatorCategories[slug];
  if (!currentCat) return '';

  // Find 4 other calculators in the same category
  const related = Object.entries(calculatorCategories)
    .filter(([s, c]) => s !== slug && c.cat === currentCat.cat)
    .slice(0, 4);

  if (related.length === 0) return '';

  const heading = lang === 'ky' ? 'Тектеш калькуляторлор' : 'Похожие калькуляторы';
  const intro = lang === 'ky'
    ? `Бул бөлүмдө дагы пайдалуу калькуляторлор:`
    : `Другие полезные калькуляторы в этом разделе:`;

  const items = related.map(([s, c]) => {
    const titleKey = (slugOverrides[s] || s.replace(/-/g, '_')) + '_calc_title';
    const altTitleKey = (slugOverrides[s] || s.replace(/-/g, '_')) + '_title';
    const linkText = getTranslation(lang, titleKey, '') || getTranslation(lang, altTitleKey, '') || s;
    // Use RELATIVE URLs — better for SEO and audit detection
    const path = `${langPrefix}/calculator/${s}/`;
    return `<li style="margin:8px 0;"><a href="${path}" style="color:#1d4ed8;">${linkText}</a></li>`;
  }).join('\n        ');

  return `
    <section style="margin:32px 0;padding:20px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;">
      <h2 style="font-size:18px;margin:0 0 8px;color:#111;">${heading}</h2>
      <p style="margin:8px 0;font-size:14px;color:#475569;">${intro}</p>
      <ul style="margin:12px 0;padding-left:20px;list-style:disc;">
        ${items}
      </ul>
    </section>`;
}

function buildGovSourcesHtml(slug, lang) {
  const sourceIds = CALCULATOR_SOURCES[slug] || [];
  if (sourceIds.length === 0) return '';

  const heading = lang === 'ky' ? 'Расмий булактар' : 'Официальные источники';
  const intro = lang === 'ky'
    ? 'Бул калькулятор төмөнкү ишенимдүү булактарга негизделет:'
    : 'Данный калькулятор основан на следующих авторитетных источниках:';

  const items = sourceIds
    .map(id => GOV_SOURCES[id])
    .filter(Boolean)
    .map(s => {
      const name = s[lang === 'ky' ? 'ky' : 'ru'][0];
      const domain = s.ru[1];
      return `<li style="margin:8px 0;"><a href="https://${domain}" target="_blank" rel="noopener noreferrer external" style="color:#1d4ed8;">${name}</a> — <span style="color:#666;">${domain}</span></li>`;
    })
    .join('\n        ');

  return `
    <section style="margin:32px 0;padding:20px;background:#eff6ff;border-radius:8px;border:1px solid #bfdbfe;">
      <h2 style="font-size:18px;margin:0 0 8px;color:#1e3a8a;">${heading}</h2>
      <p style="margin:8px 0;font-size:14px;color:#475569;">${intro}</p>
      <ul style="margin:12px 0;padding-left:20px;list-style:disc;">
        ${items}
      </ul>
    </section>`;
}

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

function extractArticleSections(base, lang) {
  const sections = [];

  // Standard article section key patterns
  const sectionPatterns = [
    ['_article_what_title', '_article_what_intro'],
    ['_article_how_title', '_article_how_intro'],
    ['_example_title', '_example_intro'],
    ['_example_title', '_example_text'],
    ['_tips_title', '_tips_intro'],
    ['_payment_title', '_payment_intro'],
    ['_meter_title', '_meter_intro'],
    ['_comparison_title', '_comparison_intro'],
    ['_savings_title', '_savings_intro'],
    ['_types_title', '_types_intro'],
    ['_guide_title', '_guide_intro'],
    ['_application_title', '_application_intro'],
    ['_verification_title', '_verification_intro'],
    ['_transition_title', '_transition_intro'],
    ['_advantages_title', '_advantages_intro'],
  ];

  for (const [titleSuffix, bodySuffix] of sectionPatterns) {
    const title = getTranslation(lang, `${base}${titleSuffix}`, '');
    const body = getTranslation(lang, `${base}${bodySuffix}`, '');
    if (title || body) {
      sections.push({ title, body });
    }
  }

  return sections;
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

function injectContentPreview(html, route) {
  // For calculator pages, inject visible article content and JSON-LD structured data
  if (route.type !== 'calculator') return html;

  const base = slugOverrides[route.slug] || route.slug.replace(/-/g, '_');
  const lang = route.lang;
  const pathForUrl = route.path === '/' ? '' : route.path;
  const pageUrl = `https://calk.kg${pathForUrl}`;
  const langPrefix = lang === 'ky' ? '/ky' : '';

  // --- Extract content ---
  const calcTitle = getTranslation(lang, `${base}_calc_title`, '') ||
                    getTranslation(lang, `${base}_title`, route.slug);
  const calcDescription = getTranslation(lang, `${base}_calc_description`, '') ||
                          getTranslation(lang, `${base}_description`, '');
  const articleSections = extractArticleSections(base, lang);
  const faqs = extractFaqs(base, lang);
  const catInfo = calculatorCategories[route.slug];
  const categoryName = catInfo ? catInfo[lang] || catInfo.ru : (lang === 'ky' ? 'Башка' : 'Разное');

  // --- Build visible article HTML ---
  // Always inject the article (even without FAQs) so AuthorByline,
  // GovSources, and the H1+description are visible to crawlers.
  const hasContent = true; // articleSections.length > 0 || faqs.length > 0;

  if (hasContent) {
    const sectionsHtml = articleSections
      .map(s => `${s.title ? `<h2 style="font-size:20px;margin:24px 0 12px;">${s.title}</h2>` : ''}${s.body ? `<p style="margin:12px 0;line-height:1.6;">${s.body}</p>` : ''}`)
      .join('\n        ');

    const faqsHtml = faqs
      .map(f => `<div style="margin:16px 0;"><h3 style="font-size:17px;margin:12px 0;">${f.question}</h3><p style="margin:8px 0;line-height:1.6;">${f.answer}</p></div>`)
      .join('\n          ');

    const faqSectionTitle = lang === 'ky' ? 'Көп берилүүчү суроолор' : 'Часто задаваемые вопросы';
    const govSourcesHtml = buildGovSourcesHtml(route.slug, lang);
    const relatedHtml = buildRelatedCalculatorsHtml(route.slug, lang, langPrefix);

    // Editorial byline (Author + last updated) for E-E-A-T
    const today = new Date().toISOString().split('T')[0];
    // Human-readable date — Google + users see this in static HTML before JS hydrates
    const d = new Date(today + 'T00:00:00');
    const KY_MONTHS = ['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'];
    const RU_MONTHS = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
    const humanDate = lang === 'ky'
      ? `${d.getDate()}-${KY_MONTHS[d.getMonth()]} ${d.getFullYear()}-жыл`
      : `${d.getDate()} ${RU_MONTHS[d.getMonth()]} ${d.getFullYear()} г.`;

    const reviewedLabel = lang === 'ky' ? '✓ Текшерилди:' : '✓ Проверено';
    const editorialLabel = lang === 'ky' ? 'Calk.KG редакциясы тарабынан' : 'редакцией Calk.KG';
    const updatedLabel = lang === 'ky' ? 'Жаңыртылды' : 'Обновлено';

    // Static breadcrumb HTML — крауллерам нужен <nav> в первичном HTML до hydration.
    // React VisualBreadcrumbs появляется после JS — но Googlebot ходит JS-light по нашему сайту.
    const homeLabelStatic = lang === 'ky' ? 'Башкы бет' : 'Главная';
    const calculatorsLabel = lang === 'ky' ? 'Калькуляторлор' : 'Калькуляторы';
    const breadcrumbBaseUrl = lang === 'ky' ? '/ky' : '';
    const staticBreadcrumb = `
    <nav aria-label="Breadcrumb" style="background:#fff;border-bottom:1px solid #e5e7eb;">
      <div style="max-width:800px;margin:0 auto;padding:12px 20px;font-size:14px;color:#6b7280;">
        <a href="${breadcrumbBaseUrl || '/'}" style="color:#6b7280;text-decoration:none;">${homeLabelStatic}</a>
        <span style="margin:0 8px;color:#9ca3af;">›</span>
        <a href="${breadcrumbBaseUrl}/" style="color:#6b7280;text-decoration:none;">${calculatorsLabel}</a>
        <span style="margin:0 8px;color:#9ca3af;">›</span>
        <span style="color:#111;font-weight:500;">${calcTitle}</span>
      </div>
    </nav>`;

    const staticArticle = `
    ${staticBreadcrumb}
    <main id="static-content" style="max-width:800px;margin:40px auto;padding:20px;font-family:system-ui,-apple-system,sans-serif;">
      <article style="background:transparent;">
      <h1 style="font-size:24px;margin-bottom:16px;">${calcTitle}</h1>

      <div style="display:flex;gap:16px;margin:12px 0 20px;padding:8px 0 16px;border-bottom:1px solid #e5e7eb;font-size:14px;color:#6b7280;" itemscope itemtype="https://schema.org/Person">
        <span><span style="color:#16a34a;">${reviewedLabel}</span> <span itemprop="name" style="color:#111;font-weight:500;">${editorialLabel}</span></span>
        <time datetime="${today}" itemprop="dateModified">${updatedLabel}: <span style="color:#111;">${humanDate}</span></time>
      </div>

      ${calcDescription ? `<p style="margin:12px 0;line-height:1.6;color:#555;">${calcDescription}</p>` : ''}
      ${sectionsHtml}
      ${faqs.length > 0 ? `
      <section style="margin:32px 0;">
        <h2 style="font-size:20px;margin:24px 0 12px;">${faqSectionTitle}</h2>
        ${faqsHtml}
      </section>` : ''}
      ${relatedHtml}
      ${govSourcesHtml}
      <noscript>
        <p style="margin:20px 0;color:#666;">
          ${lang === 'ky' ? 'Калькуляторду колдонуу үчүн JavaScript керек.' : 'Для использования калькулятора требуется JavaScript.'}
        </p>
      </noscript>
      </article>
    </main>`;

    // Inject before </body> for SEO crawlers.
    // First, remove the home-page static-content block inherited from the
    // vite-generated template (it has the wrong content for calculator pages
    // and creates a duplicate <h1>).
    html = html.replace(
      /<main id="static-content" data-ssg-static="true"[\s\S]*?<\/main>/,
      ''
    );

    // Then inject the per-page article inside #root so the spinner is replaced too.
    // Hidden by CSS class .react-mounted (added by main.tsx before React renders)
    // and also removed from DOM by main.tsx's staticContent.remove()
    html = html.replace(
      /<div id="root">(?:<div class="loading-spinner"><\/div>|\s*)<\/div>/,
      `<div id="root">${staticArticle}</div>`
    );
    // Fallback: if #root already has other content (vite injected something),
    // append our article right before </body>
    if (!html.includes('id="static-content"')) {
      html = html.replace('</body>', `${staticArticle}\n</body>`);
    }
  }

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

function generateHtml(templateHtml, route) {
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
  
  // Inject content preview for SEO
  html = injectContentPreview(html, route);

  return html;
}

function generateStaticHtml() {
  const templateHtml = readFileSync(join(distDir, 'index.html'), 'utf-8');
  const routes = buildRoutes();

  console.log('Generating static HTML files...\n');

  for (const route of routes) {
    const html = generateHtml(templateHtml, route);
    const normalizedPath = route.path.replace(/^\/+/, '');

    if (!normalizedPath) {
      writeFileSync(join(distDir, 'index.html'), html);
      console.log(`  / -> dist/index.html`);
      continue;
    }

    const dirPath = join(distDir, normalizedPath);
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
    writeFileSync(join(dirPath, 'index.html'), html);
    console.log(`  ${route.path} -> dist/${normalizedPath}/index.html`);
  }

  console.log(`\nGenerated ${routes.length} static HTML files.`);
}

generateStaticHtml();
