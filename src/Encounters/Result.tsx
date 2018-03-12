import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import RNG from '../lib/rng';
import AreaClass from '../lib/Area';
import Presenter from './Presenter';
import { Fight } from '../lib/interfaces';
import { numToHexString } from '../lib/lib';
import { Container } from 'semantic-ui-react';

interface Props extends RouteComponentProps<any> {
  areas: {
    [key: string]: AreaClass
  };
}

interface State {
  encounters: any[];
}

function Encounters(areas: AreaClass[], rng: RNG, iterations: number, partyLvl: number): Fight[] {
  const encounters: Fight[] = [];
  for (let i = 0; i < iterations; i++) {
    for (const area of areas) {
      if (area.isBattle(rng)) {
        const fight = area.getEncounter(rng);
        if (!(partyLvl > 0 && partyLvl > fight.enemyGroup.champVal)) {
          encounters.push(fight);
        }
      }
    }
    rng.next();
  }
  return encounters;
}

class EncountersGenerator extends React.Component<Props, State> {
  state = {
    encounters: [],
  };

  componentDidMount() {
    const params: URLSearchParams = new URLSearchParams(this.props.location.search);
    const rng: RNG = new RNG(parseInt(params.get('rng') as string));
    const iterations: number = parseInt(params.get('iterations') as string);
    const partylevel: number = parseInt(params.get('partylevel') as string);
    const areas: AreaClass[] = params.getAll('areas').map((name) => {
      return this.props.areas[name];
    });
    const encounters = Encounters(areas, rng, iterations, partylevel).map((fight) => {
      return {
        area: fight.area,
        enemy: fight.enemyGroup.name,
        index: fight.index,
        run: fight.run ? 'Run' : 'Fail',
        startRNG: numToHexString(fight.startRNG),
        battleRNG: numToHexString(fight.battleRNG),
        wheel: fight.wheel
      };
    });
    this.setState({ encounters });
  }

  render() {
    return (
      <Container style={{ flex: 1 }} textAlign="center">
        <Presenter encounters={this.state.encounters}/>
      </Container>
    );
  }
}

export default withRouter(EncountersGenerator);
