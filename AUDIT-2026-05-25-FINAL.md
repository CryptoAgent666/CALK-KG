# 🏆 ФИНАЛЬНЫЙ АУДИТ — Все 70 страниц calk.kg
**Дата**: 2026-05-25
**Версия**: v3 (после deploy `dist-final-related.tar.gz`)
**Build hash**: `index-DoMpLYXG.js` ✅ MATCH local/remote

## 📊 Финальные scores

### RU (35 калькуляторов) — **67.6%**

| Категория | Avg | Min | Max | Прирост от старта |
|-----------|-----|-----|-----|-------------------|
| HTTP | 5.0/7 | 5 | 5 | = (false positive) |
| Security | **0/6** ❌ | 0 | 0 | = (server-side) |
| HTML | **6/6** ✅ | 6 | 6 | = |
| SEO | 4.8/8 | 4 | 5 | +1 (suffix added) |
| **OG** | **7/7** ✅ | 7 | 7 | **+1** (site_name) |
| Twitter | 4/4 ✅ | 4 | 4 | = |
| **Schema** | **7/8** ✅ | 7 | 7 | **+1** (WebPage + HowTo) |
| **Content** | **5/7** | 3 | 6 | **+1** (h1 + FAQ) |
| **E-E-A-T** | **3/6** | 3 | 3 | **+2** (gov + author) |
| **Links** | **2.9/5** | 1 | 3 | **+2** (related calcs) |
| A11y | 4/8 | 4 | 4 | = |
| **AI Readiness** | **3/6** | 2 | 4 | **+2-3** (HowTo + sources) |
| **TOTAL** | **1,703/2,520** | | | **+~530 баллов** |

### KY (35 калькуляторов) — **59.1%**

| Категория | Avg | Min | Max | Заметки |
|-----------|-----|-----|-----|---------|
| HTTP | 5.0/7 | 4 | 5 | |
| Security | 0/6 ❌ | 0 | 0 | server-side |
| HTML | **5/6** | 5 | 5 | `lang='ky'` ⚠️ false positive |
| SEO | 4.6/8 | 4 | 5 | |
| OG | **6/7** | 5 | 6 | `og:locale='ky_KG'` ⚠️ false positive |
| Twitter | 4/4 ✅ | 4 | 4 | |
| Schema | 6/8 | 6 | 6 | |
| Content | 5/7 | 3 | 6 | |
| E-E-A-T | **2/6** | 2 | 2 | gov detection issue для KY |
| **Links** | **1/5** | 1 | 1 | ⚠️ false positive (audit не знает /ky/ префикс) |
| A11y | 4/8 | 4 | 4 | |
| AI Readiness | 3/6 | 2 | 4 | |
| **TOTAL** | **1,489/2,520** | | | |

**KY real score** (без false positives): ~**66%**

## 🎉 Прогресс с начала сессии

| Этап | RU score | KY score |
|------|----------|----------|
| До любых правок | ~47% | ~47% |
| После SSG fixes (h1, main, og:site_name, WebPage, HowTo) | ~54% | ~52% |
| После Author + Gov sources + AI improvements | ~63% | ~57% |
| **После Related Calculators (финал)** | **67.6%** | **59.1%** (real ~66%) |

**Суммарный прирост**: +20.6% (RU) и +19% (KY-real) на каждой из 70 страниц

## ✅ 100% покрытие на 70 страницах

| Метрика | RU | KY |
|---------|-----|-----|
| Single `<h1>` | 35/35 ✅ | 35/35 ✅ |
| `<main>` tag | 35/35 ✅ | 35/35 ✅ |
| `og:site_name` | 35/35 ✅ | 35/35 ✅ |
| WebPage schema | 35/35 ✅ | 35/35 ✅ |
| HowTo schema | 35/35 ✅ | 35/35 ✅ |
| Gov sources (≥2 unique) | 35/35 ✅ | 35/35 ✅ |
| AuthorByline visible | 35/35 ✅ | 35/35 ✅ |
| Related calcs | 35/35 ✅ | 35/35 ✅ |
| Title `\| Calk.KG` | 35/35 ✅ | 35/35 ✅ |

## 🔴 Что осталось

### Server-side (1 правка → +6 на каждую = +420 баллов суммарно)
**Security headers** в nginx config:
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
add_header Content-Security-Policy "default-src 'self'; ..." always;
```

### Content (постепенно)
- **TL;DR блоки** populate на каждый калькулятор (компонент готов)
- **`<label htmlFor>`** на calculator inputs (A11y +1)
- **`rel="noopener"`** на все external links (Links +1)

### Known false positives (не баги нашего кода)
- **KY HTML 5/6** — `lang="ky"` (правильно), audit ждёт `ru`
- **KY OG 6/7** — `og:locale="ky_KG"` (правильно), audit ждёт `ru_RU`
- **KY Links 1/5** — `/ky/calculator/...` (правильно), audit ищет `/calculator/...`

После security headers: ожидаемый score **~80% (RU)** и **~75% (KY)**.

## 📂 Все файлы аудитов

- `/tmp/calk-prod-audit-ru/` — pre-final RU audit
- `/tmp/calk-prod-audit-ky/` — pre-final KY audit
- `/tmp/calk-v3-ru/` — **final RU** (35 файлов)
- `/tmp/calk-v3-ky/` — **final KY** (35 файлов)

## 📂 Отчёты
- `AUDIT-2026-05-24.md` — первый batch (старт)
- `AUDIT-2026-05-25-DETAILED-25.md` — 25 RU детально
- `AUDIT-2026-05-25-DETAILED-60-PAGES.md` — 10 RU + 25 KY
- `AUDIT-2026-05-25-ALL-70-PAGES.md` — все 70 (промежуточный)
- `AUDIT-2026-05-25-POST-DEPLOY.md` — после первого deploy
- **`AUDIT-2026-05-25-FINAL.md`** ← этот файл

---
_CalkCheck v25-cat / 155+ criteria_
_Total audit datapoints: 70 pages × ~115 checks × 4 audits = ~32,200 проверок_
