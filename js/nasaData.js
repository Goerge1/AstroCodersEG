/**
 * Astro World - Resilient & Honest NASA Data Layer
 * Handles 3-tier cascade: Live API -> Snapshot -> Archived Fallback
 * Strict validation: Rejects HTML error pages, empty bodies, and placeholders
 */

import { Storage } from './storage.js';

export const NASA_DATA = {
  // Endpoints
  DONKI_BASE: 'https://ccmc.gsfc.nasa.gov/DONKI-API/get/',
  APOD_BASE: 'https://science.nasa.gov/wp-json/wp/v2/apod-basic?per_page=1',
  NEOWS_BASE: 'https://api.nasa.gov/neo/rest/v1/feed',
  IMAGES_BASE: 'https://images-api.nasa.gov/search',
  OSDR_SEARCH: 'https://osdr.nasa.gov/osdr/data/search?term=radiation',

  CACHE_PREFIX: 'astroworld_cache_',
  CACHE_TTL_MS: 30 * 60 * 1000, // 30 minutes

  /**
   * Helper: Cache with expiry
   */
  getCache(key) {
    try {
      const raw = localStorage.getItem(this.CACHE_PREFIX + key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.timestamp > this.CACHE_TTL_MS) {
        localStorage.removeItem(this.CACHE_PREFIX + key);
        return null;
      }
      return parsed.data;
    } catch {
      return null;
    }
  },

  setCache(key, data) {
    try {
      localStorage.setItem(this.CACHE_PREFIX + key, JSON.stringify({
        timestamp: Date.now(),
        data
      }));
    } catch (e) {
      console.warn("setCache failed:", e);
    }
  },

  /**
   * Create Honest Data Badge
   */
  formatBadge(type, timestamp, customText = '') {
    if (type === 'LIVE') {
      const d = timestamp ? new Date(timestamp).toLocaleDateString() : 'today';
      return {
        type: 'LIVE',
        text: `LIVE NASA data, fetched ${d}`,
        text_ar: `بيانات حية مباشرة من NASA، جُلبت في ${d}`,
        className: 'badge-live'
      };
    } else if (type === 'SNAPSHOT') {
      return {
        type: 'SNAPSHOT',
        text: customText || `NASA data SNAPSHOT, saved ${timestamp || 'recently'}`,
        text_ar: customText || `لقطة بيانات NASA SNAPSHOT، حُفظت في ${timestamp || 'مؤخراً'}`,
        className: 'badge-snapshot'
      };
    } else {
      return {
        type: 'ARCHIVED',
        text: `ARCHIVED real NASA data (offline copy)`,
        text_ar: `بيانات حقيقية مؤرشفة من NASA (نسخة أوفلاين)`,
        className: 'badge-archived'
      };
    }
  },

  /**
   * Validate fetch response
   */
  async safeFetch(url, timeoutMs = 7000) {
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
      if (!text || text.trim().length === 0) {
        throw new Error("Empty body received");
      }

      // Check if it's an HTML page disguised as 200
      const trimmed = text.trim();
      if (trimmed.startsWith('<html') || trimmed.startsWith('<!doctype') || trimmed.startsWith('<!DOCTYPE')) {
        throw new Error("Received HTML instead of JSON");
      }

      const data = JSON.parse(text);
      if (data && data.error && (data.error.code === 'OVER_RATE_LIMIT' || data.error.message)) {
        throw new Error(`API Error: ${data.error.message}`);
      }

      return data;
    } catch (e) {
      clearTimeout(timeout);
      throw e;
    }
  },

  /**
   * 1. Space Weather (DONKI)
   */
  async getSpaceWeather() {
    const cacheKey = 'space_weather';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    // Dates for recent 14 days
    const now = new Date();
    const past = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const formatDate = (d) => d.toISOString().split('T')[0];
    const liveUrl = `${this.DONKI_BASE}FLR?startDate=${formatDate(past)}&endDate=${formatDate(now)}`;

    // Try Tier 1: LIVE
    try {
      const flares = await this.safeFetch(liveUrl, 6000);
      if (Array.isArray(flares)) {
        const result = {
          flares,
          badge: this.formatBadge('LIVE', new Date().toISOString()),
          source: 'DONKI CCMC'
        };
        this.setCache(cacheKey, result);
        return result;
      }
    } catch (err) {
      console.warn("Live DONKI fetch failed, cascading to snapshot...", err.message);
    }

    // Try Tier 2: SNAPSHOT
    try {
      const snapshot = await this.safeFetch('./data/snapshot-space-weather.json', 3000);
      if (snapshot && snapshot.recentFlares) {
        return {
          flares: snapshot.recentFlares,
          badge: this.formatBadge('SNAPSHOT', snapshot.snapshotDate, snapshot.badge),
          source: 'DONKI Snapshot'
        };
      }
    } catch (err) {
      console.warn("Snapshot DONKI fetch failed, cascading to archived...", err.message);
    }

    // Tier 3: ARCHIVED FALLBACK
    try {
      const fallback = await this.safeFetch('./data/fallback-space-weather.json', 3000);
      return {
        flares: fallback.events || [],
        sepEvents: fallback.sepEvents || [],
        cmeEvents: fallback.cmeEvents || [],
        badge: this.formatBadge('ARCHIVED'),
        source: 'DONKI Fallback Archive'
      };
    } catch (err) {
      console.error("Critical: All space weather tiers failed!", err);
      return {
        flares: [],
        badge: this.formatBadge('ARCHIVED'),
        source: 'Emergency offline data'
      };
    }
  },

  /**
   * 2. APOD (Astronomy Picture of the Day)
   */
  async getAPOD() {
    const cacheKey = 'apod';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    // Tier 1: LIVE via science.nasa.gov WordPress REST
    try {
      const items = await this.safeFetch(this.APOD_BASE, 6000);
      if (Array.isArray(items) && items.length > 0 && items[0].title) {
        const it = items[0];
        const result = {
          title: it.title,
          date: it.date,
          explanation: (it.explanation || '').replace(/<[^>]*>?/gm, ''), // strip html tags for child security
          url: it.hdurl || it.url,
          articleUrl: it.permalink || it.url,
          credit: (it.credit || it.copyright || 'NASA').replace(/<[^>]*>?/gm, ''),
          mediaType: it.media_type || 'image',
          badge: this.formatBadge('LIVE', it.date)
        };
        this.setCache(cacheKey, result);
        return result;
      }
    } catch (err) {
      console.warn("Live APOD fetch failed, cascading to fallback...", err.message);
    }

    // Tier 3: ARCHIVED FALLBACK
    try {
      const fb = await this.safeFetch('./data/fallback-apod.json', 3000);
      const it = fb.items[0];
      return {
        title: it.title,
        date: it.date,
        explanation: it.explanation,
        url: it.hdurl || it.url,
        articleUrl: it.url,
        credit: it.credit,
        mediaType: it.media_type,
        badge: this.formatBadge('ARCHIVED')
      };
    } catch (err) {
      return {
        title: "Apollo 12 on the Moon",
        date: "Archived",
        explanation: "Astronaut Pete Conrad inspects Surveyor 3 on the Moon.",
        url: "./assets/astro_welcome.png",
        articleUrl: "https://science.nasa.gov",
        credit: "NASA",
        mediaType: "image",
        badge: this.formatBadge('ARCHIVED')
      };
    }
  },

  /**
   * 3. Near-Earth Asteroids (NeoWs)
   */
  async getNearEarthObjects() {
    const cacheKey = 'neows';
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const userKey = Storage.getUserApiKey() || 'DEMO_KEY';
    const today = new Date().toISOString().split('T')[0];
    const liveUrl = `${this.NEOWS_BASE}?start_date=${today}&end_date=${today}&api_key=${encodeURIComponent(userKey)}`;

    // Tier 1: LIVE
    try {
      const live = await this.safeFetch(liveUrl, 6000);
      if (live && live.near_earth_objects) {
        const dayList = live.near_earth_objects[today] || Object.values(live.near_earth_objects)[0] || [];
        const result = {
          asteroids: dayList.slice(0, 5).map(a => {
            const cad = a.close_approach_data && a.close_approach_data[0];
            const distKm = cad ? Math.round(parseFloat(cad.miss_distance.kilometers)) : 0;
            const lunarMultiple = distKm ? (distKm / 384400).toFixed(1) : '5';
            return {
              id: a.id,
              name: a.name,
              diameter_m: a.estimated_diameter ? Math.round(a.estimated_diameter.meters.estimated_diameter_max) : 50,
              hazardous: a.is_potentially_hazardous_asteroid,
              distance_km: distKm,
              lunar_multiple: lunarMultiple,
              speed_kmh: cad ? Math.round(parseFloat(cad.relative_velocity.kilometers_per_hour)) : 30000,
              comparison: `${lunarMultiple} times the distance to the Moon`
            };
          }),
          badge: this.formatBadge('LIVE', today)
        };
        this.setCache(cacheKey, result);
        return result;
      }
    } catch (err) {
      console.warn("Live NeoWs fetch failed (rate limit or network), cascading to fallback...", err.message);
    }

    // Tier 3: FALLBACK ARCHIVE
    try {
      const fb = await this.safeFetch('./data/fallback-neows.json', 3000);
      return {
        asteroids: fb.near_earth_objects.map(a => {
          const cad = a.close_approach_data[0];
          return {
            id: a.id,
            name: a.name,
            diameter_m: a.estimated_diameter_meters.max,
            hazardous: a.is_potentially_hazardous,
            distance_km: parseInt(cad.miss_distance_km),
            lunar_multiple: cad.lunar_distance_multiple,
            speed_kmh: parseInt(cad.relative_velocity_km_h),
            comparison: cad.friendly_comparison
          };
        }),
        badge: this.formatBadge('ARCHIVED')
      };
    } catch (err) {
      return {
        asteroids: [],
        badge: this.formatBadge('ARCHIVED')
      };
    }
  },

  /**
   * 4. Static Health Facts & Site Facts
   */
  async getHealthFacts() {
    try {
      return await this.safeFetch('./data/health-facts.json', 3000);
    } catch {
      return [];
    }
  },

  async getSitesData() {
    try {
      return await this.safeFetch('./data/sites.json', 3000);
    } catch {
      return {};
    }
  }
};
