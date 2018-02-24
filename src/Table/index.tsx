import * as React from 'react';
import { AutoSizer, TableProps } from 'react-virtualized';
import { Column } from '../interfaces/Table';
import Table from './Table';
import Filter from './Filter';
import ColumnDropdown from './ColumnDropdown';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';
import { Container } from 'semantic-ui-react';

interface Props {
  data: {}[];
  columns: Column[];
  currentRow?: number;
  onRowClick?: TableProps['onRowClick'];
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

  render() {
    const data = this.state.rowsToRender ? (this.state.rowsToRender as number[]).map((rowIndex) => {
      return this.props.data[rowIndex];
    }) : this.props.data;

    return (
      <Provider store={this.state.store}>
        <AutoSizer>
          {({ height, width }) => (
            <Container>
              <div style={{ display: 'flex', 'justifyContent': 'space-between', width }}>
                <Filter
                  data={this.props.data}
                  setRowsToRender={(rows: number[]) => this.setState({ rowsToRender: rows })}
                />
                <ColumnDropdown/>
              </div>
              <Table
                {...this.props}
                data={data}
                height={height}
                width={width}
              />
            </Container>
          )}
        </AutoSizer>
      </Provider>
    );
  }
}
