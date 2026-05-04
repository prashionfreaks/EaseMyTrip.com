import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const DEMO_USER = {
  id: 'u1',
  email: 'prachi@tripsync.app',
  user_metadata: { full_name: 'Prachi Patil' },
  isDemoUser: true,
};

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initial values are derived directly from the module-level
  // `isSupabaseConfigured` constant so demo mode is ready on first paint —
  // no setState-in-effect, no flicker.
  const [user, setUser] = useState(isSupabaseConfigured ? null : DEMO_USER);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // 10 s safety net — long enough to ride out a slow getSession on poor
    // networks, short enough that a truly hung Supabase doesn't lock the UI
    // forever. Without this, a stale fetch could leave the loader on screen
    // indefinitely; with too short a value, we'd flash the LandingPage before
    // onAuthStateChange resolves the real session.
    const sessionTimeout = setTimeout(() => setLoading(false), 10000);
    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(sessionTimeout);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch(() => {
      clearTimeout(sessionTimeout);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'PASSWORD_RECOVERY') setIsRecovery(true);
      if (event === 'USER_UPDATED') setIsRecovery(false);
    });

    // BFCache (browser back-forward cache) preserves React state along
    // with the page. If the user was on LandingPage pre-auth, signed in,
    // navigated, then pressed back far enough to land on the pre-auth
    // history entry, BFCache would restore user=null and re-render the
    // LandingPage even though the session is still valid in sessionStorage.
    // On every pageshow with persisted=true, re-read the session so the
    // authenticated tree wins.
    function handlePageShow(e) {
      if (!e.persisted) return;
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      }).catch(() => { /* keep current state */ });
    }
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  async function signIn(email, password) {
    if (!isSupabaseConfigured) return { error: { message: 'Supabase not configured. App is running in demo mode.' } };
    return supabase.auth.signInWithPassword({ email, password });
  }

  async function signUp(email, password, fullName) {
    if (!isSupabaseConfigured) return { error: { message: 'Supabase not configured. App is running in demo mode.' } };
    return supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
  }

  async function signInWithGoogle() {
    if (!isSupabaseConfigured) return { error: { message: 'Supabase not configured.' } };
    try {
      return await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
    } catch {
      return { error: { message: 'Failed to connect to auth service. Please try again.' } };
    }
  }

  async function resetPassword(email) {
    if (!isSupabaseConfigured) return { error: { message: 'Supabase not configured.' } };
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
  }

  async function updatePassword(newPassword) {
    if (!isSupabaseConfigured) return { error: { message: 'Supabase not configured.' } };
    return supabase.auth.updateUser({ password: newPassword });
  }

  async function signOut() {
    setUser(null);
    try {
      if (isSupabaseConfigured) {
        // Default (global) scope revokes the refresh token server-side so the
        // session can't be resurrected from a lingering local copy.
        await supabase.auth.signOut();
      }
    } catch (err) {
      // Ignore lock / network errors — the manual scrub below still runs
      console.warn('[auth] signOut cleanup:', err.message);
    }
    // Belt-and-suspenders: the SDK sometimes leaves `sb-*` keys behind in
    // PWA + sessionStorage setups, causing the next refresh to rehydrate the
    // "signed-out" user. Nuke anything Supabase-ish from both storages.
    try {
      const scrub = (storage) => {
        if (!storage) return;
        const keys = [];
        for (let i = 0; i < storage.length; i++) {
          const k = storage.key(i);
          if (k && (k.startsWith('sb-') || k.includes('supabase'))) keys.push(k);
        }
        keys.forEach(k => storage.removeItem(k));
      };
      scrub(window.sessionStorage);
      scrub(window.localStorage);
    } catch { /* ignore */ }
  }

  // ── Inactivity auto-logout ──
  const timerRef = useRef(null);

  const resetInactivityTimer = useCallback(() => {
    if (!isSupabaseConfigured) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (user) {
        console.warn('Signed out due to 10 minutes of inactivity');
        signOut();
      }
    }, INACTIVITY_TIMEOUT);
  }, [user]);

  useEffect(() => {
    if (!isSupabaseConfigured || !user) return;

    // `input` covers virtual-keyboard typing on mobile (where keydown is
    // unreliable); `pointerdown` unifies mouse/touch/pen tap detection.
    const events = ['mousedown', 'keydown', 'input', 'scroll', 'touchstart', 'mousemove', 'pointerdown'];
    const handler = () => resetInactivityTimer();

    events.forEach(e => window.addEventListener(e, handler, { passive: true }));
    resetInactivityTimer(); // start the timer

    return () => {
      events.forEach(e => window.removeEventListener(e, handler));
      clearTimeout(timerRef.current);
    };
  }, [user, resetInactivityTimer]);

  const displayName = user?.user_metadata?.full_name
    || user?.email?.split('@')[0]?.replace(/[^a-zA-Z ]/g, ' ').trim()
    || 'User';

  const initials = displayName
    .split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isDemo: !isSupabaseConfigured,
      isRecovery,
      displayName,
      initials,
      signIn,
      signUp,
      signInWithGoogle,
      resetPassword,
      updatePassword,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
