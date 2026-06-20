# 🚀 Загрузка Calk.KG iOS в App Store — пошагово

Используем тот же workflow что для `kz.calk.app` — manual signing с named App Store profile.
**Без физического iPhone, без device registration.**

---

## Шаг 1 — Создать App ID (2 минуты)

1. Откройте https://developer.apple.com/account/resources/identifiers/list
2. Нажмите **+ Identifiers** → **App IDs** → **Continue**
3. Выберите тип: **App** → **Continue**
4. Заполните:
   - **Description:** `Calk KG`
   - **Bundle ID:** ☑ **Explicit** = `kg.calk.ios`
   - **Capabilities:** ничего не отмечать
5. **Continue** → **Register**

## Шаг 2 — Создать App Store provisioning profile (2 минуты)

1. Откройте https://developer.apple.com/account/resources/profiles/list
2. Нажмите **+ Profile**
3. **Distribution → App Store Connect** → **Continue**
4. **App ID:** выберите `kg.calk.ios` (только что созданный) → **Continue**
5. **Certificate:** выберите ваш **Apple Distribution** (`Konstantin Iakovlev SRKYS78RMQ`) → **Continue**
6. **Provisioning Profile Name:** введите **строго** `Calk KG App Store`
   (точное имя важно — оно прописано в `scripts/ExportOptions.plist`)
7. **Generate** → **Download**
8. Двойной клик по скачанному `.mobileprovision` — Xcode автоматически установит профиль

## Шаг 3 — Создать App в App Store Connect (3 минуты)

1. Откройте https://appstoreconnect.apple.com/apps
2. Нажмите **+ → New App**
3. Заполните:
   - **Platform:** iOS
   - **Name:** `Calk.KG`
   - **Primary Language:** Russian
   - **Bundle ID:** выберите `kg.calk.ios` из списка
   - **SKU:** `calk-kg-ios-001`
   - **User Access:** Full Access
4. **Create**

## Шаг 4 — Архивировать и загрузить (5 минут)

В терминале:

```bash
cd /Users/konstantin/project/rfemb/CALK-KG/ios-app
./scripts/archive.sh 1.0.0 1
```

Скрипт сам:
- Соберёт Release archive (использует Manual signing + ваш профиль)
- Экспортирует .ipa
- **Загрузит в App Store Connect** (благодаря `destination = upload` в ExportOptions.plist)

Ожидайте сообщение `✅ Готово! Build загружен в App Store Connect.`

## Шаг 5 — Заполнить листинг (15 минут)

В App Store Connect → ваше приложение → **1.0 Prepare for Submission**:

- **Description (RU):** скопировать из `AppStore/metadata/ru/description.txt`
- **Keywords (RU):** из `AppStore/metadata/ru/keywords.txt`
- **Subtitle:** из `AppStore/metadata/ru/subtitle.txt`
- **Promotional Text:** из `AppStore/metadata/ru/promotional_text.txt`
- **Privacy Policy URL:** `https://calk.kg/privacy-policy/`
- **Support URL:** `https://calk.kg/contact/`
- **Marketing URL:** `https://calk.kg`
- **Category:** Finance (primary) / Utilities (secondary)
- **Age Rating:** 4+

**Локализации:** добавьте English (US) и Kyrgyz из соответствующих папок.

**Screenshots:**
- iPhone 6.9": возьмите `AppStore/screenshots/iPhone-17-Pro-Max/01-home.png`
- Сделайте ещё 2-3 экрана: откройте симулятор iPhone 17 Pro Max, переходите на разные калькуляторы и нажимайте `Cmd+S`

**App Privacy:**
- **Data Collection:** None
- См. подробности в `AppStore/Privacy.md`

**App Review Information:**
- Текст готов в `AppStore/COMPLIANCE_AUDIT.md` (раздел про Guideline 4.2)

## Шаг 6 — Submit for Review

1. **Save** → **Add for Review** → **Submit**
2. Ждать ~24-48 часов
3. Apple одобрит → можно нажать **Release this version**

---

## ⚠️ Если archive скрипт упадёт

| Ошибка | Решение |
|--------|---------|
| `Provisioning profile не найден` | Не выполнен шаг 2 — создайте профиль и сделайте двойной клик |
| `No matching certificate` | Apple Distribution cert не установлен — проверьте `security find-identity -v -p codesigning` |
| `Bundle ID mismatch` | App ID не совпадает с `kg.calk.ios` — пересоздайте на шаге 1 |
| `Upload failed: authentication` | Войдите в Xcode → Settings → Accounts → ваш Apple ID |

## 📞 Что у вас уже есть

✅ **Apple Distribution Certificate:** `Konstantin Iakovlev (SRKYS78RMQ)` — установлен
✅ **Apple Development Certificate:** `Konstantin Iakovlev (RA458FHNQY)` — установлен
✅ **Xcode 26.5** — установлен
✅ **2 рабочих провижн-профиля** для других ваших приложений
✅ **iOS-приложение Calk.KG** — собирается без ошибок

**Чего не хватает:** только профиля для `kg.calk.ios` (шаги 1-2 выше).
