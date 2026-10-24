import type { Unit } from '@/types';

export const initialUnits: Unit[] = [
  // 6 soldiers
  { id: 'S-01', name: 'Sergeant Reyes', type: 'soldier', position: [-14, 0, -8], home: [-14, 0, -8], status: 'idle', speed: 4, mission: null, color: '#6b7242' },
  { id: 'S-02', name: 'Corporal Lin', type: 'soldier', position: [-11, 0, -8], home: [-11, 0, -8], status: 'idle', speed: 4, mission: null, color: '#6b7242' },
  { id: 'S-03', name: 'Private Owens', type: 'soldier', position: [-8, 0, -8], home: [-8, 0, -8], status: 'idle', speed: 4, mission: null, color: '#6b7242' },
  { id: 'S-04', name: 'Private Hahn', type: 'soldier', position: [-14, 0, -5], home: [-14, 0, -5], status: 'idle', speed: 4, mission: null, color: '#7a8146' },
  { id: 'S-05', name: 'Medic Castro', type: 'soldier', position: [-11, 0, -5], home: [-11, 0, -5], status: 'idle', speed: 4, mission: null, color: '#5c6338' },
  { id: 'S-06', name: 'Sniper Vega', type: 'soldier', position: [-8, 0, -5], home: [-8, 0, -5], status: 'idle', speed: 4, mission: null, color: '#4f5630' },

  // 2 tanks
  { id: 'T-01', name: 'Tank "Ironclad"', type: 'tank', position: [12, 0, -10], home: [12, 0, -10], status: 'idle', speed: 2, mission: null, color: '#4a5a32' },
  { id: 'T-02', name: 'Tank "Bulwark"', type: 'tank', position: [16, 0, -10], home: [16, 0, -10], status: 'idle', speed: 2, mission: null, color: '#3f4f2c' },

  // 2 APCs (armored personnel carriers)
  { id: 'A-01', name: 'APC "Warden"', type: 'apc', position: [12, 0, -4], home: [12, 0, -4], status: 'idle', speed: 3, mission: null, color: '#5d6b43' },
  { id: 'A-02', name: 'APC "Sentinel"', type: 'apc', position: [16, 0, -4], home: [16, 0, -4], status: 'idle', speed: 3, mission: null, color: '#53623c' },

  // 2 transport trucks
  { id: 'R-01', name: 'Transport "Hauler"', type: 'truck', position: [-12, 0, 12], home: [-12, 0, 12], status: 'idle', speed: 2.5, mission: null, color: '#6b6147' },
  { id: 'R-02', name: 'Transport "Carrier"', type: 'truck', position: [-7, 0, 12], home: [-7, 0, 12], status: 'idle', speed: 2.5, mission: null, color: '#5f5640' },
];
