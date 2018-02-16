import { Fight } from '../../lib/interfaces';
import { RunAssistState } from '../interfaces';

const defaultState: RunAssistState = {
  currentArea: 0,
  areas: [],
  fightsList: [],
  fightIndex: 0,
  rngIndex: 0
};

function calcFightIndexAfterRNGChange(fights: Fight[], rngIndex: number): number {
  for (let i = 0; i < fights.length; i++) {
    if (fights[i].index > rngIndex) {
      return i;
    }
  }
  return fights.length - 1;
}

function calcRNGIndexJump(current: number, jump: number, last: number): number {
  if (current + jump < 0) {
    return 0;
  } else if (current + jump > last) {
    return last;
  }
  return current + jump;
}

const reducer = (state: RunAssistState = defaultState, action: any) => {
  const { currentArea, areas } = state;
  const fights: Fight[] = state.fightsList[currentArea];
  let { fightIndex, rngIndex } = state;

  switch (action.type) {
    case 'SWITCH_AREA':
      // TODO: Modify fightIndex to adjust for area change
      const index: number = areas.map((area) => { return area.name; }).indexOf(action.area);
      return {
        ...state,
        currentArea: index !== -1 ? index : currentArea
      };
    case 'PREVIOUS_FIGHT':
      if (fightIndex !== 0) {
        return {
          ...state,
          fightIndex: fightIndex - 1,
          rngIndex: fights[fightIndex - 1].battleRNG
        };
      }
      return state;
    case 'NEXT_FIGHT':
      if (fightIndex < fights.length - 1) {
        return {
          ...state,
          fightIndex: fightIndex + 1,
          rngIndex: fights[fightIndex + 1].battleRNG
        };
      }
      return state;
    case 'SELECT_FIGHT':
      return {
        ...state,
        fightIndex: action.index,
        rngIndex: fights[action.index].battleRNG
      };
    case 'JUMP_RNG':
      rngIndex = calcRNGIndexJump(state.rngIndex, action.jump, fights[fights.length - 1].index);
      fightIndex = calcFightIndexAfterRNGChange(fights, rngIndex);
      return {
        ...state,
        rngIndex,
        fightIndex
      };
    default:
      return state;
  }
};

export default reducer;
