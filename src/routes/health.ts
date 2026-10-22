import { Router } from 'express';

export interface HealthDeps {
  checkDatabase: () => Promise<boolean>;
}

export function healthRouter({ checkDatabase }: HealthDeps): Router {
  const router = Router();

  router.get('/health', async (_req, res) => {
    const database = await checkDatabase();
    res.status(database ? 200 : 503).json({
      status: database ? 'ok' : 'degraded',
      database: database ? 'up' : 'down',
    });
  });

  return router;
}
