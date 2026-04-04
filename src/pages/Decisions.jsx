import { useState } from 'react';
import { useTrips } from '../context/TripContext';
import Modal from '../components/Modal';
import { getMemberById } from '../data/sampleData';
import {
  Plus, Vote, CheckCircle2, Clock, Users, X, ChevronDown,
  ThumbsUp, BarChart3, AlertCircle, Lock
} from 'lucide-react';
import { format, parseISO, isPast } from 'date-fns';

export default function Decisions() {
  const { activeTrip, vote, currentUser, addPoll, updateTrip } = useTrips();
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState('all');
  const [newPoll, setNewPoll] = useState({ question: '', type: 'single', deadline: '', options: ['', ''] });

  if (!activeTrip) {
    return (
      <>
        <div className="page-header"><h1>Group Decisions</h1><p>Select a trip first</p></div>
        <div className="page-body">
          <div className="empty-state">
            <Vote className="empty-icon" />
            <h3>No trip selected</h3>
            <p>Go to Dashboard and select a trip to see its polls and decisions.</p>
          </div>
        </div>
      </>
    );
  }

  const polls = (activeTrip.polls || []).filter(p => filter === 'all' || p.status === filter);

  function handleCreate() {
    const validOptions = newPoll.options.filter(o => o.trim());
    if (!newPoll.question.trim() || validOptions.length < 2) return;
    addPoll(activeTrip.id, {
      question: newPoll.question,
      type: newPoll.type,
      deadline: newPoll.deadline || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      options: validOptions.map((text, i) => ({ id: 'no' + Date.now() + i, text, votes: [] })),
    });
    setNewPoll({ question: '', type: 'single', deadline: '', options: ['', ''] });
    setShowCreate(false);
  }

  function closePoll(pollId) {
    updateTrip(activeTrip.id, trip => ({
      ...trip,
      polls: (trip.polls || []).map(p => p.id === pollId ? { ...p, status: 'closed' } : p),
    }));
  }

  return (
    <>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1>Group Decisions</h1>
          <p>{activeTrip.name} — {(activeTrip.polls || []).length} polls total</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          <Plus size={16} /> New Poll
        </button>
      </div>

      {/* Filters */}
      <div className="tab-nav">
        {[
          { id: 'all', label: 'All', count: (activeTrip.polls || []).length },
          { id: 'active', label: 'Active', count: (activeTrip.polls || []).filter(p => p.status === 'active').length },
          { id: 'closed', label: 'Closed', count: (activeTrip.polls || []).filter(p => p.status === 'closed').length },
        ].map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${filter === tab.id ? 'active' : ''}`}
            onClick={() => setFilter(tab.id)}
          >
            {tab.label}
            <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="page-body">
        {polls.length === 0 ? (
          <div className="empty-state">
            <Vote className="empty-icon" />
            <h3>No polls yet</h3>
            <p>Create a poll to get your group aligned on decisions.</p>
            <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
              <Plus size={16} /> Create First Poll
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {polls.map(poll => (
              <PollCard
                key={poll.id}
                poll={poll}
                trip={activeTrip}
                currentUser={currentUser}
                onVote={(optionId) => vote(activeTrip.id, poll.id, optionId, currentUser.id)}
                onClose={() => closePoll(poll.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create poll modal */}
      {showCreate && (
        <Modal
          title="Create a Poll"
          onClose={() => setShowCreate(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate}>Create Poll</button>
            </>
          }
        >
          <div className="form-group">
            <label className="form-label">Question</label>
            <input className="form-input" placeholder="What should we decide?" value={newPoll.question}
              onChange={e => setNewPoll(p => ({ ...p, question: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Vote Type</label>
              <select className="form-input" value={newPoll.type} onChange={e => setNewPoll(p => ({ ...p, type: e.target.value }))}>
                <option value="single">Single choice</option>
                <option value="multi">Multiple choice</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Deadline</label>
              <input className="form-input" type="date" value={newPoll.deadline}
                onChange={e => setNewPoll(p => ({ ...p, deadline: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Options</label>
            {newPoll.options.map((opt, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input className="form-input" placeholder={`Option ${i + 1}`} value={opt}
                  onChange={e => {
                    const opts = [...newPoll.options];
                    opts[i] = e.target.value;
                    setNewPoll(p => ({ ...p, options: opts }));
                  }} />
                {newPoll.options.length > 2 && (
                  <button className="btn btn-ghost btn-sm" onClick={() => {
                    setNewPoll(p => ({ ...p, options: p.options.filter((_, j) => j !== i) }));
                  }}>
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
            <button className="btn btn-ghost btn-sm" onClick={() => setNewPoll(p => ({ ...p, options: [...p.options, ''] }))}>
              <Plus size={14} /> Add Option
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

function PollCard({ poll, trip, currentUser, onVote, onClose }) {
  const totalVoters = (trip.members || []).length;
  const totalVotes = new Set(poll.options.flatMap(o => o.votes)).size;
  const maxVotes = Math.max(...poll.options.map(o => o.votes.length), 1);
  const isActive = poll.status === 'active';
  const expired = poll.deadline && isPast(parseISO(poll.deadline));

  return (
    <div className="card">
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isActive ? (
            <span className="badge badge-green"><Clock size={10} /> Active</span>
          ) : (
            <span className="badge badge-purple"><Lock size={10} /> Closed</span>
          )}
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
            {poll.type === 'multi' ? 'Multiple choice' : 'Single choice'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {poll.deadline && (
            <span style={{ fontSize: 12, color: expired ? 'var(--danger)' : 'var(--text-tertiary)' }}>
              {expired ? 'Expired' : `Due ${format(parseISO(poll.deadline), 'MMM d')}`}
            </span>
          )}
          {isActive && (
            <button className="btn btn-ghost btn-sm" onClick={onClose}>Close Poll</button>
          )}
        </div>
      </div>
      <div className="card-body">
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{poll.question}</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {poll.options.map(option => {
            const pct = totalVoters > 0 ? (option.votes.length / totalVoters) * 100 : 0;
            const hasVoted = option.votes.includes(currentUser.id);
            const isWinner = !isActive && option.votes.length === maxVotes && option.votes.length > 0;

            return (
              <button
                key={option.id}
                onClick={() => isActive && onVote(option.id)}
                disabled={!isActive}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: hasVoted ? '2px solid var(--brand)' : '1px solid var(--border)',
                  background: hasVoted ? 'var(--brand-light)' : 'var(--bg-secondary)',
                  textAlign: 'left',
                  cursor: isActive ? 'pointer' : 'default',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.15s',
                  width: '100%',
                }}
              >
                {/* Fill bar */}
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                  width: `${pct}%`,
                  background: isWinner ? 'var(--success-light)' : 'var(--bg-tertiary)',
                  transition: 'width 0.3s ease',
                  zIndex: 0,
                }} />

                <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                  {/* Checkbox */}
                  <div style={{
                    width: 18, height: 18, borderRadius: poll.type === 'single' ? '50%' : 4,
                    border: hasVoted ? 'none' : '2px solid var(--border)',
                    background: hasVoted ? 'var(--brand)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {hasVoted && <CheckCircle2 size={14} color="white" />}
                  </div>

                  <span style={{ fontWeight: 500, fontSize: 14 }}>{option.text}</span>

                  {isWinner && <span className="badge badge-green" style={{ marginLeft: 4 }}>Winner</span>}

                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {/* Voter avatars */}
                    <div className="avatar-group">
                      {option.votes.slice(0, 4).map(uid => {
                        const member = getMemberById(trip, uid);
                        return member ? (
                          <div key={uid} className="user-avatar" style={{
                            background: member.color, width: 22, height: 22, fontSize: 10,
                          }}>
                            {member.name[0]}
                          </div>
                        ) : null;
                      })}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', minWidth: 30, textAlign: 'right' }}>
                      {Math.round(pct)}%
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
            <Users size={12} style={{ display: 'inline', verticalAlign: -2 }} /> {totalVotes} of {totalVoters} members voted
          </span>
          {isActive && totalVotes < totalVoters && (
            <span style={{ fontSize: 12, color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <AlertCircle size={12} /> Waiting for {totalVoters - totalVotes} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
