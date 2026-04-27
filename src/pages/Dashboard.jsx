import { useState, useMemo, useEffect } from 'react';
import { useTrips } from '../context/TripContext';
import Modal from '../components/Modal';
import InviteModal from '../components/InviteModal';
import NotificationPanel from '../components/NotificationPanel';
import TripDetail from '../components/TripDetail';
import {
  Plus, MapPin, Calendar, Vote, Wallet,
  Clock, CheckCircle2, Trash2, Bell,
  ArrowRight, Map, Pin, PinOff,
} from 'lucide-react';
import { getTripCurrencySymbol } from '../lib/itinerary';
import DestinationPicker from '../components/DestinationPicker';
import { getDestinationImage } from '../lib/destinationImages';
import { TripCardSkeleton, SkeletonStyles } from '../components/Skeleton';
import { format, differenceInDays, parseISO } from 'date-fns';

function countOutstandingDues(trips, currentUserId) {
  let count = 0;
  trips.forEach(trip => {
    if (!trip.expenses?.length || !trip.members?.length) return;
    const paid = new Set((trip.paidSettlements || []).map(p => `${p.from}→${p.to}`));
    const bal = {};
    (trip.members || []).forEach(m => { bal[m.id] = 0; });
    trip.expenses.forEach(exp => {
      if (!exp.splitAmong?.length) return;
      const share = exp.amount / exp.splitAmong.length;
      bal[exp.paidBy] = (bal[exp.paidBy] || 0) + exp.amount;
      exp.splitAmong.forEach(uid => { bal[uid] = (bal[uid] || 0) - share; });
    });
    const debtors = [], creditors = [];
    Object.entries(bal).forEach(([uid, amt]) => {
      if (amt < -0.01) debtors.push({ uid, amount: -amt });
      else if (amt > 0.01) creditors.push({ uid, amount: amt });
    });
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const transfer = Math.min(debtors[i].amount, creditors[j].amount);
      if (transfer > 0.01) {
        const key = `${debtors[i].uid}→${creditors[j].uid}`;
        if (!paid.has(key) && (debtors[i].uid === currentUserId || creditors[j].uid === currentUserId)) count++;
      }
      debtors[i].amount -= transfer;
      creditors[j].amount -= transfer;
      if (debtors[i].amount < 0.01) i++;
      if (creditors[j].amount < 0.01) j++;
    }
  });
  return count;
}

const statusConfig = {
  planning:  { label: 'Planning',  badge: 'badge-blue',   icon: Clock },
  voting:    { label: 'Voting',    badge: 'badge-yellow', icon: Vote },
  confirmed: { label: 'Confirmed', badge: 'badge-green',  icon: CheckCircle2 },
  completed: { label: 'Completed', badge: 'badge-gray',   icon: CheckCircle2 },
};

/** Trip status, but auto-flipped to "completed" once the end date is past. */
function effectiveTripStatus(trip) {
  try {
    if (trip?.endDate) {
      const end = parseISO(trip.endDate);
      const today = new Date();
      // Compare at day granularity so "ends today" doesn't get archived early.
      end.setHours(23, 59, 59, 999);
      if (end < today) return 'completed';
    }
  } catch { /* malformed date, fall through */ }
  return trip?.status || 'planning';
}

const DASH_STYLES = `
  @keyframes dashFadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes dashScaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes dashSlideDown {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes tripPulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }
  @keyframes dashShimmer {
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes dashFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  @keyframes dashFloatSoft {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-4px) rotate(-2deg); }
  }
  @keyframes dashOrbA {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(18px, -14px); }
  }
  @keyframes dashOrbB {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(-14px, 18px); }
  }
  @keyframes dashOrbC {
    0%, 100% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-48%, -53%) scale(1.08); }
  }
  @keyframes dashLeafFall {
    0%   { transform: translate3d(0, -30px, 0) rotate(0deg); opacity: 0; }
    8%   { opacity: var(--leaf-opacity, 0.55); }
    85%  { opacity: var(--leaf-opacity, 0.55); }
    100% { transform: translate3d(var(--leaf-drift, 60px), 640px, 0) rotate(var(--leaf-spin, 540deg)); opacity: 0; }
  }
  .dash-leaf {
    position: absolute;
    top: 0;
    pointer-events: none;
    user-select: none;
    will-change: transform, opacity;
    animation: dashLeafFall var(--leaf-duration, 14s) linear infinite;
    animation-delay: var(--leaf-delay, 0s);
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25));
  }
  @keyframes dashGlow {
    0%, 100% { box-shadow: 0 0 20px rgba(114,47,55,0.15); }
    50% { box-shadow: 0 0 30px rgba(114,47,55,0.3); }
  }
  .dash-float-icon { animation: dashFloat 4s ease-in-out infinite; }
  .dash-float-emoji { animation: dashFloatSoft 3.6s ease-in-out infinite; display: inline-block; }
  .dash-orb-a { animation: dashOrbA 9s ease-in-out infinite; }
  .dash-orb-b { animation: dashOrbB 11s ease-in-out infinite; }
  .dash-orb-c { animation: dashOrbC 13s ease-in-out infinite; }

  /* ────────── Slambook hero ────────── */
  @keyframes slamWiggle {
    0%, 100% { transform: rotate(-1.2deg); }
    50%      { transform: rotate(0.4deg); }
  }
  @keyframes slamCountPop {
    0%   { transform: scale(0.7); opacity: 0; }
    60%  { transform: scale(1.12); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes slamStickerBounce {
    0%, 100% { transform: rotate(-8deg) translateY(0); }
    50%      { transform: rotate(-8deg) translateY(-3px); }
  }

  .slam-card {
    position: relative;
    /* Deepened so the hero still pops next to the cream trip cards. */
    background:
      linear-gradient(135deg, #fef3c7 0%, #fde9bf 55%, #fcd9a3 100%);
    border-radius: 18px;
    padding: 22px 22px 20px;
    margin-bottom: 18px;
    border: 2px dashed #d97706;
    box-shadow: 0 8px 22px rgba(217, 119, 6, 0.18),
                0 1px 0 rgba(255,255,255,0.6) inset;
    overflow: hidden;
    transform: rotate(-0.6deg);
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .slam-card--compact {
    padding: 14px 18px 14px;
    margin-bottom: 14px;
  }
  @keyframes slamNumPop {
    0%   { transform: translateY(2px) scale(0.85); color: #f97316; }
    60%  { transform: translateY(-2px) scale(1.18); color: #ea580c; }
    100% { transform: translateY(0) scale(1); color: inherit; }
  }
  .slam-num-pop {
    display: inline-block;
    animation: slamNumPop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    will-change: transform;
  }
  .slam-card::before {
    /* notebook ruled lines, very faint */
    content: '';
    position: absolute; inset: 0;
    background-image:
      repeating-linear-gradient(transparent 0, transparent 27px, rgba(120,53,15,0.08) 28px);
    pointer-events: none;
    opacity: 0.6;
  }
  .slam-card:hover { transform: rotate(0deg) translateY(-2px); }
  .slam-tape {
    position: absolute;
    top: -10px; left: 28px;
    width: 78px; height: 22px;
    background: rgba(56, 189, 248, 0.35);
    border: 1px dashed rgba(184, 134, 11, 0.55);
    border-radius: 2px;
    transform: rotate(-6deg);
    box-shadow: 0 2px 5px rgba(184, 134, 11, 0.18);
  }
  .slam-tape.right {
    left: auto; right: 22px;
    background: rgba(244, 114, 182, 0.32);
    border-color: rgba(236, 72, 153, 0.45);
    transform: rotate(7deg);
  }
  .slam-title {
    font-family: 'Caveat', cursive;
    font-weight: 700;
    font-size: 30px;
    color: #92400e;
    line-height: 1.05;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
  }
  .slam-sub {
    font-family: 'Patrick Hand', cursive;
    font-size: 15px;
    color: #b45309;
    line-height: 1.45;
  }
  .slam-count {
    font-family: 'Caveat', cursive;
    font-weight: 700;
    font-size: 64px;
    line-height: 1;
    color: #ea580c;
    letter-spacing: -1px;
    text-shadow: 1px 2px 0 rgba(255,255,255,0.7);
    animation: slamCountPop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    display: inline-block;
  }
  .slam-count-label {
    font-family: 'Patrick Hand', cursive;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #b45309;
    opacity: 0.8;
  }
  .slam-sticker {
    position: absolute;
    font-size: 26px;
    transform: rotate(-8deg);
    animation: slamStickerBounce 3s ease-in-out infinite;
    filter: drop-shadow(1px 1px 0 rgba(0,0,0,0.08));
    pointer-events: none;
  }
  .slam-sticker.tr { top: 14px; right: 16px; }
  .slam-sticker.br { bottom: 12px; right: 24px; transform: rotate(10deg); animation-delay: 0.6s; }
  .slam-sticker.bl { bottom: 16px; left: 22px; transform: rotate(-12deg); animation-delay: 1.2s; }
  /* The compact card is short — bottom stickers would land on the subtitle.
     Pin the second sticker to the right edge instead and shrink it slightly. */
  .slam-card--compact .slam-sticker.bl {
    top: 18px; bottom: auto; left: auto; right: 56px;
    font-size: 22px;
    transform: rotate(8deg);
  }

  .slam-avatar-stack { display: flex; align-items: center; }
  .slam-avatar-stack .user-avatar {
    border: 2px solid #fffbeb;
    box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  }
  .slam-avatar-stack .user-avatar + .user-avatar { margin-left: -10px; }

  /* Trip cards: slight slambook tilt + tape */
  .dash-card.slam-tilt {
    transform: rotate(var(--slam-rot, -0.6deg));
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.35s ease;
  }
  .dash-card.slam-tilt:hover { transform: rotate(0deg) translateY(-6px) scale(1.01); }
  .dash-card.slam-tilt::after {
    content: '';
    position: absolute;
    top: -8px; left: 50%;
    width: 64px; height: 16px;
    margin-left: -32px;
    background: rgba(254, 240, 138, 0.85);
    border: 1px dashed rgba(202, 138, 4, 0.5);
    border-radius: 2px;
    transform: rotate(-3deg);
    box-shadow: 0 2px 4px rgba(0,0,0,0.06);
    pointer-events: none;
    z-index: 5;
  }

  @media (max-width: 540px) {
    .slam-count { font-size: 52px; }
    .slam-title { font-size: 26px; }
  }

  .dash-card {
    cursor: pointer;
    border-radius: 20px;
    overflow: hidden;
    background: var(--bg-secondary);
    position: relative;
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.35s ease;
  }
  /* Pastel trip cards — four warm-leaning tints cycle by card index so a
     row of trips reads like polaroids with different paper stocks rather
     than a uniform cream wall. All tints stay close enough in luminance
     that body text + maroon buttons keep contrast. */
  .pastel-peach   { background: linear-gradient(180deg, #fff5ec 0%, #ffe1c9 100%); }
  .pastel-rose    { background: linear-gradient(180deg, #fff3f0 0%, #fbd9d2 100%); }
  .pastel-sage    { background: linear-gradient(180deg, #f4f7ec 0%, #d9e6c8 100%); }
  .pastel-butter  { background: linear-gradient(180deg, #fffbe6 0%, #f9ecbf 100%); }

  .warm-card.pinned {
    background: linear-gradient(180deg, #fffaf0 0%, #fbe2bb 100%) !important;
  }
  .warm-card .progress-bar {
    background: rgba(114, 47, 55, 0.08);
  }
  .dash-card:active {
    transform: translateY(-3px) scale(0.995);
  }
  .dash-card .card-cover img {
    transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }
  .dash-card .card-cover .cover-overlay {
    transition: opacity 0.4s ease;
  }
  .dash-card .card-actions { opacity: 0; transition: opacity 0.2s ease; }
  .dash-card .card-action,
  .dash-card .card-delete { transition: transform 0.15s ease, background 0.15s ease; }
  .dash-card:hover .card-actions { opacity: 1; }
  /* Touch devices can't hover — keep actions visible so trips can be pinned/deleted */
  @media (hover: none), (pointer: coarse) {
    .dash-card .card-actions { opacity: 1; }
  }
  .dash-card .card-arrow {
    opacity: 0;
    transform: translateX(-8px);
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .dash-create-card {
    cursor: pointer;
    border-radius: 20px;
    border: 2px dashed var(--border);
    background: var(--bg-tertiary);
    transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    overflow: hidden;
  }
  .dash-create-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg,
      rgba(114,47,55,0.04) 0%,
      rgba(99,102,241,0.04) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .dash-create-card:active {
    transform: translateY(-3px) scale(0.995);
  }
  .dash-create-icon {
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .dash-stat-card {
    transition: background 0.3s ease, border-color 0.3s ease;
    cursor: default;
  }
  .dash-feature-card {
    transition: background 0.3s ease;
    cursor: default;
  }
  .feature-emoji {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .dash-pill {
    cursor: default;
  }
  .dash-dues-banner {
    animation: dashSlideDown 0.4s ease;
  }

  /* Hover effects — only on devices that actually support hovering.
     Prevents mobile tap from triggering lift/scale/shadow states. */
  @media (hover: hover) and (pointer: fine) {
    .dash-card { transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease; }
    .dash-card:hover {
      transform: translateY(-8px) scale(1.01);
      box-shadow: 0 20px 40px rgba(15, 28, 46, 0.15),
                  0 0 0 1px rgba(114,47,55,0.1);
    }
    .dash-card:hover .card-cover img { transform: scale(1.08); }
    .dash-card:hover .card-cover .cover-overlay { opacity: 0.7; }
    .dash-card:hover .card-arrow { opacity: 1; transform: translateX(0); }

    .dash-create-card:hover::before { opacity: 1; }
    .dash-create-card:hover {
      border-color: var(--brand);
      transform: translateY(-8px) scale(1.01);
      box-shadow: 0 20px 40px rgba(114,47,55,0.12);
    }
    .dash-create-card:hover .dash-create-icon { transform: rotate(90deg) scale(1.1); }

    .dash-stat-card:hover {
      transform: translateY(-4px);
      background: rgba(255,255,255,0.1) !important;
      border-color: rgba(255,255,255,0.15) !important;
    }
    .dash-feature-card:hover { transform: translateY(-3px); background: rgba(255,255,255,0.08) !important; }
    .dash-feature-card:hover .feature-emoji { transform: scale(1.2); }
    .dash-pill:hover { transform: scale(1.05); }
    .dash-dues-banner:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(220,38,38,0.12); }
    .dash-header-btn:hover { transform: translateY(-2px); }
  }

  .dash-progress {
    position: relative;
    overflow: hidden;
  }
  .dash-progress::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(255,255,255,0.3) 50%,
      transparent 100%);
    background-size: 200% 100%;
    animation: dashShimmer 2.5s ease-in-out infinite;
    border-radius: inherit;
  }

  .dash-greeting {
    background: linear-gradient(135deg, var(--brand), #6366f1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .dash-header-btn {
    transition: all 0.25s cubic-bezier(0.23, 1, 0.32, 1);
  }
  .dash-header-btn:active {
    transform: translateY(0) scale(0.97);
  }

  /* Ambient motion for the Insights section (continuous, not interaction-triggered) */
  @keyframes dashShimmerText {
    0%   { background-position: 200% 50%; }
    100% { background-position: -200% 50%; }
  }
  @keyframes dashIconBreath {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
    50%      { box-shadow: 0 0 24px 4px rgba(255,255,255,0.08); }
  }
  @keyframes dashSparkleRock {
    0%, 100% { transform: rotate(0deg) scale(1); }
    25%      { transform: rotate(10deg) scale(1.05); }
    75%      { transform: rotate(-10deg) scale(1.05); }
  }
  .dash-insights-title {
    background: linear-gradient(
      90deg,
      #e2e8f0 0%,
      #f8fafc 30%,
      #a78bfa 50%,
      #f8fafc 70%,
      #e2e8f0 100%
    );
    background-size: 200% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: dashShimmerText 6s linear infinite;
  }
  .dash-sparkle-rock { animation: dashSparkleRock 5s ease-in-out infinite; transform-origin: center; }
  .dash-stat-card .dash-float-icon { animation: dashFloat 4s ease-in-out infinite, dashIconBreath 3.2s ease-in-out infinite; }

  /* Horizontal sweep across feature cards — staggered amber shimmer */
  @keyframes dashFeatureSweep {
    0%   { transform: translateX(-140%) skewX(-18deg); }
    55%  { transform: translateX(240%)  skewX(-18deg); }
    100% { transform: translateX(240%)  skewX(-18deg); }
  }
  .dash-feature-card {
    position: relative;
    overflow: hidden;
    isolation: isolate;
    opacity: 0;
    transform: translateX(-70px) scale(0.96);
    transition:
      opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1),
      transform 0.85s cubic-bezier(0.2, 0.9, 0.25, 1.08);
  }
  .dash-feature-card.sweep-in {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  .dash-feature-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      100deg,
      transparent 0%,
      rgba(251,191,36,0.08) 35%,
      rgba(251,146,60,0.18) 50%,
      rgba(251,191,36,0.08) 65%,
      transparent 100%
    );
    animation: dashFeatureSweep 5.5s ease-in-out infinite;
    animation-delay: var(--sweep-delay, 0s);
    pointer-events: none;
    z-index: 0;
    mix-blend-mode: screen;
  }
  .dash-feature-card > * { position: relative; z-index: 1; }
`;

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const { trips: allTrips, setActiveTripId, activeTrip, addTrip, removeTrip, setTripPinned, currentUser, tripsLoaded } = useTrips();
  const trips = useMemo(() => {
    const mine = allTrips.filter(t => (t.members || []).some(m => m.id === currentUser?.id));
    // Pinned trips first, newest pin on top within them; rest keeps source order.
    return [...mine].sort((a, b) => {
      if (!!a.pinned === !!b.pinned) {
        if (a.pinned && b.pinned) {
          return (b.pinnedAt || '').localeCompare(a.pinnedAt || '');
        }
        return 0;
      }
      return a.pinned ? -1 : 1;
    });
  }, [allTrips, currentUser?.id]);
  const [showCreate, setShowCreate] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [newTrip, setNewTrip] = useState({ name: '', destination: '', startDate: '', endDate: '', budget: '', currency: 'INR' });
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const dueCount = useMemo(() => countOutstandingDues(trips, currentUser?.id), [trips, currentUser?.id]);

  // Travel-crew metrics for the slambook hero card.
  const crewStats = useMemo(() => {
    const ids = new Set();
    const samples = [];
    trips.forEach(t => (t.members || []).forEach(m => {
      if (!m?.id || m.id === currentUser?.id) return;
      if (!ids.has(m.id)) {
        ids.add(m.id);
        if (samples.length < 6) samples.push(m);
      }
    }));
    return { count: ids.size, sample: samples };
  }, [trips, currentUser?.id]);

  async function handleCreate() {
    if (!newTrip.name.trim() || !newTrip.destination.trim()) return;
    setCreating(true);
    await addTrip({
      name: newTrip.name.trim(),
      destination: newTrip.destination.trim(),
      coverImage: getDestinationImage(newTrip.destination.trim()),
      startDate: newTrip.startDate || '2026-06-01',
      endDate: newTrip.endDate || '2026-06-10',
      status: 'planning',
      members: [{ ...currentUser, role: 'organizer' }],
      budget: { total: newTrip.budget ? parseFloat(newTrip.budget) : 0, spent: 0, currency: newTrip.currency || 'INR' },
      polls: [], itinerary: [], expenses: [], routes: [], activity: [], contingencies: [], messages: [],
    });
    setCreating(false);
    setNewTrip({ name: '', destination: '', startDate: '', endDate: '', budget: '', currency: 'INR' });
    setShowCreate(false);
  }

  async function handleDelete(trip) {
    if (!window.confirm(`Delete "${trip.name}"? This cannot be undone.`)) return;
    setDeleting(trip.id);
    await removeTrip(trip.id);
    setDeleting(null);
  }

  const firstName = currentUser?.name?.split(' ')[0] || 'there';

  // Only show skeletons on a truly cold load (no cached trips yet). When cached
  // trips are already present, render them immediately and refresh in the background.
  const showSkeletons = !tripsLoaded && trips.length === 0;

  return (
    <>
      <style>{DASH_STYLES}</style>
      <SkeletonStyles />

      <div>

      {/* Header */}
      <div className="page-header" style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-light)',
      }}>
        <div>
          {activeTrip ? (
            <>
              <h1 style={{ animation: 'dashFadeUp 0.4s ease' }}>{activeTrip.name}</h1>
              <p style={{ animation: 'dashFadeUp 0.5s ease' }}>{activeTrip.destination}</p>
            </>
          ) : (
            <>
              <p style={{
                fontFamily: "'Oregano', cursive",
                fontSize: 22, fontWeight: 400, color: 'var(--maroon)',
                marginBottom: 2, letterSpacing: '0.3px', lineHeight: 1.1,
                animation: 'dashFadeUp 0.3s ease',
              }}>
                {getGreeting()}, {firstName}
              </p>
              <h1 style={{
                fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px',
                animation: 'dashFadeUp 0.4s ease',
              }}>
                <span className="dash-greeting">Your Trips</span>
              </h1>
              <p style={{
                fontFamily: "'Oregano', cursive",
                fontSize: 18, color: 'var(--text-secondary)', marginTop: 4,
                lineHeight: 1.2,
                animation: 'dashFadeUp 0.5s ease',
              }}>
                {trips.length === 0 ? 'No trips yet — start planning!' : `${trips.length} trip${trips.length !== 1 ? 's' : ''} planned`}
              </p>
            </>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', animation: 'dashFadeUp 0.4s ease' }}>
          <button
            className="dash-header-btn"
            onClick={() => setShowNotifications(true)}
            title="Payment dues"
            style={{
              position: 'relative',
              width: 40, height: 40, borderRadius: 12,
              border: '1.5px solid var(--border)',
              background: dueCount > 0 ? '#fef2f2' : 'var(--bg-secondary)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: dueCount > 0 ? '#dc2626' : 'var(--text-tertiary)',
            }}
          >
            <Bell size={17} />
            {dueCount > 0 && (
              <span style={{
                position: 'absolute', top: -5, right: -5,
                background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white',
                fontSize: 10, fontWeight: 700,
                width: 18, height: 18, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid var(--bg-secondary)',
                animation: 'dashGlow 2s ease-in-out infinite',
              }}>
                {dueCount > 9 ? '9+' : dueCount}
              </span>
            )}
          </button>
          <button className="btn btn-primary dash-header-btn" onClick={() => setShowCreate(true)}
            style={{ borderRadius: 12, padding: '9px 18px', gap: 7 }}>
            <Plus size={16} />
            New Trip
          </button>
        </div>
      </div>

      <div className="page-body">
        {/* Slambook hero — shows when browsing the trip list, hidden inside an active workspace */}
        {!activeTrip && tripsLoaded && (
          <TravelCrewCard
            count={crewStats.count}
            tripsCount={trips.length}
            firstName={firstName}
          />
        )}

        {/* Due banner */}
        {dueCount > 0 && (
          <div className="dash-dues-banner" style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 18px', marginBottom: 20, borderRadius: 16,
            background: 'linear-gradient(135deg, #fef2f2, #fff1f2)',
            border: '1px solid #fecaca',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Wallet size={18} style={{ color: '#dc2626' }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13.5, fontWeight: 700, color: '#b91c1c' }}>
                {dueCount} pending settlement{dueCount !== 1 ? 's' : ''}
              </p>
              <p style={{ fontSize: 12, color: '#ef4444', marginTop: 2 }}>
                Settle up to keep your group on track
              </p>
            </div>
            <button
              className="btn btn-sm dash-header-btn"
              onClick={() => setShowNotifications(true)}
              style={{
                background: '#dc2626', color: 'white', border: 'none',
                flexShrink: 0, borderRadius: 10, padding: '7px 14px',
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              View <ArrowRight size={13} />
            </button>
          </div>
        )}

        {/* Active trip workspace.
            Keying on activeTrip.id forces a clean unmount/remount when the
            user picks a different trip — fixes a stale-state blank flash
            we hit when re-using the same TripDetail instance. */}
        {activeTrip && (
          <TripDetail key={activeTrip.id} onInvite={() => setShowInvite(true)} />
        )}

        {/* Trip cards grid */}
        {!activeTrip && showSkeletons && (
          <div style={{ marginBottom: 8 }}>
            <div className="grid-3">
              {Array.from({ length: 3 }).map((_, i) => <TripCardSkeleton key={i} />)}
            </div>
          </div>
        )}

        {!activeTrip && !showSkeletons && <div style={{ marginBottom: 8 }}>
          <div className="grid-3">
            {trips.map((trip, idx) => (
              <TripCard
                key={trip.id}
                trip={trip}
                index={idx}
                isActive={activeTrip?.id === trip.id}
                onSelect={() => {
                  if (activeTrip?.id === trip.id) { setActiveTripId(null); return; }
                  setActiveTripId(trip.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onDelete={() => handleDelete(trip)}
                onTogglePin={() => setTripPinned(trip.id, !trip.pinned)}
                isDeleting={deleting === trip.id}
              />
            ))}

            {/* Create trip card */}
            <button
              className="dash-create-card"
              onClick={() => setShowCreate(true)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                minHeight: 240, textAlign: 'center',
                padding: 24,
                animation: `dashFadeUp 0.5s ease ${trips.length * 0.06 + 0.1}s both`,
              }}
            >
              <div className="dash-create-icon" style={{
                width: 56, height: 56, borderRadius: 16,
                background: 'linear-gradient(135deg, #722f37, #b8860b)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
                boxShadow: '0 8px 20px rgba(114,47,55,0.25)',
              }}>
                <Plus size={26} color="white" />
              </div>
              <span style={{ fontWeight: 800, color: 'var(--brand-dark)', fontSize: 15, letterSpacing: '-0.2px' }}>
                Plan New Trip
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 5 }}>
                Start your next adventure
              </span>
            </button>
          </div>

          {/* Hint text */}
          {trips.length > 0 && (
            <div style={{
              textAlign: 'center', marginTop: 10, padding: '10px 16px',
              animation: 'dashFadeUp 0.5s ease 0.3s both',
            }}>
              <p style={{ fontSize: 12.5, color: 'var(--text-tertiary)', fontWeight: 500 }}>
                Click a trip to open its workspace
              </p>
            </div>
          )}

          {trips.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '32px 24px', marginTop: 8,
              background: 'linear-gradient(135deg, var(--bg-tertiary), var(--bg-accent))',
              borderRadius: 20, border: '1px solid var(--border-light)',
              animation: 'dashFadeUp 0.5s ease 0.2s both',
            }}>
              <div style={{ marginBottom: 12 }}>
                <Map size={36} style={{ color: 'var(--brand)', opacity: 0.6 }} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6, letterSpacing: '-0.3px' }}>
                Start your first adventure
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 320, margin: '0 auto' }}>
                Create a trip, invite your crew, and plan everything together in one place.
              </p>
            </div>
          )}

        </div>}
      </div>

      </div>{/* end blur wrapper */}

      {/* Create trip modal */}
      {showCreate && (
        <Modal
          title="Create a New Trip"
          onClose={() => setShowCreate(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setShowCreate(false)} disabled={creating}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={handleCreate}
                disabled={!newTrip.name.trim() || !newTrip.destination.trim() || creating}
              >
                {creating ? <><div className="spinner spinner-sm" /> Creating...</> : <><Plus size={14} /> Create Trip</>}
              </button>
            </>
          }
        >
          <div className="form-group">
            <label className="form-label">Trip Name *</label>
            <input className="form-input" placeholder="e.g. Japan Adventure" value={newTrip.name}
              onChange={e => setNewTrip(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Destination *</label>
            <DestinationPicker
              value={newTrip.destination}
              onChange={val => setNewTrip(p => ({ ...p, destination: val }))}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input className="form-input" type="date" value={newTrip.startDate}
                onChange={e => setNewTrip(p => ({ ...p, startDate: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input className="form-input" type="date" value={newTrip.endDate}
                min={newTrip.startDate}
                onChange={e => setNewTrip(p => ({ ...p, endDate: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Total Budget</label>
              <input className="form-input" type="number" min="0" placeholder="e.g. 50000"
                value={newTrip.budget}
                onChange={e => setNewTrip(p => ({ ...p, budget: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Currency</label>
              <select className="form-input" value={newTrip.currency}
                onChange={e => setNewTrip(p => ({ ...p, currency: e.target.value }))}>
                <option value="INR">INR ₹</option>
                <option value="USD">USD $</option>
                <option value="EUR">EUR €</option>
                <option value="GBP">GBP £</option>
                <option value="JPY">JPY ¥</option>
                <option value="SGD">SGD S$</option>
                <option value="AED">AED د.إ</option>
              </select>
            </div>
          </div>
        </Modal>
      )}

      {showInvite && activeTrip && (
        <InviteModal onClose={() => setShowInvite(false)} />
      )}

      {showNotifications && (
        <NotificationPanel onClose={() => setShowNotifications(false)} />
      )}
    </>
  );
}

function AnimNum({ value, duration = 1200 }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (typeof value !== 'number' || value <= 0) { setShown(value || 0); return; }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out-cubic so it lands softly
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <span className="slam-num-pop" key={value}>{shown}</span>;
}

function TravelCrewCard({ count, tripsCount, firstName }) {
  const isEmpty = count === 0 && tripsCount === 0;
  return (
    <div className="slam-card slam-card--compact">
      <div className="slam-tape" />
      <div className="slam-tape right" />
      <span className="slam-sticker tr">✈️</span>
      <span className="slam-sticker bl">📸</span>

      <div style={{ position: 'relative' }}>
        <div className="slam-title">
          {isEmpty ? `Hey ${firstName} 👋` : `${firstName}'s travel crew`}
        </div>
        <p className="slam-sub">
          {isEmpty
            ? 'Plan a trip and invite your friends — they\'ll show up here as you build your slambook of adventures.'
            : <>You{'’'}ve travelled with <strong><AnimNum value={count} /></strong> {count === 1 ? 'wanderer' : 'wanderers'} across <strong><AnimNum value={tripsCount} duration={900} /></strong> {tripsCount === 1 ? 'adventure' : 'adventures'} so far ✨</>}
        </p>
      </div>
    </div>
  );
}

function TripCard({ trip, index, isActive, onSelect, onDelete, onTogglePin, isDeleting }) {
  const cfg = statusConfig[effectiveTripStatus(trip)] || statusConfig.planning;
  const StatusIcon = cfg.icon;
  const daysUntil = trip.startDate ? differenceInDays(parseISO(trip.startDate), new Date()) : null;
  const totalSpent = (trip.expenses || []).reduce((sum, e) => sum + e.amount, 0);
  const budgetTotal = trip.budget?.total || 0;
  const budgetPct = budgetTotal > 0 ? Math.min(100, (totalSpent / budgetTotal) * 100) : 0;
  const sym = getTripCurrencySymbol(trip);

  // Alternate tilt direction so a row of trip cards reads like polaroids
  // pinned in a slambook page rather than a uniform grid. Pastel tint
  // also cycles by index so the row feels hand-collaged.
  const slamRot = ((index % 4) - 1.5) * 0.5; // ~ -0.75deg, -0.25deg, +0.25deg, +0.75deg
  const pastels = ['pastel-peach', 'pastel-rose', 'pastel-sage', 'pastel-butter'];
  const pastel = pastels[index % pastels.length];
  return (
    <div
      className={`dash-card slam-tilt warm-card ${pastel}${trip.pinned ? ' pinned' : ''}`}
      onClick={onSelect}
      style={{
        '--slam-rot': `${slamRot}deg`,
        border: isActive
          ? '2px solid var(--brand)'
          : trip.pinned
            ? '2px solid #f59e0b'
            : '1px solid var(--border-light)',
        boxShadow: isActive
          ? '0 0 0 4px rgba(114,47,55,0.12), var(--shadow-md)'
          : trip.pinned
            ? '0 6px 18px rgba(245, 158, 11, 0.18), var(--shadow-sm)'
            : 'var(--shadow-sm)',
        animation: `dashFadeUp 0.5s ease ${index * 0.06}s both`,
      }}
    >
      {/* Cover image */}
      <div className="card-cover" style={{ position: 'relative', overflow: 'hidden', height: 140 }}>
        <img
          src={trip.coverImage?.includes('photo-1488646953014') ? getDestinationImage(trip.destination) : (trip.coverImage || getDestinationImage(trip.destination))}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div className="cover-overlay" style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 20%, rgba(0,0,0,0.6) 100%)',
        }} />

        {/* Status badge */}
        <span className={`badge ${cfg.badge}`} style={{
          position: 'absolute', top: 12, right: 12,
          backdropFilter: 'blur(6px)', fontSize: 10.5,
          padding: '3px 10px',
        }}>
          <StatusIcon size={10} /> {cfg.label}
        </span>

        {/* Active indicator */}
        {isActive && (
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: 'linear-gradient(135deg, #722f37, #b8860b)',
            color: 'white', fontSize: 9, fontWeight: 800,
            padding: '3px 10px', borderRadius: 999, letterSpacing: '0.5px',
            boxShadow: '0 3px 10px rgba(114,47,55,0.4)',
          }}>
            OPEN
          </div>
        )}

        {/* Pinned ribbon */}
        {trip.pinned && !isActive && (
          <div style={{
            position: 'absolute', top: 12, left: 12,
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: 'white', fontSize: 9, fontWeight: 800,
            padding: '3px 9px 3px 7px', borderRadius: 999, letterSpacing: '0.5px',
            boxShadow: '0 3px 10px rgba(245,158,11,0.4)',
          }}>
            <Pin size={9} /> PINNED
          </div>
        )}

        {/* Bottom info overlay */}
        <div style={{ position: 'absolute', bottom: 12, left: 14, right: 14 }}>
          <h3 style={{
            fontSize: 16, fontWeight: 800, color: 'white',
            letterSpacing: '-0.3px', marginBottom: 3,
            textShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}>
            {trip.name}
          </h3>
          <p style={{
            fontSize: 11.5, color: 'rgba(255,255,255,0.9)',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <MapPin size={11} /> {trip.destination}
          </p>
        </div>

        {/* Pin + Delete actions — bumped to 36px so tap targets clear
            Fitts's Law's recommended floor on touch devices. */}
        <div className="card-actions" style={{
          position: 'absolute', bottom: 12, right: 12,
          display: 'flex', gap: 6,
        }}>
          <button
            className="card-action"
            onClick={e => { e.stopPropagation(); onTogglePin(); }}
            title={trip.pinned ? 'Unpin from top' : 'Pin to top'}
            aria-label={trip.pinned ? 'Unpin trip' : 'Pin trip to top'}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: trip.pinned ? 'rgba(184,134,11,0.9)' : 'rgba(42,26,13,0.55)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'white', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {trip.pinned ? <PinOff size={14} /> : <Pin size={14} />}
          </button>
          <button
            className="card-delete"
            onClick={e => { e.stopPropagation(); onDelete(); }}
            title="Delete trip"
            aria-label="Delete trip"
            disabled={isDeleting}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: isDeleting ? 'rgba(185,28,28,0.85)' : 'rgba(42,26,13,0.55)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'white', cursor: isDeleting ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {isDeleting ? <div className="spinner spinner-sm" /> : <Trash2 size={14} />}
          </button>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: '14px 16px 16px' }}>
        {/* Date row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 12,
        }}>
          <p style={{
            fontSize: 12, color: 'var(--text-tertiary)',
            display: 'flex', alignItems: 'center', gap: 5,
            fontWeight: 500,
          }}>
            <Calendar size={12} />
            {trip.startDate ? format(parseISO(trip.startDate), 'MMM d') : '?'}
            {' – '}
            {trip.endDate ? format(parseISO(trip.endDate), 'MMM d') : '?'}
          </p>
          {daysUntil != null && daysUntil > 0 && (
            <span style={{
              background: 'var(--brand-light)', color: 'var(--brand)',
              fontWeight: 700, fontSize: 10.5,
              padding: '2px 8px', borderRadius: 999,
            }}>
              {daysUntil}d away
            </span>
          )}
          {daysUntil === 0 && (
            <span style={{ color: 'var(--warning)', fontWeight: 700, fontSize: 11 }}>Today!</span>
          )}
          {daysUntil != null && daysUntil < 0 && (
            <span style={{
              background: 'var(--bg-accent)', color: 'var(--text-tertiary)',
              fontWeight: 600, fontSize: 10.5,
              padding: '2px 8px', borderRadius: 999,
            }}>
              Completed
            </span>
          )}
        </div>

        {/* Members and budget */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="avatar-group">
            {(trip.members || []).slice(0, 4).map(m => (
              <div key={m.id} className="user-avatar" title={m.name}
                style={{
                  background: m.color, width: 26, height: 26, fontSize: 10,
                  border: '2px solid var(--bg-secondary)',
                }}>
                {m.name[0]}
              </div>
            ))}
            {(trip.members || []).length > 4 && (
              <div className="user-avatar" style={{
                background: 'var(--bg-accent)', color: 'var(--text-secondary)',
                width: 26, height: 26, fontSize: 10,
                border: '2px solid var(--bg-secondary)',
              }}>
                +{(trip.members || []).length - 4}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600 }}>
              {sym}{totalSpent.toLocaleString()} / {sym}{budgetTotal.toLocaleString()}
            </span>
            <div className="card-arrow">
              <ArrowRight size={13} style={{ color: 'var(--brand)' }} />
            </div>
          </div>
        </div>

        {/* Budget progress */}
        <div className="progress-bar dash-progress" style={{ marginTop: 12, height: 4 }}>
          <div className="progress-fill" style={{
            width: `${budgetPct}%`,
            background: budgetPct > 85
              ? 'linear-gradient(90deg, #ef4444, #dc2626)'
              : budgetPct > 55
              ? 'linear-gradient(90deg, #f59e0b, #d97706)'
              : 'linear-gradient(90deg, #10b981, #059669)',
          }} />
        </div>
      </div>
    </div>
  );
}
