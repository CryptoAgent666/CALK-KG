// Native-only UI tweaks for the Capacitor shell (no-op on web).
import { Capacitor } from '@capacitor/core';

export async function initNativeUI(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    // Don't let the WebView draw under the status bar / notch — reserve that space
    // natively so the page header doesn't collide with the clock / Dynamic Island.
    await StatusBar.setOverlaysWebView({ overlay: false });
    // Status-bar area shows the brand red → use light icons (Capacitor: Style.Dark = light text).
    await StatusBar.setStyle({ style: Style.Dark });
    if (Capacitor.getPlatform() === 'android') {
      await StatusBar.setBackgroundColor({ color: '#DC2626' });
    }
  } catch (e) {
    console.warn('[native-ui] init failed:', e);
  }
}
