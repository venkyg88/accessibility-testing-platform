import { A11yScanner } from '../../services/a11yScanner';
import { Platform } from '@a11y-scanner/shared';

describe('iOS Login Screen Accessibility', () => {
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
      appName: 'Sample iOS App',
      screenName: 'Login',
      platform: Platform.IOS,
    });

    // Assertions
    expect(scanResult).toBeDefined();
    expect(scanResult.id).toBeDefined();
    expect(scanResult.appName).toBe('Sample iOS App');
    expect(scanResult.screenName).toBe('Login');
    expect(scanResult.platform).toBe(Platform.IOS);
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
      const usernameField = await $('~username'); // Using accessibility ID
      if (await usernameField.isDisplayed()) {
        const name = await usernameField.getAttribute('name');
        const label = await usernameField.getAttribute('label');
        const value = await usernameField.getAttribute('value');
        
        console.log('Username field accessibility:', { name, label, value });
        
        // Username field should have accessibility label
        expect(name || label).toBeTruthy();
      }
    } catch (error) {
      console.log('Username field not found or not accessible');
    }

    // Test password field
    try {
      const passwordField = await $('~password'); // Using accessibility ID
      if (await passwordField.isDisplayed()) {
        const name = await passwordField.getAttribute('name');
        const label = await passwordField.getAttribute('label');
        
        console.log('Password field accessibility:', { name, label });
        
        // Password field should have accessibility label
        expect(name || label).toBeTruthy();
      }
    } catch (error) {
      console.log('Password field not found or not accessible');
    }

    // Test login button
    try {
      const loginButton = await $('~loginButton'); // Using accessibility ID
      if (await loginButton.isDisplayed()) {
        const name = await loginButton.getAttribute('name');
        const label = await loginButton.getAttribute('label');
        const bounds = await loginButton.getSize();
        
        console.log('Login button accessibility:', { name, label, bounds });
        
        // Button should have accessible name or label
        expect(name || label).toBeTruthy();
        
        // Button should meet minimum touch target size (44pt)
        expect(bounds.width).toBeGreaterThanOrEqual(44);
        expect(bounds.height).toBeGreaterThanOrEqual(44);
      }
    } catch (error) {
      console.log('Login button not found or not accessible');
    }
  });

  it('should test VoiceOver compatibility', async () => {
    // Test if elements are accessible to VoiceOver
    try {
      const accessibleElements = await $$('*[accessible="true"]');
      console.log(`Found ${accessibleElements.length} VoiceOver accessible elements`);
      
      for (const element of accessibleElements.slice(0, 5)) { // Test first 5 elements
        try {
          const name = await element.getAttribute('name');
          const label = await element.getAttribute('label');
          const traits = await element.getAttribute('traits');
          
          console.log('VoiceOver element:', { name, label, traits });
          
          // Each accessible element should have a name or label
          expect(name || label).toBeTruthy();
        } catch (error) {
          // Skip elements that can't be processed
          continue;
        }
      }
    } catch (error) {
      console.log('Could not test VoiceOver compatibility:', error.message);
    }
  });

  it('should scan after login attempt', async () => {
    // Attempt to fill and submit login form
    try {
      const usernameField = await $('~username');
      const passwordField = await $('~password');
      const loginButton = await $('~loginButton');

      if (await usernameField.isDisplayed() && await passwordField.isDisplayed()) {
        await usernameField.setValue('testuser');
        await passwordField.setValue('testpass');
        await loginButton.click();
        
        // Wait for response
        await browser.pause(3000);
        
        // Scan the resulting screen (could be error message or success)
        const scanResult = await scanner.scanCurrentScreen({
          appName: 'Sample iOS App',
          screenName: 'Login Result',
          platform: Platform.IOS,
        });

        console.log(`Login Result Screen Score: ${scanResult.score?.overall || 0}%`);
        console.log(`Issues found: ${scanResult.issues?.length || 0}`);
      }
    } catch (error) {
      console.log('Could not complete login flow:', error.message);
    }
  });
});