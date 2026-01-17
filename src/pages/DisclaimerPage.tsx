import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Home, Calculator, AlertTriangle, CheckCircle, XCircle, FileText, Mail, BookOpen, Scale } from 'lucide-react';
import SchemaMarkup from '../components/SchemaMarkup';
import HreflangTags from '../components/HreflangTags';
import { generateWebPageSchema, generateBreadcrumbSchema } from '../utils/schemaGenerator';
import { useLanguage } from '../contexts/LanguageContext';

const DisclaimerPage = () => {
  const { t, language, getLocalizedPath } = useLanguage();

  React.useEffect(() => {
    document.title = t('disclaimer_title') + " - Calk.KG";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('disclaimer_description'));
    }
  }, [t]);

  const generateSchemas = () => {
    const currentUrl = language === 'ky' ? "https://calk.kg/ky/disclaimer" : "https://calk.kg/disclaimer";

    const webPageSchema = generateWebPageSchema({
      url: currentUrl,
      title: t('disclaimer_title'),
      description: t('disclaimer_description')
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: "https://calk.kg" },
      { name: t('disclaimer_title'), url: currentUrl }
    ]);

    return [webPageSchema, breadcrumbSchema];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{t('disclaimer_title')} - Calk.KG</title>
        <meta name="description" content={t('disclaimer_description')} />
        <meta property="og:title" content={t('disclaimer_title')} />
        <meta property="og:description" content={t('disclaimer_description')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/disclaimer" : "https://calk.kg/disclaimer"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/disclaimer.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('disclaimer_title')} - Calk.KG`} />
        <meta name="twitter:description" content={t('disclaimer_description')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/disclaimer.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/disclaimer" : "https://calk.kg/disclaimer"} />
      </Helmet>
      <HreflangTags path="/disclaimer" />
      {generateSchemas().map((schema, index) => (
        <SchemaMarkup key={index} schema={schema} />
      ))}

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{t('disclaimer_title')}</h1>
              <p className="text-amber-100 text-lg">{t('disclaimer_subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">

          {/* Intro Section */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="h-6 w-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">{t('disclaimer_intro_title')}</h2>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <p className="text-amber-800 leading-relaxed">{t('disclaimer_intro_text')}</p>
            </div>
          </div>

          {/* Accuracy Section */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Scale className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">{t('disclaimer_accuracy_title')}</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">{t('disclaimer_accuracy_text')}</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <ul className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <li key={i} className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-blue-800">{t(`disclaimer_accuracy_${i}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Not Advice Section */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <XCircle className="h-6 w-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">{t('disclaimer_not_advice_title')}</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">{t('disclaimer_not_advice_text')}</p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <ul className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <li key={i} className="flex items-start space-x-3">
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-red-800">{t(`disclaimer_not_advice_${i}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendations Section */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">{t('disclaimer_recommendations_title')}</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">{t('disclaimer_recommendations_text')}</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <ul className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <li key={i} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-green-800">{t(`disclaimer_recommendations_${i}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Liability Section */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">{t('disclaimer_liability_title')}</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">{t('disclaimer_liability_text')}</p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <ul className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <li key={i} className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-amber-800">{t(`disclaimer_liability_${i}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sources Section */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <BookOpen className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">{t('disclaimer_sources_title')}</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">{t('disclaimer_sources_text')}</p>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <ul className="space-y-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <li key={i} className="flex items-start space-x-3">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-purple-800">{t(`disclaimer_sources_${i}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Update Info */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('disclaimer_update_title')}</h2>
            <p className="text-gray-600 leading-relaxed">{t('disclaimer_update_text')}</p>
          </div>

          {/* Contact Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('disclaimer_contact_title')}</h2>
            <p className="text-gray-600 leading-relaxed mb-4">{t('disclaimer_contact_text')}</p>
            <div className="bg-gray-50 rounded-lg p-6 inline-flex items-center space-x-3">
              <Mail className="h-5 w-5 text-red-600" />
              <a href="mailto:info@calk.kg" className="text-red-600 hover:text-red-700 font-medium">
                info@calk.kg
              </a>
            </div>
          </div>

          {/* Agreement Section */}
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('disclaimer_agreement_title')}</h2>
            <p className="text-gray-700 leading-relaxed">{t('disclaimer_agreement_text')}</p>
          </div>

          {/* Back to Home Button */}
          <div className="mt-12 text-center">
            <Link
              to={getLocalizedPath('/')}
              className="inline-flex items-center space-x-2 bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <Home className="h-5 w-5" />
              <span>{t('back_to_home')}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerPage;
