/**
 * Astro World - Game 3 Pure Logic Engine (No DOM)
 * Suit & Airlock Diagnostics
 * Features:
 * - 4 Sensor telemetry channels (Pressure, CO2, Temp, Comms Latency)
 * - Triage action sequence where order matters
 * - Limited suit battery and emergency oxygen reserves
 * - Cadet Mode support (relaxed timing, extra hints)
 * - Transparent labeling: "Game-simplified, not real suit procedures"
 */

export const SUIT_ANOMALIES = [
  {
    id: 'pressure_leak',
    title_en: 'Rapid Suit Depressurization',
    title_ar: 'هبوط سريع في ضغط البدلة',
    symptoms: {
      pressure_kpa: 18.2, // Normal is ~29.6 kPa (4.3 psi pure O2)
      co2_pct: 0.2,       // Normal < 0.4%
      temp_c: 20.5,       // Normal 19-23°C
      comms_delay_sec: 1.3
    },
    correctCauseId: 'micrometeoroid_puncture',
    causes: [
      { id: 'micrometeoroid_puncture', label_en: 'Glove/Fabric Micrometeoroid Puncture', label_ar: 'ثقب نيزكي دقيق في قفاز البدلة' },
      { id: 'blower_motor_failure', label_en: 'Ventilation Blower Motor Failure', label_ar: 'عطل في مروحة التهوية' },
      { id: 'sublimator_ice_clog', label_en: 'Sublimator Ice Blockage', label_ar: 'انسداد جليدي في نظام التبريد' }
    ],
    // Correct order of triage steps
    correctOrder: ['clamp_emergency_valve', 'inject_pure_o2', 'seal_patch'],
    timeLimitSeconds: 45
  },

  {
    id: 'co2_buildup',
    title_en: 'Hypercapnia (CO2 Scrubber Saturation)',
    title_ar: 'تراكم سام لثاني أكسيد الكربون',
    symptoms: {
      pressure_kpa: 29.5,
      co2_pct: 1.45,      // Highly elevated!
      temp_c: 21.0,
      comms_delay_sec: 1.3
    },
    correctCauseId: 'hydroxide_canister_spent',
    causes: [
      { id: 'hydroxide_canister_spent', label_en: 'Primary Lithium Hydroxide Canister Exhausted', label_ar: 'نفاد خرطوشة هيدروكسيد الليثيوم الأساسية' },
      { id: 'visor_fogging', label_en: 'Outer Visor Moisture Fog', label_ar: 'تكثف رطوبة على زجاج الخوذة' },
      { id: 'radio_frequency_jam', label_en: 'Radio Frequency Interference', label_ar: 'تشويش في ترددات الراديو' }
    ],
    correctOrder: ['activate_emergency_flush', 'switch_backup_canister', 'verify_airflow'],
    timeLimitSeconds: 45
  },

  {
    id: 'thermal_spike',
    title_en: 'Thermal Runaway (Sublimator Failure)',
    title_ar: 'ارتفاع حراري حاد (عطل وحدة التبريد)',
    symptoms: {
      pressure_kpa: 29.4,
      co2_pct: 0.25,
      temp_c: 34.8,       // Unsafely hot!
      comms_delay_sec: 1.3
    },
    correctCauseId: 'cooling_garment_pump_fault',
    causes: [
      { id: 'cooling_garment_pump_fault', label_en: 'Liquid Cooling Undergarment Pump Stalled', label_ar: 'توقف مضخة بدلة التبريد السائل الداخلية' },
      { id: 'sun_reflection_glare', label_en: 'Solar Visor Reflection Glare', label_ar: 'وهج انعكاس ضوء الشمس' },
      { id: 'o2_tank_overfill', label_en: 'Primary O2 Tank Overfill', label_ar: 'امتلاء زائد في خزان الأكسجين' }
    ],
    correctOrder: ['purge_water_loop', 'restart_cooling_pump', 'deploy_sun_visor'],
    timeLimitSeconds: 45
  },

  {
    id: 'mars_comms_blackout',
    title_en: 'Deep-Space Solar Conjunction (Radio Blackout)',
    title_ar: 'انقطاع الاتصال التام خلف الشمس (المريخ)',
    symptoms: {
      pressure_kpa: 26.1,
      co2_pct: 0.75,
      temp_c: 26.0,
      comms_delay_sec: 1200 // 20 minutes (unreachable!)
    },
    correctCauseId: 'solar_conjunction_delay',
    causes: [
      { id: 'solar_conjunction_delay', label_en: 'Sun-Blocked Planetary Conjunction (Houston Unreachable)', label_ar: 'حجب الشمس للإشارة (تعذر التواصل مع هيوستن)' },
      { id: 'headset_battery_dead', label_en: 'Headset Mic Battery Dead', label_ar: 'نفاد بطارية ميكروفون الخوذة' },
      { id: 'airlock_light_burnt', label_en: 'Airlock Halogen Lamp Failure', label_ar: 'احتراق مصباح غرفة الضغط' }
    ],
    correctOrder: ['override_earth_permission', 'execute_local_checklist', 'reboot_suit_computer'],
    timeLimitSeconds: 55
  }
];

export const AVAILABLE_TRIAGE_ACTIONS = {
  // Pressure actions
  clamp_emergency_valve: { id: 'clamp_emergency_valve', name_en: 'Clamp Emergency Umbilical Valve', name_ar: 'غلق صمام الأنبوب الطارئ', powerCost: 10, o2Cost: 5 },
  inject_pure_o2: { id: 'inject_pure_o2', name_en: 'Inject Secondary Oxygen Reserve', name_ar: 'حقن أكسجين من الخزان الاحتياطي', powerCost: 5, o2Cost: 20 },
  seal_patch: { id: 'seal_patch', name_en: 'Apply Pressure Adhesive Patch', name_ar: 'تطبيق لصقة الضغط المفرغة', powerCost: 5, o2Cost: 5 },

  // CO2 actions
  activate_emergency_flush: { id: 'activate_emergency_flush', name_en: 'Flush Suit Loop with Fresh Gas', name_ar: 'تنظيف دورة الهواء بغاز نقي', powerCost: 8, o2Cost: 15 },
  switch_backup_canister: { id: 'switch_backup_canister', name_en: 'Engage Secondary CO2 Sorbent Canister', name_ar: 'تبديل خرطوشة امتصاص CO2 الاحتياطية', powerCost: 12, o2Cost: 0 },
  verify_airflow: { id: 'verify_airflow', name_en: 'Calibrate Acoustic Airflow Sensors', name_ar: 'معايرة مجسات تدفق الهواء الصوتية', powerCost: 5, o2Cost: 0 },

  // Thermal actions
  purge_water_loop: { id: 'purge_water_loop', name_en: 'Vent Clogged Sublimator Steam', name_ar: 'تفريغ بخار وحدة التبريد المسدودة', powerCost: 10, o2Cost: 0 },
  restart_cooling_pump: { id: 'restart_cooling_pump', name_en: 'Auxiliary Water Pump Power Cycle', name_ar: 'إعادة تشغيل مضخة مياه التبريد', powerCost: 15, o2Cost: 0 },
  deploy_sun_visor: { id: 'deploy_sun_visor', name_en: 'Lower Gold Thermal Visor Shield', name_ar: 'إنزال واقي الشمس الذهبي العاكس', powerCost: 5, o2Cost: 0 },

  // Autonomy actions
  override_earth_permission: { id: 'override_earth_permission', name_en: 'Declare Autonomous EVA Emergency', name_ar: 'إعلان حالة الطوارئ المستقلة بدون الأرض', powerCost: 5, o2Cost: 0 },
  execute_local_checklist: { id: 'execute_local_checklist', name_en: 'Run Offline Emergency Checklist', name_ar: 'تنفيذ دليل الطوارئ المحفوظ بدون إنترنت', powerCost: 8, o2Cost: 5 },
  reboot_suit_computer: { id: 'reboot_suit_computer', name_en: 'Reboot Primary Telemetry Bios', name_ar: 'إعادة تشغيل كمبيوتر القياسات بالبدلة', powerCost: 15, o2Cost: 0 }
};

export class DiagnosticsEngine {
  constructor(config = {}) {
    this.isCadet = config.isCadet || false;
    this.currentAnomalyIndex = 0;
    this.suitPower = 100;
    this.suitOxygen = 100;
    this.timeRemaining = 45;

    this.diagnosedCause = null;
    this.executedActions = [];
    this.isSolved = false;
    this.isFailed = false;
    this.failureReason = '';
  }

  getCurrentAnomaly() {
    if (this.currentAnomalyIndex >= SUIT_ANOMALIES.length) return null;
    return SUIT_ANOMALIES[this.currentAnomalyIndex];
  }

  diagnoseCause(causeId) {
    const anomaly = this.getCurrentAnomaly();
    if (!anomaly || this.isFailed || this.isSolved) return false;

    this.diagnosedCause = causeId;
    if (causeId !== anomaly.correctCauseId) {
      // Penalty: Wastes power and time
      this.suitPower = Math.max(0, this.suitPower - 15);
      this.timeRemaining = Math.max(5, this.timeRemaining - 10);
      return false;
    }
    return true;
  }

  performAction(actionId) {
    const anomaly = this.getCurrentAnomaly();
    const action = AVAILABLE_TRIAGE_ACTIONS[actionId];
    if (!anomaly || !action || this.isFailed || this.isSolved) return null;

    // Deduct costs
    this.suitPower = Math.max(0, this.suitPower - action.powerCost);
    this.suitOxygen = Math.max(0, this.suitOxygen - action.o2Cost);
    this.executedActions.push(actionId);

    // Check resources
    if (this.suitPower <= 0 || this.suitOxygen <= 0) {
      this.isFailed = true;
      this.failureReason = this.suitPower <= 0 ? "Suit battery completely depleted!" : "Suit oxygen reserve emptied!";
      return { status: 'failed', reason: this.failureReason };
    }

    // Check step order
    const stepIndex = this.executedActions.length - 1;
    const expectedAction = anomaly.correctOrder[stepIndex];

    if (actionId !== expectedAction) {
      // Out of order! Penalty
      this.suitPower = Math.max(0, this.suitPower - 10);
      return { status: 'wrong_order', expected: expectedAction, executed: actionId };
    }

    // Checked if all correct steps executed
    if (this.executedActions.length === anomaly.correctOrder.length) {
      this.isSolved = true;
      return { status: 'solved', anomalyId: anomaly.id };
    }

    return { status: 'step_ok', stepIndex: this.executedActions.length, remaining: anomaly.correctOrder.length - this.executedActions.length };
  }

  nextAnomaly() {
    this.currentAnomalyIndex += 1;
    this.diagnosedCause = null;
    this.executedActions = [];
    this.isSolved = false;
    this.isFailed = false;
    this.failureReason = '';
    const next = this.getCurrentAnomaly();
    if (next) {
      this.timeRemaining = this.isCadet ? 999 : next.timeLimitSeconds;
    }
    return next;
  }
}
