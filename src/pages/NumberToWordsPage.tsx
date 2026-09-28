import { useMemo, useState } from 'react';
import { Type, Copy, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import CalculatorShell from '../components/CalculatorShell';
import { amountToWords, integerToWords, MAX_AMOUNT } from '../utils/numberToWords';

type Mode = 'currency' | 'number';

const parseAmount = (raw: string) => {
  const normalized = raw.replace(/\s| | /g, '').replace(',', '.');
  if (!/^\d+(\.\d{0,2})?$/.test(normalized)) return null;
  const value = Number(normalized);
  return value <= MAX_AMOUNT ? value : null;
};

const CopyButton = ({ text, label, doneLabel }: { text: string; label: string; doneLabel: string }) => {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        }).catch(() => undefined);
      }}
      className="inline-flex items-center gap-1 text-sm text-slate-700 hover:text-slate-900 shrink-0"
    >
      {done ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      {done ? doneLabel : label}
    </button>
  );
};

const NumberToWordsPage = () => {
  const { language, t } = useLanguage();
  const [raw, setRaw] = useState('12345.50');
  const [mode, setMode] = useState<Mode>('currency');
  // Язык результата не обязан совпадать с языком интерфейса: платёжку часто нужно на обоих.
  const [outLang, setOutLang] = useState<'ru' | 'ky'>(language === 'ky' ? 'ky' : 'ru');

  const amount = parseAmount(raw);
  const output = useMemo(() => {
    if (amount === null) return null;
    if (mode === 'number') {
      const text = integerToWords(amount, outLang);
      return [{ key: 'number_to_words_out_number', text: text.charAt(0).toLocaleUpperCase('ru-RU') + text.slice(1) }];
    }
    const result = amountToWords(amount, outLang);
    return [
      { key: 'number_to_words_out_words', text: result.words },
      { key: 'number_to_words_out_full', text: result.fullWords },
      { key: 'number_to_words_out_document', text: result.document }
    ];
  }, [amount, mode, outLang]);

  const toggle = (active: boolean) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-slate-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`;

  return (
    <CalculatorShell
      slug="number-to-words"
      base="number_to_words"
      icon={Type}
      gradient="from-slate-700 to-slate-800"
      lastUpdated="2026-09-28"
      faqCount={3}
    >
      <section className="bg-white rounded-xl shadow-sm p-6 sm:p-8" aria-labelledby="ntw-input">
        <h2 id="ntw-input" className="text-xl font-semibold text-gray-900 mb-4">{t('number_to_words_input_title')}</h2>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="ntw-amount">
          {t(mode === 'currency' ? 'number_to_words_amount_label' : 'number_to_words_number_label')}
        </label>
        <input
          id="ntw-amount"
          inputMode="decimal"
          value={raw}
          onChange={e => setRaw(e.target.value)}
          className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
        />
        {amount === null && raw.trim() !== '' && (
          <p className="mt-2 text-sm text-red-600">{t('number_to_words_invalid')}</p>
        )}
        <div className="mt-5 flex flex-wrap gap-6">
          <div role="group" aria-label={t('number_to_words_mode_label')} className="flex gap-2">
            <button type="button" className={toggle(mode === 'currency')} onClick={() => setMode('currency')}>{t('number_to_words_mode_currency')}</button>
            <button type="button" className={toggle(mode === 'number')} onClick={() => setMode('number')}>{t('number_to_words_mode_number')}</button>
          </div>
          <div role="group" aria-label={t('number_to_words_lang_label')} className="flex gap-2">
            <button type="button" className={toggle(outLang === 'ru')} onClick={() => setOutLang('ru')}>Русский</button>
            <button type="button" className={toggle(outLang === 'ky')} onClick={() => setOutLang('ky')}>Кыргызча</button>
          </div>
        </div>
      </section>

      {output && (
        <section className="bg-white rounded-xl shadow-sm p-6 sm:p-8 space-y-5" aria-live="polite">
          {output.map(item => (
            <div key={item.key} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
              <div className="flex items-center justify-between gap-4 mb-1">
                <p className="text-sm text-gray-500">{t(item.key as any)}</p>
                <CopyButton text={item.text} label={t('number_to_words_copy')} doneLabel={t('number_to_words_copied')} />
              </div>
              <p className="text-lg text-gray-900 break-words">{item.text}</p>
            </div>
          ))}
        </section>
      )}
    </CalculatorShell>
  );
};

export default NumberToWordsPage;
