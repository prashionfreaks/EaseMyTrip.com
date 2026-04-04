import { useState, useMemo, useEffect } from 'react';
import { useTrips } from '../context/TripContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import Modal from '../components/Modal';
import InviteModal from '../components/InviteModal';
import NotificationPanel from '../components/NotificationPanel';
import TripDetail from '../components/TripDetail';
import {
  Plus, MapPin, Calendar, Vote, Wallet,
  Clock, CheckCircle2, Trash2, Bell, Users, Globe, TrendingUp,
} from 'lucide-react';
import { getDestinationCurrency } from '../lib/itinerary';
import PlacesAutocomplete from '../components/PlacesAutocomplete';
import { getDestinationImage } from '../lib/destinationImages';
import { format, differenceInDays, parseISO } from 'date-fns';

function countOutstandingDues(trips, currentUserId) {
  let count = 0;
  trips.forEach(trip => {
    if (!trip.expenses?.length || !trip.members?.length) return;
    const paid = new Set((trip.paidSettlements || []).map(p => `${p.from}→${p.to}`));
    const bal = {};
    (trip.members || []).forEach(m => { bal[m.id] = 0; });
    trip.expenses.forEach(exp => {
      if (!exp.splitAmong?.length) return;
      const share = exp.amount / exp.splitAmong.length;
      bal[exp.paidBy] = (bal[exp.paidBy] || 0) + exp.amount;
      exp.splitAmong.forEach(uid => { bal[uid] = (bal[uid] || 0) - share; });
    });
    const debtors = [], creditors = [];
    Object.entries(bal).forEach(([uid, amt]) => {
      if (amt < -0.01) debtors.push({ uid, amount: -amt });
      else if (amt > 0.01) creditors.push({ uid, amount: amt });
    });
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const transfer = Math.min(debtors[i].amount, creditors[j].amount);
      if (transfer > 0.01) {
        const key = `${debtors[i].uid}→${creditors[j].uid}`;
        if (!paid.has(key) && (debtors[i].uid === currentUserId || creditors[j].uid === currentUserId)) count++;
      }
      debtors[i].amount -= transfer;
      creditors[j].amount -= transfer;
      if (debtors[i].amount < 0.01) i++;
      if (creditors[j].amount < 0.01) j++;
    }
  });
  return count;
}

const statusConfig = {
  planning:  { label: 'Planning',  badge: 'badge-blue',   icon: Clock },
  voting:    { label: 'Voting',    badge: 'badge-yellow',  icon: Vote },
  confirmed: { label: 'Confirmed', badge: 'badge-green',  icon: CheckCircle2 },
};

export default function Dashboard({ onNavigate }) {
  const { trips: allTrips, setActiveTripId, activeTrip, addTrip, removeTrip, currentUser, tripsLoaded } = useTrips();
  const trips = allTrips.filter(t => (t.members || []).some(m => m.id === currentUser?.id));
  const [showCreate, setShowCreate] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [newTrip, setNewTrip] = useState({ name: '', destination: '', startDate: '', endDate: '', budget: '', currency: 'INR' });
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [platformStats, setPlatformStats] = useState(null);
  const dueCount = useMemo(() => countOutstandingDues(trips, currentUser?.id), [trips, currentUser?.id]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.rpc('get_platform_stats').then(({ data }) => {
      if (data) setPlatformStats(data);
    });
  }, []);

  async function handleCreate() {
    if (!newTrip.name.trim() || !newTrip.destination.trim()) return;
    setCreating(true);
    await addTrip({
      name: newTrip.name.trim(),
      destination: newTrip.destination.trim(),
      coverImage: getDestinationImage(newTrip.destination.trim()),
      startDate: newTrip.startDate || '2026-06-01',
      endDate: newTrip.endDate || '2026-06-10',
      status: 'planning',
      members: [{ ...currentUser, role: 'organizer' }],
      budget: { total: newTrip.budget ? parseFloat(newTrip.budget) : 0, spent: 0, currency: newTrip.currency || 'INR' },
      polls: [], itinerary: [], expenses: [], routes: [], activity: [], contingencies: [], messages: [],
    });
    setCreating(false);
    setNewTrip({ name: '', destination: '', startDate: '', endDate: '', budget: '', currency: 'INR' });
    setShowCreate(false);
  }

  async function handleDelete(trip) {
    if (!window.confirm(`Delete "${trip.name}"? This cannot be undone.`)) return;
    setDeleting(trip.id);
    await removeTrip(trip.id);
    setDeleting(null);
  }

  return (
    <>
      <style>{`
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes tripPulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes tripFadeIn { from { opacity: 0; filter: blur(8px); } to { opacity: 1; filter: blur(0); } }
      `}</style>

      {/* Trip loading overlay */}
      {!tripsLoaded && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 16,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
            animation: 'tripPulse 1.5s ease-in-out infinite',
          }}>
            <Globe size={26} color="white" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Loading your trips...</p>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Hang tight, getting everything ready</p>
          </div>
        </div>
      )}

      <div style={{
        opacity: tripsLoaded ? 1 : 0.3,
        filter: tripsLoaded ? 'none' : 'blur(4px)',
        transition: 'opacity 0.4s, filter 0.4s',
        animation: tripsLoaded ? 'tripFadeIn 0.4s ease' : 'none',
      }}>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1>{activeTrip ? activeTrip.name : 'Your Trips'}</h1>
          <p>{activeTrip ? activeTrip.destination : `${trips.length} trip${trips.length !== 1 ? 's' : ''} planned`}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={() => setShowNotifications(true)}
            title="Payment dues"
            style={{
              position: 'relative',
              width: 36, height: 36, borderRadius: 9,
              border: '1px solid var(--border)',
              background: dueCount > 0 ? '#fef2f2' : 'var(--bg-secondary)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: dueCount > 0 ? '#dc2626' : 'var(--text-tertiary)',
              transition: 'all 0.15s',
            }}
          >
            <Bell size={16} />
            {dueCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: '#dc2626', color: 'white',
                fontSize: 10, fontWeight: 700,
                width: 17, height: 17, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid var(--bg-primary)',
              }}>
                {dueCount > 9 ? '9+' : dueCount}
              </span>
            )}
          </button>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={16} />
            New Trip
          </button>
        </div>
      </div>

      <div className="page-body">
        {dueCount > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 16px', marginBottom: 16, borderRadius: 12,
            background: 'linear-gradient(135deg, #fef2f2, #fff1f2)',
            border: '1px solid #fecaca',
            animation: 'slideDown 0.3s ease',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Bell size={18} style={{ color: '#dc2626' }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#dc2626' }}>
                You have {dueCount} pending payment{dueCount !== 1 ? 's' : ''}
              </p>
              <p style={{ fontSize: 12, color: '#ef4444', marginTop: 1 }}>
                Clear your dues to keep the group settled up.
              </p>
            </div>
            <button
              className="btn btn-sm"
              onClick={() => setShowNotifications(true)}
              style={{ background: '#dc2626', color: 'white', border: 'none', flexShrink: 0 }}
            >
              View Dues →
            </button>
          </div>
        )}

        {/* Active trip workspace */}
        {activeTrip && (
          <TripDetail onInvite={() => setShowInvite(true)} />
        )}

        {/* Trip cards — only shown when no workspace is open */}
        {!activeTrip && <div style={{ marginBottom: 8 }}>
          <div className="grid-3">
            {trips.map(trip => (
              <TripCard
                key={trip.id}
                trip={trip}
                isActive={activeTrip?.id === trip.id}
                onSelect={() => {
                if (activeTrip?.id === trip.id) { setActiveTripId(null); return; }
                setActiveTripId(trip.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
                onDelete={() => handleDelete(trip)}
                isDeleting={deleting === trip.id}
              />
            ))}

            {/* Create trip card */}
            <button
              onClick={() => setShowCreate(true)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                minHeight: 220, cursor: 'pointer',
                border: '2px dashed #bae6fd', borderRadius: 18,
                background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                transition: 'all 0.2s', textAlign: 'center',
              }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = 'var(--brand)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #e0f2fe, #bae6fd)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-brand)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = '#bae6fd';
                e.currentTarget.style.background = 'linear-gradient(135deg, #f0f9ff, #e0f2fe)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
                boxShadow: '0 4px 14px rgba(14,165,233,0.35)',
              }}>
                <Plus size={24} color="white" />
              </div>
              <span style={{ fontWeight: 800, color: '#0284c7', fontSize: 15 }}>Plan New Trip</span>
              <span style={{ fontSize: 12, color: '#38bdf8', marginTop: 4 }}>✈️ Start an adventure</span>
            </button>
          </div>

          {trips.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px 20px', background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', borderRadius: 16, border: '1px solid #bae6fd' }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0c4a6e', marginBottom: 6 }}>Start your adventure</h3>
              <p style={{ fontSize: 13, color: '#0369a1' }}>Create your first trip and invite your crew to plan together.</p>
            </div>
          )}
          {trips.length > 0 && (
            <div style={{
              gridColumn: '1 / -1', textAlign: 'center', marginTop: 4,
              padding: '12px', background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
              borderRadius: 12, border: '1px solid #bae6fd',
            }}>
              <p style={{ fontSize: 13, color: '#0284c7', fontWeight: 600 }}>
                ✈️ &nbsp;Click a trip card to open its workspace
              </p>
            </div>
          )}

          {/* ── App Insights (dark theme) ── */}
          <div style={{
            marginTop: 28, borderRadius: 20, overflow: 'hidden',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
            padding: '32px 24px', position: 'relative',
          }}>
            {/* Decorative glow */}
            <div style={{
              position: 'absolute', top: -60, right: -60, width: 200, height: 200,
              background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
              borderRadius: '50%', pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', bottom: -40, left: -40, width: 160, height: 160,
              background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)',
              borderRadius: '50%', pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <TrendingUp size={18} color="white" />
                </div>
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 800, color: 'white', letterSpacing: '-0.3px' }}>
                    LetsWander Insights
                  </h2>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>Live platform activity</p>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
                {[
                  { value: platformStats?.trips || 1247, label: 'Trips Created', icon: Globe, color: '#60a5fa', glow: 'rgba(96,165,250,0.2)' },
                  { value: platformStats?.users || 3891, label: 'Wanderers', icon: Users, color: '#34d399', glow: 'rgba(52,211,153,0.2)' },
                  { value: (platformStats?.topDestinations || [{ destination: 'Goa' }])[0]?.destination || 'Goa', label: '#1 Destination', icon: MapPin, color: '#fbbf24', glow: 'rgba(251,191,36,0.2)', isText: true },
                ].map((s, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: '18px 14px',
                    border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.2s',
                  }}
                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = `${s.color}44`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <s.icon size={18} style={{ color: s.color, marginBottom: 8 }} />
                    <div style={{
                      fontSize: s.isText ? 20 : 28, fontWeight: 900, color: 'white',
                      textShadow: `0 0 20px ${s.glow}`,
                    }}>
                      {s.isText ? s.value : s.value.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)', marginTop: 3 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Activity ticker */}
              <div style={{
                display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24,
              }}>
                {[
                  { stat: '12,400+', label: 'Messages', color: '#818cf8' },
                  { stat: '8,720', label: 'Polls voted', color: '#34d399' },
                  { stat: '₹2.4Cr', label: 'Tracked', color: '#fbbf24' },
                  { stat: '94%', label: 'Settled up', color: '#f472b6' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 14px', borderRadius: 999,
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: item.color }}>{item.stat}</span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Feature highlights */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14,
              }}>
                <div style={{ height: 1, flex: 1, background: 'rgba(255,255,255,0.08)' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  What wanderers love
                </span>
                <div style={{ height: 1, flex: 1, background: 'rgba(255,255,255,0.08)' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>
                {[
                  { emoji: '🗳️', title: 'Group Polls', desc: 'Vote and decide — no more group chat chaos' },
                  { emoji: '💰', title: 'Split Expenses', desc: 'Track every rupee, know who owes what' },
                  { emoji: '📋', title: 'Itinerary', desc: 'Day-by-day plans, edited by everyone' },
                  { emoji: '💬', title: 'Trip Chat', desc: 'All trip talk, one place' },
                  { emoji: '🚗', title: 'Route Planner', desc: 'Flights, trains, drives — compared instantly' },
                  { emoji: '📸', title: 'Photo Wall', desc: 'Shared album for every memory' },
                ].map((f, i) => (
                  <div key={i} style={{
                    padding: '14px 14px', borderRadius: 12,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    transition: 'all 0.2s', cursor: 'default',
                  }}
                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{f.emoji}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 3 }}>{f.title}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>}
      </div>

      </div>{/* end blur wrapper */}

      {/* Create trip modal */}
      {showCreate && (
        <Modal
          title="Create a New Trip"
          onClose={() => setShowCreate(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setShowCreate(false)} disabled={creating}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={handleCreate}
                disabled={!newTrip.name.trim() || !newTrip.destination.trim() || creating}
              >
                {creating ? <><div className="spinner spinner-sm" /> Creating...</> : <><Plus size={14} /> Create Trip</>}
              </button>
            </>
          }
        >
          <div className="form-group">
            <label className="form-label">Trip Name *</label>
            <input className="form-input" placeholder="e.g. Japan Adventure" value={newTrip.name}
              onChange={e => setNewTrip(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Destination *</label>
            <PlacesAutocomplete
              placeholder="Search a city..."
              value={newTrip.destination}
              onChange={val => setNewTrip(p => ({ ...p, destination: val }))}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input className="form-input" type="date" value={newTrip.startDate}
                onChange={e => setNewTrip(p => ({ ...p, startDate: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input className="form-input" type="date" value={newTrip.endDate}
                min={newTrip.startDate}
                onChange={e => setNewTrip(p => ({ ...p, endDate: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Total Budget</label>
              <input className="form-input" type="number" min="0" placeholder="e.g. 50000"
                value={newTrip.budget}
                onChange={e => setNewTrip(p => ({ ...p, budget: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Currency</label>
              <select className="form-input" value={newTrip.currency}
                onChange={e => setNewTrip(p => ({ ...p, currency: e.target.value }))}>
                <option value="INR">INR ₹</option>
                <option value="USD">USD $</option>
                <option value="EUR">EUR €</option>
                <option value="GBP">GBP £</option>
                <option value="JPY">JPY ¥</option>
                <option value="SGD">SGD S$</option>
                <option value="AED">AED د.إ</option>
              </select>
            </div>
          </div>
        </Modal>
      )}

      {showInvite && activeTrip && (
        <InviteModal onClose={() => setShowInvite(false)} />
      )}

      {showNotifications && (
        <NotificationPanel onClose={() => setShowNotifications(false)} />
      )}
    </>
  );
}

function TripCard({ trip, isActive, onSelect, onDelete, isDeleting }) {
  const cfg = statusConfig[trip.status] || statusConfig.planning;
  const StatusIcon = cfg.icon;
  const daysUntil = trip.startDate ? differenceInDays(parseISO(trip.startDate), new Date()) : null;
  const totalSpent = (trip.expenses || []).reduce((sum, e) => sum + e.amount, 0);
  const budgetPct = trip.budget.total > 0 ? Math.min(100, (totalSpent / trip.budget.total) * 100) : 0;

  return (
    <div
      className="trip-card-wrap"
      onClick={onSelect}
      style={{
        cursor: 'pointer',
        borderRadius: 18,
        border: isActive ? '2px solid var(--brand)' : '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        overflow: 'hidden',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease',
        boxShadow: isActive ? '0 0 0 4px rgba(14,165,233,0.15), var(--shadow-md)' : 'var(--shadow-sm)',
        position: 'relative',
      }}
      onMouseOver={e => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = isActive
          ? '0 0 0 4px rgba(14,165,233,0.2), var(--shadow-card-hover)'
          : 'var(--shadow-card-hover)';
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = isActive
          ? '0 0 0 4px rgba(14,165,233,0.15), var(--shadow-md)'
          : 'var(--shadow-sm)';
      }}
    >
      {/* Cover */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src={trip.coverImage?.includes('photo-1488646953014') ? getDestinationImage(trip.destination) : (trip.coverImage || getDestinationImage(trip.destination))}
          alt=""
          style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.55))' }} />

        {/* Status badge */}
        <span className={`badge ${cfg.badge}`} style={{ position: 'absolute', top: 10, right: 10, backdropFilter: 'blur(4px)' }}>
          <StatusIcon size={10} /> {cfg.label}
        </span>

        {/* Active pill */}
        {isActive && (
          <div style={{
            position: 'absolute', top: 10, left: 10,
            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            color: 'white', fontSize: 9, fontWeight: 800,
            padding: '3px 9px', borderRadius: 999, letterSpacing: '0.5px',
            boxShadow: '0 2px 8px rgba(14,165,233,0.4)',
          }}>
            OPEN ✦
          </div>
        )}

        {/* Bottom text overlay */}
        <div style={{ position: 'absolute', bottom: 10, left: 14, right: 14 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: 'white', letterSpacing: '-0.2px', marginBottom: 2, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
            {trip.name}
          </h3>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={10} /> {trip.destination}
          </p>
        </div>

        {/* Delete btn */}
        <button
          onClick={e => { e.stopPropagation(); onDelete(); }}
          title="Delete trip"
          disabled={isDeleting}
          style={{
            position: 'absolute', bottom: 10, right: 10,
            width: 26, height: 26, borderRadius: 8,
            background: isDeleting ? 'rgba(220,38,38,0.7)' : 'rgba(0,0,0,0.45)', border: 'none',
            color: 'white', cursor: isDeleting ? 'wait' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: isDeleting ? 1 : 0, transition: 'opacity 0.15s',
          }}
          className="trip-delete-btn"
        >
          {isDeleting ? <div className="spinner spinner-sm" /> : <Trash2 size={12} />}
        </button>
      </div>

      {/* Card body */}
      <div style={{ padding: '12px 14px 14px' }}>
        <p style={{ fontSize: 11.5, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
          <Calendar size={11} />
          {trip.startDate ? format(parseISO(trip.startDate), 'MMM d') : '?'} – {trip.endDate ? format(parseISO(trip.endDate), 'MMM d, yyyy') : '?'}
          {daysUntil != null && daysUntil > 0 && (
            <span style={{ marginLeft: 'auto', background: 'var(--brand-light)', color: 'var(--brand)', fontWeight: 700, fontSize: 10, padding: '1px 7px', borderRadius: 999 }}>
              {daysUntil}d away
            </span>
          )}
          {daysUntil === 0 && (
            <span style={{ marginLeft: 'auto', color: 'var(--warning)', fontWeight: 700, fontSize: 10 }}>Today!</span>
          )}
          {daysUntil < 0 && (
            <span style={{ marginLeft: 'auto', color: 'var(--text-tertiary)', fontSize: 10 }}>Completed</span>
          )}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="avatar-group">
            {(trip.members || []).slice(0, 4).map(m => (
              <div key={m.id} className="user-avatar" title={m.name}
                style={{ background: m.color, width: 24, height: 24, fontSize: 10, border: '2px solid white' }}>
                {m.name[0]}
              </div>
            ))}
            {(trip.members || []).length > 4 && (
              <div className="user-avatar" style={{ background: '#e2eaf4', color: '#4a607a', width: 24, height: 24, fontSize: 10, border: '2px solid white' }}>
                +{(trip.members || []).length - 4}
              </div>
            )}
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600 }}>
            {(() => { const s = getDestinationCurrency(trip.destination) === 'INR' ? '₹' : '$'; const spent = (trip.expenses || []).reduce((sum, e) => sum + e.amount, 0); return `${s}${spent.toLocaleString()} / ${s}${trip.budget.total.toLocaleString()}`; })()}
          </span>
        </div>

        <div className="progress-bar" style={{ marginTop: 10 }}>
          <div className="progress-fill" style={{
            width: `${budgetPct}%`,
            background: budgetPct > 85
              ? 'linear-gradient(90deg, #ef4444, #dc2626)'
              : budgetPct > 55
              ? 'linear-gradient(90deg, #f59e0b, #d97706)'
              : 'linear-gradient(90deg, #10b981, #059669)',
          }} />
        </div>
      </div>

      <style>{`.trip-delete-btn { opacity: 0 !important; } .trip-card-wrap:hover .trip-delete-btn { opacity: 1 !important; }`}</style>
    </div>
  );
}
