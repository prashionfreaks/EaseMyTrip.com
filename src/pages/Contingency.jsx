import { useState } from 'react';
import { useTrips } from '../context/TripContext';
import Modal from '../components/Modal';
import {
  ShieldAlert, Plus, Plane, CloudRain, Heart, AlertTriangle,
  CheckCircle2, Clock, FileText, MapPin
} from 'lucide-react';

const typeConfig = {
  flight_delay: { icon: Plane, color: 'var(--brand)', label: 'Flight Disruption' },
  weather: { icon: CloudRain, color: 'var(--teal)', label: 'Weather' },
  health: { icon: Heart, color: 'var(--danger)', label: 'Health & Safety' },
  accommodation: { icon: MapPin, color: 'var(--purple)', label: 'Accommodation' },
  general: { icon: AlertTriangle, color: 'var(--warning)', label: 'General' },
};

const statusConfig = {
  prepared: { label: 'Prepared', badge: 'badge-green', icon: CheckCircle2 },
  pending: { label: 'Needs Action', badge: 'badge-yellow', icon: Clock },
  activated: { label: 'Activated', badge: 'badge-red', icon: AlertTriangle },
};

export default function Contingency() {
  const { activeTrip, addContingency, updateTrip } = useTrips();
  const [showAdd, setShowAdd] = useState(false);
  const [newPlan, setNewPlan] = useState({ type: 'general', title: '', description: '', status: 'pending' });

  if (!activeTrip) {
    return (
      <>
        <div className="page-header"><h1>Contingency Plans</h1><p>Select a trip first</p></div>
        <div className="page-body">
          <div className="empty-state">
            <ShieldAlert className="empty-icon" />
            <h3>No trip selected</h3>
            <p>Go to Dashboard and select a trip to manage contingency plans.</p>
          </div>
        </div>
      </>
    );
  }

  const { contingencies } = activeTrip;
  const prepared = contingencies.filter(c => c.status === 'prepared').length;
  const pending = contingencies.filter(c => c.status === 'pending').length;

  function handleAdd() {
    if (!newPlan.title.trim()) return;
    addContingency(activeTrip.id, newPlan);
    setNewPlan({ type: 'general', title: '', description: '', status: 'pending' });
    setShowAdd(false);
  }

  function toggleStatus(id) {
    updateTrip(activeTrip.id, trip => ({
      ...trip,
      contingencies: (trip.contingencies || []).map(c =>
        c.id === id ? { ...c, status: c.status === 'prepared' ? 'activated' : 'prepared' } : c
      ),
    }));
  }

  return (
    <>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1>Contingency Plans</h1>
          <p>{activeTrip.name} — Be prepared for anything</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Add Plan
        </button>
      </div>

      <div className="page-body">
        {/* Status summary */}
        {contingencies.length > 0 && (
          <div className="grid-3" style={{ marginBottom: 24 }}>
            <div className="card">
              <div className="card-body" style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--success)' }}>{prepared}</p>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Plans Prepared</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body" style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--warning)' }}>{pending}</p>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Needs Action</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body" style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }}>{contingencies.length}</p>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Total Plans</p>
              </div>
            </div>
          </div>
        )}

        {contingencies.length === 0 ? (
          <div className="empty-state">
            <ShieldAlert className="empty-icon" />
            <h3>No contingency plans</h3>
            <p>Prepare backup plans for disruptions, weather, health emergencies, and more.</p>
            <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
              <Plus size={16} /> Create First Plan
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {contingencies.map(plan => {
              const typeCfg = typeConfig[plan.type] || typeConfig.general;
              const statusCfg = statusConfig[plan.status] || statusConfig.pending;
              const TypeIcon = typeCfg.icon;
              const StatusIcon = statusCfg.icon;

              return (
                <div key={plan.id} className="card">
                  <div className="card-body" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 'var(--radius-md)',
                      background: typeCfg.color + '18',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <TypeIcon size={20} style={{ color: typeCfg.color }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: 15, fontWeight: 600 }}>{plan.title}</h3>
                        <span className={`badge ${statusCfg.badge}`}>
                          <StatusIcon size={10} /> {statusCfg.label}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--text-tertiary)', background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                          {typeCfg.label}
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {plan.description}
                      </p>
                    </div>
                    <button
                      className={`btn btn-sm ${plan.status === 'prepared' ? 'btn-danger' : 'btn-primary'}`}
                      onClick={() => toggleStatus(plan.id)}
                      style={{ flexShrink: 0 }}
                    >
                      {plan.status === 'prepared' ? 'Activate' : 'Mark Ready'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tips section */}
        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-header">
            <h3><FileText size={16} style={{ display: 'inline', verticalAlign: -3 }} /> Contingency Checklist</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
              {[
                { icon: Plane, text: 'Flight delay/cancellation plan', type: 'flight_delay' },
                { icon: CloudRain, text: 'Bad weather alternatives', type: 'weather' },
                { icon: Heart, text: 'Emergency medical contacts', type: 'health' },
                { icon: MapPin, text: 'Backup accommodation options', type: 'accommodation' },
                { icon: AlertTriangle, text: 'Lost documents procedure', type: 'general' },
                { icon: AlertTriangle, text: 'Communication plan (no data)', type: 'general' },
              ].map((tip, i) => {
                const exists = contingencies.some(c => c.type === tip.type);
                const Icon = tip.icon;
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 'var(--radius-md)',
                    background: exists ? 'var(--success-light)' : 'var(--bg-tertiary)',
                    fontSize: 13,
                  }}>
                    {exists ? (
                      <CheckCircle2 size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                    ) : (
                      <Icon size={16} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                    )}
                    <span style={{ color: exists ? 'var(--success)' : 'var(--text-secondary)' }}>{tip.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add plan modal */}
      {showAdd && (
        <Modal
          title="Add Contingency Plan"
          onClose={() => setShowAdd(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAdd}>Add Plan</button>
            </>
          }
        >
          <div className="form-group">
            <label className="form-label">Plan Title</label>
            <input className="form-input" placeholder="e.g. Flight cancellation backup" value={newPlan.title}
              onChange={e => setNewPlan(p => ({ ...p, title: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-input" value={newPlan.type}
              onChange={e => setNewPlan(p => ({ ...p, type: e.target.value }))}>
              {Object.entries(typeConfig).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Description & Action Steps</label>
            <textarea className="form-input" rows={4}
              placeholder="Describe the contingency and what steps to take..."
              value={newPlan.description}
              onChange={e => setNewPlan(p => ({ ...p, description: e.target.value }))} />
          </div>
        </Modal>
      )}
    </>
  );
}
