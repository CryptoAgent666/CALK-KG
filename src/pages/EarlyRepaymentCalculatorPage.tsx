import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PiggyBank } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import CalculatorShell from '../components/CalculatorShell';
import { calculateEarlyRepayment, ScenarioResult } from '../utils/earlyRepayment';

const formatSom = (value: number) => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(Math.round(value));

const Field = ({ id, label, value, onChange, hint }: { id: string; label: string; value: string; onChange: (v: string) => void; hint?: string }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      id={id}
      type="number"
      inputMode="decimal"
      min="0"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
    />
    {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
  </div>
);

const EarlyRepaymentCalculatorPage = () => {
  const { t, getLocalizedPath } = useLanguage();
  const [principal, setPrincipal] = useState('1000000');
  const [rate, setRate] = useState('18');
  const [term, setTerm] = useState('60');
  const [extra, setExtra] = useState('200000');
  const [after, setAfter] = useState('12');

  const result = useMemo(() => calculateEarlyRepayment({
    principal: Number(principal),
    annualRatePercent: Number(rate),
    termMonths: Number(term),
    extraPayment: Number(extra),
    afterPayment: Number(after)
  }), [principal, rate, term, extra, after]);

  const monthsLabel = (n: number) => t('early_repayment_months').replace('{n}', String(n));

  const Scenario = ({ titleKey, scenario, highlight }: { titleKey: string; scenario: ScenarioResult; highlight: boolean }) => {
    const saving = result ? result.base.totalInterest - scenario.totalInterest : 0;
    return (
      <div className={`rounded-xl p-6 ${highlight ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white' : 'bg-white shadow-sm'}`}>
        <h3 className={`font-semibold mb-4 ${highlight ? 'text-white' : 'text-gray-900'}`}>{t(titleKey as any)}</h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4"><dt className={highlight ? 'text-emerald-50' : 'text-gray-600'}>{t('early_repayment_new_payment')}</dt><dd className="font-semibold">{formatSom(scenario.monthlyPayment)} {t('som')}</dd></div>
          <div className="flex justify-between gap-4"><dt className={highlight ? 'text-emerald-50' : 'text-gray-600'}>{t('early_repayment_total_term')}</dt><dd className="font-semibold">{monthsLabel(scenario.months)}</dd></div>
          <div className="flex justify-between gap-4"><dt className={highlight ? 'text-emerald-50' : 'text-gray-600'}>{t('early_repayment_interest')}</dt><dd className="font-semibold">{formatSom(scenario.totalInterest)} {t('som')}</dd></div>
        </dl>
        <p className={`mt-4 text-lg font-bold ${highlight ? 'text-white' : 'text-emerald-700'}`}>
          {t('early_repayment_saving')} {formatSom(saving)} {t('som')}
        </p>
      </div>
    );
  };

  const termBetter = result ? result.reduceTerm.totalInterest <= result.reducePayment.totalInterest : true;

  return (
    <CalculatorShell
      slug="early-repayment"
      base="early_repayment"
      icon={PiggyBank}
      gradient="from-emerald-600 to-emerald-700"
      lastUpdated="2026-09-28"
      faqCount={3}
    >
      <section className="bg-white rounded-xl shadow-sm p-6 sm:p-8" aria-labelledby="er-input">
        <h2 id="er-input" className="text-xl font-semibold text-gray-900 mb-6">{t('early_repayment_input_title')}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Field id="er-principal" label={t('early_repayment_principal')} value={principal} onChange={setPrincipal} />
          <Field id="er-rate" label={t('early_repayment_rate')} value={rate} onChange={setRate} />
          <Field id="er-term" label={t('early_repayment_term')} value={term} onChange={setTerm} />
          <Field id="er-extra" label={t('early_repayment_extra')} value={extra} onChange={setExtra} />
          <Field id="er-after" label={t('early_repayment_after')} value={after} onChange={setAfter} hint={t('early_repayment_after_hint')} />
        </div>
      </section>

      {result ? (
        <section aria-live="polite" className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 grid sm:grid-cols-3 gap-4 text-sm">
            <div><p className="text-gray-500">{t('early_repayment_base_payment')}</p><p className="text-xl font-semibold text-gray-900">{formatSom(result.base.monthlyPayment)} {t('som')}</p></div>
            <div><p className="text-gray-500">{t('early_repayment_base_interest')}</p><p className="text-xl font-semibold text-gray-900">{formatSom(result.base.totalInterest)} {t('som')}</p></div>
            <div><p className="text-gray-500">{t('early_repayment_balance')}</p><p className="text-xl font-semibold text-gray-900">{formatSom(result.balanceBeforeExtra)} {t('som')}</p></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Scenario titleKey="early_repayment_reduce_term" scenario={result.reduceTerm} highlight={termBetter} />
            <Scenario titleKey="early_repayment_reduce_payment" scenario={result.reducePayment} highlight={!termBetter} />
          </div>
          <p className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-xl p-4">
            {t('early_repayment_note')}{' '}
            <Link to={getLocalizedPath('/calculator/loan/')} className="text-emerald-700 font-medium hover:underline">{t('early_repayment_link_loan')}</Link>
            {' · '}
            <Link to={getLocalizedPath('/calculator/mortgage/')} className="text-emerald-700 font-medium hover:underline">{t('early_repayment_link_mortgage')}</Link>
          </p>
        </section>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">{t('early_repayment_empty')}</div>
      )}
    </CalculatorShell>
  );
};

export default EarlyRepaymentCalculatorPage;
