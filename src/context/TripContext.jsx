import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { sampleTrips, currentUser as demoUser } from '../data/sampleData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const TripContext = createContext(null);

function colorFromId(id) {
  const colors = ['#2563eb', '#7c3aed', '#0891b2', '#059669', '#d97706', '#dc2626', '#db2777'];
  let h = 0;
  for (let i = 0; i < id.length; i++) h = id.charCodeAt(i) + ((h << 5) - h);
  return colors[Math.abs(h) % colors.length];
}

function loadLocalTrips() {
  try {
    const s = localStorage.getItem('tripsync-trips');
    if (s) return JSON.parse(s);
  } catch { /* ignore */ }
  return sampleTrips;
}

export function TripProvider({ children }) {
  const [trips, setTrips] = useState([]);
  const [activeTripId, setActiveTripId] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [tripsLoaded, setTripsLoaded] = useState(false);
  const syncTimers = useRef({}); // debounce timers per trip

  // ── Demo mode: localStorage ──────────────────────────────────────────────
  useEffect(() => {
    if (isSupabaseConfigured) return;
    setTrips(loadLocalTrips());
    setTripsLoaded(true);
  }, []);

  useEffect(() => {
    if (isSupabaseConfigured || !tripsLoaded) return;
    try { localStorage.setItem('tripsync-trips', JSON.stringify(trips)); }
    catch { /* quota */ }
  }, [trips, tripsLoaded]);

  // ── Supabase mode: DB + Realtime ─────────────────────────────────────────
  const fetchTrips = useCallback(async (userId) => {
    try {
      const { data: memberRows, error: mErr } = await supabase
        .from('trip_members').select('trip_id').eq('user_id', userId);
      if (mErr) throw mErr;
      if (!memberRows?.length) { setTrips([]); setTripsLoaded(true); return; }

      const { data: rows, error: tErr } = await supabase
        .from('trips').select('id, data, updated_at')
        .in('id', memberRows.map(r => r.trip_id))
        .order('created_at', { ascending: false });
      if (tErr) throw tErr;

      setTrips((rows || []).map(r => ({ ...(r.data || {}), id: r.id })));
    } catch (err) {
      console.error('Failed to load trips:', err);
      setTrips([]);
    } finally {
      setTripsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) { setDbUser(user); await fetchTrips(user.id); }
      else setTripsLoaded(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null;
      setDbUser(user);
      if (user) { await fetchTrips(user.id); }
      else { setTrips([]); setActiveTripId(null); setTripsLoaded(true); }
    });

    init();
    return () => subscription.unsubscribe();
  }, [fetchTrips]);

  // Realtime: update local state when another user changes a shared trip
  useEffect(() => {
    if (!isSupabaseConfigured || !dbUser) return;
    const channel = supabase.channel('trips-rt')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'trips' }, payload => {
        setTrips(prev =>
          prev.map(t => t.id === payload.new.id
            ? { ...(payload.new.data || {}), id: payload.new.id }
            : t)
        );
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [dbUser]);

  // Debounced DB sync (avoids hammering Supabase on rapid updates like typing)
  const syncToDB = useCallback((trip) => {
    if (!isSupabaseConfigured) return;
    clearTimeout(syncTimers.current[trip.id]);
    syncTimers.current[trip.id] = setTimeout(async () => {
      const { id, ...data } = trip;
      await supabase.from('trips').update({
        name: trip.name,
        destination: trip.destination,
        status: trip.status,
        data,
        updated_at: new Date().toISOString(),
      }).eq('id', id);
    }, 800); // 800ms debounce
  }, []);

  // ── currentUser ──────────────────────────────────────────────────────────
  const currentUser = (isSupabaseConfigured && dbUser)
    ? {
        id: dbUser.id,
        name: dbUser.user_metadata?.full_name || dbUser.email?.split('@')[0] || 'User',
        email: dbUser.email,
        color: colorFromId(dbUser.id),
        role: 'organizer',
      }
    : demoUser;

  const activeTrip = trips.find(t => t.id === activeTripId) || null;

  // ── Core mutations ───────────────────────────────────────────────────────
  const updateTrip = useCallback((tripId, updater) => {
    setTrips(prev => {
      const next = prev.map(t => {
        if (t.id !== tripId) return t;
        return typeof updater === 'function' ? updater(t) : { ...t, ...updater };
      });
      const updated = next.find(t => t.id === tripId);
      if (updated) syncToDB(updated);
      return next;
    });
  }, [syncToDB]);

  const addTrip = useCallback(async (tripData) => {
    if (!isSupabaseConfigured || !dbUser) {
      // Demo mode — synchronous
      const newTrip = { ...tripData, id: String(Date.now()) };
      setTrips(prev => [...prev, newTrip]);
      setActiveTripId(newTrip.id);
      return;
    }

    // Supabase mode
    const creatorMember = {
      id: dbUser.id,
      name: dbUser.user_metadata?.full_name || dbUser.email?.split('@')[0] || 'User',
      email: dbUser.email,
      color: colorFromId(dbUser.id),
      role: 'organizer',
    };
    const fullTripData = {
      ...tripData,
      members: [creatorMember],
      polls: [], expenses: [], itinerary: [], routes: [],
      activity: [], contingencies: [], messages: [], photos: [],
      budget: { total: 0, spent: 0, currency: 'INR' },
      paidSettlements: [],
    };

    const { data: row, error } = await supabase
      .from('trips')
      .insert({ name: tripData.name, destination: tripData.destination, status: 'planning', data: fullTripData, created_by: dbUser.id })
      .select('id').single();

    if (error) { console.error('addTrip error:', error); return; }

    await supabase.from('trip_members').insert({ trip_id: row.id, user_id: dbUser.id, role: 'organizer', color: colorFromId(dbUser.id) });

    const newTrip = { ...fullTripData, id: row.id };
    setTrips(prev => [newTrip, ...prev]);
    setActiveTripId(row.id);
  }, [dbUser]);

  const removeTrip = useCallback(async (tripId) => {
    if (isSupabaseConfigured) {
      await supabase.from('trips').delete().eq('id', tripId);
    }
    setTrips(prev => prev.filter(t => t.id !== tripId));
    setActiveTripId(prev => prev === tripId ? null : prev);
  }, []);

  // ── Domain helpers (all use updateTrip) ──────────────────────────────────
  const vote = useCallback((tripId, pollId, optionId, userId) => {
    updateTrip(tripId, trip => ({
      ...trip,
      polls: trip.polls.map(p => {
        if (p.id !== pollId) return p;
        return {
          ...p,
          options: p.options.map(o => {
            if (o.id !== optionId) {
              if (p.type === 'single') return { ...o, votes: o.votes.filter(v => v !== userId) };
              return o;
            }
            const hasVoted = o.votes.includes(userId);
            return { ...o, votes: hasVoted ? o.votes.filter(v => v !== userId) : [...o.votes, userId] };
          }),
        };
      }),
    }));
  }, [updateTrip]);

  const addPoll = useCallback((tripId, poll) => {
    updateTrip(tripId, trip => ({ ...trip, polls: [...trip.polls, { ...poll, id: 'p' + Date.now(), status: 'active' }] }));
  }, [updateTrip]);

  const addExpense = useCallback((tripId, expense) => {
    updateTrip(tripId, trip => ({
      ...trip,
      expenses: [...trip.expenses, { ...expense, id: 'e' + Date.now() }],
      budget: { ...trip.budget, spent: trip.budget.spent + expense.amount },
    }));
  }, [updateTrip]);

  const addItineraryItem = useCallback((tripId, dayId, item) => {
    updateTrip(tripId, trip => ({
      ...trip,
      itinerary: trip.itinerary.map(day =>
        day.id === dayId ? { ...day, items: [...day.items, { ...item, id: 'it' + Date.now() }] } : day
      ),
    }));
  }, [updateTrip]);

  const addContingency = useCallback((tripId, contingency) => {
    updateTrip(tripId, trip => ({ ...trip, contingencies: [...trip.contingencies, { ...contingency, id: 'c' + Date.now() }] }));
  }, [updateTrip]);

  const sendMessage = useCallback((tripId, message) => {
    updateTrip(tripId, trip => ({
      ...trip,
      messages: [...(trip.messages || []), { ...message, id: 'm' + Date.now() }],
      chatLastReadAt: { ...(trip.chatLastReadAt || {}), [message.userId]: message.timestamp },
    }));
  }, [updateTrip]);

  const markChatRead = useCallback((tripId, userId) => {
    updateTrip(tripId, trip => ({
      ...trip,
      chatLastReadAt: { ...(trip.chatLastReadAt || {}), [userId]: new Date().toISOString() },
    }));
  }, [updateTrip]);

  const markSettlementPaid = useCallback((tripId, from, to) => {
    updateTrip(tripId, trip => ({
      ...trip,
      paidSettlements: [...(trip.paidSettlements || []), { from, to, paidAt: new Date().toISOString() }],
    }));
  }, [updateTrip]);

  const addPhoto = useCallback((tripId, photo) => {
    updateTrip(tripId, trip => ({ ...trip, photos: [...(trip.photos || []), { ...photo, id: 'ph' + Date.now() }] }));
  }, [updateTrip]);

  const deletePhoto = useCallback((tripId, photoId) => {
    updateTrip(tripId, trip => ({ ...trip, photos: (trip.photos || []).filter(p => p.id !== photoId) }));
  }, [updateTrip]);

  const joinTripViaInvite = useCallback(async (inviteCode) => {
    if (!isSupabaseConfigured || !dbUser) return null;
    try {
      const { data: tripId, error } = await supabase.rpc('accept_invite', { p_invite_code: inviteCode });
      if (error) { console.error('accept_invite error:', error); return null; }
      await fetchTrips(dbUser.id);
      return tripId;
    } catch (err) {
      console.error('joinTripViaInvite error:', err);
      return null;
    }
  }, [dbUser, fetchTrips]);

  return (
    <TripContext.Provider value={{
      trips, activeTrip, activeTripId, currentUser, tripsLoaded,
      setActiveTripId, updateTrip, addTrip, removeTrip,
      vote, addPoll, addExpense, addItineraryItem, addContingency, markSettlementPaid,
      sendMessage, markChatRead, addPhoto, deletePhoto, joinTripViaInvite,
    }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTrips must be used within TripProvider');
  return ctx;
}
