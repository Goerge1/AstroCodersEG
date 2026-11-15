/**
 * Astro World - Game 2 Pure Logic Engine (No DOM)
 * Solar Shield Architect
 * Features:
 * - 5 progressive radiation waves based on real space weather physics
 * - Strict dual-budget: Power Budget (100) & Mass Budget (100)
 * - Material trade-offs (Water wall, Regolith bags, Experimental Magnetic Deflector)
 * - Life support power reserve requirement
 * - Absorbed radiation dose calculation (mSv)
 */

export const SHIELD_MATERIALS = {
  water_wall: {
    id: 'water_wall',
    name_en: 'Water Wall (Hydrogen-Rich Tanks)',
    name_ar: 'جدار مائي (خزانات غنية بالهيدروجين)',
    desc_en: 'Excellent proton stopper; very heavy mass; consumes drinking water reserves.',
    desc_ar: 'حماية ممتازة لصد البروتونات؛ كتلة ثقيلة جداً؛ يستهلك من مخزون مياه الشرب.',
    powerCost: 15,
    massCost: 35,
    attenuationFactor: 0.40, // Cuts 60% of proton dose
    isExperimental: false
  },
  regolith_bags: {
    id: 'regolith_bags',
    name_en: 'Regolith Bags (Local Soil)',
    name_ar: 'أكياس الثرى (التربة القمرية/المريخية)',
    desc_en: 'Inexpensive local material; good general cosmic ray absorption; high labor mass.',
    desc_ar: 'مادة محلية رخيصة؛ امتصاص جيد للأشعة؛ ثقيلة وتتطلب جهداً في الردم.',
    powerCost: 10,
    massCost: 45,
    attenuationFactor: 0.50, // Cuts 50% of dose
    isExperimental: false
  },
  magnetic_deflector: {
    id: 'magnetic_deflector',
    name_en: 'Magnetic Field Deflector (Active Shielding)',
    name_ar: 'مولد المجال المغناطيسي (درع نشط قيد البحث)',
    desc_en: 'RESEARCH CONCEPT: An idea scientists are researching, NOT available for real habitats today. Drains huge electrical power.',
    desc_ar: 'فكرة قيد البحث العلمي المستقبلي ولم تطبق بعد في موائل الفضاء الحقيقية. يستهلك طاقة كهربائية هائلة.',
    powerCost: 55,
    massCost: 15,
    attenuationFactor: 0.65, // Cuts 35% of dose in-game
    isExperimental: true
  }
};

export const SHIELD_WAVES = [
  {
    wave: 1,
    title_en: "Solar Flare X-Ray Burst (C-Class)",
    title_ar: "وميض أشعة سينية من توهج شمسي (الفئة C)",
    baseDose_mSv: 40,
    warningTimeSeconds: 480, // 8 minutes (speed of light arrival)
    primaryHazard: "X-rays and extreme UV radiation",
    teachingFact_en: "Light and X-rays arrive in about 8 minutes from the Sun with almost no advance warning."
  },
  {
    wave: 2,
    title_en: "Solar Energetic Particle Stream (M-Class SEP)",
    title_ar: "تيار جسيمات شمسية نشطة (الفئة M)",
    baseDose_mSv: 85,
    warningTimeSeconds: 1800, // 30 minutes
    primaryHazard: "High-speed energetic protons (SEP)",
    teachingFact_en: "Solar energetic protons (SEP) arrive within 20 to 60 minutes and represent the main radiation danger to astronaut bodies."
  },
  {
    wave: 3,
    title_en: "Fast Coronal Mass Ejection Shockfront",
    title_ar: "جبهة صدمة انبعاث كتلي إكليلي (CME)",
    baseDose_mSv: 130,
    warningTimeSeconds: 7200, // 2 hours
    primaryHazard: "Dense cloud of magnetized plasma and protons",
    teachingFact_en: "CME plasma clouds travel at 1,000 to 2,000 km/s, giving 1 to 3 days of transit warning before arrival."
  },
  {
    wave: 4,
    title_en: "Galactic Cosmic Ray (GCR) Penetration Window",
    title_ar: "نافذة اختراق أشعة كونية مجرية (GCR)",
    baseDose_mSv: 100,
    warningTimeSeconds: 3600,
    primaryHazard: "Relativistic heavy atomic nuclei (HZE ions)",
    teachingFact_en: "Galactic cosmic rays originate from exploding supernovas outside our solar system and are the hardest to stop."
  },
  {
    wave: 5,
    title_en: "Super-Flare Radiation Storm (X-Class Monster)",
    title_ar: "عاصفة إشعاعية فائقة (توهج عملاق من الفئة X)",
    baseDose_mSv: 220,
    warningTimeSeconds: 900, // 15 minutes
    primaryHazard: "Extreme multi-energy proton deluge",
    teachingFact_en: "Major solar super-storms require layered habitat defenses: water bunkers, thick soil berms, and powered shields."
  }
];

export class ShieldArchitectEngine {
  constructor() {
    this.totalPowerBudget = 100;
    this.totalMassBudget = 100;
    this.minLifeSupportPower = 20; // Critical requirement

    this.currentWaveIndex = 0;
    this.totalDoseAbsorbed_mSv = 0;
    this.waveHistory = [];
    this.isGameOver = false;
    this.won = false;
  }

  getCurrentWave() {
    if (this.currentWaveIndex >= SHIELD_WAVES.length) return null;
    return SHIELD_WAVES[this.currentWaveIndex];
  }

  /**
   * Evaluate a proposed layout of materials
   * layout: { water_wall: number, regolith_bags: number, magnetic_deflector: number }
   */
  evaluateLayout(layout = {}) {
    let powerUsed = 0;
    let massUsed = 0;
    let cumulativeAttenuation = 1.0;

    for (const [matId, count] of Object.entries(layout)) {
      const mat = SHIELD_MATERIALS[matId];
      if (!mat || count <= 0) continue;

      powerUsed += mat.powerCost * count;
      massUsed  += mat.massCost * count;

      for (let i = 0; i < count; i++) {
        // Diminishing returns on layered shielding
        cumulativeAttenuation *= mat.attenuationFactor;
      }
    }

    // Constraint 1: Mass budget check
    const massOk = massUsed <= this.totalMassBudget;

    // Constraint 2: Power budget check including Life Support Reserve
    const remainingPower = this.totalPowerBudget - powerUsed;
    const powerOk = powerUsed <= this.totalPowerBudget;
    const lifeSupportOk = remainingPower >= this.minLifeSupportPower;

    const isValid = massOk && powerOk && lifeSupportOk;

    return {
      isValid,
      massUsed,
      massRemaining: this.totalMassBudget - massUsed,
      powerUsed,
      powerRemaining: remainingPower,
      lifeSupportOk,
      cumulativeAttenuation: Math.max(0.12, cumulativeAttenuation), // No layout blocks 100%
      errors: [
        !massOk ? `Mass budget exceeded (${massUsed}/${this.totalMassBudget})` : null,
        !powerOk ? `Power budget exceeded (${powerUsed}/${this.totalPowerBudget})` : null,
        !lifeSupportOk ? `Insufficient power for Life Support! Need at least ${this.minLifeSupportPower} power reserved.` : null
      ].filter(Boolean)
    };
  }

  /**
   * Submit layout to face the incoming wave
   */
  commitWave(layout = {}) {
    const wave = this.getCurrentWave();
    if (!wave || this.isGameOver) {
      throw new Error("No active wave to commit against");
    }

    const evalResult = this.evaluateLayout(layout);
    if (!evalResult.isValid) {
      throw new Error(`Invalid layout: ${evalResult.errors.join(', ')}`);
    }

    // Calculate absorbed dose
    const absorbedDose = Math.round(wave.baseDose_mSv * evalResult.cumulativeAttenuation);
    this.totalDoseAbsorbed_mSv += absorbedDose;

    const waveRecord = {
      waveNumber: wave.wave,
      waveTitle_en: wave.title_en,
      waveTitle_ar: wave.title_ar,
      incomingDose: wave.baseDose_mSv,
      absorbedDose,
      attenuationPercent: Math.round((1 - evalResult.cumulativeAttenuation) * 100),
      powerRemaining: evalResult.powerRemaining,
      massUsed: evalResult.massUsed,
      layout: { ...layout }
    };
    this.waveHistory.push(waveRecord);

    this.currentWaveIndex += 1;

    // Check game over
    // If total absorbed dose exceeds safe limits (e.g. 250 mSv), severe radiation hazard
    if (this.totalDoseAbsorbed_mSv >= 280) {
      this.isGameOver = true;
      this.won = false;
    } else if (this.currentWaveIndex >= SHIELD_WAVES.length) {
      this.isGameOver = true;
      this.won = true;
    }

    return waveRecord;
  }

  getFinalReport() {
    return {
      won: this.won,
      totalDoseAbsorbed_mSv: this.totalDoseAbsorbed_mSv,
      safeLimit_mSv: 280,
      wavesCompleted: this.waveHistory.length,
      history: this.waveHistory,
      lesson_en: "Shield architects in real life must balance mass against payload launch costs and ensure power is never diverted from life support."
    };
  }
}
