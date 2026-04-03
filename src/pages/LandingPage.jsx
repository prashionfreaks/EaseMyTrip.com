import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Compass, MapPin, Users, Wallet, MessageCircle,
  Camera, Vote, CalendarRange, ArrowRight, Star, Globe,
} from 'lucide-react';

const FEATURES = [
  { icon: MessageCircle, title: 'Group Chat', desc: 'Plan in real-time with your crew. Every message, every decision — all in one place.' },
  { icon: Vote, title: 'Group Polls', desc: 'Can\'t agree on where to eat? Vote on destinations, hotels, and activities together.' },
  { icon: Wallet, title: 'Expense Splitting', desc: 'Track who paid what and settle up instantly. No more awkward money conversations.' },
  { icon: CalendarRange, title: 'Shared Calendar', desc: 'See everyone\'s availability and plan around holidays and events automatically.' },
  { icon: Camera, title: 'Photo Sharing', desc: 'Upload and relive trip memories together. Every photo, organised by trip.' },
  { icon: MapPin, title: 'Route Planning', desc: 'Plan every leg of the journey — flights, trains, road trips — all in one itinerary.' },
];

const DESTINATIONS = ['Japan', 'Bali', 'Bhutan', 'Switzerland', 'Costa Rica', 'Australia', 'Egypt', 'Finland'];

export default function LandingPage() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGoogle() {
    setError('');
    setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) { setError(error.message); setLoading(false); }
  }

  return (
    <div style={{ fontFamily: 'var(--font)', background: '#ffffff', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .hero-anim { animation: fadeUp 0.7s ease forwards; }
        .hero-anim-2 { animation: fadeUp 0.7s 0.15s ease both; }
        .hero-anim-3 { animation: fadeUp 0.7s 0.3s ease both; }
        .feature-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(37,99,235,0.12); }
        .dest-pill:hover { background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; transform: scale(1.05); }
        .google-btn:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.15); transform: translateY(-2px); }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #f1f5f9',
        padding: '0 5%', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
          }}>
            <Compass size={20} color="white" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>LetsWander</span>
        </div>
        <button
          onClick={handleGoogle}
          disabled={loading}
          style={{
            padding: '9px 20px', borderRadius: 10,
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            color: 'white', border: 'none', fontWeight: 600, fontSize: 14,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Redirecting…' : 'Get Started Free'}
        </button>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #4c1d95 100%)',
        padding: '90px 5% 100px',
        position: 'relative', overflow: 'hidden', textAlign: 'center',
      }}>
        {/* Background blobs */}
        {[
          { w: 400, h: 400, top: '-10%', left: '-5%', op: 0.05 },
          { w: 300, h: 300, top: '50%', left: '80%', op: 0.06 },
          { w: 500, h: 500, top: '30%', left: '-15%', op: 0.03 },
        ].map((c, i) => (
          <div key={i} style={{
            position: 'absolute', borderRadius: '50%', background: 'white',
            width: c.w, height: c.h, top: c.top, left: c.left,
            opacity: c.op, pointerEvents: 'none',
          }} />
        ))}

        {/* Floating destination pills */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {DESTINATIONS.map((d, i) => (
            <div key={d} style={{
              position: 'absolute',
              top: `${15 + (i * 10) % 70}%`,
              left: i % 2 === 0 ? `${2 + (i * 7) % 12}%` : `${80 + (i * 4) % 15}%`,
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 999, padding: '5px 14px',
              fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500,
              animation: `float ${3 + i * 0.4}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}>
              {d}
            </div>
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto' }}>
          <div className="hero-anim" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 999, padding: '6px 16px', marginBottom: 28,
            fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 500,
          }}>
            <Star size={13} style={{ color: '#fbbf24' }} fill="#fbbf24" />
            Trip planning made effortless
          </div>

          <h1 className="hero-anim-2" style={{
            fontSize: 'clamp(36px, 6vw, 68px)',
            fontWeight: 900, color: 'white', letterSpacing: '-1.5px',
            lineHeight: 1.1, marginBottom: 24,
          }}>
            Plan trips together,<br />
            <span style={{
              background: 'linear-gradient(90deg, #60a5fa, #c084fc)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              stress-free
            </span>
          </h1>

          <p className="hero-anim-3" style={{
            fontSize: 18, color: 'rgba(255,255,255,0.75)',
            lineHeight: 1.7, marginBottom: 40, maxWidth: 520, margin: '0 auto 40px',
          }}>
            LetsWander brings your whole crew onto one page — chat, polls, expenses, itineraries, and photos. From idea to takeoff.
          </p>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 10, padding: '10px 16px', marginBottom: 16,
              color: '#fca5a5', fontSize: 13,
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="google-btn"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 12,
                padding: '14px 28px', borderRadius: 14,
                background: 'white', border: 'none',
                fontSize: 16, fontWeight: 700, color: '#0f172a',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                transition: 'all 0.2s',
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? (
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #e2e8f0', borderTopColor: '#2563eb', animation: 'spin 0.7s linear infinite' }} />
              ) : (
                <svg width="22" height="22" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
              )}
              {loading ? 'Redirecting to Google…' : 'Sign up free with Google'}
            </button>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
              No credit card required · Free forever for small groups
            </p>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '80px 5%', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 12 }}>
              Everything your group needs
            </h2>
            <p style={{ fontSize: 16, color: '#64748b', maxWidth: 480, margin: '0 auto' }}>
              One app for the entire trip — from the first "where should we go?" to the last photo upload.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 20,
          }}>
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="feature-card" style={{
                background: 'white', borderRadius: 18,
                padding: '28px 28px',
                border: '1px solid #e2e8f0',
                transition: 'all 0.2s ease',
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: 'linear-gradient(135deg, #dbeafe, #ede9fe)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16,
                }}>
                  <Icon size={22} style={{ color: '#2563eb' }} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Destinations ── */}
      <section style={{ padding: '70px 5%', background: 'white' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <Globe size={32} style={{ color: '#2563eb', marginBottom: 16 }} />
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 12 }}>
            Explore anywhere
          </h2>
          <p style={{ fontSize: 15, color: '#64748b', marginBottom: 36 }}>
            Rich destination guides built right in — history, attractions, cuisine, and best time to visit.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {['Japan', 'Bali', 'Paris', 'Dubai', 'Switzerland', 'Australia', 'Egypt', 'Bhutan',
              'Sri Lanka', 'Finland', 'Costa Rica', 'Azerbaijan', 'Goa', 'Kerala', 'Ladakh', 'Kashmir', '& more…'].map(d => (
              <span key={d} className="dest-pill" style={{
                padding: '8px 18px', borderRadius: 999,
                background: '#f1f5f9', color: '#475569',
                fontSize: 14, fontWeight: 500,
                border: '1px solid #e2e8f0',
                transition: 'all 0.15s', cursor: 'default',
              }}>
                {d}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{
        background: 'linear-gradient(135deg, #1e3a8a, #4c1d95)',
        padding: '72px 5%', textAlign: 'center',
      }}>
        <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 800, color: 'white', letterSpacing: '-0.5px', marginBottom: 14 }}>
          Ready to wander?
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 36, maxWidth: 400, margin: '0 auto 36px' }}>
          Create your first trip in under a minute and invite your crew.
        </p>
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="google-btn"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '14px 32px', borderRadius: 14,
            background: 'white', border: 'none',
            fontSize: 16, fontWeight: 700, color: '#0f172a',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            transition: 'all 0.2s',
          }}
        >
          {loading ? 'Redirecting…' : <>Get started free <ArrowRight size={18} /></>}
        </button>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        background: '#0f172a', padding: '28px 5%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Compass size={15} color="white" />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>LetsWander</span>
        </div>
        <p style={{ fontSize: 12, color: '#475569' }}>© 2026 LetsWander. Plan together, wander freely.</p>
      </footer>
    </div>
  );
}
