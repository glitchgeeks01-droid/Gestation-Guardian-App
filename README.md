# 🤰 Gestation Guardian 

<div align="center">
  <img src="https://api.dicebear.com/7.x/initials/svg?seed=GG&backgroundColor=8DB48E&textColor=FFFFFF&radius=20" alt="Gestation Guardian Logo" width="120"/>
  <br>
  <i>Your trusted companion for a safer, healthier pregnancy journey.</i>
</div>

---

**Gestation Guardian** is a premium, offline-first mobile web application designed to empower expecting mothers. It focuses specifically on tracking vital health metrics, assessing pre-eclampsia and gestational hypertension risks, and providing actionable care advice—all wrapped in a stunning, native-feeling "Bento Grid" UI.

## ✨ Features

We engineered this app to be completely self-reliant and hyper-responsive. 

* 📊 **Risk Assessment Engine:** A built-in mathematical model that tracks weight, blood pressure, and symptom checklists to calculate Gestosis risk safely.
* 🤖 **Gestation AI:** A floating, context-aware AI chatbot that remembers your conversation history and provides instant, reassuring advice.
* 📱 **Native-Grade UI/UX:** Built with 15+ bespoke components including:
  * Interactive Fetal Kick Counters
  * Real-time Labor Contraction Timers
  * Glassmorphic Alert Banners & Advice Cards
  * Dynamic Pregnancy Progress Timelines
* 🛡️ **100% Offline-First (No Backend):** The heavy backend syncing has been intentionally severed. The application runs entirely on your device via `localStorage`. Your highly sensitive medical data never leaves your phone. Zero latency. Zero server crashes.
* 📡 **Bluetooth Ready:** Base architectural stubs are in place for Web Bluetooth API integration to support external smart blood pressure cuffs and vitals bands.

## 🛠️ The Tech Stack

Built for raw speed and zero bloat:

* **Core:** Vanilla TypeScript & ES Modules (No heavy frameworks like React or Vue).
* **Styling:** Custom Vanilla CSS featuring Skeuomorphic shadows, Glassmorphism, and a strict CSS Container constraint for mobile-first rendering on any viewport.
* **Build System:** Vite ⚡ for lightning-fast HMR and optimized bundling.
* **Data Persistence:** Synchronous, JSON-based `localStorage` engine engineered with defensive error boundaries to prevent data corruption.
* **Assets:** Lucide Icons & Lexend Typography.

## 🚀 Getting Started

Since the architecture is entirely frontend-driven, running the app locally takes seconds.

### Prerequisites
* Node.js (v18+)

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
   > The app will usually launch at `http://localhost:5173/`. 
   > *Note: If viewing on a desktop browser, the UI will automatically constrain itself to a mobile-sized column to preserve the native UX.*

### Building for Production (Android WebView)
To compile the TypeScript and CSS down to a static bundle for Android asset wrapping:
```bash
npm run build
```
The optimized files will be output to the configured destination (typically `dist` or the Android `assets/www` directory).

## 🔒 Architecture Notes

This repository underwent a massive architectural audit to guarantee stability. The legacy `script.js` monolith was decommissioned, and the application was refactored into a strict 10-layer TypeScript module system (`store`, `views`, `services`, `core`, etc.).

By aggressively removing the external `Doctor Connector` API dependency, we eliminated asynchronous loading failures, API timeouts, and state-desync crashes. The result is a bulletproof, privacy-respecting tool for mothers.

---
<div align="center">
  <b>Monitor. Protect. Nurture.</b>
</div>
