import { useState } from 'react';
import { useTrips } from '../context/TripContext';
import Modal from '../components/Modal';
import {
  Plus, Map, MapPin, Plane, Hotel, Camera, UtensilsCrossed,
  ChevronDown, ChevronUp, DollarSign, StickyNote, Sparkles,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { generateItinerary, hasAIKey, getDestinationCurrency } from '../lib/itinerary';

const typeConfig = {
  transport: { icon: Plane, color: 'var(--brand)', label: 'Transport' },
  accommodation: { icon: Hotel, color: 'var(--purple)', label: 'Stay' },
  activity: { icon: Camera, color: 'var(--teal)', label: 'Activity' },
  food: { icon: UtensilsCrossed, color: 'var(--orange)', label: 'Food' },
};

export default function Itinerary() {
  const { activeTrip, addItineraryItem, updateTrip } = useTrips();
  const [collapsedDays, setCollapsedDays] = useState(new Set());
  const [showAdd, setShowAdd] = useState(null); // dayId
  const [newItem, setNewItem] = useState({ time: '09:00', title: '', type: 'activity', duration: 60, notes: '', cost: '' });
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  async function runGenerate() {
    setShowConfirm(false);
    setGenerating(true);
    setGenError(null);
    try {
      const { days, currency } = await generateItinerary(activeTrip.destination, activeTrip.startDate, activeTrip.endDate);
      updateTrip(activeTrip.id, t => ({
        ...t,
        itinerary: days,
        budget: { ...t.budget, currency },
      }));
      setCollapsedDays(new Set());
    } catch (err) {
      setGenError(err.message || 'Failed to generate itinerary');
    } finally {
      setGenerating(false);
    }
  }

  function handleSuggest() {
    if (activeTrip.itinerary?.length > 0) {
      setShowConfirm(true);
    } else {
      runGenerate();
    }
  }
if (!activeTrip) {
    return (
      <>
        <div className="page-header"><h1>Itinerary</h1><p>Select a trip first</p></div>
        <div className="page-body">
          <div className="empty-state">
            <Map className="empty-icon" />
            <h3>No trip selected</h3>
            <p>Go to Dashboard and select a trip to build your itinerary.</p>
          </div>
        </div>
      </>
    );
  }

  const { itinerary } = activeTrip;
  const sym = getDestinationCurrency(activeTrip.destination) === 'INR' ? '₹' : '$';

  function handleAdd() {
    if (!newItem.title || !showAdd) return;
    addItineraryItem(activeTrip.id, showAdd, {
      ...newItem,
      cost: Number(newItem.cost) || 0,
      duration: Number(newItem.duration) || 60,
    });
    setNewItem({ time: '09:00', title: '', type: 'activity', duration: 60, notes: '', cost: '' });
    setShowAdd(null);
  }

  return (
    <>
      <style>{`
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes planeFly {
    0%   { transform: translateX(-8px) rotate(-5deg); opacity: 0.7; }
    50%  { transform: translateX(4px)  rotate(5deg);  opacity: 1; }
    100% { transform: translateX(-8px) rotate(-5deg); opacity: 0.7; }
  }
`}</style>
      <div className="page-header">
        <div>
          <h1>Itinerary</h1>
          <p>{activeTrip.name} — {itinerary.length} day{itinerary.length !== 1 ? 's' : ''} planned</p>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={handleSuggest}
          disabled={generating}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          {generating
            ? <><Plane size={14} style={{ animation: 'planeFly 1.2s ease-in-out infinite' }} /> Planning your trip…</>
            : <><Sparkles size={14} /> Suggest Itinerary</>}
        </button>
      </div>

      <div className="page-body">
        {itinerary.length === 0 ? (
          <div className="empty-state">
            <Map className="empty-icon" />
            <h3>No itinerary yet</h3>
            <p>Start building your day-by-day travel plan.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {itinerary.map((day, dayIdx) => {
              const isExpanded = !collapsedDays.has(day.id);
              const dayTotal = day.items.reduce((sum, it) => sum + it.cost, 0);

              return (
                <div key={day.id} className="card">
                  <button
                    className="card-header"
                    onClick={() => setCollapsedDays(prev => {
                      const next = new Set(prev);
                      if (next.has(day.id)) next.delete(day.id); else next.add(day.id);
                      return next;
                    })}
                    style={{ cursor: 'pointer', width: '100%' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 'var(--radius-md)',
                        background: 'var(--brand)', color: 'white',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700, lineHeight: 1.1,
                      }}>
                        <span style={{ fontSize: 9, opacity: 0.8 }}>DAY</span>
                        {dayIdx + 1}
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <h3 style={{ fontSize: 15, fontWeight: 600 }}>
                          {format(parseISO(day.date), 'EEEE, MMM d')}
                        </h3>
                        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={11} /> {day.location} · {day.items.length} activities
                          {dayTotal > 0 && <> · <DollarSign size={11} />{sym}{dayTotal.toLocaleString()}</>}
                        </p>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>

                  {isExpanded && (
                    <div className="card-body" style={{ padding: '0 20px 16px' }}>
                      {/* Timeline */}
                      <div style={{ position: 'relative', paddingLeft: 24 }}>
                        {/* Vertical line */}
                        <div style={{
                          position: 'absolute', left: 7, top: 8, bottom: 8,
                          width: 2, background: 'var(--border-light)',
                        }} />

                        {day.items.map((item, i) => {
                          const cfg = typeConfig[item.type] || typeConfig.activity;
                          const Icon = cfg.icon;
                          return (
                            <div key={item.id} style={{
                              position: 'relative',
                              paddingBottom: i < day.items.length - 1 ? 16 : 0,
                            }}>
                              {/* Dot */}
                              <div style={{
                                position: 'absolute', left: -20, top: 4,
                                width: 14, height: 14, borderRadius: '50%',
                                background: cfg.color, border: '2px solid var(--bg-secondary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }} />
                              </div>

                              <div style={{
                                display: 'flex', gap: 12, alignItems: 'flex-start',
                                padding: '8px 12px',
                                borderRadius: 'var(--radius-md)',
                                background: 'var(--bg-tertiary)',
                              }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 44 }}>
                                  <span style={{ fontSize: 13, fontWeight: 600, color: cfg.color }}>{item.time}</span>
                                  <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
                                    {item.duration >= 60 ? `${Math.floor(item.duration / 60)}h${item.duration % 60 ? ` ${item.duration % 60}m` : ''}` : `${item.duration}m`}
                                  </span>
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <Icon size={14} style={{ color: cfg.color }} />
                                    <span style={{ fontWeight: 500, fontSize: 14 }}>{item.title}</span>
                                    <span className={`badge ${cfg.color === 'var(--brand)' ? 'badge-blue' : cfg.color === 'var(--purple)' ? 'badge-purple' : cfg.color === 'var(--teal)' ? 'badge-teal' : 'badge-yellow'}`}
                                      style={{ fontSize: 10, padding: '1px 6px' }}>
                                      {cfg.label}
                                    </span>
                                  </div>
                                  {item.notes && (
                                    <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                                      <StickyNote size={10} /> {item.notes}
                                    </p>
                                  )}
                                </div>
                                {item.cost > 0 && (
                                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                                    {sym}{item.cost.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ marginTop: 12, marginLeft: 24 }}
                        onClick={() => setShowAdd(day.id)}
                      >
                        <Plus size={14} /> Add activity
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {genError && (
        <div style={{
          margin: '0 0 12px', padding: '10px 14px', borderRadius: 'var(--radius-md)',
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          color: 'var(--danger)', fontSize: 13, display: 'flex', gap: 8, alignItems: 'center',
        }}>
          {genError}
          <button onClick={() => setGenError(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>✕</button>
        </div>
      )}

      {showConfirm && (
        <Modal
          title="Replace Itinerary?"
          onClose={() => setShowConfirm(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={runGenerate}>Replace</button>
            </>
          }
        >
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            This will replace your existing itinerary with a new AI-generated one for <strong>{activeTrip.destination}</strong>. This cannot be undone.
          </p>
        </Modal>
      )}

      {/* Add item modal */}
      {showAdd && (
        <Modal
          title="Add Activity"
          onClose={() => setShowAdd(null)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setShowAdd(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAdd}>Add</button>
            </>
          }
        >
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" placeholder="e.g. Visit Sensoji Temple" value={newItem.title}
              onChange={e => setNewItem(p => ({ ...p, title: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input className="form-input" type="time" value={newItem.time}
                onChange={e => setNewItem(p => ({ ...p, time: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Duration (min)</label>
              <input className="form-input" type="number" value={newItem.duration}
                onChange={e => setNewItem(p => ({ ...p, duration: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Cost ({sym})</label>
              <input className="form-input" type="number" placeholder="0" value={newItem.cost}
                onChange={e => setNewItem(p => ({ ...p, cost: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-input" value={newItem.type} onChange={e => setNewItem(p => ({ ...p, type: e.target.value }))}>
              <option value="activity">Activity</option>
              <option value="transport">Transport</option>
              <option value="accommodation">Accommodation</option>
              <option value="food">Food & Drink</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-input" placeholder="Any additional details..." value={newItem.notes}
              onChange={e => setNewItem(p => ({ ...p, notes: e.target.value }))} />
          </div>
        </Modal>
      )}
    </>
  );
}
