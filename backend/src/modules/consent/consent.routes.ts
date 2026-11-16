/**
 * Granular Consent Log Routes (F2 & S9)
 * Standards: HIPAA Security Rule (45 CFR § 164.508), OWASP API Security Top 10
 * Security Requirements Owned: S9 (Versioned Granular Consent & Revocation)
 * Scope: backend/src/modules/consent/consent.routes.ts
 */

import { Router } from '../../middleware/express_core';
import { requireAuth } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import { z } from 'zod';
import { ConsentLogRepository } from '../../db/index';
import { getOrCreateDatabasePool } from '../db_memory';
import { logAuditEvent, hashIpAddress } from '../../core/audit';

export const consentRouter = Router();

// Zod schemas for consent grant and revocation
const grantConsentSchema = z.object({
  consent_version: z.string().min(1, 'consent_version is required'),
  categories: z.array(z.string().min(1)).min(1, 'At least one consent category must be specified')
});

const revokeConsentSchema = z.object({
  consent_id: z.string().optional()
});

// GET /api/v1/consent - Retrieve user consent history
consentRouter.get(
  '/',
  requireAuth,
  async (req: any, res: any, next: (err?: any) => void) => {
    try {
      const db = getOrCreateDatabasePool();
      const consentRepo = new ConsentLogRepository(db);
      const userId = req.user.userId;

      const records = await consentRepo.findAll(userId, { orderBy: 'granted_at', orderDirection: 'DESC' });

      await logAuditEvent(db, {
        userId,
        action: 'READ',
        resourceType: 'consent',
        resourceId: records[0]?.id || null,
        ipAddress: hashIpAddress(req.ip),
        status: 'SUCCESS'
      });

      res.status(200).json({
        active_consent: records.find(r => !r.revoked_at) || null,
        history: records
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/v1/consent - Record new versioned consent grant
consentRouter.post(
  '/',
  requireAuth,
  validateBody(grantConsentSchema),
  async (req: any, res: any, next: (err?: any) => void) => {
    try {
      const db = getOrCreateDatabasePool();
      const consentRepo = new ConsentLogRepository(db);
      const userId = req.user.userId;

      const record = await consentRepo.create(userId, {
        consent_version: req.body.consent_version,
        categories: req.body.categories,
        granted_at: new Date().toISOString(),
        revoked_at: null
      });

      await logAuditEvent(db, {
        userId,
        action: 'CONSENT_CHANGE',
        resourceType: 'consent',
        resourceId: record.id,
        ipAddress: hashIpAddress(req.ip),
        status: 'SUCCESS'
      });

      res.status(201).json(record);
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/v1/consent/revoke - Revoke active consent
consentRouter.post(
  '/revoke',
  requireAuth,
  validateBody(revokeConsentSchema),
  async (req: any, res: any, next: (err?: any) => void) => {
    try {
      const db = getOrCreateDatabasePool();
      const consentRepo = new ConsentLogRepository(db);
      const userId = req.user.userId;
      const consentId = req.body.consent_id;

      const now = new Date().toISOString();

      if (consentId) {
        await consentRepo.updateOrThrow(userId, consentId, { revoked_at: now });
      } else {
        // Revoke all active consents
        const activeRecords = await consentRepo.findAll(userId);
        for (const rec of activeRecords) {
          if (!rec.revoked_at) {
            await consentRepo.update(userId, rec.id, { revoked_at: now });
          }
        }
      }

      await logAuditEvent(db, {
        userId,
        action: 'CONSENT_CHANGE',
        resourceType: 'consent',
        resourceId: consentId || userId,
        ipAddress: hashIpAddress(req.ip),
        status: 'SUCCESS'
      });

      res.status(200).json({
        success: true,
        message: 'Consent revoked successfully.',
        revoked_at: now
      });
    } catch (err) {
      next(err);
    }
  }
);
