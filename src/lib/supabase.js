import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co'
);

// sessionStorage clears when the PWA/tab is killed, so users are signed
// out on quit. Persists across refresh and backgrounding.
const authStorage = typeof window !== 'undefined' ? window.sessionStorage : undefined;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        // NOTE: do NOT pass `lock: false` here. The default Web Locks
        // implementation serialises concurrent getSession() calls, which
        // prevents a race between autoRefreshToken and an in-flight
        // functions.invoke() call. Without the lock, getSession() can
        // return null mid-refresh, causing fetchWithAuth to fall back to
        // the anon key as the Bearer — which Supabase's platform JWT
        // verification immediately 401s with "Invalid credentials".
        storage: authStorage,
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
