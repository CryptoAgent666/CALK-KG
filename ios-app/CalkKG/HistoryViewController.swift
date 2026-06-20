//
//  HistoryViewController.swift
//  CalkKG
//
//  Native UITableView showing saved calculation history with:
//   • Swipe-to-delete
//   • Share via UIActivityViewController
//   • "Clear all" toolbar
//   • Empty state with hint
//
//  This is one of the native features added to satisfy App Store
//  Guideline 4.2 (Minimum Functionality) — the history exists only in
//  the iOS app, web visitors don't see it.
//

import UIKit

final class HistoryViewController: UIViewController {

    private let tableView = UITableView(frame: .zero, style: .insetGrouped)

    private let emptyState: UIView = {
        let v = UIView()
        let label = UILabel()
        label.text = "Здесь появятся ваши сохранённые расчёты.\n\nОткройте «Зарплата» или «Кредит», введите данные и нажмите «Сохранить в историю»."
        label.numberOfLines = 0
        label.textAlignment = .center
        label.font = .systemFont(ofSize: 15)
        label.textColor = .secondaryLabel
        label.translatesAutoresizingMaskIntoConstraints = false
        v.addSubview(label)
        NSLayoutConstraint.activate([
            label.centerXAnchor.constraint(equalTo: v.centerXAnchor),
            label.centerYAnchor.constraint(equalTo: v.centerYAnchor),
            label.leadingAnchor.constraint(equalTo: v.leadingAnchor, constant: 32),
            label.trailingAnchor.constraint(equalTo: v.trailingAnchor, constant: -32)
        ])
        return v
    }()

    override func viewDidLoad() {
        super.viewDidLoad()
        title = "История"
        navigationItem.largeTitleDisplayMode = .always
        view.backgroundColor = .systemBackground

        let clearItem = UIBarButtonItem(
            title: "Очистить",
            style: .plain,
            target: self,
            action: #selector(clearAllTapped)
        )
        navigationItem.rightBarButtonItem = clearItem

        tableView.translatesAutoresizingMaskIntoConstraints = false
        tableView.dataSource = self
        tableView.delegate = self
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "Cell")
        view.addSubview(tableView)
        NSLayoutConstraint.activate([
            tableView.topAnchor.constraint(equalTo: view.topAnchor),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])

        emptyState.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(emptyState)
        NSLayoutConstraint.activate([
            emptyState.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            emptyState.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            emptyState.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            emptyState.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor)
        ])

        NotificationCenter.default.addObserver(
            self,
            selector: #selector(reload),
            name: CalculationHistoryStore.historyChanged,
            object: nil
        )
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        reload()
    }

    @objc private func reload() {
        let hasItems = !CalculationHistoryStore.shared.entries.isEmpty
        tableView.isHidden = !hasItems
        emptyState.isHidden = hasItems
        navigationItem.rightBarButtonItem?.isEnabled = hasItems
        tableView.reloadData()
    }

    @objc private func clearAllTapped() {
        guard !CalculationHistoryStore.shared.entries.isEmpty else { return }
        let alert = UIAlertController(
            title: "Очистить всю историю?",
            message: "Все сохранённые расчёты будут удалены. Это действие нельзя отменить.",
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "Отмена", style: .cancel))
        alert.addAction(UIAlertAction(title: "Очистить", style: .destructive) { _ in
            CalculationHistoryStore.shared.clearAll()
        })
        present(alert, animated: true)
    }
}

extension HistoryViewController: UITableViewDataSource, UITableViewDelegate {

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        CalculationHistoryStore.shared.entries.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "Cell", for: indexPath)
        let entry = CalculationHistoryStore.shared.entries[indexPath.row]

        var cfg = cell.defaultContentConfiguration()
        cfg.text = entry.title
        cfg.secondaryText = "\(entry.kindLabel) · \(relativeDate(entry.createdAt))"
        cfg.image = UIImage(systemName: entry.kindLabel == "Зарплата" ? "creditcard" : "percent")
        cell.contentConfiguration = cfg

        // Value on the right as accessory
        let valueLabel = UILabel()
        valueLabel.text = entry.primaryValue
        valueLabel.font = .systemFont(ofSize: 14, weight: .semibold)
        valueLabel.textColor = UIColor(red: 220/255, green: 38/255, blue: 38/255, alpha: 1)
        valueLabel.sizeToFit()
        cell.accessoryView = valueLabel

        return cell
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        let entry = CalculationHistoryStore.shared.entries[indexPath.row]
        let activity = UIActivityViewController(
            activityItems: [entry.shareText()],
            applicationActivities: nil
        )
        if let pop = activity.popoverPresentationController,
           let cell = tableView.cellForRow(at: indexPath) {
            pop.sourceView = cell
            pop.sourceRect = cell.bounds
        }
        present(activity, animated: true)
    }

    // Swipe-to-delete
    func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCell.EditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete {
            CalculationHistoryStore.shared.remove(at: indexPath.row)
        }
    }

    private func relativeDate(_ d: Date) -> String {
        let f = RelativeDateTimeFormatter()
        f.locale = Locale(identifier: "ru_RU")
        f.unitsStyle = .full
        return f.localizedString(for: d, relativeTo: Date())
    }
}
