// Подсчёт трудового стажа по периодам работы.
// Периоды считаются включительно (день увольнения — рабочий день), пересечения
// (совместительство, наложение дат) засчитываются один раз. Каждый период
// переводится в календарные годы/месяцы/дни, при сложении 30 дней = 1 месяц и
// 12 месяцев = 1 год — так стаж обычно складывают кадровые службы.

export interface WorkPeriod {
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD; пустая строка — «по настоящее время»
}

export interface YMD {
  years: number;
  months: number;
  days: number;
}

export interface ExperienceResult {
  total: YMD;
  totalDays: number;
  totalYearsDecimal: number;
  merged: { start: Date; end: Date }[];
  overlapDays: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

const parseDate = (value: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return Number.isNaN(date.getTime()) ? null : date;
};

const daysBetweenInclusive = (start: Date, end: Date) => Math.round((end.getTime() - start.getTime()) / DAY_MS) + 1;

// Календарная разница [start, end] включительно: 01.01.2020–31.12.2020 = 1 год.
export const calendarDiff = (start: Date, end: Date): YMD => {
  const endExclusive = new Date(end.getTime() + DAY_MS);
  let years = endExclusive.getUTCFullYear() - start.getUTCFullYear();
  let months = endExclusive.getUTCMonth() - start.getUTCMonth();
  let days = endExclusive.getUTCDate() - start.getUTCDate();
  if (days < 0) {
    months -= 1;
    const prevMonthDays = new Date(Date.UTC(endExclusive.getUTCFullYear(), endExclusive.getUTCMonth(), 0)).getUTCDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
};

export const normalizeYMD = ({ years, months, days }: YMD): YMD => {
  const extraMonths = Math.floor(days / 30);
  const d = days % 30;
  const totalMonths = months + extraMonths;
  return { years: years + Math.floor(totalMonths / 12), months: totalMonths % 12, days: d };
};

export const calculateExperience = (periods: WorkPeriod[], today: Date = new Date()): ExperienceResult | null => {
  const todayUtc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  const intervals = periods
    .map(period => {
      const start = parseDate(period.start);
      const end = period.end ? parseDate(period.end) : todayUtc;
      return start && end && end.getTime() >= start.getTime() ? { start, end } : null;
    })
    .filter((item): item is { start: Date; end: Date } => item !== null)
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  if (intervals.length === 0) return null;

  const rawDays = intervals.reduce((sum, item) => sum + daysBetweenInclusive(item.start, item.end), 0);

  const merged: { start: Date; end: Date }[] = [];
  for (const item of intervals) {
    const last = merged[merged.length - 1];
    if (last && item.start.getTime() <= last.end.getTime() + DAY_MS) {
      if (item.end.getTime() > last.end.getTime()) last.end = item.end;
    } else {
      merged.push({ start: item.start, end: item.end });
    }
  }

  const totalDays = merged.reduce((sum, item) => sum + daysBetweenInclusive(item.start, item.end), 0);
  const summed = merged.reduce<YMD>((acc, item) => {
    const diff = calendarDiff(item.start, item.end);
    return { years: acc.years + diff.years, months: acc.months + diff.months, days: acc.days + diff.days };
  }, { years: 0, months: 0, days: 0 });
  const total = normalizeYMD(summed);

  return {
    total,
    totalDays,
    totalYearsDecimal: total.years + total.months / 12 + total.days / 365,
    merged,
    overlapDays: rawDays - totalDays
  };
};
