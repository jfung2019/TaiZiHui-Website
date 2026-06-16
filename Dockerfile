# -------- 1) Dependencies stage --------
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies from lock file
COPY package.json package-lock.json ./
RUN npm ci

# -------- 2) Build stage --------
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time env (NEXT_PUBLIC_* is embedded into client bundle)
# Intentionally no hard-coded backend URL defaults in a public repo.
ARG NEXT_PUBLIC_API_MODE
ARG NEXT_PUBLIC_API_BASE_URL_PRODUCTION
ARG NEXT_PUBLIC_API_FACEBOOK_POSTS_PATH
ARG NEXT_PUBLIC_API_USE_SAME_ORIGIN_PROXY

ENV NEXT_PUBLIC_API_MODE=${NEXT_PUBLIC_API_MODE}
ENV NEXT_PUBLIC_API_BASE_URL_PRODUCTION=${NEXT_PUBLIC_API_BASE_URL_PRODUCTION}
ENV NEXT_PUBLIC_API_FACEBOOK_POSTS_PATH=${NEXT_PUBLIC_API_FACEBOOK_POSTS_PATH}
ENV NEXT_PUBLIC_API_USE_SAME_ORIGIN_PROXY=${NEXT_PUBLIC_API_USE_SAME_ORIGIN_PROXY}

RUN npm run build

# -------- 3) Runtime stage --------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy only what runtime needs
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000
CMD ["npm", "run", "start", "--", "-p", "3000"]