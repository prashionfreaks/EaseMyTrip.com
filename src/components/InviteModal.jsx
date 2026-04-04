import { useState } from 'react';
import { useTrips } from '../context/TripContext';
import Modal from './Modal';
import { Copy, Users, Check, X, Link2, UserPlus, Crown, MessageCircle } from 'lucide-react';

export default function InviteModal({ onClose }) {
  const { activeTrip, updateTrip, currentUser } = useTrips();
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState('invite');

  if (!activeTrip) return null;

  // Static invite link — just uses the trip ID, no DB lookup needed
  const inviteLink = `${window.location.origin}${window.location.pathname}?join=${activeTrip.id}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(inviteLink);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = inviteLink;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function removeMember(memberId) {
    updateTrip(activeTrip.id, trip => ({
      ...trip,
      members: (trip.members || []).filter(m => m.id !== memberId),
    }));
  }

  function setRole(memberId, role) {
    updateTrip(activeTrip.id, trip => ({
      ...trip,
      members: (trip.members || []).map(m => m.id === memberId ? { ...m, role } : m),
    }));
  }

  const organizers = (activeTrip.members || []).filter(m => m.role === 'organizer');
  const members = (activeTrip.members || []).filter(m => m.role !== 'organizer');

  return (
    <Modal
      title="Manage Travelers"
      onClose={onClose}
      footer={
        <button className="btn btn-secondary" onClick={onClose}>Done</button>
      }
    >
      {/* Trip name badge */}
      <div style={{
        background: '#dbeafe', color: '#1d4ed8', borderRadius: 8,
        padding: '6px 12px', fontSize: 13, fontWeight: 600, display: 'inline-flex',
        alignItems: 'center', gap: 6, marginBottom: 20,
      }}>
        <span>✈️</span> {activeTrip.name}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: 10, padding: 4, marginBottom: 20, gap: 4 }}>
        {[
          { id: 'invite', label: 'Invite People', icon: UserPlus },
          { id: 'members', label: `Members (${(activeTrip.members || []).length})`, icon: Users },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              flex: 1, padding: '8px 10px', borderRadius: 8, border: 'none',
              background: tab === id ? 'white' : 'transparent',
              color: tab === id ? '#2563eb' : '#6b7280',
              fontWeight: tab === id ? 600 : 500,
              fontSize: 13, cursor: 'pointer',
              boxShadow: tab === id ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'all 0.15s',
            }}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {tab === 'invite' && (
        <>
          {/* Invite link — shown first */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              <Link2 size={13} style={{ display: 'inline', verticalAlign: -2, marginRight: 4 }} />
              Shareable Invite Link
            </label>
            <div style={{
              background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 10,
              padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <code style={{ flex: 1, fontSize: 12, color: '#475569', wordBreak: 'break-all', lineHeight: 1.4 }}>
                {inviteLink}
              </code>
              <button
                onClick={copyLink}
                style={{
                  padding: '6px 12px', borderRadius: 8, border: 'none', flexShrink: 0,
                  background: copied ? '#dcfce7' : '#f1f5f9',
                  cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  color: copied ? '#16a34a' : '#475569',
                  display: 'flex', alignItems: 'center', gap: 5,
                  transition: 'all 0.2s',
                }}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>
              Anyone with this link can join this trip after signing in.
            </p>
          </div>

          {/* Share via WhatsApp */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              <MessageCircle size={13} style={{ display: 'inline', verticalAlign: -2, marginRight: 4 }} />
              Share via WhatsApp
            </label>
            <button
              onClick={() => {
                const message = `Hey! Join my trip "${activeTrip.name}" on LetsWander:\n${inviteLink}`;
                window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
              }}
              style={{
                width: '100%', padding: '12px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                borderRadius: 10, border: 'none',
                background: '#25D366', color: 'white',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(37,211,102,0.3)',
                transition: 'all 0.15s',
              }}
              onMouseOver={e => { e.currentTarget.style.background = '#1fb855'; }}
              onMouseOut={e => { e.currentTarget.style.background = '#25D366'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Send via WhatsApp
            </button>
            <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>
              Opens WhatsApp with a pre-filled message containing the invite link.
            </p>
          </div>
        </>
      )}

      {tab === 'members' && (
        <div>
          {organizers.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8 }}>
                Organizers
              </p>
              {organizers.map(m => (
                <MemberRow key={m.id} member={m} onSetRole={setRole} onRemove={removeMember} isOwner={m.id === currentUser?.id} />
              ))}
            </div>
          )}

          {members.length > 0 ? (
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8 }}>
                Members
              </p>
              {members.map(m => (
                <MemberRow key={m.id} member={m} onSetRole={setRole} onRemove={removeMember} isOwner={m.id === currentUser?.id} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
              <Users size={32} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
              <p style={{ fontSize: 13 }}>No other members yet. Invite friends using the Invite tab!</p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

function MemberRow({ member, onSetRole, onRemove, isOwner }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 0', borderBottom: '1px solid #f1f5f9',
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: '50%',
        background: member.color || '#2563eb', color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 15, fontWeight: 700, flexShrink: 0,
      }}>
        {member.name[0]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{member.name}</span>
          {member.role === 'organizer' && <Crown size={12} style={{ color: '#d97706' }} />}
          {member.status === 'invited' && (
            <span style={{ fontSize: 11, color: '#d97706', background: '#fef3c7', padding: '1px 6px', borderRadius: 999, fontWeight: 500 }}>
              pending
            </span>
          )}
        </div>
        {member.email && (
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 1 }}>{member.email}</div>
        )}
      </div>
      {!isOwner && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <select
            value={member.role}
            onChange={e => onSetRole(member.id, e.target.value)}
            style={{
              padding: '4px 8px', borderRadius: 6,
              border: '1px solid #e2e8f0', fontSize: 12,
              background: 'white', cursor: 'pointer', outline: 'none',
              color: member.role === 'organizer' ? '#1d4ed8' : '#374151',
            }}
          >
            <option value="organizer">Organizer</option>
            <option value="member">Member</option>
          </select>
          <button
            onClick={() => onRemove(member.id)}
            title="Remove from trip"
            style={{
              width: 28, height: 28, borderRadius: 6, border: 'none',
              background: '#fef2f2', color: '#dc2626', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#fee2e2'; }}
            onMouseOut={e => { e.currentTarget.style.background = '#fef2f2'; }}
          >
            <X size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
