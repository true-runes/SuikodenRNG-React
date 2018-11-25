import * as React from 'react';
import { AutoSizer } from 'react-virtualized';
import { Column } from './interfaces';
import Table from './Table';
import Filter from './Filter';
import ColumnDropdown from './ColumnDropdown';
import { Container } from 'semantic-ui-react';

interface Props {
  data: {}[];
  columns: Column[];
  currentRow?: number;
  onRowClick?: (index: number) => any;
  filter?: boolean;
}

export default class TableContainer extends React.Component<Props, { columns: Column[], rowsToRender?: number[] }> {
  constructor(props: Props) {
    super(props);
    this.state = {
      rowsToRender: undefined,
      columns: props.columns
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
      <AutoSizer>
        {({ height, width }) => (
          <Container>
            <div style={{ display: 'flex', 'justifyContent': 'space-between', width, height: 38 }}>
              { this.props.filter !== false ?
                <Filter
                  data={this.props.data}
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
            />
          </Container>
        )}
      </AutoSizer>
    );
  }
}
