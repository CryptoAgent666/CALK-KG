// id калькулятора из data/calculators.ts → путь страницы (без языкового префикса).
// Путь с завершающим слешем — это канонический URL: nginx отдаёт 301 с
// /calculator/x на /calculator/x/, так что ссылки без слеша тратят краулинг.
export const calculatorRoutes: Record<string, string> = {
  'currency-exchange': '/calculator/currency-exchange/',
  'money-transfer': '/calculator/money-transfer/',
  'mobile-tariffs': '/calculator/mobile-tariffs/',
  'crop-yield': '/calculator/crop-yield/',
  'rental': '/calculator/rental/',
  'sick-leave': '/calculator/sick-leave/',
  'fuel': '/calculator/fuel/',
  'construction': '/calculator/construction/',
  'scholarship': '/calculator/scholarship/',
  'salary-calculator': '/calculator/salary/',
  'single-tax-calculator': '/calculator/single-tax/',
  'property-tax-calculator': '/calculator/property-tax/',
  'social-fund-calculator': '/calculator/social-fund/',
  'pension-calculator': '/calculator/pension/',
  'loan-calculator': '/calculator/loan/',
  'mortgage-calculator': '/calculator/mortgage/',
  'auto-loan-calculator': '/calculator/auto-loan/',
  'deposit-calculator': '/calculator/deposit/',
  'customs-calculator': '/calculator/customs/',
  'electricity-calculator': '/calculator/electricity/',
  'water-calculator': '/calculator/water/',
  'heating-calculator': '/calculator/heating/',
  'gas-calculator': '/calculator/gas/',
  'alimony-calculator': '/calculator/alimony/',
  'family-benefit-calculator': '/calculator/family-benefit/',
  'patent-calculator': '/calculator/patent/',
  'traffic-fines-calculator': '/calculator/traffic-fines/',
  'zakat-calculator': '/calculator/zakat/',
  'taxi-tax-calculator': '/calculator/taxi-tax/',
  'passport-calculator': '/calculator/passport/',
  'calorie-calculator': '/calculator/calorie/',
  'sewing-cost-calculator': '/calculator/sewing-cost/',
  'housing-calculator': '/calculator/housing/',
  'wedding-calculator': '/calculator/wedding/',
};

// Путь страницы (без префикса /ky, со слешем или без) → id калькулятора.
export const calculatorIdByPath = (pathname: string): string | undefined => {
  const normalized = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return Object.keys(calculatorRoutes).find(id => calculatorRoutes[id] === normalized);
};
