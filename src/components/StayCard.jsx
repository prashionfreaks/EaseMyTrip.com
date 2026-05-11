import { useState } from 'react';
import { BedDouble, CheckCircle2, Pencil, X, MapPin, Sparkles, Star } from 'lucide-react';
import { toast } from '../lib/toast';

/* Optional accommodation card. When confirmed, Itinerary's Suggest-Itinerary
   passes stay.area to the AI so the model plans around it, and applyStay()
   injects a day-1 check-in event. Top picks come from destinationInfo.stays
   for the trip's destination (may be empty for long-tail destinations). */
export default function StayCard({ trip, stays, onSave }) {
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
    <div className="card">
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
              paddingRight: 76,
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
                  Optional — but confirming your stay lets Suggest Itinerary plan around your area and adds a day-1 check-in for you.
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
