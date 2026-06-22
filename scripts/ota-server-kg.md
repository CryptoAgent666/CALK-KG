# Подключение Calk.KG к общему OTA-серверу (VPS AU)

OTA-сервер общий для сети (`176.97.68.234`, `https://ota.calk-au.com`). `updates.php` маршрутизирует
по `app_id` → префикс канала. Capgo шлёт `app_id` = нативный bundle id, поэтому у KG **две записи**
(Android и iOS используют разные id), обе → префикс `kg`. Канал = `{префикс}-{platform}` → `kg-ios` / `kg-android`.

## 1. Патч `updates.php` (на VPS: `/var/www/.../ota.calk-au.com/public/updates.php`)

```diff
 const APP_BY_ID = [
     'com.calkau.calculators' => 'au',
+    'kg.calk.app' => 'kg',   // Calk.KG Android (applicationId)
+    'kg.calk.ios' => 'kg',   // Calk.KG iOS (bundle id)
     // 'com.calkca.calculators' => 'ca',
     // 'com.calknz.calculators' => 'nz',
 ];
```

(`SUPPORTED_PLATFORMS` уже содержит `ios`/`android` — менять не нужно.)

## 2. Каталоги на VPS
```bash
cd /var/www/.../ota.calk-au.com
mkdir -p bundles/kg-ios bundles/kg-android manifest
```

## 3. Публикация OTA-обновления (с машины разработчика)
```bash
# боевая реклама (без VITE_ADMOB_TEST) собирается внутри скрипта
npm run ota:publish -- 1.0.1 ios
npm run ota:publish -- 1.0.1 android
```
Скрипт `scripts/ota-publish.sh`: собирает app-бандл (AdSense вырезан), проверяет отсутствие AdSense/Google Play,
zip → `bundles/kg-<platform>/<ver>.zip`, пишет `manifest/kg-<platform>.json` ({version, checksum}).
Настройки SSH — в `scripts/ota.env` (скопировать из `ota.env.example`): `OTA_SSH`, `OTA_REMOTE_DIR`, `OTA_SSH_PORT`.

## 4. Проверка
```bash
curl -s https://ota.calk-au.com/updates.php \
  -H 'Content-Type: application/json' \
  -d '{"app_id":"kg.calk.app","platform":"android","version_name":"builtin","version_build":"1.0.0"}'
# → {"version":"1.0.1","url":".../bundles/kg-android/1.0.1.zip","checksum":"..."} либо {} если апдейтов нет
```

## Важно
- Версия OTA всегда **строго больше** `versionName` бинаря в сторе — иначе не применится (без даунгрейда).
- Первый релиз идёт через App Store / Play; дальнейшие правки данных — через OTA, без ревью сторов.
