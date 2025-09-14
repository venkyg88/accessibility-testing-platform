# A11y Scanner - Accessibility Testing Platform

A comprehensive end-to-end accessibility scanning platform with both manual scanning (via React Native app) and automated scanning (via Appium). Built with Turborepo, TypeScript, and pnpm workspaces.

## 🏗️ Architecture

```
a11y-scanner/
├── apps/
│   ├── mobile-scanner/     # React Native app (iOS + Android)
│   ├── web-dashboard/      # Next.js web dashboard
│   └── backend/           # Node.js API server
├── tests/
│   └── automation-tests/  # Appium + WebDriverIO tests
├── packages/
│   ├── shared/           # Shared types, models, utils
│   ├── ui/              # Shared UI components
│   └── config/          # ESLint, Prettier, tsconfig
└── docker-compose.yml   # Docker setup
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm 8+
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd a11y-scanner
   pnpm install
   ```

2. **Start the database:**
   ```bash
   pnpm docker:up
   ```

3. **Set up the backend:**
   ```bash
   # Copy environment file
   cp apps/backend/.env.example apps/backend/.env
   
   # Generate Prisma client and run migrations
   pnpm db:generate
   pnpm db:push
   
   # Seed with sample data
   pnpm --filter backend db:seed
   ```

4. **Start development servers:**
   ```bash
   pnpm dev
   ```

This will start:
- Backend API on http://localhost:4000
- Web Dashboard on http://localhost:3000

## 📱 Applications

### Mobile Scanner (React Native)

**Location:** `apps/mobile-scanner/`

A React Native app for manual accessibility scanning with native platform hooks.

**Features:**
- Manual accessibility scanning
- Screenshot capture with accessibility metadata
- iOS UIAccessibility and Android AccessibilityService integration
- Scan history and results viewing
- API integration with backend

**Setup:**
```bash
cd apps/mobile-scanner

# iOS
npx react-native run-ios

# Android  
npx react-native run-android
```

**Key Files:**
- `src/services/accessibilityService.ts` - Platform accessibility hooks
- `src/services/apiService.ts` - Backend API integration
- `src/screens/ScanScreen.tsx` - Main scanning interface

### Web Dashboard (Next.js)

**Location:** `apps/web-dashboard/`

A modern web dashboard for viewing metrics, scan results, and analytics.

**Features:**
- Real-time accessibility metrics
- Scan result visualization
- Issue tracking and remediation steps
- Responsive design with Tailwind CSS
- Charts and analytics with Recharts

**Development:**
```bash
cd apps/web-dashboard
pnpm dev
```

**Key Features:**
- 📊 Metrics dashboard with WCAG compliance scores
- 🔍 Detailed scan result analysis
- 📈 Trends and analytics over time
- 🎯 Issue categorization by severity and WCAG criteria

### Backend API (Node.js + Express)

**Location:** `apps/backend/`

RESTful API server with PostgreSQL database using Prisma ORM.

**Endpoints:**
- `POST /api/scan-results` - Create new scan result
- `GET /api/scan-results` - List scan results (with pagination/filtering)
- `GET /api/scan-results/:id` - Get specific scan result
- `GET /api/metrics` - Get accessibility metrics and analytics
- `GET /health` - Health check

**Development:**
```bash
cd apps/backend
pnpm dev
```

**Database Operations:**
```bash
# Generate Prisma client
pnpm db:generate

# Push schema changes
pnpm db:push

# Run migrations
pnpm db:migrate

# Seed database
pnpm db:seed

# Open Prisma Studio
pnpm db:studio
```

## 🧪 Automation Testing

### Appium + WebDriverIO Setup

**Location:** `tests/automation-tests/`

Automated accessibility testing using Appium for mobile apps and WebDriverIO for web applications.

**Features:**
- Cross-platform mobile testing (iOS/Android)
- Automated accessibility tree analysis
- Screenshot capture and issue detection
- Integration with backend API for result storage

**Setup:**
```bash
# Install Appium globally
npm install -g appium

# Install drivers
appium driver install uiautomator2  # Android
appium driver install xcuitest      # iOS

# Start Appium server
pnpm --filter automation-tests appium
```

**Running Tests:**
```bash
# Run all tests
pnpm test:automation

# Run platform-specific tests
pnpm --filter automation-tests test:android
pnpm --filter automation-tests test:ios
```

**Configuration:**
- `wdio.conf.ts` - WebDriverIO configuration
- `appium.config.json` - Appium server configuration
- `src/services/a11yScanner.ts` - Main scanning service

## 📦 Shared Packages

### @a11y-scanner/shared

Core types, utilities, and business logic shared across all applications.

**Key Exports:**
- `ScanResult`, `Issue`, `A11yScore` - Core data types
- `calculateA11yScore()` - Accessibility scoring algorithm
- `getSeverityColor()`, `getScoreColor()` - UI utilities
- Platform and severity enums

### @a11y-scanner/ui

Shared React components for consistent UI across web and mobile.

**Components:**
- `ScoreCard` - Accessibility score display
- `IssueCard` - Issue visualization component

### @a11y-scanner/config

Shared configuration for ESLint, Prettier, and TypeScript.

## 🐳 Docker Deployment

### Development with Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Deployment

```bash
# Build and start production containers
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

**Services:**
- `postgres` - PostgreSQL database
- `backend` - Node.js API server
- `web-dashboard` - Next.js web application
- `redis` - Redis cache (optional)

## 🔧 Development Workflow

### Adding New Features

1. **Create shared types** in `packages/shared/src/types.ts`
2. **Update database schema** in `apps/backend/prisma/schema.prisma`
3. **Add API endpoints** in `apps/backend/src/routes/`
4. **Update web dashboard** in `apps/web-dashboard/src/`
5. **Add mobile features** in `apps/mobile-scanner/src/`
6. **Write automation tests** in `tests/automation-tests/src/specs/`

### Code Quality

```bash
# Lint all packages
pnpm lint

# Format code
pnpm format

# Run tests
pnpm test

# Build all packages
pnpm build
```

### Turborepo Commands

```bash
# Run command in specific package
pnpm --filter @a11y-scanner/backend dev

# Run command in multiple packages
pnpm --filter "./apps/*" build

# Clear all build caches
pnpm clean
```

## 📊 Accessibility Scoring

The platform uses a comprehensive scoring algorithm based on WCAG 2.1 guidelines:

**Score Calculation:**
- **Critical Issues:** -10 points each
- **High Issues:** -7 points each  
- **Medium Issues:** -4 points each
- **Low Issues:** -2 points each
- **Info Issues:** -1 point each

**WCAG Categories:**
- **Perceivable:** Information must be presentable in ways users can perceive
- **Operable:** Interface components must be operable
- **Understandable:** Information and UI operation must be understandable
- **Robust:** Content must be robust enough for various assistive technologies

## 🔍 Supported Accessibility Checks

### Mobile (iOS/Android)
- Missing accessibility labels
- Touch target size validation
- Color contrast analysis
- Screen reader compatibility
- Keyboard navigation support

### Web
- ARIA attributes validation
- Semantic HTML structure
- Focus management
- Alternative text for images
- Form label associations

## 🚀 API Usage Examples

### Creating a Scan Result

```typescript
const scanResult = await fetch('/api/scan-results', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    appName: 'My App',
    screenName: 'Login',
    platform: 'ios',
    scanType: 'manual',
    screenshot: 'data:image/png;base64,...',
    accessibilityTree: { /* accessibility data */ },
    issues: [
      {
        title: 'Missing alt text',
        description: 'Image needs alternative text',
        severity: 'high',
        category: 'perceivable',
        wcagLevel: 'A',
        wcagCriteria: '1.1.1',
        element: {
          bounds: { x: 100, y: 200, width: 50, height: 50 }
        }
      }
    ],
    metadata: {
      deviceInfo: {
        model: 'iPhone 14',
        osVersion: '16.0',
        screenResolution: '390x844'
      },
      scanDuration: 2500,
      scannerVersion: '1.0.0'
    }
  })
});
```

### Fetching Metrics

```typescript
const metrics = await fetch('/api/metrics?days=30&platform=ios')
  .then(res => res.json());

console.log(`Average Score: ${metrics.data.averageScore}%`);
console.log(`Total Issues: ${metrics.data.totalIssues}`);
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run the test suite: `pnpm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 [Documentation](./docs/)
- 🐛 [Issue Tracker](https://github.com/your-org/a11y-scanner/issues)
- 💬 [Discussions](https://github.com/your-org/a11y-scanner/discussions)

## 🙏 Acknowledgments

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Appium](https://appium.io/) for mobile automation
- [WebDriverIO](https://webdriver.io/) for test automation
- [Turborepo](https://turbo.build/) for monorepo management