/**
 * Appointments Schema (F5 & S7)
 * Scope: backend/src/modules/appointments/appointments.schema.ts
 */

import { z } from 'zod';

export const appointmentCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  scheduled_at: z.string().min(1, 'scheduled_at is required'),
  location: z.string().max(255).optional(),
  notes: z.string().max(2000).optional()
});
