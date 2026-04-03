import { useTrips } from '../context/TripContext';
import { matchDestinationInfo } from '../data/destinationInfo';
import {
  MapPin, Star, Clock, BookOpen, Utensils, Info,
  Globe, DollarSign, Languages, Landmark,
} from 'lucide-react';

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

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .about-section { animation: fadeUp 0.3s ease both; }
        .about-section:nth-child(2) { animation-delay: 0.05s; }
        .about-section:nth-child(3) { animation-delay: 0.10s; }
        .about-section:nth-child(4) { animation-delay: 0.15s; }
        .about-section:nth-child(5) { animation-delay: 0.20s; }
        .about-section:nth-child(6) { animation-delay: 0.25s; }
        .attr-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); transform: translateY(-2px); }
      `}</style>

      {/* Hero banner */}
      <div className="about-section" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0e7490 100%)',
        borderRadius: 16, margin: '0 0 20px', padding: '32px 28px 28px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(14,165,233,0.15)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -30, left: '40%', width: 140, height: 140, borderRadius: '50%', background: 'rgba(139,92,246,0.12)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <MapPin size={14} style={{ color: '#38bdf8' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Destination Guide
            </span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: 'white', letterSpacing: '-0.5px', marginBottom: 8, lineHeight: 1.15 }}>
            {activeTrip.destination}
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.72)', fontStyle: 'italic', marginBottom: 20 }}>
            {info.tagline}
          </p>

          {/* Famous for pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {info.famousFor.map(tag => (
              <span key={tag} style={{
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
                <div key={label} style={{
                  padding: '12px 14px', borderRadius: 10,
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-light)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                    <Icon size={13} style={{ color: 'var(--brand)' }} />
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
              <div key={attr.name} className="attr-card" style={{
                display: 'flex', gap: 14, alignItems: 'flex-start',
                padding: '14px 16px', borderRadius: 12,
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-light)',
                transition: 'box-shadow 0.15s, transform 0.15s',
              }}>
                <div style={{
                  flexShrink: 0, width: 30, height: 30, borderRadius: 8,
                  background: 'linear-gradient(135deg, var(--purple), #7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: 12, fontWeight: 800,
                }}>
                  {i + 1}
                </div>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{attr.name}</h4>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{attr.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Historical Facts */}
        <div className="card about-section">
          <div style={{ background: 'linear-gradient(135deg, var(--orange) 0%, #ea580c 100%)', padding: '12px 20px 10px', borderRadius: '14px 14px 0 0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOpen size={14} style={{ color: 'rgba(255,255,255,0.9)' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'white', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Historical Facts</span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {info.history.map((fact, i) => (
              <div key={i} style={{
                display: 'flex', gap: 14, alignItems: 'flex-start',
                padding: '14px 0',
                borderBottom: i < info.history.length - 1 ? '1px solid var(--border-light)' : 'none',
              }}>
                <div style={{
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
                <div key={dish} style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '8px 14px', borderRadius: 10,
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-light)',
                  fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
                }}>
                  <span style={{ fontSize: 16 }}>🍽</span> {dish}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
