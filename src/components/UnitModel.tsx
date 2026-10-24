import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import type { Unit } from '@/types';
import { useSim } from '@/context/SimContext';

interface Props {
  unit: Unit;
}

export function UnitModel({ unit }: Props) {
  const { selectedId, selectUnit, settings } = useSim();
  const selected = selectedId === unit.id;
  const ref = useRef<THREE.Group>(null);

  const bodyMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: unit.color, roughness: 0.85, metalness: 0.1 }),
    [unit.color]
  );
  const darkMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#222831', roughness: 0.9 }),
    []
  );
  const accentMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#c9b97a', roughness: 0.7 }),
    []
  );

  const handleClick = (e: any) => {
    e.stopPropagation();
    selectUnit(unit.id);
  };

  return (
    <group
      ref={ref}
      position={unit.position}
      onClick={handleClick}
    >
      {/* selection ring */}
      {selected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[0.9, 1.1, 32]} />
          <meshBasicMaterial color="#dfe7c0" side={THREE.DoubleSide} transparent opacity={0.9} />
        </mesh>
      )}

      {unit.type === 'soldier' && <Soldier bodyMat={bodyMat} darkMat={darkMat} />}
      {unit.type === 'tank' && <Tank bodyMat={bodyMat} darkMat={darkMat} />}
      {unit.type === 'apc' && <Apc bodyMat={bodyMat} darkMat={darkMat} />}
      {unit.type === 'truck' && <Truck bodyMat={bodyMat} darkMat={darkMat} accentMat={accentMat} />}

      {settings.showLabels && (
        <Html position={[0, 2.2, 0]} center distanceFactor={14} occlude={false} zIndexRange={[10, 0]}>
          <div className="unit-label" style={{ opacity: selected ? 1 : 0.85 }}>
            {unit.id}
          </div>
        </Html>
      )}
    </group>
  );
}

function Soldier({ bodyMat, darkMat }: { bodyMat: THREE.Material; darkMat: THREE.Material }) {
  return (
    <group>
      {/* legs */}
      <mesh position={[-0.12, 0.3, 0]} material={darkMat} castShadow>
        <boxGeometry args={[0.18, 0.6, 0.22]} />
      </mesh>
      <mesh position={[0.12, 0.3, 0]} material={darkMat} castShadow>
        <boxGeometry args={[0.18, 0.6, 0.22]} />
      </mesh>
      {/* torso */}
      <mesh position={[0, 0.85, 0]} material={bodyMat} castShadow>
        <boxGeometry args={[0.5, 0.55, 0.32]} />
      </mesh>
      {/* head + helmet */}
      <mesh position={[0, 1.3, 0]} material={darkMat} castShadow>
        <sphereGeometry args={[0.16, 16, 16]} />
      </mesh>
      <mesh position={[0, 1.38, 0]} material={bodyMat} castShadow>
        <sphereGeometry args={[0.2, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      {/* rifle */}
      <mesh position={[0.3, 0.85, 0.1]} material={darkMat} castShadow>
        <boxGeometry args={[0.5, 0.08, 0.08]} />
      </mesh>
    </group>
  );
}

function Tank({ bodyMat, darkMat }: { bodyMat: THREE.Material; darkMat: THREE.Material }) {
  return (
    <group>
      {/* tracks */}
      <mesh position={[-0.7, 0.3, 0]} material={darkMat} castShadow>
        <boxGeometry args={[0.4, 0.6, 2.2]} />
      </mesh>
      <mesh position={[0.7, 0.3, 0]} material={darkMat} castShadow>
        <boxGeometry args={[0.4, 0.6, 2.2]} />
      </mesh>
      {/* hull */}
      <mesh position={[0, 0.7, 0]} material={bodyMat} castShadow>
        <boxGeometry args={[1.8, 0.5, 2.2]} />
      </mesh>
      {/* turret */}
      <mesh position={[0, 1.1, 0]} material={bodyMat} castShadow>
        <boxGeometry args={[1.2, 0.45, 1.2]} />
      </mesh>
      {/* barrel */}
      <mesh position={[0, 1.1, 0.9]} rotation={[Math.PI / 2, 0, 0]} material={darkMat} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 1.4, 12]} />
      </mesh>
    </group>
  );
}

function Apc({ bodyMat, darkMat }: { bodyMat: THREE.Material; darkMat: THREE.Material }) {
  return (
    <group>
      {/* wheels */}
      {[-0.8, -0.4, 0, 0.4, 0.8].map((z, i) => (
        <group key={i}>
          <mesh position={[-0.7, 0.25, z]} rotation={[0, 0, Math.PI / 2]} material={darkMat} castShadow>
            <cylinderGeometry args={[0.25, 0.25, 0.2, 12]} />
          </mesh>
          <mesh position={[0.7, 0.25, z]} rotation={[0, 0, Math.PI / 2]} material={darkMat} castShadow>
            <cylinderGeometry args={[0.25, 0.25, 0.2, 12]} />
          </mesh>
        </group>
      ))}
      {/* hull */}
      <mesh position={[0, 0.7, 0]} material={bodyMat} castShadow>
        <boxGeometry args={[1.6, 0.7, 2.0]} />
      </mesh>
      {/* upper compartment */}
      <mesh position={[0, 1.15, -0.2]} material={bodyMat} castShadow>
        <boxGeometry args={[1.4, 0.4, 1.2]} />
      </mesh>
    </group>
  );
}

function Truck({ bodyMat, darkMat, accentMat }: { bodyMat: THREE.Material; darkMat: THREE.Material; accentMat: THREE.Material }) {
  return (
    <group>
      {/* wheels */}
      {[-0.7, -0.2, 0.5].map((z, i) => (
        <group key={i}>
          <mesh position={[-0.6, 0.25, z]} rotation={[0, 0, Math.PI / 2]} material={darkMat} castShadow>
            <cylinderGeometry args={[0.25, 0.25, 0.2, 12]} />
          </mesh>
          <mesh position={[0.6, 0.25, z]} rotation={[0, 0, Math.PI / 2]} material={darkMat} castShadow>
            <cylinderGeometry args={[0.25, 0.25, 0.2, 12]} />
          </mesh>
        </group>
      ))}
      {/* cab */}
      <mesh position={[0, 0.7, 0.7]} material={bodyMat} castShadow>
        <boxGeometry args={[1.3, 0.8, 1.0]} />
      </mesh>
      {/* cargo bed */}
      <mesh position={[0, 0.7, -0.5]} material={accentMat} castShadow>
        <boxGeometry args={[1.4, 0.6, 1.6]} />
      </mesh>
      {/* cargo */}
      <mesh position={[0, 1.1, -0.5]} material={bodyMat} castShadow>
        <boxGeometry args={[1.2, 0.5, 1.4]} />
      </mesh>
    </group>
  );
}
