import { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { sampleTrips, currentUser as demoUser } from '../data/sampleData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { toast } from '../lib/toast';

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

/** Coerce to a finite number, falling back to `fallback` for null/undefined/NaN/strings. */
function num(v, fallback = 0) {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Single ingest validator for trip data — runs on every path that pulls a
 * trip into local state (initial fetch, realtime UPDATE, cached restore,
 * demo-mode localStorage). Coerces the JSON blob's untyped numerics and
 * fills missing arrays/objects so downstream code can trust the shape and
 * stop sprinkling Number(x) || 0 everywhere.
 */
function parseTrip(trip) {
  if (!trip || typeof trip !== 'object') return trip;
  const t = { ...trip };

  // _updatedAt is the optimistic-concurrency cursor — the server's
  // updated_at when we last saw this trip. flushSync uses it as the
  // .eq() guard so a stale write can't overwrite a fresher edit. Stored
  // as metadata on the trip; stripped before writing back to the data jsonb.
  if (trip._updatedAt) t._updatedAt = String(trip._updatedAt);

  const arrayFields = ['members', 'polls', 'expenses', 'itinerary', 'routes',
    'activity', 'contingencies', 'messages', 'photos', 'paidSettlements', 'checklist',
    'dueReminders'];
  for (const f of arrayFields) {
    if (!Array.isArray(t[f])) t[f] = [];
  }

  // Budget: total/spent are read with .toLocaleString() and divided by — must be numeric.
  const rawBudget = t.budget && typeof t.budget === 'object' ? t.budget : {};
  t.budget = {
    total: num(rawBudget.total),
    spent: num(rawBudget.spent),
    currency: typeof rawBudget.currency === 'string' && rawBudget.currency ? rawBudget.currency : 'INR',
  };

  // Expenses: amount drives all balance math; splitAmong must be an array.
  t.expenses = t.expenses.map(e => ({
    ...e,
    amount: num(e?.amount),
    splitAmong: Array.isArray(e?.splitAmong) ? e.splitAmong : [],
  }));

  // Settlement payments — amount feeds Budget's per-member paid totals.
  // amount==null is a load-bearing sentinel for legacy "marked paid without
  // an amount" rows (Budget.jsx treats those as full settlements), so we
  // pass null through and only coerce real values.
  t.paidSettlements = t.paidSettlements.map(p => ({
    ...p,
    amount: p?.amount == null ? null : num(p.amount),
  }));

  // Itinerary items: cost and duration are aggregated per-day.
  t.itinerary = t.itinerary.map(day => ({
    ...day,
    items: Array.isArray(day?.items) ? day.items.map(it => ({
      ...it,
      cost: num(it?.cost),
      duration: num(it?.duration),
    })) : [],
  }));

  // Polls: votes is an array of member ids; options must be an array.
  t.polls = t.polls.map(p => ({
    ...p,
    options: Array.isArray(p?.options) ? p.options.map(o => ({
      ...o,
      votes: Array.isArray(o?.votes) ? o.votes : [],
    })) : [],
  }));

  return t;
}

function loadLocalTrips() {
  try {
    const s = localStorage.getItem('tripsync-trips');
    if (s) return JSON.parse(s).map(parseTrip);
  } catch { /* ignore */ }
  return sampleTrips;
}

const TRIPS_CACHE_KEY = 'tripsync-trips-cache-v1';

function loadCachedTrips(userId) {
  try {
    const s = localStorage.getItem(TRIPS_CACHE_KEY);
    if (!s) return null;
    const parsed = JSON.parse(s);
    if (parsed.userId !== userId || !Array.isArray(parsed.trips)) return null;
    return parsed.trips.map(parseTrip);
  } catch { return null; }
}

function saveCachedTrips(userId, trips) {
  try {
    localStorage.setItem(TRIPS_CACHE_KEY, JSON.stringify({ userId, trips, savedAt: Date.now() }));
  } catch { /* quota */ }
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

  // Debounced so typing / rapid updates don't re-serialize the whole trips array
  // on every keystroke.
  useEffect(() => {
    if (isSupabaseConfigured || !tripsLoaded) return;
    const handle = setTimeout(() => {
      try { localStorage.setItem('tripsync-trips', JSON.stringify(trips)); }
      catch { /* quota */ }
    }, 400);
    return () => clearTimeout(handle);
  }, [trips, tripsLoaded]);

  // Supabase mode: keep trips cache in sync with local state
  useEffect(() => {
    if (!isSupabaseConfigured || !tripsLoaded || !dbUser) return;
    saveCachedTrips(dbUser.id, trips);
  }, [trips, tripsLoaded, dbUser]);

  // ── Supabase mode: DB + Realtime ─────────────────────────────────────────
  const fetchTrips = useCallback(async (userId) => {
    // Hard 8 s timeout so a hung Supabase request can never freeze the
    // dashboard in its skeleton state. The user gets cached trips (if any)
    // and a clear path forward.
    const timeoutMs = 8000;
    const timeoutSignal = new AbortController();
    const timer = setTimeout(() => timeoutSignal.abort(), timeoutMs);
    try {
      const { data: rows, error } = await supabase
        .from('trip_members')
        .select('trips!inner(id, data, updated_at, created_at)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false, foreignTable: 'trips' })
        .abortSignal(timeoutSignal.signal);
      if (error) throw error;

      const fetched = (rows || [])
        .map(r => r.trips)
        .filter(Boolean)
        .map(t => parseTrip({ ...(t.data || {}), id: t.id, _updatedAt: t.updated_at }));
      setTrips(fetched);
      saveCachedTrips(userId, fetched);
    } catch (err) {
      if (err?.name === 'AbortError') {
        console.warn('[fetchTrips] timed out — keeping cached trips');
      } else {
        console.error('[fetchTrips] FAILED:', err);
      }
      // Keep any cached trips already in state rather than wiping to []
    } finally {
      clearTimeout(timer);
      setTripsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let initialLoadDone = false;
    let cancelled = false;

    // Hydrate from cache IMMEDIATELY using stored session user id so trips
    // appear before Supabase auth/network completes.
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (cancelled) return;
        const userId = session?.user?.id;
        if (userId) {
          const cached = loadCachedTrips(userId);
          if (cached?.length) {
            setTrips(cached);
            setTripsLoaded(true);
          }
        }
      } catch { /* ignore */ }
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null;
      setDbUser(user);
      if (user) { await fetchTrips(user.id); }
      else { setTrips([]); setActiveTripId(null); setTripsLoaded(true); localStorage.removeItem(TRIPS_CACHE_KEY); }
      initialLoadDone = true;
    });

    // Fallback: if onAuthStateChange doesn't fire within 2s, load manually
    const fallback = setTimeout(async () => {
      if (initialLoadDone) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (user) { setDbUser(user); await fetchTrips(user.id); }
      else setTripsLoaded(true);
    }, 2000);

    return () => { cancelled = true; subscription.unsubscribe(); clearTimeout(fallback); };
  }, [fetchTrips]);

  // Track which trips have pending local changes (not yet synced to DB)
  const pendingSync = useRef({});

  // Realtime: update local state when another user changes a shared trip
  // Skip if we have a pending local sync (our data is newer)
  useEffect(() => {
    if (!isSupabaseConfigured || !dbUser) return;
    const channel = supabase.channel('trips-rt')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'trips' }, payload => {
        const tripId = payload.new.id;
        // Don't overwrite local changes that haven't synced yet
        if (pendingSync.current[tripId]) {
          console.log('[realtime] skipping update for', tripId, '(pending local sync)');
          return;
        }
        // SAFETY: reject empty/null data payloads — they would wipe local state
        const incoming = payload.new.data;
        if (!incoming || (!incoming.name && !incoming.destination && !incoming.members)) {
          console.warn('[realtime] BLOCKED — incoming data looks empty, ignoring:', tripId);
          return;
        }
        setTrips(prev =>
          prev.map(t => t.id === tripId
            ? parseTrip({ ...incoming, id: tripId, _updatedAt: payload.new.updated_at })
            : t)
        );
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [dbUser]);

  // Reminder-toast effect lives below `currentUser` so it can read its id —
  // see the block right after `activeTrip`.

  // Most recent in-flight trip payload per id, used by the flush handler.
  const pendingPayload = useRef({});

  async function flushSync(tripId) {
    const payload = pendingPayload.current[tripId];
    if (!payload) return;
    clearTimeout(syncTimers.current[tripId]);
    pendingPayload.current[tripId] = null;
    if (!(await ensureSession())) { pendingSync.current[tripId] = false; return; }
    // _updatedAt is metadata for optimistic concurrency — strip before
    // writing so it doesn't pollute the data jsonb blob.
    const { id, _updatedAt: baseUpdatedAt, ...data } = payload;
    const newUpdatedAt = new Date().toISOString();

    let query = supabase.from('trips').update({
      name: payload.name,
      destination: payload.destination,
      status: payload.status,
      data,
      updated_at: newUpdatedAt,
    }).eq('id', id);
    // Optimistic concurrency: only commit if the row hasn't moved since
    // we last saw it. Trips loaded before this code shipped won't carry
    // _updatedAt — fall through to last-write-wins for those rather than
    // refusing to save.
    if (baseUpdatedAt) query = query.eq('updated_at', baseUpdatedAt);

    const { data: rows, error } = await query.select('id, updated_at');
    pendingSync.current[tripId] = false;

    if (error) {
      console.error('[syncToDB] error:', error);
      return;
    }

    if (baseUpdatedAt && (!rows || rows.length === 0)) {
      // Conflict: a concurrent edit moved updated_at while we were in the
      // 400ms debounce window. Refetch the latest and replace local state
      // so the next user edit builds on a fresh base. The pending change
      // is dropped — preferable to silently overwriting a teammate's edit.
      console.warn('[syncToDB] conflict on', tripId, '— refetching');
      const { data: fresh } = await supabase
        .from('trips')
        .select('id, data, updated_at')
        .eq('id', tripId)
        .single();
      if (fresh) {
        setTrips(prev => prev.map(t => t.id === tripId
          ? parseTrip({ ...(fresh.data || {}), id: fresh.id, _updatedAt: fresh.updated_at })
          : t));
        toast.info(
          'Another teammate just updated this trip — your latest change wasn’t saved. Reload and try again.',
          { duration: 7000 },
        );
      }
      return;
    }

    // Success — capture the server's new updated_at so the next edit
    // chains correctly. Also patch any pendingPayload that was queued
    // mid-flight (user edited again before this response arrived).
    const written = rows && rows[0];
    if (written?.updated_at) {
      setTrips(prev => prev.map(t => t.id === tripId
        ? { ...t, _updatedAt: written.updated_at }
        : t));
      if (pendingPayload.current[tripId]) {
        pendingPayload.current[tripId]._updatedAt = written.updated_at;
      }
    }
  }

  // Debounced DB sync — with safety guard to never overwrite good data with empty data
  const syncToDB = useCallback((trip) => {
    if (!isSupabaseConfigured) return;
    // SAFETY: refuse to sync a trip that looks empty/corrupted
    if (!trip.name && !trip.destination && (!trip.members || trip.members.length === 0)) {
      console.warn('[syncToDB] BLOCKED — trip looks empty/corrupted, refusing to overwrite DB:', trip.id);
      return;
    }
    pendingSync.current[trip.id] = true;
    pendingPayload.current[trip.id] = trip;
    clearTimeout(syncTimers.current[trip.id]);
    syncTimers.current[trip.id] = setTimeout(() => {
      flushSync(trip.id);
    }, 400); // 400ms debounce (faster sync)
  }, []);

  // Flush every pending sync when the tab is hidden / closed so a refresh
  // never loses a write that's still inside the 400 ms debounce window
  // (e.g. a checklist item added then immediate refresh).
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const flushAll = () => {
      Object.keys(pendingPayload.current).forEach(id => {
        if (pendingPayload.current[id]) flushSync(id);
      });
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flushAll();
    };
    window.addEventListener('beforeunload', flushAll);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('beforeunload', flushAll);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  // ── currentUser ──────────────────────────────────────────────────────────
  const currentUser = useMemo(() => {
    if (isSupabaseConfigured && dbUser) {
      return {
        id: dbUser.id,
        name: dbUser.user_metadata?.full_name || dbUser.email?.split('@')[0] || 'User',
        email: dbUser.email,
        color: colorFromId(dbUser.id),
        role: 'organizer',
      };
    }
    return demoUser;
  }, [dbUser]);

  // Toast when a new payment-due reminder arrives for the current user.
  // Snapshot all existing reminder IDs on first run so we don't toast for
  // reminders that already existed before this session started.
  const knownReminderIdsRef = useRef(null);
  useEffect(() => {
    const uid = currentUser?.id;
    if (!uid) return;

    if (knownReminderIdsRef.current === null) {
      const seed = new Set();
      trips.forEach(t => (t.dueReminders || []).forEach(r => seed.add(r.id)));
      knownReminderIdsRef.current = seed;
      return;
    }

    const known = knownReminderIdsRef.current;
    trips.forEach(trip => {
      (trip.dueReminders || []).forEach(r => {
        if (known.has(r.id)) return;
        known.add(r.id);
        if (r.toUserId !== uid) return;
        const cur = r.currency || trip.budget?.currency || '';
        toast.info(
          `${r.fromName} reminded you: ${cur} ${Number(r.amount).toFixed(0)} due for "${trip.name}"`,
          { duration: 7000 },
        );
      });
    });
  }, [trips, currentUser]);

  const activeTrip = useMemo(
    () => trips.find(t => t.id === activeTripId) || null,
    [trips, activeTripId]
  );

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
        // Defaults first so user-provided fields (budget, dates, etc.) win.
        budget: { total: 0, spent: 0, currency: 'INR' },
        polls: [], expenses: [], itinerary: [], routes: [],
        activity: [], contingencies: [], messages: [], photos: [],
        paidSettlements: [],
        ...tripData,
        // Members is always overridden — the trip belongs to the creator.
        members: [creatorMember],
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

      if (tripErr) { console.error('[addTrip] insert error:', tripErr); toast.error('Failed to create trip: ' + tripErr.message); return; }
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
      toast.error('Failed to create trip: ' + (err.message || err));
    }
  }, [dbUser]);

  const setTripStay = useCallback((tripId, stay) => {
    // stay: { confirmed, name, area, notes }  (or null to clear)
    updateTrip(tripId, trip => ({
      ...trip,
      stay: stay
        ? {
            confirmed: !!stay.confirmed,
            name: stay.name?.trim() || '',
            area: stay.area?.trim() || '',
            notes: stay.notes?.trim() || '',
            updatedAt: new Date().toISOString(),
          }
        : null,
    }));
  }, [updateTrip]);

  const setTripPinned = useCallback((tripId, pinned) => {
    updateTrip(tripId, trip => ({
      ...trip,
      pinned: !!pinned,
      pinnedAt: pinned ? new Date().toISOString() : null,
    }));
  }, [updateTrip]);

  const removeMember = useCallback(async (tripId, userId) => {
    // Drop the trip_members row first so the user's RLS access is revoked
    // even if the JSON write later fails. updateTrip handles the JSON side.
    if (isSupabaseConfigured) {
      if (await ensureSession()) {
        const { error } = await supabase
          .from('trip_members')
          .delete()
          .eq('trip_id', tripId)
          .eq('user_id', userId);
        if (error) console.error('[removeMember] trip_members delete error:', error);
      }
    }
    updateTrip(tripId, trip => ({
      ...trip,
      members: (trip.members || []).filter(m => m.id !== userId),
    }));
  }, [updateTrip]);

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
      polls: (trip.polls || []).map(p => {
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
    updateTrip(tripId, trip => ({ ...trip, polls: [...(trip.polls || []), { ...poll, id: 'p' + Date.now(), status: 'active' }] }));
  }, [updateTrip]);

  const addExpense = useCallback((tripId, expense) => {
    // budget.spent is intentionally NOT tracked here — it would drift on
    // edit/delete. All "spent" totals are derived from expenses.reduce().
    updateTrip(tripId, trip => ({
      ...trip,
      expenses: [...(trip.expenses || []), { ...expense, id: 'e' + Date.now() }],
    }));
  }, [updateTrip]);

  const updateExpense = useCallback((tripId, expenseId, patch) => {
    updateTrip(tripId, trip => ({
      ...trip,
      expenses: (trip.expenses || []).map(e => e.id === expenseId ? { ...e, ...patch } : e),
    }));
  }, [updateTrip]);

  const deleteExpense = useCallback((tripId, expenseId) => {
    updateTrip(tripId, trip => ({
      ...trip,
      expenses: (trip.expenses || []).filter(e => e.id !== expenseId),
    }));
  }, [updateTrip]);

  const addItineraryItem = useCallback((tripId, dayId, item) => {
    updateTrip(tripId, trip => ({
      ...trip,
      itinerary: (trip.itinerary || []).map(day =>
        day.id === dayId ? { ...day, items: [...day.items, { ...item, id: 'it' + Date.now() }] } : day
      ),
    }));
  }, [updateTrip]);

  const addContingency = useCallback((tripId, contingency) => {
    updateTrip(tripId, trip => ({ ...trip, contingencies: [...(trip.contingencies || []), { ...contingency, id: 'c' + Date.now() }] }));
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

  const likeMessage = useCallback((tripId, messageId, userId) => {
    updateTrip(tripId, trip => ({
      ...trip,
      messages: (trip.messages || []).map(msg => {
        if (msg.id !== messageId) return msg;
        const likes = msg.likes || [];
        const hasLiked = likes.includes(userId);
        return { ...msg, likes: hasLiked ? likes.filter(id => id !== userId) : [...likes, userId] };
      }),
    }));
  }, [updateTrip]);

  const markSettlementPaid = useCallback((tripId, from, to, amount) => {
    updateTrip(tripId, trip => ({
      ...trip,
      paidSettlements: [
        ...(trip.paidSettlements || []),
        {
          from, to,
          amount: Number(amount) || 0,
          paidAt: new Date().toISOString(),
          // Stamp the expense set at payment time. Any later add/edit/
          // delete invalidates this snapshot, so a paid record from before
          // the change can't auto-satisfy a freshly-recomputed settlement.
          // See lib/settlement.js for the validation rule.
          expenseSnapshot: (trip.expenses || []).map(e => e.id).sort(),
        },
      ],
      // The creditor's reminder to the debtor is now obsolete; drop it.
      dueReminders: (trip.dueReminders || []).filter(r =>
        !(r.fromUserId === to && r.toUserId === from)
      ),
    }));
  }, [updateTrip]);

  const sendDueReminder = useCallback((tripId, { fromUserId, toUserId, fromName, amount, currency }) => {
    updateTrip(tripId, trip => {
      // De-dup: only one live reminder per (sender → recipient) pair.
      // Re-clicking "Send Reminder" refreshes the existing entry instead of
      // letting the array grow unbounded.
      const others = (trip.dueReminders || []).filter(r =>
        !(r.fromUserId === fromUserId && r.toUserId === toUserId)
      );
      return {
        ...trip,
        dueReminders: [
          ...others,
          {
            id: 'dr' + Date.now() + Math.random().toString(36).slice(2, 6),
            fromUserId, toUserId, fromName, amount,
            currency: currency || trip.budget?.currency || 'INR',
            sentAt: new Date().toISOString(),
            seenAt: null,
          },
        ],
      };
    });
  }, [updateTrip]);

  const markRemindersSeen = useCallback((tripId, reminderIds) => {
    if (!reminderIds?.length) return;
    const ids = new Set(reminderIds);
    const seenAt = new Date().toISOString();
    updateTrip(tripId, trip => ({
      ...trip,
      dueReminders: (trip.dueReminders || []).map(r =>
        ids.has(r.id) && !r.seenAt ? { ...r, seenAt } : r
      ),
    }));
  }, [updateTrip]);

  const addPhoto = useCallback((tripId, photo) => {
    updateTrip(tripId, trip => ({ ...trip, photos: [...(trip.photos || []), { ...photo, id: 'ph' + Date.now() }] }));
  }, [updateTrip]);

  const deletePhoto = useCallback((tripId, photoId) => {
    updateTrip(tripId, trip => ({ ...trip, photos: (trip.photos || []).filter(p => p.id !== photoId) }));
  }, [updateTrip]);

  // ── Checklist helpers ────────────────────────────────────────────────────
  const addChecklistItem = useCallback((tripId, item) => {
    updateTrip(tripId, trip => ({
      ...trip,
      checklist: [...(trip.checklist || []), {
        ...item,
        id: 'ck' + Date.now(),
        done: false,
        createdAt: new Date().toISOString(),
      }],
    }));
  }, [updateTrip]);

  const toggleChecklistItem = useCallback((tripId, itemId) => {
    updateTrip(tripId, trip => ({
      ...trip,
      checklist: (trip.checklist || []).map(it =>
        it.id === itemId ? { ...it, done: !it.done, doneAt: !it.done ? new Date().toISOString() : null } : it
      ),
    }));
  }, [updateTrip]);

  const deleteChecklistItem = useCallback((tripId, itemId) => {
    updateTrip(tripId, trip => ({
      ...trip,
      checklist: (trip.checklist || []).filter(it => it.id !== itemId),
    }));
  }, [updateTrip]);

  const updateChecklistItem = useCallback((tripId, itemId, patch) => {
    updateTrip(tripId, trip => ({
      ...trip,
      checklist: (trip.checklist || []).map(it =>
        it.id === itemId ? { ...it, ...patch } : it
      ),
    }));
  }, [updateTrip]);

  // Join via shareable invite code. The server-side accept_invite() RPC is
  // SECURITY DEFINER — it validates the invite_code against trip_invites
  // (must be 'pending' and unexpired), inserts into trip_members, and
  // appends to data.members in one transaction. Direct trip_members
  // self-insertion was removed in the 2026-05-06 migration because it let
  // anyone with a trip ID join any trip.
  //
  // Legacy ?join=<tripId> links contain a 36-char UUID, which won't match
  // any invite_code — accept_invite raises "Invalid or expired invite" and
  // we surface a clear toast rather than silently failing.
  const joinTripViaInvite = useCallback(async (inviteCode) => {
    if (!isSupabaseConfigured || !dbUser) return null;
    if (!inviteCode || typeof inviteCode !== 'string') return null;
    try {
      if (!(await ensureSession())) return null;

      const { data: tripId, error } = await supabase.rpc('accept_invite', {
        p_invite_code: inviteCode,
      });
      if (error) {
        // PostgREST surfaces our raise exception as { message: 'Invalid or expired invite' }
        const msg = error.message || '';
        if (msg.includes('Invalid or expired invite')) {
          toast.error('This invite link is no longer valid. Ask the organizer for a fresh one.');
        } else if (msg.includes('Not authenticated')) {
          toast.error('Please sign in first, then click the invite link again.');
        } else {
          console.error('[join] rpc error:', error);
          toast.error('Failed to join trip. Please try again.');
        }
        return null;
      }
      if (!tripId) return null;

      await fetchTrips(dbUser.id);
      return tripId;
    } catch (err) {
      console.error('[join] error:', err);
      toast.error('Failed to join trip. Please try again.');
      return null;
    }
  }, [dbUser, fetchTrips]);

  // Change a member's role. Writes to trip_members.role first (which gates
  // RLS) so a UI-promoted organizer actually has DB write access by the
  // time the JSON-blob mirror lands. Refuses to demote the last organizer.
  const setMemberRole = useCallback(async (tripId, userId, role) => {
    if (role !== 'organizer' && role !== 'member') return;

    if (role === 'member') {
      // Read current roster from state — guard against demoting the last organizer.
      const trip = trips.find(t => t.id === tripId);
      const orgs = (trip?.members || []).filter(m => m.role === 'organizer');
      if (orgs.length === 1 && orgs[0].id === userId) {
        toast.error('At least one organizer is required.');
        return;
      }
    }

    if (isSupabaseConfigured) {
      if (!(await ensureSession())) return;
      const { error } = await supabase
        .from('trip_members')
        .update({ role })
        .eq('trip_id', tripId)
        .eq('user_id', userId);
      if (error) {
        console.error('[setMemberRole] DB update failed:', error);
        toast.error('Failed to change role.');
        return;
      }
    }

    updateTrip(tripId, trip => ({
      ...trip,
      members: (trip.members || []).map(m => m.id === userId ? { ...m, role } : m),
    }));
  }, [trips, updateTrip]);

  const value = useMemo(() => ({
    trips, activeTrip, activeTripId, currentUser, tripsLoaded,
    setActiveTripId, updateTrip, addTrip, removeTrip, removeMember, setMemberRole, setTripPinned, setTripStay,
    vote, addPoll,
    addExpense, updateExpense, deleteExpense,
    addItineraryItem, addContingency, markSettlementPaid,
    sendMessage, markChatRead, likeMessage, addPhoto, deletePhoto, joinTripViaInvite,
    addChecklistItem, toggleChecklistItem, deleteChecklistItem, updateChecklistItem,
    sendDueReminder, markRemindersSeen,
  }), [
    trips, activeTrip, activeTripId, currentUser, tripsLoaded,
    updateTrip, addTrip, removeTrip, removeMember, setMemberRole,
    vote, addPoll,
    addExpense, updateExpense, deleteExpense,
    addItineraryItem, addContingency, markSettlementPaid,
    sendMessage, markChatRead, likeMessage, addPhoto, deletePhoto, joinTripViaInvite,
    addChecklistItem, toggleChecklistItem, deleteChecklistItem, updateChecklistItem,
    sendDueReminder, markRemindersSeen,
  ]);

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrips() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTrips must be used within TripProvider');
  return ctx;
}
