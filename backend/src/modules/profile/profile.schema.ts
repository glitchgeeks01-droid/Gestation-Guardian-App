/**
 * Pregnancy Profile Schema (F3 & S7)
 * Scope: backend/src/modules/profile/profile.schema.ts
 */

import { z } from 'zod';

export const profileUpdateSchema = z.object({
  gestational_weeks: z.number().int('Gestational weeks must be an integer').min(1, 'Gestational week cannot be < 1').max(42, 'Gestational week cannot be > 42').optional(),
  lmp: z.string().optional(),
  edd: z.string().optional(),
  blood_group: z.string().max(10).optional()
});
