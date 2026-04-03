import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Compass, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AuthPage() {
  const { signIn, signUp, isDemo } = useAuth();
  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'error' | 'success', text }

  function update(field, value) {
    setForm(p => ({ ...p, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      if (mode === 'signup') {
        if (!form.name.trim()) {
          setMessage({ type: 'error', text: 'Please enter your full name.' });
          return;
        }
        const { error } = await signUp(form.email, form.password, form.name);
        if (error) setMessage({ type: 'error', text: error.message });
        else setMessage({ type: 'success', text: 'Account created! Check your email to confirm, then sign in.' });
      } else {
        const { error } = await signIn(form.email, form.password);
        if (error) setMessage({ type: 'error', text: error.message });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #4c1d95 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      fontFamily: 'var(--font)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative circles */}
      {[
        { w: 300, h: 300, top: '-5%', left: '-5%', op: 0.06 },
        { w: 200, h: 200, top: '60%', left: '75%', op: 0.07 },
        { w: 400, h: 400, top: '40%', left: '-10%', op: 0.04 },
        { w: 150, h: 150, top: '10%', left: '70%', op: 0.08 },
      ].map((c, i) => (
        <div key={i} style={{
          position: 'absolute',
          borderRadius: '50%',
          background: 'white',
          width: c.w, height: c.h,
          top: c.top, left: c.left,
          opacity: c.op,
          pointerEvents: 'none',
        }} />
      ))}

      <div style={{
        background: 'white',
        borderRadius: 24,
        padding: '40px 36px',
        width: '100%',
        maxWidth: 420,
        boxShadow: '0 32px 64px rgba(0,0,0,0.35)',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 60, height: 60,
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            borderRadius: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
            boxShadow: '0 8px 20px rgba(37,99,235,0.35)',
          }}>
            <Compass size={30} color="white" />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>TripSync</h1>
          <p style={{ fontSize: 14, color: '#64748b', marginTop: 6 }}>
            {mode === 'signin' ? 'Sign in to your account' : 'Create your free account'}
          </p>
        </div>

        {isDemo && (
          <div style={{
            background: '#fef9c3',
            border: '1px solid #fbbf24',
            borderRadius: 10,
            padding: '10px 14px',
            marginBottom: 20,
            fontSize: 12,
            color: '#92400e',
            lineHeight: 1.5,
          }}>
            <strong>Demo Mode</strong> — Supabase is not configured. The app works locally without an account.{' '}
            <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: '#1d4ed8', textDecoration: 'underline' }}>
              Set up Supabase
            </a>{' '}
            to enable real auth &amp; collaboration.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <FieldWrapper label="Full Name">
              <div style={{ position: 'relative' }}>
                <User size={15} style={iconStyle} />
                <input
                  className="form-input"
                  type="text"
                  placeholder="Prachi Patil"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  required={mode === 'signup'}
                  style={inputStyle}
                />
              </div>
            </FieldWrapper>
          )}

          <FieldWrapper label="Email Address">
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={iconStyle} />
              <input
                className="form-input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                required
                style={inputStyle}
              />
            </div>
          </FieldWrapper>

          <FieldWrapper label="Password">
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={iconStyle} />
              <input
                className="form-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => update('password', e.target.value)}
                required
                minLength={6}
                style={{ ...inputStyle, paddingRight: 40 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </FieldWrapper>

          {message && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 8,
              padding: '10px 14px',
              borderRadius: 10,
              marginBottom: 16,
              background: message.type === 'error' ? '#fef2f2' : '#f0fdf4',
              color: message.type === 'error' ? '#dc2626' : '#16a34a',
              fontSize: 13,
            }}>
              {message.type === 'error'
                ? <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                : <CheckCircle2 size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              }
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#93c5fd' : 'linear-gradient(135deg, #2563eb, #7c3aed)',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: 16,
              letterSpacing: 0.2,
            }}
          >
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 14, color: '#64748b' }}>
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setMessage(null); }}
            style={{ color: '#2563eb', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {mode === 'signin' ? 'Sign up free' : 'Sign in'}
          </button>
        </p>
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
