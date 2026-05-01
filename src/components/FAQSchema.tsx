import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../contexts/LanguageContext';
import { generateFAQPageSchema } from '../utils/schemaGenerator';

interface FAQSchemaProps {
  /** Translation key prefix for FAQ items, e.g. "salary" will look for salary_faq_q1, salary_faq_a1, etc. */
  translationPrefix?: string;
  /** Max number of FAQ items to look for (default: 10) */
  maxItems?: number;
  /** Explicit FAQ data (used when FAQs are hardcoded, not in translations) */
  faqs?: Array<{ question: string; answer: string }>;
}

/**
 * Generates FAQPage JSON-LD schema for calculator pages.
 * Can extract FAQs from translation keys or accept explicit FAQ data.
 */
const FAQSchema: React.FC<FAQSchemaProps> = ({ translationPrefix, maxItems = 10, faqs: explicitFaqs }) => {
  const { t } = useLanguage();

  let faqItems: Array<{ question: string; answer: string }> = [];

  if (explicitFaqs) {
    faqItems = explicitFaqs;
  } else if (translationPrefix) {
    for (let i = 1; i <= maxItems; i++) {
      const qKey = `${translationPrefix}_faq_q${i}` as any;
      const aKey = `${translationPrefix}_faq_a${i}` as any;
      const question = t(qKey);
      const answer = t(aKey);
      // If the key returns itself (no translation found), stop
      if (question === qKey || answer === aKey) break;
      faqItems.push({ question, answer });
    }
  }

  if (faqItems.length === 0) return null;

  const schema = generateFAQPageSchema(faqItems);

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema, null, 2)}
      </script>
    </Helmet>
  );
};

export default FAQSchema;
