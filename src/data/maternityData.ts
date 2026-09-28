// ============================================================================
// ДЕКРЕТНЫЕ (пособие по беременности и родам) И ВЫПЛАТЫ ПРИ РОЖДЕНИИ — КР, 2026
// ============================================================================
// Сверено 2026-09-28 вербатим по Положению (Прил.1 к ПП КР №434 от 18.09.2018,
// ред. ПКМ №273 от 23.04.2026; п.61 и п.63 — в ред. ПКМ №151 от 22.03.2023),
// cbd.minjust API editionId=52189, и по Минтруду (mlsp.gov.kg):
//  • п.63 подп.1 — работнице: первые 10 рабочих дней = средний дневной заработок × 10
//    за счёт работодателя; с 11-го рабочего дня — 20 РП в месяц из республиканского бюджета;
//  • п.63 подп.2 — ИП, члену КФХ, официальному безработному: с 11-го рабочего дня 20 РП/мес;
//  • п.63 подп.3 — высокогорье и отдалённые зоны: работнице 100% среднего заработка
//    (с районным коэффициентом) за ВСЕ рабочие дни; ИП/КФХ/безработной — 20 РП × коэффициент;
//  • п.51 — не работающей и не состоящей на учёте как безработная пособие не назначается;
//  • п.61 — длительность отпуска (ТК КР №23 от 23.01.2025, ст.148);
//  • «Балага сүйүнчү» — 4 000 сом на каждого ребёнка без учёта дохода, при рождении
//    троих и более — 50 000 сом на каждого; заявление — в течение 6 месяцев
//    (mlsp.gov.kg 26.02.2026 и 20.02.2025).
// Пособия не облагаются подоходным налогом (НК КР ст.191 ч.3 п.1, ч.4 п.1).
// ============================================================================

import { calculateAverageDailyWage, RASCHETNY_POKAZATEL, WORKING_DAYS_PER_MONTH } from './sickLeaveData';

export type MotherStatus = 'employee' | 'entrepreneur' | 'unemployed' | 'not_working';

export const EMPLOYER_DAYS = 10;
export const BUDGET_RATE_RP = 20;
export const BUDGET_RATE_MONTHLY = BUDGET_RATE_RP * RASCHETNY_POKAZATEL; // 2 000 сом/мес

export const BIRTH_PAYMENT_PER_CHILD = 4000; // «Балага сүйүнчү»
export const BIRTH_PAYMENT_TRIPLETS_PER_CHILD = 50000; // при рождении троих и более

// Длительность отпуска, календарные дни (п.61).
export const LEAVE_DAYS = {
  normal: { normal: 126, complicated: 140, multiple: 140 },
  highMountain: { normal: 140, complicated: 156, multiple: 180 }
} as const;

export type BirthCase = 'normal' | 'complicated' | 'multiple';

// Рабочих дней в отпуске — приближённо, 5 из 7 (праздники по производственному
// календарю уменьшат число на 1–3 дня).
export const workingDaysInLeave = (calendarDays: number) => Math.round((calendarDays * 5) / 7);

export interface MaternityInput {
  status: MotherStatus;
  earnings3Months: number;
  children: number; // сколько детей родилось
  complicated: boolean;
  highMountain: boolean;
  districtCoefficient: number; // для ИП/КФХ/безработной в высокогорье
}

export interface MaternityResult {
  eligible: boolean;
  calendarDays: number;
  workingDays: number;
  averageDailyWage: number;
  employerPart: number;
  budgetPart: number;
  benefitTotal: number;
  budgetDailyRate: number;
  fullPayHighMountain: boolean;
  birthPayment: number;
  birthPaymentPerChild: number;
  grandTotal: number;
}

export const calculateMaternity = (input: MaternityInput): MaternityResult => {
  const birthCase: BirthCase = input.children >= 2 ? 'multiple' : input.complicated ? 'complicated' : 'normal';
  const calendarDays = LEAVE_DAYS[input.highMountain ? 'highMountain' : 'normal'][birthCase];
  const workingDays = workingDaysInLeave(calendarDays);
  const daysFrom11 = Math.max(0, workingDays - EMPLOYER_DAYS);

  const birthPaymentPerChild = input.children >= 3 ? BIRTH_PAYMENT_TRIPLETS_PER_CHILD : BIRTH_PAYMENT_PER_CHILD;
  const birthPayment = birthPaymentPerChild * Math.max(1, input.children);

  let averageDailyWage = 0;
  let employerPart = 0;
  let budgetPart = 0;
  let budgetDailyRate = 0;
  let fullPayHighMountain = false;
  let eligible = true;

  if (input.status === 'employee') {
    averageDailyWage = calculateAverageDailyWage(Math.max(0, input.earnings3Months));
    employerPart = averageDailyWage * Math.min(EMPLOYER_DAYS, workingDays);
    if (input.highMountain) {
      fullPayHighMountain = true;
      budgetDailyRate = averageDailyWage;
    } else {
      budgetDailyRate = BUDGET_RATE_MONTHLY / WORKING_DAYS_PER_MONTH;
    }
    budgetPart = budgetDailyRate * daysFrom11;
  } else if (input.status === 'entrepreneur' || input.status === 'unemployed') {
    const coefficient = input.highMountain ? Math.max(1, input.districtCoefficient || 1) : 1;
    budgetDailyRate = (BUDGET_RATE_MONTHLY * coefficient) / WORKING_DAYS_PER_MONTH;
    budgetPart = budgetDailyRate * daysFrom11;
  } else {
    eligible = false;
  }

  const benefitTotal = employerPart + budgetPart;
  return {
    eligible,
    calendarDays,
    workingDays,
    averageDailyWage,
    employerPart,
    budgetPart,
    benefitTotal,
    budgetDailyRate,
    fullPayHighMountain,
    birthPayment,
    birthPaymentPerChild,
    grandTotal: benefitTotal + birthPayment
  };
};
