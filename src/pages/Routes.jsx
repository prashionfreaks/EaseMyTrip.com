import { useState } from 'react';
import { useTrips } from '../context/TripContext';
import {
  Route, Train, Plane, Bus, Car, ArrowRight,
  Clock, Plus, MapPin, Zap, Wallet, Ruler, Trash2, Navigation,
} from 'lucide-react';
import { getDestinationCurrency } from '../lib/itinerary';

const INDIAN_ROUTES = {
  'goa|mumbai':             { dist: 600,  flight: [75, 4200, 'IndiGo / Air India · 1h 15m'], train: [480, 650, 'Konkan Kanya Express · 8h'], bus: [600, 400, 'Paulo Travels AC Sleeper · 10h'], car: [540, 2200, 'NH66 coastal highway · ~9h'] },
  'delhi|mumbai':           { dist: 1400, flight: [120, 5500, 'IndiGo / Vistara · 2h'], train: [960, 1400, 'Rajdhani Express · 16h'], bus: [1440, 900, 'Volvo AC · 24h'], car: [1320, 5000, 'NH48 · ~22h'] },
  'delhi|goa':              { dist: 1900, flight: [150, 6000, 'IndiGo / Air India · 2h 30m'], train: [1920, 1200, 'Goa Express · 32h'], bus: [2100, 1000, 'Private AC Sleeper · 35h'], car: [1980, 6500, 'NH48 + NH66 · ~33h'] },
  'bangalore|goa':          { dist: 560,  flight: [65, 4500, 'IndiGo / SpiceJet · 1h 5m'], train: [720, 500, 'Poorna Express · 12h'], bus: [660, 600, 'KSRTC / Paulo Travels · 11h'], car: [600, 2800, 'NH748 · ~10h'] },
  'goa|hyderabad':          { dist: 670,  flight: [80, 4800, 'Air India / IndiGo · 1h 20m'], train: [1020, 700, 'Amaravati Express · 17h'], bus: [960, 650, 'Orange Travels AC · 16h'], car: [900, 3200, 'NH65 + NH748 · 15h'] },
  'mumbai|pune':            { dist: 150,  flight: [45, 5000, 'Flight not advisable — too short'], train: [210, 300, 'Deccan Queen / Shatabdi · 3h 30m'], bus: [240, 250, 'Shivneri AC · 4h'], car: [180, 700, 'Expressway · 3h'] },
  'agra|delhi':             { dist: 230,  flight: [45, 6000, 'Flight not advisable — too short'], train: [120, 300, 'Gatimaan Express · 1h 40m (fastest)'], bus: [240, 200, 'UP Roadways · 4h'], car: [210, 800, 'Yamuna Expressway · 3h 30m'] },
  'delhi|jaipur':           { dist: 280,  flight: [55, 5500, 'Flight not advisable — too short'], train: [270, 400, 'Shatabdi Express · 4h 30m'], bus: [300, 350, 'RSRTC Volvo · 5h'], car: [270, 1000, 'NH48 · 4h 30m'] },
  'hyderabad|mumbai':       { dist: 710,  flight: [90, 4800, 'IndiGo / Air India · 1h 30m'], train: [780, 900, 'Hussainsagar Express · 13h'], bus: [840, 700, 'Orange Travels · 14h'], car: [810, 3000, 'NH65 · 13h 30m'] },
  'bangalore|hyderabad':    { dist: 570,  flight: [75, 4200, 'IndiGo / Vistara · 1h 15m'], train: [660, 600, 'Rajdhani / Shatabdi · 11h'], bus: [540, 550, 'VRL Travels Volvo · 9h'], car: [600, 2400, 'NH44 · 10h'] },
  'delhi|shimla':           { dist: 340,  flight: [60, 6500, 'Alliance Air · 1h (seasonal)'], train: [420, 350, 'Kalka Shatabdi + Toy Train · 7h'], bus: [480, 400, 'HRTC Volvo · 8h'], car: [420, 1800, 'NH5 · 7h'] },
  'delhi|manali':           { dist: 570,  flight: [70, 8000, 'Bhuntar Airport + taxi · 1h + 2h'], train: [900, 500, 'Train to Chandigarh + bus · 15h'], bus: [780, 600, 'Volvo AC Sleeper · 13h'], car: [780, 3000, 'NH3 via Kullu · 13h'] },
  'mahabaleshwar|mumbai':   { dist: 260,  flight: [0, 0, 'No direct flight'], train: [210, 300, 'Train to Pune + cab · 3h 30m'], bus: [240, 350, 'MSRTC Shivshahi · 4h'], car: [180, 900, 'Expressway + Ghats · 3h'] },
  'mahabaleshwar|pune':     { dist: 120,  flight: [0, 0, 'No direct flight'], train: [0, 0, 'No direct train'], bus: [180, 150, 'MSRTC / Private buses · 3h'], car: [150, 400, 'NH48 + Panchgani Rd · 2h 30m'] },
  'mumbai|udaipur':         { dist: 780,  flight: [90, 5000, 'IndiGo · 1h 30m'], train: [720, 700, 'Bandra Terminus Express · 12h'], bus: [960, 800, 'Private Volvo · 16h'], car: [840, 3500, 'NH48 + NH27 · 14h'] },
  'delhi|varanasi':         { dist: 820,  flight: [90, 5000, 'IndiGo / Vistara · 1h 30m'], train: [660, 700, 'Vande Bharat Express · 8h (fastest)'], bus: [780, 500, 'UP Roadways AC · 13h'], car: [720, 2800, 'NH19 · 12h'] },
};

const MODE_CONFIG = {
  flight: { icon: Plane,  color: '#8b5cf6', bg: '#f5f3ff', label: 'Flight'     },
  train:  { icon: Train,  color: '#0ea5e9', bg: '#e0f2fe', label: 'Train'      },
  bus:    { icon: Bus,    color: '#10b981', bg: '#d1fae5', label: 'Bus'        },
  car:    { icon: Car,    color: '#f97316', bg: '#ffedd5', label: 'Self Drive' },
};

function getRouteKey(a, b) {
  return [a, b].map(s => s.toLowerCase().trim()).sort().join('|');
}

function getRouteDistance(from, to) {
  const data = INDIAN_ROUTES[getRouteKey(from, to)];
  return data?.dist ?? null;
}

function generateOptions(from, to, isINR) {
  const key = getRouteKey(from, to);
  const data = INDIAN_ROUTES[key];

  if (data) {
    const MODES = ['flight', 'train', 'bus', 'car'];
    return MODES.map(mode => {
      const [duration, cost, note] = data[mode] || [0, 0, 'Not applicable'];
      return { mode, duration, cost: isINR ? cost : Math.round(cost / 83), note, unavailable: duration === 0 };
    });
  }

  const mult = isINR ? 1 : 1/83;
  return [
    { mode: 'flight', duration: 120, cost: Math.round(5500 * mult), note: 'Check airline websites for availability' },
    { mode: 'train',  duration: 600, cost: Math.round(800 * mult),  note: 'Book on IRCTC · Rajdhani / Express trains' },
    { mode: 'bus',    duration: 720, cost: Math.round(500 * mult),  note: 'Private AC Volvo sleeper buses' },
    { mode: 'car',    duration: 540, cost: Math.round(2500 * mult), note: 'Self-drive or cab · includes fuel & tolls' },
  ];
}

export default function Routes() {
  const { activeTrip, updateTrip } = useTrips();
  const [showAdd, setShowAdd] = useState(false);
  const [newRoute, setNewRoute] = useState({ from: '', to: '', returnTo: '' });
  const [loadingOptions, setLoadingOptions] = useState(null);

  if (!activeTrip) {
    return (
      <>
        <div className="page-header"><h1>Route Planner</h1><p>Select a trip first</p></div>
        <div className="page-body">
          <div className="empty-state">
            <Route className="empty-icon" />
            <h3>No trip selected</h3>
            <p>Go to Dashboard and select a trip to plan routes.</p>
          </div>
        </div>
      </>
    );
  }

  const { routes } = activeTrip;
  const isINR = getDestinationCurrency(activeTrip.destination) === 'INR';
  const sym = isINR ? '₹' : '$';

  function fmtDuration(mins) {
    if (!mins) return '—';
    const h = Math.floor(mins / 60), m = mins % 60;
    return h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ''}` : `${m}m`;
  }

  function handleAdd() {
    if (!newRoute.from.trim() || !newRoute.to.trim()) return;
    const routeId = 'r' + Date.now();
    const newEntry = {
      id: routeId,
      from: newRoute.from.trim(),
      to: newRoute.to.trim(),
      returnTo: newRoute.returnTo.trim() || newRoute.from.trim(),
    };
    updateTrip(activeTrip.id, trip => ({ ...trip, routes: [...trip.routes, newEntry] }));
    setNewRoute({ from: '', to: '', returnTo: '' });
    setShowAdd(false);
    setLoadingOptions(routeId);
    setTimeout(() => setLoadingOptions(null), 1800);
  }

  function handleDelete(routeId) {
    updateTrip(activeTrip.id, trip => ({ ...trip, routes: trip.routes.filter(r => r.id !== routeId) }));
  }

  const allStops = [];
  routes.forEach(r => {
    if (!allStops.includes(r.from)) allStops.push(r.from);
    if (!allStops.includes(r.to)) allStops.push(r.to);
    if (r.returnTo && r.returnTo !== r.from && !allStops.includes(r.returnTo)) allStops.push(r.returnTo);
  });

  return (
    <>
      <style>{`
        @keyframes routePulse {
          0%, 100% { opacity: 0.35; transform: scale(0.92); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .route-card { animation: slideUp 0.25s ease; }
        .mode-card {
          position: relative;
          border-radius: 14px;
          padding: 16px;
          border: 1.5px solid var(--border-light);
          background: var(--bg-secondary);
          transition: box-shadow 0.15s, border-color 0.15s, transform 0.15s;
          overflow: hidden;
        }
        .mode-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
          transform: translateY(-2px);
        }
        .mode-card.highlighted {
          border-color: transparent;
          box-shadow: 0 0 0 2px currentColor;
        }
        .delete-btn {
          opacity: 0;
          transition: opacity 0.15s;
        }
        .route-card:hover .delete-btn { opacity: 1; }
      `}</style>

      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1>Route Planner</h1>
          <p>{activeTrip.name} — {routes.length} route{routes.length !== 1 ? 's' : ''}{allStops.length > 0 ? ` · ${allStops.length} stops` : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Add Route
        </button>
      </div>

      <div className="page-body">

        {/* Journey map strip */}
        {allStops.length > 0 && (
          <div className="card" style={{ marginBottom: 24, overflow: 'hidden' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--brand) 0%, var(--purple) 100%)',
              padding: '12px 20px 10px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Navigation size={14} style={{ color: 'rgba(255,255,255,0.85)' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Journey Overview
              </span>
            </div>
            <div className="card-body" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', paddingBottom: 4 }}>
                {allStops.map((stop, i) => (
                  <div key={stop} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: i === 0
                          ? 'linear-gradient(135deg, var(--brand), #38bdf8)'
                          : i === allStops.length - 1
                            ? 'linear-gradient(135deg, var(--success), #34d399)'
                            : 'var(--bg-tertiary)',
                        border: `2px solid ${i === 0 ? 'var(--brand)' : i === allStops.length - 1 ? 'var(--success)' : 'var(--border)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: (i === 0 || i === allStops.length - 1) ? '0 4px 10px rgba(0,0,0,0.15)' : 'none',
                      }}>
                        <MapPin size={16} style={{ color: (i === 0 || i === allStops.length - 1) ? 'white' : 'var(--text-tertiary)' }} />
                      </div>
                      <span style={{
                        fontSize: 12, fontWeight: 700, marginTop: 6, textAlign: 'center', maxWidth: 72,
                        color: i === 0 ? 'var(--brand)' : i === allStops.length - 1 ? 'var(--success)' : 'var(--text-secondary)',
                        whiteSpace: 'nowrap',
                      }}>
                        {stop}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 500 }}>
                        {i === 0 ? 'Start' : i === allStops.length - 1 ? 'End' : `Stop ${i}`}
                      </span>
                    </div>
                    {i < allStops.length - 1 && (() => {
                      const segDist = getRouteDistance(stop, allStops[i + 1]);
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 4px', marginBottom: 28, gap: 3 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <div style={{ width: 24, height: 1.5, background: 'var(--border)' }} />
                            <ArrowRight size={12} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                            <div style={{ width: 24, height: 1.5, background: 'var(--border)' }} />
                          </div>
                          {segDist && (
                            <span style={{
                              fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)',
                              background: 'var(--bg-accent)', borderRadius: 99,
                              padding: '1px 7px', whiteSpace: 'nowrap',
                              display: 'flex', alignItems: 'center', gap: 3,
                            }}>
                              <Ruler size={8} /> {segDist.toLocaleString()} km
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Route cards */}
        {routes.length === 0 ? (
          <div className="empty-state" style={{ flexDirection: 'column' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--brand-light), var(--purple-light))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
            }}>
              <Route size={32} style={{ color: 'var(--brand)' }} />
            </div>
            <h3>No routes planned yet</h3>
            <p style={{ maxWidth: 300, textAlign: 'center' }}>Add a route and we'll instantly suggest the best flight, train, bus and drive options.</p>
            <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => setShowAdd(true)}>
              <Plus size={16} /> Add First Route
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {routes.map(route => {
              const isLoading = loadingOptions === route.id;
              const opts = (route.from && route.to) ? generateOptions(route.from, route.to, isINR) : [];
              const available = opts.filter(o => !o.unavailable);
              const cheapest = available.length ? available.reduce((a, b) => a.cost < b.cost ? a : b) : null;
              const fastest  = available.length ? available.reduce((a, b) => a.duration < b.duration ? a : b) : null;
              const distance = (route.from && route.to) ? getRouteDistance(route.from, route.to) : null;

              return (
                <div key={route.id} className="card route-card" style={{ overflow: 'hidden' }}>

                  {/* Gradient header */}
                  <div style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    padding: '18px 20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                    flexWrap: 'wrap',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flex: 1 }}>
                      {/* From pill */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: 'rgba(255,255,255,0.12)', borderRadius: 8,
                        padding: '6px 12px',
                      }}>
                        <MapPin size={13} style={{ color: '#38bdf8' }} />
                        <span style={{ fontWeight: 700, fontSize: 15, color: 'white' }}>{route.from}</span>
                      </div>

                      {/* Arrow */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 20, height: 1.5, background: 'rgba(255,255,255,0.25)' }} />
                        <Plane size={14} style={{ color: 'rgba(255,255,255,0.5)', transform: 'rotate(0deg)' }} />
                        <div style={{ width: 20, height: 1.5, background: 'rgba(255,255,255,0.25)' }} />
                      </div>

                      {/* To pill */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: 'rgba(255,255,255,0.12)', borderRadius: 8,
                        padding: '6px 12px',
                      }}>
                        <MapPin size={13} style={{ color: '#34d399' }} />
                        <span style={{ fontWeight: 700, fontSize: 15, color: 'white' }}>{route.to}</span>
                      </div>

                      {route.returnTo && route.returnTo !== route.to && (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <div style={{ width: 20, height: 1.5, background: 'rgba(255,255,255,0.25)' }} />
                            <ArrowRight size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />
                            <div style={{ width: 20, height: 1.5, background: 'rgba(255,255,255,0.25)' }} />
                          </div>
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            background: 'rgba(255,255,255,0.12)', borderRadius: 8,
                            padding: '6px 12px',
                          }}>
                            <MapPin size={13} style={{ color: '#f97316' }} />
                            <span style={{ fontWeight: 700, fontSize: 15, color: 'white' }}>{route.returnTo}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(route.id)}
                        style={{
                          background: 'rgba(239,68,68,0.2)', border: 'none', cursor: 'pointer',
                          borderRadius: 8, padding: '6px 8px', color: '#f87171',
                          display: 'flex', alignItems: 'center',
                        }}
                        title="Remove route"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Best picks summary bar */}
                  {!isLoading && cheapest && fastest && (
                    <div style={{
                      display: 'flex', gap: 0,
                      borderBottom: '1px solid var(--border-light)',
                      background: 'var(--bg-tertiary)',
                    }}>
                      <div style={{ flex: 1, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, borderRight: '1px solid var(--border-light)' }}>
                        <span style={{ fontSize: 10, fontWeight: 800, background: '#06b6d4', color: 'white', padding: '2px 7px', borderRadius: 99 }}>
                          ⚡ FASTEST
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>
                          {MODE_CONFIG[fastest.mode]?.label} · {fmtDuration(fastest.duration)}
                        </span>
                      </div>
                      <div style={{ flex: 1, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, background: '#10b981', color: 'white', padding: '2px 7px', borderRadius: 99 }}>
                          💰 CHEAPEST
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>
                          {MODE_CONFIG[cheapest.mode]?.label} · {sym}{cheapest.cost.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Transport options */}
                  <div style={{ padding: '16px 20px 20px' }}>
                    {isLoading ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0', gap: 16 }}>
                        <div style={{ display: 'flex', gap: 14 }}>
                          {['flight', 'train', 'bus', 'car'].map((m, i) => {
                            const cfg = MODE_CONFIG[m];
                            const Icon = cfg.icon;
                            return (
                              <div key={m} style={{
                                width: 52, height: 52, borderRadius: 14,
                                background: cfg.bg,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                animation: `routePulse 1.4s ease-in-out ${i * 0.22}s infinite`,
                              }}>
                                <Icon size={22} style={{ color: cfg.color }} />
                              </div>
                            );
                          })}
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>
                          Finding best travel options…
                        </p>
                      </div>
                    ) : available.length === 0 ? (
                      <p style={{ fontSize: 13, color: 'var(--text-tertiary)', textAlign: 'center', padding: '16px 0' }}>
                        No travel options found for this route.
                      </p>
                    ) : (
                      <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                          {available.map(opt => {
                            const cfg = MODE_CONFIG[opt.mode] || MODE_CONFIG.car;
                            const Icon = cfg.icon;
                            const isCheapest = cheapest?.mode === opt.mode;
                            const isFastest  = fastest?.mode === opt.mode;
                            const isHighlighted = isCheapest || isFastest;

                            return (
                              <div key={opt.mode} className="mode-card" style={{
                                borderColor: isHighlighted ? cfg.color + '50' : 'var(--border-light)',
                                background: isHighlighted ? cfg.bg : 'var(--bg-secondary)',
                              }}>
                                {/* Colored top bar */}
                                <div style={{
                                  position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                                  background: cfg.color,
                                  borderRadius: '14px 14px 0 0',
                                  opacity: isHighlighted ? 1 : 0.35,
                                }} />

                                {/* Badge row */}
                                <div style={{ display: 'flex', gap: 4, minHeight: 20, marginBottom: 12, flexWrap: 'wrap' }}>
                                  {isFastest && (
                                    <span style={{ fontSize: 9, fontWeight: 800, background: '#06b6d4', color: 'white', padding: '2px 8px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 3 }}>
                                      <Zap size={8} /> FASTEST
                                    </span>
                                  )}
                                  {isCheapest && (
                                    <span style={{ fontSize: 9, fontWeight: 800, background: '#10b981', color: 'white', padding: '2px 8px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 3 }}>
                                      <Wallet size={8} /> CHEAPEST
                                    </span>
                                  )}
                                </div>

                                {/* Icon + label */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                                  <div style={{
                                    width: 38, height: 38, borderRadius: 10,
                                    background: cfg.color + '20',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                  }}>
                                    <Icon size={18} style={{ color: cfg.color }} />
                                  </div>
                                  <span style={{ fontWeight: 800, fontSize: 14, color: cfg.color }}>{cfg.label}</span>
                                </div>

                                {/* Price */}
                                <div style={{ marginBottom: 6 }}>
                                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                                    <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>
                                      {sym}{opt.cost.toLocaleString()}
                                    </span>
                                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500 }}>/ person</span>
                                  </div>
                                  <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>
                                    RT ~{sym}{(opt.cost * 2).toLocaleString()}
                                  </p>
                                </div>

                                {/* Duration */}
                                <div style={{
                                  display: 'inline-flex', alignItems: 'center', gap: 5,
                                  background: 'rgba(0,0,0,0.05)', borderRadius: 6,
                                  padding: '4px 8px', marginBottom: 10,
                                }}>
                                  <Clock size={11} style={{ color: 'var(--text-tertiary)' }} />
                                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>{fmtDuration(opt.duration)}</span>
                                </div>

                                {/* Note */}
                                <p style={{ fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.5, borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 8, marginTop: 2 }}>
                                  {opt.note}
                                </p>
                              </div>
                            );
                          })}
                        </div>

                        <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
                          * Estimated fares · Prices vary by season, class & availability. Check IRCTC / airline apps for live rates.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add route modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Route size={18} style={{ color: 'var(--brand)' }} /> Add Route
              </h2>
              <button className="btn-ghost" onClick={() => setShowAdd(false)} style={{ padding: 4 }}>
                <span style={{ fontSize: 18 }}>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
                Enter your route cities and we'll instantly suggest the best travel options.
              </p>

              {/* Visual route preview */}
              {(newRoute.from || newRoute.to) && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
                  padding: '12px 16px', borderRadius: 10, marginBottom: 16,
                  background: 'linear-gradient(135deg, var(--bg-tertiary), var(--brand-light))',
                  border: '1px solid var(--border-light)',
                }}>
                  <span style={{ fontWeight: 700, color: 'var(--brand)', fontSize: 14 }}>{newRoute.from || '…'}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' }}>
                    <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                    <Plane size={14} style={{ color: 'var(--text-tertiary)' }} />
                    <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--success)', fontSize: 14 }}>{newRoute.to || '…'}</span>
                  {newRoute.returnTo && newRoute.returnTo !== newRoute.to && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 12, height: 1, background: 'var(--border)' }} />
                        <ArrowRight size={12} style={{ color: 'var(--text-tertiary)' }} />
                        <div style={{ width: 12, height: 1, background: 'var(--border)' }} />
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--orange)', fontSize: 14 }}>{newRoute.returnTo}</span>
                    </>
                  )}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', gap: 8, alignItems: 'end' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand)', display: 'inline-block' }} /> From
                  </label>
                  <input className="form-input" placeholder="e.g. Mumbai" value={newRoute.from}
                    onChange={e => setNewRoute(p => ({ ...p, from: e.target.value, returnTo: p.returnTo || e.target.value }))} />
                </div>
                <ArrowRight size={18} style={{ color: 'var(--text-tertiary)', marginBottom: 10, flexShrink: 0 }} />
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} /> To
                  </label>
                  <input className="form-input" placeholder="e.g. Goa" value={newRoute.to}
                    onChange={e => setNewRoute(p => ({ ...p, to: e.target.value }))} />
                </div>
                <ArrowRight size={18} style={{ color: 'var(--text-tertiary)', marginBottom: 10, flexShrink: 0 }} />
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--orange)', display: 'inline-block' }} /> Return To
                  </label>
                  <input className="form-input" placeholder="e.g. Mumbai" value={newRoute.returnTo}
                    onChange={e => setNewRoute(p => ({ ...p, returnTo: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={handleAdd}
                disabled={!newRoute.from.trim() || !newRoute.to.trim()}
              >
                <Plane size={14} /> Find Routes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
