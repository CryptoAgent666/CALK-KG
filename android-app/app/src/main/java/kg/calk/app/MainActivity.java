package kg.calk.app;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ProgressBar;

/**
 * Main Activity with WebView - displays calk.kg website inside the app
 */
public class MainActivity extends Activity {

    private static final String WEBSITE_URL = "https://calk.kg";
    
    private WebView webView;
    private ProgressBar progressBar;
    private FrameLayout splashScreen;
    private FrameLayout errorScreen;
    private boolean isFirstLoad = true;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Fullscreen
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        
        // Set status bar color
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            Window window = getWindow();
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.setStatusBarColor(getResources().getColor(R.color.colorPrimaryDark));
        }
        
        setContentView(R.layout.activity_main);
        
        // Initialize views
        webView = findViewById(R.id.webView);
        progressBar = findViewById(R.id.progressBar);
        splashScreen = findViewById(R.id.splashScreen);
        errorScreen = findViewById(R.id.errorScreen);
        
        // Setup WebView
        setupWebView();
        
        // Check internet and load
        if (isNetworkAvailable()) {
            loadWebsite();
        } else {
            showErrorScreen();
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void setupWebView() {
        WebSettings webSettings = webView.getSettings();
        
        // Enable JavaScript
        webSettings.setJavaScriptEnabled(true);
        
        // Enable DOM storage
        webSettings.setDomStorageEnabled(true);
        
        // Enable database
        webSettings.setDatabaseEnabled(true);
        
        // Enable caching
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
        
        // Enable zoom
        webSettings.setSupportZoom(true);
        webSettings.setBuiltInZoomControls(true);
        webSettings.setDisplayZoomControls(false);
        
        // Viewport settings
        webSettings.setUseWideViewPort(true);
        webSettings.setLoadWithOverviewMode(true);
        
        // Allow mixed content (HTTPS + HTTP)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE);
        }
        
        // Enable cookies
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            cookieManager.setAcceptThirdPartyCookies(webView, true);
        }
        
        // Set user agent
        String userAgent = webSettings.getUserAgentString();
        webSettings.setUserAgentString(userAgent + " CalkKG-App/1.0");
        
        // WebView client for handling page loading
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                if (!isFirstLoad) {
                    progressBar.setVisibility(View.VISIBLE);
                }
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                progressBar.setVisibility(View.GONE);
                
                if (isFirstLoad) {
                    isFirstLoad = false;
                    hideSplashScreen();
                }
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                if (request.isForMainFrame()) {
                    showErrorScreen();
                }
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                
                // Handle external links (social media, maps, etc.)
                if (isExternalLink(url)) {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                    return true;
                }
                
                // Load internal links in WebView
                return false;
            }
        });

        // WebChrome client for progress
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                progressBar.setProgress(newProgress);
            }
        });
    }

    private boolean isExternalLink(String url) {
        // Non-web links
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            return true;
        }
        
        // Social media and external services
        String[] externalDomains = {
            "facebook.com", "twitter.com", "instagram.com", "linkedin.com",
            "whatsapp.com", "telegram.org", "youtube.com", "maps.google.com",
            "play.google.com", "apps.apple.com"
        };
        
        for (String domain : externalDomains) {
            if (url.contains(domain)) {
                return true;
            }
        }
        
        // Keep calk.kg links internal
        if (url.contains("calk.kg")) {
            return false;
        }
        
        return false;
    }

    private void loadWebsite() {
        errorScreen.setVisibility(View.GONE);
        webView.setVisibility(View.VISIBLE);
        webView.loadUrl(WEBSITE_URL);
    }

    private void hideSplashScreen() {
        splashScreen.animate()
            .alpha(0f)
            .setDuration(300)
            .withEndAction(() -> splashScreen.setVisibility(View.GONE))
            .start();
    }

    private void showErrorScreen() {
        splashScreen.setVisibility(View.GONE);
        webView.setVisibility(View.GONE);
        errorScreen.setVisibility(View.VISIBLE);
    }

    public void onRetryClick(View view) {
        if (isNetworkAvailable()) {
            errorScreen.setVisibility(View.GONE);
            webView.setVisibility(View.VISIBLE);
            splashScreen.setVisibility(View.VISIBLE);
            splashScreen.setAlpha(1f);
            isFirstLoad = true;
            loadWebsite();
        }
    }

    private boolean isNetworkAvailable() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
        if (cm != null) {
            NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
            return activeNetwork != null && activeNetwork.isConnected();
        }
        return false;
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        // Handle back button - go back in WebView history
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
            webView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    protected void onResume() {
        super.onResume();
        webView.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        webView.onPause();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }
}

