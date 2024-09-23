# Install dependencies in a separate build stage
FROM node:18-alpine AS deps
WORKDIR /app

# Add libc6-compat for compatibility and install dependencies
RUN apk add --no-cache libc6-compat
COPY package*.json ./
RUN npm install --force

# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Copy over node_modules from deps and the app code
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Copy Prisma schema for migrations and generation
COPY ./prisma ./prisma

# Run Prisma generate before building
RUN npx prisma generate

# Build the Next.js app
RUN npm run build

# Production image
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# Add user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy required build artifacts from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Use non-root user
USER nextjs

# Expose the port
EXPOSE 3000
ENV PORT 3000

# Start the application
CMD ["npm", "start"]
