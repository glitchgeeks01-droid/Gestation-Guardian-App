# Architectural Decisions & Security Deviations Record

Document: DECISIONS.md
Status: Approved Architectural Record
Last Updated: November 16, 2026

---

## 1. Architectural Stack Decisions

### Decision 1: Mobile Platform & Hybrid Client Architecture
- **Context:** The project specification recommends Flutter or a cross-platform mobile stack adhering strictly to MASVS L2 security controls (M1–M10).
- **Decision:** The mobile client is implemented via the hardened Android Native Shell (`android-app/`) coupled with high-performance TypeScript single-page components (`src/ts/`).
- **Security Translation:**
  - Token Storage: Handled via Android Keystore and Web Cryptography / Secure Storage API with platform hardware backed security.
  - Screenshot Protection: Android `FLAG_SECURE` (`WindowManager.LayoutParams.FLAG_SECURE`) applied in `MainActivity.kt`.
  - Local Storage: Encrypted storage utilizing SQLCipher and AES-GCM envelope encryption.
  - Asset Delivery: Served over virtual origin `https://appassets.androidplatform.net` via `androidx.webkit.WebViewAssetLoader` with `allowFileAccess = false` sandboxing.

### Decision 2: Backend Architecture & Runtime
- **Context:** Node.js 20 LTS with Express and TypeScript matches the security guide and OWASP API Top 10 patterns.
- **Decision:** The backend service is organized into strict layers:
  - `backend/src/config/env.ts`: Fail-fast Zod environment validator.
  - `backend/src/middleware/`: Security headers (Helmet), CORS, Rate limiting, Pino redaction, JWT authentication, and centralized error handling.
  - `backend/src/db/`: Parameterized PostgreSQL migrations and connection pools.
  - `backend/src/core/`: KMS envelope encryption (`crypto.ts`) and append-only audit logging (`audit.ts`).
  - `backend/src/modules/`: Feature modules for auth, consent, profile, health_log, appointments, documents, and privacy.

### Decision 3: Identity & Cryptographic Hashing
- **Context:** Secure credentials must resist GPU/ASIC brute-force attacks.
- **Decision:** Password hashing utilizes **Argon2id** with parameters $m=65536\text{ KiB}, t=3, p=4$.
- **Token Format:** RS256 JWT access tokens (15 minutes expiry) and cryptographically random rotating refresh tokens stored with SHA-256 hashes.

### Decision 4: Envelope Encryption & Key Management
- **Context:** Highly sensitive health entries and ultrasound scan files require field-level encryption at rest.
- **Decision:** AES-256-GCM envelope encryption using 256-bit Data Encryption Keys (DEKs) wrapped by a Master Key Encryption Key (KEK) managed in Cloud KMS (or local software KMS emulator in development). Payload schema tracks `key_version` to support seamless key rotation.

---

## 2. Security Requirements Traceability Matrix (Cross-Platform)

| Security ID | Requirement | Implementation in Architecture | Proof & Verification |
| :--- | :--- | :--- | :--- |
| **S1** | No secrets in code | `scripts/check.sh` regex scan, `.env.example` only | Automated pre-commit scanner |
| **S2** | Hardware token storage | Android Keystore / Keychain secure wrapper | Storage unit tests & clean storage grep |
| **S3** | Pinned dependencies & SBOM | Pinned `package.json`, CycloneDX SBOM, OSV audit | `npm audit` / CycloneDX output |
| **S4** | Argon2id & rotating JWTs | `argon2` npm library, 15m RS256 token, rotating tokens | Expired/reused token test suite |
| **S5** | Object-level authorization | Repository queries enforce `WHERE user_id = :userId` | 2-user test returns 404 for foreign IDs |
| **S6** | Rate limits | Express rate-limiter (5/15m auth, global IP limiter) | 6th attempt returns 429 |
| **S7** | Zod input validation | Zod schemas on body, params, query; parameterized SQL | Negative fuzz testing & SQL injection test |
| **S8** | HTTPS & Cert Pinning | TLS 1.3, HSTS headers, native pinning configuration | SSL Labs check & proxy rejection test |
| **S9** | Versioned consent & deletion | `consent_log` table, cryptographic account purge | E2E delete test verifying 0 residual records |
| **S10** | Screenshot & blur protection | `FLAG_SECURE` in `MainActivity.kt`, neutral alerts | WindowManager flag verification |
| **S11** | R8 & Obfuscation | `minifyEnabled true`, ProGuard rules in Android build | Decompilation symbol inspection |
| **S12** | Manifest sandboxing | `allowBackup="false"`, `debuggable="false"` | AndroidManifest.xml lint inspection |
| **S13** | Encrypted local database | SQLCipher / AES-GCM encrypted persistence | SQLite tool open test unreadable |
| **S14** | Field-level envelope encryption| AES-256-GCM in `crypto.ts` with `key_version` | Round-trip, tamper tag, and rotation tests |
| **S15** | Helmet & DTO whitelisting | Helmet middleware, strict CORS, generic errors | Header assert tests & mass assignment probe |
| **S16** | Append-only audit log | PostgreSQL `audit_log` table, Pino PHI log redaction | Audit row verification & log check |
| **S17** | Secure document upload | $10\text{ MB}$ cap, magic-byte MIME check, random keys | Executable upload rejection test |
