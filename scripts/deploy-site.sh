#!/usr/bin/env bash
# Deploy dist/ to calk.kg hosting via FTP/SFTP.
# Creds from scripts/deploy.env (gitignored). Build first: npm run build
# Usage: bash scripts/deploy-site.sh [--dry-run] [--delete]
#   --dry-run : показать, что зальётся, ничего не меняя
#   --delete  : удалять на сервере файлы, которых нет в dist/ (ОПАСНО — по умолчанию выкл)
set -euo pipefail
cd "$(dirname "$0")/.."

ENV_FILE="scripts/deploy.env"
[ -f "$ENV_FILE" ] || { echo "❌ Нет $ENV_FILE. Скопируй scripts/deploy.env.example → scripts/deploy.env и заполни."; exit 1; }
set -a; # shellcheck disable=SC1090
source "$ENV_FILE"; set +a

[ -f dist/index.html ] || { echo "❌ Нет dist/index.html — сначала: npm run build"; exit 1; }

: "${DEPLOY_PROTOCOL:?задай DEPLOY_PROTOCOL}"
: "${DEPLOY_HOST:?задай DEPLOY_HOST}"
: "${DEPLOY_USER:?задай DEPLOY_USER}"
: "${DEPLOY_PASS:?задай DEPLOY_PASS}"
: "${DEPLOY_REMOTE_DIR:?задай DEPLOY_REMOTE_DIR}"
DEPLOY_PORT="${DEPLOY_PORT:-$([ "$DEPLOY_PROTOCOL" = sftp ] && echo 22 || echo 21)}"

DELETE=""; DRY=""
for a in "$@"; do
  [ "$a" = "--delete" ]  && DELETE="--delete"
  [ "$a" = "--dry-run" ] && DRY="--dry-run"
done

echo "→ $DEPLOY_PROTOCOL://$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PORT  →  $DEPLOY_REMOTE_DIR"
echo "   delete=${DELETE:-no}  dry-run=${DRY:-no}  source=$(du -sh dist | cut -f1)"

# Двухфазная заливка: сначала ассеты (JS/CSS с хешами), затем HTML.
# Иначе есть окно, когда свежий HTML уже ссылается на бандл, которого на сервере
# ещё нет → страница отдаётся пустым пререндер-шеллом (404 на assets). Краулеры
# (Яндекс/Google), попавшие в это окно, видят «пустой» сайт.
lftp -c "
set ssl:verify-certificate no;
set ftp:ssl-allow yes;
set ftp:passive-mode on;
set net:max-retries 2; set net:timeout 20;
open -u '${DEPLOY_USER}','${DEPLOY_PASS}' -p ${DEPLOY_PORT} ${DEPLOY_PROTOCOL}://${DEPLOY_HOST};
echo '→ Фаза 1/2: ассеты и статика (без HTML)';
mirror -R --verbose --parallel=4 --exclude-glob .DS_Store --exclude-glob .htaccess --exclude-glob *.html --exclude-glob *.html.br --exclude-glob *.html.gz ${DELETE} ${DRY} dist/ '${DEPLOY_REMOTE_DIR}';
echo '→ Фаза 2/2: HTML';
mirror -R --verbose --parallel=4 --exclude-glob .DS_Store --exclude-glob .htaccess ${DELETE} ${DRY} dist/ '${DEPLOY_REMOTE_DIR}';
bye
"
echo "✓ Заливка завершена. CDN/Cloudflare не используется — изменения видны сразу (при необходимости очисти кэш браузера)."
