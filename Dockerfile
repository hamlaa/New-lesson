# syntax=docker/dockerfile:1.7
# ─────────────────────────────────────────────────────────────────────
#  NEW LESSON — production image (Next.js standalone, ~ small & fast)
#  Build:  docker compose build      Run: docker compose up -d
# ─────────────────────────────────────────────────────────────────────
ARG NODE_IMAGE=node:22-alpine

# 1) Install dependencies (cached unless package*.json changes)
FROM ${NODE_IMAGE} AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# 2) Build the site (all pages are pre-rendered to static HTML here)
FROM ${NODE_IMAGE} AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Public URL & SEO settings are baked into sitemap.xml, robots.txt,
# canonical links and Open Graph tags at build time.
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
ARG NEXT_PUBLIC_NOINDEX=false
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL} \
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=${NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION} \
    NEXT_PUBLIC_NOINDEX=${NEXT_PUBLIC_NOINDEX} \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 3) Minimal runtime: only the standalone server + static assets
FROM ${NODE_IMAGE} AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Writable cache for optimised images (mounted as a volume in compose)
RUN mkdir -p .next/cache && chown -R nextjs:nodejs .next/cache
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/robots.txt > /dev/null || exit 1
CMD ["node", "server.js"]
