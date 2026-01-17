import React from 'react';
import { TrendingUp, Shield, Clock, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ContentBlock = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: TrendingUp,
      title: t('content_feature_1_title'),
      description: t('content_feature_1_desc')
    },
    {
      icon: Shield,
      title: t('content_feature_2_title'),
      description: t('content_feature_2_desc')
    },
    {
      icon: Clock,
      title: t('content_feature_3_title'),
      description: t('content_feature_3_desc')
    },
    {
      icon: Users,
      title: t('content_feature_4_title'),
      description: t('content_feature_4_desc')
    }
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* About Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {t('content_title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('content_description')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="bg-gradient-to-br from-red-50 to-amber-100 p-4 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <feature.icon className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">25+</div>
              <div className="text-red-100">{t('content_stat_1')}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">50,000+</div>
              <div className="text-red-100">{t('content_stat_2')}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">1M+</div>
              <div className="text-red-100">{t('content_stat_3')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentBlock;