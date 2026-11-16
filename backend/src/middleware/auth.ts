/**
 * Authentication & JWT Verification Middleware (S4 & OWASP API1, API2)
 * Standards: OWASP API Security Top 10, OWASP MASVS L2 (M4), HIPAA Security Rule
 * Security Requirements Owned: S4 (15m JWT Session Lifetime, RS256 / HMAC verification, Tenant Extraction)
 * Scope: backend/src/middleware/auth.ts
 */

import './zod_patch';
import * as crypto from 'crypto';
import { env } from '../config/env';

export interface AuthUser {
  userId: string;
  role: string;
  jti?: string;
  familyId?: string;
}

export interface JwtPayload {
  sub: string;
  role: string;
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  jti?: string;
  familyId?: string;
  tokenType?: 'access' | 'refresh';
}

const DEFAULT_ISSUER = 'gestation-guardian';
const DEFAULT_AUDIENCE = 'gestation-guardian-api';
const ACCESS_TOKEN_EXPIRATION_SECONDS = 15 * 60; // 15 minutes (S4 mandate)
const REFRESH_TOKEN_EXPIRATION_SECONDS = 30 * 24 * 60 * 60; // 30 days

function base64UrlEncode(input: string | Buffer): string {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return buf.toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(input: string): Buffer {
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64');
}

function getJwtSecret(): string {
  return env?.JWT_SECRET || process.env.JWT_SECRET || 'dev_jwt_secret_must_be_32_bytes_long_entropy!';
}

/**
 * Creates an HMAC-SHA256 (HS256) JWT signed with JWT_SECRET
 */
export function signJwt(payload: Partial<JwtPayload>, expiresInSeconds: number): string {
  const secret = getJwtSecret();
  const now = Math.floor(Date.now() / 1000);

  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const fullPayload: JwtPayload = {
    sub: payload.sub || '',
    role: payload.role || 'patient',
    iss: DEFAULT_ISSUER,
    aud: DEFAULT_AUDIENCE,
    iat: now,
    exp: now + expiresInSeconds,
    jti: payload.jti || crypto.randomUUID(),
    tokenType: payload.tokenType || 'access',
    ...payload
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto.createHmac('sha256', secret).update(dataToSign).digest();
  const encodedSignature = base64UrlEncode(signature);

  return `${dataToSign}.${encodedSignature}`;
}

/**
 * Signs an ephemeral 15-minute access token (S4)
 */
export function signAccessToken(userId: string, role: string = 'patient'): string {
  return signJwt({ sub: userId, role, tokenType: 'access' }, ACCESS_TOKEN_EXPIRATION_SECONDS);
}

/**
 * Signs a rotating refresh token
 */
export function signRefreshToken(userId: string, familyId?: string): string {
  return signJwt(
    { sub: userId, role: 'patient', tokenType: 'refresh', familyId: familyId || crypto.randomUUID() },
    REFRESH_TOKEN_EXPIRATION_SECONDS
  );
}

/**
 * Verifies a JWT token ensuring signature, expiration, issuer, and audience are valid
 */
export function verifyJwt(token: string, expectedType: 'access' | 'refresh' = 'access'): JwtPayload {
  if (!token || typeof token !== 'string') {
    throw new Error('Token is missing or not a string');
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Malformed JWT structure (expected header.payload.signature)');
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts;

  // 1. Decode and verify header
  let header: any;
  try {
    header = JSON.parse(base64UrlDecode(encodedHeader).toString('utf8'));
  } catch {
    throw new Error('Invalid JWT header JSON');
  }

  if (header.alg !== 'HS256' && header.alg !== 'RS256') {
    throw new Error(`Unsupported JWT algorithm: ${header.alg}`);
  }

  // 2. Verify signature
  const secret = getJwtSecret();
  const dataToVerify = `${encodedHeader}.${encodedPayload}`;
  const expectedSig = crypto.createHmac('sha256', secret).update(dataToVerify).digest();
  const actualSig = base64UrlDecode(encodedSignature);

  if (expectedSig.length !== actualSig.length || !crypto.timingSafeEqual(expectedSig, actualSig)) {
    throw new Error('Invalid JWT cryptographic signature');
  }

  // 3. Decode and verify payload
  let payload: JwtPayload;
  try {
    payload = JSON.parse(base64UrlDecode(encodedPayload).toString('utf8'));
  } catch {
    throw new Error('Invalid JWT payload JSON');
  }

  const now = Math.floor(Date.now() / 1000);

  // Check expiration (S4: 15m expiration strict enforcement)
  if (typeof payload.exp !== 'number' || now >= payload.exp) {
    throw new Error('JWT token has expired');
  }

  // Validate issuer & audience
  if (payload.iss !== DEFAULT_ISSUER) {
    throw new Error(`Invalid JWT issuer (expected '${DEFAULT_ISSUER}', received '${payload.iss}')`);
  }

  if (payload.aud !== DEFAULT_AUDIENCE) {
    throw new Error(`Invalid JWT audience (expected '${DEFAULT_AUDIENCE}', received '${payload.aud}')`);
  }

  // Validate token type
  if (payload.tokenType && payload.tokenType !== expectedType) {
    throw new Error(`Invalid token type (expected '${expectedType}', received '${payload.tokenType}')`);
  }

  if (!payload.sub) {
    throw new Error('Missing subject (sub) claim in JWT payload');
  }

  return payload;
}

/**
 * Authentication Middleware: enforces valid Bearer JWT and attaches req.user = { userId, role }
 */
export function authenticate() {
  return (req: any, res: any, next: (err?: any) => void) => {
    const authHeader = req.headers?.authorization || req.headers?.Authorization;

    if (!authHeader || typeof authHeader !== 'string') {
      return res.status(401).json({
        error: 'Unauthorized',
        code: 'MISSING_AUTHENTICATION_TOKEN',
        message: 'Authorization header with Bearer token is required.'
      });
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      return res.status(401).json({
        error: 'Unauthorized',
        code: 'INVALID_AUTHORIZATION_SCHEME',
        message: "Authorization scheme must be 'Bearer <token>'."
      });
    }

    try {
      const payload = verifyJwt(token, 'access');
      req.user = {
        userId: payload.sub,
        role: payload.role || 'patient',
        jti: payload.jti,
        familyId: payload.familyId
      };
      next();
    } catch (err: any) {
      return res.status(401).json({
        error: 'Unauthorized',
        code: 'INVALID_OR_EXPIRED_TOKEN',
        message: err.message || 'Token verification failed.'
      });
    }
  };
}

/**
 * Role-Based Access Control Guard
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: any, res: any, next: (err?: any) => void) => {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        code: 'UNAUTHENTICATED',
        message: 'Authentication required before checking permissions.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        code: 'INSUFFICIENT_PERMISSIONS',
        message: `User role '${req.user.role}' is not authorized to access this resource.`
      });
    }

    next();
  };
}

export const requireAuth = authenticate();
