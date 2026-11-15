/**
 * Unit Tests for Game 2: Solar Shield Architect Engine
 */

import assert from 'node:assert';
import { ShieldArchitectEngine, SHIELD_MATERIALS, SHIELD_WAVES } from '../js/shield.js';

console.log("▶ Testing Game 2: Solar Shield Engine...");

// Test 1: Layouts never exceed mass or power budgets
const engine = new ShieldArchitectEngine();
const invalidLayout = {
  water_wall: 4, // 4 * 35 mass = 140 mass (Exceeds 100 limit!)
  regolith_bags: 1
};
const evalRes = engine.evaluateLayout(invalidLayout);
assert.strictEqual(evalRes.isValid, false, "Over-budget layout must be invalid");
assert(evalRes.errors.length > 0, "Errors array must report budget violation");
console.log("  ✔ Over-budget layouts correctly rejected.");

// Test 2: Life support reserve requirement
const highPowerLayout = {
  magnetic_deflector: 2 // 2 * 55 = 110 power (leaves -10 power; fails life support reserve >= 20)
};
const evalPwr = engine.evaluateLayout(highPowerLayout);
assert.strictEqual(evalPwr.isValid, false);
assert.strictEqual(evalPwr.lifeSupportOk, false, "Life support reserve of 20 power must be maintained");
console.log("  ✔ Life support power reserve requirement enforced.");

// Test 3: No layout blocks 100% of radiation within budget
const validLayout = {
  water_wall: 1,
  regolith_bags: 1
};
const evalValid = engine.evaluateLayout(validLayout);
assert.strictEqual(evalValid.isValid, true);
assert(evalValid.cumulativeAttenuation > 0, "No shield configuration can attenuate 100% of cosmic radiation");
console.log("  ✔ Scientific realism verified: Penetrating cosmic rays cannot be 100% stopped.");

// Test 4: Game can be won and lost
const winGame = new ShieldArchitectEngine();
while (!winGame.isGameOver) {
  winGame.commitWave({ water_wall: 1, regolith_bags: 1 });
}
assert.strictEqual(winGame.isGameOver, true);
assert.strictEqual(winGame.won, true, "Properly shielded outpost survives all 5 waves");

const lossGame = new ShieldArchitectEngine();
lossGame.totalDoseAbsorbed_mSv = 300; // Exceeds safety threshold of 280
lossGame.commitWave({});
assert.strictEqual(lossGame.isGameOver, true);
assert.strictEqual(lossGame.won, false, "Excessive radiation dose triggers game over");
console.log("  ✔ Game 2 Win and Radiation Threshold Failure states verified.");

console.log("✔ Game 2: All shield architect tests passed successfully!\n");
