// ============================================================================
// ДАННЫЕ ПО СТИПЕНДИЯМ В КЫРГЫЗСТАНЕ
// ============================================================================
// АКТУАЛЬНО НА: Январь 2026
// ИСТОЧНИКИ: Министерство образования КР, ВУЗы КР
// 
// Все суммы указаны в сомах в месяц
// Размеры стипендий устанавливаются государством и ВУЗами
// ============================================================================

export interface ScholarshipType {
  id: string;
  nameKey: string;
  baseAmount: number; // базовая сумма в сомах
  description: string;
  requiresGPA?: boolean; // зависит ли от среднего балла
  requiresSocialStatus?: boolean; // зависит ли от соц. статуса
}

export const SCHOLARSHIP_TYPES: ScholarshipType[] = [
  {
    id: 'academic',
    nameKey: 'scholarship_academic',
    baseAmount: 3000,
    description: 'Государственная академическая стипендия',
    requiresGPA: true
  },
  {
    id: 'social',
    nameKey: 'scholarship_social',
    baseAmount: 2500,
    description: 'Государственная социальная стипендия',
    requiresSocialStatus: true
  },
  {
    id: 'named',
    nameKey: 'scholarship_named',
    baseAmount: 5000,
    description: 'Именная стипендия',
    requiresGPA: true
  },
  {
    id: 'president',
    nameKey: 'scholarship_president',
    baseAmount: 8000,
    description: 'Президентская стипендия',
    requiresGPA: true
  },
  {
    id: 'government',
    nameKey: 'scholarship_government',
    baseAmount: 6000,
    description: 'Правительственная стипендия',
    requiresGPA: true
  },
  {
    id: 'rector',
    nameKey: 'scholarship_rector',
    baseAmount: 4500,
    description: 'Стипендия ректора',
    requiresGPA: true
  }
];

// Коэффициенты для расчёта по среднему баллу (GPA)
export interface GPAMultiplier {
  minGPA: number;
  maxGPA: number;
  multiplier: number;
  description: string;
}

export const GPA_MULTIPLIERS: GPAMultiplier[] = [
  {
    minGPA: 0,
    maxGPA: 3.0,
    multiplier: 0,
    description: 'Стипендия не назначается'
  },
  {
    minGPA: 3.0,
    maxGPA: 3.5,
    multiplier: 0.8,
    description: 'Удовлетворительно'
  },
  {
    minGPA: 3.5,
    maxGPA: 4.0,
    multiplier: 1.0,
    description: 'Хорошо'
  },
  {
    minGPA: 4.0,
    maxGPA: 4.5,
    multiplier: 1.3,
    description: 'Отлично'
  },
  {
    minGPA: 4.5,
    maxGPA: 5.0,
    multiplier: 1.5,
    description: 'Отличник'
  }
];

// Доплаты за научную деятельность
export interface ScientificBonus {
  id: string;
  nameKey: string;
  amount: number;
}

export const SCIENTIFIC_BONUSES: ScientificBonus[] = [
  {
    id: 'publication',
    nameKey: 'bonus_publication',
    amount: 2000
  },
  {
    id: 'conference',
    nameKey: 'bonus_conference',
    amount: 1500
  },
  {
    id: 'olympiad',
    nameKey: 'bonus_olympiad',
    amount: 3000
  },
  {
    id: 'research',
    nameKey: 'bonus_research',
    amount: 2500
  }
];

// Типы ВУЗов (коэффициенты могут отличаться)
export interface University {
  id: string;
  nameKey: string;
  coefficient: number; // коэффициент к базовой стипендии
}

export const UNIVERSITIES: University[] = [
  {
    id: 'knu',
    nameKey: 'university_knu',
    coefficient: 1.2
  },
  {
    id: 'ksucta',
    nameKey: 'university_ksucta',
    coefficient: 1.15
  },
  {
    id: 'krsu',
    nameKey: 'university_krsu',
    coefficient: 1.1
  },
  {
    id: 'osh',
    nameKey: 'university_osh',
    coefficient: 1.0
  },
  {
    id: 'other',
    nameKey: 'university_other',
    coefficient: 1.0
  }
];

// Функция для получения множителя по среднему баллу
export const getGPAMultiplier = (gpa: number): number => {
  for (const range of GPA_MULTIPLIERS) {
    if (gpa >= range.minGPA && gpa < range.maxGPA) {
      return range.multiplier;
    }
  }
  return 0;
};

// Функция для расчёта стипендии
export const calculateScholarship = (
  scholarshipTypeId: string,
  gpa: number,
  universityId: string,
  scientificBonuses: string[]
): {
  baseAmount: number;
  gpaMultiplier: number;
  universityCoefficient: number;
  scholarshipAmount: number;
  bonusesAmount: number;
  totalAmount: number;
} => {
  const scholarshipType = SCHOLARSHIP_TYPES.find(s => s.id === scholarshipTypeId);
  const university = UNIVERSITIES.find(u => u.id === universityId);
  
  if (!scholarshipType || !university) {
    return {
      baseAmount: 0,
      gpaMultiplier: 0,
      universityCoefficient: 0,
      scholarshipAmount: 0,
      bonusesAmount: 0,
      totalAmount: 0
    };
  }
  
  const gpaMultiplier = scholarshipType.requiresGPA ? getGPAMultiplier(gpa) : 1.0;
  
  if (gpaMultiplier === 0) {
    return {
      baseAmount: scholarshipType.baseAmount,
      gpaMultiplier: 0,
      universityCoefficient: university.coefficient,
      scholarshipAmount: 0,
      bonusesAmount: 0,
      totalAmount: 0
    };
  }
  
  const scholarshipAmount = scholarshipType.baseAmount * gpaMultiplier * university.coefficient;
  
  const bonusesAmount = scientificBonuses.reduce((sum, bonusId) => {
    const bonus = SCIENTIFIC_BONUSES.find(b => b.id === bonusId);
    return sum + (bonus?.amount || 0);
  }, 0);
  
  const totalAmount = scholarshipAmount + bonusesAmount;
  
  return {
    baseAmount: scholarshipType.baseAmount,
    gpaMultiplier,
    universityCoefficient: university.coefficient,
    scholarshipAmount,
    bonusesAmount,
    totalAmount
  };
};

// Примеры расчётов
export interface ScholarshipExample {
  id: string;
  titleKey: string;
  scholarshipType: string;
  gpa: number;
  university: string;
  bonuses: string[];
}

export const SCHOLARSHIP_EXAMPLES: ScholarshipExample[] = [
  {
    id: 'example-1',
    titleKey: 'scholarship_example_1_title',
    scholarshipType: 'academic',
    gpa: 4.2,
    university: 'knu',
    bonuses: []
  },
  {
    id: 'example-2',
    titleKey: 'scholarship_example_2_title',
    scholarshipType: 'president',
    gpa: 4.8,
    university: 'ksucta',
    bonuses: ['publication', 'conference']
  },
  {
    id: 'example-3',
    titleKey: 'scholarship_example_3_title',
    scholarshipType: 'social',
    gpa: 3.0,
    university: 'other',
    bonuses: []
  }
];

// Условия получения стипендии
export const SCHOLARSHIP_CONDITIONS = {
  minGPA: 3.0, // минимальный средний балл для академической стипендии
  sessionSuccess: 'Сдать сессию без троек и долгов',
  socialStatus: 'Сироты, инвалиды, малообеспеченные семьи',
  namedConditions: 'Средний балл от 4.5, научная деятельность',
  presidentConditions: 'Средний балл от 4.8, победы в олимпиадах, публикации'
};
