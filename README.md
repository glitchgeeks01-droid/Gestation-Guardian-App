# 🛡️ Gestation Guardian

<div align="center">
  <img src="https://api.dicebear.com/7.x/initials/svg?seed=GG&backgroundColor=8DB48E&textColor=FFFFFF&radius=20" alt="Gestation Guardian Logo" width="120"/>
  <br>
  <i>Your trusted companion for a safer, healthier pregnancy journey.</i>
  <br><br>
  <a href="GestationGuardian.apk">📥 Download Fresh APK</a>
</div>

---

**Gestation Guardian** is a premium, offline-first mobile application designed to empower expecting mothers. It focuses specifically on tracking vital health metrics, assessing pre-eclampsia and gestational hypertension risks, and providing actionable care advice—all wrapped in a stunning, native-feeling UI.

## 🌟 Features

### Core Health Tracking
* 📊 **Gestosis Risk Assessment Engine:** A built-in mathematical model that calculates cumulative clinical risk scores from static risk factors (age, parity, BMI, chronic conditions) and dynamic physiological signals (blood pressure, proteinuria, glucose, symptoms) — producing a real-time RAG-triaged score with Low / Moderate / High / Critical bands.
* 🩺 **Blood Pressure Logging:** Systolic, diastolic, and pulse (maternal heart rate) capture with position and arm selection for clinical accuracy.
* 📈 **Vitals Dashboard:** Weight, sleep, temperature, blood glucose, urine protein, and stress level tracking in a single unified form.
* 👶 **Fetal Kick Counter:** Interactive session-based kick counting with timer and threshold alerts.
* ⏱️ **Contraction Timer:** Real-time labour contraction tracking with frequency and duration calculations.
* 📋 **Medical History:** Comprehensive recording of chronic conditions, medications, and symptom logs.

### Intelligence & AI
* 🤖 **Gestation AI (Powered by Gemini 1.5 Flash):** A floating, context-aware AI chatbot that securely injects the patient's local clinical vitals into its context window, providing instant, highly-personalized and reassuring medical guidance using a WHO-compliant persona.
* 🎙️ **Voice-to-Text & Text-to-Speech:** Complete hands-free experience. Features robust Web Speech API integration, seamless fallback to OpenAI Whisper for Apple Safari compatibility, and a stabilized TTS queue that guarantees smooth, cancelable voice playback without robotic fallback voices.
* 🚨 **Automated Alerting:** When the Gestosis score escalates to High or Critical, the app immediately triggers persistent high-priority alerts prompting the patient to seek medical attention.

### Clinical Integration & Cloud Sync
* 🔐 **Anonymous Firebase Auth:** On launch, the app silently authenticates users via Firebase Anonymous Auth, ensuring all medical telemetry is bound to a secure, cryptographically generated UID (`user.uid`) rather than a public identifier.
* 🏥 **Doctor Dashboard Bridge:** Each patient is assigned a temporary 4-digit Clinical PIN (`GG-XXXX`) displayed on their profile. Sharing this PIN with a doctor enables real-time remote monitoring via the [GG Doctor Dashboard](https://github.com/glitchgeeks01-droid/Gestation-Guardian-Web).
* 🩺 **Strict HL7 FHIR Telemetry:** All vitals are automatically transformed into strict HL7 FHIR `Observation` resources using LOINC coding and UCUM units (`unitsofmeasure.org`) before syncing to the cloud:
  * Blood Pressure ➔ LOINC `85354-9` (panel), `8480-6` (systolic, `mm[Hg]`), `8462-4` (diastolic, `mm[Hg]`)
  * Heart Rate ➔ LOINC `8867-4` (`beats/minute`, `/min`)
* 🌐 **Polyglot Persistence:** Telemetry data is routed to `users/{secureUid}/telemetry` subcollections, enabling high-frequency time-series queries for the clinical dashboard's real-time charts.
* ☁️ **Shared Firebase Backend:** Both the mobile app and doctor dashboard connect to the same `gg-doctor-dashboard` Firebase project, ensuring a unified data ecosystem.

### Platform, Hardware & Safety
* 📱 **Native-Grade UI/UX:** Built with 15+ bespoke components including glassmorphic alert banners, dynamic pregnancy progress timelines, and interactive Bento Grid layouts.
* 💾 **Dual-Layer Offline-First Architecture:** The app works fully offline via local storage. When connectivity is available, data syncs automatically to Firebase Firestore via a robust background sync queue featuring atomic non-destructive polling to prevent race conditions during rapid data entry.
* 🔢 **Clinical Math Integrity:** All telemetry ingest points feature strict NaN-prevention safeguards to ensure bad data (empty inputs, missing decimals) never pollutes the FHIR payloads or breaks clinical scoring algorithms.
* 📶 **Web Bluetooth API Interoperability:** Features a production-grade Web Bluetooth GATT client that actively pairs with external smart blood pressure cuffs. It parses raw IEEE 11073 SFloat byte buffers to extract Systolic, Diastolic, and Heart Rate values, auto-filling the UI in real-time.

## 🛠️ Tech Stack

* **Core:** Vanilla TypeScript & ES Modules (No heavy frameworks like React or Vue).
* **Backend:** Firebase Firestore (`gg-doctor-dashboard` project) with offline-first sync engine.
* **Data Standard:** HL7 FHIR R4 Observations with strict LOINC coding for clinical interoperability.
* **Styling:** Custom Vanilla CSS featuring Skeuomorphic shadows, Glassmorphism, and a strict CSS Container constraint for mobile-first rendering.
* **Build System:** Vite ⚡ for lightning-fast HMR and optimized bundling.
* **Data Persistence:** Dual-layer — local storage for instant local reads + Firebase Firestore for cloud backup and sync.
* **Android Wrapper:** Native Android WebView app (Kotlin + Gradle).
* **Assets:** Lucide Icons & Lexend Typography.

## 📱 Download

You can download the pre-built Android APK directly:

| File | Size | Description |
|------|------|-------------|
| [`GestationGuardian.apk`](GestationGuardian.apk) | ~16.8 MB | Fresh Debug build, installable on any Android 7.0+ device |

> **Note:** You may need to enable "Install from Unknown Sources" on your Android device.

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* Android Studio (for APK builds only)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/glitchgeeks01-droid/Gestation-Guardian-App.git
   cd Gestation-Guardian-App
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   > The app will launch at `http://localhost:5173/`. 
   > *Note: If viewing on a desktop browser, the UI will automatically constrain itself to a mobile-sized column to preserve the native UX.*

### Firebase Configuration

The app is pre-configured to connect to the shared `gg-doctor-dashboard` Firebase project. To connect to your own project instead:

1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Firestore Database** in your project.
3. Update your Firebase credentials in `src/ts/store/firebase.ts`.

### Building for Production

**Web assets (for Android WebView):**
```bash
npm run build
```
The optimized files will be output to the Android `assets/www` directory.

**Android APK:**
```bash
cd android-app
gradlew assembleDebug
```
The APK will be generated at `android-app/app/build/outputs/apk/debug/app-debug.apk`.

## 🏗️ Architecture

```
src/
├── ts/
│   ├── store/
│   │   ├── store.ts        # Offline-first data layer + FHIR LOINC transformation engine
│   │   └── firebase.ts     # Firebase Firestore client & helpers
│   ├── views/              # SPA view controllers (auth, dashboard, assessment, vitals, etc.)
│   ├── core/
│   │   ├── scoring.ts      # Gestosis risk scoring engine (RAG triage)
│   │   └── types.ts        # TypeScript interfaces
│   ├── components/         # Reusable UI components
│   └── services/           # AI chatbot, Bluetooth stubs
├── pages/                  # HTML templates loaded dynamically via hash routing
└── index.html              # SPA entry point
```

### Data Flow
```
User Input ➔ Local Storage (instant) ➔ FHIR LOINC Transform ➔ Sync Queue ➔ Firebase Firestore
                                                                               │
                                                               users/{patientId}/telemetry
                                                                               │
                                                               Doctor Dashboard (real-time)
```

The app uses a **write-local-first, sync-later** pattern. All health data (blood pressure, vitals, glucose, urine, kick counts, contractions, symptoms) is persisted locally, transformed into HL7 FHIR Observations, and queued for Firebase sync when online. The doctor dashboard receives these updates in real-time via Firestore `onSnapshot` listeners.

## 🤝 Clinical Integration & Three-Way Handshake Flow

1. **Patient Registration & PIN Generation:** Patient signs up in the mobile app ➔ a unique Clinical PIN (`GG-XXXX`) is generated and securely synced to their Firestore document with `lastActiveAt` session tracking.
2. **Provider Sharing:** Patient navigates to **Profile** ➔ copies their Clinical PIN and shares it with their healthcare provider.
3. **Multi-Session Candidate Resolution (SYN):** Doctor enters the Clinical PIN in the **GG Doctor Dashboard** ➔ **Connect Patient** dialog. The system queries all candidate session UIDs for that PIN (supporting device reinstalls and session transitions) and dispatches pending pairing requests to all associated device sessions.
4. **Interactive In-App Prompt (SYN-ACK):** The patient's mobile app immediately detects the incoming connection request via a real-time Firestore listener and surfaces a prominent, modal confirmation dialog (`UI.showConfirm`):
   > *"Dr. Julian Vance wants to connect with your Gestation Guardian profile. Allow access?"*
   > **[Deny]** &nbsp;&nbsp;&nbsp; **[Approve]**
5. **Patient Consent & State Persistence (ACK):** 
   - Tapping **Approve** updates the pairing request to `approved` and permanently stamps the patient's own user record with `connected: true` and `connectedAt`.
   - The Doctor Dashboard detects the approval in real-time, deletes lingering pending requests, marks the patient as connected, and seamlessly transitions to the active telemetry view.
   - Unconnected patients are never listed prematurely on the clinical dashboard until explicit consent is granted.

## 🔒 Privacy, Security & Hardening Updates

* **Three-Way Handshake & In-App Modal:** Direct PIN access has been replaced by a cryptographic Three-Way Handshake State Machine (`pairing_requests`) with real-time in-app approval modals (`UI.showConfirm`), preventing unauthorized provider telemetry access.
* **Multi-Session UID Resiliency:** Supports seamless device reinstalls and account restorations without breaking provider pairing or telemetry history.
* **Strict Content Security Policy (CSP):** All inline JavaScript event handlers (`onclick`, `onsubmit`, etc.) have been completely eradicated from HTML templates. Event management is centralized through declarative `data-action` delegation, dramatically reducing XSS vulnerabilities.
* **Modular Refactor:** The legacy `script.js` monolith was decommissioned, and the application was refactored into a strict TypeScript module system (`store`, `views`, `services`, `core`).
* **Icon-Placeholder Collision Hardening:** Overcame CSS specificity collisions between `.input-group input` and `.input-auth` with a high-specificity `padding: 0 48px 0 54px !important;` rule. This guarantees 16px clearance between relative icons and placeholder text, completely eliminating visual overlap.
* **Layout Isolation & Clean Spacing:** 
  * Enforced `.page:not(.active) { display: none !important; }` and `#app-root { overflow: hidden; }` to eliminate phantom white blocks and overlapping sheets on the dashboard.
  * Added 24px tab switcher margins, standardized `.label-row` indentation, and added frosted glass contrast backings to footer navigation.
  * Applied `box-sizing: border-box !important` across all auth cards to prevent input pill overflow past rounded boundaries.
* **Account Recovery & Password Reset:** Dedicated glassmorphic Forgot Password recovery view (`#/forgot-password`) supporting multi-step security verification, password confirmation matching, and offline-first credential updating.
* **Authentication Hardening & Validation:** Enforced strict password and email matching on login. Fixed signup logic to securely persist password credentials into user profiles, and added clinical date boundaries for maternal age (12–65) and LMP duration (≤ 42 weeks).
* **Instant Gestational EDD Engine:** Dynamic change and input event listeners bind to the LMP datepicker, executing Naegele's rule (+280 days) immediately to display the Estimated Due Date in real-time.
* **Race-Condition-Free Sync Engine:** The offline SyncEngine utilizes an atomic, non-destructive polling flag (`processing`), guaranteeing zero data loss during high-frequency Bluetooth telemetry ingestions.
* **Strict HL7 FHIR Typing:** Telemetry mappers prevent data loss by encoding Blood Pressure Panels (LOINC `85354-9`) with nested Heart Rate (`8867-4`) components, ensuring the Doctor Dashboard graphs plot accurately.

---
<div align="center">
  <b>Monitor. Protect. Nurture.</b>
</div>
