import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, Home, Search, ArrowLeft, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const NotFoundPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>{t('notfound_title')}</title>
        <meta name="description" content={t('notfound_description')} />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-2 rounded-lg">
                <Calculator className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">Calk.KG</span>
            </Link>
            <Link
              to="/"
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>{t('nav_home')}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">{t('notfound_heading')}</h2>
            <p className="text-lg text-gray-600 mb-8">
              {t('notfound_text')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/"
              className="inline-flex items-center justify-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <Home className="h-5 w-5" />
              <span>{t('to_home')}</span>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center space-x-2 bg-white text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium border border-gray-300"
            >
              <Search className="h-5 w-5" />
              <span>{t('find_calculator')}</span>
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8 text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('popular_calculators')}:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/calculator/salary"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200"
              >
                <div className="bg-red-50 p-2 rounded-lg">
                  <Calculator className="h-4 w-4 text-red-600" />
                </div>
                <span className="text-gray-700 font-medium">{t('salary_calculator')}</span>
              </Link>
              <Link
                to="/calculator/loan"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200"
              >
                <div className="bg-green-50 p-2 rounded-lg">
                  <Calculator className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-gray-700 font-medium">{t('loan_calculator')}</span>
              </Link>
              <Link
                to="/calculator/mortgage"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200"
              >
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Calculator className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium">{t('mortgage_calculator')}</span>
              </Link>
              <Link
                to="/calculator/single-tax"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200"
              >
                <div className="bg-yellow-50 p-2 rounded-lg">
                  <Calculator className="h-4 w-4 text-yellow-600" />
                </div>
                <span className="text-gray-700 font-medium">{t('single_tax_calculator')}</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600 text-sm">
            <p>&copy; {new Date().getFullYear()} Calk.KG. {t('all_rights_reserved')}.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NotFoundPage;
