import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SchemaMarkupProps {
  schema: any;
}

/**
 * Skip injection if SSG (generate-static-html.js) already added a schema of the
 * same @type to the page. The SSG injects BreadcrumbList, FAQPage, WebPage,
 * HowTo, Calculator/WebApplication and SoftwareApplication on every calculator
 * page; injecting them again from React causes duplicates that confuse Google's
 * structured-data parser. SSG schemas are authoritative — we no-op here when
 * one of these page-specific types is requested.
 */
const SSG_OWNED_TYPES = new Set([
  'BreadcrumbList',
  'FAQPage',
  'WebPage',
  'HowTo',
  'WebApplication',
  'Calculator',
  'SoftwareApplication',
]);

function isSSGOwned(schema: any): boolean {
  if (!schema || !schema['@type']) return false;
  const types = Array.isArray(schema['@type']) ? schema['@type'] : [schema['@type']];
  return types.some((t: string) => SSG_OWNED_TYPES.has(t));
}

const SchemaMarkup: React.FC<SchemaMarkupProps> = ({ schema }) => {
  // Generators like generateBreadcrumbSchema can return null when their data
  // is malformed (e.g. <2 breadcrumb items). Skip emission to avoid invalid
  // structured data appearing in Google Search Console.
  if (!schema) return null;
  if (isSSGOwned(schema)) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema, null, 2)}
      </script>
    </Helmet>
  );
};

export default SchemaMarkup;
