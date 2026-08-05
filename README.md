# 🤰 Gestation Guardian

**Gestation Guardian** is a premium, high-fidelity Progressive Web Application (PWA) designed to provide expectant mothers with a nurturing, data-driven companion throughout their pregnancy journey. Built with a modern **Bento Grid** design system and focused on maternal health safety.

![Project Banner](https://api.dicebear.com/7.x/initials/svg?seed=GG&backgroundColor=8DB48E&textColor=FFFFFF)

---

## ✨ Key Features

### 🍱 Bento Dashboard
A centralized hub featuring an intuitive grid layout for quick access to all vital metrics, including gestational week tracking with developmental milestones (e.g., "Your baby is the size of an ear of corn").

### 🩺 AI Risk Assessment
A clinical-grade assessment engine that evaluates maternal health data to provide real-time risk scores for conditions like Preeclampsia, empowering users with actionable medical advice.

### 🔔 Health Reminders
A high-fidelity scheduling system for prenatal vitamins, blood pressure logs, and medication, featuring glassmorphism UI tokens and maternal line-art illustrations.

### 📈 Vital Logs & Offline Sync
Seamless logging for Blood Pressure, Weight, and Sleep Quality. Features a robust offline-first synchronization engine that gracefully queues operations and syncs them to the backend when a network connection is available.

---

## 🏗️ 10-Layer Architecture

The codebase has been comprehensively refactored into a strict **10-Layer Architecture** to ensure massive scalability, maintainability, and clean separation of concerns.

### Frontend Layers (`src/ts/`)
1. **Views**: Page-level orchestration and DOM binding.
2. **Components**: Reusable UI widgets and elements.
3. **Store**: State management and caching strategies.
4. **Actions**: User intent handling and event dispatching.
5. **Services**: Domain logic and background processes (e.g., Bluetooth, AI logic).
6. **API**: Network request abstractions (`fetch` client).
7. **DTOs**: Data Transfer Objects defining expected network payloads.
8. **Adapters**: Transforming API responses into frontend ViewModels.
9. **Cache**: Offline queue management and Sync Engine logic.
10. **Core**: Global utilities, constants, types, and scoring logic.

### Backend Layers (`server/`)
1. **Routes**: Express routing definitions.
2. **Middleware**: Request interception (CORS, body parsing, error handling).
3. **Controllers**: Request handling and HTTP response mapping.
4. **Services**: Core business logic and orchestration.
5. **Repositories**: Database abstraction and data access logic.
6. **DAL**: Data Access Layer configuring the SQLite driver.
7. **Models**: Domain entities and schemas.
8. **DTOs**: Data Transfer Objects for incoming payloads.
9. **Mappers**: Mapping DTOs to internal Models.
10. **Config**: Environment and database configuration.

---

## 🛠️ Technology Stack

- **Frontend**: TypeScript, Semantic HTML5, CSS3 (Glassmorphism, Bento Layout, Safe-Area Tokens)
- **Frontend Build Tool**: Vite (Lightning-fast HMR and production bundling)
- **Backend**: Node.js, Express.js
- **Database**: SQLite (Zero-config, serverless database for sync storage)
- **Icons**: Lucide Icons
- **Typography**: Lexend (Google Fonts)

---

## 📱 Mobile-First Optimization

The application is engineered for a flagship mobile experience across **Android** and **iOS**:
- **120Hz / ProMotion Ready**: Hardware-accelerated transitions and GPU-backed scrolling.
- **Dynamic Viewport Height (100dvh)**: Perfect full-screen coverage that adapts to mobile browser toolbars.
- **Safe-Area Aware**: Intelligent layout padding that respects device notches and Dynamic Islands.
- **WebView Integration**: Compiles directly into the Android `assets/www` directory for native packaging.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- npm (Node Package Manager)

### 1. Running the Backend (Node.js/SQLite)
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (runs on `http://localhost:3000`):
   ```bash
   npm start
   ```

### 2. Running the Frontend (Vite)
1. Open a new terminal instance and navigate to the project root:
   ```bash
   cd "Gestation Guardian"
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server (proxies API requests to the backend):
   ```bash
   npm run dev
   ```
4. To build the production bundle for the Android app WebView:
   ```bash
   npm run build
   ```

---

## 📄 License
Internal Project - All Rights Reserved.

---

*Empowering every birth with care, knowledge, and peace of mind.*
