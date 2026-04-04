import { useState, useMemo } from 'react';
import { useTrips } from '../context/TripContext';
import {
  MessageCircle, Vote, Wallet, CalendarRange, Map,
  Route, Activity, ShieldAlert, MapPin, Calendar,
  UserPlus, Users, Clock, CheckCircle2, X, Globe, Camera, Trash2,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import ChatPage from '../pages/ChatPage';
import Decisions from '../pages/Decisions';
import Budget from '../pages/Budget';
import CalendarPage from '../pages/CalendarPage';
import Itinerary from '../pages/Itinerary';
import Routes from '../pages/Routes';
import ActivityFeed from '../pages/ActivityFeed';
import Contingency from '../pages/Contingency';
import About from '../pages/About';
import Photos from '../pages/Photos';

const statusConfig = {
  planning:  { label: 'Planning',  badge: 'badge-blue',   icon: Clock },
  voting:    { label: 'Voting',    badge: 'badge-yellow',  icon: Vote },
  confirmed: { label: 'Confirmed', badge: 'badge-green',  icon: CheckCircle2 },
};

const TABS = [
  { id: 'chat',      label: 'Chat',      icon: MessageCircle },
  { id: 'polls',     label: 'Polls',     icon: Vote },
  { id: 'budget',    label: 'Budget',    icon: Wallet },
  { id: 'calendar',  label: 'Calendar',  icon: CalendarRange },
  { id: 'itinerary', label: 'Itinerary', icon: Map },
  { id: 'routes',    label: 'Routes',    icon: Route },
  { id: 'photos',    label: 'Photos',    icon: Camera },
  { id: 'about',     label: 'About',     icon: Globe },
  { id: 'activity',  label: 'Activity',  icon: Activity },
  { id: 'plans',     label: 'Plans',     icon: ShieldAlert },
];

export default function TripDetail({ onInvite, defaultTab = 'chat' }) {
  const { activeTrip, setActiveTripId, removeTrip, currentUser } = useTrips();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [deleting, setDeleting] = useState(false);

  const unreadMessages = useMemo(() => {
    if (!activeTrip || !currentUser) return 0;
    const since = activeTrip.chatLastReadAt?.[currentUser.id];
    return (activeTrip.messages || []).filter(msg => {
      if (msg.userId === currentUser.id) return false;
      return !since || new Date(msg.timestamp) > new Date(since);
    }).length;
  }, [activeTrip, currentUser]);

  const activePolls = activeTrip?.polls.filter(p => p.status === 'active').length || 0;

  const badges = { chat: unreadMessages || null, polls: activePolls || null };

  if (!activeTrip) return null;

  const cfg = statusConfig[activeTrip.status] || statusConfig.planning;
  const StatusIcon = cfg.icon;

  function renderContent() {
    switch (activeTab) {
      case 'chat':      return <div className="trip-workspace-chat"><ChatPage /></div>;
      case 'polls':     return <Decisions />;
      case 'budget':    return <Budget />;
      case 'calendar':  return <CalendarPage />;
      case 'itinerary': return <Itinerary />;
      case 'routes':    return <Routes />;
      case 'photos':    return <Photos />;
      case 'about':     return <About />;
      case 'activity':  return <ActivityFeed />;
      case 'plans':     return <Contingency />;
      default:          return null;
    }
  }

  return (
    <div className="card trip-detail-card" style={{ marginBottom: 24 }}>
      {/* Cover + trip info */}
      <div style={{ position: 'relative', height: 150, overflow: 'hidden', borderRadius: '14px 14px 0 0' }}>
        <img
          src={activeTrip.coverImage}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.68))',
        }} />
        <div style={{
          position: 'absolute', bottom: 14, left: 20, right: 20,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: 21, fontWeight: 800, color: 'white', letterSpacing: '-0.3px' }}>
                {activeTrip.name}
              </h2>
              <span className={`badge ${cfg.badge}`} style={{ flexShrink: 0 }}>
                <StatusIcon size={11} /> {cfg.label}
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={12} /> {activeTrip.destination}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Calendar size={12} />
                {format(parseISO(activeTrip.startDate), 'MMM d')} – {format(parseISO(activeTrip.endDate), 'MMM d, yyyy')}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Users size={12} /> {activeTrip.members.length} traveler{activeTrip.members.length !== 1 ? 's' : ''}
              </span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <div className="avatar-group" style={{ marginRight: 4 }}>
              {activeTrip.members.slice(0, 4).map(m => (
                <div key={m.id} className="user-avatar" title={m.name}
                  style={{ background: m.color, width: 28, height: 28, fontSize: 11, border: '2px solid rgba(255,255,255,0.4)' }}>
                  {m.name[0]}
                </div>
              ))}
              {activeTrip.members.length > 4 && (
                <div className="user-avatar" style={{ background: 'rgba(255,255,255,0.25)', color: 'white', width: 28, height: 28, fontSize: 10, border: '2px solid rgba(255,255,255,0.4)' }}>
                  +{activeTrip.members.length - 4}
                </div>
              )}
            </div>
            <button
              className="btn btn-sm"
              onClick={onInvite}
              style={{ background: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', flexShrink: 0 }}
            >
              <UserPlus size={13} /> Invite
            </button>
            <button
              onClick={async () => {
                if (deleting) return;
                if (!window.confirm(`Delete "${activeTrip.name}"? This cannot be undone.`)) return;
                setDeleting(true);
                await removeTrip(activeTrip.id);
                setDeleting(false);
              }}
              title="Delete trip"
              disabled={deleting}
              style={{
                width: 30, height: 30, borderRadius: 8, border: 'none',
                background: deleting ? 'rgba(220,38,38,0.6)' : 'rgba(220,38,38,0.3)', backdropFilter: 'blur(8px)',
                color: 'white', cursor: deleting ? 'wait' : 'pointer', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {deleting ? <div className="spinner spinner-sm" /> : <Trash2 size={14} />}
            </button>
            <button
              onClick={() => setActiveTripId(null)}
              title="Close workspace"
              style={{
                width: 30, height: 30, borderRadius: 8, border: 'none',
                background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                color: 'white', cursor: 'pointer', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{
        display: 'flex', gap: 4, padding: '10px 16px 0',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        overflowX: 'auto', scrollbarWidth: 'none',
      }}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          const badge = badges[tab.id];
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px 10px',
                fontSize: 13, fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--brand)' : 'var(--text-secondary)',
                background: isActive ? 'var(--brand-light)' : 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--brand)' : '2px solid transparent',
                borderRadius: '10px 10px 0 0',
                cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'all 0.15s',
                flexShrink: 0,
              }}
              onMouseOver={e => { if (!isActive) { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}}
              onMouseOut={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
            >
              <Icon size={14} />
              {tab.label}
              {badge && (
                <span style={{
                  background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                  color: 'white', fontSize: 10, fontWeight: 700,
                  padding: '1px 6px', borderRadius: 999, lineHeight: 1.5,
                }}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div style={{ background: 'var(--bg-primary)', borderRadius: '0 0 14px 14px', overflow: 'hidden' }}>
        {renderContent()}
      </div>
    </div>
  );
}
