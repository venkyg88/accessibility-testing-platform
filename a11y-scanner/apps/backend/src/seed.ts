import { PrismaClient } from '@prisma/client';
import { 
  IssueSeverity, 
  IssueCategory, 
  WCAGLevel, 
  Platform, 
  ScanType,
  calculateA11yScore,
  generateScanId,
  generateIssueId
} from '@a11y-scanner/shared';

const prisma = new PrismaClient();

const sampleIssues = [
  {
    title: 'Missing alt text for image',
    description: 'Image elements must have alternative text for screen readers',
    severity: IssueSeverity.HIGH,
    category: IssueCategory.PERCEIVABLE,
    wcagLevel: WCAGLevel.A,
    wcagCriteria: '1.1.1',
    element: {
      tagName: 'img',
      className: 'hero-image',
      bounds: { x: 100, y: 200, width: 300, height: 200 },
    },
  },
  {
    title: 'Insufficient color contrast',
    description: 'Text color contrast ratio is below WCAG AA standards',
    severity: IssueSeverity.MEDIUM,
    category: IssueCategory.PERCEIVABLE,
    wcagLevel: WCAGLevel.AA,
    wcagCriteria: '1.4.3',
    element: {
      tagName: 'p',
      text: 'Welcome to our app',
      bounds: { x: 50, y: 100, width: 200, height: 30 },
    },
  },
  {
    title: 'Button not accessible via keyboard',
    description: 'Interactive elements must be keyboard accessible',
    severity: IssueSeverity.CRITICAL,
    category: IssueCategory.OPERABLE,
    wcagLevel: WCAGLevel.A,
    wcagCriteria: '2.1.1',
    element: {
      tagName: 'div',
      className: 'custom-button',
      text: 'Submit',
      bounds: { x: 150, y: 400, width: 100, height: 40 },
    },
  },
];

const sampleScreenshot = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

async function seed() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.remediationStep.deleteMany();
  await prisma.issue.deleteMany();
  await prisma.a11yScore.deleteMany();
  await prisma.scanResult.deleteMany();

  // Create sample scan results
  const platforms = [Platform.IOS, Platform.ANDROID, Platform.WEB];
  const scanTypes = [ScanType.MANUAL, ScanType.AUTOMATED];
  const apps = ['MyApp', 'TestApp', 'DemoApp'];
  const screens = ['Login', 'Home', 'Profile', 'Settings', 'Checkout'];

  for (let i = 0; i < 20; i++) {
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const scanType = scanTypes[Math.floor(Math.random() * scanTypes.length)];
    const appName = apps[Math.floor(Math.random() * apps.length)];
    const screenName = screens[Math.floor(Math.random() * screens.length)];
    
    // Generate random issues (0-5 issues per scan)
    const numIssues = Math.floor(Math.random() * 6);
    const issues = [];
    
    for (let j = 0; j < numIssues; j++) {
      const randomIssue = sampleIssues[Math.floor(Math.random() * sampleIssues.length)];
      issues.push({
        ...randomIssue,
        id: generateIssueId(),
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
      });
    }

    const score = calculateA11yScore(issues);
    const scanId = generateScanId();

    await prisma.scanResult.create({
      data: {
        id: scanId,
        appName,
        appVersion: '1.0.0',
        platform,
        scanType,
        screenName,
        screenshot: sampleScreenshot,
        accessibilityTree: {
          type: 'view',
          children: [
            { type: 'text', text: 'Welcome to our app' },
            { type: 'button', text: 'Submit' },
            { type: 'image', alt: null },
          ],
        },
        metadata: {
          deviceInfo: {
            model: platform === Platform.IOS ? 'iPhone 14' : platform === Platform.ANDROID ? 'Pixel 7' : 'Chrome Browser',
            osVersion: platform === Platform.IOS ? '16.0' : platform === Platform.ANDROID ? '13.0' : '108.0',
            screenResolution: '390x844',
          },
          scanDuration: Math.floor(Math.random() * 5000) + 1000,
          scannerVersion: '1.0.0',
        },
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        issues: {
          create: issues.map(issue => ({
            id: issue.id,
            title: issue.title,
            description: issue.description,
            severity: issue.severity,
            category: issue.category,
            wcagLevel: issue.wcagLevel,
            wcagCriteria: issue.wcagCriteria,
            element: issue.element,
            createdAt: issue.createdAt,
          })),
        },
        score: {
          create: {
            overall: score.overall,
            perceivable: score.perceivable,
            operable: score.operable,
            understandable: score.understandable,
            robust: score.robust,
            totalIssues: score.totalIssues,
            criticalIssues: score.criticalIssues,
            highIssues: score.highIssues,
            mediumIssues: score.mediumIssues,
            lowIssues: score.lowIssues,
          },
        },
      },
    });
  }

  console.log('✅ Database seeded successfully!');
}

seed()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });