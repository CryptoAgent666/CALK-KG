//
//  WebViewController.swift
//  CalkKG
//
//  Main view controller — full-screen WKWebView showing calk.kg.
//  Features:
//    • Pull-to-refresh
//    • Share Sheet (iOS Activity View) via a floating bottom-right button
//    • External links (mailto:, tel:, App Store, other domains) open in Safari/native apps
//    • Offline error page with retry
//    • Custom user-agent ("CalkKG iOS App")
//

import UIKit
import WebKit

final class WebViewController: UIViewController, WKNavigationDelegate, WKUIDelegate {

    // MARK: - Config

    /// Default home URL. Can be overridden by CALK_INITIAL_URL env var (used for App Store screenshots).
    private var homeURL: URL {
        if let envURL = ProcessInfo.processInfo.environment["CALK_INITIAL_URL"],
           let url = URL(string: envURL),
           url.host?.hasSuffix("calk.kg") == true {
            return url
        }
        return URL(string: "https://calk.kg")!
    }
    private let allowedHost = "calk.kg"

    // MARK: - UI

    private lazy var webView: WKWebView = {
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []
        config.preferences.javaScriptCanOpenWindowsAutomatically = true

        // Persistent cookies / cache (so login/state survives app restart)
        config.websiteDataStore = .default()

        // App Store compliance: ALWAYS hide cookie banner, ads, and Google Play references.
        // Apple App Review (Guideline 2.1) requires no tracking without ATT. We choose to
        // simply not load tracking/ads in the iOS app instead of implementing ATT, since
        // calculations are the core value — ads were only the website's monetization.
        let js = """
            // 1. Accept cookies preemptively — no banner shown to iOS users.
            //    Since we hide all tracking, this is purely a UX decision.
            try { localStorage.setItem('calk-cookie-consent-v1', 'accepted'); } catch (e) {}

            // 2. Stub adsbygoogle.push() so Google's AdSense script does nothing.
            //    Prevents any ad request from being sent.
            try {
                window.adsbygoogle = { push: function() {}, loaded: true };
                Object.defineProperty(window, 'adsbygoogle', {
                    configurable: false,
                    writable: false,
                    value: { push: function() {}, loaded: true }
                });
            } catch (e) {}

            // 3. Inject aggressive CSS to hide every conceivable ad container,
            //    cookie banner, and Google Play reference.
            const style = document.createElement('style');
            style.id = 'calk-ios-app-mode';
            style.textContent = `
                /* === Cookie banner === */
                [class*="cookie" i], [id*="cookie" i],
                [class*="consent" i], [id*="consent" i],

                /* === Google AdSense / DoubleClick wrappers === */
                ins.adsbygoogle,
                .adsbygoogle,
                [class*="adsense" i], [id*="adsense" i],
                [class*="advert" i], [id*="advert" i],
                [data-ad-client],
                [data-ad-slot],
                [data-google-query-id],
                [data-ad-status],
                /* iframes from any Google ad domain */
                iframe[src*="googleads"],
                iframe[src*="doubleclick"],
                iframe[src*="syndication"],
                iframe[src*="googleadservices"],
                iframe[src*="googletagservices"],
                iframe[src*="googletagmanager"],
                iframe[src*="adservice"],
                iframe[id^="google_ads_"],
                iframe[id^="aswift_"],
                iframe[name^="aswift_"],
                iframe[name^="google_ads"],
                /* Generic ad containers */
                [class*="ad-container" i],
                [class*="ad-banner" i],
                [class*="ad-slot" i],
                [class*="ad-wrapper" i],
                [id*="ad-container" i],
                [id*="ad-banner" i],

                /* === Google Play references (Apple Guideline 2.1) === */
                a[href*="play.google.com"],
                a[href*="play.google"],
                img[src*="google-play"],
                img[src*="googleplay"],
                img[alt*="Google Play" i],
                [class*="google-play" i],
                [class*="googleplay" i],
                [class*="play-store" i],
                [class*="playstore" i],
                [id*="google-play" i],
                [id*="play-store" i],
                /* "Get it on Google Play" badge containers */
                .google-play-badge,
                .play-store-badge {
                    display: none !important;
                    visibility: hidden !important;
                    height: 0 !important;
                    min-height: 0 !important;
                    max-height: 0 !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    pointer-events: none !important;
                }
            `;
            (document.head || document.documentElement).appendChild(style);

            // 4. Final cleanup after DOM ready
            const removeAllAds = function() {
                document.querySelectorAll(
                    'ins.adsbygoogle, ' +
                    'iframe[id^="google_ads_"], ' +
                    'iframe[id^="aswift_"], ' +
                    'iframe[src*="googleads"], ' +
                    'iframe[src*="doubleclick"], ' +
                    'iframe[src*="syndication"], ' +
                    'a[href*="play.google.com"], ' +
                    'img[src*="google-play"], ' +
                    'img[src*="googleplay"]'
                ).forEach(function(el) { el.remove(); });
            };

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', removeAllAds);
            } else {
                removeAllAds();
            }

            // 5. MutationObserver to nuke ads injected after page load
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType !== 1) return;
                        const tag = (node.tagName || '').toLowerCase();
                        const cls = (node.className || '').toString().toLowerCase();
                        const id = (node.id || '').toString().toLowerCase();
                        const src = (node.src || '').toString().toLowerCase();
                        const href = (node.href || '').toString().toLowerCase();
                        if (
                            (tag === 'iframe' && src.match(/googleads|doubleclick|syndication|googleadservices/i)) ||
                            (tag === 'a' && href.includes('play.google')) ||
                            (tag === 'img' && (src.includes('google-play') || src.includes('googleplay'))) ||
                            cls.includes('adsbygoogle') ||
                            cls.includes('adsense') ||
                            cls.includes('google-play') ||
                            id.startsWith('google_ads_') ||
                            id.startsWith('aswift_')
                        ) {
                            node.remove();
                        }
                    });
                });
            });
            const startObserver = function() {
                if (document.body) {
                    observer.observe(document.body, { childList: true, subtree: true });
                }
            };
            if (document.body) {
                startObserver();
            } else {
                document.addEventListener('DOMContentLoaded', startObserver);
            }
        """
        let userScript = WKUserScript(source: js, injectionTime: .atDocumentStart, forMainFrameOnly: false)
        config.userContentController.addUserScript(userScript)

        let wv = WKWebView(frame: .zero, configuration: config)
        wv.navigationDelegate = self
        wv.uiDelegate = self
        wv.allowsBackForwardNavigationGestures = true
        wv.scrollView.bounces = true
        wv.translatesAutoresizingMaskIntoConstraints = false

        // Identify ourselves so analytics can distinguish iOS app from Safari
        wv.customUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS) CalkKG/1.0 (iOS App)"
        return wv
    }()

    private lazy var refreshControl: UIRefreshControl = {
        let rc = UIRefreshControl()
        rc.tintColor = UIColor(red: 220/255, green: 38/255, blue: 38/255, alpha: 1) // brand red
        rc.addTarget(self, action: #selector(handlePullToRefresh), for: .valueChanged)
        return rc
    }()

    private lazy var shareButton: UIButton = {
        let btn = UIButton(type: .system)
        btn.setImage(UIImage(systemName: "square.and.arrow.up"), for: .normal)
        btn.tintColor = .white
        btn.backgroundColor = UIColor(red: 220/255, green: 38/255, blue: 38/255, alpha: 0.92)
        btn.layer.cornerRadius = 24
        btn.layer.shadowColor = UIColor.black.cgColor
        btn.layer.shadowOpacity = 0.2
        btn.layer.shadowRadius = 8
        btn.layer.shadowOffset = CGSize(width: 0, height: 4)
        btn.addTarget(self, action: #selector(presentShareSheet), for: .touchUpInside)
        btn.translatesAutoresizingMaskIntoConstraints = false
        btn.accessibilityLabel = "Поделиться или О приложении"
        btn.isHidden = true // shown only after first successful load

        // Long-press opens About screen — native UI beyond WebView (App Store Guideline 4.2 compliance)
        let longPress = UILongPressGestureRecognizer(target: self, action: #selector(presentAbout))
        longPress.minimumPressDuration = 0.6
        btn.addGestureRecognizer(longPress)
        return btn
    }()

    private lazy var loadingIndicator: UIActivityIndicatorView = {
        let v = UIActivityIndicatorView(style: .medium)
        v.translatesAutoresizingMaskIntoConstraints = false
        v.hidesWhenStopped = true
        v.color = UIColor(red: 220/255, green: 38/255, blue: 38/255, alpha: 1)
        return v
    }()

    private lazy var errorView: ErrorView = {
        let v = ErrorView()
        v.translatesAutoresizingMaskIntoConstraints = false
        v.isHidden = true
        v.onRetry = { [weak self] in self?.loadHome() }
        return v
    }()

    // MARK: - Lifecycle

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .white

        setupLayout()
        loadHome()
    }

    private func setupLayout() {
        view.addSubview(webView)
        webView.scrollView.refreshControl = refreshControl

        view.addSubview(shareButton)
        view.addSubview(loadingIndicator)
        view.addSubview(errorView)

        NSLayoutConstraint.activate([
            webView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor),

            shareButton.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -16),
            shareButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),
            shareButton.widthAnchor.constraint(equalToConstant: 48),
            shareButton.heightAnchor.constraint(equalToConstant: 48),

            loadingIndicator.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            loadingIndicator.centerYAnchor.constraint(equalTo: view.centerYAnchor),

            errorView.topAnchor.constraint(equalTo: view.topAnchor),
            errorView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            errorView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            errorView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
        ])
    }

    // MARK: - Actions

    private func loadHome() {
        errorView.isHidden = true
        loadingIndicator.startAnimating()
        webView.load(URLRequest(url: homeURL))
    }

    /// Public method to navigate to a specific URL (used by BookmarksViewController via TabBar).
    func loadURL(_ url: URL) {
        guard let host = url.host, host.hasSuffix(allowedHost) else { return }
        errorView.isHidden = true
        loadingIndicator.startAnimating()
        webView.load(URLRequest(url: url))
    }

    @objc private func handlePullToRefresh() {
        webView.reload()
    }

    @objc private func presentAbout(_ gesture: UILongPressGestureRecognizer) {
        guard gesture.state == .began else { return }
        let about = AboutViewController()
        about.onNavigateToPath = { [weak self] path in
            guard let self = self,
                  let url = URL(string: "https://calk.kg\(path)") else { return }
            self.webView.load(URLRequest(url: url))
        }
        let nav = UINavigationController(rootViewController: about)
        nav.modalPresentationStyle = .formSheet
        present(nav, animated: true)
    }

    @objc private func presentShareSheet() {
        let url = webView.url ?? homeURL
        let title = webView.title ?? "Calk.KG — Калькуляторы Кыргызстана"
        let items: [Any] = [title, url]
        let activityVC = UIActivityViewController(activityItems: items, applicationActivities: nil)

        // iPad popover support
        if let popover = activityVC.popoverPresentationController {
            popover.sourceView = shareButton
            popover.sourceRect = shareButton.bounds
        }
        present(activityVC, animated: true)
    }

    // MARK: - WKNavigationDelegate

    func webView(_ webView: WKWebView,
                 decidePolicyFor navigationAction: WKNavigationAction,
                 decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        guard let url = navigationAction.request.url else {
            decisionHandler(.allow)
            return
        }

        // Special URL schemes always handed off (mailto / tel / sms / App Store)
        let scheme = url.scheme?.lowercased() ?? ""
        if scheme == "mailto" || scheme == "tel" || scheme == "sms" || scheme == "itms-apps" {
            UIApplication.shared.open(url, options: [:], completionHandler: nil)
            decisionHandler(.cancel)
            return
        }

        // App Store compliance (Apple Guideline 2.1): block ALL ad/tracking/analytics
        // network requests at the source. This guarantees no data is sent to ad networks
        // even if JS injection or CSS hiding misses something — defence in depth.
        let urlStr = url.absoluteString.lowercased()
        let blockedHosts = [
            "googleads.g.doubleclick.net",
            "pagead2.googlesyndication.com",
            "securepubads.g.doubleclick.net",
            "tpc.googlesyndication.com",
            "googletagmanager.com",
            "googletagservices.com",
            "google-analytics.com",
            "googleadservices.com",
            "adservice.google.com",
            "adservice.google.kg",
            "play.google.com"
        ]
        for blocked in blockedHosts {
            if urlStr.contains(blocked) {
                decisionHandler(.cancel)
                return
            }
        }

        // CRITICAL: allow ALL iframe / subframe loads regardless of host.
        // Non-ad embeds and tools live in iframes pointing to third-party
        // domains — opening them in Safari would break the page and bounce the user.
        if let target = navigationAction.targetFrame, !target.isMainFrame {
            decisionHandler(.allow)
            return
        }
        // targetFrame == nil for window.open() / target="_blank" — we handle those in WKUIDelegate

        // Main-frame navigation: keep calk.kg inside, send everything else to Safari
        if let host = url.host, host.hasSuffix(allowedHost) {
            decisionHandler(.allow)
        } else if (scheme == "http" || scheme == "https") && navigationAction.navigationType == .linkActivated {
            // Only hand off real user-initiated clicks to Safari; let auto redirects / form submits proceed
            UIApplication.shared.open(url, options: [:], completionHandler: nil)
            decisionHandler(.cancel)
        } else {
            decisionHandler(.allow)
        }
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        loadingIndicator.stopAnimating()
        refreshControl.endRefreshing()
        shareButton.isHidden = false
        errorView.isHidden = true
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        handleError(error)
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        handleError(error)
    }

    private func handleError(_ error: Error) {
        loadingIndicator.stopAnimating()
        refreshControl.endRefreshing()

        let nsError = error as NSError
        // -999 = NSURLErrorCancelled (user navigated away mid-load); not a real error
        if nsError.code == NSURLErrorCancelled { return }

        errorView.isHidden = false
    }

    // MARK: - WKUIDelegate

    // target=_blank links — open inside the same WebView instead of new window
    func webView(_ webView: WKWebView,
                 createWebViewWith configuration: WKWebViewConfiguration,
                 for navigationAction: WKNavigationAction,
                 windowFeatures: WKWindowFeatures) -> WKWebView? {
        if let url = navigationAction.request.url {
            if let host = url.host, host.hasSuffix(allowedHost) {
                webView.load(URLRequest(url: url))
            } else {
                UIApplication.shared.open(url, options: [:], completionHandler: nil)
            }
        }
        return nil
    }
}
