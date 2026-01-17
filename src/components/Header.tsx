import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Menu, X, Home, Info, DollarSign, Car, Building2, Zap, MoreHorizontal, Wallet, Lightbulb, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { categories } from '../data/categories';

// Иконки для категорий
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  finance: DollarSign,
  auto: Car,
  construction: Building2,
  utilities: Zap,
  other: MoreHorizontal,
};

const Header = () => {
  const { t, getLocalizedPath } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={getLocalizedPath('/')} className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-2 rounded-lg">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">{t('site_name')}</span>
              <span className="text-sm text-gray-500 block -mt-1">{t('site_tagline')}</span>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center space-x-8">
            <Link to={getLocalizedPath('/')} className="text-gray-700 hover:text-red-600 transition-colors font-medium">
              {t('nav_home')}
            </Link>

            {categories
              .filter(category => category.id !== 'all')
              .map((category) => (
                <Link
                  key={category.id}
                  to={`${getLocalizedPath('/')}?category=${category.id}`}
                  className="text-gray-700 hover:text-red-600 transition-colors font-medium"
                >
                  {t(`nav_${category.id}` as any) || category.name}
                </Link>
              ))}

            <Link to={getLocalizedPath('/about')} className="text-gray-700 hover:text-red-600 transition-colors font-medium">
              {t('nav_about')}
            </Link>

            <LanguageSelector />
          </nav>

          <div className="xl:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-red-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Затемнение фона при открытом меню */}
        <div 
          className={`
            xl:hidden fixed inset-0 bg-black/50 z-40
            transition-opacity duration-300
            ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
          `}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Мобильное меню */}
        <div className={`
          xl:hidden fixed inset-y-0 right-0 w-full max-w-sm bg-white z-50 shadow-2xl
          transition-transform duration-300 ease-out
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          {/* Шапка меню */}
          <div className="flex justify-between items-center h-16 px-4 border-b border-gray-100 bg-gradient-to-r from-red-600 to-red-700">
            <Link
              to={getLocalizedPath('/')}
              className="flex items-center space-x-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="bg-white/20 p-2 rounded-lg">
                <Calculator className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">{t('site_name')}</span>
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-3 -mr-2 rounded-lg hover:bg-white/10"
              aria-label={t('close_menu')}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Языковой переключатель вверху */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <LanguageSelector />
          </div>

          {/* Контент меню со скроллом */}
          <div className="overflow-y-auto h-[calc(100vh-7.5rem)] px-4 py-6">
            {/* Основная навигация */}
            <nav className="space-y-1">
              <Link
                to={getLocalizedPath('/')}
                className="flex items-center space-x-4 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all py-4 px-3 rounded-xl text-base font-medium group"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-11 h-11 bg-blue-100 group-hover:bg-blue-200 rounded-xl flex items-center justify-center transition-colors">
                  <Home className="h-5 w-5 text-blue-600" />
                </div>
                <span>{t('nav_home')}</span>
              </Link>
              <Link
                to={getLocalizedPath('/about')}
                className="flex items-center space-x-4 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all py-4 px-3 rounded-xl text-base font-medium group"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-11 h-11 bg-purple-100 group-hover:bg-purple-200 rounded-xl flex items-center justify-center transition-colors">
                  <Info className="h-5 w-5 text-purple-600" />
                </div>
                <span>{t('nav_about')}</span>
              </Link>
            </nav>

            {/* Разделитель */}
            <div className="my-6 border-t border-gray-200" />

            {/* Категории */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                {t('category_all')}
              </h3>
              <div className="space-y-1">
                {categories
                  .filter(category => category.id !== 'all')
                  .map((category) => {
                    const IconComponent = categoryIcons[category.id] || Calculator;
                    const colorMap: Record<string, { bg: string; icon: string; hoverBg: string }> = {
                      finance: { bg: 'bg-green-100', icon: 'text-green-600', hoverBg: 'group-hover:bg-green-200' },
                      auto: { bg: 'bg-blue-100', icon: 'text-blue-600', hoverBg: 'group-hover:bg-blue-200' },
                      construction: { bg: 'bg-orange-100', icon: 'text-orange-600', hoverBg: 'group-hover:bg-orange-200' },
                      utilities: { bg: 'bg-yellow-100', icon: 'text-yellow-600', hoverBg: 'group-hover:bg-yellow-200' },
                      other: { bg: 'bg-gray-100', icon: 'text-gray-600', hoverBg: 'group-hover:bg-gray-200' },
                    };
                    const colors = colorMap[category.id] || colorMap.other;
                    
                    return (
                      <Link
                        key={category.id}
                        to={`${getLocalizedPath('/')}?category=${category.id}`}
                        className="flex items-center space-x-4 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all py-3 px-3 rounded-xl group"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className={`w-10 h-10 ${colors.bg} ${colors.hoverBg} rounded-xl flex items-center justify-center transition-colors`}>
                          <IconComponent className={`h-5 w-5 ${colors.icon}`} />
                        </div>
                        <span className="font-medium">{t(`nav_${category.id}` as any) || category.name}</span>
                      </Link>
                    );
                  })}
              </div>
            </div>

            {/* Разделитель */}
            <div className="my-6 border-t border-gray-200" />

            {/* Быстрые ссылки */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                {t('footer_quick_links')}
              </h3>
              <div className="space-y-1">
                <Link
                  to={getLocalizedPath('/calculator/salary')}
                  className="flex items-center space-x-4 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all py-3 px-3 rounded-xl group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-10 h-10 bg-emerald-100 group-hover:bg-emerald-200 rounded-xl flex items-center justify-center transition-colors">
                    <Wallet className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="font-medium">{t('calculator_salary')}</span>
                </Link>
                <Link
                  to={getLocalizedPath('/calculator/customs')}
                  className="flex items-center space-x-4 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all py-3 px-3 rounded-xl group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-10 h-10 bg-red-100 group-hover:bg-red-200 rounded-xl flex items-center justify-center transition-colors">
                    <FileText className="h-5 w-5 text-red-600" />
                  </div>
                  <span className="font-medium">{t('calculator_customs')}</span>
                </Link>
                <Link
                  to={getLocalizedPath('/calculator/electricity')}
                  className="flex items-center space-x-4 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all py-3 px-3 rounded-xl group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-10 h-10 bg-amber-100 group-hover:bg-amber-200 rounded-xl flex items-center justify-center transition-colors">
                    <Lightbulb className="h-5 w-5 text-amber-600" />
                  </div>
                  <span className="font-medium">{t('calculator_electricity')}</span>
                </Link>
              </div>
            </div>

            {/* Нижний отступ для безопасной зоны на iOS */}
            <div className="h-8" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
