import { useTrips } from '../context/TripContext';
import { matchDestinationInfo } from '../data/destinationInfo';
import {
  MapPin, Star, Clock, BookOpen, Utensils, Info,
  Globe, DollarSign, Languages, Landmark, ExternalLink, Sparkles,
} from 'lucide-react';

function mapsUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function RatingStars({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.3 && rating - full < 0.8;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      {[0, 1, 2, 3, 4].map(i => {
        const isFull = i < full;
        const isHalf = i === full && half;
        return (
          <Star
            key={i}
            size={12}
            className={isFull || isHalf ? 'rating-star-lit' : ''}
            style={{
              color: isFull ? '#f59e0b' : isHalf ? '#f59e0b' : '#d1d5db',
              fill: isFull ? '#f59e0b' : isHalf ? 'url(#half)' : 'none',
              animationDelay: `${i * 80}ms`,
            }}
          />
        );
      })}
    </span>
  );
}

export default function About() {
  const { activeTrip } = useTrips();

  if (!activeTrip) {
    return (
      <>
        <div className="page-header"><h1>About Destination</h1><p>Select a trip first</p></div>
        <div className="page-body">
          <div className="empty-state">
            <Globe className="empty-icon" />
            <h3>No trip selected</h3>
            <p>Select a trip to explore destination info.</p>
          </div>
        </div>
      </>
    );
  }

  const info = matchDestinationInfo(activeTrip.destination);

  if (!info) {
    return (
      <>
        <div className="page-header">
          <h1>About {activeTrip.destination}</h1>
          <p>Destination guide</p>
        </div>
        <div className="page-body">
          <div className="empty-state">
            <Globe className="empty-icon" />
            <h3>No info available yet</h3>
            <p>We don't have destination details for <strong>{activeTrip.destination}</strong> yet. Check back soon!</p>
          </div>
        </div>
      </>
    );
  }

  const destQuery = activeTrip.destination;

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blobDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(12px, -8px) scale(1.05); }
        }
        @keyframes blobDrift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(-10px, 10px) scale(1.08); }
        }
        @keyframes heroShine {
          0%   { background-position: -200% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes pillPop {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.12) rotate(-2deg); }
          100% { transform: scale(1.06) rotate(0deg); }
        }
        @keyframes starTwinkle {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50%      { transform: scale(1.25); filter: brightness(1.4); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25%      { transform: rotate(-12deg); }
          75%      { transform: rotate(12deg); }
        }
        @keyframes sparklePop {
          0%   { opacity: 0; transform: scale(0) rotate(0deg); }
          40%  { opacity: 1; transform: scale(1.2) rotate(180deg); }
          100% { opacity: 0; transform: scale(0.6) rotate(360deg); }
        }
        @keyframes ripple {
          0%   { box-shadow: 0 0 0 0 rgba(14,165,233,0.35); }
          100% { box-shadow: 0 0 0 14px rgba(14,165,233,0); }
        }

        .about-section { animation: fadeUp 0.35s ease both; }
        .about-section:nth-child(2) { animation-delay: 0.05s; }
        .about-section:nth-child(3) { animation-delay: 0.10s; }
        .about-section:nth-child(4) { animation-delay: 0.15s; }
        .about-section:nth-child(5) { animation-delay: 0.20s; }
        .about-section:nth-child(6) { animation-delay: 0.25s; }
        .about-section:nth-child(7) { animation-delay: 0.30s; }

        /* Hero */
        .about-hero-blob-a { animation: blobDrift 9s ease-in-out infinite; }
        .about-hero-blob-b { animation: blobDrift2 12s ease-in-out infinite; }
        .about-hero-title {
          background: linear-gradient(90deg, #ffffff 0%, #e0f2fe 40%, #bae6fd 50%, #e0f2fe 60%, #ffffff 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: heroShine 8s linear infinite;
        }

        /* Famous-for pills */
        .famous-pill {
          cursor: default;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
                      background 0.2s, border-color 0.2s;
        }
        .famous-pill:hover {
          transform: translateY(-2px) scale(1.06);
          background: rgba(255,255,255,0.2) !important;
          border-color: rgba(255,255,255,0.35) !important;
        }
        .famous-pill:active { animation: pillPop 0.4s ease; }

        /* Quick facts */
        .quick-fact-card {
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
                      border-color 0.2s, box-shadow 0.2s;
          cursor: default;
        }
        .quick-fact-card:hover {
          transform: translateY(-3px);
          border-color: var(--brand);
          box-shadow: 0 6px 16px rgba(14,165,233,0.1);
        }
        .quick-fact-card:hover .qf-icon { transform: rotate(-8deg) scale(1.15); }
        .qf-icon { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }

        /* Attractions */
        .attr-card {
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.2s, border-color 0.2s;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .attr-card::after {
          content: '';
          position: absolute; top: 0; left: -100%;
          width: 40%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(124,58,237,0.08), transparent);
          transition: left 0.6s ease;
        }
        .attr-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 18px rgba(124,58,237,0.12);
          border-color: rgba(124,58,237,0.25);
        }
        .attr-card:hover::after { left: 130%; }
        .attr-card:hover .attr-num { transform: rotate(-6deg) scale(1.08); }
        .attr-card:hover .attr-maps { opacity: 1; transform: translateX(0); }
        .attr-num { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .attr-maps {
          opacity: 0; transform: translateX(-6px);
          transition: opacity 0.2s, transform 0.2s;
        }

        /* Cuisine pills */
        .cuisine-pill {
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
                      background 0.2s, border-color 0.2s;
          cursor: default;
          position: relative;
        }
        .cuisine-pill:hover {
          transform: translateY(-3px) scale(1.04);
          background: var(--brand-light) !important;
          border-color: var(--brand) !important;
        }
        .cuisine-pill:hover .cuisine-emoji {
          animation: wiggle 0.5s ease-in-out;
          display: inline-block;
        }

        /* Eatery cards */
        .eatery-card {
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.25s, border-color 0.2s;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .eatery-card::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(245,158,11,0.06), transparent 60%);
          opacity: 0; transition: opacity 0.3s;
          pointer-events: none;
        }
        .eatery-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(245,158,11,0.15);
          border-color: rgba(245,158,11,0.35);
        }
        .eatery-card:hover::before { opacity: 1; }
        .eatery-card:hover .rating-star-lit { animation: starTwinkle 0.8s ease-in-out; }
        .eatery-card:hover .eatery-cta { opacity: 1; transform: translateX(0); }
        .eatery-cta {
          opacity: 0; transform: translateX(-4px);
          transition: opacity 0.2s, transform 0.2s;
        }
        .eatery-sparkle {
          position: absolute;
          pointer-events: none;
          animation: sparklePop 0.9s ease-out forwards;
        }

        /* History timeline */
        .history-item { transition: background 0.2s; border-radius: 8px; padding-left: 4px; padding-right: 8px; margin-left: -4px; }
        .history-item:hover { background: rgba(234,88,12,0.06); }
        .history-dot { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .history-item:hover .history-dot { transform: scale(1.6); box-shadow: 0 0 0 4px rgba(234,88,12,0.15); }
      `}</style>

      {/* Hero banner */}
      <div className="about-section" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0e7490 100%)',
        borderRadius: 16, margin: '0 0 20px', padding: '32px 28px 28px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div className="about-hero-blob-a" style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(14,165,233,0.15)', pointerEvents: 'none' }} />
        <div className="about-hero-blob-b" style={{ position: 'absolute', bottom: -30, left: '40%', width: 140, height: 140, borderRadius: '50%', background: 'rgba(139,92,246,0.12)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <MapPin size={14} style={{ color: '#38bdf8' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Destination Guide
            </span>
          </div>
          <h1 className="about-hero-title" style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 8, lineHeight: 1.15 }}>
            {activeTrip.destination}
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.72)', fontStyle: 'italic', marginBottom: 20 }}>
            {info.tagline}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {info.famousFor.map(tag => (
              <span key={tag} className="famous-pill" style={{
                fontSize: 12, fontWeight: 600,
                background: 'rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.88)',
                border: '1px solid rgba(255,255,255,0.18)',
                padding: '4px 12px', borderRadius: 99,
                backdropFilter: 'blur(4px)',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="page-body" style={{ paddingTop: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Quick Facts */}
        <div className="card about-section">
          <div style={{ background: 'linear-gradient(135deg, var(--brand) 0%, var(--teal) 100%)', padding: '12px 20px 10px', borderRadius: '14px 14px 0 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Info size={14} style={{ color: 'rgba(255,255,255,0.9)' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'white', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Quick Facts</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
              {[
                { icon: Languages, label: 'Language', value: info.quickFacts.language },
                { icon: DollarSign, label: 'Currency', value: info.quickFacts.currency },
                { icon: Landmark, label: 'Known As', value: info.quickFacts.knownAs },
                { icon: Globe, label: 'Timezone', value: info.quickFacts.timezone },
                { icon: MapPin, label: 'Capital / HQ', value: info.quickFacts.capital },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="quick-fact-card" style={{
                  padding: '12px 14px', borderRadius: 10,
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-light)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                    <Icon size={13} className="qf-icon" style={{ color: 'var(--brand)' }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Best Time to Visit */}
        <div className="card about-section">
          <div style={{ background: 'linear-gradient(135deg, var(--success) 0%, #059669 100%)', padding: '12px 20px 10px', borderRadius: '14px 14px 0 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={14} style={{ color: 'rgba(255,255,255,0.9)' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'white', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Best Time to Visit</span>
          </div>
          <div className="card-body" style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{
              flexShrink: 0, padding: '8px 16px', borderRadius: 10,
              background: 'var(--success-light)', border: '1px solid var(--success)',
              textAlign: 'center',
            }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--success)', whiteSpace: 'nowrap' }}>{info.bestTime.period}</span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{info.bestTime.reason}</p>
          </div>
        </div>

        {/* Top Attractions */}
        <div className="card about-section">
          <div style={{ background: 'linear-gradient(135deg, var(--purple) 0%, #7c3aed 100%)', padding: '12px 20px 10px', borderRadius: '14px 14px 0 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Star size={14} style={{ color: 'rgba(255,255,255,0.9)' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'white', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Top Attractions</span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {info.attractions.map((attr, i) => (
              <a
                key={attr.name}
                href={mapsUrl(`${attr.name} ${destQuery}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="attr-card"
                style={{
                  display: 'flex', gap: 14, alignItems: 'flex-start',
                  padding: '14px 16px', borderRadius: 12,
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-light)',
                  textDecoration: 'none', color: 'inherit',
                }}
              >
                <div className="attr-num" style={{
                  flexShrink: 0, width: 30, height: 30, borderRadius: 8,
                  background: 'linear-gradient(135deg, var(--purple), #7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: 12, fontWeight: 800,
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{attr.name}</h4>
                    <span className="attr-maps" style={{
                      display: 'inline-flex', alignItems: 'center', gap: 3,
                      fontSize: 10.5, fontWeight: 700, color: 'var(--purple)',
                    }}>
                      <ExternalLink size={10} /> Maps
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{attr.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Best Eateries — only if data present */}
        {Array.isArray(info.eateries) && info.eateries.length > 0 && (
          <div className="card about-section">
            <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)', padding: '12px 20px 10px', borderRadius: '14px 14px 0 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Utensils size={14} style={{ color: 'rgba(255,255,255,0.95)' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'white', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Best Eateries Around</span>
              <span style={{
                marginLeft: 'auto', fontSize: 10, fontWeight: 600,
                color: 'rgba(255,255,255,0.85)',
                background: 'rgba(0,0,0,0.18)', padding: '2px 8px', borderRadius: 99,
                display: 'inline-flex', alignItems: 'center', gap: 4,
              }}>
                <Sparkles size={9} /> via Google Reviews
              </span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {info.eateries.map(e => (
                <a
                  key={e.name}
                  href={mapsUrl(`${e.name} ${e.area}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eatery-card"
                  style={{
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                    padding: '14px 16px', borderRadius: 12,
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-light)',
                    textDecoration: 'none', color: 'inherit',
                  }}
                >
                  <div style={{
                    flexShrink: 0, width: 40, height: 40, borderRadius: 10,
                    background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20,
                    border: '1px solid rgba(245,158,11,0.3)',
                  }}>
                    🍴
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                      <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                        {e.name}
                      </h4>
                      <span style={{
                        fontSize: 10.5, fontWeight: 700, color: '#b45309',
                        background: '#fef3c7', padding: '2px 8px', borderRadius: 99,
                        border: '1px solid #fde68a',
                      }}>
                        {e.price}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                      <RatingStars rating={e.rating} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#92400e' }}>
                        {e.rating.toFixed(1)}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                        ({e.reviews.toLocaleString()} reviews)
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>·</span>
                      <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {e.type}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                      <MapPin size={10} style={{ flexShrink: 0 }} /> {e.area}
                      <span style={{ color: 'var(--text-tertiary)' }}>·</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                        Must try: {e.mustTry}
                      </span>
                    </p>
                  </div>
                  <span className="eatery-cta" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 3,
                    fontSize: 11, fontWeight: 700, color: '#d97706',
                    whiteSpace: 'nowrap', flexShrink: 0, alignSelf: 'center',
                  }}>
                    <ExternalLink size={11} /> View on Maps
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Historical Facts */}
        <div className="card about-section">
          <div style={{ background: 'linear-gradient(135deg, var(--orange) 0%, #ea580c 100%)', padding: '12px 20px 10px', borderRadius: '14px 14px 0 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOpen size={14} style={{ color: 'rgba(255,255,255,0.9)' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'white', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Historical Facts</span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {info.history.map((fact, i) => (
              <div key={i} className="history-item" style={{
                display: 'flex', gap: 14, alignItems: 'flex-start',
                padding: '14px 8px 14px 4px',
                borderBottom: i < info.history.length - 1 ? '1px solid var(--border-light)' : 'none',
              }}>
                <div className="history-dot" style={{
                  flexShrink: 0, width: 6, height: 6, borderRadius: '50%',
                  background: 'var(--orange)', marginTop: 8,
                }} />
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{fact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Local Cuisine */}
        <div className="card about-section">
          <div style={{ background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)', padding: '12px 20px 10px', borderRadius: '14px 14px 0 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Utensils size={14} style={{ color: 'rgba(255,255,255,0.9)' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'white', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Local Cuisine — Must Try</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {info.cuisine.map(dish => (
                <div key={dish} className="cuisine-pill" style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '8px 14px', borderRadius: 10,
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-light)',
                  fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
                }}>
                  <span className="cuisine-emoji" style={{ fontSize: 16 }}>🍽</span> {dish}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
