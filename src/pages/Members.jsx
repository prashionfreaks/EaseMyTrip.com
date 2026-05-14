import { useState } from 'react';
import { useTrips } from '../context/TripContext';
import { Users, Crown, User, Mail, Copy, Check } from 'lucide-react';
import Checklist from './Checklist';

export default function Members() {
  const { activeTrip, currentUser } = useTrips();

  if (!activeTrip) {
    return (
      <>
        <div className="page-header"><h1>Members</h1><p>Select a trip first</p></div>
        <div className="page-body">
          <div className="empty-state"><Users className="empty-icon" /><h3>No trip selected</h3></div>
        </div>
      </>
    );
  }

  const members = activeTrip.members || [];

  return (
    <>
      <style>{`
        .member-card {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 14px;
          border-radius: var(--radius-md, 10px);
          border: 1px solid var(--border);
          background: var(--bg-secondary);
          transition: background 0.15s;
        }
        .member-avatar {
          width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 800; color: white;
        }
        .member-role-badge {
          display: inline-flex; align-items: center; gap: 3px;
          padding: 2px 7px; border-radius: 99px; font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.4px;
        }
        .role-organizer { background: #fef3c7; color: #92400e; }
        .role-member    { background: var(--bg-accent); color: var(--text-secondary); }

        .members-divider {
          display: flex; align-items: center; gap: 10; margin: 8px 0 4px;
        }
        .members-divider-line { flex: 1; height: 1px; background: var(--border); }
        .members-divider-label {
          font-size: 11px; font-weight: 700; color: var(--text-tertiary);
          text-transform: uppercase; letter-spacing: 0.5px; padding: 0 8px;
        }
      `}</style>

      {/* ── Members section ── */}
      <div className="page-header">
        <div>
          <h1>Members</h1>
          <p>{members.length} {members.length === 1 ? 'traveler' : 'travelers'}</p>
        </div>
      </div>

      <div className="page-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {members.map(m => (
          <MemberCard key={m.id} member={m} isCurrentUser={m.id === currentUser?.id} />
        ))}

        {/* ── Trip checklist embedded below members ── */}
        <div style={{ margin: '8px 0 4px' }} className="members-divider">
          <div className="members-divider-line" />
          <span className="members-divider-label">Trip Checklist</span>
          <div className="members-divider-line" />
        </div>
        <Checklist embedded />
      </div>
    </>
  );
}

function MemberCard({ member, isCurrentUser }) {
  const [copied, setCopied] = useState(false);

  function copyEmail() {
    if (!member.email) return;
    navigator.clipboard.writeText(member.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div className="member-card">
      {/* Avatar */}
      <div className="member-avatar" style={{ background: member.color || '#6b7280' }}>
        {member.name?.[0]?.toUpperCase() || '?'}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
            {member.name}
          </span>
          {isCurrentUser && (
            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--brand)', background: 'var(--brand-light)', padding: '1px 6px', borderRadius: 99 }}>
              you
            </span>
          )}
          <span className={`member-role-badge ${member.role === 'organizer' ? 'role-organizer' : 'role-member'}`}>
            {member.role === 'organizer' ? <><Crown size={9} /> Organizer</> : <><User size={9} /> Member</>}
          </span>
        </div>

        {member.email && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
            <Mail size={11} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {member.email}
            </span>
          </div>
        )}
      </div>

      {/* Copy email */}
      {member.email && (
        <button
          onClick={copyEmail}
          className="btn btn-ghost btn-sm"
          style={{ padding: '5px 7px', flexShrink: 0, color: copied ? 'var(--teal, #0891b2)' : 'var(--text-tertiary)' }}
          title="Copy email"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      )}
    </div>
  );
}
