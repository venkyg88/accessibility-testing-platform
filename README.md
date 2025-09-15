┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           A11Y SCANNER PLATFORM ARCHITECTURE                            │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                  CLIENT LAYER                                           │
├─────────────────────────────────┬───────────────────────────────────────────────────────┤
│                                 │                                                       │
│  ┌─────────────────────────────┐ │  ┌─────────────────────────────────────────────────┐ │
│  │      WEB DASHBOARD          │ │  │         MOBILE SCANNER                          │ │
│  │     (Next.js 14)            │ │  │       (React Native)                            │ │
│  │                             │ │  │                                                 │ │
│  │  • Metrics Overview         │ │  │  • Manual Accessibility Scans                  │ │
│  │  • Scan Results Display     │ │  │  • Screenshot Capture                          │ │
│  │  • Charts & Analytics       │ │  │  • Accessibility Tree Extraction               │ │
│  │  • Issue Management         │ │  │  • Native Platform Integration                 │ │
│  │                             │ │  │    - Android: AccessibilityService             │ │
│  │  Port: 3000                 │ │  │    - iOS: UIAccessibility                      │ │
│  │  Tech: Tailwind, Recharts   │ │  │                                                 │ │
│  └─────────────────────────────┘ │  └─────────────────────────────────────────────────┘ │
│                │                 │                               │                      │
└────────────────┼─────────────────┴───────────────────────────────┼──────────────────────┘
                 │                                                 │
                 │ HTTP/REST API                                   │ HTTP/REST API
                 │                                                 │
┌────────────────▼─────────────────────────────────────────────────▼──────────────────────┐
│                                 API LAYER                                               │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                           BACKEND API                                           │   │
│  │                      (Node.js + Express)                                       │   │
│  │                                                                                 │   │
│  │  API Endpoints:                          Middleware:                           │   │
│  │  • POST /api/scan-results               • Error Handling                      │   │
│  │  • GET  /api/scan-results               • Validation (Zod)                    │   │
│  │  • GET  /api/scan-results/:id           • CORS                                │   │
│  │  • GET  /api/metrics                    • Request Logging                     │   │
│  │  • GET  /api/metrics/apps               • Prisma Middleware                   │   │
│  │  • GET  /health                                                               │   │
│  │                                                                                 │   │
│  │  Port: 4000                                                                    │   │
│  │  Tech: TypeScript, Prisma ORM, Zod                                            │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                        │                                                │
└────────────────────────────────────────┼────────────────────────────────────────────────┘
                                         │
                                         │ Database Queries
                                         │
┌────────────────────────────────────────▼────────────────────────────────────────────────┐
│                               DATABASE LAYER                                            │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌─────────────────────────┐    ┌─────────────────────────────────────────────────────┐ │
│  │       REDIS             │    │              POSTGRESQL                             │ │
│  │    (Caching)            │    │            (Primary Database)                      │ │
│  │                         │    │                                                     │ │
│  │  • Session Storage      │    │  Tables:                                            │ │
│  │  • API Response Cache   │    │  ┌─────────────────────────────────────────────┐   │ │
│  │  • Rate Limiting        │    │  │ scan_results                                │   │ │
│  │                         │    │  │ • id, appName, appVersion, platform        │   │ │
│  │  Port: 6379             │    │  │ • scanType, screenName, screenshot         │   │ │
│  │  Tech: Redis 7          │    │  │ • accessibilityTree, metadata              │   │ │
│  └─────────────────────────┘    │  │ • createdAt, updatedAt                     │   │ │
│                                 │  └─────────────────────────────────────────────┘   │ │
│                                 │                          │                          │ │
│                                 │  ┌─────────────────────────────────────────────┐   │ │
│                                 │  │ issues                                      │   │ │
│                                 │  │ • id, title, description, severity         │   │ │
│                                 │  │ • category, wcagLevel, wcagCriteria        │   │ │
│                                 │  │ • element, screenshot, scanResultId        │   │ │
│                                 │  └─────────────────────────────────────────────┘   │ │
│                                 │                          │                          │ │
│                                 │  ┌─────────────────────────────────────────────┐   │ │
│                                 │  │ a11y_scores                                 │   │ │
│                                 │  │ • id, overall, perceivable, operable       │   │ │
│                                 │  │ • understandable, robust                   │   │ │
│                                 │  │ • totalIssues, criticalIssues, etc.       │   │ │
│                                 │  │ • scanResultId                             │   │ │
│                                 │  └─────────────────────────────────────────────┘   │ │
│                                 │                                                     │ │
│                                 │  Port: 5432                                         │ │
│                                 │  Tech: PostgreSQL 15                                │ │
│                                 └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              TESTING LAYER                                              │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                        AUTOMATION TESTS                                         │   │
│  │                   (Appium + WebDriverIO)                                       │   │
│  │                                                                                 │   │
│  │  Test Flows:                           Configuration:                          │   │
│  │  • Launch Target Apps                  • wdio.conf.ts                         │   │
│  │  • Navigate Through Screens            • appium.config.json                   │   │
│  │  • Extract Accessibility Trees         • Device Capabilities                  │   │ │
│  │  • Capture Screenshots                 • Test Specifications                  │   │
│  │  • Send Results to Backend API                                                │   │
│  │                                                                                 │   │
│  │  Platforms: Android, iOS                                                       │   │
│  │  Tech: TypeScript, Jest, Appium                                               │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                        │                                                │
└────────────────────────────────────────┼────────────────────────────────────────────────┘
                                         │
                                         │ HTTP/REST API
                                         │
                                    ┌────▼────┐
                                    │ Backend │
                                    │   API   │
                                    └─────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                            SHARED PACKAGES                                              │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────────────────┐ │
│  │   @shared       │  │      @ui        │  │              @config                   │ │
│  │                 │  │                 │  │                                         │ │
│  │ • Types         │  │ • ScoreCard     │  │ • ESLint Configuration                  │ │
│  │ • Interfaces    │  │ • IssueCard     │  │ • Prettier Configuration                │ │
│  │ • Utilities     │  │ • Shared UI     │  │ • TypeScript Base Config                │ │
│  │ • Validation    │  │   Components    │  │ • Build Tools Setup                     │ │
│  │ • Constants     │  │                 │  │                                         │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────────────────┘ │
│           ▲                    ▲                              ▲                        │
└───────────┼────────────────────┼──────────────────────────────┼────────────────────────┘
            │                    │                              │
            └────────────────────┼──────────────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │    ALL APPLICATIONS     │
                    │   (Web, Mobile, API,    │
                    │      Tests)             │
                    └─────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                          INFRASTRUCTURE LAYER                                           │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                            DOCKER CONTAINERS                                    │   │
│  │                                                                                 │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                │   │
│  │  │a11y-scanner-│ │a11y-scanner-│ │a11y-scanner-│ │a11y-scanner-│                │   │
│  │  │   web       │ │  backend    │ │     db      │ │   redis     │                │   │
│  │  │             │ │             │ │             │ │             │                │   │
│  │  │ Next.js     │ │ Node.js     │ │ PostgreSQL  │ │   Redis     │                │   │
│  │  │ :3000       │ │ :4000       │ │ :5432       │ │ :6379       │                │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘                │   │
│  │                                                                                 │   │
│  │  Network: a11y-scanner-network                                                  │   │
│  │  Orchestration: docker-compose.yml                                              │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                        │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                          MONOREPO STRUCTURE                                     │   │
│  │                                                                                 │   │
│  │  • Turborepo (Build System)                                                     │   │
│  │  • pnpm Workspaces (Package Management)                                         │   │
│  │  • Shared Dependencies & Build Pipeline                                         │   │
│  │  • Cross-package Type Safety                                                    │   │
│  │  • Unified Development Workflow                                                 │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW SUMMARY                                          │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  1. MANUAL SCAN FLOW:                                                                   │
│     Mobile App → Capture Screen + A11y Tree → POST /api/scan-results → Database         │
│                                                                                         │
│  2. AUTOMATED SCAN FLOW:                                                                │
│     Appium Tests → Target App → Extract Data → POST /api/scan-results → Database        │
│                                                                                         │
│  3. DASHBOARD VIEW FLOW:                                                                │
│     Web Dashboard → GET /api/metrics & /api/scan-results → Database → Display           │  
│                                                                                         │
│  4. ANALYTICS FLOW:                                                                     │
│     Backend → Aggregate Queries → PostgreSQL → Metrics API → Charts & Reports           │ 
└─────────────────────────────────────────────────────────────────────────────────────────┘
