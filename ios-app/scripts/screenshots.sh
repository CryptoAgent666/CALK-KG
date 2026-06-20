#!/bin/bash
# Generate App Store screenshots in required sizes (2026 requirements)
#
# Required sizes:
#   - iPhone 6.9" Display: 1320 × 2868 (iPhone 17 Pro Max) — REQUIRED
#   - iPad 13":            2064 × 2752 (iPad Pro 13" M5)   — REQUIRED if iPad supported
#
# Captures 5 screens per device by launching app with different CALK_INITIAL_URL env var.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
OUT_DIR="$PROJECT_DIR/AppStore/screenshots"
cd "$PROJECT_DIR"

mkdir -p "$OUT_DIR"

# Define screens to capture: name|url
SCREENS=(
  "01-home|https://calk.kg/"
  "02-salary|https://calk.kg/calculator/salary/"
  "03-loan|https://calk.kg/calculator/loan/"
  "04-currency|https://calk.kg/calculator/currency-exchange/"
  "05-electricity|https://calk.kg/calculator/electricity/"
)

# Define devices to capture
DEVICES=(
  "iPhone 17 Pro Max"
  "iPad Pro 13-inch (M5)"
)

# Build once
echo "🔨 Building app..."
xcodebuild -project CalkKG.xcodeproj \
  -scheme CalkKG \
  -configuration Debug \
  -destination "platform=iOS Simulator,name=iPhone 17 Pro Max,OS=latest" \
  -derivedDataPath /tmp/CalkKG-screenshots \
  CODE_SIGNING_ALLOWED=NO \
  build 2>&1 | tail -2

APP_PATH=$(find /tmp/CalkKG-screenshots -name "CalkKG.app" -path "*/Debug-iphonesimulator/*" | head -1)

if [ -z "$APP_PATH" ] || [ ! -d "$APP_PATH" ]; then
  echo "❌ Built app not found"
  exit 1
fi

for device in "${DEVICES[@]}"; do
  echo ""
  echo "═══════════════════════════════════════"
  echo "📱 $device"
  echo "═══════════════════════════════════════"

  UDID=$(xcrun simctl list devices available | grep "$device (" | head -1 | grep -oE '\([A-F0-9-]{36}\)' | tr -d '()')

  if [ -z "$UDID" ]; then
    echo "⚠️  Device not found, skipping."
    continue
  fi

  # Boot simulator
  xcrun simctl boot "$UDID" 2>/dev/null || true
  sleep 2

  # Install app on this device
  xcrun simctl install "$UDID" "$APP_PATH"
  echo "✅ App installed"

  # Slug for directory name
  device_slug=$(echo "$device" | tr ' ()' '-_' | tr -d '"' | sed 's/--*/-/g; s/-$//')
  device_dir="$OUT_DIR/$device_slug"
  mkdir -p "$device_dir"

  for screen in "${SCREENS[@]}"; do
    name="${screen%%|*}"
    url="${screen##*|}"

    # Terminate previous instance — env vars are only applied at launch
    xcrun simctl terminate "$UDID" kg.calk.ios 2>/dev/null || true
    sleep 1

    # Launch with custom URL + screenshot mode (hides cookies + ads)
    # Env vars MUST use SIMCTL_CHILD_ prefix
    SIMCTL_CHILD_CALK_INITIAL_URL="$url" \
    SIMCTL_CHILD_CALK_SCREENSHOT_MODE="1" \
      xcrun simctl launch "$UDID" kg.calk.ios > /dev/null

    # Wait for page to render (longer for slower pages)
    sleep 8

    # Capture
    xcrun simctl io "$UDID" screenshot "$device_dir/${name}.png" 2>&1 | grep -i "wrote" || true

    # Show dimensions
    size=$(sips -g pixelWidth -g pixelHeight "$device_dir/${name}.png" 2>/dev/null | grep -E "pixel(Width|Height)" | awk '{print $2}' | paste -sd 'x' -)
    echo "  ✓ ${name}.png — ${size}"
  done

  # Cleanup
  xcrun simctl terminate "$UDID" kg.calk.ios 2>/dev/null || true
done

echo ""
echo "═══════════════════════════════════════"
echo "📸 Screenshots saved to: $OUT_DIR"
echo "═══════════════════════════════════════"

# Final report
for device in "${DEVICES[@]}"; do
  slug=$(echo "$device" | tr ' ()' '-_' | tr -d '"' | sed 's/--*/-/g; s/-$//')
  if [ -d "$OUT_DIR/$slug" ]; then
    echo ""
    echo "$device:"
    ls -1 "$OUT_DIR/$slug/" | head -10
  fi
done
