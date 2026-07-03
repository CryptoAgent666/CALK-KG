// ============================================================================
// ДАННЫЕ ПО ЦЕНАМ НА ТОПЛИВО В КЫРГЫЗСТАНЕ
// ============================================================================
// АКТУАЛЬНО НА: 3 июля 2026
// ИСТОЧНИКИ: Госантимонополия КР — максимальные розничные цены для Бишкека/Чуй
//            (действуют 25.05–30.09.2026), АЗС Бишкека, globalpetrolprices.com
//
// Цены указаны в сомах за 1 литр
// Цены актуальны для Бишкека, в регионах могут отличаться на 2-5 сом
// Газ (пропан/автогаз) — регулируемый потолок 45.8 сом/л (Бишкек/Чуй/Талас)
// ============================================================================

export interface FuelType {
  id: string;
  nameKey: string;
  price: number; // сом за литр
  description: string;
}

export const FUEL_TYPES: FuelType[] = [
  {
    id: 'ai-92',
    nameKey: 'fuel_type_ai92',
    price: 79.9,
    description: 'Бензин АИ-92 (регуляр)'
  },
  {
    id: 'ai-95',
    nameKey: 'fuel_type_ai95',
    price: 88.5,
    description: 'Бензин АИ-95 (премиум)'
  },
  {
    id: 'ai-98',
    nameKey: 'fuel_type_ai98',
    price: 88.0,
    description: 'Бензин АИ-98 (супер)'
  },
  {
    id: 'diesel',
    nameKey: 'fuel_type_diesel',
    price: 93.9,
    description: 'Дизельное топливо'
  },
  {
    id: 'gas',
    nameKey: 'fuel_type_gas',
    price: 45.8,
    description: 'Газ (пропан)'
  }
];

// Типичные расходы топлива для разных типов авто
export interface VehicleConsumption {
  id: string;
  nameKey: string;
  avgConsumption: number; // л/100км
  fuelType: string;
}

export const VEHICLE_TYPES: VehicleConsumption[] = [
  {
    id: 'compact',
    nameKey: 'vehicle_compact',
    avgConsumption: 6.5,
    fuelType: 'ai-92'
  },
  {
    id: 'sedan',
    nameKey: 'vehicle_sedan',
    avgConsumption: 8.5,
    fuelType: 'ai-95'
  },
  {
    id: 'suv',
    nameKey: 'vehicle_suv',
    avgConsumption: 12,
    fuelType: 'ai-95'
  },
  {
    id: 'minivan',
    nameKey: 'vehicle_minivan',
    avgConsumption: 10,
    fuelType: 'ai-92'
  },
  {
    id: 'truck',
    nameKey: 'vehicle_truck',
    avgConsumption: 15,
    fuelType: 'diesel'
  },
  {
    id: 'taxi',
    nameKey: 'vehicle_taxi',
    avgConsumption: 9,
    fuelType: 'gas'
  },
  {
    id: 'custom',
    nameKey: 'vehicle_custom',
    avgConsumption: 10,
    fuelType: 'ai-92'
  }
];

// Популярные маршруты в Кыргызстане
export interface PopularRoute {
  id: string;
  from: string;
  to: string;
  distance: number; // км
}

export const POPULAR_ROUTES: PopularRoute[] = [
  {
    id: 'bishkek-osh',
    from: 'Бишкек',
    to: 'Ош',
    distance: 680
  },
  {
    id: 'bishkek-issykkul',
    from: 'Бишкек',
    to: 'Иссык-Куль (Чолпон-Ата)',
    distance: 250
  },
  {
    id: 'bishkek-talas',
    from: 'Бишкек',
    to: 'Талас',
    distance: 330
  },
  {
    id: 'bishkek-naryn',
    from: 'Бишкек',
    to: 'Нарын',
    distance: 340
  },
  {
    id: 'bishkek-jalalabad',
    from: 'Бишкек',
    to: 'Джалал-Абад',
    distance: 650
  },
  {
    id: 'bishkek-karakol',
    from: 'Бишкек',
    to: 'Каракол',
    distance: 400
  },
  {
    id: 'osh-jalalabad',
    from: 'Ош',
    to: 'Джалал-Абад',
    distance: 90
  },
  {
    id: 'bishkek-tokmok',
    from: 'Бишкек',
    to: 'Токмок',
    distance: 60
  }
];

// Функция для получения цены топлива по ID
export const getFuelPrice = (fuelTypeId: string): number => {
  const fuelType = FUEL_TYPES.find(f => f.id === fuelTypeId);
  return fuelType ? fuelType.price : 79.9; // по умолчанию АИ-92
};

// Функция для расчёта стоимости поездки
export const calculateTripCost = (
  distance: number,
  consumption: number, // л/100км
  fuelPrice: number
): number => {
  const fuelNeeded = (distance / 100) * consumption;
  return fuelNeeded * fuelPrice;
};

// Функция для расчёта необходимого количества топлива
export const calculateFuelNeeded = (
  distance: number,
  consumption: number
): number => {
  return (distance / 100) * consumption;
};

// Функция для расчёта экономии при сравнении двух авто
export const calculateSavings = (
  distance: number,
  consumption1: number,
  fuelPrice1: number,
  consumption2: number,
  fuelPrice2: number
): number => {
  const cost1 = calculateTripCost(distance, consumption1, fuelPrice1);
  const cost2 = calculateTripCost(distance, consumption2, fuelPrice2);
  return cost1 - cost2;
};

// Функция для расчёта годовых затрат
export const calculateYearlyExpenses = (
  monthlyKm: number,
  consumption: number,
  fuelPrice: number
): number => {
  const yearlyKm = monthlyKm * 12;
  return calculateTripCost(yearlyKm, consumption, fuelPrice);
};

// Примеры для калькулятора
export interface FuelExample {
  id: string;
  titleKey: string;
  distance: number;
  consumption: number;
  fuelType: string;
}

export const FUEL_EXAMPLES: FuelExample[] = [
  {
    id: 'example-1',
    titleKey: 'fuel_example_1_title',
    distance: 680, // Бишкек-Ош
    consumption: 8.5,
    fuelType: 'ai-95'
  },
  {
    id: 'example-2',
    titleKey: 'fuel_example_2_title',
    distance: 250, // Бишкек-Иссык-Куль
    consumption: 6.5,
    fuelType: 'ai-92'
  },
  {
    id: 'example-3',
    titleKey: 'fuel_example_3_title',
    distance: 100, // Ежедневно по городу
    consumption: 10,
    fuelType: 'gas'
  }
];
