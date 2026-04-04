import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { sampleTrips, currentUser as demoUser } from '../data/sampleData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const TripContext = createContext(null);

/** Ensure we have a valid session; refreshes token or forces re-login */
async function ensureSession() {
  if (!isSupabaseConfigured) return true;
  try {
    // First check in-memory session
    const { data: { session } } = await supabase.auth.getSession();
    if (session) return true;
    // Session missing — try explicit refresh before giving up
    const { data: { session: refreshed } } = await supabase.auth.refreshSession();
    if (refreshed) return true;
    // Both failed — sign out (AuthContext will redirect to landing page)
    console.warn('Session expired, signing out');
    await supabase.auth.signOut();
    return false;
  } catch (err) {
    console.error('ensureSession error:', err);
    return true; // proceed anyway, let the API call fail with a clear error
  }
}

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
      if (!(await ensureSession())) return;
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

    try {
      // Supabase mode
      console.log('[addTrip] starting, dbUser:', dbUser.id);
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

      console.log('[addTrip] checking session...');
      if (!(await ensureSession())) { console.error('[addTrip] session check failed'); return; }
      console.log('[addTrip] session OK');

      const tripId = crypto.randomUUID();

      // Insert trip (no .select() to avoid SELECT RLS issue)
      console.log('[addTrip] inserting trip:', tripId);
      const { error: tripErr } = await supabase
        .from('trips')
        .insert({ id: tripId, name: tripData.name, destination: tripData.destination, status: 'planning', data: fullTripData, created_by: dbUser.id });

      if (tripErr) { console.error('[addTrip] insert error:', tripErr); alert('Failed to create trip: ' + tripErr.message); return; }
      console.log('[addTrip] trip inserted OK');

      // Insert trip member
      console.log('[addTrip] inserting member...');
      const { error: memberErr } = await supabase
        .from('trip_members')
        .insert({ trip_id: tripId, user_id: dbUser.id, role: 'organizer', color: colorFromId(dbUser.id) });

      if (memberErr) console.error('[addTrip] member error:', memberErr);
      else console.log('[addTrip] member inserted OK');

      const newTrip = { ...fullTripData, id: tripId };
      setTrips(prev => [newTrip, ...prev]);
      setActiveTripId(tripId);
      console.log('[addTrip] done, trip active:', tripId);
    } catch (err) {
      console.error('[addTrip] exception:', err);
      alert('Failed to create trip: ' + (err.message || err));
    }
  }, [dbUser]);

  const removeTrip = useCallback(async (tripId) => {
    if (isSupabaseConfigured) {
      if (!(await ensureSession())) return;
      // Delete trip_members first (FK constraint), then the trip
      await supabase.from('trip_members').delete().eq('trip_id', tripId);
      const { error } = await supabase.from('trips').delete().eq('id', tripId);
      if (error) console.error('removeTrip error:', error);
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
    console.log('[joinInvite] called, code:', inviteCode, 'dbUser:', dbUser?.id);
    if (!isSupabaseConfigured || !dbUser) { console.warn('[joinInvite] no supabase or dbUser'); return null; }
    try {
      if (!(await ensureSession())) { console.warn('[joinInvite] session check failed'); return null; }

      // Look up the invite
      console.log('[joinInvite] looking up invite code...');
      const { data: invite, error: invErr } = await supabase
        .from('trip_invites')
        .select('trip_id')
        .eq('invite_code', inviteCode)
        .single();

      if (invErr || !invite) {
        console.error('[joinInvite] invalid invite code:', invErr);
        alert('This invite link is invalid or has expired.');
        return null;
      }
      console.log('[joinInvite] found trip_id:', invite.trip_id);

      const tripId = invite.trip_id;

      // Check if already a member
      const { data: existing } = await supabase
        .from('trip_members')
        .select('id')
        .eq('trip_id', tripId)
        .eq('user_id', dbUser.id)
        .maybeSingle();

      if (!existing) {
        // Add to trip_members
        const memberColor = colorFromId(dbUser.id);
        const { error: memErr } = await supabase
          .from('trip_members')
          .insert({ trip_id: tripId, user_id: dbUser.id, role: 'member', color: memberColor });

        if (memErr) { console.error('join trip member error:', memErr); alert('Failed to join trip.'); return null; }

        // Add user to trip's data.members array
        const { data: tripRow } = await supabase.from('trips').select('data').eq('id', tripId).single();
        if (tripRow?.data) {
          const memberName = dbUser.user_metadata?.full_name || dbUser.email?.split('@')[0] || 'User';
          const updatedData = {
            ...tripRow.data,
            members: [...(tripRow.data.members || []), {
              id: dbUser.id, name: memberName, email: dbUser.email,
              color: memberColor, role: 'member',
            }],
          };
          await supabase.from('trips').update({ data: updatedData, updated_at: new Date().toISOString() }).eq('id', tripId);
        }
      }

      // Reload trips so the joined trip appears
      await fetchTrips(dbUser.id);
      return tripId;
    } catch (err) {
      console.error('joinTripViaInvite error:', err);
      alert('Failed to join trip. Please try again.');
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
