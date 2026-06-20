// Maps each calculator slug to authoritative Kyrgyz government sources.
//
// These links demonstrate E-E-A-T (Expertise/Authoritativeness/Trust) for SEO
// audits and Google Quality Rater Guidelines (YMYL pages need verifiable sources).
//
// Source domains used:
//   sti.gov.kg      — Государственная налоговая служба
//   sf.gov.kg       — Социальный фонд
//   mlsp.gov.kg     — Министерство труда и социального развития
//   minfin.kg       — Министерство финансов / Таможенная служба
//   nbkr.kg         — Национальный банк КР
//   toktom.kg       — Правовая база КР
//   stat.gov.kg     — Национальный статистический комитет
//   grs.gov.kg      — Государственная регистрационная служба

export type GovSource = {
  name: { ru: string; ky: string };
  url: string;
  description?: { ru: string; ky: string };
};

const SOURCES: Record<string, GovSource> = {
  sti: {
    name: { ru: 'Налоговая служба КР', ky: 'КРнын Салык кызматы' },
    url: 'https://sti.gov.kg',
    description: { ru: 'Налоговые ставки и кодекс', ky: 'Салык ченемдери жана кодекс' }
  },
  sf: {
    name: { ru: 'Социальный фонд КР', ky: 'КРнын Социалдык фонду' },
    url: 'https://sf.gov.kg',
    description: { ru: 'Пенсии и социальные отчисления', ky: 'Пенсия жана социалдык чегерүүлөр' }
  },
  mlsp: {
    name: { ru: 'Министерство труда КР', ky: 'КРнын Эмгек министрлиги' },
    url: 'https://mlsp.gov.kg',
    description: { ru: 'Трудовое законодательство, МРОТ', ky: 'Эмгек мыйзамдары, МАА' }
  },
  minfin: {
    name: { ru: 'Министерство финансов КР', ky: 'КРнын Каржы министрлиги' },
    url: 'https://minfin.kg',
    description: { ru: 'Бюджет и таможенная политика', ky: 'Бюджет жана бажы саясаты' }
  },
  customs: {
    name: { ru: 'Таможенная служба КР', ky: 'КРнын Бажы кызматы' },
    url: 'https://customs.gov.kg',
    description: { ru: 'Таможенные платежи ЕАЭС', ky: 'ЕАЭБ бажы төлөмдөрү' }
  },
  nbkr: {
    name: { ru: 'Национальный банк КР', ky: 'КРнын Улуттук банкы' },
    url: 'https://nbkr.kg',
    description: { ru: 'Курсы валют, учётная ставка', ky: 'Валюта курстары, эсептик чен' }
  },
  toktom: {
    name: { ru: 'Правовая база Токтом', ky: 'Токтом укуктук базасы' },
    url: 'https://toktom.kg',
    description: { ru: 'Законы и нормативные акты КР', ky: 'КРнын мыйзамдары жана ченемдик актылары' }
  },
  stat: {
    name: { ru: 'Нацстатком КР', ky: 'КРнын Улуттук статкомитети' },
    url: 'https://stat.gov.kg',
    description: { ru: 'Статистика, средние зарплаты', ky: 'Статистика, орточо айлык акылар' }
  },
  grs: {
    name: { ru: 'Государственная регистрационная служба', ky: 'Мамлекеттик каттоо кызматы' },
    url: 'https://grs.gov.kg',
    description: { ru: 'Госпошлины, паспорта, ID-карты', ky: 'Мамлекеттик алымдар, паспорт, ID-карта' }
  },
  patrol: {
    name: { ru: 'Минздрав КР', ky: 'КРнын Саламаттык сактоо министрлиги' },
    url: 'https://med.kg',
    description: { ru: 'Здоровье, профилактика', ky: 'Ден соолук, профилактика' }
  }
};

/**
 * Per-calculator source mapping. Each calculator gets 2-4 authoritative sources
 * that are most relevant to its topic.
 */
export const CALCULATOR_SOURCES: Record<string, string[]> = {
  // Tax calculators
  'salary': ['sti', 'sf', 'mlsp', 'toktom'],
  'single-tax': ['sti', 'toktom'],
  'property-tax': ['sti', 'toktom'],
  'patent': ['sti', 'toktom'],
  'taxi-tax': ['sti', 'sf'],

  // Financial
  'loan': ['nbkr', 'toktom'],
  'mortgage': ['nbkr', 'toktom'],
  'auto-loan': ['nbkr', 'toktom'],
  'deposit': ['nbkr'],
  'currency-exchange': ['nbkr'],
  'money-transfer': ['nbkr'],

  // Social
  'pension': ['sf', 'mlsp', 'toktom'],
  'alimony': ['mlsp', 'toktom'],
  'family-benefit': ['mlsp', 'sf'],
  'sick-leave': ['sf', 'mlsp', 'toktom'],
  'social-fund': ['sf', 'toktom'],
  'scholarship': ['mlsp', 'toktom'],

  // Utilities (gov regulator + utility company)
  'electricity': ['minfin', 'toktom'],
  'water': ['toktom'],
  'gas': ['minfin', 'toktom'],
  'heating': ['toktom'],
  'housing': ['toktom'],

  // Auto / Customs
  'customs': ['customs', 'minfin', 'toktom'],
  'fuel': ['minfin', 'toktom'],
  'traffic-fines': ['toktom'],

  // Government services
  'passport': ['grs', 'toktom'],

  // Construction / Agriculture
  'construction': ['stat', 'minfin'],
  'crop-yield': ['stat', 'mlsp'],
  'rental': ['stat', 'toktom'],

  // Other
  'tourist-fee': ['minfin', 'toktom'],
  'zakat': ['nbkr'], // gold price reference
  'calorie': ['patrol'],
  'sewing-cost': ['stat'],
  'wedding': ['stat']
};

export const getCalculatorSources = (slug: string): GovSource[] => {
  const ids = CALCULATOR_SOURCES[slug] || [];
  return ids.map(id => SOURCES[id]).filter(Boolean);
};
