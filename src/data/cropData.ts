// ============================================================================
// ДАННЫЕ ПО СЕЛЬСКОХОЗЯЙСТВЕННЫМ КУЛЬТУРАМ КЫРГЫЗСТАНА
// ============================================================================
// АКТУАЛЬНО НА: Апрель 2026 (весенний сев — Q2 2026)
// ИСТОЧНИКИ: Минсельхоз КР, Статкомитет КР, рыночные цены
// 
// Все цены указаны в сомах (KGS)
// Урожайность - в центнерах на гектар (ц/га) или тоннах (т/га)
// ============================================================================

export interface CropType {
  id: string;
  nameKey: string;
  category: 'grain' | 'vegetable' | 'root';
  
  // Урожайность
  avgYield: number; // т/га средняя урожайность
  minYield: number; // минимальная
  maxYield: number; // максимальная
  
  // Затраты на 1 га (сом)
  seedCost: number; // стоимость семян/посадочного материала
  fertilizerCost: number; // удобрения
  fuelCost: number; // ГСМ (вспашка, посев, уборка)
  laborCost: number; // трудозатраты
  otherCosts: number; // прочие расходы (химия, полив и т.д.)
  
  // Доходы
  pricePerTon: number; // цена реализации за тонну (сом)
  
  // Сезонность
  plantingSeason: string; // сезон посадки
  harvestSeason: string; // сезон уборки
  growthPeriod: number; // период вегетации (дней)
}

export const CROPS: CropType[] = [
  // === ЗЕРНОВЫЕ ===
  {
    id: 'wheat',
    nameKey: 'crop_wheat',
    category: 'grain',
    avgYield: 3.5, // т/га (35 ц/га)
    minYield: 2.0,
    maxYield: 5.5,
    seedCost: 8000, // семена пшеницы
    fertilizerCost: 15000,
    fuelCost: 12000,
    laborCost: 10000,
    otherCosts: 5000,
    pricePerTon: 18000, // цена за тонну пшеницы
    plantingSeason: 'spring', // март-апрель или сентябрь-октябрь
    harvestSeason: 'summer', // июль-август
    growthPeriod: 120
  },
  {
    id: 'barley',
    nameKey: 'crop_barley',
    category: 'grain',
    avgYield: 3.0,
    minYield: 1.8,
    maxYield: 4.8,
    seedCost: 7000,
    fertilizerCost: 12000,
    fuelCost: 12000,
    laborCost: 9000,
    otherCosts: 4000,
    pricePerTon: 15000,
    plantingSeason: 'spring',
    harvestSeason: 'summer',
    growthPeriod: 100
  },
  
  // === КОРНЕПЛОДЫ ===
  {
    id: 'potato',
    nameKey: 'crop_potato',
    category: 'root',
    avgYield: 20, // т/га
    minYield: 12,
    maxYield: 35,
    seedCost: 60000, // посадочный картофель дорогой
    fertilizerCost: 25000,
    fuelCost: 15000,
    laborCost: 30000, // высокие трудозатраты
    otherCosts: 10000,
    pricePerTon: 25000, // сильно варьируется по сезону
    plantingSeason: 'spring',
    harvestSeason: 'autumn',
    growthPeriod: 90
  },
  {
    id: 'carrot',
    nameKey: 'crop_carrot',
    category: 'root',
    avgYield: 35,
    minYield: 20,
    maxYield: 55,
    seedCost: 15000,
    fertilizerCost: 20000,
    fuelCost: 10000,
    laborCost: 25000,
    otherCosts: 8000,
    pricePerTon: 30000,
    plantingSeason: 'spring',
    harvestSeason: 'autumn',
    growthPeriod: 110
  },
  {
    id: 'beet',
    nameKey: 'crop_beet',
    category: 'root',
    avgYield: 40,
    minYield: 25,
    maxYield: 60,
    seedCost: 12000,
    fertilizerCost: 18000,
    fuelCost: 10000,
    laborCost: 22000,
    otherCosts: 7000,
    pricePerTon: 20000,
    plantingSeason: 'spring',
    harvestSeason: 'autumn',
    growthPeriod: 100
  },
  
  // === ОВОЩИ ===
  {
    id: 'cabbage',
    nameKey: 'crop_cabbage',
    category: 'vegetable',
    avgYield: 45,
    minYield: 30,
    maxYield: 70,
    seedCost: 8000,
    fertilizerCost: 20000,
    fuelCost: 8000,
    laborCost: 28000,
    otherCosts: 9000,
    pricePerTon: 22000,
    plantingSeason: 'spring',
    harvestSeason: 'autumn',
    growthPeriod: 120
  },
  {
    id: 'onion',
    nameKey: 'crop_onion',
    category: 'vegetable',
    avgYield: 25,
    minYield: 15,
    maxYield: 40,
    seedCost: 20000,
    fertilizerCost: 18000,
    fuelCost: 9000,
    laborCost: 30000,
    otherCosts: 10000,
    pricePerTon: 35000,
    plantingSeason: 'spring',
    harvestSeason: 'summer',
    growthPeriod: 140
  },
  {
    id: 'tomato',
    nameKey: 'crop_tomato',
    category: 'vegetable',
    avgYield: 30,
    minYield: 18,
    maxYield: 50,
    seedCost: 25000,
    fertilizerCost: 30000,
    fuelCost: 10000,
    laborCost: 40000, // очень трудоёмко
    otherCosts: 15000, // химия, капельный полив
    pricePerTon: 45000,
    plantingSeason: 'spring',
    harvestSeason: 'summer',
    growthPeriod: 120
  },
  {
    id: 'cucumber',
    nameKey: 'crop_cucumber',
    category: 'vegetable',
    avgYield: 28,
    minYield: 16,
    maxYield: 45,
    seedCost: 18000,
    fertilizerCost: 25000,
    fuelCost: 9000,
    laborCost: 35000,
    otherCosts: 12000,
    pricePerTon: 40000,
    plantingSeason: 'spring',
    harvestSeason: 'summer',
    growthPeriod: 60
  },
  {
    id: 'pepper',
    nameKey: 'crop_pepper',
    category: 'vegetable',
    avgYield: 22,
    minYield: 12,
    maxYield: 35,
    seedCost: 30000,
    fertilizerCost: 28000,
    fuelCost: 9000,
    laborCost: 38000,
    otherCosts: 14000,
    pricePerTon: 55000,
    plantingSeason: 'spring',
    harvestSeason: 'summer',
    growthPeriod: 130
  }
];

// Региональные коэффициенты урожайности
export const REGION_COEFFICIENTS: Record<string, number> = {
  'chui': 1.15, // Чуйская область - лучшие условия
  'issyk-kul': 0.95, // Иссык-Куль - высокогорье
  'jalal-abad': 1.10,
  'osh': 1.05,
  'batken': 0.90,
  'talas': 1.00,
  'naryn': 0.85 // суровый климат
};

// Качество удобрений (коэффициент эффективности)
export const FERTILIZER_QUALITY: Record<string, { coefficient: number; cost: number }> = {
  'none': { coefficient: 0.7, cost: 0 },
  'basic': { coefficient: 1.0, cost: 1.0 },
  'improved': { coefficient: 1.25, cost: 1.5 },
  'premium': { coefficient: 1.4, cost: 2.0 }
};

// Технология обработки
export const CULTIVATION_METHOD: Record<string, { coefficient: number; costMultiplier: number }> = {
  'manual': { coefficient: 0.8, costMultiplier: 1.5 }, // ручной труд - низкая эффективность, высокие затраты
  'mechanized': { coefficient: 1.0, costMultiplier: 1.0 }, // механизированная - стандарт
  'modern': { coefficient: 1.3, costMultiplier: 1.4 } // современные технологии - высокая эффективность
};

export const getCropById = (id: string): CropType | undefined => {
  return CROPS.find(crop => crop.id === id);
};

export const getCropsByCategory = (category: string): CropType[] => {
  return CROPS.filter(crop => crop.category === category);
};
