import * as React from 'react';
import { AutoSizer } from 'react-virtualized';
import { Column } from '../interfaces/Table';
import Table from './Table';
import Filter from './Filter';
import ColumnDropdown from './ColumnDropdown';
import reducer from './reducers';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Container } from 'semantic-ui-react';

interface Props {
  data: {}[];
  columns: Column[];
  currentRow?: number;
  onRowClick?: (index: number) => any;
}

export default class TableContainer extends React.Component<Props, { store: any, rowsToRender?: number[] }> {
  constructor(props: Props) {
    super(props);
    const initialState = {
      columns: props.columns
    };
    this.state = {
      rowsToRender: undefined,
      store: createStore(reducer, initialState)
    };
  }

  componentWillReceiveProps(prevProps: Props) {
    if (prevProps.data !== this.props.data) {
      this.setState({ rowsToRender: undefined });
    }
  }

  render() {
    const data = this.state.rowsToRender ? (this.state.rowsToRender as number[]).map((rowIndex) => {
      return this.props.data[rowIndex];
    }) : this.props.data;

    return (
      <Provider store={this.state.store}>
        <AutoSizer>
          {({ height, width }) => (
            <Container>
              <div style={{ display: 'flex', 'justifyContent': 'space-between', width, height: 38 }}>
                <Filter
                  data={this.props.data}
                  setRowsToRender={(rows: number[]) => this.setState({ rowsToRender: rows })}
                />
                <ColumnDropdown/>
              </div>
              <Table
                {...this.props}
                data={data}
                height={height - 38}
                width={width}
              />
            </Container>
          )}
        </AutoSizer>
      </Provider>
    );
  }
}
