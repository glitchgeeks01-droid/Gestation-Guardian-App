/**
 * Input Validation Middleware (S7 & OWASP API4)
 * Standards: OWASP API Security Top 10 (API4: Strict Validation & Parameterization), HIPAA Security Rule
 * Security Requirements Owned: S7 (Zod Clinical Ranges & SQL Injection Defense)
 * Scope: backend/src/middleware/validate.ts
 */

import { ZodError } from 'zod';

export interface ValidationSchemas {
  body?: any;
  params?: any;
  query?: any;
}

/**
 * Validates request body, params, and/or query against Zod schemas.
 * Rejects invalid inputs with HTTP 400 Bad Request and structured error issues.
 */
export function validate(schemas: ValidationSchemas) {
  return (req: any, res: any, next: (err?: any) => void) => {
    try {
      if (schemas.params && req.params) {
        req.params = schemas.params.parse(req.params);
      }

      if (schemas.query && req.query) {
        req.query = schemas.query.parse(req.query);
      }

      if (schemas.body) {
        req.body = schemas.body.parse(req.body || {});
      }

      next();
    } catch (err: any) {
      if (err instanceof ZodError || err.issues) {
        return res.status(400).json({
          error: 'Bad Request',
          code: 'VALIDATION_FAILED',
          issues: err.issues || [{ message: err.message }]
        });
      }
      return res.status(400).json({
        error: 'Bad Request',
        code: 'VALIDATION_FAILED',
        message: err.message || 'Input validation failed.'
      });
    }
  };
}

export function validateBody(schema: any) {
  return validate({ body: schema });
}

export function validateQuery(schema: any) {
  return validate({ query: schema });
}

export function validateParams(schema: any) {
  return validate({ params: schema });
}
