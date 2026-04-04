import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const DEMO_USER = {
  id: 'u1',
  email: 'prachi@tripsync.app',
  user_metadata: { full_name: 'Prachi Patil' },
  isDemoUser: true,
};

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
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
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
    if (isSupabaseConfigured) await supabase.auth.signOut();
    setUser(null);
  }

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
