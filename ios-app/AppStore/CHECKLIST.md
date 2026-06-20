# Calk.KG iOS — Чеклист релиза в App Store

## ✅ Что уже готово автоматически

- [x] Xcode проект собран, `BUILD SUCCEEDED`
- [x] Bundle ID: `kg.calk.ios`
- [x] Минимальная версия iOS: 15.0
- [x] Иконка приложения 1024×1024 (унаследована с Android)
- [x] Splash screen с лого «Calk.KG»
- [x] Все native фичи: pull-to-refresh, share sheet, error screen
- [x] ATS exception для calk.kg в Info.plist
- [x] Тексты для App Store (RU/KY/EN) в `AppStore/metadata/`
- [x] Скрипты архивирования в `scripts/`
- [x] Distribution-сертификат `SRKYS78RMQ` обнаружен

## 📋 Что нужно сделать в Xcode (вручную)

### Сборка archive

- [ ] **Xcode → Product → Archive** (или запустить `./scripts/archive.sh`)
- [ ] Дождаться завершения (2-5 минут)
- [ ] Откроется Organizer с архивом

### App Store Connect

- [ ] Зайти на https://appstoreconnect.apple.com
- [ ] **My Apps → +  → New App**
- [ ] Заполнить:
  - **Platform:** iOS
  - **Name:** `Calk.KG`
  - **Primary Language:** Russian
  - **Bundle ID:** `kg.calk.ios` (появится после первой загрузки билда)
  - **SKU:** `calk-kg-ios-001`
  - **User Access:** Full Access

### Загрузка билда

- [ ] В Organizer: **Distribute App → App Store Connect → Upload**
- [ ] Подождать ~10-30 минут пока пройдёт processing
- [ ] Билд появится в App Store Connect

### App Store листинг

- [ ] **App Information:**
  - Category: Finance (primary), Utilities (secondary)
  - Content Rights: ☑ Does not use third-party content (или ☑ uses with rights)

- [ ] **Pricing and Availability:**
  - Price: Free
  - Availability: Все страны (или только Кыргызстан/Россия/Казахстан если хотите)

- [ ] **App Privacy:**
  - Data Collection: **No data collected**
  - Privacy Policy URL: `https://calk.kg/privacy-policy/`

- [ ] **Версия (1.0):**
  - **Description** — скопировать из `AppStore/metadata/ru/description.txt`
  - **Keywords** — из `AppStore/metadata/ru/keywords.txt`
  - **Subtitle** — из `AppStore/metadata/ru/subtitle.txt` (30 символов)
  - **Promotional Text** — из `AppStore/metadata/ru/promotional_text.txt`
  - **Support URL:** `https://calk.kg/contact/`
  - **Marketing URL:** `https://calk.kg`
  - **Localization:** добавить English (US) и Kyrgyz из соответствующих папок

- [ ] **Screenshots** (обязательно):
  - 6.9" Display (iPhone 17 Pro Max) — 1320×2868, 3-10 шт
  - 6.5" Display (iPhone 11 Pro Max) — 1242×2688, 3-10 шт
  - 13" Display (iPad Pro M5) — 2064×2752, 3-10 шт
  - Можно сделать в симуляторе: `Cmd+S` или `xcrun simctl io <UDID> screenshot file.png`

- [ ] **App Review Information:**
  - Sign-in required: No
  - Contact email/phone (свои)
  - Notes: "Это веб-обёртка для сайта calk.kg, который предоставляет калькуляторы для жителей Кыргызстана. Никакая регистрация не требуется. Все расчёты выполняются локально или на сайте."

- [ ] **Version Release:** Manual или Automatic после approval

### Submit for Review

- [ ] **Save** → **Add for Review** → **Submit**
- [ ] Ждать 24-48 часов (иногда быстрее)

## 🎯 Чего может потребовать ревью

### Часто спрашивают для веб-обёрток:

1. **"Looks like a website"** — иногда отклоняют по Guideline 4.2
   - Ответ: «Приложение даёт быстрый доступ к 35+ финансовым калькуляторам с native UI: pull-to-refresh, share sheet, кастомный error screen. Сами расчёты происходят локально в WebView для приватности.»

2. **"Where do users sign up?"**
   - Ответ: «Регистрация не требуется. Приложение полностью бесплатное.»

3. **"Demo account credentials"**
   - Ответ: «Не требуется, нет login flow.»

4. **"What's the in-app purchase?"**
   - Ответ: «Нет в-приложении покупок. Реклама показывается через Google AdSense только на веб-страницах внутри WebView.»

### Если отклонят:

- Подайте Appeal с пояснением что есть native фичи
- Можно добавить: Bookmarks (избранное), Settings экран, About экран — это уже точно пройдёт ревью

## 🚀 После одобрения

- [ ] Дать команду релизу: Manual → Release this version
- [ ] Приложение появится в App Store в течение 24 часов
- [ ] Скиньте ссылку — добавим её в Android-приложение (deep link «Скачать iOS-версию»)

## 📊 Метрики после релиза

В App Store Connect → **App Analytics** будет видно:
- Установки
- Активные пользователи (DAU/WAU/MAU)
- Удаления
- Crash reports (если будут)

Все эти данные собираются Apple, **не нами** — приватность пользователей не нарушается.
