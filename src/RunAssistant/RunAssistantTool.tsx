import * as React from 'react';
import AreaClass from '../lib/Area';
import RNG from '../lib/rng';
import { Fight } from '../lib/interfaces';
import { ConnectedTable as Table } from './Table';
import ConnectedControls from './Controls';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';

interface Props {
  areas: AreaClass[];
  rng: number;
  iterations: number;
  partylevel: number;
}

function genFights(areas: AreaClass[], r: number, iterations: number, partylevel: number): Fight[][] {
  const rng: RNG = new RNG(r);
  const fightsList: Fight[][] = [];
  for (const area of areas) {
    const fights = [];
    for (let i = 0; i < iterations; i++) {
      if (area.isBattle(rng)) {
        const fight = area.getEncounter(rng);
        if (!(partylevel > 0 && partylevel > fight.enemyGroup.champVal)) {
          fights.push(fight);
        }
      }
      rng.next();
    }
    fightsList.push(fights.map((fight) => {
      return {
        area: area.name,
        enemyGroup: fight.enemyGroup.name,
        run: fight.run,
        index: fight.index,
        startRNG: fight.startRNG,
        battleRNG: fight.battleRNG,
        wheel: fight.wheel
      };
    }));
    rng.reset();
  }
  return fightsList;
}

export default class RunAssistantTool extends React.Component<Props, { store: any }> {
  constructor(props: Props) {
    super(props);
    const { areas, rng, iterations, partylevel } = props;
    const initialState = {
      currentArea: 0,
      areas: areas.map((area: AreaClass) => {
        return {
          name: area.name,
          enemies: area.encounterTable.map((group) => { return group.name; })
        };
      }),
      fightsList: genFights(areas, rng, iterations, partylevel),
      fightIndex: 0,
      rngIndex: 0
    };
    this.state = { store: createStore(reducer, initialState) };
  }

  render() {
    return (
      <Provider store={this.state.store}>
        <React.Fragment>
          <ConnectedControls/>
          <Table/>
        </React.Fragment>
      </Provider>
    );
  }
}
