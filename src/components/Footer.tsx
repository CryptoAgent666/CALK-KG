import React from 'react';
import { Calculator, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t, getLocalizedPath } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1">
            <Link to={getLocalizedPath('/')} className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-2 rounded-lg">
                <Calculator className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">{t('site_name')}</span>
            </Link>
            <p className="text-gray-400 leading-relaxed mb-4">
              {t('footer_description')}
            </p>
            <a 
              href="https://play.google.com/store/apps/details?id=kg.calk.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block transition-transform hover:scale-105"
              aria-label="Download on Google Play"
            >
              <svg viewBox="0 0 135 40" className="h-12 w-auto">
                <rect width="135" height="40" rx="5" fill="#000"/>
                <path d="M47.4 10.2c0 .8-.2 1.5-.7 2-.6.6-1.3.9-2.2.9-.9 0-1.6-.3-2.2-.9-.6-.6-.9-1.3-.9-2.2s.3-1.6.9-2.2c.6-.6 1.3-.9 2.2-.9.4 0 .8.1 1.2.3.4.2.7.4.9.7l-.5.5c-.4-.5-.9-.7-1.6-.7-.6 0-1.2.2-1.6.7-.5.4-.7 1-.7 1.7s.2 1.3.7 1.7c.5.5 1 .7 1.6.7.7 0 1.2-.2 1.7-.7.3-.3.5-.7.5-1.2h-2.2v-.8h2.9v.4z" fill="#fff"/>
                <path d="M52 7.7h-2.7v1.9h2.5v.7h-2.5v1.9H52v.8h-3.5V7h3.5v.7zM55.3 13h-.8V7.7h-1.7V7H57v.7h-1.7V13zM59.9 13V7h.8v6h-.8zM65.1 13h-.8V7.7h-1.7V7h4.1v.7h-1.7V13zM73.6 12.2c-.6.6-1.3.9-2.2.9-.9 0-1.6-.3-2.2-.9-.6-.6-.9-1.3-.9-2.2s.3-1.6.9-2.2c.6-.6 1.3-.9 2.2-.9.9 0 1.6.3 2.2.9.6.6.9 1.3.9 2.2s-.3 1.6-.9 2.2zm-3.8-.5c.4.5 1 .7 1.6.7.6 0 1.2-.2 1.6-.7.4-.4.7-1 .7-1.7s-.2-1.3-.7-1.7c-.4-.5-1-.7-1.6-.7-.6 0-1.2.2-1.6.7-.4.4-.7 1-.7 1.7s.2 1.3.7 1.7zM75.6 13V7h.9l2.9 4.7V7h.8v6h-.8l-3.1-4.9V13h-.7z" fill="#fff"/>
                <path d="M68.1 21.8c-2.4 0-4.3 1.8-4.3 4.3 0 2.4 1.9 4.3 4.3 4.3s4.3-1.8 4.3-4.3c0-2.6-1.9-4.3-4.3-4.3zm0 6.8c-1.3 0-2.4-1.1-2.4-2.6s1.1-2.6 2.4-2.6 2.4 1 2.4 2.6c0 1.5-1.1 2.6-2.4 2.6zm-9.3-6.8c-2.4 0-4.3 1.8-4.3 4.3 0 2.4 1.9 4.3 4.3 4.3s4.3-1.8 4.3-4.3c0-2.6-1.9-4.3-4.3-4.3zm0 6.8c-1.3 0-2.4-1.1-2.4-2.6s1.1-2.6 2.4-2.6 2.4 1 2.4 2.6c0 1.5-1.1 2.6-2.4 2.6zm-11.1-5.5v1.8H52c-.1 1-.5 1.8-1 2.3-.6.6-1.6 1.3-3.3 1.3-2.7 0-4.7-2.1-4.7-4.8s2.1-4.8 4.7-4.8c1.4 0 2.5.6 3.3 1.3l1.3-1.3c-1.1-1-2.5-1.8-4.5-1.8-3.6 0-6.7 3-6.7 6.6s3.1 6.6 6.7 6.6c2 0 3.4-.6 4.6-1.9 1.2-1.2 1.6-2.9 1.6-4.2 0-.4 0-.8-.1-1.1h-6.2zm45.4 1.4c-.4-1-1.4-2.7-3.6-2.7s-4 1.7-4 4.3c0 2.4 1.8 4.3 4.2 4.3 1.9 0 3.1-1.2 3.5-1.9l-1.4-1c-.5.7-1.1 1.2-2.1 1.2s-1.6-.5-2.1-1.4l5.7-2.4-.2-.4zm-5.8 1.4c0-1.6 1.3-2.5 2.2-2.5.7 0 1.4.4 1.6.9l-3.8 1.6zM82.6 30h1.9V17.5h-1.9V30zm-3-7.3c-.5-.5-1.3-1-2.3-1-2.1 0-4.1 1.9-4.1 4.3s1.9 4.2 4.1 4.2c1 0 1.8-.5 2.2-1h.1v.6c0 1.6-.9 2.5-2.3 2.5-1.1 0-1.9-.8-2.1-1.5l-1.6.7c.5 1.1 1.7 2.5 3.8 2.5 2.2 0 4-1.3 4-4.4V22h-1.8v.7zm-2.2 5.9c-1.3 0-2.4-1.1-2.4-2.6s1.1-2.6 2.4-2.6 2.3 1.1 2.3 2.6-1 2.6-2.3 2.6zm24.4-11.1h-4.5V30h1.9v-4.7h2.6c2.1 0 4.1-1.5 4.1-3.9s-2-3.9-4.1-3.9zm.1 6.1h-2.7v-4.3h2.7c1.4 0 2.2 1.2 2.2 2.1-.1 1.1-.9 2.2-2.2 2.2zm11.5-1.8c-1.4 0-2.8.6-3.3 1.9l1.7.7c.4-.7 1-.9 1.7-.9 1 0 1.9.6 2 1.6v.1c-.3-.2-1.1-.5-1.9-.5-1.8 0-3.6 1-3.6 2.8 0 1.7 1.5 2.8 3.1 2.8 1.3 0 1.9-.6 2.4-1.2h.1v1h1.8v-4.8c-.2-2.2-1.9-3.5-4-3.5zm-.2 6.9c-.6 0-1.5-.3-1.5-1.1 0-1 1.1-1.3 2-1.3.8 0 1.2.2 1.7.4-.2 1.2-1.2 2-2.2 2zm10.5-6.6l-2.1 5.4h-.1l-2.2-5.4h-2l3.3 7.6-1.9 4.2h1.9l5.1-11.8h-2zm-16.8 8h1.9V17.5h-1.9V30z" fill="#fff"/>
                <path d="M10.4 7.5c-.3.3-.5.8-.5 1.4V31c0 .6.2 1.1.5 1.4l.1.1 13.2-13.2v-.2L10.4 7.5z" fill="#00d9ff"/>
                <path d="M28 23.7l-4.4-4.4v-.3l4.4-4.4.1.1 5.2 3c1.5.8 1.5 2.2 0 3l-5.3 3z" fill="#ffcf00"/>
                <path d="M28.1 23.6L23.6 19 10.4 32.4c.5.5 1.3.6 2.2.1l15.5-8.9" fill="#ff3a56"/>
                <path d="M28.1 14.4L12.6 5.6c-.9-.5-1.7-.4-2.2.1L23.6 19l4.5-4.6z" fill="#00f076"/>
              </svg>
            </a>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer_quick_links')}</h3>
            <ul className="space-y-2">
              <li><Link to={getLocalizedPath('/')} onClick={scrollToTop} className="text-gray-400 hover:text-white transition-colors hover:underline">{t('footer_all_calculators')}</Link></li>
              <li><Link to={`${getLocalizedPath('/')}?category=finance`} onClick={scrollToTop} className="text-gray-400 hover:text-white transition-colors hover:underline">{t('footer_financial_calculators')}</Link></li>
              <li><Link to={`${getLocalizedPath('/')}?category=auto`} onClick={scrollToTop} className="text-gray-400 hover:text-white transition-colors hover:underline">{t('footer_auto_calculators')}</Link></li>
              <li><Link to={`${getLocalizedPath('/')}?category=utilities`} onClick={scrollToTop} className="text-gray-400 hover:text-white transition-colors hover:underline">{t('footer_utilities_calculators')}</Link></li>
              <li><Link to={getLocalizedPath('/sitemap')} className="text-gray-400 hover:text-white transition-colors hover:underline">{t('footer_sitemap')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer_info')}</h3>
            <ul className="space-y-2">
              <li><Link to={getLocalizedPath('/privacy-policy')} className="text-gray-400 hover:text-white transition-colors">{t('footer_privacy')}</Link></li>
              <li><Link to={getLocalizedPath('/terms-of-service')} className="text-gray-400 hover:text-white transition-colors">{t('footer_terms')}</Link></li>
              <li><Link to={getLocalizedPath('/disclaimer')} className="text-gray-400 hover:text-white transition-colors">{t('footer_disclaimer')}</Link></li>
              <li><Link to={getLocalizedPath('/about')} className="text-gray-400 hover:text-white transition-colors">{t('footer_about')}</Link></li>
              <li><Link to={getLocalizedPath('/contact')} className="text-gray-400 hover:text-white transition-colors">{t('footer_contacts')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer_contacts')}</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-amber-400" />
                <span className="text-gray-400">info@calk.kg</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-amber-400" />
                <span className="text-gray-400">{t('footer_address')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              {t('footer_copyright')}
            </p>
            <div className="flex space-x-6">
              <Link to={getLocalizedPath('/privacy-policy')} className="text-gray-400 hover:text-white transition-colors">
                {t('footer_privacy')}
              </Link>
              <Link to={getLocalizedPath('/terms-of-service')} className="text-gray-400 hover:text-white transition-colors">
                {t('footer_terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
