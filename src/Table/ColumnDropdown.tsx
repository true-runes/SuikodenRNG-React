import * as React from 'react';
import { connect } from 'react-redux';
import { toggleColumn } from './actions';
import { Column } from '../interfaces/Table';
import { Checkbox, Dropdown } from 'semantic-ui-react';

interface Props {
  columns: Column[];
  toggleColumn: (index: number) => any;
}

const mapStateToProps = (state: { columns: Column[] }) => {
  return {
    columns: state.columns
  };
};

const mapDispatchToProps = {
  toggleColumn
};

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

const ConnectedColumnToggle = connect(mapStateToProps, mapDispatchToProps)(ColumnToggle);

export default ConnectedColumnToggle;
