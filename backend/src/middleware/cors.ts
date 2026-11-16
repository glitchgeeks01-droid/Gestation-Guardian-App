/**
 * Strict CORS Configuration Middleware (S15)
 * Standards: OWASP API Security Top 10 (API5: Security Misconfiguration)
 * Security Requirements Owned: S15 (Strict CORS Whitelisting, Wildcard '*' Prohibited)
 * Scope: backend/src/middleware/cors.ts
 */

import './zod_patch';
import { env } from '../config/env';

export interface CorsOptions {
  allowedOrigins?: string[];
  allowedMethods?: string[];
  allowedHeaders?: string[];
  allowCredentials?: boolean;
  maxAge?: number;
}

export function createCorsMiddleware(options?: CorsOptions) {
  // Parse allowed origins from options or environment variable
  const rawOriginConfig = env?.CORS_ORIGIN || 'http://localhost:5173';
  if (rawOriginConfig.trim() === '*') {
    throw new Error("Security Exception: Wildcard '*' CORS origin is strictly prohibited for maternal health telemetry.");
  }

  const allowedOrigins = options?.allowedOrigins || rawOriginConfig.split(',').map(s => s.trim().toLowerCase());
  const allowedMethods = options?.allowedMethods || ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];
  const allowedHeaders = options?.allowedHeaders || ['Content-Type', 'Authorization', 'X-Request-ID', 'Accept'];
  const allowCredentials = options?.allowCredentials ?? true;
  const maxAge = options?.maxAge ?? 86400;

  return (req: any, res: any, next: (err?: any) => void) => {
    const origin = req.headers?.origin || req.headers?.Origin;

    if (origin) {
      const normalizedOrigin = String(origin).trim().toLowerCase();
      const isAllowed = allowedOrigins.includes(normalizedOrigin) ||
        (process.env.NODE_ENV !== 'production' && (normalizedOrigin.includes('localhost') || normalizedOrigin.includes('127.0.0.1')));

      if (isAllowed) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        if (allowCredentials) {
          res.setHeader('Access-Control-Allow-Credentials', 'true');
        }
        res.setHeader('Access-Control-Allow-Methods', allowedMethods.join(', '));
        res.setHeader('Access-Control-Allow-Headers', allowedHeaders.join(', '));
        res.setHeader('Access-Control-Max-Age', maxAge.toString());
      } else {
        // Untrusted origin: do not set Access-Control-Allow-Origin header
        if (req.method === 'OPTIONS') {
          return res.status(403).json({
            error: 'Forbidden',
            code: 'CORS_ORIGIN_DENIED',
            message: 'Cross-origin request from unauthorized origin blocked.'
          });
        }
      }
    }

    // Handle OPTIONS Preflight
    if (req.method === 'OPTIONS') {
      res.setHeader('Content-Length', '0');
      return res.status(204).end ? res.status(204).end() : res.status(204).send('');
    }

    next();
  };
}

export const cors = createCorsMiddleware();
