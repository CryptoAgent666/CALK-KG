# CALK-KG (calk.kg) — project context

Kyrgyzstan tax/finance/utility calculator site. **Vite 5 + React 18 + TypeScript**, **bilingual
Russian (ru) / Kyrgyz (ky)**, **35 calculators**. Currency **сом (KGS)**. Git:
`github.com/CryptoAgent666/CALK-KG`. Build: `npm run build` (`vite build` → `generate-static-html.js`
→ `generate-sitemap.js`); publish `dist/`.

## Regulatory constants (taxes, soc fund, pensions, benefits, fines, duties, utility tariffs…)

The site hard-codes hundreds of government-set values. They are inventoried + freshness-monitored.
**READ `CONSTANTS-PILOT-2026-06.md` before touching any constant.**

- **Inventory / ledger:** `src/data/regulatory-constants.canonical.json` — **428 constants** (281
  gov-regulated; **all 35/35 calculators covered**, incl. a 2026-06-17 completeness pass that added
  per-city utility tariffs + customs/tax table rows). ⚠️ An **audit ledger — NOT imported by the
  site.** Apply fixes to the live files, then reconcile the ledger.
- **THREE surfaces, one DEAD:**
  - **COMPUTE (authoritative):** `src/pages/*CalculatorPage.tsx` + `src/data/*.ts` (`sickLeaveData.ts`,
    `trafficFines.ts`, `scholarshipData.ts`, `constructionData.ts`, …). The real calculator math — fix here first.
  - **PROSE:** `src/i18n/translations-ru.ts` (active RU) + `src/i18n/translations-ky.ts` (active KY).
    Flat `"key": "value"`. Update **both languages** for any displayed value.
  - ⚠️ **`src/i18n/translations.ts`** (nested `{ru:{…},ky:{…}}`, ~13.8k keys) is **not imported at runtime**
    (the app uses only `translations-ru.ts` + `translations-ky.ts`), so don't edit it for **runtime prose**.
    BUT it is **NOT fully dead**: `scripts/generate-static-html.js` reads it for the static `<head>` **SEO meta**
    (`*_calc_title` / `*_calc_description`) and `scripts/check-translation-keys.js` treats it as the **key master**.
    So when a meta description / supported-city set changes, also update the matching `*_calc_description` here
    (both `ru:` and `ky:` blocks), and add any brand-new `t()` keys, or the static meta goes stale and the
    key-checker flags them. (Prerender is shell + meta only — tariff numbers render client-side from the active files.)

### State as of 2026-06-17 (pilot run from DATA_HUB)
- **428 constants** = **109 current · 9 stale (deferred) · 102 uncertain · 208 unverified**. 220 gov
  web-verified vs official 2026 KG sources; the 61 completeness-pass adds (per-city tariffs etc.) are
  unverified → Tier-2/calendar.
- **25 fixes APPLIED** to the working tree (COMPUTE + RU/KY prose), **NOT deployed**. Incl. **deposit
  guarantee 200k→1M сом**, **МЗП 2 500→3 280**, **pension base 3 000→3 170**, **family benefit
  1 200→1 500 + ГМД 1 700→1 500**, **7 electricity tariffs** (01.05.2026 grid), **gas commercial
  28→24.25**, **heating 1 950→1 560**, patent limit 10→30 млн, single-tax 12→8 млн, phone fine
  1 500→3 000, mortgage/alimony/housing/water prose.
- ⚠️ **Deferred (structural, NOT applied):** sick-leave bracket logic (3–5 yr must be 60% not 80%;
  5–8 yr 80% not 100%; first 10 working days; cap 10 000/mo), scholarship semantics (academic 800/mo,
  president 60 000 one-time), ~19 traffic-fine **статья** relabels, gas/electricity narrative prose
  (dependent worked-example arithmetic), alimony minimum-floor implementation.
- Monitored by DATA_HUB: Tier-1 weekly (`calk-kg-monitor-config.json`, 281 gov / 56 pages, gov-only
  `*.gov.kg` whitelist) + Tier-2 quarterly. Dashboard «Полный пилот». Loop: alert → fix here
  (COMPUTE then RU+KY) → `npm run build` → deploy.

## Key KG context (2026)
- **Подоходный налог 10%** standard / **5%** for ПВТ (High-Tech Park) residents. НМД (non-taxable
  minimum) **14 970 сом**. Соцфонд **10%** employee (8% ПФ + 2% ГНПФ); employer adds (standard total
  ~27.25%, business 2.25%).
- **МЗП (min wage) 3 280 сом** from 2026. Patent / single-tax (единый налог) are special regimes.
  Единый налог: **NO revenue cap** (ст.418 ч.5/6 НК repealed by Закон №185 от 31.07.2025; ограничения
  по виду деятельности — ст.419). Trade rates by turnover: **≤50 млн 0,5% flat** (нал+безнал),
  **>50 млн 4% нал / 2% безнал** (ст.423 ч.1); **ИП 0% ≤15 млн** (ст.423 ч.8). НК has **no numeric
  VAT-registration threshold** (ст.255 — по признаку общего режима). Verified verbatim 2026-07-20.
- Taxi aggregator income tax **1%** (ст.197 ч.3 НК, подоходный через агрегатор; до 31.12.2027,
  потом 2% 2028–29, 5% с 2030). Electric vehicles: **0% customs duty + excise** (ЕЭК №111, in
  force 22.01.2026, quota 15 000 units). Deposit guarantee **1 000 000 сом** (НБКР).

## ⚠️ Working tree
The repo had ~150 **pre-existing uncommitted files** (a prior 2026-03 update, not from the pilot) +
this pilot's ~10. Triage/commit separately. Backups from the pilot: `*.bak-kgpilot`.
