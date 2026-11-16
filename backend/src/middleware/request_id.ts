/**
 * Request ID Tracking Middleware
 * Scope: backend/src/middleware/request_id.ts
 */

import * as crypto from 'crypto';

export function requestIdMiddleware() {
  return (req: any, res: any, next: (err?: any) => void) => {
    const incomingId = req.headers?.['x-request-id'] || req.headers?.['X-Request-ID'];
    const validUuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    const id = (typeof incomingId === 'string' && validUuidRegex.test(incomingId))
      ? incomingId
      : crypto.randomUUID();

    req.id = id;
    res.setHeader('X-Request-ID', id);

    next();
  };
}

export const requestId = requestIdMiddleware();
