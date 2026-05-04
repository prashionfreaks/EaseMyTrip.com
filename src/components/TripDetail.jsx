import { useState, useMemo, useEffect, useRef, lazy, Suspense } from 'react';
import { useTrips } from '../context/TripContext';
import {
  MessageCircle, Vote, Wallet, CalendarRange, Map,
  Route, ShieldAlert, MapPin, Calendar,
  UserPlus, Users, Clock, CheckCircle2, X, Globe, Camera, Trash2,
  MoreHorizontal,
} from 'lucide-react';

import { format, parseISO } from '../lib/date';
// ChatPage is the default tab — import it statically so the first tap on
// a trip card never has to wait on a lazy-chunk fetch (which was painting
// blank until the chunk arrived). All other tabs stay code-split.
import ChatPage      from '../pages/ChatPage';
const PlanAndPolls = lazy(() => import('../pages/PlanAndPolls'));
const Budget       = lazy(() => import('../pages/Budget'));
const CalendarPage = lazy(() => import('../pages/CalendarPage'));
const Itinerary    = lazy(() => import('../pages/Itinerary'));
const Routes       = lazy(() => import('../pages/Routes'));
const Contingency  = lazy(() => import('../pages/Contingency'));
const About        = lazy(() => import('../pages/About'));
const Photos       = lazy(() => import('../pages/Photos'));
const Members      = lazy(() => import('../pages/Members'));

function TabFallback() {
  return (
    <div style={{
      minHeight: 320,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 12,
      background: 'var(--bg-secondary)',
    }}>
      <div className="spinner spinner-dark" style={{ width: 28, height: 28 }} />
      <p style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>
        Opening trip…
      </p>
    </div>
  );
}

const statusConfig = {
  planning:  { label: 'Planning',  badge: 'badge-blue',   icon: Clock },
  voting:    { label: 'Voting',    badge: 'badge-yellow', icon: Vote },
  confirmed: { label: 'Confirmed', badge: 'badge-green',  icon: CheckCircle2 },
  completed: { label: 'Completed', badge: 'badge-gray',   icon: CheckCircle2 },
};

function effectiveTripStatus(trip) {
  try {
    if (trip?.endDate) {
      const end = parseISO(trip.endDate);
      const today = new Date();
      end.setHours(23, 59, 59, 999);
      if (end < today) return 'completed';
    }
  } catch { /* fall through */ }
  return trip?.status || 'planning';
}

const PRIMARY_TABS = [
  { id: 'chat',      label: 'Chat',      icon: MessageCircle },
  { id: 'about',     label: 'About',     icon: Globe },
  { id: 'budget',    label: 'Budget',    icon: Wallet },
  { id: 'itinerary', label: 'Itinerary', icon: Map },
];

const MORE_TABS = [
  { id: 'polls',     label: 'Polls',     icon: Vote },
  { id: 'calendar',  label: 'Calendar',  icon: CalendarRange },
  { id: 'routes',    label: 'Routes',    icon: Route },
  { id: 'photos',    label: 'Photos',    icon: Camera },
  { id: 'members',   label: 'Members',   icon: Users },
  { id: 'plans',     label: 'Plans',     icon: ShieldAlert },
];

const TABS = [...PRIMARY_TABS, ...MORE_TABS];

export default function TripDetail({ onInvite, defaultTab = 'chat' }) {
  const { activeTrip, setActiveTripId, removeTrip, currentUser } = useTrips();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [deleting, setDeleting] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);

  useEffect(() => {
    if (!moreOpen) return;
    const handler = (e) => { if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [moreOpen]);

  const unreadMessages = useMemo(() => {
    if (!activeTrip || !currentUser) return 0;
    const since = activeTrip.chatLastReadAt?.[currentUser.id];
    return (activeTrip.messages || []).filter(msg => {
      if (msg.userId === currentUser.id) return false;
      return !since || new Date(msg.timestamp) > new Date(since);
    }).length;
  }, [activeTrip, currentUser]);

  const activePolls = (activeTrip?.polls || []).filter(p => p.status === 'active').length || 0;

  const badges = { chat: unreadMessages || null, polls: activePolls || null };

  if (!activeTrip) return null;

  const cfg = statusConfig[effectiveTripStatus(activeTrip)] || statusConfig.planning;
  const StatusIcon = cfg.icon;

  function renderContent() {
    switch (activeTab) {
      case 'chat':      return <div className="trip-workspace-chat"><ChatPage /></div>;
      case 'polls':     return <PlanAndPolls />;
      case 'budget':    return <Budget />;
      case 'calendar':  return <CalendarPage />;
      case 'itinerary': return <Itinerary />;
      case 'routes':    return <Routes />;
      case 'photos':     return <Photos />;
      case 'about':      return <About />;
      case 'members':    return <Members />;
      case 'plans':     return <Contingency />;
      default:          return null;
    }
  }

  return (
    <>
      <style>{`
        /* ── Desktop: card layout ── */
        .trip-detail-card { margin-bottom: 24px; }

        /* Tab bar */
        .trip-tab-bar { scrollbar-width: none; }
        .trip-tab-bar::-webkit-scrollbar { display: none; }
        .trip-tab-btn {
          display: flex; align-items: center; gap: 5px;
          padding: 8px 13px 10px;
          font-size: 13px; font-weight: 500;
          color: var(--text-secondary);
          background: transparent; border: none;
          border-bottom: 2px solid transparent;
          border-radius: 10px 10px 0 0;
          cursor: pointer; white-space: nowrap;
          transition: all 0.15s; flex-shrink: 0;
          -webkit-tap-highlight-color: transparent;
          min-height: 44px;
        }
        .trip-tab-btn.active {
          color: var(--brand); font-weight: 700;
          background: var(--brand-light);
          border-bottom-color: var(--brand);
        }

        /* ── Mobile: full-screen takeover ── */
        @media (max-width: 768px) {
          .trip-detail-card {
            position: fixed !important;
            top: calc(56px + env(safe-area-inset-top, 0px));
            bottom: calc(60px + env(safe-area-inset-bottom, 0px));
            left: 0; right: 0;
            z-index: 50;
            border-radius: 0 !important;
            border: none !important;
            display: flex !important;
            flex-direction: column !important;
            overflow: hidden !important;
            margin-bottom: 0 !important;
          }

          /* Compact cover on mobile */
          .trip-cover-desktop { display: none !important; }
          .trip-cover-mobile  { display: flex !important; }

          /* Hide top tab bar on mobile — bottom nav handles navigation */
          .trip-tab-bar { display: none !important; }

          /* Content fills remaining space and scrolls */
          .trip-tab-content { flex: 1 !important; overflow-y: auto !important; overflow-x: hidden !important; -webkit-overflow-scrolling: touch; }

          /* Strip page-header/page-body padding inside workspace */
          .trip-tab-content .page-header { padding: 12px 14px 10px !important; }
          .trip-tab-content .page-header h1 { font-size: 17px !important; }
          .trip-tab-content .page-header p  { font-size: 12px !important; }
          .trip-tab-content .page-body { padding: 12px 14px !important; }
          .trip-tab-content .tab-nav { padding: 0 10px !important; }
          .trip-tab-content .tab-btn { padding: 9px 10px !important; font-size: 12px !important; }
        }

        @media (min-width: 769px) {
          .trip-cover-mobile { display: none !important; }
          .trip-cover-desktop { display: block !important; }
          .trip-tab-content { overflow: visible; }
          .trip-tab-btn .tab-label { display: inline; }
        }
      `}</style>

      <div className="card trip-detail-card">

        {/* ── Desktop cover (150px image) ── */}
        <div className="trip-cover-desktop" style={{ position: 'relative', height: 150, overflow: 'hidden', borderRadius: '14px 14px 0 0' }}>
          <img src={activeTrip.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.68))' }} />
          <div style={{ position: 'absolute', bottom: 14, left: 20, right: 20, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: 21, fontWeight: 800, color: 'white', letterSpacing: '-0.3px' }}>{activeTrip.name}</h2>
                <span className={`badge ${cfg.badge}`} style={{ flexShrink: 0 }}><StatusIcon size={11} /> {cfg.label}</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} /> {activeTrip.destination}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={12} />
                  {activeTrip.startDate ? format(parseISO(activeTrip.startDate), 'MMM d') : '?'} – {activeTrip.endDate ? format(parseISO(activeTrip.endDate), 'MMM d, yyyy') : '?'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={12} /> {(activeTrip.members || []).length} travelers</span>
              </p>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <div className="avatar-group" style={{ marginRight: 4 }}>
                {(activeTrip.members || []).slice(0, 4).map(m => (
                  <div key={m.id} className="user-avatar" title={m.name}
                    style={{ background: m.color, width: 28, height: 28, fontSize: 11, border: '2px solid rgba(255,255,255,0.4)' }}>
                    {m.name[0]}
                  </div>
                ))}
              </div>
              <button className="btn btn-sm" onClick={onInvite} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}>
                <UserPlus size={13} /> Invite
              </button>
              <button onClick={async () => { if (deleting) return; if (!window.confirm(`Delete "${activeTrip.name}"?`)) return; setDeleting(true); await removeTrip(activeTrip.id); setDeleting(false); }}
                title="Delete" disabled={deleting}
                style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: 'rgba(220,38,38,0.3)', backdropFilter: 'blur(8px)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {deleting ? <div className="spinner spinner-sm" /> : <Trash2 size={14} />}
              </button>
              <button onClick={() => setActiveTripId(null)} title="Close"
                style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile compact header bar ── */}
        <div className="trip-cover-mobile" style={{
          background: 'linear-gradient(135deg, #3a1f12 0%, #6b3e2c 100%)',
          padding: '10px 14px',
          alignItems: 'center', gap: 10,
          flexShrink: 0,
        }}>
          {/* Back */}
          <button onClick={() => setActiveTripId(null)}
            style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <X size={16} />
          </button>
          {/* Trip info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontWeight: 800, fontSize: 15, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activeTrip.name}</span>
              <span className={`badge ${cfg.badge}`} style={{ fontSize: 10, flexShrink: 0 }}>{cfg.label}</span>
            </div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 1 }}>
              <MapPin size={10} /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activeTrip.destination}</span>
            </p>
          </div>
          {/* Avatars */}
          <div className="avatar-group" style={{ flexShrink: 0 }}>
            {(activeTrip.members || []).slice(0, 3).map(m => (
              <div key={m.id} className="user-avatar" style={{ background: m.color, width: 26, height: 26, fontSize: 10, border: '2px solid rgba(255,255,255,0.2)' }}>{m.name[0]}</div>
            ))}
          </div>
          {/* Invite */}
          <button className="btn btn-sm" onClick={onInvite}
            style={{ background: 'rgba(184,134,11,0.28)', color: '#f5d7a8', border: '1px solid rgba(184,134,11,0.4)', flexShrink: 0, padding: '5px 10px' }}>
            <UserPlus size={13} />
          </button>
          {/* Delete trip */}
          <button
            onClick={async () => { if (deleting) return; if (!window.confirm(`Delete "${activeTrip.name}"?`)) return; setDeleting(true); await removeTrip(activeTrip.id); setDeleting(false); }}
            disabled={deleting}
            title="Delete trip"
            style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.18)', color: '#fca5a5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: deleting ? 'wait' : 'pointer' }}>
            {deleting ? <div className="spinner spinner-sm" /> : <Trash2 size={14} />}
          </button>
        </div>

        {/* ── Tab bar ── */}
        <div className="trip-tab-bar" style={{
          display: 'flex', gap: 0, padding: '0 12px',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0, position: 'relative',
        }}>
          {PRIMARY_TABS.map(tab => {
            const Icon = tab.icon;
            const badge = badges[tab.id];
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} className={`trip-tab-btn ${isActive ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={15} />
                  {badge > 0 && (
                    <span style={{ position: 'absolute', top: -5, right: -7, width: 14, height: 14, background: 'linear-gradient(135deg,#722f37,#b8860b)', color: 'white', fontSize: 8, fontWeight: 800, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid var(--bg-secondary)' }}>
                      {badge}
                    </span>
                  )}
                </div>
                <span className="tab-label">{tab.label}</span>
              </button>
            );
          })}

          {/* More dropdown */}
          <div ref={moreRef} style={{ position: 'relative', marginLeft: 'auto' }}>
            {(() => {
              const activeMore = MORE_TABS.find(t => t.id === activeTab);
              const Icon = activeMore ? activeMore.icon : MoreHorizontal;
              const isActive = !!activeMore;
              // Sum badges across MORE_TABS items so e.g. an active Polls
              // count still surfaces on the More button after Polls moved
              // out of the primary tabs.
              const moreBadge = MORE_TABS.reduce((sum, t) => sum + (badges[t.id] || 0), 0);
              return (
                <button className={`trip-tab-btn ${isActive ? 'active' : ''}`} onClick={() => setMoreOpen(o => !o)}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={15} />
                    {moreBadge > 0 && (
                      <span style={{ position: 'absolute', top: -5, right: -7, width: 14, height: 14, background: 'linear-gradient(135deg,#722f37,#b8860b)', color: 'white', fontSize: 8, fontWeight: 800, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid var(--bg-secondary)' }}>
                        {moreBadge}
                      </span>
                    )}
                  </div>
                  <span className="tab-label">{activeMore ? activeMore.label : 'More'}</span>
                </button>
              );
            })()}
            {moreOpen && (
              <div style={{
                position: 'absolute', top: '100%', right: 0,
                marginTop: 4, minWidth: 180,
                background: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                zIndex: 100, overflow: 'hidden',
              }}>
                {MORE_TABS.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  const badge = badges[tab.id];
                  return (
                    <button key={tab.id} onClick={() => { setActiveTab(tab.id); setMoreOpen(false); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        width: '100%', padding: '10px 14px',
                        background: isActive ? 'var(--brand-light)' : 'transparent',
                        color: isActive ? 'var(--brand)' : 'var(--text-primary)',
                        border: 'none', cursor: 'pointer',
                        fontSize: 13, fontWeight: isActive ? 700 : 500,
                        textAlign: 'left',
                      }}>
                      <Icon size={15} />
                      <span style={{ flex: 1 }}>{tab.label}</span>
                      {badge > 0 && (
                        <span style={{
                          minWidth: 18, height: 18, padding: '0 5px',
                          background: 'linear-gradient(135deg,#722f37,#b8860b)',
                          color: 'white', fontSize: 10, fontWeight: 800,
                          borderRadius: 999,
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Tab content ── */}
        <div className="trip-tab-content" style={{ background: 'var(--bg-primary)', borderRadius: '0 0 14px 14px' }}>
          <Suspense fallback={<TabFallback />}>{renderContent()}</Suspense>
        </div>
      </div>
    </>
  );
}
