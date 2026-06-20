//
//  CalorieCalculatorViewController.swift
//  CalkKG
//
//  Native UIKit calorie / macro calculator using the Mifflin-St Jeor
//  equation — the formula recommended by the American Dietetic
//  Association as the most accurate for healthy adults.
//
//  Formula (BMR):
//     Male:   10 × weight + 6.25 × height − 5 × age + 5
//     Female: 10 × weight + 6.25 × height − 5 × age − 161
//
//  TDEE = BMR × activity multiplier
//
//  Macro split: 30 % protein / 30 % fat / 40 % carbs by calories.
//  Protein & carbs = 4 kcal/g, fat = 9 kcal/g.
//

import UIKit

final class CalorieCalculatorViewController: UIViewController {

    private enum Gender { case male, female }
    private enum Activity: Double, CaseIterable {
        case sedentary = 1.2     // little/no exercise
        case light = 1.375       // 1-3 days/week
        case moderate = 1.55     // 3-5 days/week
        case high = 1.725        // 6-7 days/week
        case veryHigh = 1.9      // 2x/day or hard labour
        var label: String {
            switch self {
            case .sedentary: return "Минимальная (сидячий)"
            case .light:     return "Низкая (1-3 раза/нед)"
            case .moderate:  return "Средняя (3-5 раз/нед)"
            case .high:      return "Высокая (6-7 раз/нед)"
            case .veryHigh:  return "Очень высокая (2× в день)"
            }
        }
    }
    private enum Goal: Double, CaseIterable {
        case lose = 0.8        // −20 %
        case maintain = 1.0    // baseline
        case gain = 1.2        // +20 %
        var label: String {
            switch self {
            case .lose:     return "Похудение (−20 %)"
            case .maintain: return "Поддержание"
            case .gain:     return "Набор массы (+20 %)"
            }
        }
    }

    private var gender: Gender = .male
    private var age: Int = 30
    private var heightCm: Int = 170
    private var weightKg: Int = 70
    private var activity: Activity = .moderate
    private var goal: Goal = .maintain

    private let scrollView = UIScrollView()
    private let contentView = UIView()

    private let titleLabel: UILabel = {
        let l = UILabel(); l.text = "Калькулятор калорий"
        l.font = .systemFont(ofSize: 28, weight: .bold); return l
    }()
    private let subtitleLabel: UILabel = {
        let l = UILabel()
        l.text = "BMR и суточная норма по формуле Mifflin-St Jeor + макронутриенты (КБЖУ). Расчёт локально."
        l.numberOfLines = 0
        l.font = .systemFont(ofSize: 15)
        l.textColor = .secondaryLabel
        return l
    }()

    private lazy var genderSegment: UISegmentedControl = {
        let s = UISegmentedControl(items: ["Мужской", "Женский"])
        s.selectedSegmentIndex = 0
        s.addTarget(self, action: #selector(genderChanged), for: .valueChanged)
        return s
    }()

    private let ageField    = CalorieCalculatorViewController.numField(initial: "30")
    private let heightField = CalorieCalculatorViewController.numField(initial: "170")
    private let weightField = CalorieCalculatorViewController.numField(initial: "70")

    private static func numField(initial: String) -> UITextField {
        let f = UITextField()
        f.text = initial
        f.borderStyle = .roundedRect
        f.keyboardType = .numberPad
        f.font = .systemFont(ofSize: 20, weight: .medium)
        return f
    }

    private lazy var activitySegment: UISegmentedControl = {
        let items = Activity.allCases.enumerated().map { _, a in ["Мин", "Низ", "Сред", "Выс", "Макс"][Activity.allCases.firstIndex(of: a)!] }
        let s = UISegmentedControl(items: items)
        s.selectedSegmentIndex = 2
        s.addTarget(self, action: #selector(activityChanged), for: .valueChanged)
        return s
    }()
    private let activityLabel: UILabel = {
        let l = UILabel(); l.font = .systemFont(ofSize: 13); l.textColor = .tertiaryLabel; return l
    }()

    private lazy var goalSegment: UISegmentedControl = {
        let s = UISegmentedControl(items: ["Похудение", "Поддержание", "Набор массы"])
        s.selectedSegmentIndex = 1
        s.addTarget(self, action: #selector(goalChanged), for: .valueChanged)
        return s
    }()

    private let resultCard = UIView()
    private let tdeeTitle: UILabel = {
        let l = UILabel(); l.text = "Суточная норма"
        l.font = .systemFont(ofSize: 14, weight: .medium); l.textColor = .secondaryLabel; return l
    }()
    private let tdeeLabel: UILabel = {
        let l = UILabel(); l.font = .systemFont(ofSize: 36, weight: .bold)
        l.adjustsFontSizeToFitWidth = true; l.minimumScaleFactor = 0.5; return l
    }()
    private let bmrAndMacrosStack: UIStackView = {
        let s = UIStackView(); s.axis = .vertical; s.spacing = 8; return s
    }()

    private lazy var shareButton = ButtonFactory.secondary(title: "Поделиться", icon: "square.and.arrow.up", target: self, action: #selector(shareTapped))

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .systemBackground
        title = "Калории"
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

        // Age + height + weight in a horizontal row (compact for tablets)
        let physicalRow = UIStackView(arrangedSubviews: [
            LabeledField.make("Возраст", field: ageField),
            LabeledField.make("Рост (см)", field: heightField),
            LabeledField.make("Вес (кг)", field: weightField)
        ])
        physicalRow.axis = .horizontal
        physicalRow.distribution = .fillEqually
        physicalRow.spacing = 12

        let main = UIStackView(arrangedSubviews: [
            titleLabel, subtitleLabel,
            labeled("Пол"),
            genderSegment,
            physicalRow,
            labeled("Уровень активности"),
            activitySegment,
            activityLabel,
            labeled("Цель"),
            goalSegment,
            resultCard,
            shareButton
        ])
        main.axis = .vertical
        main.spacing = 12
        main.setCustomSpacing(20, after: subtitleLabel)
        main.setCustomSpacing(20, after: physicalRow)
        main.setCustomSpacing(20, after: activityLabel)
        main.setCustomSpacing(20, after: goalSegment)
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
        let card = UIStackView(arrangedSubviews: [tdeeTitle, tdeeLabel, divider, bmrAndMacrosStack])
        card.axis = .vertical
        card.spacing = 8
        card.setCustomSpacing(4, after: tdeeTitle)
        card.setCustomSpacing(16, after: tdeeLabel)
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
        [ageField, heightField, weightField].forEach {
            $0.addTarget(self, action: #selector(inputsChanged), for: .editingChanged)
        }
        let tap = UITapGestureRecognizer(target: self, action: #selector(dismissKbd))
        tap.cancelsTouchesInView = false
        view.addGestureRecognizer(tap)
    }

    @objc private func dismissKbd() { view.endEditing(true) }
    @objc private func inputsChanged() {
        age = Int((ageField.text ?? "").filter { $0.isNumber }) ?? 0
        heightCm = Int((heightField.text ?? "").filter { $0.isNumber }) ?? 0
        weightKg = Int((weightField.text ?? "").filter { $0.isNumber }) ?? 0
        recompute()
    }
    @objc private func genderChanged() {
        gender = genderSegment.selectedSegmentIndex == 0 ? .male : .female
        recompute()
    }
    @objc private func activityChanged() {
        activity = Activity.allCases[activitySegment.selectedSegmentIndex]
        recompute()
    }
    @objc private func goalChanged() {
        goal = Goal.allCases[goalSegment.selectedSegmentIndex]
        recompute()
    }

    private struct Result {
        let bmr: Int
        let tdee: Int
        let goalCalories: Int
        let protein: Int    // grams
        let fat: Int
        let carbs: Int
    }

    private func calculate() -> Result {
        guard age > 0, heightCm > 0, weightKg > 0 else {
            return Result(bmr: 0, tdee: 0, goalCalories: 0, protein: 0, fat: 0, carbs: 0)
        }
        let w = Double(weightKg), h = Double(heightCm), a = Double(age)
        let bmrRaw: Double
        switch gender {
        case .male:   bmrRaw = 10 * w + 6.25 * h - 5 * a + 5
        case .female: bmrRaw = 10 * w + 6.25 * h - 5 * a - 161
        }
        let tdeeRaw = bmrRaw * activity.rawValue
        let goalCalsRaw = tdeeRaw * goal.rawValue
        // Macro split 30/30/40 — standard balanced
        let proteinG = (goalCalsRaw * 0.30) / 4
        let fatG = (goalCalsRaw * 0.30) / 9
        let carbsG = (goalCalsRaw * 0.40) / 4
        return Result(
            bmr: Int(bmrRaw.rounded()),
            tdee: Int(tdeeRaw.rounded()),
            goalCalories: Int(goalCalsRaw.rounded()),
            protein: Int(proteinG.rounded()),
            fat: Int(fatG.rounded()),
            carbs: Int(carbsG.rounded())
        )
    }

    private func recompute() {
        let r = calculate()
        tdeeLabel.text = "\(r.goalCalories) ккал/день"
        activityLabel.text = activity.label
        bmrAndMacrosStack.arrangedSubviews.forEach { $0.removeFromSuperview() }
        bmrAndMacrosStack.addArrangedSubview(SummaryRow.make("Базовый обмен (BMR)", "\(r.bmr) ккал"))
        bmrAndMacrosStack.addArrangedSubview(SummaryRow.make("Без коррекции цели (TDEE)", "\(r.tdee) ккал"))
        bmrAndMacrosStack.addArrangedSubview(SummaryRow.make("Белки (30%)", "\(r.protein) г", color: .systemOrange))
        bmrAndMacrosStack.addArrangedSubview(SummaryRow.make("Жиры (30%)", "\(r.fat) г", color: .systemYellow))
        bmrAndMacrosStack.addArrangedSubview(SummaryRow.make("Углеводы (40%)", "\(r.carbs) г", color: .systemGreen))
    }

    @objc private func shareTapped() {
        let r = calculate()
        let genderLabel = gender == .male ? "мужчина" : "женщина"
        let text = """
        🥗 КБЖУ — Calk.KG

        \(genderLabel.capitalized), \(age) лет, \(heightCm) см, \(weightKg) кг
        Активность: \(activity.label)
        Цель: \(goal.label)

        Норма: \(r.goalCalories) ккал/день
        Белки: \(r.protein) г · Жиры: \(r.fat) г · Углеводы: \(r.carbs) г

        Calk.KG
        """
        let activity = UIActivityViewController(activityItems: [text], applicationActivities: nil)
        if let pop = activity.popoverPresentationController {
            pop.sourceView = shareButton; pop.sourceRect = shareButton.bounds
        }
        present(activity, animated: true)
    }
}
