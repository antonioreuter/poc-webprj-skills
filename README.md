# poc-webprj-skills

TypeScript + Express API backed by PostgreSQL running in Docker.

## Getting started

Requires Node 24+ and Docker.

```bash
npm install
cp .env.example .env
npm run db:up
npm run dev
curl localhost:3000/health
```

## Scripts

| Script                      | Purpose                                  |
| --------------------------- | ---------------------------------------- |
| `npm run dev`               | Run with hot reload                      |
| `npm run build` / `start`   | Compile to `dist/` and run               |
| `npm test`                  | Unit/HTTP tests (Vitest)                 |
| `npm run test:coverage`     | Tests with coverage report               |
| `npm run lint` / `format`   | ESLint / Prettier                        |
| `npm run check`             | Typecheck, lint, format check, and tests |
| `npm run db:up` / `db:down` | Start / stop Postgres                    |
