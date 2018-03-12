import * as React from 'react';
import RNG from '../lib/rng';
import { numToHexString } from '../lib/lib';
import Presenter from './Presenter';
import { Container } from 'semantic-ui-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

interface State {
  sequence: string[];
}

class SequenceResult extends React.Component<RouteComponentProps<any>, State> {
  state = {
    sequence: []
  };

  componentDidMount() {
    const params: URLSearchParams = new URLSearchParams(this.props.location.search);
    const rng: RNG = new RNG(parseInt(params.get('rng') as string));
    const iterations: number = parseInt(params.get('iterations') as string);
    const sequence: string[] = [];
    for (let i = 0; i < iterations; i++) {
      sequence.push(numToHexString(rng.getRNG()));
      rng.next();
    }
    this.setState({ sequence });
  }

  render() {
    return (
      <Container style={{ flex: 1 }} textAlign="center">
        <Presenter sequence={this.state.sequence}/>
      </Container>
    );
  }
}

export default withRouter(SequenceResult);
