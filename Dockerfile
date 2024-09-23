FROM node:18-alpine AS deps
WORKDIR /app

RUN apk add --no-cache libc6-compat
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build
RUN npm install --force
RUN npx prisma init --datasource-provider postgresql
RUN npx prisma generate

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy Prisma files
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000
ENV PORT 3000

# Run Prisma generate as part of startup
CMD npx prisma generate && npm start