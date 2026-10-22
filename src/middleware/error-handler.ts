import type { ErrorRequestHandler, RequestHandler } from 'express';

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export const notFound: RequestHandler = (_req, _res, next) => {
  next(new HttpError(404, 'Not Found'));
};

export const errorHandler: ErrorRequestHandler = (err: unknown, req, res, _next) => {
  const status = err instanceof HttpError ? err.status : 500;
  if (status >= 500) {
    req.log.error({ err }, 'Unhandled error');
  }
  const message = err instanceof HttpError ? err.message : 'Internal Server Error';
  res.status(status).json({ error: message });
};
