// ============================================================================
// ДАННЫЕ ПО РАСЧЁТУ БОЛЬНИЧНОГО ЛИСТА В КЫРГЫЗСТАНЕ
// ============================================================================
// АКТУАЛЬНО НА: июль 2026 (сверено вербатим 2026-07-27)
// ИСТОЧНИКИ (официальный API cbd.minjust.gov.kg):
//   • Положение — Прил.1 к Пост. Правительства КР №434 от 18.09.2018
//     (в ред. Пост. Кабмина №151 от 22.03.2023) — editionId=52189
//   • Трудовой кодекс КР №23 от 23.01.2025, ст.148 — editionId=55401
//   • Налоговый кодекс КР, ст.191 ч.3 п.1 и ч.4 п.1 (освобождение от подоходного)
//
// ⚠️ ВАЖНО: больничный оплачивает РАБОТОДАТЕЛЬ за счёт собственных средств за все
// рабочие дни (п.45). Социальный фонд в выплате НЕ участвует — в Положении он не
// упоминается ни разу. Пособие НЕ облагается подоходным налогом.
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
    maxDays: 180, // статутного лимита НЕТ (п.28 — «за все рабочие дни»); 180 здесь — практический
    // предел формы, а не норма права. Инструкция №152 п.38: направление на МСЭК после 120 дней
    // подряд (или 150 дней суммарно за 12 мес).
    paymentPercent: 0, // зависит от стажа
    dependsOnExperience: true
  },
  {
    id: 'injury',
    nameKey: 'sick_type_injury',
    maxDays: 180, // статутного лимита НЕТ; см. комментарий выше (МСЭК после 120 дней).
    paymentPercent: 0, // зависит от стажа
    dependsOnExperience: true
  },
  {
    id: 'child-care',
    nameKey: 'sick_type_child_care',
    maxDays: 14, // Инструкция №152 п.62: ребёнок СТАРШЕ 7 лет амбулаторно — до 14 календарных дней;
    // для ребёнка до 7 лет — весь период острого заболевания (лимита 14 дней нет).
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
    maxDays: 140, // ТК ст.148 ч.1: 70 до + 70 после (осложнённые роды ИЛИ двое и более детей).
    // 180 дней — только для высокогорных и отдалённых зон (ТК ст.148 ч.2 п.3).
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

// Параметры расчёта по Положению (Прил.1 к Пост. Правительства КР №434 от 18.09.2018,
// в ред. Пост. Кабмина №151 от 22.03.2023). Текст сверен вербатим 2026-07-27 через
// официальный API cbd.minjust.gov.kg (GetEdition?editionId=52189).
export const MIN_MONTHLY_WAGE = 3280; // МЗП КР с 01.01.2026 (справочно, к пособию не применяется)
export const RASCHETNY_POKAZATEL = 100; // 1 расчётный показатель = 100 сом
// ⚠️ Аппроксимация: п.6 Положения отсылает к производственному календарю, ежегодно
// утверждаемому Минтруда; фиксированного числа «22» в нормативе нет.
export const WORKING_DAYS_PER_MONTH = 22;
// База = заработок за 3 предшествующих месяца ÷ рабочие дни за этот период (≈ 66).
export const CALCULATION_PERIOD_WORKING_DAYS = WORKING_DAYS_PER_MONTH * 3;
// п.45: пособие выплачивается «за все рабочие дни за счёт собственных средств
// работодателя» — Социальный фонд в выплате не участвует (в Положении не упоминается).
export const EMPLOYER_PAID_DAYS = 10;
// п.37 подп.2: с одиннадцатого рабочего дня — «из расчёта 100 расчётных показателей
// в месяц». Это ФИКСИРОВАННАЯ ставка (10 000 сом/мес), а не потолок выплаты.
export const RATE_FROM_DAY11_RP = 100;
export const RATE_FROM_DAY11_MONTHLY = RATE_FROM_DAY11_RP * RASCHETNY_POKAZATEL; // 10 000 сом/мес
// п.63 подп.1: по беременности и родам с 11-го рабочего дня — «из расчёта 20 расчётных
// показателей в месяц» из средств республиканского бюджета (2 000 сом/мес).
export const MATERNITY_RATE_FROM_DAY11_RP = 20;
export const MATERNITY_RATE_FROM_DAY11_MONTHLY = MATERNITY_RATE_FROM_DAY11_RP * RASCHETNY_POKAZATEL;

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

// Разбивка выплаты по ПЕРИОДАМ (плательщик один — работодатель, п.45):
//  • первые 10 рабочих дней — средний дневной заработок × процент по стажу (п.37 подп.2);
//  • с 11-го рабочего дня — фиксированно 100 РП/мес ÷ рабочие дни (≈ 454,55 сом/день).
// Ставка с 11-го дня не зависит от заработка: норма задаёт её «из расчёта», а не «не более».
export const calculateSickLeaveBreakdown = (
  averageDailyWage: number,
  daysOnSickLeave: number,
  paymentPercent: number,
  ratePerMonthFromDay11: number = RATE_FROM_DAY11_MONTHLY
): { first10Pay: number; fromDay11Pay: number; total: number } => {
  const dailyPay = averageDailyWage * (paymentPercent / 100);
  const first10Days = Math.min(daysOnSickLeave, EMPLOYER_PAID_DAYS);
  const daysFrom11 = Math.max(0, daysOnSickLeave - EMPLOYER_PAID_DAYS);
  const dailyFromDay11 = ratePerMonthFromDay11 / WORKING_DAYS_PER_MONTH;
  const first10Pay = dailyPay * first10Days;
  const fromDay11Pay = dailyFromDay11 * daysFrom11;
  return { first10Pay, fromDay11Pay, total: first10Pay + fromDay11Pay };
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
// Справочная информация. Сверена вербатим 2026-07-27 по Положению (Прил.1 к ПП КР №434)
// и НК КР ст.191 через официальный API cbd.minjust.gov.kg.
export const SICK_LEAVE_INFO = {
  whoCanGet: 'Работники по месту основной работы (п.45 Положения)',
  howToGet: 'Обратиться к врачу и получить листок нетрудоспособности; за пособием — в течение 6 месяцев со дня восстановления трудоспособности (п.4)',
  whenPaid: 'Одновременно с заработной платой (п.47)',
  firstDays: 'Весь больничный оплачивает работодатель за счёт собственных средств (п.45): первые 10 рабочих дней — по стажу (60/80/100%), с 11-го рабочего дня — из расчёта 100 расчётных показателей в месяц (10 000 сом)',
  documents: 'Листок нетрудоспособности; при стаже менее 8 лет — документ, подтверждающий трудовой стаж (п.23)',
  taxable: 'Нет, пособие по временной нетрудоспособности не облагается подоходным налогом (НК КР ст. 191 ч. 3 п. 1 и ч. 4 п. 1)'
};
