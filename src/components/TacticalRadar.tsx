import { useSim } from '@/context/SimContext';
import { TERRAIN_HALF } from '@/types';
import type { UnitType } from '@/types';

interface Props {
  height?: number;
  onUnitClick?: (id: string) => void;
}

const SIZE = 220;
const RANGE = TERRAIN_HALF;

// world (x,z) -> svg (cx, cy). +x -> right, +z -> down
function toSvg(x: number, z: number) {
  const cx = ((x + RANGE) / (2 * RANGE)) * SIZE;
  const cy = ((z + RANGE) / (2 * RANGE)) * SIZE;
  return { cx, cy };
}

const markerFor = (t: UnitType) => {
  switch (t) {
    case 'soldier': return 'soldier';
    case 'tank': return 'tank';
    case 'apc': return 'apc';
    case 'truck': return 'truck';
  }
};

export function TacticalRadar({ height = SIZE, onUnitClick }: Props) {
  const { units, selectedId, selectUnit } = useSim();

  return (
    <div className="radar-wrap" style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', maxHeight: height }}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width="100%" height="100%" style={{ display: 'block' }}>
        <defs>
          <radialGradient id="radarBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2a3318" />
            <stop offset="100%" stopColor="#161b0e" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width={SIZE} height={SIZE} rx="8" fill="url(#radarBg)" />

        {/* range rings */}
        {[0.25, 0.5, 0.75, 1].map((r, i) => (
          <circle key={i} cx={SIZE / 2} cy={SIZE / 2} r={(SIZE / 2) * r} fill="none" stroke="#3a4a24" strokeWidth="0.5" strokeDasharray="2 3" />
        ))}
        {/* cross hairs */}
        <line x1={SIZE / 2} y1="0" x2={SIZE / 2} y2={SIZE} stroke="#3a4a24" strokeWidth="0.5" strokeDasharray="2 3" />
        <line x1="0" y1={SIZE / 2} x2={SIZE} y2={SIZE / 2} stroke="#3a4a24" strokeWidth="0.5" strokeDasharray="2 3" />
        {/* base boundary */}
        <rect x="6" y="6" width={SIZE - 12} height={SIZE - 12} fill="none" stroke="#6b7242" strokeWidth="1" rx="4" />

        {/* sweep line */}
        <g style={{ transformOrigin: 'center', animation: 'radarSweep 4s linear infinite' }}>
          <line x1={SIZE / 2} y1={SIZE / 2} x2={SIZE / 2} y2="6" stroke="#9aa86a" strokeWidth="1" opacity="0.5" />
          <polygon points={`${SIZE / 2},${SIZE / 2} ${SIZE / 2 + 18},6 ${SIZE / 2 - 18},6`} fill="#9aa86a" opacity="0.06" />
        </g>

        {/* units */}
        {units.map((u) => {
          const { cx, cy } = toSvg(u.position[0], u.position[2]);
          const selected = u.id === selectedId;
          const fill = selected ? '#dfe7c0' : u.status === 'moving' ? '#c9b97a' : '#8a9460';
          const handle = () => (onUnitClick ? onUnitClick(u.id) : selectUnit(u.id));
          return (
            <g key={u.id} onClick={handle} style={{ cursor: 'pointer' }}>
              {selected && <circle cx={cx} cy={cy} r="7" fill="none" stroke="#dfe7c0" strokeWidth="1" />}
              {markerFor(u.type) === 'soldier' && <circle cx={cx} cy={cy} r="2.5" fill={fill} />}
              {markerFor(u.type) === 'tank' && <rect x={cx - 3.5} y={cy - 3.5} width="7" height="7" fill={fill} />}
              {markerFor(u.type) === 'apc' && <rect x={cx - 3} y={cy - 3} width="6" height="6" fill={fill} rx="1" />}
              {markerFor(u.type) === 'truck' && (
                <polygon points={`${cx},${cy - 4} ${cx + 4},${cy + 3} ${cx - 4},${cy + 3}`} fill={fill} />
              )}
            </g>
          );
        })}
      </svg>
      <div className="radar-legend">
        <span><i className="bi bi-circle-fill" style={{ color: '#8a9460' }} /> Soldier</span>
        <span><i className="bi bi-square-fill" style={{ color: '#8a9460' }} /> Tank</span>
        <span><i className="bi bi-triangle-fill" style={{ color: '#8a9460' }} /> Truck</span>
      </div>
    </div>
  );
}
