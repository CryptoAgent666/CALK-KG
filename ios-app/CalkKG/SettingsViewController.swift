//
//  SettingsViewController.swift
//  CalkKG
//
//  Native "Settings" screen — language toggle, app info, support links.
//  All state managed via UserDefaults (no WebView).
//

import UIKit

final class SettingsViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {

    static let languageKey = "calkkg.preferredLanguage"
    static let languageChangedNotification = Notification.Name("calkkg.language.changed")

    private enum Section: Int, CaseIterable {
        case language
        case notifications
        case about
        case support
        case appInfo

        var title: String {
            switch self {
            case .language: return "Язык"
            case .notifications: return "Уведомления"
            case .about: return "О приложении"
            case .support: return "Поддержка"
            case .appInfo: return "Информация"
            }
        }
    }

    private lazy var tableView: UITableView = {
        let tv = UITableView(frame: .zero, style: .insetGrouped)
        tv.dataSource = self
        tv.delegate = self
        tv.register(UITableViewCell.self, forCellReuseIdentifier: "Cell")
        tv.translatesAutoresizingMaskIntoConstraints = false
        return tv
    }()

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .systemGroupedBackground
        title = "Настройки"
        navigationController?.navigationBar.prefersLargeTitles = true

        view.addSubview(tableView)
        NSLayoutConstraint.activate([
            tableView.topAnchor.constraint(equalTo: view.topAnchor),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
        ])
    }

    private var currentLanguage: String {
        UserDefaults.standard.string(forKey: Self.languageKey) ?? "ru"
    }

    private func setLanguage(_ lang: String) {
        UserDefaults.standard.set(lang, forKey: Self.languageKey)
        NotificationCenter.default.post(name: Self.languageChangedNotification, object: lang)
        tableView.reloadSections(IndexSet(integer: Section.language.rawValue), with: .automatic)
    }

    /// Toggle the daily currency reminder.
    /// First call triggers the OS permission prompt; subsequent calls
    /// just enable/disable our scheduled notification.
    private func toggleNotifications() {
        let mgr = NotificationsManager.shared
        if mgr.isEnabled {
            mgr.cancelReminder()
            tableView.reloadSections(IndexSet(integer: Section.notifications.rawValue), with: .automatic)
        } else {
            mgr.requestPermission { [weak self] granted in
                if granted {
                    mgr.scheduleDailyReminder()
                } else {
                    let alert = UIAlertController(
                        title: "Уведомления отключены",
                        message: "Разрешите уведомления в Настройках iOS → Calk.KG, чтобы получать ежедневные напоминания.",
                        preferredStyle: .alert
                    )
                    alert.addAction(UIAlertAction(title: "OK", style: .default))
                    self?.present(alert, animated: true)
                }
                self?.tableView.reloadSections(IndexSet(integer: Section.notifications.rawValue), with: .automatic)
            }
        }
    }

    // MARK: - UITableViewDataSource

    func numberOfSections(in tableView: UITableView) -> Int { Section.allCases.count }

    func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        Section(rawValue: section)?.title
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        switch Section(rawValue: section) {
        case .language: return 2
        case .notifications: return 1
        case .about: return 2
        case .support: return 3
        case .appInfo: return 2
        default: return 0
        }
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "Cell", for: indexPath)
        var content = cell.defaultContentConfiguration()
        cell.accessoryType = .none
        cell.selectionStyle = .default

        switch Section(rawValue: indexPath.section) {
        case .language:
            let langs = [("ru", "Русский", "🇷🇺"), ("ky", "Кыргызча", "🇰🇬")]
            let (code, name, flag) = langs[indexPath.row]
            content.text = "\(flag)  \(name)"
            cell.accessoryType = currentLanguage == code ? .checkmark : .none

        case .notifications:
            content.text = "Напоминание о курсах валют (10:00)"
            content.image = UIImage(systemName: "bell")
            content.secondaryText = NotificationsManager.shared.isEnabled
                ? "Ежедневно в 10:00"
                : "Выключено — нажмите чтобы включить"
            cell.accessoryType = NotificationsManager.shared.isEnabled ? .checkmark : .none
            cell.selectionStyle = .default

        case .about:
            switch indexPath.row {
            case 0:
                content.text = "Веб-сайт calk.kg"
                content.image = UIImage(systemName: "globe")
                cell.accessoryType = .disclosureIndicator
            case 1:
                content.text = "О проекте"
                content.image = UIImage(systemName: "info.circle")
                cell.accessoryType = .disclosureIndicator
            default: break
            }

        case .support:
            switch indexPath.row {
            case 0:
                content.text = "Написать в поддержку"
                content.image = UIImage(systemName: "envelope")
                cell.accessoryType = .disclosureIndicator
            case 1:
                content.text = "Оценить в App Store"
                content.image = UIImage(systemName: "star")
                cell.accessoryType = .disclosureIndicator
            case 2:
                content.text = "Поделиться приложением"
                content.image = UIImage(systemName: "square.and.arrow.up")
                cell.accessoryType = .disclosureIndicator
            default: break
            }

        case .appInfo:
            switch indexPath.row {
            case 0:
                let version = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0"
                let build = Bundle.main.infoDictionary?["CFBundleVersion"] as? String ?? "1"
                content.text = "Версия"
                content.secondaryText = "\(version) (\(build))"
                cell.selectionStyle = .none
            case 1:
                content.text = "Политика конфиденциальности"
                content.image = UIImage(systemName: "lock.shield")
                cell.accessoryType = .disclosureIndicator
            default: break
            }

        default: break
        }

        cell.contentConfiguration = content
        return cell
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)

        switch Section(rawValue: indexPath.section) {
        case .language:
            setLanguage(indexPath.row == 0 ? "ru" : "ky")
        case .notifications:
            toggleNotifications()
        case .about:
            switch indexPath.row {
            case 0: openURL("https://calk.kg")
            case 1: openURL("https://calk.kg/about/")
            default: break
            }
        case .support:
            switch indexPath.row {
            case 0:
                if let u = URL(string: "mailto:info@calk.kg?subject=Calk.KG%20iOS%20feedback") {
                    UIApplication.shared.open(u)
                }
            case 1:
                if let u = URL(string: "itms-apps://apps.apple.com/app/id6771220038?action=write-review") {
                    UIApplication.shared.open(u)
                }
            case 2: presentShare()
            default: break
            }
        case .appInfo:
            if indexPath.row == 1 { openURL("https://calk.kg/privacy-policy/") }
        default: break
        }
    }

    private func openURL(_ str: String) {
        guard let u = URL(string: str) else { return }
        UIApplication.shared.open(u)
    }

    private func presentShare() {
        let items: [Any] = [
            "Calk.KG — 35+ калькуляторов для Кыргызстана",
            URL(string: "https://apps.apple.com/app/id6771220038")!
        ]
        let vc = UIActivityViewController(activityItems: items, applicationActivities: nil)
        if let pop = vc.popoverPresentationController {
            pop.sourceView = view
            pop.sourceRect = CGRect(x: view.bounds.midX, y: view.bounds.midY, width: 0, height: 0)
            pop.permittedArrowDirections = []
        }
        present(vc, animated: true)
    }
}
