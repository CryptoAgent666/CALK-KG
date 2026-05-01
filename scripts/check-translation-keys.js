import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const translationsPath = join(__dirname, '..', 'src', 'i18n', 'translations.ts');
const translationsText = readFileSync(translationsPath, 'utf8');

const ruStart = translationsText.indexOf('ru: {');
const kyStart = translationsText.indexOf('ky: {');

if (ruStart === -1 || kyStart === -1) {
  throw new Error('Cannot locate ru or ky sections in translations.ts');
}

const ruSection = translationsText.slice(ruStart, kyStart);
const kySection = translationsText.slice(kyStart);

const keyRegex = /^\s*([a-zA-Z0-9_]+):\s*'/gm;

function extractKeys(section) {
  const keys = new Set();
  let match;
  while ((match = keyRegex.exec(section)) !== null) {
    keys.add(match[1]);
  }
  return keys;
}

const ruKeys = extractKeys(ruSection);
const kyKeys = extractKeys(kySection);

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
  'src/components/ConstructionCalculatorArticle.tsx',
  'src/components/FuelCalculatorArticle.tsx',

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
  'src/pages/PensionCalculatorPage.tsx',
  'src/pages/ConstructionCalculatorPage.tsx',
  'src/pages/FuelCalculatorPage.tsx'
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

const missingRu = [...usedKeys].filter(key => !ruKeys.has(key)).sort();
const missingKy = [...usedKeys].filter(key => !kyKeys.has(key)).sort();

console.log('Missing in RU:', missingRu.length);
missingRu.forEach(key => console.log(`  - ${key}`));

console.log('\nMissing in KY:', missingKy.length);
missingKy.forEach(key => console.log(`  - ${key}`));
