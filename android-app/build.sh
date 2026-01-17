#!/bin/bash
# Calk.KG Android App Build Script
# Использование: ./build.sh [debug|release]

set -e

# Настройка окружения
export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"
export JAVA_HOME="/opt/homebrew/opt/openjdk@17"

cd "$(dirname "$0")"

BUILD_TYPE="${1:-debug}"

echo "🔧 Сборка Calk.KG Android App ($BUILD_TYPE)..."
echo ""

if [ "$BUILD_TYPE" = "release" ]; then
    # Проверка наличия keystore
    if [ ! -f "keystore/calk-kg-release.keystore" ]; then
        echo "❌ Ошибка: keystore не найден!"
        echo ""
        echo "Создайте keystore командой:"
        echo "  mkdir -p keystore"
        echo "  keytool -genkey -v -keystore keystore/calk-kg-release.keystore \\"
        echo "    -alias calk-kg -keyalg RSA -keysize 2048 -validity 10000"
        exit 1
    fi
    
    echo "📦 Сборка Release APK..."
    ./gradlew assembleRelease
    
    APK_PATH="app/build/outputs/apk/release/app-release.apk"
    
    echo ""
    echo "📦 Сборка Release AAB (для Google Play)..."
    ./gradlew bundleRelease
    
    AAB_PATH="app/build/outputs/bundle/release/app-release.aab"
    
    echo ""
    echo "✅ Сборка завершена!"
    echo ""
    echo "📱 APK: $APK_PATH"
    echo "📱 AAB: $AAB_PATH"
else
    echo "📦 Сборка Debug APK..."
    ./gradlew assembleDebug
    
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
    
    echo ""
    echo "✅ Сборка завершена!"
    echo ""
    echo "📱 APK: $APK_PATH"
fi

# Размер файла
echo ""
echo "📊 Размер APK: $(ls -lh "$APK_PATH" | awk '{print $5}')"




