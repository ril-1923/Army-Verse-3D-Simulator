import { useSim } from '@/context/SimContext';
import type { UnitType } from '@/types';

const typeLabel: Record<UnitType, string> = {
  soldier: 'Soldier',
  tank: 'Tank',
  apc: 'Armored Vehicle',
  truck: 'Transport Vehicle',
};

const statusBadge: Record<string, string> = {
  idle: 'bg-secondary',
  moving: 'bg-warning text-dark',
  inspected: 'bg-info text-dark',
  deployed: 'bg-success',
  training: 'bg-primary',
  standby: 'bg-secondary',
};

export function UnitDetails() {
  const { units, selectedId, inspectSelected, stopSelected, resetSelected, focusOnSelected } = useSim();
  const unit = units.find((u) => u.id === selectedId) ?? null;

  if (!unit) {
    return (
      <div className="panel">
        <div className="panel-header">Selected Unit</div>
        <div className="panel-body text-muted small">
          No unit selected. Click a unit in the simulator or radar to view details.
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-header">
        Selected Unit
        <span className={`badge ${statusBadge[unit.status] ?? 'bg-secondary'} ms-2`}>{unit.status}</span>
      </div>
      <div className="panel-body">
        <div className="row g-2 small">
          <div className="col-6"><span className="text-muted">ID</span><br /><strong>{unit.id}</strong></div>
          <div className="col-6"><span className="text-muted">Type</span><br /><strong>{typeLabel[unit.type]}</strong></div>
          <div className="col-6"><span className="text-muted">Name</span><br /><strong>{unit.name}</strong></div>
          <div className="col-6"><span className="text-muted">Speed</span><br /><strong>{unit.speed.toFixed(1)} m/s</strong></div>
          <div className="col-6"><span className="text-muted">Position</span><br />
            <strong>{unit.position[0].toFixed(1)}, {unit.position[2].toFixed(1)}</strong>
          </div>
          <div className="col-6"><span className="text-muted">Mission</span><br />
            <strong>{unit.mission ?? '—'}</strong>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2 mt-3">
          <button className="btn btn-sm btn-olive" onClick={inspectSelected}>
            <i className="bi bi-clipboard-check me-1" /> Inspect
          </button>
          <button className="btn btn-sm btn-khaki" onClick={focusOnSelected} disabled={!unit}>
            <i className="bi bi-camera-video me-1" /> Focus
          </button>
          <button className="btn btn-sm btn-outline-warning" onClick={stopSelected} disabled={unit.status !== 'moving'}>
            <i className="bi bi-stop-circle me-1" /> Stop
          </button>
          <button className="btn btn-sm btn-outline-secondary" onClick={resetSelected}>
            <i className="bi bi-arrow-counterclockwise me-1" /> Reset
          </button>
        </div>
        <p className="text-muted small mt-2 mb-0">
          Tip: with this unit selected, click anywhere on the ground to order movement.
        </p>
      </div>
    </div>
  );
}
