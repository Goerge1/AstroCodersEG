/**
 * Astro World - Shared UI Components & SVG Avatar
 * Features:
 * - Animated SVG Astro Avatar with 3 expressions (happy, worried, thinking)
 * - Colorblind-safe gauges (Icon + Text + Bar)
 * - Science word glossary tooltips
 * - Toast notifications & Web Speech read-aloud
 */

export const UI = {
  /**
   * Inline Vector SVG Astro Avatar Generator
   */
  renderAstroAvatar(mood = 'happy', size = 80) {
    let eyeColor = "#00F0FF";
    let mouthPath = "M 38 62 Q 50 72 62 62"; // smile
    let browLeft = "M 32 38 Q 40 38 48 40";
    let browRight = "M 52 40 Q 60 38 68 38";

    if (mood === 'worried') {
      mouthPath = "M 38 66 Q 50 56 62 66"; // frown
      eyeColor = "#FFB703";
      browLeft = "M 34 36 Q 42 42 48 44";
      browRight = "M 52 44 Q 58 42 66 36";
    } else if (mood === 'thinking') {
      mouthPath = "M 42 64 Q 50 64 58 64"; // straight
      eyeColor = "#00F0FF";
      browLeft = "M 34 38 Q 40 34 46 38";
      browRight = "M 54 42 Q 60 44 66 42";
    }

    return `
      <svg class="astro-svg astro-${mood}" width="${size}" height="${size}" viewBox="0 0 100 100" aria-label="Astro Robot Avatar">
        <defs>
          <linearGradient id="astroHelmetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#E2E8F0" />
            <stop offset="100%" stop-color="#94A3B8" />
          </linearGradient>
          <linearGradient id="astroVisorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#050A18" />
            <stop offset="100%" stop-color="#1E293B" />
          </linearGradient>
          <filter id="astroGlow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <!-- Antenna -->
        <line x1="50" y1="18" x2="50" y2="6" stroke="#00F0FF" stroke-width="3" stroke-linecap="round" />
        <circle cx="50" cy="5" r="4" fill="#00F0FF" filter="url(#astroGlow)" />
        
        <!-- Outer Helmet -->
        <circle cx="50" cy="52" r="38" fill="url(#astroHelmetGrad)" stroke="#CBD5E1" stroke-width="2" />
        
        <!-- Helmet Earpieces -->
        <rect x="8" y="44" width="8" height="16" rx="4" fill="#64748B" />
        <rect x="84" y="44" width="8" height="16" rx="4" fill="#64748B" />

        <!-- Visor Faceplate -->
        <rect x="22" y="28" width="56" height="46" rx="18" fill="url(#astroVisorGrad)" stroke="#38BDF8" stroke-width="2" />
        
        <!-- Eyebrows -->
        <path d="${browLeft}" stroke="#64748B" stroke-width="2.5" stroke-linecap="round" fill="none" />
        <path d="${browRight}" stroke="#64748B" stroke-width="2.5" stroke-linecap="round" fill="none" />

        <!-- Eyes -->
        <ellipse cx="38" cy="46" rx="5" ry="6" fill="${eyeColor}" filter="url(#astroGlow)" />
        <ellipse cx="62" cy="46" rx="5" ry="6" fill="${eyeColor}" filter="url(#astroGlow)" />
        <circle cx="39" cy="44" r="1.8" fill="#FFFFFF" />
        <circle cx="63" cy="44" r="1.8" fill="#FFFFFF" />

        <!-- Mouth -->
        <path d="${mouthPath}" stroke="${eyeColor}" stroke-width="3" stroke-linecap="round" fill="none" />
      </svg>
    `;
  },

  /**
   * Colorblind-safe Gauge Generator
   */
  renderGauge(id, icon, label, value, max = 100, unit = '%') {
    const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
    let statusClass = "gauge-high";
    if (pct < 30) statusClass = "gauge-critical";
    else if (pct < 60) statusClass = "gauge-warning";

    return `
      <div class="meter-box ${statusClass}" id="meter-${id}">
        <div class="meter-header">
          <span class="meter-icon">${icon}</span>
          <span class="meter-label">${label}</span>
          <span class="meter-val" id="val-${id}">${value}${unit}</span>
        </div>
        <div class="meter-bar-track">
          <div class="meter-bar-fill" id="fill-${id}" style="width: ${pct}%"></div>
        </div>
      </div>
    `;
  },

  /**
   * Science Word Tooltip Definitions
   */
  GLOSSARY: {
    'radiation dose': { icon: '☢️', en: "The total amount of energetic space radiation absorbed by a human body, measured in millisieverts (mSv).", ar: "كمية الإشعاع الفضائي التي يمتصها جسم الإنسان، وتُقاس بالمللي سيفرت." },
    'sol': { icon: '🪐', en: "One solar day on Mars, lasting 24 hours, 39 minutes, and 35 seconds.", ar: "اليوم الشمسي الواحد على المريخ، ومدته 24 ساعة و39 دقيقة و35 ثانية." },
    'microgravity': { icon: '🪶', en: "The condition of apparent weightlessness where objects and people float in continuous freefall.", ar: "حالة انعدام الوزن الظاهري حيث تسبح الأجسام في سقوط حر مستمر." },
    'cme': { icon: '💥', en: "Coronal Mass Ejection: A giant solar eruption that flings billions of tons of magnetized plasma across space.", ar: "انبعاث كتلي إكليلي: انفجار شمسي عملاق يقذف مليارات الأطنان من البلازما المشحونة." },
    'sep': { icon: '⚡', en: "Solar Energetic Particles: Dangerous protons shot out by solar flares at nearly the speed of light.", ar: "جسيمات شمسية نشطة: بروتونات عالية الطاقة تطلقها التوهجات بسرعة تقارب سرعة الضوء." },
    'electrolysis': { icon: '⚗️', en: "Using an electrical current to split liquid water (H2O) into hydrogen and breathable oxygen.", ar: "استخدام الكهرباء لفصل الماء إلى هيدروجين وأكسجين نقي صالح للتنفس." },
    'regolith': { icon: '🪨', en: "The loose, powdery layer of broken rock covering the bedrock of the Moon and Mars.", ar: "الثرى: طبقة الغبار والحصى المفتت التي تكسو صخور سطح القمر والمريخ." },
    'eva': { icon: '👨‍🚀', en: "Extravehicular Activity: A spacewalk conducted outside the spacecraft in a pressurized suit.", ar: "نشاط خارج المركبة: مهمة سير فضائي يقوم بها الرائد خارج المحطة ببدلة الضغط." }
  },

  /**
   * Enhance text with science word tooltips
   */
  annotateScienceWords(text, lang = 'ar') {
    if (!text) return '';
    let out = text;
    for (const [term, data] of Object.entries(this.GLOSSARY)) {
      const regex = new RegExp(`\\b(${term})\\b`, 'gi');
      const tip = lang === 'ar' ? data.ar : data.en;
      out = out.replace(regex, `<span class="science-word" tabindex="0" data-tooltip="${tip}">${data.icon} $1</span>`);
    }
    return out;
  },

  /**
   * Toast notification
   */
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  },

  /**
   * Web Speech API Synthesis
   */
  speak(text, lang = 'ar', isMuted = false) {
    if (isMuted || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/<[^>]*>?/gm, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech error:", e);
    }
  }
};
