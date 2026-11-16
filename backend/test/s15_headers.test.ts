/**
 * Security Verification Test Suite: S15 (HTTP Security Headers & Mass Assignment Protection)
 * Standards: OWASP API Security Top 10 (API2: Broken Object Property Level Authorization, API5: Security Headers), OWASP MASVS L2
 * Security Requirements Owned: S15 (Helmet Headers, DTO Whitelisting & Mass Assignment Defense)
 * Scope: backend/test/s15_headers.test.ts
 */

import { describe, it, beforeEach, expect } from './test_helper.ts';

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

  return (req: any, res: any, next: () => void) => {
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

/**
 * Profile Update DTO Whitelist Schema
 * Only clinically relevant fields may be mutated by a patient.
 */
export const ALLOWED_PROFILE_UPDATE_FIELDS = new Set([
  'lmp',
  'edd',
  'gestational_weeks',
  'blood_group'
]);

export function filterProfileUpdateDTO(input: Record<string, any>): Record<string, any> {
  const filtered: Record<string, any> = {};
  for (const [key, value] of Object.entries(input)) {
    if (ALLOWED_PROFILE_UPDATE_FIELDS.has(key)) {
      filtered[key] = value;
    }
  }
  return filtered;
}

/**
 * Strips sensitive internal credentials from outgoing user DTO
 */
export function sanitizeUserResponseDTO(user: Record<string, any>): Record<string, any> {
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

function createMockResponse() {
  return {
    statusCode: 200,
    headers: {} as Record<string, string>,
    setHeader(name: string, value: string) {
      this.headers[name.toLowerCase()] = value;
      return this;
    },
    removeHeader(name: string) {
      delete this.headers[name.toLowerCase()];
      return this;
    },
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(data: any) {
      this.body = data;
      return this;
    },
    body: null as any
  };
}

describe('S15: HTTP Security Headers & Mass Assignment Protection', () => {
  describe('Helmet HTTP Security Headers Verification', () => {
    let middleware: (req: any, res: any, next: () => void) => void;

    beforeEach(() => {
      middleware = createSecurityHeadersMiddleware();
    });

    it('enforces Content-Security-Policy header on API responses', () => {
      const req = {};
      const res = createMockResponse();
      middleware(req, res, () => {});

      expect(res.headers['content-security-policy']).toBeDefined();
      expect(res.headers['content-security-policy']).toContain("default-src 'self'");
    });

    it('enforces X-Frame-Options: DENY to prevent clickjacking attacks', () => {
      const req = {};
      const res = createMockResponse();
      middleware(req, res, () => {});

      expect(res.headers['x-frame-options']).toBe('DENY');
    });

    it('enforces X-Content-Type-Options: nosniff to prevent MIME confusion / sniffing', () => {
      const req = {};
      const res = createMockResponse();
      middleware(req, res, () => {});

      expect(res.headers['x-content-type-options']).toBe('nosniff');
    });

    it('enforces Strict-Transport-Security (HSTS) with includeSubDomains and preload', () => {
      const req = {};
      const res = createMockResponse();
      middleware(req, res, () => {});

      const hsts = res.headers['strict-transport-security'];
      expect(hsts).toBeDefined();
      expect(hsts).toContain('max-age=31536000');
      expect(hsts).toContain('includeSubDomains');
    });

    it('strips X-Powered-By header to prevent server technology fingerprinting', () => {
      const req = {};
      const res = createMockResponse();
      res.headers['x-powered-by'] = 'Express';

      middleware(req, res, () => {});
      expect(res.headers['x-powered-by']).toBeUndefined();
    });
  });

  describe('Mass Assignment & Broken Object Property Protection', () => {
    it('strips injected isAdmin: true and role: "admin" from profile updates', () => {
      const maliciousPayload = {
        gestational_weeks: 28,
        blood_group: 'B+',
        // Mass assignment injection attempts:
        isAdmin: true,
        role: 'admin',
        is_admin: true,
        role_id: 1,
        permissions: ['ALL_ACCESS'],
        is_verified: true,
        user_id: 'foreign-target-uuid-999',
        created_at: '1970-01-01T00:00:00Z'
      };

      const sanitized = filterProfileUpdateDTO(maliciousPayload);

      // Allowed fields are preserved
      expect(sanitized.gestational_weeks).toBe(28);
      expect(sanitized.blood_group).toBe('B+');

      // Privileged and foreign fields are strictly stripped
      expect(sanitized.isAdmin).toBeUndefined();
      expect(sanitized.role).toBeUndefined();
      expect(sanitized.is_admin).toBeUndefined();
      expect(sanitized.role_id).toBeUndefined();
      expect(sanitized.permissions).toBeUndefined();
      expect(sanitized.is_verified).toBeUndefined();
      expect(sanitized.user_id).toBeUndefined();
      expect(sanitized.created_at).toBeUndefined();
    });

    it('prevents privilege escalation when payload contains only injected properties', () => {
      const purelyMaliciousPayload = {
        role: 'administrator',
        isAdmin: true,
        permissions: ['*']
      };

      const sanitized = filterProfileUpdateDTO(purelyMaliciousPayload);
      expect(Object.keys(sanitized).length).toBe(0);
    });

    it('sanitizes user response DTO to ensure sensitive secrets are never leaked in API outputs', () => {
      const userDatabaseRecord = {
        id: 'usr-12345-uuid',
        phone: '+15551234567',
        email: 'patient@example.com',
        role: 'patient',
        password_hash: '$argon2id$v=19$m=65536,t=3,p=4$fakeHashDataToStrip',
        refresh_token_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        key_encryption_key_id: 'arn:aws:kms:us-east-1:123456789012:key/test-kek-id',
        created_at: '2026-11-16T10:00:00Z'
      };

      const sanitizedResponse = sanitizeUserResponseDTO(userDatabaseRecord);

      expect(sanitizedResponse.id).toBe('usr-12345-uuid');
      expect(sanitizedResponse.email).toBe('patient@example.com');
      expect(sanitizedResponse.role).toBe('patient');

      // Critical secrets stripped
      expect(sanitizedResponse.password_hash).toBeUndefined();
      expect(sanitizedResponse.refresh_token_hash).toBeUndefined();
      expect(sanitizedResponse.key_encryption_key_id).toBeUndefined();
    });
  });
});
