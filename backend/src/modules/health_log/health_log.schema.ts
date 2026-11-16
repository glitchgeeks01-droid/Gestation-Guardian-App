/**
 * Clinical Health Entry Schema (F4 & S7)
 * Standards: OWASP API Security Top 10 (API4: Strict Validation), HIPAA Security Rule
 * Security Requirements Owned: S7 (Zod Clinical Ranges & SQL Injection Defense)
 * Scope: backend/src/modules/health_log/health_log.schema.ts
 */

import { z } from 'zod';

export const healthEntrySchema = z.object({
  entry_date: z.string().min(1, 'entry_date is required'),
  systolic: z.number().int('Systolic must be an integer').min(60, 'Systolic blood pressure cannot be < 60 mmHg').max(250, 'Systolic blood pressure cannot be > 250 mmHg'),
  diastolic: z.number().int('Diastolic must be an integer').min(30, 'Diastolic blood pressure cannot be < 30 mmHg').max(150, 'Diastolic blood pressure cannot be > 150 mmHg'),
  weight: z.number().min(30, 'Weight must be >= 30 kg').max(250, 'Weight must be <= 250 kg').optional(),
  gestational_weeks: z.number().int('Gestational weeks must be an integer').min(1, 'Gestational week cannot be < 1').max(42, 'Gestational week cannot be > 42').optional(),
  symptoms: z.array(z.string().max(200)).optional(),
  kick_count: z.number().int().min(0).max(100).optional(),
  mood: z.string().max(50).optional(),
  notes: z.string().max(2000).optional()
}).refine(data => data.diastolic <= data.systolic, {
  message: 'Diastolic blood pressure cannot exceed systolic blood pressure'
});
