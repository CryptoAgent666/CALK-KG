//
//  CurrencyRatesViewController.swift
//  CalkKG
//
//  Native "Currency Rates" screen — fetches NBKR XML feed and displays rates
//  in a native UI WITHOUT any WebView. Provides unique value beyond the website:
//   - Live API fetch with native pull-to-refresh
//   - Native UI with sparkline-style change indicators (▲/▼)
//   - Tap row to launch native currency converter
//   - Persistent "last fetched" timestamp
//   - Works offline with cached rates
//
//  WHY this exists (App Store Guideline 4.2):
//  This is the strongest answer to "looks like a webview wrapper". Rates are
//  displayed natively, no HTML, no JavaScript — a fully native experience.
//

import UIKit

struct CurrencyRate {
    let code: String       // e.g. "USD"
    let name: String       // e.g. "Доллар США"
    let flag: String       // emoji
    let nominal: Int       // typically 1, but 100 for KZT/RUB
    let rate: Double       // KGS per nominal units
    let previousRate: Double?
}

final class CurrencyRatesViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {

    private var rates: [CurrencyRate] = []
    private var isLoading = false
    private var lastFetched: Date?

    private lazy var tableView: UITableView = {
        let tv = UITableView(frame: .zero, style: .insetGrouped)
        tv.dataSource = self
        tv.delegate = self
        tv.register(RateCell.self, forCellReuseIdentifier: "Rate")
        tv.translatesAutoresizingMaskIntoConstraints = false
        tv.refreshControl = UIRefreshControl()
        tv.refreshControl?.addTarget(self, action: #selector(refresh), for: .valueChanged)
        tv.refreshControl?.tintColor = UIColor(red: 220/255, green: 38/255, blue: 38/255, alpha: 1)
        return tv
    }()

    private lazy var loadingIndicator: UIActivityIndicatorView = {
        let v = UIActivityIndicatorView(style: .large)
        v.translatesAutoresizingMaskIntoConstraints = false
        v.color = UIColor(red: 220/255, green: 38/255, blue: 38/255, alpha: 1)
        v.hidesWhenStopped = true
        return v
    }()

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .systemGroupedBackground
        title = "Курсы валют"
        navigationController?.navigationBar.prefersLargeTitles = true

        view.addSubview(tableView)
        view.addSubview(loadingIndicator)
        NSLayoutConstraint.activate([
            tableView.topAnchor.constraint(equalTo: view.topAnchor),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            loadingIndicator.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            loadingIndicator.centerYAnchor.constraint(equalTo: view.centerYAnchor),
        ])

        // Load cached rates first for instant UI
        loadFromCache()
        // Then fetch fresh
        fetchRates()
    }

    @objc private func refresh() { fetchRates() }

    // MARK: - Cache (UserDefaults)

    private static let cacheKey = "calkkg.currency.cache.v1"
    private static let cacheDateKey = "calkkg.currency.cacheDate.v1"

    private func loadFromCache() {
        guard let data = UserDefaults.standard.data(forKey: Self.cacheKey),
              let cached = try? JSONDecoder().decode([CachedRate].self, from: data) else { return }
        rates = cached.map {
            CurrencyRate(code: $0.code, name: $0.name, flag: $0.flag, nominal: $0.nominal,
                          rate: $0.rate, previousRate: $0.previousRate)
        }
        lastFetched = UserDefaults.standard.object(forKey: Self.cacheDateKey) as? Date
        tableView.reloadData()
    }

    private func saveCache() {
        let cached = rates.map {
            CachedRate(code: $0.code, name: $0.name, flag: $0.flag, nominal: $0.nominal,
                       rate: $0.rate, previousRate: $0.previousRate)
        }
        if let data = try? JSONEncoder().encode(cached) {
            UserDefaults.standard.set(data, forKey: Self.cacheKey)
            UserDefaults.standard.set(Date(), forKey: Self.cacheDateKey)
            lastFetched = Date()
        }
    }

    private struct CachedRate: Codable {
        let code: String, name: String, flag: String
        let nominal: Int, rate: Double
        let previousRate: Double?
    }

    // MARK: - Fetch from NBKR

    private func fetchRates() {
        guard !isLoading else { return }
        isLoading = true
        if rates.isEmpty { loadingIndicator.startAnimating() }

        // NBKR provides an XML daily-rates feed.
        // Real production URL: https://www.nbkr.kg/XML/daily.xml
        guard let url = URL(string: "https://www.nbkr.kg/XML/daily.xml") else { return }
        var request = URLRequest(url: url)
        request.timeoutInterval = 15

        URLSession.shared.dataTask(with: request) { [weak self] data, _, error in
            DispatchQueue.main.async {
                guard let self = self else { return }
                self.isLoading = false
                self.loadingIndicator.stopAnimating()
                self.tableView.refreshControl?.endRefreshing()

                guard let data = data, error == nil else {
                    // Stay with cached data, no alert
                    return
                }

                let parsed = self.parseNBKRXml(data)
                if !parsed.isEmpty {
                    // Map old rates to detect change
                    let oldByCode = Dictionary(uniqueKeysWithValues: self.rates.map { ($0.code, $0.rate) })
                    self.rates = parsed.map {
                        CurrencyRate(code: $0.code, name: $0.name, flag: $0.flag,
                                     nominal: $0.nominal, rate: $0.rate,
                                     previousRate: oldByCode[$0.code])
                    }
                    self.saveCache()
                    self.tableView.reloadData()
                }
            }
        }.resume()
    }

    private func parseNBKRXml(_ data: Data) -> [CurrencyRate] {
        // Simple parsing of NBKR daily.xml — extracts 6 key currencies.
        // Format: <Currency ISOCode="USD"><Title>...</Title><Value>...</Value><Nominal>1</Nominal></Currency>
        let parser = NBKRXMLParser()
        parser.parse(data: data)
        let known = [
            ("USD", "Доллар США", "🇺🇸"),
            ("EUR", "Евро", "🇪🇺"),
            ("RUB", "Российский рубль", "🇷🇺"),
            ("KZT", "Казахстанский тенге", "🇰🇿"),
            ("CNY", "Китайский юань", "🇨🇳"),
            ("TRY", "Турецкая лира", "🇹🇷"),
            ("UZS", "Узбекский сум", "🇺🇿"),
            ("GBP", "Британский фунт", "🇬🇧"),
            ("JPY", "Японская иена", "🇯🇵"),
        ]
        return known.compactMap { code, name, flag in
            guard let parsed = parser.rates[code] else { return nil }
            return CurrencyRate(code: code, name: name, flag: flag,
                                nominal: parsed.nominal, rate: parsed.rate,
                                previousRate: nil)
        }
    }

    // MARK: - UITableView

    func numberOfSections(in tableView: UITableView) -> Int { 1 }
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int { rates.count }

    func tableView(_ tableView: UITableView, titleForFooterInSection section: Int) -> String? {
        guard let date = lastFetched else { return "Курсы Национального банка КР" }
        let f = DateFormatter()
        f.dateStyle = .medium
        f.timeStyle = .short
        f.locale = Locale(identifier: "ru_RU")
        return "Источник: Национальный банк КР (nbkr.kg)\nОбновлено: \(f.string(from: date))"
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let r = rates[indexPath.row]
        let cell = tableView.dequeueReusableCell(withIdentifier: "Rate", for: indexPath) as! RateCell
        cell.configure(rate: r)
        return cell
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        let rate = rates[indexPath.row]
        let converter = CurrencyConverterViewController(rate: rate)
        navigationController?.pushViewController(converter, animated: true)
    }
}

// Custom cell

private final class RateCell: UITableViewCell {
    private let flagLabel = UILabel()
    private let codeLabel = UILabel()
    private let nameLabel = UILabel()
    private let rateLabel = UILabel()
    private let changeLabel = UILabel()

    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: .default, reuseIdentifier: reuseIdentifier)
        accessoryType = .disclosureIndicator

        flagLabel.font = .systemFont(ofSize: 28)
        codeLabel.font = .systemFont(ofSize: 17, weight: .semibold)
        codeLabel.textColor = .label
        nameLabel.font = .systemFont(ofSize: 13)
        nameLabel.textColor = .secondaryLabel
        rateLabel.font = .monospacedDigitSystemFont(ofSize: 17, weight: .semibold)
        rateLabel.textColor = .label
        rateLabel.textAlignment = .right
        changeLabel.font = .systemFont(ofSize: 12)
        changeLabel.textAlignment = .right

        let leftStack = UIStackView(arrangedSubviews: [codeLabel, nameLabel])
        leftStack.axis = .vertical
        leftStack.spacing = 2

        let rightStack = UIStackView(arrangedSubviews: [rateLabel, changeLabel])
        rightStack.axis = .vertical
        rightStack.spacing = 2
        rightStack.alignment = .trailing

        let outer = UIStackView(arrangedSubviews: [flagLabel, leftStack, UIView(), rightStack])
        outer.axis = .horizontal
        outer.spacing = 12
        outer.alignment = .center
        outer.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(outer)

        NSLayoutConstraint.activate([
            outer.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 8),
            outer.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -8),
            outer.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            outer.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
        ])
    }
    required init?(coder: NSCoder) { fatalError() }

    func configure(rate: CurrencyRate) {
        flagLabel.text = rate.flag
        codeLabel.text = "\(rate.nominal) \(rate.code)"
        nameLabel.text = rate.name
        rateLabel.text = String(format: "%.4f с", rate.rate)
        if let prev = rate.previousRate, prev > 0 {
            let diff = rate.rate - prev
            let pct = diff / prev * 100
            let sign = diff >= 0 ? "▲" : "▼"
            changeLabel.text = String(format: "%@ %.2f%%", sign, abs(pct))
            changeLabel.textColor = diff >= 0 ? .systemGreen : .systemRed
        } else {
            changeLabel.text = " "
        }
    }
}

// MARK: - NBKR XML Parser

private final class NBKRXMLParser: NSObject, XMLParserDelegate {
    struct Parsed { let nominal: Int; let rate: Double }
    var rates: [String: Parsed] = [:]

    private var currentCode: String?
    private var currentNominal: Int = 1
    private var currentValue: Double = 0
    private var currentText: String = ""

    func parse(data: Data) {
        let parser = XMLParser(data: data)
        parser.delegate = self
        parser.parse()
    }

    func parser(_ parser: XMLParser, didStartElement elementName: String, namespaceURI: String?,
                qualifiedName qName: String?, attributes attributeDict: [String : String] = [:]) {
        if elementName.lowercased() == "currency" {
            currentCode = attributeDict["ISOCode"] ?? attributeDict["isocode"]
            currentNominal = 1
            currentValue = 0
        }
        currentText = ""
    }

    func parser(_ parser: XMLParser, foundCharacters string: String) {
        currentText += string
    }

    func parser(_ parser: XMLParser, didEndElement elementName: String, namespaceURI: String?, qualifiedName qName: String?) {
        let txt = currentText.trimmingCharacters(in: .whitespacesAndNewlines)
        let l = elementName.lowercased()
        if l == "nominal", let n = Int(txt) { currentNominal = n }
        if l == "value" {
            // Replace comma with dot (RU number format)
            let normalized = txt.replacingOccurrences(of: ",", with: ".")
            if let v = Double(normalized) { currentValue = v }
        }
        if l == "currency" {
            if let code = currentCode, currentValue > 0 {
                rates[code] = Parsed(nominal: currentNominal, rate: currentValue)
            }
            currentCode = nil
        }
    }
}

// MARK: - Native Currency Converter

final class CurrencyConverterViewController: UIViewController, UITextFieldDelegate {
    private let rate: CurrencyRate

    init(rate: CurrencyRate) {
        self.rate = rate
        super.init(nibName: nil, bundle: nil)
    }
    required init?(coder: NSCoder) { fatalError() }

    private lazy var amountField: UITextField = {
        let f = UITextField()
        f.borderStyle = .roundedRect
        f.placeholder = "100"
        f.text = "100"
        f.font = .systemFont(ofSize: 32, weight: .medium)
        f.textAlignment = .center
        f.keyboardType = .decimalPad
        f.delegate = self
        f.translatesAutoresizingMaskIntoConstraints = false
        f.addTarget(self, action: #selector(recalc), for: .editingChanged)
        return f
    }()

    private let fromLabel = UILabel()
    private let arrow = UILabel()
    private let resultField = UITextField()
    private let toLabel = UILabel()
    private let rateInfoLabel = UILabel()
    private var isUserEditingResult = false

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .systemGroupedBackground
        title = "\(rate.code) → KGS"

        fromLabel.text = "\(rate.flag)  \(rate.code)"
        fromLabel.font = .systemFont(ofSize: 17, weight: .semibold)
        fromLabel.textAlignment = .center

        arrow.text = "⇅"
        arrow.font = .systemFont(ofSize: 28)
        arrow.textAlignment = .center

        toLabel.text = "🇰🇬  KGS"
        toLabel.font = .systemFont(ofSize: 17, weight: .semibold)
        toLabel.textAlignment = .center

        resultField.borderStyle = .roundedRect
        resultField.font = .systemFont(ofSize: 32, weight: .medium)
        resultField.textAlignment = .center
        resultField.keyboardType = .decimalPad
        resultField.delegate = self
        resultField.translatesAutoresizingMaskIntoConstraints = false
        resultField.addTarget(self, action: #selector(recalcReverse), for: .editingChanged)

        rateInfoLabel.text = "Курс: 1 \(rate.code) = \(String(format: "%.4f с", rate.rate / Double(rate.nominal)))"
        rateInfoLabel.textColor = .secondaryLabel
        rateInfoLabel.font = .systemFont(ofSize: 14)
        rateInfoLabel.textAlignment = .center

        [fromLabel, amountField, arrow, toLabel, resultField, rateInfoLabel].forEach {
            $0.translatesAutoresizingMaskIntoConstraints = false
        }

        let stack = UIStackView(arrangedSubviews: [fromLabel, amountField, arrow, toLabel, resultField, rateInfoLabel])
        stack.axis = .vertical
        stack.spacing = 12
        stack.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(stack)

        NSLayoutConstraint.activate([
            stack.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 20),
            stack.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 16),
            stack.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -16),

            amountField.heightAnchor.constraint(equalToConstant: 60),
            resultField.heightAnchor.constraint(equalToConstant: 60),
        ])

        recalc()
    }

    @objc private func recalc() {
        guard !isUserEditingResult else { return }
        let amount = Double(amountField.text?.replacingOccurrences(of: ",", with: ".") ?? "0") ?? 0
        let result = amount * (rate.rate / Double(rate.nominal))
        resultField.text = String(format: "%.2f", result)
    }

    @objc private func recalcReverse() {
        isUserEditingResult = true
        let result = Double(resultField.text?.replacingOccurrences(of: ",", with: ".") ?? "0") ?? 0
        let amount = result * Double(rate.nominal) / rate.rate
        amountField.text = String(format: "%.2f", amount)
        isUserEditingResult = false
    }
}
