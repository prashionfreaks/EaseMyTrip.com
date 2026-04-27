import { useState, useMemo } from 'react';
import { useTrips } from '../context/TripContext';
import { CheckSquare, Plus, Trash2, User, ChevronDown } from 'lucide-react';

const FILTERS = [
  { id: 'all',    label: 'All' },
  { id: 'mine',   label: 'Mine' },
  { id: 'undone', label: 'To-do' },
  { id: 'done',   label: 'Done' },
];

export default function Checklist({ embedded = false }) {
  const {
    activeTrip, currentUser,
    addChecklistItem, toggleChecklistItem,
    deleteChecklistItem, updateChecklistItem,
  } = useTrips();

  const [filter, setFilter]       = useState('all');
  const [text, setText]           = useState('');
  const [ownerId, setOwnerId]     = useState(currentUser?.id || '');
  const [ownerOpen, setOwnerOpen] = useState(false);

  // ── All hooks must be called unconditionally — see Budget.jsx for context.
  // Compute against safe defaults so this stays sound when activeTrip is null.
  const members  = activeTrip?.members || [];
  const items    = activeTrip?.checklist || [];
  const total    = items.length;
  const doneCount = items.filter(i => i.done).length;
  const pct      = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  const filtered = useMemo(() => {
    switch (filter) {
      case 'mine':   return items.filter(i => i.ownerId === currentUser?.id);
      case 'undone': return items.filter(i => !i.done);
      case 'done':   return items.filter(i => i.done);
      default:       return items;
    }
  }, [items, filter, currentUser]);

  if (!activeTrip) {
    return (
      <>
        <div className="page-header"><h1>Checklist</h1><p>Select a trip first</p></div>
        <div className="page-body">
          <div className="empty-state">
            <CheckSquare className="empty-icon" />
            <h3>No trip selected</h3>
          </div>
        </div>
      </>
    );
  }

  function getMember(id) {
    return members.find(m => m.id === id) || null;
  }

  function handleAdd(e) {
    e.preventDefault();
    if (!text.trim()) return;
    addChecklistItem(activeTrip.id, { text: text.trim(), ownerId: ownerId || null });
    setText('');
  }

  function reassign(itemId, newOwnerId) {
    updateChecklistItem(activeTrip.id, itemId, { ownerId: newOwnerId || null });
  }

  const selectedOwner = getMember(ownerId);

  return (
    <>
      <style>{`
        .cl-progress-bar { height: 6px; background: var(--border); border-radius: 99px; overflow: hidden; }
        .cl-progress-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, var(--brand), var(--teal, #0891b2)); transition: width 0.4s ease; }

        .cl-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px;
          border-radius: var(--radius-md, 10px);
          border: 1px solid var(--border);
          background: var(--bg-secondary);
          transition: opacity 0.2s;
        }
        .cl-item.done { opacity: 0.55; }

        .cl-checkbox {
          width: 20px; height: 20px; min-height: 20px;
          flex-shrink: 0;
          padding: 0;
          border: 2px solid var(--border-dark, #94a3b8);
          border-radius: 6px; background: transparent;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .cl-checkbox.checked {
          background: var(--brand); border-color: var(--brand);
        }
        .cl-checkbox.checked::after {
          content: ''; display: block;
          width: 5px; height: 9px;
          border: 2px solid white; border-top: none; border-left: none;
          transform: rotate(45deg) translateY(-1px);
        }

        .cl-text { flex: 1; font-size: 14px; line-height: 1.4; word-break: break-word; }
        .cl-text.done { text-decoration: line-through; color: var(--text-secondary); }

        .cl-owner-pill {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 8px 3px 5px;
          border-radius: 99px;
          font-size: 11px; font-weight: 600;
          cursor: pointer;
          border: 1px solid var(--border);
          background: var(--bg-primary);
          color: var(--text-secondary);
          flex-shrink: 0;
          position: relative;
        }
        .cl-owner-pill:hover { border-color: var(--brand); color: var(--brand); }

        .cl-owner-avatar {
          width: 18px; height: 18px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; font-weight: 700; color: white;
          flex-shrink: 0;
        }

        .cl-owner-menu {
          position: absolute; top: calc(100% + 4px); right: 0;
          background: var(--bg-secondary); border: 1px solid var(--border);
          border-radius: var(--radius-md, 10px); padding: 4px;
          box-shadow: var(--shadow-lg, 0 8px 24px rgba(0,0,0,0.12));
          z-index: 100; min-width: 160px;
        }
        .cl-owner-menu button {
          width: 100%; display: flex; align-items: center; gap: 8px;
          padding: 7px 10px; border-radius: 7px;
          font-size: 13px; font-weight: 500; text-align: left;
          background: transparent; border: none; cursor: pointer; color: var(--text-primary);
        }
        .cl-owner-menu button:hover { background: var(--bg-hover, var(--brand-light)); color: var(--brand); }
        .cl-owner-menu button.selected { background: var(--brand-light); color: var(--brand); }

        .cl-add-form {
          display: flex; gap: 8px; align-items: stretch;
          flex-wrap: wrap;
        }
        .cl-add-input {
          flex: 1; min-width: 0;
          padding: 9px 12px; border-radius: var(--radius-md, 10px);
          border: 1px solid var(--border); background: var(--bg-secondary);
          font-size: 14px; color: var(--text-primary);
          outline: none;
        }
        .cl-add-input:focus { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-light); }

        .cl-owner-select-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 9px 12px; border-radius: var(--radius-md, 10px);
          border: 1px solid var(--border); background: var(--bg-secondary);
          font-size: 13px; font-weight: 500; cursor: pointer; color: var(--text-secondary);
          white-space: nowrap; position: relative;
        }
        .cl-owner-select-btn:hover { border-color: var(--brand); color: var(--brand); }

        @media (max-width: 768px) {
          .cl-add-form { flex-direction: column; }
          .cl-add-form .cl-add-input { min-width: 0; }
        }
      `}</style>

      {/* Header — full when standalone, hidden when embedded (PlanAndPolls
          renders a single unified header for both sections). */}
      {!embedded && (
        <div className="page-header">
          <div>
            <h1>Checklist</h1>
            <p>{total === 0 ? 'Add tasks for the trip' : `${doneCount} of ${total} done · ${pct}%`}</p>
          </div>
        </div>
      )}

      <div className={embedded ? '' : 'page-body'} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Progress bar */}
        {total > 0 && (
          <div className="cl-progress-bar">
            <div className="cl-progress-fill" style={{ width: `${pct}%` }} />
          </div>
        )}

        {/* Add item form */}
        <form className="cl-add-form" onSubmit={handleAdd}>
          <input
            className="cl-add-input"
            placeholder="Add a task… e.g. Book hotel in Kyoto"
            value={text}
            onChange={e => setText(e.target.value)}
          />

          {/* Owner picker for new item */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="cl-owner-select-btn"
              onClick={() => setOwnerOpen(v => !v)}
            >
              {selectedOwner ? (
                <>
                  <span
                    className="cl-owner-avatar"
                    style={{ background: selectedOwner.color || 'var(--brand)' }}
                  >
                    {selectedOwner.name?.[0]?.toUpperCase()}
                  </span>
                  {selectedOwner.name?.split(' ')[0]}
                </>
              ) : (
                <><User size={14} /> Assign</>
              )}
              <ChevronDown size={12} />
            </button>

            {ownerOpen && (
              <div className="cl-owner-menu">
                <button
                  type="button"
                  className={!ownerId ? 'selected' : ''}
                  onClick={() => { setOwnerId(''); setOwnerOpen(false); }}
                >
                  <User size={14} /> Unassigned
                </button>
                {members.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    className={ownerId === m.id ? 'selected' : ''}
                    onClick={() => { setOwnerId(m.id); setOwnerOpen(false); }}
                  >
                    <span
                      className="cl-owner-avatar"
                      style={{ background: m.color || 'var(--brand)' }}
                    >
                      {m.name?.[0]?.toUpperCase()}
                    </span>
                    {m.name}
                    {m.id === currentUser?.id && <span style={{ marginLeft: 'auto', fontSize: 10, opacity: 0.6 }}>you</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary" disabled={!text.trim()}>
            <Plus size={15} /> Add
          </button>
        </form>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button
              key={f.id}
              className={`btn btn-sm ${filter === f.id ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter(f.id)}
              style={{ borderRadius: 99 }}
            >
              {f.label}
              {f.id === 'all' && total > 0 && (
                <span className="badge badge-blue" style={{ marginLeft: 4, fontSize: 10 }}>{total}</span>
              )}
              {f.id === 'undone' && total > 0 && (
                <span className="badge badge-yellow" style={{ marginLeft: 4, fontSize: 10 }}>{total - doneCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Item list */}
        {filtered.length === 0 ? (
          <div className="empty-state" style={{ paddingTop: 32 }}>
            <CheckSquare className="empty-icon" />
            <h3>
              {filter === 'all'   ? 'No tasks yet'            :
               filter === 'mine'  ? 'Nothing assigned to you' :
               filter === 'done'  ? 'Nothing done yet'        :
                                    'All caught up! ✅'}
            </h3>
            {filter === 'all' && <p>Add your first task above</p>}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(item => (
              <ChecklistItem
                key={item.id}
                item={item}
                members={members}
                currentUser={currentUser}
                onToggle={() => toggleChecklistItem(activeTrip.id, item.id)}
                onDelete={() => deleteChecklistItem(activeTrip.id, item.id)}
                onReassign={(newId) => reassign(item.id, newId)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

/* ─── Individual item ──────────────────────────────────────────────── */
function ChecklistItem({ item, members, currentUser, onToggle, onDelete, onReassign }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const owner = members.find(m => m.id === item.ownerId) || null;

  return (
    <div className={`cl-item${item.done ? ' done' : ''}`}>
      {/* Checkbox */}
      <button
        type="button"
        className={`cl-checkbox${item.done ? ' checked' : ''}`}
        onClick={onToggle}
        aria-label={item.done ? 'Mark undone' : 'Mark done'}
      />

      {/* Text */}
      <span className={`cl-text${item.done ? ' done' : ''}`}>{item.text}</span>

      {/* Owner pill + reassign */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <button
          type="button"
          className="cl-owner-pill"
          onClick={() => setMenuOpen(v => !v)}
          title="Reassign"
        >
          {owner ? (
            <>
              <span
                className="cl-owner-avatar"
                style={{ background: owner.color || 'var(--brand)' }}
              >
                {owner.name?.[0]?.toUpperCase()}
              </span>
              {owner.name?.split(' ')[0]}
            </>
          ) : (
            <><User size={11} style={{ opacity: 0.5 }} /> Unassigned</>
          )}
          <ChevronDown size={10} style={{ opacity: 0.5 }} />
        </button>

        {menuOpen && (
          <div className="cl-owner-menu">
            <button
              className={!item.ownerId ? 'selected' : ''}
              onClick={() => { onReassign(''); setMenuOpen(false); }}
            >
              <User size={13} /> Unassigned
            </button>
            {members.map(m => (
              <button
                key={m.id}
                className={item.ownerId === m.id ? 'selected' : ''}
                onClick={() => { onReassign(m.id); setMenuOpen(false); }}
              >
                <span
                  className="cl-owner-avatar"
                  style={{ background: m.color || 'var(--brand)' }}
                >
                  {m.name?.[0]?.toUpperCase()}
                </span>
                {m.name}
                {m.id === currentUser?.id && <span style={{ marginLeft: 'auto', fontSize: 10, opacity: 0.6 }}>you</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Delete */}
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={onDelete}
        style={{ padding: '4px 6px', color: 'var(--danger)', flexShrink: 0 }}
        aria-label="Delete task"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
