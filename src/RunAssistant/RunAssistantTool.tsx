import * as React from 'react';
import { Provider } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Divider } from 'semantic-ui-react';
import AreaClass from '../lib/Area';
import RNG from '../lib/rng';
import { Fight } from '../lib/interfaces';
import { ConnectedTable as Table } from './Table';
import ConnectedControls from './Controls';
import { createStore, applyMiddleware } from 'redux';
import reducer from './reducers';
import { createLogger } from 'redux-logger';

const logger = createLogger({});

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
          enemies: area.encounterTable.map((group) => {
            const { name, enemies, champVal } = group;
            return { name, enemies, champVal };
          })
        };
      }),
      fightsList,
      index: 0
    };
    this.state = { store: createStore(reducer, initialState, applyMiddleware(logger)) };
  }

  render() {
    return (
      <Provider store={this.state.store}>
        <React.Fragment>
          <ConnectedControls/>
          <Divider hidden={true}/>
          <Table/>
        </React.Fragment>
      </Provider>
    );
  }
}

export default withRouter(RunAssistantTool);
