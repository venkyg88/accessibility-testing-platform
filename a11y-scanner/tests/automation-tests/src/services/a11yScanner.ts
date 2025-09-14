import axios from 'axios';
import { 
  CreateScanResultRequest, 
  ScanResult, 
  Platform as SharedPlatform,
  ScanType,
  Issue,
  IssueSeverity,
  IssueCategory,
  WCAGLevel,
  generateIssueId
} from '@a11y-scanner/shared';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4000/api';

export class A11yScanner {
  private apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  });

  /**
   * Scan the current screen for accessibility issues
   */
  async scanCurrentScreen(options: {
    appName: string;
    screenName: string;
    platform: SharedPlatform;
  }): Promise<ScanResult> {
    console.log(`Starting accessibility scan for ${options.appName} - ${options.screenName}`);

    // Take screenshot
    const screenshot = await this.takeScreenshot();
    
    // Get accessibility tree
    const accessibilityTree = await this.getAccessibilityTree();
    
    // Analyze accessibility issues
    const issues = await this.analyzeAccessibility(accessibilityTree);
    
    // Get device info
    const deviceInfo = await this.getDeviceInfo();

    // Create scan result
    const scanRequest: CreateScanResultRequest = {
      appName: options.appName,
      screenName: options.screenName,
      platform: options.platform,
      scanType: ScanType.AUTOMATED,
      screenshot,
      accessibilityTree,
      issues,
      metadata: {
        deviceInfo,
        scanDuration: 0, // Will be calculated on backend
        scannerVersion: '1.0.0',
      },
    };

    // Send to backend
    const response = await this.apiClient.post('/scan-results', scanRequest);
    const scanResult = response.data.data;

    console.log(`Scan completed. Found ${issues.length} issues. Score: ${scanResult.score?.overall || 0}%`);
    
    return scanResult;
  }

  /**
   * Take a screenshot of the current screen
   */
  private async takeScreenshot(): Promise<string> {
    const screenshot = await browser.takeScreenshot();
    return `data:image/png;base64,${screenshot}`;
  }

  /**
   * Get the accessibility tree for the current screen
   */
  private async getAccessibilityTree(): Promise<any> {
    try {
      // Get page source (accessibility tree)
      const pageSource = await browser.getPageSource();
      
      // For mobile platforms, we can also get additional accessibility info
      if (browser.isMobile) {
        // Get all elements with accessibility information
        const elements = await $$('*');
        const accessibilityInfo = [];

        for (const element of elements) {
          try {
            const tagName = await element.getTagName();
            const text = await element.getText().catch(() => '');
            const isDisplayed = await element.isDisplayed().catch(() => false);
            const location = await element.getLocation().catch(() => ({ x: 0, y: 0 }));
            const size = await element.getSize().catch(() => ({ width: 0, height: 0 }));
            
            // Get accessibility attributes
            const accessibilityLabel = await element.getAttribute('content-desc').catch(() => null) ||
                                     await element.getAttribute('accessibility-id').catch(() => null) ||
                                     await element.getAttribute('name').catch(() => null);

            if (isDisplayed) {
              accessibilityInfo.push({
                tagName,
                text,
                accessibilityLabel,
                bounds: {
                  x: location.x,
                  y: location.y,
                  width: size.width,
                  height: size.height,
                },
              });
            }
          } catch (error) {
            // Skip elements that can't be processed
            continue;
          }
        }

        return {
          pageSource,
          elements: accessibilityInfo,
        };
      }

      return { pageSource };
    } catch (error) {
      console.error('Failed to get accessibility tree:', error);
      return { pageSource: '', elements: [] };
    }
  }

  /**
   * Analyze the accessibility tree and identify issues
   */
  private async analyzeAccessibility(accessibilityTree: any): Promise<Omit<Issue, 'id' | 'createdAt'>[]> {
    const issues: Omit<Issue, 'id' | 'createdAt'>[] = [];

    if (accessibilityTree.elements) {
      for (const element of accessibilityTree.elements) {
        // Check for missing accessibility labels on interactive elements
        if (this.isInteractiveElement(element) && !element.accessibilityLabel && !element.text) {
          issues.push({
            title: 'Missing accessibility label',
            description: 'Interactive elements must have accessible names so screen readers can describe their purpose to users.',
            severity: IssueSeverity.CRITICAL,
            category: IssueCategory.OPERABLE,
            wcagLevel: WCAGLevel.A,
            wcagCriteria: '4.1.2',
            element: {
              tagName: element.tagName,
              bounds: element.bounds,
            },
          });
        }

        // Check for small touch targets
        if (this.isInteractiveElement(element)) {
          const { width, height } = element.bounds;
          const minSize = 44; // 44pt minimum touch target size
          
          if (width < minSize || height < minSize) {
            issues.push({
              title: 'Touch target too small',
              description: `Touch targets should be at least ${minSize}x${minSize}pt to be easily tappable. Current size: ${width}x${height}pt.`,
              severity: IssueSeverity.MEDIUM,
              category: IssueCategory.OPERABLE,
              wcagLevel: WCAGLevel.AA,
              wcagCriteria: '2.5.5',
              element: {
                tagName: element.tagName,
                text: element.text,
                bounds: element.bounds,
              },
            });
          }
        }

        // Check for images without alt text
        if (this.isImageElement(element) && !element.accessibilityLabel) {
          issues.push({
            title: 'Missing alt text for image',
            description: 'Image elements must have alternative text for screen readers to describe the content to users with visual impairments.',
            severity: IssueSeverity.HIGH,
            category: IssueCategory.PERCEIVABLE,
            wcagLevel: WCAGLevel.A,
            wcagCriteria: '1.1.1',
            element: {
              tagName: element.tagName,
              bounds: element.bounds,
            },
          });
        }
      }
    }

    return issues;
  }

  /**
   * Check if an element is interactive
   */
  private isInteractiveElement(element: any): boolean {
    const interactiveTags = ['button', 'link', 'input', 'select', 'textarea'];
    return interactiveTags.includes(element.tagName?.toLowerCase()) ||
           element.tagName?.toLowerCase().includes('button') ||
           element.tagName?.toLowerCase().includes('clickable');
  }

  /**
   * Check if an element is an image
   */
  private isImageElement(element: any): boolean {
    return element.tagName?.toLowerCase() === 'image' ||
           element.tagName?.toLowerCase() === 'img' ||
           element.tagName?.toLowerCase().includes('image');
  }

  /**
   * Get device information
   */
  private async getDeviceInfo(): Promise<{
    model: string;
    osVersion: string;
    screenResolution: string;
  }> {
    const capabilities = browser.capabilities;
    const windowSize = await browser.getWindowSize();
    
    return {
      model: capabilities.deviceName || capabilities.browserName || 'Unknown Device',
      osVersion: capabilities.platformVersion || capabilities.browserVersion || 'Unknown Version',
      screenResolution: `${windowSize.width}x${windowSize.height}`,
    };
  }
}