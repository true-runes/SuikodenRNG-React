import * as React from 'react';
import RNG from '../lib/rng';
import AreaClass from '../lib/Area';
import Fight from '../lib/Fight';
import Presenter from './Presenter';
import { areaNames, numToHexString } from '../lib/lib';
import { Container, DropdownProps, Form } from 'semantic-ui-react';

interface Props {
  areas: {
    [key: string]: AreaClass
  };
}

interface State {
  rng: string;
  iterations: number;
  partylevel: number;
  area: string | string[];
  encounters: any[];
}

function Encounters(areas: AreaClass[], rng: RNG, iterations: number, partyLvl: number): Fight[] {
  const encounters = [];
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

export default class EncountersContainer extends React.Component<Props, State> {
  state = {
    rng: numToHexString(0x12),
    iterations: 1000,
    partylevel: 0,
    area: ['Cave of the Past'],
    encounters: []
  };

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
    console.log('Submit called');
    const areas: AreaClass[] = this.state.area.map((name) => {
      return this.props.areas[name];
    });
    const rng: RNG = new RNG(parseInt(this.state.rng));
    const encounters = Encounters(areas, rng, this.state.iterations, this.state.partylevel).map((fight) => {
      return {
        area: fight.area.name,
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
        </Form>
        {this.state.encounters.length > 0 &&
          <Presenter encounters={this.state.encounters}/>
        }
      </Container>
    );
  }
}
