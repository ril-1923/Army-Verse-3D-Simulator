import type { Vector3Tuple } from 'three';

export type UnitType = 'soldier' | 'tank' | 'apc' | 'truck';

export type UnitStatus = 'idle' | 'moving' | 'inspected' | 'deployed' | 'training' | 'standby';

export interface Unit {
  id: string;
  name: string;
  type: UnitType;
  position: Vector3Tuple;
  home: Vector3Tuple;
  status: UnitStatus;
  speed: number;
  mission: string | null;
  color: string;
}

export type MissionId = 'base-inspection' | 'vehicle-deployment' | 'training-exercise';

export type MissionStatus = 'not-started' | 'active' | 'completed';

export interface MissionObjective {
  id: string;
  label: string;
  done: boolean;
}

export interface Mission {
  id: MissionId;
  title: string;
  brief: string;
  status: MissionStatus;
  objectives: MissionObjective[];
}

export type GraphicsQuality = 'low' | 'medium' | 'high';

export interface SimSettings {
  sound: boolean;
  graphics: GraphicsQuality;
  showLabels: boolean;
  showMarkers: boolean;
}

export interface ActivityEntry {
  id: string;
  time: number;
  text: string;
}

export const TERRAIN_SIZE = 80;
export const TERRAIN_HALF = TERRAIN_SIZE / 2;
