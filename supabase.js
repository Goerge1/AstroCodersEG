// =========================================================
// Astro World - Supabase Service & Data Layer
// Security, Composite Identity & Session Persistence
// =========================================================

const SUPABASE_CONFIG_KEY = 'ASTRO_WORLD_SUPABASE_CONFIG';
const LOCAL_USERS_KEY = 'ASTRO_WORLD_LOCAL_USERS';
const ACTIVE_SESSION_KEY = 'ASTRO_ACTIVE_SESSION_KEY';
const CURRENT_USER_KEY = 'ASTRO_CURRENT_USER';

let supabaseClient = null;

// Initialize Supabase from config.js or localStorage
function initSupabaseClient() {
  const config = getSupabaseConfig();
  if (config && config.url && config.key && window.supabase) {
    try {
      supabaseClient = window.supabase.createClient(config.url, config.key);
      console.log('🚀 Supabase client successfully initialized with:', config.url);
      return true;
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
    }
  }
  return false;
}

// Get Supabase credentials
function getSupabaseConfig() {
  if (window.ASTRO_CONFIG && window.ASTRO_CONFIG.SUPABASE_URL && window.ASTRO_CONFIG.SUPABASE_ANON_KEY) {
    const url = window.ASTRO_CONFIG.SUPABASE_URL.trim();
    const key = window.ASTRO_CONFIG.SUPABASE_ANON_KEY.trim();
    if (url.length > 10 && key.length > 15) {
      return { url, key, source: 'config.js' };
    }
  }

  try {
    const raw = localStorage.getItem(SUPABASE_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.url && parsed.key) {
        return { url: parsed.url, key: parsed.key, source: 'localStorage' };
      }
    }
  } catch (e) {
    // ignore
  }

  return null;
}

function saveSupabaseConfig(url, key) {
  const config = { url: url.trim(), key: key.trim(), timestamp: Date.now() };
  localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(config));
  initSupabaseClient();
  return true;
}

function isSupabaseConfigured() {
  const cfg = getSupabaseConfig();
  return !!(cfg && cfg.url && cfg.key && supabaseClient);
}

// Generate Composite Key for Identity Disambiguation (Email + Display Name)
function generateCompositeKey(email, fullName) {
  const cleanEmail = (email || '').toLowerCase().trim();
  const cleanName = (fullName || '').toLowerCase().trim().replace(/\s+/g, '_');
  return `${cleanEmail}_${cleanName}`;
}

// Register or authenticate an astronaut profile with composite key
async function registerAstroUser({ fullName, age, email, password, language }) {
  const cleanEmail = email.toLowerCase().trim();
  const cleanName = fullName.trim();
  const compositeKey = generateCompositeKey(cleanEmail, cleanName);

  const userProfile = {
    id: (crypto && crypto.randomUUID) ? crypto.randomUUID() : 'astro_' + Date.now().toString(36),
    composite_key: compositeKey,
    full_name: cleanName,
    age: parseInt(age, 10),
    email: cleanEmail,
    password_hash: btoa(password),
    preferred_language: language,
    role: 'cadet',
    astro_points: 100,
    created_at: new Date().toISOString()
  };

  let savedToSupabase = false;
  let supabaseError = null;

  // Supabase Persistence with Composite Disambiguation
  if (isSupabaseConfigured()) {
    try {
      // Check if this specific composite profile already exists in Supabase
      const { data: existingProfiles, error: fetchErr } = await supabaseClient
        .from('astro_users')
        .select('*')
        .eq('composite_key', compositeKey)
        .limit(1);

      if (!fetchErr && existingProfiles && existingProfiles.length > 0) {
        // Existing composite profile found -> maintain this distinct user's state
        console.log('✅ Found existing distinct composite profile:', existingProfiles[0]);
        saveActiveSession(existingProfiles[0]);
        return {
          success: true,
          user: existingProfiles[0],
          isReturning: true,
          savedToSupabase: true
        };
      }

      // Otherwise insert new distinct profile
      const { data, error } = await supabaseClient
        .from('astro_users')
        .insert([{
          id: userProfile.id,
          composite_key: userProfile.composite_key,
          full_name: userProfile.full_name,
          age: userProfile.age,
          email: userProfile.email,
          password_hash: userProfile.password_hash,
          preferred_language: userProfile.preferred_language,
          role: userProfile.role,
          astro_points: userProfile.astro_points
        }])
        .select();

      if (error) {
        console.warn('Supabase insert note:', error.message);
        supabaseError = error.message;
      } else {
        console.log('✅ User registered successfully in Supabase with composite key:', compositeKey);
        savedToSupabase = true;
      }
    } catch (err) {
      console.error('Supabase exception:', err);
      supabaseError = err.message;
    }
  }

  // Update Local Cache indexed by composite key
  try {
    const localProfiles = getLocalUsersMap();
    localProfiles[compositeKey] = userProfile;
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(localProfiles));
  } catch (e) {
    console.error('Local cache error:', e);
  }

  // Save active session for instant persistence across reloads
  saveActiveSession(userProfile);

  return {
    success: true,
    user: userProfile,
    savedToSupabase,
    supabaseError
  };
}

// Active Session Persistence (Preserve state across reloads)
function saveActiveSession(user) {
  if (!user) return;
  const compositeKey = user.composite_key || generateCompositeKey(user.email, user.full_name);
  localStorage.setItem(ACTIVE_SESSION_KEY, compositeKey);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

// Get current active session user (Checks persistent storage to prevent redirect on reload)
function getCurrentUser() {
  try {
    const activeKey = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (!activeKey) return null;

    // Check sessionStorage / localStorage cached user object
    const raw = sessionStorage.getItem(CURRENT_USER_KEY) || localStorage.getItem(CURRENT_USER_KEY);
    if (raw) {
      const user = JSON.parse(raw);
      if (user && (user.composite_key === activeKey || generateCompositeKey(user.email, user.full_name) === activeKey)) {
        return user;
      }
    }

    // Fallback to local profiles map
    const map = getLocalUsersMap();
    if (map[activeKey]) { 
      return map[activeKey];
    }
  } catch (e) {
    console.error('Error getting current user:', e);
  }
  return null;
}

// Sign out / clear session
function clearSession() {
  localStorage.removeItem(ACTIVE_SESSION_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
  sessionStorage.removeItem(CURRENT_USER_KEY);
}

// Local storage map of profiles keyed by composite key
function getLocalUsersMap() {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Migrate old array format to map
      const map = {};
      parsed.forEach(u => {
        if (u && u.email && u.full_name) {
          const key = u.composite_key || generateCompositeKey(u.email, u.full_name);
          map[key] = { ...u, composite_key: key };
        }
      });
      return map;
    }
    return parsed || {};
  } catch (e) {
    return {};
  }
}

// Test Supabase connection
async function testSupabaseConnection(url, key) {
  if (!window.supabase) return { success: false, message: 'Supabase library not loaded' };
  try {
    const testClient = window.supabase.createClient(url.trim(), key.trim());
    const { data, error } = await testClient.from('astro_users').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Connected successfully to Supabase!' };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// Export functions to global scope
window.AstroDB = {
  initSupabaseClient,
  getSupabaseConfig,
  saveSupabaseConfig,
  isSupabaseConfigured,
  generateCompositeKey,
  registerAstroUser,
  saveActiveSession,
  getCurrentUser,
  clearSession,
  testSupabaseConnection
};
