import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from 'react';
import type {
  ActivityEntry,
  Mission,
  MissionId,
  SimSettings,
  Unit,
  UnitStatus,
} from '@/types';
import { initialUnits } from '@/data/units';
import { initialMissions, missionTargets } from '@/data/missions';
import { TERRAIN_HALF } from '@/types';

const SETTINGS_KEY = 'armyverse.settings';
const MISSIONS_KEY = 'armyverse.missions';
const ACTIVITY_KEY = 'armyverse.activity';

const DEFAULT_SETTINGS: SimSettings = {
  sound: false,
  graphics: 'medium',
  showLabels: true,
  showMarkers: true,
};

function loadSettings(): SimSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return DEFAULT_SETTINGS;
}

function loadMissions(): Mission[] {
  try {
    const raw = localStorage.getItem(MISSIONS_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Mission[];
      return initialMissions.map((m) => {
        const s = saved.find((x) => x.id === m.id);
        if (!s) return m;
        return {
          ...m,
          status: s.status,
          objectives: m.objectives.map((o) => {
            const so = s.objectives.find((x) => x.id === o.id);
            return so ? { ...o, done: so.done } : o;
          }),
        };
      });
    }
  } catch {
    /* ignore */
  }
  return initialMissions;
}

function loadActivity(): ActivityEntry[] {
  try {
    const raw = localStorage.getItem(ACTIVITY_KEY);
    if (raw) return JSON.parse(raw) as ActivityEntry[];
  } catch {
    /* ignore */
  }
  return [];
}

export type TargetsRef = MutableRefObject<Record<string, [number, number, number]>>;

interface SimContextValue {
  units: Unit[];
  selectedId: string | null;
  settings: SimSettings;
  missions: Mission[];
  activity: ActivityEntry[];
  targetsRef: TargetsRef;
  selectUnit: (id: string | null) => void;
  inspectSelected: () => void;
  moveSelectedTo: (x: number, z: number) => void;
  stopSelected: () => void;
  resetSelected: () => void;
  resetAllPositions: () => void;
  focusUnitId: string | null;
  focusOnSelected: () => void;
  clearFocus: () => void;
  updateUnitPosition: (id: string, pos: [number, number, number]) => void;
  setUnitStatus: (id: string, status: UnitStatus) => void;
  setUnitMission: (id: string, mission: string | null) => void;
  checkArrival: (id: string, pos: [number, number, number]) => void;
  startMission: (id: MissionId) => void;
  resetMission: (id: MissionId) => void;
  resetAllMissions: () => void;
  updateSettings: (patch: Partial<SimSettings>) => void;
  log: (text: string) => void;
  clearActivity: () => void;
}

const SimContext = createContext<SimContextValue | null>(null);

export function SimProvider({ children }: { children: ReactNode }) {
  const [units, setUnits] = useState<Unit[]>(initialUnits);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusUnitId, setFocusUnitId] = useState<string | null>(null);
  const [settings, setSettings] = useState<SimSettings>(loadSettings);
  const [missions, setMissions] = useState<Mission[]>(loadMissions);
  const [activity, setActivity] = useState<ActivityEntry[]>(loadActivity);

  const targetsRef = useRef<Record<string, [number, number, number]>>({});
  const unitsRef = useRef(units);
  unitsRef.current = units;
  const missionsRef = useRef(missions);
  missionsRef.current = missions;

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);
  useEffect(() => {
    localStorage.setItem(MISSIONS_KEY, JSON.stringify(missions));
  }, [missions]);
  useEffect(() => {
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activity.slice(0, 30)));
  }, [activity]);

  const log = useCallback((text: string) => {
    setActivity((prev) =>
      [{ id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, time: Date.now(), text }, ...prev].slice(0, 30)
    );
  }, []);

  const selectUnit = useCallback((id: string | null) => {
    setSelectedId(id);
    if (id) log(`Selected unit ${id}`);
  }, [log]);

  const inspectSelected = useCallback(() => {
    if (!selectedId) return;
    const unit = unitsRef.current.find((u) => u.id === selectedId);
    if (!unit) return;
    setUnits((prev) =>
      prev.map((u) => (u.id === selectedId ? { ...u, status: 'inspected' } : u))
    );
    log(`Inspected ${selectedId} (${unit.name})`);
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id !== 'base-inspection') return m;
        const objectives = m.objectives.map((o) =>
          o.id === `inspect-${selectedId.toLowerCase()}` ? { ...o, done: true } : o
        );
        const allDone = objectives.every((o) => o.done);
        return { ...m, objectives, status: allDone ? 'completed' : m.status === 'not-started' ? 'active' : m.status };
      })
    );
  }, [selectedId, log]);

  const moveSelectedTo = useCallback((x: number, z: number) => {
    if (!selectedId) return;
    const cx = Math.max(-TERRAIN_HALF + 1, Math.min(TERRAIN_HALF - 1, x));
    const cz = Math.max(-TERRAIN_HALF + 1, Math.min(TERRAIN_HALF - 1, z));
    setUnits((prev) =>
      prev.map((u) =>
        u.id === selectedId
          ? { ...u, status: 'moving', mission: u.mission ?? 'reposition' }
          : u
      )
    );
    targetsRef.current[selectedId] = [cx, 0, cz];
    log(`Ordered ${selectedId} to move to (${cx.toFixed(0)}, ${cz.toFixed(0)})`);
  }, [selectedId, log]);

  const stopSelected = useCallback(() => {
    if (!selectedId) return;
    setUnits((prev) =>
      prev.map((u) => (u.id === selectedId ? { ...u, status: 'idle', mission: null } : u))
    );
    delete targetsRef.current[selectedId];
    log(`Stopped ${selectedId}`);
  }, [selectedId, log]);

  const resetSelected = useCallback(() => {
    if (!selectedId) return;
    setUnits((prev) =>
      prev.map((u) => (u.id === selectedId ? { ...u, status: 'idle', mission: null, position: u.home } : u))
    );
    delete targetsRef.current[selectedId];
    log(`Reset ${selectedId} to home position`);
  }, [selectedId, log]);

  const resetAllPositions = useCallback(() => {
    setUnits((prev) => prev.map((u) => ({ ...u, status: 'idle', mission: null, position: u.home })));
    targetsRef.current = {};
    log('All units returned to home positions');
  }, [log]);

  const focusOnSelected = useCallback(() => {
    if (selectedId) setFocusUnitId(selectedId);
  }, [selectedId]);
  const clearFocus = useCallback(() => setFocusUnitId(null), []);

  const updateUnitPosition = useCallback((id: string, pos: [number, number, number]) => {
    setUnits((prev) => prev.map((u) => (u.id === id ? { ...u, position: pos } : u)));
  }, []);

  const setUnitStatus = useCallback((id: string, status: UnitStatus) => {
    setUnits((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
  }, []);

  const setUnitMission = useCallback((id: string, mission: string | null) => {
    setUnits((prev) => prev.map((u) => (u.id === id ? { ...u, mission } : u)));
  }, []);

  const checkArrival = useCallback((id: string, pos: [number, number, number]) => {
    const unit = unitsRef.current.find((u) => u.id === id);
    if (!unit) return;
    setMissions((prev) => {
      let changed = false;
      const next: Mission[] = prev.map((m) => {
        if (m.status !== 'active') return m;
        const objectives = m.objectives.map((o) => {
          if (o.done) return o;
          const key = `${m.id}:${o.id}`;
          let reached = false;
          if (key === 'vehicle-deployment:deploy-r01' && id === 'R-01') {
            const tgt = missionTargets['deploy-r01'];
            reached = Math.abs(pos[0] - tgt[0]) < 1.8 && Math.abs(pos[2] - tgt[2]) < 1.8;
          } else if (key === 'training-exercise:train-t01' && id === 'T-01') {
            const tgt = missionTargets['train-t01'];
            reached = Math.abs(pos[0] - tgt[0]) < 1.8 && Math.abs(pos[2] - tgt[2]) < 1.8;
          } else if (key === 'training-exercise:train-s06' && id === 'S-06') {
            const tgt = missionTargets['train-s06'];
            reached = Math.abs(pos[0] - tgt[0]) < 1.8 && Math.abs(pos[2] - tgt[2]) < 1.8;
          }
          if (reached) {
            changed = true;
            log(`${id} reached objective marker`);
            return { ...o, done: true };
          }
          return o;
        });
        const allDone = objectives.every((o) => o.done);
        if (allDone) {
          changed = true;
          log(`Mission complete: ${m.title}`);
          return { ...m, objectives, status: 'completed' as const };
        }
        if (changed) return { ...m, objectives };
        return m;
      });
      return changed ? next : prev;
    });
  }, [log]);

  const startMission = useCallback((id: MissionId) => {
    setMissions((prev) =>
      prev.map((m) =>
        m.id === id && m.status !== 'completed' ? { ...m, status: 'active' } : m
      )
    );
    const m = missionsRef.current.find((x) => x.id === id);
    log(`Started mission: ${m?.title ?? id}`);
  }, [log]);

  const resetMission = useCallback((id: MissionId) => {
    setMissions((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: 'not-started', objectives: m.objectives.map((o) => ({ ...o, done: false })) }
          : m
      )
    );
    log(`Reset mission: ${id}`);
  }, [log]);

  const resetAllMissions = useCallback(() => {
    setMissions(initialMissions.map((m) => ({ ...m, status: 'not-started', objectives: m.objectives.map((o) => ({ ...o, done: false })) })));
    log('All mission progress reset');
  }, [log]);

  const updateSettings = useCallback((patch: Partial<SimSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const clearActivity = useCallback(() => setActivity([]), []);

  const value = useMemo<SimContextValue>(
    () => ({
      units,
      selectedId,
      settings,
      missions,
      activity,
      targetsRef,
      selectUnit,
      inspectSelected,
      moveSelectedTo,
      stopSelected,
      resetSelected,
      resetAllPositions,
      focusUnitId,
      focusOnSelected,
      clearFocus,
      updateUnitPosition,
      setUnitStatus,
      setUnitMission,
      checkArrival,
      startMission,
      resetMission,
      resetAllMissions,
      updateSettings,
      log,
      clearActivity,
    }),
    [units, selectedId, settings, missions, activity, focusUnitId, targetsRef, selectUnit, inspectSelected, moveSelectedTo, stopSelected, resetSelected, resetAllPositions, focusOnSelected, clearFocus, updateUnitPosition, setUnitStatus, setUnitMission, checkArrival, startMission, resetMission, resetAllMissions, updateSettings, log, clearActivity]
  );

  return <SimContext.Provider value={value}>{children}</SimContext.Provider>;
}

export function useSim() {
  const ctx = useContext(SimContext);
  if (!ctx) throw new Error('useSim must be used within SimProvider');
  return ctx;
}
