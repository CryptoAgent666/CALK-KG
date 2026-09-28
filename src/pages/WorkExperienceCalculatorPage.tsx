import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import CalculatorShell from '../components/CalculatorShell';
import { calculateExperience, WorkPeriod } from '../utils/workExperience';
import { getPaymentPercentByExperience } from '../data/sickLeaveData';

const pluralRu = (n: number, forms: [string, string, string]) => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
};

const WorkExperienceCalculatorPage = () => {
  const { language, t, getLocalizedPath } = useLanguage();
  const [periods, setPeriods] = useState<WorkPeriod[]>([{ start: '2019-09-01', end: '' }]);

  const result = useMemo(() => calculateExperience(periods), [periods]);
  const sickPercent = result ? getPaymentPercentByExperience(result.totalYearsDecimal) : null;

  const updatePeriod = (index: number, patch: Partial<WorkPeriod>) =>
    setPeriods(list => list.map((period, i) => (i === index ? { ...period, ...patch } : period)));

  const unit = (n: number, kind: 'y' | 'm' | 'd') => {
    if (language === 'ky') return { y: 'жыл', m: 'ай', d: 'күн' }[kind];
    const forms: Record<typeof kind, [string, string, string]> = {
      y: ['год', 'года', 'лет'],
      m: ['месяц', 'месяца', 'месяцев'],
      d: ['день', 'дня', 'дней']
    };
    return pluralRu(n, forms[kind]);
  };

  return (
    <CalculatorShell
      slug="work-experience"
      base="work_experience"
      icon={Briefcase}
      gradient="from-teal-600 to-teal-700"
      lastUpdated="2026-09-28"
      faqCount={3}
    >
      <div className="grid lg:grid-cols-2 gap-8">
        <section className="bg-white rounded-xl shadow-sm p-6 sm:p-8" aria-labelledby="we-periods">
          <h2 id="we-periods" className="text-xl font-semibold text-gray-900 mb-6">{t('work_experience_periods_title')}</h2>
          <div className="space-y-5">
            {periods.map((period, index) => (
              <fieldset key={index} className="border border-gray-200 rounded-lg p-4">
                <legend className="px-1 text-sm font-medium text-gray-700">
                  {t('work_experience_period').replace('{n}', String(index + 1))}
                </legend>
                <div className="grid sm:grid-cols-2 gap-3">
                  <label className="block text-sm text-gray-600">
                    {t('work_experience_start')}
                    <input
                      type="date"
                      value={period.start}
                      onChange={e => updatePeriod(index, { start: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </label>
                  <label className="block text-sm text-gray-600">
                    {t('work_experience_end')}
                    <input
                      type="date"
                      value={period.end}
                      disabled={period.end === ''}
                      onChange={e => updatePeriod(index, { end: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-gray-100 disabled:text-gray-400"
                    />
                  </label>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={period.end === ''}
                      onChange={e => updatePeriod(index, { end: e.target.checked ? '' : new Date().toISOString().slice(0, 10) })}
                      className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    {t('work_experience_current')}
                  </label>
                  {periods.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setPeriods(list => list.filter((_, i) => i !== index))}
                      className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      {t('work_experience_remove')}
                    </button>
                  )}
                </div>
              </fieldset>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPeriods(list => [...list, { start: '', end: new Date().toISOString().slice(0, 10) }])}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-teal-600 text-teal-700 hover:bg-teal-50 transition-colors"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {t('work_experience_add')}
          </button>
        </section>

        <section className="space-y-6" aria-live="polite">
          {result ? (
            <>
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-8 text-white">
                <p className="text-teal-100 mb-2">{t('work_experience_result_title')}</p>
                <p className="text-3xl sm:text-4xl font-bold">
                  {result.total.years} {unit(result.total.years, 'y')} {result.total.months} {unit(result.total.months, 'm')} {result.total.days} {unit(result.total.days, 'd')}
                </p>
                <p className="text-teal-100 mt-3 text-sm">
                  {t('work_experience_total_days').replace('{n}', result.totalDays.toLocaleString('ru-RU'))}
                </p>
              </div>
              {result.overlapDays > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
                  {t('work_experience_overlap').replace('{n}', String(result.overlapDays))}
                </div>
              )}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <p className="text-gray-700">
                  {t('work_experience_sick_percent').replace('{pct}', String(sickPercent))}
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-sm">
                  <Link to={getLocalizedPath('/calculator/sick-leave/')} className="text-teal-700 font-medium hover:underline">
                    {t('work_experience_link_sick')} →
                  </Link>
                  <Link to={getLocalizedPath('/calculator/pension/')} className="text-teal-700 font-medium hover:underline">
                    {t('work_experience_link_pension')} →
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">{t('work_experience_empty')}</div>
          )}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-sm text-gray-600 leading-relaxed">
            {t('work_experience_rule_note')}
          </div>
        </section>
      </div>
    </CalculatorShell>
  );
};

export default WorkExperienceCalculatorPage;
