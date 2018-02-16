import * as React from 'react';
import AreaClass from '../lib/Area';
import { areaNames, numToHexString } from '../lib/lib';
import { Container, DropdownProps, Form } from 'semantic-ui-react';
import  RunAssistantTool  from './RunAssistantTool';

interface Props {
  areas: {
    [key: string]: AreaClass
  };
}

interface State {
  rng: string;
  iterations: number;
  partylevel: number;
  area: string[];
  runassistant?: {
    areas: AreaClass[]
    rng: number,
    iterations: number,
    partylevel: number
  };
}

export default class RunAssistantContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      rng: numToHexString(0x12),
      iterations: 1000,
      partylevel: 0,
      area: ['Cave of the Past']
    };
  }

  handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.currentTarget;
    const name: string = target.name;
    const value: string = target.value;
    this.setState(prevState => ({ ...prevState, [name]: value }));
  }

  handleAreaChange = (e: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    this.setState({ area: data.value as string[] });
  }

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.setState({
      runassistant: {
        areas: this.state.area.map((area: string) => (this.props.areas[area])),
        rng: parseInt(this.state.rng),
        iterations: this.state.iterations,
        partylevel: this.state.partylevel
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        <Container textAlign="center">
        { !this.state.runassistant &&
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
              options={areaNames.map((name) => { return { key: name, value: name, text: name }; })}
              value={this.state.area}
              onChange={this.handleAreaChange}
              multiple={true}
              search={true}
              selection={true}
            />
            <Form.Button type="submit" content="Generate Encounters" primary={true}/>
          </Form> }
        </Container>
        {this.state.runassistant && <RunAssistantTool {...this.state.runassistant}/>}
      </React.Fragment>
    );
  }
}
