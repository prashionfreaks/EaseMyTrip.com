// Settlement-paid resolution.
//
// `paidSettlements` is a ledger of "I marked this debt as settled at time T."
// The naive check — "is there any entry matching from→to?" or "does the sum
// of paid amounts cover the current settlement?" — both auto-mark new
// settlements as paid whenever the user adds an expense that reshapes the
// balance.
//
// The right model: each markSettlementPaid stamps `expenseSnapshot` (a
// sorted array of expense IDs at payment time). A payment is valid for
// the current view only if that snapshot still matches the current expense
// set. Adding/editing/deleting any expense invalidates the snapshot and
// the settlement becomes unpaid again until re-marked.

export function snapshotKey(expenses) {
  return (expenses || []).map(e => e.id).sort().join(',');
}

/** True if this paidSettlements entry still satisfies the current state. */
export function isPaymentValid(payment, currentSnapshot, currentAmount) {
  if (!payment) return false;
  // New-style entry: snapshot must match current expense set.
  if (Array.isArray(payment.expenseSnapshot)) {
    return payment.expenseSnapshot.slice().sort().join(',') === currentSnapshot;
  }
  // Legacy null sentinel — pre-amount-tracking "marked paid" rows. Honor
  // them so existing data doesn't suddenly show as unpaid.
  if (payment.amount == null) return true;
  // Legacy entry with an amount but no snapshot. Honor it only if the
  // amount matches the current settlement within a small tolerance — that
  // way users whose expenses haven't changed since marking paid keep their
  // state, but a stale record from before an expense edit is rejected.
  return Math.abs(payment.amount - currentAmount) < 0.5;
}

/** Whether a given current-state settlement is paid for this trip. */
export function isSettlementPaid(trip, settlement) {
  if (!trip || !settlement) return false;
  const snap = snapshotKey(trip.expenses);
  return (trip.paidSettlements || [])
    .filter(p => p.from === settlement.from && p.to === settlement.to)
    .some(p => isPaymentValid(p, snap, settlement.amount));
}
