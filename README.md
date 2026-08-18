# 🤰 Gestation Guardian 

<div align="center">
  <img src="https://api.dicebear.com/7.x/initials/svg?seed=GG&backgroundColor=8DB48E&textColor=FFFFFF&radius=20" alt="Gestation Guardian Logo" width="120"/>
  <br>
  <i>Your trusted companion for a safer, healthier pregnancy journey.</i>
  <br><br>
  <a href="GestationGuardian.apk">📥 Download APK</a>
</div>

---

**Gestation Guardian** is a premium, offline-first mobile application designed to empower expecting mothers. It focuses specifically on tracking vital health metrics, assessing pre-eclampsia and gestational hypertension risks, and providing actionable care advice—all wrapped in a stunning, native-feeling "Bento Grid" UI.

## ✨ Features

* 📊 **Risk Assessment Engine:** A built-in mathematical model that tracks weight, blood pressure, and symptom checklists to calculate Gestosis risk safely.
* 🤖 **Gestation AI:** A floating, context-aware AI chatbot that remembers your conversation history and provides instant, reassuring advice.
* 📱 **Native-Grade UI/UX:** Built with 15+ bespoke components including:
  * Interactive Fetal Kick Counters
  * Real-time Labor Contraction Timers
  * Glassmorphic Alert Banners & Advice Cards
  * Dynamic Pregnancy Progress Timelines
* 🔥 **Firebase Firestore Backend:** Cloud-synced data persistence with offline-first architecture. Your data is saved locally for instant access and synced to Firestore when online.
* 🛡️ **Offline-First Architecture:** The app works fully offline via `localStorage`. When connectivity is available, data syncs automatically to Firebase Firestore in the background.
* 📡 **Bluetooth Ready:** Base architectural stubs are in place for Web Bluetooth API integration to support external smart blood pressure cuffs and vitals bands.

## 🛠️ Tech Stack

* **Core:** Vanilla TypeScript & ES Modules (No heavy frameworks like React or Vue).
* **Backend:** Firebase Firestore with offline-first sync engine.
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

To connect to your own Firebase project:

1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Firestore Database** in your project.
3. Update your Firebase credentials in `src/ts/store/firebase.ts`:
   ```typescript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

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
│   │   ├── store.ts        # Offline-first data layer (localStorage + sync queue)
│   │   └── firebase.ts     # Firebase Firestore client & helpers
│   ├── views/              # SPA view controllers (auth, dashboard, assessment, etc.)
│   ├── core/               # Scoring engine, utilities
│   ├── components/         # Reusable UI components
│   └── services/           # AI chatbot, Bluetooth stubs
├── pages/                  # HTML templates loaded dynamically via hash routing
└── index.html              # SPA entry point
```

### Data Flow
```
User Input → localStorage (instant) → Sync Queue → Firebase Firestore (background)
```

The app uses a **write-local-first, sync-later** pattern. All health data (blood pressure, vitals, glucose, urine, kick counts, contractions, symptoms) is persisted locally and queued for Firebase sync when online.

## 🔒 Privacy & Security

This repository underwent a massive architectural audit to guarantee stability. The legacy `script.js` monolith was decommissioned, and the application was refactored into a strict TypeScript module system (`store`, `views`, `services`, `core`, etc.). Your sensitive medical data stays on your device first, with optional cloud backup via Firebase.

---
<div align="center">
  <b>Monitor. Protect. Nurture.</b>
</div>
