import { useTrips } from '../context/TripContext';
import Checklist from './Checklist';
import Decisions from './Decisions';
import { CheckSquare, Vote } from 'lucide-react';

/**
 * Unified Polls tab — Checklist on top, group polls below.
 * Each child is rendered in `embedded` mode so it skips its own
 * page-header and page-body wrapper. We provide one cohesive header
 * with a destination subtitle and two labelled section dividers, so
 * what used to be two stacked pages reads as a single tidy view.
 */
export default function PlanAndPolls() {
  const { activeTrip } = useTrips();

  return (
    <>
      <style>{`
        .pap-section {
          padding: 14px 16px 18px;
          border-radius: 14px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-light);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.55) inset,
            0 4px 14px rgba(58, 31, 18, 0.06);
        }
        .pap-section + .pap-section { margin-top: 16px; }
        .pap-section-title {
          display: flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 800;
          color: var(--maroon);
          text-transform: uppercase; letter-spacing: 0.08em;
          padding-bottom: 10px;
          border-bottom: 1px dashed rgba(114, 47, 55, 0.22);
          margin-bottom: 12px;
        }
        @media (max-width: 768px) {
          .pap-section { padding: 12px 12px 14px; }
          .pap-section + .pap-section { margin-top: 12px; }
        }
      `}</style>

      <div className="page-header">
        <div>
          <h1>Plan &amp; decide</h1>
          <p>
            {activeTrip
              ? <>Tasks above, group polls below — keep your crew on the same page for <strong>{activeTrip.name}</strong>.</>
              : 'Tasks above, group polls below.'}
          </p>
        </div>
      </div>

      <div className="page-body" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="pap-section">
          <div className="pap-section-title">
            <CheckSquare size={13} /> Trip checklist
          </div>
          <Checklist embedded />
        </div>

        <div className="pap-section">
          <div className="pap-section-title">
            <Vote size={13} /> Group polls
          </div>
          <Decisions embedded />
        </div>
      </div>
    </>
  );
}
