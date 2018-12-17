import * as React from 'react';
import AreaClass from '../lib/Area';
import { FindRNGStatus as Status } from '../lib/interfaces';
import DoubleListSelector from '../components/DoubleListSelector';
import RNGFinderStatus from './Status';
import { areaNamesWithRandomEncounters } from '../lib/lib';
import { Container, Form, DropdownProps } from 'semantic-ui-react';

let findRNGWorker = require('worker-loader!../lib/findRNGWorker.js');

interface Props {
  areas: {
    [key: string]: AreaClass
  };
}

interface State {
  rng: string;
  area: string;
  fightList: number[];
  running: boolean;
  status: Status;
  worker: Worker;
}

export default class RNGFinderContainer extends React.Component<Props, State> {
  state = {
    rng: '0x12',
    area: areaNamesWithRandomEncounters[0],
    fightList: [],
    status: {
      progress: 0,
      message: '',
      done: false,
    },
    running: false,
    worker: new findRNGWorker()
  };

  handleInputChange = (event: React.FormEvent<HTMLInputElement>, { checked, name, value }) => {
    this.setState(prevState => ({ ...prevState, [name]: checked || value }));
  }

  handleAreaChange = (e: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    const area = data.value as string;
    const fightList = area === this.state.area ? this.state.fightList : [];
    this.setState({ area, fightList });
  }

  handleFightListChange = (list: number[]) => {
    this.setState({ fightList: list });
  }

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!this.state.running && this.state.fightList.length > 1) {
      this.setState({ running: true }, () => {
        const area: AreaClass = this.props.areas[this.state.area];
        const areaProps = {
          dungeon: area.areaType === 'Dungeon',
          tableLength: area.encounterTable.length,
          encounterRate: area.encounterRate
        };
        const rng: number = parseInt(this.state.rng);
        const encounters = this.state.fightList;
        this.state.worker.postMessage({ area: areaProps, encounters, rng});
        this.state.worker.onmessage = (m: any) => {
          const result = m.data.result ? m.data.result.rng : null;
          const prevBattleRNG = m.data.prevBattleRNG ? m.data.prevBattleRNG.rng : null;
          const status = {...m.data, result, prevBattleRNG };
          this.setState({ status, running: !status.done });
        };
      });
    }
  }

  handleStop = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    this.state.worker.terminate();
    this.setState({ worker: new findRNGWorker(), running: false });
  }

  render() {
    return (
      <Container textAlign="center">
        <Form size="large" onSubmit={this.handleSubmit}>
          <Form.Input
            label="Initial RNG Value"
            name="rng"
            type="text"
            value={this.state.rng}
            onChange={this.handleInputChange}
          />
          <Form.Dropdown
            label="Areas"
            placeholder="Area"
            options={areaNamesWithRandomEncounters.map(name =>
              ({ key: name, value: name, text: this.props.areas[name].name })
            )}
            value={this.state.area}
            onChange={this.handleAreaChange}
            search={true}
            selection={true}
          />
          <DoubleListSelector
            handleChange={this.handleFightListChange}
            list={this.state.fightList}
            options={this.props.areas[this.state.area].encounterTable.map((group) => {
              return group.name;
            })}
          />
          <Form.Button style={{ marginBottom: '1em' }} type="submit" content="Find RNG Seed" primary={true}/>
        </Form>
        {this.state.status.message !== '' &&
          <RNGFinderStatus
            running={this.state.running}
            cancel={this.handleStop}
            {...this.state.status}
          />
        }
      </Container>
    );
  }
}
