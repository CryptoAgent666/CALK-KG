// ============================================================================
// ДАННЫЕ ПО РАСЧЁТУ БОЛЬНИЧНОГО ЛИСТА В КЫРГЫЗСТАНЕ
// ============================================================================
// АКТУАЛЬНО НА: Январь 2026
// ИСТОЧНИК: Социальный фонд КР, Трудовой кодекс КР
// 
// Больничный лист оплачивается из Социального фонда
// Размер выплаты зависит от стажа работы и среднего заработка
// ============================================================================

export interface SickLeaveType {
  id: string;
  nameKey: string;
  maxDays: number; // максимальное количество оплачиваемых дней
  paymentPercent: number; // процент от среднего заработка (если не зависит от стажа)
  dependsOnExperience: boolean; // зависит ли от стажа
}

export const SICK_LEAVE_TYPES: SickLeaveType[] = [
  {
    id: 'illness',
    nameKey: 'sick_type_illness',
    maxDays: 30, // может продлеваться врачебной комиссией
    paymentPercent: 0, // зависит от стажа
    dependsOnExperience: true
  },
  {
    id: 'injury',
    nameKey: 'sick_type_injury',
    maxDays: 60,
    paymentPercent: 0, // зависит от стажа
    dependsOnExperience: true
  },
  {
    id: 'child-care',
    nameKey: 'sick_type_child_care',
    maxDays: 14, // по уходу за ребёнком до 14 лет
    paymentPercent: 0, // зависит от стажа
    dependsOnExperience: true
  },
  {
    id: 'pregnancy',
    nameKey: 'sick_type_pregnancy',
    maxDays: 126, // 70 дней до + 56 дней после родов
    paymentPercent: 100, // 100% независимо от стажа
    dependsOnExperience: false
  },
  {
    id: 'complicated-pregnancy',
    nameKey: 'sick_type_complicated_pregnancy',
    maxDays: 140, // 70 дней до + 70 дней после родов (осложнённые роды)
    paymentPercent: 100,
    dependsOnExperience: false
  },
  {
    id: 'twins-pregnancy',
    nameKey: 'sick_type_twins_pregnancy',
    maxDays: 180, // 84 дня до + 96 дней после родов (двойня и более)
    paymentPercent: 100,
    dependsOnExperience: false
  }
];

// Процент оплаты больничного в зависимости от стажа работы
export interface ExperienceRate {
  minYears: number;
  maxYears: number | null; // null = бесконечность
  paymentPercent: number;
}

export const EXPERIENCE_RATES: ExperienceRate[] = [
  {
    minYears: 0,
    maxYears: 3,
    paymentPercent: 60
  },
  {
    minYears: 3,
    maxYears: 5,
    paymentPercent: 80
  },
  {
    minYears: 5,
    maxYears: 8,
    paymentPercent: 100
  },
  {
    minYears: 8,
    maxYears: null,
    paymentPercent: 100
  }
];

// Минимальная и максимальная сумма больничного (по законодательству КР)
export const MIN_MONTHLY_WAGE = 2500; // минимальный размер оплаты труда (МРОТ) КР с 01.01.2026
export const MAX_MONTHLY_WAGE = 50000; // максимальная база для расчёта больничного

// Расчётный период для больничного
export const CALCULATION_PERIOD_DAYS = 730; // 2 года = 730 дней (365 * 2)

// Функция для определения процента выплаты по стажу
export const getPaymentPercentByExperience = (experienceYears: number): number => {
  for (const rate of EXPERIENCE_RATES) {
    if (experienceYears >= rate.minYears && (rate.maxYears === null || experienceYears < rate.maxYears)) {
      return rate.paymentPercent;
    }
  }
  return 60; // минимум, если стаж не указан
};

// Функция для расчёта среднедневного заработка
export const calculateAverageDailyWage = (totalEarnings: number, periodDays: number = CALCULATION_PERIOD_DAYS): number => {
  return totalEarnings / periodDays;
};

// Функция для расчёта выплаты по больничному
export const calculateSickLeavePay = (
  averageDailyWage: number,
  daysOnSickLeave: number,
  paymentPercent: number
): number => {
  return averageDailyWage * daysOnSickLeave * (paymentPercent / 100);
};

// Проверка на минимум/максимум
export const validateWage = (wage: number): number => {
  const minDailyWage = MIN_MONTHLY_WAGE / 30;
  const maxDailyWage = MAX_MONTHLY_WAGE / 30;
  const dailyWage = wage / 30;
  
  if (dailyWage < minDailyWage) {
    return MIN_MONTHLY_WAGE;
  }
  if (dailyWage > maxDailyWage) {
    return MAX_MONTHLY_WAGE;
  }
  return wage;
};

// Типичные ситуации для примеров
export interface SickLeaveExample {
  id: string;
  titleKey: string;
  sickLeaveType: string;
  experienceYears: number;
  totalEarnings: number;
  daysOnSickLeave: number;
}

export const SICK_LEAVE_EXAMPLES: SickLeaveExample[] = [
  {
    id: 'example-1',
    titleKey: 'sick_example_1_title',
    sickLeaveType: 'illness',
    experienceYears: 4,
    totalEarnings: 480000, // 20,000 сом/мес * 24 мес
    daysOnSickLeave: 10
  },
  {
    id: 'example-2',
    titleKey: 'sick_example_2_title',
    sickLeaveType: 'pregnancy',
    experienceYears: 2,
    totalEarnings: 600000, // 25,000 сом/мес * 24 мес
    daysOnSickLeave: 126
  },
  {
    id: 'example-3',
    titleKey: 'sick_example_3_title',
    sickLeaveType: 'child-care',
    experienceYears: 7,
    totalEarnings: 720000, // 30,000 сом/мес * 24 мес
    daysOnSickLeave: 7
  }
];

// Полезная информация для FAQ
export const SICK_LEAVE_INFO = {
  whoCanGet: 'Все работники, за которых работодатель платит взносы в Социальный фонд КР',
  howToGet: 'Обратиться к врачу в течение 3 дней с момента начала болезни, получить больничный лист',
  whenPaid: 'В течение 10 дней с момента предоставления больничного листа работодателю',
  firstDays: 'Первые 3 дня больничного оплачивает работодатель, с 4-го дня — Социальный фонд',
  documents: 'Больничный лист, трудовая книжка или справка о стаже, справка о заработке за 2 года',
  taxable: 'Да, больничные облагаются подоходным налогом 10%',
  minAmount: 'Не может быть меньше МРОТ (2,500 сом/мес)',
  maxAmount: 'Не может быть больше 50,000 сом/мес в среднем'
};
