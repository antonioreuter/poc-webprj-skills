import { createApp } from './app.js';
import { env } from './config/env.js';
import { checkDatabase, pool } from './db/pool.js';
import { logger } from './lib/logger.js';

const app = createApp({ checkDatabase });

const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, 'Server listening');
});

function shutdown(signal: string): void {
  logger.info({ signal }, 'Shutting down');
  server.close(() => {
    pool
      .end()
      .then(() => process.exit(0))
      .catch((err: unknown) => {
        logger.error({ err }, 'Error closing database pool');
        process.exit(1);
      });
  });
}

process.on('SIGINT', () => {
  shutdown('SIGINT');
});
process.on('SIGTERM', () => {
  shutdown('SIGTERM');
});
