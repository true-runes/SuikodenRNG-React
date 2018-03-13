import * as React from 'react';
import { Button, Container, Dropdown, DropdownProps, Segment } from 'semantic-ui-react';
import EnemyButtonContainer from './EnemyButtons';
import { connect } from 'react-redux';
import { jumpRNG, nextFight, previousFight, findFight, switchArea } from './actions';
import { getCurrentArea } from './reducers';
import { RunAssistState } from './interfaces';

const mapStateToProps = (state: RunAssistState) => {
  return {
    areas: state.areas.map((area: any) => area.name),
    currentArea: getCurrentArea(state).name
  };
};

const mapDispatchToProps = {
  jumpRNG,
  nextFight,
  previousFight,
  findFight,
  switchArea
};

interface Props {
  areas: string[];
  currentArea: string;
  jumpRNG: (jump: number) => any;
  nextFight: () => any;
  previousFight: () => any;
  findFight: (name: string) => any;
  switchArea: (area: string) => any;
}

const Controls = (props: Props) => {
  const { areas } = props;
  return (
    <Container>
      <EnemyButtonContainer/>
      <Segment style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Dropdown
          label="Areas"
          placeholder="Area"
          value={props.currentArea}
          options={areas.map((name) => { return { key: name, value: name, text: name }; })}
          onChange={(e: React.SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
            props.switchArea(data.value as string);
          }}
          selection={true}
        />
        <span style={{ alignItems: 'flex-end' }}>
          <Button content="+100" onClick={() => props.jumpRNG(100)}/>
          <Button content="+500" onClick={() => props.jumpRNG(500)}/>
          <Button content="+1000" onClick={() => props.jumpRNG(1000)}/>
          <Button content="Previous" onClick={() => props.previousFight()}/>
          <Button content="Next" onClick={() => props.nextFight()}/>
        </span>
      </Segment>
    </Container>
  );
};

const ConnectedControls = connect(mapStateToProps, mapDispatchToProps)(Controls);

export default ConnectedControls;
