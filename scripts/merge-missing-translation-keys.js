import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const translationsPath = join(__dirname, '..', 'src', 'i18n', 'translations.ts');
const backupPath = join(__dirname, '..', 'src', 'i18n', 'translations.ts.backup');

const translationsText = readFileSync(translationsPath, 'utf8');
const backupText = readFileSync(backupPath, 'utf8');

const ruStart = translationsText.indexOf('ru: {');
const kyStart = translationsText.indexOf('ky: {');
if (ruStart === -1 || kyStart === -1) {
  throw new Error('Cannot locate ru or ky sections in translations.ts');
}

const ruEnd = kyStart;
const kyEnd = translationsText.lastIndexOf('}');

const ruSection = translationsText.slice(ruStart, ruEnd);
const kySection = translationsText.slice(kyStart, kyEnd);

const backupRuStart = backupText.indexOf('ru: {');
const backupKyStart = backupText.indexOf('ky: {');
if (backupRuStart === -1 || backupKyStart === -1) {
  throw new Error('Cannot locate ru or ky sections in translations.ts.backup');
}

const backupRuSection = backupText.slice(backupRuStart, backupKyStart);
const backupKySection = backupText.slice(backupKyStart);

const keyRegex = /^\s*([a-zA-Z0-9_]+):\s*'((?:\\'|[^'])*)'/gm;

function extractKeyMap(section) {
  const map = new Map();
  let match;
  while ((match = keyRegex.exec(section)) !== null) {
    map.set(match[1], match[2]);
  }
  return map;
}

const ruMap = extractKeyMap(ruSection);
const kyMap = extractKeyMap(kySection);
const backupRuMap = extractKeyMap(backupRuSection);
const backupKyMap = extractKeyMap(backupKySection);

const targetFiles = [
  // Article components
  'src/components/LoanCalculatorArticle.tsx',
  'src/components/CurrencyExchangeCalculatorArticle.tsx',
  'src/components/MoneyTransferCalculatorArticle.tsx',
  'src/components/MobileTariffsCalculatorArticle.tsx',
  'src/components/SingleTaxCalculatorArticle.tsx',
  'src/components/PropertyTaxCalculatorArticle.tsx',
  'src/components/TaxiTaxCalculatorArticle.tsx',
  'src/components/PassportCalculatorArticle.tsx',
  'src/components/TouristFeeCalculatorArticle.tsx',
  'src/components/TrafficFinesCalculatorArticle.tsx',
  'src/components/SocialFundCalculatorArticle.tsx',
  'src/components/FamilyBenefitCalculatorArticle.tsx',
  'src/components/AlimonyCalculatorArticle.tsx',
  'src/components/WaterCalculatorArticle.tsx',
  'src/components/GasCalculatorArticle.tsx',
  'src/components/HeatingCalculatorArticle.tsx',
  'src/components/HousingCalculatorArticle.tsx',
  'src/components/ScholarshipCalculatorArticle.tsx',
  'src/components/CalorieCalculatorArticle.tsx',
  'src/components/WeddingCalculatorArticle.tsx',
  'src/components/SewingCostCalculatorArticle.tsx',
  'src/components/ZakatCalculatorArticle.tsx',
  'src/components/PatentCalculatorArticle.tsx',
  'src/components/PensionCalculatorArticle.tsx',

  // Calculator pages
  'src/pages/LoanCalculatorPage.tsx',
  'src/pages/CurrencyExchangePage.tsx',
  'src/pages/MoneyTransferCalculatorPage.tsx',
  'src/pages/MobileTariffsCalculatorPage.tsx',
  'src/pages/SingleTaxCalculatorPage.tsx',
  'src/pages/PropertyTaxCalculatorPage.tsx',
  'src/pages/TaxiTaxCalculatorPage.tsx',
  'src/pages/PassportCalculatorPage.tsx',
  'src/pages/TouristFeeCalculatorPage.tsx',
  'src/pages/TrafficFinesCalculatorPage.tsx',
  'src/pages/SocialFundCalculatorPage.tsx',
  'src/pages/FamilyBenefitCalculatorPage.tsx',
  'src/pages/AlimonyCalculatorPage.tsx',
  'src/pages/WaterCalculatorPage.tsx',
  'src/pages/GasCalculatorPage.tsx',
  'src/pages/HeatingCalculatorPage.tsx',
  'src/pages/HousingCalculatorPage.tsx',
  'src/pages/StudentScholarshipPage.tsx',
  'src/pages/CalorieCalculatorPage.tsx',
  'src/pages/WeddingCalculatorPage.tsx',
  'src/pages/SewingCostCalculatorPage.tsx',
  'src/pages/ZakatCalculatorPage.tsx',
  'src/pages/PatentCalculatorPage.tsx',
  'src/pages/PensionCalculatorPage.tsx'
];

const keyPatterns = [
  /\bt\('([^']+)'\)/g,
  /questionKey="([^"]+)"/g,
  /answerKey="([^"]+)"/g,
  /titleKey="([^"]+)"/g
];

const usedKeys = new Set();
for (const file of targetFiles) {
  const filePath = join(__dirname, '..', file);
  const content = readFileSync(filePath, 'utf8');
  for (const pattern of keyPatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      usedKeys.add(match[1]);
    }
  }
}

const missingRu = [...usedKeys].filter(key => !ruMap.has(key)).sort();
const missingKy = [...usedKeys].filter(key => !kyMap.has(key)).sort();

function escapeValue(value) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

const missingRuEntries = missingRu
  .map(key => {
    const value = backupRuMap.get(key);
    return value ? `    ${key}: '${escapeValue(value)}',` : null;
  })
  .filter(Boolean);

const missingKyEntries = missingKy
  .map(key => {
    const value = backupKyMap.get(key);
    return value ? `    ${key}: '${escapeValue(value)}',` : null;
  })
  .filter(Boolean);

const ruMissingNotFound = missingRu.filter(key => !backupRuMap.has(key));
const kyMissingNotFound = missingKy.filter(key => !backupKyMap.has(key));

let updated = translationsText;

if (missingRuEntries.length) {
  updated = updated.replace(
    ruSection,
    ruSection.replace(/}\s*$/m, `\n    // Auto-added missing keys\n${missingRuEntries.join('\n')}\n  }\n`)
  );
}

if (missingKyEntries.length) {
  const updatedKySection = updated.slice(updated.indexOf('ky: {'), updated.lastIndexOf('}'));
  updated = updated.replace(
    updatedKySection,
    updatedKySection.replace(/}\s*$/m, `\n    // Auto-added missing keys\n${missingKyEntries.join('\n')}\n  }\n`)
  );
}

writeFileSync(translationsPath, updated, 'utf8');

console.log('Added RU keys:', missingRuEntries.length);
console.log('Added KY keys:', missingKyEntries.length);
if (ruMissingNotFound.length) {
  console.log('RU missing not found in backup:', ruMissingNotFound);
}
if (kyMissingNotFound.length) {
  console.log('KY missing not found in backup:', kyMissingNotFound);
}
