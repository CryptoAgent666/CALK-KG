# IAP «Убрать рекламу» — настройка консолей (calk.kg)

Код уже в репозитории (порт с calk.kz, где схема проверена end-to-end в июле 2026):
`src/lib/purchases.ts` (RevenueCat), гейт рекламы в `src/lib/admob.ts`, кнопка
`src/components/RemoveAdsButton.tsx` в мобильном меню.

**ID, зашитые в коде** (`src/lib/purchases.ts`) — в консолях создавать ровно их:

| Что | Значение |
|---|---|
| Entitlement (RevenueCat) | `ad_free` |
| Product ID — iOS | `removeads_KG` |
| Product ID — Android | `removeads_KG` (менять в `PRODUCT_IDS`, если завели иначе) |

⚠️ Почему не короткий `removeads`, как на KZ: в App Store Connect product ID
уникален **в пределах всего аккаунта разработчика**, а `removeads` уже занят
приложением calk.kz. В Google Play уникальность — в пределах приложения, там
короткий ID был бы возможен, но для единообразия заведён тот же `removeads_KG`.

Ничего из этого файла нельзя сделать из кода — только руками в консолях.
Порядок важен. Источник схемы: `~/.claude/projects/-Users-konstantin-Projects-KZ-CALK/memory/revenuecat-iap-wiring.md`.

---

## 1. App Store Connect (iOS)

1. **Монетизация → Покупки в приложении → создать**:
   - тип **Non-Consumable**, Product ID **`removeads_KG`**, Reference Name — любое (напр. `removeads`),
   - цена (на calk.kz — 999 ₸; для KG задать свою, напр. уровень ≈199 сом),
   - **Localizations**: добавить RU (и KY, если доступен) — Display Name
     «Без рекламы» / «Жарнамасыз», Description «Отключает рекламу в приложении
     навсегда. Разовая покупка, действует на всех ваших устройствах».
   - **Review Information → Screenshot**: обязателен. Снять экран приложения с
     кнопкой «Убрать рекламу навсегда» (мобильное меню) — симулятор подойдёт.
     Скрин без кнопки = отклонение «не смогли найти покупку».
   - **Review Notes**: указать путь к кнопке, например:
     «Открыть приложение → значок меню в правом верхнем углу → блок
      "Убрать рекламу навсегда". Кнопка "Восстановить покупку" — там же.
      Покупка отключает рекламный баннер AdMob навсегда, разовая, non-consumable.»
2. **Integrations → In-App Purchase → сгенерировать ключ** → скачается
   `SubscriptionKey_XXXXXXXXXX.p8`.
   ⚠️ Это НЕ тот же ключ, что «App Store Connect API» (`AuthKey_*.p8`) — со
   StoreKit 2 без In-App Purchase Key транзакции **не записываются вовсе**
   (кнопка есть, тап пустой). Нужны ОБА, но критичен именно IAP-ключ.
3. `.p8`-файлы хранить вне git (на KZ они лежали в корне репо untracked — не повторять).

## 2. Google Play Console (Android)

### 2.0. СНАЧАЛА залить сборку с BILLING (иначе продукт не создать)

Play показывает «To add one-time products, you need to add the BILLING permission
to your APK» и блокирует раздел, пока среди загруженных сборок нет ни одной с
разрешением `com.android.vending.BILLING`. Прописывать его вручную не нужно:
плагин RevenueCat тянет Play Billing Library, и разрешение приходит при слиянии
манифестов.

- Готовый файл: `android-app/CalkKG-release-v1.1.1-billing.aab`
  (versionCode 11; наличие BILLING проверено распаковкой манифеста).
- Залить в **Test and release → Internal testing** (продакшн не нужен) → раздел
  One-time products разблокируется.

⚠️ **Сборка приложения — только `npm run sync:android`** (внутри `build:app`),
НЕ `npm run build`. Веб-сборка кладёт рядом с HTML предсжатые `.gz`/`.br`, и
`mergeReleaseAssets` падает с `Duplicate resources` (278 таких пар). Плюс
`build:app` выставляет `VITE_CALK_PLATFORM=app` — это вырезает из приложения
AdSense и cookie-баннер.

⚠️ **Java**: в PATH её может не быть. Собирать с JDK от Android Studio:
`export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"`.

### 2.1. Создать продукт

1. **Продукты → Контент для продажи → создать**: ID **`removeads_KG`**,
   одноразовый (one-time), цена.
2. У purchase option поставить галку **«Backwards compatible»** — без неё
   биллинг по базовому product ID покупку не видит.
3. **Google Cloud** (любой проект) → создать **service account** → JSON-ключ.
4. **Play Console → Users and permissions** → пригласить e-mail сервис-аккаунта
   с правами: View app info, View financial data, **Manage orders**.
   ⚠️ Права применяются до **24–36 часов** — закладывать в срок.

## 3. RevenueCat (dashboard.revenuecat.com)

1. Создать проект **calk-kg**, в нём два приложения:
   - **App Store**: bundle ID из iOS-проекта; загрузить `SubscriptionKey_*.p8`,
     **Key ID = ровно 10 символов из имени файла** (`SubscriptionKey_7FM864FBHQ.p8`
     → `7FM864FBHQ`; на KZ вписали 8 символов и получили «Credentials need attention»);
     Issuer ID — из ASC → Integrations.
   - **Play Store**: package name = **applicationId из `android/app/build.gradle`**
     (⚠️ НЕ appId капаситора, если они различаются — на KZ это была грабля:
     `calk.kz` vs `kz.calk.app`); загрузить JSON сервис-аккаунта.
2. **Product catalog** → создать **ДВЕ записи продукта** `removeads_KG`
   (одна для App Store, одна для Play) — по записи на платформу.
3. **Entitlements** → создать **`ad_free`** → привязать **ОБА** продукта.
   ⚠️ Симптом забытой привязки: стор покупку проводит, деньги списываются,
   а `entitlements.active` пуст → UI не реагирует.
4. **Project Settings → API keys** → скопировать публичные ключи платформ:
   - `appl_…` → в `.env` как `VITE_RC_IOS_KEY`
   - `goog_…` → в `.env` как `VITE_RC_ANDROID_KEY`
   (это НЕ секретные `sk_`-ключи, в клиенте им можно жить; но `.env` в gitignore).

## 4. Пересборка и релиз

RevenueCat — **нативный** плагин: доезжает до пользователей ТОЛЬКО новой
сборкой в сторы (НЕ через Capgo OTA). `npx cap sync` уже выполнен, плагин
в обеих платформах зарегистрирован.

- Поднять версии (Android versionCode, iOS build), собрать `.aab` + архив iOS,
  залить в Play Console (internal testing) и TestFlight.
- В старых бинарях (1.0.8 и ниже) OTA-бандл кнопку НЕ покажет —
  `purchasesAvailable()` проверяет наличие нативного модуля. Это ожидаемо.

## 5. Тестирование

- **iOS**: TestFlight + sandbox Apple ID. Цена показывается в валюте страны
  sandbox-аккаунта — это нормально.
- **Android**: Internal testing; Play Console → Settings → Licence testing →
  добавить свой gmail → метод «Test card, always approves».
- Купить → баннер исчезает сразу; переустановить → «Восстановить покупку» →
  статус возвращается. Восстановление также лечит рассинхрон после починки
  конфига без переустановки.

## Известные грабли (уже учтены в коде, не сломать при правках)

- `getProducts` вызывается с `type: 'NON_SUBSCRIPTION'` — обязательный параметр:
  Android-плагин иначе спрашивает у Play несуществующую ПОДПИСКУ `removeads` →
  пустой список → цена null → тап в тупик. На iOS параметр игнорируется, поэтому
  баг выглядит как «на айфоне работает, на андроиде нет».
- `initPurchases()` в `main.tsx` вызывается ДО `initNativeAds()` — у купивших
  баннер не мелькает (isAdFree читает localStorage синхронно).
- Кнопка «Восстановить покупку» обязательна для Apple (Guideline 3.1.1) — не удалять.
- Fallback-цена в `purchases.ts` (`REMOVE_ADS_FALLBACK_PRICE`) — держать в
  синхроне с ценой в сторах; живая цена всегда приходит из стора.
