// Native AdMob banner — runs only inside the Capacitor apps (iOS/Android).
// On the web Capacitor.isNativePlatform() is false, so this is a no-op there.
// Plugin is dynamically imported so it never bloats the web bundle.
import { Capacitor } from '@capacitor/core';

// Google's official TEST ad units (safe during development — never click real ads).
const TEST_BANNER = {
  ios: 'ca-app-pub-3940256099942544/2934735716',
  android: 'ca-app-pub-3940256099942544/6300978111',
};
// Live KG ad units.
const PROD_BANNER = {
  ios: 'ca-app-pub-4859241862365215/5907853241',
  android: 'ca-app-pub-4859241862365215/2108777250',
};

export async function initNativeAds(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const { AdMob, BannerAdSize, BannerAdPosition } = await import('@capacitor-community/admob');
    await AdMob.initialize();

    const platform = Capacitor.getPlatform() === 'ios' ? 'ios' : 'android';
    const ids = import.meta.env.DEV ? TEST_BANNER : PROD_BANNER;

    await AdMob.showBanner({
      adId: ids[platform],
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
    });
  } catch (err) {
    // Never let an ad failure break the app.
    console.warn('[admob] init/banner failed:', err);
  }
}
