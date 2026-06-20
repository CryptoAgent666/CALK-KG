import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, Calculator, Map } from 'lucide-react';
import SchemaMarkup from '../components/SchemaMarkup';
import HreflangTags from '../components/HreflangTags';
import { generateWebPageSchema, generateBreadcrumbSchema } from '../utils/schemaGenerator';
import { useLanguage } from '../contexts/LanguageContext';
import { calculators } from '../data/calculators';
import { categories } from '../data/categories';

const SitemapPage = () => {
  const { language, t } = useLanguage();
  // Prefix internal sitemap links with /ky when the page is rendered in Kyrgyz
  // so the user stays in their chosen locale instead of being bounced to RU.
  const localePrefix = language === 'ky' ? '/ky' : '';
  const ky = (path: string) => `${localePrefix}${path}`;

  React.useEffect(() => {
    document.title = t('sitemap_page_title');
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('sitemap_meta_description'));
    }
  }, [language, t]);

  // Генерация схем для карты сайта
  const generateSchemas = () => {
    const currentUrl = "https://calk.kg/sitemap/";
    
    const webPageSchema = generateWebPageSchema({
      url: currentUrl,
      title: t('sitemap_schema_title'),
      description: t('sitemap_schema_desc'),
      language
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: "https://calk.kg" },
      { name: t('sitemap_breadcrumb'), url: currentUrl }
    ]);

    return [webPageSchema, breadcrumbSchema];
  };

  // Группировка калькуляторов по категориям
  const groupedCalculators: Record<string, { category: any; calculators: any[] }> = categories.reduce((acc, category) => {
    if (category.id === 'all') return acc;
    
    acc[category.id] = {
      category: category,
      calculators: calculators.filter(calc => calc.category === category.id)
    };
    return acc;
  }, {} as Record<string, { category: any; calculators: any[] }>);

  const getCategoryName = (category: any) => {
    if (language === 'ky') return category.nameKy;
    return category.name;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org микроразметка */}
      <Helmet>
        <title>{t('sitemap_title')}</title>
        <meta name="description" content={t('sitemap_description')} />
        <meta name="keywords" content={t('sitemap_keywords')} />
        <meta property="og:title" content={t('sitemap_title')} />
        <meta property="og:description" content={t('sitemap_description')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/sitemap/" : "https://calk.kg/sitemap/"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/sitemap.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta property="og:site_name" content="Calk.KG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('sitemap_title')} | Calk.KG`} />
        <meta name="twitter:description" content={t('sitemap_description')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/sitemap.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/sitemap/" : "https://calk.kg/sitemap/"} />
      </Helmet>
      <HreflangTags path="/sitemap" />
      {generateSchemas().map((schema, index) => (
        <SchemaMarkup key={index} schema={schema} />
      ))}

      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Map className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{t('sitemap_title')}</h1>
              <p className="text-blue-100 text-lg">{t('sitemap_subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Main Pages */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('sitemap_main_pages')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to={ky('/')}
              className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-blue-200 group"
            >
              <div className="bg-red-50 p-2 rounded-lg group-hover:bg-red-100 transition-colors">
                <Calculator className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900 group-hover:text-blue-600">{t('nav_home')}</div>
                <div className="text-sm text-gray-500">{t('sitemap_home_desc')}</div>
              </div>
            </Link>

            <Link
              to={ky('/about')}
              className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-blue-200 group"
            >
              <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                <Calculator className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900 group-hover:text-blue-600">{t('nav_about')}</div>
                <div className="text-sm text-gray-500">{t('sitemap_about_desc')}</div>
              </div>
            </Link>

            <Link
              to={ky('/privacy-policy')}
              className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-blue-200 group"
            >
              <div className="bg-gray-50 p-2 rounded-lg group-hover:bg-gray-100 transition-colors">
                <Calculator className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900 group-hover:text-blue-600">{t('footer_privacy')}</div>
                <div className="text-sm text-gray-500">{t('sitemap_privacy_desc')}</div>
              </div>
            </Link>

            <Link
              to={ky('/terms-of-service')}
              className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-blue-200 group"
            >
              <div className="bg-gray-50 p-2 rounded-lg group-hover:bg-gray-100 transition-colors">
                <Calculator className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900 group-hover:text-blue-600">{t('footer_terms')}</div>
                <div className="text-sm text-gray-500">{t('sitemap_terms_desc')}</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Calculators by Category */}
        <div className="space-y-8">
          {Object.entries(groupedCalculators).map(([categoryId, data]) => (
            <div key={categoryId} className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex items-center mb-6">
                <div className="bg-red-100 p-2 rounded-lg mr-3">
                  <Calculator className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {getCategoryName(data.category)}
                  </h2>
                  <p className="text-gray-600">
                    {data.calculators.length} {t('sitemap_calculator')}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.calculators.map((calculator: any) => {
                  const IconComponent = calculator.icon;
                  const slug = calculator.id.replace('-calculator', '');
                  // On the KY sitemap, point at the KY versions of each calculator
                  // so users don't get bounced to the RU article via /calculator/...
                  const calculatorUrl = ky(`/calculator/${slug}`);
                  
                  return (
                    <Link 
                      key={calculator.id}
                      to={calculatorUrl}
                      className="flex items-start space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-red-200 group"
                    >
                      <div className={`p-2 rounded-lg ${calculator.bgColor} group-hover:scale-110 transition-transform`}>
                        <IconComponent className={`h-5 w-5 ${calculator.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 group-hover:text-red-600 transition-colors mb-1">
                          {calculator.title}
                        </div>
                        <div className="text-sm text-gray-500 leading-relaxed">
                          {calculator.description}
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                          {t('sitemap_usage')}: {calculator.usage}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link
            to={ky('/')}
            className="inline-flex items-center space-x-2 bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            <Home className="h-5 w-5" />
            <span>{t('back_to_home')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SitemapPage;