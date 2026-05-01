import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');
const srcDir = join(__dirname, '..', 'src');
const appPath = join(srcDir, 'App.tsx');

// Dynamic import puppeteer
let puppeteer;

async function loadPuppeteer() {
  try {
    puppeteer = await import('puppeteer');
    return puppeteer;
  } catch (e) {
    console.error('Puppeteer not found. Installing...');
    await execAsync('npm install puppeteer');
    puppeteer = await import('puppeteer');
    return puppeteer;
  }
}

const getRoutesFromApp = () => {
  const source = readFileSync(appPath, 'utf-8');
  const matches = [...source.matchAll(/path:\s*'([^']+)'/g)].map(match => match[1]);
  const calculatorPaths = [...new Set(matches.filter(path => path.startsWith('calculator/')))];
  const staticPaths = [...new Set(matches.filter(path => !path.startsWith('calculator/')))];

  return { calculatorPaths, staticPaths };
};

const buildRoutes = () => {
  const { calculatorPaths, staticPaths } = getRoutesFromApp();
  const languages = [
    { code: 'ru', prefix: '' },
    { code: 'ky', prefix: '/ky' }
  ];
  
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
      lang: language.code
    };
  }));
};

async function generateStaticHtml() {
  console.log('Starting full prerender with Puppeteer...\n');
  
  // Load puppeteer
  await loadPuppeteer();
  
  // Start preview server
  console.log('Starting preview server...');
  const serverProcess = exec('npm run preview -- --port 4173 --host', {
    cwd: join(__dirname, '..')
  });
  
  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const browser = await puppeteer.default.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const routes = buildRoutes();
  console.log(`Rendering ${routes.length} routes...\n`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const route of routes) {
    try {
      const page = await browser.newPage();
      const url = `http://localhost:4173${route.path}`;
      
      // Navigate and wait for React to render
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 });
      
      // Wait for content to render
      await page.waitForSelector('body', { timeout: 5000 });
      
      // Get full HTML
      const html = await page.content();
      
      // Save HTML
      const normalizedPath = route.path.replace(/^\/+/, '');
      
      if (!normalizedPath) {
        writeFileSync(join(distDir, 'index.html'), html);
        console.log(`  ✓ / -> dist/index.html`);
      } else {
        const dirPath = join(distDir, normalizedPath);
        if (!existsSync(dirPath)) {
          mkdirSync(dirPath, { recursive: true });
        }
        writeFileSync(join(dirPath, 'index.html'), html);
        console.log(`  ✓ ${route.path} -> dist/${normalizedPath}/index.html`);
      }
      
      await page.close();
      successCount++;
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`  ✗ ${route.path} - Error: ${error.message}`);
      errorCount++;
    }
  }
  
  await browser.close();
  
  // Kill preview server
  serverProcess.kill();
  
  console.log(`\n✓ Generated ${successCount} static HTML files.`);
  if (errorCount > 0) {
    console.log(`✗ ${errorCount} files failed.`);
  }
}

generateStaticHtml().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
