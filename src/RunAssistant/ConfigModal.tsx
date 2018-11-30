import * as React from 'react';
import { connect } from 'react-redux';
import { Checkbox, Modal } from 'semantic-ui-react';
import { State as ReducerState } from './interfaces';
import { changeUseImages } from './actions/config';

interface Props {
  trigger: React.ReactNode;
  useImages: boolean;
  changeUseImages: (useImages: boolean) => any;
}

const mapStateToProps = (state: ReducerState) => ({
  useImages: state.config.useImages
});

const mapDispatchToProps = {
  changeUseImages
};

const ConfigModal = (props: Props) => (
  <Modal trigger={props.trigger}>
    <Modal.Header>
      Run Assistant Configuration
    </Modal.Header>
    <Modal.Content>
      <Checkbox
        checked={props.useImages}
        onChange={() => props.changeUseImages(!props.useImages)}
        label="Use Enemy Images"
        toggle={true}
      />
    </Modal.Content>
  </Modal>
);

export default connect(mapStateToProps, mapDispatchToProps)(ConfigModal);
