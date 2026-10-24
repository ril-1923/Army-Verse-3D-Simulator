import { MissionPanel } from '@/components/MissionPanel';
import { useSim } from '@/context/SimContext';

export default function MissionControl() {
  const { resetAllMissions, missions } = useSim();
  const completed = missions.filter((m) => m.status === 'completed').length;

  return (
    <div className="container-fluid py-3">
      <div className="page-title mb-3 d-flex justify-content-between align-items-center">
        <div>
          <h4 className="mb-0">Mission Control</h4>
          <p className="text-muted small mb-0">Coordinate training and deployment objectives across the base.</p>
        </div>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => { if (confirm('Reset progress for ALL missions? This cannot be undone.')) resetAllMissions(); }}
        >
          <i className="bi bi-arrow-counterclockwise me-1" /> Reset All Missions
        </button>
      </div>

      <div className="alert alert-dark-sm mb-3 small">
        <i className="bi bi-info-circle me-1" /> {completed} of {missions.length} missions completed.
        Start a mission, then perform the required actions in the Base Simulator — objectives update automatically.
      </div>

      <MissionPanel />
    </div>
  );
}
