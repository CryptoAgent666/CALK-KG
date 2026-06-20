// Типы данных для штрафов ПДД
export interface TrafficFine {
  id: string;
  categoryId: string;
  fine: number;
  article: string;
  notesId: string;
  keywords: string[];
}

// База данных штрафов ПДД Кыргызстана
// АКТУАЛЬНО НА: июнь 2026. Номера статей сверены с Кодексом КР о правонарушениях №128 (ред. 23.04.2026), cbd.minjust.gov.kg.
// ⚠️ Требуют отдельной сверки (статья и/или сумма): parking_disabled, no_child_seat, cargo_overload_20(_plus), overtaking_crosswalk, railway_crossing, illegal_signals, passenger_rules.
// Суммы и статьи сверены с Кодексом КР о правонарушениях №128 (ред. 23.04.2026): 1 РП = 100 сом.
// Источник: cbd.minjust.gov.kg (№128), joldo.kg, ЦИК КР. drugs/leave_accident — лишение прав (0 сом).
export const TRAFFIC_FINES: TrafficFine[] = [
  // Скоростной режим
  {
    id: 'speed_10_20',
    categoryId: 'speed',
    fine: 1000,
    article: 'Ст. 187 ч. 1',
    notesId: 'discount_70',
    keywords: ['превышение', 'скорость', '10-20', 'км/ч']
  },
  {
    id: 'speed_20_40',
    categoryId: 'speed',
    fine: 3000,
    article: 'Ст. 187 ч. 2',
    notesId: 'discount_70',
    keywords: ['превышение', 'скорость', '20-40', 'км/ч']
  },
  {
    id: 'speed_40_60',
    categoryId: 'speed',
    fine: 7500,
    article: 'Ст. 187 ч. 3',
    notesId: 'discount_70',
    keywords: ['превышение', 'скорость', '40-60', 'км/ч']
  },
  {
    id: 'speed_60_plus',
    categoryId: 'speed',
    fine: 15000,
    article: 'Ст. 187 ч. 4',
    notesId: 'no_discount_license_6mo',
    keywords: ['превышение', 'скорость', '60', 'км/ч', 'лишение']
  },

  // Правила проезда
  {
    id: 'red_light',
    categoryId: 'traffic_rules',
    fine: 5500,
    article: 'Ст. 188 ч. 3',
    notesId: 'discount_70',
    keywords: ['светофор', 'красный', 'запрещающий', 'сигнал']
  },
  {
    id: 'oncoming_lane',
    categoryId: 'traffic_rules',
    fine: 15000,
    article: 'Ст. 188 ч. 5',
    notesId: 'no_discount_license_4_6mo',
    keywords: ['встречная', 'полоса', 'выезд', 'лобовое']
  },
  {
    id: 'turn_sign_violation',
    categoryId: 'traffic_rules',
    fine: 1000,
    article: 'Ст. 188 ч. 1',
    notesId: 'discount_70',
    keywords: ['поворот', 'разворот', 'знак', 'запрет']
  },
  {
    id: 'pedestrian_crossing',
    categoryId: 'traffic_rules',
    fine: 3000,
    article: 'Ст. 188 ч. 2',
    notesId: 'discount_70',
    keywords: ['пешеход', 'переход', 'зебра', 'преимущество']
  },

  // Парковка и остановка
  {
    id: 'parking_prohibited',
    categoryId: 'parking',
    fine: 1000,
    article: 'Ст. 188 ч. 1',
    notesId: 'discount_70_tow',
    keywords: ['парковка', 'стоянка', 'остановка', 'запрещенное', 'место']
  },
  {
    id: 'parking_disabled',
    categoryId: 'parking',
    fine: 1000,
    article: 'Ст. 188 ч. 1',
    notesId: 'discount_70_tow_mandatory',
    keywords: ['инвалид', 'парковка', 'место', 'остановка']
  },
  {
    id: 'parking_sidewalk',
    categoryId: 'parking',
    fine: 1000,
    article: 'Ст. 188 ч. 1',
    notesId: 'discount_70_tow',
    keywords: ['тротуар', 'парковка', 'стоянка', 'пешеходная', 'зона']
  },

  // Документы и техосмотр
  {
    id: 'no_license',
    categoryId: 'documents',
    fine: 15000,
    article: 'Ст. 184 ч. 3',
    notesId: 'no_discount_driving_ban',
    keywords: ['права', 'удостоверение', 'без', 'документы']
  },
  {
    id: 'expired_license',
    categoryId: 'documents',
    fine: 1000,
    article: 'Ст. 184 ч. 1',
    notesId: 'discount_70',
    keywords: ['просроченные', 'права', 'срок', 'удостоверение']
  },
  {
    id: 'no_insurance',
    categoryId: 'documents',
    fine: 3000,
    article: 'Ст. 184 ч. 2',
    notesId: 'discount_70',
    keywords: ['страховка', 'полис', 'ОГПО', 'ВТС', 'страхование']
  },
  {
    id: 'no_insurance_legal',
    categoryId: 'documents',
    fine: 13000,
    article: 'Ст. 184 ч. 2',
    notesId: 'discount_70',
    keywords: ['страховка', 'полис', 'ОГПО', 'ВТС', 'страхование', 'юрлицо', 'юридическое лицо']
  },
  {
    id: 'faulty_vehicle',
    categoryId: 'documents',
    fine: 5500,
    article: 'Ст. 182 ч. 1',
    notesId: 'discount_70_driving_ban_repair',
    keywords: ['неисправность', 'техническое', 'состояние', 'тормоза', 'свет']
  },

  // Алкогольное опьянение (с 08.03.2023 — лишение прав без штрафа)
  {
    id: 'alcohol_under_08',
    categoryId: 'alcohol',
    fine: 0,
    article: 'Ст. 193 ч. 1',
    notesId: 'no_discount_license_1y',
    keywords: ['алкоголь', 'опьянение', 'промилле', '0.8', 'пьяный']
  },
  {
    id: 'alcohol_over_08',
    categoryId: 'alcohol',
    fine: 0,
    article: 'Ст. 193 ч. 1',
    notesId: 'no_discount_license_3y',
    keywords: ['алкоголь', 'опьянение', 'промилле', '0.8', 'пьяный', 'тяжелое']
  },
  {
    id: 'alcohol_refusal',
    categoryId: 'alcohol',
    fine: 0,
    article: 'Ст. 193 ч. 2',
    notesId: 'no_discount_license_1y',
    keywords: ['отказ', 'медицинское', 'освидетельствование', 'алкотестер']
  },

  // Использование устройств
  {
    id: 'phone_driving',
    categoryId: 'devices',
    fine: 3000,
    article: 'Ст. 188 ч. 2',
    notesId: 'discount_70',
    keywords: ['телефон', 'мобильный', 'разговор', 'hands-free', 'гарнитура']
  },

  // Ремни безопасности
  {
    id: 'no_seatbelt',
    categoryId: 'seatbelt',
    fine: 1000,
    article: 'Ст. 182 ч. 6',
    notesId: 'discount_70',
    keywords: ['ремень', 'безопасность', 'непристегнутый', 'водитель']
  },
  {
    id: 'no_child_seat',
    categoryId: 'seatbelt',
    fine: 1000,
    article: 'Ст. 182 ч. 6',
    notesId: 'discount_70',
    keywords: ['дети', 'автокресло', 'удерживающие', 'устройства', 'ребенок']
  },

  // Дорожная разметка
  {
    id: 'solid_line',
    categoryId: 'road_marking',
    fine: 1000,
    article: 'Ст. 188 ч. 1',
    notesId: 'discount_70',
    keywords: ['сплошная', 'линия', 'разметка', 'пересечение']
  },
  {
    id: 'shoulder_driving',
    categoryId: 'road_marking',
    fine: 1000,
    article: 'Ст. 188 ч. 1',
    notesId: 'discount_70',
    keywords: ['обочина', 'движение', 'край', 'дороги']
  },

  // Регистрационные знаки
  {
    id: 'no_plates',
    categoryId: 'plates',
    fine: 10000,
    article: 'Ст. 182 ч. 4',
    notesId: 'discount_70_driving_ban',
    keywords: ['номера', 'регистрационные', 'знаки', 'отсутствие']
  },
  {
    id: 'fake_plates',
    categoryId: 'plates',
    fine: 10000,
    article: 'Ст. 182 ч. 4',
    notesId: 'no_discount_confiscation',
    keywords: ['подложные', 'поддельные', 'измененные', 'номера']
  },

  // Перевозка пассажиров
  {
    id: 'passenger_rules',
    categoryId: 'passengers',
    fine: 3000,
    article: 'Ст. 199 ч. 7',
    notesId: 'discount_70',
    keywords: ['пассажиры', 'перевозка', 'правила', 'нарушение']
  },

  // Перевозка грузов
  {
    id: 'cargo_overload_20',
    categoryId: 'cargo',
    fine: 17500,
    article: 'Ст. 181 ч. 1',
    notesId: 'discount_70',
    keywords: ['перегруз', 'масса', 'груз', '20%', 'превышение']
  },
  {
    id: 'cargo_overload_20_plus',
    categoryId: 'cargo',
    fine: 20000,
    article: 'Ст. 181 ч. 1',
    notesId: 'discount_70_driving_ban_unload',
    keywords: ['перегруз', 'масса', 'груз', '20%', 'свыше']
  },

  // Обгон
  {
    id: 'overtaking_prohibited',
    categoryId: 'overtaking',
    fine: 15000,
    article: 'Ст. 188 ч. 5',
    notesId: 'discount_70',
    keywords: ['обгон', 'запрещенное', 'место', 'опережение']
  },
  {
    id: 'overtaking_crosswalk',
    categoryId: 'overtaking',
    fine: 15000,
    article: 'Ст. 188 ч. 5',
    notesId: 'no_discount',
    keywords: ['обгон', 'пешеходный', 'переход', 'зебра']
  },

  // Световые приборы
  {
    id: 'lights_daytime',
    categoryId: 'lights',
    fine: 1000,
    article: 'Ст. 188 ч. 1',
    notesId: 'discount_70',
    keywords: ['фары', 'свет', 'дневное', 'время', 'ближний']
  },
  {
    id: 'high_beam_city',
    categoryId: 'lights',
    fine: 1000,
    article: 'Ст. 188 ч. 1',
    notesId: 'discount_70',
    keywords: ['дальний', 'свет', 'населенный', 'пункт', 'город']
  },

  // Железнодорожный переезд
  {
    id: 'railway_crossing',
    categoryId: 'railway',
    fine: 1000,
    article: 'Ст. 188 ч. 1',
    notesId: 'no_discount_license_3_6mo',
    keywords: ['железнодорожный', 'переезд', 'поезд', 'шлагбаум']
  },

  // Наркотическое опьянение
  {
    id: 'drugs',
    categoryId: 'drugs',
    fine: 0,
    article: 'Ст. 193 ч. 1',
    notesId: 'no_discount_license_2_3y',
    keywords: ['наркотики', 'наркотическое', 'опьянение', 'наркологический']
  },

  // ДТП
  {
    id: 'leave_accident',
    categoryId: 'accident',
    fine: 0,
    article: 'Ст. 192 ч. 4',
    notesId: 'no_discount_license_1_1_5y',
    keywords: ['ДТП', 'оставление', 'место', 'авария', 'скрылся']
  },

  // Спецсигналы
  {
    id: 'illegal_signals',
    categoryId: 'signals',
    fine: 5500,
    article: 'Ст. 194 ч. 2',
    notesId: 'no_discount_confiscation',
    keywords: ['спецсигналы', 'мигалка', 'сирена', 'незаконное']
  },

  // Мотоциклы
  {
    id: 'motorcycle_no_helmet',
    categoryId: 'motorcycle',
    fine: 1000,
    article: 'Ст. 182 ч. 6',
    notesId: 'discount_70',
    keywords: ['мотоцикл', 'шлем', 'защита', 'голова']
  },

  // Пешеходы
  {
    id: 'pedestrian_wrong_place',
    categoryId: 'pedestrian',
    fine: 1000,
    article: 'Ст. 190 ч. 1',
    notesId: 'discount_70',
    keywords: ['пешеход', 'переход', 'неустановленное', 'место']
  },
  {
    id: 'pedestrian_red_light',
    categoryId: 'pedestrian',
    fine: 1000,
    article: 'Ст. 190 ч. 1',
    notesId: 'discount_70',
    keywords: ['пешеход', 'красный', 'светофор', 'переход']
  }
];

// Категории штрафов
export const TRAFFIC_FINE_CATEGORIES = [
  'speed',
  'traffic_rules',
  'parking',
  'documents',
  'alcohol',
  'devices',
  'seatbelt',
  'road_marking',
  'plates',
  'passengers',
  'cargo',
  'overtaking',
  'lights',
  'railway',
  'drugs',
  'accident',
  'signals',
  'motorcycle',
  'pedestrian'
];
