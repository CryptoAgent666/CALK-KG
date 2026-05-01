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

const slugOverrides = {
  'crop-yield': 'crop_calc',
  'rental': 'rent_calc',
  'sick-leave': 'sick_calc',
  'sewing-cost': 'sewingcost',
  'money-transfer': 'moneytransfer',
  'currency-exchange': 'currency',
  'mobile-tariffs': 'mobiletariffs',
  'property-tax': 'propertytax',
  'single-tax': 'singletax',
  'family-benefit': 'familybenefit',
  'social-fund': 'socialfund',
  'traffic-fines': 'trafficfines',
  'taxi-tax': 'taxitax',
  'tourist-fee': 'touristfee'
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
  'tourist-fee': { ru: 'Разное', ky: 'Башка', cat: 'other' },
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
  sitemap: { titleKey: 'sitemap_page_title', descriptionKey: 'sitemap_meta_description' }
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
  const base = slugOverrides[slug] || slug.replace(/-/g, '_');
  const titleKey = findTranslationKey(base, ['_calc_title', '_title']);
  const descriptionKey = findTranslationKey(base, ['_calc_description', '_description']);

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
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
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
  const hasContent = articleSections.length > 0 || faqs.length > 0;

  if (hasContent) {
    const sectionsHtml = articleSections
      .map(s => `${s.title ? `<h2 style="font-size:20px;margin:24px 0 12px;">${s.title}</h2>` : ''}${s.body ? `<p style="margin:12px 0;line-height:1.6;">${s.body}</p>` : ''}`)
      .join('\n        ');

    const faqsHtml = faqs
      .map(f => `<div style="margin:16px 0;"><h3 style="font-size:17px;margin:12px 0;">${f.question}</h3><p style="margin:8px 0;line-height:1.6;">${f.answer}</p></div>`)
      .join('\n          ');

    const faqSectionTitle = lang === 'ky' ? 'Көп берилүүчү суроолор' : 'Часто задаваемые вопросы';

    const staticArticle = `
    <article id="static-content" style="max-width:800px;margin:40px auto;padding:20px;font-family:system-ui,-apple-system,sans-serif;">
      <h1 style="font-size:24px;margin-bottom:16px;">${calcTitle}</h1>
      ${calcDescription ? `<p style="margin:12px 0;line-height:1.6;color:#555;">${calcDescription}</p>` : ''}
      ${sectionsHtml}
      ${faqs.length > 0 ? `
      <section style="margin:32px 0;">
        <h2 style="font-size:20px;margin:24px 0 12px;">${faqSectionTitle}</h2>
        ${faqsHtml}
      </section>` : ''}
      <noscript>
        <p style="margin:20px 0;color:#666;">
          ${lang === 'ky' ? 'Калькуляторду колдонуу үчүн JavaScript керек.' : 'Для использования калькулятора требуется JavaScript.'}
        </p>
      </noscript>
    </article>`;

    // Inject before </body> for SEO crawlers.
    // Hidden by CSS class .react-mounted (added by main.tsx before React renders)
    // and also removed from DOM by main.tsx's staticContent.remove()
    html = html.replace('</body>', `${staticArticle}\n</body>`);
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

  // 3. Calculator schema
  schemas.push(buildCalculatorSchema({
    name: calcTitle,
    description: calcDescription,
    url: pageUrl,
    language: lang,
    category: categoryName
  }));

  const jsonLdBlock = schemas.map(s => `    ${jsonLdScriptTag(s)}`).join('\n');
  html = html.replace('</head>', `${jsonLdBlock}\n  </head>`);

  return html;
}

function generateHtml(templateHtml, route) {
  let html = templateHtml;
  const pathForUrl = route.path === '/' ? '' : route.path;

  let meta;
  if (route.type === 'home') {
    meta = getHomeMeta(route.lang);
  } else if (route.type === 'static') {
    meta = getStaticMeta(route.slug, route.lang);
  } else {
    meta = getCalculatorMeta(route.slug, route.lang);
  }

  const ogImage = getOgImage(route.slug);

  if (/<html[^>]*lang=/.test(html)) {
    html = html.replace(/<html[^>]*lang="[^"]*"/, `<html lang="${route.lang}"`);
  } else {
    html = html.replace('<html', `<html lang="${route.lang}"`);
  }

  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${meta.title}</title>`
  );

  html = html.replace(
    /<meta name="description" content=".*?".*?\/>/,
    `<meta name="description" content="${meta.description}" />`
  );

  html = html
    .replace(/<meta property="og:[^"]+"[^>]*>\s*/g, '')
    .replace(/<meta name="twitter:[^"]+"[^>]*>\s*/g, '')
    .replace(/<link rel="canonical"[^>]*>\s*/g, '');

  const ogTags = `
    <meta property="og:title" content="${meta.title}" />
    <meta property="og:description" content="${meta.description}" />
    <meta property="og:url" content="https://calk.kg${pathForUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="${route.ogLocale}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${meta.title}" />
    <meta name="twitter:description" content="${meta.description}" />
    <meta name="twitter:image" content="${ogImage}" />
    <link rel="canonical" href="https://calk.kg${pathForUrl}" />`;

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
