// ============================================================================
// ЗАРПЛАТА УЧИТЕЛЯ ГОСУДАРСТВЕННОЙ / МУНИЦИПАЛЬНОЙ ШКОЛЫ КР (с 01.04.2026)
// ============================================================================
// Сверено вербатим 2026-09-28 через cbd.minjust API:
//  • ПКМ №286 от 25.04.2026 «Об условиях оплаты труда работников организаций системы
//    образования» (editionId=51930): минимальная базовая ставка 7 040 сом; президентская
//    компенсация 15 000 сом; прил.1 — коэффициенты 2,15 / 3,10 / 3,45 / 3,85 и примечание 6 —
//    доплата учителям 1–4 классов 2 000 / 3 000 / 4 000 / 5 000 сом за ставку;
//  • Положение об оплате труда (прил.25 к ПКМ №286, editionId=52231): п.11 — надбавка за
//    педстаж 3–8 лет 10%, 8–13 лет 20%, 13+ лет 30% (от одной ставки); п.18 — компенсация
//    пропорционально нагрузке, если она меньше ставки; п.21 — село 1 800 сом независимо от
//    нагрузки; п.24 — категория высшая / первая / вторая 5 000 / 3 000 / 2 000 сом;
//    п.27 — классное руководство 2 100 сом (один класс); п.28 — проверка тетрадей 2 700 сом
//    за 16 (1–4 кл.) / 18 (5–11 кл.) часов. Примеры 1 и 2 Положения = 64 868,40 и 56 919,80 сом.
//  • Высокогорье: районный коэффициент и надбавка за стаж в высокогорье (ПКМ №398/№399
//    от 05.06.2026) — вводятся пользователем; компенсация на коэффициент не умножается.
//  • Удержания: Соцфонд 10% — без президентской компенсации (разъяснение Минпросвещения,
//    24.kg 27.04.2026); подоходный 10% с вычетом 650 сом (НК ст.194); высокогорные надбавки и
//    прибавка от районного коэффициента подоходным не облагаются (НК ст.191 ч.4 п.1).
// ============================================================================

export const BASE_RATE = 7040;
export const PRESIDENTIAL_COMPENSATION = 15000;
export const CLASS_TEACHER_BONUS = 2100;
export const NOTEBOOK_BONUS = 2700;
export const RURAL_BONUS = 1800;
export const PERSONAL_DEDUCTION = 650;
export const SOCIAL_FUND_RATE = 0.1;
export const INCOME_TAX_RATE = 0.1;

export type Education = 'general' | 'vocational' | 'bachelor' | 'master';
export type Category = 'none' | 'second' | 'first' | 'highest';

export const EDUCATION_COEFFICIENT: Record<Education, number> = {
  general: 2.15,
  vocational: 3.1,
  bachelor: 3.45,
  master: 3.85
};
export const PRIMARY_GRADES_BONUS: Record<Education, number> = {
  general: 2000,
  vocational: 3000,
  bachelor: 4000,
  master: 5000
};
export const CATEGORY_BONUS: Record<Category, number> = { none: 0, second: 2000, first: 3000, highest: 5000 };

export const experiencePercent = (years: number) => (years >= 13 ? 30 : years >= 8 ? 20 : years >= 3 ? 10 : 0);

export interface TeacherInput {
  education: Education;
  primaryGrades: boolean; // 1–4 классы: норма 16 ч, иначе 18 ч
  hours: number;
  experienceYears: number;
  category: Category;
  classTeacher: boolean;
  notebooks: boolean;
  rural: boolean;
  districtCoefficient: number; // 1 — не высокогорье
  highMountainPercent: number; // надбавка за стаж в высокогорье, 0–30
  otherBonuses: number;
}

export interface TeacherResult {
  rate: number;
  norm: number;
  hoursPay: number;
  experiencePay: number;
  experiencePct: number;
  primaryGradesPay: number;
  classTeacherPay: number;
  notebooksPay: number;
  ruralPay: number;
  categoryPay: number;
  highMountainPay: number;
  otherPay: number;
  subtotal: number; // до районного коэффициента
  coefficientIncrease: number;
  compensation: number;
  gross: number;
  socialFund: number;
  incomeTax: number;
  net: number;
}

export const calculateTeacherSalary = (input: TeacherInput): TeacherResult => {
  const rate = BASE_RATE * EDUCATION_COEFFICIENT[input.education];
  const norm = input.primaryGrades ? 16 : 18;
  const hours = Math.max(0, input.hours);
  const oneRateShare = Math.min(hours, norm) / norm; // «не больше одной ставки»

  const hoursPay = (rate * hours) / norm;
  const experiencePct = experiencePercent(input.experienceYears);
  const experiencePay = rate * oneRateShare * (experiencePct / 100);
  const primaryGradesPay = input.primaryGrades ? PRIMARY_GRADES_BONUS[input.education] * oneRateShare : 0;
  const classTeacherPay = input.classTeacher ? CLASS_TEACHER_BONUS : 0;
  const notebooksPay = input.notebooks ? (NOTEBOOK_BONUS * hours) / norm : 0;
  const ruralPay = input.rural ? RURAL_BONUS : 0;
  const categoryPay = CATEGORY_BONUS[input.category];
  const highMountainPay = rate * oneRateShare * (Math.max(0, input.highMountainPercent) / 100);
  const otherPay = Math.max(0, input.otherBonuses);

  const subtotal = hoursPay + experiencePay + primaryGradesPay + classTeacherPay + notebooksPay + ruralPay + categoryPay + highMountainPay + otherPay;
  const coefficient = Math.max(1, input.districtCoefficient || 1);
  const coefficientIncrease = subtotal * (coefficient - 1);
  const compensation = PRESIDENTIAL_COMPENSATION * oneRateShare;
  const gross = subtotal + coefficientIncrease + compensation;

  const socialFund = (gross - compensation) * SOCIAL_FUND_RATE;
  // Не облагаются подоходным: надбавка за высокогорье и прибавка от районного коэффициента.
  // Взнос в Соцфонд с этой части из налоговой базы не вычитается (НК ст.194).
  const exempt = highMountainPay * coefficient + coefficientIncrease - highMountainPay * (coefficient - 1);
  const deductibleSocialFund = socialFund - exempt * SOCIAL_FUND_RATE;
  const taxable = Math.max(0, gross - exempt - deductibleSocialFund - PERSONAL_DEDUCTION);
  const incomeTax = taxable * INCOME_TAX_RATE;

  return {
    rate,
    norm,
    hoursPay,
    experiencePay,
    experiencePct,
    primaryGradesPay,
    classTeacherPay,
    notebooksPay,
    ruralPay,
    categoryPay,
    highMountainPay,
    otherPay,
    subtotal,
    coefficientIncrease,
    compensation,
    gross,
    socialFund,
    incomeTax,
    net: gross - socialFund - incomeTax
  };
};
