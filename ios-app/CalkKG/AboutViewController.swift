//
//  AboutViewController.swift
//  CalkKG
//
//  Native "About" screen — accessed via long-press on the share button.
//  Adds native functionality beyond the WebView to satisfy App Store
//  Review Guideline 4.2 (Minimum Functionality) and 4.3 (Spam).
//
//  Includes:
//    • App version & build number
//    • Privacy Policy / Terms of Service links (open in WebView)
//    • Contact email
//    • Website link
//    • Brief feature list (so the listing isn't just a webview)
//

import UIKit

final class AboutViewController: UIViewController {

    /// Called when user taps a website-internal link.
    /// Returns path to load (e.g. "/privacy-policy/", "/contact/").
    var onNavigateToPath: ((String) -> Void)?

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .systemBackground
        title = "О приложении"

        navigationItem.rightBarButtonItem = UIBarButtonItem(
            barButtonSystemItem: .done,
            target: self,
            action: #selector(close)
        )

        setupUI()
    }

    private func setupUI() {
        let scroll = UIScrollView()
        scroll.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(scroll)

        let stack = UIStackView()
        stack.axis = .vertical
        stack.spacing = 16
        stack.alignment = .fill
        stack.layoutMargins = UIEdgeInsets(top: 24, left: 20, bottom: 24, right: 20)
        stack.isLayoutMarginsRelativeArrangement = true
        stack.translatesAutoresizingMaskIntoConstraints = false
        scroll.addSubview(stack)

        // Logo / title
        let titleLabel = UILabel()
        titleLabel.text = "Calk.KG"
        titleLabel.font = .systemFont(ofSize: 36, weight: .bold)
        titleLabel.textColor = UIColor(red: 220/255, green: 38/255, blue: 38/255, alpha: 1)
        titleLabel.textAlignment = .center

        let subtitleLabel = UILabel()
        subtitleLabel.text = "Калькуляторы Кыргызстана"
        subtitleLabel.font = .systemFont(ofSize: 17)
        subtitleLabel.textColor = .secondaryLabel
        subtitleLabel.textAlignment = .center

        let version = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0"
        let build = Bundle.main.infoDictionary?["CFBundleVersion"] as? String ?? "1"
        let versionLabel = UILabel()
        versionLabel.text = "Версия \(version) (\(build))"
        versionLabel.font = .systemFont(ofSize: 14)
        versionLabel.textColor = .tertiaryLabel
        versionLabel.textAlignment = .center

        let descLabel = UILabel()
        descLabel.text = "Более 35 калькуляторов для жителей Кыргызстана. Зарплата, налоги, кредиты, коммунальные услуги, пенсии и многое другое. Все расчёты основаны на актуальном законодательстве КР."
        descLabel.font = .systemFont(ofSize: 15)
        descLabel.textColor = .label
        descLabel.numberOfLines = 0
        descLabel.textAlignment = .center

        // Buttons section
        let websiteButton = makeButton(title: "🌐 Открыть сайт", action: #selector(openWebsite))
        let privacyButton = makeButton(title: "🔒 Политика конфиденциальности", action: #selector(openPrivacy))
        let termsButton = makeButton(title: "📄 Условия использования", action: #selector(openTerms))
        let contactButton = makeButton(title: "✉️ Написать нам", action: #selector(openEmail))
        let rateButton = makeButton(title: "⭐ Оценить в App Store", action: #selector(openAppStore))

        let copyrightLabel = UILabel()
        copyrightLabel.text = "© 2026 Calk.KG\nСделано в Кыргызстане 🇰🇬"
        copyrightLabel.font = .systemFont(ofSize: 12)
        copyrightLabel.textColor = .tertiaryLabel
        copyrightLabel.textAlignment = .center
        copyrightLabel.numberOfLines = 0

        [titleLabel, subtitleLabel, versionLabel, makeSpacer(20),
         descLabel, makeSpacer(16),
         websiteButton, privacyButton, termsButton, contactButton, rateButton,
         makeSpacer(20), copyrightLabel].forEach { stack.addArrangedSubview($0) }

        NSLayoutConstraint.activate([
            scroll.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            scroll.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scroll.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            scroll.bottomAnchor.constraint(equalTo: view.bottomAnchor),

            stack.topAnchor.constraint(equalTo: scroll.topAnchor),
            stack.leadingAnchor.constraint(equalTo: scroll.leadingAnchor),
            stack.trailingAnchor.constraint(equalTo: scroll.trailingAnchor),
            stack.bottomAnchor.constraint(equalTo: scroll.bottomAnchor),
            stack.widthAnchor.constraint(equalTo: scroll.widthAnchor),
        ])
    }

    private func makeButton(title: String, action: Selector) -> UIButton {
        let button = UIButton(type: .system)
        var cfg = UIButton.Configuration.tinted()
        cfg.title = title
        cfg.baseForegroundColor = UIColor(red: 220/255, green: 38/255, blue: 38/255, alpha: 1)
        cfg.baseBackgroundColor = UIColor(red: 220/255, green: 38/255, blue: 38/255, alpha: 1)
        cfg.cornerStyle = .medium
        cfg.contentInsets = NSDirectionalEdgeInsets(top: 14, leading: 16, bottom: 14, trailing: 16)
        cfg.titleAlignment = .leading
        button.configuration = cfg
        button.contentHorizontalAlignment = .leading
        button.addTarget(self, action: action, for: .touchUpInside)
        return button
    }

    private func makeSpacer(_ height: CGFloat) -> UIView {
        let v = UIView()
        v.heightAnchor.constraint(equalToConstant: height).isActive = true
        return v
    }

    // MARK: - Actions

    @objc private func close() {
        dismiss(animated: true)
    }

    @objc private func openWebsite() {
        dismiss(animated: true) { [weak self] in
            self?.onNavigateToPath?("/")
        }
    }

    @objc private func openPrivacy() {
        dismiss(animated: true) { [weak self] in
            self?.onNavigateToPath?("/privacy-policy/")
        }
    }

    @objc private func openTerms() {
        dismiss(animated: true) { [weak self] in
            self?.onNavigateToPath?("/terms-of-service/")
        }
    }

    @objc private func openEmail() {
        if let url = URL(string: "mailto:info@calk.kg?subject=Calk.KG%20iOS%20App") {
            UIApplication.shared.open(url)
        }
    }

    @objc private func openAppStore() {
        // Replace with actual App Store URL after publish
        if let url = URL(string: "itms-apps://apps.apple.com/app/id0000000000?action=write-review") {
            UIApplication.shared.open(url)
        }
    }
}
