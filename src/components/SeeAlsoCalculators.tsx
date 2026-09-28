import { Link, useLocation } from 'react-router-dom';
import { useLanguage, removeLanguagePrefix } from '../contexts/LanguageContext';
import { calculators } from '../data/calculators';
import { calculatorRoutes, calculatorIdByPath } from '../data/calculatorRoutes';

const MAX_LINKS = 6;

// Добор до MAX_LINKS, когда в категории мало калькуляторов.
const POPULAR_IDS = ['customs-calculator', 'mortgage-calculator', 'salary-calculator', 'alimony-calculator'];

/**
 * «Похожие калькуляторы» под каждым калькулятором — обычные <a>, которые видны
 * в пререндере. Без них на малопосещаемые страницы вели только ссылки из
 * sitemap.xml, и Google годами держал их в «Обнаружена, не проиндексирована».
 * Калькуляторы своей категории берутся по кругу ПОСЛЕ текущего, чтобы ссылки
 * распределялись по категории равномерно, а не доставались первым в списке.
 */
const SeeAlsoCalculators = () => {
  const { t, language, getLocalizedPath } = useLanguage();
  const location = useLocation();
  const currentId = calculatorIdByPath(removeLanguagePrefix(location.pathname));
  const current = calculators.find(calc => calc.id === currentId);
  if (!current) return null;

  const sameCategory = calculators.filter(calc => calc.category === current.category);
  const start = sameCategory.indexOf(current);
  const picked = [...sameCategory.slice(start + 1), ...sameCategory.slice(0, start)].slice(0, MAX_LINKS);
  for (const id of POPULAR_IDS) {
    if (picked.length >= MAX_LINKS) break;
    const calc = calculators.find(c => c.id === id);
    if (calc && calc !== current && !picked.includes(calc)) picked.push(calc);
  }

  return (
    <nav aria-labelledby="see-also-title" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <h2 id="see-also-title" className="text-xl font-bold text-gray-900 mb-4">
        {t('see_also_calculators_title')}
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {picked.map(calc => {
          const Icon = calc.icon;
          return (
            <li key={calc.id}>
              <Link
                to={getLocalizedPath(calculatorRoutes[calc.id])}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-red-200 hover:shadow-md transition-all group"
              >
                <span className={`p-2 rounded-lg ${calc.bgColor}`}>
                  <Icon className={`h-5 w-5 ${calc.iconColor}`} aria-hidden="true" />
                </span>
                <span className="font-medium text-gray-800 group-hover:text-red-600 transition-colors">
                  {language === 'ky' ? calc.titleKy : calc.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SeeAlsoCalculators;
