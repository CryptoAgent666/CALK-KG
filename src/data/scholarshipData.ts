// ============================================================================
// ДАННЫЕ ПО СТИПЕНДИЯМ В КЫРГЫЗСТАНЕ
// ============================================================================
// Сверено 03.11.2026 с постановлением Правительства КР от 27.06.2005 №261 «Об установлении
// размеров стипендий…», последняя редакция 02.08.2024 (cbd.minjust GetEdition 18725).
// Действует для государственных образовательных организаций.
//
// Единых ставок «именной», «правительственной» и «стипендии ректора», коэффициентов вузов,
// множителей среднего балла и надбавок за науку в законе НЕТ: прежние значения калькулятора были
// выдуманы и удалены. Адресные стипендии устанавливают Кабмин или те, кто их платит (п. 2).
//
// ⚠️ Указ Президента №348 от 12.10.2026: размеры повышаются с 01.09.2027, суммы не установлены.
// Обновить таблицу после постановления Кабмина.
// ============================================================================

export type EducationLevel = 'higher' | 'secondary' | 'primary' | 'aspirant' | 'ordinator';
export type Grades = 'excellent' | 'mixed' | 'good' | 'other';
export type PrimaryTerm = 'one_year' | 'two_three_years';

export const SCHOLARSHIP_RATES = {
  higher: 800,
  higherPedagogical: [1000, 2000, 3000, 4000], // 1–4 курс
  secondary: 720,
  secondaryPedagogical: 1440,
  primary: {
    // Срок обучения 1 год, без питания
    one_year: { excellent: 500, mixed: 400, good: 300 },
    // Срок обучения не менее 2–3 лет, с питанием
    two_three_years: { excellent: 300, mixed: 250, good: 200 }
  },
  social: 624,
  aspirant: 2175, // на 2-м курсе +30%, на 3-м ещё +30% к сумме 2-го
  aspirantYearlyRaise: 0.3,
  ordinator: 1200,
  ordinatorRural: 20000, // клинические ординаторы и интерны в отдалённых районах, по контракту
  disabilityRaise: 0.1,
  // Указ Президента №174 от 02.07.2024: размер определяет комиссия, 60 000 сом выплачено за 2025 год
  president: 60000
} as const;

export const MONTHS_IN_SEMESTER = 5;
export const MONTHS_IN_ACADEMIC_YEAR = 10;

export const aspirantRate = (course: number): number =>
  SCHOLARSHIP_RATES.aspirant * Math.pow(1 + SCHOLARSHIP_RATES.aspirantYearlyRaise, course - 1);

export interface ScholarshipInput {
  level: EducationLevel;
  pedagogical: boolean;
  course: number;
  grades: Grades;
  primaryTerm: PrimaryTerm;
  social: boolean;
  disability: boolean;
  ordinatorRural: boolean;
}

export interface ScholarshipResult {
  eligible: boolean;
  baseAmount: number;
  disabilityBonus: number;
  totalAmount: number;
}

const LEVELS_WITH_GRADES: EducationLevel[] = ['higher', 'secondary', 'primary'];

export const usesGrades = (level: EducationLevel): boolean => LEVELS_WITH_GRADES.includes(level);

const gradedRate = (input: ScholarshipInput): number => {
  const { level, pedagogical, course, grades, primaryTerm } = input;
  if (level === 'primary') {
    return grades === 'other' ? 0 : SCHOLARSHIP_RATES.primary[primaryTerm][grades];
  }
  // В вузах и колледжах стипендия за успеваемость установлена только при отличных оценках.
  if (grades !== 'excellent') return 0;
  if (level === 'secondary') {
    return pedagogical ? SCHOLARSHIP_RATES.secondaryPedagogical : SCHOLARSHIP_RATES.secondary;
  }
  return pedagogical ? SCHOLARSHIP_RATES.higherPedagogical[course - 1] : SCHOLARSHIP_RATES.higher;
};

export const calculateScholarship = (input: ScholarshipInput): ScholarshipResult => {
  const { level, course, social, disability, ordinatorRural } = input;

  if (level === 'aspirant' || level === 'ordinator') {
    const amount = level === 'aspirant'
      ? aspirantRate(course)
      : ordinatorRural ? SCHOLARSHIP_RATES.ordinatorRural : SCHOLARSHIP_RATES.ordinator;
    return { eligible: true, baseAmount: amount, disabilityBonus: 0, totalAmount: amount };
  }

  // Получателям социальной стипендии стипендия за успеваемость не выплачивается.
  if (social) {
    return { eligible: true, baseAmount: SCHOLARSHIP_RATES.social, disabilityBonus: 0, totalAmount: SCHOLARSHIP_RATES.social };
  }

  const baseAmount = gradedRate(input);
  const disabilityBonus = disability ? baseAmount * SCHOLARSHIP_RATES.disabilityRaise : 0;
  return { eligible: baseAmount > 0, baseAmount, disabilityBonus, totalAmount: baseAmount + disabilityBonus };
};

export interface ScholarshipExample {
  id: string;
  titleKey: string;
  input: Partial<ScholarshipInput>;
}

export const SCHOLARSHIP_EXAMPLES: ScholarshipExample[] = [
  {
    id: 'example-1',
    titleKey: 'scholarship_example_1_title',
    input: { level: 'higher', pedagogical: false, grades: 'excellent', social: false, disability: false }
  },
  {
    id: 'example-2',
    titleKey: 'scholarship_example_2_title',
    input: { level: 'higher', pedagogical: true, course: 3, grades: 'excellent', social: false, disability: false }
  },
  {
    id: 'example-3',
    titleKey: 'scholarship_example_3_title',
    input: { level: 'higher', pedagogical: false, social: true, disability: false }
  }
];
