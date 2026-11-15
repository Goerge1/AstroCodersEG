# Astro World (عالم آسترو) 🚀

> **Interactive Space Exploration & Outpost Arcade for Kids (Ages 5–12), Classrooms, and Families**  
> Built with zero external dependencies, 100% offline-ready vanilla JavaScript (HTML5 Canvas & Web Audio), and powered by authentic NASA data.

---

## 🌟 Overview

**Astro World** takes kids on a cosmic voyage from the galaxies and a photorealistic 3D Solar System to the interactive **Space Outpost Arcade**. Designed with age-adaptive difficulty for **Junior Cadets (Ages 5–7)** and **Space Explorers (Ages 8–12)**, children earn Space Stars, unlock custom rocket cosmetics, and advance through personalized astronaut ranks.

Guided by **"آسترو" (Astro)** — a friendly robotic astronaut guide with live voice commentary — players dodge meteor storms, build radiation defense shields, and repair spacesuit life support.

---

## 🎮 The Three Outpost Arcade Games

### 1. 🚀 Meteor Dodger & Oxygen Rush
* **Gameplay:** Fast-paced HTML5 Canvas arcade where players steer a rocket to dodge fiery falling meteors, collect vital O₂ capsules, grab recharge batteries, and capture golden stars within a 45-second mission timer.
* **Kid-Friendly Physics:** Smooth touch drag, mouse tracking, and keyboard arrow controls with particle bursts, dynamic thruster trails, and screen-shake feedback.
* **Age-Adaptive:** Junior Cadets (Ages 5–7) enjoy gentler speeds and 4 shields; Space Explorers (Ages 8–12) face escalating speeds and streak combo multipliers.

### 2. 🛡️ Solar Storm Shield Builder
* **Gameplay:** Visual defense game where an incoming solar radiation wave approaches Artemis Moon Base on an animated countdown track.
* **Tactical Defenses:** Players tap and deploy the correct shield technology (Water/Ice Wall for heat/protons, Lunar Regolith armor for micrometeorites, or Magnetic Forcefield for electromagnetic flares) to deflect the wave with energetic barrier sparks!

### 3. 👨‍🚀 Astro Suit Fix-It!
* **Gameplay:** Interactive triage mini-game displaying Astro’s spacesuit with active emergency hazard zones (oxygen leaks, visor ice frost, power flickers).
* **Hands-on Tools:** Kids pick the right tool (Space Seal Tape, Thermal Laser Heater, or Energy Cell) and tap the hazard to restore Astro’s suit before the emergency timer runs out.

---

## 🏆 Ranks & Cosmetic Rewards
* **Space Stars (`ASTRO_GAME_STARS`):** Earned across all three arcade games.
* **Personalized Astronaut Ranks:** Junior Cadet 🥉 -> Moon Explorer 🥈 -> Mars Hero 🥇 -> NASA Fleet Captain 👑.
* **Custom Rocket Skins:** Classic Apollo Silver, Mars Red Nova, Neon Cyan Cruiser, and Solar Phoenix Gold.
* **Full Multi-Language & Theme Support:** English, Arabic (RTL), and French across Dark mode and Light mode (`#FFF8E7`).

---

## 🔬 Authentic NASA Open Data & The Honesty Badge

Astro World strictly adheres to honest scientific labeling. Data components feature one of three clear status badges:

1. 🟢 **LIVE NASA data, fetched [Date]:** Live data directly from NASA endpoints.
2. 🟡 **NASA data SNAPSHOT, saved [Date]:** Captured by our scheduled GitHub Actions workflow.
3. ⚪ **ARCHIVED real NASA data (offline copy):** Verified historical space weather events, real asteroid trajectories, and OSDR peer-reviewed studies.

### NASA Endpoints Used:
* **Space Weather:** NASA DONKI (CCMC) — `https://ccmc.gsfc.nasa.gov/DONKI-API/get/` (FLR, SEP, CME).
* **Near-Earth Asteroids:** NASA JPL NeoWs — `https://api.nasa.gov/neo/rest/v1/feed`.
* **Astronomy Picture of the Day:** NASA APOD REST API — `https://science.nasa.gov/wp-json/wp/v2/apod-basic?per_page=1`.
* **Astronaut Biology & Health:** NASA Open Science Data Repository (OSDR) — `https://osdr.nasa.gov/`.
* **Imagery:** NASA Image and Video Library — `https://images.nasa.gov/`.

---

## 🚀 How to Run Locally

Because Astro World uses native ES modules without build steps or bundlers, run it using any local static HTTP server:

### Option A: Python 3
```bash
python -m http.server 8080
```

### Option B: Node.js (npx serve)
```bash
npx serve -l 8080
```

Then open your browser at: **`http://localhost:8080/`**

---

## 🧪 Running the Automated Unit Test Suite

Run all unit tests using Node.js (v18, v20, or v22):

```bash
node tests/run-all.js
```

### Test Coverage:
* `tests/engine.test.js`: Validates that every choice has a real cost, resources clamp within bounds (0–100), seed determinism holds, and delayed effects trigger properly.
* `tests/shield.test.js`: Validates mass/power budgets, life support power reservations, and radiation attenuation mechanics.
* `tests/diagnostics.test.js`: Validates suit triage costs, order-dependent actions, and failure thresholds.
* `tests/chatbot.test.js`: Tests English and Arabic keyword intent detection and live data synthesis.
* `tests/nasaData.test.js`: Validates that HTML error pages, empty bodies, and rate limit errors are safely rejected, and that non-live data never claims to be LIVE.

---

## 🌐 Deploying to GitHub Pages or Netlify

### GitHub Pages:
1. Push this repository to GitHub.
2. Go to **Settings > Pages**.
3. Under **Build and deployment**, select **Source: Deploy from a branch**, choose `main`, folder `/ (root)`, and click **Save**.
4. Your site will be live at `https://<username>.github.io/<repo>/`!

### Automated Daily Data Snapshots (Optional):
The included workflow `.github/workflows/nasa-snapshot.yml` can run daily to fetch the latest DONKI space weather updates, saving them to `data/snapshot-space-weather.json` without any manual intervention.

---

## 🔑 Custom NASA API Key (Optional)

By default, the application runs on NASA's public endpoints and offline fallbacks. If you have a free NASA API key from [api.nasa.gov](https://api.nasa.gov), you can save it directly in the settings gear modal. It is stored exclusively in your browser's private `localStorage` and is never transmitted or committed to code.

---

## ⚖️ Attribution & Disclaimer

* **Disclaimer:** This project is not affiliated with or endorsed by NASA.
* All scientific datasets, spacecraft telemetry standards, and mission imagery are credited to the National Aeronautics and Space Administration (NASA).
