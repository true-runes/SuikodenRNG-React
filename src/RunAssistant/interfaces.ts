import { EnemyGroupData, Fight } from '../lib/interfaces';

export interface RunAssistState {
  currentArea: number;
  areas: { name: string, enemies: EnemyGroupData[] }[];
  fightsList: Fight[][];
  fightIndex: number;
  rngIndex: number;
}
