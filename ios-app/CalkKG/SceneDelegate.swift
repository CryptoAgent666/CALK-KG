//
//  SceneDelegate.swift
//  CalkKG
//

import UIKit

class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    var window: UIWindow?

    func scene(_ scene: UIScene,
               willConnectTo session: UISceneSession,
               options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = (scene as? UIWindowScene) else { return }

        let window = UIWindow(windowScene: windowScene)
        // Use Tab Bar Controller as root for App Store Guideline 4.2 compliance:
        // 4 distinct sections (Home/Bookmarks/Currency/Settings) — 3 of which are
        // 100% native (no WKWebView), providing meaningful native functionality.
        window.rootViewController = RootTabBarController()
        self.window = window
        window.makeKeyAndVisible()
    }
}
