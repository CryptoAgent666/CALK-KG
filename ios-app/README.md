# Calk.KG iOS App

iOS-приложение для **calk.kg** — нативная Swift-обёртка с `WKWebView`, аналог Android TWA.

- **Bundle ID:** `kg.calk.ios`
- **Минимальная версия iOS:** 15.0 (покрывает 98%+ устройств в КР)
- **Архитектура:** UIKit + WKWebView (Swift)
- **Размер бандла:** ~1 МБ

## Что внутри

| Файл | Назначение |
|------|-----------|
| `AppDelegate.swift` | Точка входа приложения |
| `SceneDelegate.swift` | Создаёт окно, монтирует `WebViewController` |
| `WebViewController.swift` | Главный экран — fullscreen WKWebView с pull-to-refresh, share-кнопкой и обработкой ошибок |
| `ErrorView.swift` | Экран «Нет интернета» с кнопкой «Повторить» |
| `Info.plist` | Метаданные (имя, версия, ATS-исключения для calk.kg) |
| `Base.lproj/LaunchScreen.storyboard` | Splash-экран с логотипом «Calk.KG» |
| `Assets.xcassets/` | Иконка приложения (1024×1024) и accent color |

## Возможности

- ✅ Открывает **calk.kg** в полноэкранном режиме (без адресной строки Safari)
- ✅ **Pull-to-refresh** — свайп вниз обновляет страницу
- ✅ **Splash screen** при запуске («Calk.KG / Калькуляторы Кыргызстана»)
- ✅ **Share Sheet** — кнопка «Поделиться» в правом нижнем углу
- ✅ **Native жесты** — свайп от левого края = «Назад»
- ✅ **Внешние ссылки** (`mailto:`, `tel:`, другие домены) открываются в системе/Safari
- ✅ **Offline-fallback** — кастомный экран с кнопкой «Повторить»
- ✅ **Кастомный User-Agent** — `"CalkKG/1.0 (iOS App)"` для аналитики
- ✅ **Поддержка iPad** + Mac (Designed for iPad)

## Быстрый старт

### Требования

- **macOS** 13.0 или новее
- **Xcode** 15.0+ (бесплатно в Mac App Store)
- **Apple Developer Account** (у вас уже есть)

### Шаг 1: Открыть в Xcode

```bash
cd ios-app
open CalkKG.xcodeproj
```

### Шаг 2: Настроить подпись

1. В Xcode выберите проект **CalkKG** в левой панели
2. Target → **CalkKG** → вкладка **Signing & Capabilities**
3. ✅ Поставьте галочку **Automatically manage signing**
4. **Team:** выберите свой Apple Developer аккаунт (`Personal Team` для тестов)
5. **Bundle Identifier** уже установлен в `kg.calk.ios` — оставьте

### Шаг 3: Запустить в симуляторе

1. Сверху выберите устройство: **iPhone 15 Pro** (или любое другое)
2. Нажмите **▶ (Run)** или `Cmd+R`
3. Симулятор запустится, откроется calk.kg

### Шаг 4: Запустить на реальном iPhone

1. Подключите iPhone по USB
2. Сверху в списке устройств выберите свой iPhone
3. Нажмите **▶ (Run)**
4. На iPhone: **Настройки → Основные → VPN и управление устройством → Доверять разработчику**
5. Откройте Calk.KG на главном экране

---

## 📦 Сборка для App Store

### Шаг 1: Подготовить App Store Connect

1. Зайдите на [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. **My Apps → +  → New App**
3. Заполните:
   - **Platform:** iOS
   - **Name:** `Calk.KG`
   - **Primary Language:** Russian
   - **Bundle ID:** `kg.calk.ios` (выберите из списка после первой загрузки билда)
   - **SKU:** `calk-kg-ios-001` (уникальный, для вас)

### Шаг 2: Создать Archive в Xcode

1. Подключите реальный iPhone **или** выберите **Any iOS Device (arm64)** сверху
2. **Меню Product → Archive**
3. Подождите ~2 минуты, откроется **Organizer**
4. Выберите свой архив → **Distribute App**
5. Выберите **App Store Connect → Upload**
6. Следуйте мастеру (всё по умолчанию)

### Шаг 3: Заполнить листинг

В App Store Connect:

- **Screenshots** — нужны для:
  - 6.7" iPhone (1290×2796) — 3-10 шт
  - 6.5" iPhone (1242×2688) — 3-10 шт
  - 12.9" iPad Pro (2048×2732) — 3-10 шт (если поддерживаете iPad)
- **App Preview Video** (опционально)
- **Description** (рус/англ)
- **Keywords** — например: `калькулятор, кыргызстан, зарплата, налог, кредит`
- **Privacy Policy URL:** `https://calk.kg/privacy-policy/`
- **Support URL:** `https://calk.kg/contact/`
- **Category:** Finance / Utilities
- **Age Rating:** 4+
- **Privacy:** ответьте, что не собираете данные (всё локально)

### Шаг 4: Отправить на ревью

1. **App Store → 1.0 Prepare for Submission**
2. **Add for Review** → ждите 24-48 часов
3. После одобрения — релиз вручную или автоматически

---

## 🔍 Тонкости

### NSAppTransportSecurity

В `Info.plist` есть исключение для домена `calk.kg`, разрешающее HTTPS-соединение без forward secrecy (на всякий случай — большинство хостингов это поддерживают).

### Cookies / LocalStorage

WebView использует `WKWebsiteDataStore.default()` — все данные (cookies, IndexedDB, localStorage) **сохраняются между запусками**. Поэтому язык, выбранный пользователем, и cookie-консент запомнятся.

### Размер приложения

Поскольку весь UI хостится на сайте, размер бандла **~1 МБ** (только Swift код + иконка). Для App Store это идеально — минимальный download.

### Apple App Store Guidelines

✅ Это приложение **разрешено** Apple, потому что:
- Имеет нативные UI-элементы (pull-to-refresh, share button, error screen)
- Открывает только **calk.kg**, а не произвольные веб-страницы
- Имеет осмысленный функционал (35+ калькуляторов)
- Не дублирует Safari (нет адресной строки)

Если ревью отклонит (бывает редко) — можно сослаться на **Guidelines 4.2 (Minimum Functionality)** и добавить ещё native-фич.

### Когда понадобятся обновления

Бóльшая часть изменений в калькуляторах = просто пересборка веб-сайта, приложение их подхватит автоматически. Native-обновления нужны только если:
- Меняется домен (`calk.kg` → другой)
- Нужна новая native-функциональность (push, Apple Pay и т.д.)
- Apple требует пересборку (раз в год, минимальная iOS-версия)

---

## 🛠 Troubleshooting

**"Untrusted Developer" при запуске на iPhone**
→ Настройки → Основные → VPN и управление устройством → Доверять разработчику

**Xcode говорит "No Team Selected"**
→ Xcode → Settings → Accounts → Add Apple ID → выберите Team в Signing & Capabilities

**App Store отклонил билд с "Guideline 4.2 - Design - Minimum Functionality"**
→ Добавьте больше native-фич: Settings экран, About экран, Bookmarks (история калькуляторов)

**WebView показывает белый экран**
→ Откройте в Safari https://calk.kg — если работает, значит проблема в WebView. Проверьте `NSAppTransportSecurity` в Info.plist.

---

## 📞 Контакты

- Сайт: https://calk.kg
- Email: info@calk.kg
- Android-версия: см. `../android-app/`
