/**
 * Astro World - "Ask Astro" Chatbot Logic (Pure Functions)
 * Matches English & Arabic keywords to intents without external generative AI.
 * Synthesizes answers using real NASA data, snapshots, and curated science.
 */

export const INTENT_KEYWORDS = {
  solar_weather: {
    en: ['solar', 'flare', 'storm', 'cme', 'sun', 'sunspot', 'space weather', 'corona'],
    ar: ['عاصفة شمسية', 'شمس', 'توهج', 'انبعاث', 'إكليلي', 'طقس الفضاء', 'بروتونات', 'رياح شمسية']
  },
  asteroids: {
    en: ['asteroid', 'neows', 'near earth', 'rock', 'meteor', 'impact', 'flyby'],
    ar: ['كويكب', 'كويكبات', 'صخرة', 'شهاب', 'نيزك', 'اقتراب', 'ارتطام']
  },
  apod: {
    en: ['photo', 'picture', 'image', 'apod', 'astronomy picture', 'hubble', 'webb'],
    ar: ['صورة اليوم', 'صورة', 'فلكية', 'ناسا اليوم', 'تلسكوب', 'صورة الفضاء']
  },
  eva_oxygen: {
    en: ['eva', 'spacewalk', 'breath', 'oxygen run out', 'suit air', 'breathe fast'],
    ar: ['أكسجين', 'سير في الفضاء', 'تنفس', 'بدلة', 'ينفد الأكسجين', 'سير فضائي']
  },
  radiation: {
    en: ['radiation', 'dose', 'sievert', 'shield', 'cancer', 'cosmic rays', 'sunburn'],
    ar: ['إشعاع', 'أشعة كونية', 'سيفرت', 'جرعة', 'حروق', 'درع إشعاعي']
  },
  sol_mars: {
    en: ['sol', 'mars day', 'how long is a sol', 'martian time', 'sol length'],
    ar: ['صول', 'يوم المريخ', 'كم طول اليوم', 'التوقيت المريخي', 'يوم مريخي']
  },
  mars_delay: {
    en: ['delay', 'communication', 'radio lag', 'talk to earth', 'light minutes', 'houston'],
    ar: ['تأخر الاتصال', 'لاسلكي', 'تأخير الراديو', 'محادثة الأرض', 'سرعة الضوء', 'هيوستن']
  },
  lunar_night: {
    en: ['lunar night', 'moon night', 'two weeks', 'cold moon', 'dark moon'],
    ar: ['ليل القمر', 'الليل القمري', 'أسبوعين', 'برد القمر', 'ظلام القمر']
  },
  health: {
    en: ['health', 'bone', 'muscle', 'exercise', 'sick', 'gravity', 'space sickness'],
    ar: ['صحة', 'عظام', 'عضلات', 'تمارين', 'ضمور', 'انعدام الوزن', 'مرض']
  }
};

export class AstroChatbot {
  constructor(curatedAnswers = {}) {
    this.curated = curatedAnswers.answers || [];
  }

  /**
   * Parse user message into best matching intent
   */
  detectIntent(message = '') {
    const clean = message.toLowerCase().trim();
    if (!clean) return 'fallback';

    let bestIntent = 'fallback';
    let maxMatches = 0;

    for (const [intent, lists] of Object.entries(INTENT_KEYWORDS)) {
      let matches = 0;
      const combined = [...(lists.en || []), ...(lists.ar || [])];

      for (const kw of combined) {
        if (clean.includes(kw.toLowerCase())) {
          matches += 1;
        }
      }

      if (matches > maxMatches) {
        maxMatches = matches;
        bestIntent = intent;
      }
    }

    return bestIntent;
  }

  /**
   * Build complete answer citing NASA data & badge
   */
  generateResponse(intent, lang = 'ar', liveData = {}) {
    const isAr = lang === 'ar';
    const curatedItem = this.curated.find(c => c.intent === intent);

    // 1. Dynamic Solar Weather Intent
    if (intent === 'solar_weather' && liveData.spaceWeather) {
      const sw = liveData.spaceWeather;
      const flares = sw.flares || [];
      const latest = flares[flares.length - 1];
      const badge = sw.badge || { text: 'NASA DONKI', text_ar: 'مرصد ناسا' };
      const badgeText = isAr ? badge.text_ar : badge.text;

      if (latest) {
        const cls = latest.classType || 'B-Class';
        const date = latest.peakTime ? latest.peakTime.split('T')[0] : 'recently';
        const note = latest.note ? ` ("${latest.note.slice(0, 80)}...")` : '';

        return {
          intent,
          text: isAr
            ? `🚀 [${badgeText}]\nرصدت مراصد ناسا توهجاً شمسياً حديثاً بقوة ${cls} في تاريخ ${date}! التوهجات تطلق جسيمات مشحونة وأشعة سينية تسافر بسرعة مذهلة عبر الفضاء.${note}\nالمصدر: https://ccmc.gsfc.nasa.gov/DONKI/`
            : `🚀 [${badgeText}]\nNASA DONKI recorded a recent solar flare (Class ${cls}) on ${date}! Solar flares emit X-rays and high-energy particles that stream past planetary orbits.${note}\nSource: https://ccmc.gsfc.nasa.gov/DONKI/`,
          badge
        };
      }
    }

    // 2. Dynamic Near-Earth Asteroids Intent
    if (intent === 'asteroids' && liveData.nearEarthObjects) {
      const neo = liveData.nearEarthObjects;
      const list = neo.asteroids || [];
      const badge = neo.badge || { text: 'NASA JPL NeoWs', text_ar: 'وكالة ناسا' };
      const badgeText = isAr ? badge.text_ar : badge.text;

      if (list.length > 0) {
        const a = list[0];
        return {
          intent,
          text: isAr
            ? `☄️ [${badgeText}]\nيراقب مركز ناسا (CNEOS) كويكباً اسمه ${a.name} بقطر تقديري ${a.diameter_m} متراً! يمر بسلام على مسافة ${a.comparison} بسرعة ${a.speed_kmh.toLocaleString()} كم/ساعة.\nالمصدر: https://cneos.jpl.nasa.gov/`
            : `☄️ [${badgeText}]\nNASA CNEOS is tracking asteroid ${a.name} (~${a.diameter_m}m wide)! It safely cruises past at ${a.comparison} traveling at ${a.speed_kmh.toLocaleString()} km/h.\nSource: https://cneos.jpl.nasa.gov/`,
          badge
        };
      }
    }

    // 3. Dynamic APOD Intent
    if (intent === 'apod' && liveData.apod) {
      const apod = liveData.apod;
      const badge = apod.badge || { text: 'NASA APOD', text_ar: 'صورة ناسا' };
      const badgeText = isAr ? badge.text_ar : badge.text;

      return {
        intent,
        text: isAr
          ? `📸 [${badgeText}]\nصورة اليوم الفلكية من ناسا بعنوان: "${apod.title}" (${apod.date}).\n${apod.explanation}\nحقوق الصورة: ${apod.credit}\nالرابط: ${apod.articleUrl}`
          : `📸 [${badgeText}]\nNASA Astronomy Picture of the Day: "${apod.title}" (${apod.date}).\n${apod.explanation}\nCredit: ${apod.credit}\nLink: ${apod.articleUrl}`,
        badge,
        imageUrl: apod.url
      };
    }

    // 4. Curated Handcrafted Science Answers
    if (curatedItem) {
      const sourceUrl = curatedItem.sourceUrl || "https://science.nasa.gov/";
      return {
        intent,
        text: isAr
          ? `🤖 آسترو يقول:\n${curatedItem.text_ar}\nالمصدر الموثق: ${sourceUrl}`
          : `🤖 Astro says:\n${curatedItem.text_en}\nVerified Source: ${sourceUrl}`,
        badge: { type: 'VERIFIED', text: 'Verified NASA Science Fact', text_ar: 'حقيقة علمية معتمدة من ناسا' }
      };
    }

    // Fallback
    const fallback = this.curated.find(c => c.intent === 'fallback') || {
      text_en: "BEEP BOOP! Try asking about: Solar storms, Asteroids, or Spacewalk oxygen!",
      text_ar: "بيب بوب! جرب سؤالي عن: العواصف الشمسية، الكويكبات القريبة، أو أكسجين البدلات!"
    };

    return {
      intent: 'fallback',
      text: isAr ? fallback.text_ar : fallback.text_en,
      badge: { type: 'INFO', text: 'Astro Handbook Guide', text_ar: 'دليل آسترو الفضائي' }
    };
  }
}
