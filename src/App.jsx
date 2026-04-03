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
import { Menu, Compass } from 'lucide-react';
import './App.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setActiveTripId, trips, joinTripViaInvite } = useTrips();
  const { user, loading, isDemo, isRecovery } = useAuth();

  // Handle invite code in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviteCode = params.get('invite');
    if (!inviteCode) return;

    if (!user) {
      // Not logged in yet — save for after login
      sessionStorage.setItem('pendingInvite', inviteCode);
      return;
    }

    // Supabase mode: use the DB function to join
    if (joinTripViaInvite) {
      window.history.replaceState({}, '', window.location.pathname);
      joinTripViaInvite(inviteCode).then(tripId => {
        if (tripId) { setActiveTripId(tripId); setCurrentPage('dashboard'); }
      });
      return;
    }

    // Demo mode: match by derived code
    const matchingTrip = trips.find(trip => {
      const code = btoa(trip.id + '-tripsync').replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
      return code === inviteCode;
    });
    if (matchingTrip) {
      setActiveTripId(matchingTrip.id);
      setCurrentPage('dashboard');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [user, trips, setActiveTripId, joinTripViaInvite]);

  // After login, process any pending invite
  useEffect(() => {
    if (!user || !joinTripViaInvite) return;
    const pending = sessionStorage.getItem('pendingInvite');
    if (!pending) return;
    sessionStorage.removeItem('pendingInvite');
    joinTripViaInvite(pending).then(tripId => {
      if (tripId) { setActiveTripId(tripId); setCurrentPage('dashboard'); }
    });
  }, [user, joinTripViaInvite, setActiveTripId]);

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
        background: 'var(--bg-primary)',
        flexDirection: 'column', gap: 16,
      }}>
        <div style={{
          width: 48, height: 48,
          background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
          borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Compass size={26} color="white" />
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Loading TripSync…</p>
      </div>
    );
  }

  if (!isDemo && (!user || isRecovery)) {
    return <AuthPage />;
  }

  return (
    <div className="app-layout">
      {/* Mobile header */}
      <div className="mobile-header">
        <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
          <Menu size={22} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Compass size={15} color="white" />
          </div>
          <span className="logo-text">TripSync</span>
        </div>
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
    </div>
  );
}
