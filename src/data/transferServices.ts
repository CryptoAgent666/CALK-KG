// Данные о системах денежных переводов в Кыргызстане (2026)
// Комиссии актуальны на январь 2026

export interface TransferService {
  id: string;
  name: string;
  nameKy: string;
  logo?: string;
  commissionType: 'fixed' | 'percent' | 'combined'; // фиксированная, процент или комбинированная
  commissionFixed?: number; // фиксированная комиссия в долларах
  commissionPercent?: number; // процент комиссии
  commissionMin?: number; // минимальная комиссия
  commissionMax?: number; // максимальная комиссия
  exchangeRateMarkup: number; // наценка на курс обмена в %
  minAmount: number; // минимальная сумма перевода (USD)
  maxAmount: number; // максимальная сумма перевода (USD)
  deliveryTime: string; // время доставки
  deliveryTimeKy: string;
  countries: string[]; // страны отправления
  popularFrom: string[]; // популярные направления ОТ
  popularTo: string[]; // популярные направления К
  features: string[]; // особенности
  featuresKy: string[];
  website: string;
  color: string; // фирменный цвет
}

export const transferServices: TransferService[] = [
  {
    id: 'koronapay',
    name: 'Koronapay',
    nameKy: 'Koronapay',
    commissionType: 'combined',
    commissionFixed: 0,
    commissionPercent: 1.5,
    commissionMin: 3,
    commissionMax: 50,
    exchangeRateMarkup: 1.5,
    minAmount: 10,
    maxAmount: 10000,
    deliveryTime: '10-30 минут',
    deliveryTimeKy: '10-30 мүнөт',
    countries: ['Россия', 'Казахстан', 'Узбекистан', 'Таджикистан', 'Армения'],
    popularFrom: ['Россия', 'Казахстан'],
    popularTo: ['Кыргызстан'],
    features: [
      'Самая популярная система в КР',
      'Широкая сеть точек выдачи',
      'Быстрая доставка (от 10 минут)',
      'Выдача наличными',
      'Онлайн переводы'
    ],
    featuresKy: [
      'КРда эң популярдуу система',
      'Кеңири чыгуу пункттарынын тармагы',
      'Тез жеткирүү (10 мүнөттөн)',
      'Накт акча менен берүү',
      'Онлайн которуулар'
    ],
    website: 'https://koronapay.com',
    color: '#FF6B00'
  },
  {
    id: 'golden-crown',
    name: 'Golden Crown',
    nameKy: 'Golden Crown',
    commissionType: 'combined',
    commissionFixed: 0,
    commissionPercent: 2,
    commissionMin: 2,
    commissionMax: 40,
    exchangeRateMarkup: 1.8,
    minAmount: 10,
    maxAmount: 15000,
    deliveryTime: '15-60 минут',
    deliveryTimeKy: '15-60 мүнөт',
    countries: ['Россия', 'Казахстан', 'Украина', 'Беларусь', 'Узбекистан'],
    popularFrom: ['Россия', 'Казахстан'],
    popularTo: ['Кыргызстан'],
    features: [
      'Большие лимиты переводов',
      'Выдача в банках и точках',
      'Онлайн и офлайн переводы',
      'Удобное мобильное приложение'
    ],
    featuresKy: [
      'Которуулардын чоң лимиттери',
      'Банктарда жана пункттарда берүү',
      'Онлайн жана офлайн которуулар',
      'Ыңгайлуу мобилдик тиркеме'
    ],
    website: 'https://goldencrown.money',
    color: '#FFD700'
  },
  {
    id: 'contact',
    name: 'Contact',
    nameKy: 'Contact',
    commissionType: 'combined',
    commissionFixed: 0,
    commissionPercent: 1.8,
    commissionMin: 2.5,
    commissionMax: 45,
    exchangeRateMarkup: 2,
    minAmount: 10,
    maxAmount: 12000,
    deliveryTime: '15-40 минут',
    deliveryTimeKy: '15-40 мүнөт',
    countries: ['Россия', 'Казахстан', 'Украина', 'Беларусь', 'Узбекистан', 'Таджикистан'],
    popularFrom: ['Россия'],
    popularTo: ['Кыргызстан'],
    features: [
      'Старейшая система переводов',
      'Надежность и безопасность',
      'Выдача в банках',
      'Перевод на карту'
    ],
    featuresKy: [
      'Эң эски которуу системасы',
      'Ишенимдүүлүк жана коопсуздук',
      'Банктарда берүү',
      'Картага которуу'
    ],
    website: 'https://contact-sys.com',
    color: '#0066CC'
  },
  {
    id: 'unistream',
    name: 'Unistream',
    nameKy: 'Unistream',
    commissionType: 'combined',
    commissionFixed: 0,
    commissionPercent: 1.5,
    commissionMin: 3,
    commissionMax: 50,
    exchangeRateMarkup: 1.5,
    minAmount: 10,
    maxAmount: 10000,
    deliveryTime: '10-30 минут',
    deliveryTimeKy: '10-30 мүнөт',
    countries: ['Россия', 'Казахстан', 'Украина', 'Беларусь', 'Азербайджан'],
    popularFrom: ['Россия'],
    popularTo: ['Кыргызстан'],
    features: [
      'Быстрые переводы',
      'Широкая сеть в РФ',
      'Перевод на карту',
      'Онлайн сервис'
    ],
    featuresKy: [
      'Тез которуулар',
      'ОФдо кеңири тармак',
      'Картага которуу',
      'Онлайн кызмат'
    ],
    website: 'https://unistream.ru',
    color: '#E31E24'
  },
  {
    id: 'migom',
    name: 'Migom',
    nameKy: 'Migom',
    commissionType: 'combined',
    commissionFixed: 0,
    commissionPercent: 2.5,
    commissionMin: 2,
    commissionMax: 35,
    exchangeRateMarkup: 2.5,
    minAmount: 10,
    maxAmount: 8000,
    deliveryTime: '30-90 минут',
    deliveryTimeKy: '30-90 мүнөт',
    countries: ['Россия', 'Казахстан'],
    popularFrom: ['Россия'],
    popularTo: ['Кыргызстан'],
    features: [
      'Доступные комиссии',
      'Выдача в Оптиме и Народном',
      'Простое оформление'
    ],
    featuresKy: [
      'Жеткиликтүү комиссиялар',
      'Оптимада жана Народныйде берүү',
      'Жөнөкөй рааформдоо'
    ],
    website: 'https://migom.kg',
    color: '#00A651'
  },
  {
    id: 'western-union',
    name: 'Western Union',
    nameKy: 'Western Union',
    commissionType: 'combined',
    commissionFixed: 5,
    commissionPercent: 3,
    commissionMin: 5,
    commissionMax: 100,
    exchangeRateMarkup: 3,
    minAmount: 10,
    maxAmount: 50000,
    deliveryTime: '15-60 минут',
    deliveryTimeKy: '15-60 мүнөт',
    countries: ['200+ стран мира'],
    popularFrom: ['США', 'Европа', 'Россия', 'Казахстан'],
    popularTo: ['Кыргызстан'],
    features: [
      'Международная система',
      'Переводы из любой страны',
      'Высокие лимиты',
      'Выдача в Демир Банке и др.'
    ],
    featuresKy: [
      'Эл аралык система',
      'Каалаган өлкөдөн которуулар',
      'Жогорку лимиттер',
      'ДемирБанкта ж.б. берүү'
    ],
    website: 'https://www.westernunion.com',
    color: '#FFCC00'
  },
  {
    id: 'moneygram',
    name: 'MoneyGram',
    nameKy: 'MoneyGram',
    commissionType: 'combined',
    commissionFixed: 5,
    commissionPercent: 2.5,
    commissionMin: 5,
    commissionMax: 90,
    exchangeRateMarkup: 2.8,
    minAmount: 10,
    maxAmount: 30000,
    deliveryTime: '15-60 минут',
    deliveryTimeKy: '15-60 мүнөт',
    countries: ['200+ стран мира'],
    popularFrom: ['США', 'Европа', 'Россия'],
    popularTo: ['Кыргызстан'],
    features: [
      'Международная система',
      'Переводы из-за рубежа',
      'Большие суммы',
      'Выдача в Оптима Банке'
    ],
    featuresKy: [
      'Эл аралык система',
      'Чет өлкөдөн которуулар',
      'Чоң суммалар',
      'Оптима Банкта берүү'
    ],
    website: 'https://www.moneygram.com',
    color: '#D4145A'
  }
];

// Функция расчета комиссии
export const calculateCommission = (service: TransferService, amount: number): number => {
  let commission = 0;

  if (service.commissionType === 'fixed') {
    commission = service.commissionFixed || 0;
  } else if (service.commissionType === 'percent') {
    commission = (amount * (service.commissionPercent || 0)) / 100;
  } else if (service.commissionType === 'combined') {
    commission = (service.commissionFixed || 0) + (amount * (service.commissionPercent || 0)) / 100;
  }

  // Применяем минимальную и максимальную комиссию
  if (service.commissionMin && commission < service.commissionMin) {
    commission = service.commissionMin;
  }
  if (service.commissionMax && commission > service.commissionMax) {
    commission = service.commissionMax;
  }

  return commission;
};

// Функция применения наценки на курс
export const applyExchangeMarkup = (rate: number, markup: number): number => {
  return rate * (1 - markup / 100);
};
