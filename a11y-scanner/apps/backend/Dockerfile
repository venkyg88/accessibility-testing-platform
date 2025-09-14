# Multi-stage build for Node.js backend
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/
COPY packages/config/package.json ./packages/config/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/backend ./apps/backend
COPY packages ./packages

# Build shared packages first
RUN pnpm --filter @a11y-scanner/shared build
RUN pnpm --filter @a11y-scanner/config build

# Generate Prisma client
RUN cd apps/backend && pnpm db:generate

# Build backend
RUN pnpm --filter @a11y-scanner/backend build

# Production stage
FROM node:18-alpine AS production

# Install pnpm
RUN npm install -g pnpm

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S backend -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY --chown=backend:nodejs package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY --chown=backend:nodejs apps/backend/package.json ./apps/backend/
COPY --chown=backend:nodejs packages/shared/package.json ./packages/shared/
COPY --chown=backend:nodejs packages/config/package.json ./packages/config/

# Install all dependencies (including dev dependencies for Prisma CLI)
RUN pnpm install --frozen-lockfile

# Copy built application
COPY --from=base --chown=backend:nodejs /app/apps/backend/dist ./apps/backend/dist
COPY --from=base --chown=backend:nodejs /app/apps/backend/prisma ./apps/backend/prisma
COPY --from=base --chown=backend:nodejs /app/packages ./packages

# Generate Prisma client in production
RUN cd apps/backend && pnpm db:generate

# Create uploads directory
RUN mkdir -p uploads && chown backend:nodejs uploads

# Switch to non-root user
USER backend

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "apps/backend/dist/index.js"]