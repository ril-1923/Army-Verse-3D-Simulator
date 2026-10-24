import { useSim } from '@/context/SimContext';
import type { GraphicsQuality } from '@/types';

export default function Settings() {
  const { settings, updateSettings, resetAllPositions, resetAllMissions, clearActivity } = useSim();

  return (
    <div className="container-fluid py-3">
      <div className="page-title mb-3">
        <h4 className="mb-0">Settings</h4>
        <p className="text-muted small mb-0">Preferences are saved to your browser.</p>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <div className="panel">
            <div className="panel-header">Display & Graphics</div>
            <div className="panel-body">
              <div className="mb-3">
                <label className="form-label small">Graphics Quality</label>
                <div className="btn-group btn-group-sm w-100">
                  {(['low', 'medium', 'high'] as GraphicsQuality[]).map((q) => (
                    <button
                      key={q}
                      className={`btn ${settings.graphics === q ? 'btn-olive' : 'btn-outline-secondary'}`}
                      onClick={() => updateSettings({ graphics: q })}
                    >
                      {q.charAt(0).toUpperCase() + q.slice(1)}
                    </button>
                  ))}
                </div>
                <p className="text-muted small mt-1 mb-0">Lower quality improves performance on weaker devices.</p>
              </div>
              <div className="form-check form-switch mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="labels"
                  checked={settings.showLabels}
                  onChange={(e) => updateSettings({ showLabels: e.target.checked })}
                />
                <label className="form-check-label small" htmlFor="labels">Show unit labels</label>
              </div>
              <div className="form-check form-switch mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="markers"
                  checked={settings.showMarkers}
                  onChange={(e) => updateSettings({ showMarkers: e.target.checked })}
                />
                <label className="form-check-label small" htmlFor="markers">Show mission markers</label>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="panel">
            <div className="panel-header">Audio & Simulator</div>
            <div className="panel-body">
              <div className="form-check form-switch mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="sound"
                  checked={settings.sound}
                  onChange={(e) => updateSettings({ sound: e.target.checked })}
                />
                <label className="form-check-label small" htmlFor="sound">Enable sound (off by default)</label>
              </div>
              <p className="text-muted small">Camera reset is available from the Base Simulator toolbar ("Toggle Top-Down" returns to perspective on second toggle).</p>
              <button className="btn btn-sm btn-outline-secondary me-2 mb-2" onClick={clearActivity}>
                <i className="bi bi-eraser me-1" /> Clear Activity Log
              </button>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="panel">
            <div className="panel-header">Reset Operations</div>
            <div className="panel-body">
              <p className="text-muted small">These actions cannot be undone. You will be asked to confirm.</p>
              <div className="d-flex flex-wrap gap-2">
                <button
                  className="btn btn-sm btn-outline-warning"
                  onClick={() => { if (confirm('Return all units to their home positions?')) resetAllPositions(); }}
                >
                  <i className="bi bi-arrow-counterclockwise me-1" /> Reset Simulator Positions
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => {
                    if (confirm('Reset ALL saved mission progress? This cannot be undone.')) resetAllMissions();
                  }}
                >
                  <i className="bi bi-trash me-1" /> Reset Saved Mission Progress
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
