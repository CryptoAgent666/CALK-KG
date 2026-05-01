# Инцидент безопасности — утечка ключей подписи Android-приложения

## Что произошло

В публичном репозитории на GitHub (`CryptoAgent666/CALK-KG`) были обнаружены:

1. **Файл подписи Android-приложения** — `android-app/keystore/calk-kg-release.keystore copy`
   (gitignore не сработал, потому что `*.keystore` не покрывает `*.keystore copy`)

2. **Пароли подписи в открытом виде** — `***REMOVED***` в `android-app/app/build.gradle`
   (commit `7ef3143` "Added Currency Exchange Calculator with Netlify Functions")

## Почему это критично

Любой, у кого есть доступ к этим данным, может:
- Подписать вредоносный APK как «официальный Calk.KG»
- Распространять заражённое приложение через сторонние магазины
- Подменять обновления на устройствах пользователей

## Что уже исправлено в коде

- [x] `keystore copy` удалён из git (`git rm --cached`)
- [x] Пароли вынесены из `build.gradle` в `keystore.properties` (gitignored)
- [x] Создан шаблон `android-app/keystore.properties.example`
- [x] `.gitignore` усилен (теперь покрывает `*.keystore*`, `*.jks`, `*.pem`, `*.key`, `keystore.properties`)
- [x] README обновлён с правильной инструкцией

## Что НУЖНО сделать вручную

### 1. Зафиксировать изменения и запушить
```bash
git add -A
git commit -m "security: remove leaked keystore and harden gitignore"
git push
```

### 2. Удалить keystore из истории git (полная очистка)

Из git'а файл удалён только в текущем коммите. В **истории** он всё ещё доступен.
Чтобы стереть полностью, используйте `git filter-repo`:

```bash
# Установка
brew install git-filter-repo

# Удаление файла из всей истории
git filter-repo --path "android-app/keystore/calk-kg-release.keystore copy" --invert-paths

# Force-push (УНИЧТОЖИТ историю на GitHub)
git push origin --force --all
git push origin --force --tags
```

⚠️ После force-push все клоны репозитория станут несовместимы. Команде придётся переклонировать.

### 3. Сгенерировать НОВЫЙ keystore

Старый keystore **скомпрометирован навсегда**, даже после удаления из истории — его уже могли скачать.

```bash
cd android-app
keytool -genkey -v \
  -keystore keystore/calk-kg-release-NEW.keystore \
  -alias calk-kg \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**Используйте СИЛЬНЫЙ пароль** (минимум 16 символов, генератор паролей).

### 4. Если приложение УЖЕ опубликовано в Google Play

⚠️ **Это самая сложная часть.** Если вы публиковали APK со старым ключом:

**Вариант A: Google Play App Signing (рекомендуется)**
- Если включён Play App Signing, ваш upload key можно ротировать
- Зайдите в Play Console → Setup → App integrity → Upload key
- Запросите смену upload key через форму поддержки Google Play

**Вариант B: Если App Signing НЕ был включён**
- Старый ключ нельзя заменить на новый — пользователи не получат обновлений
- Нужно публиковать приложение под новым package name (`kg.calk.app2`)
- Старая версия останется без обновлений

### 5. Проверить, не появились ли поддельные APK

- Поиск: «Calk.KG APK download» в Google
- Проверка на VirusTotal по SHA-1 fingerprint вашего настоящего keystore
- Мониторинг отзывов в Google Play на жалобы о вредоносном поведении

### 6. Сменить ВСЕ пароли, использующие `***REMOVED***` или похожие шаблоны

Если вы где-то использовали этот пароль или паттерн `calkkg<год>`, смените:
- Хостинг
- GitHub
- Google Play Console
- Email
- Любые другие сервисы

## Файлы, которые нужно проверить локально

После git pull/clone убедитесь, что у вас локально есть:
- `android-app/keystore/calk-kg-release.keystore` (новый, сгенерированный заново)
- `android-app/keystore.properties` (с новыми паролями, не в git)

И НЕТ:
- `android-app/keystore/calk-kg-release.keystore copy` (удалён)
- Любых файлов с паролем `***REMOVED***`

## Дата инцидента

- Утечка попала в репозиторий: коммит `7ef3143` (Currency Exchange Calculator)
- Обнаружено: 21 апреля 2026
- Исправлено в коде: 21 апреля 2026
- Требуется ротация ключа: **не выполнено** (см. шаги выше)
