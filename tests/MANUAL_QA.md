# Astro World — Manual QA & Playtesting Guide

This document provides step-by-step verification protocols for testing **Astro World (عالم آسترو)** on desktop browsers and mobile devices.

---

## 1. Quick Local Start
1. Start a local static file server in the project root:
   ```bash
   python -m http.server 8080
   # or
   npx serve -l 8080
   ```
2. Open your browser at: `http://localhost:8080/`

---

## 2. Playtesting Checklist

### A. Landing Page & Header
- [ ] **Astro Avatar:** Verify the SVG Astro avatar displays cleanly with eyes, eyebrows, and helmet visor.
- [ ] **Live Ticker:** Check that the Space Weather Ticker displays recent solar flare data with its honest data badge (`LIVE`, `SNAPSHOT`, or `ARCHIVED`).
- [ ] **Language Toggle:** Click "English" / "العربية" button in the header. Verify the entire UI switches dynamically and switches document direction between LTR and RTL.
- [ ] **Audio Mute:** Click the speaker icon (🔊 / 🔇). Verify that click sounds and alert beeps are silenced when muted.

### B. Game 1: Outpost Survival Simulator (`#/outpost`)
- [ ] **Setup:** Choose destination (Moon vs Mars), mission length (5 vs 10 turns), and difficulty. Click "Start Outpost Mission".
- [ ] **Seeded PRNG:** Note the 6-digit seed at the top right. Starting two separate windows with the same seed will yield the exact same event sequence.
- [ ] **Gauges:** Ensure Oxygen, Power, Shield, Health, and Science gauges update smoothly after each turn.
- [ ] **Power Budget:** Adjust daily power sliders/inputs (Life Support, Shield, Science). Ensure setting Life Support below 3 warns about oxygen deficit.
- [ ] **Delayed Consequences:** Select an event option that has a delayed effect (e.g., postponing scrubber cleaning). Verify that the consequence appears in the "Coming Up" queue and fires on the designated sol.
- [ ] **Terminal Outcomes:**
  - Let Oxygen or Health reach 0 → Verify the game presents the "Safe Crew Evacuation" screen without harsh punishment.
  - Survive all turns → Verify the final report card calculates Science Points, awards the "Storm Survivor" badge, and provides the real-life mission lesson.

### C. Game 2: Solar Shield Architect (`#/shield`)
- [ ] **5 Waves:** Face 5 sequential solar radiation threats (C-class flare, SEP stream, CME shockfront, Galactic Cosmic Rays, and X-class super-storm).
- [ ] **Budget Constraints:**
  - Try building 4 Water Walls → Verify the mass budget (>100) blocks deployment.
  - Try using all power without reserving at least 20 power for Life Support → Verify deployment is blocked.
- [ ] **Materials:** Verify Water Walls, Regolith Bags, and the Experimental Magnetic Deflector apply their respective attenuation factors.

### D. Game 3: Suit & Airlock Diagnostics (`#/suit`)
- [ ] **Telemetry:** Observe the 4 real-time sensor dials (Pressure, CO2, Temp, Comms Delay).
- [ ] **Step 1 Diagnosis:** Click an incorrect cause → Verify power/time penalty. Click the correct cause → Verify step 2 opens.
- [ ] **Step 2 Triage:** Execute the 3 triage actions in order. Attempting out-of-order execution must trigger a warning penalty.

### E. Mission Comms Chatbot (`#/chat`)
- [ ] Click quick prompt chips:
  - "Are there any solar storms right now?" → Bot responds with real DONKI date, flare class, and data badge.
  - "What asteroids are near Earth today?" → Bot responds with CNEOS near-Earth asteroid facts and friendly lunar distance comparisons.
  - "Show me today's NASA space photo!" → Bot responds with APOD title and image.
- [ ] Type an unrecognized question (e.g., "What is your favorite color?") → Bot politely offers the educational fallback guide.

### F. Real NASA Science Documentation (`science.html`)
- [ ] Click "NASA Science" in the header to open `science.html`.
- [ ] Verify the table of all NASA datasets, the explanation of the mathematical formulas, the transparent list of game simplifications, and the Teacher & Parent Corner with guided discussion questions.
