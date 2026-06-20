// Hreflang link tags are emitted by the SSG (see scripts/generate-static-html.js,
// which strips template hreflangs and inserts per-page <link rel="alternate" ...>
// for ru / ky / x-default before serving HTML).
//
// This component used to ALSO add the same three links via React Helmet, which
// caused them to appear twice in <head> after hydration (each hreflang shown 2x).
// Search engines treat duplicate hreflang signals as an authority conflict, so
// the component is now a no-op. Call sites can remain unchanged.

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface HreflangTagsProps {
  path: string;
}

const HreflangTags = (_props: HreflangTagsProps) => null;

export default HreflangTags;
