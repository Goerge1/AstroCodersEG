/**
 * Astro World - Game 1 Pure Logic Engine (No DOM)
 * Outpost Survival Simulator
 * Features:
 * - Mulberry32 seeded PRNG
 * - Rigid resource constraints & boundary checks
 * - Morning power budgeting & delayed consequence queue
 * - Unit testable, deterministic with seed
 */

import { EVENT_CARDS } from './events.js';

export class OutpostEngine {
  constructor(config = {}) {
    this.seed = config.seed !== undefined ? config.seed : Math.floor(Math.random() * 1000000);
    this.prngState = this.seed >>> 0;

    this.site = config.site || 'moon'; // 'moon' | 'mars'
    this.difficulty = config.difficulty || 'commander'; // 'cadet' | 'commander' | 'planner'
    this.maxTurns = config.maxTurns || 10; // 5 for quick, 10 for standard

    this.turn = 1;
    this.isOver = false;
    this.outcome = null; // 'win' | 'evacuated'

    // Resources (0 - 100)
    this.resources = {
      oxygen: 80,
      power: 80,  // Stored battery charge
      shield: 80, // Radiation hull integrity
      health: 5,  // Crew Hearts (0 to 5)
      science: 0  // Science points earned
    };

    // Power generation & distribution per turn
    this.dailyPowerUnits = 10;
    this.powerAllocated = {
      lifeSupport: 4,
      shield: 3,
      science: 3
    };
    this.batteryLeakPerTurn = 2;

    // Environmental solar space weather multiplier (default normal: 1.0)
    this.spaceWeatherMultiplier = config.spaceWeatherMultiplier || 1.0;
    this.spaceWeatherNote = config.spaceWeatherNote || '';

    // Delayed effects queue: [ { inTurns: number, effects: {}, reason: string } ]
    this.delayedEffects = [];

    // History log for report card
    this.turnLogs = [];
    this.usedEventIds = new Set();
    this.currentEvent = null;
  }

  /**
   * Seeded PRNG: Mulberry32 algorithm
   */
  random() {
    let t = (this.prngState += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Clamp resources within bounds
   */
  clampResources() {
    this.resources.oxygen = Math.max(0, Math.min(100, Math.round(this.resources.oxygen)));
    this.resources.power  = Math.max(0, Math.min(100, Math.round(this.resources.power)));
    this.resources.shield = Math.max(0, Math.min(100, Math.round(this.resources.shield)));
    this.resources.health = Math.max(0, Math.min(5, Math.round(this.resources.health)));
    this.resources.science = Math.max(0, Math.round(this.resources.science));
  }

  /**
   * Set Morning Power Budget
   */
  setPowerAllocation(lifeSupport, shield, science) {
    const total = lifeSupport + shield + science;
    if (total > this.dailyPowerUnits) {
      throw new Error(`Total allocated power (${total}) exceeds daily generation limit (${this.dailyPowerUnits})`);
    }
    this.powerAllocated = {
      lifeSupport: Math.max(0, lifeSupport),
      shield: Math.max(0, shield),
      science: Math.max(0, science)
    };
    // Unallocated power charges battery
    const surplus = this.dailyPowerUnits - total;
    this.resources.power = Math.min(100, this.resources.power + surplus);
  }

  /**
   * Draw next event card based on site & PRNG
   */
  drawEvent() {
    const validEvents = EVENT_CARDS.filter(e => {
      const siteMatch = e.site === 'both' || e.site === this.site;
      return siteMatch && !this.usedEventIds.has(e.id);
    });

    const pool = validEvents.length > 0 ? validEvents : EVENT_CARDS.filter(e => e.site === 'both' || e.site === this.site);
    const index = Math.floor(this.random() * pool.length);
    const chosen = pool[index];
    this.usedEventIds.add(chosen.id);
    this.currentEvent = chosen;
    return chosen;
  }

  /**
   * Choose an option on the current event card
   */
  chooseOption(choiceId) {
    if (!this.currentEvent) {
      throw new Error("No active event card drawn");
    }
    const choice = this.currentEvent.choices.find(c => c.id === choiceId);
    if (!choice) {
      throw new Error(`Invalid choice id: ${choiceId}`);
    }

    const logEntry = {
      turn: this.turn,
      eventId: this.currentEvent.id,
      eventTitle_en: this.currentEvent.title_en,
      eventTitle_ar: this.currentEvent.title_ar,
      choiceId: choice.id,
      choiceLabel_en: choice.label_en,
      choiceLabel_ar: choice.label_ar,
      lesson_en: choice.lesson_en,
      lesson_ar: choice.lesson_ar,
      realFact_en: this.currentEvent.realFact_en,
      realFact_ar: this.currentEvent.realFact_ar,
      appliedEffects: {},
      riskTriggered: false
    };

    // Apply immediate effects
    for (const [res, val] of Object.entries(choice.effects || {})) {
      this.resources[res] = (this.resources[res] || 0) + val;
      logEntry.appliedEffects[res] = val;
    }

    // Probabilistic risk calculation
    if (choice.riskChance && choice.riskEffects) {
      const roll = this.random();
      if (roll < choice.riskChance) {
        logEntry.riskTriggered = true;
        for (const [res, val] of Object.entries(choice.riskEffects)) {
          this.resources[res] = (this.resources[res] || 0) + val;
          logEntry.appliedEffects[res] = (logEntry.appliedEffects[res] || 0) + val;
        }
      }
    }

    // Queue delayed effects
    if (Array.isArray(choice.delayedEffects)) {
      for (const d of choice.delayedEffects) {
        this.delayedEffects.push({
          inTurns: d.inTurns,
          effects: { ...d.effects },
          reason: d.reason
        });
      }
    }

    this.turnLogs.push(logEntry);
    this.clampResources();

    return logEntry;
  }

  /**
   * End the current turn, apply power allocations, environmental conditions & delayed effects
   */
  endTurn() {
    const endTurnSummary = {
      turn: this.turn,
      consequences: [],
      delayedTriggered: []
    };

    // 1. Life support evaluation: needs at least 3 power units
    if (this.powerAllocated.lifeSupport < 3) {
      const diff = 3 - this.powerAllocated.lifeSupport;
      const o2Loss = diff * 8;
      this.resources.oxygen -= o2Loss;
      endTurnSummary.consequences.push(`Underpowered life support caused an oxygen deficit (-${o2Loss}% O2)`);
      if (this.resources.oxygen < 30) {
        this.resources.health -= 1;
        endTurnSummary.consequences.push("Low oxygen levels caused crew asphyxiation stress (-1 Health)");
      }
    } else {
      // Healthy life support provides slight oxygen recovery if battery allows
      if (this.resources.power > 10 && this.resources.oxygen < 95) {
        this.resources.oxygen += 4;
      }
    }

    // 2. Shield evaluation: base required 3 units, scaled by space weather multiplier
    const requiredShieldPower = Math.round(3 * this.spaceWeatherMultiplier);
    if (this.powerAllocated.shield < requiredShieldPower) {
      const shieldDeficit = (requiredShieldPower - this.powerAllocated.shield) * 10;
      this.resources.shield -= shieldDeficit;
      endTurnSummary.consequences.push(`Solar radiation weakened unprotected hull shielding (-${shieldDeficit}% Shield)`);
      if (this.resources.shield < 25) {
        this.resources.health -= 1;
        endTurnSummary.consequences.push("Severe radiation penetration caused crew illness (-1 Health)");
      }
    }

    // 3. Science payout from allocated power
    if (this.powerAllocated.science > 0) {
      const sciGained = this.powerAllocated.science * 4;
      this.resources.science += sciGained;
      endTurnSummary.consequences.push(`Laboratory sensors generated ${sciGained} Science Points`);
    }

    // 4. Stored battery leak / parasitic drain
    this.resources.power = Math.max(0, this.resources.power - this.batteryLeakPerTurn);

    // 5. Site-specific natural events
    if (this.site === 'moon' && this.turn >= 6 && this.turn <= 8) {
      // Lunar Night event (cold darkness)
      this.resources.power = Math.max(0, this.resources.power - 10);
      endTurnSummary.consequences.push("Lunar Night: Zero solar generation, habitat draws 10 power for heaters");
    } else if (this.site === 'mars' && this.turn === 4) {
      // Mars atmospheric dust storm
      this.resources.power = Math.max(0, this.resources.power - 8);
      endTurnSummary.consequences.push("Martian dust storm dims solar panels (-8 Power)");
    }

    // 6. Process delayed effects queue
    const remainingDelayed = [];
    for (const d of this.delayedEffects) {
      d.inTurns -= 1;
      if (d.inTurns <= 0) {
        // Trigger!
        for (const [res, val] of Object.entries(d.effects)) {
          this.resources[res] = (this.resources[res] || 0) + val;
        }
        endTurnSummary.delayedTriggered.push(d.reason);
      } else {
        remainingDelayed.push(d);
      }
    }
    this.delayedEffects = remainingDelayed;

    this.clampResources();

    // 7. Check Win / Loss conditions
    if (this.resources.health <= 0 || this.resources.oxygen <= 0) {
      this.isOver = true;
      this.outcome = 'evacuated';
      endTurnSummary.finalOutcome = 'evacuated';
    } else if (this.turn >= this.maxTurns) {
      this.isOver = true;
      this.outcome = 'win';
      endTurnSummary.finalOutcome = 'win';
    } else {
      this.turn += 1;
      this.currentEvent = null;
    }

    return endTurnSummary;
  }

  /**
   * Final Mission Report Card
   */
  getReportCard() {
    const survivalBonus = this.outcome === 'win' ? 100 : 20;
    const finalScore = this.resources.science + survivalBonus + (this.resources.health * 15);

    return {
      site: this.site,
      difficulty: this.difficulty,
      seed: this.seed,
      turnsCompleted: this.turn,
      maxTurns: this.maxTurns,
      outcome: this.outcome,
      finalResources: { ...this.resources },
      finalScore,
      decisionsCount: this.turnLogs.length,
      history: this.turnLogs,
      lessonSummary_en: this.outcome === 'win'
        ? "Superb mission! Real space mission planners always balance redundancy, risk-taking, and resource limits."
        : "Safe crew evacuation executed. Remember: In deep space, an ounce of prevention in life support is worth a pound of cure!"
    };
  }
}
