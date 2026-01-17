import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Home, Calculator, Heart, Users, Shield, TrendingUp, Target, Award, Lightbulb, CheckCircle } from 'lucide-react';
import SchemaMarkup from '../components/SchemaMarkup';
import HreflangTags from '../components/HreflangTags';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  generateAboutPageSchema, 
  generateOrganizationSchema, 
  generateBreadcrumbSchema 
} from '../utils/schemaGenerator';

const AboutPage = () => {
  const { t, language, getLocalizedPath } = useLanguage();

  React.useEffect(() => {
    document.title = t('nav_about') + " - Calk.KG";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('about_page_description'));
    }
  }, [t]);

  // Генерация схем для страницы "О нас"
  const generateSchemas = () => {
    const currentUrl = "https://calk.kg/about";
    
    const aboutPageSchema = generateAboutPageSchema({
      url: currentUrl,
      title: t('nav_about'),
      description: t('about_page_description')
    });

    const organizationSchema = generateOrganizationSchema({
      name: "Calk.KG",
      url: "https://calk.kg",
      logo: "https://calk.kg/calculator-logo.svg",
      description: t('about_page_description'),
      contactEmail: "info@calk.kg",
      address: {
        addressCountry: "KG",
        addressRegion: "Чуйская область",
        addressLocality: "Бишкек"
      }
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: "https://calk.kg" },
      { name: t('nav_about'), url: currentUrl }
    ]);

    return [aboutPageSchema, organizationSchema, breadcrumbSchema];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org микроразметка */}
      <Helmet>
        <title>{t('nav_about')} - Calk.KG</title>
        <meta name="description" content={t('about_page_description')} />
        <meta name="keywords" content={t('about_keywords')} />
        <meta property="og:title" content={t('nav_about')} />
        <meta property="og:description" content={t('about_page_description')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/about" : "https://calk.kg/about"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/about.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('nav_about')} - Calk.KG`} />
        <meta name="twitter:description" content={t('about_page_description')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/about.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/about" : "https://calk.kg/about"} />
      </Helmet>
      <HreflangTags path="/about" />
      {generateSchemas().map((schema, index) => (
        <SchemaMarkup key={index} schema={schema} />
      ))}

      {/* Header */}
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
              <span>{t('home')}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="bg-white/20 p-4 rounded-xl">
                <Calculator className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('about_page_title')}</h1>
            <p className="text-xl text-red-100 max-w-3xl mx-auto leading-relaxed">
              {t('about_page_subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Mission Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 mb-12">
          <div className="flex items-center space-x-3 mb-8">
            <Target className="h-8 w-8 text-red-600" />
            <h2 className="text-3xl font-bold text-gray-900">{t('about_our_mission')}</h2>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 leading-relaxed mb-6">
              {t('about_mission_text1')}
            </p>

            <p className="text-gray-600 leading-relaxed">
              {t('about_mission_text2')}
            </p>
          </div>
        </div>

        {/* What We Do */}
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 mb-12">
          <div className="flex items-center space-x-3 mb-8">
            <Lightbulb className="h-8 w-8 text-amber-600" />
            <h2 className="text-3xl font-bold text-gray-900">{t('about_what_we_do')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-red-100 p-3 rounded-lg flex-shrink-0">
                  <Calculator className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t('about_financial_calcs')}</h3>
                  <p className="text-gray-600">{t('about_financial_desc')}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t('about_social_calcs')}</h3>
                  <p className="text-gray-600">{t('about_social_desc')}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t('about_utilities_calcs')}</h3>
                  <p className="text-gray-600">{t('about_utilities_desc')}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg flex-shrink-0">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t('about_state_services')}</h3>
                  <p className="text-gray-600">{t('about_state_desc')}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-3 rounded-lg flex-shrink-0">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t('about_business_calcs')}</h3>
                  <p className="text-gray-600">{t('about_business_desc')}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-cyan-100 p-3 rounded-lg flex-shrink-0">
                  <Heart className="h-6 w-6 text-cyan-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t('about_special_calcs')}</h3>
                  <p className="text-gray-600">{t('about_special_desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Principles */}
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 mb-12">
          <div className="flex items-center space-x-3 mb-8">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900">{t('about_our_principles')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-6">
                <h4 className="font-semibold text-gray-900 mb-2">{t('about_principle_free')}</h4>
                <p className="text-gray-600">{t('about_principle_free_desc')}</p>
              </div>

              <div className="border-l-4 border-blue-500 pl-6">
                <h4 className="font-semibold text-gray-900 mb-2">{t('about_principle_accuracy')}</h4>
                <p className="text-gray-600">{t('about_principle_accuracy_desc')}</p>
              </div>

              <div className="border-l-4 border-green-500 pl-6">
                <h4 className="font-semibold text-gray-900 mb-2">{t('about_principle_privacy')}</h4>
                <p className="text-gray-600">{t('about_principle_privacy_desc')}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-amber-500 pl-6">
                <h4 className="font-semibold text-gray-900 mb-2">{t('about_principle_simplicity')}</h4>
                <p className="text-gray-600">{t('about_principle_simplicity_desc')}</p>
              </div>

              <div className="border-l-4 border-purple-500 pl-6">
                <h4 className="font-semibold text-gray-900 mb-2">{t('about_principle_relevance')}</h4>
                <p className="text-gray-600">{t('about_principle_relevance_desc')}</p>
              </div>

              <div className="border-l-4 border-cyan-500 pl-6">
                <h4 className="font-semibold text-gray-900 mb-2">{t('about_principle_openness')}</h4>
                <p className="text-gray-600">{t('about_principle_openness_desc')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-8 md:p-12 text-white text-center mb-12">
          <h2 className="text-3xl font-bold mb-8">{t('about_stats_title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-red-100">{t('about_stats_calculators')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-red-100">{t('about_stats_users')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-red-100">{t('about_stats_calculations')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-red-100">{t('about_stats_uptime')}</div>
            </div>
          </div>
        </div>

        {/* Our Story */}
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 mb-12">
          <div className="flex items-center space-x-3 mb-8">
            <Heart className="h-8 w-8 text-red-600" />
            <h2 className="text-3xl font-bold text-gray-900">{t('about_our_story')}</h2>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 leading-relaxed mb-6">
              {t('about_story_text1')}
            </p>

            <p className="text-gray-600 leading-relaxed mb-6">
              {t('about_story_text2')}
            </p>

            <p className="text-gray-600 leading-relaxed">
              {t('about_story_text3')}
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 mb-12">
          <div className="flex items-center space-x-3 mb-8">
            <Award className="h-8 w-8 text-amber-600" />
            <h2 className="text-3xl font-bold text-gray-900">{t('about_why_choose')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('about_reliability')}</h3>
              <p className="text-gray-600">
                {t('about_reliability_desc')}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('about_actuality')}</h3>
              <p className="text-gray-600">
                {t('about_actuality_desc')}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('about_convenience')}</h3>
              <p className="text-gray-600">
                {t('about_convenience_desc')}
              </p>
            </div>
          </div>
        </div>

        {/* Coverage */}
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t('about_what_we_cover')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">{t('about_personal_finance')}</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-600">{t('about_salary_calculation')}</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-600">{t('about_credits_mortgage')}</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-600">{t('about_deposits_investments')}</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-600">{t('about_social_benefits')}</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-600">{t('about_pension_savings')}</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">{t('about_business_entrepreneurship')}</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-600">{t('about_ip_taxes')}</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-600">{t('about_patent_cost')}</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-600">{t('about_customs_calculations')}</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-600">{t('about_product_cost')}</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-600">{t('about_social_contributions')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technology */}
        <div className="bg-gray-50 rounded-xl p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t('about_technology')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">{t('about_local_calculations')}</h4>
                <p className="text-gray-600 text-sm">
                  {t('about_local_desc')}
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">{t('about_modern_tech')}</h4>
                <p className="text-gray-600 text-sm">
                  {t('about_modern_desc')}
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">{t('about_user_care')}</h4>
                <p className="text-gray-600 text-sm">
                  {t('about_user_care_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact and Future */}
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t('about_contact_development')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">{t('about_feedback')}</h3>
              <p className="text-gray-600 mb-6">
                {t('about_feedback_text')}
              </p>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">{t('about_contact_label')}</h4>
                <div className="flex items-center space-x-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <Calculator className="h-5 w-5 text-red-600" />
                  </div>
                  <span className="text-gray-700">info@calk.kg</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">{t('about_development_plans')}</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-600">{t('about_plan_new_calcs')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-600">{t('about_plan_bank_integration')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-600">{t('about_plan_mobile_app')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-600">{t('about_plan_api')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-600">{t('about_plan_kyrgyz_language')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link 
            to="/"
            className="inline-flex items-center space-x-3 bg-red-600 text-white px-8 py-4 rounded-xl hover:bg-red-700 transition-colors font-semibold text-lg"
          >
            <Calculator className="h-6 w-6" />
            <span>{t('about_cta_button')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;