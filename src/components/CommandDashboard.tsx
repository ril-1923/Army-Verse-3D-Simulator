import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSim } from '@/context/SimContext';
import { TacticalRadar } from './TacticalRadar';

export function CommandDashboard() {
  const { units, missions, activity } = useSim();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const soldiers = units.filter((u) => u.type === 'soldier').length;
    const vehicles = units.filter((u) => u.type !== 'soldier').length;
    const moving = units.filter((u) => u.status === 'moving').length;
    const activeMissions = missions.filter((m) => m.status === 'active').length;
    const completedMissions = missions.filter((m) => m.status === 'completed').length;
    const inspected = units.filter((u) => u.status === 'inspected').length;
    return { total: units.length, soldiers, vehicles, moving, activeMissions, completedMissions, inspected };
  }, [units, missions]);

  const statusBars = useMemo(() => {
    const statuses = ['idle', 'moving', 'inspected'];
    return statuses.map((s) => ({
      status: s,
      count: units.filter((u) => u.status === s).length,
    }));
  }, [units]);

  return (
    <div className="row g-3">
      <div className="col-12">
        <div className="row g-2 row-cols-2 row-cols-md-3 row-cols-lg-6">
          <StatCard label="Total Units" value={stats.total} icon="bi-grid-3x3-gap" />
          <StatCard label="Soldiers" value={stats.soldiers} icon="bi-person-badge" />
          <StatCard label="Vehicles" value={stats.vehicles} icon="bi-truck" />
          <StatCard label="Moving" value={stats.moving} icon="bi-arrow-left-right" />
          <StatCard label="Active Missions" value={stats.activeMissions} icon="bi-flag" />
          <StatCard label="Completed" value={stats.completedMissions} icon="bi-check2-circle" />
        </div>
      </div>

      <div className="col-lg-7">
        <div className="panel">
          <div className="panel-header">Unit Status Overview</div>
          <div className="panel-body">
            <div className="status-bars">
              {statusBars.map((s) => (
                <div key={s.status} className="mb-2">
                  <div className="d-flex justify-content-between small">
                    <span className="text-capitalize">{s.status}</span>
                    <strong>{s.count}</strong>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div
                      className="progress-bar bg-olive"
                      style={{ width: `${(s.count / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="table-responsive mt-3">
              <table className="table table-sm table-dark-sm align-middle small mb-0">
                <thead>
                  <tr><th>ID</th><th>Name</th><th>Type</th><th>Status</th><th>Mission</th></tr>
                </thead>
                <tbody>
                  {units.map((u) => (
                    <tr key={u.id}>
                      <td className="font-mono">{u.id}</td>
                      <td>{u.name}</td>
                      <td className="text-capitalize">{u.type}</td>
                      <td><span className={`badge bg-status-${u.status}`}>{u.status}</span></td>
                      <td className="text-muted">{u.mission ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-5">
        <div className="panel">
          <div className="panel-header">Tactical Radar</div>
          <div className="panel-body d-flex justify-content-center">
            <TacticalRadar height={260} />
          </div>
        </div>
      </div>

      <div className="col-lg-7">
        <div className="panel">
          <div className="panel-header">Mission Progress</div>
          <div className="panel-body">
            {missions.map((m) => {
              const done = m.objectives.filter((o) => o.done).length;
              const pct = (done / m.objectives.length) * 100;
              return (
                <div key={m.id} className="mb-3">
                  <div className="d-flex justify-content-between small">
                    <span><i className="bi bi-flag me-1" />{m.title}</span>
                    <span className={`badge ${m.status === 'completed' ? 'bg-success' : m.status === 'active' ? 'bg-warning text-dark' : 'bg-secondary'}`}>{m.status}</span>
                  </div>
                  <div className="progress mt-1" style={{ height: '8px' }}>
                    <div className={`progress-bar ${m.status === 'completed' ? 'bg-success' : 'bg-olive'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="col-lg-5">
        <div className="panel">
          <div className="panel-header">Recent Activity</div>
          <div className="panel-body activity-feed">
            {activity.length === 0 && <p className="text-muted small mb-0">No activity yet.</p>}
            {activity.slice(0, 10).map((a) => (
              <div key={a.id} className="activity-item">
                <span className="activity-dot" />
                <span className="text-muted activity-time">{new Date(a.time).toLocaleTimeString()}</span>
                <span>{a.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-olive" onClick={() => navigate('/simulator')}>
            <i className="bi bi-collection-play me-1" /> Open Simulator
          </button>
          <button className="btn btn-khaki" onClick={() => navigate('/missions')}>
            <i className="bi bi-list-check me-1" /> Mission Control
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="stat-card">
      <div className="stat-icon"><i className={`bi ${icon}`} /></div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
