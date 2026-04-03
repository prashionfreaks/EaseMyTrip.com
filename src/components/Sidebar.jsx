import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Compass, LogOut, ChevronRight,
} from 'lucide-react';


const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export default function Sidebar({ currentPage, onNavigate, isOpen, onClose }) {
  const { activeTrip, trips } = useTrips();
  const { displayName, initials, signOut, isDemo } = useAuth();

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
              <Compass size={17} />
            </div>
            TripSync
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section-title">Navigation</div>
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => { onNavigate(item.id); onClose(); }}
              >
                <Icon className="nav-icon" />
                {item.label}
              </button>
            );
          })}

          {/* Trip list */}
          {trips.length > 0 && (
            <>
              <div className="nav-section-title" style={{ marginTop: 8 }}>Your Trips</div>
              {trips.map(trip => {
                const statusColor =
                  trip.status === 'confirmed' ? 'var(--success)' :
                  trip.status === 'voting'    ? 'var(--warning)' :
                  'var(--brand)';
                return (
                  <button
                    key={trip.id}
                    className={`nav-item ${activeTrip?.id === trip.id ? 'active' : ''}`}
                    onClick={() => { onNavigate('dashboard', trip.id); onClose(); }}
                    style={{ fontSize: 13 }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: statusColor }} />
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {trip.name}
                    </span>
                    {activeTrip?.id === trip.id && <ChevronRight size={13} style={{ flexShrink: 0, opacity: 0.5 }} />}
                  </button>
                );
              })}
            </>
          )}
        </nav>

        {/* User footer */}
        <div className="sidebar-user" style={{ flexDirection: 'column', gap: 0, padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
            <div className="user-avatar" style={{
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              width: 34, height: 34, fontSize: 14,
            }}>
              {initials}
            </div>
            <div className="user-info" style={{ flex: 1, minWidth: 0 }}>
              <div className="user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {displayName}
              </div>
              <div className="user-role">
                {activeTrip
                  ? (activeTrip.members.find(m => m.id === 'u1')?.role === 'organizer' ? 'Trip Organizer' : 'Member')
                  : 'No trip selected'}
              </div>
            </div>
            {!isDemo && (
              <button
                onClick={signOut}
                title="Sign out"
                style={{
                  padding: '5px', borderRadius: 6, border: 'none',
                  background: 'transparent', color: '#3d5a7a',
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  transition: 'all 0.15s',
                  flexShrink: 0,
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#f87171'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#3d5a7a'; }}
              >
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
