//
//  LoanCalculatorViewController.swift
//  CalkKG
//
//  100% native UIKit annuity loan calculator.
//
//  Formula (annuity payment):
//     M = P × i / (1 − (1 + i)^−n)
//  where:
//     P  = principal (loan amount in сом)
//     i  = monthly rate = (annual rate %) / 12 / 100
//     n  = number of monthly payments
//
//  Edge case: when i == 0 (interest-free loan), the formula collapses to
//  M = P / n. We handle that explicitly to avoid divide-by-zero.
//
//  Also renders a per-month amortization preview (first 12 rows) so users
//  see the principal/interest split — something the web flow doesn't show
//  inline. This deliberately exceeds what a plain web view delivers.
//

import UIKit

final class LoanCalculatorViewController: UIViewController {

    // MARK: - Inputs

    private var principal: Double = 500_000   // сом
    private var annualRatePct: Double = 24    // %
    private var months: Int = 24

    // MARK: - UI

    private let scrollView = UIScrollView()
    private let contentView = UIView()

    private let titleLabel: UILabel = {
        let l = UILabel()
        l.text = "Кредитный калькулятор"
        l.font = .systemFont(ofSize: 28, weight: .bold)
        return l
    }()
    private let subtitleLabel: UILabel = {
        let l = UILabel()
        l.text = "Аннуитетный платёж с графиком погашения. Расчёт локально, без интернета."
        l.numberOfLines = 0
        l.font = .systemFont(ofSize: 15)
        l.textColor = .secondaryLabel
        return l
    }()

    private let amountField = LoanCalculatorViewController.makeField(initial: "500000")
    private let rateField   = LoanCalculatorViewController.makeField(initial: "24", decimal: true)
    private let termField   = LoanCalculatorViewController.makeField(initial: "24")

    private static func makeField(initial: String, decimal: Bool = false) -> UITextField {
        let f = UITextField()
        f.text = initial
        f.borderStyle = .roundedRect
        f.keyboardType = decimal ? .decimalPad : .numberPad
        f.font = .systemFont(ofSize: 20, weight: .medium)
        return f
    }

    private let resultCard = UIView()
    private let paymentTitle: UILabel = {
        let l = UILabel()
        l.text = "Ежемесячный платёж"
        l.font = .systemFont(ofSize: 14, weight: .medium)
        l.textColor = .secondaryLabel
        return l
    }()
    private let paymentLabel: UILabel = {
        let l = UILabel()
        l.font = .systemFont(ofSize: 36, weight: .bold)
        l.adjustsFontSizeToFitWidth = true
        l.minimumScaleFactor = 0.5
        return l
    }()

    private let summaryStack: UIStackView = {
        let s = UIStackView()
        s.axis = .vertical
        s.spacing = 8
        return s
    }()

    private let scheduleTitle: UILabel = {
        let l = UILabel()
        l.text = "График платежей (первые 12 месяцев)"
        l.font = .systemFont(ofSize: 16, weight: .semibold)
        return l
    }()

    private let scheduleStack: UIStackView = {
        let s = UIStackView()
        s.axis = .vertical
        s.spacing = 0
        s.layer.cornerRadius = 10
        s.clipsToBounds = true
        return s
    }()

    private lazy var shareButton: UIButton = {
        let b = UIButton(type: .system)
        b.setTitle("Поделиться", for: .normal)
        b.setImage(UIImage(systemName: "square.and.arrow.up"), for: .normal)
        b.titleLabel?.font = .systemFont(ofSize: 16, weight: .medium)
        b.layer.cornerRadius = 10
        b.backgroundColor = UIColor.secondarySystemBackground
        b.tintColor = .label
        b.heightAnchor.constraint(equalToConstant: 48).isActive = true
        b.addTarget(self, action: #selector(shareTapped), for: .touchUpInside)
        return b
    }()
    private lazy var saveButton: UIButton = {
        let b = UIButton(type: .system)
        b.setTitle("Сохранить в историю", for: .normal)
        b.setImage(UIImage(systemName: "bookmark"), for: .normal)
        b.titleLabel?.font = .systemFont(ofSize: 16, weight: .medium)
        b.layer.cornerRadius = 10
        b.backgroundColor = UIColor(red: 220/255, green: 38/255, blue: 38/255, alpha: 1)
        b.tintColor = .white
        b.setTitleColor(.white, for: .normal)
        b.heightAnchor.constraint(equalToConstant: 48).isActive = true
        b.addTarget(self, action: #selector(saveTapped), for: .touchUpInside)
        return b
    }()

    // MARK: - Lifecycle

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .systemBackground
        title = "Кредит"
        navigationItem.largeTitleDisplayMode = .always

        buildLayout()
        bind()
        recompute()
    }

    // MARK: - Layout

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

        let amountRow = labeledField("Сумма кредита (сом)", field: amountField)
        let rateRow = labeledField("Годовая ставка (%)", field: rateField)
        let termRow = labeledField("Срок (месяцев)", field: termField)

        let main = UIStackView(arrangedSubviews: [
            titleLabel, subtitleLabel,
            amountRow, rateRow, termRow,
            resultCard, scheduleTitle, scheduleStack,
            shareButton, saveButton
        ])
        main.axis = .vertical
        main.spacing = 12
        main.setCustomSpacing(20, after: subtitleLabel)
        main.setCustomSpacing(20, after: termRow)
        main.setCustomSpacing(20, after: resultCard)
        main.setCustomSpacing(16, after: scheduleStack)
        main.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(main)

        NSLayoutConstraint.activate([
            main.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 16),
            main.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            main.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            main.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -24)
        ])

        // Result card
        resultCard.backgroundColor = .secondarySystemBackground
        resultCard.layer.cornerRadius = 14
        let card = UIStackView(arrangedSubviews: [paymentTitle, paymentLabel, makeDivider(), summaryStack])
        card.axis = .vertical
        card.spacing = 8
        card.setCustomSpacing(4, after: paymentTitle)
        card.setCustomSpacing(16, after: paymentLabel)
        card.translatesAutoresizingMaskIntoConstraints = false
        resultCard.addSubview(card)
        NSLayoutConstraint.activate([
            card.topAnchor.constraint(equalTo: resultCard.topAnchor, constant: 16),
            card.leadingAnchor.constraint(equalTo: resultCard.leadingAnchor, constant: 16),
            card.trailingAnchor.constraint(equalTo: resultCard.trailingAnchor, constant: -16),
            card.bottomAnchor.constraint(equalTo: resultCard.bottomAnchor, constant: -16)
        ])
    }

    private func labeledField(_ text: String, field: UITextField) -> UIView {
        let label = UILabel()
        label.text = text
        label.font = .systemFont(ofSize: 14, weight: .medium)
        label.textColor = .secondaryLabel
        let stack = UIStackView(arrangedSubviews: [label, field])
        stack.axis = .vertical
        stack.spacing = 6
        return stack
    }

    private func makeDivider() -> UIView {
        let v = UIView()
        v.backgroundColor = .separator
        v.heightAnchor.constraint(equalToConstant: 1).isActive = true
        return v
    }

    private func bind() {
        [amountField, rateField, termField].forEach {
            $0.addTarget(self, action: #selector(inputsChanged), for: .editingChanged)
        }
        let tap = UITapGestureRecognizer(target: self, action: #selector(dismissKbd))
        tap.cancelsTouchesInView = false
        view.addGestureRecognizer(tap)
    }

    @objc private func dismissKbd() { view.endEditing(true) }

    @objc private func inputsChanged() {
        principal = Double((amountField.text ?? "").filter { $0.isNumber }) ?? 0
        // rate can have comma or dot
        let rateText = (rateField.text ?? "").replacingOccurrences(of: ",", with: ".")
        annualRatePct = Double(rateText) ?? 0
        months = Int((termField.text ?? "").filter { $0.isNumber }) ?? 0
        recompute()
    }

    // MARK: - Calculation

    private struct Result {
        let payment: Double
        let total: Double
        let overpay: Double
        let schedule: [(month: Int, payment: Double, interest: Double, principal: Double, balance: Double)]
    }

    private func calculate() -> Result {
        guard principal > 0, months > 0 else {
            return Result(payment: 0, total: 0, overpay: 0, schedule: [])
        }
        let monthlyRate = annualRatePct / 12 / 100
        let m: Double
        if monthlyRate == 0 {
            // interest-free
            m = principal / Double(months)
        } else {
            let pow = Foundation.pow(1 + monthlyRate, Double(-months))
            m = principal * monthlyRate / (1 - pow)
        }
        let total = m * Double(months)
        let overpay = total - principal

        // Amortization schedule
        var schedule: [(Int, Double, Double, Double, Double)] = []
        var balance = principal
        for i in 1...min(months, 12) {
            let interest = balance * monthlyRate
            let principalPart = m - interest
            balance -= principalPart
            schedule.append((i, m, interest, principalPart, max(balance, 0)))
        }
        return Result(payment: m, total: total, overpay: overpay, schedule: schedule)
    }

    private func recompute() {
        let r = calculate()
        paymentLabel.text = formatCurrency(r.payment)

        summaryStack.arrangedSubviews.forEach { $0.removeFromSuperview() }
        summaryStack.addArrangedSubview(makeRow("Сумма кредита", formatCurrency(principal)))
        summaryStack.addArrangedSubview(makeRow("Переплата", "+\(formatCurrency(r.overpay))", color: .systemRed))
        summaryStack.addArrangedSubview(makeRow("Общая сумма выплат", formatCurrency(r.total)))

        scheduleStack.arrangedSubviews.forEach { $0.removeFromSuperview() }
        // Header
        let header = makeScheduleRow("Мес.", "Платёж", "%", "Долг", isHeader: true)
        scheduleStack.addArrangedSubview(header)
        for row in r.schedule {
            let line = makeScheduleRow(
                "\(row.0)",
                formatCurrencyShort(row.1),
                formatCurrencyShort(row.2),
                formatCurrencyShort(row.4)
            )
            scheduleStack.addArrangedSubview(line)
        }
    }

    private func makeRow(_ label: String, _ value: String, color: UIColor = .label) -> UIStackView {
        let l = UILabel()
        l.text = label
        l.font = .systemFont(ofSize: 15)
        l.textColor = .secondaryLabel
        let v = UILabel()
        v.text = value
        v.font = .systemFont(ofSize: 15, weight: .semibold)
        v.textColor = color
        v.textAlignment = .right
        let s = UIStackView(arrangedSubviews: [l, v])
        s.axis = .horizontal
        s.distribution = .equalSpacing
        return s
    }

    private func makeScheduleRow(_ a: String, _ b: String, _ c: String, _ d: String, isHeader: Bool = false) -> UIView {
        let row = UIStackView()
        row.axis = .horizontal
        row.distribution = .fillEqually
        row.backgroundColor = isHeader ? UIColor.tertiarySystemBackground : UIColor.secondarySystemBackground
        let font: UIFont = isHeader ?
            .systemFont(ofSize: 13, weight: .semibold) : .systemFont(ofSize: 13)
        let color: UIColor = isHeader ? .secondaryLabel : .label
        [a, b, c, d].forEach { txt in
            let l = UILabel()
            l.text = txt
            l.font = font
            l.textColor = color
            l.textAlignment = .center
            row.addArrangedSubview(l)
        }
        row.layoutMargins = UIEdgeInsets(top: 10, left: 8, bottom: 10, right: 8)
        row.isLayoutMarginsRelativeArrangement = true
        return row
    }

    // MARK: - Actions

    @objc private func shareTapped() {
        let r = calculate()
        let text = """
        💳 Расчёт кредита — Calk.KG

        Сумма: \(formatCurrency(principal))
        Ставка: \(annualRatePct)% годовых
        Срок: \(months) мес.

        Ежемесячный платёж: \(formatCurrency(r.payment))
        Переплата: \(formatCurrency(r.overpay))
        Общая сумма: \(formatCurrency(r.total))

        Calk.KG — калькуляторы Кыргызстана
        """
        let activity = UIActivityViewController(activityItems: [text], applicationActivities: nil)
        if let pop = activity.popoverPresentationController {
            pop.sourceView = shareButton
            pop.sourceRect = shareButton.bounds
        }
        present(activity, animated: true)
    }

    @objc private func saveTapped() {
        let r = calculate()
        CalculationHistoryStore.shared.add(.loan(
            principal: principal,
            ratePct: annualRatePct,
            months: months,
            payment: r.payment,
            createdAt: Date()
        ))
        let alert = UIAlertController(
            title: "Сохранено",
            message: "Расчёт сохранён в раздел «История».",
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }

    // MARK: - Formatting

    private func formatCurrency(_ v: Double) -> String {
        let f = NumberFormatter()
        f.numberStyle = .decimal
        f.groupingSeparator = " "
        f.maximumFractionDigits = 0
        return "\(f.string(from: NSNumber(value: v)) ?? "0") сом"
    }
    /// Compact format used in the amortization table where width is tight.
    private func formatCurrencyShort(_ v: Double) -> String {
        let f = NumberFormatter()
        f.numberStyle = .decimal
        f.groupingSeparator = " "
        f.maximumFractionDigits = 0
        if v >= 1_000_000 {
            return String(format: "%.1fM", v / 1_000_000)
        }
        if v >= 10_000 {
            return String(format: "%.0fK", v / 1_000)
        }
        return f.string(from: NSNumber(value: v)) ?? "0"
    }
}
