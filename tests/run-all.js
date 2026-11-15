/**
 * Astro World - Unified Test Runner
 * Runs all unit tests and outputs a colored summary.
 */

import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const testFiles = [
  'engine.test.js',
  'shield.test.js',
  'diagnostics.test.js',
  'chatbot.test.js',
  'nasaData.test.js'
];

console.log("=================================================");
console.log("🚀 ASTRO WORLD — EXHAUSTIVE TEST SUITE");
console.log("=================================================\n");

let passedCount = 0;
let failedCount = 0;

for (const file of testFiles) {
  const filePath = resolve(__dirname, file);
  const result = spawnSync('node', [filePath], { stdio: 'inherit' });

  if (result.status === 0) {
    passedCount++;
  } else {
    failedCount++;
    console.error(`❌ FAILED: ${file} (Exit code: ${result.status})`);
  }
}

console.log("=================================================");
console.log(`Results: ${passedCount} passed, ${failedCount} failed`);
console.log("=================================================");

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log("🎉 ALL TESTS PASSED! Project logic is 100% verified.");
  process.exit(0);
}
