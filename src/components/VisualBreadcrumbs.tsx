import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useLanguage, removeLanguagePrefix } from '../contexts/LanguageContext';

const getSegmentLabel = (segment: string, language: 'ru' | 'ky'): string => {
  const labels: Record<string, { ru: string; ky: string }> = {
    calculator: { ru: 'Калькуляторы', ky: 'Калькуляторлор' },
    about: { ru: 'О проекте', ky: 'Биз жөнүндө' },
    contact: { ru: 'Контакты', ky: 'Байланыш' },
    'privacy-policy': { ru: 'Конфиденциальность', ky: 'Купуялык саясаты' },
    'terms-of-service': { ru: 'Условия использования', ky: 'Колдонуу шарттары' },
    disclaimer: { ru: 'Отказ от ответственности', ky: 'Жоопкерчиликтен баш тартуу' },
    sitemap: { ru: 'Карта сайта', ky: 'Сайт картасы' },
    salary: { ru: 'Зарплата', ky: 'Айлык акы' },
    'single-tax': { ru: 'Единый налог', ky: 'Бирдиктүү салык' },
    'property-tax': { ru: 'Налог на имущество', ky: 'Мүлк салыгы' },
    'social-fund': { ru: 'Соцфонд', ky: 'Соцфонд' },
    pension: { ru: 'Пенсия', ky: 'Пенсия' },
    loan: { ru: 'Кредит', ky: 'Насыя' },
    mortgage: { ru: 'Ипотека', ky: 'Ипотека' },
    'auto-loan': { ru: 'Автокредит', ky: 'Автонасыя' },
    deposit: { ru: 'Депозит', ky: 'Депозит' },
    customs: { ru: 'Таможня', ky: 'Бажы' },
    electricity: { ru: 'Электроэнергия', ky: 'Электр энергиясы' },
    water: { ru: 'Вода', ky: 'Суу' },
    heating: { ru: 'Отопление', ky: 'Жылытуу' },
    gas: { ru: 'Газ', ky: 'Газ' },
    alimony: { ru: 'Алименты', ky: 'Алимент' },
    'family-benefit': { ru: 'Пособия семье', ky: 'Үй-бүлө жөлөкпулу' },
    patent: { ru: 'Патент', ky: 'Патент' },
    'traffic-fines': { ru: 'Штрафы ПДД', ky: 'ЖКЭ айыптары' },
    zakat: { ru: 'Закят', ky: 'Закят' },
    'taxi-tax': { ru: 'Налог такси', ky: 'Такси салыгы' },
    passport: { ru: 'Паспорт', ky: 'Паспорт' },
    'tourist-fee': { ru: 'Туристический сбор', ky: 'Туристтик жыйым' },
    calorie: { ru: 'Калории', ky: 'Калория' },
    'sewing-cost': { ru: 'Себестоимость шитья', ky: 'Тигүү өздүк наркы' },
    housing: { ru: 'Жилищный калькулятор', ky: 'Турак жай калькулятору' },
    wedding: { ru: 'Свадебный бюджет', ky: 'Той бюджети' },
    'currency-exchange': { ru: 'Обмен валют', ky: 'Валюта алмаштыруу' },
    'money-transfer': { ru: 'Денежные переводы', ky: 'Акча которуу' },
    'mobile-tariffs': { ru: 'Мобильные тарифы', ky: 'Мобилдик тарифтер' },
    'crop-yield': { ru: 'Урожайность', ky: 'Түшүмдүүлүк' },
    rental: { ru: 'Аренда жилья', ky: 'Ижара' },
    'sick-leave': { ru: 'Больничный', ky: 'Оору баракчасы' },
    fuel: { ru: 'Расход топлива', ky: 'Отун чыгымы' },
    construction: { ru: 'Строительство', ky: 'Курулуш' },
    scholarship: { ru: 'Стипендия', ky: 'Стипендия' },
  };

  if (labels[segment]) {
    return labels[segment][language];
  }

  return segment
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const VisualBreadcrumbs = () => {
  const location = useLocation();
  const { language, getLocalizedPath } = useLanguage();
  const cleanPath = removeLanguagePrefix(location.pathname);

  if (cleanPath === '/' || cleanPath === '') {
    return null;
  }

  const parts = cleanPath.split('/').filter(Boolean);
  const homeLabel = language === 'ky' ? 'Башкы бет' : 'Главная';

  return (
    <nav aria-label="Breadcrumb" className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-sm text-gray-600 sm:px-6 lg:px-8">
        <Link to={getLocalizedPath('/')} className="hover:text-red-600">
          {homeLabel}
        </Link>
        {parts.map((part, index) => {
          const isLast = index === parts.length - 1;
          return (
            <React.Fragment key={`${part}-${index}`}>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              {isLast ? <span className="font-medium text-gray-900">{getSegmentLabel(part, language)}</span> : <span>{getSegmentLabel(part, language)}</span>}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};

export default VisualBreadcrumbs;
