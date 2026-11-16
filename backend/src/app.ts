/**
 * Gestation Guardian - Core Express Application
 * Standards: OWASP MASVS L2, OWASP API Security Top 10, HIPAA Security Rule (45 CFR § 164.312)
 * Security Requirements Owned: S4, S6, S7, S9, S15, S17
 * Scope: backend/src/app.ts
 */

import './middleware/zod_patch';
import { createApp, ExpressApplication } from './middleware/express_core';
import { securityHeaders } from './middleware/security_headers';
import { cors } from './middleware/cors';
import { requestId } from './middleware/request_id';
import { bodyParser } from './middleware/body_parser';
import { apiRateLimiter } from './middleware/rate_limit';
import { errorHandler } from './middleware/error_handler';

// Feature Modules (F1 - F10)
import { authRouter } from './modules/auth/auth.routes';
import { consentRouter } from './modules/consent/consent.routes';
import { profileRouter } from './modules/profile/profile.routes';
import { healthLogRouter } from './modules/health_log/health_log.routes';
import { appointmentsRouter } from './modules/appointments/appointments.routes';
import { documentsRouter } from './modules/documents/documents.routes';
import { educationRouter } from './modules/education/education.routes';
import { warningSignsRouter } from './modules/warning_signs/warning_signs.routes';
import { privacyRouter } from './modules/privacy/privacy.routes';
import { settingsRouter } from './modules/settings/settings.routes';

// Ensure in-memory database fallback is available if pool not externally set
import { getOrCreateDatabasePool } from './modules/db_memory';
getOrCreateDatabasePool();

export function createApplication(): ExpressApplication {
  const app = createApp();

  // 1. S15: Helmet Security Headers (CSP, XFO: DENY, XCTO: nosniff, HSTS, strip X-Powered-By)
  app.use(securityHeaders);

  // 2. S15: Strict CORS Whitelisting
  app.use(cors);

  // 3. Request ID Correlation (crypto.randomUUID())
  app.use(requestId);

  // 4. S7: JSON Body Parser with strict 1 MB cap
  app.use(bodyParser);

  // 5. Health Check Endpoint (Public / Unthrottled)
  app.get('/health', (req: any, res: any) => {
    res.status(200).json({
      status: 'pass',
      service: 'gestation-guardian-backend',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  });

  app.get('/api/v1/health', (req: any, res: any) => {
    res.status(200).json({
      status: 'pass',
      service: 'gestation-guardian-backend',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  });

  // 6. S6: General API Rate Limiter (100 req / 15m) applied to API routes
  app.use('/api', apiRateLimiter.middleware());

  // 7. Mount Feature Modules (F1 - F10)
  app.use('/api/v1/auth', authRouter);                 // F1: Auth & Argon2id & Rotating Tokens
  app.use('/api/v1/consent', consentRouter);           // F2: Versioned Granular Consent
  app.use('/api/v1/profile', profileRouter);           // F3: Pregnancy Profile & DTO Filtering
  app.use('/api/v1/health-log', healthLogRouter);       // F4: Vitals & Field-Level Envelope Encryption
  app.use('/api/v1/appointments', appointmentsRouter); // F5: Antenatal Appointments & Neutral Preview
  app.use('/api/v1/documents', documentsRouter);       // F6: Magic-byte Uploads & Randomized Keys
  app.use('/api/v1/education', educationRouter);       // F7: WHO-aligned Guidance & Disclaimer
  app.use('/api/v1/warning-signs', warningSignsRouter);// F8: Obstetric Danger Signs & Hotline Dispatch
  app.use('/api/v1/privacy', privacyRouter);           // F9: Sovereign Purge & Structured Export
  app.use('/api/v1/settings', settingsRouter);         // F10: User Language & Notification Window

  // 8. S15: Centralized Security Error Handler (Never leaks internal traces, maps TenantNotFoundError to 404)
  app.use(errorHandler());

  return app;
}

export const app = createApplication();
export default app;
