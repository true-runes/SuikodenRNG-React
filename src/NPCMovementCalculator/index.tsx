import * as React from 'react';
import { numToHexString } from '../lib/lib';
import { Container, Form } from 'semantic-ui-react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

interface State {
  rng: string;
  iterations: number;
}

class NPCalcForm extends React.Component<RouteComponentProps<any>, State> {
  state = {
    rng: numToHexString(0x12),
    iterations: 1000,
  };

  handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.currentTarget;
    const name: string = target.name;
    const value: string = target.value;
    this.setState(prevState => ({ ...prevState, [name]: value }));
  }

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params: URLSearchParams = new URLSearchParams();
    Object.keys(this.state).forEach((key) => {
      params.append(key, this.state[key]);
    });
    this.props.history.push(`/npc/result?${params.toString()}`);
  }

  render() {
    return (
      <Container textAlign="center">
        <Form onSubmit={this.handleSubmit}>
          <Form.Input
            label="Initial RNG Value"
            name="rng"
            type="text"
            value={this.state.rng}
            onChange={this.handleInputChange}
          />
          <Form.Input
            label="Iterations"
            name="iterations"
            step="500"
            type="number"
            value={this.state.iterations}
            onChange={this.handleInputChange}
          />
          <Form.Button type="submit" content="Calculate NPC Movements" primary={true}/>
        </Form>
      </Container>
    );
  }
}

export default withRouter(NPCalcForm);
