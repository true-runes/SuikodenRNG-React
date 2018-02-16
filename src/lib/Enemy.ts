export interface Enemy {
  bits: string;
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
