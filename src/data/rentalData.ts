// ============================================================================
// ДАННЫЕ ПО АРЕНДЕ ЖИЛЬЯ В БИШКЕКЕ
// ============================================================================
// АКТУАЛЬНО НА: Апрель 2026 (Q2 2026)
// ИСТОЧНИКИ: lalafo.kg, diesel.kg, market.kg, агентства недвижимости
//
// Все цены указаны в сомах (KGS)
// Цены - средние рыночные за месяц
// ============================================================================

export interface ApartmentType {
  id: string;
  nameKey: string;
  rooms: number; // 0 = студия
}

export interface DistrictData {
  id: string;
  nameKey: string;
  popularity: 'high' | 'medium' | 'low';
  
  // Цены аренды по типам (сом/мес)
  studio: number;
  oneRoom: number;
  twoRoom: number;
  threeRoom: number;
  
  // Особенности района
  features: string[]; // ключи для переводов
  
  // Коэффициент престижности (для элитного жилья)
  prestigeCoefficient: number;
}

export const APARTMENT_TYPES: ApartmentType[] = [
  { id: 'studio', nameKey: 'rent_type_studio', rooms: 0 },
  { id: 'one-room', nameKey: 'rent_type_one_room', rooms: 1 },
  { id: 'two-room', nameKey: 'rent_type_two_room', rooms: 2 },
  { id: 'three-room', nameKey: 'rent_type_three_room', rooms: 3 }
];

export const DISTRICTS: DistrictData[] = [
  // Центральные престижные районы
  {
    id: 'center',
    nameKey: 'rent_district_center',
    popularity: 'high',
    studio: 25000,
    oneRoom: 30000,
    twoRoom: 45000,
    threeRoom: 65000,
    features: ['rent_feature_center', 'rent_feature_infrastructure', 'rent_feature_transport'],
    prestigeCoefficient: 1.5
  },
  {
    id: 'asanbai',
    nameKey: 'rent_district_asanbai',
    popularity: 'high',
    studio: 22000,
    oneRoom: 28000,
    twoRoom: 42000,
    threeRoom: 60000,
    features: ['rent_feature_park', 'rent_feature_restaurants', 'rent_feature_clean'],
    prestigeCoefficient: 1.4
  },
  {
    id: 'vostok-5',
    nameKey: 'rent_district_vostok5',
    popularity: 'high',
    studio: 24000,
    oneRoom: 29000,
    twoRoom: 44000,
    threeRoom: 62000,
    features: ['rent_feature_new_buildings', 'rent_feature_parking', 'rent_feature_security'],
    prestigeCoefficient: 1.45
  },
  
  // Популярные жилые районы
  {
    id: 'tunguch',
    nameKey: 'rent_district_tunguch',
    popularity: 'high',
    studio: 20000,
    oneRoom: 24000,
    twoRoom: 36000,
    threeRoom: 52000,
    features: ['rent_feature_residential', 'rent_feature_schools', 'rent_feature_markets'],
    prestigeCoefficient: 1.2
  },
  {
    id: 'junhai',
    nameKey: 'rent_district_junhai',
    popularity: 'high',
    studio: 19000,
    oneRoom: 23000,
    twoRoom: 35000,
    threeRoom: 50000,
    features: ['rent_feature_new_area', 'rent_feature_developing', 'rent_feature_accessible'],
    prestigeCoefficient: 1.15
  },
  {
    id: 'politeh',
    nameKey: 'rent_district_politeh',
    popularity: 'medium',
    studio: 18000,
    oneRoom: 22000,
    twoRoom: 33000,
    threeRoom: 48000,
    features: ['rent_feature_students', 'rent_feature_universities', 'rent_feature_cheap'],
    prestigeCoefficient: 1.0
  },
  
  // Средние районы
  {
    id: 'archa-beshik',
    nameKey: 'rent_district_archa_beshik',
    popularity: 'medium',
    studio: 17000,
    oneRoom: 21000,
    twoRoom: 32000,
    threeRoom: 46000,
    features: ['rent_feature_quiet', 'rent_feature_greenery', 'rent_feature_family'],
    prestigeCoefficient: 1.1
  },
  {
    id: 'ak-orgo',
    nameKey: 'rent_district_ak_orgo',
    popularity: 'medium',
    studio: 16000,
    oneRoom: 20000,
    twoRoom: 30000,
    threeRoom: 44000,
    features: ['rent_feature_residential', 'rent_feature_transport', 'rent_feature_affordable'],
    prestigeCoefficient: 1.05
  },
  {
    id: 'djal',
    nameKey: 'rent_district_djal',
    popularity: 'medium',
    studio: 15000,
    oneRoom: 19000,
    twoRoom: 29000,
    threeRoom: 42000,
    features: ['rent_feature_industrial', 'rent_feature_market_nearby', 'rent_feature_budget'],
    prestigeCoefficient: 0.95
  },
  
  // Бюджетные районы
  {
    id: 'kok-jar',
    nameKey: 'rent_district_kok_jar',
    popularity: 'low',
    studio: 14000,
    oneRoom: 18000,
    twoRoom: 27000,
    threeRoom: 40000,
    features: ['rent_feature_outskirts', 'rent_feature_cheap', 'rent_feature_far_center'],
    prestigeCoefficient: 0.9
  },
  {
    id: 'alay',
    nameKey: 'rent_district_alay',
    popularity: 'low',
    studio: 13000,
    oneRoom: 17000,
    twoRoom: 26000,
    threeRoom: 38000,
    features: ['rent_feature_market', 'rent_feature_budget', 'rent_feature_old_buildings'],
    prestigeCoefficient: 0.85
  },
  {
    id: 'manas',
    nameKey: 'rent_district_manas',
    popularity: 'low',
    studio: 15000,
    oneRoom: 19000,
    twoRoom: 28000,
    threeRoom: 41000,
    features: ['rent_feature_airport', 'rent_feature_accessible', 'rent_feature_middle_class'],
    prestigeCoefficient: 0.95
  }
];

// Коммунальные расходы (примерные средние в месяц, сом)
export const UTILITIES_COSTS = {
  electricity: {
    studio: 800,
    oneRoom: 1000,
    twoRoom: 1500,
    threeRoom: 2000
  },
  water: {
    studio: 500,
    oneRoom: 700,
    twoRoom: 1000,
    threeRoom: 1300
  },
  heating: {
    winter: {
      studio: 2000,
      oneRoom: 2500,
      twoRoom: 3500,
      threeRoom: 4500
    },
    summer: {
      studio: 0,
      oneRoom: 0,
      twoRoom: 0,
      threeRoom: 0
    }
  },
  gas: {
    studio: 300,
    oneRoom: 400,
    twoRoom: 600,
    threeRoom: 800
  },
  internet: 800, // фиксированная стоимость
  garbage: 200 // фиксированная стоимость
};

// Дополнительные расходы
export const ADDITIONAL_COSTS = {
  deposit: 2, // количество месяцев аренды (залог)
  agencyFee: 0.5, // коэффициент от месячной аренды
  maintenanceFee: 500 // ежемесячная плата за обслуживание дома (если есть)
};

// Условия ипотеки для сравнения (средние по рынку 2026)
export const MORTGAGE_CONDITIONS = {
  interestRate: 16, // годовая ставка %
  downPaymentPercent: 30, // первоначальный взнос %
  termYears: 15, // срок кредита в годах
  
  // Средняя стоимость квадратного метра по районам (сом/м²)
  pricePerSqmByDistrict: {
    'center': 120000,
    'asanbai': 110000,
    'vostok-5': 115000,
    'tunguch': 95000,
    'junhai': 90000,
    'politeh': 85000,
    'archa-beshik': 88000,
    'ak-orgo': 82000,
    'djal': 78000,
    'kok-jar': 75000,
    'alay': 72000,
    'manas': 80000
  },
  
  // Средняя площадь по типам квартир (м²)
  averageArea: {
    studio: 28,
    oneRoom: 40,
    twoRoom: 55,
    threeRoom: 70
  }
};

export const getDistrictById = (id: string): DistrictData | undefined => {
  return DISTRICTS.find(d => d.id === id);
};

export const getRentPrice = (districtId: string, apartmentType: string): number => {
  const district = getDistrictById(districtId);
  if (!district) return 0;
  
  switch (apartmentType) {
    case 'studio': return district.studio;
    case 'one-room': return district.oneRoom;
    case 'two-room': return district.twoRoom;
    case 'three-room': return district.threeRoom;
    default: return 0;
  }
};

export const calculateUtilities = (apartmentType: string, season: 'winter' | 'summer'): number => {
  const type = apartmentType === 'one-room' ? 'oneRoom' : 
               apartmentType === 'two-room' ? 'twoRoom' : 
               apartmentType === 'three-room' ? 'threeRoom' : 'studio';
  
  const electricity = UTILITIES_COSTS.electricity[type];
  const water = UTILITIES_COSTS.water[type];
  const heating = UTILITIES_COSTS.heating[season][type];
  const gas = UTILITIES_COSTS.gas[type];
  const internet = UTILITIES_COSTS.internet;
  const garbage = UTILITIES_COSTS.garbage;
  
  return electricity + water + heating + gas + internet + garbage;
};

export const calculateMortgagePayment = (
  loanAmount: number,
  annualRate: number,
  years: number
): number => {
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;
  
  if (monthlyRate === 0) return loanAmount / numberOfPayments;
  
  const payment = loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  return payment;
};
