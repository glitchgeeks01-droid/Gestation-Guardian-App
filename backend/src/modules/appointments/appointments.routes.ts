/**
 * Antenatal Appointments Routes (F5 & S5, S14)
 * Standards: OWASP API Security Top 10 (API1: BOLA), HIPAA Security Rule
 * Security Requirements Owned: S5 (Strict Tenant IDOR Protection), S14 (Envelope Encryption), F5 (Neutral Notification Preview)
 * Scope: backend/src/modules/appointments/appointments.routes.ts
 */

import { Router } from '../../middleware/express_core';
import { requireAuth } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import { appointmentCreateSchema } from './appointments.schema';
import { AppointmentRepository } from '../../db/index';
import { getOrCreateDatabasePool } from '../db_memory';
import { encryptField, decryptField, getActiveKeyVersion } from '../../core/crypto';
import { logAuditEvent, hashIpAddress } from '../../core/audit';

export const appointmentsRouter = Router();

// Constant privacy-preserving notification template (zero clinical PHI in push previews)
export const NEUTRAL_NOTIFICATION_PREVIEW = 'You have a reminder scheduled';

function serializeAppointment(appt: any, userId: string) {
  let notes: string | null = null;
  if (appt.notes_encrypted) {
    try {
      notes = decryptField(appt.notes_encrypted, userId, 'notes');
    } catch {
      notes = null;
    }
  }

  return {
    id: appt.id,
    user_id: appt.user_id,
    title: appt.title,
    scheduled_at: appt.scheduled_at,
    location: appt.location,
    notes,
    key_version: appt.key_version,
    notification_preview: NEUTRAL_NOTIFICATION_PREVIEW,
    created_at: appt.created_at
  };
}

// GET /api/v1/appointments - List antenatal appointments
appointmentsRouter.get(
  '/',
  requireAuth,
  async (req: any, res: any, next: (err?: any) => void) => {
    try {
      const db = getOrCreateDatabasePool();
      const apptRepo = new AppointmentRepository(db);
      const userId = req.user.userId;

      const records = await apptRepo.findAll(userId, { orderBy: 'scheduled_at', orderDirection: 'ASC' });
      const serialized = records.map(a => serializeAppointment(a, userId));

      await logAuditEvent(db, {
        userId,
        action: 'READ',
        resourceType: 'appointment',
        resourceId: records[0]?.id || null,
        ipAddress: hashIpAddress(req.ip),
        status: 'SUCCESS'
      });

      res.status(200).json(serialized);
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/v1/appointments - Create appointment with envelope encryption and neutral notification
appointmentsRouter.post(
  '/',
  requireAuth,
  validateBody(appointmentCreateSchema),
  async (req: any, res: any, next: (err?: any) => void) => {
    try {
      const db = getOrCreateDatabasePool();
      const apptRepo = new AppointmentRepository(db);
      const userId = req.user.userId;

      const { title, scheduled_at, location, notes } = req.body;
      const keyVersion = getActiveKeyVersion();

      let notesEncrypted: any = null;
      if (notes && typeof notes === 'string' && notes.trim().length > 0) {
        notesEncrypted = encryptField(notes, userId, 'notes', keyVersion);
      }

      const created = await apptRepo.create(userId, {
        title,
        scheduled_at,
        location: location || null,
        notes_encrypted: notesEncrypted,
        key_version: keyVersion,
        created_at: new Date().toISOString()
      });

      await logAuditEvent(db, {
        userId,
        action: 'CREATE',
        resourceType: 'appointment',
        resourceId: created.id,
        ipAddress: hashIpAddress(req.ip),
        status: 'SUCCESS'
      });

      res.status(201).json(serializeAppointment(created, userId));
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/v1/appointments/:id - Delete appointment (S5 IDOR strict 404)
appointmentsRouter.delete(
  '/:id',
  requireAuth,
  async (req: any, res: any, next: (err?: any) => void) => {
    try {
      const db = getOrCreateDatabasePool();
      const apptRepo = new AppointmentRepository(db);
      const userId = req.user.userId;
      const apptId = req.params.id;

      await apptRepo.deleteOrThrow(userId, apptId);

      await logAuditEvent(db, {
        userId,
        action: 'DELETE',
        resourceType: 'appointment',
        resourceId: apptId,
        ipAddress: hashIpAddress(req.ip),
        status: 'SUCCESS'
      });

      res.status(200).json({ success: true, message: 'Appointment deleted successfully.' });
    } catch (err) {
      next(err);
    }
  }
);
