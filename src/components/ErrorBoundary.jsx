import { Component } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

// Stale lazy-chunk after a deploy is the main reason this exists: the user
// had an old bundle open, Vercel shipped new chunk filenames, and the next
// route navigation tries to import a path that no longer exists. We detect
// that case and reload once.
//
// The guard is a TIMESTAMP, not a boolean. Earlier we cleared a boolean flag
// in render() on the assumption that a successful render meant the chunk
// loaded — but render() runs while <Suspense> is still showing the fallback,
// before the lazy import has even had a chance to fail. The cleared flag
// then never stopped the next chunk failure from triggering another reload
// → infinite refresh loop on every page load.
//
// Timestamp scheme: on chunk error, only reload if the last reload was more
// than RELOAD_GUARD_MS ago. After a reload, if the same chunk fails again
// within 5 s, we know the reload didn't help (genuinely broken deploy) and
// show the error card instead of looping. The flag self-expires, so the
// NEXT deploy's chunk failures (minutes/hours later) automatically get a
// fresh retry budget — no explicit clear needed.
const RELOAD_FLAG = 'tripsync-chunk-reload-ts';
const RELOAD_GUARD_MS = 5000;

function isChunkLoadError(err) {
  if (!err) return false;
  const msg = String(err.message || err);
  return (
    err.name === 'ChunkLoadError' ||
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('error loading dynamically imported module') ||
    msg.includes("Importing a module script failed")
  );
}

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info?.componentStack);

    if (isChunkLoadError(error)) {
      const last = Number(sessionStorage.getItem(RELOAD_FLAG)) || 0;
      if (Date.now() - last > RELOAD_GUARD_MS) {
        sessionStorage.setItem(RELOAD_FLAG, String(Date.now()));
        window.location.reload();
        return;
      }
      // Last reload was too recent — it didn't fix things. Fall through to
      // render the error card so the user isn't stuck in an infinite loop.
    }
  }

  handleReload = () => {
    sessionStorage.removeItem(RELOAD_FLAG);
    window.location.reload();
  };

  render() {
    const { error } = this.state;
    if (!error) {
      return this.props.children;
    }

    const isChunk = isChunkLoadError(error);

    return (
      <div style={{
        minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}>
        <div style={{
          maxWidth: 480, width: '100%',
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          borderRadius: 16, padding: '28px 24px',
          textAlign: 'center',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(248,113,113,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <AlertTriangle size={28} color="#ef4444" />
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
            {isChunk ? 'Update available' : 'Something went wrong'}
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 18, lineHeight: 1.5 }}>
            {isChunk
              ? 'A newer version of LetsWander is live. Reload to pick it up.'
              : 'The page hit an unexpected error. Reloading usually fixes it — if it keeps happening, let us know.'}
          </p>
          {!isChunk && error?.message && (
            <pre style={{
              textAlign: 'left',
              fontSize: 12, color: 'var(--text-tertiary)',
              background: 'var(--bg-accent)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '10px 12px', marginBottom: 18,
              maxHeight: 120, overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            }}>
              {String(error.message)}
            </pre>
          )}
          <button
            onClick={this.handleReload}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 18px', borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg, #722f37, #b8860b)',
              color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}
          >
            <RefreshCw size={16} /> Reload
          </button>
        </div>
      </div>
    );
  }
}
