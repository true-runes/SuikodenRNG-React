import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import RNG from '../lib/rng';
import AreaClass from '../lib/Area';
import Presenter from './Presenter';
import { Container } from 'semantic-ui-react';

interface Props extends RouteComponentProps<any> {
  areas: {
    [key: string]: AreaClass
  };
}

interface State {
  drops: { index: number, rng: number, drop: string}[];
}

class ItemDropsResult extends React.Component<Props, State> {
  state = {
    drops: []
  };

  componentDidMount() {
    const params: URLSearchParams = new URLSearchParams(this.props.location.search);
    const rng: RNG = new RNG(parseInt(params.get('rng') as string));
    const iterations: number = parseInt(params.get('iterations') as string);
    const area: AreaClass = this.props.areas[params.get('area') as string];
    const group = area.encounterTable[params.get('enemyGroup') as string];
    const drops = group.calculateDrops(rng, iterations).map((drop, index) => {
      return {
        drop: drop.drop,
        index,
        rng: drop.rng
      };
    });
    console.log(drops);
    this.setState({ drops });
  }

  render() {
    return (
      <Container style={{ flex: 1 }} textAlign="center">
        <Presenter drops={this.state.drops}/>
      </Container>
    );
  }
}

export default withRouter(ItemDropsResult);
