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
