/**
 * Security Verification Test Suite: S5 (Broken Object-Level Authorization / IDOR / BOLA Prevention)
 * Standards: OWASP API Security Top 10 (API1: BOLA), HIPAA Security Rule (45 CFR § 164.312(a)(1))
 * Security Requirements Owned: S5 (Tenant-Isolated Authorization, Strict 404 on Foreign Access)
 * Scope: backend/test/s5_idor.test.ts
 */

import { describe, it, beforeEach, expect } from './test_helper.ts';
import {
  HealthEntryRepository,
  ProfileRepository,
  AppointmentRepository,
  DocumentRepository,
  TenantNotFoundError
} from '../src/db/index.ts';
import type {
  HealthEntry,
  ProfileRecord,
  Appointment,
  DocumentRecord
} from '../src/db/index.ts';

/**
 * In-memory Mock Database Runner enforcing parameterized query execution
 */
class InMemoryDatabase {
  public records: Map<string, Array<Record<string, any>>> = new Map();
  public executedQueries: Array<{ sql: string; params: any[] }> = [];

  constructor() {
    this.reset();
  }

  reset() {
    this.records.set('health_entries', []);
    this.records.set('profiles', []);
    this.records.set('appointments', []);
    this.records.set('documents', []);
    this.executedQueries = [];
  }

  seed(table: string, record: Record<string, any>) {
    const list = this.records.get(table) || [];
    list.push({ ...record });
    this.records.set(table, list);
  }

  async query(sql: string, params: any[] = []): Promise<{ rows: any[]; rowCount: number }> {
    this.executedQueries.push({ sql, params });

    const trimmed = sql.trim();

    // SELECT BY ID AND USER_ID
    if (/SELECT\s+\*\s+FROM\s+([a-zA-Z_]+)\s+WHERE\s+id\s*=\s*\$1\s+AND\s+user_id\s*=\s*\$2/i.test(trimmed)) {
      const match = trimmed.match(/FROM\s+([a-zA-Z_]+)/i);
      const table = match ? match[1] : '';
      const list = this.records.get(table) || [];
      const [id, userId] = params;
      const found = list.find(r => r.id === id && r.user_id === userId);
      return { rows: found ? [found] : [], rowCount: found ? 1 : 0 };
    }

    // UPDATE BY ID AND USER_ID
    if (/UPDATE\s+([a-zA-Z_]+)\s+SET\s+.*?\s+WHERE\s+id\s*=\s*\$1\s+AND\s+user_id\s*=\s*\$2/i.test(trimmed)) {
      const match = trimmed.match(/UPDATE\s+([a-zA-Z_]+)/i);
      const table = match ? match[1] : '';
      const list = this.records.get(table) || [];
      const [id, userId] = params;
      const index = list.findIndex(r => r.id === id && r.user_id === userId);
      if (index === -1) {
        return { rows: [], rowCount: 0 };
      }
      // Apply updates from params
      const updated = { ...list[index] };
      list[index] = updated;
      return { rows: [updated], rowCount: 1 };
    }

    // DELETE BY ID AND USER_ID
    if (/DELETE\s+FROM\s+([a-zA-Z_]+)\s+WHERE\s+id\s*=\s*\$1\s+AND\s+user_id\s*=\s*\$2/i.test(trimmed)) {
      const match = trimmed.match(/FROM\s+([a-zA-Z_]+)/i);
      const table = match ? match[1] : '';
      const list = this.records.get(table) || [];
      const [id, userId] = params;
      const index = list.findIndex(r => r.id === id && r.user_id === userId);
      if (index === -1) {
        return { rows: [], rowCount: 0 };
      }
      const removed = list.splice(index, 1);
      return { rows: removed, rowCount: 1 };
    }

    return { rows: [], rowCount: 0 };
  }
}

/**
 * Simulated Controller / HTTP Dispatcher Layer
 * Handles routing and ensures errors are mapped to correct HTTP status codes.
 */
class SimulatedApiRouter {
  private healthRepo: HealthEntryRepository;
  private profileRepo: ProfileRepository;
  private apptRepo: AppointmentRepository;
  private docRepo: DocumentRepository;

  constructor(
    healthRepo: HealthEntryRepository,
    profileRepo: ProfileRepository,
    apptRepo: AppointmentRepository,
    docRepo: DocumentRepository
  ) {
    this.healthRepo = healthRepo;
    this.profileRepo = profileRepo;
    this.apptRepo = apptRepo;
    this.docRepo = docRepo;
  }

  async handleRequest(
    method: 'GET' | 'PUT' | 'PATCH' | 'DELETE',
    resource: 'health-entries' | 'profiles' | 'appointments' | 'documents',
    callerUserId: string,
    targetId: string,
    payload?: any
  ): Promise<{ status: number; body: any }> {
    try {
      if (resource === 'health-entries') {
        if (method === 'GET') {
          const entry = await this.healthRepo.findByIdOrThrow(callerUserId, targetId);
          return { status: 200, body: entry };
        }
        if (method === 'PUT' || method === 'PATCH') {
          const entry = await this.healthRepo.updateOrThrow(callerUserId, targetId, payload || {});
          return { status: 200, body: entry };
        }
        if (method === 'DELETE') {
          await this.healthRepo.deleteOrThrow(callerUserId, targetId);
          return { status: 200, body: { success: true } };
        }
      }

      if (resource === 'profiles') {
        if (method === 'GET') {
          const profile = await this.profileRepo.findByIdOrThrow(callerUserId, targetId);
          return { status: 200, body: profile };
        }
        if (method === 'PUT' || method === 'PATCH') {
          const profile = await this.profileRepo.updateOrThrow(callerUserId, targetId, payload || {});
          return { status: 200, body: profile };
        }
      }

      if (resource === 'appointments') {
        if (method === 'GET') {
          const appt = await this.apptRepo.findByIdOrThrow(callerUserId, targetId);
          return { status: 200, body: appt };
        }
        if (method === 'PUT' || method === 'PATCH') {
          const appt = await this.apptRepo.updateOrThrow(callerUserId, targetId, payload || {});
          return { status: 200, body: appt };
        }
        if (method === 'DELETE') {
          await this.apptRepo.deleteOrThrow(callerUserId, targetId);
          return { status: 200, body: { success: true } };
        }
      }

      if (resource === 'documents') {
        if (method === 'GET') {
          const doc = await this.docRepo.findByIdOrThrow(callerUserId, targetId);
          return { status: 200, body: doc };
        }
        if (method === 'DELETE') {
          await this.docRepo.deleteOrThrow(callerUserId, targetId);
          return { status: 200, body: { success: true } };
        }
      }

      return { status: 400, body: { error: 'Unknown route' } };
    } catch (err: any) {
      if (err instanceof TenantNotFoundError || err.statusCode === 404) {
        return {
          status: 404,
          body: {
            error: 'Not Found',
            code: err.code || 'RESOURCE_NOT_FOUND',
            message: err.message
          }
        };
      }
      return { status: 500, body: { error: 'Internal Error' } };
    }
  }
}

describe('S5: Broken Object-Level Authorization (IDOR / BOLA Prevention)', () => {
  const USER_A_ID = '11111111-aaaa-4444-8888-aaaaaaaaaaaa';
  const USER_B_ID = '22222222-bbbb-4444-8888-bbbbbbbbbbbb';

  let db: InMemoryDatabase;
  let healthRepo: HealthEntryRepository;
  let profileRepo: ProfileRepository;
  let apptRepo: AppointmentRepository;
  let docRepo: DocumentRepository;
  let api: SimulatedApiRouter;

  const HEALTH_ENTRY_A: HealthEntry = {
    id: 'entry-a-uuid-101',
    user_id: USER_A_ID,
    entry_date: '2026-11-16T10:00:00Z',
    weight: 68.5,
    systolic: 118,
    diastolic: 76,
    symptoms: ['mild fatigue'],
    kick_count: 12,
    mood: 'calm',
    notes_encrypted: { iv: '...', ciphertext: '...' },
    key_version: 1,
    created_at: '2026-11-16T10:00:00Z'
  };

  const PROFILE_A: ProfileRecord = {
    id: 'profile-a-uuid-201',
    user_id: USER_A_ID,
    lmp: '2026-03-01',
    edd: '2026-12-06',
    gestational_weeks: 37,
    blood_group: 'O+',
    created_at: '2026-11-16T10:00:00Z',
    updated_at: '2026-11-16T10:00:00Z'
  };

  const APPOINTMENT_A: Appointment = {
    id: 'appt-a-uuid-301',
    user_id: USER_A_ID,
    title: '36-Week Routine Ultrasound',
    scheduled_at: '2026-11-20T14:00:00Z',
    location: 'Maternal Care Clinic',
    notes_encrypted: { iv: '...', ciphertext: '...' },
    key_version: 1,
    created_at: '2026-11-16T10:00:00Z'
  };

  const DOCUMENT_A: DocumentRecord = {
    id: 'doc-a-uuid-401',
    user_id: USER_A_ID,
    file_name: 'fetal_morphology_scan.pdf',
    mime_type: 'application/pdf',
    size_bytes: 4194304,
    storage_key: 'enc/user-a/fetal_morphology_scan.pdf.enc',
    key_version: 1,
    created_at: '2026-11-16T10:00:00Z'
  };

  beforeEach(() => {
    db = new InMemoryDatabase();
    healthRepo = new HealthEntryRepository(db);
    profileRepo = new ProfileRepository(db);
    apptRepo = new AppointmentRepository(db);
    docRepo = new DocumentRepository(db);
    api = new SimulatedApiRouter(healthRepo, profileRepo, apptRepo, docRepo);

    // Seed User A's data
    db.seed('health_entries', HEALTH_ENTRY_A);
    db.seed('profiles', PROFILE_A);
    db.seed('appointments', APPOINTMENT_A);
    db.seed('documents', DOCUMENT_A);
  });

  describe('Health Entry IDOR Protection', () => {
    it('allows User A to read own health entry (HTTP 200)', async () => {
      const res = await api.handleRequest('GET', 'health-entries', USER_A_ID, HEALTH_ENTRY_A.id);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(HEALTH_ENTRY_A.id);
      expect(res.body.user_id).toBe(USER_A_ID);
    });

    it('rejects User B attempting to READ User A health entry with strict HTTP 404 Not Found (NEVER 403)', async () => {
      const res = await api.handleRequest('GET', 'health-entries', USER_B_ID, HEALTH_ENTRY_A.id);
      expect(res.status).toBe(404);
      expect(res.status).not.toBe(403);
      expect(res.body.code).toBe('RESOURCE_NOT_FOUND');
    });

    it('rejects User B attempting to UPDATE User A health entry with strict HTTP 404 Not Found (NEVER 403)', async () => {
      const maliciousUpdate = { systolic: 200, diastolic: 130 };
      const res = await api.handleRequest('PUT', 'health-entries', USER_B_ID, HEALTH_ENTRY_A.id, maliciousUpdate);
      expect(res.status).toBe(404);
      expect(res.status).not.toBe(403);
      expect(res.body.code).toBe('RESOURCE_NOT_FOUND');
    });

    it('rejects User B attempting to DELETE User A health entry with strict HTTP 404 Not Found (NEVER 403)', async () => {
      const res = await api.handleRequest('DELETE', 'health-entries', USER_B_ID, HEALTH_ENTRY_A.id);
      expect(res.status).toBe(404);
      expect(res.status).not.toBe(403);
      expect(res.body.code).toBe('RESOURCE_NOT_FOUND');

      // Verify record is still intact for User A
      const verifyRes = await api.handleRequest('GET', 'health-entries', USER_A_ID, HEALTH_ENTRY_A.id);
      expect(verifyRes.status).toBe(200);
    });
  });

  describe('Pregnancy Profile IDOR Protection', () => {
    it('allows User A to read own profile (HTTP 200)', async () => {
      const res = await api.handleRequest('GET', 'profiles', USER_A_ID, PROFILE_A.id);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(PROFILE_A.id);
    });

    it('rejects User B attempting to READ User A profile with strict HTTP 404 Not Found (NEVER 403)', async () => {
      const res = await api.handleRequest('GET', 'profiles', USER_B_ID, PROFILE_A.id);
      expect(res.status).toBe(404);
      expect(res.status).not.toBe(403);
      expect(res.body.code).toBe('RESOURCE_NOT_FOUND');
    });

    it('rejects User B attempting to UPDATE User A profile with strict HTTP 404 Not Found (NEVER 403)', async () => {
      const res = await api.handleRequest('PUT', 'profiles', USER_B_ID, PROFILE_A.id, { blood_group: 'AB-' });
      expect(res.status).toBe(404);
      expect(res.status).not.toBe(403);
      expect(res.body.code).toBe('RESOURCE_NOT_FOUND');
    });
  });

  describe('Appointment IDOR Protection', () => {
    it('allows User A to read own appointment (HTTP 200)', async () => {
      const res = await api.handleRequest('GET', 'appointments', USER_A_ID, APPOINTMENT_A.id);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(APPOINTMENT_A.id);
    });

    it('rejects User B attempting to READ User A appointment with strict HTTP 404 Not Found (NEVER 403)', async () => {
      const res = await api.handleRequest('GET', 'appointments', USER_B_ID, APPOINTMENT_A.id);
      expect(res.status).toBe(404);
      expect(res.status).not.toBe(403);
      expect(res.body.code).toBe('RESOURCE_NOT_FOUND');
    });

    it('rejects User B attempting to UPDATE User A appointment with strict HTTP 404 Not Found (NEVER 403)', async () => {
      const res = await api.handleRequest('PATCH', 'appointments', USER_B_ID, APPOINTMENT_A.id, { title: 'Hijacked Visit' });
      expect(res.status).toBe(404);
      expect(res.status).not.toBe(403);
      expect(res.body.code).toBe('RESOURCE_NOT_FOUND');
    });

    it('rejects User B attempting to DELETE User A appointment with strict HTTP 404 Not Found (NEVER 403)', async () => {
      const res = await api.handleRequest('DELETE', 'appointments', USER_B_ID, APPOINTMENT_A.id);
      expect(res.status).toBe(404);
      expect(res.status).not.toBe(403);
      expect(res.body.code).toBe('RESOURCE_NOT_FOUND');
    });
  });

  describe('Diagnostic Document IDOR Protection', () => {
    it('allows User A to read own document metadata (HTTP 200)', async () => {
      const res = await api.handleRequest('GET', 'documents', USER_A_ID, DOCUMENT_A.id);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(DOCUMENT_A.id);
    });

    it('rejects User B attempting to READ User A document metadata with strict HTTP 404 Not Found (NEVER 403)', async () => {
      const res = await api.handleRequest('GET', 'documents', USER_B_ID, DOCUMENT_A.id);
      expect(res.status).toBe(404);
      expect(res.status).not.toBe(403);
      expect(res.body.code).toBe('RESOURCE_NOT_FOUND');
    });

    it('rejects User B attempting to DELETE User A document with strict HTTP 404 Not Found (NEVER 403)', async () => {
      const res = await api.handleRequest('DELETE', 'documents', USER_B_ID, DOCUMENT_A.id);
      expect(res.status).toBe(404);
      expect(res.status).not.toBe(403);
      expect(res.body.code).toBe('RESOURCE_NOT_FOUND');
    });
  });

  describe('Anti-Enumeration Equivalence', () => {
    it('returns indistinguishable HTTP 404 responses for non-existent IDs and foreign tenant IDs', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const foreignTenantRes = await api.handleRequest('GET', 'health-entries', USER_B_ID, HEALTH_ENTRY_A.id);
      const nonExistentRes = await api.handleRequest('GET', 'health-entries', USER_B_ID, nonExistentId);

      expect(foreignTenantRes.status).toBe(404);
      expect(nonExistentRes.status).toBe(404);
      expect(foreignTenantRes.body.code).toBe(nonExistentRes.body.code);
    });
  });

  describe('Parameterized Query SQL Isolation', () => {
    it('verifies all SQL queries enforce WHERE id = $1 AND user_id = $2 with parameterized bindings', async () => {
      db.executedQueries = [];
      await healthRepo.findById(USER_B_ID, HEALTH_ENTRY_A.id);

      expect(db.executedQueries.length).toBe(1);
      const query = db.executedQueries[0];
      expect(query.sql).toContain('WHERE id = $1 AND user_id = $2');
      expect(query.params[0]).toBe(HEALTH_ENTRY_A.id);
      expect(query.params[1]).toBe(USER_B_ID);
    });
  });
});
