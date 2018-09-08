import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import AreaClass from '../lib/Area';
import { areaNamesWithRandomEncounters, numToHexString } from '../lib/lib';
import { Container, DropdownProps, Form } from 'semantic-ui-react';

interface Props extends RouteComponentProps<any> {
  areas: {
    [key: string]: AreaClass
  };
}

interface State {
  rng: string;
  iterations: number;
  partylevel: number;
  areas: string | string[];
}

class EncountersContainer extends React.Component<Props, State> {
  state = {
    rng: numToHexString(0x12),
    iterations: 1000,
    partylevel: 0,
    areas: [],
  };

  handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.currentTarget;
    const name: string = target.name;
    const value: string = target.value;
    this.setState(prevState => ({ ...prevState, [name]: value }));
  }

  handleAreaChange = (e: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    this.setState({ areas: data.value as string[] });
  }

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params: URLSearchParams = new URLSearchParams();
    Object.keys(this.state).forEach((key) => {
      params.append(key, this.state[key]);
    });
    this.props.history.push(`/encounters/result?${params.toString()}`);
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
          <Form.Input
            label="Party Level"
            name="partylevel"
            type="number"
            value={this.state.partylevel}
            onChange={this.handleInputChange}
          />
          <Form.Dropdown
            label="Areas"
            placeholder="Area"
            options={areaNamesWithRandomEncounters.map(name =>
              ({ key: name, value: name, text: this.props.areas[name].name })
            )}
            value={this.state.areas}
            onChange={this.handleAreaChange}
            multiple={true}
            search={true}
            selection={true}
          />
          <Form.Button type="submit" content="Generate Encounters" primary={true}/>
        </Form>
      </Container>
    );
  }
}

export default withRouter(EncountersContainer);
