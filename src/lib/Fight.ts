import EnemyGroup from './EnemyGroup';
import { div32ulo } from './lib';
import RNG from './rng';

function isRun(r2: number) {
  let r3 = 100;
  r3 = r2 % r3;
  return r3 > 50 ? true : false;
}

function wheelSuccess(rng: RNG) {
  let counter = 0;
  const success = (pos: number) => {
    return pos >= 0x7f && pos <= 0xa0;
  };
  do {
    counter++;
    rng.next();
  } while (!success(div32ulo(rng.getRNG2(), 0x5a)));
  return --counter;
}

export default function Fight(area: string, enemyGroup: EnemyGroup, rng: RNG) {
  return {
    enemyGroup: enemyGroup,
    area: area,
    startRNG: rng.getRNG(),
    battleRNG: rng.getNext().rng,
    index: rng.getCount(),
    run: isRun(rng.getNext(2).rng2),
    wheel: wheelSuccess(rng.clone().next()),
  };
}
