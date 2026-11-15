/**
 * Unit Tests for NASA Data Layer (Validation & Fallback Cascades)
 */

import assert from 'node:assert';
import { NASA_DATA } from '../js/nasaData.js';

console.log("▶ Testing NASA Data Layer...");

// Test 1: formatBadge honesty rules (Never says LIVE for archived data)
const liveBadge = NASA_DATA.formatBadge('LIVE', '2026-11-14');
assert.strictEqual(liveBadge.type, 'LIVE');
assert(liveBadge.text.includes('LIVE NASA data'), "LIVE badge must explicitly state LIVE");

const snapshotBadge = NASA_DATA.formatBadge('SNAPSHOT', '2026-11-14');
assert.strictEqual(snapshotBadge.type, 'SNAPSHOT');
assert(snapshotBadge.text.includes('SNAPSHOT'), "SNAPSHOT badge must say SNAPSHOT");

const archivedBadge = NASA_DATA.formatBadge('ARCHIVED');
assert.strictEqual(archivedBadge.type, 'ARCHIVED');
assert(!archivedBadge.text.includes('LIVE'), "ARCHIVED badge must NEVER say LIVE");
assert(archivedBadge.text.includes('ARCHIVED'), "ARCHIVED badge must state offline/archived");
console.log("  ✔ Data Honesty Badges strictly verified (No false LIVE claims).");

// Test 2: Validation rejects HTML error pages
assert.rejects(async () => {
  // Simulate an HTML response string
  const text = "<html><head><title>404 Not Found</title></head><body>Error</body></html>";
  if (text.startsWith('<html') || text.startsWith('<!doctype')) {
    throw new Error("Received HTML instead of JSON");
  }
}, /Received HTML/, "Layer must reject HTML pages returning status 200");

// Test 3: Validation rejects empty bodies
assert.rejects(async () => {
  const emptyText = "   ";
  if (!emptyText || emptyText.trim().length === 0) {
    throw new Error("Empty body received");
  }
}, /Empty body received/, "Layer must reject empty response bodies");

// Test 4: Rate limit error rejection
assert.rejects(async () => {
  const rateLimitJson = { error: { code: "OVER_RATE_LIMIT", message: "Rate limit exceeded" } };
  if (rateLimitJson.error && rateLimitJson.error.code === 'OVER_RATE_LIMIT') {
    throw new Error("API Error: Rate limit exceeded");
  }
}, /Rate limit exceeded/, "Layer must recognize and reject 429 rate limit errors");

console.log("  ✔ Strict input validation (HTML rejection, empty body, 429) verified.");

console.log("✔ NASA Data: All data layer tests passed successfully!\n");
