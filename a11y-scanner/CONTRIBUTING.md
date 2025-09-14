# Contributing to A11y Scanner

Thank you for your interest in contributing to A11y Scanner! This document provides guidelines and information for contributors.

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our code of conduct:

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## 🚀 Getting Started

### Prerequisites

Before contributing, make sure you have:

- Node.js 18+
- pnpm 8+
- Git
- Docker (optional but recommended)

### Development Setup

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/your-username/a11y-scanner.git
   cd a11y-scanner
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up the development environment:**
   ```bash
   # Start database
   pnpm docker:up
   
   # Set up backend
   cp apps/backend/.env.example apps/backend/.env
   pnpm db:generate
   pnpm db:push
   pnpm --filter backend db:seed
   
   # Start development servers
   pnpm dev
   ```

## 📝 How to Contribute

### Reporting Issues

Before creating an issue, please:

1. **Search existing issues** to avoid duplicates
2. **Use the issue templates** when available
3. **Provide detailed information:**
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version, etc.)
   - Screenshots or logs if applicable

### Suggesting Features

For feature requests:

1. **Check existing feature requests** first
2. **Describe the problem** you're trying to solve
3. **Explain your proposed solution**
4. **Consider the impact** on existing functionality
5. **Be open to discussion** and alternative approaches

### Contributing Code

#### 1. Choose an Issue

- Look for issues labeled `good first issue` for beginners
- Check if the issue is already assigned
- Comment on the issue to express interest

#### 2. Create a Branch

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-description
```

#### 3. Make Changes

Follow our coding standards:

- **TypeScript** for all new code
- **ESLint** and **Prettier** for code formatting
- **Conventional Commits** for commit messages
- **Tests** for new functionality

#### 4. Test Your Changes

```bash
# Run linting
pnpm lint

# Run tests
pnpm test

# Build all packages
pnpm build

# Test specific functionality
pnpm --filter @a11y-scanner/backend test
pnpm --filter @a11y-scanner/web-dashboard build
```

#### 5. Commit Your Changes

Use conventional commit format:

```bash
# Examples
git commit -m "feat(backend): add new accessibility check for color contrast"
git commit -m "fix(mobile): resolve crash when taking screenshots"
git commit -m "docs: update API documentation for scan endpoints"
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

#### 6. Push and Create Pull Request

```bash
git push origin your-branch-name
```

Then create a pull request on GitHub.

## 📋 Pull Request Guidelines

### Before Submitting

- [ ] Code follows project conventions
- [ ] Tests pass locally
- [ ] Documentation is updated if needed
- [ ] Commit messages follow conventional format
- [ ] Branch is up to date with main

### Pull Request Template

When creating a PR, include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass
- [ ] Manual testing completed
- [ ] Added new tests for new functionality

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated checks** must pass (CI/CD)
2. **Code review** by maintainers
3. **Testing** in development environment
4. **Approval** and merge

## 🏗️ Project Structure

Understanding the codebase:

```
a11y-scanner/
├── apps/
│   ├── backend/           # Node.js API server
│   ├── web-dashboard/     # Next.js web app
│   └── mobile-scanner/    # React Native app
├── tests/
│   └── automation-tests/  # Appium tests
├── packages/
│   ├── shared/           # Shared utilities and types
│   ├── ui/              # Shared UI components
│   └── config/          # Shared configuration
└── docs/                # Documentation
```

### Key Technologies

- **Monorepo:** Turborepo + pnpm workspaces
- **Backend:** Node.js, Express, Prisma, PostgreSQL
- **Frontend:** Next.js, React, Tailwind CSS
- **Mobile:** React Native
- **Testing:** Appium, WebDriverIO, Jest
- **DevOps:** Docker, Docker Compose

## 🧪 Testing Guidelines

### Unit Tests

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter @a11y-scanner/shared test

# Run tests in watch mode
pnpm --filter @a11y-scanner/backend test --watch
```

### Integration Tests

```bash
# Run automation tests
pnpm test:automation

# Run specific test suites
pnpm --filter automation-tests test:android
pnpm --filter automation-tests test:ios
```

### Writing Tests

- **Unit tests** for utilities and business logic
- **Integration tests** for API endpoints
- **E2E tests** for critical user flows
- **Accessibility tests** for UI components

Example test structure:

```typescript
describe('calculateA11yScore', () => {
  it('should calculate correct score for no issues', () => {
    const score = calculateA11yScore([]);
    expect(score.overall).toBe(100);
  });

  it('should penalize critical issues heavily', () => {
    const issues = [createCriticalIssue()];
    const score = calculateA11yScore(issues);
    expect(score.overall).toBeLessThan(90);
  });
});
```

## 📚 Documentation

### Code Documentation

- **JSDoc comments** for public APIs
- **README files** for each package
- **Inline comments** for complex logic
- **Type definitions** with descriptions

### API Documentation

When adding new endpoints:

1. Update OpenAPI/Swagger specs
2. Add examples to README
3. Update Postman collection
4. Test with different scenarios

### User Documentation

- Update user guides for new features
- Add screenshots for UI changes
- Update setup instructions if needed
- Consider creating video tutorials

## 🎨 Design Guidelines

### UI/UX Principles

- **Accessibility first** - Follow WCAG 2.1 AA guidelines
- **Responsive design** - Mobile-first approach
- **Consistent styling** - Use design system components
- **User feedback** - Loading states, error messages, success indicators

### Color and Typography

- Use semantic color tokens
- Ensure sufficient color contrast
- Follow established typography scale
- Test with screen readers

### Component Development

```typescript
// Example component structure
interface ComponentProps {
  /** Description of the prop */
  title: string;
  /** Optional description */
  subtitle?: string;
  /** Callback function */
  onAction: (data: ActionData) => void;
}

export const Component: React.FC<ComponentProps> = ({
  title,
  subtitle,
  onAction
}) => {
  // Component implementation
};
```

## 🔧 Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `fix/*` - Bug fixes
- `hotfix/*` - Critical production fixes

### Release Process

1. **Feature freeze** on develop branch
2. **Testing** and bug fixes
3. **Version bump** and changelog update
4. **Merge to main** and tag release
5. **Deploy** to production
6. **Post-release** monitoring

### Continuous Integration

Our CI pipeline:

1. **Lint and format** check
2. **Type checking**
3. **Unit tests**
4. **Build verification**
5. **Integration tests**
6. **Security scanning**

## 🐛 Debugging

### Common Issues

**Build failures:**
```bash
# Clear caches and rebuild
pnpm clean
rm -rf node_modules
pnpm install
pnpm build
```

**Database issues:**
```bash
# Reset database
pnpm --filter backend db:reset
pnpm --filter backend db:seed
```

**Mobile app issues:**
```bash
# Reset Metro cache
npx react-native start --reset-cache
```

### Debugging Tools

- **VS Code debugger** for Node.js
- **React DevTools** for frontend
- **Flipper** for React Native
- **Prisma Studio** for database
- **Docker logs** for containerized services

## 🏆 Recognition

Contributors are recognized through:

- **Contributors list** in README
- **Release notes** mentions
- **GitHub achievements**
- **Community highlights**

## 📞 Getting Help

If you need help:

1. **Check documentation** first
2. **Search existing issues**
3. **Ask in discussions**
4. **Join our community chat**
5. **Reach out to maintainers**

## 🙏 Thank You

Every contribution matters, whether it's:

- Reporting bugs
- Suggesting features
- Writing code
- Improving documentation
- Helping other users
- Spreading the word

Thank you for helping make accessibility testing more accessible! 🎉