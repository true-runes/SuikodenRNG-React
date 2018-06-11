import Area from './Area';
import RNG from './rng';
import { FindRNGStatus as Status } from './interfaces';

export function findRNG(area: Area, encounters: number[], rng: RNG, progress?: (status: Status) => void): number|null {
  let status: Status = {
    message: '',
    progress: 0,
    done: false,
  };
  const startTime = new Date().getTime();
  if (encounters.length <= 1) { return null; }
    // Smaller array size is slower but more space efficient. Performance drop should be negligable.
  const arraySize = 0xffff;
  const fights = new Array(arraySize);
  const fightsRNG = new Array(arraySize);
  for (let i = 0, index = 0; i < 0xffffffff; i++) {
    if (area.isBattle(rng)) {
      fights[index] = area.getEncounterIndex(rng);
      fightsRNG[index] = rng.getRNG();
      index++;
      if (index === arraySize - 1) {
        status.message = `Checking group of ${arraySize} fights`;
        progress ? progress(status) : console.log(status);
        const result = bayerMoore(fights, encounters, area.encounterTable.length);
        if (result !== null) {
          status.done = true;
          status.result = fightsRNG[result];
          status.message = `Runtime: ${(new Date().getTime() - startTime) / 1000} seconds.`;
          progress ? progress(status) : console.log(status);
          return fightsRNG[result];
        }

        // Takes end of fights and puts it in the beginning for next iteration
        // Number of fight taken is length of pattern.
        for (let j = arraySize - encounters.length, k = 0; j < encounters.length; j++, k++) {
          fights[k] = fights[j];
          fightsRNG[k] = fights[j];
        }
        index = encounters.length;
        status.message = 'Generating fights to search';
        progress ? progress(status) : console.log(status);
      }
    }
    rng.next();
    if (i % 42949672 === 0) {
      status.message = 'Generating fights to search';
      status.progress = i / 42949672;
      progress ? progress(status) : console.log(status);
    }
  }
  return null;
}

export function bayerMoore(input: number[], pattern: number[], max: number): number | null {
  // Create bad char array
  const badChar: Array<number> = new Array(max).fill(-1);
  for (let j = 0; j < pattern.length - 1; j++) {
    badChar[pattern[j]] = j;
  }

  // var pttrnIndx = pattern.length - 1;
  let i = pattern.length - 1;
  while (i < input.length) {
    // check if match
    let inputIndx = i;
    let pttrnIndx = pattern.length - 1;
    while (input[inputIndx] === pattern[pttrnIndx]) {
      inputIndx--;
      pttrnIndx--;
      if (pttrnIndx === -1) {
        return i - pattern.length + 1;
      }
    }
    const badCharVal = badChar[input[inputIndx]];
    // console.log('badCharVal:', badCharVal);
    const jump = badCharVal === -1 ? pattern.length - 1 : pattern.length - badCharVal - 1;
    i += jump;
  }
  return null;
}

export function fr(fights: number[], encounters: number[], encounterTableLength: number): number|null {
  return bayerMoore(fights, encounters, encounterTableLength);
}
