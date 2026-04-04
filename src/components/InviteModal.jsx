import { useState } from 'react';
import { useTrips } from '../context/TripContext';
import Modal from './Modal';
import { Copy, Mail, Users, Check, X, Link2, UserPlus, Crown } from 'lucide-react';

const MEMBER_COLORS = ['#2563eb', '#7c3aed', '#16a34a', '#d97706', '#dc2626', '#0891b2', '#ea580c', '#be185d'];

export default function InviteModal({ onClose }) {
  const { activeTrip, updateTrip, currentUser } = useTrips();
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState('invite');
  const [emailError, setEmailError] = useState('');
  const [emailSent, setEmailSent] = useState('');

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

  async function addMember() {
    setEmailError('');
    setEmailSent('');
    if (!email.trim()) { setEmailError('Enter an email address.'); return; }
    if (!email.includes('@') || !email.includes('.')) { setEmailError('Enter a valid email address.'); return; }

    const alreadyAdded = activeTrip.members.some(
      m => m.email?.toLowerCase() === email.trim().toLowerCase()
    );
    if (alreadyAdded) { setEmailError('This person is already in the trip.'); return; }

    const rawName = email.split('@')[0].replace(/[._-]/g, ' ');
    const name = rawName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const colorIdx = activeTrip.members.length % MEMBER_COLORS.length;
    const trimmedEmail = email.trim().toLowerCase();

    updateTrip(activeTrip.id, trip => ({
      ...trip,
      members: [
        ...trip.members,
        {
          id: 'invited-' + Date.now(),
          name,
          email: trimmedEmail,
          avatar: null,
          color: MEMBER_COLORS[colorIdx],
          role: 'member',
          status: 'invited',
        },
      ],
    }));
    setEmail('');
    setEmailSent(trimmedEmail);
  }

  function removeMember(memberId) {
    updateTrip(activeTrip.id, trip => ({
      ...trip,
      members: trip.members.filter(m => m.id !== memberId),
    }));
  }

  function setRole(memberId, role) {
    updateTrip(activeTrip.id, trip => ({
      ...trip,
      members: trip.members.map(m => m.id === memberId ? { ...m, role } : m),
    }));
  }

  const organizers = activeTrip.members.filter(m => m.role === 'organizer');
  const members = activeTrip.members.filter(m => m.role !== 'organizer');

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
          { id: 'members', label: `Members (${activeTrip.members.length})`, icon: Users },
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

          {/* Add by email */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              <Mail size={13} style={{ display: 'inline', verticalAlign: -2, marginRight: 4 }} />
              Add by Email
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                className="form-input"
                type="email"
                placeholder="friend@example.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setEmailError(''); }}
                onKeyDown={e => e.key === 'Enter' && addMember()}
                style={{ flex: 1 }}
              />
              <button className="btn btn-primary" onClick={addMember} style={{ whiteSpace: 'nowrap' }}>
                <UserPlus size={14} /> Add Member
              </button>
            </div>
            {emailError && (
              <p style={{ fontSize: 12, color: '#dc2626', marginTop: 5 }}>{emailError}</p>
            )}
            {emailSent && (
              <p style={{ fontSize: 12, color: '#16a34a', marginTop: 5 }}>
                ✓ {emailSent} added — share the invite link above so they can access the trip.
              </p>
            )}
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
