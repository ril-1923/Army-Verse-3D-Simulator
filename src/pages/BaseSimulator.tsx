import { useState } from 'react';
import { BaseScene } from '@/components/BaseScene';
import { TacticalRadar } from '@/components/TacticalRadar';
import { UnitDetails } from '@/components/UnitDetails';
import { useSim } from '@/context/SimContext';

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
    return !!gl;
  } catch {
    return false;
  }
}

export default function BaseSimulator() {
  const { resetAllPositions, focusOnSelected, selectedId } = useSim();
  const [webglOk] = useState(hasWebGL);

  if (!webglOk) {
    return (
      <div className="container-fluid py-5">
        <div className="alert alert-warning" role="alert">
          <h5 className="alert-heading">WebGL unavailable</h5>
          <p className="mb-0">
            Your browser or device does not support WebGL, which is required to render the 3D base.
            Try a modern desktop browser with hardware acceleration enabled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid simulator-layout py-2">
      <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
        <h4 className="mb-0 me-3">Base Simulator</h4>
        <button className="btn btn-sm btn-outline-secondary" onClick={focusOnSelected} disabled={!selectedId}>
          <i className="bi bi-camera-video me-1" /> Focus Unit
        </button>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => window.dispatchEvent(new CustomEvent('armyverse-topdown'))}
        >
          <i className="bi bi-camera me-1" /> Toggle Top-Down
        </button>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => { if (confirm('Return all units to their home positions?')) resetAllPositions(); }}
        >
          <i className="bi bi-arrow-counterclockwise me-1" /> Reset All
        </button>
        <span className="text-muted small ms-auto d-none d-md-inline">
          <i className="bi bi-mouse me-1" /> Drag = rotate · Right-drag = pan · Wheel = zoom · Click ground to move selected
        </span>
      </div>

      <div className="simulator-grid">
        <div className="simulator-canvas">
          <BaseScene />
        </div>
        <div className="simulator-sidebar">
          <UnitDetails />
          <div className="panel">
            <div className="panel-header">Tactical Radar</div>
            <div className="panel-body d-flex justify-content-center">
              <TacticalRadar height={220} />
            </div>
          </div>
          <div className="panel">
            <div className="panel-header">Controls</div>
            <div className="panel-body small text-muted">
              <ul className="mb-0 ps-3">
                <li>Click a unit to select it.</li>
                <li>Click the ground to order movement.</li>
                <li>Use Inspect to mark a unit inspected (Mission 1).</li>
                <li>Drive a vehicle onto a marked zone to complete deployment/training missions.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
