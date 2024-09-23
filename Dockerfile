# Install dependencies only when needed
FROM node:18-alpine AS deps
WORKDIR /app

# Install Prisma CLI and required system dependencies
RUN apk add --no-cache libc6-compat openssl
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install --force

# Rebuild the Prisma client
COPY prisma ./prisma
RUN npx prisma generate

# Build the application
FROM node:18-alpine AS builder
WORKDIR /app

# Copy the necessary files for the build
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the Next.js application
RUN npm run build

# Prepare the final running image
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the built files and dependencies from the builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Use the non-root user
USER nextjs

# Expose the required port
EXPOSE 3000
ENV PORT 3000

# Start the application
CMD ["npm", "start"]
