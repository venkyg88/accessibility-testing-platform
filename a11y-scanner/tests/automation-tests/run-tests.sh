#!/bin/bash

# Automation Test Runner Script
# This script helps run the automation tests in different modes

echo "🧪 A11y Scanner Automation Test Runner"
echo "======================================"

case "$1" in
  "android")
    echo "📱 Running Android tests (requires Android emulator)"
    ANDROID_EMULATOR_AVAILABLE=true pnpm test
    ;;
  "ios")
    echo "📱 Running iOS tests (requires iOS simulator)"
    IOS_SIMULATOR_AVAILABLE=true pnpm test
    ;;
  "mobile")
    echo "📱 Running both Android and iOS tests (requires both emulator and simulator)"
    ANDROID_EMULATOR_AVAILABLE=true IOS_SIMULATOR_AVAILABLE=true pnpm test
    ;;
  "skip")
    echo "⏭️  Running tests with no mobile capabilities (will skip all tests)"
    pnpm test
    ;;
  *)
    echo "Usage: $0 {android|ios|mobile|skip}"
    echo ""
    echo "Options:"
    echo "  android  - Run Android emulator tests only"
    echo "  ios      - Run iOS simulator tests only"
    echo "  mobile   - Run both Android and iOS tests"
    echo "  skip     - Skip all tests (no mobile devices configured)"
    echo ""
    echo "Prerequisites:"
    echo "  - For Android: Android Studio with emulator running"
    echo "  - For iOS: Xcode with iOS Simulator running"
    echo "  - Sample apps in ./apps/ directory"
    exit 1
    ;;
esac
