# 🤰 Gestation Guardian 

<div align="center">
  <img src="https://api.dicebear.com/7.x/initials/svg?seed=GG&backgroundColor=8DB48E&textColor=FFFFFF&radius=20" alt="Gestation Guardian Logo" width="120"/>
  <br>
  <i>Your trusted companion for a safer, healthier pregnancy journey.</i>
  <br><br>
  <a href="GestationGuardian.apk">📥 Download APK</a>
</div>

---

**Gestation Guardian** is a premium, offline-first mobile application designed to empower expecting mothers. It focuses specifically on tracking vital health metrics, assessing pre-eclampsia and gestational hypertension risks, and providing actionable care advice—all wrapped in a stunning, native-feeling UI.

## ✨ Features

### Core Health Tracking
* 📊 **Gestosis Risk Assessment Engine:** A built-in mathematical model that calculates cumulative clinical risk scores from static risk factors (age, parity, BMI, chronic conditions) and dynamic physiological signals (blood pressure, proteinuria, glucose, symptoms) — producing a real-time RAG-triaged score with Low / Moderate / High / Critical bands.
* 🩸 **Blood Pressure Logging:** Systolic, diastolic, and pulse (maternal heart rate) capture with position and arm selection for clinical accuracy.
* 🏥 **Vitals Dashboard:** Weight, sleep, temperature, blood glucose, urine protein, and stress level tracking in a single unified form.
* 👶 **Fetal Kick Counter:** Interactive session-based kick counting with timer and threshold alerts.
* ⏱️ **Contraction Timer:** Real-time labour contraction tracking with frequency and duration calculations.
* 📋 **Medical History:** Comprehensive recording of chronic conditions, medications, and symptom logs.

### Intelligence & AI
* 🤖 **Gestation AI:** A floating, context-aware AI chatbot that remembers your conversation history and provides instant, reassuring advice.
* 🚨 **Automated Alerting:** When the Gestosis score escalates to High or Critical, the app immediately triggers persistent high-priority alerts prompting the patient to seek medical attention.

### Clinical Integration (Phase 2)
* 🔗 **Doctor Dashboard Bridge:** Each patient is assigned a unique Clinical ID (`GG-XXXX`) displayed on their profile page. Sharing this ID with their doctor enables real-time remote monitoring via the [GG Doctor Dashboard](https://github.com/glitchgeeks01-droid/Gestation-Guardian-Web).
* 📡 **Strict HL7 FHIR Telemetry:** All vitals are automatically transformed into strict HL7 FHIR `Observation` resources using LOINC coding and UCUM units (`unitsofmeasure.org`) before syncing to the cloud:
  * Blood Pressure → LOINC `85354-9` (panel), `8480-6` (systolic, `mm[Hg]`), `8462-4` (diastolic, `mm[Hg]`)
  * Heart Rate → LOINC `8867-4` (`beats/minute`, `/min`)
* 🗄️ **Polyglot Persistence:** Telemetry data is routed to `users/{patientId}/telemetry` subcollections, enabling high-frequency time-series queries for the clinical dashboard's real-time charts.
* 🔥 **Shared Firebase Backend:** Both the mobile app and doctor dashboard connect to the same `gg-doctor-dashboard` Firebase project, ensuring a unified data ecosystem.

### Platform, Safety & UX
* 📱 **Native-Grade UI/UX:** Built with 15+ bespoke components including glassmorphic alert banners, dynamic pregnancy progress timelines, and interactive Bento Grid layouts.
* 🛡️ **Offline-First & Thread-Safe:** The app works fully offline via `localStorage`. When connectivity is available, data syncs automatically to Firebase Firestore via a robust, background sync queue featuring a Mutex lock (`isSyncing`) to prevent race conditions during rapid data entry.
* 🧮 **Clinical Math Integrity:** All telemetry ingest points feature strict NaN-prevention safeguards to ensure bad data (empty inputs, missing decimals) never pollutes the FHIR payloads or breaks clinical scoring algorithms.
* 📡 **Bluetooth Ready:** Base architectural stubs are in place for Web Bluetooth API integration to support external smart blood pressure cuffs and vitals bands.

## 🛠️ Tech Stack

* **Core:** Vanilla TypeScript & ES Modules (No heavy frameworks like React or Vue).
* **Backend:** Firebase Firestore (`gg-doctor-dashboard` project) with offline-first sync engine.
* **Data Standard:** HL7 FHIR R4 Observations with strict LOINC coding for clinical interoperability.
* **Styling:** Custom Vanilla CSS featuring Skeuomorphic shadows, Glassmorphism, and a strict CSS Container constraint for mobile-first rendering.
* **Build System:** Vite ⚡ for lightning-fast HMR and optimized bundling.
* **Data Persistence:** Dual-layer — `localStorage` for instant local reads + Firebase Firestore for cloud backup and sync.
* **Android Wrapper:** Native Android WebView app (Kotlin + Gradle).
* **Assets:** Lucide Icons & Lexend Typography.

## 📥 Download

You can download the pre-built Android APK directly:

| File | Size | Description |
|------|------|-------------|
| [`GestationGuardian.apk`](GestationGuardian.apk) | ~12.8 MB | Debug build, installable on any Android 7.0+ device |

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
User Input → localStorage (instant) → FHIR LOINC Transform → Sync Queue → Firebase Firestore
                                                                              ↓
                                                              users/{patientId}/telemetry
                                                                              ↓
                                                              Doctor Dashboard (real-time)
```

The app uses a **write-local-first, sync-later** pattern. All health data (blood pressure, vitals, glucose, urine, kick counts, contractions, symptoms) is persisted locally, transformed into HL7 FHIR Observations, and queued for Firebase sync when online. The doctor dashboard receives these updates in real-time via Firestore `onSnapshot` listeners.

## 🔗 Clinical Integration Flow

1. Patient signs up in the mobile app → a unique Clinical ID (`GG-XXXX`) is generated.
2. Patient navigates to **Profile** → copies their Clinical ID.
3. Patient shares the ID with their healthcare provider.
4. Doctor enters the ID in the **GG Doctor Dashboard** → **Connect Patient** dialog.
5. The dashboard instantly establishes a real-time WebSocket-like connection to the patient's telemetry subcollection.
6. All future vitals logged by the patient are streamed live to the doctor's clinical charts.

## 🔒 Privacy & Security

This repository underwent a massive architectural audit to guarantee stability and security. Key architectural highlights include:

* **Strict Content Security Policy (CSP):** All inline JavaScript event handlers (`onclick`, `onsubmit`, etc.) have been completely eradicated from HTML templates. Event management is centralized through declarative `data-action` delegation, dramatically reducing XSS vulnerabilities.
* **Modular Refactor:** The legacy `script.js` monolith was decommissioned, and the application was refactored into a strict TypeScript module system (`store`, `views`, `services`, `core`).
* **Robust Voice AI:** The Voice Assistant seamlessly degrades gracefully and provides visual feedback to the user on browsers where `SpeechRecognition` or `MediaRecorder` access is unavailable. 
* **Accessibility (a11y):** All primary interactive UI elements are annotated with `aria-label` tags for screen reader compatibility.

Your sensitive medical data stays on your device first, with optional cloud backup via Firebase.

---
<div align="center">
  <b>Monitor. Protect. Nurture.</b>
</div>
