import type { Mission } from '@/types';

export const initialMissions: Mission[] = [
  {
    id: 'base-inspection',
    title: 'Base Inspection',
    brief: 'Select and inspect three designated infantry units to verify base readiness.',
    status: 'not-started',
    objectives: [
      { id: 'inspect-s01', label: 'Inspect S-01 Sergeant Reyes', done: false },
      { id: 'inspect-s03', label: 'Inspect S-03 Private Owens', done: false },
      { id: 'inspect-s05', label: 'Inspect S-05 Medic Castro', done: false },
    ],
  },
  {
    id: 'vehicle-deployment',
    title: 'Vehicle Deployment',
    brief: 'Move transport R-01 to the eastern deployment zone marked on the field.',
    status: 'not-started',
    objectives: [
      { id: 'deploy-r01', label: 'Move R-01 to deployment zone', done: false },
    ],
  },
  {
    id: 'training-exercise',
    title: 'Training Exercise',
    brief: 'Move two designated units to their assigned training markers on the field.',
    status: 'not-started',
    objectives: [
      { id: 'train-t01', label: 'Move T-01 to training point Alpha', done: false },
      { id: 'train-s06', label: 'Move S-06 to training point Bravo', done: false },
    ],
  },
];

// Target destinations used by missions
export const missionTargets: Record<string, [number, number, number]> = {
  'deploy-r01': [22, 0, 14],
  'train-t01': [0, 0, 18],
  'train-s06': [-22, 0, 18],
};

export const deploymentZone: [number, number, number] = [22, 0, 14];
