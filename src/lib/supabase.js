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
        lock: false,
        storage: authStorage,
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
