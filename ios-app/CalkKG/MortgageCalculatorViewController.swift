//
//  MortgageCalculatorViewController.swift
//  CalkKG
//
//  Native UIKit mortgage calculator.
//
//  Inputs:
//    • Property price (сом)
//    • Down payment %
//    • Annual rate %
//    • Term in years
//
//  Computes:
//    • Loan principal = price × (1 − down/100)
//    • Monthly payment (annuity formula)
//    • Total paid, overpayment
//    • Down payment in сом
//
//  Distinct from LoanCalculator: down-payment slider, term in *years*
//  (mortgages are 5-25 years vs loans 6-60 months), and a property-price
//  field instead of loan amount. The amortization preview is omitted
//  here because mortgage tables are far longer (180-300 rows) — the
//  totals card carries the value instead.
//

import UIKit

final class MortgageCalculatorViewController: UIViewController {

    private var propertyPrice: Double = 5_000_000
    private var downPaymentPct: Double = 20      // %
    private var annualRatePct: Double = 14       // %
    private var years: Int = 15

    private let scrollView = UIScrollView()
    private let contentView = UIView()

    private let titleLabel: UILabel = {
        let l = UILabel()
        l.text = "Ипотечный калькулятор"
        l.font = .systemFont(ofSize: 28, weight: .bold)
        return l
    }()
    private let subtitleLabel: UILabel = {
        let l = UILabel()
        l.text = "Расчёт платежей по ипотеке в Кыргызстане с учётом первоначального взноса. Все расчёты — локально."
        l.numberOfLines = 0
        l.font = .systemFont(ofSize: 15)
        l.textColor = .secondaryLabel
        return l
    }()

    private let priceField    = MortgageCalculatorViewController.makeNumField(initial: "5000000")
    private let downField     = MortgageCalculatorViewController.makeNumField(initial: "20", decimal: true)
    private let rateField     = MortgageCalculatorViewController.makeNumField(initial: "14", decimal: true)
    private let yearsField    = MortgageCalculatorViewController.makeNumField(initial: "15")

    private static func makeNumField(initial: String, decimal: Bool = false) -> UITextField {
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
        let s = UIStackView(); s.axis = .vertical; s.spacing = 8; return s
    }()

    private lazy var shareButton = ButtonFactory.secondary(title: "Поделиться", icon: "square.and.arrow.up", target: self, action: #selector(shareTapped))
    private lazy var saveButton  = ButtonFactory.primary(title: "Сохранить в историю", icon: "bookmark", target: self, action: #selector(saveTapped))

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .systemBackground
        title = "Ипотека"
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

        let priceRow  = LabeledField.make("Стоимость недвижимости (сом)", field: priceField)
        let downRow   = LabeledField.make("Первоначальный взнос (%)", field: downField)
        let rateRow   = LabeledField.make("Годовая ставка (%)", field: rateField)
        let yearsRow  = LabeledField.make("Срок (лет)", field: yearsField)

        let main = UIStackView(arrangedSubviews: [
            titleLabel, subtitleLabel,
            priceRow, downRow, rateRow, yearsRow,
            resultCard,
            shareButton, saveButton
        ])
        main.axis = .vertical
        main.spacing = 12
        main.setCustomSpacing(20, after: subtitleLabel)
        main.setCustomSpacing(20, after: yearsRow)
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
        let divider = UIView()
        divider.backgroundColor = .separator
        divider.heightAnchor.constraint(equalToConstant: 1).isActive = true
        let card = UIStackView(arrangedSubviews: [paymentTitle, paymentLabel, divider, summaryStack])
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

    private func bind() {
        [priceField, downField, rateField, yearsField].forEach {
            $0.addTarget(self, action: #selector(inputsChanged), for: .editingChanged)
        }
        let tap = UITapGestureRecognizer(target: self, action: #selector(dismissKbd))
        tap.cancelsTouchesInView = false
        view.addGestureRecognizer(tap)
    }

    @objc private func dismissKbd() { view.endEditing(true) }

    @objc private func inputsChanged() {
        propertyPrice = Double((priceField.text ?? "").filter { $0.isNumber }) ?? 0
        downPaymentPct = Double((downField.text ?? "").replacingOccurrences(of: ",", with: ".")) ?? 0
        annualRatePct  = Double((rateField.text  ?? "").replacingOccurrences(of: ",", with: ".")) ?? 0
        years = Int((yearsField.text ?? "").filter { $0.isNumber }) ?? 0
        recompute()
    }

    private struct Result {
        let downAmount: Double
        let principal: Double
        let payment: Double
        let total: Double
        let overpay: Double
    }

    private func calculate() -> Result {
        let down = propertyPrice * (downPaymentPct / 100)
        let principal = max(0, propertyPrice - down)
        let months = years * 12
        guard principal > 0, months > 0 else {
            return Result(downAmount: down, principal: principal, payment: 0, total: 0, overpay: 0)
        }
        let monthlyRate = annualRatePct / 12 / 100
        let payment: Double
        if monthlyRate == 0 {
            payment = principal / Double(months)
        } else {
            let pow = Foundation.pow(1 + monthlyRate, Double(-months))
            payment = principal * monthlyRate / (1 - pow)
        }
        let total = payment * Double(months) + down
        let overpay = total - propertyPrice
        return Result(downAmount: down, principal: principal, payment: payment, total: total, overpay: overpay)
    }

    private func recompute() {
        let r = calculate()
        paymentLabel.text = formatCurrency(r.payment)
        summaryStack.arrangedSubviews.forEach { $0.removeFromSuperview() }
        summaryStack.addArrangedSubview(SummaryRow.make("Первый взнос", formatCurrency(r.downAmount)))
        summaryStack.addArrangedSubview(SummaryRow.make("Сумма кредита", formatCurrency(r.principal)))
        summaryStack.addArrangedSubview(SummaryRow.make("Переплата", "+\(formatCurrency(r.overpay))", color: .systemRed))
        summaryStack.addArrangedSubview(SummaryRow.make("Итого выплачено", formatCurrency(r.total)))
    }

    @objc private func shareTapped() {
        let r = calculate()
        let text = """
        🏠 Расчёт ипотеки — Calk.KG

        Стоимость: \(formatCurrency(propertyPrice))
        Первый взнос: \(downPaymentPct)% (\(formatCurrency(r.downAmount)))
        Ставка: \(annualRatePct)% годовых × \(years) лет

        Ежемесячный платёж: \(formatCurrency(r.payment))
        Переплата: \(formatCurrency(r.overpay))
        Итого: \(formatCurrency(r.total))

        Calk.KG — калькуляторы Кыргызстана
        """
        let activity = UIActivityViewController(activityItems: [text], applicationActivities: nil)
        if let pop = activity.popoverPresentationController {
            pop.sourceView = shareButton; pop.sourceRect = shareButton.bounds
        }
        present(activity, animated: true)
    }

    @objc private func saveTapped() {
        let r = calculate()
        // Re-use the .loan case for storage simplicity — mortgages are a
        // long-running loan in essence, and the display fields match.
        CalculationHistoryStore.shared.add(.loan(
            principal: r.principal,
            ratePct: annualRatePct,
            months: years * 12,
            payment: r.payment,
            createdAt: Date()
        ))
        let alert = UIAlertController(title: "Сохранено", message: "Расчёт сохранён в раздел «История».", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }

    private func formatCurrency(_ v: Double) -> String {
        let f = NumberFormatter()
        f.numberStyle = .decimal
        f.groupingSeparator = " "
        f.maximumFractionDigits = 0
        return "\(f.string(from: NSNumber(value: v)) ?? "0") сом"
    }
}
