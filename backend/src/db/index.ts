/**
 * Database Module Entry Point
 * Connection pooling, schema migrations, and typed repositories.
 */

import * as fs from 'fs';
import * as path from 'path';
import { Queryable } from '../core/audit';
import { BaseTenantRepository } from './repository';

export interface PoolConfig {
  connectionString?: string;
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
  ssl?: boolean | { rejectUnauthorized: boolean };
  max?: number;
}

// In environments where 'pg' is installed, it can be loaded dynamically or injected
let activePool: Queryable | null = null;

export function setDatabasePool(pool: Queryable): void {
  activePool = pool;
}

export function getDatabasePool(): Queryable {
  if (!activePool) {
    throw new Error('Database pool has not been initialized. Call initializeDatabasePool(config) or setDatabasePool(pool).');
  }
  return activePool;
}

/**
 * Executes migration SQL scripts sequentially.
 */
export async function runMigrations(db: Queryable, migrationsDir?: string): Promise<string[]> {
  const dir = migrationsDir || path.join(__dirname, 'migrations');
  if (!fs.existsSync(dir)) {
    throw new Error(`Migrations directory '${dir}' not found.`);
  }

  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  const executed: string[] = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    await db.query(sql);
    executed.push(file);
  }

  return executed;
}

// Concrete Entity Typings
export interface HealthEntry {
  id: string;
  user_id: string;
  entry_date: string;
  weight: number | null;
  systolic: number | null;
  diastolic: number | null;
  symptoms: string[] | null;
  kick_count: number | null;
  mood: string | null;
  notes_encrypted: any;
  key_version: number;
  created_at: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  title: string;
  scheduled_at: string;
  location: string | null;
  notes_encrypted: any;
  key_version: number;
  created_at: string;
}

export interface DocumentRecord {
  id: string;
  user_id: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  storage_key: string;
  key_version: number;
  created_at: string;
}

export interface ProfileRecord {
  id: string;
  user_id: string;
  lmp: string | null;
  edd: string | null;
  gestational_weeks: number | null;
  blood_group: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConsentRecord {
  id: string;
  user_id: string;
  consent_version: string;
  categories: string[];
  granted_at: string;
  revoked_at: string | null;
}

// Concrete Repositories with whitelisted columns
export class HealthEntryRepository extends BaseTenantRepository<HealthEntry> {
  constructor(db: Queryable) {
    super(db, 'health_entries', 'HealthEntry', [
      'id', 'user_id', 'entry_date', 'weight', 'systolic', 'diastolic',
      'symptoms', 'kick_count', 'mood', 'notes_encrypted', 'key_version', 'created_at'
    ]);
  }
}

export class AppointmentRepository extends BaseTenantRepository<Appointment> {
  constructor(db: Queryable) {
    super(db, 'appointments', 'Appointment', [
      'id', 'user_id', 'title', 'scheduled_at', 'location',
      'notes_encrypted', 'key_version', 'created_at'
    ]);
  }
}

export class DocumentRepository extends BaseTenantRepository<DocumentRecord> {
  constructor(db: Queryable) {
    super(db, 'documents', 'Document', [
      'id', 'user_id', 'file_name', 'mime_type', 'size_bytes',
      'storage_key', 'key_version', 'created_at'
    ]);
  }
}

export class ProfileRepository extends BaseTenantRepository<ProfileRecord> {
  constructor(db: Queryable) {
    super(db, 'profiles', 'Profile', [
      'id', 'user_id', 'lmp', 'edd', 'gestational_weeks', 'blood_group', 'created_at', 'updated_at'
    ]);
  }
}

export class ConsentLogRepository extends BaseTenantRepository<ConsentRecord> {
  constructor(db: Queryable) {
    super(db, 'consent_log', 'ConsentRecord', [
      'id', 'user_id', 'consent_version', 'categories', 'granted_at', 'revoked_at'
    ]);
  }
}

export * from './repository';
