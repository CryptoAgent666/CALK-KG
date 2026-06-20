# Response to App Store Review — Guideline 4.2 (Minimum Functionality)

**Submission ID**: 30dc322a-22dd-4258-86ac-ca7500b85e77
**Version**: 1.0 (build 5)

## Reviewer feedback

> The experience is similar to using a web browser. Features such as push
> notifications, Core Location, or sharing do not provide a robust enough
> experience on their own.

## What we changed

The app has been **fundamentally restructured**. The WebView is **no
longer a primary tab** — it lives only inside "Ещё → Все калькуляторы (35)"
and bookmark deep-links. The default landing screen is a native UIKit
hub listing **6 fully-native calculators** across 3 domains.

### Primary tab: «Калькуляторы» (UITableView Hub)

A native hub screen lists 6 calculators in 3 categorized sections.
Tapping any row pushes a 100% UIKit native calculator screen.

**Финансы (Finance)**
1. **Зарплата** — Salary "на руки" with KR tax code rules (10% социальный фонд + 10%/5% подоходный)
2. **Кредит** — Annuity loan calculator + 12-month amortization table
3. **Ипотека** — Mortgage with down-payment %, term in years

**Авто (Automotive)**
4. **Растаможка авто** — EAEU car customs (сбор + пошлина + акциз + НДС) with age-bracket lookup tables

**Здоровье (Health)**
5. **Калории (КБЖУ)** — BMR/TDEE via Mifflin-St Jeor + macro split (protein/fat/carbs)
6. **ИМТ** — Body Mass Index with WHO classification (7 categories, color-coded)

### Tab structure (5 tabs, **none requires WKWebView**)

| Tab | Native? | Description |
|-----|---------|-------------|
| 1. Калькуляторы | ✅ 100% UIKit | Hub + 6 native calculator screens |
| 2. Курсы | ✅ 100% UIKit | NBKR XML parser + converter (Swift) |
| 3. История | ✅ 100% UIKit | UserDefaults-persisted history + share |
| 4. Избранное | ✅ 100% UIKit | Bookmarks list (native) |
| 5. Ещё | UIKit + optional WebView | Web catalog, Settings, About |

### Additional native iOS features

- **UIActivityViewController share** — every calculation has a "Поделиться"
  button producing properly-formatted Russian text for Mail, Messages, AirDrop
- **UNUserNotificationCenter** — optional daily 10 AM reminder for currency
  rate updates (Settings → Уведомления)
- **UserDefaults persistence** — saved calculations survive relaunch,
  swipe-to-delete, clear-all
- **Dark mode** — full system colors (label, secondaryLabel, separator)
- **Large titles** — UINavigationBar large title style on every screen
- **System icons** — SF Symbols (creditcard, percent, house, car, flame, figure.stand)
- **iOS 15+ UIButton Configuration API** — modern button styling
- **Adaptive layouts** — UIStackView with `fillEqually` for tablet/phone

## Files added (Swift, UIKit, no WebView)

```
SalaryCalculatorViewController.swift    — ~340 lines
LoanCalculatorViewController.swift      — ~340 lines
MortgageCalculatorViewController.swift  — ~240 lines
CustomsCalculatorViewController.swift   — ~280 lines
CalorieCalculatorViewController.swift   — ~280 lines
BMICalculatorViewController.swift       — ~240 lines
CalculatorsHubViewController.swift      — ~120 lines
HistoryViewController.swift             — ~160 lines
CalculationHistoryStore.swift           — ~120 lines
MoreViewController.swift                — ~130 lines
NotificationsManager.swift              — ~ 60 lines
UIHelpers.swift                         — ~ 70 lines
```

**Total new native Swift code: ≈2,500 lines** of UIKit, Foundation, UserNotifications.

## Reviewer test path

1. Launch the app → lands on **Калькуляторы** tab (UITableView hub,
   no web content, no WKWebView instantiated)
2. Section "Финансы" → tap **Зарплата** → enter 50000 → see live
   calculation: 5000 social fund, 4500 tax, 40 500 net (Russian formatting)
3. Switch to ПВТ 5% rate → result updates instantly (no submit button)
4. Tap **Поделиться** → iOS share sheet appears with formatted text
5. Tap **Сохранить в историю** → confirmation alert
6. Back to hub → section "Здоровье" → **Калории**
7. Adjust gender / activity / goal → BMR, TDEE, macros all update live
8. Hub → section "Авто" → **Растаможка** → change age bracket → totals
   recalculate in USD + KGS instantly
9. Tab «История» → swipe-to-delete an entry, tap any to share
10. Tab «Ещё» → Настройки → toggle daily currency reminder (UNNotification
    permission prompt + scheduled 10 AM)

**None of the 6 native calculators ever instantiates WKWebView.**
All computation happens with native Swift types (Double, Int) and
the Foundation `NumberFormatter`.

## Why this is no longer "browser-like"

- Default tab is a native UITableView hub — not a web page
- 4 of 5 tabs never touch WKWebView at all
- 6 fully native calculators across **3 different domains** (finance, auto, health)
- Calculations use native types + native NumberFormatter (no JS round-tripping)
- Persistence via UserDefaults JSON (UI never blocks for server)
- Share via UIActivityViewController, not web share
- Notifications scheduled by the app (UNUserNotificationCenter)
- Country-specific rate tables (EAEU car customs, KR tax code) hard-coded
  in Swift — the app understands KR-specific rules natively

The user opens this app, taps "Зарплата", types a number, and gets a
result — never seeing a browser, never depending on the network.

We respectfully ask Apple to reconsider this submission.
