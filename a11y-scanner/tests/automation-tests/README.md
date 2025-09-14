# A11y Scanner Automation Tests

This directory contains automated accessibility tests for mobile applications using WebDriverIO and Appium.

## 🚀 Quick Start

### Default Mode (No Mobile Devices)

```bash
pnpm test
```

This will skip all tests and show a helpful message about configuring mobile devices.

### Using the Test Runner Script

```bash
# Make the script executable (first time only)
chmod +x run-tests.sh

# Run different test modes
./run-tests.sh skip      # Skip all tests (default)
./run-tests.sh android   # Run Android tests only
./run-tests.sh ios       # Run iOS tests only
./run-tests.sh mobile    # Run both Android and iOS tests
```

## 📱 Prerequisites for Mobile Testing

### Android Testing

1. **Android Studio** with Android SDK installed
2. **Android Emulator** running (API level 28+)
3. **Sample Android App** (`.apk` file) in `./apps/sample-app.apk`

### iOS Testing

1. **Xcode** with iOS SDK installed
2. **iOS Simulator** running (iOS 14+)
3. **Sample iOS App** (`.app` file) in `./apps/sample-app.app`

## 🔧 Configuration

The tests use environment variables to determine which capabilities to enable:

- `ANDROID_EMULATOR_AVAILABLE=true` - Enables Android testing
- `IOS_SIMULATOR_AVAILABLE=true` - Enables iOS testing
- `ANDROID_APP_PATH` - Custom path to Android app (default: `./apps/sample-app.apk`)
- `IOS_APP_PATH` - Custom path to iOS app (default: `./apps/sample-app.app`)

## 📁 Project Structure

```
automation-tests/
├── src/
│   ├── specs/
│   │   ├── android/           # Android-specific tests
│   │   │   └── login.spec.ts
│   │   └── ios/               # iOS-specific tests
│   │       └── login.spec.ts
│   ├── services/
│   │   └── a11yScanner.ts     # Accessibility scanning service
│   └── utils/
│       └── helpers.ts         # Test utilities
├── apps/                      # Sample apps for testing (create this)
│   ├── sample-app.apk        # Android sample app
│   └── sample-app.app        # iOS sample app
├── logs/                      # Test execution logs
├── allure-results/           # Test reports
├── wdio.conf.ts              # WebDriverIO configuration
├── run-tests.sh              # Test runner script
└── README.md                 # This file
```

## 🧪 Test Types

### Accessibility Scanning Tests

- **Screen Scanning**: Captures and analyzes entire screens for accessibility issues
- **Element Testing**: Tests individual UI elements for accessibility compliance
- **Navigation Testing**: Verifies keyboard navigation and screen reader compatibility

### Current Test Coverage

- **Login Screen Tests**: Tests login form accessibility
- **Form Element Tests**: Validates input fields, buttons, and labels
- **Touch Target Tests**: Ensures minimum touch target sizes
- **Content Description Tests**: Verifies accessibility labels

## 🔍 Understanding Test Results

### When Tests Skip (No Mobile Devices)

```
⚠️  No mobile devices configured. Set ANDROID_EMULATOR_AVAILABLE=true or IOS_SIMULATOR_AVAILABLE=true to run mobile tests.
ℹ️  Skipping all tests as no capabilities are available.
Spec Files: 0 passed, 0 total (0% completed)
```

### When Tests Run (With Mobile Devices)

```
📱 Android emulator tests enabled
📱 iOS simulator tests enabled
Spec Files: 2 passed, 0 failed, 2 total (100% completed)
```

## 🛠️ Development

### Adding New Tests

1. Create test files in `src/specs/android/` or `src/specs/ios/`
2. Use the `A11yScanner` service to perform accessibility scans
3. Follow the existing test patterns for consistency

### Debugging Tests

- Check logs in `./logs/` directory
- Use `browser.debug()` to pause test execution
- Enable verbose logging with `logLevel: 'debug'` in `wdio.conf.ts`

## 🚨 Troubleshooting

### Common Issues

**"Unable to connect to Appium server"**

- Ensure Appium drivers are installed: `npx appium driver list`
- Check if mobile device/emulator is running
- Verify the sample app exists in `./apps/` directory

**"Sample app not found"**

- Create the `./apps/` directory
- Add your sample apps: `sample-app.apk` and `sample-app.app`
- Or set custom paths with `ANDROID_APP_PATH` and `IOS_APP_PATH`

**"No capabilities available"**

- Set environment variables: `ANDROID_EMULATOR_AVAILABLE=true` or `IOS_SIMULATOR_AVAILABLE=true`
- Use the test runner script: `./run-tests.sh android`

## 📚 Resources

- [WebDriverIO Documentation](https://webdriver.io/)
- [Appium Documentation](https://appium.io/)
- [Accessibility Testing Guide](https://developer.android.com/guide/topics/ui/accessibility/testing)
- [iOS Accessibility Testing](https://developer.apple.com/accessibility/)
