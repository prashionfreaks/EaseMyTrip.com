export function Skeleton({ width = '100%', height = 16, rounded = 6, style }) {
  return (
    <div
      style={{
        width, height, borderRadius: rounded,
        background:
          'linear-gradient(90deg, rgba(148,163,184,0.15) 0%, rgba(148,163,184,0.28) 50%, rgba(148,163,184,0.15) 100%)',
        backgroundSize: '200% 100%',
        animation: 'skShimmer 1.4s ease-in-out infinite',
        ...style,
      }}
    />
  );
}

export function TripCardSkeleton() {
  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: 14, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <Skeleton height={150} rounded={0} />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Skeleton height={18} width="65%" />
        <Skeleton height={13} width="45%" />
        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
          <Skeleton height={22} width={70} rounded={11} />
          <Skeleton height={22} width={56} rounded={11} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonStyles() {
  return <style>{`@keyframes skShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>;
}
