-- Runs once, when the Postgres volume is first created.
-- To re-run: npm run db:down -- -v && npm run db:up
CREATE EXTENSION IF NOT EXISTS pgcrypto;
