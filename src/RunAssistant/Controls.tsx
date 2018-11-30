import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Checkbox, Container, Dropdown, DropdownProps, Segment } from 'semantic-ui-react';
import EnemyButtonContainer from './EnemyButtons';
import { State as ReducerState } from './interfaces';
import { jumpRNG, nextFight, previousFight, findFight, switchArea } from './actions/RunAssistant';
import { findNextFight, getCurrentArea, getCurrentFight, getFight } from './reducers/RunAssistant';
import ConfigModal from './ConfigModal';
import styled from 'styled-components';

const mapStateToProps = (state: ReducerState) => ({
  areas: state.RunAssistant.areas.map((area: any) => area.name),
  currentArea: getCurrentArea(state.RunAssistant).name,
  findNextFight: () => {
    const index: number = findNextFight(state.RunAssistant);
    return index > -1 ? getFight(state.RunAssistant, index) : null;
  },
  getCurrentFight: () => getCurrentFight(state.RunAssistant)
});

const mapDispatchToProps = {
  jumpRNG,
  nextFight,
  previousFight,
  findFight,
  switchArea
};

class Controls extends React.Component<any, any> {
  state = {
    pattern: false
  };

  componentDidMount() {
    document.addEventListener(
      'keydown',
      event => {
        const target = event.target as HTMLElement;
        if (target.tagName.toLowerCase() !== 'input') {
          if (event.keyCode === 78) {
            this.props.nextFight();
          }
        }
      },
      false);
  }

  render() {
    const { areas, currentArea } = this.props;
    return (
      <Container className={this.props.className}>
        <EnemyButtonContainer pattern={this.state.pattern} />
        <Segment style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Dropdown
            label="Areas"
            placeholder="Area"
            value={currentArea}
            options={areas.map((name) => { return { key: name, value: name, text: name }; })}
            onChange={(e: React.SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
              this.props.switchArea(data.value as string);
            }}
            selection={true}
          />
          <Checkbox
            style={{ display: 'flex', margin: '0 1em', alignItems: 'center' }}
            label="Pattern Mode"
            checked={this.state.pattern}
            onChange={() => this.setState(prevState => ({ pattern: !this.state.pattern }))}
          />
          <ConfigModal trigger={<Button>Config</Button>}/>
          <span style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
            <Button content="+100" onClick={() => this.props.jumpRNG(100)}/>
            <Button content="+500" onClick={() => this.props.jumpRNG(500)}/>
            <Button content="+1000" onClick={() => this.props.jumpRNG(1000)}/>
            <Button content="Previous" onClick={() => this.props.previousFight()}/>
            <Button content="Next" onClick={() => this.props.nextFight()}/>
          </span>
        </Segment>
      </Container>
    );
  }
}

const ConnectedControls = connect(mapStateToProps, mapDispatchToProps)(Controls);

const StyledControls = styled(ConnectedControls)``;

export default StyledControls;
