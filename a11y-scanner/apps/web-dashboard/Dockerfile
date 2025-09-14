# Multi-stage build for Next.js web dashboard
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/web-dashboard/package.json ./apps/web-dashboard/
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/
COPY packages/config/package.json ./packages/config/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/web-dashboard ./apps/web-dashboard
COPY packages ./packages

# Build shared packages first
RUN pnpm --filter @a11y-scanner/shared build
RUN pnpm --filter @a11y-scanner/ui build
RUN pnpm --filter @a11y-scanner/config build

# Build web dashboard
RUN pnpm --filter @a11y-scanner/web-dashboard build

# Production stage
FROM node:18-alpine AS production

# Install pnpm
RUN npm install -g pnpm

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY --chown=nextjs:nodejs package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY --chown=nextjs:nodejs apps/web-dashboard/package.json ./apps/web-dashboard/
COPY --chown=nextjs:nodejs packages/shared/package.json ./packages/shared/
COPY --chown=nextjs:nodejs packages/ui/package.json ./packages/ui/
COPY --chown=nextjs:nodejs packages/config/package.json ./packages/config/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built application
COPY --from=base --chown=nextjs:nodejs /app/apps/web-dashboard/.next/standalone ./
COPY --from=base --chown=nextjs:nodejs /app/apps/web-dashboard/.next/static ./apps/web-dashboard/.next/static
COPY --from=base --chown=nextjs:nodejs /app/packages ./packages

# Copy public directory if it exists
COPY --from=base --chown=nextjs:nodejs /app/apps/web-dashboard/public ./apps/web-dashboard/public

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set environment variables
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the application
CMD ["node", "apps/web-dashboard/server.js"]