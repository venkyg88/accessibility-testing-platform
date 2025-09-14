import type { Options } from "@wdio/types";

export const config: Options.Testrunner = {
  //
  // ====================
  // Runner Configuration
  // ====================
  runner: "local",

  //
  // ==================
  // Specify Test Files
  // ==================
  specs: ["./src/specs/**/*.spec.ts"],
  exclude: [],

  //
  // ============
  // Capabilities
  // ============
  capabilities: (() => {
    const caps = [];

    // Android capability - only run if emulator is available
    if (process.env.ANDROID_EMULATOR_AVAILABLE === "true") {
      caps.push({
        platformName: "Android",
        "appium:deviceName": "Android Emulator",
        "appium:platformVersion": "13.0",
        "appium:automationName": "UiAutomator2",
        "appium:app": process.env.ANDROID_APP_PATH || "./apps/sample-app.apk",
        "appium:newCommandTimeout": 240,
        "appium:connectHardwareKeyboard": true,
      });
    }

    // iOS capability - only run if simulator is available
    if (process.env.IOS_SIMULATOR_AVAILABLE === "true") {
      caps.push({
        platformName: "iOS",
        "appium:deviceName": "iPhone 14",
        "appium:platformVersion": "16.0",
        "appium:automationName": "XCUITest",
        "appium:app": process.env.IOS_APP_PATH || "./apps/sample-app.app",
        "appium:newCommandTimeout": 240,
      });
    }

    // If no mobile capabilities are available, return empty array
    // This will cause WebDriverIO to skip all tests
    return caps;
  })(),

  //
  // ===================
  // Test Configurations
  // ===================
  logLevel: "info",
  bail: 0,
  baseUrl: "http://localhost:4723",
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: (() => {
    const services: any[] = [];

    // Only start Appium if mobile capabilities are enabled
    if (
      process.env.ANDROID_EMULATOR_AVAILABLE === "true" ||
      process.env.IOS_SIMULATOR_AVAILABLE === "true"
    ) {
      services.push([
        "appium",
        {
          args: {
            address: "localhost",
            port: 4723,
            relaxedSecurity: true,
          },
          logPath: "./logs/",
        },
      ]);
    }

    return services;
  })(),

  framework: "mocha",
  reporters: [
    "spec",
    [
      "allure",
      {
        outputDir: "allure-results",
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
      },
    ],
  ],

  //
  // =====
  // Hooks
  // =====
  onPrepare: function (config: any, capabilities: any) {
    console.log("Starting automation tests...");

    if (
      !process.env.ANDROID_EMULATOR_AVAILABLE &&
      !process.env.IOS_SIMULATOR_AVAILABLE
    ) {
      console.log(
        "⚠️  No mobile devices configured. Set ANDROID_EMULATOR_AVAILABLE=true or IOS_SIMULATOR_AVAILABLE=true to run mobile tests."
      );
      console.log("ℹ️  Skipping all tests as no capabilities are available.");
    } else {
      if (process.env.ANDROID_EMULATOR_AVAILABLE === "true") {
        console.log("📱 Android emulator tests enabled");
      }
      if (process.env.IOS_SIMULATOR_AVAILABLE === "true") {
        console.log("📱 iOS simulator tests enabled");
      }
    }
  },

  onComplete: function (
    exitCode: any,
    config: any,
    capabilities: any,
    results: any
  ) {
    console.log("Automation tests completed");
  },

  beforeSession: function (config: any, capabilities: any, specs: any) {
    // WebDriverIO v9 handles TypeScript compilation automatically
  },

  afterTest: async function (
    test: any,
    context: any,
    { error, result, duration, passed, retries }: any
  ) {
    if (!passed) {
      await browser.takeScreenshot();
    }
  },

  //
  // =====
  // Suites
  // =====
  suites: {
    android: ["./src/specs/android/**/*.spec.ts"],
    ios: ["./src/specs/ios/**/*.spec.ts"],
    web: ["./src/specs/web/**/*.spec.ts"],
  },

  //
  // =================
  // Mocha Configuration
  // =================
  mochaOpts: {
    ui: "bdd",
    timeout: 60000,
  },
};
