/**
 * User Settings & Preferences Routes (F10)
 * Standards: OWASP API Security Top 10, HIPAA Security Rule
 * Security Requirements Owned: F10 (Language, Quiet Hours Notification Window, Biometric Lock Preference)
 * Scope: backend/src/modules/settings/settings.routes.ts
 */

import { Router } from '../../middleware/express_core';
import { requireAuth } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import { z } from 'zod';
import { getOrCreateDatabasePool } from '../db_memory';

export const settingsRouter = Router();

const updateSettingsSchema = z.object({
  language: z.string().min(2).max(10).optional(),
  notificationWindow: z.object({
    start: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid 24h time format (HH:MM)'),
    end: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid 24h time format (HH:MM)')
  }).optional(),
  biometricLock: z.boolean().optional()
});

const DEFAULT_SETTINGS = {
  language: 'en',
  notificationWindow: {
    start: '09:00',
    end: '18:00'
  },
  biometricLock: true
};

// In-memory cache for user settings
const settingsCache = new Map<string, typeof DEFAULT_SETTINGS>();

// GET /api/v1/settings - Retrieve user preferences
settingsRouter.get(
  '/',
  requireAuth,
  (req: any, res: any) => {
    const userId = req.user.userId;
    const settings = settingsCache.get(userId) || DEFAULT_SETTINGS;
    res.status(200).json(settings);
  }
);

// PUT /api/v1/settings - Update user preferences
settingsRouter.put(
  '/',
  requireAuth,
  validateBody(updateSettingsSchema),
  (req: any, res: any) => {
    const userId = req.user.userId;
    const existing = settingsCache.get(userId) || DEFAULT_SETTINGS;

    const updated = {
      language: req.body.language !== undefined ? req.body.language : existing.language,
      notificationWindow: req.body.notificationWindow !== undefined ? req.body.notificationWindow : existing.notificationWindow,
      biometricLock: req.body.biometricLock !== undefined ? req.body.biometricLock : existing.biometricLock
    };

    settingsCache.set(userId, updated);
    res.status(200).json(updated);
  }
);
