import * as React from 'react';
import RNG from '../lib/rng';
import { div32ulo, numToHexString } from '../lib/lib';
import Presenter from './Presenter';
import { Container } from 'semantic-ui-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

interface State {
  NPCInfo: NPCInfo[];
}

interface NPCInfo {
  rng: string;
  direction: string;
  advance: number;
}

function directionToString(num: number): string {
  const dir = num % 4;
  switch (dir) {
    case 0:
      return 'Down';
    case 1:
      return 'Up';
    case 2:
      return 'Left';
    case 3:
      return 'Right';
    default:
      return '?';
  }
}

class NPCInfoResult extends React.Component<RouteComponentProps<any>, State> {
  state = {
    NPCInfo: []
  };

  componentDidMount() {
    const params: URLSearchParams = new URLSearchParams(this.props.location.search);
    const rng: RNG = new RNG(parseInt(params.get('rng') as string));
    const iterations: number = parseInt(params.get('iterations') as string);
    const result: NPCInfo[] = [];
    for (let i = 0; i < iterations; i++) {
      const move: boolean = rng.getRNG2() < 0xcb;
      let advance: number = 0;
      let direction = '';
      if (move) {
        advance++;
        direction = '?';
        if (div32ulo(rng.getNext().rng2, 0x1fff) > 0) {
          direction = directionToString(div32ulo(rng.getNext(2).rng2, 0x1999));
          advance++;
        }
      }
      result.push({ rng: numToHexString(rng.getRNG()), direction, advance });
      rng.next();
    }
    this.setState({ NPCInfo: result });
  }

  render() {
    return (
      <Container style={{ flex: 1 }} textAlign="center">
        <Presenter NPCInfo={this.state.NPCInfo}/>
      </Container>
    );
  }
}

export default withRouter(NPCInfoResult);
