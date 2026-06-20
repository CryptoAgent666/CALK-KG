import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const appPath = join(rootDir, 'src', 'App.tsx');
const outputPaths = [
  join(rootDir, 'public', 'sitemap.xml'), // source (kept in repo)
  join(rootDir, 'dist', 'sitemap.xml'),   // build output (Vite copied stale version earlier)
];

const BASE_URL = 'https://calk.kg';

// Map route slugs to relevant source files for git date tracking
const getRelevantFiles = (slug) => {
  const base = slug.replace(/-/g, '_');
  return [
    `src/pages/${toPascalCase(slug)}Page.tsx`,
    `src/pages/${toPascalCase(slug)}CalculatorPage.tsx`,
    `src/components/${toPascalCase(slug)}Article.tsx`,
    `src/components/${toPascalCase(slug)}CalculatorArticle.tsx`,
  ];
};

function toPascalCase(str) {
  return str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

function getLastModifiedDate(files) {
  for (const file of files) {
    const fullPath = join(rootDir, file);
    if (existsSync(fullPath)) {
      try {
        const date = execSync(
          `git log -1 --format=%aI -- "${file}"`,
          { cwd: rootDir, encoding: 'utf8' }
        ).trim();
        if (date) return date.split('T')[0];
      } catch {
        // fallback
      }
    }
  }
  return new Date().toISOString().split('T')[0];
}

function getRoutesFromApp() {
  const source = readFileSync(appPath, 'utf-8');
  const matches = [...source.matchAll(/path:\s*'([^']+)'/g)].map(m => m[1]);
  const calculatorPaths = [...new Set(matches.filter(p => p.startsWith('calculator/')))];
  const staticPaths = [...new Set(matches.filter(p => !p.startsWith('calculator/')))];
  return { calculatorPaths, staticPaths };
}

function generateSitemap() {
  const { calculatorPaths, staticPaths } = getRoutesFromApp();

  const allPaths = [
    { path: '', type: 'home' },
    ...staticPaths.map(p => ({ path: `/${p}`, type: 'static' })),
    ...calculatorPaths.map(p => ({ path: `/${p}`, type: 'calculator' })),
  ];

  const urls = [];

  for (const route of allPaths) {
    const slug = route.path.replace('/calculator/', '').replace('/', '') || 'home';

    // Get last modified date from git
    let lastmod;
    if (route.type === 'home') {
      lastmod = getLastModifiedDate(['src/App.tsx', 'src/components/Hero.tsx']);
    } else if (route.type === 'static') {
      lastmod = getLastModifiedDate([`src/pages/${toPascalCase(slug)}Page.tsx`]);
    } else {
      lastmod = getLastModifiedDate(getRelevantFiles(slug));
    }

    // Add trailing slash for calculator/static pages to match nginx 301 redirect behavior.
    // Home '' and /ky stay as-is (no slash on bare hostname).
    const withSlash = (path) => {
      if (!path) return '';
      return path.endsWith('/') ? path : `${path}/`;
    };
    const slashedPath = route.type === 'home' ? route.path : withSlash(route.path);

    const ruUrl = `${BASE_URL}${slashedPath}`;
    const kyUrl = `${BASE_URL}/ky${slashedPath || '/'}`;

    const hreflangRu = ruUrl;
    const hreflangKy = route.path === '' ? `${BASE_URL}/ky` : kyUrl;

    // Russian version
    urls.push({ loc: ruUrl, lastmod, hreflangRu, hreflangKy: hreflangKy });
    // Kyrgyz version
    urls.push({ loc: route.path === '' ? `${BASE_URL}/ky` : kyUrl, lastmod, hreflangRu, hreflangKy });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <xhtml:link rel="alternate" hreflang="ru" href="${u.hreflangRu}" />
    <xhtml:link rel="alternate" hreflang="ky" href="${u.hreflangKy}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${u.hreflangRu}" />
  </url>`).join('\n')}
</urlset>`;

  for (const outputPath of outputPaths) {
    try {
      writeFileSync(outputPath, xml, 'utf-8');
    } catch (e) {
      // dist/ may not exist before first build — ignore
      if (e.code !== 'ENOENT') throw e;
    }
  }
  console.log(`Sitemap generated: ${urls.length} URLs with git-based lastmod dates.`);
}

generateSitemap();
