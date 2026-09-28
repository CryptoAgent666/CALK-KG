// Сумма прописью на русском и кыргызском (сом / тыйын). Поддерживается до
// 999 999 999 999,99.

type Lang = 'ru' | 'ky';

const RU_UNITS_M = ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
const RU_UNITS_F = ['', 'одна', 'две', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
const RU_TEENS = ['десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'];
const RU_TENS = ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'];
const RU_HUNDREDS = ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'];
const RU_SCALES: { feminine: boolean; forms: [string, string, string] }[] = [
  { feminine: false, forms: ['', '', ''] },
  { feminine: true, forms: ['тысяча', 'тысячи', 'тысяч'] },
  { feminine: false, forms: ['миллион', 'миллиона', 'миллионов'] },
  { feminine: false, forms: ['миллиард', 'миллиарда', 'миллиардов'] }
];

const KY_UNITS = ['', 'бир', 'эки', 'үч', 'төрт', 'беш', 'алты', 'жети', 'сегиз', 'тогуз'];
const KY_TENS = ['', 'он', 'жыйырма', 'отуз', 'кырк', 'элүү', 'алтымыш', 'жетимиш', 'сексен', 'токсон'];
const KY_SCALES = ['', 'миң', 'миллион', 'миллиард'];

export const MAX_AMOUNT = 999_999_999_999.99;

export const pluralRu = (n: number, forms: [string, string, string]) => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
};

const tripletRu = (n: number, feminine: boolean): string[] => {
  const words: string[] = [];
  const h = Math.floor(n / 100);
  const rest = n % 100;
  if (h) words.push(RU_HUNDREDS[h]);
  if (rest >= 10 && rest < 20) {
    words.push(RU_TEENS[rest - 10]);
  } else {
    const t = Math.floor(rest / 10);
    const u = rest % 10;
    if (t) words.push(RU_TENS[t]);
    if (u) words.push((feminine ? RU_UNITS_F : RU_UNITS_M)[u]);
  }
  return words;
};

const tripletKy = (n: number): string[] => {
  const words: string[] = [];
  const h = Math.floor(n / 100);
  const t = Math.floor((n % 100) / 10);
  const u = n % 10;
  if (h) words.push(h === 1 ? 'жүз' : `${KY_UNITS[h]} жүз`);
  if (t) words.push(KY_TENS[t]);
  if (u) words.push(KY_UNITS[u]);
  return words;
};

/** Целое число прописью (род единиц — мужской, как у «сом»). */
export const integerToWords = (value: number, lang: Lang): string => {
  const n = Math.floor(Math.abs(value));
  if (n === 0) return lang === 'ky' ? 'нөл' : 'ноль';
  const triplets: number[] = [];
  let rest = n;
  while (rest > 0) {
    triplets.push(rest % 1000);
    rest = Math.floor(rest / 1000);
  }
  const words: string[] = [];
  for (let i = triplets.length - 1; i >= 0; i--) {
    const part = triplets[i];
    if (!part) continue;
    if (lang === 'ky') {
      words.push(...tripletKy(part));
      if (KY_SCALES[i]) words.push(KY_SCALES[i]);
    } else {
      const scale = RU_SCALES[i];
      words.push(...tripletRu(part, scale.feminine));
      if (i > 0) words.push(pluralRu(part, scale.forms));
    }
  }
  return words.join(' ');
};

const capitalize = (text: string) => text.charAt(0).toLocaleUpperCase('ru-RU') + text.slice(1);

export interface AmountInWords {
  words: string; // «Двенадцать тысяч триста сорок пять сомов 50 тыйынов»
  fullWords: string; // тыйыны тоже прописью
  document: string; // «12 345 сом 50 тыйын (Двенадцать тысяч …)»
}

/** Сумма в сомах прописью. amount — с копейками (тыйынами), округляется до 0,01. */
export const amountToWords = (amount: number, lang: Lang): AmountInWords => {
  const cents = Math.round(Math.abs(amount) * 100);
  const som = Math.floor(cents / 100);
  const tyiyn = cents % 100;
  const tyiynDigits = String(tyiyn).padStart(2, '0');
  const somWords = integerToWords(som, lang);

  if (lang === 'ky') {
    const words = capitalize(`${somWords} сом ${tyiynDigits} тыйын`);
    const fullWords = capitalize(`${somWords} сом ${integerToWords(tyiyn, 'ky')} тыйын`);
    const document = `${som.toLocaleString('ru-RU')} сом ${tyiynDigits} тыйын (${capitalize(`${somWords} сом ${tyiynDigits} тыйын`)})`;
    return { words, fullWords, document };
  }

  const somUnit = pluralRu(som, ['сом', 'сома', 'сомов']);
  const tyiynUnit = pluralRu(tyiyn, ['тыйын', 'тыйына', 'тыйынов']);
  const words = capitalize(`${somWords} ${somUnit} ${tyiynDigits} ${tyiynUnit}`);
  const fullWords = capitalize(`${somWords} ${somUnit} ${integerToWords(tyiyn, 'ru')} ${tyiynUnit}`);
  const document = `${som.toLocaleString('ru-RU')} ${somUnit} ${tyiynDigits} ${tyiynUnit} (${words})`;
  return { words, fullWords, document };
};
