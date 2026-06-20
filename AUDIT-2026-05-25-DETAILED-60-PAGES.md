# Детальный аудит — 60 страниц (35 RU + 25 KY)
**Дата**: 2026-05-25
**Скилл**: CalkCheck v25-cat / 155+ criteria
**Всего проверок**: ~6,900

## Сводка по всем 60 страницам

### 🇷🇺 Russian — 35 калькуляторов

| Группа | Status |
|--------|--------|
| HTML structure | 6/6 на всех 35 ✅ |
| Twitter Cards | 4/4 на всех 35 ✅ |
| Security headers | **0/6 на всех 35** ❌ (server-side) |
| OG | 6/7 (нет og:site_name — fixed in dist) |
| SEO | 3-5/8 (suffix — fixed in dist) |
| Schema | 6/8 (нет WebPage/Person@id) |
| Content | 4-5/7 (двойной H1, no FAQ in SSG — fixed in dist) |
| E-E-A-T | 1-2/6 (нет gov-ссылок, нет AuthorByline) |
| Links | 3/5 (нет rel=noopener) |
| A11y | 4/8 (нет main — fixed in dist) |
| AI Readiness | 0-2/6 (нет TL;DR, HowTo schema) |

### 🇰🇬 Kyrgyz — 25 калькуляторов (проверено)

| Группа | Status | Разница с RU |
|--------|--------|--------------|
| HTML | **5/6** (на всех 25) | -1 (LSRequiresIPhoneOS-like tag отсутствует?) |
| OG | **5/7** (на всех 25) | -1 (lang mismatch?) |
| Schema | **5/8** (на всех 25) | -1 (inLanguage='ky' но schema часть пишет 'ru') |
| HTML lang="ky" | ✅ корректно | ОК |
| Остальное | Идентично RU версии | ОК |

## 📊 Детальные scores

### 10 RU calcs (первый batch — теперь детально)

| Calc | HTTP | Sec | HTML | SEO | OG | TW | Schema | Content | EEAT | Links | A11y | AI |
|------|------|-----|------|-----|-----|-----|--------|---------|------|-------|------|-----|
| construction | 5/7 | 0/6 | 6/6 | 5/8 | 6/7 | 4/4 | 6/8 | 4/7 | 1/6 | 3/5 | 4/8 | 1/6 |
| crop-yield | 5/7 | 0/6 | 6/6 | 5/8 | 6/7 | 4/4 | 6/8 | 5/7 | 1/6 | 3/5 | 4/8 | **0/6** |
| currency-exchange | 5/7 | 0/6 | 6/6 | 4/8 | 6/7 | 4/4 | 6/8 | 4/7 | 1/6 | 3/5 | 4/8 | 1/6 |
| fuel | 5/7 | 0/6 | 6/6 | 4/8 | 6/7 | 4/4 | 6/8 | 5/7 | 1/6 | 3/5 | 4/8 | 1/6 |
| mobile-tariffs | 5/7 | 0/6 | 6/6 | 4/8 | 6/7 | 4/4 | 6/8 | 4/7 | 1/6 | 3/5 | 4/8 | **0/6** |
| money-transfer | 5/7 | 0/6 | 6/6 | 4/8 | 6/7 | 4/4 | 6/8 | 4/7 | 1/6 | 3/5 | 4/8 | 1/6 |
| rental | 5/7 | 0/6 | 6/6 | 5/8 | 6/7 | 4/4 | 6/8 | 5/7 | 1/6 | 3/5 | 4/8 | **0/6** |
| **salary** | 5/7 | 0/6 | 6/6 | **3/8** | 6/7 | 4/4 | 6/8 | 5/7 | 1/6 | 3/5 | 4/8 | **2/6** |
| scholarship | 5/7 | 0/6 | 6/6 | 5/8 | 6/7 | 4/4 | 6/8 | 4/7 | 1/6 | 3/5 | 4/8 | 1/6 |
| sick-leave | 5/7 | 0/6 | 6/6 | 4/8 | 6/7 | 4/4 | 6/8 | 5/7 | 1/6 | 3/5 | 4/8 | **0/6** |

### 25 KY calcs

| Calc | HTTP | Sec | HTML | SEO | OG | TW | Schema | Content | EEAT | Links | A11y | AI |
|------|------|-----|------|-----|-----|-----|--------|---------|------|-------|------|-----|
| alimony | 5/7 | 0/6 | 5/6 | 4/8 | 5/7 | 4/4 | 5/8 | 4/7 | 1/6 | 3/5 | 4/8 | 1/6 |
| auto-loan | 5/7 | 0/6 | 5/6 | 4/8 | 5/7 | 4/4 | 5/8 | 4/7 | 1/6 | 3/5 | 4/8 | 1/6 |
| calorie | 5/7 | 0/6 | 5/6 | 4/8 | 5/7 | 4/4 | 5/8 | 5/7 | 1/6 | 3/5 | 4/8 | 1/6 |
| construction | 5/7 | 0/6 | 5/6 | 5/8 | 5/7 | 4/4 | 5/8 | 4/7 | 1/6 | 3/5 | 4/8 | 1/6 |
| crop-yield | 5/7 | 0/6 | 5/6 | 4/8 | 5/7 | 4/4 | 5/8 | 5/7 | 1/6 | 3/5 | 4/8 | **0/6** |
| currency-exchange | 5/7 | 0/6 | 5/6 | 4/8 | 5/7 | 4/4 | 5/8 | 4/7 | 1/6 | 3/5 | 4/8 | 1/6 |
| customs | 5/7 | 0/6 | 5/6 | 5/8 | 5/7 | 4/4 | 5/8 | 5/7 | 2/6 | 3/5 | 4/8 | 1/6 |
| deposit | 5/7 | 0/6 | 5/6 | 5/8 | 5/7 | 4/4 | 5/8 | 4/7 | 1/6 | 3/5 | 4/8 | 1/6 |
| electricity | 5/7 | 0/6 | 5/6 | 5/8 | 5/7 | 4/4 | 5/8 | 5/7 | 1/6 | 3/5 | 4/8 | 1/6 |
| **family-benefit** | 5/7 | 0/6 | 5/6 | **3/8** | **4/7** | 4/4 | 5/8 | 4/7 | 1/6 | 3/5 | 4/8 | 1/6 |
| fuel | 5/7 | 0/6 | 5/6 | 4/8 | 5/7 | 4/4 | 5/8 | 5/7 | 1/6 | 3/5 | 4/8 | 1/6 |
| gas | 5/7 | 0/6 | 5/6 | 4/8 | 5/7 | 4/4 | 5/8 | 4/7 | 1/6 | 3/5 | 4/8 | 1/6 |
| heating | 5/7 | 0/6 | 5/6 | 4/8 | 5/7 | 4/4 | 5/8 | 5/7 | 1/6 | 3/5 | 4/8 | 1/6 |
| housing | 5/7 | 0/6 | 5/6 | 5/8 | 5/7 | 4/4 | 5/8 | 4/7 | 1/6 | 3/5 | 4/8 | 1/6 |
| loan | 5/7 | 0/6 | 5/6 | 5/8 | 5/7 | 4/4 | 5/8 | 4/7 | 1/6 | 3/5 | 4/8 | 1/6 |
| mobile-tariffs | 5/7 | 0/6 | 5/6 | 4/8 | 5/7 | 4/4 | 5/8 | 4/7 | 1/6 | 3/5 | 4/8 | **0/6** |
| money-transfer | 5/7 | 0/6 | 5/6 | 4/8 | 5/7 | 4/4 | 5/8 | 4/7 | 1/6 | 3/5 | 4/8 | 1/6 |
| mortgage | 5/7 | 0/6 | 5/6 | 5/8 | 5/7 | 4/4 | 5/8 | 5/7 | 2/6 | 3/5 | 4/8 | 1/6 |
| passport | 5/7 | 0/6 | 5/6 | 5/8 | 5/7 | 4/4 | 5/8 | 4/7 | 1/6 | 3/5 | 4/8 | 1/6 |
| patent | 5/7 | 0/6 | 5/6 | 5/8 | 5/7 | 4/4 | 5/8 | 4/7 | 1/6 | 3/5 | 4/8 | 1/6 |
| pension | 5/7 | 0/6 | 5/6 | 4/8 | 5/7 | 4/4 | 5/8 | 5/7 | 1/6 | 3/5 | 4/8 | 1/6 |
| property-tax | 5/7 | 0/6 | 5/6 | 4/8 | 5/7 | 4/4 | 5/8 | 5/7 | 1/6 | 3/5 | 4/8 | 1/6 |
| rental | 5/7 | 0/6 | 5/6 | 5/8 | 5/7 | 4/4 | 5/8 | 5/7 | 1/6 | 3/5 | 4/8 | **0/6** |
| **salary** | 5/7 | 0/6 | 5/6 | **3/8** | 5/7 | 4/4 | 5/8 | 5/7 | 1/6 | 3/5 | 4/8 | 1/6 |
| scholarship | 5/7 | 0/6 | 5/6 | 5/8 | 5/7 | 4/4 | 5/8 | 4/7 | 1/6 | 3/5 | 4/8 | 1/6 |

## 🚨 Уникальные KY проблемы (vs RU)

### KY-страницы скорят на 3 балла меньше (HTML+OG+Schema)

1. **HTML 5/6** vs RU 6/6 — manifest+favicon detection не работает на KY (нужно проверить)
2. **OG 5/7** vs RU 6/7 — одна OG тэг отсутствует на KY
3. **Schema 5/8** vs RU 6/8 — `inLanguage` schema поле возможно показывает `ru` вместо `ky`

### Worst KY case: family-benefit
- SEO 3/8 + OG 4/7 (минимум по сайту)
- Возможно title/description не переведены полностью

## 🟢 Что уже исправлено в `dist/` (ждёт deploy)

| # | Фикс | Затронуто |
|---|------|-----------|
| 1 | Title suffix `\| Calk.KG` | 35 RU + 25 KY |
| 2 | Один `<h1>` (убрал дубль из vite plugin) | Все 60 |
| 3 | `<main>` вместо `<article id="static-content">` | Все 60 |
| 4 | `og:site_name = "Calk.KG"` | Все 60 |
| 5 | **property-tax, single-tax, social-fund title fixes** | RU+KY |
| 6 | FAQ в SSG (для всех calculators с FAQ keys) | Все 60 |
| 7 | AASA + assetlinks.json для Apple/Google | Site-wide |
| 8 | Russian typo `с специалистами` → `со специалистами` | i18n |

## 🔴 Что осталось (приоритет)

### Server-side (1 правка для всего сайта)
- **Security headers** в nginx config — закроет 6/6 на всех 60 страницах

### Code-side (быстрые фиксы)
- **rel="noopener"** на external links (~30 файлов)
- **`<label htmlFor>`** для всех calculator inputs (a11y)
- **WebPage schema** + Person schema в schemaGenerator

### KY-specific (нужно расследовать)
- Почему KY: HTML 5/6 вместо 6/6 (manifest detection?)
- Почему KY: OG 5/7 вместо 6/7 (какой OG tag отсутствует?)
- Почему KY: Schema 5/8 вместо 6/8 (inLanguage?)

### Content task (постепенно)
- AuthorByline + ссылки на minfin.kg, mlsp.gov.kg, sti.gov.kg
- TL;DR / Quick Answer блок в начале каждой статьи
- HowTo schema в schemaGenerator.ts

## Файлы детальных отчётов

- `/tmp/calk-audit-first-10-details/` — 10 RU calcs полные dumps
- `/tmp/calk-audit-25-details/` — 25 RU calcs полные dumps
- `/tmp/calk-audit-ky-25-details/` — 25 KY calcs полные dumps
- `AUDIT-2026-05-24.md` — первый batch
- `AUDIT-2026-05-24-part2.md` — второй batch (сводный)
- `AUDIT-2026-05-25-DETAILED-25.md` — детально 25 RU
- `AUDIT-2026-05-25-DETAILED-60-PAGES.md` — этот файл (10 RU + 25 KY)
- `AUDIT-2026-05-25-SUMMARY.md` — общий summary

---
_Generated by CalkCheck v25-cat / 155+ criteria_
