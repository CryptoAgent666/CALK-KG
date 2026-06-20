import type { CapacitorConfig } from '@capacitor/cli'

// Self-hosted OTA endpoint — shared network server (AU VPS). Routes by app_id.
// Channels for KG: kg-ios / kg-android (added to APP_BY_ID in updates.php).
const OTA_BASE = process.env.CALK_OTA_URL || 'https://ota.calk-au.com'

const config: CapacitorConfig = {
  // Android keeps applicationId kg.calk.app; iOS bundle is overridden to
  // kg.calk.ios in Xcode after `cap add ios` (existing store listings).
  appId: 'kg.calk.app',
  appName: 'Calk.KG',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 1500,
      backgroundColor: '#DC2626',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#DC2626',
    },
    // Capgo live updates — self-hosted on the shared network VPS (PHP endpoint).
    CapacitorUpdater: {
      autoUpdate: true,
      updateUrl: `${OTA_BASE}/updates.php`,
      statsUrl: '',
      channelUrl: '',
      appReadyTimeout: 10000,
      responseTimeout: 20,
    },
  },
}

export default config
