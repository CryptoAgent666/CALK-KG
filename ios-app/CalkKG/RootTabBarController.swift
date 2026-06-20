//
//  RootTabBarController.swift
//  CalkKG
//
//  Tab Bar root — 5 native tabs, NONE require WKWebView at launch:
//    1. Калькуляторы — UITableView hub listing 6 native calculators
//       (Зарплата, Кредит, Ипотека, Растаможка, Калории, ИМТ).
//       Each row pushes a fully-native UIKit screen.
//    2. Курсы        — NBKR XML parser + converter (native).
//    3. История      — UserDefaults-persisted saved calculations + share.
//    4. Избранное    — Bookmarks (native list).
//    5. Ещё          — Web catalog, Settings, About.
//
//  This is the App Store 4.2 answer: the WebView is no longer a primary
//  tab — it only opens when the user explicitly taps a calculator inside
//  "Ещё → Все калькуляторы (35)" or a bookmark.
//

import UIKit

final class RootTabBarController: UITabBarController, UITabBarControllerDelegate {

    /// Reused WebViewController for the web catalog + bookmark deep-links.
    private let webViewController = WebViewController()

    override func viewDidLoad() {
        super.viewDidLoad()
        delegate = self

        // 1. Калькуляторы — hub UITableView listing all 6 native calcs
        let hub = CalculatorsHubViewController()
        let hubNav = UINavigationController(rootViewController: hub)
        hubNav.navigationBar.prefersLargeTitles = true
        hubNav.tabBarItem = UITabBarItem(
            title: "Калькуляторы",
            image: UIImage(systemName: "function"),
            selectedImage: UIImage(systemName: "function")
        )

        // 2. Курсы — native NBKR XML
        let currency = CurrencyRatesViewController()
        let currencyNav = UINavigationController(rootViewController: currency)
        currencyNav.navigationBar.prefersLargeTitles = true
        currencyNav.tabBarItem = UITabBarItem(
            title: "Курсы",
            image: UIImage(systemName: "arrow.left.arrow.right"),
            selectedImage: UIImage(systemName: "arrow.left.arrow.right.circle.fill")
        )

        // 3. История
        let history = HistoryViewController()
        let historyNav = UINavigationController(rootViewController: history)
        historyNav.navigationBar.prefersLargeTitles = true
        historyNav.tabBarItem = UITabBarItem(
            title: "История",
            image: UIImage(systemName: "clock"),
            selectedImage: UIImage(systemName: "clock.fill")
        )

        // 4. Избранное — Bookmarks
        let bookmarks = BookmarksViewController()
        bookmarks.onOpenCalculator = { [weak self] slug in
            self?.openCalculatorFromBookmark(slug: slug)
        }
        let bookmarksNav = UINavigationController(rootViewController: bookmarks)
        bookmarksNav.navigationBar.prefersLargeTitles = true
        bookmarksNav.tabBarItem = UITabBarItem(
            title: "Избранное",
            image: UIImage(systemName: "star"),
            selectedImage: UIImage(systemName: "star.fill")
        )

        // 5. Ещё
        let more = MoreViewController(webViewController: webViewController)
        let moreNav = UINavigationController(rootViewController: more)
        moreNav.navigationBar.prefersLargeTitles = true
        moreNav.tabBarItem = UITabBarItem(
            title: "Ещё",
            image: UIImage(systemName: "ellipsis.circle"),
            selectedImage: UIImage(systemName: "ellipsis.circle.fill")
        )

        viewControllers = [hubNav, currencyNav, historyNav, bookmarksNav, moreNav]

        // Deep-link to specific tab via env var (used for App Store screenshots).
        // CALK_INITIAL_TAB: 0=Calculators, 1=Currency, 2=History, 3=Bookmarks, 4=More
        if let tabStr = ProcessInfo.processInfo.environment["CALK_INITIAL_TAB"],
           let tabIdx = Int(tabStr),
           (0..<viewControllers!.count).contains(tabIdx) {
            selectedIndex = tabIdx
        }

        // Preload demo data for screenshot mode
        if ProcessInfo.processInfo.environment["CALK_SCREENSHOT_MODE"] == "1" {
            CalculationHistoryStore.shared.clearAll()
            CalculationHistoryStore.shared.add(.salary(
                gross: 50_000, rate: 0.10, net: 40_500, createdAt: Date().addingTimeInterval(-3600)
            ))
            CalculationHistoryStore.shared.add(.loan(
                principal: 500_000, ratePct: 24, months: 24, payment: 26_436, createdAt: Date().addingTimeInterval(-7200)
            ))
            UserDefaults.standard.set(
                ["salary", "currency-exchange", "loan", "mortgage", "electricity", "customs"],
                forKey: BookmarksViewController.storageKey
            )
        }

        // Brand-color tint
        tabBar.tintColor = UIColor(red: 220/255, green: 38/255, blue: 38/255, alpha: 1)

        if #available(iOS 15.0, *) {
            let appearance = UITabBarAppearance()
            appearance.configureWithDefaultBackground()
            tabBar.standardAppearance = appearance
            tabBar.scrollEdgeAppearance = appearance
        }
    }

    /// Opens a calculator from a bookmark tap. Routes to the "Ещё" tab and
    /// pushes the WebView there — keeps the native tabs visually intact.
    func openCalculatorFromBookmark(slug: String) {
        let lang = UserDefaults.standard.string(forKey: SettingsViewController.languageKey) ?? "ru"
        let prefix = lang == "ky" ? "/ky" : ""
        let url = "https://calk.kg\(prefix)/calculator/\(slug)/"
        selectedIndex = 4 // More tab
        if let moreNav = viewControllers?[4] as? UINavigationController {
            moreNav.popToRootViewController(animated: false)
            webViewController.loadURL(URL(string: url)!)
            moreNav.pushViewController(webViewController, animated: true)
        }
    }
}
