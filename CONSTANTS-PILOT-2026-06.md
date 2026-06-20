# calk.kg — Constants pilot & 2026 freshness (handoff)

Session log + living reference for the regulatory-constants pilot run **2026-06-17** from the
DATA_HUB session. Repo: `CALK-KG` (Vite 5 + React 18 + TypeScript, **bilingual RU/KY**).
**Eighth fleet site on the full pipeline** (after calk24.de, calk-usa.com, calk.kz, calk-au.com,
calk.nz, calk-ca.com, calks.uk). Currency = **сом (KGS)**.

---

## TL;DR — current state

| Thing | State |
|---|---|
| Constants | **428** canonical (`src/data/regulatory-constants.canonical.json`) — sweep of 35 calculators (6 agents) + adversarial completeness pass (+61). **281 gov-regulated**, 147 market/other. |
| Monitoring | Tier-1 weekly server monitor (`calk-kg-monitor-config.json`, **281 gov constants / 56 source pages**, gov-only `*.gov.kg` whitelist) + Tier-2 quarterly. |
| Freshness | 220 gov web-verified vs official 2026 KG sources (5 source-topic agents). **current 109 · stale 9 (deferred) · uncertain 102 · unverified 208**. (61 completeness-pass adds = unverified → Tier-2.) |
| Completeness | ✅ All **35/35** calculators covered. 2026-06-17 adversarial 2nd pass added **+47 per-city utility tariffs** (heating/water: Osh, Karakol, Naryn, Talas, Tokmok, Batken, Jalal-Abad) + 9 customs hybrid-excise bands + 5 tax/payroll conditions. Patent/passport/property/tourist/zakat/housing tables were already complete. |
| ⚠️ Unlike other fleet sites | calk.kg had **real wrong COMPUTE outputs**, not just stale prose. 25 fixes applied (working tree); deploy NOT done. |
| Dashboard | calk.kg = **«Полный пилот»** (8th), `pipeline=full`, `monitored=true`. |
| **Deployed?** | ❌ **NOT deployed.** Fixes are in the working tree. `npm run build` then publish `dist/` per your host. |

## 0. ⚠️ Two things to know before touching constants

1. **Three constant surfaces, one is DEAD:**
   - **COMPUTE (authoritative for the math):** `src/pages/*CalculatorPage.tsx` + `src/data/*.ts`
     (e.g. `sickLeaveData.ts`, `trafficFines.ts`, `scholarshipData.ts`, `constructionData.ts`).
     This is what the calculator actually computes with — **fix here first.**
   - **PROSE:** `src/i18n/translations-ru.ts` (active RU, eager+fallback) and
     `src/i18n/translations-ky.ts` (active KY, lazy). Flat `"key": "value"` format. Rates/thresholds
     are embedded in article/FAQ strings.
   - **DEAD:** `src/i18n/translations.ts` (nested `export const translations = {ru:{…}}`, 13,778 keys)
     is **NOT imported by anything** (`index.ts` only imports `translations-ru` + `translations-ky`).
     **Ignore it. Never edit it.** Consider deleting it to stop future confusion (out of scope here).
2. The **canonical JSON is an audit ledger — NOT imported by the site.** Apply fixes to the COMPUTE /
   PROSE files (authoritative), then reconcile the ledger.

## 1. What this pilot caught & fixed (2026-06-17)

The COMPUTE layer was mostly maintained to 2026, but several **government values were genuinely
stale — producing wrong calculator outputs** — and the i18n PROSE lagged the compute on tariffs.

### ✅ Applied (25) — working tree, NOT deployed

**COMPUTE scalar fixes (real wrong outputs):**
- **Deposit guarantee 200 000 → 1 000 000 сом** (raised 2023; was 5× low) — `deposit_insurance_sum`
  + 5 deposit prose keys. [НБКР «О защите банковских вкладов»]
- **МЗП (min wage) 2 500 → 3 280 сом** for 2026 (the site had frozen a *wrong* 2026 value) —
  `sickLeaveData.ts:MIN_MONTHLY_WAGE` + salary prose. [Кабмин, респбюджет-2026; tazabek]
- **Pension base part 3 000 → 3 170 сом** (since mid-2024) — `PensionCalculatorPage.tsx`. [sf.gov.kg]
- **Family benefit «үй-бүлөгө көмөк» 1 200 → 1 500 сом/child** (+25% 01.08.2025) + **ГМД 1 700 → 1 500**
  — `FamilyBenefitCalculatorPage.tsx`. [mlsp.gov.kg]
- **7 electricity tariffs** corrected to the 01.05.2026 grid (Приказ ДТЭК №103): population-unlimited
  4.48→**4.17**, commercial 4.48→**4.33**, industrial 3.78→**3.65**, budget 4.63→4.62, energy-intensive
  6.86→6.84, charging 6.00→5.99, social 2.97→2.96 — `ElectricityCalculatorPage.tsx`. [tazabek/economist.kg]
- **Gas commercial 28.00 → 24.2504 сом/м³** — `GasCalculatorPage.tsx`. [Газпром КГ]
- **Heating (Bishkek social) 1 950 → 1 560 сом/Гкал** (Приказ ДТЭК №42, 01.03.2026) — `HeatingCalculatorPage.tsx`.
- **Phone-driving fine 1 500 → 3 000 сом** (amount only) — `trafficFines.ts`.

**PROSE alignment (i18n RU+KY), where COMPUTE was verified-correct:**
- Patent income limit **10 → 30 млн сом** (`patent_faq_a2`).
- Single-tax limit **12 → 8 млн сом** (7 keys: info/who-can/dis/faq/req/limit-exceeded).
- Mortgage state program: «10–12%» → ГИК tiers (доступное ~14% / бюджетники 7–9% / соц. 4%).
- Housing-article tariffs (electricity 1.64–2.94, water 13.90, heating 1 560, gas 22.70).
- Water Bishkek total **11.35 → 13.90** (10.45 + 3.45) — water article keys.
- Alimony minimum МРОТ **2 500 → 3 280** (+ recomputed 750→984, example 1 650→2 165).

### ⏸ Deferred (9 stale + structural — NOT applied, your call)

- **Sick-leave is structurally wrong** (`sickLeaveData.ts` + `SickLeaveCalculatorPage.tsx`): per Пост.
  №434 brackets must be **≤5 yr = 60%, 5–8 yr = 80%, >8 yr = 100%** (code has 0–3/3–5/5–8/8+ =
  60/80/100/100 → 3–5 should be 60, 5–8 should be 80); employer pays first **10 working days** (not 3);
  from day 11 the benefit is **capped at 10 000 сом/mo** (code 50 000). Needs a logic rewrite.
- **Scholarship semantics** (`scholarshipData.ts`): basic academic ≈ **800 сом/mo** (code 3 000);
  presidential = **60 000 сом one-time** (code 8 000/mo) — needs a value + unit/semantics fix.
- **Traffic-fine статья numbers are systematically mislabeled** (~19 entries in `trafficFines.ts`):
  amounts are mostly right but article refs are wrong (ст.184/182/186 misused; speeding is ст.187,
  general driver conduct is ст.188). Data-integrity cleanup.
- **Gas & electricity ARTICLE narratives** (i18n) — flat→tiered electricity description and the gas
  worked examples (example1/2 totals, seasonal, gas-vs-electricity) have **dependent arithmetic**;
  swapping single numbers would create wrong totals. Needs a coherent bilingual content pass.
- **Alimony minimum floor** is described in prose but **not implemented** in compute.

### ❓ Uncertain (102) → Tier-2 / calendar
Patent per-city/activity tables, most individual traffic fines, passport/госпошлина amounts, tourist
fees, per-city utility tariffs (Osh/Karakol/…): **no authoritative 2026 online source found** — marked
uncertain (not guessed). Re-check via Tier-2 quarterly LLM verify + calendar.

## 2. Files touched by this pilot (≈10)
`src/pages/{Electricity,FamilyBenefit,Gas,Heating,Pension}CalculatorPage.tsx`,
`src/data/{sickLeaveData,trafficFines}.ts`, `src/i18n/{translations-ru,translations-ky}.ts`,
`src/data/regulatory-constants.canonical.json` (new). Backups: `*.bak-kgpilot` (delete after review).

> ⚠️ **The repo had ~150 OTHER uncommitted files before this pilot** (a prior 2026-03 update never
> committed). Those are **not** from this pilot. Review/commit them separately.

## 3. Monitoring (lives on the DATA_HUB server)
- **Tier-1 weekly** (`constants_freshness_monitor.py`, auto-discovers `*-monitor-config.json`):
  `calk-kg-monitor-config.json` = **281 gov constants / 56 source pages**, gov-only source-hash
  whitelist (`*.gov.kg`, sti.gov.kg, salyk.kg, sf.gov.kg, mlsp.gov.kg, cabinet.gov.kg,
  cbd.minjust.gov.kg, customs.gov.kg, grs.gov.kg, nbkr.kg, deposit.kg, gik.kg, stat.kg). News portals
  (24.kg, tazabek, akchabar, economist.kg, kaktus, knews) → calendar + Tier-2 only. Baseline seeds on
  the next weekly cron.
- **Tier-2 quarterly** fleet LLM verify (8 Jan/Apr/Jul/Oct).
- Dashboard: mydatahub.duckdns.org/dashboard → 🧮 Calculators (calk.kg = «Полный пилот»).
- Loop: alert/drift → fix in THIS repo (COMPUTE first, then RU+KY prose) → rebuild → deploy.

## 4. Build & deploy (your action)
`npm run build` (`vite build` → `generate-static-html.js` → `generate-sitemap.js`). Publish `dist/`
to your host (repo has `nginx.conf`, `public/_redirects`, `public/.htaccess` — confirm which is live).
**This pilot did NOT build or deploy.** Git remote: `github.com/CryptoAgent666/CALK-KG`.

## 5. Pending / TODO
- [ ] Review + apply the **deferred structural** fixes (§1): sick-leave logic, scholarship semantics,
      traffic-fine статья relabels, gas/electricity narrative prose, alimony floor.
- [ ] Resolve the **102 uncertain** via official tables (patent per-activity, fines, госпошлина).
- [ ] Consider **deleting the dead `src/i18n/translations.ts`** (13,778 unused keys).
- [ ] Commit/triage the ~150 pre-existing uncommitted files, then build + deploy.
