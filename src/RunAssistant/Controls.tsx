import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Checkbox, Container, Dropdown, DropdownProps, Segment } from 'semantic-ui-react';
import EnemyButtonContainer from './EnemyButtons';
import { RunAssistState } from './interfaces';
import { jumpRNG, nextFight, previousFight, findFight, switchArea } from './actions';
import { findNextFight, getCurrentArea, getCurrentFight, getFight } from './reducers';

const mapStateToProps = (state: RunAssistState) => {
  return {
    areas: state.areas.map((area: any) => area.name),
    currentArea: getCurrentArea(state).name,
    findNextFight: () => {
      const index: number = findNextFight(state);
      return index > -1 ? getFight(state, index) : null;
    },
    getCurrentFight: () => getCurrentFight(state)
  };
};

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
      <Container>
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

export default ConnectedControls;
