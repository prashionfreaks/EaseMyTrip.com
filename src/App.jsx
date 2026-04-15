import { useState, useEffect } from 'react';
import { useTrips } from './context/TripContext';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Decisions from './pages/Decisions';
import Budget from './pages/Budget';
import Itinerary from './pages/Itinerary';
import Routes from './pages/Routes';
import ActivityFeed from './pages/ActivityFeed';
import Contingency from './pages/Contingency';
import CalendarPage from './pages/CalendarPage';
import ChatPage from './pages/ChatPage';
import Photos from './pages/Photos';
import About from './pages/About';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import { Compass, LayoutDashboard, Vote, Wallet, Map, MoreHorizontal, MessageCircle, LogOut, X as XIcon, Route as RouteIcon, Camera, Globe, Activity as ActivityIcon, CalendarRange, ShieldAlert } from 'lucide-react';
import './App.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountSheetOpen, setAccountSheetOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const { setActiveTripId, trips, tripsLoaded, joinTripViaInvite, activeTrip, currentUser } = useTrips();
  const { user, loading, isDemo, displayName, initials, signOut } = useAuth();
  const [inviteProcessed, setInviteProcessed] = useState(false);

  // Handle join link in URL — save trip ID to localStorage (survives OAuth redirects)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const joinTripId = params.get('join') || params.get('invite');
    if (joinTripId) {
      console.log('[join] saved trip ID from URL:', joinTripId);
      localStorage.setItem('pendingJoinTrip', joinTripId);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Process pending join after user is logged in and trips context is ready
  useEffect(() => {
    if (!user || !tripsLoaded || inviteProcessed) return;
    const pendingTripId = localStorage.getItem('pendingJoinTrip');
    if (!pendingTripId) return;

    console.log('[join] processing join for trip:', pendingTripId, 'user:', user.id);
    localStorage.removeItem('pendingJoinTrip');
    setInviteProcessed(true);

    if (joinTripViaInvite) {
      joinTripViaInvite(pendingTripId).then(tripId => {
        console.log('[join] result:', tripId);
        if (tripId) { setActiveTripId(tripId); setCurrentPage('dashboard'); }
      });
    } else {
      // Demo mode
      const match = trips.find(t => t.id === pendingTripId);
      if (match) { setActiveTripId(match.id); setCurrentPage('dashboard'); }
    }
  }, [user, tripsLoaded, trips, inviteProcessed, setActiveTripId, joinTripViaInvite]);

  function navigate(page, tripId) {
    setCurrentPage(page);
    if (tripId) {
      setActiveTripId(tripId);
    } else if (page === 'dashboard') {
      setActiveTripId(null); // return to trips grid
    }
    window.scrollTo(0, 0);
    setSidebarOpen(false);
  }

  function renderPage() {
    switch (currentPage) {
      case 'dashboard':   return <Dashboard onNavigate={navigate} />;
      case 'decisions':   return <Decisions />;
      case 'budget':      return <Budget />;
      case 'itinerary':   return <Itinerary />;
      case 'routes':      return <Routes />;
      case 'activity':    return <ActivityFeed />;
      case 'contingency': return <Contingency />;
      case 'calendar':    return <CalendarPage />;
      case 'chat':        return <ChatPage />;
      case 'photos':      return <Photos />;
      case 'about':       return <About />;
      default:            return <Dashboard onNavigate={navigate} />;
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        flexDirection: 'column', gap: 24,
        overflow: 'hidden',
      }}>
        {/* Animated rings */}
        <div style={{ position: 'relative', width: 90, height: 90 }}>
          <div style={{
            position: 'absolute', inset: 0,
            border: '3px solid rgba(99,102,241,0.15)',
            borderRadius: '50%',
            animation: 'loaderPulse 2s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', inset: 8,
            border: '3px solid transparent',
            borderTopColor: '#60a5fa', borderRightColor: '#a78bfa',
            borderRadius: '50%',
            animation: 'loaderSpin 1.2s linear infinite',
          }} />
          <div style={{
            position: 'absolute', inset: 20,
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px rgba(99,102,241,0.4)',
            animation: 'loaderBounce 2s ease-in-out infinite',
          }}>
            <Compass size={24} color="white" style={{ animation: 'loaderCompass 3s ease-in-out infinite' }} />
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontSize: 18, fontWeight: 700, letterSpacing: '-0.3px',
            background: 'linear-gradient(90deg, #60a5fa, #c084fc, #60a5fa)',
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            animation: 'loaderShimmer 2s ease-in-out infinite',
          }}>
            LetsWander
          </p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 6 }}>
            Getting your trips ready...
          </p>
        </div>

        <style>{`
          @keyframes loaderSpin { to { transform: rotate(360deg); } }
          @keyframes loaderPulse { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.15); opacity: 0.6; } }
          @keyframes loaderBounce { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
          @keyframes loaderCompass { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(20deg); } 75% { transform: rotate(-20deg); } }
          @keyframes loaderShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  // Bottom nav items — context-aware: show trip tabs when a trip is active
  const bottomNavItems = activeTrip
    ? [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Trips' },
        { id: 'decisions', icon: Vote, label: 'Polls', badge: activeTrip.polls?.filter(p => p.status === 'active').length || null },
        { id: 'budget', icon: Wallet, label: 'Budget' },
        { id: 'itinerary', icon: Map, label: 'Plan' },
        { id: 'chat', icon: MessageCircle, label: 'Chat' },
      ]
    : [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Trips' },
      ];

  return (
    <div className="app-layout">
      {/* Mobile top header */}
      <div className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #0ea5e9, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Compass size={15} color="white" />
          </div>
          {!activeTrip && <span className="logo-text">LetsWander</span>}
        </div>
        {activeTrip && (
          <span style={{
            flex: 1, minWidth: 0,
            fontSize: 15, fontWeight: 700,
            color: '#38bdf8',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            paddingLeft: 10,
          }}>
            {activeTrip.name}
          </span>
        )}
      </div>

      <Sidebar
        currentPage={currentPage}
        onNavigate={navigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main-content">
        {renderPage()}
      </main>

      {/* Mobile bottom navigation */}
      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          {bottomNavItems.map(item => {
            const Icon = item.icon;
            // When a trip is open at the dashboard, the chat tab renders by default —
            // highlight Chat in the bottom nav to match.
            const effectivePage = (activeTrip && currentPage === 'dashboard') ? 'chat' : currentPage;
            const isActive = effectivePage === item.id;
            return (
              <button
                key={item.id}
                className={`bottom-nav-btn ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.id)}
              >
                <div className="bnav-icon-wrap">
                  <div className="bnav-icon">
                    <Icon size={20} />
                  </div>
                  {item.badge > 0 && (
                    <span className="bottom-nav-badge">{item.badge}</span>
                  )}
                </div>
                {item.label}
              </button>
            );
          })}
          {/* More button — opens account sheet */}
          <button
            className="bottom-nav-btn"
            onClick={() => setAccountSheetOpen(true)}
          >
            <div className="bnav-icon-wrap">
              <div className="bnav-icon">
                <MoreHorizontal size={20} />
              </div>
            </div>
            More
          </button>
        </div>
      </nav>

      {/* Account sheet (mobile) */}
      {accountSheetOpen && (
        <>
          <div
            onClick={() => setAccountSheetOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 200,
            }}
          />
          <div style={{
            position: 'fixed', left: 0, right: 0,
            bottom: 'calc(56px + env(safe-area-inset-bottom))',
            background: 'var(--bg-primary)',
            borderRadius: '16px 16px 0 0',
            padding: '12px 16px 16px',
            zIndex: 201,
            boxShadow: '0 -8px 30px rgba(0,0,0,0.25)',
            maxHeight: '70dvh', overflowY: 'auto',
          }}>
            <div style={{ width: 40, height: 4, background: 'var(--border)', borderRadius: 2, margin: '0 auto 14px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 4px 14px', borderBottom: '1px solid var(--border)' }}>
              <div className="user-avatar" style={{
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                width: 40, height: 40, fontSize: 15,
              }}>{initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser?.email || 'Signed in'}
                </div>
              </div>
              <button
                onClick={() => setAccountSheetOpen(false)}
                style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'var(--bg-accent)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <XIcon size={16} />
              </button>
            </div>
            {/* Trip-scoped extra destinations */}
            {activeTrip && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, padding: '14px 0' }}>
                {[
                  { id: 'calendar', label: 'Calendar', Icon: CalendarRange },
                  { id: 'routes',   label: 'Routes',   Icon: RouteIcon },
                  { id: 'photos',   label: 'Photos',   Icon: Camera },
                  { id: 'about',    label: 'About',    Icon: Globe },
                  { id: 'activity', label: 'Activity', Icon: ActivityIcon },
                  { id: 'contingency', label: 'Plans', Icon: ShieldAlert },
                ].map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => { navigate(id); setAccountSheetOpen(false); }}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                      padding: '12px 8px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)', borderRadius: 12,
                      color: 'var(--text-primary)',
                      fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    <Icon size={20} color="var(--brand)" />
                    {label}
                  </button>
                ))}
              </div>
            )}

            {!isDemo && (
              <button
                onClick={async () => { setSigningOut(true); try { await signOut(); } catch (e) { console.error(e); setSigningOut(false); } }}
                disabled={signingOut}
                style={{
                  width: '100%', marginTop: activeTrip ? 4 : 14, padding: '12px 14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  borderRadius: 10, border: '1px solid rgba(248,113,113,0.3)',
                  background: 'rgba(248,113,113,0.1)', color: '#ef4444',
                  fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  opacity: signingOut ? 0.6 : 1,
                }}
              >
                <LogOut size={16} /> {signingOut ? 'Signing Out…' : 'Sign Out'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
