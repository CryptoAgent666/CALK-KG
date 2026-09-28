// ============================================================================
// ИПОТЕКА В КР: ПРЕДЛОЖЕНИЯ БАНКОВ И ГОСПРОГРАММЫ (сомы)
// ============================================================================
// Сверено 2026-09-28 по сайтам самих банков и ГИК. Старая таблица (Айыл 14–16,5%,
// «ФКУР», БТА, «Банк Азии», сроки 20–25 лет) не проверялась и была неверной:
// БТА присоединён к «Бакай Банку» (2020), «ФКУР» не существует, у Банка Азии нет
// ипотеки, РСК Банк теперь Элдик Банк, «КБ Кыргызстан» — Мбанк.
// ⚠️ Коммерческие ставки меняются часто — сверять ежеквартально; АБанк: ставки
// 16/17% акционные до 01.10.2026 — сверить после этой даты.
// ============================================================================

export const MORTGAGE_OFFERS_AS_OF = '2026-09-28';

// Средневзвешенная ставка по новым ипотечным кредитам в сомах, НБКР (июль 2026, предв.).
export const NBKR_AVG_MORTGAGE_RATE = 16.05;

export interface BankMortgageOffer {
  bank: string;
  product: string;
  rateFrom: number; // номинальная ставка «от», % годовых
  rateNoteKey?: string; // ступенчатые / акционные ставки
  epsFrom?: number; // эффективная ставка, если банк её публикует
  maxTermYears: number;
  minDownPercent?: number;
  url: string;
}

export const BANK_MORTGAGE_OFFERS: BankMortgageOffer[] = [
  { bank: 'АБанк (Айыл Банк)', product: 'Ипотека', rateFrom: 16, rateNoteKey: 'mortgage_offer_note_abank', epsFrom: 17.34, maxTermYears: 10, minDownPercent: 30, url: 'https://abank.kg/ru' },
  { bank: 'Мбанк', product: 'Мой дом', rateFrom: 16, rateNoteKey: 'mortgage_offer_note_mbank', maxTermYears: 10, minDownPercent: 30, url: 'https://mbank.kg/credits/ipoteka-moj-dom' },
  { bank: 'Бакай Банк', product: 'Ипотека', rateFrom: 17, rateNoteKey: 'mortgage_offer_note_bakai', epsFrom: 18.28, maxTermYears: 12, minDownPercent: 30, url: 'https://bakai.kg/ru/credits/mortgage/classic/' },
  { bank: 'Элдик Банк (РСК)', product: 'Кредит на жильё', rateFrom: 19, maxTermYears: 10, url: 'https://eldik.kg/ru/credits/kredit-na-zhile' },
  { bank: 'Оптима Банк', product: 'Ипотека', rateFrom: 19, maxTermYears: 7, minDownPercent: 30, url: 'https://optimabank.kg/ru/for-individuals/credits/mortgage' },
  { bank: 'Бай-Тушум', product: 'Ипотека', rateFrom: 20, epsFrom: 20.74, maxTermYears: 10, minDownPercent: 30, url: 'https://baitushum.kg/' },
  { bank: 'Дос-Кредобанк', product: 'Ипотека', rateFrom: 23, maxTermYears: 7, url: 'https://dcb.kg/ru/credits2/ipoteka' }
];

export interface GovMortgageProgram {
  nameKey: string;
  rate: string;
  maxTermYears: number;
  downKey: string;
  conditionsKey: string;
}

// ГИК (gik.kg) и программы через банки-партнёры.
export const GOV_MORTGAGE_PROGRAMS: GovMortgageProgram[] = [
  { nameKey: 'mortgage_gov_social', rate: '4%', maxTermYears: 25, downKey: 'mortgage_gov_down_none', conditionsKey: 'mortgage_gov_social_cond' },
  { nameKey: 'mortgage_gov_affordable', rate: '8%', maxTermYears: 25, downKey: 'mortgage_gov_down_none', conditionsKey: 'mortgage_gov_affordable_cond' },
  { nameKey: 'mortgage_gov_women', rate: '9,75%', maxTermYears: 25, downKey: 'mortgage_gov_down_women', conditionsKey: 'mortgage_gov_women_cond' },
  { nameKey: 'mortgage_gov_kfw', rate: '8%', maxTermYears: 15, downKey: 'mortgage_gov_down_20', conditionsKey: 'mortgage_gov_kfw_cond' }
];
