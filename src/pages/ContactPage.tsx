import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Home, Calculator, Mail, MapPin, Phone, Send, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import SchemaMarkup from '../components/SchemaMarkup';
import HreflangTags from '../components/HreflangTags';
import { generateWebPageSchema, generateBreadcrumbSchema } from '../utils/schemaGenerator';
import { useLanguage } from '../contexts/LanguageContext';

const ContactPage = () => {
  const { t, language, getLocalizedPath } = useLanguage();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // В реальном приложении здесь была бы отправка на сервер
    setFormSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateSchemas = () => {
    const currentUrl = language === 'ky' ? "https://calk.kg/ky/contact" : "https://calk.kg/contact";

    const webPageSchema = generateWebPageSchema({
      url: currentUrl,
      title: t('contact_title'),
      description: t('contact_description')
    });

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: t('nav_home'), url: "https://calk.kg" },
      { name: t('contact_title'), url: currentUrl }
    ]);

    return [webPageSchema, breadcrumbSchema];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{t('contact_title')} - Calk.KG</title>
        <meta name="description" content={t('contact_description')} />
        <meta name="keywords" content={t('contact_keywords')} />
        <meta property="og:title" content={`${t('contact_title')} - Calk.KG`} />
        <meta property="og:description" content={t('contact_description')} />
        <meta property="og:url" content={language === 'ky' ? "https://calk.kg/ky/contact" : "https://calk.kg/contact"} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://calk.kg/og-images/about.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'ky' ? "ky_KG" : "ru_RU"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('contact_title')} - Calk.KG`} />
        <meta name="twitter:description" content={t('contact_description')} />
        <meta name="twitter:image" content="https://calk.kg/og-images/about.png" />
        <link rel="canonical" href={language === 'ky' ? "https://calk.kg/ky/contact" : "https://calk.kg/contact"} />
      </Helmet>
      <HreflangTags path="/contact" />
      {generateSchemas().map((schema, index) => (
        <SchemaMarkup key={index} schema={schema} />
      ))}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to={getLocalizedPath('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>{t('back')}</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <Link to={getLocalizedPath('/')} className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-red-600 to-red-700 p-2 rounded-lg">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">Calk.KG</span>
              </Link>
            </div>
            <Link
              to={getLocalizedPath('/')}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>{t('home_button')}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <MessageCircle className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{t('contact_title')}</h1>
              <p className="text-teal-100 text-lg">{t('contact_subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            {/* Email Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-red-100 p-3 rounded-xl">
                  <Mail className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t('contact_email')}</h3>
                  <p className="text-gray-500 text-sm">{t('contact_email_desc')}</p>
                </div>
              </div>
              <a href="mailto:info@calk.kg" className="text-red-600 hover:text-red-700 font-medium text-lg">
                info@calk.kg
              </a>
            </div>

            {/* Address Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t('contact_address')}</h3>
                  <p className="text-gray-500 text-sm">{t('contact_address_desc')}</p>
                </div>
              </div>
              <p className="text-gray-700">
                {t('contact_address_line1')}<br />
                {t('contact_address_line2')}
              </p>
            </div>

            {/* Working Hours Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-green-100 p-3 rounded-xl">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t('contact_hours')}</h3>
                  <p className="text-gray-500 text-sm">{t('contact_hours_desc')}</p>
                </div>
              </div>
              <p className="text-gray-700">
                {t('contact_hours_weekdays')}<br />
                {t('contact_hours_weekend')}
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('contact_form_title')}</h2>
              
              {formSubmitted ? (
                <div className="text-center py-12">
                  <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('contact_success_title')}</h3>
                  <p className="text-gray-600 mb-6">{t('contact_success_message')}</p>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({ name: '', email: '', subject: '', message: '' });
                    }}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    {t('contact_send_another')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('contact_name')} *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        placeholder={t('contact_name_placeholder')}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('contact_email_label')} *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        placeholder={t('contact_email_placeholder')}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact_subject')} *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    >
                      <option value="">{t('contact_subject_select')}</option>
                      <option value="bug">{t('contact_subject_bug')}</option>
                      <option value="feature">{t('contact_subject_feature')}</option>
                      <option value="question">{t('contact_subject_question')}</option>
                      <option value="partnership">{t('contact_subject_partnership')}</option>
                      <option value="other">{t('contact_subject_other')}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact_message')} *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
                      placeholder={t('contact_message_placeholder')}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center space-x-2"
                  >
                    <Send className="h-5 w-5" />
                    <span>{t('contact_submit')}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t('contact_faq_title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">{t('contact_faq_1_q')}</h3>
              <p className="text-gray-600 text-sm">{t('contact_faq_1_a')}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">{t('contact_faq_2_q')}</h3>
              <p className="text-gray-600 text-sm">{t('contact_faq_2_a')}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">{t('contact_faq_3_q')}</h3>
              <p className="text-gray-600 text-sm">{t('contact_faq_3_a')}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">{t('contact_faq_4_q')}</h3>
              <p className="text-gray-600 text-sm">{t('contact_faq_4_a')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2026 Calk.KG. {t('footer_rights')}</p>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;

