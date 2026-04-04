import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Compass, MapPin, Users, Wallet, MessageCircle,
  Camera, Vote, CalendarRange, ArrowRight, Star, Globe,
  ChevronLeft, ChevronRight,
} from 'lucide-react';

const FEATURES = [
  { icon: MessageCircle, title: 'Group Chat', desc: 'Plan in real-time with your crew. Every message, every decision — all in one place.' },
  { icon: Vote, title: 'Group Polls', desc: "Can't agree on where to eat? Vote on destinations, hotels, and activities together." },
  { icon: Wallet, title: 'Expense Splitting', desc: 'Track who paid what and settle up instantly. No more awkward money conversations.' },
  { icon: CalendarRange, title: 'Shared Calendar', desc: "See everyone's availability and plan around holidays and events automatically." },
  { icon: Camera, title: 'Photo Sharing', desc: 'Upload and relive trip memories together. Every photo, organised by trip.' },
  { icon: MapPin, title: 'Route Planning', desc: 'Plan every leg of the journey — flights, trains, road trips — all in one itinerary.' },
];

const DESTINATIONS_PILLS = ['Japan', 'Bali', 'Bhutan', 'Switzerland', 'Costa Rica', 'Australia', 'Egypt', 'Finland'];

// Rolling columns — left scrolls up, right scrolls down
const ROLL_LEFT = [
  'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=400&h=520&fit=crop', // Santorini
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=520&fit=crop', // Kyoto
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=520&fit=crop', // Swiss Alps
  'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&h=520&fit=crop', // Taj Mahal
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=520&fit=crop', // Maldives
  'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=400&h=520&fit=crop', // London
];
const ROLL_RIGHT = [
  'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=520&fit=crop', // Northern Lights
  'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400&h=520&fit=crop', // Bali
  'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400&h=520&fit=crop', // Amalfi Coast
  'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400&h=520&fit=crop', // Machu Picchu
  'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=400&h=520&fit=crop', // Dubai
  'https://images.unsplash.com/photo-1470093851219-69951fcbb533?w=400&h=520&fit=crop', // Hot air balloons
];

const SLIDER_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=1200&h=600&fit=crop', place: 'Santorini, Greece', caption: 'Where sunsets paint the sky' },
  { url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&h=600&fit=crop', place: 'Kyoto, Japan', caption: 'Ancient temples & cherry blossoms' },
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop', place: 'Swiss Alps', caption: 'Peaks that touch the clouds' },
  { url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&h=600&fit=crop', place: 'Taj Mahal, India', caption: 'A monument to eternal love' },
  { url: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&h=600&fit=crop', place: 'Northern Lights, Iceland', caption: 'Nature\'s greatest light show' },
  { url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200&h=600&fit=crop', place: 'Bali, Indonesia', caption: 'Island of gods & rice terraces' },
  { url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&h=600&fit=crop', place: 'Amalfi Coast, Italy', caption: 'Cliffside villages & azure seas' },
  { url: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&h=600&fit=crop', place: 'Machu Picchu, Peru', caption: 'Lost city in the clouds' },
];

export default function LandingPage() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent(c => (c + 1) % SLIDER_IMAGES.length), []);
  const prev = useCallback(() => setCurrent(c => (c - 1 + SLIDER_IMAGES.length) % SLIDER_IMAGES.length), []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [paused, next]);

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
        @keyframes rollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes rollDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .hero-anim { animation: fadeUp 0.7s ease forwards; }
        .hero-anim-2 { animation: fadeUp 0.7s 0.15s ease both; }
        .hero-anim-3 { animation: fadeUp 0.7s 0.3s ease both; }
        .feature-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(37,99,235,0.12); }
        .dest-pill:hover { background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; transform: scale(1.05); }
        .google-btn:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.15); transform: translateY(-2px); }
        .slider-arrow { opacity: 0; transition: opacity 0.2s; }
        .slider-wrap:hover .slider-arrow { opacity: 1; }
        .roll-col { display: flex; flex-direction: column; gap: 16px; }
        .roll-col-up { animation: rollUp 30s linear infinite; }
        .roll-col-down { animation: rollDown 30s linear infinite; }
        .roll-img {
          width: 100%; border-radius: 14px; object-fit: cover;
          height: 200px; display: block;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        @media (max-width: 900px) {
          .roll-strip { display: none !important; }
        }
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
          {loading ? 'Redirecting\u2026' : 'Get Started Free'}
        </button>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #4c1d95 100%)',
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 'clamp(560px, 85vh, 780px)',
      }}>
        {/* Left rolling strip */}
        <div className="roll-strip" style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: 220, overflow: 'hidden', pointerEvents: 'none',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          opacity: 0.55,
        }}>
          <div className="roll-col roll-col-up" style={{ paddingTop: 16 }}>
            {[...ROLL_LEFT, ...ROLL_LEFT].map((url, i) => (
              <img key={i} src={url} alt="" className="roll-img" loading="lazy" />
            ))}
          </div>
        </div>

        {/* Right rolling strip */}
        <div className="roll-strip" style={{
          position: 'absolute', right: 0, top: 0, bottom: 0,
          width: 220, overflow: 'hidden', pointerEvents: 'none',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          opacity: 0.55,
        }}>
          <div className="roll-col roll-col-down" style={{ paddingTop: 16 }}>
            {[...ROLL_RIGHT, ...ROLL_RIGHT].map((url, i) => (
              <img key={i} src={url} alt="" className="roll-img" loading="lazy" />
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 620, margin: '0 auto', textAlign: 'center', padding: '80px 5% 90px' }}>
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
            letterSpacing: '-1.5px',
            lineHeight: 1.2, marginBottom: 24,
            display: 'flex', flexWrap: 'wrap', alignItems: 'baseline',
            justifyContent: 'center', gap: '0 10px',
          }}>
            <span style={{
              fontSize: 'clamp(32px, 6vw, 80px)', fontWeight: 700,
              color: 'white', textShadow: '0 0 30px rgba(96,165,250,0.4)',
            }}>Plan trips</span>
            <span style={{
              fontSize: 'clamp(18px, 3vw, 40px)', fontWeight: 400,
              color: 'rgba(255,255,255,0.5)',
            }}>together, with</span>
            <span style={{
              fontSize: 'clamp(32px, 6vw, 80px)', fontWeight: 700,
              background: 'linear-gradient(90deg, #60a5fa, #c084fc)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Zero Drama.</span>
          </h1>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 10, padding: '10px 16px', marginBottom: 16,
              color: '#fca5a5', fontSize: 13,
            }}>
              {error}
            </div>
          )}

          <div className="hero-anim-3" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginBottom: 32 }}>
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
              {loading ? 'Redirecting to Google\u2026' : 'Sign up free with Google'}
            </button>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
              No credit card required · Free forever for small groups
            </p>
          </div>

          <p style={{
            fontSize: 17, color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.7, maxWidth: 520, margin: '0 auto', textAlign: 'center',
          }}>
            One link. Your whole crew. LetsWander puts chat, polls, budgets, itineraries, and photos in one place — so you spend less time in group chats and more time at the gate.
          </p>
        </div>
      </section>

      {/* ── Destination Image Slider ── */}
      <section style={{
        padding: '72px 5%',
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 12 }}>
              Wander the world
            </h2>
            <p style={{ fontSize: 16, color: '#64748b', maxWidth: 480, margin: '0 auto' }}>
              From ancient temples to alpine peaks — the world is waiting for your crew.
            </p>
          </div>

          <div
            className="slider-wrap"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
          >
            {/* Images */}
            <div style={{ position: 'relative', height: 'clamp(280px, 40vw, 500px)', background: '#0f172a' }}>
              {SLIDER_IMAGES.map((img, i) => (
                <div key={i} style={{
                  position: 'absolute', inset: 0,
                  opacity: i === current ? 1 : 0,
                  transition: 'opacity 0.8s ease',
                }}>
                  <img
                    src={img.url}
                    alt={img.place}
                    loading={i < 2 ? 'eager' : 'lazy'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              ))}

              {/* Gradient overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)',
                pointerEvents: 'none',
              }} />

              {/* Caption */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '32px 36px',
                display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
              }}>
                <div>
                  <h3 style={{
                    fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: 800,
                    color: 'white', letterSpacing: '-0.5px', marginBottom: 4,
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}>
                    {SLIDER_IMAGES[current].place}
                  </h3>
                  <p style={{
                    fontSize: 15, color: 'rgba(255,255,255,0.8)',
                    textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                  }}>
                    {SLIDER_IMAGES[current].caption}
                  </p>
                </div>

                {/* Dots */}
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {SLIDER_IMAGES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      style={{
                        width: i === current ? 24 : 8, height: 8,
                        borderRadius: 999, border: 'none',
                        background: i === current ? 'white' : 'rgba(255,255,255,0.4)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Arrows */}
              <button
                className="slider-arrow"
                onClick={prev}
                style={{
                  position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                  width: 44, height: 44, borderRadius: 12,
                  background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'white', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <ChevronLeft size={22} />
              </button>
              <button
                className="slider-arrow"
                onClick={next}
                style={{
                  position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                  width: 44, height: 44, borderRadius: 12,
                  background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'white', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '80px 5%', background: '#ffffff' }}>
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
                background: '#f8fafc', borderRadius: 18,
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
      <section style={{ padding: '70px 5%', background: '#f8fafc' }}>
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
              'Sri Lanka', 'Finland', 'Costa Rica', 'Azerbaijan', 'Goa', 'Kerala', 'Ladakh', 'Kashmir', '& more\u2026'].map(d => (
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
          {loading ? 'Redirecting\u2026' : <>Get started free <ArrowRight size={18} /></>}
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
        <p style={{ fontSize: 12, color: '#475569' }}>&copy; 2026 LetsWander. Plan together, wander freely.</p>
      </footer>
    </div>
  );
}
