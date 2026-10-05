// ============================================================================
// Ставки ввозной пошлины ЕТТ ЕАЭС для гибридов (8703 40 / 8703 60) и грузовых (8704)
// ============================================================================
// Первоисточник: Единый таможенный тариф ЕАЭС, Решение Совета ЕЭК №80 от 14.09.2021,
// группа 87 (сводный текст: alta.ru/tamdoc/21ett003/#gr87). Сверено 2026-10-06.
//
// Возрастные границы — как в калькуляторе ГТС (customs.kg, сервис ats-calculator,
// проверено запросами 06.10.2026): возраст = текущий год − год выпуска;
//   ≤ 3 лет  → ставка для новых;
//   4–7 лет  → бывшие в эксплуатации до 7 лет;
//   > 7 лет  → только специфическая ставка в евро за 1 см³ (от цены не зависит).
// ГТС считает гибрид как бензиновый («бензин, бензиновый гибрид») — это ветка ЕТТ
// «мощность ДВС больше 30-минутной мощности электродвигателя».
// ============================================================================

export type HybridKind = 'ice' | 'electric';
export type TruckFuel = 'diesel' | 'petrol';

/**
 * Пошлина = max(стоимость × adValorem, объём × minEurPerCm3 × курс EUR/USD),
 * либо, если задан eurPerCm3, ровно объём × eurPerCm3 × курс EUR/USD.
 */
export interface DutyRule {
  adValorem: number;
  minEurPerCm3?: number;
  eurPerCm3?: number;
}

export const NEW_MAX_AGE = 3;
export const USED_SPECIFIC_FROM_AGE = 8; // «прошло более 7 лет»
export const USED_MIN_FROM_AGE = 6; // «более 5 лет, но не более 7 лет»

// Гибрид, у которого ДВС мощнее электромотора (типичный HEV/PHEV), б/у.
// [верхняя граница объёма, мин. €/см³ при 20% (до 7 лет), €/см³ старше 7 лет]
const HYBRID_ICE_USED: Array<[number, number, number]> = [
  [1000, 0.36, 1.4], // 8703 40 209
  [1500, 0.4, 1.5], // 8703 40 409
  [1800, 0.36, 1.6], // 8703 40 602
  [3000, 0.44, 2.2], // 8703 40 603 / 609
  [Infinity, 0.8, 3.2], // 8703 40 809
];

export const getHybridDuty = (age: number, volume: number, kind: HybridKind): DutyRule => {
  // Электромотор мощнее ДВС — 15% в любом возрасте (подсубпозиции «прочие»).
  if (kind === 'electric') return { adValorem: 0.15 };
  if (age <= NEW_MAX_AGE) {
    // Новые: до 2800 см³ — 15%; 2800–3000 — 12,5% (8703 40 599 8). Свыше 3000 см³ —
    // по строкам внедорожников (доп. примечание 6 к гр.87), как считает ГТС:
    // 3000–3500 — 15% (709 5), 3500–4200 — 12,5% (709 3), свыше 4200 — 10% (709 1).
    if (volume <= 2800) return { adValorem: 0.15 };
    if (volume <= 3000) return { adValorem: 0.125 };
    if (volume <= 3500) return { adValorem: 0.15 };
    if (volume <= 4200) return { adValorem: 0.125 };
    return { adValorem: 0.1 };
  }
  const [, minEur, specificEur] = HYBRID_ICE_USED.find(([max]) => volume <= max)!;
  if (age >= USED_SPECIFIC_FROM_AGE) return { adValorem: 0, eurPerCm3: specificEur };
  return { adValorem: 0.2, minEurPerCm3: minEur };
};

export const getTruckDuty = (
  age: number,
  volume: number,
  weightTons: number,
  fuel: TruckFuel
): DutyRule => {
  // Любой бывший в эксплуатации старше 7 лет — 1 € за 1 см³ (8704 21–32).
  if (age >= USED_SPECIFIC_FROM_AGE) return { adValorem: 0, eurPerCm3: 1 };
  const isNew = age <= NEW_MAX_AGE;

  if (fuel === 'petrol') {
    // 8704 31 (≤5 т): новые >2800 см³ — 12,5%, прочие 15%; 8704 32 (>5 т) — 15%.
    if (isNew && weightTons <= 5 && volume > 2800) return { adValorem: 0.125 };
    return { adValorem: 0.15 };
  }

  // Дизель
  if (weightTons <= 5) {
    // 8704 21: 10%; б/у 5–7 лет с объёмом ≤2500 см³ — не менее 0,13 €/см³.
    if (!isNew && age >= USED_MIN_FROM_AGE && volume <= 2500) {
      return { adValorem: 0.1, minEurPerCm3: 0.13 };
    }
    return { adValorem: 0.1 };
  }
  if (weightTons <= 20) {
    // 8704 22: новые 15%; б/у 10%, в 5–7 лет — не менее 0,18 €/см³.
    if (isNew) return { adValorem: 0.15 };
    if (age >= USED_MIN_FROM_AGE) return { adValorem: 0.1, minEurPerCm3: 0.18 };
    return { adValorem: 0.1 };
  }
  // 8704 23 (>20 т): новые 5%, б/у 10%.
  return { adValorem: isNew ? 0.05 : 0.1 };
};

/** Сумма пошлины в USD по правилу ЕТТ. */
export const applyDutyRule = (
  rule: DutyRule,
  valueUsd: number,
  volume: number,
  eurPerUsd: number
): number => {
  if (rule.eurPerCm3 !== undefined) return volume * rule.eurPerCm3 * eurPerUsd;
  const adValorem = valueUsd * rule.adValorem;
  const minimum = rule.minEurPerCm3 ? volume * rule.minEurPerCm3 * eurPerUsd : 0;
  return Math.max(adValorem, minimum);
};
