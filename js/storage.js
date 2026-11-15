/**
 * Astro World - Safe LocalStorage Management & Progression System
 */

export const Storage = {
  KEY: 'astroworld_v2_data',

  defaultData: {
    lang: 'ar',
    muted: false,
    sciencePoints: 0,
    rank: 'rankRecruit',
    userApiKey: '',
    badges: {
      storm_survivor: { unlocked: false, name_en: "Storm Survivor", name_ar: "ناجي العواصف", desc_en: "Survived a major solar storm event", desc_ar: "صمد أمام عاصفة شمسية عاتية" },
      power_planner: { unlocked: false, name_en: "Power Planner", name_ar: "خبير الطاقة", desc_en: "Kept battery above 50% for 5 turns", desc_ar: "حافظ على البطارية فوق 50% لـ 5 أدوار" },
      night_owl: { unlocked: false, name_en: "Night Owl", name_ar: "حارس ليل القمر", desc_en: "Successfully survived the cold lunar night", desc_ar: "تجاوز الليل القمري القارس بسلام" },
      shield_architect: { unlocked: false, name_en: "Shield Master", name_ar: "سيد الدروع", desc_en: "Completed Game 2 with minimal radiation dose", desc_ar: "أنهى لعبة الدروع بأقل جرعة إشعاعية" },
      cool_head: { unlocked: false, name_en: "Cool Head", name_ar: "هادئ الأعصاب", desc_en: "Solved suit anomaly in under 30 seconds", desc_ar: "أصلح عطل البدلة في أقل من 30 ثانية" }
    },
    scores: {
      game1_moon: 0,
      game1_mars: 0,
      game2: 0,
      game3: 0
    }
  },

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return { ...this.defaultData };
      const parsed = JSON.parse(raw);
      return {
        ...this.defaultData,
        ...parsed,
        badges: { ...this.defaultData.badges, ...(parsed.badges || {}) },
        scores: { ...this.defaultData.scores, ...(parsed.scores || {}) }
      };
    } catch (e) {
      console.warn("Storage.load fallback:", e);
      return { ...this.defaultData };
    }
  },

  save(data) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("Storage.save error:", e);
    }
  },

  addSciencePoints(pts) {
    const data = this.load();
    data.sciencePoints = Math.max(0, (data.sciencePoints || 0) + pts);
    data.rank = this.calculateRank(data.sciencePoints);
    this.save(data);
    return data;
  },

  calculateRank(points) {
    // Thresholds: Recruit -> Explorer -> Navigator -> Flight Director -> Mission Legend
    if (points >= 1200) return 'rankLegend';
    if (points >= 700)  return 'rankDirector';
    if (points >= 350)  return 'rankNavigator';
    if (points >= 120)  return 'rankExplorer';
    return 'rankRecruit';
  },

  unlockBadge(badgeId) {
    const data = this.load();
    if (data.badges && data.badges[badgeId] && !data.badges[badgeId].unlocked) {
      data.badges[badgeId].unlocked = true;
      this.save(data);
      return true;
    }
    return false;
  },

  getUserApiKey() {
    const data = this.load();
    return data.userApiKey || '';
  },

  setUserApiKey(key) {
    const data = this.load();
    data.userApiKey = (key || '').trim();
    this.save(data);
  }
};
