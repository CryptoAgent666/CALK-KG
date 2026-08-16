# IAP «Убрать рекламу» — настройка консолей (calk.kg)

Код уже в репозитории (порт с calk.kz, где схема проверена end-to-end в июле 2026):
`src/lib/purchases.ts` (RevenueCat), гейт рекламы в `src/lib/admob.ts`, кнопка
`src/components/RemoveAdsButton.tsx` в мобильном меню.

**ID, зашитые в коде** (`src/lib/purchases.ts`) — в консолях создавать ровно их:

| Что | Значение |
|---|---|
| Entitlement (RevenueCat) | `ad_free` |
| Product ID — iOS | `removeads_KG` (с заглавными) |
| Product ID — Android | `removeads_kg` (**строчными**) |

⚠️ **Регистр на платформах разный, это не опечатка.**
- iOS: короткий `removeads` занят приложением calk.kz — в App Store Connect ID
  уникален в пределах всего аккаунта разработчика, отсюда суффикс `_KG`.
- Android: Google Play **не принимает заглавные буквы** — «Must start with a
  number or lowercase letter. Can contain numbers, lowercase letters,
  underscores and full stops», поэтому `removeads_kg`.
- Play не даёт изменить или переиспользовать ID после создания продукта.

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

1. **Продукты → Контент для продажи → создать**: ID **`removeads_kg`** (строчными!),
   одноразовый (one-time), цена.
   - **Name** (виден в корзине, до 55 симв.): «Убрать рекламу навсегда»
   - **Description** (обязательное, до 200 симв.): «Отключает рекламу в
     приложении навсегда. Разовая покупка — работает на всех устройствах с
     вашим аккаунтом Google.»
   - **Icon** — необязателен. Если добавлять: PNG 32-бит, 1:1, сторона
     512–1080 px, без текста и брендинга.
2. У purchase option поставить галку **«Backwards compatible»** — без неё
   биллинг по базовому product ID покупку не видит.
3. **Google Cloud** (любой проект) → создать **service account** → JSON-ключ.
4. **Play Console → Users and permissions** → пригласить e-mail сервис-аккаунта
   с правами: View app info, View financial data, **Manage orders**.
   ⚠️ Права применяются до **24–36 часов** — закладывать в срок.

## 3. RevenueCat (dashboard.revenuecat.com)

**Данные проекта calk.kg** (проверены в репозитории, копировать как есть):

| Что | Значение |
|---|---|
| iOS bundle ID | `kg.calk.ios` |
| Android package name | `kg.calk.app` (= applicationId из `android/app/build.gradle`) |
| Product ID iOS | `removeads_KG` |
| Product ID Android | `removeads_kg` |
| Entitlement | `ad_free` |

Здесь appId Capacitor и applicationId совпадают (`kg.calk.app`), так что грабли
calk.kz (там были разные — `calk.kz` vs `kz.calk.app`) в этом проекте нет.

**Ключи и сервис-аккаунт — переиспользуются с calk.kz**, если приложения в том же
аккаунте разработчика (Apple Developer / Google Play):
- **Android:** JSON сервис-аккаунта `revenuecat-play@…` (тот же, что для calk.kz).
  Права на приложение Calk.kg выданы 16.08.2026.
- **iOS:** In-App Purchase Key (`SubscriptionKey_*.p8`) выдаётся на уровне
  АККАУНТА разработчика, а не приложения, поэтому файл от calk.kz подходит и для KG.
  Key ID — 10 символов из имени файла; Issuer ID — в ASC → Integrations.

⚠️ Сами файлы ключей в репозитории НЕ хранить (в `.gitignore` закрыты шаблоны
`gen-lang-client-*.json`, `*service-account*.json`, `*.p8`). GitHub push protection
блокирует пуш при попытке закоммитить такой ключ — проверено 16.08.2026.

### Шаги

1. **New project** → назвать `calk-kg` (проекты в RC не связаны между собой,
   отдельный проект на приложение — норма).
2. **Apps → App Store**: bundle ID `kg.calk.ios`; загрузить `SubscriptionKey_*.p8`,
   Key ID `7FM864FBHQ` (ровно 10 символов — на KZ вписали 8 и получили
   «Credentials need attention»), Issuer ID из ASC → Integrations.
3. **Apps → Play Store**: package name `kg.calk.app`; загрузить JSON сервис-аккаунта.
   ⚠️ Если права выданы меньше суток назад, RC может ругаться на доступ — это
   нормально, повторить позже (применяются до 24–36 ч).
4. **Product catalog → + New**: создать ДВЕ записи:
   - App Store → `removeads_KG`
   - Play Store → `removeads_kg`
   (регистр разный — так заведено в консолях, см. раздел выше).
5. **Entitlements → + New** → идентификатор **`ad_free`** → **Attach products** →
   привязать ОБА продукта.
   ⚠️ Симптом забытой привязки: стор проводит покупку и списывает деньги, а
   `entitlements.active` пуст → UI не реагирует, «купил и ничего не изменилось».
6. **Project Settings → API keys** → скопировать публичные ключи платформ в `.env`:
   - `appl_…` → `VITE_RC_IOS_KEY`
   - `goog_…` → `VITE_RC_ANDROID_KEY`
   Это НЕ секретные `sk_`-ключи, в клиенте им можно жить; `.env` в gitignore.

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
