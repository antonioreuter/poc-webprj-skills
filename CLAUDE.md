# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

TypeScript (strict, ESM, `NodeNext`) on Node 24, Express 5, PostgreSQL 17 via `pg` in Docker, Pino logging, Zod env validation, Vitest + Supertest, ESLint (typescript-eslint strict type-checked) + Prettier.

## Commands

```bash
npm run db:up            # start Postgres (docker compose); db:down / db:logs
npm run dev              # tsx watch, loads .env (copy from .env.example)
npm run build && npm start
npm run check            # typecheck + lint + format:check + tests — run before finishing work
npm test                 # vitest run
npx vitest run tests/health.test.ts      # single file
npx vitest run -t "returns 503"          # single test by name
npm run lint:fix && npm run format
```

## Architecture

- `src/server.ts` is the only entry point with side effects (listen, signal handling, pool shutdown). `src/app.ts` exports `createApp(deps)` and never opens connections, so tests import it directly.
- **Dependency injection over module mocking:** routers are factories taking their dependencies (e.g. `healthRouter({ checkDatabase })`). `server.ts` wires the real implementations from `src/db/`; tests pass fakes. Follow this pattern for new routes/services instead of `vi.mock`.
- `src/config/env.ts` parses `process.env` with Zod at import time; add every new env var to the schema and to `.env.example`. `tests/setup.ts` sets test env values before any module loads.
- Logging: use `logger` from `src/lib/logger.ts` outside requests and `req.log` inside handlers (request-scoped via pino-http). `no-console` is enforced. Log errors as `{ err }` so Pino serializes them. Pretty output only when `NODE_ENV=development`.
- Errors: throw/`next()` an `HttpError(status, message)` from `src/middleware/error-handler.ts`; anything else becomes a 500 with a generic message. Express 5 forwards rejected async handlers automatically.
- Database: one shared `pg.Pool` in `src/db/pool.ts`. SQL in `db/init/*.sql` runs only when the Docker volume is first created (reset with `npm run db:down -- -v`). There is no migration tool yet.

## Conventions

- ESM with `verbatimModuleSyntax`: relative imports need the `.js` extension and type-only imports must use `import type`.
- `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess` are on; indexed access returns `T | undefined`.
- Unit tests sit next to source as `*.test.ts`; HTTP-level tests go in `tests/`.
