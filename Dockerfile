# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder

RUN corepack enable

WORKDIR /app

# Копируем манифесты
COPY package.json pnpm-lock.yaml ./

# Ставим ВСЕ зависимости (включая dev)
RUN pnpm install --frozen-lockfile

# Копируем исходники
COPY . .

# Собираем NestJS
RUN pnpm build


# ---------- PRODUCTION STAGE ----------
FROM node:20-alpine

RUN corepack enable

WORKDIR /app

# Копируем манифесты снова
COPY package.json pnpm-lock.yaml ./

# Ставим ТОЛЬКО prod-зависимости
RUN pnpm install --frozen-lockfile --prod

# Забираем только готовый build
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
