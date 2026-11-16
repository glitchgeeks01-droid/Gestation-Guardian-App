/**
 * Centralized Security Error Handler Middleware (S15 & S5)
 * Standards: OWASP API Security Top 10 (API5: Security Misconfiguration, API1: BOLA)
 * Security Requirements Owned: S15 (Information Leakage Defense & Standardized JSON Errors), S5 (Strict 404)
 * Scope: backend/src/middleware/error_handler.ts
 */

import { TenantNotFoundError } from '../db/repository';
import { AuthenticationVerificationError } from '../core/crypto';
import { ZodError } from 'zod';

export function errorHandler() {
  return (err: any, req: any, res: any, next: (err?: any) => void) => {
    const requestId = req?.id || 'unknown-request-id';

    // 1. S5: TenantNotFoundError & Object-Level Authorization failure -> Strict HTTP 404
    if (err instanceof TenantNotFoundError || err?.code === 'RESOURCE_NOT_FOUND' || err?.statusCode === 404) {
      return res.status(404).json({
        error: 'Not Found',
        code: err.code || 'RESOURCE_NOT_FOUND',
        message: err.message || 'Resource not found.',
        requestId
      });
    }

    // 2. S7: Zod Clinical Validation Failure -> HTTP 400
    if (err instanceof ZodError || err?.issues) {
      return res.status(400).json({
        error: 'Bad Request',
        code: 'VALIDATION_FAILED',
        issues: err.issues || [{ message: err.message }],
        requestId
      });
    }

    // 3. S14: Field-level Cryptographic / AAD Tampering detected -> HTTP 400
    if (err instanceof AuthenticationVerificationError || err?.name === 'AuthenticationVerificationError') {
      return res.status(400).json({
        error: 'Bad Request',
        code: 'CRYPTOGRAPHIC_VERIFICATION_FAILED',
        message: 'Security Violation: Data tampering or tenant mismatch detected.',
        requestId
      });
    }

    // 4. Rate Limiting -> HTTP 429
    if (err?.code === 'RATE_LIMIT_EXCEEDED' || err?.statusCode === 429) {
      return res.status(429).json({
        error: 'Too Many Requests',
        code: 'RATE_LIMIT_EXCEEDED',
        message: err.message || 'Rate limit exceeded. Please try again later.',
        retryAfter: err.retryAfter,
        requestId
      });
    }

    // 5. Explicit HTTP Status codes defined on custom exceptions
    const status = (typeof err?.statusCode === 'number' && err.statusCode >= 400 && err.statusCode <= 599)
      ? err.statusCode
      : ((typeof err?.status === 'number' && err.status >= 400 && err.status <= 599) ? err.status : 500);

    if (status < 500) {
      return res.status(status).json({
        error: err.error || err.name || 'Client Error',
        code: err.code || 'CLIENT_ERROR',
        message: err.message || 'Request could not be processed.',
        requestId
      });
    }

    // 6. S15: Internal 500 Errors - NEVER leak stack traces, SQL queries, or internal file paths
    console.error(`[Error Handler] Uncaught Exception on Request ${requestId}:`, err?.message || err);

    return res.status(500).json({
      error: 'Internal Server Error',
      code: 'INTERNAL_ERROR',
      message: 'An unexpected internal error occurred. Please contact support with the requestId.',
      requestId
    });
  };
}
