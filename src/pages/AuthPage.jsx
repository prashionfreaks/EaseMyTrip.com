import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Compass, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function AuthPage() {
  const { signIn, signUp, signInWithGoogle, resetPassword, updatePassword, isDemo, isRecovery } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'forgot'
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', name: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'error' | 'success', text }

  function update(field, value) {
    setForm(p => ({ ...p, [field]: value }));
    setMessage(null);
  }

  function switchMode(m) {
    setMode(m);
    setMessage(null);
    setForm({ email: '', password: '', confirmPassword: '', name: '' });
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) { setMessage({ type: 'error', text: error.message }); setGoogleLoading(false); }
    // On success, browser redirects — no need to setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);

    // Set new password (recovery mode)
    if (isRecovery) {
      if (form.password !== form.confirmPassword) {
        setMessage({ type: 'error', text: 'Passwords do not match.' });
        return;
      }
      setLoading(true);
      try {
        const { error } = await updatePassword(form.password);
        if (error) setMessage({ type: 'error', text: error.message });
        else setMessage({ type: 'success', text: 'Password updated! You are now signed in.' });
      } finally { setLoading(false); }
      return;
    }

    // Forgot password
    if (mode === 'forgot') {
      setLoading(true);
      try {
        const { error } = await resetPassword(form.email);
        if (error) setMessage({ type: 'error', text: error.message });
        else setMessage({ type: 'success', text: 'Reset link sent! Check your inbox.' });
      } finally { setLoading(false); }
      return;
    }

    // Sign up
    if (mode === 'signup') {
      if (!form.name.trim()) { setMessage({ type: 'error', text: 'Please enter your full name.' }); return; }
      if (form.password.length < 6) { setMessage({ type: 'error', text: 'Password must be at least 6 characters.' }); return; }
      setLoading(true);
      try {
        const { error } = await signUp(form.email, form.password, form.name);
        if (error) setMessage({ type: 'error', text: error.message });
        else setMessage({ type: 'success', text: 'Account created! Check your email to confirm, then sign in.' });
      } finally { setLoading(false); }
      return;
    }

    // Sign in
    setLoading(true);
    try {
      const { error } = await signIn(form.email, form.password);
      if (error) setMessage({ type: 'error', text: error.message });
    } finally { setLoading(false); }
  }

  const title = isRecovery ? 'Set New Password'
    : mode === 'forgot' ? 'Reset Password'
    : mode === 'signup' ? 'Create Account'
    : 'Welcome Back';

  const subtitle = isRecovery ? 'Enter your new password below'
    : mode === 'forgot' ? "We'll email you a reset link"
    : mode === 'signup' ? 'Start planning trips together'
    : 'Sign in to continue';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #4c1d95 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, fontFamily: 'var(--font)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative blobs */}
      {[
        { w: 320, h: 320, top: '-8%', left: '-6%', op: 0.06 },
        { w: 200, h: 200, top: '62%', left: '76%', op: 0.07 },
        { w: 420, h: 420, top: '38%', left: '-12%', op: 0.04 },
        { w: 160, h: 160, top: '8%', left: '72%', op: 0.08 },
      ].map((c, i) => (
        <div key={i} style={{
          position: 'absolute', borderRadius: '50%', background: 'white',
          width: c.w, height: c.h, top: c.top, left: c.left,
          opacity: c.op, pointerEvents: 'none',
        }} />
      ))}

      <div style={{
        background: 'white', borderRadius: 24, padding: '40px 36px',
        width: '100%', maxWidth: 420,
        boxShadow: '0 32px 64px rgba(0,0,0,0.35)',
        position: 'relative', zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 58, height: 58,
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            borderRadius: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
            boxShadow: '0 8px 20px rgba(37,99,235,0.35)',
          }}>
            <Compass size={28} color="white" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            {title}
          </h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 5 }}>{subtitle}</p>
        </div>

        {/* Demo mode notice */}
        {isDemo && (
          <div style={{
            background: '#fef9c3', border: '1px solid #fbbf24',
            borderRadius: 10, padding: '10px 14px', marginBottom: 20,
            fontSize: 12, color: '#92400e', lineHeight: 1.5,
          }}>
            <strong>Demo Mode</strong> — Supabase is not configured. The app works locally without an account.
          </div>
        )}

        {/* Google button — only on signin/signup */}
        {!isRecovery && mode !== 'forgot' && (
          <>
            <button
              type="button"
              onClick={handleGoogle}
              disabled={googleLoading || isDemo}
              style={{
                width: '100%', padding: '11px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                border: '1.5px solid #e2e8f0', borderRadius: 10,
                background: googleLoading ? '#f8fafc' : 'white',
                cursor: googleLoading || isDemo ? 'not-allowed' : 'pointer',
                fontSize: 14, fontWeight: 600, color: '#374151',
                marginBottom: 16,
                boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
                transition: 'all 0.15s',
                opacity: isDemo ? 0.5 : 1,
              }}
              onMouseOver={e => { if (!googleLoading && !isDemo) e.currentTarget.style.background = '#f8fafc'; }}
              onMouseOut={e => { e.currentTarget.style.background = googleLoading ? '#f8fafc' : 'white'; }}
            >
              {/* Google G logo */}
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              {googleLoading ? 'Redirecting…' : `Continue with Google`}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>or</span>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            </div>
          </>
        )}

        {/* Back link for forgot mode */}
        {mode === 'forgot' && !isRecovery && (
          <button
            onClick={() => switchMode('signin')}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#64748b', fontSize: 13, marginBottom: 20, padding: 0,
            }}
          >
            <ArrowLeft size={14} /> Back to sign in
          </button>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name — signup only */}
          {mode === 'signup' && !isRecovery && (
            <FieldWrapper label="Full Name">
              <div style={{ position: 'relative' }}>
                <User size={15} style={iconStyle} />
                <input className="form-input" type="text" placeholder="Your name"
                  value={form.name} onChange={e => update('name', e.target.value)}
                  required style={inputStyle} />
              </div>
            </FieldWrapper>
          )}

          {/* Email — not shown in recovery */}
          {!isRecovery && (
            <FieldWrapper label="Email Address">
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={iconStyle} />
                <input className="form-input" type="email" placeholder="you@example.com"
                  value={form.email} onChange={e => update('email', e.target.value)}
                  required style={inputStyle} />
              </div>
            </FieldWrapper>
          )}

          {/* Password — not shown in forgot mode */}
          {mode !== 'forgot' && (
            <FieldWrapper label={isRecovery ? 'New Password' : 'Password'}>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={iconStyle} />
                <input className="form-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password} onChange={e => update('password', e.target.value)}
                  required minLength={6}
                  style={{ ...inputStyle, paddingRight: 40 }} />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {/* Forgot password link */}
              {mode === 'signin' && (
                <button type="button" onClick={() => switchMode('forgot')}
                  style={{ display: 'block', marginTop: 6, fontSize: 12, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  Forgot password?
                </button>
              )}
            </FieldWrapper>
          )}

          {/* Confirm password — recovery only */}
          {isRecovery && (
            <FieldWrapper label="Confirm New Password">
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={iconStyle} />
                <input className="form-input"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)}
                  required minLength={6}
                  style={{ ...inputStyle, paddingRight: 40 }} />
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}>
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </FieldWrapper>
          )}

          {/* Message */}
          {message && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 8,
              padding: '10px 14px', borderRadius: 10, marginBottom: 16,
              background: message.type === 'error' ? '#fef2f2' : '#f0fdf4',
              color: message.type === 'error' ? '#dc2626' : '#16a34a',
              fontSize: 13,
            }}>
              {message.type === 'error'
                ? <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                : <CheckCircle2 size={15} style={{ flexShrink: 0, marginTop: 1 }} />}
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '12px',
              background: loading ? '#93c5fd' : 'linear-gradient(135deg, #2563eb, #7c3aed)',
              color: 'white', border: 'none', borderRadius: 10,
              fontSize: 15, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: 16, letterSpacing: 0.2,
              transition: 'opacity 0.15s',
            }}
          >
            {loading ? 'Please wait…'
              : isRecovery ? 'Update Password'
              : mode === 'forgot' ? 'Send Reset Link'
              : mode === 'signup' ? 'Create Account'
              : 'Sign In'}
          </button>
        </form>

        {/* Toggle sign in / sign up */}
        {!isRecovery && mode !== 'forgot' && (
          <p style={{ textAlign: 'center', fontSize: 14, color: '#64748b' }}>
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
              style={{ color: '#2563eb', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {mode === 'signin' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

function FieldWrapper({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const iconStyle = {
  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
  color: '#94a3b8', pointerEvents: 'none',
};

const inputStyle = { paddingLeft: 36 };
