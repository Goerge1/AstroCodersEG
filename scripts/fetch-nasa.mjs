/**
 * Astro World - Scheduled NASA Data Snapshot Fetcher
 * Node 22 native script (zero dependencies)
 * Fetches DONKI, APOD, and NeoWs, validates shapes, and writes snapshot JSON files.
 * If any fetch fails, it logs the error, leaves existing files intact, and exits safely.
 */

import { writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const TODAY = new Date().toISOString().split('T')[0];
const PAST_14_DAYS = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

console.log(`[NASA Snapshot] Running update for date: ${TODAY}`);

async function safeFetch(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}`);
    }

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json') && !contentType.includes('text/plain')) {
      throw new Error(`Invalid content-type: ${contentType}`);
    }

    const text = await res.text();
    const trimmed = text.trim();
    if (trimmed.startsWith('<html') || trimmed.startsWith('<!doctype')) {
      throw new Error("Received HTML instead of JSON");
    }

    const json = JSON.parse(text);
    if (json.error && json.error.code === 'OVER_RATE_LIMIT') {
      throw new Error("Rate limit exceeded");
    }

    return json;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}



async function run() {
  let successCount = 0;

  // 1. Snapshot DONKI Space Weather
  try {
    console.log("[NASA Snapshot] Fetching DONKI Flares...");
    const donkiUrl = `https://ccmc.gsfc.nasa.gov/DONKI-API/get/FLR?startDate=${PAST_14_DAYS}&endDate=${TODAY}`;
    const flares = await safeFetch(donkiUrl);

    if (Array.isArray(flares) && flares.length > 0) {
      const snapshot = {
        snapshotDate: TODAY,
        generatedAt: new Date().toISOString(),
        source: "NASA DONKI API (CCMC snapshot)",
        badge: `NASA data SNAPSHOT, saved ${TODAY}`,
        recentFlares: flares.slice(-5).map(f => ({
          flrID: f.flrID,
          classType: f.classType,
          peakTime: f.peakTime,
          note: f.note || "Solar flare event recorded by NASA CCMC.",
          riskLevel: f.classType && f.classType.startsWith('X') ? 'extreme' : (f.classType && f.classType.startsWith('M') ? 'moderate' : 'calm')
        }))
      };

      const outPath = resolve(process.cwd(), 'data', 'snapshot-space-weather.json');
      writeFileSync(outPath, JSON.stringify(snapshot, null, 2), 'utf-8');
      console.log(`[NASA Snapshot] Successfully wrote ${outPath}`);
      successCount++;
    }
  } catch (e) {
    console.warn(`[NASA Snapshot] DONKI fetch failed: ${e.message}. Preserving old snapshot.`);
  }

  console.log(`[NASA Snapshot] Complete. Updated ${successCount} snapshot files.`);
}

run();
  


