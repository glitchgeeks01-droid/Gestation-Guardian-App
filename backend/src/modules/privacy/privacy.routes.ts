/**
 * Sovereign Data Privacy & Purge Routes (F9 & S9)
 * Standards: HIPAA Security Rule (45 CFR § 164.524 - Right of Access), GDPR Article 17 (Right to Erasure / Sovereign Purge)
 * Security Requirements Owned: S9 (Consent & Sovereign Purge, Portable Structured Health Export)
 * Scope: backend/src/modules/privacy/privacy.routes.ts
 */

import { Router } from '../../middleware/express_core';
import { requireAuth } from '../../middleware/auth';
import {
  HealthEntryRepository,
  ProfileRepository,
  AppointmentRepository,
  DocumentRepository,
  ConsentLogRepository
} from '../../db/index';
import { getOrCreateDatabasePool } from '../db_memory';
import { decryptField } from '../../core/crypto';
import { logAuditEvent, hashIpAddress } from '../../core/audit';
import { sanitizeUserResponseDTO } from '../../middleware/security_headers';

export const privacyRouter = Router();

// GET /api/v1/privacy/export - Portable Structured Patient Health Export (HIPAA & GDPR Access)
privacyRouter.get(
  '/export',
  requireAuth,
  async (req: any, res: any, next: (err?: any) => void) => {
    try {
      const db = getOrCreateDatabasePool();
      const userId = req.user.userId;

      const healthRepo = new HealthEntryRepository(db);
      const profileRepo = new ProfileRepository(db);
      const apptRepo = new AppointmentRepository(db);
      const docRepo = new DocumentRepository(db);
      const consentRepo = new ConsentLogRepository(db);

      // 1. Fetch user metadata
      const userRes = await db.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [userId]);
      const user = userRes.rows[0] ? sanitizeUserResponseDTO(userRes.rows[0]) : null;

      // 2. Fetch profile
      const profiles = await profileRepo.findAll(userId);
      const profile = profiles[0] || null;

      // 3. Fetch health entries and decrypt notes for the patient
      const healthEntries = await healthRepo.findAll(userId, { orderBy: 'entry_date', orderDirection: 'DESC' });
      const decryptedHealthEntries = healthEntries.map(e => {
        let notes: string | null = null;
        if (e.notes_encrypted) {
          try {
            notes = decryptField(e.notes_encrypted, userId, 'notes');
          } catch {
            notes = null;
          }
        }
        return {
          id: e.id,
          entry_date: e.entry_date,
          weight: e.weight,
          systolic: e.systolic,
          diastolic: e.diastolic,
          symptoms: e.symptoms,
          kick_count: e.kick_count,
          mood: e.mood,
          notes,
          created_at: e.created_at
        };
      });

      // 4. Fetch appointments and decrypt notes
      const appointments = await apptRepo.findAll(userId, { orderBy: 'scheduled_at' });
      const decryptedAppointments = appointments.map(a => {
        let notes: string | null = null;
        if (a.notes_encrypted) {
          try {
            notes = decryptField(a.notes_encrypted, userId, 'notes');
          } catch {
            notes = null;
          }
        }
        return {
          id: a.id,
          title: a.title,
          scheduled_at: a.scheduled_at,
          location: a.location,
          notes,
          created_at: a.created_at
        };
      });

      // 5. Fetch documents
      const documents = await docRepo.findAll(userId);

      // 6. Fetch consent log
      const consentLog = await consentRepo.findAll(userId, { orderBy: 'granted_at', orderDirection: 'DESC' });

      // Audit log S16 EXPORT event
      await logAuditEvent(db, {
        userId,
        action: 'EXPORT',
        resourceType: 'profile',
        resourceId: userId,
        ipAddress: hashIpAddress(req.ip),
        status: 'SUCCESS'
      });

      const exportPayload = {
        exported_at: new Date().toISOString(),
        version: '1.0.0',
        user,
        pregnancy_profile: profile,
        clinical_vitals_history: decryptedHealthEntries,
        antenatal_appointments: decryptedAppointments,
        diagnostic_documents: documents,
        consent_records: consentLog
      };

      res.status(200).json(exportPayload);
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/v1/privacy/delete-account - Sovereign Purge (Irreversible Cascading Deletion)
privacyRouter.post(
  '/delete-account',
  requireAuth,
  async (req: any, res: any, next: (err?: any) => void) => {
    try {
      const db = getOrCreateDatabasePool();
      const userId = req.user.userId;

      // Log Sovereign Purge audit event before purging records
      await logAuditEvent(db, {
        userId,
        action: 'DELETE',
        resourceType: 'user',
        resourceId: userId,
        ipAddress: hashIpAddress(req.ip),
        status: 'SUCCESS'
      });

      // Cascading Sovereign Purge across all tenant tables
      const healthRepo = new HealthEntryRepository(db);
      const profileRepo = new ProfileRepository(db);
      const apptRepo = new AppointmentRepository(db);
      const docRepo = new DocumentRepository(db);
      const consentRepo = new ConsentLogRepository(db);

      await healthRepo.deleteAllForUser(userId);
      await profileRepo.deleteAllForUser(userId);
      await apptRepo.deleteAllForUser(userId);
      await docRepo.deleteAllForUser(userId);
      await consentRepo.deleteAllForUser(userId);

      // Purge settings
      await db.query('DELETE FROM settings WHERE user_id = $1', [userId]);

      // Purge user record
      await db.query('DELETE FROM users WHERE id = $1', [userId]);

      res.status(200).json({
        success: true,
        message: 'All personal health data and account successfully purged.',
        purgedAt: new Date().toISOString()
      });
    } catch (err) {
      next(err);
    }
  }
);
