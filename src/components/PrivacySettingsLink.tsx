import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * «Настройки конфиденциальности» — повторный вызов GDPR-формы AdSense CMP
 * (googlefc.showRevocationMessage). Порт с calk-usa (PrivacySettings.tsx).
 *
 * Кнопка рендерится ТОЛЬКО когда CMP реально отработал на странице
 * (CONSENT_DATA_READY): вне EEA/UK и до публикации AdSense-сообщения для
 * calk.kg googlefc молчит — и кнопки просто нет. Поэтому её безопасно
 * держать в футере постоянно.
 *
 * В нативных сборках AdSense вырезан целиком (webAds.ts), CMP не приходит —
 * статический гейт ниже выкидывает и этот компонент из app-бандла.
 */
const PrivacySettingsLink = () => {
  const { t } = useLanguage();
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    if (import.meta.env.VITE_CALK_PLATFORM === 'app') return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    w.googlefc = w.googlefc || {};
    w.googlefc.callbackQueue = w.googlefc.callbackQueue || [];
    w.googlefc.callbackQueue.push({
      CONSENT_DATA_READY: () => setAvailable(true),
    });
  }, []);

  if (!available) return null;

  return (
    <button
      type="button"
      onClick={() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const w = window as any;
        w.googlefc.callbackQueue.push(w.googlefc.showRevocationMessage);
      }}
      className="text-gray-400 hover:text-white transition-colors"
    >
      {t('footer_privacy_settings')}
    </button>
  );
};

export default PrivacySettingsLink;
