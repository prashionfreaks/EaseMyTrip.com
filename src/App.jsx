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
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import { Menu, Compass, LayoutDashboard, Vote, Wallet, Map, MoreHorizontal, MessageCircle } from 'lucide-react';
import './App.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setActiveTripId, trips, tripsLoaded, joinTripViaInvite, activeTrip } = useTrips();
  const { user, loading, isDemo } = useAuth();
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
        <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
          <Menu size={22} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #0ea5e9, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Compass size={15} color="white" />
          </div>
          <span className="logo-text">LetsWander</span>
        </div>
        {activeTrip && (
          <span style={{
            marginLeft: 'auto', fontSize: 12, fontWeight: 600,
            color: '#38bdf8', maxWidth: 120,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
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
            const isActive = currentPage === item.id;
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
          {/* More button — opens sidebar */}
          <button
            className="bottom-nav-btn"
            onClick={() => setSidebarOpen(true)}
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
    </div>
  );
}
