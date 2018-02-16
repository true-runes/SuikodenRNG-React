import * as React from 'react';
import RNG from '../lib/rng';
import AreaClass from '../lib/Area';
import Presenter from './Presenter';
import { areaNames, numToHexString } from '../lib/lib';
import { Container, DropdownProps, Form } from 'semantic-ui-react';
import 'react-virtualized/styles.css';

interface Props {
  areas: {
    [key: string]: AreaClass
  };
}

interface State {
  rng: string;
  iterations: number;
  area: string;
  enemyGroup: number;
  drops: { index: number, rng: number, drop: string}[];
}

export default class EncountersContainer extends React.Component<Props, State> {
  state = {
    rng: numToHexString(0x12),
    iterations: 1000,
    area: 'Cave of the Past',
    enemyGroup: 0,
    drops: []
  };

  handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.currentTarget;
    const name: string = target.name;
    const value: string = target.value;
    this.setState(prevState => ({ ...prevState, [name]: value }));
  }

  handleAreaChange = (e: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    this.setState({ area: data.value as string });
  }

  handleEnemyGroupChange = (e: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    this.setState({ enemyGroup: data.value as number });
  }

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const area = this.props.areas[this.state.area];
    const rng: RNG = new RNG(parseInt(this.state.rng));
    const group = area.encounterTable[this.state.enemyGroup];
    const drops = group.calculateDrops(rng, this.state.iterations).map((drop, index) => {
      return {
        drop: drop.drop,
        index,
        rng: drop.rng
      };
    });
    this.setState({ drops });
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
            type="number"
            value={this.state.iterations}
            onChange={this.handleInputChange}
          />
          <Form.Dropdown
            label="Area"
            placeholder="Area"
            options={areaNames.map((name) => { return { key: name, value: name, text: name }; })}
            value={this.state.area}
            onChange={this.handleAreaChange}
            search={true}
            selection={true}
          />
          <Form.Dropdown
            label="Enemy Group"
            placeholder="Enemy Group"
            options={this.props.areas[this.state.area].encounterTable.map((group, index) => {
              return { key: group.name, value: index, text: group.name };
            })}
            value={this.state.enemyGroup}
            onChange={this.handleEnemyGroupChange}
            search={true}
            selection={true}
          />
          <Form.Button type="submit" content="Calculate Drops" primary={true}/>
        </Form>
        {this.state.drops.length > 0 &&
          <Presenter drops={this.state.drops}/>
        }
      </Container>
    );
  }
}
