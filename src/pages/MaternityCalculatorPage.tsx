import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Baby } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import CalculatorShell from '../components/CalculatorShell';
import { calculateMaternity, MotherStatus } from '../data/maternityData';

const formatSom = (value: number) => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(Math.round(value));

const STATUSES: MotherStatus[] = ['employee', 'entrepreneur', 'unemployed', 'not_working'];

const MaternityCalculatorPage = () => {
  const { t, getLocalizedPath } = useLanguage();
  const [status, setStatus] = useState<MotherStatus>('employee');
  const [earnings, setEarnings] = useState('75000');
  const [children, setChildren] = useState(1);
  const [complicated, setComplicated] = useState(false);
  const [highMountain, setHighMountain] = useState(false);
  const [coefficient, setCoefficient] = useState('1.3');

  const result = useMemo(() => calculateMaternity({
    status,
    earnings3Months: Number(earnings) || 0,
    children,
    complicated,
    highMountain,
    districtCoefficient: Number(coefficient) || 1
  }), [status, earnings, children, complicated, highMountain, coefficient]);

  const row = (label: string, value: string, strong = false) => (
    <div className="flex justify-between gap-4 py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-gray-600">{label}</span>
      <span className={strong ? 'font-bold text-gray-900' : 'font-medium text-gray-900'}>{value}</span>
    </div>
  );

  return (
    <CalculatorShell
      slug="maternity"
      base="maternity"
      icon={Baby}
      gradient="from-rose-600 to-rose-700"
      lastUpdated="2026-09-28"
      faqCount={4}
    >
      <div className="grid lg:grid-cols-2 gap-8">
        <section className="bg-white rounded-xl shadow-sm p-6 sm:p-8 space-y-5" aria-labelledby="mat-input">
          <h2 id="mat-input" className="text-xl font-semibold text-gray-900">{t('maternity_input_title')}</h2>

          <label className="block text-sm font-medium text-gray-700">
            {t('maternity_status_label')}
            <select
              value={status}
              onChange={e => setStatus(e.target.value as MotherStatus)}
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            >
              {STATUSES.map(item => <option key={item} value={item}>{t(`maternity_status_${item}` as any)}</option>)}
            </select>
          </label>

          {status === 'employee' && (
            <label className="block text-sm font-medium text-gray-700">
              {t('maternity_earnings_label')}
              <input
                type="number"
                inputMode="decimal"
                min="0"
                value={earnings}
                onChange={e => setEarnings(e.target.value)}
                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
              <span className="block mt-1 text-xs font-normal text-gray-500">{t('maternity_earnings_hint')}</span>
            </label>
          )}

          <label className="block text-sm font-medium text-gray-700">
            {t('maternity_children_label')}
            <select
              value={children}
              onChange={e => setChildren(Number(e.target.value))}
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            >
              {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n === 4 ? '4+' : n}</option>)}
            </select>
          </label>

          {children === 1 && (
            <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={complicated} onChange={e => setComplicated(e.target.checked)} className="mt-1 h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
              {t('maternity_complicated')}
            </label>
          )}

          <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={highMountain} onChange={e => setHighMountain(e.target.checked)} className="mt-1 h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
            <span>
              {t('maternity_high_mountain')}
              <span className="block text-xs text-gray-500 mt-1">{t('maternity_high_mountain_hint')}</span>
            </span>
          </label>

          {highMountain && (status === 'entrepreneur' || status === 'unemployed') && (
            <label className="block text-sm font-medium text-gray-700">
              {t('maternity_coefficient_label')}
              <input
                type="number"
                inputMode="decimal"
                min="1"
                max="2"
                step="0.05"
                value={coefficient}
                onChange={e => setCoefficient(e.target.value)}
                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
            </label>
          )}
        </section>

        <section className="space-y-6" aria-live="polite">
          <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-xl p-8 text-white">
            <p className="text-rose-100 mb-1">{t('maternity_grand_total')}</p>
            <p className="text-4xl font-bold">{formatSom(result.grandTotal)} {t('som')}</p>
            <p className="text-rose-100 text-sm mt-3">
              {t('maternity_leave_days').replace('{calendar}', String(result.calendarDays)).replace('{working}', String(result.workingDays))}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 text-sm">
            <h3 className="font-semibold text-gray-900 mb-2">{t('maternity_benefit_title')}</h3>
            {result.eligible ? (
              <>
                {status === 'employee' && row(t('maternity_avg_daily'), `${formatSom(result.averageDailyWage)} ${t('som')}`)}
                {status === 'employee' && row(t('maternity_employer_part'), `${formatSom(result.employerPart)} ${t('som')}`)}
                {row(
                  t(result.fullPayHighMountain ? 'maternity_budget_part_full' : 'maternity_budget_part'),
                  `${formatSom(result.budgetPart)} ${t('som')}`
                )}
                {row(t('maternity_benefit_total'), `${formatSom(result.benefitTotal)} ${t('som')}`, true)}
              </>
            ) : (
              <p className="text-gray-700 leading-relaxed">{t('maternity_not_eligible')}</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 text-sm">
            <h3 className="font-semibold text-gray-900 mb-2">{t('maternity_birth_payment_title')}</h3>
            {row(
              t('maternity_birth_payment_row').replace('{per}', formatSom(result.birthPaymentPerChild)).replace('{n}', String(children)),
              `${formatSom(result.birthPayment)} ${t('som')}`,
              true
            )}
            <p className="mt-2 text-gray-500">{t('maternity_birth_payment_hint')}</p>
          </div>
        </section>
      </div>

      <section className="bg-white rounded-xl shadow-sm p-6 sm:p-8" aria-labelledby="mat-other">
        <h2 id="mat-other" className="text-xl font-semibold text-gray-900 mb-4">{t('maternity_other_title')}</h2>
        <ul className="space-y-3 text-gray-700 leading-relaxed list-disc pl-5">
          <li>{t('maternity_other_bala_yrysy')}</li>
          <li>{t('maternity_other_family')} <Link to={getLocalizedPath('/calculator/family-benefit/')} className="text-rose-700 font-medium hover:underline">{t('maternity_other_family_link')}</Link></li>
          <li>{t('maternity_other_high_mountain')}</li>
          <li>{t('maternity_other_bala_bereke')}</li>
          <li>{t('maternity_other_childcare_leave')}</li>
          <li>{t('maternity_other_tax')}</li>
        </ul>
        <p className="mt-4 text-sm text-gray-500">{t('maternity_note')}</p>
      </section>
    </CalculatorShell>
  );
};

export default MaternityCalculatorPage;
