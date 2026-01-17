import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Home, Calculator, Shield, Eye, Lock, Mail } from 'lucide-react';
import SchemaMarkup from '../components/SchemaMarkup';
import HreflangTags from '../components/HreflangTags';
import { generateWebPageSchema, generateBreadcrumbSchema } from '../utils/schemaGenerator';
import { useLanguage } from '../contexts/LanguageContext';

const PrivacyPolicyPage = () => {
  const { t, language, getLocalizedPath } = useLanguage();

  React.useEffect(() => {
    document.title = t('footer_privacy') + " - Calk.KG";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('privacy_policy_description'));
    }
  }, [t]);

  const generateSchemas = () => {
    const currentUrl = "https://calk.kg/privacy-policy";

    const webPageSchema = generateWebPageSchema({
      url: currentUrl,
      title: t('footer_privacy'),
      description: t('privacy_policy_description')
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: "https://calk.kg" },
      { name: t('footer_privacy'), url: currentUrl }
    ]);

    return [webPageSchema, breadcrumbSchema];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{t('footer_privacy')} - Calk.KG</title>
        <meta name="description" content={t('privacy_policy_description')} />
        <meta property="og:title" content={t('footer_privacy')} />
        <meta property="og:description" content={t('privacy_policy_description')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/privacy-policy" : "https://calk.kg/privacy-policy"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/privacy-policy.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('footer_privacy')} - Calk.KG`} />
        <meta name="twitter:description" content={t('privacy_policy_description')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/privacy-policy.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/privacy-policy" : "https://calk.kg/privacy-policy"} />
      </Helmet>
      <HreflangTags path="/privacy-policy" />
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

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{t('pp_title')}</h1>
              <p className="text-blue-100 text-lg">{t('pp_subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">

          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Eye className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">{t('pp_general_title')}</h2>
            </div>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed mb-4">{t('pp_general_intro')}</p>
              <p className="text-gray-600 leading-relaxed mb-4">{t('pp_general_commitment')}</p>
              <p className="text-gray-600 leading-relaxed"><strong>{t('pp_last_update')}</strong></p>
            </div>
          </div>

          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Lock className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">{t('pp_data_collection_title')}</h2>
            </div>
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-3">{t('pp_data_auto_title')}</h3>
                <ul className="list-disc list-inside space-y-2 text-blue-800">
                  <li>{t('pp_data_auto_1')}</li>
                  <li>{t('pp_data_auto_2')}</li>
                  <li>{t('pp_data_auto_3')}</li>
                  <li>{t('pp_data_auto_4')}</li>
                  <li>{t('pp_data_auto_5')}</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-green-900 mb-3">{t('pp_data_not_title')}</h3>
                <ul className="list-disc list-inside space-y-2 text-green-800">
                  <li>{t('pp_data_not_1')}</li>
                  <li>{t('pp_data_not_2')}</li>
                  <li>{t('pp_data_not_3')}</li>
                  <li>{t('pp_data_not_4')}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('pp_usage_title')}</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600">{t(`pp_usage_${i}`)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('pp_calc_processing_title')}</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <Lock className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-3">{t('pp_calc_important')}</h3>
                  <ul className="list-disc list-inside space-y-2 text-green-800">
                    {[1, 2, 3, 4].map(i => (
                      <li key={i}><strong>{t(`pp_calc_${i}`)}</strong></li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('pp_cookies_title')}</h2>
            <p className="text-gray-600 leading-relaxed mb-4">{t('pp_cookies_intro')}</p>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                <p className="text-gray-600"><strong>{t('pp_cookies_tech')}</strong></p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                <p className="text-gray-600"><strong>{t('pp_cookies_analytics')}</strong></p>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('pp_third_party_title')}</h2>
            <p className="text-gray-600 leading-relaxed mb-4">{t('pp_third_party_intro')}</p>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm">{t('pp_third_party_analytics')}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm">{t('pp_third_party_cdn')}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm">{t('pp_third_party_adsense')}</p>
              </div>
            </div>
          </div>

          {/* Advertising Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('pp_advertising_title')}</h2>
            <p className="text-gray-600 leading-relaxed mb-4">{t('pp_advertising_intro')}</p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <ul className="list-disc list-inside space-y-2 text-amber-800">
                {[1, 2, 3, 4].map(i => (
                  <li key={i}>{t(`pp_advertising_${i}`)}</li>
                ))}
              </ul>
              <p className="text-amber-700 text-sm mt-4">
                <a 
                  href="https://www.google.com/settings/ads" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-amber-900"
                >
                  {t('pp_advertising_link')}
                </a>
              </p>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('pp_rights_title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">{t('pp_rights_subtitle')}</h3>
                <ul className="space-y-2">
                  {[1, 2, 3, 4].map(i => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-gray-600">{t(`pp_rights_${i}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-3">{t('pp_contact_title')}</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span className="text-blue-800">{t('pp_contact_email')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('pp_changes_title')}</h2>
            <p className="text-gray-600 leading-relaxed mb-4">{t('pp_changes_1')}</p>
            <p className="text-gray-600 leading-relaxed">{t('pp_changes_2')}</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('pp_compliance_title')}</h2>
            <p className="text-gray-600 leading-relaxed mb-4">{t('pp_compliance_intro')}</p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {[1, 2, 3].map(i => (
                <li key={i}>{t(`pp_compliance_${i}`)}</li>
              ))}
            </ul>
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

export default PrivacyPolicyPage;
