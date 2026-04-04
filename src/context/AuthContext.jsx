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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setUser(DEMO_USER);
      setLoading(false);
      return;
    }

    const sessionTimeout = setTimeout(() => setLoading(false), 5000);
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

    return () => subscription.unsubscribe();
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
        await supabase.auth.signOut({ scope: 'local' });
      }
    } catch (err) {
      // Ignore lock errors — user is already signed out locally
      console.warn('[auth] signOut cleanup:', err.message);
    }
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

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
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
