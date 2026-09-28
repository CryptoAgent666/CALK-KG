import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import CalculatorShell from '../components/CalculatorShell';
import { calculateTeacherSalary, Category, Education, EDUCATION_COEFFICIENT, BASE_RATE } from '../data/teacherSalary';

const formatSom = (value: number) => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(Math.round(value));
const EDUCATIONS: Education[] = ['general', 'vocational', 'bachelor', 'master'];
const CATEGORIES: Category[] = ['none', 'second', 'first', 'highest'];
const COEFFICIENTS = Array.from({ length: 17 }, (_, i) => (1 + i * 0.05).toFixed(2));
const HM_PERCENTS = [0, 5, 10, 15, 20, 25, 30];

const selectClass = 'mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500';

const TeacherSalaryCalculatorPage = () => {
  const { t, getLocalizedPath } = useLanguage();
  const [education, setEducation] = useState<Education>('bachelor');
  const [primaryGrades, setPrimaryGrades] = useState(false);
  const [hours, setHours] = useState('18');
  const [experience, setExperience] = useState('5');
  const [category, setCategory] = useState<Category>('none');
  const [classTeacher, setClassTeacher] = useState(true);
  const [notebooks, setNotebooks] = useState(false);
  const [rural, setRural] = useState(false);
  const [coefficient, setCoefficient] = useState('1.00');
  const [hmPercent, setHmPercent] = useState(0);
  const [other, setOther] = useState('0');

  const r = useMemo(() => calculateTeacherSalary({
    education,
    primaryGrades,
    hours: Number(hours) || 0,
    experienceYears: Number(experience) || 0,
    category,
    classTeacher,
    notebooks,
    rural,
    districtCoefficient: Number(coefficient) || 1,
    highMountainPercent: hmPercent,
    otherBonuses: Number(other) || 0
  }), [education, primaryGrades, hours, experience, category, classTeacher, notebooks, rural, coefficient, hmPercent, other]);

  const line = (label: string, value: number, show = true) =>
    show ? (
      <div className="flex justify-between gap-4 py-2 border-b border-gray-100 last:border-b-0">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900 whitespace-nowrap">{formatSom(value)} {t('som')}</span>
      </div>
    ) : null;

  const checkbox = (checked: boolean, onChange: (v: boolean) => void, label: string, hint?: string) => (
    <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="mt-1 h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
      <span>{label}{hint && <span className="block text-xs text-gray-500 mt-1">{hint}</span>}</span>
    </label>
  );

  return (
    <CalculatorShell
      slug="teacher-salary"
      base="teacher_salary"
      icon={GraduationCap}
      gradient="from-amber-600 to-amber-700"
      lastUpdated="2026-09-28"
      faqCount={4}
    >
      <div className="grid lg:grid-cols-2 gap-8">
        <section className="bg-white rounded-xl shadow-sm p-6 sm:p-8 space-y-5" aria-labelledby="ts-input">
          <h2 id="ts-input" className="text-xl font-semibold text-gray-900">{t('teacher_salary_input_title')}</h2>

          <label className="block text-sm font-medium text-gray-700">
            {t('teacher_salary_education')}
            <select value={education} onChange={e => setEducation(e.target.value as Education)} className={selectClass}>
              {EDUCATIONS.map(item => (
                <option key={item} value={item}>
                  {t(`teacher_salary_edu_${item}` as any)} — {formatSom(BASE_RATE * EDUCATION_COEFFICIENT[item])} {t('som')}
                </option>
              ))}
            </select>
          </label>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block text-sm font-medium text-gray-700">
              {t('teacher_salary_grades')}
              <select value={primaryGrades ? 'primary' : 'senior'} onChange={e => setPrimaryGrades(e.target.value === 'primary')} className={selectClass}>
                <option value="senior">{t('teacher_salary_grades_senior')}</option>
                <option value="primary">{t('teacher_salary_grades_primary')}</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-gray-700">
              {t('teacher_salary_hours')}
              <input type="number" min="0" max="40" value={hours} onChange={e => setHours(e.target.value)} className={selectClass} />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              {t('teacher_salary_experience')}
              <input type="number" min="0" step="1" value={experience} onChange={e => setExperience(e.target.value)} className={selectClass} />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              {t('teacher_salary_category')}
              <select value={category} onChange={e => setCategory(e.target.value as Category)} className={selectClass}>
                {CATEGORIES.map(item => <option key={item} value={item}>{t(`teacher_salary_cat_${item}` as any)}</option>)}
              </select>
            </label>
          </div>

          <div className="space-y-3">
            {checkbox(classTeacher, setClassTeacher, t('teacher_salary_class_teacher'))}
            {checkbox(notebooks, setNotebooks, t('teacher_salary_notebooks'), t('teacher_salary_notebooks_hint'))}
            {checkbox(rural, setRural, t('teacher_salary_rural'))}
          </div>

          <details className="border border-gray-200 rounded-lg p-4">
            <summary className="cursor-pointer text-sm font-medium text-gray-800">{t('teacher_salary_hm_title')}</summary>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <label className="block text-sm font-medium text-gray-700">
                {t('teacher_salary_coefficient')}
                <select value={coefficient} onChange={e => setCoefficient(e.target.value)} className={selectClass}>
                  {COEFFICIENTS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="block text-sm font-medium text-gray-700">
                {t('teacher_salary_hm_percent')}
                <select value={hmPercent} onChange={e => setHmPercent(Number(e.target.value))} className={selectClass}>
                  {HM_PERCENTS.map(p => <option key={p} value={p}>{p === 0 ? t('teacher_salary_hm_none') : `${p}%`}</option>)}
                </select>
              </label>
            </div>
          </details>

          <label className="block text-sm font-medium text-gray-700">
            {t('teacher_salary_other')}
            <input type="number" min="0" value={other} onChange={e => setOther(e.target.value)} className={selectClass} />
            <span className="block mt-1 text-xs font-normal text-gray-500">{t('teacher_salary_other_hint')}</span>
          </label>
        </section>

        <section className="space-y-6" aria-live="polite">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-8 text-white">
            <p className="text-amber-50 mb-1">{t('teacher_salary_net')}</p>
            <p className="text-4xl font-bold">{formatSom(r.net)} {t('som')}</p>
            <p className="text-amber-50 text-sm mt-3">{t('teacher_salary_gross')}: {formatSom(r.gross)} {t('som')}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 text-sm">
            <h3 className="font-semibold text-gray-900 mb-2">{t('teacher_salary_breakdown')}</h3>
            {line(t('teacher_salary_line_hours').replace('{hours}', hours || '0').replace('{norm}', String(r.norm)), r.hoursPay)}
            {line(t('teacher_salary_line_experience').replace('{pct}', String(r.experiencePct)), r.experiencePay, r.experiencePay > 0)}
            {line(t('teacher_salary_line_primary'), r.primaryGradesPay, r.primaryGradesPay > 0)}
            {line(t('teacher_salary_line_class'), r.classTeacherPay, r.classTeacherPay > 0)}
            {line(t('teacher_salary_line_notebooks'), r.notebooksPay, r.notebooksPay > 0)}
            {line(t('teacher_salary_line_rural'), r.ruralPay, r.ruralPay > 0)}
            {line(t('teacher_salary_line_category'), r.categoryPay, r.categoryPay > 0)}
            {line(t('teacher_salary_line_hm'), r.highMountainPay, r.highMountainPay > 0)}
            {line(t('teacher_salary_line_other'), r.otherPay, r.otherPay > 0)}
            {line(t('teacher_salary_line_coefficient').replace('{k}', coefficient), r.coefficientIncrease, r.coefficientIncrease > 0)}
            {line(t('teacher_salary_line_compensation'), r.compensation)}
            <div className="flex justify-between gap-4 py-2 font-semibold"><span>{t('teacher_salary_gross')}</span><span>{formatSom(r.gross)} {t('som')}</span></div>
            {line(t('teacher_salary_line_sf'), -r.socialFund)}
            {line(t('teacher_salary_line_tax'), -r.incomeTax)}
          </div>
          <p className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-xl p-4">
            {t('teacher_salary_note')}{' '}
            <Link to={getLocalizedPath('/calculator/salary/')} className="text-amber-700 font-medium hover:underline">{t('teacher_salary_link_salary')}</Link>
          </p>
        </section>
      </div>
    </CalculatorShell>
  );
};

export default TeacherSalaryCalculatorPage;
