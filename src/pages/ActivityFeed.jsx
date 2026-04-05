import { useTrips } from '../context/TripContext';
import { getMemberById } from '../data/sampleData';
import {
  Activity, MessageCircle, Vote, Wallet, Map, Users,
  Calendar, Clock, Plus, Bell
} from 'lucide-react';
import { format, parseISO, formatDistanceToNow } from 'date-fns';

export default function ActivityFeed() {
  const { activeTrip } = useTrips();

  if (!activeTrip) {
    return (
      <>
        <div className="page-header"><h1>Activity Feed</h1><p>Select a trip first</p></div>
        <div className="page-body">
          <div className="empty-state">
            <Activity className="empty-icon" />
            <h3>No trip selected</h3>
            <p>Go to Dashboard and select a trip to see its activity.</p>
          </div>
        </div>
      </>
    );
  }

  const activities = [...(activeTrip.activity || [])].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  function getActionIcon(action) {
    if (action.includes('created the trip') || action.includes('joined')) return Users;
    if (action.includes('voted') || action.includes('poll')) return Vote;
    if (action.includes('expense')) return Wallet;
    if (action.includes('itinerary')) return Map;
    return Activity;
  }

  function getActionColor(action) {
    if (action.includes('created the trip')) return 'var(--brand)';
    if (action.includes('joined')) return 'var(--success)';
    if (action.includes('voted') || action.includes('poll')) return 'var(--purple)';
    if (action.includes('expense')) return 'var(--orange)';
    if (action.includes('itinerary')) return 'var(--teal)';
    return 'var(--text-tertiary)';
  }

  // Group by date
  const grouped = {};
  activities.forEach(act => {
    if (!act.timestamp) return;
    const dateKey = format(parseISO(act.timestamp), 'yyyy-MM-dd');
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(act);
  });

  return (
    <>
      <div className="page-header">
        <h1>Activity Feed</h1>
        <p>{activeTrip.name} — {activities.length} events</p>
      </div>

      <div className="page-body">
        {activities.length === 0 ? (
          <div className="empty-state">
            <Activity className="empty-icon" />
            <h3>No activity yet</h3>
            <p>Actions by trip members will appear here in real time.</p>
          </div>
        ) : (
          <div style={{ maxWidth: 640 }}>
            {Object.entries(grouped).map(([dateKey, acts]) => (
              <div key={dateKey} style={{ marginBottom: 24 }}>
                <div style={{
                  fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)',
                  textTransform: 'uppercase', letterSpacing: 0.5,
                  marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <Calendar size={12} />
                  {format(parseISO(dateKey), 'EEEE, MMM d, yyyy')}
                </div>

                <div style={{ position: 'relative', paddingLeft: 28 }}>
                  {/* Timeline line */}
                  <div style={{
                    position: 'absolute', left: 9, top: 0, bottom: 0,
                    width: 2, background: 'var(--border-light)',
                  }} />

                  {acts.map((act) => {
                    const member = getMemberById(activeTrip, act.user);
                    const Icon = getActionIcon(act.action);
                    const color = getActionColor(act.action);

                    return (
                      <div key={act.id} style={{
                        position: 'relative',
                        marginBottom: 12,
                      }}>
                        {/* Timeline dot */}
                        <div style={{
                          position: 'absolute', left: -24, top: 6,
                          width: 12, height: 12, borderRadius: '50%',
                          background: color,
                          border: '2px solid var(--bg-primary)',
                        }} />

                        <div style={{
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-light)',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div className="user-avatar" style={{
                              background: member?.color || '#999', width: 24, height: 24, fontSize: 10,
                            }}>
                              {member?.name[0] || '?'}
                            </div>
                            <span style={{ fontWeight: 600, fontSize: 13 }}>{member?.name || 'Unknown'}</span>
                            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{act.action}</span>
                            <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                              {format(parseISO(act.timestamp), 'h:mm a')}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
