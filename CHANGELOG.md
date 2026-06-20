# Changelog

Все значимые изменения проекта Calk.KG (веб-сайт + мобильные приложения).
Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.0.0/).

## [2026-06-01] — iOS-приложение одобрено в App Store 🎉

### Added
- **iOS-приложение Calk.KG выпущено в App Store** (`kg.calk.ios`, версия 1.0).
  Нативное UIKit-приложение, прошло модерацию Apple.
  - 6 полностью нативных калькуляторов в 3 категориях:
    - **Финансы**: Зарплата, Кредит (+график погашения), Ипотека
    - **Авто**: Растаможка автомобиля (таблицы пошлин ЕАЭС)
    - **Здоровье**: Калории/КБЖУ (формула Mifflin-St Jeor), ИМТ (классификация ВОЗ)
  - Нативный конвертер валют с курсами НБКР (парсинг XML)
  - История расчётов с сохранением (UserDefaults) + удаление свайпом
  - Избранное (закладки на калькуляторы)
  - Поделиться результатом через системный share-лист iOS
  - Локальные уведомления о курсах валют (ежедневно в 10:00)
  - Тёмная тема, крупные заголовки, адаптив для iPhone и iPad
- **Кнопки App Store + Google Play в подвале сайта** — теперь доступны обе платформы.

### Changed
- Footer: добавлен бейдж App Store рядом с Google Play, выровнены в одну строку.

### Links
- App Store: https://apps.apple.com/app/id6771220038
- Google Play: https://play.google.com/store/apps/details?id=kg.calk.app

---

## [2026-05-29] — Скриншоты App Store

### Fixed
- Сгенерированы свежие скриншоты текущей нативной версии приложения
  для слотов 6.5″ iPhone, 6.9″ iPhone и 13″ iPad (Guideline 2.3.3).

---

## [2026-05-28] — SEO: исправление Breadcrumbs

### Fixed
- **BreadcrumbList structured data** (Google Search Console): схема больше не
  эмитится для страниц с < 2 элементами цепочки (убрана ошибка
  «Missing field itemListElement»). Защитная фильтрация в SSG, schemaGenerator
  и SchemaMarkup. Все 70 страниц калькуляторов (35 RU + 35 KY) — валидный
  3-элементный breadcrumb.

---

## [2026-05-26] — Аудит и SEO-доработки

### Added
- `<nav>` + `<article>` semantic landmarks в статический HTML (для Googlebot).
- `<main id="main">` landmark на всех страницах (a11y, skip-link).
- Брендированная страница 404 (`public/404.html`).
- OG-теги: `og:image:alt`, `og:locale:alternate`, `twitter:image:alt`.
- Карточки калькуляторов на главной как `<a href>` (35 внутренних ссылок для SEO).

### Fixed
- Дедупликация Schema.org (BreadcrumbList, FAQPage, WebApplication по 1 копии).
- KY-форматирование даты: «23-март 2026-жыл» вместо «March 23, 2026».
- Human-readable дата в статическом HTML («26 мая 2026 г.»).
- Контент пенсии: исправлена атрибуция взносов (работник платит 10% соцфонда).
- Loan FAQ: пересчитаны аннуитетные примеры (5 287 вместо 4 950).
- МРОТ синхронизирован на 2 500 сом; ГМД пособия — 1 700 сом.
- Traffic-fines: унифицирована скидка 70% за 30 дней.
- Устранены языковые утечки RU↔KY (жогорку, отуну, саякатчы, той, МРОТ→МАА).
- 7 SEO-заголовков дополнены словом «Калькулятор».
- Breadcrumb «Калькуляторы» сделан кликабельным.

### Security
- Создан `nginx-recommended.conf` с CSP, HSTS, X-Frame-Options, Referrer-Policy,
  Permissions-Policy, Brotli и корректным Content-Type для AASA.

---

## [2026-04] — Крупный SEO-апгрейд + актуализация данных

### Added
- WebPage / HowTo / FAQPage / BreadcrumbList schema на всех калькуляторах.
- llms.txt для AI-краулеров; hreflang RU/KY/x-default.
- AuthorByline (E-E-A-T), GovSources, QuickAnswer блоки.

### Changed
- Авто-переключение тарифов электроэнергии с мая 2026.
- Обновлены региональные зарплаты (алименты), цена золота (закят),
  тарифы топлива, МРОТ.

### Security
- Устранена утечка Android keystore/пароля из публичного репозитория,
  история git очищена (git-filter-repo), пароль ротирован.
