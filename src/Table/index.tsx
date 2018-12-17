import * as React from 'react';
import { AutoSizer } from 'react-virtualized';
import { Container } from 'semantic-ui-react';
import { Column, RowStyle } from './interfaces';
import Table from './Table';
import Filter from './Filter';
import ColumnDropdown from './ColumnDropdown';
import { arraysEqual, filterPropertiesFromObject } from '../lib/lib';

interface Props {
  data: {}[];
  columns: Column[];
  currentRow?: number;
  onRowClick?: (index: number) => any;
  filter?: boolean;
  filterFromData?: [string];
  headerHeight?: number;
  rowHeight?: number;
  rowStyle?: RowStyle;
}

const createDefaultRowsToRender = (data => data.map((row, index) => index));

export default class TableContainer extends React.Component<Props, { columns: Column[], rowsToRender: number[] }> {
  constructor(props: Props) {
    super(props);
    this.state = {
      rowsToRender: createDefaultRowsToRender(props.data),
      columns: props.columns
    };
  }

  componentWillReceiveProps(prevProps: Props) {
    if (prevProps.data !== this.props.data) {
      this.setState({ rowsToRender: createDefaultRowsToRender(this.props.data) });
    }
  }

  componentDidUpdate(prevProps: Props, prevState: any) {
    const prevData: Props['data'] = this.props.filterFromData
      ? prevProps.data.map(row => filterPropertiesFromObject(row, this.props.filterFromData as [string]))
      : prevProps.data;
    const curData: Props['data'] = this.props.filterFromData
      ? this.props.data.map(row => filterPropertiesFromObject(row, this.props.filterFromData as [string]))
      : this.props.data;
    if (!arraysEqual(prevData, curData)) {
      this.setState({ rowsToRender: createDefaultRowsToRender(this.props.data) });
    }
  }

  render() {
    const data = this.state.rowsToRender.map(rowIndex => this.props.data[rowIndex]);

    const dataForFilter = this.props.filterFromData ?
      this.props.data.map(row =>
        filterPropertiesFromObject(row, this.props.filterFromData as [string])) :
      this.props.data;

    return (
      <AutoSizer>
        {({ height, width }) => (
          <Container>
            <div style={{ display: 'flex', 'justifyContent': 'space-between', width, height: 38 }}>
              { this.props.filter !== false ?
                <Filter
                  data={
                    this.props.filterFromData !== undefined ?
                    dataForFilter :
                    this.props.data
                  }
                  setRowsToRender={(rows: number[]) => this.setState({ rowsToRender: rows })}
                /> : null }
              <ColumnDropdown
                columns={this.state.columns}
                toggleColumn={(columnIndex => {
                  const columns = this.state.columns;
                  columns[columnIndex].show = columns[columnIndex].show === false ? true : false;
                  this.setState({ columns });
                })}
              />
            </div>
            <Table
              {...this.props}
              columns={this.state.columns}
              data={data}
              height={height - 38}
              width={width}
              headerHeight={this.props.headerHeight || 30}
              rowHeight={this.props.rowHeight || 30}
              rowStyle={this.props.rowStyle || {}}
            />
          </Container>
        )}
      </AutoSizer>
    );
  }
}
