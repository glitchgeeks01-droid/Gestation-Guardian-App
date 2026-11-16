/**
 * Authentication Routes (F1 & S4, S6)
 * Scope: backend/src/modules/auth/auth.routes.ts
 */

import { Router } from '../../middleware/express_core';
import { authRateLimiter } from '../../middleware/rate_limit';
import { validateBody } from '../../middleware/validate';
import { signupSchema, loginSchema, refreshTokenSchema } from './auth.schema';
import { authService } from './auth.service';

export const authRouter = Router();

// POST /api/v1/auth/signup
authRouter.post(
  '/signup',
  authRateLimiter.middleware(),
  validateBody(signupSchema),
  async (req: any, res: any, next: (err?: any) => void) => {
    try {
      const result = await authService.signup(req.body, req.ip);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/v1/auth/login
authRouter.post(
  '/login',
  authRateLimiter.middleware(),
  validateBody(loginSchema),
  async (req: any, res: any, next: (err?: any) => void) => {
    try {
      const result = await authService.login(req.body, req.ip);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/v1/auth/refresh
authRouter.post(
  '/refresh',
  validateBody(refreshTokenSchema),
  async (req: any, res: any, next: (err?: any) => void) => {
    try {
      const result = await authService.refreshTokens(req.body.refreshToken);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/v1/auth/logout
authRouter.post(
  '/logout',
  async (req: any, res: any, next: (err?: any) => void) => {
    try {
      const refreshToken = req.body?.refreshToken;
      const userId = req.user?.userId;
      const result = await authService.logout(refreshToken, userId);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
);
