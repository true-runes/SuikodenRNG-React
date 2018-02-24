export interface Fight {
  area: string;
  enemyGroup: EnemyGroupData;
  startRNG: number;
  battleRNG: number;
  index: number;
  run: boolean;
  wheel: number;
}

export interface EnemyGroupData {
  name: string;
  enemies: Enemy[];
  champVal: number;
}

export interface FindRNGStatus {
  message: string | number;
  progress: number;
  done: boolean;
  result?: number;
}

export interface Encounter {
  name: string;
  parseString: string;
}

export interface Area {
  name: string;
  encounterRate: number;
  encounters: Encounter[];
  enemies: Enemies;
  areaType: string | null;
}

export interface Enemies {
  [key: string]: Enemy;
}

export interface Areas {
  [key: string]: Area;
}

export interface CalculatedDrop {
  rng: number;
  drop: string;
}

export interface Enemy {
  bits: number;
  drops: Drop[];
  stats: Stats;
}

export interface Drop {
  item: string;
  rate: number;
}

export interface Stats {
    DEF: number;
    HP: number;
    LUK: number;
    MGC: number;
    PWR: number;
    SKL: number;
    SPD: number;
    lvl: number;
}
