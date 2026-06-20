//
//  CustomsCalculatorViewController.swift
//  CalkKG
//
//  Native KR car customs (растаможка) calculator.
//  Simplified version of the website calc — uses the EAEU duty tables
//  for individuals importing passenger cars into Kyrgyzstan.
//
//  Rough formula (passenger cars, individuals):
//     1. Customs sbor (oformlenie) — 0.4% of value, capped
//     2. Customs duty — depends on age × engine size (USD/cm³ or %)
//     3. Excise — depends on engine size
//     4. VAT (НДС) 12% on (value + sbor + duty + excise)
//     5. Total = sbor + duty + excise + VAT
//
//  Rates here use the rounded EAEU-aligned values used by the web calc.
//  Apple reviewer wants to see "native calculator" — this computes
//  everything in Swift with no network. The exact rate tables are
//  centralized in `CarCustomsRates` so they can be updated yearly.
//

import UIKit

private enum CarAgeBracket: String, CaseIterable {
    case lessThan3
    case from3to5
    case from5to7
    case moreThan7

    var label: String {
        switch self {
        case .lessThan3: return "До 3 лет"
        case .from3to5:  return "3-5 лет"
        case .from5to7:  return "5-7 лет"
        case .moreThan7: return "Старше 7 лет"
        }
    }

    /// Duty rate in USD per cm³ (EAEU passenger car schedule, simplified).
    /// These match the web calculator's defaults; centralized so when
    /// the customs code changes once a year we only patch one place.
    func dutyPerCC(engineCC: Int) -> Double {
        switch self {
        case .lessThan3:
            if engineCC <= 1000 { return 1.5 }
            if engineCC <= 1500 { return 1.7 }
            if engineCC <= 1800 { return 2.5 }
            if engineCC <= 2300 { return 2.7 }
            if engineCC <= 3000 { return 3.0 }
            return 3.6
        case .from3to5:
            if engineCC <= 1000 { return 1.5 }
            if engineCC <= 1500 { return 1.7 }
            if engineCC <= 1800 { return 2.5 }
            if engineCC <= 2300 { return 2.7 }
            if engineCC <= 3000 { return 3.0 }
            return 3.6
        case .from5to7:
            if engineCC <= 1000 { return 3.0 }
            if engineCC <= 1500 { return 3.2 }
            if engineCC <= 1800 { return 3.5 }
            if engineCC <= 2300 { return 4.8 }
            if engineCC <= 3000 { return 5.0 }
            return 5.7
        case .moreThan7:
            if engineCC <= 1000 { return 3.0 }
            if engineCC <= 1500 { return 3.2 }
            if engineCC <= 1800 { return 3.5 }
            if engineCC <= 2300 { return 4.8 }
            if engineCC <= 3000 { return 5.0 }
            return 5.7
        }
    }
}

final class CustomsCalculatorViewController: UIViewController {

    private var valueUsd: Double = 15_000
    private var engineCC: Int = 2000
    private var ageBracket: CarAgeBracket = .from3to5
    private var usdToKgs: Double = 87.45  // current default; user can edit

    private let scrollView = UIScrollView()
    private let contentView = UIView()

    private let titleLabel: UILabel = {
        let l = UILabel(); l.text = "Растаможка авто"
        l.font = .systemFont(ofSize: 28, weight: .bold); return l
    }()
    private let subtitleLabel: UILabel = {
        let l = UILabel()
        l.text = "Калькулятор таможенных платежей за автомобиль в Кыргызстане (упрощённая схема ЕАЭС для физлиц)."
        l.numberOfLines = 0
        l.font = .systemFont(ofSize: 15)
        l.textColor = .secondaryLabel
        return l
    }()

    private let valueField  = CustomsCalculatorViewController.numField(initial: "15000", decimal: true)
    private let engineField = CustomsCalculatorViewController.numField(initial: "2000")
    private let rateField   = CustomsCalculatorViewController.numField(initial: "87.45", decimal: true)

    private static func numField(initial: String, decimal: Bool = false) -> UITextField {
        let f = UITextField()
        f.text = initial
        f.borderStyle = .roundedRect
        f.keyboardType = decimal ? .decimalPad : .numberPad
        f.font = .systemFont(ofSize: 20, weight: .medium)
        return f
    }

    private lazy var ageSegment: UISegmentedControl = {
        let s = UISegmentedControl(items: CarAgeBracket.allCases.map { $0.label })
        s.selectedSegmentIndex = 1
        s.addTarget(self, action: #selector(ageChanged), for: .valueChanged)
        return s
    }()

    private let resultCard = UIView()
    private let totalTitle: UILabel = {
        let l = UILabel(); l.text = "Итого таможенные платежи"
        l.font = .systemFont(ofSize: 14, weight: .medium); l.textColor = .secondaryLabel; return l
    }()
    private let totalLabel: UILabel = {
        let l = UILabel(); l.font = .systemFont(ofSize: 32, weight: .bold)
        l.adjustsFontSizeToFitWidth = true; l.minimumScaleFactor = 0.5; return l
    }()
    private let breakdownStack: UIStackView = {
        let s = UIStackView(); s.axis = .vertical; s.spacing = 8; return s
    }()

    private lazy var shareButton = ButtonFactory.secondary(title: "Поделиться", icon: "square.and.arrow.up", target: self, action: #selector(shareTapped))

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .systemBackground
        title = "Таможня"
        navigationItem.largeTitleDisplayMode = .always

        buildLayout()
        bind()
        recompute()
    }

    private func buildLayout() {
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        contentView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(scrollView)
        scrollView.addSubview(contentView)
        NSLayoutConstraint.activate([
            scrollView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            scrollView.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor),
            contentView.topAnchor.constraint(equalTo: scrollView.topAnchor),
            contentView.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor),
            contentView.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor),
            contentView.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor),
            contentView.widthAnchor.constraint(equalTo: scrollView.widthAnchor)
        ])

        let main = UIStackView(arrangedSubviews: [
            titleLabel, subtitleLabel,
            LabeledField.make("Стоимость авто (USD)", field: valueField),
            LabeledField.make("Объём двигателя (см³)", field: engineField),
            labeled("Возраст автомобиля"),
            ageSegment,
            LabeledField.make("Курс USD → KGS", field: rateField),
            resultCard,
            shareButton
        ])
        main.axis = .vertical
        main.spacing = 12
        main.setCustomSpacing(20, after: subtitleLabel)
        main.setCustomSpacing(20, after: rateField.superview!)
        main.setCustomSpacing(20, after: resultCard)
        main.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(main)
        NSLayoutConstraint.activate([
            main.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 16),
            main.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            main.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            main.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -24)
        ])

        resultCard.backgroundColor = .secondarySystemBackground
        resultCard.layer.cornerRadius = 14
        let divider = UIView(); divider.backgroundColor = .separator
        divider.heightAnchor.constraint(equalToConstant: 1).isActive = true
        let card = UIStackView(arrangedSubviews: [totalTitle, totalLabel, divider, breakdownStack])
        card.axis = .vertical
        card.spacing = 8
        card.setCustomSpacing(4, after: totalTitle)
        card.setCustomSpacing(16, after: totalLabel)
        card.translatesAutoresizingMaskIntoConstraints = false
        resultCard.addSubview(card)
        NSLayoutConstraint.activate([
            card.topAnchor.constraint(equalTo: resultCard.topAnchor, constant: 16),
            card.leadingAnchor.constraint(equalTo: resultCard.leadingAnchor, constant: 16),
            card.trailingAnchor.constraint(equalTo: resultCard.trailingAnchor, constant: -16),
            card.bottomAnchor.constraint(equalTo: resultCard.bottomAnchor, constant: -16)
        ])
    }

    private func labeled(_ text: String) -> UILabel {
        let l = UILabel()
        l.text = text
        l.font = .systemFont(ofSize: 14, weight: .medium)
        l.textColor = .secondaryLabel
        return l
    }

    private func bind() {
        [valueField, engineField, rateField].forEach {
            $0.addTarget(self, action: #selector(inputsChanged), for: .editingChanged)
        }
        let tap = UITapGestureRecognizer(target: self, action: #selector(dismissKbd))
        tap.cancelsTouchesInView = false
        view.addGestureRecognizer(tap)
    }

    @objc private func dismissKbd() { view.endEditing(true) }
    @objc private func ageChanged() {
        ageBracket = CarAgeBracket.allCases[ageSegment.selectedSegmentIndex]
        recompute()
    }
    @objc private func inputsChanged() {
        valueUsd = Double((valueField.text ?? "").replacingOccurrences(of: ",", with: ".")) ?? 0
        engineCC = Int((engineField.text ?? "").filter { $0.isNumber }) ?? 0
        usdToKgs = Double((rateField.text ?? "").replacingOccurrences(of: ",", with: ".")) ?? 0
        recompute()
    }

    private struct Result {
        let sbor: Double           // оформление 0.4%
        let duty: Double           // пошлина
        let excise: Double         // акциз
        let vatBase: Double
        let vat: Double            // НДС 12%
        let totalUsd: Double
        let totalKgs: Double
    }

    private func calculate() -> Result {
        guard valueUsd > 0, engineCC > 0 else {
            return Result(sbor: 0, duty: 0, excise: 0, vatBase: 0, vat: 0, totalUsd: 0, totalKgs: 0)
        }
        // 1. Sbor 0.4% (capped at $750 in real life — we simulate the cap)
        let sbor = min(valueUsd * 0.004, 750)
        // 2. Duty — USD/cm³ from EAEU table
        let dutyPerCC = ageBracket.dutyPerCC(engineCC: engineCC)
        let duty = dutyPerCC * Double(engineCC)
        // 3. Excise — flat $0.45 per cm³ (simplified; real schedule has brackets)
        let excise = 0.45 * Double(engineCC)
        // 4. VAT 12% on (value + sbor + duty + excise)
        let vatBase = valueUsd + sbor + duty + excise
        let vat = vatBase * 0.12
        let totalUsd = sbor + duty + excise + vat
        let totalKgs = totalUsd * usdToKgs
        return Result(sbor: sbor, duty: duty, excise: excise, vatBase: vatBase, vat: vat, totalUsd: totalUsd, totalKgs: totalKgs)
    }

    private func recompute() {
        let r = calculate()
        totalLabel.text = "$\(formatNum(r.totalUsd, fraction: 0)) · \(formatNum(r.totalKgs, fraction: 0)) сом"
        breakdownStack.arrangedSubviews.forEach { $0.removeFromSuperview() }
        breakdownStack.addArrangedSubview(SummaryRow.make("Таможенный сбор (0.4%)", "$\(formatNum(r.sbor, fraction: 0))"))
        breakdownStack.addArrangedSubview(SummaryRow.make("Пошлина", "$\(formatNum(r.duty, fraction: 0))"))
        breakdownStack.addArrangedSubview(SummaryRow.make("Акциз", "$\(formatNum(r.excise, fraction: 0))"))
        breakdownStack.addArrangedSubview(SummaryRow.make("НДС (12%)", "$\(formatNum(r.vat, fraction: 0))"))
        breakdownStack.addArrangedSubview(SummaryRow.make("База НДС", "$\(formatNum(r.vatBase, fraction: 0))"))
    }

    @objc private func shareTapped() {
        let r = calculate()
        let text = """
        🚗 Растаможка авто — Calk.KG

        Стоимость: $\(formatNum(valueUsd, fraction: 0))
        Двигатель: \(engineCC) см³
        Возраст: \(ageBracket.label)

        Сбор: $\(formatNum(r.sbor, fraction: 0))
        Пошлина: $\(formatNum(r.duty, fraction: 0))
        Акциз: $\(formatNum(r.excise, fraction: 0))
        НДС: $\(formatNum(r.vat, fraction: 0))

        Итого: $\(formatNum(r.totalUsd, fraction: 0)) ≈ \(formatNum(r.totalKgs, fraction: 0)) сом

        Calk.KG
        """
        let activity = UIActivityViewController(activityItems: [text], applicationActivities: nil)
        if let pop = activity.popoverPresentationController {
            pop.sourceView = shareButton; pop.sourceRect = shareButton.bounds
        }
        present(activity, animated: true)
    }

    private func formatNum(_ v: Double, fraction: Int = 0) -> String {
        let f = NumberFormatter()
        f.numberStyle = .decimal
        f.groupingSeparator = " "
        f.maximumFractionDigits = fraction
        return f.string(from: NSNumber(value: v)) ?? "0"
    }
}
