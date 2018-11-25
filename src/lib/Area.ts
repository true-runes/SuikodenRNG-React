import { Encounter, Enemy, Enemies, Fight as FightData, Area } from './interfaces';
import EnemyGroup from './EnemyGroup';
import Fight from './Fight';
import { div32ulo } from './lib';
import RNG from './rng';

export default class AreaClass {
  public name: string;
  public encounterTable: EnemyGroup[];
  public encounterRate: number;
  public areaType: string | null;
  public enemies: Enemies;

  constructor(name: string, area: Area) {
    this.name           = name;
    this.areaType       = area.areaType;
    this.encounterRate  = area.encounterRate;
    this.enemies        = area.enemies;
    // Encounter table has to be initialized after enemies
    this.encounterTable = this.parseEncounterTable(area.encounters);
  }

  public getEncounter(rng: RNG): FightData {
    const enemyGroup = this.encounterTable[this.getEncounterIndex(rng)];
    return Fight(this.name, enemyGroup, rng);
  }

  public isBattle(rng: RNG): boolean {
    return this.areaType === 'Dungeon'
      ? this.isBattleDungeon(rng) : this.isBattleWorldMap(rng);
  }

  public getEnemyGroup(name: string): EnemyGroup | null {
    for (const enemyGroup of this.encounterTable) {
      if (enemyGroup.name === name) {
        return enemyGroup;
      }
    }
    return null;
  }

  public getEncounterIndex(rng: RNG): number {
    const r2 = rng.getNext().rng2;
    const r3 = div32ulo(0x7FFF, this.encounterTable.length);
    let encounterIndex = div32ulo(r2, r3);
    while (encounterIndex >= this.encounterTable.length) {
      encounterIndex--;
    }
    return encounterIndex;
  }

  // Realistic advances RNG whenever getEncounter is called.
  // Sometimes, you get battles at 2 RNG values next to each other
  // ex: You get a battle at index 1444 and index 1445
  // What 99.999% of the time is that you hit the index at 1444 and skip the battle at 1445
  // With realistic false it will show both battles.
  // With realistic on it will show only 1444
  // Realistic is recommended for RunAssistant and RNG finder
  // Also, keep realistic off with partylevel > 0
  public generateEncounters(rng: RNG, iterations: number, partylevel: number, realistic: boolean = false): FightData[] {
    const encounters: FightData[] = [];
    for (let i = 0; i < iterations; i++) {
      if (this.isBattle(rng)) {
        const fight = this.getEncounter(rng);
        if (!(partylevel > 0 && partylevel > fight.enemyGroup.champVal)) {
          encounters.push(fight);
        }
      }
      rng.next();
      if (realistic) {
        rng.next();
        i++;
      }
    }
    return encounters;
  }

  private isBattleWorldMap(rng: RNG): boolean {
    let r2 = rng.getRNG2();
    const r3 = r2;
    r2 = r2 >> 8 << 8;
    r2 = r3 - r2;
    return r2 < this.encounterRate;
  }

  private isBattleDungeon(rng: RNG): boolean {
    let r2 = rng.getRNG2();
    const r3 = 0x7F;
    const mflo = div32ulo(r2, r3);
    r2 = mflo;
    r2 = r2 & 0xFF;
    return r2 < this.encounterRate;
  }

  private parseEncounterTable(encounters: Encounter[]): EnemyGroup[] {
    const encounterTable: EnemyGroup[] = [];
    for (let i = 0; i < encounters.length; i++) {
      const name = encounters[i].name;
      const enemies = this.parseEncounter(encounters[i].parseString, this.enemies);
      const enemyGroup = new EnemyGroup(name, enemies);
      encounterTable.push(enemyGroup);
    }
    return encounterTable;
  }

  private parseEncounter(parseString: string, enemies: object) {
    const encounter = parseString.split(' ');
    const enemyGroup: Enemy[] = [];
    for (let j = 0; j < encounter.length; j = j + 2) {
      const name = encounter[j + 1];
      for (let k = 0; k < parseInt(encounter[j], 10); k++) {
        const enemy = enemies[encounter[j + 1]];
        enemy.name = name;
        enemy.img = require(`../assets/${name}.png`);
        enemyGroup.push(enemies[encounter[j + 1]]);
      }
    }
    return enemyGroup;
  }

}
