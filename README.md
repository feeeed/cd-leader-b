# CD Leader Backend

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

> Масштабируемый и высокопроизводительный backend для управления лидерборда и данными пользователей.

## 📋 Описание проекта

CD Leader Backend — это современное серверное приложение, построенное на базе **NestJS** с использованием:

- **MongoDB** — основная база данных для хранения записей и профилей пользователей
- **Redis** — кэширование данных, управление сессиями и функции реального времени
- **Fastify** — высокопроизводительный веб-сервер
- **JWT & API Key** — безопасная аутентификация и авторизация
- **Docker & Docker Compose** — контейнеризация и оркестрация сервисов
- **Nginx + Cloudflare Tunnel** — обратный прокси и безопасное подключение

## 🚀 Особенности

- ✅ Полная типизация с TypeScript
- ✅ Модульная архитектура с NestJS
- ✅ Аутентификация через JWT и API ключи
- ✅ Поддержка CORS
- ✅ Интеграция с MongoDB и Redis
- ✅ E2E тестирование
- ✅ Docker для развертывания
- ✅ Cloudflare Tunnel для безопасного доступа

## 📁 Структура проекта

```
src/
├── auth/                 # Модуль аутентификации
│   ├── jwt.guard.ts
│   ├── api-key.guard.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── entities/            # Основные сущности
│   ├── Records/         # Работа с записями (рекордами)
│   │   ├── records.controller.ts
│   │   ├── records.service.ts
│   │   ├── records.schema.ts
│   │   └── records.module.ts
│   └── Users/           # Управление пользователями
│       ├── users.service.ts
│       └── users.module.ts
├── mongodb/             # Конфигурация MongoDB
├── redis/               # Конфигурация Redis
├── app.module.ts        # Главный модуль приложения
├── app.controller.ts    # Основной контроллер
├── app.service.ts       # Основной сервис
└── main.ts              # Точка входа приложения

nginx/                   # Конфигурация Nginx
docker-compose.yml       # Оркестрация контейнеров
Dockerfile               # Docker image
```

## 💻 Установка и запуск

### Требования
- Node.js >= 18
- pnpm (рекомендуется) или npm
- Docker & Docker Compose (для контейнерного режима)

### Локальная разработка

**1. Установка зависимостей:**
```bash
pnpm install
```

**2. Создание файла конфигурации:**
```bash
cp .env.example .env
```

Заполните следующие переменные окружения:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/cd-leader
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_key
API_KEY=your_api_key
```

**3. Запуск в режиме разработки:**
```bash
pnpm start:dev
```

Приложение будет доступно по адресу `http://localhost:3000`

### Запуск в режиме production

```bash
# Построение проекта
pnpm build

# Запуск production версии
pnpm start:prod
```

### Docker развертывание

**Запуск всех сервисов:**
```bash
docker-compose up -d
```

Это запустит:
- **API** (NestJS) — port 3000
- **MongoDB** — port 27017
- **Redis** — port 6379
- **Nginx** — port 80
- **Cloudflare Tunnel** — защищенное подключение

**Остановка сервисов:**
```bash
docker-compose down
```

## 🔧 Доступные команды

```bash
# Разработка
pnpm start              # Запуск в обычном режиме
pnpm start:dev          # Режим с автоперезагрузкой (watch mode)
pnpm start:debug        # Отладочный режим

# Сборка и production
pnpm build              # Построение проекта
pnpm start:prod         # Запуск скомпилированного приложения

# Тестирование
pnpm test               # Запуск unit тестов
pnpm test:watch         # Режим с отслеживанием изменений
pnpm test:cov           # Генерация отчета о покрытии
pnpm test:e2e           # End-to-End тесты
pnpm test:debug         # Отладка тестов

# Качество кода
pnpm format             # Форматирование кода (Prettier)
pnpm lint               # Проверка и исправление (ESLint)
```

## 🔐 Аутентификация

Проект поддерживает два механизма аутентификации:

### JWT (JSON Web Token)
Используется для аутентификации пользователей через токены

### API Key
Простая и эффективная аутентификация для служебных запросов

**Пример запроса с API Key:**
```bash
curl -H "X-API-Key: your_api_key" http://localhost:3000/api/records
```

## 🗄️ Базы данных

### MongoDB
Основная база данных для хранения:
- Профилей пользователей
- Рекордов и результатов
- Истории действий

### Redis
Кэширование и оптимизация:
- Кэш часто запрашиваемых данных
- Управление сессиями
- Функции реального времени

## 🌐 Сетевая архитектура

```
Cloudflare Tunnel
      ↓
   Nginx (Reverse Proxy)
      ↓
   NestJS API
    ↙     ↘
MongoDB   Redis
```

- **Nginx** — обратный прокси, балансировка нагрузки
- **Cloudflare Tunnel** — безопасное подключение через Cloudflare


## 📝 Логирование и отладка

### Режим отладки
```bash
pnpm start:debug
```

Приложение будет доступно для отладки на порту 9229

## 🔄 CI/CD

Проект поддерживает контейнеризацию для простого развертывания:

- **Dockerfile** — для сборки Docker image
- **docker-compose.yml** — для оркестрации всех сервисов

## 📦 Зависимости

### Основные
- **@nestjs/common** ^11.0.1 — Core NestJS framework
- **@nestjs/core** ^11.0.1 — NestJS core functionality
- **@nestjs/mongoose** ^11.0.4 — MongoDB integration
- **@nestjs/jwt** ^11.0.2 — JWT аутентификация
- **@nestjs/platform-fastify** ^11.1.11 — Fastify adapter
- **mongoose** ^9.1.1 — MongoDB ODM
- **ioredis** ^5.9.0 — Redis client
- **uuid** ^13.0.0 — UUID generation
- **rxjs** ^7.8.1 — Reactive Programming

### Development
- **TypeScript** — типизация
- **ESLint** — проверка кода
- **Prettier** — форматирование
- **Jest** — тестирование
- **@nestjs/testing** — NestJS тестирование

## 🚨 Возможные проблемы и решения

### Ошибка подключения к MongoDB
- Убедитесь, что MongoDB запущена
- Проверьте MONGODB_URI в .env файле
- Для Docker: убедитесь, что контейнер mongo работает

### Ошибка подключения к Redis
- Проверьте, что Redis запущена
- Проверьте REDIS_URL в .env файле
- Для Docker: убедитесь, что контейнер redis работает

### Порты уже используются
- Измените PORT в .env файле
- Или используйте: `docker-compose down` перед `docker-compose up`

## 📄 Лицензия

UNLICENSED

## 👥 Автор

CD Leader Backend Team
