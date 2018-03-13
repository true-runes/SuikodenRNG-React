import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import AreaClass from '../lib/Area';
import RNG from '../lib/rng';
import { Fight } from '../lib/interfaces';
import { ConnectedTable as Table } from './Table';
import ConnectedControls from './Controls';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';

interface Props extends RouteComponentProps<any> {
  areas: {
    [key: string]: AreaClass
  };
}

class RunAssistantTool extends React.Component<Props, { store: any }> {
  constructor(props: Props) {
    super(props);
    const params: URLSearchParams = new URLSearchParams(this.props.location.search);
    const rng: number = parseInt(params.get('rng') as string);
    const iterations: number = parseInt(params.get('iterations') as string);
    const partylevel: number = parseInt(params.get('partylevel') as string);
    const areas: AreaClass[] = params.get('areas')!.split(',').map((name) => {
      return this.props.areas[name];
    });
    const fightsList: Fight[][] = areas.map(area => area.generateEncounters(new RNG(rng), iterations, partylevel));
    const initialState = {
      currentArea: 0,
      areas: areas.map((area: AreaClass) => {
        return {
          name: area.name,
          enemies: area.encounterTable.map((group) => { return group.name; })
        };
      }),
      fightsList,
      fightIndex: 0,
      rngIndex: 0
    };
    this.state = { store: createStore(reducer, initialState) };
  }

  render() {
    return (
      <Provider store={this.state.store}>
        <React.Fragment>
          <ConnectedControls/>
          <Table/>
        </React.Fragment>
      </Provider>
    );
  }
}

export default withRouter(RunAssistantTool);
