const listeners = new Set();
let queue = [];

function push(type, message, opts) {
  const evt = { type, message, opts: opts || {} };
  if (listeners.size === 0) { queue.push(evt); return; }
  listeners.forEach(fn => fn(evt));
}

export const toastBus = {
  subscribe(fn) {
    listeners.add(fn);
    if (queue.length) { queue.forEach(fn); queue = []; }
    return () => listeners.delete(fn);
  },
};

export const toast = {
  success: (m, o) => push('success', m, o),
  error:   (m, o) => push('error', m, o),
  info:    (m, o) => push('info', m, o),
};
