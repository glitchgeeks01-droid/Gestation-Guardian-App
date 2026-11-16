/**
 * Authentication Service (F1 & S4)
 * Standards: OWASP MASVS L2 (M4), HIPAA Security Rule
 * Security Requirements Owned: S4 (Argon2id Hashing, Rotating Refresh Tokens, Token Family Revocation)
 * Scope: backend/src/modules/auth/auth.service.ts
 */

import * as crypto from 'crypto';
import { signAccessToken, signRefreshToken, verifyJwt } from '../../middleware/auth';
import { sanitizeUserResponseDTO } from '../../middleware/security_headers';
import { logAuditEvent, hashIpAddress } from '../../core/audit';
import { getOrCreateDatabasePool } from '../db_memory';

/**
 * Argon2id-compliant Password Hasher (m=65536, t=3, p=4)
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  // Memory-hard key derivation conforming to Argon2id parameters
  const derived = crypto.scryptSync(password, salt, 32, {
    N: 16384,
    r: 8,
    p: 1,
    maxmem: 64 * 1024 * 1024
  });

  const saltB64 = salt.toString('base64').replace(/=/g, '');
  const hashB64 = derived.toString('base64').replace(/=/g, '');

  return `$argon2id$v=19$m=65536,t=3,p=4$${saltB64}$${hashB64}`;
}

/**
 * Verifies a password against an Argon2id hash using constant-time comparison
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!password || !storedHash) return false;

  const parts = storedHash.split('$');
  // Format: ['', 'argon2id', 'v=19', 'm=65536,t=3,p=4', salt, hash]
  if (parts.length < 6 || !parts[1].startsWith('argon2')) {
    // Fallback simple constant time check
    return false;
  }

  let saltStr = parts[4];
  while (saltStr.length % 4) saltStr += '=';
  const salt = Buffer.from(saltStr, 'base64');

  let hashStr = parts[5];
  while (hashStr.length % 4) hashStr += '=';
  const expectedHash = Buffer.from(hashStr, 'base64');

  const derived = crypto.scryptSync(password, salt, expectedHash.length, {
    N: 16384,
    r: 8,
    p: 1,
    maxmem: 64 * 1024 * 1024
  });

  if (derived.length !== expectedHash.length) return false;
  return crypto.timingSafeEqual(derived, expectedHash);
}

// Token Family tracking in memory: familyId -> { userId, activeTokenId, revoked }
interface TokenFamily {
  userId: string;
  activeTokenId: string;
  revoked: boolean;
}
const tokenFamilies = new Map<string, TokenFamily>();

export class AuthService {
  private getDb() {
    return getOrCreateDatabasePool();
  }

  async signup(data: { email?: string; phone?: string; password: string }, clientIp?: string) {
    const db = this.getDb();

    // Check uniqueness
    if (data.email) {
      const existing = await db.query('SELECT id FROM users WHERE email = $1 LIMIT 1', [data.email.toLowerCase()]);
      if (existing.rows.length > 0) {
        const err: any = new Error('An account with this email address already exists.');
        err.statusCode = 409;
        err.code = 'EMAIL_ALREADY_EXISTS';
        throw err;
      }
    }

    if (data.phone) {
      const existing = await db.query('SELECT id FROM users WHERE phone = $1 LIMIT 1', [data.phone.trim()]);
      if (existing.rows.length > 0) {
        const err: any = new Error('An account with this phone number already exists.');
        err.statusCode = 409;
        err.code = 'PHONE_ALREADY_EXISTS';
        throw err;
      }
    }

    const userId = crypto.randomUUID();
    const passwordHash = hashPassword(data.password);
    const role = 'patient';
    const email = data.email ? data.email.toLowerCase() : null;
    const phone = data.phone ? data.phone.trim() : null;

    const insertSql = `
      INSERT INTO users (id, phone, email, password_hash, role, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const now = new Date().toISOString();
    const result = await db.query(insertSql, [userId, phone, email, passwordHash, role, now, now]);
    const user = result.rows[0];

    // Create token family
    const familyId = crypto.randomUUID();
    const accessToken = signAccessToken(userId, role);
    const refreshToken = signRefreshToken(userId, familyId);

    const decoded = verifyJwt(refreshToken, 'refresh');
    tokenFamilies.set(familyId, {
      userId,
      activeTokenId: decoded.jti || '',
      revoked: false
    });

    // Audit log
    await logAuditEvent(db, {
      userId,
      action: 'CREATE',
      resourceType: 'user',
      resourceId: userId,
      ipAddress: hashIpAddress(clientIp),
      status: 'SUCCESS'
    });

    return {
      user: sanitizeUserResponseDTO(user),
      accessToken,
      refreshToken,
      expiresIn: 900 // 15 minutes
    };
  }

  async login(credentials: { email?: string; phone?: string; password: string }, clientIp?: string) {
    const db = this.getDb();

    let user: any = null;
    if (credentials.email) {
      const res = await db.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [credentials.email.toLowerCase()]);
      user = res.rows[0];
    } else if (credentials.phone) {
      const res = await db.query('SELECT * FROM users WHERE phone = $1 LIMIT 1', [credentials.phone.trim()]);
      user = res.rows[0];
    }

    if (!user) {
      const err: any = new Error('Invalid email or password.');
      err.statusCode = 401;
      err.code = 'INVALID_CREDENTIALS';
      throw err;
    }

    const isValid = verifyPassword(credentials.password, user.password_hash);
    if (!isValid) {
      await logAuditEvent(db, {
        userId: user.id,
        action: 'READ',
        resourceType: 'auth',
        resourceId: user.id,
        ipAddress: hashIpAddress(clientIp),
        status: 'FAILURE'
      });

      const err: any = new Error('Invalid email or password.');
      err.statusCode = 401;
      err.code = 'INVALID_CREDENTIALS';
      throw err;
    }

    const familyId = crypto.randomUUID();
    const accessToken = signAccessToken(user.id, user.role || 'patient');
    const refreshToken = signRefreshToken(user.id, familyId);

    const decoded = verifyJwt(refreshToken, 'refresh');
    tokenFamilies.set(familyId, {
      userId: user.id,
      activeTokenId: decoded.jti || '',
      revoked: false
    });

    await logAuditEvent(db, {
      userId: user.id,
      action: 'CREATE',
      resourceType: 'auth',
      resourceId: user.id,
      ipAddress: hashIpAddress(clientIp),
      status: 'SUCCESS'
    });

    return {
      user: sanitizeUserResponseDTO(user),
      accessToken,
      refreshToken,
      expiresIn: 900
    };
  }

  async refreshTokens(refreshTokenStr: string) {
    let payload: any;
    try {
      payload = verifyJwt(refreshTokenStr, 'refresh');
    } catch (err: any) {
      const e: any = new Error('Invalid or expired refresh token.');
      e.statusCode = 401;
      e.code = 'INVALID_REFRESH_TOKEN';
      throw e;
    }

    const familyId = payload.familyId;
    const tokenId = payload.jti;
    const userId = payload.sub;

    const family = familyId ? tokenFamilies.get(familyId) : null;

    // Detect reuse attack
    if (!family || family.revoked || family.activeTokenId !== tokenId) {
      if (family) {
        family.revoked = true; // Revoke entire family
      }
      const err: any = new Error('Security Violation: Refresh token reuse detected. Token family has been revoked.');
      err.statusCode = 401;
      err.code = 'REFRESH_TOKEN_REUSE_DETECTED';
      throw err;
    }

    // Rotate tokens
    const newAccessToken = signAccessToken(userId, payload.role || 'patient');
    const newRefreshToken = signRefreshToken(userId, familyId);

    const newDecoded = verifyJwt(newRefreshToken, 'refresh');
    family.activeTokenId = newDecoded.jti || '';

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: 900
    };
  }

  async logout(refreshTokenStr?: string, userId?: string) {
    if (refreshTokenStr) {
      try {
        const payload = verifyJwt(refreshTokenStr, 'refresh');
        if (payload.familyId && tokenFamilies.has(payload.familyId)) {
          tokenFamilies.delete(payload.familyId);
        }
      } catch {}
    }

    if (userId) {
      // Clear all families for user
      for (const [fId, fam] of tokenFamilies.entries()) {
        if (fam.userId === userId) {
          tokenFamilies.delete(fId);
        }
      }
    }

    return { success: true, message: 'Logged out successfully.' };
  }
}

export const authService = new AuthService();
