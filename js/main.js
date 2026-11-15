/**
 * Astro World - SPA Router & App Bootstrap
 * Manages hash routing: #/ #/dashboard #/outpost #/shield #/suit #/chat
 * Strictly pure ES Module with no build step
 */

import { i18n } from './i18n.js';
import { Storage } from './storage.js';
import { NASA_DATA } from './nasaData.js';
import { UI } from './ui.js';
import { OutpostEngine } from './engine.js';
import { ShieldArchitectEngine, SHIELD_MATERIALS, SHIELD_WAVES } from './shield.js';
import { DiagnosticsEngine, AVAILABLE_TRIAGE_ACTIONS } from './diagnostics.js';
import { AstroChatbot } from './chatbot.js';

// Application State
const state = {
  activeRoute: '#/',
  userData: Storage.load(),
  liveData: {
    spaceWeather: null,
    nearEarthObjects: null,
    apod: null,
    healthFacts: [],
    sites: {}
  },
  // Game instances
  game1: null,
  game2: null,
  game3: null,
  chatbot: null,
  isMuted: false
};

// Simple Synth Sound Effects
function playSound(type) {
  if (state.isMuted) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'success') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'alert') {
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.setValueAtTime(220, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch {
    // AudioContext blocked
  }
}

// Router
function navigate(route) {
  window.location.hash = route;
}

function handleRoute() {
  const hash = window.location.hash || '#/';
  state.activeRoute = hash;
  const container = document.getElementById('app-view');
  if (!container) return;

  if (hash === '#/' || hash === '') {
    renderLanding(container);
  } else if (hash === '#/dashboard') {
    renderDashboard(container);
  } else if (hash === '#/outpost') {
    renderOutpostGame(container);
  } else if (hash === '#/shield') {
    renderShieldGame(container);
  } else if (hash === '#/suit') {
    renderSuitGame(container);
  } else if (hash === '#/chat') {
    renderChat(container);
  } else {
    renderLanding(container);
  }

  window.scrollTo(0, 0);
}

// -------------------------------------------------------------
// 1. Landing Page
// -------------------------------------------------------------
function renderLanding(container) {
  const lang = i18n.currentLang;
  container.innerHTML = `
    <div class="hero-card">
      <div class="hero-avatar">
        ${UI.renderAstroAvatar('happy', 110)}
        <div class="hero-speech-bubble">
          ${i18n.t('heroHook')}
        </div>
      </div>
      <div class="hero-text">
        <h1>${i18n.t('siteTitle')}</h1>
        <p>${i18n.t('tagline')}</p>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <a href="#/dashboard" class="btn btn-primary" id="btn-launch-dash">
            🚀 ${i18n.t('launchMission')}
          </a>
          <a href="./science.html" class="btn btn-secondary">
            🔬 ${i18n.t('exploreScience')}
          </a>
        </div>
      </div>
    </div>

    <!-- Live Ticker -->
    <div id="landing-ticker" class="weather-ticker">
      <div class="weather-info">
        <span style="font-size: 1.5rem;">🛰️</span>
        <div>
          <div style="font-weight: 700;">NASA Space Weather Status</div>
          <div id="ticker-status-text" style="font-size: 0.85rem; color: var(--text-muted);">
            Connecting to deep space telemetry...
          </div>
        </div>
      </div>
      <div id="ticker-badge"></div>
    </div>
  `;

  // Fetch ticker status
  NASA_DATA.getSpaceWeather().then(sw => {
    state.liveData.spaceWeather = sw;
    const txt = document.getElementById('ticker-status-text');
    const badge = document.getElementById('ticker-badge');
    if (txt && sw.flares) {
      const latest = sw.flares[sw.flares.length - 1];
      const cls = latest ? latest.classType : 'Normal';
      txt.textContent = lang === 'ar'
        ? `أحدث توهج شمسي مسجل: فئة (${cls}) • مرصد ناسا الفضائي CCMC`
        : `Latest recorded solar flare: Class (${cls}) • NASA CCMC DONKI`;
      if (badge && sw.badge) {
        badge.innerHTML = `<span class="badge-container ${sw.badge.className}">${lang === 'ar' ? sw.badge.text_ar : sw.badge.text}</span>`;
      }
    }
  });
}

// -------------------------------------------------------------
// 2. Dashboard
// -------------------------------------------------------------
function renderDashboard(container) {
  const lang = i18n.currentLang;
  const userData = Storage.load();
  const rankLabel = i18n.t(userData.rank);

  container.innerHTML = `
    <!-- Mission Ops Header -->
    <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
      <div>
        <h2 style="font-size: 1.8rem; font-weight: 800; color: var(--primary-cyan);">${i18n.t('dashboardTitle')}</h2>
        <p style="color: var(--text-muted); font-size: 0.95rem;">Select your operational station Cadet!</p>
      </div>
      <div>
        <a href="#/chat" class="btn btn-secondary">
          💬 ${i18n.t('chatBtn')}
        </a>
      </div>
    </div>

    <!-- Player Progress Bar -->
    <div class="user-status-bar">
      <div class="status-stat">
        <span class="stat-icon">⭐</span>
        <div>
          <div class="stat-value" id="dash-science-points">${userData.sciencePoints}</div>
          <div class="stat-label">${i18n.t('sciencePoints')}</div>
        </div>
      </div>

      <div class="status-stat">
        <span class="stat-icon">🎖️</span>
        <div>
          <div class="stat-value">${rankLabel}</div>
          <div class="stat-label">${i18n.t('astronautRank')}</div>
        </div>
      </div>

      <div class="status-stat">
        <span class="stat-icon">🛡️</span>
        <div>
          <div class="badge-shelf">
            ${Object.entries(userData.badges).map(([id, b]) => `
              <span class="badge-pill ${b.unlocked ? 'unlocked' : ''}" title="${lang === 'ar' ? b.desc_ar : b.desc_en}">
                ${b.unlocked ? '🏆' : '🔒'} ${lang === 'ar' ? b.name_ar : b.name_en}
              </span>
            `).join('')}
          </div>
          <div class="stat-label">${i18n.t('missionBadges')}</div>
        </div>
      </div>
    </div>

    <!-- Games Selection Grid -->
    <div class="games-grid">
      <!-- Game 1 -->
      <div class="mission-card">
        <div>
          <div class="card-icon">🏕️</div>
          <h3 class="card-title">${i18n.t('game1Title')}</h3>
          <p class="card-desc">${i18n.t('game1Desc')}</p>
        </div>
        <a href="#/outpost" class="btn btn-primary">${i18n.t('game1Btn')}</a>
      </div>

      <!-- Game 2 -->
      <div class="mission-card">
        <div>
          <div class="card-icon">🛡️</div>
          <h3 class="card-title">${i18n.t('game2Title')}</h3>
          <p class="card-desc">${i18n.t('game2Desc')}</p>
        </div>
        <a href="#/shield" class="btn btn-primary">${i18n.t('game2Btn')}</a>
      </div>

      <!-- Game 3 -->
      <div class="mission-card">
        <div>
          <div class="card-icon">👨‍🚀</div>
          <h3 class="card-title">${i18n.t('game3Title')}</h3>
          <p class="card-desc">${i18n.t('game3Desc')}</p>
        </div>
        <a href="#/suit" class="btn btn-primary">${i18n.t('game3Btn')}</a>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// 3. Game 1: Outpost Survival Simulator
// -------------------------------------------------------------
function renderOutpostGame(container) {
  const lang = i18n.currentLang;

  // If game not initialized, show Mission Setup
  if (!state.game1 || state.game1.isOver) {
    container.innerHTML = `
      <div class="event-container" style="max-width: 650px; margin: 0 auto;">
        <h2 style="color: var(--primary-cyan); font-size: 1.6rem; margin-bottom: 1rem;">
          🏕️ ${i18n.t('game1Title')}
        </h2>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">
          ${i18n.t('game1Desc')}
        </p>

        <form id="outpost-setup-form">
          <div style="margin-bottom: 1.25rem;">
            <label style="display: block; font-weight: 700; margin-bottom: 0.5rem;">Destination:</label>
            <select id="setup-site" class="chat-input" style="width: 100%;">
              <option value="moon">${i18n.t('siteMoon')}</option>
              <option value="mars">${i18n.t('siteMars')}</option>
            </select>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="display: block; font-weight: 700; margin-bottom: 0.5rem;">Mission Length:</label>
            <select id="setup-length" class="chat-input" style="width: 100%;">
              <option value="10">${i18n.t('standardMission')}</option>
              <option value="5">${i18n.t('quickMission')}</option>
            </select>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; font-weight: 700; margin-bottom: 0.5rem;">Difficulty:</label>
            <select id="setup-diff" class="chat-input" style="width: 100%;">
              <option value="commander">${i18n.t('diffCommander')}</option>
              <option value="cadet">${i18n.t('diffCadet')}</option>
              <option value="planner">${i18n.t('diffPlanner')}</option>
            </select>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%;">
            🚀 Start Outpost Mission
          </button>
        </form>
      </div>
    `;

    document.getElementById('outpost-setup-form').addEventListener('submit', (e) => {
      e.preventDefault();
      playSound('click');
      const site = document.getElementById('setup-site').value;
      const maxTurns = parseInt(document.getElementById('setup-length').value, 10);
      const diff = document.getElementById('setup-diff').value;

      state.game1 = new OutpostEngine({ site, maxTurns, difficulty: diff });
      renderOutpostTurn(container);
    });
    return;
  }

  renderOutpostTurn(container);
}

function renderOutpostTurn(container) {
  const g = state.game1;
  const lang = i18n.currentLang;

  if (g.isOver) {
    renderOutpostReportCard(container, g);
    return;
  }

  // Draw event for the turn if not present
  const event = g.currentEvent || g.drawEvent();

  container.innerHTML = `
    <!-- Top Mission Control Header -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
      <div>
        <span style="font-size: 1.3rem; font-weight: 800; color: var(--primary-cyan);">
          ${g.site === 'moon' ? '🌕 ' + i18n.t('siteMoon') : '🪐 ' + i18n.t('siteMars')}
        </span>
        <span style="margin: 0 0.5rem; color: var(--text-muted);">•</span>
        <span style="font-weight: 700; color: var(--solar-amber);">
          ${g.site === 'mars' ? i18n.t('solLabel') : i18n.t('turnLabel')} ${g.turn} / ${g.maxTurns}
        </span>
      </div>
      <div>
        <span style="font-size: 0.85rem; color: var(--text-muted);">${i18n.t('seedLabel')}: ${g.seed}</span>
      </div>
    </div>

    <!-- Colorblind-safe Resource Gauges -->
    <div class="meters-grid">
      ${UI.renderGauge('o2', '🫁', i18n.t('meterOxygen'), g.resources.oxygen)}
      ${UI.renderGauge('pwr', '🔋', i18n.t('meterPower'), g.resources.power)}
      ${UI.renderGauge('shd', '🛡️', i18n.t('meterShield'), g.resources.shield)}
      ${UI.renderGauge('hlth', '❤️', i18n.t('meterHealth'), g.resources.health, 5, ' Hearts')}
      ${UI.renderGauge('sci', '⭐', i18n.t('meterScience'), g.resources.science, 200, ' Pts')}
    </div>

    <!-- Morning Power Allocation Accordion -->
    <div class="event-container" style="margin-bottom: 1.5rem; padding: 1.25rem;">
      <h3 style="color: var(--primary-cyan); font-size: 1.15rem; margin-bottom: 0.75rem;">
        ⚡ ${i18n.t('powerBudgetTitle')} (10 Units Daily)
      </h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
        <div>
          <label style="font-size: 0.85rem; color: var(--text-muted);">${i18n.t('powerLifeSupport')} (Min 3):</label>
          <input type="number" id="pwr-ls" min="0" max="10" value="${g.powerAllocated.lifeSupport}" class="chat-input" style="width: 100%;">
        </div>
        <div>
          <label style="font-size: 0.85rem; color: var(--text-muted);">${i18n.t('powerShield')}:</label>
          <input type="number" id="pwr-sh" min="0" max="10" value="${g.powerAllocated.shield}" class="chat-input" style="width: 100%;">
        </div>
        <div>
          <label style="font-size: 0.85rem; color: var(--text-muted);">${i18n.t('powerScience')}:</label>
          <input type="number" id="pwr-sc" min="0" max="10" value="${g.powerAllocated.science}" class="chat-input" style="width: 100%;">
        </div>
      </div>
    </div>

    <!-- Active Event Card -->
    <div class="event-container">
      <div class="event-headline">
        <span class="event-icon">${event.icon}</span>
        <div>
          <h2 class="event-title">${lang === 'ar' ? event.title_ar : event.title_en}</h2>
        </div>
      </div>

      <p class="event-story">
        ${UI.annotateScienceWords(lang === 'ar' ? event.story_ar : event.story_en, lang)}
      </p>

      <!-- Choices Stack -->
      <div class="choices-stack">
        ${event.choices.map(c => `
          <button class="choice-btn" data-choice="${c.id}">
            <div class="choice-label">${lang === 'ar' ? c.label_ar : c.label_en}</div>
            <div class="choice-effects">
              ${c.lesson_en ? `💡 ${lang === 'ar' ? c.lesson_ar : c.lesson_en}` : ''}
            </div>
          </button>
        `).join('')}
      </div>

      <!-- Delayed Consequences Queue -->
      ${g.delayedEffects.length > 0 ? `
        <div style="background: rgba(15, 23, 42, 0.8); border: 1px dashed var(--solar-amber); border-radius: var(--radius-md); padding: 0.85rem 1rem;">
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--solar-amber); margin-bottom: 0.35rem;">
            ⏳ ${i18n.t('comingUp')}:
          </div>
          ${g.delayedEffects.map(d => `
            <div style="font-size: 0.8rem; color: var(--text-muted);">
              • in ${d.inTurns} turn(s): ${d.reason}
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;

  // Attach event choice handlers
  container.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      const choiceId = btn.dataset.choice;

      // Update power allocations from inputs
      const ls = parseInt(document.getElementById('pwr-ls').value, 10) || 3;
      const sh = parseInt(document.getElementById('pwr-sh').value, 10) || 3;
      const sc = parseInt(document.getElementById('pwr-sc').value, 10) || 4;
      try {
        g.setPowerAllocation(ls, sh, sc);
      } catch (err) {
        UI.showToast(err.message, 'warning');
      }

      g.chooseOption(choiceId);
      const summary = g.endTurn();

      // Show toast on significant consequences
      if (summary.consequences.length > 0) {
        UI.showToast(summary.consequences[0], 'info');
      }

      renderOutpostTurn(container);
    });
  });
}

function renderOutpostReportCard(container, g) {
  const lang = i18n.currentLang;
  const report = g.getReportCard();

  // Save science points to global user state
  Storage.addSciencePoints(report.finalScore);
  if (report.outcome === 'win') {
    Storage.unlockBadge('storm_survivor');
  }

  container.innerHTML = `
    <div class="event-container" style="max-width: 650px; margin: 0 auto; text-align: center;">
      <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">
        ${report.outcome === 'win' ? '🎉' : '🛡️'}
      </div>
      <h2 style="color: ${report.outcome === 'win' ? 'var(--primary-cyan)' : 'var(--solar-amber)'}; font-size: 1.8rem; margin-bottom: 0.5rem;">
        ${report.outcome === 'win' ? i18n.t('missionWon') : i18n.t('missionEvacuated')}
      </h2>
      <p style="color: var(--text-muted); margin-bottom: 1.5rem;">
        ${report.lessonSummary_en}
      </p>

      <div style="background: rgba(15, 23, 42, 0.9); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem;">
        <div style="font-size: 1.1rem; font-weight: 700; color: var(--primary-cyan); margin-bottom: 0.5rem;">
          Final Score: ${report.finalScore} ⭐
        </div>
        <div style="font-size: 0.9rem; color: var(--text-muted);">
          Turns Completed: ${report.turnsCompleted} / ${report.maxTurns} • Health Remaining: ${report.finalResources.health}/5
        </div>
      </div>

      <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
        <button id="btn-replay-outpost" class="btn btn-primary">
          🔄 ${i18n.t('playAgain')}
        </button>
        <a href="#/dashboard" class="btn btn-secondary">
          🏠 ${i18n.t('backToDash')}
        </a>
      </div>
    </div>
  `;

  document.getElementById('btn-replay-outpost').addEventListener('click', () => {
    state.game1 = null;
    renderOutpostGame(container);
  });
}

// -------------------------------------------------------------
// 4. Game 2: Solar Shield Architect
// -------------------------------------------------------------
function renderShieldGame(container) {
  if (!state.game2 || state.game2.isGameOver) {
    state.game2 = new ShieldArchitectEngine();
  }
  const g = state.game2;
  const lang = i18n.currentLang;
  const wave = g.getCurrentWave();

  if (g.isGameOver) {
    const report = g.getFinalReport();
    if (report.won) {
      Storage.unlockBadge('shield_architect');
      Storage.addSciencePoints(150);
    }
    container.innerHTML = `
      <div class="event-container" style="max-width: 600px; margin: 0 auto; text-align: center;">
        <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">
          ${report.won ? '🏆' : '⚠️'}
        </div>
        <h2 style="color: ${report.won ? 'var(--primary-cyan)' : 'var(--coral-red)'}; font-size: 1.8rem; margin-bottom: 0.5rem;">
          ${report.won ? 'Solar Defense Mastered!' : 'Radiation Threshold Exceeded!'}
        </h2>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">
          Total Absorbed Dose: ${report.totalDoseAbsorbed_mSv} mSv (Safety Threshold: ${report.safeLimit_mSv} mSv).
        </p>
        <button id="btn-replay-shield" class="btn btn-primary">Try Another Shielding Strategy</button>
      </div>
    `;
    document.getElementById('btn-replay-shield').addEventListener('click', () => {
      state.game2 = null;
      renderShieldGame(container);
    });
    return;
  }

  container.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <h2 style="color: var(--primary-cyan); font-size: 1.6rem; margin-bottom: 0.25rem;">
        🛡️ ${i18n.t('game2Title')} — Wave ${wave.wave} / 5
      </h2>
      <p style="color: var(--text-muted);">
        ${lang === 'ar' ? wave.waveTitle_ar : wave.title_en} (Base Danger: ${wave.baseDose_mSv} mSv)
      </p>
    </div>

    <!-- Budgets Status -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
      <div class="meter-box">
        <div class="meter-header">
          <span class="meter-label">⚡ Power Available</span>
          <span class="meter-val" id="shield-power-disp">100 / 100</span>
        </div>
        <div style="font-size: 0.75rem; color: var(--solar-amber);">Must keep ≥ 20 for Life Support!</div>
      </div>
      <div class="meter-box">
        <div class="meter-header">
          <span class="meter-label">⚖️ Mass Budget</span>
          <span class="meter-val" id="shield-mass-disp">100 / 100</span>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">Launch payload weight constraint</div>
      </div>
    </div>

    <!-- Materials Construction Choices -->
    <div class="event-container" style="margin-bottom: 1.5rem;">
      <h3 style="font-size: 1.15rem; color: var(--text-main); margin-bottom: 1rem;">
        Select Defensive Layers to Construct:
      </h3>

      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${Object.values(SHIELD_MATERIALS).map(m => `
          <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
            <div>
              <div style="font-weight: 700; color: var(--primary-cyan);">
                ${lang === 'ar' ? m.name_ar : m.name_en}
              </div>
              <div style="font-size: 0.8rem; color: var(--text-muted); max-width: 450px;">
                ${lang === 'ar' ? m.desc_ar : m.desc_en}
              </div>
              <div style="font-size: 0.8rem; color: var(--solar-amber); margin-top: 0.25rem;">
                Costs: ${m.powerCost} Power • ${m.massCost} Mass
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <button class="btn btn-secondary btn-icon mat-dec" data-mat="${m.id}">-</button>
              <span id="qty-${m.id}" style="font-weight: 700; width: 24px; text-align: center;">0</span>
              <button class="btn btn-secondary btn-icon mat-inc" data-mat="${m.id}">+</button>
            </div>
          </div>
        `).join('')}
      </div>

      <div id="shield-errors" style="color: var(--coral-red); font-size: 0.9rem; margin-top: 1rem;"></div>

      <button id="btn-deploy-shield" class="btn btn-primary" style="width: 100%; margin-top: 1.25rem;">
        ⚡ Deploy Defensive Configuration
      </button>
    </div>
  `;

  const counts = { water_wall: 0, regolith_bags: 0, magnetic_deflector: 0 };

  function updateEval() {
    const res = g.evaluateLayout(counts);
    const pwrDisp = document.getElementById('shield-power-disp');
    const mssDisp = document.getElementById('shield-mass-disp');
    const errBox = document.getElementById('shield-errors');
    if (pwrDisp) pwrDisp.textContent = `${res.powerRemaining} / 100`;
    if (mssDisp) mssDisp.textContent = `${res.massRemaining} / 100`;
    if (errBox) errBox.textContent = res.errors.join(' • ');
  }

  container.querySelectorAll('.mat-inc').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.mat;
      counts[id] = (counts[id] || 0) + 1;
      document.getElementById(`qty-${id}`).textContent = counts[id];
      updateEval();
    });
  });

  container.querySelectorAll('.mat-dec').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.mat;
      counts[id] = Math.max(0, (counts[id] || 0) - 1);
      document.getElementById(`qty-${id}`).textContent = counts[id];
      updateEval();
    });
  });

  document.getElementById('btn-deploy-shield').addEventListener('click', () => {
    playSound('click');
    try {
      const record = g.commitWave(counts);
      UI.showToast(`Wave deflected! Absorbed ${record.absorbedDose} mSv`, 'success');
      renderShieldGame(container);
    } catch (e) {
      UI.showToast(e.message, 'warning');
    }
  });
}

// -------------------------------------------------------------
// 5. Game 3: Suit Diagnostics
// -------------------------------------------------------------
function renderSuitGame(container) {
  if (!state.game3 || state.game3.isFailed || state.game3.isSolved) {
    state.game3 = new DiagnosticsEngine();
  }
  const g = state.game3;
  const lang = i18n.currentLang;
  const anomaly = g.getCurrentAnomaly();

  if (!anomaly) {
    Storage.unlockBadge('cool_head');
    Storage.addSciencePoints(120);
    container.innerHTML = `
      <div class="event-container" style="max-width: 600px; margin: 0 auto; text-align: center;">
        <div style="font-size: 3.5rem;">🧑‍🚀</div>
        <h2 style="color: var(--primary-cyan); font-size: 1.8rem; margin: 1rem 0;">Suit EVA Diagnostics Cleared!</h2>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">All life-support anomalies were rapidly triaged and resolved!</p>
        <button id="btn-replay-suit" class="btn btn-primary">Start New Diagnosis</button>
      </div>
    `;
    document.getElementById('btn-replay-suit').addEventListener('click', () => {
      state.game3 = null;
      renderSuitGame(container);
    });
    return;
  }

  container.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <h2 style="color: var(--primary-cyan); font-size: 1.6rem; margin-bottom: 0.25rem;">
        👨‍🚀 ${i18n.t('game3Title')} — Anomaly ${g.currentAnomalyIndex + 1}
      </h2>
      <div style="font-size: 0.8rem; color: var(--text-muted);">
        (Game-simplified, not real suit procedures • Source: NASA SuitUp)
      </div>
    </div>

    <!-- Suit Telemetry Gauges -->
    <div class="meters-grid">
      <div class="meter-box">
        <div class="meter-header">
          <span class="meter-label">Pressure (Normal: 29.6)</span>
          <span class="meter-val">${anomaly.symptoms.pressure_kpa} kPa</span>
        </div>
      </div>
      <div class="meter-box">
        <div class="meter-header">
          <span class="meter-label">CO2 (Normal: < 0.4%)</span>
          <span class="meter-val">${anomaly.symptoms.co2_pct}%</span>
        </div>
      </div>
      <div class="meter-box">
        <div class="meter-header">
          <span class="meter-label">Suit Temp (Normal: 21°C)</span>
          <span class="meter-val">${anomaly.symptoms.temp_c}°C</span>
        </div>
      </div>
      <div class="meter-box">
        <div class="meter-header">
          <span class="meter-label">Radio Comms Latency</span>
          <span class="meter-val">${anomaly.symptoms.comms_delay_sec}s</span>
        </div>
      </div>
    </div>

    <!-- Step 1: Diagnosis -->
    <div class="event-container" style="margin-bottom: 1.5rem;">
      <h3 style="font-size: 1.1rem; color: var(--solar-amber); margin-bottom: 0.75rem;">
        Step 1: Identify Most Likely Cause from Telemetry:
      </h3>
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        ${anomaly.causes.map(c => `
          <button class="choice-btn diag-cause" data-cause="${c.id}">
            <div class="choice-label">${lang === 'ar' ? c.label_ar : c.label_en}</div>
          </button>
        `).join('')}
      </div>
    </div>

    <!-- Step 2: Ordered Triage Execution -->
    <div class="event-container">
      <h3 style="font-size: 1.1rem; color: var(--primary-cyan); margin-bottom: 0.75rem;">
        Step 2: Execute Triage Steps in Correct Order:
      </h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem;">
        ${Object.values(AVAILABLE_TRIAGE_ACTIONS).map(a => `
          <button class="btn btn-secondary diag-action" data-action="${a.id}">
            ${lang === 'ar' ? a.name_ar : a.name_en}
          </button>
        `).join('')}
      </div>
      <div id="suit-feedback" style="margin-top: 1rem; font-weight: 700;"></div>
    </div>
  `;

  container.querySelectorAll('.diag-cause').forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      const causeId = btn.dataset.cause;
      const ok = g.diagnoseCause(causeId);
      const fb = document.getElementById('suit-feedback');
      if (ok) {
        fb.style.color = 'var(--success-green)';
        fb.textContent = "Correct Diagnosis! Now perform the right sequence of triage actions.";
      } else {
        fb.style.color = 'var(--coral-red)';
        fb.textContent = "Incorrect diagnosis! Suit power drained while re-checking sensors.";
      }
    });
  });

  container.querySelectorAll('.diag-action').forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      const actionId = btn.dataset.action;
      const res = g.performAction(actionId);
      const fb = document.getElementById('suit-feedback');
      if (!res) return;

      if (res.status === 'solved') {
        UI.showToast("Anomaly resolved successfully!", 'success');
        g.nextAnomaly();
        renderSuitGame(container);
      } else if (res.status === 'wrong_order') {
        fb.style.color = 'var(--coral-red)';
        fb.textContent = "Wrong triage step order! Follow emergency checklist sequentially.";
      } else if (res.status === 'step_ok') {
        fb.style.color = 'var(--success-green)';
        fb.textContent = `Correct step executed! ${res.remaining} steps remaining.`;
      }
    });
  });
}

// -------------------------------------------------------------
// 6. Mission Comms Chatbot ("Ask Astro")
// -------------------------------------------------------------
function renderChat(container) {
  const lang = i18n.currentLang;

  container.innerHTML = `
    <div style="margin-bottom: 1rem;">
      <h2 style="color: var(--primary-cyan); font-size: 1.6rem; margin-bottom: 0.25rem;">
        📡 ${i18n.t('chatTitle')}
      </h2>
      <div style="font-size: 0.85rem; color: var(--text-muted);">
        ${i18n.t('chatDisclaimer')}
      </div>
    </div>

    <div class="chat-window">
      <div class="chat-messages" id="chat-messages-box">
        <div class="chat-bubble chat-bubble-astro">
          ${lang === 'ar' ? 'مرحباً يا بطل! أنا آسترو رفيقك في مركز العمليات. اسألني عن العواصف الشمسية الحية، الكويكبات، صورة اليوم من ناسا، أو سر البقاء في الفضاء!' : 'Greetings Cadet! I am Astro, your Mission Control assistant. Ask me about live space weather, near-Earth asteroids, APOD, or deep-space survival!'}
        </div>
      </div>

      <!-- Quick Prompt Chips -->
      <div class="chat-chips">
        <button class="chip-btn" data-prompt="Are there any solar storms right now?">☀️ Solar Storms?</button>
        <button class="chip-btn" data-prompt="What asteroids are near Earth today?">☄️ Near-Earth Asteroids</button>
        <button class="chip-btn" data-prompt="Show me today's NASA space photo!">📸 NASA Space Photo</button>
        <button class="chip-btn" data-prompt="Why does oxygen run out faster during an EVA?">🫁 Spacewalk Oxygen</button>
        <button class="chip-btn" data-prompt="What is a Sol on Mars?">🪐 What is a Sol?</button>
      </div>

      <!-- Chat Input -->
      <form id="chat-input-form" class="chat-input-row">
        <input type="text" id="chat-text-input" class="chat-input" placeholder="${i18n.t('chatPlaceholder')}" autocomplete="off" />
        <button type="submit" class="btn btn-primary">${i18n.t('chatSend')}</button>
      </form>
    </div>
  `;

  // Init chatbot
  if (!state.chatbot) {
    NASA_DATA.safeFetch('./data/astro-answers.json', 3000).then(data => {
      state.chatbot = new AstroChatbot(data);
    }).catch(() => {
      state.chatbot = new AstroChatbot();
    });
  }

  const box = document.getElementById('chat-messages-box');
  const form = document.getElementById('chat-input-form');
  const input = document.getElementById('chat-text-input');

  function postMessage(userText) {
    if (!userText || !state.chatbot) return;

    // Append user message
    const uBubble = document.createElement('div');
    uBubble.className = 'chat-bubble chat-bubble-user';
    uBubble.textContent = userText;
    box.appendChild(uBubble);

    // Astro responds
    const intent = state.chatbot.detectIntent(userText);
    const resp = state.chatbot.generateResponse(intent, lang, state.liveData);

    const aBubble = document.createElement('div');
    aBubble.className = 'chat-bubble chat-bubble-astro';
    aBubble.textContent = resp.text;
    box.appendChild(aBubble);

    box.scrollTop = box.scrollHeight;
    UI.speak(resp.text, lang, state.isMuted);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (val) {
      postMessage(val);
      input.value = '';
    }
  });

  container.querySelectorAll('.chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      postMessage(btn.dataset.prompt);
    });
  });
}

// -------------------------------------------------------------
// App Bootstrap & Event Listeners
// -------------------------------------------------------------
function bootstrap() {
  // Set initial language from storage or browser
  const savedLang = state.userData.lang || (navigator.language && navigator.language.startsWith('ar') ? 'ar' : 'en');
  i18n.setLang(savedLang);

  // Setup Lang Toggle Button
  const langBtn = document.getElementById('btn-lang-toggle');
  if (langBtn) {
    langBtn.textContent = i18n.t('langToggle');
    langBtn.addEventListener('click', () => {
      const newLang = i18n.toggleLang();
      state.userData.lang = newLang;
      Storage.save(state.userData);
      langBtn.textContent = i18n.t('langToggle');
      handleRoute();
    });
  }

  // Setup Mute Button
  const muteBtn = document.getElementById('btn-mute-toggle');
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      state.isMuted = !state.isMuted;
      muteBtn.textContent = state.isMuted ? '🔇' : '🔊';
      UI.showToast(state.isMuted ? 'Audio muted' : 'Audio enabled', 'info');
    });
  }

  // Pre-fetch NASA data
  NASA_DATA.getSpaceWeather().then(d => { state.liveData.spaceWeather = d; });
  NASA_DATA.getNearEarthObjects().then(d => { state.liveData.nearEarthObjects = d; });
  NASA_DATA.getAPOD().then(d => { state.liveData.apod = d; });

  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

document.addEventListener('DOMContentLoaded', bootstrap);
