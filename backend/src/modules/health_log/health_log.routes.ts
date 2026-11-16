/**
 * Health Log Routes (F4 & S5, S7, S14)
 * Standards: OWASP API Security Top 10 (API1: BOLA, API4: Validation), HIPAA Security Rule (45 CFR § 164.312(a)(2)(iv))
 * Security Requirements Owned: S5 (Strict Tenant IDOR Protection), S7 (Clinical Validation), S14 (Envelope Encryption)
 * Scope: backend/src/modules/health_log/health_log.routes.ts
 */

import { Router } from '../../middleware/express_core';
import { requireAuth } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import { healthEntrySchema } from './health_log.schema';
import { HealthEntryRepository } from '../../db/index';
import { getOrCreateDatabasePool } from '../db_memory';
import { encryptField, decryptField, getActiveKeyVersion } from '../../core/crypto';
import { logAuditEvent, hashIpAddress } from '../../core/audit';

export const healthLogRouter = Router();

function serializeEntryWithDecryptedNotes(entry: any, userId: string) {
  let notes: string | null = null;
  if (entry.notes_encrypted) {
    try {
      notes = decryptField(entry.notes_encrypted, userId, 'notes');
    } catch {
      notes = null;
    }
  }

  return {
    id: entry.id,
    user_id: entry.user_id,
    entry_date: entry.entry_date,
    weight: entry.weight,
    systolic: entry.systolic,
    diastolic: entry.diastolic,
    symptoms: entry.symptoms,
    kick_count: entry.kick_count,
    mood: entry.mood,
    notes,
    key_version: entry.key_version,
    created_at: entry.created_at
  };
}

// GET /api/v1/health-log - List health entries for authenticated tenant
healthLogRouter.get(
  '/',
  requireAuth,
  async (req: any, res: any, next: (err?: any) => void) => {
    try {
      const db = getOrCreateDatabasePool();
      const healthRepo = new HealthEntryRepository(db);
      const userId = req.user.userId;

      const entries = await healthRepo.findAll(userId, { orderBy: 'entry_date', orderDirection: 'DESC' });
      const decrypted = entries.map(e => serializeEntryWithDecryptedNotes(e, userId));

      await logAuditEvent(db, {
        userId,
        action: 'READ',
        resourceType: 'health_entry',
        resourceId: entries[0]?.id || null,
        ipAddress: hashIpAddress(req.ip),
        status: 'SUCCESS'
      });

      res.status(200).json(decrypted);
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/v1/health-log - Create clinical health entry with AES-256-GCM envelope encryption
healthLogRouter.post(
  '/',
  requireAuth,
  validateBody(healthEntrySchema),
  async (req: any, res: any, next: (err?: any) => void) => {
    try {
      const db = getOrCreateDatabasePool();
      const healthRepo = new HealthEntryRepository(db);
      const userId = req.user.userId;

      const { notes, ...clinicalData } = req.body;
      const keyVersion = getActiveKeyVersion();

      // S14: Envelope Encrypt patient notes using AES-256-GCM + tenant AAD
      let notesEncrypted: any = null;
      if (notes && typeof notes === 'string' && notes.trim().length > 0) {
        notesEncrypted = encryptField(notes, userId, 'notes', keyVersion);
      }

      const created = await healthRepo.create(userId, {
        ...clinicalData,
        notes_encrypted: notesEncrypted,
        key_version: keyVersion,
        created_at: new Date().toISOString()
      });

      await logAuditEvent(db, {
        userId,
        action: 'CREATE',
        resourceType: 'health_entry',
        resourceId: created.id,
        ipAddress: hashIpAddress(req.ip),
        status: 'SUCCESS'
      });

      res.status(201).json(serializeEntryWithDecryptedNotes(created, userId));
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/v1/health-log/:id - Retrieve single health entry (S5 IDOR strict 404)
healthLogRouter.get(
  '/:id',
  requireAuth,
  async (req: any, res: any, next: (err?: any) => void) => {
    try {
      const db = getOrCreateDatabasePool();
      const healthRepo = new HealthEntryRepository(db);
      const userId = req.user.userId;
      const entryId = req.params.id;

      // S5: Enforces WHERE id = $1 AND user_id = $2; throws TenantNotFoundError if foreign
      const entry = await healthRepo.findByIdOrThrow(userId, entryId);

      await logAuditEvent(db, {
        userId,
        action: 'READ',
        resourceType: 'health_entry',
        resourceId: entry.id,
        ipAddress: hashIpAddress(req.ip),
        status: 'SUCCESS'
      });

      res.status(200).json(serializeEntryWithDecryptedNotes(entry, userId));
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/v1/health-log/:id - Delete single health entry (S5 IDOR strict 404)
healthLogRouter.delete(
  '/:id',
  requireAuth,
  async (req: any, res: any, next: (err?: any) => void) => {
    try {
      const db = getOrCreateDatabasePool();
      const healthRepo = new HealthEntryRepository(db);
      const userId = req.user.userId;
      const entryId = req.params.id;

      // S5: Enforces WHERE id = $1 AND user_id = $2; throws TenantNotFoundError if foreign
      await healthRepo.deleteOrThrow(userId, entryId);

      await logAuditEvent(db, {
        userId,
        action: 'DELETE',
        resourceType: 'health_entry',
        resourceId: entryId,
        ipAddress: hashIpAddress(req.ip),
        status: 'SUCCESS'
      });

      res.status(200).json({ success: true, message: 'Health entry deleted successfully.' });
    } catch (err) {
      next(err);
    }
  }
);
