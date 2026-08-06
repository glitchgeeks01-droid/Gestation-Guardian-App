# Gestation Guardian 🤰✨

Yo! Welcome to **Gestation Guardian**. I built this app to be a super smooth, premium companion for expecting mothers. No complicated setups, no lagging—just a clean, safe space to track the pregnancy journey.

![Project Banner](https://api.dicebear.com/7.x/initials/svg?seed=GG&backgroundColor=8DB48E&textColor=FFFFFF)

---

## What's it all about? 🚀

I wanted to make something that actually feels good to use. The whole layout is designed with this clean "Bento Grid" style, so it feels like a native mobile app even when you're just running it on a browser. 

Here is what it can do:
- **Dashboard:** Tells you exactly what week you're on and gives you cute updates (like "your baby is the size of an avocado 🥑").
- **AI Chatbot (Gestation AI):** A floating AI assistant that you can ask anything. It remembers your chat history and helps you out with quick answers.
- **Risk Assessment:** A built-in logic engine that calculates stuff like Gestosis risk based on your weight and blood pressure. It does the math safely so you don't have to panic about weird spikes.
- **Vital Logs:** Track your blood pressure, kick counts, weight, and sleep.
- **Fully Offline:** This is the best part. I completely disconnected the heavy backend stuff. The app runs **100% offline** on your device using `localStorage`. Your data stays on your phone, and it never crashes trying to talk to a server. Privacy first! 🛡️

---

## The Tech Stack 🛠️

Kept it super modern, but lightweight. No bloat, just speed:
- **Frontend Framework:** Vanilla TypeScript (No React/Vue overhead, just pure DOM manipulation for maximum performance).
- **Build Tool:** Vite ⚡ (Because waiting for Webpack to compile is painful).
- **Styling:** Custom Vanilla CSS (Bento Grid layout, Glassmorphism, and Skeuomorphic shadows).
- **Storage:** Offline-First `localStorage` (Privacy focused, zero latency).
- **Icons:** Lucide Icons (Clean, consistent SVG icons).
- **Typography:** Lexend (Google Fonts).

---

## How to run this locally? 💻

It's super easy to get this running on your own machine. Since we ditched the heavy backend, it's just a slick frontend Vite app now.

### Steps:
1. Make sure you have [Node.js](https://nodejs.org/) installed on your PC.
2. Open up your terminal and go into this project folder.
3. Install the packages:
   ```bash
   npm install
   ```
4. Fire up the dev server!
   ```bash
   npm run dev
   ```
5. Open the link it gives you (usually `http://localhost:5173/`).

*Pro tip: If things look weird on desktop, that's because I built it for mobile! It automatically constrains itself to a sleek phone-sized column in the middle of your screen.*

### Want to build it for Android?
If you're trying to pack this into the Android WebView, just run:
```bash
npm run build
```
It will compile everything down into the `dist` folder (or your Android `assets/www` folder depending on the config) so you can ship it!

---

## Why did I build it like this? 🤔

Honestly, I was dealing with a lot of silent crashes and weird layout bugs when trying to sync it with the Doctor Connector app. Forms would crash, the AI bot would duplicate, and date math was failing hard. 

So I brought in some autonomous agents, audited the whole thing, fixed every single logic bomb, and stripped out the backend connection. Now? It's literally bulletproof. It handles corrupted data smoothly and degrades gracefully without throwing white screens of death. 

Hope you find it useful. Stay safe! ✌️
