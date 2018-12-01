import * as React from 'react';
import { Column } from './interfaces';
import { Column as VirtColumn, Table as VirtTable } from 'react-virtualized';

interface Props {
  data: {}[];
  columns: Column[];
  height: number;
  width: number;
  rowHeight: number;
  currentRow?: number;
  onRowClick?: (index: number) => any;
}

const Table = (props: Props) => {
  const columns: Column[] = props.columns.reduce(
    (accumulator: Column[], column: Column) => {
      // Undefined show should still show columns.
      // Only explicitly hidden columns will not be shown.
      if (column.show !== false) {
        accumulator.push(column);
      }
      return accumulator;
    },
    []);
  const columnsWidthRatio: number = props.width /
    columns.reduce((total, column) => (total += column.width), 0);
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
      rowHeight={props.rowHeight}
      rowStyle={({ index }) => (props.currentRow !== undefined && props.currentRow === index
        ? { backgroundColor: 'yellow' }
        : {})}
      scrollToIndex={props.currentRow}
      scrollToAlignment="start"
      width={props.width}
    >
      {columns.map((column: Column) => {
        return (
          <VirtColumn
            cellRenderer={({ cellData }) => {
              if (cellData === null) {
                return '';
              }

              if (React.isValidElement(cellData)) {
                return cellData;
              }

              return String(cellData);
            }}
            key={column.key}
            label={column.label}
            dataKey={column.key}
            width={columnsWidthRatio * column.width}
          />
        );
      })}
    </VirtTable>
  );
};

export default Table;
