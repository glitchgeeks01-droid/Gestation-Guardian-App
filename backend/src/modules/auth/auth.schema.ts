/**
 * Authentication Schemas (F1 & S7)
 * Scope: backend/src/modules/auth/auth.schema.ts
 */

import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().min(5, 'Email must be at least 5 characters').optional(),
  phone: z.string().min(8, 'Phone number must be at least 8 characters').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters long')
}).refine(data => data.email || data.phone, {
  message: 'Either email or phone number must be provided for account creation.'
});

export const loginSchema = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().min(1, 'Password is required')
}).refine(data => data.email || data.phone, {
  message: 'Either email or phone number is required to log in.'
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'refreshToken is required')
});
