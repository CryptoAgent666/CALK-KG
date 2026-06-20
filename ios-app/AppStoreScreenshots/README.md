# App Store Screenshots — Build 5 (native rebuild)

Generated 2026-05-29 to resolve **Guideline 2.3.3** rejection — old screenshots
showed the previous WebView version; these show the current native UIKit app.

All screenshots captured from the actual app running in the iOS Simulator
(no marketing mockups), showing each calculator **in use** with realistic
data and live results — exactly what 2.3.3 requires.

## What to upload where (App Store Connect → Previews and Screenshots)

| Slot in App Store Connect | Folder | Pixel size |
|---|---|---|
| **iPhone 6.9" Display** | `iPhone-6.9-1320x2868/` | 1320 × 2868 |
| **iPhone 6.5" Display** (flagged by reviewer) | `iPhone-6.5-1242x2688/` | 1242 × 2688 |
| **iPad 13" Display** (flagged by reviewer) | `iPad-13-2064x2752/` | 2064 × 2752 |

> Use **"View All Sizes in Media Manager"** in App Store Connect to access the
> 6.5" and 13" slots specifically (as the reviewer noted).

## The 6 screenshots (same order for every device)

1. **01-hub** — Калькуляторы hub: native catalog of 6 calculators in 3 sections
   (Финансы / Авто / Здоровье). Proves the app is not a web browser.
2. **02-salary** — Зарплата: net "на руки" = 40 500 сом with full breakdown
   (соцфонд, подоходный налог). Segmented 10% / 5% ПВТ control.
3. **03-loan** — Кредит: 26 436 сом/мес annuity + 12-month amortization table.
4. **04-calorie** — Калории (КБЖУ): 2507 ккал/день, BMR/TDEE, macro split.
5. **05-customs** — Растаможка авто: full EAEU duty breakdown in USD + сом.
6. **06-bmi** — ИМТ: index + WHO category, color-coded reference table.

## Recommended upload order

Lead with **01-hub** (shows breadth) then **02-salary** / **03-loan**
(most popular, clearly "in use"). All 6 may be uploaded (max 10 per size).

## How they were generated (reproducible)

```bash
# Build for simulator
xcodebuild -project CalkKG.xcodeproj -scheme CalkKG -configuration Debug \
  -destination 'platform=iOS Simulator,name=iPhone 17 Pro Max,OS=26.5' \
  -derivedDataPath /tmp/CalkKG-DD build

# Launch with screenshot env vars and capture:
#   CALK_SCREENSHOT_MODE=1  → preloads demo history/bookmarks
#   CALK_INITIAL_CALC=<key> → auto-pushes a calculator (salary|loan|calorie|customs|bmi)
SIMCTL_CHILD_CALK_SCREENSHOT_MODE=1 SIMCTL_CHILD_CALK_INITIAL_CALC=salary \
  xcrun simctl launch <UDID> kg.calk.ios
xcrun simctl io <UDID> screenshot out.png

# Devices used:
#   iPhone 17 Pro Max → 1320×2868 (6.9"); scaled+cropped to 1242×2688 (6.5")
#   iPad Pro 13" (M5) → 2064×2752 (13", native)
```

6.5" images were produced distortion-free: scaled to width 1242, then
center-cropped to 2688 height (removed ~11px of status-bar padding, no stretch).
