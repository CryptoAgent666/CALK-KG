//
//  BMICalculatorViewController.swift
//  CalkKG
//
//  Native UIKit BMI (Body Mass Index) calculator.
//
//  Formula: BMI = weight_kg / (height_m × height_m)
//
//  WHO categories (adults, 20+):
//    < 16    — Severe underweight (Острый дефицит)
//    16-18.5 — Underweight        (Дефицит)
//    18.5-25 — Normal             (Норма)
//    25-30   — Overweight         (Избыточный)
//    30-35   — Obesity class I    (Ожирение I)
//    35-40   — Obesity class II   (Ожирение II)
//    > 40    — Obesity class III  (Ожирение III)
//

import UIKit

final class BMICalculatorViewController: UIViewController {

    private var heightCm: Int = 170
    private var weightKg: Double = 70

    private let scrollView = UIScrollView()
    private let contentView = UIView()

    private let titleLabel: UILabel = {
        let l = UILabel(); l.text = "Индекс массы тела (ИМТ)"
        l.font = .systemFont(ofSize: 28, weight: .bold); return l
    }()
    private let subtitleLabel: UILabel = {
        let l = UILabel()
        l.text = "Категория веса по классификации Всемирной организации здравоохранения."
        l.numberOfLines = 0
        l.font = .systemFont(ofSize: 15)
        l.textColor = .secondaryLabel
        return l
    }()

    private let heightField: UITextField = {
        let f = UITextField()
        f.text = "170"
        f.borderStyle = .roundedRect
        f.keyboardType = .numberPad
        f.font = .systemFont(ofSize: 22, weight: .medium)
        return f
    }()
    private let weightField: UITextField = {
        let f = UITextField()
        f.text = "70"
        f.borderStyle = .roundedRect
        f.keyboardType = .decimalPad
        f.font = .systemFont(ofSize: 22, weight: .medium)
        return f
    }()

    private let resultCard = UIView()
    private let bmiLabel: UILabel = {
        let l = UILabel(); l.font = .systemFont(ofSize: 56, weight: .bold)
        l.textAlignment = .center
        l.adjustsFontSizeToFitWidth = true; l.minimumScaleFactor = 0.5; return l
    }()
    private let categoryLabel: UILabel = {
        let l = UILabel(); l.font = .systemFont(ofSize: 18, weight: .semibold)
        l.textAlignment = .center; return l
    }()
    private let categoryHint: UILabel = {
        let l = UILabel(); l.font = .systemFont(ofSize: 14)
        l.textColor = .secondaryLabel
        l.numberOfLines = 0
        l.textAlignment = .center; return l
    }()
    private let categoriesStack: UIStackView = {
        let s = UIStackView(); s.axis = .vertical; s.spacing = 6; return s
    }()

    private lazy var shareButton = ButtonFactory.secondary(title: "Поделиться", icon: "square.and.arrow.up", target: self, action: #selector(shareTapped))

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .systemBackground
        title = "ИМТ"
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

        let inputs = UIStackView(arrangedSubviews: [
            LabeledField.make("Рост (см)", field: heightField),
            LabeledField.make("Вес (кг)", field: weightField)
        ])
        inputs.axis = .horizontal
        inputs.distribution = .fillEqually
        inputs.spacing = 12

        let main = UIStackView(arrangedSubviews: [
            titleLabel, subtitleLabel, inputs,
            resultCard,
            categoriesTitleLabel(),
            categoriesStack,
            shareButton
        ])
        main.axis = .vertical
        main.spacing = 12
        main.setCustomSpacing(20, after: subtitleLabel)
        main.setCustomSpacing(20, after: inputs)
        main.setCustomSpacing(24, after: resultCard)
        main.setCustomSpacing(16, after: categoriesStack)
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
        let card = UIStackView(arrangedSubviews: [bmiLabel, categoryLabel, categoryHint])
        card.axis = .vertical
        card.spacing = 8
        card.translatesAutoresizingMaskIntoConstraints = false
        resultCard.addSubview(card)
        NSLayoutConstraint.activate([
            card.topAnchor.constraint(equalTo: resultCard.topAnchor, constant: 20),
            card.leadingAnchor.constraint(equalTo: resultCard.leadingAnchor, constant: 16),
            card.trailingAnchor.constraint(equalTo: resultCard.trailingAnchor, constant: -16),
            card.bottomAnchor.constraint(equalTo: resultCard.bottomAnchor, constant: -20)
        ])

        // Populate the static reference table once
        buildCategoriesReference()
    }

    private func categoriesTitleLabel() -> UILabel {
        let l = UILabel()
        l.text = "Классификация ВОЗ"
        l.font = .systemFont(ofSize: 14, weight: .semibold)
        l.textColor = .secondaryLabel
        return l
    }

    private func buildCategoriesReference() {
        let rows: [(String, String, UIColor)] = [
            ("< 16",       "Острый дефицит",  .systemBlue),
            ("16 – 18.5",  "Дефицит",         .systemTeal),
            ("18.5 – 25",  "Норма",           .systemGreen),
            ("25 – 30",    "Избыточный",      .systemYellow),
            ("30 – 35",    "Ожирение I ст.",  .systemOrange),
            ("35 – 40",    "Ожирение II ст.", .systemRed),
            ("> 40",       "Ожирение III ст.",.systemPurple)
        ]
        rows.forEach { range, label, color in
            let dot = UIView()
            dot.backgroundColor = color
            dot.layer.cornerRadius = 5
            dot.widthAnchor.constraint(equalToConstant: 10).isActive = true
            dot.heightAnchor.constraint(equalToConstant: 10).isActive = true
            let rangeL = UILabel()
            rangeL.text = range
            rangeL.font = .systemFont(ofSize: 14, weight: .medium)
            rangeL.widthAnchor.constraint(equalToConstant: 90).isActive = true
            let labelL = UILabel()
            labelL.text = label
            labelL.font = .systemFont(ofSize: 14)
            labelL.textColor = .secondaryLabel
            let s = UIStackView(arrangedSubviews: [dot, rangeL, labelL])
            s.axis = .horizontal
            s.spacing = 8
            s.alignment = .center
            categoriesStack.addArrangedSubview(s)
        }
    }

    private func bind() {
        heightField.addTarget(self, action: #selector(inputsChanged), for: .editingChanged)
        weightField.addTarget(self, action: #selector(inputsChanged), for: .editingChanged)
        let tap = UITapGestureRecognizer(target: self, action: #selector(dismissKbd))
        tap.cancelsTouchesInView = false
        view.addGestureRecognizer(tap)
    }

    @objc private func dismissKbd() { view.endEditing(true) }
    @objc private func inputsChanged() {
        heightCm = Int((heightField.text ?? "").filter { $0.isNumber }) ?? 0
        weightKg = Double((weightField.text ?? "").replacingOccurrences(of: ",", with: ".")) ?? 0
        recompute()
    }

    private struct Result { let bmi: Double; let category: String; let hint: String; let color: UIColor }

    private func calculate() -> Result {
        guard heightCm > 0, weightKg > 0 else {
            return Result(bmi: 0, category: "—", hint: "Введите рост и вес", color: .secondaryLabel)
        }
        let heightM = Double(heightCm) / 100.0
        let bmi = weightKg / (heightM * heightM)
        let (cat, hint, color): (String, String, UIColor)
        switch bmi {
        case ..<16:    (cat, hint, color) = ("Острый дефицит", "Рекомендуется немедленная консультация врача.", .systemBlue)
        case 16..<18.5:(cat, hint, color) = ("Дефицит", "Вес ниже нормы — стоит проконсультироваться со специалистом.", .systemTeal)
        case 18.5..<25:(cat, hint, color) = ("Норма", "Поздравляем — здоровый вес.", .systemGreen)
        case 25..<30:  (cat, hint, color) = ("Избыточный вес", "Рекомендуется снизить вес физической активностью.", .systemYellow)
        case 30..<35:  (cat, hint, color) = ("Ожирение I степени", "Желательна консультация диетолога.", .systemOrange)
        case 35..<40:  (cat, hint, color) = ("Ожирение II степени", "Риски для здоровья высоки — обратитесь к врачу.", .systemRed)
        default:       (cat, hint, color) = ("Ожирение III степени", "Высокий риск осложнений. Требуется наблюдение врача.", .systemPurple)
        }
        return Result(bmi: bmi, category: cat, hint: hint, color: color)
    }

    private func recompute() {
        let r = calculate()
        bmiLabel.text = String(format: "%.1f", r.bmi)
        bmiLabel.textColor = r.color
        categoryLabel.text = r.category
        categoryLabel.textColor = r.color
        categoryHint.text = r.hint
    }

    @objc private func shareTapped() {
        let r = calculate()
        let text = """
        ⚖️ ИМТ — Calk.KG

        Рост: \(heightCm) см
        Вес: \(String(format: "%g", weightKg)) кг

        ИМТ: \(String(format: "%.1f", r.bmi))
        Категория: \(r.category)

        Calk.KG
        """
        let activity = UIActivityViewController(activityItems: [text], applicationActivities: nil)
        if let pop = activity.popoverPresentationController {
            pop.sourceView = shareButton; pop.sourceRect = shareButton.bounds
        }
        present(activity, animated: true)
    }
}
