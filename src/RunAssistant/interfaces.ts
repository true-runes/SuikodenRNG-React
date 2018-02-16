import { Fight } from '../lib/interfaces';

export interface RunAssistState {
  currentArea: number;
  areas: { name: string, enemies: string[] }[];
  fightsList: Fight[][];
  fightIndex: number;
  rngIndex: number;
}
