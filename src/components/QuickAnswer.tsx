import React from 'react';
import { Lightbulb } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface QuickAnswerProps {
  /** Short, citation-friendly answer (1-3 sentences, 40-80 words) */
  children: React.ReactNode;
}

/**
 * "Quick Answer" / TL;DR block displayed at the top of each calculator article.
 *
 * Why this matters:
 * - AI search engines (Google AI Overviews, ChatGPT, Perplexity) extract these
 *   blocks as direct citations for "How much...", "What is...", "How to..."
 *   queries
 * - Content is rendered with semantic <p> in highlighted box — easy to detect
 *   programmatically as a TL;DR/summary
 * - Aria-label and itemtype hints help crawlers recognize it as a Quick Answer
 *
 * Keep content to 1-3 short sentences, 40-80 words. Lead with the most
 * important fact (e.g. "Net salary in Kyrgyzstan equals gross minus 10%
 * Social Fund minus 10% income tax. For a 30,000 KGS gross salary, you
 * receive 24,300 KGS on hand.")
 */
export const QuickAnswer: React.FC<QuickAnswerProps> = ({ children }) => {
  const { language } = useLanguage();

  const labels = language === 'ky'
    ? { label: 'Кыска жооп' }
    : { label: 'Краткий ответ' };

  return (
    <aside
      role="note"
      aria-label={labels.label}
      className="not-prose my-6 rounded-xl border-l-4 border-yellow-500 bg-yellow-50 p-5 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <Lightbulb className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex-1">
          <h2 className="text-base font-bold text-yellow-900 mb-1 uppercase tracking-wide text-sm">
            {labels.label}
          </h2>
          <div className="text-gray-800 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default QuickAnswer;
