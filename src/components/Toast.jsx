import { useEffect, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { toastBus } from '../lib/toast';

const TYPE_STYLE = {
  success: { Icon: CheckCircle2, color: '#10b981', border: 'rgba(16,185,129,0.35)' },
  error:   { Icon: AlertTriangle, color: '#ef4444', border: 'rgba(239,68,68,0.35)' },
  info:    { Icon: Info, color: '#0f766e', border: 'rgba(15, 118, 110, 0.35)' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    return toastBus.subscribe(({ type, message, opts }) => {
      const id = Date.now() + Math.random();
      setToasts(prev => [...prev, { id, type, message }]);
      const duration = opts?.duration ?? 4000;
      if (duration > 0) setTimeout(() => dismiss(id), duration);
    });
  }, [dismiss]);

  return (
    <>
      {children}
      <div
        role="region"
        aria-label="Notifications"
        aria-live="polite"
        style={{
          position: 'fixed',
          top: 'calc(16px + env(safe-area-inset-top))',
          right: 16,
          display: 'flex', flexDirection: 'column', gap: 8,
          zIndex: 9999,
          maxWidth: 'min(360px, calc(100vw - 32px))',
          pointerEvents: 'none',
        }}
      >
        {toasts.map(t => {
          const cfg = TYPE_STYLE[t.type] || TYPE_STYLE.info;
          const { Icon } = cfg;
          return (
            <div
              key={t.id}
              role="alert"
              style={{
                pointerEvents: 'auto',
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '11px 12px 11px 14px',
                background: 'var(--bg-secondary, #fff)',
                border: `1px solid ${cfg.border}`,
                borderLeft: `3px solid ${cfg.color}`,
                borderRadius: 10,
                boxShadow: '0 10px 30px rgba(15,23,42,0.15)',
                animation: 'tsToastIn 0.22s ease',
              }}
            >
              <Icon size={17} color={cfg.color} style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ flex: 1, fontSize: 13, color: 'var(--text-primary, #0f172a)', lineHeight: 1.4 }}>
                {t.message}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss"
                style={{
                  background: 'none', border: 'none', padding: 2, cursor: 'pointer',
                  color: 'var(--text-tertiary, #94a3b8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
      <style>{`@keyframes tsToastIn { from { transform: translateX(16px); opacity: 0; } to { transform: none; opacity: 1; } }`}</style>
    </>
  );
}
