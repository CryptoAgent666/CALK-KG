import React from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Hero = ({ searchTerm, setSearchTerm }: HeroProps) => {
  const { t } = useLanguage();
  
  return (
    <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {t('hero_title')}
            <span className="block text-red-200">{t('hero_subtitle')}</span>
          </h1>
          <p className="text-xl md:text-2xl text-red-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t('hero_description')}
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder={t('search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 bg-white/95 backdrop-blur-sm border-0 focus:ring-4 focus:ring-red-300/50 focus:outline-none shadow-xl text-lg placeholder-gray-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;