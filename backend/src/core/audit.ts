/**
 * Append-Only Audit Logging and Log Redaction Module
 * Compliance: HIPAA Security Rule (45 CFR § 164.312(b)), OWASP API Security Top 10 (API7 / API8)
 * Security Requirements Owned: S16 (Append-Only Audit Trail & Pino Log Redaction)
 */

import * as crypto from 'crypto';

export type AuditAction =
  | 'READ'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'CONSENT_CHANGE'
  | 'EXPORT'
  | (string & {});

export type AuditResourceType =
  | 'profile'
  | 'health_entry'
  | 'document'
  | 'consent'
  | 'appointment'
  | 'user'
  | 'auth'
  | (string & {});

export type AuditStatus = 'SUCCESS' | 'FAILURE' | (string & {});

export interface AuditEvent {
  userId?: string | null;
  action: AuditAction;
  resourceType: AuditResourceType;
  resourceId?: string | null;
  ipAddress?: string | null;
  status: AuditStatus;
  timestamp?: Date | string;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  userId: string | null;
  action: string;
  resourceType: string;
  resourceId: string | null;
  ipAddress: string | null;
  status: string;
}

/**
 * Interface representing a PostgreSQL client, pool, or queryable transaction runner.
 */
export interface Queryable {
  query(sql: string, params?: any[]): Promise<{ rows: any[]; rowCount?: number | null }>;
}

/**
 * Pseudonymizes / hashes client IP address to preserve privacy while maintaining auditability.
 */
export function hashIpAddress(ip: string | undefined | null): string | null {
  if (!ip) return null;
  return crypto.createHash('sha256').update(ip.trim()).digest('hex').substring(0, 32);
}

/**
 * Records an immutable, append-only audit event to the database.
 * 
 * @param clientOrPool PostgreSQL Pool, Client, or Transaction runner.
 * @param event The audit event details.
 */
export async function logAuditEvent(
  clientOrPool: Queryable,
  event: AuditEvent
): Promise<AuditRecord> {
  const timestamp = event.timestamp
    ? (event.timestamp instanceof Date ? event.timestamp.toISOString() : event.timestamp)
    : new Date().toISOString();

  const userId = event.userId ?? null;
  const resourceId = event.resourceId ?? null;
  const ipAddress = event.ipAddress ?? null;

  const sql = `
    INSERT INTO audit_log (
      id,
      timestamp,
      user_id,
      action,
      resource_type,
      resource_id,
      ip_address,
      status
    )
    VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7)
    RETURNING id, timestamp, user_id, action, resource_type, resource_id, ip_address, status;
  `;

  const values = [
    timestamp,
    userId,
    event.action,
    event.resourceType,
    resourceId,
    ipAddress,
    event.status
  ];

  const result = await clientOrPool.query(sql, values);
  const row = result.rows[0];

  return {
    id: row.id,
    timestamp: row.timestamp,
    userId: row.user_id,
    action: row.action,
    resourceType: row.resource_type,
    resourceId: row.resource_id,
    ipAddress: row.ip_address,
    status: row.status
  };
}

/**
 * Pino Log Redaction Configuration
 * Enforces S16 by scrubbing passwords, cryptographic tokens, and vital personal health observations.
 */
export const pinoRedactionConfig = {
  paths: [
    // Authentication & Secret tokens
    'password',
    'password_hash',
    'passwordHash',
    'newPassword',
    'oldPassword',
    'confirmPassword',
    'token',
    'accessToken',
    'refreshToken',
    'access_token',
    'refresh_token',
    'id_token',
    'authorization',
    'headers.authorization',
    'req.headers.authorization',
    'cookie',
    'headers.cookie',
    'req.headers.cookie',

    // Vital readings & Sensitive health metrics
    'systolic',
    'diastolic',
    'weight',
    'kick_count',
    'kickCount',
    'blood_group',
    'bloodGroup',
    'symptoms',
    'mood',
    'notes_encrypted',
    'notesEncrypted',
    'notes',

    // Wildcards for nested object structures
    '*.password',
    '*.password_hash',
    '*.passwordHash',
    '*.token',
    '*.accessToken',
    '*.refreshToken',
    '*.access_token',
    '*.refresh_token',
    '*.authorization',
    '*.systolic',
    '*.diastolic',
    '*.weight',
    '*.kick_count',
    '*.kickCount',
    '*.blood_group',
    '*.bloodGroup',
    '*.symptoms',
    '*.mood',
    '*.notes_encrypted',
    '*.notesEncrypted',
    '*.notes',
    '*.*.password',
    '*.*.token',
    '*.*.accessToken',
    '*.*.refreshToken'
  ],
  censor: '[REDACTED]'
};

const SENSITIVE_KEY_REGEX = /^(password|password_hash|token|accesstoken|refreshtoken|access_token|refresh_token|authorization|systolic|diastolic|weight|kick_count|kickcount|blood_group|bloodgroup|symptoms|mood|notes_encrypted|notes)$/i;

/**
 * Standalone deep scrubber for scrubbing sensitive fields from in-memory objects.
 */
export function scrubSensitiveFields<T = any>(obj: T): T {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => scrubSensitiveFields(item)) as any;
  }

  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEY_REGEX.test(key)) {
      result[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      result[key] = scrubSensitiveFields(value);
    } else {
      result[key] = value;
    }
  }

  return result as T;
}
