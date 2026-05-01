import { ru } from './translations-ru';

// Russian is loaded eagerly (default language, used as fallback)
// Kyrgyz is loaded lazily when needed
export type TranslationKey = keyof typeof ru;
export type Language = 'ru' | 'ky';

export interface TranslationsStore {
  ru: Record<string, string>;
  ky: Record<string, string>;
}

// Start with ru loaded, ky empty (will be filled lazily)
export const translations: TranslationsStore = {
  ru,
  ky: {} as Record<string, string>,
};

let kyLoaded = false;

export const loadKyTranslations = async (): Promise<void> => {
  if (kyLoaded) return;
  const mod = await import('./translations-ky');
  translations.ky = mod.ky;
  kyLoaded = true;
};

export const isKyLoaded = () => kyLoaded;
