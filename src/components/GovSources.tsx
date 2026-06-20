import React from 'react';
import { ExternalLink, BookOpen } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getCalculatorSources } from '../data/govSources';

interface GovSourcesProps {
  /** Calculator slug (e.g. "salary", "loan") */
  slug: string;
}

/**
 * Lists authoritative Kyrgyz government sources for a given calculator.
 *
 * Why this matters:
 * - E-E-A-T signal (Expertise + Authoritativeness + Trust)
 * - YMYL pages (Your Money / Your Life) — Google Quality Rater Guidelines
 *   explicitly require verifiable sources for financial/tax/legal content
 * - AI search engines (ChatGPT, Perplexity, Google AI Overviews) preferentially
 *   cite sources that themselves cite authoritative gov references
 *
 * Renders as a labeled list with external-link icons. All links open in a
 * new tab with rel="noopener noreferrer" for security.
 */
export const GovSources: React.FC<GovSourcesProps> = ({ slug }) => {
  const { language } = useLanguage();
  const sources = getCalculatorSources(slug);

  if (sources.length === 0) return null;

  const labels = language === 'ky'
    ? {
        title: 'Расмий булактар',
        description: 'Бул калькулятор төмөнкү ишенимдүү булактарга негизделет:'
      }
    : {
        title: 'Официальные источники',
        description: 'Данный калькулятор основан на следующих авторитетных источниках:'
      };

  return (
    <section
      className="not-prose my-8 rounded-xl border border-blue-200 bg-blue-50/50 p-6"
      aria-labelledby="gov-sources-heading"
    >
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="h-5 w-5 text-blue-700" aria-hidden="true" />
        <h2 id="gov-sources-heading" className="text-base font-bold text-blue-900 m-0">
          {labels.title}
        </h2>
      </div>
      <p className="text-sm text-gray-700 mb-4">{labels.description}</p>
      <ul className="space-y-2 list-none p-0">
        {sources.map((source) => (
          <li key={source.url} className="m-0">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer external"
              className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 hover:underline font-medium"
            >
              <ExternalLink className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span>{source.name[language === 'ky' ? 'ky' : 'ru']}</span>
              {source.description && (
                <span className="text-gray-600 font-normal text-sm">
                  — {source.description[language === 'ky' ? 'ky' : 'ru']}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default GovSources;
