import * as React from 'react';
import { AutoSizer, Column as VirtColumn, Table } from 'react-virtualized';

interface Column {
  key: string | number;
  label: string;
  width: number;
}

interface Props {
  data: {}[];
  columns: Column[];
}

const VirtTable = (props: Props) => {
  return (
    <AutoSizer>
      {({ height, width }) => (
        <Table
          headerHeight={30}
          height={height}
          rowCount={props.data.length}
          rowGetter={({ index }) => props.data[index]}
          rowHeight={30}
          width={width}
        >
          {props.columns.map((column: Column) => {
            return (
              <VirtColumn
                key={column.key}
                label={column.label}
                dataKey={column.key}
                width={column.width}
              />
            );
          })}
        </Table>
      )}
    </AutoSizer>
  );
};

export default VirtTable;
