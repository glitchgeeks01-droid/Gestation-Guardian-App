# Agent Instructions: Security-First Maternal Health & Pregnancy Application (MVP)

Document: AGENT_INSTRUCTIONS.md
Classification: Internal Engineering Standard
Author: Lead Principal AI Architect (Opus Persona)
Standards Compliance: OWASP MASVS L2, OWASP API Security Top 10, HIPAA Security Rule (45 CFR § 164.312)

---

## 1. Product Scope & Functional Requirements (F1–F10)

### 1.1 User Roles
- **Patient (Pregnant User):** Manages own pregnancy profile, clinical health logs, vital observations, appointments, uploaded scan documents; gives, audits, or withdraws consent; exports or deletes account and health records under sovereign data controls.
- **Doctor / Healthcare Provider (Phase 2):** Read-only telemetry access to specific patients who have granted explicit, active, revocable pairing access; adds clinical observation notes.
- **Administrator:** Manages educational content and system operational settings; zero access to patient personal health information (PHI) or cryptographic keys.

### 1.2 Feature Requirements
- **F1 (Authentication & Session):** Phone OTP or email + password (Argon2id), optional MFA, biometric unlock on app resume. 15-minute access token, rotating refresh tokens.
- **F2 (Informed Consent):** Versioned, granular consent records stored immutably for health-data processing; can be revoked at any time.
- **F3 (Pregnancy Profile):** Last Menstrual Period (LMP) or Estimated Due Date (EDD); dynamic calculation of gestational weeks (1–42) and clinical trimester.
- **F4 (Clinical Health Log):** Weight ($30\text{--}250\text{ kg}$), Blood Pressure ($60\text{--}250\text{ mmHg}$ systolic, $30\text{--}150\text{ mmHg}$ diastolic), symptoms, kick counts ($28+\text{ weeks}$), and mood.
- **F5 (Appointments & Reminders):** Antenatal visits, medication schedules, lab tests. Local notifications strictly enforce neutral text (e.g., "You have a reminder scheduled") without leaking clinical conditions.
- **F6 (Encrypted Diagnostic Documents):** Upload of ultrasound scans, lab panels (PDF, JPEG, PNG up to $10\text{ MB}$), envelope-encrypted at rest in private storage.
- **F7 (Education & Guidelines):** Week-by-week evidence-based clinical articles citing WHO standards with prominent medical disclaimers.
- **F8 (Obstetric Warning Signs):** Static, instant-access directory of clinical danger signs with one-touch emergency calling. No automated medical diagnosis.
- **F9 (Privacy Centre & Sovereign Purge):** JSON/PDF patient data export, complete cryptographic account deletion (wiping database rows, storage objects, and local caches), consent history log, and discreet mode toggle.
- **F10 (Settings & Local Hardening):** Language preference, notification delivery windows, biometric lock toggle, auto-lock timeout.

---

## 2. Non-Negotiable Security Requirements (S1–S17)

- **S1:** Zero secrets in source code or compiled binaries. Secret scanner (`gitleaks`/`trufflehog`) passes clean.
- **S2:** Tokens stored exclusively in Android Keystore / iOS Keychain; wiped on logout.
- **S3:** Pinned dependencies, CycloneDX SBOM generation, OSV vulnerability scan, zero ad/analytics tracking SDKs.
- **S4:** Argon2id hashing ($m=65536, t=3, p=4$), 15m JWT access tokens, cryptographically random rotating refresh tokens.
- **S5:** Object-level authorization (BOLA/IDOR prevention). Every query filters `user_id = :userId`. Foreign access returns strict `404 Not Found`.
- **S6:** Rate limits: 5 attempts per 15 minutes for auth endpoints; global per-IP protection.
- **S7:** Strict Zod schema validation on body, query, and parameters; parameterized SQL only.
- **S8:** TLS 1.3 / HTTPS with HSTS; SSL certificate pinning with backup pins.
- **S9:** Explicit versioned consent log; complete account deletion and sovereign data export E2E.
- **S10:** Screenshot prevention (`FLAG_SECURE`), task-switcher blur, discreet mode, neutral notification text.
- **S11:** R8 obfuscation in release builds; Play Integrity / App Attest verification prior to token issuance.
- **S12:** Native manifest hardening: `android:allowBackup="false"`, `android:debuggable="false"`, minimal permissions.
- **S13:** Local database encrypted with SQLCipher; keys wrapped by platform Keystore; no PHI in device logs or clipboard.
- **S14:** AES-256-GCM field-level envelope encryption for Restricted fields with `key_version` and Cloud KMS integration.
- **S15:** Helmet HTTP security headers, strict CORS, generic error responses, response DTOs stripping internal fields.
- **S16:** Append-only audit log tracking reads, exports, consent changes, and deletions; Pino log scrubber redacting sensitive fields.
- **S17:** Secure upload pipeline: $10\text{ MB}$ limit, magic-byte MIME validation, randomized storage keys, private storage buckets.
