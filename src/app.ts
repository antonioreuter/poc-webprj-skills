import express, { type Express } from 'express';
import { pinoHttp } from 'pino-http';

import { logger } from './lib/logger.js';
import { errorHandler, notFound } from './middleware/error-handler.js';
import { healthRouter, type HealthDeps } from './routes/health.js';

export type AppDeps = HealthDeps;

export function createApp(deps: AppDeps): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(pinoHttp({ logger }));
  app.use(express.json());

  app.use(healthRouter(deps));

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
