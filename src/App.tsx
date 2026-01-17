import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useSearchParams, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage, removeLanguagePrefix } from './contexts/LanguageContext';
import SchemaMarkup from './components/SchemaMarkup';
import HreflangTags from './components/HreflangTags';
import {
  generateWebSiteSchema,
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateLocalBusinessSchema
} from './utils/schemaGenerator';
import Header from './components/Header';
import Hero from './components/Hero';
import CalculatorGrid from './components/CalculatorGrid';
import ContentBlock from './components/ContentBlock';
import Footer from './components/Footer';
import { calculators } from './data/calculators';

const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const CurrencyExchangePage = lazy(() => import('./pages/CurrencyExchangePage'));
const MoneyTransferCalculatorPage = lazy(() => import('./pages/MoneyTransferCalculatorPage'));
const SalaryCalculatorPage = lazy(() => import('./pages/SalaryCalculatorPage'));
const SingleTaxCalculatorPage = lazy(() => import('./pages/SingleTaxCalculatorPage'));
const PropertyTaxCalculatorPage = lazy(() => import('./pages/PropertyTaxCalculatorPage'));
const SocialFundCalculatorPage = lazy(() => import('./pages/SocialFundCalculatorPage'));
const PensionCalculatorPage = lazy(() => import('./pages/PensionCalculatorPage'));
const LoanCalculatorPage = lazy(() => import('./pages/LoanCalculatorPage'));
const MortgageCalculatorPage = lazy(() => import('./pages/MortgageCalculatorPage'));
const AutoLoanCalculatorPage = lazy(() => import('./pages/AutoLoanCalculatorPage'));
const DepositCalculatorPage = lazy(() => import('./pages/DepositCalculatorPage'));
const CustomsCalculatorPage = lazy(() => import('./pages/CustomsCalculatorPage'));
const ElectricityCalculatorPage = lazy(() => import('./pages/ElectricityCalculatorPage'));
const WaterCalculatorPage = lazy(() => import('./pages/WaterCalculatorPage'));
const HeatingCalculatorPage = lazy(() => import('./pages/HeatingCalculatorPage'));
const GasCalculatorPage = lazy(() => import('./pages/GasCalculatorPage'));
const AlimonyCalculatorPage = lazy(() => import('./pages/AlimonyCalculatorPage'));
const FamilyBenefitCalculatorPage = lazy(() => import('./pages/FamilyBenefitCalculatorPage'));
const PatentCalculatorPage = lazy(() => import('./pages/PatentCalculatorPage'));
const TrafficFinesCalculatorPage = lazy(() => import('./pages/TrafficFinesCalculatorPage'));
const ZakatCalculatorPage = lazy(() => import('./pages/ZakatCalculatorPage'));
const TaxiTaxCalculatorPage = lazy(() => import('./pages/TaxiTaxCalculatorPage'));
const PassportCalculatorPage = lazy(() => import('./pages/PassportCalculatorPage'));
const TouristFeeCalculatorPage = lazy(() => import('./pages/TouristFeeCalculatorPage'));
const CalorieCalculatorPage = lazy(() => import('./pages/CalorieCalculatorPage'));
const SewingCostCalculatorPage = lazy(() => import('./pages/SewingCostCalculatorPage'));
const HousingCalculatorPage = lazy(() => import('./pages/HousingCalculatorPage'));
const WeddingCalculatorPage = lazy(() => import('./pages/WeddingCalculatorPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const SitemapPage = lazy(() => import('./pages/SitemapPage'));
const DisclaimerPage = lazy(() => import('./pages/DisclaimerPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const PageLoader = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">{t('loading')}</p>
      </div>
    </div>
  );
};

const HomePage = () => {
  const { language, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  const filteredCalculators = calculators.filter(calc => {
    const matchesSearch = calc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         calc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || calc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const generateHomePageSchemas = () => {
    const basePath = removeLanguagePrefix(location.pathname);
    const currentUrl = `https://calk.kg${basePath === '/' ? '' : basePath}`;

    const websiteSchema = generateWebSiteSchema({
      url: currentUrl,
      title: t('site_name'),
      description: t('hero_description'),
      language
    });

    const organizationSchema = generateOrganizationSchema({
      name: "Calk.KG",
      url: "https://calk.kg",
      logo: "https://calk.kg/calculator-logo.svg",
      description: t('hero_description'),
      contactEmail: "info@calk.kg",
      address: {
        addressCountry: "KG",
        addressRegion: "Чуйская область",
        addressLocality: "Бишкек"
      }
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: "https://calk.kg" }
    ]);

    const localBusinessSchema = generateLocalBusinessSchema();

    return [websiteSchema, organizationSchema, breadcrumbSchema, localBusinessSchema];
  };

  return (
    <>
      <Helmet>
        <title>{t('site_name')} - {t('site_tagline')}</title>
        <meta name="description" content={t('hero_description')} />
        <meta name="keywords" content={t('home_keywords')} />
        <meta property="og:title" content={`${t('site_name')} - ${t('site_tagline')}`} />
        <meta property="og:description" content={t('hero_description')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky" : "https://calk.kg"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/home.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta property="og:locale:alternate" content={language === 'ky' ? "ru_RU" : "ky_KG"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('site_name')} - ${t('site_tagline')}`} />
        <meta name="twitter:description" content={t('hero_description')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/home.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky" : "https://calk.kg"} />
      </Helmet>
      <HreflangTags path="/" />
      {generateHomePageSchemas().map((schema, index) => (
        <SchemaMarkup key={index} schema={schema} />
      ))}
      <Header />
      <Hero searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <CalculatorGrid
        calculators={filteredCalculators}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <ContentBlock />
      <Footer />
    </>
  );
};

const CalculatorPageWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>
    <Header />
    {children}
    <Footer />
  </Suspense>
);

const StaticPageWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>
    <Header />
    {children}
    <Footer />
  </Suspense>
);

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const calculatorRoutes = [
    { path: 'calculator/currency-exchange', element: <CurrencyExchangePage /> },
    { path: 'calculator/money-transfer', element: <MoneyTransferCalculatorPage /> },
    { path: 'calculator/salary', element: <SalaryCalculatorPage /> },
    { path: 'calculator/single-tax', element: <SingleTaxCalculatorPage /> },
    { path: 'calculator/property-tax', element: <PropertyTaxCalculatorPage /> },
    { path: 'calculator/social-fund', element: <SocialFundCalculatorPage /> },
    { path: 'calculator/pension', element: <PensionCalculatorPage /> },
    { path: 'calculator/loan', element: <LoanCalculatorPage /> },
    { path: 'calculator/mortgage', element: <MortgageCalculatorPage /> },
    { path: 'calculator/auto-loan', element: <AutoLoanCalculatorPage /> },
    { path: 'calculator/deposit', element: <DepositCalculatorPage /> },
    { path: 'calculator/customs', element: <CustomsCalculatorPage /> },
    { path: 'calculator/electricity', element: <ElectricityCalculatorPage /> },
    { path: 'calculator/water', element: <WaterCalculatorPage /> },
    { path: 'calculator/heating', element: <HeatingCalculatorPage /> },
    { path: 'calculator/gas', element: <GasCalculatorPage /> },
    { path: 'calculator/alimony', element: <AlimonyCalculatorPage /> },
    { path: 'calculator/family-benefit', element: <FamilyBenefitCalculatorPage /> },
    { path: 'calculator/patent', element: <PatentCalculatorPage /> },
    { path: 'calculator/traffic-fines', element: <TrafficFinesCalculatorPage /> },
    { path: 'calculator/zakat', element: <ZakatCalculatorPage /> },
    { path: 'calculator/taxi-tax', element: <TaxiTaxCalculatorPage /> },
    { path: 'calculator/passport', element: <PassportCalculatorPage /> },
    { path: 'calculator/tourist-fee', element: <TouristFeeCalculatorPage /> },
    { path: 'calculator/calorie', element: <CalorieCalculatorPage /> },
    { path: 'calculator/sewing-cost', element: <SewingCostCalculatorPage /> },
    { path: 'calculator/housing', element: <HousingCalculatorPage /> },
    { path: 'calculator/wedding', element: <WeddingCalculatorPage /> },
  ];

  const staticRoutes = [
    { path: 'about', element: <AboutPage /> },
    { path: 'contact', element: <ContactPage /> },
    { path: 'privacy-policy', element: <PrivacyPolicyPage /> },
    { path: 'terms-of-service', element: <TermsOfServicePage /> },
    { path: 'disclaimer', element: <DisclaimerPage /> },
    { path: 'sitemap', element: <SitemapPage /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ky" element={<HomePage />} />

        {calculatorRoutes.map(({ path, element }) => (
          <React.Fragment key={path}>
            <Route
              path={`/${path}`}
              element={<CalculatorPageWrapper>{element}</CalculatorPageWrapper>}
            />
            <Route
              path={`/ky/${path}`}
              element={<CalculatorPageWrapper>{element}</CalculatorPageWrapper>}
            />
          </React.Fragment>
        ))}

        {staticRoutes.map(({ path, element }) => (
          <React.Fragment key={path}>
            <Route
              path={`/${path}`}
              element={<StaticPageWrapper>{element}</StaticPageWrapper>}
            />
            <Route
              path={`/ky/${path}`}
              element={<StaticPageWrapper>{element}</StaticPageWrapper>}
            />
          </React.Fragment>
        ))}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
