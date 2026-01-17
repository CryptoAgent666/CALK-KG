import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './contexts/LanguageContext';
import App from './App.tsx';
import './index.css';

const container = document.getElementById('root')!;

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

if (container.hasChildNodes()) {
  hydrateRoot(container, AppWrapper);
} else {
  createRoot(container).render(AppWrapper);
}
