import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './contexts/LanguageContext';
import App from './App.tsx';
import { initWebAds } from './lib/webAds';
import { initNativeAds } from './lib/admob';
import { initNativeUI } from './lib/nativeUI';
import { initPurchases } from './lib/purchases';
import './index.css';

const container = document.getElementById('root')!;

// Remove SSG static content before React renders — it's only for crawlers
// Belt-and-suspenders: CSS class hides it immediately, then remove() cleans DOM
document.documentElement.classList.add('react-mounted');
const staticContent = document.getElementById('static-content');
if (staticContent) {
  staticContent.remove();
}

const AppWrapper = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);

// Always use createRoot since SSG content structure differs from React tree
createRoot(container).render(AppWrapper);

// Native shell setup (status bar safe-area) + ads.
initNativeUI();
// Покупки RevenueCat (entitlement ad_free). Инициализируем ДО рекламы, чтобы
// у купивших баннер не мелькал (isAdFree() читает кэш синхронно).
initPurchases();
// Ads: AdSense on web (stripped from app builds), native AdMob inside the apps.
initWebAds();
initNativeAds();
