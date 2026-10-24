import { useNavigate } from 'react-router-dom';
import { useSim } from '@/context/SimContext';
import type { MissionId } from '@/types';

export function MissionPanel({ compact = false }: { compact?: boolean }) {
  const { missions, startMission, resetMission, selectUnit } = useSim();
  const navigate = useNavigate();

  const handleGuide = (id: MissionId) => {
    navigate('/simulator');
    // pick first unit relevant to the mission
    if (id === 'base-inspection') {
      selectUnit('S-01');
    } else if (id === 'vehicle-deployment') {
      selectUnit('R-01');
    } else if (id === 'training-exercise') {
      selectUnit('T-01');
    }
  };

  return (
    <div className="row g-3">
      {missions.map((m) => {
        const done = m.objectives.filter((o) => o.done).length;
        const pct = (done / m.objectives.length) * 100;
        const isActive = m.status === 'active';
        const isDone = m.status === 'completed';
        return (
          <div key={m.id} className={compact ? 'col-12' : 'col-md-6 col-lg-4'}>
            <div className={`panel mission-card ${isActive ? 'mission-active' : ''} ${isDone ? 'mission-done' : ''}`}>
              <div className="panel-header d-flex justify-content-between align-items-center">
                <span><i className="bi bi-flag me-2" />{m.title}</span>
                <span className={`badge ${isDone ? 'bg-success' : isActive ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                  {m.status.replace('-', ' ')}
                </span>
              </div>
              <div className="panel-body">
                <p className="small text-muted">{m.brief}</p>
                <ul className="list-unstyled small mb-3">
                  {m.objectives.map((o) => (
                    <li key={o.id} className="mb-1">
                      <i className={`bi ${o.done ? 'bi-check-circle-fill text-success' : 'bi-circle text-muted'} me-2`} />
                      {o.label}
                    </li>
                  ))}
                </ul>
                <div className="progress mb-3" style={{ height: '8px' }}>
                  <div className={`progress-bar ${isDone ? 'bg-success' : 'bg-olive'}`} style={{ width: `${pct}%` }} />
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {!isDone && (
                    <button className="btn btn-sm btn-olive" onClick={() => startMission(m.id)} disabled={isActive}>
                      <i className="bi bi-play-fill me-1" /> {isActive ? 'Active' : 'Start'}
                    </button>
                  )}
                  <button className="btn btn-sm btn-khaki" onClick={() => handleGuide(m.id)}>
                    <i className="bi bi-arrow-right-circle me-1" /> Go to Simulator
                  </button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => resetMission(m.id)}>
                    <i className="bi bi-arrow-counterclockwise me-1" /> Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {compact && (
        <div className="col-12">
          <p className="text-muted small mb-0">
            Mission objectives respond to real simulator interactions: inspect by selecting a unit and using Inspect;
            reach a marker by selecting the unit, then clicking the marked zone on the ground.
          </p>
        </div>
      )}
    </div>
  );
}
