#!/bin/bash
# Archive iOS build + upload to App Store Connect (manual signing)
#
# Use the same workflow as kz.calk.app — manual signing with named provisioning profile.
# App Store profiles do NOT require registered devices in the team.
#
# Setup (one-time):
#   1. https://developer.apple.com/account/resources/identifiers/list
#      → Identifiers → + → App IDs → App → Continue
#      → Bundle ID: explicit = kg.calk.ios
#      → Description: "Calk KG"
#      → Capabilities: ничего не нужно
#      → Register
#
#   2. https://developer.apple.com/account/resources/profiles/list
#      → Profiles → + → Distribution → App Store → Continue
#      → App ID: выбрать kg.calk.ios
#      → Certificate: выбрать Apple Distribution (SRKYS78RMQ)
#      → Provisioning Profile Name: "Calk KG App Store"
#      → Generate, download
#      → Двойной клик на .mobileprovision — Xcode установит автоматически
#
# Usage:
#   ./scripts/archive.sh                    # version 1.0.0, build 1
#   ./scripts/archive.sh 1.0.1 2            # custom version and build

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

VERSION="${1:-1.0.0}"
BUILD_NUMBER="${2:-1}"

ARCHIVE_PATH="build/CalkKG.xcarchive"
EXPORT_PATH="build/export"
EXPORT_OPTIONS="scripts/ExportOptions.plist"

echo "═══════════════════════════════════════"
echo "  Calk.KG iOS — Archive & Upload"
echo "  Version: ${VERSION} (build ${BUILD_NUMBER})"
echo "═══════════════════════════════════════"

# Check that the provisioning profile is installed
PROFILE_DIR=~/Library/Developer/Xcode/UserData/Provisioning\ Profiles
if ! grep -lq "kg.calk.ios" "$PROFILE_DIR"/*.mobileprovision 2>/dev/null; then
  echo ""
  echo "❌ Provisioning profile для kg.calk.ios не найден."
  echo ""
  echo "Создайте его в Apple Developer Portal:"
  echo "  1. https://developer.apple.com/account/resources/identifiers/list"
  echo "     → создайте App ID 'kg.calk.ios'"
  echo "  2. https://developer.apple.com/account/resources/profiles/list"
  echo "     → создайте 'Calk KG App Store' (App Store distribution)"
  echo "  3. Скачайте профиль, дважды кликните для установки"
  echo ""
  exit 1
fi

# Clean previous build
rm -rf "$ARCHIVE_PATH" "$EXPORT_PATH"
mkdir -p build/

echo ""
echo "▶ 1/2  Создание архива (xcodebuild archive)"
xcodebuild archive \
  -project CalkKG.xcodeproj \
  -scheme CalkKG \
  -configuration Release \
  -sdk iphoneos \
  -destination "generic/platform=iOS" \
  -archivePath "$ARCHIVE_PATH" \
  MARKETING_VERSION="$VERSION" \
  CURRENT_PROJECT_VERSION="$BUILD_NUMBER"

if [ ! -d "$ARCHIVE_PATH" ]; then
  echo "❌ Archive failed"
  exit 1
fi

echo ""
echo "▶ 2/2  Экспорт + upload в App Store Connect"
xcodebuild \
  -exportArchive \
  -archivePath "$ARCHIVE_PATH" \
  -exportOptionsPlist "$EXPORT_OPTIONS" \
  -exportPath "$EXPORT_PATH"

echo ""
echo "═══════════════════════════════════════"
echo "✅ Готово! Build загружен в App Store Connect."
echo ""
echo "Дальше:"
echo "  1. https://appstoreconnect.apple.com/"
echo "  2. Через 5-15 минут билд появится в TestFlight"
echo "  3. Заполните метаданные (см. AppStore/metadata/)"
echo "  4. Submit for Review"
echo "═══════════════════════════════════════"
