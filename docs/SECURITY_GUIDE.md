# Security Guide: Maternal Health & Telemonitoring Platform

Document: SECURITY_GUIDE.md
Classification: Cryptographic & Architecture Implementation Standard
Standards: OWASP MASVS Level 2, OWASP API Security Top 10, NIST SP 800-57, HIPAA Security Rule

---

## 1. Mobile Security Architecture (M1–M10)

### M1: Secret Management & Hardcoded Secret Prohibition
- Zero API keys, database credentials, JWT secrets, or cryptographic seeds in source code, asset files, or compiled binaries (`APK`/`AAB`).
- All configurations injected via environment variables and secret stores.
- Pre-commit secret scanning enforced via automated git hooks.

### M2: Dependency Supply Chain Security
- All package versions pinned to exact semantic versions.
- CycloneDX Software Bill of Materials (SBOM) generated on each build.
- Continuous vulnerability scanning via Open Source Vulnerabilities (OSV) database. Zero ad or third-party behavioral analytics tracking SDKs permitted.

### M3: Authentication & Token Lifecycle
- Passwords hashed using Argon2id ($m=65536\text{ KiB}, t=3\text{ iterations}, p=4\text{ lanes}$).
- Access tokens valid for 15 minutes, signed with RS256 private key.
- Refresh tokens generated with 32 cryptographically secure random bytes, hashed with SHA-256 before storage, and rotated upon every exchange. Replay attacks revoke the entire token family.

### M4: Cryptographic Key Storage
- Encryption keys and authentication tokens stored exclusively in hardware-backed security modules: Android Keystore (`KeyStore` with `MasterKey`) and iOS Keychain (`kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly`).
- Cleartext tokens never stored in `SharedPreferences`, `NSUserDefaults`, or unencrypted SQLite files.
- Tokens wiped completely upon logout or session invalidation.

### M5: Network & Transport Layer Security
- HTTPS / TLS 1.3 mandatory with HTTP Strict Transport Security (`HSTS`).
- Dynamic Certificate Pinning implemented with primary and backup leaf/intermediate SHA-256 public key hashes.
- Cleartext traffic explicitly disabled in Android Network Security Config (`cleartextTrafficPermitted="false"`) and iOS App Transport Security (`NSAllowsArbitraryLoads = false`).

### M6: Physical & Visual Privacy Safeguards
- Android WindowManager `FLAG_SECURE` enabled on all clinical and health profile screens to prevent screenshotting, video capture, and recent apps preview leakage.
- iOS background blur applied on `applicationWillResignActive`.
- Neutral notification text: Push notifications and local reminder alerts display generic copy ("You have a scheduled reminder") with zero health data or condition disclosure.

### M7: Binary Integrity & Code Obfuscation
- R8 / ProGuard enabled in release builds with symbol stripping and class renaming.
- Native anti-tampering: Play Integrity API (Android) and DeviceCheck / App Attest (iOS) verified by the backend before issuing session tokens.

### M8: Operating System Sandboxing & Attack Surface Reduction
- `android:allowBackup="false"` in AndroidManifest to prevent ADB backup extraction.
- `android:debuggable="false"` strictly enforced.
- Only the main splash/entry activity exported (`android:exported="true"`); all other activities, receivers, and providers non-exported.

### M9: At-Rest Database Encryption (SQLCipher)
- Local client database encrypted with SQLCipher using 256-bit AES in CBC mode with PBKDF2 key derivation.
- Database encryption key generated randomly and protected inside Android Keystore / iOS Keychain.
- Zero personal health information written to logcat, system clipboard, or crash reports.

### M10: Field-Level Envelope Encryption
- Highly sensitive Restricted fields (e.g., medical notes, ultrasound diagnosis) protected via envelope encryption:
  $$\text{Ciphertext} = \text{AES-256-GCM}(\text{DEK}, \text{Plaintext}, \text{IV}, \text{AAD})$$
- Data Encryption Key (DEK) encrypted by Key Encryption Key (KEK) managed in Cloud KMS.
- Stored payload format: `{"key_version": 1, "iv": "...", "auth_tag": "...", "ciphertext": "...", "wrapped_dek": "..."}`.

---

## 2. API & Backend Security Architecture (API1–API8)

### API1: Object-Level Authorization (BOLA / IDOR Prevention)
- The backend enforces tenant isolation at the query layer. Every database query filters by the authenticated `user_id`:
  ```sql
  SELECT * FROM health_entries WHERE id = :entryId AND user_id = :authenticatedUserId;
  ```
- If an entity belongs to a foreign user or does not exist, the API returns HTTP `404 Not Found` (never `403 Forbidden`) to eliminate object existence enumeration.

### API2: Broken Object Property Level Authorization
- Request and response Data Transfer Objects (DTOs) enforce strict field whitelisting. Mass assignment is prohibited.
- Sensitive internal properties (`password_hash`, `refresh_token_hash`, `key_encryption_key_id`) are never exposed in API responses.

### API3: Rate Limiting & Denial of Service Defense
- Authentication and OTP endpoints enforced with a strict rate limit of 5 requests per 15-minute window per IP/phone number.
- Global per-IP rate limits protect against DDoS.
- Request payload body size capped at $1\text{ MB}$ for JSON, $10\text{ MB}$ for encrypted multipart uploads.

### API4: Strict Input Validation & Parameterized Queries
- Every incoming payload (body, query parameters, route parameters) validated through strict Zod schemas with regex constraints, type checks, and clinical ranges.
- Zero dynamic SQL concatenation; 100% of queries use parameterized prepared statements.

### API5: Security Headers & CORS Enforcement
- Helmet middleware enforces modern HTTP headers:
  - `Content-Security-Policy: default-src 'self'`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- CORS configured with explicit origin whitelists; wildcard `*` strictly disallowed.

### API6: Error Handling & Diagnostic Sanitization
- Centralized Express error-handling middleware intercepts all exceptions.
- Stack traces, database internal schemas, and framework versions never returned to clients.
- Clients receive a standardized JSON response: `{"error": "Internal Error", "code": "INTERNAL_SERVER_ERROR", "requestId": "..."}`.

### API7: Tamper-Evident Audit Logging
- Dedicated, append-only PostgreSQL table `audit_log` records:
  - `timestamp`: UTC ISO-8601
  - `user_id`: UUID
  - `action`: `READ`, `CREATE`, `UPDATE`, `DELETE`, `CONSENT_CHANGE`, `EXPORT`
  - `resource_type`: `profile`, `health_entry`, `document`, `consent`
  - `resource_id`: Entity identifier
  - `ip_address`: Hashed/pseudonymized client IP
  - `status`: `SUCCESS` or `FAILURE`
- All application logs processed through Pino with redaction filters scrubbing passwords, tokens, and vital readings.

### API8: Secure Media & Document Upload Pipeline
- Signed temporary upload URLs (expiry: 5 minutes) granted for document uploads.
- Uploaded binary verified via magic-byte inspection on the first 512 bytes to confirm valid PDF (`%PDF`), JPEG (`0xFFD8FF`), or PNG (`0x89504E47`) headers.
- File size strictly capped at $10\text{ MB}$.
- Files stored with UUID v4 random names in private, non-public S3/GCS buckets with server-side encryption enabled.
