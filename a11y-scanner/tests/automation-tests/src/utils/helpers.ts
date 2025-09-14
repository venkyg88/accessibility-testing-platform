/**
 * Utility functions for automation tests
 */

/**
 * Wait for an element to be displayed with timeout
 */
export async function waitForElement(selector: string, timeout: number = 10000): Promise<WebdriverIO.Element | null> {
  try {
    const element = await $(selector);
    await element.waitForDisplayed({ timeout });
    return element;
  } catch (error) {
    console.log(`Element ${selector} not found within ${timeout}ms`);
    return null;
  }
}

/**
 * Take a screenshot with a custom name
 */
export async function takeScreenshot(name: string): Promise<void> {
  try {
    const screenshot = await browser.takeScreenshot();
    const fs = require('fs');
    const path = require('path');
    
    const screenshotDir = path.join(process.cwd(), 'screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    
    const filename = `${name}_${Date.now()}.png`;
    const filepath = path.join(screenshotDir, filename);
    
    fs.writeFileSync(filepath, screenshot, 'base64');
    console.log(`Screenshot saved: ${filepath}`);
  } catch (error) {
    console.error('Failed to take screenshot:', error);
  }
}

/**
 * Get all interactive elements on the current screen
 */
export async function getInteractiveElements(): Promise<WebdriverIO.Element[]> {
  const interactiveSelectors = [
    'button',
    'input',
    'select',
    'textarea',
    'a',
    '[clickable="true"]',
    '[focusable="true"]'
  ];
  
  const elements: WebdriverIO.Element[] = [];
  
  for (const selector of interactiveSelectors) {
    try {
      const foundElements = await $$(selector);
      elements.push(...foundElements);
    } catch (error) {
      // Continue if selector doesn't work on current platform
      continue;
    }
  }
  
  return elements;
}

/**
 * Check if an element meets minimum touch target size
 */
export async function checkTouchTargetSize(element: WebdriverIO.Element, minSize: number = 44): Promise<boolean> {
  try {
    const size = await element.getSize();
    return size.width >= minSize && size.height >= minSize;
  } catch (error) {
    return false;
  }
}

/**
 * Get accessibility information for an element
 */
export async function getAccessibilityInfo(element: WebdriverIO.Element): Promise<{
  name?: string;
  label?: string;
  contentDesc?: string;
  text?: string;
  role?: string;
}> {
  const info: any = {};
  
  try {
    // Try different accessibility attributes based on platform
    const attributes = ['name', 'label', 'content-desc', 'text', 'role', 'accessibility-id'];
    
    for (const attr of attributes) {
      try {
        const value = await element.getAttribute(attr);
        if (value) {
          info[attr.replace('-', '')] = value;
        }
      } catch (error) {
        // Attribute not available on this platform
        continue;
      }
    }
    
    // Also try getting text content
    try {
      const text = await element.getText();
      if (text) {
        info.text = text;
      }
    } catch (error) {
      // Text not available
    }
  } catch (error) {
    console.error('Failed to get accessibility info:', error);
  }
  
  return info;
}

/**
 * Scroll to an element if it's not visible
 */
export async function scrollToElement(element: WebdriverIO.Element): Promise<void> {
  try {
    const isDisplayed = await element.isDisplayed();
    if (!isDisplayed) {
      await element.scrollIntoView();
      await browser.pause(1000); // Wait for scroll animation
    }
  } catch (error) {
    console.error('Failed to scroll to element:', error);
  }
}

/**
 * Simulate screen reader navigation
 */
export async function simulateScreenReaderNavigation(): Promise<string[]> {
  const accessibleContent: string[] = [];
  
  try {
    // Get all elements that would be read by a screen reader
    const elements = await $$('*');
    
    for (const element of elements) {
      try {
        const isDisplayed = await element.isDisplayed();
        if (!isDisplayed) continue;
        
        const accessibilityInfo = await getAccessibilityInfo(element);
        
        // Determine what a screen reader would announce
        const announcement = accessibilityInfo.label || 
                           accessibilityInfo.name || 
                           accessibilityInfo.contentDesc || 
                           accessibilityInfo.text;
        
        if (announcement && announcement.trim()) {
          accessibleContent.push(announcement.trim());
        }
      } catch (error) {
        // Skip elements that can't be processed
        continue;
      }
    }
  } catch (error) {
    console.error('Failed to simulate screen reader navigation:', error);
  }
  
  return accessibleContent;
}