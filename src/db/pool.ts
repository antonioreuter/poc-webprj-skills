import pg from 'pg';

import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';

export const pool = new pg.Pool({ connectionString: env.DATABASE_URL });

pool.on('error', (err) => {
  logger.error({ err }, 'Unexpected error on idle Postgres client');
});

export async function checkDatabase(): Promise<boolean> {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (err) {
    logger.warn({ err }, 'Database health check failed');
    return false;
  }
}
