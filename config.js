// ========================================================
// Astro World (NASA) — Configuration Layer
// Credentials are loaded from the server-side /api/config
// endpoint and NEVER hardcoded in client-side JS files.
// ========================================================

(function () {
  // Try to load from server-injected meta tags (safest approach for static sites)
  function getMetaContent(name) {
    const el = document.querySelector('meta[name="' + name + '"]');
    return el ? el.getAttribute('content') : null;
  }

  const supabaseUrl = getMetaContent('astro-supabase-url');
  const supabaseKey = getMetaContent('astro-supabase-key');

  if (supabaseUrl && supabaseKey) {
    window.ASTRO_CONFIG = { SUPABASE_URL: supabaseUrl, SUPABASE_ANON_KEY: supabaseKey };
  } else {
    // Fallback: read from server-side rendered window.__ENV__ injected by server.ps1
    // This block is populated at serve-time, NOT hardcoded here.
    const env = (typeof window.__ENV__ !== 'undefined') ? window.__ENV__ : {};
    window.ASTRO_CONFIG = {
      SUPABASE_URL:      env.SUPABASE_URL      || '',
      SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY || ''
    };
  }
})();
