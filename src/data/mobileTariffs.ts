// Данные о мобильных тарифах в Кыргызстане (2026)
// Актуальны на январь 2026

export interface MobileTariff {
  id: string;
  operator: 'megacom' | 'beeline' | 'o';
  name: string;
  nameKy: string;
  monthlyFee: number; // ежемесячная плата в сомах
  minutes: number | 'unlimited'; // минуты
  sms: number | 'unlimited'; // СМС
  internetGB: number | 'unlimited'; // интернет в ГБ
  socialMedia?: boolean; // безлимит соцсети
  messengers?: boolean; // безлимит мессенджеры
  extraMinuteCost: number; // стоимость дополнительной минуты
  extraSMSCost: number; // стоимость дополнительного СМС
  extraGBCost: number; // стоимость дополнительного ГБ
  features: string[]; // особенности
  featuresKy: string[];
  recommended?: boolean; // рекомендуемый тариф
  popular?: boolean; // популярный тариф
}

export const mobileTariffs: MobileTariff[] = [
  // MegaCom тарифы
  {
    id: 'megacom-unlim-s',
    operator: 'megacom',
    name: 'Unlim S',
    nameKy: 'Unlim S',
    monthlyFee: 250,
    minutes: 500,
    sms: 50,
    internetGB: 5,
    socialMedia: true,
    extraMinuteCost: 1,
    extraSMSCost: 0.5,
    extraGBCost: 50,
    features: [
      'Безлимит Instagram, TikTok, Facebook',
      '500 минут на все номера КР',
      '5 ГБ интернета',
      'Роуминг в ЕврАзЭС'
    ],
    featuresKy: [
      'Instagram, TikTok, Facebook чексиз',
      'КРдын бардык номерлерине 500 мүнөт',
      '5 ГБ интернет',
      'ЕАЭБда роуминг'
    ],
    popular: true
  },
  {
    id: 'megacom-unlim-m',
    operator: 'megacom',
    name: 'Unlim M',
    nameKy: 'Unlim M',
    monthlyFee: 400,
    minutes: 1000,
    sms: 100,
    internetGB: 15,
    socialMedia: true,
    messengers: true,
    extraMinuteCost: 1,
    extraSMSCost: 0.5,
    extraGBCost: 40,
    features: [
      'Безлимит соцсети и мессенджеры',
      '1000 минут на все номера КР',
      '15 ГБ интернета',
      'Роуминг в ЕврАзЭС',
      'Бесплатные входящие в роуминге'
    ],
    featuresKy: [
      'Соцтармактар жана мессенджерлер чексиз',
      'КРдын бардык номерлерине 1000 мүнөт',
      '15 ГБ интернет',
      'ЕАЭБда роуминг',
      'Роумингде кирүүчүлөр акысыз'
    ],
    recommended: true
  },
  {
    id: 'megacom-unlim-l',
    operator: 'megacom',
    name: 'Unlim L',
    nameKy: 'Unlim L',
    monthlyFee: 600,
    minutes: 'unlimited',
    sms: 'unlimited',
    internetGB: 30,
    socialMedia: true,
    messengers: true,
    extraMinuteCost: 0,
    extraSMSCost: 0,
    extraGBCost: 30,
    features: [
      'Безлимит звонки и СМС по КР',
      'Безлимит соцсети и мессенджеры',
      '30 ГБ интернета',
      'Роуминг в ЕврАзЭС',
      'Бесплатная раздача Wi-Fi'
    ],
    featuresKy: [
      'КР боюнча чалуулар жана SMS чексиз',
      'Соцтармактар жана мессенджерлер чексиз',
      '30 ГБ интернет',
      'ЕАЭБда роуминг',
      'Wi-Fi бөлүү акысыз'
    ]
  },
  {
    id: 'megacom-internet-only',
    operator: 'megacom',
    name: 'Только интернет',
    nameKy: 'Интернет гана',
    monthlyFee: 300,
    minutes: 0,
    sms: 0,
    internetGB: 50,
    socialMedia: true,
    messengers: true,
    extraMinuteCost: 2,
    extraSMSCost: 1,
    extraGBCost: 20,
    features: [
      '50 ГБ интернета',
      'Безлимит соцсети и мессенджеры',
      'Без абонплаты первые 3 месяца',
      'Раздача Wi-Fi включена'
    ],
    featuresKy: [
      '50 ГБ интернет',
      'Соцтармактар жана мессенджерлер чексиз',
      'Биринчи 3 айда абонплата жок',
      'Wi-Fi бөлүү кошулган'
    ]
  },

  // Beeline тарифы
  {
    id: 'beeline-start',
    operator: 'beeline',
    name: 'Старт',
    nameKy: 'Старт',
    monthlyFee: 200,
    minutes: 300,
    sms: 30,
    internetGB: 3,
    extraMinuteCost: 1.2,
    extraSMSCost: 0.6,
    extraGBCost: 60,
    features: [
      '300 минут внутри сети',
      '3 ГБ интернета',
      'Бесплатный Instagram',
      'Без контракта'
    ],
    featuresKy: [
      'Тармак ичинде 300 мүнөт',
      '3 ГБ интернет',
      'Instagram акысыз',
      'Келишимсиз'
    ]
  },
  {
    id: 'beeline-optimal',
    operator: 'beeline',
    name: 'Оптимальный',
    nameKy: 'Оптималдуу',
    monthlyFee: 350,
    minutes: 800,
    sms: 80,
    internetGB: 10,
    socialMedia: true,
    extraMinuteCost: 1,
    extraSMSCost: 0.5,
    extraGBCost: 45,
    features: [
      '800 минут на все номера',
      '10 ГБ интернета',
      'Безлимит соцсети',
      'Бесплатный Spotify',
      'Семейный пакет'
    ],
    featuresKy: [
      'Бардык номерлерге 800 мүнөт',
      '10 ГБ интернет',
      'Соцтармактар чексиз',
      'Spotify акысыз',
      'Үй-бүлөлүк пакет'
    ],
    popular: true
  },
  {
    id: 'beeline-premium',
    operator: 'beeline',
    name: 'Премиум',
    nameKy: 'Премиум',
    monthlyFee: 550,
    minutes: 'unlimited',
    sms: 'unlimited',
    internetGB: 25,
    socialMedia: true,
    messengers: true,
    extraMinuteCost: 0,
    extraSMSCost: 0,
    extraGBCost: 35,
    features: [
      'Безлимит звонки по КР',
      '25 ГБ интернета',
      'Все соцсети безлимит',
      'Приоритет в поддержке',
      'Бесплатный роуминг ЕврАзЭС'
    ],
    featuresKy: [
      'КР боюнча чалуулар чексиз',
      '25 ГБ интернет',
      'Бардык соцтармактар чексиз',
      'Колдоодо артыкчылык',
      'ЕАЭБда роуминг акысыз'
    ],
    recommended: true
  },
  {
    id: 'beeline-internet-max',
    operator: 'beeline',
    name: 'Интернет MAX',
    nameKy: 'Интернет MAX',
    monthlyFee: 400,
    minutes: 100,
    sms: 20,
    internetGB: 60,
    socialMedia: true,
    messengers: true,
    extraMinuteCost: 1.5,
    extraSMSCost: 0.8,
    extraGBCost: 25,
    features: [
      '60 ГБ интернета',
      'Безлимит YouTube, Netflix',
      '100 минут для звонков',
      'Раздача на 3 устройства'
    ],
    featuresKy: [
      '60 ГБ интернет',
      'YouTube, Netflix чексиз',
      'Чалуулар үчүн 100 мүнөт',
      '3 түзмөккө бөлүү'
    ]
  },

  // O! тарифы
  {
    id: 'o-mini',
    operator: 'o',
    name: 'O! Mini',
    nameKy: 'O! Mini',
    monthlyFee: 180,
    minutes: 200,
    sms: 25,
    internetGB: 2,
    extraMinuteCost: 1.3,
    extraSMSCost: 0.7,
    extraGBCost: 70,
    features: [
      '200 минут внутри сети',
      '2 ГБ интернета',
      'Бесплатный TikTok',
      'Без контракта'
    ],
    featuresKy: [
      'Тармак ичинде 200 мүнөт',
      '2 ГБ интернет',
      'TikTok акысыз',
      'Келишимсиз'
    ]
  },
  {
    id: 'o-smart',
    operator: 'o',
    name: 'O! Smart',
    nameKy: 'O! Smart',
    monthlyFee: 320,
    minutes: 700,
    sms: 70,
    internetGB: 12,
    socialMedia: true,
    extraMinuteCost: 1.1,
    extraSMSCost: 0.6,
    extraGBCost: 50,
    features: [
      '700 минут на все номера',
      '12 ГБ интернета',
      'Безлимит Instagram, Facebook',
      'Музыка без трафика',
      'Бонусные ГБ по выходным'
    ],
    featuresKy: [
      'Бардык номерлерге 700 мүнөт',
      '12 ГБ интернет',
      'Instagram, Facebook чексиз',
      'Музыка трафиксиз',
      'Ишемби-жекшембиде бонус ГБ'
    ],
    popular: true
  },
  {
    id: 'o-unlimited',
    operator: 'o',
    name: 'O! Unlimited',
    nameKy: 'O! Чексиз',
    monthlyFee: 500,
    minutes: 'unlimited',
    sms: 'unlimited',
    internetGB: 20,
    socialMedia: true,
    messengers: true,
    extraMinuteCost: 0,
    extraSMSCost: 0,
    extraGBCost: 40,
    features: [
      'Безлимит звонки и СМС',
      '20 ГБ интернета',
      'Все соцсети безлимит',
      'Роуминг без доплат',
      'Семейная скидка 20%'
    ],
    featuresKy: [
      'Чалуулар жана SMS чексиз',
      '20 ГБ интернет',
      'Бардык соцтармактар чексиз',
      'Роуминг кошумча акысыз',
      'Үй-бүлөгө 20% арзандатуу'
    ]
  },
  {
    id: 'o-gamer',
    operator: 'o',
    name: 'O! Gamer',
    nameKy: 'O! Gamer',
    monthlyFee: 450,
    minutes: 500,
    sms: 50,
    internetGB: 40,
    extraMinuteCost: 1,
    extraSMSCost: 0.5,
    extraGBCost: 30,
    features: [
      '40 ГБ интернета',
      'Низкий пинг для игр',
      'Безлимит Discord, Twitch',
      'Steam без трафика',
      'Приоритет в сети'
    ],
    featuresKy: [
      '40 ГБ интернет',
      'Оюндар үчүн төмөн пинг',
      'Discord, Twitch чексиз',
      'Steam трафиксиз',
      'Тармакта артыкчылык'
    ]
  }
];

export const operatorInfo = {
  megacom: {
    name: 'MegaCom',
    nameKy: 'MegaCom',
    color: '#00A651',
    description: 'Крупнейший оператор КР с лучшим покрытием',
    descriptionKy: 'КРдагы эң чоң оператор, эң жакшы жабуу',
    coverage: 98,
    website: 'https://www.megacom.kg',
    support: '+996 555 555-555'
  },
  beeline: {
    name: 'Beeline',
    nameKy: 'Beeline',
    color: '#FFCC00',
    description: '4G+ покрытие в крупных городах',
    descriptionKy: 'Чоң шаарларда 4G+ жабуу',
    coverage: 95,
    website: 'https://www.beeline.kg',
    support: '+996 770 770-770'
  },
  o: {
    name: 'O!',
    nameKy: 'O!',
    color: '#E31E24',
    description: 'Молодой оператор с выгодными тарифами',
    descriptionKy: 'Пайдалуу тарифтери бар жаш оператор',
    coverage: 92,
    website: 'https://www.o.kg',
    support: '+996 500 500-500'
  }
};

// Функция расчета стоимости по использованию
export const calculateTariffCost = (
  tariff: MobileTariff,
  usageMinutes: number,
  usageSMS: number,
  usageGB: number
): {
  baseCost: number;
  extraMinutesCost: number;
  extraSMSCost: number;
  extraGBCost: number;
  totalCost: number;
} => {
  let extraMinutesCost = 0;
  let extraSMSCost = 0;
  let extraGBCost = 0;

  // Расчет доп. минут
  if (tariff.minutes !== 'unlimited') {
    const extraMinutes = Math.max(0, usageMinutes - tariff.minutes);
    extraMinutesCost = extraMinutes * tariff.extraMinuteCost;
  }

  // Расчет доп. СМС
  if (tariff.sms !== 'unlimited') {
    const extraSMS = Math.max(0, usageSMS - tariff.sms);
    extraSMSCost = extraSMS * tariff.extraSMSCost;
  }

  // Расчет доп. ГБ
  if (tariff.internetGB !== 'unlimited') {
    const extraGB = Math.max(0, usageGB - tariff.internetGB);
    extraGBCost = extraGB * tariff.extraGBCost;
  }

  const totalCost = tariff.monthlyFee + extraMinutesCost + extraSMSCost + extraGBCost;

  return {
    baseCost: tariff.monthlyFee,
    extraMinutesCost,
    extraSMSCost,
    extraGBCost,
    totalCost
  };
};
