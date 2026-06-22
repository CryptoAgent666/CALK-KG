# План миграции приложений calk.kg на Capacitor + Capgo OTA

**Цель.** Заменить две самописные нативные обёртки KG (Android — Java/WebView, iOS — UIKit
с 6 нативными калькуляторами) на **один Capacitor-проект**, оборачивающий существующую Vite-сборку
веба, с **самохостинговым Capgo OTA**. Тогда веб — единственный источник истины, правки данных
доходят до приложений «по воздуху» без релиза в сторы, и исчезает расхождение нативного iOS-кода.

Эталон в сети: **CALK-AU** (и KZ/NZ/UK устроены так же). Этот план копирует их подход.

---

## Что мы получаем
- Правки констант (как сегодняшние НМД/больничный/штрафы) → у пользователей **через OTA за минуты**, без App Store / Play review.
- **Конец дублирования**: больше нет нативных Swift-калькуляторов, которые отстают от сайта.
- Единый стек со всей сетью (KZ/NZ/AU/UK).
- Нативный AdMob (опционально, через плагин) или AdSense-в-вебе как сейчас.

## Что ОБЯЗАТЕЛЬНО сохранить (иначе теряем существующие листинги)
| Актив | Значение | Почему критично |
|---|---|---|
| Android `applicationId` | `kg.calk.app` | иначе это «новое приложение», а не обновление в Play |
| Android keystore | `android-app/keystore/calk-kg-release.keystore` (в `.gitignore`) | **потеря = невозможно обновить приложение в Play.** Забэкапить отдельно! |
| iOS bundle id | `kg.calk.ios` | обновление существующего листинга App Store |
| iOS signing | дистрибутивный сертификат + provisioning | подпись релиза |
| `app-ads.txt` | на `calk.kg` (уже залит) | верификация AdMob — миграции не касается |
| ASO-ассеты, og-images, скриншоты | `android-app/`, `ios-app/AppStore/` | переиспользовать в новых сборках |

---

## Ключевые решения (с рекомендациями)

**1. Bundled web + Capgo OTA (НЕ `server.url`).** Рекомендую как у AU/KZ.
   - Capacitor вшивает веб-сборку в бинарь (офлайн-приложение) + нативные плагины → Apple
     трактует как полноценное приложение, **проходит Guideline 4.2** (тонкая URL-обёртка — нет;
     именно из-за неё KG когда-то ушёл в нативные калькуляторы).
   - OTA (Capgo) тихо обновляет веб-бандл без релиза.
   - `server.url` (как у calk.uz) — тонкая удалённая обёртка: риск 4.2 + нет офлайна. **Не брать.**

**2. Веб-фреймворк — оставить Vite** (`webDir: 'dist'`). Next.js не нужен; Vite-SPA работает в Capacitor.

**3. Реклама — только нативный AdMob в обоих приложениях; AdSense — лишь на сайте.** (Решение владельца.)
   - В **обоих** Capacitor-бандлах (iOS и Android) **вырезать AdSense** + cookie-баннер AdSense.
     AdSense остаётся только в вебе (браузеры). GA можно оставить (на iOS — с учётом ATT).
   - Внутри приложений — **нативный AdMob** через плагин `@capacitor-community/admob` (баннер;
     интерстишелы опционально позже). App ID + Ad Unit ID — те, что уже заведены ранее.
   - Реализация: build-флаг `VITE_CALK_PLATFORM=app` убирает загрузчик AdSense из `index.html`/кода
     для любой Capacitor-сборки. На iOS дополнительно убрать ссылки Google Play (App Review 2.3.10/5.1.2).
   - Отличие от AU: AU держит AdSense на Android и без рекламы на iOS; **у KG — нативный AdMob на обеих
     платформах, AdSense в апках нет вообще.**

**4. Нативные iOS-калькуляторы (6) — удалить** (в этом и смысл). Веб уже содержит все калькуляторы,
   курсы валют, историю. Нативные History/Bookmarks/Currency → отказаться (есть веб-аналоги) или
   позже вынести в Capacitor-плагины. ⚠️ Проверить, что веб-версии этих фич устраивают.

**5. OTA-сервер — общий с AU.** (Решение владельца.) Подключаемся к существующему серверу AU
   (`176.97.68.234`, `ota.calk-au.com`). `updates.php` роутит по `app_id`, поэтому добавляем
   `kg → kg` в `APP_BY_ID` + каналы `kg-ios` / `kg-android`. Своя инфраструктура не нужна.
   `updateUrl` в Capacitor → `https://ota.calk-au.com/updates.php`.

---

## Пошаговый план

### Фаза 0. Подготовка
- [ ] Забэкапить `calk-kg-release.keystore` + iOS signing в надёжное место (вне git).
- [ ] Решить: ads-стратегию (AdSense-Android/нет-iOS как AU, либо нативный AdMob), OTA-хост (свой/общий).
- [ ] Тег текущего состояния: `git tag pre-capacitor-2026-06` (старые `android-app/`, `ios-app/` остаются в истории).

### Фаза 1. Скаффолд Capacitor
- [ ] Установить: `@capacitor/{core,cli,android,ios,app,splash-screen,status-bar,preferences,share}`,
      `@capgo/capacitor-updater`, `@capacitor/assets`, **`@capacitor-community/admob`**.
- [ ] `capacitor.config.ts`: `webDir: 'dist'`, плагины SplashScreen/StatusBar, `CapacitorUpdater`
      (`autoUpdate: true`, `updateUrl: 'https://ota.calk-au.com/updates.php'` — общий сервер AU).
- [ ] `npx cap add android && npx cap add ios` — генерируют нативные проекты.
- [ ] ⚠️ **Разные appId по платформам**: Capacitor берёт один `appId`. После генерации вручную выставить
      Android `applicationId = kg.calk.app` (в `android/app/build.gradle`) и iOS bundle `kg.calk.ios` (в Xcode),
      чтобы обновлять существующие листинги.
- [ ] Иконки/сплэш: `npx capacitor-assets generate` из существующих ассетов.
- [ ] Подпись: перенести keystore + `signingConfigs` в новый `android/`; настроить iOS signing в Xcode.

### Фаза 2. Адаптация веб-сборки
- [ ] Проверить, что Vite-`dist/` работает в Capacitor (SPA-роутинг → `index.html`; пути `/assets/` ок).
- [ ] App-build флаг `VITE_CALK_PLATFORM=app` вырезает **AdSense + cookie-баннер AdSense из обоих
      бандлов** (AdSense — только сайт). На iOS дополнительно убрать ссылки Google Play (2.3.10/5.1.2).
- [ ] **Нативный AdMob** (`@capacitor-community/admob`): App ID в `AndroidManifest.xml` и `Info.plist`
      (+ `SKAdNetworkItems` и `NSUserTrackingUsageDescription` на iOS); показывать баннер из JS по готовым Ad Unit ID.
- [ ] Разрешить внешние ресурсы (`nbkr.kg` и т.п.) — `server.allowNavigation` / CSP.
- [ ] Скрипты: `build:android` (`VITE_CALK_PLATFORM=app vite build && cap sync android`),
      `build:ios` (`VITE_CALK_PLATFORM=app vite build && cap sync ios`).

### Фаза 3. OTA-бэкенд
- [ ] Общий сервер AU (`176.97.68.234`): добавить `kg → kg` в `APP_BY_ID` в `updates.php`;
      завести `bundles/kg-ios/`, `bundles/kg-android/`, `manifest/kg-*.json`.
- [ ] Адаптировать `scripts/ota-publish.sh`: `APP_KEY="kg"`, SSH на VPS AU, + предохранитель,
      блокирующий попадание **AdSense** в любой app-бандл (и `Google Play` — в iOS).

### Фаза 4. Сборка, тест, подпись
- [ ] Android: `npm run build:android`, прогон на устройстве (калькуляторы, OTA-проверка бьёт в сервер).
- [ ] iOS: `npm run build:ios`, прогон, убедиться что AdSense вырезан.
- [ ] Подписать **существующим** keystore (Android) и дистрибутив-сертификатом (iOS).

### Фаза 5. Релиз в сторы (первый — обычный, дальше OTA)
- [ ] Android: ↑`versionCode`, подписанный AAB (`kg.calk.app`) → обновление в существующем листинге Play.
- [ ] iOS: ↑build, архив (`kg.calk.ios`) → App Store. ⚠️ **Риск 4.2** — митигировать: bundled-Capacitor
      + плагины (офлайн-приложение), подчеркнуть в ревью-нотах; сослаться на прохождение AU/KZ.
- [ ] После публикации: правки данных катятся `scripts/ota-publish.sh <ver> ios|android` — **без сторов**.

### Фаза 6. Вывод старого кода
- [ ] После выхода Capacitor-версий удалить `android-app/` (Java) и `ios-app/` (UIKit) или оставить в архиве.

---

## Риски и подводные камни
- **App Store 4.2** — главный. Митигация: bundled-Capacitor + плагины (как AU/KZ, которые прошли).
- **Keystore** — потеря = смерть Play-листинга. Забэкапить до начала.
- **Разные appId** Android/iOS — выставить вручную после `cap add`.
- **Реклама** — AdSense вырезается из **обоих** app-бандлов (политика); внутри только нативный AdMob
  (App ID/Ad Unit в нативных проектах + ATT/SKAdNetwork на iOS). AdSense остаётся только на сайте.
- **OTA-дисциплина версий** — OTA-версия всегда > build бинаря, без даунгрейда.
- **Потеря нативных фич** (History/Bookmarks/Currency на iOS) — убедиться, что веб-аналоги ок.
- **Первый релиз** всё равно через оба стора; OTA — только для последующих правок данных.

## Оценка усилий
Скаффолд + адаптация веба ~1–2 дня · OTA-бэкенд ~0.5 дня (или 0 при общем сервере) ·
сборка/подпись/тест обеих платформ ~1–2 дня · ревью (Android ~1 день, iOS ~1–3 дня).
**Итого ~1 неделя + ревью сторов.**

## AdMob ID (боевые; публичные — встраиваются в приложение)
Publisher: `pub-4859241862365215`.

| Платформа | App ID | Banner | Interstitial |
|---|---|---|---|
| **iOS** (`kg.calk.ios`) | `ca-app-pub-4859241862365215~2728637081` | `ca-app-pub-4859241862365215/5907853241` | `ca-app-pub-4859241862365215/9899903297` |
| **Android** (`kg.calk.app`) | `ca-app-pub-4859241862365215~7373228174` | `ca-app-pub-4859241862365215/2108777250` | `ca-app-pub-4859241862365215/9795695589` |

- App ID → `Info.plist` (`GADApplicationIdentifier`) и `AndroidManifest.xml` (`com.google.android.gms.ads.APPLICATION_ID`).
- Banner — основной формат (по решению ранее); Interstitial — опционально (между переходами, с лимитом частоты).
- Для отладки использовать **тестовые** ID Google, боевые — только в релизе (не кликать свои объявления).

## Тулчейн (проверено 2026-06, обе платформы запущены на симуляторе/эмуляторе)
- **iOS**: Xcode 26.5 ✅ (Capacitor 8 использует SPM — CocoaPods не нужен).
- **Android**: нужен **JDK 21** (`brew install openjdk@21`) — Capacitor 8 требует source release 21, JDK 17 даёт
  `invalid source release: 21`. + `ANDROID_HOME=~/Library/Android/sdk`.
- **`build:app` вырезает `.gz/.br`** (vite-compression) — иначе Android asset-merger падает на дублях ресурсов.
- **Эмулятор по CLI**: `sdkmanager --install emulator` + system-образ
  `system-images;android-34;google_apis_playstore;arm64-v8a` (~1.5 ГБ); затем
  `emulator -avd <name>` → `adb install -r app-debug.apk`.
- **Тест-реклама**: собирать с `VITE_ADMOB_TEST=1` (тестовые объявления Google) — не кликать боевые на своих устройствах.

## Эталоны в кодовой базе (смотреть при реализации)
- `CALK-AU/capacitor.config.ts` — конфиг + Capgo.
- `CALK-AU/scripts/ota-publish.sh` — публикация OTA + платформенный strip + предохранитель.
- `CALK-AU/ota-backend-vps/public/updates.php` + `README.md` — серверная часть OTA.
- `CALK-AU/package.json` — набор зависимостей и скриптов.
