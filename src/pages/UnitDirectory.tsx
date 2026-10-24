import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSim } from '@/context/SimContext';
import type { UnitType } from '@/types';

const typeLabel: Record<UnitType | 'all', string> = {
  all: 'All Units',
  soldier: 'Soldiers',
  tank: 'Tanks',
  apc: 'Armored Vehicles',
  truck: 'Transport Vehicles',
};

const typeIcon: Record<UnitType | 'all', string> = {
  all: 'bi-grid-3x3-gap',
  soldier: 'bi-person-badge',
  tank: 'bi-truck-front',
  apc: 'bi-truck',
  truck: 'bi-box-seam',
};

export default function UnitDirectory() {
  const { units, selectUnit, focusOnSelected } = useSim();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<UnitType | 'all'>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return units.filter((u) => {
      if (filter !== 'all' && u.type !== filter) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!u.name.toLowerCase().includes(q) && !u.id.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [units, filter, query]);

  const handleSelect = (id: string) => {
    selectUnit(id);
    navigate('/simulator');
  };

  return (
    <div className="container-fluid py-3">
      <div className="page-title mb-3">
        <h4 className="mb-0">Unit Directory</h4>
        <p className="text-muted small mb-0">Search, filter, and deploy units into the simulator.</p>
      </div>

      <div className="row g-2 mb-3 align-items-center">
        <div className="col-12 col-md-5">
          <div className="input-group input-group-sm">
            <span className="input-group-text"><i className="bi bi-search" /></span>
            <input
              className="form-control"
              placeholder="Search by name or ID"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="col-12 col-md-7">
          <div className="btn-group btn-group-sm flex-wrap" role="group">
            {(Object.keys(typeLabel) as (UnitType | 'all')[]).map((k) => (
              <button
                key={k}
                className={`btn ${filter === k ? 'btn-olive' : 'btn-outline-secondary'}`}
                onClick={() => setFilter(k)}
              >
                <i className={`bi ${typeIcon[k]} me-1`} /> {typeLabel[k]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="row g-3">
        {filtered.map((u) => (
          <div className="col-md-6 col-lg-4" key={u.id}>
            <div className="panel unit-card h-100">
              <div className="panel-header d-flex justify-content-between align-items-center">
                <span><i className={`bi ${typeIcon[u.type]} me-2`} />{u.name}</span>
                <span className={`badge bg-status-${u.status}`}>{u.status}</span>
              </div>
              <div className="panel-body">
                <div className="row small g-2 mb-3">
                  <div className="col-6"><span className="text-muted">ID</span><br /><strong className="font-mono">{u.id}</strong></div>
                  <div className="col-6"><span className="text-muted">Type</span><br /><strong>{typeLabel[u.type]}</strong></div>
                  <div className="col-6"><span className="text-muted">Position</span><br /><strong>{u.position[0].toFixed(1)}, {u.position[2].toFixed(1)}</strong></div>
                  <div className="col-6"><span className="text-muted">Mission</span><br /><strong>{u.mission ?? '—'}</strong></div>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-olive flex-grow-1" onClick={() => handleSelect(u.id)}>
                    <i className="bi bi-arrow-right-circle me-1" /> Select in Simulator
                  </button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => { selectUnit(u.id); focusOnSelected(); navigate('/simulator'); }}>
                    <i className="bi bi-camera-video" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-12">
            <p className="text-muted small">No units match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
