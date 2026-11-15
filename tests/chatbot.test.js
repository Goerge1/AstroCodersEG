/**
 * Unit Tests for Chatbot Engine ("Ask Astro")
 */

import assert from 'node:assert';
import { AstroChatbot, INTENT_KEYWORDS } from '../js/chatbot.js';

console.log("▶ Testing Chatbot: Ask Astro Engine...");

const mockHandbook = {
  answers: [
    { intent: 'solar_weather', text_en: "Solar flares erupt from sunspots.", text_ar: "التوهجات الشمسية تنفجر من البقع." },
    { intent: 'asteroids', text_en: "Asteroids orbit the Sun.", text_ar: "الكويكبات تدور حول الشمس." },
    { intent: 'eva_oxygen', text_en: "Astronauts consume oxygen under exertion.", text_ar: "يستهلك الرواد أكسجيناً أكثر بالجهد." },
    { intent: 'fallback', text_en: "Try another question Cadet!", text_ar: "جرب سؤالاً آخر يا بطل!" }
  ]
};

const bot = new AstroChatbot(mockHandbook);

// Test 1: English keyword intent matching
assert.strictEqual(bot.detectIntent("Are there any solar storm alerts?"), "solar_weather");
assert.strictEqual(bot.detectIntent("What near earth asteroids are flying past?"), "asteroids");
assert.strictEqual(bot.detectIntent("Why does oxygen run out on a spacewalk?"), "eva_oxygen");
console.log("  ✔ English intent detection resolved correctly.");

// Test 2: Arabic keyword intent matching
assert.strictEqual(bot.detectIntent("هل توجد عاصفة شمسية اليوم؟"), "solar_weather");
assert.strictEqual(bot.detectIntent("ما هي الكويكبات القريبة من كوكبنا؟"), "asteroids");
assert.strictEqual(bot.detectIntent("لماذا ينفد أكسجين البدلة في الفضاء؟"), "eva_oxygen");
console.log("  ✔ Arabic intent detection resolved correctly.");

// Test 3: Unmatched input triggers fallback
assert.strictEqual(bot.detectIntent("What is your favorite pizza topping?"), "fallback");
const fallbackResp = bot.generateResponse("fallback", "ar");
assert(fallbackResp.text.includes("يا بطل"), "Fallback response must provide guidance");
console.log("  ✔ Unrecognized input safely cascades to friendly educational fallback.");

// Test 4: Live Data integration includes honesty badge
const liveDataMock = {
  spaceWeather: {
    flares: [{ classType: "X2.1", peakTime: "2026-11-14T12:00Z", note: "Major flare" }],
    badge: { type: "LIVE", text: "LIVE NASA data, fetched today", text_ar: "بيانات حية مباشرة من NASA" }
  }
};
const liveResp = bot.generateResponse("solar_weather", "en", liveDataMock);
assert(liveResp.text.includes("X2.1"), "Live response must include flare class X2.1");
assert(liveResp.badge && liveResp.badge.type === "LIVE", "Response must attach LIVE badge");
console.log("  ✔ Live NASA data synthesis and honesty badges verified.");

console.log("✔ Chatbot: All intent and response tests passed successfully!\n");
