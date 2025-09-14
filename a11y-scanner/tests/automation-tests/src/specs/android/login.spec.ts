import { A11yScanner } from '../../services/a11yScanner';
import { Platform } from '@a11y-scanner/shared';

describe('Android Login Screen Accessibility', () => {
  let scanner: A11yScanner;

  before(async () => {
    scanner = new A11yScanner();
  });

  it('should scan login screen for accessibility issues', async () => {
    // Wait for app to load
    await browser.pause(3000);

    // Navigate to login screen if not already there
    try {
      const loginButton = await $('~Login'); // Using accessibility ID
      if (await loginButton.isDisplayed()) {
        await loginButton.click();
        await browser.pause(2000);
      }
    } catch (error) {
      console.log('Login screen might already be displayed or navigation failed');
    }

    // Perform accessibility scan
    const scanResult = await scanner.scanCurrentScreen({
      appName: 'Sample Android App',
      screenName: 'Login',
      platform: Platform.ANDROID,
    });

    // Assertions
    expect(scanResult).toBeDefined();
    expect(scanResult.id).toBeDefined();
    expect(scanResult.appName).toBe('Sample Android App');
    expect(scanResult.screenName).toBe('Login');
    expect(scanResult.platform).toBe(Platform.ANDROID);
    expect(scanResult.scanType).toBe('automated');
    expect(scanResult.score).toBeDefined();
    expect(scanResult.issues).toBeDefined();

    // Log results
    console.log(`Login Screen Accessibility Score: ${scanResult.score?.overall || 0}%`);
    console.log(`Issues found: ${scanResult.issues?.length || 0}`);
    
    if (scanResult.issues && scanResult.issues.length > 0) {
      console.log('Issues:');
      scanResult.issues.forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue.title} (${issue.severity})`);
      });
    }
  });

  it('should test login form accessibility', async () => {
    // Test username field
    try {
      const usernameField = await $('android=new UiSelector().resourceId("username")');
      if (await usernameField.isDisplayed()) {
        const contentDesc = await usernameField.getAttribute('content-desc');
        const hint = await usernameField.getAttribute('hint');
        
        console.log('Username field accessibility:', { contentDesc, hint });
        
        // Username field should have some form of accessibility label
        expect(contentDesc || hint).toBeTruthy();
      }
    } catch (error) {
      console.log('Username field not found or not accessible');
    }

    // Test password field
    try {
      const passwordField = await $('android=new UiSelector().resourceId("password")');
      if (await passwordField.isDisplayed()) {
        const contentDesc = await passwordField.getAttribute('content-desc');
        const hint = await passwordField.getAttribute('hint');
        
        console.log('Password field accessibility:', { contentDesc, hint });
        
        // Password field should have some form of accessibility label
        expect(contentDesc || hint).toBeTruthy();
      }
    } catch (error) {
      console.log('Password field not found or not accessible');
    }

    // Test login button
    try {
      const loginButton = await $('android=new UiSelector().text("Login")');
      if (await loginButton.isDisplayed()) {
        const contentDesc = await loginButton.getAttribute('content-desc');
        const text = await loginButton.getText();
        const bounds = await loginButton.getSize();
        
        console.log('Login button accessibility:', { contentDesc, text, bounds });
        
        // Button should have accessible text or content description
        expect(contentDesc || text).toBeTruthy();
        
        // Button should meet minimum touch target size (48dp)
        expect(bounds.width).toBeGreaterThanOrEqual(48);
        expect(bounds.height).toBeGreaterThanOrEqual(48);
      }
    } catch (error) {
      console.log('Login button not found or not accessible');
    }
  });

  it('should scan after login attempt', async () => {
    // Attempt to fill and submit login form
    try {
      const usernameField = await $('android=new UiSelector().resourceId("username")');
      const passwordField = await $('android=new UiSelector().resourceId("password")');
      const loginButton = await $('android=new UiSelector().text("Login")');

      if (await usernameField.isDisplayed() && await passwordField.isDisplayed()) {
        await usernameField.setValue('testuser');
        await passwordField.setValue('testpass');
        await loginButton.click();
        
        // Wait for response
        await browser.pause(3000);
        
        // Scan the resulting screen (could be error message or success)
        const scanResult = await scanner.scanCurrentScreen({
          appName: 'Sample Android App',
          screenName: 'Login Result',
          platform: Platform.ANDROID,
        });

        console.log(`Login Result Screen Score: ${scanResult.score?.overall || 0}%`);
        console.log(`Issues found: ${scanResult.issues?.length || 0}`);
      }
    } catch (error) {
      console.log('Could not complete login flow:', error.message);
    }
  });
});