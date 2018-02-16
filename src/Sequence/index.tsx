import * as React from 'react';
import RNG from '../lib/rng';
import { numToHexString } from '../lib/lib';
import Presenter from './Presenter';
import { Container, Form } from 'semantic-ui-react';

interface State {
  start: string;
  iterations: number;
  sequence: string[];
}

export default class SequenceContainer extends React.Component<{}, State> {
  state = {
    start: numToHexString(0x12),
    iterations: 1000,
    sequence: []
  };

  handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.currentTarget;
    const name: string = target.name;
    const value: string = target.value;
    this.setState(prevState => ({ ...prevState, [name]: value }));
  }

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const rng: RNG = new RNG(parseInt(this.state.start));
    const sequence: string[] = [];
    for (let i = 0; i < this.state.iterations; i++) {
      sequence.push(numToHexString(rng.getRNG()));
      rng.next();
    }
    this.setState({ sequence });
  }

  render() {
    return (
      <Container textAlign="center">
        <Form onSubmit={this.handleSubmit}>
          <Form.Input
            label="Initial RNG Value"
            name="start"
            type="text"
            value={this.state.start}
            onChange={this.handleInputChange}
          />
          <Form.Input
            label="Iterations"
            name="iterations"
            type="number"
            value={this.state.iterations}
            onChange={this.handleInputChange}
          />
          <Form.Button type="submit" content="Calculate Sequence" primary={true}/>
        </Form>
      {this.state.sequence.length > 0 && <Presenter sequence={this.state.sequence}/>}
      </Container>
    );
  }
}
