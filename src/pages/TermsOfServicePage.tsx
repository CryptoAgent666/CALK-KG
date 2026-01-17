import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Home, Calculator, Scale, FileText, AlertTriangle, CheckCircle, Mail } from 'lucide-react';
import SchemaMarkup from '../components/SchemaMarkup';
import HreflangTags from '../components/HreflangTags';
import { generateWebPageSchema, generateBreadcrumbSchema } from '../utils/schemaGenerator';
import { useLanguage } from '../contexts/LanguageContext';

const TermsOfServicePage = () => {
  const { t, language, getLocalizedPath } = useLanguage();

  React.useEffect(() => {
    document.title = t('footer_terms') + " - Calk.KG";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('terms_of_service_description'));
    }
  }, [t]);

  const generateSchemas = () => {
    const currentUrl = "https://calk.kg/terms-of-service";

    const webPageSchema = generateWebPageSchema({
      url: currentUrl,
      title: t('footer_terms'),
      description: t('terms_of_service_description')
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: "https://calk.kg" },
      { name: t('footer_terms'), url: currentUrl }
    ]);

    return [webPageSchema, breadcrumbSchema];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{t('footer_terms')} - Calk.KG</title>
        <meta name="description" content={t('terms_of_service_description')} />
        <meta property="og:title" content={t('footer_terms')} />
        <meta property="og:description" content={t('terms_of_service_description')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/terms-of-service" : "https://calk.kg/terms-of-service"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/terms-of-service.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('footer_terms')} - Calk.KG`} />
        <meta name="twitter:description" content={t('terms_of_service_description')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/terms-of-service.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/terms-of-service" : "https://calk.kg/terms-of-service"} />
      </Helmet>
      <HreflangTags path="/terms-of-service" />
      {generateSchemas().map((schema, index) => (
        <SchemaMarkup key={index} schema={schema} />
      ))}

      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>{t('back')}</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-red-600 to-red-700 p-2 rounded-lg">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">Calk.KG</span>
              </Link>
            </div>
            <Link
              to="/"
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>{t('home_button')}</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Scale className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{t('tos_title')}</h1>
              <p className="text-purple-100 text-lg">{t('tos_subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">

          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">{t('tos_general_title')}</h2>
            </div>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed mb-4">{t('tos_general_intro')}</p>
              <p className="text-gray-600 leading-relaxed mb-4">{t('tos_general_scope')}</p>
              <p className="text-gray-600 leading-relaxed"><strong>{t('tos_effective_date')}</strong></p>
            </div>
          </div>

          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">{t('tos_acceptance_title')}</h2>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <p className="text-green-800 leading-relaxed">{t('tos_acceptance_intro')}</p>
              <ul className="list-disc list-inside mt-4 space-y-2 text-green-800">
                {[1, 2, 3, 4].map(i => (
                  <li key={i}>{t(`tos_acceptance_${i}`)}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('tos_service_title')}</h2>
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">{t('tos_service_intro')}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <li key={i} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span className="text-gray-600">{t(`tos_service_${i}`)}</span>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-2">
                  {[4, 5, 6].map(i => (
                    <li key={i} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span className="text-gray-600">{t(`tos_service_${i}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('tos_usage_title')}</h2>
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-green-900 mb-3">{t('tos_allowed_title')}</h3>
                <ul className="list-disc list-inside space-y-2 text-green-800">
                  {[1, 2, 3, 4].map(i => (
                    <li key={i}>{t(`tos_allowed_${i}`)}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="font-semibold text-red-900 mb-3">{t('tos_prohibited_title')}</h3>
                <ul className="list-disc list-inside space-y-2 text-red-800">
                  {[1, 2, 3, 4, 5].map(i => (
                    <li key={i}>{t(`tos_prohibited_${i}`)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
              <h2 className="text-2xl font-bold text-gray-900">{t('tos_disclaimer_title')}</h2>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <div className="space-y-4">
                <p className="text-amber-800 leading-relaxed"><strong>{t('tos_disclaimer_notice')}</strong></p>
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-start space-x-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-amber-800"><strong>{t(`tos_disclaimer_${i}`)}</strong></p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('tos_liability_title')}</h2>
            <p className="text-gray-600 leading-relaxed mb-4">{t('tos_liability_intro')}</p>
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></span>
                  <p className="text-gray-600">{t(`tos_liability_${i}`)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('tos_ip_title')}</h2>
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">{t('tos_ip_intro')}</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-3">{t('tos_ip_allowed_title')}</h4>
                <ul className="list-disc list-inside space-y-2 text-blue-800">
                  {[1, 2, 3].map(i => (
                    <li key={i}>{t(`tos_ip_allowed_${i}`)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('tos_recommendations_title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">{t('tos_rec_accuracy_title')}</h3>
                <ul className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-gray-600">{t(`tos_rec_accuracy_${i}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">{t('tos_rec_legal_title')}</h3>
                <ul className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-gray-600">{t(`tos_rec_legal_${i}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('tos_availability_title')}</h2>
            <p className="text-gray-600 leading-relaxed mb-4">{t('tos_availability_intro')}</p>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-gray-500 rounded-full mt-2 flex-shrink-0"></span>
                  <p className="text-gray-600">{t(`tos_availability_${i}`)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('tos_updates_title')}</h2>
            <p className="text-gray-600 leading-relaxed mb-4">{t('tos_updates_intro')}</p>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-600">{t(`tos_updates_${i}`)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('tos_contact_title')}</h2>
            <p className="text-gray-600 leading-relaxed mb-6">{t('tos_contact_intro')}</p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">{t('tos_contact_info_title')}</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <span className="text-gray-700">{t('tos_contact_email')}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">{t('tos_contact_response_title')}</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>{t('tos_contact_response_1')}</li>
                    <li>{t('tos_contact_response_2')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('tos_law_title')}</h2>
            <p className="text-gray-600 leading-relaxed">{t('tos_law_text')}</p>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/"
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

export default TermsOfServicePage;
