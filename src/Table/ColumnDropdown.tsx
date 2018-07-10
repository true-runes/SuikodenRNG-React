import * as React from 'react';
import { Column } from './interfaces';
import { Checkbox, Dropdown } from 'semantic-ui-react';

interface Props {
  columns: Column[];
  toggleColumn: (index: number) => any;
}

const ColumnToggle = (props: Props) => {
  return (
    <Dropdown
      selection={true}
      text="Columns"
      options={props.columns.map((column, index) => {
        return (
          <Checkbox
            as={Dropdown.Item}
            key={column.key}
            label={column.label}
            onMouseDown={(e: React.SyntheticEvent<HTMLInputElement>) => {
              e.preventDefault();
              props.toggleColumn(index);
            }}
            checked={props.columns[index].show !== false}
          />
        );
      })}
    />
  );
};

export default ColumnToggle;
