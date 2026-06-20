export interface SchemaOrgData {
  url: string;
  title: string;
  description: string;
  language?: string;
}

export interface CalculatorSchemaData extends SchemaOrgData {
  calculatorName: string;
  category: string;
  inputProperties?: string[];
  outputProperties?: string[];
}

export interface OrganizationSchemaData {
  name: string;
  url: string;
  logo: string;
  description: string;
  contactEmail: string;
  address: {
    addressCountry: string;
    addressRegion: string;
    addressLocality: string;
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

// Генерация схемы WebSite для главной страницы
export const generateWebSiteSchema = (data: SchemaOrgData) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Calk.KG",
  "alternateName": "Калькуляторы Кыргызстана",
  "url": "https://calk.kg",
  "description": data.description,
  "inLanguage": ["ru", "ky"],
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://calk.kg/?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Calk.KG",
    "url": "https://calk.kg"
  }
});

// Генерация схемы Organization
export const generateOrganizationSchema = (data: OrganizationSchemaData) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": data.name,
  "url": data.url,
  "logo": data.logo,
  "description": data.description,
  "contactPoint": {
    "@type": "ContactPoint",
    "email": data.contactEmail,
    "contactType": "customer service",
    "availableLanguage": ["Russian", "Kyrgyz"]
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": data.address.addressCountry,
    "addressRegion": data.address.addressRegion,
    "addressLocality": data.address.addressLocality
  },
  "areaServed": {
    "@type": "Country",
    "name": "Кыргызстан"
  },
  "knowsLanguage": ["ru", "ky"]
});

// Генерация схемы Calculator для страниц калькуляторов
export const generateCalculatorSchema = (data: CalculatorSchemaData) => ({
  "@context": "https://schema.org",
  "@type": ["WebApplication", "Calculator"],
  "name": data.calculatorName,
  "description": data.description,
  "url": data.url,
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Any",
  "browserRequirements": "Requires JavaScript",
  "inLanguage": data.language || "ru",
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
    "name": data.category
  },
  "usageInfo": data.url,
  "softwareVersion": "2026.1",
  "dateModified": new Date().toISOString().split('T')[0]
});

// Генерация схемы BreadcrumbList.
//
// Возвращает `null` для bedeutungslos breadcrumbs (< 2 items) — Google Search
// Console flags single-item breadcrumbs как "Missing field 'itemListElement'"
// (technically itemListElement exists but is treated as empty / meaningless).
// Also filters out items missing required name/url fields, чтобы никогда
// не эмитить invalid schema.
export const generateBreadcrumbSchema = (items: BreadcrumbItem[]) => {
  const validItems = (items || []).filter(
    (i): i is BreadcrumbItem => !!(i && i.name && i.url)
  );
  // Schema.org BreadcrumbList without a meaningful trail (≥2 levels) is treated
  // as malformed by Google's structured-data validator. Skip emission entirely.
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
};

// Генерация схемы WebPage для информационных страниц
export const generateWebPageSchema = (data: SchemaOrgData) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": data.title,
  "description": data.description,
  "url": data.url,
  "inLanguage": data.language || "ru",
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
  "mainEntity": {
    "@type": "Thing",
    "name": data.title,
    "description": data.description
  }
});

// Генерация схемы AboutPage
export const generateAboutPageSchema = (data: SchemaOrgData) => ({
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": data.title,
  "description": data.description,
  "url": data.url,
  "inLanguage": data.language || "ru",
  "mainEntity": {
    "@type": "Organization",
    "name": "Calk.KG",
    "url": "https://calk.kg",
    "description": "Самая полная коллекция онлайн-калькуляторов для жителей Кыргызстана"
  },
  "author": {
    "@type": "Organization",
    "name": "Calk.KG",
    "url": "https://calk.kg"
  }
});

// Генерация схемы HowTo — пошаговая инструкция использования калькулятора
// Используется AI-краулерами (ChatGPT, Perplexity, Google AI Overviews)
// для цитирования при запросах "Как рассчитать..."
export const generateHowToSchema = (data: {
  name: string;
  description: string;
  url: string;
  language?: string;
  steps: Array<{ name: string; text: string }>;
  totalTime?: string; // ISO 8601 duration, e.g. "PT1M"
}) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": data.name,
  "description": data.description,
  "inLanguage": data.language || "ru",
  "totalTime": data.totalTime || "PT1M",
  "tool": {
    "@type": "HowToTool",
    "name": data.name,
    "url": data.url
  },
  "step": data.steps.map((step, idx) => ({
    "@type": "HowToStep",
    "position": idx + 1,
    "name": step.name,
    "text": step.text,
    "url": `${data.url}#step-${idx + 1}`
  }))
});

// Генерация схемы FAQPage для страниц с вопросами и ответами
export const generateFAQPageSchema = (faqs: Array<{question: string, answer: string}>) => ({
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
});

// Генерация схемы SoftwareApplication для инструментов
export const generateSoftwareApplicationSchema = (data: CalculatorSchemaData) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": data.calculatorName,
  "description": data.description,
  "url": data.url,
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Any",
  "browserRequirements": "Requires JavaScript",
  "softwareVersion": "2026.1",
  "datePublished": "2026-01-15",
  "creator": {
    "@type": "Organization",
    "name": "Calk.KG",
    "url": "https://calk.kg"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "KGS",
    "availability": "https://schema.org/InStock"
  },
  "featureList": data.inputProperties || []
});

// Генерация OnlineBusiness для веб-сервиса
export const generateOnlineBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "OnlineBusiness",
  "name": "Calk.KG",
  "description": "Онлайн калькуляторы для жителей Кыргызстана",
  "url": "https://calk.kg",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "KG",
    "addressRegion": "Чуйская область",
    "addressLocality": "Бишкек"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Кыргызстан"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "info@calk.kg",
    "contactType": "customer service",
    "availableLanguage": ["Russian", "Kyrgyz"]
  }
});

// Утилита для создания JSON-LD скрипта
export const createJsonLdScript = (schemaData: any) => {
  return JSON.stringify(schemaData, null, 2);
};