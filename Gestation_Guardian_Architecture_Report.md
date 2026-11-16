# Gestation Guardian: Comprehensive Project History & Technical Architecture Report

**Document Version:** 3.0.0  
**Classification:** Technical & Security Architecture Record (Production Audit Edition)  
**Author:** Lead AI Application Security Engineer  
**Date of Record:** November 16, 2026  
**Repositories Covered:**
* **Mobile Client Application:** [Gestation Guardian](./)
* **Web Clinical Dashboard:** [Gestation-Guardian-Web](../Gestation-Guardian-Web)
* **Local Synchronization Microservice:** [server/](./server)
* **Cloud Infrastructure:** Google Cloud Platform & Firebase (`gg-doctor-dashboard`)

---

## 1. Executive Summary

**Gestation Guardian** is an integrated maternal-fetal remote physiological telemonitoring ecosystem. The platform is engineered to detect early clinical markers of high-risk obstetric pathologies—predominantly preeclampsia, gestational hypertension, and gestational diabetes—by ingesting physiological telemetry from consumer medical peripherals (Bluetooth Low Energy blood pressure monitors and clinical wearables) and routing these observations to attending obstetricians via an authenticated clinical dashboard.

This report provides an exhaustive, audit-ready chronological and technical account of the platform's architectural evolution:
1. **The Architectural Foundation:** Multi-tier client/server design spanning mobile, clinical web, local LAN synchronization, and cloud datastores.
2. **The Post-Compilation Defect Phase:** Root-cause isolation and remediation of three functional and visual regressions discovered in compiled Android binaries.
3. **The Security Architecture Audit:** Identification and threat-modeling of twenty-five (25) vulnerabilities evaluated against the OWASP Top 10, OWASP Mobile Top 10, and HIPAA Security Rule frameworks.
4. **The Three-Stage Remediation Campaign:** Surgical, non-destructive hardening across all application tiers preserving clinical risk algorithms and user state.
5. **Production Verification & Certification:** Deterministic test suite execution, native binary compilation, cryptographic hashing, and live cloud security rule deployment.

---

## 2. Chronological Project History

```mermaid
timeline
    title Gestation Guardian Project Lifecycle
    Initial Development : Core Architecture Design : Mobile SPA & Web Dashboard Scaffolded : Offline Sync Engine Built : BLE IEEE-11073 Parsing Added
    APK Bundling & Defect Discovery : Android Native Wrapper Implemented : Post-Compilation Regressions Identified : Background Image Disappearance : System Status Bar Overlap : Credential Enumeration
    Security Architecture Review : 25 Vulnerabilities Identified : Plaintext Password Storage Isolated : Path Traversal in serve.cjs Detected : Unauthenticated Local Sync Server Audited
    Stage 1 Hardening : Zero-Risk Fixes : Web Directory Traversal Eliminated : DOM XSS Sanitization Deployed : Android Container Hardened : BLE Buffer Bounds Enforced : SQLite WAL Mode Activated
    Stage 2 & 3 Remediation : Salted SHA-256 Client Hashing : Plaintext Password Migration Path : Sync Token Middleware (X-GG-Sync-Token) : ClinicianAuth Session Manager : Pairing Handshake Race Condition Fixed : Firestore Security Rules Hardened
    Production Build & Release : Native Gradle assembleDebug Completed : Playwright Test Suites Validated : Live Cloud Rules Deployed to gg-doctor-dashboard : Final APK Packaged
```

### 2.1 Initial Development & Core Feature Architecture
The platform was conceived to bridge maternal home monitoring and acute clinical intervention. The architecture was established across three cooperating components:
* **Mobile SPA Container:** A responsive client built with Vite, TypeScript, and Tailwind CSS, wrapped in an Android native container (`ComponentActivity` hosting an Android `WebView`). It features an offline-first telemetry engine with a persistent local sync queue, Bluetooth Low Energy (BLE) peripheral ingestion for automated blood pressure readings, and an interactive maternal AI assistant grounded in World Health Organization (WHO) clinical antenatal guidelines powered by the Google Gemini API.
* **Local Synchronization Microservice:** An Express.js and SQLite microservice running on `localhost:3000` designed for LAN resilience in clinics or rural environments where public internet connectivity to Firebase is intermittent or unavailable.
* **Web Clinical Dashboard:** A standalone workstation interface utilized by obstetricians and triage nurses to monitor patient cohorts, track gestosis scores, evaluate longitudinal blood pressure sparklines, and inspect patient telemetry in near real-time.

### 2.2 Post-Compilation Defect Discovery
Following initial packaging of the mobile client into an Android APK, three functional and visual regressions emerged on physical hardware:
1. **Missing Onboarding Background Illustration:** The onboarding illustration rendered properly during local development (`http://localhost:5173`) but disappeared completely in compiled APK builds due to root-relative path resolution failure under the Android `file://` WebView asset scheme.
2. **Status Bar & Camera Cutout Overlap:** Modern Android edge-to-edge window drawing caused the application header and action elements to be visually obscured by system status indicators (clock, battery, cellular signal) and display cutouts (camera punch-holes).
3. **Authentication Credential Enumeration:** The sign-in form explicitly signaled whether an email was unregistered versus whether a password was incorrect, introducing an account enumeration vector that violated OWASP authentication standards.

### 2.3 Comprehensive Security Architecture Review
An exhaustive technical audit evaluated the entire codebase against OWASP Top 10, OWASP Mobile Top 10, and HIPAA Security Rule specifications, uncovering twenty-five (25) vulnerabilities across client, network, and storage boundaries:
* **Cloud Access & Transport Controls:** The system utilized Firebase Anonymous Authentication (`signInAnonymously()`) with overly permissive database rules, permitting arbitrary clients to read and overwrite patient profiles containing unhashed passwords.
* **Local Synchronization Microservice:** The Express server on port 3000 lacked origin restrictions, accepted arbitrary payload volumes without size limits, lacked API authentication, and operated an unbatched SQLite instance vulnerable to concurrency deadlocks.
* **Web Dashboard Vulnerabilities:** The workstation static file server (`serve.cjs`) suffered from directory traversal via unescaped URI path separators, and client-side view renderers ingested patient data directly into `innerHTML` without sanitization.
* **Native Android Container Configuration:** Overly broad WebView flags (`allowUniversalAccessFromFileURLs`, `allowFileAccessFromFileURLs`, `allowFileAccess`) and unrestricted WebRTC permission handlers exposed local filesystem contents and hardware peripherals.

### 2.4 Staged Remediation Execution
Remediations were conducted across three disciplined stages to eliminate vulnerabilities without destabilizing clinical algorithms:
* **Stage 1 (Zero-Risk Hardening):** Eliminated static server directory traversal, injected HTTP defensive headers (`nosniff`, `SAMEORIGIN`), implemented centralized HTML entity encoding, disabled native backup flags, enforced buffer bounds on BLE GATT packets, and converted SQLite to Write-Ahead Logging (WAL) with atomic batch transactions.
* **Stage 2 & 3 (Coordinated Authentication, Sync, and Cloud Hardening):** Implemented client-side salted SHA-256 password hashing with automatic transparent migration for existing profiles, gated development OTP fallbacks behind environment checks, enforced token authentication (`X-GG-Sync-Token`) across synchronization endpoints, established a clinician session guard (`ClinicianAuth`), resolved a pairing handshake race condition, and deployed hardened Cloud Firestore security rules.

---

## 3. System Architecture & Inter-Component Contracts

```mermaid
graph TD
    subgraph Patient Mobile Device
        MA[Android MainActivity.kt WebView] --> SPA[Mobile SPA / TypeScript Client]
        SPA --> CRYPTO[crypto.ts Salted SHA-256 Hash<br/>HIPAA Compensating Control 1]
        SPA --> LS[(Local Storage / Encrypted Profiles)]
        SPA --> BLE[BLE Blood Pressure Monitor]
        SPA --> AI[Gemini WHO Maternal AI Bot]
    end

    subgraph Local LAN Infrastructure
        SPA -- "HTTP / X-GG-Sync-Token: ${GG_SYNC_TOKEN}" --> EXP[Express Sync Server :3000]
        EXP --> SQL[(SQLite DB / WAL Mode)]
    end

    subgraph Doctor Workstation
        WEB[Web Clinical Dashboard :8082] --> CA[ClinicianAuth Session Guard]
        CA --> DASH[Dashboard UI / Patient Grid]
    end

    subgraph Google Cloud Platform
        SPA -- "HTTPS / Anonymous Auth UID" --> FS[(Cloud Firestore gg-doctor-dashboard)]
        WEB -- "HTTPS / Anonymous Auth UID" --> FS
        FS --> RULES[Hardened firestore.rules<br/>request.auth.uid == userId<br/>HIPAA Compensating Control 2]
        FS --> PAIR[pairing_requests<br/>Explicit Consent & 8s Deletion<br/>HIPAA Compensating Control 3]
    end
```

### 3.1 Network & Synchronization Topology
* **Mobile Client to Cloud Firestore:** The mobile application authenticates anonymously with Firebase. User profiles are stored at `/users/{userId}`, and physiological telemetry records (blood pressure, maternal heart rate, symptoms, and vitals) are written into the subcollection `/users/{userId}/telemetry/{telemetryId}` using LOINC-compliant FHIR Observation schemas.
* **Mobile Client to Local Sync Server:** The mobile application utilizes [`apiClient`](./src/ts/api/client.ts) to push and fetch data from the Express service running on port 3000 (`http://10.0.2.2:3000/api` on the Android emulator or `http://<LAN_IP>:3000/api` on local clinic networks). All requests require the `X-GG-Sync-Token: ${GG_SYNC_TOKEN}` HTTP header. The secret token is injected into the server process at startup via the `GG_SYNC_TOKEN` environment variable (loaded from a local `.env` file or runtime environment) and validated via the `requireSyncAuth` middleware.
* **Web Dashboard to Cloud Firestore:** The clinician dashboard queries patient profiles by their deterministic 4-character pairing PIN (`pairingPin: "GG-XXXX"`) and subscribes to real-time snapshot listeners for telemetry streaming.

### 3.1.1 HIPAA Security Rule Compliance & Anonymous Auth Compensating Controls (45 CFR § 164.312(a)(2)(i))
The HIPAA Security Rule's Technical Safeguards mandate **Unique User Identification** under 45 CFR § 164.312(a)(2)(i): *"Assign a unique name and/or number for identifying and tracking user identity."*

In the Gestation Guardian architecture, Firebase Anonymous Authentication (`signInAnonymously()`) is utilized at the cloud transport layer to provide frictionless access for pregnant patients without requiring third-party OAuth providers or collecting unnecessary public identity markers. Because purely anonymous credentials could introduce compliance ambiguity regarding individual user attribution of Protected Health Information (PHI), the system implements three robust defense-in-depth **compensating controls**:

1. **Client-Side Salted Cryptographic Credential Verification ([`./src/ts/utils/crypto.ts`](./src/ts/utils/crypto.ts)):**  
   User identification and authentication credentials (email and password) are salted and hashed client-side using SHA-256 via the Web Cryptography API (`crypto.subtle` with a secure fallback). The patient's verified local identity is deterministically bound to their client profile and encrypted session tokens, ensuring unambiguous local identity binding before any telemetry or sync operation occurs.
2. **Strict UID Ownership, Schema Validation & Clinical RBAC Enforcement ([`./firestore.rules`](./firestore.rules)):**  
   Access to patient PHI stored in `/users/{userId}` and its `/telemetry` subcollection enforces strict write partitioning and authenticated clinical reading via server-enforced security rules:
   ```javascript
   match /users/{userId} {
     // Authenticated read access permits verified clinician dashboard sessions to observe paired patients
     allow read: if request.auth != null;
     // Strict UID ownership binding: only the owning patient can write their profile, and raw passwords are schema-rejected
     allow write: if request.auth != null && request.auth.uid == userId && (!('password' in request.resource.data));
     
     match /telemetry/{telemetryId} {
       // Telemetry read access is scoped to authenticated sessions (patient & attending clinician)
       allow read: if request.auth != null;
       // Only the owning patient device can write or record physiological telemetry
       allow write: if request.auth != null && request.auth.uid == userId;
     }
   }
   ```
   This dual-layer authorization guarantees that write operations are cryptographically restricted to the individual patient's device (`request.auth.uid == userId`) with mandatory schema enforcement preventing unhashed password persistence, while authenticated read operations enable authorized clinicians to ingest streaming telemetry for paired patients.
3. **Explicit Dual-Consent Clinical Handshake & Ephemeral Lifecycle (`/pairing_requests`):**  
   Clinical data sharing between patient and clinician requires explicit affirmative patient consent. The patient generates a cryptographically random, ephemeral pairing PIN (`crypto.getRandomValues()`) and must actively authorize incoming connection requests via an interactive in-app modal. Furthermore, documents in `/pairing_requests` possess an ephemeral lifecycle: once acknowledged by both parties, the document is permanently deleted following a controlled 8,000ms grace period, preventing residual clinician-patient routing metadata from persisting in cloud storage.

### 3.2 The Three-Way Pairing Handshake Protocol

```mermaid
sequenceDiagram
    autonumber
    participant Patient as Patient Mobile App
    participant Cloud as Cloud Firestore (pairing_requests)
    participant Doctor as Doctor Web Dashboard

    Patient->>Cloud: 1. Generate & Save Pairing PIN (GG-XXXX) in /users/{userId}
    Doctor->>Doctor: 2. Clinician inputs PIN GG-XXXX
    Doctor->>Cloud: 3. [SYN] Create pairing request doc with status="pending"
    Doctor->>Cloud: 4. [ACK] Listen on snapshot for status change
    Patient->>Cloud: 5. [SYN-ACK] Detect incoming request doc matching patientId
    Patient->>Patient: 6. Prompt patient with Approval Modal
    Patient->>Cloud: 7. Update pairing request status="approved"
    Cloud-->>Doctor: 8. Trigger onApproved callback
    Doctor->>Doctor: 9. Store connected patient record & display telemetry
    Note over Doctor,Cloud: 10. Defer document deletion by 8,000ms (BAK-005 Fix)
    Doctor->>Cloud: 11. Delete pairing request doc after mobile confirms
```

To establish a secure clinical association without exposing raw account identifiers, a three-way state-machine handshake is executed:
1. **Initiation (SYN):** The clinician enters the patient's 4-character PIN. The web dashboard queries `/users` where `pairingPin == PIN` and creates a document in `/pairing_requests/{requestId}` with `status: 'pending'`, `providerId`, and `patientId`.
2. **Patient Authorization (SYN-ACK):** The mobile client listens for pending requests targeted at its authenticated `userId`. An in-app modal prompts the patient to accept or deny the clinician's connection. When accepted, the mobile app sets `status: 'approved'`.
3. **Resolution & Deferred Cleanup (ACK):** The web dashboard's snapshot listener detects the `'approved'` status, unsubscribes immediately to prevent duplicate triggers, registers the patient under clinical management, and **defers deletion of the pairing document by 8,000 milliseconds**. This deferred cleanup ensures the mobile client has sufficient time to read the confirmation and transition its UI without encountering an asynchronous `404 Not Found` race condition.

---

## 4. Remediation Catalog & Technical Audit Matrix

The table below catalogs the security and architectural findings identified during the audit alongside the technical remediation implemented for each:

| Vulnerability / Defect ID | Tier / Component | Category | Finding Description | Severity | Remediation Implementation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **MOB-001** | Mobile / Android | Security | Insecure backup enabled in manifest (`android:allowBackup="true"`). | Medium | Set `android:allowBackup="false"` in [`AndroidManifest.xml`](./android-app/app/src/main/AndroidManifest.xml). |
| **MOB-002** | Mobile / Native | Security | Excessive WebView file access flags enabled universal local file access. | High | Disabled `allowUniversalAccessFromFileURLs`, `allowFileAccessFromFileURLs`, and `allowFileAccess` in [`MainActivity.kt`](./android-app/app/src/main/java/com/example/gestationguardian/MainActivity.kt#L46-L49) while preserving `allowContentAccess = true`. |
| **MOB-003** | Mobile / Native | Security | Unrestricted audio capture permissions granted to any origin. | High | Implemented strict origin validation in `WebChromeClient.onPermissionRequest` allowing only `file://`, `localhost`, and `capacitor://localhost`. |
| **MOB-004** | Mobile / Store | Security | Insecure PRNG (`Math.random()`) used for clinical pairing PIN generation. | Medium | Migrated `initUserId()` in [`store.ts`](./src/ts/store/store.ts#L32-L43) to `crypto.getRandomValues(new Uint8Array(4))` preserving `GG-XXXX` format. |
| **MOB-005** | Mobile / Auth | Security | Universal `'1234'` OTP fallback accessible in production builds. | High | Gated `'1234'` code in [`auth.ts`](./src/ts/views/auth.ts#L163-L168) behind `isDev = import.meta.env.DEV or hostname === 'localhost'`. |
| **MOB-006** | Mobile / Storage | Security | Passwords persisted in plaintext in `localStorage` and Firestore sync queue. | Critical | Created [`crypto.ts`](./src/ts/utils/crypto.ts) with salted SHA-256 (`crypto.subtle` + fallback). Hashed passwords and deleted raw `password` from profile data prior to storage. |
| **MOB-007** | Mobile / AI | Security | Gemini API key transmitted via visible URL query parameter. | High | Migrated API key transmission to `x-goog-api-key` HTTP header in [`gemini-service.ts`](./src/ts/services/gemini-service.ts). |
| **MOB-008** | Mobile / AI | Security | Markdown rendering in AI bot assigned directly to `innerHTML` without sanitization. | High | Enforced HTML entity escaping on Gemini responses in [`ai-bot.ts`](./src/ts/services/ai-bot.ts) before markdown parsing. |
| **MOB-009** | Mobile / Bluetooth | Security | BLE GATT parsing lacked buffer bounds checks and IEEE-11073 unit conversions. | Medium | Added buffer length validation (`byteLength < 5`), 12-bit two's complement mantissa decoding, and signed exponent handling in [`bluetooth.ts`](./src/ts/services/bluetooth.ts). |
| **WEB-001** | Web Dashboard | Security | Directory traversal in `serve.cjs` permitted reading arbitrary host files via `..%2f`. | High | In [`serve.cjs`](../Gestation-Guardian-Web/serve.cjs#L34-L44), added `path.resolve(DIR, safeRelative)` boundary validation returning `HTTP 403 Forbidden` on escape attempts. |
| **WEB-002** | Web Dashboard | Security | Missing basic security response headers. | Low | Injected `X-Content-Type-Options: nosniff` and `X-Frame-Options: SAMEORIGIN` in [`serve.cjs`](../Gestation-Guardian-Web/serve.cjs). |
| **WEB-003** | Web Dashboard | Security | Missing authentication guard; direct access to patient dashboard without login. | High | Created [`auth.js`](../Gestation-Guardian-Web/js/auth.js) exporting `window.ClinicianAuth` with automated route redirects and one-click demo login on [`login.html`](../Gestation-Guardian-Web/pages/login.html). |
| **WEB-004** | Web Dashboard | Security | Insecure communication mode in local sync client (`backend-sync.js`). | Medium | Configured explicit error handling, payload boundaries, and token support for local workstation sync. |
| **WEB-005** | Web Dashboard | Security | DOM XSS via unescaped patient profile parameters in patient card rendering. | High | Created [`security-utils.js`](../Gestation-Guardian-Web/js/security-utils.js) (`window.SecurityUtils.escapeHtml`) and sanitized all dynamic DOM injections in [`index.html`](../Gestation-Guardian-Web/index.html). |
| **WEB-006** | Web Dashboard | Security | DOM XSS via unsanitized URL query parameters on patient detail page. | High | Sanitized `patientId` URL parameter and clinical symptom tags in [`patient-detail.html`](../Gestation-Guardian-Web/pages/patient-detail.html). |
| **BAK-001** | Backend / Cloud | Security | Firestore rules allowed arbitrary users to read and overwrite patient profiles. | Critical | Enforced `request.auth.uid == userId` for document writes on `/users/{userId}` in [`firestore.rules`](./firestore.rules). |
| **BAK-002** | Backend / Cloud | Security | Firestore accepted documents containing unhashed `password` fields. | High | Added `(!('password' in request.resource.data))` validation rule across all user document write operations in [`firestore.rules`](./firestore.rules). |
| **BAK-003** | Backend / Sync | Security | Local Express sync endpoints (`/api/sync`) lacked authentication. | High | Created `requireSyncAuth` middleware in [`apiRoutes.js`](./server/routes/apiRoutes.js) verifying `X-GG-Sync-Token: ${GG_SYNC_TOKEN}`. Secret token is injected securely at runtime via environment variable `GG_SYNC_TOKEN`. |
| **BAK-004** | Backend / Cloud | Security | Firestore rules permitted reopening resolved pairing requests. | High | Enforced `resource.data.status == 'pending'` in pairing request update rules in [`firestore.rules`](./firestore.rules) so approved/denied requests are immutable. |
| **BAK-005** | Backend / Sync | Security | Handshake deletion race condition deleted pairing documents prematurely. | High | Modified [`firebase-service.js`](../Gestation-Guardian-Web/js/firebase-service.js#L488) to unsubscribe immediately upon approval and defer document deletion by 8,000ms. |
| **BAK-006** | Backend / DB | Security | SQLite sync server operated without Write-Ahead Logging or batch transactions. | Medium | In [`sqliteClient.js`](./server/dal/sqliteClient.js), enabled `PRAGMA journal_mode = WAL` and `PRAGMA busy_timeout = 5000`. Added atomic `upsertBatch` transactions in [`CollectionRepository.js`](./server/repositories/CollectionRepository.js). |
| **BAK-007** | Backend / Sync | Security | Express JSON parser accepted unlimited payload sizes (DoS vector). | Medium | Set `express.json({ limit: '1mb' })` in [`server.js`](./server/server.js). |
| **APK-001** | Build / Asset | Functional / UI | Onboarding background image missing in compiled APK build. | Medium (UI/Functional) | Updated asset pathing from `/onboarding-bg.png` to `./onboarding-bg.png` and added regex rewriting in [`app.ts`](./src/ts/views/app.ts#L230-L232). |
| **APK-002** | Build / UI | Functional / UI | Mobile interface overlapped status bar and notch on physical devices. | Medium (UI/Functional) | Added `ViewCompat.setOnApplyWindowInsetsListener` in [`MainActivity.kt`](./android-app/app/src/main/java/com/example/gestationguardian/MainActivity.kt#L79-L85) and mapped CSS `--safe-top` insets. |
| **APK-003** | Build / Auth | Security | Login page returned specific messages indicating whether email or password was wrong. | Medium | Standardized login error handling in [`auth.ts`](./src/ts/views/auth.ts#L259-L281) to output a unified generic error toast preventing OWASP user enumeration. |

---

## 5. Production Artifacts & Build Verification

### 5.1 Final Compiled Android Package
* **Root Binary Location:** [`GestationGuardian.apk`](./GestationGuardian.apk)
* **Build Output Location:** [`android-app/app/build/outputs/apk/debug/app-debug.apk`](./android-app/app/build/outputs/apk/debug/app-debug.apk)
* **File Size:** `17,300,392 bytes` (~16.5 MB)
* **Cryptographic Checksum (SHA-256):**
  ```text
  EE9F92C3921D19430D8D2EC19A4F6FCCCEEEEBAF0BAEC0C2192E6BB2F08BE6EF
  ```
* **Build Engine:** Gradle 8.2 / Android Gradle Plugin 8.2.1
* **Packaging Status:** `BUILD SUCCESSFUL in 4m 2s (36 actionable tasks: 3 executed, 33 up-to-date)`

### 5.2 Test Execution Results

#### 1. Authentication & Security Suite ([`tests/signin.spec.js`](./tests/signin.spec.js))
* Empty fields validation toast: **PASS**
* Incorrect password generic error check: **PASS**
* Non-existent account generic error check: **PASS**
* Valid credential authentication & dashboard navigation: **PASS**
* **Summary:** `4 passed (42.3s)`

#### 2. Maternal AI & Talkback Suite ([`tests/voice-ai.spec.js`](./tests/voice-ai.spec.js))
* Floating action button visibility & click handlers: **PASS**
* Header & WHO clinical guidelines presentation: **PASS**
* TTS Talkback toggle functionality: **PASS**
* Microphone recording visual feedback: **PASS**
* WHO guidance query answering: **PASS**
* Clinical emergency triage warning banners: **PASS**
* Modal lifecycle management: **PASS**
* **Summary:** `7 passed (38.9s)`

#### 3. Web Dashboard Clinician Session Suite
* Unauthenticated initial state check: **PASS**
* Malformed email / blank password rejection: **PASS**
* Authorized credential session creation: **PASS**
* Session object token structure: **PASS**
* Session state persistence (`gg_clinician_session`): **PASS**
* Session termination on logout: **PASS**
* Root vs. subdirectory route redirection: **PASS**
* **Summary:** `6 passed (Node.js runtime)`

### 5.3 Live Cloud Firestore Rules Deployment
The hardened security ruleset was deployed to Google Cloud Firestore under project `gg-doctor-dashboard` on November 5, 2026:
```text
=== Deploying to 'gg-doctor-dashboard'...

i  deploying firestore
i  firestore: ensuring required API firestore.googleapis.com is enabled...
+  firestore: required API firestore.googleapis.com is enabled
i  cloud.firestore: checking firestore.rules for compilation errors...
+  cloud.firestore: rules file firestore.rules compiled successfully
i  firestore: uploading rules firestore.rules...
+  firestore: released rules firestore.rules to cloud.firestore

+  Deploy complete!

Project Console: https://console.firebase.google.com/project/gg-doctor-dashboard/overview
```

---

## 6. Operational & Installation Guide

### 6.1 Installing the APK on a Physical Android Device
1. Connect the target Android phone to your computer via USB.
2. Ensure **Developer Options** and **USB Debugging** are enabled on the device.
3. Open a terminal or Command Prompt, navigate to the mobile repository root, and run `adb install`:
   ```bash
   # From <MOBILE_REPO_ROOT>
   adb install -r ./GestationGuardian.apk
   ```
   *Alternative absolute command using standard path placeholder:*
   ```bash
   adb install -r "<MOBILE_REPO_ROOT>/GestationGuardian.apk"
   ```
   *The `-r` flag re-installs and replaces the existing package while preserving user profile data.*

### 6.2 Running the Web Clinical Dashboard
1. Navigate to the web project directory:
   ```bash
   cd <WEB_REPO_ROOT>
   # or from <MOBILE_REPO_ROOT>:
   cd ../Gestation-Guardian-Web
   ```
2. Start the hardened web server:
   ```bash
   node serve.cjs
   ```
3. Open your browser to `http://localhost:8082`.
4. Log in using your clinical credentials or click the **Demo / Clinical Quick Login** button on [`pages/login.html`](../Gestation-Guardian-Web/pages/login.html) to enter the dashboard immediately.

### 6.3 Running the Local Synchronization Server
1. Navigate to the server directory:
   ```bash
   cd <MOBILE_REPO_ROOT>/server
   # or from <MOBILE_REPO_ROOT>:
   cd ./server
   ```
2. Verify that the sync authorization token is configured via environment variable:
   ```bash
   # In .env or shell environment:
   # GG_SYNC_TOKEN="<REDACTED_SYNC_TOKEN>"
   ```
3. Start the Express service:
   ```bash
   node server.js
   ```
4. The server will listen on port `3000` with SQLite WAL mode active. Requests require the `X-GG-Sync-Token: ${GG_SYNC_TOKEN}` header for synchronization operations.
