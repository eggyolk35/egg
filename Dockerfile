# ─── Stage 1: 安装生产依赖（含原生模块编译）────────────────────────────────
FROM node:22-alpine AS prod-deps
# better-sqlite3 是原生模块，需要编译工具
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# ─── Stage 2: 构建 Next.js ──────────────────────────────────────────────────
FROM node:22-alpine AS builder
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ─── Stage 3: 最终运行镜像 ──────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# 以非 root 用户运行，更安全
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs  -G nodejs

# 生产依赖（含 better-sqlite3 编译好的原生二进制）
COPY --from=prod-deps /app/node_modules ./node_modules

# Next.js 构建产物
COPY --from=builder --chown=nextjs:nodejs /app/.next        ./.next
COPY --from=builder                        /app/public       ./public
COPY --from=builder                        /app/package.json ./package.json
COPY --from=builder                        /app/next.config.ts ./next.config.ts

# SQLite 数据目录（生产环境挂载外部卷以持久化）
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

USER nextjs
EXPOSE 3000

CMD ["node_modules/.bin/next", "start", "-H", "0.0.0.0"]
