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

// По Пост. Кабмина КР №434: до 5 лет — 60%, 5–8 лет — 80%, свыше 8 лет — 100%.
export const EXPERIENCE_RATES: ExperienceRate[] = [
  {
    minYears: 0,
    maxYears: 5,
    paymentPercent: 60
  },
  {
    minYears: 5,
    maxYears: 8,
    paymentPercent: 80
  },
  {
    minYears: 8,
    maxYears: null,
    paymentPercent: 100
  }
];

// Параметры расчёта по Положению к Пост. Правительства КР №434
// (в ред. Пост. Кабмина №151 от 22.03.2023, в силе с 13.04.2023).
export const MIN_MONTHLY_WAGE = 3280; // МРОТ КР с 01.01.2026 (справочно)
export const WORKING_DAYS_PER_MONTH = 22; // среднее число рабочих дней в месяце
// База = заработок за 3 предшествующих месяца ÷ рабочие дни за этот период (≈ 66).
export const CALCULATION_PERIOD_WORKING_DAYS = WORKING_DAYS_PER_MONTH * 3;
// Первые 10 рабочих дней оплачивает работодатель (без лимита); с 11-го — Соцфонд.
export const EMPLOYER_PAID_DAYS = 10;
// Лимит выплаты Соцфонда с 11-го дня: 100 расчётных показателей = 10 000 сом/мес.
export const FUND_MONTHLY_CAP = 10000;

// Функция для определения процента выплаты по стажу
export const getPaymentPercentByExperience = (experienceYears: number): number => {
  for (const rate of EXPERIENCE_RATES) {
    if (experienceYears >= rate.minYears && (rate.maxYears === null || experienceYears < rate.maxYears)) {
      return rate.paymentPercent;
    }
  }
  return 60; // минимум, если стаж не указан
};

// Среднедневной заработок = заработок за 3 месяца ÷ рабочие дни за этот период.
export const calculateAverageDailyWage = (
  earnings3Months: number,
  periodWorkingDays: number = CALCULATION_PERIOD_WORKING_DAYS
): number => {
  return earnings3Months / periodWorkingDays;
};

// Разбивка выплаты по обычному больничному: первые 10 рабочих дней (работодатель,
// без лимита) + с 11-го дня (Соцфонд, дневная выплата ≤ 10 000 / рабочие дни в месяце).
export const calculateSickLeaveBreakdown = (
  averageDailyWage: number,
  daysOnSickLeave: number,
  paymentPercent: number
): { employerPay: number; fundPay: number; total: number } => {
  const dailyPay = averageDailyWage * (paymentPercent / 100);
  const employerDays = Math.min(daysOnSickLeave, EMPLOYER_PAID_DAYS);
  const fundDays = Math.max(0, daysOnSickLeave - EMPLOYER_PAID_DAYS);
  const fundDailyCap = FUND_MONTHLY_CAP / WORKING_DAYS_PER_MONTH; // ≈ 454,5 сом/день
  const employerPay = dailyPay * employerDays;
  const fundPay = Math.min(dailyPay, fundDailyCap) * fundDays;
  return { employerPay, fundPay, total: employerPay + fundPay };
};

// Совместимость: полная выплата без разбивки.
export const calculateSickLeavePay = (
  averageDailyWage: number,
  daysOnSickLeave: number,
  paymentPercent: number
): number => {
  return calculateSickLeaveBreakdown(averageDailyWage, daysOnSickLeave, paymentPercent).total;
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
    totalEarnings: 60000, // 20,000 сом/мес * 3 мес
    daysOnSickLeave: 10
  },
  {
    id: 'example-2',
    titleKey: 'sick_example_2_title',
    sickLeaveType: 'pregnancy',
    experienceYears: 2,
    totalEarnings: 75000, // 25,000 сом/мес * 3 мес
    daysOnSickLeave: 126
  },
  {
    id: 'example-3',
    titleKey: 'sick_example_3_title',
    sickLeaveType: 'child-care',
    experienceYears: 7,
    totalEarnings: 90000, // 30,000 сом/мес * 3 мес
    daysOnSickLeave: 7
  }
];

// Полезная информация для FAQ
export const SICK_LEAVE_INFO = {
  whoCanGet: 'Все работники, за которых работодатель платит взносы в Социальный фонд КР',
  howToGet: 'Обратиться к врачу в течение 3 дней с момента начала болезни, получить больничный лист',
  whenPaid: 'В течение 10 дней с момента предоставления больничного листа работодателю',
  firstDays: 'Первые 10 рабочих дней больничного оплачивает работодатель, с 11-го дня — Социальный фонд (не более 10 000 сом/мес)',
  documents: 'Больничный лист, трудовая книжка или справка о стаже, справка о заработке за 2 года',
  taxable: 'Да, больничные облагаются подоходным налогом 10%',
  minAmount: 'Не может быть меньше МРОТ (3,280 сом/мес)',
  maxAmount: 'Не может быть больше 50,000 сом/мес в среднем'
};
