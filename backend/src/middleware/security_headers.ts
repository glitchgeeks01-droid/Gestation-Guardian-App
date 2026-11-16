/**
 * Security Headers & DTO Sanitizer (S15 & OWASP API2, API5)
 * Standards: OWASP API Security Top 10, OWASP MASVS L2, HIPAA Security Rule
 * Security Requirements Owned: S15 (Helmet Security Headers & Mass Assignment Defense)
 * Scope: backend/src/middleware/security_headers.ts
 */

export interface SecurityHeadersConfig {
  contentSecurityPolicy?: string;
  xFrameOptions?: string;
  xContentTypeOptions?: string;
  strictTransportSecurity?: string;
  referrerPolicy?: string;
}

/**
 * Helmet Security Headers Middleware matching S15 specification
 */
export function createSecurityHeadersMiddleware(config?: SecurityHeadersConfig) {
  const csp = config?.contentSecurityPolicy || "default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none';";
  const xfo = config?.xFrameOptions || 'DENY';
  const xcto = config?.xContentTypeOptions || 'nosniff';
  const hsts = config?.strictTransportSecurity || 'max-age=31536000; includeSubDomains; preload';
  const refPol = config?.referrerPolicy || 'strict-origin-when-cross-origin';

  return (req: any, res: any, next: (err?: any) => void) => {
    // S15: Helmet mandatory headers
    res.setHeader('Content-Security-Policy', csp);
    res.setHeader('X-Frame-Options', xfo);
    res.setHeader('X-Content-Type-Options', xcto);
    res.setHeader('Strict-Transport-Security', hsts);
    res.setHeader('Referrer-Policy', refPol);

    // Remove fingerprinting headers
    if (typeof res.removeHeader === 'function') {
      res.removeHeader('X-Powered-By');
    } else if (res.headers) {
      delete res.headers['x-powered-by'];
    }

    next();
  };
}

export const securityHeaders = createSecurityHeadersMiddleware();

/**
 * Profile Update DTO Whitelist Schema (S15 Mass Assignment Defense)
 * Only clinically relevant fields may be mutated by a patient.
 */
export const ALLOWED_PROFILE_UPDATE_FIELDS = new Set([
  'lmp',
  'edd',
  'gestational_weeks',
  'blood_group'
]);

export function filterProfileUpdateDTO(input: Record<string, any>): Record<string, any> {
  if (!input || typeof input !== 'object') return {};
  const filtered: Record<string, any> = {};
  for (const [key, value] of Object.entries(input)) {
    if (ALLOWED_PROFILE_UPDATE_FIELDS.has(key)) {
      filtered[key] = value;
    }
  }
  return filtered;
}

/**
 * Strips sensitive internal credentials and secrets from outgoing user DTO (S15)
 */
export function sanitizeUserResponseDTO(user: Record<string, any>): Record<string, any> {
  if (!user || typeof user !== 'object') return user;

  const SENSITIVE_FIELDS = new Set([
    'password_hash',
    'passwordHash',
    'refresh_token_hash',
    'refreshTokenHash',
    'key_encryption_key_id',
    'kmsKeyId',
    'token_secret'
  ]);

  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(user)) {
    if (!SENSITIVE_FIELDS.has(key)) {
      sanitized[key] = value;
    }
  }
  return sanitized;
}
