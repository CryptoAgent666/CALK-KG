import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import AuthorByline from './AuthorByline';
import GovSources from './GovSources';

interface CalculatorArticleProps {
  children: React.ReactNode;
  className?: string;
  /** ISO date string for last updated, e.g. "2026-03-23" */
  lastUpdated?: string;
  /** Translation key for the "updated" label, falls back to generic */
  updatedLabelKey?: string;
  /** Calculator slug — enables GovSources and HowTo schema integration */
  slug?: string;
  /** Quick answer (TL;DR) — short citation-friendly summary, rendered at top */
  quickAnswer?: React.ReactNode;
}

/**
 * Универсальный компонент для отображения статей/FAQ под калькуляторами
 * Обеспечивает единый стиль и SEO-оптимизацию контента
 *
 * Auto-adds (when slug is provided):
 *   - AuthorByline at top (E-E-A-T signal)
 *   - GovSources at bottom (authoritative references)
 *
 * Auto-adds (when quickAnswer is provided):
 *   - QuickAnswer block at very top (AI citation)
 */
export const CalculatorArticle: React.FC<CalculatorArticleProps> = ({
  children,
  className = '',
  lastUpdated,
  updatedLabelKey,
  slug,
  quickAnswer
}) => {
  const { language, t } = useLanguage();

  // Kyrgyz month names — manual formatter (Chrome ICU has no ky-KG locale).
  const KY_MONTHS = [
    'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
    'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    if (language === 'ky') {
      return `${date.getDate()}-${KY_MONTHS[date.getMonth()]} ${date.getFullYear()}-жыл`;
    }
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const updatedLabel = updatedLabelKey ? t(updatedLabelKey) : (language === 'ky' ? 'Жаңыртылды' : 'Обновлено');

  return (
    <article className={`max-w-4xl mx-auto mt-12 px-4 ${className}`}>
      <div className="prose prose-gray max-w-none">
        {/* Author + last updated byline (E-E-A-T) */}
        <AuthorByline lastUpdated={lastUpdated} />

        {/* Quick Answer / TL;DR block (AI citation) */}
        {quickAnswer && (
          <aside
            role="note"
            aria-label={language === 'ky' ? 'Кыска жооп' : 'Краткий ответ'}
            className="not-prose my-6 rounded-xl border-l-4 border-yellow-500 bg-yellow-50 p-5 shadow-sm"
          >
            <h2 className="text-sm font-bold text-yellow-900 mb-2 uppercase tracking-wide">
              {language === 'ky' ? 'Кыска жооп' : 'Краткий ответ'}
            </h2>
            <div className="text-gray-800 leading-relaxed">{quickAnswer}</div>
          </aside>
        )}

        {children}

        {/* Government sources — авторитетные ссылки */}
        {slug && <GovSources slug={slug} />}
      </div>
      {lastUpdated && (
        <time dateTime={lastUpdated} className="sr-only">{updatedLabel}: {formatDate(lastUpdated)}</time>
      )}
    </article>
  );
};

interface ArticleSectionProps {
  title?: string;
  titleKey?: string;
  children: React.ReactNode;
  id?: string;
}

export const ArticleSection: React.FC<ArticleSectionProps> = ({ title, titleKey, children, id }) => {
  const { t } = useLanguage();
  const displayTitle = titleKey ? t(titleKey) : title;
  
  return (
    <section id={id} className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{displayTitle}</h2>
      <div className="text-gray-700 space-y-4">
        {children}
      </div>
    </section>
  );
};

interface ArticleSubsectionProps {
  title: string;
  children: React.ReactNode;
}

export const ArticleSubsection: React.FC<ArticleSubsectionProps> = ({ title, children }) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="text-gray-700">
        {children}
      </div>
    </div>
  );
};

interface FAQItemProps {
  question?: string;
  questionKey?: string;
  answer?: string | React.ReactNode;
  answerKey?: string;
}

export const FAQItem: React.FC<FAQItemProps> = ({ question, questionKey, answer, answerKey }) => {
  const { t } = useLanguage();
  const displayQuestion = questionKey ? t(questionKey) : question;
  const displayAnswer = answerKey ? t(answerKey) : answer;
  
  return (
    <div className="mb-6 pb-6 border-b border-gray-200 last:border-b-0">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{displayQuestion}</h3>
      <div className="text-gray-700">
        {typeof displayAnswer === 'string' ? <p>{displayAnswer}</p> : displayAnswer}
      </div>
    </div>
  );
};
