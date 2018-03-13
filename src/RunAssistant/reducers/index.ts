import { Fight } from '../../lib/interfaces';
import { RunAssistState as State } from '../interfaces';
import { handleActions } from 'redux-actions';

const initialState: State = {
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

export default handleActions(
  {
    SWITCH_AREA: (state: State, action) => {
      // TODO: Modify fightIndex to adjust for area change
      const index: number = state.areas.map(area => area.name).findIndex(name => action.area === name);
      return {
        ...state,
        currentArea: index !== -1 ? index : state.currentArea
      };
    },
    PREVIOUS_FIGHT: (state: State, action) => {
      if (state.fightIndex !== 0) {
        return {
          ...state,
          fightIndex: state.fightIndex - 1,
          rngIndex: getCurrentFights(state)[state.fightIndex - 1].battleRNG
        };
      }
      return state;
    },
    NEXT_FIGHT: (state, action) => {
      if (state.fightIndex < state.fightsList.length - 1) {
        return {
          ...state,
          fightIndex: state.fightIndex + 1,
          rngIndex: getCurrentFights(state)[state.fightIndex + 1].battleRNG
        };
      }
      return state;
    },
    SELECT_FIGHT: (state, action) => {
      if (action.index < getCurrentFights(state).length - 1) {
        return {
          ...state,
          fightIndex: action.index,
          rngIndex: getCurrentFights(state)[action.index].battleRNG
        };
      }
      return state;
    },
    FIND_FIGHT: (state, action) => {
      let fightIndex = getCurrentFights(state).findIndex((fight, index) => {
        return (fight.enemyGroup.name === action.name && index > state.fightIndex);
      });
      fightIndex = fightIndex !== -1 ? fightIndex : state.fightIndex;
      return {
        ...state,
        fightIndex,
        rngIndex: getCurrentFights(state)[fightIndex].battleRNG
      };
    },
    JUMP_RNG: (state, action) => {
      const fights: Fight[] = getCurrentFights(state);
      const rngIndex = calcRNGIndexJump(state.rngIndex, action.jump, fights[fights.length - 1].index);
      const fightIndex = calcFightIndexAfterRNGChange(fights, rngIndex);
      return {
        ...state,
        rngIndex,
        fightIndex
      };
    }
  },
  initialState);

export function getCurrentFights(state: State): Fight[] {
  return state.fightsList[state.currentArea];
}
