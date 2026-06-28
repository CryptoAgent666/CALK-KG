#!/bin/bash
set -euo pipefail

# Calk.KG OTA publisher — builds the app web bundle and ships it to the shared
# OTA server (AU VPS), where updates.php routes by app_id (kg) + platform.
#
# Usage:
#   scripts/ota-publish.sh <version> <ios|android> [--local]
# Examples:
#   scripts/ota-publish.sh 1.0.1 ios          # → bundles/kg-ios/1.0.1.zip
#   scripts/ota-publish.sh 1.0.1 android      # → bundles/kg-android/1.0.1.zip
#
# <version> MUST be greater than the binary's MARKETING_VERSION so each OTA
# version is offered to devices exactly once and never downgrades.

APP_KEY="kg"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

VERSION="${1:?usage: ota-publish.sh <version> <ios|android> [--local]}"
PLATFORM="${2:?usage: ota-publish.sh <version> <ios|android>   (platform required)}"
MODE="${3:-}"

case "$PLATFORM" in
  ios|android) ;;
  *) echo "ERROR: platform must be 'ios' or 'android', got '$PLATFORM'"; exit 1 ;;
esac

CHANNEL="${APP_KEY}-${PLATFORM}"   # kg-ios | kg-android

# OTA server — shared datahub box (Singapore), fronted by Cloudflare as https://ota.calk-au.com.
# Non-root: the docroot is owned by the deploy user (konstantin), push uses the normal SSH key.
# Override in scripts/ota.env if needed.
[ -f "$ROOT/scripts/ota.env" ] && . "$ROOT/scripts/ota.env"
OTA_SSH="${OTA_SSH:-konstantin@mydatahub.duckdns.org}"
OTA_REMOTE_DIR="${OTA_REMOTE_DIR:-/opt/data_hub/ota-au/html}"
OTA_SSH_PORT="${OTA_SSH_PORT:-22}"

echo "==> [1/4] Building app web bundle (VITE_CALK_PLATFORM=app vite build)…"
cd "$ROOT"
rm -rf dist
VITE_CALK_PLATFORM=app npm run build:app >/dev/null
test -f dist/index.html || { echo "ERROR: build failed (dist/index.html missing)"; exit 1; }

echo "==> [2/4] Safety net — bundle must contain NO AdSense / (iOS) Google Play…"
# Only inspect actual web content (html/js) — NOT server configs like .htaccess,
# whose CSP legitimately references pagead2 and is unused inside Capacitor.
PROBLEMS="$(grep -rlE 'adsbygoogle|pagead2\.googlesyndication' dist/ --include='*.html' --include='*.js' 2>/dev/null || true)"
if [ "$PLATFORM" = "ios" ]; then
  PROBLEMS="$PROBLEMS $(grep -rlE 'play\.google\.com|Google Play' dist/ --include='*.html' --include='*.js' 2>/dev/null || true)"
fi
if [ -n "$(echo "$PROBLEMS" | tr -d ' ')" ]; then
  echo "ERROR: forbidden strings found in $PLATFORM bundle:"; echo "$PROBLEMS"; exit 1
fi

echo "==> [3/4] Zipping bundle → ${CHANNEL}/${VERSION}.zip…"
ZIP="/tmp/calk-${CHANNEL}-${VERSION}.zip"
( cd dist && zip -qr "$ZIP" . )
CHECKSUM="$(shasum -a 256 "$ZIP" | cut -d' ' -f1)"

if [ "$MODE" = "--local" ]; then
  DEST="$ROOT/ota-local/${CHANNEL}"; mkdir -p "$DEST" "$ROOT/ota-local/manifest"
  cp "$ZIP" "$DEST/${VERSION}.zip"
  printf '{"version":"%s","checksum":"%s"}\n' "$VERSION" "$CHECKSUM" > "$ROOT/ota-local/manifest/${CHANNEL}.json"
  echo "Local: $DEST/${VERSION}.zip"; exit 0
fi

echo "==> [4/4] Uploading to $OTA_SSH…"
ssh -p "$OTA_SSH_PORT" "$OTA_SSH" "mkdir -p '$OTA_REMOTE_DIR/bundles/${CHANNEL}' '$OTA_REMOTE_DIR/manifest'"
scp -P "$OTA_SSH_PORT" "$ZIP" "$OTA_SSH:$OTA_REMOTE_DIR/bundles/${CHANNEL}/${VERSION}.zip"
ssh -p "$OTA_SSH_PORT" "$OTA_SSH" \
  "printf '{\"version\":\"%s\",\"checksum\":\"%s\"}\n' '$VERSION' '$CHECKSUM' > '$OTA_REMOTE_DIR/manifest/${CHANNEL}.json'"
echo "Published ${CHANNEL} v${VERSION} (sha256 ${CHECKSUM})."
