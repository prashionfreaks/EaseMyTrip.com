import { useState, useEffect, useRef, useCallback } from 'react';
import { useTrips } from '../context/TripContext';
import { Send, MessageCircle, Heart, AtSign } from 'lucide-react';
import { format, parseISO, isToday, isYesterday, differenceInMinutes } from '../lib/date';

function dateSeparatorLabel(dateStr) {
  const d = parseISO(dateStr);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMM d, yyyy');
}

/** Render message text with @Name highlighted */
function MessageText({ text, members, self }) {
  // Split on @Name patterns matching trip member names
  const parts = [];
  let remaining = text;
  const mentionRegex = /@(\S+)/g;
  let lastIndex = 0;
  let match;

  while ((match = mentionRegex.exec(text)) !== null) {
    const name = match[1];
    const member = members.find(m =>
      m.name?.toLowerCase().startsWith(name.toLowerCase()) ||
      m.name?.split(' ')[0]?.toLowerCase() === name.toLowerCase()
    );
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'mention', value: match[0], member });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex) });
  }

  if (parts.length === 0) return <span>{text}</span>;

  return (
    <>
      {parts.map((p, i) =>
        p.type === 'mention' ? (
          <span
            key={i}
            style={{
              fontWeight: 700,
              color: self
                ? 'rgba(255,255,255,0.95)'
                : (p.member?.color || 'var(--brand)'),
              background: self ? 'rgba(255,255,255,0.18)' : (p.member ? p.member.color + '18' : 'var(--brand-light)'),
              borderRadius: 4,
              padding: '0 3px',
            }}
          >
            {p.value}
          </span>
        ) : (
          <span key={i}>{p.value}</span>
        )
      )}
    </>
  );
}

export default function ChatPage() {
  const { activeTrip, sendMessage, markChatRead, likeMessage, currentUser } = useTrips();
  const [text, setText] = useState('');
  const [mention, setMention] = useState(null); // { query, start }
  const messagesEndRef = useRef(null);
  const textareaRef    = useRef(null);

  useEffect(() => {
    if (activeTrip) markChatRead(activeTrip.id, currentUser.id);
  }, [activeTrip?.id]); // eslint-disable-line

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeTrip?.messages?.length]);

  // Detect @mention while typing
  function handleTextChange(e) {
    const val = e.target.value;
    setText(val);

    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';

    // Find @query at cursor
    const cursor = e.target.selectionStart;
    const before = val.slice(0, cursor);
    const atMatch = before.match(/@(\w*)$/);
    if (atMatch) {
      setMention({ query: atMatch[1].toLowerCase(), start: before.length - atMatch[0].length });
    } else {
      setMention(null);
    }
  }

  function insertMention(member) {
    if (!mention || !textareaRef.current) return;
    const firstName = member.name.split(' ')[0];
    const before = text.slice(0, mention.start);
    const after  = text.slice(textareaRef.current.selectionStart);
    const newVal = before + '@' + firstName + ' ' + after;
    setText(newVal);
    setMention(null);
    textareaRef.current.focus();
    // Move cursor after inserted mention
    const pos = mention.start + firstName.length + 2;
    requestAnimationFrame(() => textareaRef.current?.setSelectionRange(pos, pos));
  }

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || !activeTrip) return;
    sendMessage(activeTrip.id, {
      userId: currentUser.id,
      text: trimmed,
      timestamp: new Date().toISOString(),
    });
    setText('');
    setMention(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  }

  if (!activeTrip) {
    return (
      <>
        <div className="page-header"><h1>Group Chat</h1><p>Select a trip first</p></div>
        <div className="page-body">
          <div className="empty-state">
            <MessageCircle className="empty-icon" />
            <h3>No trip selected</h3>
            <p>Go to Dashboard and select a trip to open its group chat.</p>
          </div>
        </div>
      </>
    );
  }

  const messages = activeTrip.messages || [];
  const { members } = activeTrip;
  const getMember = uid => members.find(m => m.id === uid);

  // @mention filtered member list
  const mentionMembers = mention
    ? members.filter(m =>
        m.id !== currentUser.id &&
        (m.name?.toLowerCase().includes(mention.query) ||
         m.name?.split(' ')[0]?.toLowerCase().startsWith(mention.query))
      )
    : [];

  // Build render list with date separators and grouping
  const items = [];
  let lastDateStr = null, lastUserId = null, lastTimestamp = null;
  messages.forEach(msg => {
    if (!msg.timestamp) return;
    const dateStr = msg.timestamp.slice(0, 10);
    if (dateStr !== lastDateStr) {
      items.push({ type: 'separator', dateStr, key: `sep-${dateStr}` });
      lastDateStr = dateStr; lastUserId = null; lastTimestamp = null;
    }
    const grouped =
      msg.userId === lastUserId &&
      lastTimestamp !== null &&
      differenceInMinutes(parseISO(msg.timestamp), parseISO(lastTimestamp)) < 5;
    items.push({ type: 'message', msg, grouped, key: msg.id });
    lastUserId = msg.userId; lastTimestamp = msg.timestamp;
  });

  return (
    <div className="chat-container">
      <style>{`
        .chat-msg-wrap { position: relative; }
        .chat-meta-row {
          display: flex; align-items: center; gap: 6px;
          margin-top: 3px;
        }
        .chat-like-btn {
          display: inline-flex; align-items: center; gap: 3px;
          background: var(--bg-secondary); border: 1px solid var(--border);
          border-radius: 99px; padding: 2px 7px;
          font-size: 11px; font-weight: 600; cursor: pointer;
          color: var(--text-secondary); line-height: 1;
          box-shadow: var(--shadow-sm); transition: opacity 0.15s, background 0.15s, color 0.15s, border-color 0.15s;
          opacity: 0; pointer-events: none;
          white-space: nowrap;
        }
        .chat-like-btn.liked { color: #e11d48; border-color: #fecdd3; background: #fff1f2; }
        .chat-like-btn.has-likes { opacity: 1 !important; pointer-events: auto !important; }
        .chat-msg-wrap:hover .chat-like-btn { opacity: 1; pointer-events: auto; }

        .mention-popup {
          position: absolute; bottom: calc(100% + 4px); left: 0;
          background: var(--bg-secondary); border: 1px solid var(--border);
          border-radius: 12px; padding: 4px;
          box-shadow: var(--shadow-lg, 0 8px 24px rgba(0,0,0,0.12));
          z-index: 200; min-width: 180px; max-width: 260px;
        }
        .mention-item {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 10px; border-radius: 8px;
          cursor: pointer; font-size: 13px; font-weight: 600;
          color: var(--text-primary);
          transition: background 0.1s;
        }
        .mention-item:hover { background: var(--brand-light); color: var(--brand); }
        .mention-avatar {
          width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 800; color: white;
        }
      `}</style>

      {/* ── Messages ── */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '8px 20px 12px',
        display: 'flex', flexDirection: 'column',
        background: 'var(--bg-primary)',
      }}>
        {messages.length === 0 ? (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', padding: 40,
          }}>
            <div style={{
              width: 68, height: 68, borderRadius: '50%',
              background: 'var(--brand-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16,
            }}>
              <MessageCircle size={30} style={{ color: 'var(--brand)' }} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>No messages yet</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 280, lineHeight: 1.6 }}>
              Start the conversation! Share ideas, ask questions, or just get everyone hyped. 🎉
            </p>
          </div>
        ) : (
          <>
            {items.map(item => {
              if (item.type === 'separator') {
                return (
                  <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0 8px' }}>
                    <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                    <span style={{
                      fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)',
                      background: 'var(--bg-accent)', padding: '3px 12px',
                      borderRadius: 999, whiteSpace: 'nowrap',
                    }}>
                      {dateSeparatorLabel(item.dateStr)}
                    </span>
                    <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                  </div>
                );
              }

              const { msg, grouped } = item;
              const self   = msg.userId === currentUser.id;
              const member = getMember(msg.userId);
              const likes  = msg.likes || [];
              const liked  = likes.includes(currentUser.id);

              return (
                <div
                  key={item.key}
                  className="chat-msg-wrap"
                  style={{
                    display: 'flex',
                    flexDirection: self ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    gap: 8,
                    marginTop: grouped ? 2 : 12,
                  }}
                >
                  {/* Avatar */}
                  {!self && (
                    <div style={{ width: 32, flexShrink: 0 }}>
                      {!grouped ? (
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: member?.color || '#6b7280',
                          color: 'white', fontSize: 13, fontWeight: 700,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {member?.name?.[0] || '?'}
                        </div>
                      ) : <div style={{ width: 32 }} />}
                    </div>
                  )}

                  <div style={{
                    maxWidth: '65%',
                    display: 'flex', flexDirection: 'column',
                    alignItems: self ? 'flex-end' : 'flex-start',
                    position: 'relative',
                  }}>
                    {/* Name */}
                    {!self && !grouped && (
                      <span style={{
                        fontSize: 11, fontWeight: 700,
                        color: member?.color || 'var(--text-secondary)',
                        marginBottom: 3, paddingLeft: 10,
                      }}>
                        {member?.name || 'Unknown'}
                      </span>
                    )}

                    {/* Bubble */}
                    <div style={{
                      padding: '9px 13px',
                      borderRadius: self
                        ? '18px 4px 18px 18px'
                        : '4px 18px 18px 18px',
                      background: self ? 'var(--brand)' : 'var(--bg-secondary)',
                      color: self ? 'white' : 'var(--text-primary)',
                      fontSize: 14, lineHeight: 1.5,
                      boxShadow: 'var(--shadow-sm)',
                      border: self ? 'none' : '1px solid var(--border)',
                      wordBreak: 'break-word', whiteSpace: 'pre-wrap',
                    }}>
                      <MessageText text={msg.text} members={members} self={self} />
                    </div>

                    {/* Meta row: time + like button, ordered so like sits on the outer edge */}
                    <div
                      className="chat-meta-row"
                      style={{
                        flexDirection: self ? 'row-reverse' : 'row',
                        paddingLeft: self ? 0 : 4,
                        paddingRight: self ? 4 : 0,
                      }}
                    >
                      <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
                        {format(parseISO(msg.timestamp), 'h:mm a')}
                      </span>
                      <button
                        className={`chat-like-btn${liked ? ' liked' : ''}${likes.length > 0 ? ' has-likes' : ''}`}
                        onClick={() => likeMessage(activeTrip.id, msg.id, currentUser.id)}
                        title={liked ? 'Unlike' : 'Like'}
                      >
                        <Heart size={11} style={{ fill: liked ? 'currentColor' : 'none' }} />
                        {likes.length > 0 && <span>{likes.length}</span>}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* ── Input ── */}
      <div style={{
        padding: '10px 20px 14px',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        flexShrink: 0, position: 'relative',
      }}>
        {/* @mention popup */}
        {mention && mentionMembers.length > 0 && (
          <div className="mention-popup">
            {mentionMembers.map(m => (
              <div
                key={m.id}
                className="mention-item"
                onMouseDown={e => { e.preventDefault(); insertMention(m); }}
              >
                <span className="mention-avatar" style={{ background: m.color || 'var(--brand)' }}>
                  {m.name?.[0]?.toUpperCase()}
                </span>
                {m.name}
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            display: 'flex', gap: 10, alignItems: 'flex-end',
            background: 'var(--bg-input)',
            border: '1.5px solid var(--border)',
            borderRadius: 18, padding: '8px 8px 8px 12px',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
          onFocusCapture={e => {
            e.currentTarget.style.borderColor = 'var(--maroon)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(114,47,55,0.16)';
          }}
          onBlurCapture={e => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {/* @ button — taps insert @ at cursor */}
          <button
            type="button"
            onClick={() => {
              if (!textareaRef.current) return;
              const pos = textareaRef.current.selectionStart;
              const newVal = text.slice(0, pos) + '@' + text.slice(pos);
              setText(newVal);
              requestAnimationFrame(() => {
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(pos + 1, pos + 1);
                // Trigger mention detection
                const event = new Event('input', { bubbles: true });
                textareaRef.current.dispatchEvent(event);
                setMention({ query: '', start: pos });
              });
            }}
            style={{
              width: 36, height: 36, borderRadius: 10, border: 'none',
              background: 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-tertiary)', flexShrink: 0,
              transition: 'color 0.15s',
            }}
            title="Mention someone"
          >
            <AtSign size={16} />
          </button>

          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            placeholder={`Message ${activeTrip.name}…`}
            rows={1}
            style={{
              flex: 1, border: 'none', background: 'transparent',
              resize: 'none', fontSize: 14, lineHeight: 1.5,
              outline: 'none', fontFamily: 'var(--font)',
              color: 'var(--text-primary)',
              minHeight: 24, maxHeight: 120, padding: '2px 0',
            }}
          />
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            style={{
              width: 36, height: 36, borderRadius: 10, border: 'none',
              background: text.trim() ? 'var(--brand)' : 'var(--bg-accent)',
              cursor: text.trim() ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: text.trim() ? 'white' : 'var(--text-tertiary)',
              transition: 'all 0.15s', flexShrink: 0,
            }}
          >
            <Send size={15} />
          </button>
        </div>
        <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 5, textAlign: 'center' }}>
          Type @ to mention someone · tap ❤ to react
        </p>
      </div>
    </div>
  );
}
