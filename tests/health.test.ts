import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../src/app.js';

describe('GET /health', () => {
  it('returns 200 when the database is reachable', async () => {
    const app = createApp({ checkDatabase: () => Promise.resolve(true) });
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', database: 'up' });
  });

  it('returns 503 when the database is down', async () => {
    const app = createApp({ checkDatabase: () => Promise.resolve(false) });
    const res = await request(app).get('/health');
    expect(res.status).toBe(503);
    expect(res.body).toEqual({ status: 'degraded', database: 'down' });
  });

  it('returns 404 JSON for unknown routes', async () => {
    const app = createApp({ checkDatabase: () => Promise.resolve(true) });
    const res = await request(app).get('/nope');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Not Found' });
  });
});
