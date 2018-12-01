import * as React from 'react';
import { connect } from 'react-redux';
import { Checkbox, Form, Modal } from 'semantic-ui-react';
import { State as ReducerState, TableConfig } from './interfaces';
import { Column } from '../Table/interfaces';
import { changeUseImages, changeColumnWidth, changeColumnVisibility, updateTableRowHeight } from './actions/config';

interface Props {
  trigger: React.ReactNode;
  useImages: boolean;
  columns: Column[];
  table: TableConfig;
  changeUseImages: (useImages: boolean) => any;
  changeColumnVisibility: (index: number, show: boolean) => any;
  changeColumnWidth: (index: number, width: number) => any;
  updateTableRowHeight: (height: number) => any;
}

const mapStateToProps = (state: ReducerState) => ({
  ...state.config
});

const mapDispatchToProps = {
  changeUseImages,
  changeColumnVisibility,
  changeColumnWidth,
  updateTableRowHeight
};

const ConfigModal = (props: Props) => {
  console.log(props);
  return (
    <Modal trigger={props.trigger}>
      <Modal.Header>
        Run Assistant Configuration
      </Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Group inline={true} label="Run Assitant">
            <Checkbox
              checked={props.useImages}
              onChange={() => props.changeUseImages(!props.useImages)}
              label="Use Enemy Images"
              toggle={true}
            />
          </Form.Group>
          <Form.Group label="Table">
            <Form.Group inline={true} label="Default Visible Columns">
              {props.columns.map((column, index) => (
                <Checkbox
                  key={column.key}
                  checked={column.show !== false}
                  onChange={() => props.changeColumnVisibility(index, !column.show)}
                  label={column.label}
                />
              ))}
            </Form.Group>
            <Form.Group>
              <Form.Input
                type="number"
                onChange={
                  (e: React.FormEvent<HTMLInputElement>) => props.updateTableRowHeight(parseInt(e.currentTarget.value))
                }
                min={1}
                max={4096}
                step={10}
                value={props.table.rowHeight}
              />
            </Form.Group>
          </Form.Group>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfigModal);
