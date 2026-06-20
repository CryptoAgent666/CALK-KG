# CalkCheck Audit — calk.kg — 2026-05-25

**Полная проверка**: 35 калькуляторов + site-wide + AI content + AI code

## 🎯 Общая оценка

| Метрика | Значение |
|---------|----------|
| Site-wide infra | **7/7 ✅** |
| Per-page (35 страниц) | **2,307 ✅ / 452 ❌ / 1,056 ⚠️** |
| AI Content Detection | **35/35 HUMAN или LIKELY HUMAN** ✅ |
| AI Code Detection | **7 findings (low severity)** |
| **Overall score** | **~85/100** |

## ✅ Что работает отлично

### Site-wide
- ✅ robots.txt с AI-краулерами
- ✅ sitemap.xml (168 URLs включая alternates)
- ✅ llms.txt (6987 байт)
- ✅ TLS 1.3
- ✅ SSL сертификат активен

### Контент (AI Detection)
- Все 35 калькуляторов прошли как **HUMAN** или **LIKELY HUMAN**
- MTLD score высокие (100-313) — богатый словарь
- Burstiness CV хороший (0.64-0.98) — естественные предложения
- Cliché phrases практически отсутствуют (0-3.5/1k слов)

### Schema, OG, Twitter Cards, Hreflang
- ✅ 4 JSON-LD schemas (WebSite, Organization, BreadcrumbList, FAQPage, Calculator)
- ✅ Полный набор og:* тегов
- ✅ Twitter Cards полные
- ✅ Hreflang ru/ky/x-default правильные

## 🔴 Критические проблемы (повторяются на всех страницах)

### 1. **Security Headers — 0/6** ❌
**На всех 35 страницах отсутствуют:**
- HSTS (Strict-Transport-Security)
- CSP (Content-Security-Policy)
- X-Content-Type-Options
- X-Frame-Options
- Referrer-Policy
- Permissions-Policy

**Причина**: `nginx.conf` у нас в проекте имеет эти заголовки, но на боевом хостинге они не применены.

**Что делать**: добавить блок `add_header` в конфигурацию nginx хостинга:

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://nbkr.kg; frame-src https://googleads.g.doubleclick.net;" always;
```

### 2. **SEO suffix отсутствует — title** ⚠️
Title теги не содержат `| Calk.kg` суффикс — пропадает брендинг в поиске.
**Сейчас**: `Калькулятор зарплаты в Кыргызстане`
**Должно быть**: `Калькулятор зарплаты в Кыргызстане | Calk.KG`

### 3. **2 тега `<h1>` на странице** ❌
SEO лучшая практика — один `<h1>` на странице. Сейчас на каждом калькуляторе по 2.

### 4. **Двойная валюта `с с` (3 случая)** ❌
В контенте калькулятора зарплаты найдены тройные совпадения "с с" — где-то форматирование валюты повторяется (или это просто артефакт скрипта).

### 5. **Нет `<main>` элемента** ❌
Accessibility лучшая практика: основной контент должен быть в `<main>`.

### 6. **OG: missing `og:site_name`** ❌
Не указано имя сайта в Open Graph мете.

## 🟡 Важные улучшения

### 7. **E-E-A-T: 1/6** — слабо
- ❌ **Нет ссылок на gov-источники** (minfin.kg, mlsp.gov.kg, sti.gov.kg)
- ⚠️ Нет авторской атрибуции (AuthorByline)
- ⚠️ Нет TL;DR / Quick Answer блока для AI-цитирования
- ⚠️ Нет disclaimer на каждой странице

### 8. **AI Search Readiness: 2/6**
- ⚠️ Нет TL;DR
- ⚠️ Нет глоссария терминов
- ⚠️ Нет HowTo schema
- ⚠️ Source diversity — 0 gov/academic/international

### 9. **Cache-Control без stale-while-revalidate** ⚠️
Текущий: `public, max-age=3600` (или похожее).
Лучше: `public, max-age=3600, stale-while-revalidate=86400, s-maxage=31536000`

### 10. **HTTP compression: 0B compressed** ⚠️
Возможно curl не передал Accept-Encoding, либо отдача без Brotli/Gzip на некоторых ответах.

## 🟢 Минорные замечания

- `rel="noopener"` на внешних ссылках: 0/5 — добавить для безопасности
- Inputs без явных labels: 0/4 — для скринридеров
- 4 PNG OG-картинки — лучше WebP/AVIF
- 2 mixed AI patterns (money-transfer, property-tax) — em-dash density >20/1k

## 🔵 AI Code Detection (7 findings)

| Category | Severity | Description |
|----------|----------|-------------|
| K12 | WARN: 2 | Excessive "as any" (≥10 per file) |
| K7 | WARN: 4 | "as any" overuse (≥5 per file) |
| K5 | INFO: 1 | Useless intermediate var (`const x = y; return x`) |

Низкая критичность, можно почистить в свободное время.

## 📋 Приоритеты для фикса

| Приоритет | Что | Где |
|-----------|-----|-----|
| 🔴 **CRITICAL** | Security headers — все 6 | nginx config на хостинге |
| 🔴 **HIGH** | Title suffix `| Calk.kg` | React Helmet во всех страницах |
| 🔴 **HIGH** | 2 `<h1>` → 1 `<h1>` | Calculator pages |
| 🟡 **MEDIUM** | Двойная валюта `с с` | Проверить SalaryCalculatorPage |
| 🟡 **MEDIUM** | Добавить `<main>` | Все страницы |
| 🟡 **MEDIUM** | `og:site_name` | Helmet template |
| 🟡 **MEDIUM** | Gov-источники в статьях | Article components |
| 🟢 **LOW** | TL;DR / Quick Answer | Шаблон статьи |
| 🟢 **LOW** | HowTo schema | schemaGenerator.ts |
| 🟢 **LOW** | "as any" cleanup | 6 файлов |

## Отчёты

- `AUDIT-2026-05-24.md` — первые 10 калькуляторов
- `AUDIT-2026-05-24-part2.md` — остальные 25
- `AUDIT-2026-05-25-SUMMARY.md` — этот файл

---
_Generated by CalkCheck v25-cat / 155+ criteria_
