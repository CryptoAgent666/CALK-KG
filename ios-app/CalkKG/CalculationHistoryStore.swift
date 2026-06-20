//
//  CalculationHistoryStore.swift
//  CalkKG
//
//  Lightweight persistence for the user's saved calculations.
//  Backed by UserDefaults JSON (no extra dependency, no Core Data setup
//  needed for this volume — we cap to 100 entries to keep things tiny).
//
//  Exists to satisfy App Store Guideline 4.2 — provides genuine native
//  functionality (offline persistence + share) beyond what a web view does.
//

import Foundation

/// One persisted calculation entry. Type-tagged enum so the History view
/// can render different layouts per calculation kind.
enum CalculationEntry: Codable {
    case salary(gross: Double, rate: Double, net: Double, createdAt: Date)
    case loan(principal: Double, ratePct: Double, months: Int, payment: Double, createdAt: Date)

    var createdAt: Date {
        switch self {
        case .salary(_, _, _, let d): return d
        case .loan(_, _, _, _, let d): return d
        }
    }

    /// Short title for the list row.
    var title: String {
        switch self {
        case .salary(let g, _, _, _):
            return "Зарплата \(formatNum(g)) сом"
        case .loan(let p, _, let m, _, _):
            return "Кредит \(formatNum(p)) сом × \(m) мес"
        }
    }

    /// Bold value shown on the right side of the list row.
    var primaryValue: String {
        switch self {
        case .salary(_, _, let net, _):
            return "\(formatNum(net)) сом"
        case .loan(_, _, _, let payment, _):
            return "\(formatNum(payment)) сом/мес"
        }
    }

    /// Tag shown in a chip — calculation kind.
    var kindLabel: String {
        switch self {
        case .salary: return "Зарплата"
        case .loan:   return "Кредит"
        }
    }

    /// Multi-line plain text rendered when the user shares this entry.
    func shareText() -> String {
        switch self {
        case .salary(let gross, let rate, let net, let d):
            return """
            💼 Зарплата — \(dateString(d))
            Начислено: \(formatNum(gross)) сом
            Ставка ПН: \(Int(rate * 100))%
            На руки: \(formatNum(net)) сом

            Calk.KG
            """
        case .loan(let p, let r, let m, let pay, let d):
            return """
            💳 Кредит — \(dateString(d))
            Сумма: \(formatNum(p)) сом
            Ставка: \(r)% годовых × \(m) мес
            Платёж: \(formatNum(pay)) сом/мес

            Calk.KG
            """
        }
    }

    private func formatNum(_ v: Double) -> String {
        let f = NumberFormatter()
        f.numberStyle = .decimal
        f.groupingSeparator = " "
        f.maximumFractionDigits = 0
        return f.string(from: NSNumber(value: v)) ?? "0"
    }
    private func dateString(_ d: Date) -> String {
        let f = DateFormatter()
        f.locale = Locale(identifier: "ru_RU")
        f.dateStyle = .medium
        f.timeStyle = .short
        return f.string(from: d)
    }
}

/// Single source of truth for stored calculations.
/// Posts `historyChanged` whenever the list mutates so observers reload.
final class CalculationHistoryStore {
    static let shared = CalculationHistoryStore()
    static let historyChanged = Notification.Name("CalculationHistoryStore.changed")

    private let storageKey = "calkkg_history_v1"
    private let maxEntries = 100

    private(set) var entries: [CalculationEntry] = []

    private init() {
        load()
    }

    func add(_ entry: CalculationEntry) {
        entries.insert(entry, at: 0) // newest first
        if entries.count > maxEntries {
            entries = Array(entries.prefix(maxEntries))
        }
        persist()
    }

    func remove(at index: Int) {
        guard entries.indices.contains(index) else { return }
        entries.remove(at: index)
        persist()
    }

    func clearAll() {
        entries.removeAll()
        persist()
    }

    private func persist() {
        do {
            let data = try JSONEncoder().encode(entries)
            UserDefaults.standard.set(data, forKey: storageKey)
            NotificationCenter.default.post(name: Self.historyChanged, object: nil)
        } catch {
            // Encoding can't realistically fail for our enum, but if it did
            // we'd rather drop the write than crash — user data is still
            // in-memory and they can retry.
            NSLog("Failed to persist history: \(error)")
        }
    }

    private func load() {
        guard let data = UserDefaults.standard.data(forKey: storageKey) else { return }
        do {
            entries = try JSONDecoder().decode([CalculationEntry].self, from: data)
        } catch {
            NSLog("Failed to load history: \(error)")
            entries = []
        }
    }
}
