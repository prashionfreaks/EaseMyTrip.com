import { useState, useEffect, useRef } from 'react';
import { useTrips } from '../context/TripContext';
import { Send, MessageCircle, Users } from 'lucide-react';
import { format, parseISO, isToday, isYesterday, differenceInMinutes } from 'date-fns';

function dateSeparatorLabel(dateStr) {
  const d = parseISO(dateStr);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMM d, yyyy');
}

export default function ChatPage() {
  const { activeTrip, sendMessage, markChatRead, currentUser } = useTrips();
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Mark chat as read when opened / trip changes
  useEffect(() => {
    if (activeTrip) markChatRead(activeTrip.id, currentUser.id);
  }, [activeTrip?.id]); // eslint-disable-line

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeTrip?.messages?.length]);

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || !activeTrip) return;
    sendMessage(activeTrip.id, {
      userId: currentUser.id,
      text: trimmed,
      timestamp: new Date().toISOString(),
    });
    setText('');
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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

  // Build render list with date separators and grouping
  const items = [];
  let lastDateStr = null;
  let lastUserId = null;
  let lastTimestamp = null;

  messages.forEach(msg => {
    const dateStr = msg.timestamp.slice(0, 10);
    if (dateStr !== lastDateStr) {
      items.push({ type: 'separator', dateStr, key: `sep-${dateStr}` });
      lastDateStr = dateStr;
      lastUserId = null;
      lastTimestamp = null;
    }

    const grouped =
      msg.userId === lastUserId &&
      lastTimestamp !== null &&
      differenceInMinutes(parseISO(msg.timestamp), parseISO(lastTimestamp)) < 5;

    items.push({ type: 'message', msg, grouped, key: msg.id });
    lastUserId = msg.userId;
    lastTimestamp = msg.timestamp;
  });

  return (
    <div className="chat-container">
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.3px' }}>Group Chat</h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Users size={13} />
            {activeTrip.name} · {members.length} member{members.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="avatar-group">
          {members.slice(0, 5).map(m => (
            <div key={m.id} className="user-avatar" title={m.name}
              style={{ background: m.color, width: 30, height: 30, fontSize: 11 }}>
              {m.name[0]}
            </div>
          ))}
          {members.length > 5 && (
            <div className="user-avatar" style={{ background: '#e5e7eb', color: '#6b7280', width: 30, height: 30, fontSize: 10 }}>
              +{members.length - 5}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '8px 20px 12px',
        display: 'flex',
        flexDirection: 'column',
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
                      background: 'var(--bg-accent)',
                      padding: '3px 12px', borderRadius: 999,
                      whiteSpace: 'nowrap',
                    }}>
                      {dateSeparatorLabel(item.dateStr)}
                    </span>
                    <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                  </div>
                );
              }

              const { msg, grouped } = item;
              const self = msg.userId === currentUser.id;
              const member = getMember(msg.userId);

              return (
                <div
                  key={item.key}
                  style={{
                    display: 'flex',
                    flexDirection: self ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    gap: 8,
                    marginTop: grouped ? 2 : 12,
                  }}
                >
                  {/* Avatar — others only, first in group */}
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
                      ) : (
                        <div style={{ width: 32 }} />
                      )}
                    </div>
                  )}

                  <div style={{
                    maxWidth: '65%',
                    display: 'flex', flexDirection: 'column',
                    alignItems: self ? 'flex-end' : 'flex-start',
                  }}>
                    {/* Name label — others, first in group */}
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
                        : (grouped ? '4px 18px 18px 18px' : '4px 18px 18px 18px'),
                      background: self ? 'var(--brand)' : 'var(--bg-secondary)',
                      color: self ? 'white' : 'var(--text-primary)',
                      fontSize: 14,
                      lineHeight: 1.5,
                      boxShadow: 'var(--shadow-sm)',
                      border: self ? 'none' : '1px solid var(--border)',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                    }}>
                      {msg.text}
                    </div>

                    {/* Time */}
                    <span style={{
                      fontSize: 10, color: 'var(--text-tertiary)',
                      marginTop: 3,
                      paddingLeft: self ? 0 : 4,
                      paddingRight: self ? 4 : 0,
                    }}>
                      {format(parseISO(msg.timestamp), 'h:mm a')}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: '10px 20px 14px',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        flexShrink: 0,
      }}>
        <div
          style={{
            display: 'flex', gap: 10, alignItems: 'flex-end',
            background: 'var(--bg-primary)',
            border: '1.5px solid var(--border)',
            borderRadius: 18,
            padding: '8px 8px 8px 16px',
            transition: 'border-color 0.15s',
          }}
          onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--brand)'}
          onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => {
              setText(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${activeTrip.name}…`}
            rows={1}
            style={{
              flex: 1,
              border: 'none', background: 'transparent',
              resize: 'none', fontSize: 14, lineHeight: 1.5,
              outline: 'none', fontFamily: 'var(--font)',
              color: 'var(--text-primary)',
              minHeight: 24, maxHeight: 120,
              padding: '2px 0',
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
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
