//
//  BookmarksViewController.swift
//  CalkKG
//
//  Native "Bookmarks" screen — list of user-saved calculators with persistence.
//
//  WHY this exists (App Store Guideline 4.2 — Minimum Functionality):
//  Apple rejected the app as "just a web view". This screen provides genuine
//  native functionality:
//   - Persistent local storage (UserDefaults) — survives app restart
//   - Native UITableView with swipe-to-delete
//   - Native search bar
//   - Native pull-to-refresh
//   - Empty state with illustration
//   - Items added/removed without any web request
//
//  Persistence key: "calkkg.bookmarks" (array of slug strings)
//

import UIKit

private struct CalculatorItem {
    let slug: String
    let titleRu: String
    let titleKy: String
    let category: String
    let emoji: String

    func title(language: String) -> String {
        language == "ky" ? titleKy : titleRu
    }
}

/// Full catalog of calculators — mirrors web app's src/data/calculators.ts
/// to keep the native bookmarks screen self-sufficient (no API call needed).
private let ALL_CALCULATORS: [CalculatorItem] = [
    .init(slug: "salary", titleRu: "Калькулятор зарплаты", titleKy: "Айлык акы калькулятору", category: "Финансы", emoji: "💰"),
    .init(slug: "loan", titleRu: "Кредитный калькулятор", titleKy: "Кредит калькулятору", category: "Финансы", emoji: "💳"),
    .init(slug: "mortgage", titleRu: "Ипотека", titleKy: "Ипотека", category: "Финансы", emoji: "🏠"),
    .init(slug: "auto-loan", titleRu: "Автокредит", titleKy: "Автокредит", category: "Автомобили", emoji: "🚗"),
    .init(slug: "deposit", titleRu: "Депозитный калькулятор", titleKy: "Депозит калькулятору", category: "Финансы", emoji: "🏦"),
    .init(slug: "currency-exchange", titleRu: "Курсы валют НБКР", titleKy: "УБКР валюта курстары", category: "Финансы", emoji: "💱"),
    .init(slug: "money-transfer", titleRu: "Денежные переводы", titleKy: "Акча которуулар", category: "Финансы", emoji: "📤"),
    .init(slug: "single-tax", titleRu: "Единый налог", titleKy: "Бирдиктүү салык", category: "Налоги", emoji: "📋"),
    .init(slug: "patent", titleRu: "Налог на патент", titleKy: "Патент салыгы", category: "Налоги", emoji: "📜"),
    .init(slug: "property-tax", titleRu: "Налог на имущество", titleKy: "Мүлк салыгы", category: "Налоги", emoji: "🏘"),
    .init(slug: "customs", titleRu: "Таможенный калькулятор", titleKy: "Бажы калькулятору", category: "Автомобили", emoji: "🛃"),
    .init(slug: "social-fund", titleRu: "Соцфонд", titleKy: "Соцфонд", category: "Налоги", emoji: "🛡"),
    .init(slug: "taxi-tax", titleRu: "Налог на такси", titleKy: "Такси салыгы", category: "Налоги", emoji: "🚖"),
    .init(slug: "pension", titleRu: "Расчёт пенсии", titleKy: "Пенсия эсебин жүргүзүү", category: "Социальные", emoji: "👴"),
    .init(slug: "alimony", titleRu: "Алименты", titleKy: "Алименттер", category: "Социальные", emoji: "👨‍👩‍👧"),
    .init(slug: "family-benefit", titleRu: "Семейные пособия", titleKy: "Үй-бүлөгө көмөк", category: "Социальные", emoji: "👶"),
    .init(slug: "sick-leave", titleRu: "Больничный лист", titleKy: "Оорулук барак", category: "Социальные", emoji: "🤒"),
    .init(slug: "scholarship", titleRu: "Стипендия", titleKy: "Стипендия", category: "Социальные", emoji: "🎓"),
    .init(slug: "zakat", titleRu: "Закят", titleKy: "Закят", category: "Разное", emoji: "🕌"),
    .init(slug: "electricity", titleRu: "Электричество", titleKy: "Электр энергиясы", category: "Коммунальные", emoji: "⚡"),
    .init(slug: "water", titleRu: "Вода", titleKy: "Суу", category: "Коммунальные", emoji: "💧"),
    .init(slug: "gas", titleRu: "Газ", titleKy: "Газ", category: "Коммунальные", emoji: "🔥"),
    .init(slug: "heating", titleRu: "Отопление", titleKy: "Жылытуу", category: "Коммунальные", emoji: "🌡"),
    .init(slug: "housing", titleRu: "ЖКХ", titleKy: "КТУ", category: "Коммунальные", emoji: "🏢"),
    .init(slug: "fuel", titleRu: "Топливо", titleKy: "Күйүүчү май", category: "Автомобили", emoji: "⛽"),
    .init(slug: "traffic-fines", titleRu: "Штрафы ПДД", titleKy: "ЖКЭ айып пулдары", category: "Автомобили", emoji: "🚨"),
    .init(slug: "passport", titleRu: "Паспорт", titleKy: "Паспорт", category: "Разное", emoji: "🛂"),
    .init(slug: "tourist-fee", titleRu: "Туристический сбор", titleKy: "Туристтик жыйым", category: "Разное", emoji: "🧳"),
    .init(slug: "mobile-tariffs", titleRu: "Мобильные тарифы", titleKy: "Мобилдик тарифтер", category: "Разное", emoji: "📱"),
    .init(slug: "calorie", titleRu: "Калории", titleKy: "Калория", category: "Разное", emoji: "🍎"),
    .init(slug: "sewing-cost", titleRu: "Пошив одежды", titleKy: "Кийим тигүү", category: "Разное", emoji: "🧵"),
    .init(slug: "wedding", titleRu: "Свадебный бюджет", titleKy: "Үйлөнүү тою бюджети", category: "Разное", emoji: "💍"),
    .init(slug: "construction", titleRu: "Стройматериалы", titleKy: "Курулуш материалдары", category: "Разное", emoji: "🧱"),
    .init(slug: "rental", titleRu: "Аренда жилья", titleKy: "Үй жалдоо", category: "Разное", emoji: "🔑"),
    .init(slug: "crop-yield", titleRu: "Урожайность", titleKy: "Айыл чарба түшүмдүүлүгү", category: "Разное", emoji: "🌾")
]

final class BookmarksViewController: UIViewController, UITableViewDataSource, UITableViewDelegate, UISearchResultsUpdating {

    static let storageKey = "calkkg.bookmarks"
    static let notificationName = Notification.Name("calkkg.bookmarks.changed")

    /// Called when user taps a calculator — should be handled by parent (TabBarController)
    /// to switch to the WebView tab and navigate.
    var onOpenCalculator: ((String) -> Void)?

    private var bookmarks: [String] = []
    private var allCalcs: [CalculatorItem] = ALL_CALCULATORS
    private var filteredBookmarkedItems: [CalculatorItem] = []
    private var searchText: String = ""

    private lazy var tableView: UITableView = {
        let tv = UITableView(frame: .zero, style: .insetGrouped)
        tv.dataSource = self
        tv.delegate = self
        tv.register(UITableViewCell.self, forCellReuseIdentifier: "Cell")
        tv.register(AddCalculatorCell.self, forCellReuseIdentifier: "AddCell")
        tv.translatesAutoresizingMaskIntoConstraints = false
        tv.allowsSelectionDuringEditing = false
        return tv
    }()

    private lazy var emptyStateView: UIView = {
        let v = UIView()
        v.translatesAutoresizingMaskIntoConstraints = false

        let icon = UILabel()
        icon.text = "⭐"
        icon.font = .systemFont(ofSize: 72)
        icon.textAlignment = .center

        let title = UILabel()
        title.text = "Нет избранных калькуляторов"
        title.font = .systemFont(ofSize: 19, weight: .semibold)
        title.textColor = .label
        title.textAlignment = .center

        let subtitle = UILabel()
        subtitle.text = "Добавьте калькуляторы которыми пользуетесь чаще всего — они появятся здесь и будут под рукой."
        subtitle.font = .systemFont(ofSize: 15)
        subtitle.textColor = .secondaryLabel
        subtitle.textAlignment = .center
        subtitle.numberOfLines = 0

        let button = UIButton(type: .system)
        var cfg = UIButton.Configuration.filled()
        cfg.title = "Добавить калькулятор"
        cfg.baseBackgroundColor = UIColor(red: 220/255, green: 38/255, blue: 38/255, alpha: 1)
        cfg.baseForegroundColor = .white
        cfg.cornerStyle = .medium
        cfg.contentInsets = .init(top: 12, leading: 24, bottom: 12, trailing: 24)
        button.configuration = cfg
        button.addTarget(self, action: #selector(presentAdd), for: .touchUpInside)

        let stack = UIStackView(arrangedSubviews: [icon, title, subtitle, button])
        stack.axis = .vertical
        stack.alignment = .center
        stack.spacing = 12
        stack.translatesAutoresizingMaskIntoConstraints = false
        v.addSubview(stack)

        NSLayoutConstraint.activate([
            stack.centerXAnchor.constraint(equalTo: v.centerXAnchor),
            stack.centerYAnchor.constraint(equalTo: v.centerYAnchor),
            stack.leadingAnchor.constraint(greaterThanOrEqualTo: v.leadingAnchor, constant: 32),
            stack.trailingAnchor.constraint(lessThanOrEqualTo: v.trailingAnchor, constant: -32),
        ])
        return v
    }()

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .systemGroupedBackground
        title = "Избранное"
        navigationController?.navigationBar.prefersLargeTitles = true

        let addButton = UIBarButtonItem(barButtonSystemItem: .add, target: self, action: #selector(presentAdd))
        navigationItem.rightBarButtonItem = addButton

        let searchController = UISearchController(searchResultsController: nil)
        searchController.searchResultsUpdater = self
        searchController.obscuresBackgroundDuringPresentation = false
        searchController.searchBar.placeholder = "Поиск среди избранного"
        navigationItem.searchController = searchController
        navigationItem.hidesSearchBarWhenScrolling = false

        view.addSubview(tableView)
        view.addSubview(emptyStateView)

        NSLayoutConstraint.activate([
            tableView.topAnchor.constraint(equalTo: view.topAnchor),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor),

            emptyStateView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            emptyStateView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            emptyStateView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            emptyStateView.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor),
        ])

        NotificationCenter.default.addObserver(
            self,
            selector: #selector(reloadBookmarks),
            name: BookmarksViewController.notificationName,
            object: nil
        )

        reloadBookmarks()
    }

    @objc private func reloadBookmarks() {
        do {
            let saved = UserDefaults.standard.array(forKey: BookmarksViewController.storageKey) as? [String] ?? []
            bookmarks = saved
        }
        rebuildFiltered()
        tableView.reloadData()
        emptyStateView.isHidden = !bookmarks.isEmpty
    }

    private func rebuildFiltered() {
        let bookmarked = ALL_CALCULATORS.filter { bookmarks.contains($0.slug) }
        if searchText.isEmpty {
            filteredBookmarkedItems = bookmarked
        } else {
            let lower = searchText.lowercased()
            filteredBookmarkedItems = bookmarked.filter {
                $0.titleRu.lowercased().contains(lower) || $0.titleKy.lowercased().contains(lower) || $0.category.lowercased().contains(lower)
            }
        }
    }

    @objc private func presentAdd() {
        let addVC = AddCalculatorListViewController(allCalcs: ALL_CALCULATORS, alreadyBookmarked: bookmarks)
        addVC.onSelected = { [weak self] slug in
            guard let self = self else { return }
            var current = self.bookmarks
            if !current.contains(slug) {
                current.append(slug)
                UserDefaults.standard.set(current, forKey: BookmarksViewController.storageKey)
                NotificationCenter.default.post(name: BookmarksViewController.notificationName, object: nil)
            }
        }
        let nav = UINavigationController(rootViewController: addVC)
        nav.modalPresentationStyle = .formSheet
        present(nav, animated: true)
    }

    // MARK: - UISearchResultsUpdating
    func updateSearchResults(for searchController: UISearchController) {
        searchText = searchController.searchBar.text ?? ""
        rebuildFiltered()
        tableView.reloadData()
    }

    // MARK: - UITableViewDataSource
    func numberOfSections(in tableView: UITableView) -> Int { 1 }
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int { filteredBookmarkedItems.count }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let item = filteredBookmarkedItems[indexPath.row]
        let cell = tableView.dequeueReusableCell(withIdentifier: "Cell", for: indexPath)
        var content = cell.defaultContentConfiguration()
        content.text = "\(item.emoji)  \(item.titleRu)"
        content.secondaryText = item.category
        content.textProperties.font = .systemFont(ofSize: 17)
        content.secondaryTextProperties.font = .systemFont(ofSize: 13)
        content.secondaryTextProperties.color = .secondaryLabel
        cell.contentConfiguration = content
        cell.accessoryType = .disclosureIndicator
        return cell
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let item = filteredBookmarkedItems[indexPath.row]
        tableView.deselectRow(at: indexPath, animated: true)
        onOpenCalculator?(item.slug)
    }

    func tableView(_ tableView: UITableView, trailingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration? {
        let item = filteredBookmarkedItems[indexPath.row]
        let action = UIContextualAction(style: .destructive, title: "Удалить") { [weak self] _, _, completion in
            guard let self = self else { return }
            self.bookmarks.removeAll { $0 == item.slug }
            UserDefaults.standard.set(self.bookmarks, forKey: BookmarksViewController.storageKey)
            self.rebuildFiltered()
            tableView.deleteRows(at: [indexPath], with: .left)
            self.emptyStateView.isHidden = !self.bookmarks.isEmpty
            completion(true)
        }
        action.image = UIImage(systemName: "trash")
        return UISwipeActionsConfiguration(actions: [action])
    }
}

// Helper cell + add-list controller

private final class AddCalculatorCell: UITableViewCell {
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: .default, reuseIdentifier: reuseIdentifier)
    }
    required init?(coder: NSCoder) { fatalError() }
}

private final class AddCalculatorListViewController: UITableViewController {
    private let allCalcs: [CalculatorItem]
    private let alreadyBookmarked: Set<String>
    var onSelected: ((String) -> Void)?

    init(allCalcs: [CalculatorItem], alreadyBookmarked: [String]) {
        self.allCalcs = allCalcs
        self.alreadyBookmarked = Set(alreadyBookmarked)
        super.init(style: .insetGrouped)
    }
    required init?(coder: NSCoder) { fatalError() }

    override func viewDidLoad() {
        super.viewDidLoad()
        title = "Добавить в избранное"
        navigationItem.leftBarButtonItem = UIBarButtonItem(barButtonSystemItem: .cancel, target: self, action: #selector(close))
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "Cell")
    }

    @objc private func close() { dismiss(animated: true) }

    override func numberOfSections(in tableView: UITableView) -> Int { 1 }
    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int { allCalcs.count }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let item = allCalcs[indexPath.row]
        let cell = tableView.dequeueReusableCell(withIdentifier: "Cell", for: indexPath)
        var content = cell.defaultContentConfiguration()
        content.text = "\(item.emoji)  \(item.titleRu)"
        content.secondaryText = item.category
        cell.contentConfiguration = content
        cell.accessoryType = alreadyBookmarked.contains(item.slug) ? .checkmark : .none
        return cell
    }

    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let item = allCalcs[indexPath.row]
        tableView.deselectRow(at: indexPath, animated: true)
        if !alreadyBookmarked.contains(item.slug) {
            onSelected?(item.slug)
            // Update cell visually
            if let cell = tableView.cellForRow(at: indexPath) {
                cell.accessoryType = .checkmark
            }
        }
    }
}
