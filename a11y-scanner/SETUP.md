# Setup Guide - A11y Scanner

This guide will walk you through setting up the A11y Scanner platform from scratch.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

- **Node.js 18+** - [Download](https://nodejs.org/)
- **pnpm 8+** - Install with `npm install -g pnpm`
- **Git** - [Download](https://git-scm.com/)

### Optional (for full functionality)

- **Docker & Docker Compose** - [Download](https://www.docker.com/)
- **PostgreSQL 15+** - [Download](https://www.postgresql.org/) (if not using Docker)
- **Redis** - [Download](https://redis.io/) (for caching)

### Mobile Development (Optional)

- **React Native CLI** - `npm install -g @react-native-community/cli`
- **Android Studio** - [Download](https://developer.android.com/studio)
- **Xcode** (macOS only) - [Download](https://developer.apple.com/xcode/)

### Automation Testing (Optional)

- **Appium** - `npm install -g appium`
- **Java 8+** - [Download](https://www.oracle.com/java/technologies/downloads/)

## 🚀 Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd a11y-scanner
```

### 2. Install Dependencies

```bash
# Install all dependencies using pnpm workspaces
pnpm install
```

This will install dependencies for all packages in the monorepo.

### 3. Environment Setup

#### Backend Environment

```bash
# Copy the example environment file
cp apps/backend/.env.example apps/backend/.env
```

Edit `apps/backend/.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/a11y_scanner?schema=public"

# Server
PORT=4000
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:3000"

# File upload limits
MAX_FILE_SIZE=10485760  # 10MB in bytes
```

#### Web Dashboard Environment (Optional)

```bash
# Copy the example environment file
cp apps/web-dashboard/.env.example apps/web-dashboard/.env.local
```

Edit `apps/web-dashboard/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 4. Database Setup

#### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL with Docker Compose
pnpm docker:up

# This will start:
# - PostgreSQL on port 5432
# - Redis on port 6379 (optional)
```

#### Option B: Local PostgreSQL

If you have PostgreSQL installed locally:

```bash
# Create database
createdb a11y_scanner

# Update DATABASE_URL in apps/backend/.env to match your local setup
```

### 5. Database Migration and Seeding

```bash
# Generate Prisma client
pnpm db:generate

# Push database schema
pnpm db:push

# Seed database with sample data
pnpm --filter backend db:seed
```

### 6. Build Shared Packages

```bash
# Build shared packages (required before starting apps)
pnpm --filter @a11y-scanner/shared build
pnpm --filter @a11y-scanner/ui build
pnpm --filter @a11y-scanner/config build
```

## 🏃‍♂️ Running the Applications

### Development Mode

Start all applications in development mode:

```bash
pnpm dev
```

This will start:
- **Backend API** on http://localhost:4000
- **Web Dashboard** on http://localhost:3000

### Individual Applications

You can also start applications individually:

```bash
# Backend only
pnpm --filter @a11y-scanner/backend dev

# Web dashboard only
pnpm --filter @a11y-scanner/web-dashboard dev

# Mobile scanner (React Native)
cd apps/mobile-scanner
npx react-native start
```

## 📱 Mobile App Setup

### iOS Setup

1. **Install iOS dependencies:**
   ```bash
   cd apps/mobile-scanner/ios
   pod install
   cd ..
   ```

2. **Run on iOS Simulator:**
   ```bash
   npx react-native run-ios
   ```

3. **Run on iOS Device:**
   ```bash
   npx react-native run-ios --device "Your Device Name"
   ```

### Android Setup

1. **Start Android Emulator** (or connect physical device)

2. **Run on Android:**
   ```bash
   cd apps/mobile-scanner
   npx react-native run-android
   ```

### Troubleshooting Mobile Setup

- **Metro bundler issues:** `npx react-native start --reset-cache`
- **iOS build issues:** Clean build folder in Xcode
- **Android build issues:** `cd android && ./gradlew clean`

## 🧪 Automation Testing Setup

### 1. Install Appium

```bash
# Install Appium globally
npm install -g appium

# Install drivers
appium driver install uiautomator2  # Android
appium driver install xcuitest      # iOS (macOS only)
```

### 2. Start Appium Server

```bash
# Start Appium server
pnpm --filter automation-tests appium

# Or manually
appium server --config tests/automation-tests/appium.config.json
```

### 3. Run Automation Tests

```bash
# Run all automation tests
pnpm test:automation

# Run platform-specific tests
pnpm --filter automation-tests test:android
pnpm --filter automation-tests test:ios
```

## 🔧 Development Tools

### Database Management

```bash
# Open Prisma Studio (database GUI)
pnpm --filter backend db:studio

# Reset database
pnpm --filter backend db:reset

# Create new migration
pnpm --filter backend db:migrate
```

### Code Quality

```bash
# Lint all packages
pnpm lint

# Format code
pnpm format

# Run tests
pnpm test

# Type checking
pnpm type-check
```

### Build and Clean

```bash
# Build all packages
pnpm build

# Clean all build artifacts
pnpm clean

# Clean and reinstall dependencies
pnpm clean && pnpm install
```

## 🐳 Docker Development

### Full Stack with Docker

```bash
# Start all services with Docker
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f web-dashboard

# Stop all services
docker-compose down

# Rebuild containers
docker-compose up -d --build
```

### Individual Services

```bash
# Start only database
docker-compose up -d postgres redis

# Start backend and database
docker-compose up -d postgres backend
```

## 🔍 Verification

### 1. Check Backend Health

```bash
curl http://localhost:4000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2023-12-07T10:30:00.000Z",
  "version": "1.0.0"
}
```

### 2. Check Web Dashboard

Open http://localhost:3000 in your browser. You should see the dashboard with sample data.

### 3. Check Database Connection

```bash
# Using Prisma Studio
pnpm --filter backend db:studio

# Or check via API
curl http://localhost:4000/api/scan-results
```

### 4. Test Mobile App

If you have the mobile app running, you should be able to:
- Navigate between tabs
- View the dashboard with metrics
- Access the scan screen

## 🚨 Common Issues

### Port Conflicts

If you get port conflicts:

```bash
# Check what's using the port
lsof -i :4000  # Backend
lsof -i :3000  # Web dashboard
lsof -i :5432  # PostgreSQL

# Kill processes if needed
kill -9 <PID>
```

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Build Issues

```bash
# Clear all caches and rebuild
pnpm clean
rm -rf node_modules
pnpm install
pnpm build
```

### Mobile App Issues

```bash
# Reset Metro cache
npx react-native start --reset-cache

# Clean builds
cd apps/mobile-scanner
# iOS
cd ios && xcodebuild clean && cd ..
# Android
cd android && ./gradlew clean && cd ..
```

## 📚 Next Steps

Once you have everything running:

1. **Explore the Web Dashboard** - View sample scan results and metrics
2. **Try the Mobile App** - Perform a manual accessibility scan
3. **Run Automation Tests** - Execute automated accessibility tests
4. **Read the API Documentation** - Understand the backend endpoints
5. **Customize Configuration** - Adapt the platform to your needs

## 🆘 Getting Help

If you encounter issues:

1. Check the [troubleshooting section](#-common-issues) above
2. Review the logs: `docker-compose logs -f` or individual app logs
3. Check the [main README](./README.md) for additional information
4. Open an issue in the repository

## 🎉 Success!

If you've made it this far, you should have:

- ✅ Backend API running on http://localhost:4000
- ✅ Web Dashboard running on http://localhost:3000
- ✅ Database with sample data
- ✅ Mobile app (if set up)
- ✅ Automation tests (if set up)

You're ready to start using the A11y Scanner platform!