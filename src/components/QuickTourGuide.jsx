import { useState } from 'react';
import {
  X, ArrowRight, ArrowLeft, Sparkles, Map, Vote, Calendar,
  Wallet, Route as RouteIcon, MessageSquare, CheckCircle2,
} from 'lucide-react';

const TOUR_SEEN_KEY = 'tripsync.quickTour.seen.v1';

export function hasSeenQuickTour() {
  try { return localStorage.getItem(TOUR_SEEN_KEY) === '1'; }
  catch { return false; }
}

export function markQuickTourSeen() {
  try { localStorage.setItem(TOUR_SEEN_KEY, '1'); } catch { /* private mode */ }
}

const STEPS = [
  {
    icon: Sparkles,
    emoji: '👋',
    title: 'Welcome to LetsWander',
    body: 'Your slambook for group travel. Plan trips, split costs, and decide together — all in one cozy place.',
    accent: '#722f37',
  },
  {
    icon: Map,
    emoji: '🗺️',
    title: 'Create your first trip',
    body: 'Hit "New Trip" up top. Add a name, destination, and dates — we’ll auto-pick a currency and seed an itinerary skeleton.',
    accent: '#b8860b',
  },
  {
    icon: Vote,
    emoji: '🗳️',
    title: 'Decide together',
    body: 'Open the Decisions tab to run group polls — single or multi-choice. No more endless WhatsApp scrolls.',
    accent: '#6366f1',
  },
  {
    icon: Calendar,
    emoji: '📆',
    title: 'Plan day-by-day',
    body: 'The Itinerary tab lays out your trip in days. Click "Suggest Itinerary" and AI fills in neighborhoods and activities.',
    accent: '#10b981',
  },
  {
    icon: Wallet,
    emoji: '💸',
    title: 'Track every rupee',
    body: 'Log expenses as the trip happens. We auto-balance who-owes-whom with the smallest number of transfers.',
    accent: '#ea580c',
  },
  {
    icon: RouteIcon,
    emoji: '🚆',
    title: 'Stitch the journey',
    body: 'Use Routes for multi-leg transport — flights, trains, drives. We hint the nearest hub if your city has none.',
    accent: '#0ea5e9',
  },
  {
    icon: MessageSquare,
    emoji: '💬',
    title: 'Chat & activity',
    body: 'Per-trip chat with @mentions, plus a timeline of every change. Nothing gets lost in the group thread.',
    accent: '#db2777',
  },
  {
    icon: CheckCircle2,
    emoji: '🎒',
    title: 'You’re all set',
    body: 'Pin trips you’re actively planning, invite your crew, and the slambook fills itself in. Bon voyage!',
    accent: '#059669',
  },
];

const STYLES = `
  @keyframes tourFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes tourSlideUp {
    from { opacity: 0; transform: translateY(20px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes tourStepFade {
    from { opacity: 0; transform: translateX(12px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes tourIconBounce {
    0%, 100% { transform: translateY(0) rotate(-4deg); }
    50%      { transform: translateY(-8px) rotate(4deg); }
  }
  .tour-overlay {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(15, 23, 42, 0.55);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
    animation: tourFadeIn 0.25s ease;
  }
  .tour-card {
    position: relative;
    width: 100%; max-width: 460px;
    background: linear-gradient(180deg, #fffaf0 0%, #fef3c7 100%);
    border: 2px dashed #d97706;
    border-radius: 22px;
    padding: 28px 24px 22px;
    box-shadow: 0 24px 60px rgba(15, 23, 46, 0.25);
    animation: tourSlideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    overflow: hidden;
  }
  .tour-card::before {
    content: '';
    position: absolute; inset: 0;
    background-image: repeating-linear-gradient(transparent 0, transparent 27px, rgba(120,53,15,0.06) 28px);
    pointer-events: none;
    opacity: 0.7;
  }
  .tour-tape {
    position: absolute;
    top: -10px; left: 50%; transform: translateX(-50%) rotate(-2deg);
    width: 100px; height: 22px;
    background: rgba(56, 189, 248, 0.4);
    border: 1px dashed rgba(184, 134, 11, 0.55);
    border-radius: 2px;
    box-shadow: 0 2px 5px rgba(184, 134, 11, 0.18);
  }
  .tour-close {
    position: absolute; top: 12px; right: 12px;
    width: 32px; height: 32px; border-radius: 10px;
    background: rgba(255,255,255,0.7);
    border: 1px solid rgba(120, 53, 15, 0.15);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #92400e;
    transition: background 0.2s ease, transform 0.2s ease;
    z-index: 2;
  }
  .tour-close:hover { background: white; transform: scale(1.05); }
  .tour-step {
    position: relative;
    text-align: center;
    animation: tourStepFade 0.35s ease;
  }
  .tour-icon-wrap {
    width: 88px; height: 88px;
    border-radius: 24px;
    margin: 8px auto 16px;
    display: flex; align-items: center; justify-content: center;
    color: white;
    box-shadow: 0 12px 28px rgba(120, 53, 15, 0.25);
    position: relative;
  }
  .tour-icon-emoji {
    position: absolute;
    top: -10px; right: -12px;
    font-size: 32px;
    animation: tourIconBounce 2.4s ease-in-out infinite;
    filter: drop-shadow(1px 2px 0 rgba(0,0,0,0.12));
  }
  .tour-title {
    font-family: 'Caveat', cursive;
    font-weight: 700;
    font-size: 32px;
    color: #722f37;
    line-height: 1.05;
    letter-spacing: 0.3px;
    margin-bottom: 10px;
  }
  .tour-body {
    font-family: 'Patrick Hand', cursive;
    font-size: 17px;
    color: #4b3621;
    line-height: 1.5;
    max-width: 360px;
    margin: 0 auto 22px;
  }
  .tour-dots {
    display: flex; justify-content: center; gap: 6px;
    margin-bottom: 18px;
  }
  .tour-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: rgba(120, 53, 15, 0.2);
    transition: all 0.25s ease;
  }
  .tour-dot.active {
    width: 22px; border-radius: 4px;
    background: #b8860b;
  }
  .tour-actions {
    display: flex; align-items: center; justify-content: space-between;
    gap: 10px;
    position: relative;
  }
  .tour-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 16px;
    border-radius: 12px;
    font-size: 14px; font-weight: 700;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
    border: 1.5px solid transparent;
  }
  .tour-btn:active { transform: translateY(1px) scale(0.98); }
  .tour-btn-skip {
    background: transparent;
    color: #92400e;
    border-color: rgba(146, 64, 14, 0.25);
  }
  .tour-btn-skip:hover { background: rgba(146, 64, 14, 0.08); }
  .tour-btn-back {
    background: white;
    color: #722f37;
    border-color: rgba(114, 47, 55, 0.2);
  }
  .tour-btn-back:hover { background: #fff7ed; }
  .tour-btn-next {
    background: linear-gradient(135deg, #722f37, #b8860b);
    color: white;
    box-shadow: 0 6px 16px rgba(114, 47, 55, 0.28);
  }
  .tour-btn-next:hover { box-shadow: 0 10px 22px rgba(114, 47, 55, 0.36); }
  .tour-progress {
    font-family: 'Patrick Hand', cursive;
    font-size: 13px;
    color: #92400e;
    opacity: 0.7;
    text-align: center;
    margin-top: 12px;
  }
`;

export default function QuickTourGuide({ onClose }) {
  const [stepIdx, setStepIdx] = useState(0);
  const step = STEPS[stepIdx];
  const Icon = step.icon;
  const isLast = stepIdx === STEPS.length - 1;
  const isFirst = stepIdx === 0;

  function finish() {
    markQuickTourSeen();
    onClose?.();
  }

  function next() {
    if (isLast) finish();
    else setStepIdx(i => i + 1);
  }

  function back() {
    if (!isFirst) setStepIdx(i => i - 1);
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="tour-overlay" onClick={finish}>
        <div className="tour-card" onClick={e => e.stopPropagation()} role="dialog" aria-label="Quick tour">
          <div className="tour-tape" />
          <button className="tour-close" onClick={finish} aria-label="Close tour">
            <X size={16} />
          </button>

          <div className="tour-step" key={stepIdx}>
            <div
              className="tour-icon-wrap"
              style={{ background: `linear-gradient(135deg, ${step.accent}, ${step.accent}cc)` }}
            >
              <Icon size={40} />
              <span className="tour-icon-emoji" aria-hidden="true">{step.emoji}</span>
            </div>
            <h2 className="tour-title">{step.title}</h2>
            <p className="tour-body">{step.body}</p>
          </div>

          <div className="tour-dots" role="tablist" aria-label="Tour progress">
            {STEPS.map((_, i) => (
              <button
                key={i}
                className={`tour-dot${i === stepIdx ? ' active' : ''}`}
                onClick={() => setStepIdx(i)}
                aria-label={`Go to step ${i + 1}`}
                aria-selected={i === stepIdx}
                role="tab"
                style={{ border: 'none', cursor: 'pointer', padding: 0 }}
              />
            ))}
          </div>

          <div className="tour-actions">
            {isFirst ? (
              <button className="tour-btn tour-btn-skip" onClick={finish}>
                Skip tour
              </button>
            ) : (
              <button className="tour-btn tour-btn-back" onClick={back}>
                <ArrowLeft size={14} /> Back
              </button>
            )}
            <button className="tour-btn tour-btn-next" onClick={next}>
              {isLast ? <>Let’s go <Sparkles size={14} /></> : <>Next <ArrowRight size={14} /></>}
            </button>
          </div>

          <p className="tour-progress">
            {stepIdx + 1} of {STEPS.length}
          </p>
        </div>
      </div>
    </>
  );
}
