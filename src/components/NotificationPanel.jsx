import { useMemo, useState } from 'react';
import { useTrips } from '../context/TripContext';
import { X, ArrowRight, CheckCircle2, Bell, Copy, Check, AlertCircle } from 'lucide-react';

/** Greedy settlement algorithm — same logic as Budget.jsx */
function computeSettlements(expenses, members) {
  const bal = {};
  members.forEach(m => { bal[m.id] = 0; });
  expenses.forEach(exp => {
    if (!exp.splitAmong?.length) return;
    const share = exp.amount / exp.splitAmong.length;
    bal[exp.paidBy] = (bal[exp.paidBy] || 0) + exp.amount;
    exp.splitAmong.forEach(uid => {
      bal[uid] = (bal[uid] || 0) - share;
    });
  });

  const debtors = [], creditors = [];
  Object.entries(bal).forEach(([uid, amount]) => {
    if (amount < -0.01) debtors.push({ uid, amount: -amount });
    else if (amount > 0.01) creditors.push({ uid, amount });
  });
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const settlements = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const transfer = Math.min(debtors[i].amount, creditors[j].amount);
    if (transfer > 0.01) {
      settlements.push({ from: debtors[i].uid, to: creditors[j].uid, amount: transfer });
    }
    debtors[i].amount -= transfer;
    creditors[j].amount -= transfer;
    if (debtors[i].amount < 0.01) i++;
    if (creditors[j].amount < 0.01) j++;
  }
  return settlements;
}

function getMember(trip, uid) {
  return (trip.members || []).find(m => m.id === uid);
}

export default function NotificationPanel({ onClose }) {
  const { trips, markSettlementPaid, currentUser } = useTrips();
  const [copiedKey, setCopiedKey] = useState(null);

  // Compute all outstanding dues across every trip for the current user
  const { owedByMe, owedToMe } = useMemo(() => {
    const owedByMe = [];  // current user owes someone
    const owedToMe = [];  // someone owes current user
    const uid = currentUser?.id;
    if (!uid) return { owedByMe, owedToMe };

    trips.forEach(trip => {
      if (!trip.expenses?.length || !trip.members?.length) return;
      const settlements = computeSettlements(trip.expenses, trip.members);
      const paid = new Set((trip.paidSettlements || []).map(p => `${p.from}→${p.to}`));

      settlements.forEach(s => {
        const key = `${s.from}→${s.to}`;
        if (paid.has(key)) return;

        if (s.from === uid) {
          owedByMe.push({ ...s, trip });
        } else if (s.to === uid) {
          owedToMe.push({ ...s, trip });
        }
      });
    });

    return { owedByMe, owedToMe };
  }, [trips, currentUser]);

  const total = owedByMe.length + owedToMe.length;
  const totalOwed = owedByMe.reduce((sum, d) => sum + d.amount, 0);
  const totalDue  = owedToMe.reduce((sum, d) => sum + d.amount, 0);

  async function copyReminder(due) {
    const person = getMember(due.trip, due.from);
    const text = `Hey ${person?.name || 'there'}, just a reminder — you owe $${due.amount.toFixed(0)} for "${due.trip.name}". Let me know when you can send it over! 😊`;
    try { await navigator.clipboard.writeText(text); } catch { /* ignore */ }
    const key = `${due.from}→${due.to}→${due.trip.id}`;
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.3)',
          zIndex: 299,
          backdropFilter: 'blur(1px)',
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed',
        top: 0, right: 0, bottom: 0,
        width: 380,
        maxWidth: '100vw',
        background: 'white',
        zIndex: 300,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.12)',
        animation: 'slideInRight 0.22s ease',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: total > 0 ? '#fef2f2' : '#f0fdf4',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Bell size={18} style={{ color: total > 0 ? '#dc2626' : '#16a34a' }} />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>Payment Dues</h2>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 1 }}>
              {total === 0 ? 'All settled up!' : `${total} outstanding across ${trips.length} trip${trips.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 8,
              border: 'none', background: '#f1f5f9',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#64748b',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Summary strip */}
        {total > 0 && (
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            borderBottom: '1px solid #f1f5f9',
          }}>
            <div style={{ padding: '14px 20px', borderRight: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>You owe</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: '#dc2626', marginTop: 2 }}>
                ${totalOwed.toFixed(0)}
              </p>
            </div>
            <div style={{ padding: '14px 20px' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Owed to you</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: '#16a34a', marginTop: 2 }}>
                ${totalDue.toFixed(0)}
              </p>
            </div>
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
          {total === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: '#f0fdf4',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <CheckCircle2 size={32} style={{ color: '#16a34a' }} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>All Settled Up!</h3>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
                No outstanding payments across any of your trips. Great job keeping up!
              </p>
            </div>
          ) : (
            <>
              {/* You owe */}
              {owedByMe.length > 0 && (
                <Section
                  title="You Owe"
                  count={owedByMe.length}
                  accent="#dc2626"
                  bg="#fef2f2"
                  icon={<AlertCircle size={14} style={{ color: '#dc2626' }} />}
                >
                  {owedByMe.map((due, i) => {
                    const to = getMember(due.trip, due.to);
                    return (
                      <DueCard
                        key={i}
                        avatarColor={to?.color}
                        avatarLetter={to?.name?.[0]}
                        name={to?.name || 'Unknown'}
                        tripName={due.trip.name}
                        amount={due.amount}
                        amountColor="#dc2626"
                        action={
                          <button
                            onClick={() => markSettlementPaid(due.trip.id, due.from, due.to)}
                            className="btn btn-sm"
                            style={{ background: '#dcfce7', color: '#16a34a', border: 'none', fontSize: 11, padding: '4px 10px' }}
                          >
                            <CheckCircle2 size={12} /> Mark Paid
                          </button>
                        }
                        label="Pay to"
                      />
                    );
                  })}
                </Section>
              )}

              {/* Owed to you */}
              {owedToMe.length > 0 && (
                <Section
                  title="Owed to You"
                  count={owedToMe.length}
                  accent="#16a34a"
                  bg="#f0fdf4"
                  icon={<CheckCircle2 size={14} style={{ color: '#16a34a' }} />}
                >
                  {owedToMe.map((due, i) => {
                    const from = getMember(due.trip, due.from);
                    const key = `${due.from}→${due.to}→${due.trip.id}`;
                    const copied = copiedKey === key;
                    return (
                      <DueCard
                        key={i}
                        avatarColor={from?.color}
                        avatarLetter={from?.name?.[0]}
                        name={from?.name || 'Unknown'}
                        tripName={due.trip.name}
                        amount={due.amount}
                        amountColor="#16a34a"
                        label="Collect from"
                        action={
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              onClick={() => copyReminder(due)}
                              className="btn btn-sm"
                              style={{
                                background: copied ? '#dcfce7' : '#f1f5f9',
                                color: copied ? '#16a34a' : '#64748b',
                                border: 'none', fontSize: 11, padding: '4px 10px',
                              }}
                            >
                              {copied ? <Check size={12} /> : <Copy size={12} />}
                              {copied ? 'Copied!' : 'Remind'}
                            </button>
                            <button
                              onClick={() => markSettlementPaid(due.trip.id, due.from, due.to)}
                              className="btn btn-sm"
                              style={{ background: '#dcfce7', color: '#16a34a', border: 'none', fontSize: 11, padding: '4px 10px' }}
                            >
                              <CheckCircle2 size={12} /> Received
                            </button>
                          </div>
                        }
                      />
                    );
                  })}
                </Section>
              )}
            </>
          )}
        </div>

        {/* Footer note */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid #f1f5f9',
          fontSize: 11, color: '#94a3b8', textAlign: 'center', lineHeight: 1.5,
        }}>
          "Mark Paid" records the payment locally. Amounts are auto-calculated from your expense splits.
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);   opacity: 1; }
        }
      `}</style>
    </>
  );
}

function Section({ title, count, accent, bg, icon, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 10px', borderRadius: 8,
        background: bg, marginBottom: 8,
      }}>
        {icon}
        <span style={{ fontSize: 12, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
          {title}
        </span>
        <span style={{
          marginLeft: 'auto',
          background: accent, color: 'white',
          fontSize: 11, fontWeight: 700,
          padding: '1px 7px', borderRadius: 999,
        }}>
          {count}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {children}
      </div>
    </div>
  );
}

function DueCard({ avatarColor, avatarLetter, name, tripName, amount, amountColor, label, action }) {
  return (
    <div style={{
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: 12,
      padding: '12px 14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: avatarColor || '#2563eb', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 700, flexShrink: 0,
        }}>
          {avatarLetter}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{name}</span>
            <ArrowRight size={11} style={{ color: '#94a3b8', flexShrink: 0 }} />
            <span style={{ fontSize: 20, fontWeight: 800, color: amountColor }}>${amount.toFixed(0)}</span>
          </div>
          <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>
            {label} · {tripName}
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {action}
      </div>
    </div>
  );
}
