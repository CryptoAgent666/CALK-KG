import { DATA_VERIFIED } from '../data/dataFreshness';

const MONTHS_RU = [
  'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
  'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
];

const MONTHS_KY = [
  'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
  'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
];

export const formatCurrentMonth = (language: 'ru' | 'ky'): string => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  const months = language === 'ky' ? MONTHS_KY : MONTHS_RU;

  return `${months[month]} ${year}`;
};

/**
 * Месяц ФАКТИЧЕСКОЙ сверки данных калькулятора для плашки «Данные актуальны на …».
 *
 * Раньше туда шёл formatCurrentMonth — то есть текущий месяц по часам браузера,
 * из-за чего страница каждый месяц заново обещала свежесть, которой не было
 * (см. комментарий в data/dataFreshness.ts). Теперь дата приходит из DATA_VERIFIED
 * и двигается только вместе с реальной сверкой.
 *
 * Нет ключа в карте — показываем текущий месяц, как раньше: молча спрятать плашку
 * хуже, но такой калькулятор надо внести в DATA_VERIFIED.
 */
export const formatVerifiedMonth = (language: 'ru' | 'ky', calculatorKey: string): string => {
  const verified = DATA_VERIFIED[calculatorKey];
  if (!verified) return formatCurrentMonth(language);

  const [year, month] = verified.split('-');
  const months = language === 'ky' ? MONTHS_KY : MONTHS_RU;

  return `${months[Number(month) - 1]} ${year}`;
};
