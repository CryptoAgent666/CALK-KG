// Данные о системах денежных переводов в Кыргызстане (2026)
// Состав сверен с реестром НБКР (item=2665, версия от 23.10.2026). Не возвращать:
// Contact (аннулирован 21.02.2024), Золотая Корона/KoronaPay (аннулирована 12.10.2026),
// Migom (в реестре нет). Комиссии ориентировочные, на апрель 2026: у операторов они
// зависят от направления и способа выплаты, первоисточником не подтверждены.

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
    popularFrom: ['США', 'Европа', 'Казахстан'],
    popularTo: ['Кыргызстан'],
    features: [
      'Переводы из России приостановлены (с 24.03.2022)',
      'Международная система',
      'Переводы из любой страны',
      'Высокие лимиты',
      'Выдача в Демир Банке и др.'
    ],
    featuresKy: [
      'Россиядан которуулар 24.03.2022ден бери токтотулган',
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
