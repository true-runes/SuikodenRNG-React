import { EnemyGroupData, Fight } from '../lib/interfaces';

export interface RunAssistState {
  currentArea: number;
  areas: { name: string, enemies: EnemyGroupData[] }[];
  fightsList: Fight[][];
  index: number;
  pattern: number[];
}

export interface ConfigState {
  useImages: boolean;
}

export interface State {
  RunAssistant: RunAssistState;
  config: ConfigState;
}
