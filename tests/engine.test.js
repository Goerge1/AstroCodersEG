/**
 * Unit Tests for Game 1: Outpost Survival Engine
 */

import assert from 'node:assert';
import { OutpostEngine } from '../js/engine.js';
import { EVENT_CARDS } from '../js/events.js';

console.log("▶ Testing Game 1: Outpost Engine...");

// Test 1: Verify NO choice in ANY event card is free (Every choice has a real cost)
for (const card of EVENT_CARDS) {
  assert(card.choices && card.choices.length >= 2, `Card ${card.id} must have at least 2 choices`);
  for (const choice of card.choices) {
    let hasCost = false;

    // Check immediate resource deductions
    for (const [res, val] of Object.entries(choice.effects || {})) {
      if (val < 0) hasCost = true;
    }
    // Check delayed costs
    if (choice.delayedEffects && choice.delayedEffects.length > 0) {
      for (const d of choice.delayedEffects) {
        for (const [res, val] of Object.entries(d.effects || {})) {
          if (val < 0) hasCost = true;
        }
      }
    }
    // Check risk costs
    if (choice.riskChance && choice.riskEffects) {
      hasCost = true;
    }

    assert(hasCost, `Violation: Choice "${choice.id}" in card "${card.id}" has NO real cost!`);
  }
}
console.log("  ✔ All 16 event card choices have non-zero costs (No Free Lunch Rule enforced).");

// Test 2: Seed determinism - Same seed produces exact same events & random rolls
const engineA = new OutpostEngine({ seed: 424242, site: 'moon', maxTurns: 5 });
const engineB = new OutpostEngine({ seed: 424242, site: 'moon', maxTurns: 5 });

const rollA1 = engineA.random();
const rollB1 = engineB.random();
assert.strictEqual(rollA1, rollB1, "PRNG Mulberry32 must be strictly deterministic with identical seeds");

const eventA = engineA.drawEvent();
const eventB = engineB.drawEvent();
assert.strictEqual(eventA.id, eventB.id, "Identical seeds must draw identical event cards");
console.log("  ✔ Seed determinism verified (Mulberry32 PRNG).");

// Test 3: Resource boundary constraints (Never < 0, Never > 100)
const engineBounds = new OutpostEngine({ seed: 100 });
engineBounds.resources.oxygen = 150;
engineBounds.resources.power = -50;
engineBounds.clampResources();
assert.strictEqual(engineBounds.resources.oxygen, 100, "Oxygen must not exceed 100");
assert.strictEqual(engineBounds.resources.power, 0, "Power must not drop below 0");
console.log("  ✔ Resource boundaries clamped between 0 and 100.");

// Test 4: Delayed consequences trigger properly
const engineDelayed = new OutpostEngine({ seed: 999, maxTurns: 5 });
engineDelayed.delayedEffects.push({
  inTurns: 1,
  effects: { oxygen: -20 },
  reason: "Test filter failure"
});
const prevO2 = engineDelayed.resources.oxygen;
engineDelayed.endTurn();
assert.strictEqual(engineDelayed.resources.oxygen, prevO2 - 20, "Delayed effect must fire when inTurns reaches 0");
console.log("  ✔ Delayed consequence queue fired and applied effects correctly.");

// Test 5: Game can be won and lost
const winEngine = new OutpostEngine({ seed: 123, maxTurns: 1 });
winEngine.endTurn();
assert.strictEqual(winEngine.isOver, true);
assert.strictEqual(winEngine.outcome, 'win', "Mission reaching max turns with health > 0 must be won");

const lossEngine = new OutpostEngine({ seed: 123, maxTurns: 10 });
lossEngine.resources.health = 0;
lossEngine.clampResources();
lossEngine.endTurn();
assert.strictEqual(lossEngine.isOver, true);
assert.strictEqual(lossEngine.outcome, 'evacuated', "Health reaching 0 must trigger safe crew evacuation");
console.log("  ✔ Win and Loss (Safe Evacuation) terminal states verified.");

console.log("✔ Game 1: All engine tests passed successfully!\n");
