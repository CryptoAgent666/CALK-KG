# Privacy Disclosure для App Store Connect

При заполнении секции **App Privacy** в App Store Connect используйте эти ответы:

## Data Collection

**Q: Do you or your third-party partners collect data from this app?**
**A:** No, we do not collect data from this app.

Объяснение для ревью (если попросят):
- Все калькуляторы выполняются локально на устройстве
- Никакие данные пользователя не отправляются на наши серверы
- Сайт calk.kg использует Google AdSense для показа рекламы — это раскрывается в политике конфиденциальности на сайте
- Никаких аналитических сервисов в native-приложении нет
- Никаких аккаунтов / регистрации не требуется

## App Tracking Transparency

Не используется. ATT prompt не показывается.

## Privacy Policy URL

`https://calk.kg/privacy-policy/`

## Если ревью спросит про Google AdSense

Реклама показывается на сайте calk.kg (внутри WebView), но это часть веб-сайта, а не нативный SDK в приложении. Это указано в политике конфиденциальности на сайте.

При желании можно добавить в **App Privacy** Connect:

- **Data Linked to You:** None
- **Data Not Linked to You:**
  - Browsing History (only within calk.kg domain, used for analytics on the website)
  - Identifiers: device ID (used by Google AdSense on the website)
  - Diagnostics (crashes via standard iOS reporting)

Но если приложение **просто открывает сайт** через WKWebView без native SDK — Apple обычно принимает декларацию "No Data Collected" для самого приложения, потому что веб-сайт — это отдельная сущность.

## Age Rating

**4+** — никакого нежелательного контента, рекламы азартных игр и т.п. в приложении нет.

## Export Compliance

`ITSAppUsesNonExemptEncryption = false` уже выставлен в Info.plist.
Приложение использует только стандартный HTTPS, никакой проприетарной криптографии.

При первой заливке Apple спросит:
- **Does your app use encryption?** → No (HTTPS only, exempt under year 2)
