//
//  CalculatorsHubViewController.swift
//  CalkKG
//
//  The primary entry-point screen of the app: a sectioned UITableView
//  listing every native calculator. Each row pushes a fully-native UIKit
//  view controller — no WKWebView is instantiated anywhere in this tab.
//
//  Sections:
//    1. Финансы   — Зарплата, Кредит, Ипотека
//    2. Авто      — Растаможка
//    3. Здоровье  — Калории (КБЖУ), ИМТ
//
//  Designed specifically to address App Store Guideline 4.2 — a single
//  native tab now provides 6 distinct domain calculators, each computing
//  locally with native types and offering Share + History integration.
//

import UIKit

final class CalculatorsHubViewController: UIViewController {

    private struct Row {
        let title: String
        let subtitle: String
        let icon: String
        let tint: UIColor
        let make: () -> UIViewController
    }
    private struct Section {
        let title: String
        let rows: [Row]
    }
    private let sections: [Section] = [
        Section(title: "Финансы", rows: [
            Row(title: "Зарплата", subtitle: "Расчёт «на руки» — соцфонд + подоходный",
                icon: "creditcard.fill", tint: .systemBlue,
                make: { SalaryCalculatorViewController() }),
            Row(title: "Кредит", subtitle: "Аннуитет + график на 12 месяцев",
                icon: "percent", tint: .systemIndigo,
                make: { LoanCalculatorViewController() }),
            Row(title: "Ипотека", subtitle: "С учётом первоначального взноса",
                icon: "house.fill", tint: .systemTeal,
                make: { MortgageCalculatorViewController() }),
        ]),
        Section(title: "Авто", rows: [
            Row(title: "Растаможка авто", subtitle: "Платежи ЕАЭС: сбор, пошлина, акциз, НДС",
                icon: "car.fill", tint: .systemOrange,
                make: { CustomsCalculatorViewController() }),
        ]),
        Section(title: "Здоровье", rows: [
            Row(title: "Калории (КБЖУ)", subtitle: "BMR/TDEE по формуле Mifflin-St Jeor",
                icon: "flame.fill", tint: .systemRed,
                make: { CalorieCalculatorViewController() }),
            Row(title: "Индекс массы тела (ИМТ)", subtitle: "Категория веса по ВОЗ",
                icon: "figure.stand", tint: .systemGreen,
                make: { BMICalculatorViewController() }),
        ]),
    ]

    private let tableView = UITableView(frame: .zero, style: .insetGrouped)

    override func viewDidLoad() {
        super.viewDidLoad()
        title = "Калькуляторы"
        navigationItem.largeTitleDisplayMode = .always
        view.backgroundColor = .systemBackground

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

        // For App Store screenshot capture: auto-push a specific calculator so
        // the marketing screenshot shows the calculator "in use", not just the
        // hub list. Set CALK_INITIAL_CALC to one of:
        //   salary | loan | mortgage | customs | calorie | bmi
        if let calcKey = ProcessInfo.processInfo.environment["CALK_INITIAL_CALC"] {
            let maker: (() -> UIViewController)? = {
                switch calcKey {
                case "salary":   return { SalaryCalculatorViewController() }
                case "loan":     return { LoanCalculatorViewController() }
                case "mortgage": return { MortgageCalculatorViewController() }
                case "customs":  return { CustomsCalculatorViewController() }
                case "calorie":  return { CalorieCalculatorViewController() }
                case "bmi":      return { BMICalculatorViewController() }
                default:         return nil
                }
            }()
            if let maker = maker {
                // Defer so the navigation controller finishes its initial layout.
                DispatchQueue.main.async { [weak self] in
                    self?.navigationController?.pushViewController(maker(), animated: false)
                }
            }
        }
    }
}

extension CalculatorsHubViewController: UITableViewDataSource, UITableViewDelegate {

    func numberOfSections(in tableView: UITableView) -> Int { sections.count }
    func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        sections[section].title
    }
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        sections[section].rows.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "Cell", for: indexPath)
        let row = sections[indexPath.section].rows[indexPath.row]

        var cfg = cell.defaultContentConfiguration()
        cfg.text = row.title
        cfg.secondaryText = row.subtitle
        let icon = UIImage(systemName: row.icon)?.withTintColor(row.tint, renderingMode: .alwaysOriginal)
        cfg.image = icon
        cfg.imageProperties.maximumSize = CGSize(width: 32, height: 32)
        cell.contentConfiguration = cfg
        cell.accessoryType = .disclosureIndicator
        return cell
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        let row = sections[indexPath.section].rows[indexPath.row]
        let vc = row.make()
        navigationController?.pushViewController(vc, animated: true)
    }
}
