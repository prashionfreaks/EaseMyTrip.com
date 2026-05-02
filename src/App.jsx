import { useState, useEffect, useRef, lazy, Suspense, useCallback } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useTrips } from './context/TripContext';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import {
  Compass, LayoutDashboard, Vote, Wallet, Map, MoreHorizontal, MessageCircle,
  LogOut, X as XIcon, Route as RouteIcon, Camera, Globe,
  CalendarRange, ShieldAlert, Users,
} from 'lucide-react';
import './App.css';

// Lazy-load everything that isn't the default route
const PlanAndPolls = lazy(() => import('./pages/PlanAndPolls'));
const Budget       = lazy(() => import('./pages/Budget'));
const Itinerary    = lazy(() => import('./pages/Itinerary'));
const RoutesPage   = lazy(() => import('./pages/Routes'));
const Contingency  = lazy(() => import('./pages/Contingency'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const ChatPage     = lazy(() => import('./pages/ChatPage'));
const Photos       = lazy(() => import('./pages/Photos'));
const About        = lazy(() => import('./pages/About'));
const Members      = lazy(() => import('./pages/Members'));

// Map path → logical "page id" for bottom-nav highlighting.
// Keep in sync with the <Route> list below.
const PATH_TO_PAGE = {
  '/':            'dashboard',
  '/decisions':   'decisions',
  '/budget':      'budget',
  '/itinerary':   'itinerary',
  '/routes':      'routes',
  '/contingency': 'contingency',
  '/calendar':    'calendar',
  '/chat':        'chat',
  '/photos':      'photos',
  '/about':       'about',
  '/members':     'members',
};

function PageFallback() {
  return (
    <div style={{
      minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--text-tertiary)',
    }}>
      <div className="spinner spinner-dark" style={{ width: 22, height: 22 }} />
    </div>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountSheetOpen, setAccountSheetOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const { setActiveTripId, trips, tripsLoaded, joinTripViaInvite, activeTrip, currentUser } = useTrips();
  const { user, loading, isDemo, displayName, initials, signOut } = useAuth();
  // Idempotency flag for the join-via-invite handshake. Lives in a ref
  // because nothing ever renders from it — using state would force a
  // setState-in-effect after the join already happened.
  const inviteProcessedRef = useRef(false);

  const location = useLocation();
  const routerNavigate = useNavigate();
  const currentPage = PATH_TO_PAGE[location.pathname] || 'dashboard';

  // Handle join link in URL — save trip ID to localStorage (survives OAuth redirects)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const joinTripId = params.get('join') || params.get('invite');
    if (joinTripId) {
      localStorage.setItem('pendingJoinTrip', joinTripId);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Process pending join after user is logged in and trips context is ready
  useEffect(() => {
    if (!user || !tripsLoaded || inviteProcessedRef.current) return;
    const pendingTripId = localStorage.getItem('pendingJoinTrip');
    if (!pendingTripId) return;

    localStorage.removeItem('pendingJoinTrip');
    inviteProcessedRef.current = true;

    if (joinTripViaInvite) {
      joinTripViaInvite(pendingTripId).then(tripId => {
        if (tripId) { setActiveTripId(tripId); routerNavigate('/'); }
      });
    } else {
      const match = trips.find(t => t.id === pendingTripId);
      if (match) { setActiveTripId(match.id); routerNavigate('/'); }
    }
  }, [user, tripsLoaded, trips, setActiveTripId, joinTripViaInvite, routerNavigate]);

  const navigate = useCallback((page, tripId) => {
    if (tripId) setActiveTripId(tripId);
    else if (page === 'dashboard') setActiveTripId(null);
    const path = Object.keys(PATH_TO_PAGE).find(p => PATH_TO_PAGE[p] === page) || '/';
    routerNavigate(path);
    window.scrollTo(0, 0);
    setSidebarOpen(false);
  }, [routerNavigate, setActiveTripId]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #3a1f12 0%, #5a3a26 100%)',
        flexDirection: 'column', gap: 24,
        overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', width: 90, height: 90 }}>
          <div style={{
            position: 'absolute', inset: 0,
            border: '3px solid rgba(184, 134, 11, 0.15)',
            borderRadius: '50%',
            animation: 'loaderPulse 2s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', inset: 8,
            border: '3px solid transparent',
            borderTopColor: '#f5d7a8', borderRightColor: '#e9b87a',
            borderRadius: '50%',
            animation: 'loaderSpin 1.2s linear infinite',
          }} />
          <div style={{
            position: 'absolute', inset: 20,
            background: 'linear-gradient(135deg, #722f37, #b8860b)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px rgba(184, 134, 11, 0.45)',
            animation: 'loaderBounce 2s ease-in-out infinite',
          }}>
            <Compass size={24} color="#fdf6e3" style={{ animation: 'loaderCompass 3s ease-in-out infinite' }} />
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontSize: 18, fontWeight: 700, letterSpacing: '-0.3px',
            background: 'linear-gradient(90deg, #f5d7a8, #fbbf24, #f5d7a8)',
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            animation: 'loaderShimmer 2s ease-in-out infinite',
          }}>
            LetsWander
          </p>
          <p style={{ color: 'rgba(245, 215, 168, 0.7)', fontSize: 13, marginTop: 6 }}>
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
            background: 'linear-gradient(135deg, #722f37, #b8860b)',
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
            color: '#f5d7a8',
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
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/"            element={<Dashboard />} />
            <Route path="/decisions"   element={<PlanAndPolls />} />
            <Route path="/budget"      element={<Budget />} />
            <Route path="/itinerary"   element={<Itinerary />} />
            <Route path="/routes"      element={<RoutesPage />} />
            <Route path="/contingency" element={<Contingency />} />
            <Route path="/calendar"    element={<CalendarPage />} />
            <Route path="/chat"        element={<ChatPage />} />
            <Route path="/photos"      element={<Photos />} />
            <Route path="/about"       element={<About />} />
            <Route path="/members"     element={<Members />} />
            <Route path="*"            element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
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
            bottom: 'calc(60px + env(safe-area-inset-bottom))',
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
                background: 'linear-gradient(135deg, #722f37, #b8860b)',
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
            {/* Trip-scoped destinations — chunked into "Trip" and "Plan ahead"
                groups so the eye picks 1 of 4 per group instead of 1 of 6
                (Miller / Hick). Tile size bumps to 56px-min-height for Fitts. */}
            {activeTrip && (
              <>
                {[
                  {
                    label: 'Trip',
                    items: [
                      { id: 'about',    label: 'About',    Icon: Globe },
                      { id: 'members',  label: 'Members',  Icon: Users },
                      { id: 'photos',   label: 'Photos',   Icon: Camera },
                      { id: 'calendar', label: 'Calendar', Icon: CalendarRange },
                    ],
                  },
                  {
                    label: 'Plan ahead',
                    items: [
                      { id: 'routes',      label: 'Routes', Icon: RouteIcon },
                      { id: 'contingency', label: 'Plans',  Icon: ShieldAlert },
                    ],
                  },
                ].map(group => (
                  <div key={group.label} style={{ padding: '12px 0 4px' }}>
                    <p style={{
                      fontSize: 10, fontWeight: 800, color: 'var(--text-tertiary)',
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                      marginBottom: 8,
                    }}>{group.label}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                      {group.items.map(({ id, label, Icon }) => (
                        <button
                          key={id}
                          onClick={() => { navigate(id); setAccountSheetOpen(false); }}
                          style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                            padding: '12px 6px',
                            minHeight: 64,
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border)', borderRadius: 12,
                            color: 'var(--text-primary)',
                            fontSize: 11.5, fontWeight: 600, cursor: 'pointer',
                          }}
                        >
                          <Icon size={20} color="var(--maroon)" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </>
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
