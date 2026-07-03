// ============================================================================
// ДАННЫЕ ПО СТРОИТЕЛЬНЫМ МАТЕРИАЛАМ В КЫРГЫЗСТАНЕ
// ============================================================================
// АКТУАЛЬНО НА: Июль 2026 (Q3 2026)
// ИСТОЧНИКИ: Строительные рынки Бишкека (Дордой, Ош-базар), salexy.kg, lalafo.kg,
//            aviastal.kg, stroymag-bishkek.com (цемент/блоки — сверка 2026-07)
//
// Все цены указаны в сомах
// Цены актуальны для Бишкека, в регионах могут отличаться на 5-10%
// ============================================================================

export interface Material {
  id: string;
  nameKey: string;
  unit: string; // единица измерения
  pricePerUnit: number; // сом за единицу
  description: string;
}

// Основные строительные материалы
export const MATERIALS: Material[] = [
  // Кирпич
  {
    id: 'brick-red',
    nameKey: 'material_brick_red',
    unit: 'шт',
    pricePerUnit: 12,
    description: 'Кирпич красный керамический'
  },
  {
    id: 'brick-silicate',
    nameKey: 'material_brick_silicate',
    unit: 'шт',
    pricePerUnit: 10,
    description: 'Кирпич силикатный белый'
  },
  
  // Цемент
  {
    id: 'cement-m400',
    nameKey: 'material_cement_m400',
    unit: 'мешок 50кг',
    pricePerUnit: 330,
    description: 'Цемент М400 (мешок 50кг)'
  },
  {
    id: 'cement-m500',
    nameKey: 'material_cement_m500',
    unit: 'мешок 50кг',
    pricePerUnit: 380,
    description: 'Цемент М500 (мешок 50кг)'
  },
  
  // Песок
  {
    id: 'sand',
    nameKey: 'material_sand',
    unit: 'м³',
    pricePerUnit: 800,
    description: 'Песок строительный'
  },
  
  // Щебень
  {
    id: 'gravel',
    nameKey: 'material_gravel',
    unit: 'м³',
    pricePerUnit: 1200,
    description: 'Щебень гранитный'
  },
  
  // Арматура
  {
    id: 'rebar-10',
    nameKey: 'material_rebar_10',
    unit: 'метр',
    pricePerUnit: 80,
    description: 'Арматура 10мм'
  },
  {
    id: 'rebar-12',
    nameKey: 'material_rebar_12',
    unit: 'метр',
    pricePerUnit: 95,
    description: 'Арматура 12мм'
  },
  
  // Доски
  {
    id: 'board',
    nameKey: 'material_board',
    unit: 'м³',
    pricePerUnit: 12000,
    description: 'Доска обрезная'
  },
  
  // Блоки
  {
    id: 'block-foam',
    nameKey: 'material_block_foam',
    unit: 'шт',
    pricePerUnit: 120,
    description: 'Пеноблок 200x300x600'
  },
  {
    id: 'block-gas',
    nameKey: 'material_block_gas',
    unit: 'шт',
    pricePerUnit: 165,
    description: 'Газоблок 200x300x600'
  },
  
  // Кровля
  {
    id: 'roofing-metal',
    nameKey: 'material_roofing_metal',
    unit: 'м²',
    pricePerUnit: 450,
    description: 'Металлочерепица'
  },
  {
    id: 'roofing-profile',
    nameKey: 'material_roofing_profile',
    unit: 'м²',
    pricePerUnit: 350,
    description: 'Профнастил'
  }
];

// Типы строительных работ
export interface ConstructionType {
  id: string;
  nameKey: string;
  materials: {
    materialId: string;
    consumptionPer1m2: number; // расход на 1 м²
  }[];
}

export const CONSTRUCTION_TYPES: ConstructionType[] = [
  {
    id: 'wall-brick',
    nameKey: 'construction_wall_brick',
    materials: [
      { materialId: 'brick-red', consumptionPer1m2: 51 }, // кирпич в 0.5 кирпича
      { materialId: 'cement-m400', consumptionPer1m2: 0.025 }, // мешок 50кг
      { materialId: 'sand', consumptionPer1m2: 0.05 } // куб
    ]
  },
  {
    id: 'wall-block',
    nameKey: 'construction_wall_block',
    materials: [
      { materialId: 'block-foam', consumptionPer1m2: 5.5 }, // блоков
      { materialId: 'cement-m400', consumptionPer1m2: 0.015 },
      { materialId: 'sand', consumptionPer1m2: 0.03 }
    ]
  },
  {
    id: 'foundation',
    nameKey: 'construction_foundation',
    materials: [
      { materialId: 'cement-m500', consumptionPer1m2: 6.5 }, // мешков на м³
      { materialId: 'sand', consumptionPer1m2: 0.6 },
      { materialId: 'gravel', consumptionPer1m2: 0.8 },
      { materialId: 'rebar-12', consumptionPer1m2: 15 } // метров
    ]
  },
  {
    id: 'roofing',
    nameKey: 'construction_roofing',
    materials: [
      { materialId: 'roofing-metal', consumptionPer1m2: 1.15 }, // с запасом
      { materialId: 'board', consumptionPer1m2: 0.025 } // м³ обрешётки
    ]
  }
];

// Стоимость доставки (зависит от объёма)
export const DELIVERY_COST = {
  minCost: 1500, // минимальная стоимость
  costPerKm: 50, // сом за км
  freeDeliveryFrom: 50000 // бесплатная доставка от суммы заказа
};

// Функция для расчёта количества материалов
export const calculateMaterials = (
  constructionTypeId: string,
  area: number // м²
): { materialId: string; quantity: number; cost: number }[] => {
  const constructionType = CONSTRUCTION_TYPES.find(ct => ct.id === constructionTypeId);
  if (!constructionType) return [];
  
  return constructionType.materials.map(mat => {
    const material = MATERIALS.find(m => m.id === mat.materialId);
    const quantity = mat.consumptionPer1m2 * area;
    const cost = quantity * (material?.pricePerUnit || 0);
    
    return {
      materialId: mat.materialId,
      quantity,
      cost
    };
  });
};

// Функция для расчёта стоимости доставки
export const calculateDeliveryCost = (
  totalCost: number,
  distanceKm: number
): number => {
  if (totalCost >= DELIVERY_COST.freeDeliveryFrom) {
    return 0; // бесплатная доставка
  }
  
  const deliveryCost = DELIVERY_COST.minCost + (distanceKm * DELIVERY_COST.costPerKm);
  return deliveryCost;
};

// Функция для получения названия материала
export const getMaterialById = (id: string): Material | undefined => {
  return MATERIALS.find(m => m.id === id);
};

// Примеры расчётов
export interface ConstructionExample {
  id: string;
  titleKey: string;
  constructionType: string;
  area: number;
}

export const CONSTRUCTION_EXAMPLES: ConstructionExample[] = [
  {
    id: 'example-1',
    titleKey: 'construction_example_1_title',
    constructionType: 'wall-brick',
    area: 100 // м² стены
  },
  {
    id: 'example-2',
    titleKey: 'construction_example_2_title',
    constructionType: 'foundation',
    area: 50 // м³ фундамента
  },
  {
    id: 'example-3',
    titleKey: 'construction_example_3_title',
    constructionType: 'roofing',
    area: 120 // м² кровли
  }
];

// Средние нормы расхода (справочная информация)
export const CONSUMPTION_NORMS = {
  brickWall: {
    halfBrick: 51, // штук на м²
    oneBrick: 102,
    oneAndHalfBrick: 153
  },
  cement: {
    concrete: 6.5, // мешков 50кг на м³
    mortar: 8, // мешков 50кг на м³
    screed: 7.5 // мешков 50кг на м³
  },
  rebar: {
    foundation: 150, // кг на м³
    columns: 200,
    slabs: 100
  }
};
