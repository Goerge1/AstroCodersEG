/**
 * Unit Tests for Game 3: Suit & Airlock Diagnostics Engine
 */

import assert from 'node:assert';
import { DiagnosticsEngine, AVAILABLE_TRIAGE_ACTIONS, SUIT_ANOMALIES } from '../js/diagnostics.js';

console.log("▶ Testing Game 3: Suit Diagnostics Engine...");

// Test 1: Every action costs power, oxygen, or time (No free triage action)
for (const [actionId, action] of Object.entries(AVAILABLE_TRIAGE_ACTIONS)) {
  const hasCost = action.powerCost > 0 || action.o2Cost > 0;
  assert(hasCost, `Action ${actionId} must have non-zero resource cost`);
}
console.log("  ✔ Every suit triage action incurs resource costs.");

// Test 2: Correct order resolves an anomaly
const engine = new DiagnosticsEngine();
const anomaly = engine.getCurrentAnomaly();
assert(anomaly, "Must have active anomaly");

// Diagnose correctly
const diagResult = engine.diagnoseCause(anomaly.correctCauseId);
assert.strictEqual(diagResult, true, "Correct diagnosis must succeed");

// Execute correct triage sequence
for (const actionId of anomaly.correctOrder) {
  const stepRes = engine.performAction(actionId);
  assert(stepRes, "Step execution result required");
}
assert.strictEqual(engine.isSolved, true, "Executing anomaly triage in correct sequence must solve it");
console.log("  ✔ Correct sequential triage resolves suit anomaly.");

// Test 3: Out-of-order action penalizes power
const engineWrong = new DiagnosticsEngine();
const anom2 = engineWrong.getCurrentAnomaly();
const initPower = engineWrong.suitPower;

// Execute the LAST step first (wrong order)
const wrongStep = anom2.correctOrder[anom2.correctOrder.length - 1];
const wrongRes = engineWrong.performAction(wrongStep);
assert.strictEqual(wrongRes.status, 'wrong_order', "Out-of-order triage step must fail step check");
assert(engineWrong.suitPower < initPower, "Out-of-order action must penalize suit battery");
console.log("  ✔ Out-of-order triage action penalizes suit power.");

// Test 4: Resource exhaustion fails anomaly
const engineEmpty = new DiagnosticsEngine();
engineEmpty.suitPower = 5;
engineEmpty.performAction('clamp_emergency_valve'); // costs 10 power -> drops below 0
assert.strictEqual(engineEmpty.isFailed, true, "Empty battery must fail anomaly");
console.log("  ✔ Battery / Oxygen depletion triggers failure.");

console.log("✔ Game 3: All suit diagnostics tests passed successfully!\n");
