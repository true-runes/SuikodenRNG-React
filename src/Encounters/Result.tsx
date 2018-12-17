import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import RNG from '../lib/rng';
import AreaClass from '../lib/Area';
import Presenter from './Presenter';
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

class EncountersGenerator extends React.Component<Props, State> {
  state = {
    encounters: [],
  };

  componentDidMount() {
    const params: URLSearchParams = new URLSearchParams(this.props.location.search);
    const rng: number = parseInt(params.get('rng') as string);
    const iterations: number = parseInt(params.get('iterations') as string);
    const partylevel: number = parseInt(params.get('partylevel') as string);
    const areas: AreaClass[] = params.get('areas')!.split(',').map((name) => {
      return this.props.areas[name];
    });
    const realistic: boolean = params.get('realistic') === 'true';

    const encounters = areas
      .map(area => area.generateEncounters(new RNG(rng), iterations, partylevel, realistic))
      .reduce(
        (fights: any[], areaFights) => {
          return fights.concat(areaFights);
        },
        [])
      .map((fight) => {
        return {
          area: fight.area,
          enemy: fight.enemyGroup.name,
          index: fight.index,
          run: fight.run ? 'Run' : 'Fail',
          startRNG: numToHexString(fight.startRNG),
          battleRNG: numToHexString(fight.battleRNG),
          wheel: fight.wheel
        };
      })
      .sort((a, b) => {
        if (a.index !== b.index) {
          return a.index - b.index;
        }
        return a.area < b.area ? -1 : 1;
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
