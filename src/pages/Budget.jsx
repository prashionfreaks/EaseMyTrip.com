import { useState, useMemo } from 'react';
import { useTrips } from '../context/TripContext';
import Modal from '../components/Modal';
import { toast } from '../lib/toast';
import { getMemberById } from '../data/sampleData';
import {
  Plus, Wallet, Users, ArrowRight,
  Plane, Hotel, UtensilsCrossed, Ticket, ShoppingBag, Receipt,
  PieChart, CheckCircle2, AlertCircle, Pencil, Trash2,
} from 'lucide-react';
import { format, parseISO } from '../lib/date';
import { getTripCurrencySymbol, getTripCurrencyCode } from '../lib/itinerary';
import { isSettlementPaid } from '../lib/settlement';

const initial = '?';
const safeInitial = (s) => (s && s.length ? s[0] : initial);

const categories = [
  { id: 'transport', label: 'Transport', icon: Plane, color: 'var(--brand)' },
  { id: 'accommodation', label: 'Accommodation', icon: Hotel, color: 'var(--purple)' },
  { id: 'food', label: 'Food & Drink', icon: UtensilsCrossed, color: 'var(--orange)' },
  { id: 'activities', label: 'Activities', icon: Ticket, color: 'var(--teal)' },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'var(--warning)' },
  { id: 'other', label: 'Other', icon: Receipt, color: 'var(--text-tertiary)' },
];

export default function Budget() {
  const { activeTrip, addExpense, updateExpense, deleteExpense, markSettlementPaid, updateTrip, currentUser } = useTrips();
  const [showAdd, setShowAdd] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState(null); // id of expense being edited (or null)
  const [view, setView] = useState('overview');
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');
  const [newExpense, setNewExpense] = useState({
    title: '', amount: '', category: 'transport', paidBy: currentUser?.id || '',
    splitAmong: [], date: new Date().toISOString().split('T')[0],
  });

  // ──────────────────────────────────────────────────────────────────────
  // IMPORTANT: every hook below this point must be called unconditionally
  // — React's rules-of-hooks. The early-return for `!activeTrip` happens
  // AFTER all hooks. Otherwise a transition (sign-out, trip deletion via
  // realtime, etc.) flips the hook count and React throws / blanks the UI.
  // ──────────────────────────────────────────────────────────────────────
  // parseTrip() at the ingest boundary guarantees budget.total/spent are
  // numbers and expenses[].amount is a number — see TripContext.parseTrip.
  // We can read these directly without per-call coercion.
  const budget = activeTrip?.budget || { total: 0, spent: 0, currency: 'INR' };
  const expenses = activeTrip?.expenses || [];
  const members = activeTrip?.members || [];
  const sym = getTripCurrencySymbol(activeTrip);
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget.total - totalSpent;
  const pct = budget.total > 0 ? (totalSpent / budget.total) * 100 : 0;

  // Calculate balances + per-member paid/share breakdown
  const { balances, memberPaid, memberShare } = useMemo(() => {
    const bal = {}, paid = {}, share = {};
    members.forEach(m => { bal[m.id] = 0; paid[m.id] = 0; share[m.id] = 0; });
    expenses.forEach(exp => {
      if (!exp.splitAmong?.length) return;
      const perHead = exp.amount / exp.splitAmong.length;
      paid[exp.paidBy] = (paid[exp.paidBy] || 0) + exp.amount;
      bal[exp.paidBy]  = (bal[exp.paidBy]  || 0) + exp.amount;
      exp.splitAmong.forEach(uid => {
        share[uid] = (share[uid] || 0) + perHead;
        bal[uid]   = (bal[uid]   || 0) - perHead;
      });
    });
    return { balances: bal, memberPaid: paid, memberShare: share };
  }, [expenses, members]);

  // Calculate settlements
  const settlements = useMemo(() => {
    const debts = [];
    const debtors = [];
    const creditors = [];
    Object.entries(balances).forEach(([uid, amount]) => {
      if (amount < -0.01) debtors.push({ uid, amount: -amount });
      else if (amount > 0.01) creditors.push({ uid, amount });
    });
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const transfer = Math.min(debtors[i].amount, creditors[j].amount);
      if (transfer > 0.01) {
        debts.push({ from: debtors[i].uid, to: creditors[j].uid, amount: transfer });
      }
      debtors[i].amount -= transfer;
      creditors[j].amount -= transfer;
      if (debtors[i].amount < 0.01) i++;
      if (creditors[j].amount < 0.01) j++;
    }
    return debts;
  }, [balances]);

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const breakdown = {};
    categories.forEach(c => { breakdown[c.id] = 0; });
    expenses.forEach(exp => {
      breakdown[exp.category] = (breakdown[exp.category] || 0) + exp.amount;
    });
    return breakdown;
  }, [expenses]);

  if (!activeTrip) {
    return (
      <>
        <div className="page-header"><h1>Budget & Expenses</h1><p>Select a trip first</p></div>
        <div className="page-body">
          <div className="empty-state">
            <Wallet className="empty-icon" />
            <h3>No trip selected</h3>
            <p>Go to Dashboard and select a trip to manage expenses.</p>
          </div>
        </div>
      </>
    );
  }

  // Pick a paidBy default that's actually a real member id, falling through
  // current user → first member → '' (only if the trip is empty).
  function defaultPaidBy() {
    if (currentUser?.id && members.some(m => m.id === currentUser.id)) return currentUser.id;
    return members[0]?.id || '';
  }

  function resetExpenseForm() {
    setNewExpense({
      title: '', amount: '', category: 'transport',
      paidBy: defaultPaidBy(), splitAmong: [],
      date: new Date().toISOString().split('T')[0],
    });
    setEditingExpenseId(null);
  }

  function openAddExpense() {
    resetExpenseForm();
    setShowAdd(true);
  }

  function openEditExpense(exp) {
    setNewExpense({
      title: exp.title || '',
      amount: String(exp.amount ?? ''),
      category: exp.category || 'transport',
      paidBy: exp.paidBy || defaultPaidBy(),
      splitAmong: Array.isArray(exp.splitAmong) ? [...exp.splitAmong] : [],
      date: exp.date || new Date().toISOString().split('T')[0],
    });
    setEditingExpenseId(exp.id);
    setShowAdd(true);
  }

  function handleSaveExpense() {
    const title = (newExpense.title || '').trim();
    if (!title) { toast.error('Give the expense a name first.'); return; }
    const amount = Number(newExpense.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Enter an amount greater than 0.');
      return;
    }
    if (!members.length) { toast.error('Add members to the trip first.'); return; }
    const paidBy = newExpense.paidBy || defaultPaidBy();
    if (!paidBy) { toast.error("Pick who paid for this expense."); return; }
    const splitAmong = newExpense.splitAmong.length > 0
      ? newExpense.splitAmong
      : members.map(m => m.id);
    const payload = {
      ...newExpense,
      title, amount, paidBy, splitAmong,
    };

    if (editingExpenseId) {
      updateExpense(activeTrip.id, editingExpenseId, payload);
      toast.success('Expense updated');
    } else {
      addExpense(activeTrip.id, payload);
      toast.success('Expense added');
    }
    resetExpenseForm();
    setShowAdd(false);
  }

  function handleDeleteExpense(exp) {
    if (!window.confirm(`Delete "${exp.title}"? This can't be undone.`)) return;
    deleteExpense(activeTrip.id, exp.id);
  }

  return (
    <>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1>Budget & Expenses</h1>
          <p>{activeTrip.name} — {expenses.length} expenses tracked</p>
        </div>
        <button className="btn btn-primary" onClick={openAddExpense}>
          <Plus size={16} /> Add Expense
        </button>
      </div>

      <div className="tab-nav">
        {['overview', 'expenses', 'settlements'].map(tab => (
          <button key={tab} className={`tab-btn ${view === tab ? 'active' : ''}`} onClick={() => setView(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="page-body">
        {view === 'overview' && (
          <>
            {/* Budget summary cards */}
            <div className="grid-3" style={{ marginBottom: 24 }}>
              <div className="card" style={{ cursor: 'pointer' }} onClick={() => {
                if (!editingBudget) { setBudgetInput(String(budget.total || '')); setEditingBudget(true); }
              }}>
                <div className="card-body">
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Total Budget {!editingBudget && <span style={{ fontSize: 10, color: 'var(--brand)' }}>(click to edit)</span>}</p>
                  {editingBudget ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }} onClick={e => e.stopPropagation()}>
                      <span style={{ fontSize: 20, fontWeight: 800 }}>{sym}</span>
                      <input
                        className="form-input"
                        type="number"
                        value={budgetInput}
                        onChange={e => setBudgetInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            updateTrip(activeTrip.id, t => ({ ...t, budget: { ...t.budget, total: Number(budgetInput) || 0 } }));
                            setEditingBudget(false);
                          } else if (e.key === 'Escape') setEditingBudget(false);
                        }}
                        autoFocus
                        style={{ fontSize: 20, fontWeight: 800, padding: '4px 8px', width: 160 }}
                      />
                      <button className="btn btn-primary btn-sm" onClick={() => {
                        updateTrip(activeTrip.id, t => ({ ...t, budget: { ...t.budget, total: Number(budgetInput) || 0 } }));
                        setEditingBudget(false);
                      }}>Save</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setEditingBudget(false)}>Cancel</button>
                    </div>
                  ) : (
                    <>
                      <p style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1 }}>{sym}{budget.total.toLocaleString()}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        {sym}{members.length > 0 ? (budget.total / members.length).toLocaleString() : 0} per person
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Spent</p>
                  <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--danger)', letterSpacing: -1 }}>{sym}{totalSpent.toLocaleString()}</p>
                  <div className="progress-bar" style={{ marginTop: 8 }}>
                    <div className="progress-fill" style={{
                      width: `${pct}%`,
                      background: pct > 80 ? 'var(--danger)' : pct > 50 ? 'var(--warning)' : 'var(--success)',
                    }} />
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>{Math.round(pct)}% of budget</p>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Remaining</p>
                  <p style={{ fontSize: 28, fontWeight: 800, color: remaining > 0 ? 'var(--success)' : 'var(--danger)', letterSpacing: -1 }}>
                    {sym}{remaining.toLocaleString()}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {sym}{members.length > 0 ? (remaining / members.length).toLocaleString() : 0} per person left
                  </p>
                </div>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-header">
                <h3><PieChart size={16} style={{ display: 'inline', verticalAlign: -3 }} /> Spending by Category</h3>
              </div>
              <div className="card-body">
                {categories.map(cat => {
                  const amount = categoryBreakdown[cat.id] || 0;
                  const catPct = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
                  const Icon = cat.icon;
                  if (amount === 0) return null;
                  return (
                    <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                        background: cat.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={16} style={{ color: cat.color }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{cat.label}</span>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{sym}{amount.toLocaleString()}</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${catPct}%`, background: cat.color }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Member balances */}
            {(() => {
              const creditors = members.filter(m => (balances[m.id] || 0) > 0.01);
              const debtors   = members.filter(m => (balances[m.id] || 0) < -0.01);
              const settled   = members.filter(m => Math.abs(balances[m.id] || 0) <= 0.01);

              const MemberRow = ({ member, section }) => {
                const balance = balances[member.id] || 0;
                const paid    = memberPaid[member.id]  || 0;
                const owed    = memberShare[member.id] || 0;
                const isCreditor = section === 'paid';
                return (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border-light)',
                    background: isCreditor ? 'rgba(16,185,129,0.03)' : section === 'outstanding' ? 'rgba(239,68,68,0.03)' : 'transparent',
                  }}>
                    <div className="user-avatar" style={{ background: member.color, flexShrink: 0 }}>{safeInitial(member.name)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{member.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 1 }}>
                        Paid {sym}{paid.toFixed(0)} · Share {sym}{owed.toFixed(0)}
                      </p>
                    </div>
                    {section === 'paid' && (
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--success)' }}>
                          +{sym}{Math.abs(balance).toFixed(0)}
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--success)', opacity: 0.8 }}>to receive</p>
                      </div>
                    )}
                    {section === 'outstanding' && (
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--danger)' }}>
                          −{sym}{Math.abs(balance).toFixed(0)}
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--danger)', opacity: 0.8 }}>to pay</p>
                      </div>
                    )}
                    {section === 'settled' && (
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle2 size={13} style={{ color: 'var(--success)' }} /> Settled
                      </span>
                    )}
                  </div>
                );
              };

              return (
                <div className="card" style={{ overflow: 'hidden' }}>
                  <div className="card-header">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Users size={16} /> Member Balances
                    </h3>
                  </div>

                  {expenses.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>
                      Add expenses to see member balances.
                    </div>
                  ) : (
                    <>
                      {/* Paid section */}
                      {creditors.length > 0 && (
                        <div>
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '8px 16px',
                            background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(5,150,105,0.05))',
                            borderTop: '1px solid rgba(16,185,129,0.2)',
                            borderBottom: '1px solid rgba(16,185,129,0.15)',
                          }}>
                            <CheckCircle2 size={13} style={{ color: 'var(--success)' }} />
                            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                              Paid — will receive money
                            </span>
                          </div>
                          {creditors.map(m => <MemberRow key={m.id} member={m} section="paid" />)}
                        </div>
                      )}

                      {/* Outstanding section */}
                      {debtors.length > 0 && (
                        <div>
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '8px 16px',
                            background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(220,38,38,0.04))',
                            borderTop: '1px solid rgba(239,68,68,0.2)',
                            borderBottom: '1px solid rgba(239,68,68,0.15)',
                          }}>
                            <AlertCircle size={13} style={{ color: 'var(--danger)' }} />
                            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                              Outstanding — needs to pay
                            </span>
                          </div>
                          {debtors.map(m => <MemberRow key={m.id} member={m} section="outstanding" />)}
                        </div>
                      )}

                      {/* Settled section */}
                      {settled.length > 0 && (
                        <div>
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '8px 16px',
                            background: 'var(--bg-tertiary)',
                            borderTop: '1px solid var(--border-light)',
                            borderBottom: '1px solid var(--border-light)',
                          }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                              Settled up
                            </span>
                          </div>
                          {settled.map(m => <MemberRow key={m.id} member={m} section="settled" />)}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })()}
          </>
        )}

        {view === 'expenses' && (
          <div className="card">
            <div className="card-body" style={{ padding: 0 }}>
              {expenses.length === 0 ? (
                <div className="empty-state">
                  <Receipt className="empty-icon" />
                  <h3>No expenses yet</h3>
                  <p>Start tracking your trip expenses.</p>
                  <button className="btn btn-primary" onClick={openAddExpense}>
                    <Plus size={16} /> Add First Expense
                  </button>
                </div>
              ) : (
                expenses.map((exp, i) => {
                  const cat = categories.find(c => c.id === exp.category) || categories[5];
                  const Icon = cat.icon;
                  const payer = getMemberById(activeTrip, exp.paidBy);
                  return (
                    <div key={exp.id} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '14px 20px',
                      borderBottom: i < expenses.length - 1 ? '1px solid var(--border-light)' : 'none',
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                        background: cat.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={16} style={{ color: cat.color }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 500, fontSize: 14 }}>{exp.title}</p>
                        <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                          Paid by {payer?.name || 'Unknown'} · Split {(exp.splitAmong || []).length} ways{exp.date ? ` · ${format(parseISO(exp.date), 'MMM d')}` : ''}
                        </p>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 15 }}>{sym}{exp.amount.toLocaleString()}</span>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          onClick={() => openEditExpense(exp)}
                          title="Edit expense"
                          style={{
                            width: 30, height: 30, borderRadius: 8, border: '1px solid var(--border)',
                            background: 'var(--bg-secondary)', color: 'var(--text-secondary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(exp)}
                          title="Delete expense"
                          style={{
                            width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(220,38,38,0.25)',
                            background: 'rgba(254,242,242,1)', color: '#dc2626',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {view === 'settlements' && (
          <div className="card">
            <div className="card-header">
              <h3>Who Owes Whom</h3>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Simplified debts</span>
            </div>
            <div className="card-body">
              {settlements.length === 0 ? (
                <div className="empty-state" style={{ padding: 24 }}>
                  <h3>All settled up!</h3>
                  <p>No outstanding balances between group members.</p>
                </div>
              ) : (
                settlements.map((s, i) => {
                  const from = getMemberById(activeTrip, s.from);
                  const to = getMemberById(activeTrip, s.to);
                  // Snapshot-based: a payment counts only if its expense
                  // snapshot still matches the current expense set. Adding
                  // an expense invalidates older paid records for the same
                  // direction so they don't auto-satisfy a fresh settlement.
                  const isPaid = isSettlementPaid(activeTrip, s);
                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '14px 0',
                      borderBottom: i < settlements.length - 1 ? '1px solid var(--border-light)' : 'none',
                      opacity: isPaid ? 0.55 : 1,
                    }}>
                      <div className="user-avatar" style={{ background: from?.color }}>{safeInitial(from?.name)}</div>
                      <span style={{ fontWeight: 500, fontSize: 14, textDecoration: isPaid ? 'line-through' : 'none' }}>{from?.name || 'Removed member'}</span>
                      <ArrowRight size={16} style={{ color: 'var(--text-tertiary)' }} />
                      <div className="user-avatar" style={{ background: to?.color }}>{safeInitial(to?.name)}</div>
                      <span style={{ fontWeight: 500, fontSize: 14, textDecoration: isPaid ? 'line-through' : 'none' }}>{to?.name || 'Removed member'}</span>
                      <span style={{
                        fontWeight: 700, fontSize: 16,
                        color: isPaid ? 'var(--success)' : 'var(--danger)',
                        textDecoration: isPaid ? 'line-through' : 'none',
                      }}>
                        {sym}{s.amount.toFixed(0)}
                      </span>
                      <button
                        onClick={() => !isPaid && markSettlementPaid(activeTrip.id, s.from, s.to, s.amount)}
                        style={{
                          marginLeft: 'auto',
                          display: 'flex', alignItems: 'center', gap: 5,
                          padding: '5px 12px', borderRadius: 'var(--radius-full)',
                          fontSize: 12, fontWeight: 600, cursor: isPaid ? 'default' : 'pointer',
                          border: 'none',
                          background: isPaid ? 'rgba(16,185,129,0.12)' : 'rgba(16,185,129,0.08)',
                          color: isPaid ? 'var(--success)' : 'var(--text-secondary)',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { if (!isPaid) e.currentTarget.style.background = 'rgba(16,185,129,0.18)'; }}
                        onMouseLeave={e => { if (!isPaid) e.currentTarget.style.background = 'rgba(16,185,129,0.08)'; }}
                      >
                        <CheckCircle2 size={13} />
                        {isPaid ? 'Paid' : 'Mark Paid'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit expense modal */}
      {showAdd && (
        <Modal
          title={editingExpenseId ? 'Edit Expense' : 'Add Expense'}
          onClose={() => { setShowAdd(false); resetExpenseForm(); }}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => { setShowAdd(false); resetExpenseForm(); }}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveExpense}>
                {editingExpenseId ? 'Save Changes' : 'Add Expense'}
              </button>
            </>
          }
        >
          <div className="form-group">
            <label className="form-label">Description</label>
            <input className="form-input" placeholder="e.g. Dinner at Ichiran" value={newExpense.title}
              onChange={e => setNewExpense(p => ({ ...p, title: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Amount ({getTripCurrencyCode(activeTrip)})</label>
              <input className="form-input" type="number" placeholder="0.00" value={newExpense.amount}
                onChange={e => setNewExpense(p => ({ ...p, amount: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input" value={newExpense.category}
                onChange={e => setNewExpense(p => ({ ...p, category: e.target.value }))}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Paid By</label>
              <select className="form-input" value={newExpense.paidBy}
                onChange={e => setNewExpense(p => ({ ...p, paidBy: e.target.value }))}>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input className="form-input" type="date" value={newExpense.date}
                onChange={e => setNewExpense(p => ({ ...p, date: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Split Among (leave empty for all)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {members.map(m => {
                const selected = newExpense.splitAmong.includes(m.id);
                return (
                  <button
                    key={m.id}
                    className={`btn btn-sm ${selected ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setNewExpense(p => ({
                      ...p,
                      splitAmong: selected ? p.splitAmong.filter(id => id !== m.id) : [...p.splitAmong, m.id],
                    }))}
                  >
                    {m.name}
                  </button>
                );
              })}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
