/**
 * Pregnancy Profile Routes (F3 & S15, S5)
 * Standards: OWASP API Security Top 10 (API2: Broken Object Property Level Authorization), HIPAA Security Rule
 * Security Requirements Owned: S15 (Mass Assignment Prevention via DTO Whitelist), S5 (Strict Tenant Isolation)
 * Scope: backend/src/modules/profile/profile.routes.ts
 */

import { Router } from '../../middleware/express_core';
import { requireAuth } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import { filterProfileUpdateDTO } from '../../middleware/security_headers';
import { profileUpdateSchema } from './profile.schema';
import { ProfileRepository, TenantNotFoundError } from '../../db/index';
import { getOrCreateDatabasePool } from '../db_memory';
import { logAuditEvent, hashIpAddress } from '../../core/audit';

export const profileRouter = Router();

export function calculateClinicalMetrics(lmp?: string | null, edd?: string | null, explicitWeeks?: number | null) {
  let weeks = explicitWeeks;

  if (!weeks && lmp) {
    const lmpDate = new Date(lmp);
    if (!isNaN(lmpDate.getTime())) {
      const diffMs = Date.now() - lmpDate.getTime();
      const calc = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
      weeks = Math.max(1, Math.min(42, calc));
    }
  }

  if (!weeks && edd) {
    const eddDate = new Date(edd);
    if (!isNaN(eddDate.getTime())) {
      const diffMs = eddDate.getTime() - Date.now();
      const remainingWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
      weeks = Math.max(1, Math.min(42, 40 - remainingWeeks));
    }
  }

  const finalWeeks = weeks ? Math.max(1, Math.min(42, weeks)) : null;

  let trimester: number | null = null;
  if (finalWeeks) {
    if (finalWeeks <= 13) trimester = 1;
    else if (finalWeeks <= 27) trimester = 2;
    else trimester = 3;
  }

  return {
    gestational_weeks: finalWeeks,
    trimester
  };
}

// GET /api/v1/profile - Retrieve profile for authenticated user
profileRouter.get(
  '/',
  requireAuth,
  async (req: any, res: any, next: (err?: any) => void) => {
    try {
      const db = getOrCreateDatabasePool();
      const profileRepo = new ProfileRepository(db);
      const userId = req.user.userId;

      const profiles = await profileRepo.findAll(userId);
      if (profiles.length === 0) {
        throw new TenantNotFoundError('Profile');
      }

      const profile = profiles[0];
      const clinical = calculateClinicalMetrics(profile.lmp, profile.edd, profile.gestational_weeks);

      await logAuditEvent(db, {
        userId,
        action: 'READ',
        resourceType: 'profile',
        resourceId: profile.id,
        ipAddress: hashIpAddress(req.ip),
        status: 'SUCCESS'
      });

      res.status(200).json({
        ...profile,
        ...clinical
      });
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/v1/profile - Create or update profile with mass assignment prevention
profileRouter.put(
  '/',
  requireAuth,
  validateBody(profileUpdateSchema),
  async (req: any, res: any, next: (err?: any) => void) => {
    try {
      const db = getOrCreateDatabasePool();
      const profileRepo = new ProfileRepository(db);
      const userId = req.user.userId;

      // S15: Filter incoming payload to strictly whitelist allowed clinical fields
      const sanitizedPayload = filterProfileUpdateDTO(req.body);

      // Compute gestational weeks and trimester if not specified or to reconcile
      const clinical = calculateClinicalMetrics(
        sanitizedPayload.lmp,
        sanitizedPayload.edd,
        sanitizedPayload.gestational_weeks
      );

      if (clinical.gestational_weeks) {
        sanitizedPayload.gestational_weeks = clinical.gestational_weeks;
      }

      const existingProfiles = await profileRepo.findAll(userId);
      let record: any;

      const now = new Date().toISOString();

      if (existingProfiles.length === 0) {
        // Create new profile
        record = await profileRepo.create(userId, {
          ...sanitizedPayload,
          created_at: now,
          updated_at: now
        });

        await logAuditEvent(db, {
          userId,
          action: 'CREATE',
          resourceType: 'profile',
          resourceId: record.id,
          ipAddress: hashIpAddress(req.ip),
          status: 'SUCCESS'
        });
      } else {
        // Update existing profile
        const existing = existingProfiles[0];
        record = await profileRepo.updateOrThrow(userId, existing.id, {
          ...sanitizedPayload,
          updated_at: now
        });

        await logAuditEvent(db, {
          userId,
          action: 'UPDATE',
          resourceType: 'profile',
          resourceId: record.id,
          ipAddress: hashIpAddress(req.ip),
          status: 'SUCCESS'
        });
      }

      res.status(200).json({
        ...record,
        ...clinical
      });
    } catch (err) {
      next(err);
    }
  }
);
