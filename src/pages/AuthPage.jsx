import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Compass, AlertCircle } from 'lucide-react';

export default function AuthPage() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGoogle() {
    setError('');
    setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) { setError(error.message); setLoading(false); }
    // On success the browser redirects — no need to reset loading
  }

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
        background: 'white', borderRadius: 24, padding: '44px 40px',
        width: '100%', maxWidth: 400,
        boxShadow: '0 32px 64px rgba(0,0,0,0.35)',
        position: 'relative', zIndex: 1,
        textAlign: 'center',
      }}>
        {/* Logo */}
        <div style={{
          width: 64, height: 64,
          background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
          borderRadius: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 8px 24px rgba(37,99,235,0.35)',
        }}>
          <Compass size={32} color="white" />
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 6 }}>
          LetsWander
        </h1>
        <p style={{ fontSize: 14, color: '#64748b', marginBottom: 36, lineHeight: 1.5 }}>
          Plan trips together with your crew.<br />Sign in to get started.
        </p>

        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px', borderRadius: 10, marginBottom: 16,
            background: '#fef2f2', color: '#dc2626', fontSize: 13, textAlign: 'left',
          }}>
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            {error}
          </div>
        )}

        <button
          onClick={handleGoogle}
          disabled={loading}
          style={{
            width: '100%', padding: '13px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            border: '1.5px solid #e2e8f0', borderRadius: 12,
            background: loading ? '#f8fafc' : 'white',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: 15, fontWeight: 600, color: '#0f172a',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            transition: 'all 0.15s',
          }}
          onMouseOver={e => { if (!loading) { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'; }}}
          onMouseOut={e => { e.currentTarget.style.background = loading ? '#f8fafc' : 'white'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'; }}
        >
          {loading ? (
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              border: '2px solid #e2e8f0', borderTopColor: '#2563eb',
              animation: 'spin 0.7s linear infinite', flexShrink: 0,
            }} />
          ) : (
            <svg width="20" height="20" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
          )}
          {loading ? 'Redirecting to Google…' : 'Continue with Google'}
        </button>

        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 24, lineHeight: 1.6 }}>
          By continuing, you agree to our terms of service.<br />
          New users are automatically registered.
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
