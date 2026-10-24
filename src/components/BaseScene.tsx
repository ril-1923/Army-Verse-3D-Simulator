import { useMemo, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sky, Html } from '@react-three/drei';
import type { Unit } from '@/types';
import { TERRAIN_SIZE, TERRAIN_HALF } from '@/types';
import { useSim } from '@/context/SimContext';
import { UnitModel } from './UnitModel';
import { missionTargets, deploymentZone } from '@/data/missions';

interface Props {
  className?: string;
}

export function BaseScene({ className }: Props) {
  const { settings } = useSim();
  const [topDown, setTopDown] = useState(false);

  useEffect(() => {
    const handler = () => setTopDown((v: boolean) => !v);
    window.addEventListener('armyverse-topdown', handler);
    return () => window.removeEventListener('armyverse-topdown', handler);
  }, []);

  const dpr: [number, number] = settings.graphics === 'low' ? [0.6, 0.8] : settings.graphics === 'medium' ? [0.8, 1.2] : [1, 1.8];
  const shadows = settings.graphics !== 'low';

  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Canvas
        shadows={shadows}
        dpr={dpr}
        camera={{ position: [30, 28, 34], fov: 50, near: 0.1, far: 400 }}
        gl={{ antialias: settings.graphics !== 'low' }}
      >
        <color attach="background" args={['#1d2417']} />
        <fog attach="fog" args={['#1d2417', 60, 140]} />

        <hemisphereLight args={['#cfd6c2', '#1a1f12', 0.7]} />
        <ambientLight intensity={0.25} />
        <directionalLight
          position={[40, 50, 20]}
          intensity={1.1}
          castShadow={shadows}
          shadow-mapSize-width={shadows ? 2048 : 512}
          shadow-mapSize-height={shadows ? 2048 : 512}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
        />

        <Sky sunPosition={[40, 30, 20]} turbidity={6} rayleigh={1.2} mieCoefficient={0.005} mieDirectionalG={0.8} />

        <Terrain />
        <Buildings />
        <Props />
        <MissionMarkers />
        <Units />

        <CameraRig topDown={topDown} />
        <OrbitControls
          makeDefault
          enablePan
          enableDamping
          dampingFactor={0.08}
          minDistance={6}
          maxDistance={90}
          maxPolarAngle={Math.PI / 2.05}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}

function Terrain() {
  const { selectedId, moveSelectedTo, settings } = useSim();

  const handleGroundClick = (e: any) => {
    if (!selectedId) return;
    e.stopPropagation();
    moveSelectedTo(e.point.x, e.point.z);
  };

  return (
    <group>
      {/* base ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow onClick={handleGroundClick}>
        <planeGeometry args={[TERRAIN_SIZE, TERRAIN_SIZE]} />
        <meshStandardMaterial color="#3b4a26" roughness={1} />
      </mesh>
      {/* outer border to show bounds */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[TERRAIN_SIZE + 20, TERRAIN_SIZE + 20]} />
        <meshStandardMaterial color="#26301a" roughness={1} />
      </mesh>

      {/* roads (a cross + ring) */}
      <Road x={0} z={0} w={TERRAIN_SIZE} d={3} />
      <Road x={0} z={0} w={3} d={TERRAIN_SIZE} />
      <Road x={0} z={18} w={TERRAIN_SIZE - 10} d={2} />
      <Road x={0} z={-18} w={TERRAIN_SIZE - 10} d={2} />

      {/* grid overlay for tactical feel */}
      {settings.graphics !== 'low' && <GridLines />}
    </group>
  );
}

function Road({ x, z, w, d }: { x: number; z: number; w: number; d: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, z]} receiveShadow>
      <planeGeometry args={[w, d]} />
      <meshStandardMaterial color="#4a4a3a" roughness={1} />
    </mesh>
  );
}

function GridLines() {
  const lines = useMemo(() => {
    const arr: { x: number; z: number }[] = [];
    for (let i = -TERRAIN_HALF; i <= TERRAIN_HALF; i += 10) {
      arr.push({ x: i, z: 0 });
    }
    return arr;
  }, []);
  return (
    <group>
      {lines.map((l, i) => (
        <mesh key={`v${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[l.x, 0.015, 0]}>
          <planeGeometry args={[0.08, TERRAIN_SIZE]} />
          <meshBasicMaterial color="#4d5a30" transparent opacity={0.3} />
        </mesh>
      ))}
      {lines.map((l, i) => (
        <mesh key={`h${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, l.x]}>
          <planeGeometry args={[TERRAIN_SIZE, 0.08]} />
          <meshBasicMaterial color="#4d5a30" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function Buildings() {
  return (
    <group>
      {/* Headquarters - large central building */}
      <Building position={[0, 0, 0]} size={[6, 3, 4]} color="#5c5142" roofColor="#3a3326" />
      {/* Barracks - row to the west */}
      <Building position={[-16, 0, -16]} size={[5, 2, 3]} color="#5a4f3e" roofColor="#3a3225" />
      <Building position={[-8, 0, -16]} size={[5, 2, 3]} color="#5a4f3e" roofColor="#3a3225" />
      {/* Vehicle depot east */}
      <Building position={[16, 0, 4]} size={[7, 2.5, 5]} color="#4a4438" roofColor="#2f2a20" />
      {/* Storage buildings */}
      <Building position={[-22, 0, 14]} size={[4, 2, 3]} color="#574d3c" roofColor="#36301f" />
      <Building position={[22, 0, -22]} size={[4, 2, 3]} color="#574d3c" roofColor="#36301f" />

      {/* Watchtowers at corners */}
      <Watchtower position={[-28, 0, -28]} />
      <Watchtower position={[28, 0, -28]} />
      <Watchtower position={[-28, 0, 28]} />
      <Watchtower position={[28, 0, 28]} />

      {/* Helipad - circular marking */}
      <Helipad position={[6, 0, 20]} />

      {/* Training area marker - rectangular zone */}
      <TrainingZone />
    </group>
  );
}

function Building({ position, size, color, roofColor }: { position: [number, number, number]; size: [number, number, number]; color: string; roofColor: string }) {
  return (
    <group position={position}>
      <mesh position={[0, size[1] / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      {/* roof slab */}
      <mesh position={[0, size[1] + 0.15, 0]} castShadow>
        <boxGeometry args={[size[0] + 0.4, 0.3, size[2] + 0.4]} />
        <meshStandardMaterial color={roofColor} roughness={0.95} />
      </mesh>
    </group>
  );
}

function Watchtower({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 3, 8]} />
        <meshStandardMaterial color="#3a3326" roughness={0.95} />
      </mesh>
      <mesh position={[0, 3.3, 0]} castShadow>
        <boxGeometry args={[1.6, 1, 1.6]} />
        <meshStandardMaterial color="#4a4030" roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.9, 0]} castShadow>
        <coneGeometry args={[1.2, 0.8, 4]} />
        <meshStandardMaterial color="#2c261c" roughness={0.95} />
      </mesh>
    </group>
  );
}

function Helipad({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <circleGeometry args={[3, 32]} />
        <meshStandardMaterial color="#3a3a30" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[2.7, 3, 32]} />
        <meshBasicMaterial color="#c9b97a" side={THREE.DoubleSide} />
      </mesh>
      {/* H marker */}
      <mesh position={[-0.4, 0.04, 0]}>
        <boxGeometry args={[0.25, 0.02, 1.4]} />
        <meshBasicMaterial color="#dfe7c0" />
      </mesh>
      <mesh position={[0.4, 0.04, 0]}>
        <boxGeometry args={[0.25, 0.02, 1.4]} />
        <meshBasicMaterial color="#dfe7c0" />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[1.05, 0.02, 0.25]} />
        <meshBasicMaterial color="#dfe7c0" />
      </mesh>
    </group>
  );
}

function TrainingZone() {
  return (
    <group>
      {/* corner posts */}
      {[
        [-24, 16],
        [24, 16],
        [-24, 22],
        [24, 22],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.5, z]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 1, 6]} />
          <meshStandardMaterial color="#c9b97a" />
        </mesh>
      ))}
      {/* perimeter line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 19]}>
        <planeGeometry args={[48, 0.15]} />
        <meshBasicMaterial color="#c9b97a" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function Props() {
  // trees and barriers, memoized
  const trees = useMemo(() => {
    const arr: { x: number; z: number; s: number }[] = [];
    const rng = mulberry32(42);
    for (let i = 0; i < 28; i++) {
      const x = (rng() - 0.5) * (TERRAIN_SIZE - 6);
      const z = (rng() - 0.5) * (TERRAIN_SIZE - 6);
      // keep trees away from central roads and buildings
      if (Math.abs(z) < 3 || Math.abs(x) < 3) continue;
      if (Math.abs(z - 19) < 3 && Math.abs(x) < 25) continue; // training zone
      arr.push({ x, z, s: 0.8 + rng() * 0.6 });
    }
    return arr;
  }, []);

  return (
    <group>
      {trees.map((t, i) => (
        <Tree key={i} position={[t.x, 0, t.z]} scale={t.s} />
      ))}
      {/* barriers near HQ */}
      {[-3, -1, 1, 3].map((x, i) => (
        <mesh key={i} position={[x, 0.3, 3]} castShadow>
          <boxGeometry args={[0.6, 0.6, 0.4]} />
          <meshStandardMaterial color="#6b6147" roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

function Tree({ position, scale }: { position: [number, number, number]; scale: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 1.2, 6]} />
        <meshStandardMaterial color="#3a2c1e" roughness={1} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <coneGeometry args={[0.9, 1.8, 8]} />
        <meshStandardMaterial color="#2f4022" roughness={1} />
      </mesh>
      <mesh position={[0, 2.2, 0]} castShadow>
        <coneGeometry args={[0.6, 1.2, 8]} />
        <meshStandardMaterial color="#37492a" roughness={1} />
      </mesh>
    </group>
  );
}

function MissionMarkers() {
  const { missions, settings } = useSim();
  const showAll = settings.showMarkers;
  const markers: { pos: [number, number, number]; label: string; active: boolean }[] = [];

  const deploy = missions.find((m) => m.id === 'vehicle-deployment');
  if (deploy && deploy.status !== 'completed' && showAll) {
    markers.push({ pos: deploymentZone, label: 'DEPLOY', active: deploy.status === 'active' });
  }
  const train = missions.find((m) => m.id === 'training-exercise');
  if (train && train.status !== 'completed' && showAll) {
    markers.push({ pos: missionTargets['train-t01'], label: 'ALPHA', active: train.status === 'active' });
    markers.push({ pos: missionTargets['train-s06'], label: 'BRAVO', active: train.status === 'active' });
  }

  return (
    <group>
      {markers.map((m, i) => (
        <group key={i} position={m.pos}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
            <ringGeometry args={[1.4, 1.7, 32]} />
            <meshBasicMaterial color={m.active ? '#dfe7c0' : '#c9b97a'} side={THREE.DoubleSide} transparent opacity={0.8} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
            <circleGeometry args={[1.4, 32]} />
            <meshBasicMaterial color={m.active ? '#dfe7c0' : '#c9b97a'} transparent opacity={0.15} />
          </mesh>
          <Html position={[0, 1.2, 0]} center distanceFactor={10} zIndexRange={[10, 0]}>
            <div className="unit-label" style={{ background: 'rgba(29,36,23,0.9)', color: '#1d2417', borderColor: '#c9b97a' }}>
              {m.label}
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}

function Units() {
  const { units } = useSim();
  return (
    <group>
      {units.map((u) => (
        <MovingUnit key={u.id} unit={u} />
      ))}
    </group>
  );
}

function MovingUnit({ unit }: { unit: Unit }) {
  const { targetsRef, updateUnitPosition, setUnitStatus, setUnitMission, checkArrival, selectedId } = useSim();
  const groupRef = useRef<THREE.Group>(null);
  const currentPos = useRef(new THREE.Vector3(...unit.position));
  const targetPos = useRef(new THREE.Vector3(...unit.position));
  const lastSync = useRef(0);

  // sync when unit.position changes externally (e.g. reset) and unit is not actively moving
  useEffect(() => {
    const tgt = targetsRef.current[unit.id];
    if (!tgt || unit.status !== 'moving') {
      currentPos.current.set(unit.position[0], unit.position[1], unit.position[2]);
      targetPos.current.set(unit.position[0], unit.position[1], unit.position[2]);
    }
  }, [unit.position, unit.id, unit.status]);

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;

    const target = targetsRef.current[unit.id];
    if (unit.status === 'moving' && target) {
      targetPos.current.set(target[0], target[1], target[2]);
      const dir = new THREE.Vector3().subVectors(targetPos.current, currentPos.current);
      const dist = dir.length();
      if (dist < 0.05) {
        currentPos.current.copy(targetPos.current);
        g.position.copy(currentPos.current);
        delete targetsRef.current[unit.id];
        setUnitStatus(unit.id, 'idle');
        setUnitMission(unit.id, null);
        checkArrival(unit.id, [currentPos.current.x, currentPos.current.y, currentPos.current.z]);
      } else {
        dir.normalize();
        const step = Math.min(dist, unit.speed * delta);
        currentPos.current.addScaledVector(dir, step);
        g.position.copy(currentPos.current);
        const angle = Math.atan2(dir.x, dir.z);
        g.rotation.y = angle;
      }
      // throttle state sync to ~10/sec for radar
      const now = performance.now();
      if (now - lastSync.current > 100) {
        lastSync.current = now;
        updateUnitPosition(unit.id, [currentPos.current.x, currentPos.current.y, currentPos.current.z]);
      }
    } else {
      g.position.copy(currentPos.current);
    }
  });

  return (
    <group ref={groupRef}>
      <UnitModel unit={{ ...unit, position: [0, 0, 0] }} />
      {selectedId === unit.id && <DestinationMarker targetRef={targetsRef} unitId={unit.id} />}
    </group>
  );
}

function DestinationMarker({ targetRef, unitId }: { targetRef: NonNullable<ReturnType<typeof useSim>['targetsRef']>; unitId: string }) {
  const target = targetRef.current[unitId];
  if (!target) return null;
  return (
    <mesh position={[target[0], 0.05, target[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.6, 0.9, 24]} />
      <meshBasicMaterial color="#dfe7c0" side={THREE.DoubleSide} transparent opacity={0.8} />
    </mesh>
  );
}

function CameraRig({ topDown }: { topDown: boolean }) {
  const { focusUnitId, clearFocus, units } = useSim();
  const { camera, controls } = useThree() as any;

  // Top-down view toggle
  useEffect(() => {
    if (topDown) {
      const start = camera.position.clone();
      const startTarget = (controls?.target?.clone?.() ?? new THREE.Vector3(0, 0, 0));
      const desired = new THREE.Vector3(0, 60, 0.01);
      const desiredTarget = new THREE.Vector3(0, 0, 0);
      const duration = 500;
      const t0 = performance.now();
      let raf = 0;
      const tick = () => {
        const t = Math.min(1, (performance.now() - t0) / duration);
        const ease = 1 - Math.pow(1 - t, 3);
        camera.position.lerpVectors(start, desired, ease);
        if (controls) {
          controls.target.lerpVectors(startTarget, desiredTarget, ease);
          controls.update();
        }
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    } else {
      const start = camera.position.clone();
      const startTarget = (controls?.target?.clone?.() ?? new THREE.Vector3(0, 0, 0));
      const desired = new THREE.Vector3(30, 28, 34);
      const desiredTarget = new THREE.Vector3(0, 0, 0);
      const duration = 500;
      const t0 = performance.now();
      let raf = 0;
      const tick = () => {
        const t = Math.min(1, (performance.now() - t0) / duration);
        const ease = 1 - Math.pow(1 - t, 3);
        camera.position.lerpVectors(start, desired, ease);
        if (controls) {
          controls.target.lerpVectors(startTarget, desiredTarget, ease);
          controls.update();
        }
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }
  }, [topDown]);

  useEffect(() => {
    if (!focusUnitId) return;
    const u = units.find((x) => x.id === focusUnitId);
    if (!u) {
      clearFocus();
      return;
    }
    const target = new THREE.Vector3(u.position[0], u.position[1] + 1, u.position[2]);
    const offset = new THREE.Vector3(8, 9, 10);
    const desired = target.clone().add(offset);
    const start = camera.position.clone();
    const startTarget = (controls?.target?.clone?.() ?? new THREE.Vector3());
    const duration = 600;
    const t0 = performance.now();
    let raf = 0;
    const tick = () => {
      const t = Math.min(1, (performance.now() - t0) / duration);
      const ease = 1 - Math.pow(1 - t, 3);
      camera.position.lerpVectors(start, desired, ease);
      if (controls) {
        controls.target.lerpVectors(startTarget, target, ease);
        controls.update();
      }
      if (t < 1) raf = requestAnimationFrame(tick);
      else clearFocus();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusUnitId]);

  return null;
}

// deterministic RNG for stable prop placement
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
