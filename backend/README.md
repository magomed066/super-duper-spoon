# Backend

NestJS backend scaffold with layered architecture:

- `src/core` app-wide infrastructure
- `src/common` shared utilities
- `src/integrations` service clients and adapters
- `src/modules` domain modules
- `src/events` domain events
- `src/commands` CLI and cron entrypoints

## Run

1. Copy env config: `cp .env.example .env`
2. Install dependencies: `npm install`
3. Configure PostgreSQL in `.env` if your local credentials differ
4. Start in dev mode: `npm run start:dev`

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/users`
- `GET /api/users`
- `GET /api/users/:id`
- `PATCH /api/users/:id`
