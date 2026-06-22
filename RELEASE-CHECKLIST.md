# Релиз Capacitor-приложений calk.kg — чеклист

Предполагается, что код миграции уже в `main` (PR #1 + PR #2). Все команды — из корня репозитория.

## 0. Перед сборкой
- [ ] Применить OTA-патч на VPS (см. `scripts/ota-server-kg.md`) — добавить `kg` в `updates.php`, создать каталоги.
- [ ] **Вернуть боевую рекламу** (сейчас в синхронизированном вебе — тестовая):
  ```bash
  npm run sync:ios && npm run sync:android   # без VITE_ADMOB_TEST → боевые ad unit
  ```

## 1. iOS (App Store)
- [ ] `npm run cap:open:ios` → Xcode.
- [ ] Target App → Signing & Capabilities: выбрать Team, проверить bundle id **`kg.calk.ios`**, сертификат/provisioning.
- [ ] Поднять версии: `MARKETING_VERSION` ≥ текущей в App Store, `CURRENT_PROJECT_VERSION` (build) **строго больше** опубликованного (старый ios-app был build 5 → ставить ≥ 6).
- [ ] Product → Archive → Distribute App → App Store Connect → Upload.
- [ ] В App Store Connect: заполнить «App Privacy» (сбор данных для рекламы — AdMob/ATT), отправить на ревью.
- [ ] ⚠️ Guideline 4.2: bundled-Capacitor проходит (как AU/KZ). При вопросах — в Review Notes указать офлайн-функциональность + плагины.

## 2. Android (Google Play)
- [ ] `cp android/keystore.properties.example android/keystore.properties` и заполнить (тот же keystore, что у текущего приложения!).
- [ ] Проверить `versionCode` в `android/app/build.gradle` (сейчас **10**) — должен быть **строго больше** текущего в Play (старый был 8; уточнить в Play Console).
- [ ] Сборка подписанного AAB:
  ```bash
  export JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home
  export ANDROID_HOME=$HOME/Library/Android/sdk
  npm run sync:android
  ./android/gradlew -p android bundleRelease
  # → android/app/build/outputs/bundle/release/app-release.aab
  ```
- [ ] Загрузить AAB в существующий листинг Play → выпустить.

## 3. После публикации — OTA для правок данных (без сторов)
```bash
npm run ota:publish -- <версия> ios       # версия СТРОГО > MARKETING_VERSION бинаря
npm run ota:publish -- <версия> android
```

## 4. Очистка (после того как Capacitor-версии вышли и стабильны)
- [ ] Удалить старые `android-app/` (Java/WebView) и `ios-app/` (UIKit) — они больше не нужны.

## Контрольные точки качества
- AdMob: на устройстве при тесте — **тестовые** объявления (`VITE_ADMOB_TEST=1`), боевые — только в релизе.
- Проверить, что в app-бандле нет AdSense: `grep -rl adsbygoogle dist --include='*.html' --include='*.js'` → пусто.
- Статус-бар, баннер, отсутствие cookie-баннера — проверены на iOS/Android (скриншоты в истории миграции).
