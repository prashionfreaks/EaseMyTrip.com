import { Component } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

// Stale lazy-chunk after a deploy is the main reason this exists: the user
// had an old bundle open, Vercel shipped new chunk filenames, and the next
// route navigation tries to import a path that no longer exists. We detect
// that case and reload once. The sessionStorage flag prevents an infinite
// reload loop if a reload doesn't actually fix it (real broken deploy).
const RELOAD_FLAG = 'tripsync-chunk-reload-attempted';

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
      const already = sessionStorage.getItem(RELOAD_FLAG);
      if (!already) {
        sessionStorage.setItem(RELOAD_FLAG, '1');
        window.location.reload();
        return;
      }
    }
  }

  handleReload = () => {
    sessionStorage.removeItem(RELOAD_FLAG);
    window.location.reload();
  };

  render() {
    const { error } = this.state;
    if (!error) {
      // Clear the one-shot reload flag on a successful render so future stale
      // chunks (next deploy) get their own retry.
      if (sessionStorage.getItem(RELOAD_FLAG)) sessionStorage.removeItem(RELOAD_FLAG);
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
