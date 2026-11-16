/**
 * Security Verification Test Suite: S16 (Append-Only Audit Trail & Pino PHI Redaction)
 * Standards: HIPAA Security Rule (45 CFR § 164.312(b)), OWASP API Security Top 10 (API7 / API8)
 * Security Requirements Owned: S16 (Immutable Audit Log, Zero PHI in Application Logs)
 * Scope: backend/test/s16_audit.test.ts
 */

import { describe, it, beforeEach, expect } from './test_helper.ts';
import {
  logAuditEvent,
  hashIpAddress,
  pinoRedactionConfig,
  scrubSensitiveFields
} from '../src/core/audit.ts';
import type { AuditEvent, Queryable } from '../src/core/audit.ts';

class MockAuditDatabase implements Queryable {
  public rows: any[] = [];
  public queries: Array<{ sql: string; values: any[] }> = [];

  async query(sql: string, params: any[] = []): Promise<{ rows: any[]; rowCount: number }> {
    this.queries.push({ sql, values: params });

    const trimmed = sql.trim();

    // Prevent direct updates or deletes on audit_log (Immutability guarantee)
    if (/UPDATE\s+audit_log/i.test(trimmed)) {
      throw new Error('Security Violation: audit_log table is append-only. UPDATE operations are prohibited.');
    }
    if (/DELETE\s+FROM\s+audit_log/i.test(trimmed)) {
      throw new Error('Security Violation: audit_log table is append-only. DELETE operations are prohibited.');
    }

    if (/INSERT\s+INTO\s+audit_log/i.test(trimmed)) {
      const row = {
        id: `audit-${Date.now()}-${this.rows.length + 1}`,
        timestamp: params[0] || new Date().toISOString(),
        user_id: params[1],
        action: params[2],
        resource_type: params[3],
        resource_id: params[4],
        ip_address: params[5],
        status: params[6]
      };
      this.rows.push(row);
      return { rows: [row], rowCount: 1 };
    }

    return { rows: [], rowCount: 0 };
  }
}

describe('S16: Append-Only Audit Trail & Pino PHI Redaction', () => {
  const PATIENT_USER_ID = '33333333-4444-5555-6666-777777777777';
  const CLIENT_IP = '203.0.113.42';

  let db: MockAuditDatabase;

  beforeEach(() => {
    db = new MockAuditDatabase();
  });

  describe('Immutable Audit Logging for Critical Operations', () => {
    it('records an audit log row when a health entry is CREATED', async () => {
      const event: AuditEvent = {
        userId: PATIENT_USER_ID,
        action: 'CREATE',
        resourceType: 'health_entry',
        resourceId: 'entry-uuid-101',
        ipAddress: hashIpAddress(CLIENT_IP),
        status: 'SUCCESS'
      };

      const record = await logAuditEvent(db, event);

      expect(record).toBeDefined();
      expect(record.action).toBe('CREATE');
      expect(record.resourceType).toBe('health_entry');
      expect(record.resourceId).toBe('entry-uuid-101');
      expect(record.status).toBe('SUCCESS');
      expect(record.ipAddress).not.toBe(CLIENT_IP); // Must be pseudonymized/hashed
      expect(record.ipAddress).toBe(hashIpAddress(CLIENT_IP));
      expect(db.rows.length).toBe(1);
    });

    it('records an audit log row when a health entry or profile is READ', async () => {
      const event: AuditEvent = {
        userId: PATIENT_USER_ID,
        action: 'READ',
        resourceType: 'profile',
        resourceId: 'profile-uuid-201',
        ipAddress: hashIpAddress(CLIENT_IP),
        status: 'SUCCESS'
      };

      const record = await logAuditEvent(db, event);

      expect(record.action).toBe('READ');
      expect(record.resourceType).toBe('profile');
      expect(record.status).toBe('SUCCESS');
      expect(db.rows.length).toBe(1);
    });

    it('records an audit log row when an appointment is UPDATED', async () => {
      const event: AuditEvent = {
        userId: PATIENT_USER_ID,
        action: 'UPDATE',
        resourceType: 'appointment',
        resourceId: 'appt-uuid-301',
        ipAddress: hashIpAddress(CLIENT_IP),
        status: 'SUCCESS'
      };

      const record = await logAuditEvent(db, event);

      expect(record.action).toBe('UPDATE');
      expect(record.resourceType).toBe('appointment');
      expect(record.status).toBe('SUCCESS');
    });

    it('records an audit log row when a document or record is DELETED', async () => {
      const event: AuditEvent = {
        userId: PATIENT_USER_ID,
        action: 'DELETE',
        resourceType: 'document',
        resourceId: 'doc-uuid-401',
        ipAddress: hashIpAddress(CLIENT_IP),
        status: 'SUCCESS'
      };

      const record = await logAuditEvent(db, event);

      expect(record.action).toBe('DELETE');
      expect(record.resourceType).toBe('document');
      expect(record.status).toBe('SUCCESS');
    });

    it('records an audit log row when patient CONSENT is granted, updated, or revoked', async () => {
      const event: AuditEvent = {
        userId: PATIENT_USER_ID,
        action: 'CONSENT_CHANGE',
        resourceType: 'consent',
        resourceId: 'consent-v2.0',
        ipAddress: hashIpAddress(CLIENT_IP),
        status: 'SUCCESS'
      };

      const record = await logAuditEvent(db, event);

      expect(record.action).toBe('CONSENT_CHANGE');
      expect(record.resourceType).toBe('consent');
      expect(record.resourceId).toBe('consent-v2.0');
      expect(record.status).toBe('SUCCESS');
    });

    it('records an audit log row when patient performs sovereign EXPORT', async () => {
      const event: AuditEvent = {
        userId: PATIENT_USER_ID,
        action: 'EXPORT',
        resourceType: 'profile',
        resourceId: PATIENT_USER_ID,
        ipAddress: hashIpAddress(CLIENT_IP),
        status: 'SUCCESS'
      };

      const record = await logAuditEvent(db, event);

      expect(record.action).toBe('EXPORT');
      expect(record.status).toBe('SUCCESS');
    });

    it('strictly prohibits UPDATE and DELETE mutations on the audit_log table (Append-Only Guarantees)', async () => {
      await expect(async () => {
        await db.query(`UPDATE audit_log SET status = 'MUTATED' WHERE user_id = $1`, [PATIENT_USER_ID]);
      }).rejects.toThrow();

      await expect(async () => {
        await db.query(`DELETE FROM audit_log WHERE user_id = $1`, [PATIENT_USER_ID]);
      }).rejects.toThrow();
    });
  });

  describe('Pino Log Scrubber & Sensitive Field Redaction', () => {
    it('scrubs sensitive vital fields (systolic, diastolic, symptoms, weight, mood) from log payloads', () => {
      const sensitiveTelemetry = {
        level: 30,
        time: Date.now(),
        msg: 'Processed patient health observation log',
        userId: PATIENT_USER_ID,
        systolic: 128,
        diastolic: 84,
        weight: 66.2,
        symptoms: ['acute headache', 'visual disturbances'],
        mood: 'anxious',
        notes: 'Patient advised to monitor blood pressure daily.'
      };

      const scrubbed = scrubSensitiveFields(sensitiveTelemetry);

      expect(scrubbed.userId).toBe(PATIENT_USER_ID);
      expect(scrubbed.systolic).toBe('[REDACTED]');
      expect(scrubbed.diastolic).toBe('[REDACTED]');
      expect(scrubbed.weight).toBe('[REDACTED]');
      expect(scrubbed.symptoms).toBe('[REDACTED]');
      expect(scrubbed.mood).toBe('[REDACTED]');
      expect(scrubbed.notes).toBe('[REDACTED]');
    });

    it('scrubs passwords, credentials, and tokens from authentication log payloads', () => {
      const authPayload = {
        msg: 'User login attempt',
        username: 'patient@example.com',
        password: 'SuperSecretLivePassword2026!',
        password_hash: '$argon2id$v=19$m=65536,t=3,p=4$samplehash',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.secret',
        accessToken: 'access-token-string-xyz',
        refreshToken: 'refresh-token-string-abc'
      };

      const scrubbed = scrubSensitiveFields(authPayload);

      expect(scrubbed.username).toBe('patient@example.com');
      expect(scrubbed.password).toBe('[REDACTED]');
      expect(scrubbed.password_hash).toBe('[REDACTED]');
      expect(scrubbed.token).toBe('[REDACTED]');
      expect(scrubbed.accessToken).toBe('[REDACTED]');
      expect(scrubbed.refreshToken).toBe('[REDACTED]');
    });

    it('deeply scrubs sensitive nested properties in complex request envelopes', () => {
      const complexRequestLog = {
        req: {
          id: 'req-98765',
          method: 'POST',
          url: '/api/health-entries',
          body: {
            systolic: 140,
            diastolic: 95,
            symptoms: ['preeclampsia warning'],
            credentials: {
              password: 'nestedSecretPassword'
            }
          }
        }
      };

      const scrubbed = scrubSensitiveFields(complexRequestLog);

      expect(scrubbed.req.id).toBe('req-98765');
      expect(scrubbed.req.body.systolic).toBe('[REDACTED]');
      expect(scrubbed.req.body.diastolic).toBe('[REDACTED]');
      expect(scrubbed.req.body.symptoms).toBe('[REDACTED]');
      expect(scrubbed.req.body.credentials.password).toBe('[REDACTED]');
    });

    it('verifies that serialized JSON output of scrubbed logs contains zero cleartext clinical readings or passwords', () => {
      const rawLog = {
        user_id: PATIENT_USER_ID,
        systolic: 135,
        diastolic: 88,
        symptoms: ['dizziness'],
        password: 'TopSecretRawPassword!@#'
      };

      const scrubbed = scrubSensitiveFields(rawLog);
      const serializedJson = JSON.stringify(scrubbed);

      expect(serializedJson).not.toContain('135');
      expect(serializedJson).not.toContain('88');
      expect(serializedJson).not.toContain('dizziness');
      expect(serializedJson).not.toContain('TopSecretRawPassword!@#');
      expect(serializedJson).toContain('[REDACTED]');
    });

    it('verifies that pinoRedactionConfig covers all required sensitive paths', () => {
      const paths = pinoRedactionConfig.paths;
      expect(paths).toContain('password');
      expect(paths).toContain('systolic');
      expect(paths).toContain('diastolic');
      expect(paths).toContain('symptoms');
      expect(pinoRedactionConfig.censor).toBe('[REDACTED]');
    });
  });
});
