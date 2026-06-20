import React from 'react';
import { ShieldCheck, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface AuthorBylineProps {
  /** ISO date string, e.g. "2026-05-25" */
  lastUpdated?: string;
  /** Reviewer name, defaults to "Calk.KG Editorial Team" */
  reviewedBy?: string;
}

/**
 * Author + review byline at the top of each calculator article.
 *
 * Why this matters:
 * - E-E-A-T signal for Google ranking (Expertise + Authoritativeness)
 * - AI search engines (ChatGPT, Perplexity) prefer cited, attributed content
 * - Quality Rater Guidelines (Sept 2025) explicitly check for author attribution
 *   on YMYL (Your Money / Your Life) pages — financial calculators qualify
 *
 * Renders as:
 *   ✓ Проверено редакцией Calk.KG     📅 Обновлено: 25 мая 2026
 */
export const AuthorByline: React.FC<AuthorBylineProps> = ({
  lastUpdated,
  reviewedBy
}) => {
  const { language } = useLanguage();

  const labels = language === 'ky'
    ? {
        reviewed: 'Текшерилди:',
        editorial: 'Calk.KG редакциясы тарабынан',
        updated: 'Жаңыртылды'
      }
    : {
        reviewed: 'Проверено',
        editorial: 'редакцией Calk.KG',
        updated: 'Обновлено'
      };

  const reviewerName = reviewedBy || labels.editorial;

  // Kyrgyz month names (Chrome ICU has no ky-KG locale → falls back to English).
  // Manual formatter ensures dates render in Kyrgyz on all platforms.
  const KY_MONTHS = [
    'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
    'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    if (language === 'ky') {
      // Kyrgyz style: "23-март 2026-жыл"
      return `${date.getDate()}-${KY_MONTHS[date.getMonth()]} ${date.getFullYear()}-жыл`;
    }
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div
      className="not-prose flex flex-wrap items-center gap-4 mb-6 pb-4 border-b border-gray-200 text-sm text-gray-600"
      itemScope
      itemType="https://schema.org/Person"
    >
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-green-600" aria-hidden="true" />
        <span>
          {labels.reviewed}{' '}
          <span itemProp="name" className="font-medium text-gray-900">
            {reviewerName}
          </span>
        </span>
      </div>

      {lastUpdated && (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" aria-hidden="true" />
          <time dateTime={lastUpdated} itemProp="dateModified">
            {labels.updated}:{' '}
            <span className="text-gray-900">{formatDate(lastUpdated)}</span>
          </time>
        </div>
      )}
    </div>
  );
};

export default AuthorByline;
