# ─────────────────────────────────────────────────────────────
# VDown Video — Dockerfile
# Single /data mount:
#   /app/data/sqlite  → SQLite database
#   /app/data/cache   → Download cache (videos, transcoded outputs)
#   /app/data/cms     → CMS image uploads
# ─────────────────────────────────────────────────────────────

# ── Stage 1: Build ────────────────────────────────────────────
FROM node:20-bookworm AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY astro.config.mjs tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# ── Stage 2: Runtime ──────────────────────────────────────────
FROM node:20-bookworm-slim AS runtime

# System deps: ffmpeg + python3 (for yt-dlp)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      ffmpeg \
      python3 \
      python3-pip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# yt-dlp + gallery-dl
RUN pip3 install --no-cache-dir yt-dlp gallery-dl

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Mount points (created so the container can start even if volumes are empty)
RUN mkdir -p /app/data/sqlite /app/data/cache /app/data/cms

# Env
ENV PORT=4321
ENV NODE_ENV=production

EXPOSE ${PORT}

# Start the Astro standalone server
CMD ["node", "dist/server/entry.mjs"]
