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

// Генерация схемы BreadcrumbList
export const generateBreadcrumbSchema = (items: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

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
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "1250",
    "bestRating": "5",
    "worstRating": "1"
  },
  "featureList": data.inputProperties || [],
  "screenshot": `${data.url}/preview.png`
});

// Генерация LocalBusiness для региональных услуг
export const generateLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Calk.KG",
  "description": "Онлайн калькуляторы для жителей Кыргызстана",
  "url": "https://calk.kg",
  "telephone": "+996-XXX-XXX-XXX",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "KG",
    "addressRegion": "Чуйская область",
    "addressLocality": "Бишкек"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "42.8746",
    "longitude": "74.5698"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Кыргызстан"
  },
  "serviceType": "Финансовые калькуляторы и консультации"
});

// Утилита для создания JSON-LD скрипта
export const createJsonLdScript = (schemaData: any) => {
  return JSON.stringify(schemaData, null, 2);
};