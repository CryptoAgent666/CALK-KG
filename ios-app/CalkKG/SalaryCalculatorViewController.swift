//
//  SalaryCalculatorViewController.swift
//  CalkKG
//
//  100% native Swift implementation of the salary "на руки" calculator
//  for the Kyrgyz Republic.
//
//  All computation is performed locally in this controller — no WebView,
//  no network. Formula matches the published rules of the KR Tax Code
//  (Налоговый кодекс КР) and Social Fund regulations effective Jan 2026:
//
//    Social Fund deduction = gross × 10%
//    Taxable base          = gross − social_fund
//    Income tax            = taxable_base × rate (10% standard, 5% for HTP)
//    Net "на руки"         = gross − social_fund − income_tax
//
//  This controller exists to satisfy App Store Guideline 4.2 — the app
//  must provide native functionality genuinely distinct from a web view.
//

import UIKit

final class SalaryCalculatorViewController: UIViewController {

    // MARK: - State

    /// Standard 10 % personal income tax — applies to most workers.
    /// 5 % is the preferential rate for the High-Tech Park (ПВТ/HTP) employees.
    private enum TaxRate: Double {
        case standard = 0.10
        case htp = 0.05
    }

    private var grossSalary: Double = 50_000
    private var taxRate: TaxRate = .standard

    // MARK: - UI

    private let scrollView = UIScrollView()
    private let contentView = UIView()

    private let titleLabel: UILabel = {
        let l = UILabel()
        l.text = "Калькулятор зарплаты"
        l.font = .systemFont(ofSize: 28, weight: .bold)
        return l
    }()

    private let subtitleLabel: UILabel = {
        let l = UILabel()
        l.text = "Расчёт зарплаты «на руки» в Кыргызстане. Все вычисления — локально на устройстве."
        l.numberOfLines = 0
        l.font = .systemFont(ofSize: 15)
        l.textColor = .secondaryLabel
        return l
    }()

    private let salaryFieldLabel: UILabel = {
        let l = UILabel()
        l.text = "Начисленная зарплата (гросс), сом"
        l.font = .systemFont(ofSize: 14, weight: .medium)
        l.textColor = .secondaryLabel
        return l
    }()

    private let salaryField: UITextField = {
        let f = UITextField()
        f.text = "50000"
        f.placeholder = "Например: 50000"
        f.borderStyle = .roundedRect
        f.keyboardType = .numberPad
        f.font = .systemFont(ofSize: 22, weight: .medium)
        return f
    }()

    private let rateSegment: UISegmentedControl = {
        let s = UISegmentedControl(items: [
            "10 % (стандарт)",
            "5 % (ПВТ)"
        ])
        s.selectedSegmentIndex = 0
        return s
    }()

    private let rateHint: UILabel = {
        let l = UILabel()
        l.text = "Выберите ставку подоходного налога"
        l.font = .systemFont(ofSize: 13)
        l.textColor = .tertiaryLabel
        l.numberOfLines = 0
        return l
    }()

    // Result card
    private let resultCard = UIView()
    private let netLabel: UILabel = {
        let l = UILabel()
        l.font = .systemFont(ofSize: 14, weight: .medium)
        l.textColor = .secondaryLabel
        l.text = "К выплате на руки"
        return l
    }()
    private let netAmountLabel: UILabel = {
        let l = UILabel()
        l.font = .systemFont(ofSize: 36, weight: .bold)
        l.adjustsFontSizeToFitWidth = true
        l.minimumScaleFactor = 0.6
        return l
    }()

    private let breakdownStack: UIStackView = {
        let s = UIStackView()
        s.axis = .vertical
        s.spacing = 8
        s.distribution = .fill
        return s
    }()

    // Action buttons
    private lazy var shareButton: UIButton = {
        let b = UIButton(type: .system)
        b.setTitle("Поделиться", for: .normal)
        b.setImage(UIImage(systemName: "square.and.arrow.up"), for: .normal)
        b.titleLabel?.font = .systemFont(ofSize: 16, weight: .medium)
        b.contentHorizontalAlignment = .center
        b.layer.cornerRadius = 10
        b.backgroundColor = UIColor.secondarySystemBackground
        b.tintColor = .label
        b.imageEdgeInsets = UIEdgeInsets(top: 0, left: 0, bottom: 0, right: 8)
        b.heightAnchor.constraint(equalToConstant: 48).isActive = true
        b.addTarget(self, action: #selector(shareTapped), for: .touchUpInside)
        return b
    }()

    private lazy var saveButton: UIButton = {
        let b = UIButton(type: .system)
        b.setTitle("Сохранить в историю", for: .normal)
        b.setImage(UIImage(systemName: "bookmark"), for: .normal)
        b.titleLabel?.font = .systemFont(ofSize: 16, weight: .medium)
        b.contentHorizontalAlignment = .center
        b.layer.cornerRadius = 10
        b.backgroundColor = UIColor(red: 220/255, green: 38/255, blue: 38/255, alpha: 1)
        b.tintColor = .white
        b.setTitleColor(.white, for: .normal)
        b.imageEdgeInsets = UIEdgeInsets(top: 0, left: 0, bottom: 0, right: 8)
        b.heightAnchor.constraint(equalToConstant: 48).isActive = true
        b.addTarget(self, action: #selector(saveTapped), for: .touchUpInside)
        return b
    }()

    // MARK: - Lifecycle

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .systemBackground
        title = "Зарплата"
        navigationItem.largeTitleDisplayMode = .always

        buildLayout()
        bindActions()
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

        // Vertical stack of all sections
        let mainStack = UIStackView(arrangedSubviews: [
            titleLabel,
            subtitleLabel,
            salaryFieldLabel,
            salaryField,
            rateSegment,
            rateHint,
            resultCard,
            shareButton,
            saveButton
        ])
        mainStack.axis = .vertical
        mainStack.spacing = 12
        mainStack.setCustomSpacing(20, after: subtitleLabel)
        mainStack.setCustomSpacing(20, after: rateHint)
        mainStack.setCustomSpacing(20, after: resultCard)
        mainStack.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(mainStack)

        NSLayoutConstraint.activate([
            mainStack.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 16),
            mainStack.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            mainStack.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            mainStack.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -24)
        ])

        // Result card layout
        resultCard.backgroundColor = .secondarySystemBackground
        resultCard.layer.cornerRadius = 14
        let cardStack = UIStackView(arrangedSubviews: [netLabel, netAmountLabel, makeDivider(), breakdownStack])
        cardStack.axis = .vertical
        cardStack.spacing = 8
        cardStack.setCustomSpacing(4, after: netLabel)
        cardStack.setCustomSpacing(16, after: netAmountLabel)
        cardStack.translatesAutoresizingMaskIntoConstraints = false
        resultCard.addSubview(cardStack)
        NSLayoutConstraint.activate([
            cardStack.topAnchor.constraint(equalTo: resultCard.topAnchor, constant: 16),
            cardStack.leadingAnchor.constraint(equalTo: resultCard.leadingAnchor, constant: 16),
            cardStack.trailingAnchor.constraint(equalTo: resultCard.trailingAnchor, constant: -16),
            cardStack.bottomAnchor.constraint(equalTo: resultCard.bottomAnchor, constant: -16)
        ])
    }

    private func makeDivider() -> UIView {
        let v = UIView()
        v.backgroundColor = .separator
        v.heightAnchor.constraint(equalToConstant: 1).isActive = true
        return v
    }

    private func bindActions() {
        salaryField.addTarget(self, action: #selector(salaryChanged), for: .editingChanged)
        rateSegment.addTarget(self, action: #selector(rateChanged), for: .valueChanged)

        // Tap-to-dismiss for keyboard
        let tap = UITapGestureRecognizer(target: self, action: #selector(dismissKeyboard))
        tap.cancelsTouchesInView = false
        view.addGestureRecognizer(tap)
    }

    // MARK: - Actions

    @objc private func salaryChanged() {
        let cleaned = (salaryField.text ?? "").filter { $0.isNumber }
        grossSalary = Double(cleaned) ?? 0
        recompute()
    }

    @objc private func rateChanged() {
        taxRate = rateSegment.selectedSegmentIndex == 1 ? .htp : .standard
        recompute()
    }

    @objc private func dismissKeyboard() { view.endEditing(true) }

    @objc private func shareTapped() {
        let r = calculate()
        let text = """
        💼 Расчёт зарплаты «на руки» — Calk.KG

        Начислено: \(formatCurrency(r.gross))
        — Соцфонд (10%): −\(formatCurrency(r.socialFund))
        — Подоходный налог (\(Int(taxRate.rawValue * 100))%): −\(formatCurrency(r.incomeTax))

        На руки: \(formatCurrency(r.net))

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
        CalculationHistoryStore.shared.add(.salary(
            gross: r.gross,
            rate: taxRate.rawValue,
            net: r.net,
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

    // MARK: - Calculation

    private struct Result {
        let gross: Double
        let socialFund: Double
        let taxableBase: Double
        let incomeTax: Double
        let net: Double
    }

    private func calculate() -> Result {
        let socialFund = grossSalary * 0.10
        let taxableBase = max(0, grossSalary - socialFund)
        let incomeTax = taxableBase * taxRate.rawValue
        let net = grossSalary - socialFund - incomeTax
        return Result(
            gross: grossSalary,
            socialFund: socialFund,
            taxableBase: taxableBase,
            incomeTax: incomeTax,
            net: net
        )
    }

    private func recompute() {
        let r = calculate()
        netAmountLabel.text = formatCurrency(r.net)
        // Rebuild breakdown rows
        breakdownStack.arrangedSubviews.forEach { $0.removeFromSuperview() }
        breakdownStack.addArrangedSubview(makeRow(
            label: "Начислено (гросс)",
            value: formatCurrency(r.gross),
            color: .label
        ))
        breakdownStack.addArrangedSubview(makeRow(
            label: "Соцфонд (10%)",
            value: "−\(formatCurrency(r.socialFund))",
            color: UIColor.systemOrange
        ))
        breakdownStack.addArrangedSubview(makeRow(
            label: "Подоходный налог (\(Int(taxRate.rawValue * 100))%)",
            value: "−\(formatCurrency(r.incomeTax))",
            color: UIColor.systemRed
        ))
    }

    private func makeRow(label: String, value: String, color: UIColor) -> UIStackView {
        let left = UILabel()
        left.text = label
        left.font = .systemFont(ofSize: 15)
        left.textColor = .secondaryLabel
        let right = UILabel()
        right.text = value
        right.font = .systemFont(ofSize: 15, weight: .semibold)
        right.textColor = color
        right.textAlignment = .right
        let s = UIStackView(arrangedSubviews: [left, right])
        s.axis = .horizontal
        s.distribution = .equalSpacing
        return s
    }

    // MARK: - Formatting

    private func formatCurrency(_ v: Double) -> String {
        let f = NumberFormatter()
        f.numberStyle = .decimal
        f.groupingSeparator = " "
        f.maximumFractionDigits = 0
        let num = f.string(from: NSNumber(value: v)) ?? "0"
        return "\(num) сом"
    }
}
