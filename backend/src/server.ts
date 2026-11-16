/**
 * Gestation Guardian - Production Server Bootstrapper
 * Standards: OWASP MASVS L2, HIPAA Security Rule
 * Scope: backend/src/server.ts
 */

import './middleware/zod_patch';
import { app } from './app';
import { env } from './config/env';

const PORT = env?.PORT || Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

export const server = app.listen(PORT, HOST, () => {
  console.log('================================================================================');
  console.log('🛡️  Gestation Guardian - Maternal Health Security API');
  console.log(`🚀 Server booted successfully on http://${HOST}:${PORT}`);
  console.log(`🔒 Compliance: OWASP MASVS L2 | HIPAA Security Rule | OWASP API Top 10`);
  console.log('================================================================================');
});

// Graceful Shutdown
function handleShutdown(signal: string) {
  console.log(`\nReceived ${signal}. Gracefully closing Gestation Guardian server...`);
  if (server && server.close) {
    server.close(() => {
      console.log('HTTP server closed cleanly. Exiting process.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

export default server;
