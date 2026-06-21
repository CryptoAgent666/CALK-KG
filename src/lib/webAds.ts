// Google AdSense (Auto ads) loader — WEB ONLY.
//
// In native app bundles we build with VITE_CALK_PLATFORM=app, so Vite statically
// replaces import.meta.env.VITE_CALK_PLATFORM with 'app' and dead-code-eliminates
// this whole body — AdSense never ships inside the apps (we use native AdMob there).
// The extra UA check also keeps AdSense out of older in-app WebViews.
export function initWebAds(): void {
  if (import.meta.env.VITE_CALK_PLATFORM === 'app') return;

  const ua = navigator.userAgent || '';
  const m = ua.match(/CalkKG(?:-App)?\/(\d+)/); // CalkKG/2 (iOS) | CalkKG-App/2 (Android)
  if (m && parseInt(m[1], 10) >= 2) return; // legacy in-app WebView v2+

  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4859241862365215';
  s.crossOrigin = 'anonymous';
  document.head.appendChild(s);
}
