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
import { Menu, Compass } from 'lucide-react';
import './App.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setActiveTripId, trips, tripsLoaded, joinTripViaInvite } = useTrips();
  const { user, loading, isDemo } = useAuth();
  const [inviteProcessed, setInviteProcessed] = useState(false);

  // Handle invite code in URL — save to localStorage (survives OAuth redirects)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviteCode = params.get('invite');
    if (inviteCode) {
      console.log('[invite] saved invite code from URL:', inviteCode);
      localStorage.setItem('pendingInvite', inviteCode);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Process pending invite after user is logged in and trips context is ready
  useEffect(() => {
    if (!user || !tripsLoaded || inviteProcessed) return;
    const pending = localStorage.getItem('pendingInvite');
    if (!pending) return;

    console.log('[invite] processing pending invite:', pending, 'user:', user.id);
    localStorage.removeItem('pendingInvite');
    setInviteProcessed(true);

    if (joinTripViaInvite) {
      joinTripViaInvite(pending).then(tripId => {
        console.log('[invite] joinTripViaInvite result:', tripId);
        if (tripId) { setActiveTripId(tripId); setCurrentPage('dashboard'); }
        else { console.warn('[invite] join returned null — check console for errors'); }
      });
    } else {
      // Demo mode: match by derived code
      const matchingTrip = trips.find(trip => {
        const code = btoa(trip.id + '-tripsync').replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
        return code === pending;
      });
      if (matchingTrip) {
        setActiveTripId(matchingTrip.id);
        setCurrentPage('dashboard');
      }
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

  if (!user) {
    return <LandingPage />;
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
