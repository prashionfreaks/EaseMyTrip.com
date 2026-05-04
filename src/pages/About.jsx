import { useState } from 'react';
import { useTrips } from '../context/TripContext';
import { matchDestinationInfo } from '../data/destinationInfo';
import { toast } from '../lib/toast';
import {
  MapPin, Star, Clock, BookOpen, Utensils, Info,
  Globe, DollarSign, Languages, Landmark, ExternalLink, Sparkles,
  BedDouble, CheckCircle2, Pencil, X,
} from 'lucide-react';

function mapsUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

// 12-month strip helpers for the Best Time card. Parses period strings
// like "October–February", "Jun–Aug & Dec–Mar", "Sep–Nov & Mar–May",
// even with parenthesized notes ("(Midnight Sun)"). Returns a Set of
// 0-indexed month numbers that fall in any of the recommended ranges.
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function monthIndex(s) {
  const t = String(s || '').toLowerCase().trim();
  if (!t) return -1;
  for (let i = 0; i < MONTHS_FULL.length; i++) {
    if (t.startsWith(MONTHS_FULL[i].toLowerCase())) return i;
  }
  for (let i = 0; i < MONTHS_SHORT.length; i++) {
    if (t.startsWith(MONTHS_SHORT[i].toLowerCase())) return i;
  }
  return -1;
}

function parseBestMonths(period) {
  const set = new Set();
  if (!period) return set;
  // Drop parenthesized hints like "(Midnight Sun)"; treat / and & as
  // separate-range delimiters.
  const cleaned = String(period).replace(/\([^)]*\)/g, ' ').replace(/[/&]/g, '|');
  const ranges = cleaned.split('|').map(r => r.trim()).filter(Boolean);
  for (const range of ranges) {
    const parts = range.split(/[–\-—]|\bto\b/i).map(p => p.trim()).filter(Boolean);
    if (parts.length === 1) {
      const i = monthIndex(parts[0]);
      if (i >= 0) set.add(i);
    } else if (parts.length >= 2) {
      const a = monthIndex(parts[0]);
      const b = monthIndex(parts[parts.length - 1]);
      if (a >= 0 && b >= 0) {
        // Walk inclusive, wrapping the year boundary (Oct → Feb covers
        // Oct, Nov, Dec, Jan, Feb).
        let i = a;
        for (let safety = 0; safety < 12; safety++) {
          set.add(i);
          if (i === b) break;
          i = (i + 1) % 12;
        }
      }
    }
  }
  return set;
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
  const { activeTrip, setTripStay } = useTrips();

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
          0%   { box-shadow: 0 0 0 0 rgba(114, 47, 55,0.35); }
          100% { box-shadow: 0 0 0 14px rgba(114, 47, 55,0); }
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
          box-shadow: 0 6px 16px rgba(114, 47, 55,0.1);
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
        background: 'linear-gradient(135deg, #2a1a0d 0%, #4a1e23 55%, #0f766e 100%)',
        borderRadius: 16, margin: '0 0 20px', padding: '32px 28px 28px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div className="about-hero-blob-a" style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(184, 134, 11, 0.18)', pointerEvents: 'none' }} />
        <div className="about-hero-blob-b" style={{ position: 'absolute', bottom: -30, left: '40%', width: 140, height: 140, borderRadius: '50%', background: 'rgba(139,92,246,0.12)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <MapPin size={14} style={{ color: '#fbbf24' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fbbf24', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
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

        {/* Quick Facts — denser grid (140px min) so 5 facts fit on one row at md+. */}
        <div className="card about-section">
          <div style={{ background: 'linear-gradient(135deg, #0f766e 0%, #134e4a 100%)', padding: '10px 18px', borderRadius: '14px 14px 0 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Info size={14} style={{ color: 'rgba(255,255,255,0.9)' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'white', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Quick Facts</span>
          </div>
          <div className="card-body" style={{ padding: '14px 16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
              {[
                { icon: Languages, label: 'Language', value: info.quickFacts.language },
                { icon: DollarSign, label: 'Currency', value: info.quickFacts.currency },
                { icon: Landmark, label: 'Known As', value: info.quickFacts.knownAs },
                { icon: Globe, label: 'Timezone', value: info.quickFacts.timezone },
                { icon: MapPin, label: 'Capital / HQ', value: info.quickFacts.capital },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="quick-fact-card" style={{
                  padding: '8px 10px', borderRadius: 10,
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-light)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                    <Icon size={11} className="qf-icon" style={{ color: 'var(--brand)' }} />
                    <span style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                  </div>
                  <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Best Time to Visit — UX laws applied:
            Pareto: the period chip is the hero answer; reason is secondary.
            Doherty Threshold + Jakob's Law: the 12-month strip lets the eye
            recognize the answer in <100ms (same pattern as booking apps).
            Aesthetic-Usability: warm green for "go" months, muted for off-season.
            Common Region: bordered card binds the period, reason, and strip. */}
        {(() => {
          const bestMonths = parseBestMonths(info.bestTime.period);
          const todayMonth = new Date().getMonth();
          return (
            <div className="card about-section">
              <div style={{ background: 'linear-gradient(135deg, #0d9488 0%, #115e59 100%)', padding: '10px 18px', borderRadius: '14px 14px 0 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={14} style={{ color: 'rgba(255,255,255,0.9)' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'white', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Best Time to Visit</span>
              </div>
              <div className="card-body" style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                  <div style={{
                    flexShrink: 0, padding: '6px 14px', borderRadius: 10,
                    background: 'var(--success-light)', border: '1px solid var(--success)',
                    textAlign: 'center',
                  }}>
                    <span style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--success)', whiteSpace: 'nowrap' }}>
                      {info.bestTime.period}
                    </span>
                  </div>
                  <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.55, flex: 1, margin: 0 }}>
                    {info.bestTime.reason}
                  </p>
                </div>

                {/* 12-month strip. Best months light up green; the current
                    month gets a subtle ring so the user can place themselves
                    on the calendar at a glance. */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
                  gap: 3,
                }}>
                  {MONTHS_SHORT.map((m, i) => {
                    const isBest = bestMonths.has(i);
                    const isToday = i === todayMonth;
                    return (
                      <div
                        key={m}
                        title={MONTHS_FULL[i] + (isBest ? ' — recommended' : '') + (isToday ? ' (current month)' : '')}
                        style={{
                          padding: '5px 0',
                          textAlign: 'center',
                          borderRadius: 6,
                          background: isBest ? 'var(--success-light)' : 'var(--bg-tertiary)',
                          color: isBest ? 'var(--success)' : 'var(--text-tertiary)',
                          fontSize: 10.5,
                          fontWeight: isBest ? 800 : 500,
                          border: isBest ? '1px solid var(--success)' : '1px solid var(--border-light)',
                          boxShadow: isToday ? '0 0 0 2px rgba(13, 148, 136, 0.35)' : 'none',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {m}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Where you'll stay */}
        <StayCard
          trip={activeTrip}
          stays={info.stays || []}
          onSave={(stay) => setTripStay(activeTrip.id, stay)}
        />

        {/* Top Attractions — 2-col grid; description line-clamped to 3 lines so
            cards stay equal-height (Common Region) and the eye scans names first
            (Pareto). Whole card is the tap target — no inline CTA (Fitts + Hick). */}
        <div className="card about-section">
          <div style={{ background: 'linear-gradient(135deg, #722f37 0%, #4a1e23 100%)', padding: '10px 18px', borderRadius: '14px 14px 0 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Star size={14} style={{ color: 'rgba(255,255,255,0.9)' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'white', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Top Attractions</span>
          </div>
          <div className="card-body" style={{
            padding: '14px 16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 10,
          }}>
            {info.attractions.map((attr, i) => (
              <a
                key={attr.name}
                href={mapsUrl(`${attr.name} ${destQuery}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="attr-card"
                title={attr.desc}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '26px 1fr',
                  columnGap: 10, rowGap: 4,
                  padding: '10px 12px', borderRadius: 12,
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-light)',
                  textDecoration: 'none', color: 'inherit',
                  alignItems: 'start',
                }}
              >
                <div className="attr-num" style={{
                  gridRow: '1 / span 2',
                  width: 26, height: 26, borderRadius: 8,
                  background: 'linear-gradient(135deg, var(--purple), #7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: 11, fontWeight: 800,
                }}>
                  {i + 1}
                </div>
                <h4 style={{
                  fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)',
                  lineHeight: 1.25,
                  display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {attr.name}
                </h4>
                <p style={{
                  fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.4,
                  display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {attr.desc}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Best Eateries — only if data present */}
        {Array.isArray(info.eateries) && info.eateries.length > 0 && (
          <div className="card about-section">
            <div style={{ background: 'linear-gradient(135deg, #b8860b 0%, #92400e 100%)', padding: '12px 20px 10px', borderRadius: '14px 14px 0 0', display: 'flex', alignItems: 'center', gap: 8 }}>
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
            {/* 2-col grid; price is corner-pinned, rating/name lead per Pareto.
                Inline "View on Maps" CTA dropped — whole card is the link
                (Fitts), and `title=mustTry` exposes the secondary fact on hover
                without taking screen space (Hick's). */}
            <div className="card-body" style={{
              padding: '14px 16px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 10,
            }}>
              {info.eateries.map(e => (
                <a
                  key={e.name}
                  href={mapsUrl(`${e.name} ${e.area}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eatery-card"
                  title={`Must try: ${e.mustTry}`}
                  style={{
                    position: 'relative',
                    display: 'flex', flexDirection: 'column', gap: 5,
                    padding: '12px 12px 10px', borderRadius: 12,
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-light)',
                    textDecoration: 'none', color: 'inherit',
                  }}
                >
                  <span style={{
                    position: 'absolute', top: 8, right: 8,
                    fontSize: 9.5, fontWeight: 800, color: '#b45309',
                    background: '#fef3c7', padding: '2px 7px', borderRadius: 99,
                    border: '1px solid #fde68a',
                  }}>
                    {e.price}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingRight: 40 }}>
                    <div style={{
                      flexShrink: 0, width: 28, height: 28, borderRadius: 8,
                      background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 15,
                      border: '1px solid rgba(245,158,11,0.3)',
                    }}>🍴</div>
                    <h4 style={{
                      fontSize: 13, fontWeight: 700, color: 'var(--text-primary)',
                      lineHeight: 1.2, flex: 1, minWidth: 0,
                      display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {e.name}
                    </h4>
                  </div>

                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 700, color: '#92400e' }}>
                    <RatingStars rating={e.rating} />
                    {e.rating.toFixed(1)}
                    <span style={{ fontWeight: 500, color: 'var(--text-tertiary)', fontSize: 10.5 }}>
                      ({e.reviews.toLocaleString()})
                    </span>
                  </div>

                  <p style={{
                    fontSize: 10.5, color: 'var(--text-secondary)', lineHeight: 1.35,
                    fontWeight: 500,
                    display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {e.type}
                  </p>

                  <p style={{
                    fontSize: 10.5, color: 'var(--text-tertiary)',
                    display: 'inline-flex', alignItems: 'center', gap: 3,
                    overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                  }}>
                    <MapPin size={9} style={{ flexShrink: 0 }} /> {e.area}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Historical Facts */}
        <div className="card about-section">
          <div style={{ background: 'linear-gradient(135deg, #6b3e2c 0%, #3a1f12 100%)', padding: '12px 20px 10px', borderRadius: '14px 14px 0 0', display: 'flex', alignItems: 'center', gap: 8 }}>
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
          <div style={{ background: 'linear-gradient(135deg, #b8860b 0%, #6b3e2c 100%)', padding: '12px 20px 10px', borderRadius: '14px 14px 0 0', display: 'flex', alignItems: 'center', gap: 8 }}>
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

/* ─── Stay finalisation card ─────────────────────────────────────────── */
function StayCard({ trip, stays, onSave }) {
  const stay = trip?.stay || null;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name: '', area: '', notes: '' });

  function startEdit(prefill) {
    setDraft({
      name: prefill?.name || stay?.name || '',
      area: prefill?.area || stay?.area || '',
      notes: prefill?.notes || stay?.notes || '',
    });
    setEditing(true);
  }

  function commit() {
    if (!draft.name.trim()) {
      toast.error('Add the stay name first.');
      return;
    }
    onSave({ confirmed: true, name: draft.name, area: draft.area, notes: draft.notes });
    setEditing(false);
    toast.success('Stay saved');
  }

  function clearStay() {
    if (!window.confirm('Mark stay as not confirmed?')) return;
    onSave(null);
    setEditing(false);
  }

  return (
    <div className="card about-section">
      <div style={{
        background: 'linear-gradient(135deg, #be185d 0%, #db2777 100%)',
        padding: '10px 18px', borderRadius: '14px 14px 0 0',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <BedDouble size={14} style={{ color: 'rgba(255,255,255,0.95)' }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: 'white', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Where you&rsquo;ll stay
        </span>
        {stay?.confirmed && (
          <span style={{
            marginLeft: 'auto', fontSize: 10, fontWeight: 700, color: 'white',
            background: 'rgba(255,255,255,0.18)', padding: '2px 8px', borderRadius: 99,
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            <CheckCircle2 size={10} /> Confirmed
          </span>
        )}
      </div>

      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '14px 16px' }}>
        {/* Confirmed state — render directly into the card body (no inner
            tile-with-its-own-border) so we avoid the "card inside a card"
            look. UX laws: Common Region (one region, not nested), Pareto
            (name leads, area is secondary, notes tertiary), Fitts (icon
            actions in the corner are tappable but out of the reading path). */}
        {stay?.confirmed && !editing && (
          <div style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: '44px 1fr',
            columnGap: 12, rowGap: 4,
            alignItems: 'start',
          }}>
            <div style={{
              gridRow: '1 / span 3',
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
              border: '1px solid rgba(190,24,93,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BedDouble size={20} style={{ color: '#be185d' }} />
            </div>

            <h4 style={{
              fontSize: 15, fontWeight: 700, color: 'var(--text-primary)',
              lineHeight: 1.25,
              paddingRight: 76, // reserve space for the action icons (top-right)
            }}>
              {stay.name}
            </h4>

            {stay.area ? (
              <p style={{
                fontSize: 12, color: 'var(--text-secondary)',
                display: 'inline-flex', alignItems: 'center', gap: 4,
                lineHeight: 1.3,
              }}>
                <MapPin size={11} /> {stay.area}
              </p>
            ) : <span />}

            {stay.notes ? (
              <p style={{
                fontSize: 12.5, color: 'var(--text-secondary)',
                lineHeight: 1.5, marginTop: 2,
              }}>
                {stay.notes}
              </p>
            ) : <span />}

            <div style={{
              position: 'absolute', top: 0, right: 0,
              display: 'inline-flex', gap: 4,
            }}>
              <button
                onClick={() => startEdit()}
                title="Edit stay"
                aria-label="Edit stay"
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'transparent',
                  border: '1px solid #f9a8d4',
                  color: '#be185d', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fce7f3'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={clearStay}
                title="Mark as not confirmed"
                aria-label="Clear stay"
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--text-tertiary)', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; }}
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {!stay?.confirmed && !editing && (
          <>
            <div style={{
              padding: '12px 14px', borderRadius: 10,
              background: 'linear-gradient(135deg, #fff7ed, #ffedd5)',
              border: '1px solid #fdba74',
              display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
            }}>
              <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#9a3412' }}>
                  Have you booked a place to stay?
                </p>
                <p style={{ fontSize: 12, color: '#b45309', marginTop: 2, lineHeight: 1.4 }}>
                  Confirming your stay tailors the itinerary check-in &amp; nearby suggestions.
                </p>
              </div>
              <button onClick={() => startEdit()} className="btn btn-primary btn-sm" style={{
                fontSize: 12, padding: '6px 12px', flexShrink: 0,
              }}>
                <CheckCircle2 size={12} /> Yes, mark as booked
              </button>
            </div>

            {stays.length > 0 && (
              <div>
                <p style={{
                  fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)',
                  textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10,
                  display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center',
                }}>
                  <Sparkles size={10} /> Top picks {trip?.destination ? `in ${trip.destination}` : ''} (Google reviews)
                </p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: 10,
                }}>
                  {stays.map(s => (
                    <button
                      key={s.name}
                      onClick={() => startEdit({
                        name: s.name,
                        area: s.area,
                        notes: `${s.type} · ${s.highlight}`,
                      })}
                      title={s.highlight}
                      style={{
                        position: 'relative',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'flex-start',
                        gap: 6, padding: '14px 12px 12px', borderRadius: 14,
                        background: 'linear-gradient(180deg, #fff 0%, #fff5f7 100%)',
                        border: '1px solid var(--border-light)',
                        textAlign: 'center', cursor: 'pointer', width: '100%',
                        transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.borderColor = '#f9a8d4';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(190,24,93,0.12)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.borderColor = 'var(--border-light)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <span style={{
                        position: 'absolute', top: 8, right: 8,
                        fontSize: 9.5, fontWeight: 800, color: '#be185d',
                        background: '#fce7f3', padding: '2px 7px', borderRadius: 99,
                        letterSpacing: '0.02em',
                      }}>
                        {s.price}
                      </span>

                      <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 20, marginTop: 4,
                      }}>🛏️</div>

                      <h4 style={{
                        fontSize: 13, fontWeight: 700, color: 'var(--text-primary)',
                        lineHeight: 1.2,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        overflow: 'hidden', minHeight: 32,
                      }}>
                        {s.name}
                      </h4>

                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        fontSize: 11.5, fontWeight: 700, color: '#92400e',
                      }}>
                        <Star size={11} fill="#f59e0b" color="#f59e0b" />
                        {s.rating?.toFixed(1)}
                        <span style={{ fontWeight: 500, color: 'var(--text-tertiary)', fontSize: 10.5 }}>
                          ({s.reviews?.toLocaleString()})
                        </span>
                      </div>

                      <span style={{
                        fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)',
                        background: 'var(--bg-tertiary)',
                        padding: '2px 8px', borderRadius: 99,
                        display: 'inline-flex', alignItems: 'center', gap: 3,
                        maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {s.type}
                      </span>

                      <p style={{
                        fontSize: 10.5, color: 'var(--text-tertiary)', lineHeight: 1.35,
                        display: 'inline-flex', alignItems: 'center', gap: 3,
                        maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        <MapPin size={9} /> {s.area}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {stays.length === 0 && (
              <button onClick={() => startEdit()} className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
                <Pencil size={12} /> Add your own stay
              </button>
            )}
          </>
        )}

        {editing && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Stay name</label>
              <input
                className="form-input"
                placeholder="Hotel / hostel / Airbnb"
                value={draft.name}
                onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                autoFocus
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Area / neighbourhood (optional)</label>
              <input
                className="form-input"
                placeholder="e.g. Shibuya, Tokyo"
                value={draft.area}
                onChange={e => setDraft(d => ({ ...d, area: e.target.value }))}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Notes (optional)</label>
              <textarea
                className="form-input"
                placeholder="Check-in time, booking ref, anything useful for the group"
                value={draft.notes}
                onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))}
                rows={2}
              />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setEditing(false)} className="btn btn-secondary btn-sm">Cancel</button>
              <button onClick={commit} className="btn btn-primary btn-sm">
                <CheckCircle2 size={13} /> Confirm stay
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
