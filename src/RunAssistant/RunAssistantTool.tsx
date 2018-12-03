import * as React from 'react';
import { Provider } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { Divider } from 'semantic-ui-react';
import AreaClass from '../lib/Area';
import RNG from '../lib/rng';
import { Fight } from '../lib/interfaces';
import { ConnectedTable as Table } from './Table';
import ConnectedControls from './Controls';
import reducer from './reducers';
import { initialState as configDefault } from './reducers/config';

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
    const fightsList: Fight[][] = areas.map(
      area => area.generateEncounters(new RNG(rng), iterations, partylevel)
    );
    const index: number = params.get('index') !== null
      ? parseInt(params.get('index') as string)
      : 0;

    let config = window.localStorage.getItem('config');
    config = config === null ? configDefault : {
      ...configDefault,
      ...JSON.parse(config),
      table: {
        ...configDefault.table,
        ...JSON.parse(config).table,
        rowStyle: {
          ...configDefault.table.rowStyle,
          ...JSON.parse(config).table.rowStyle
        }
      }
    };

    const initialState = {
      RunAssistant: {
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
        index: index < fightsList[0].length ? index : 0,
        pattern: []
      },
      config: config
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
