import * as React from 'react';
import { connect } from 'react-redux';
import { Column } from '../interfaces/Table';
import { Column as VirtColumn, Table as VirtTable } from 'react-virtualized';

interface Props {
  data: {}[];
  columns: Column[];
  height: number;
  width: number;
  currentRow?: number;
  onRowClick?: (index: number) => any;
}

const mapStateToProps = (state: { columns: Column[] }) => {
  return {
    columns: state.columns
  };
};

const Table = (props: Props) => {
  return (
    <VirtTable
      headerHeight={30}
      height={props.height}
      onRowClick={({ index }) => {
        if (props.onRowClick) {
          props.onRowClick(index);
        }
      }}
      rowCount={props.data.length}
      rowGetter={({ index }) => props.data[index]}
      rowHeight={30}
      rowStyle={({ index }) => (props.currentRow !== undefined && props.currentRow === index
        ? { backgroundColor: 'yellow' }
        : {})}
      width={props.width}
    >
      {props.columns.reduce(
        (accumulator: Column[], column: Column) => {
          // Undefined show should still show columns.
          // Only explicitly hidden columns will not be shown.
          if (column.show !== false) {
            accumulator.push(column);
          }
          return accumulator;
        },
        []).map((column: Column) => {
          return (
            <VirtColumn
              key={column.key}
              label={column.label}
              dataKey={column.key}
              width={column.width}
            />
          );
        })
      }
    </VirtTable>
  );
};

const ConnectedTable = connect(mapStateToProps)(Table);

export default ConnectedTable;
