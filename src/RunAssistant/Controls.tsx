import * as React from 'react';
import { Button, Dropdown, DropdownProps } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { jumpRNG, nextFight, previousFight, switchArea } from './actions';
import { RunAssistState } from './interfaces';

const mapStateToProps = (state: RunAssistState) => {
  return {
    enemies: state.areas[state.currentArea].enemies,
    areas: state.areas.map((area: any) => { return area.name; }),
    currentArea: state.areas[state.currentArea].name
  };
};

const mapDispatchToProps = {
  jumpRNG,
  nextFight,
  previousFight,
  switchArea
};

interface Props {
  areas: string[];
  enemies: string[];
  currentArea: string;
  jumpRNG: (jump: number) => any;
  nextFight: () => any;
  previousFight: () => any;
  switchArea: (area: string) => any;
}

const Controls = (props: Props) => {
  const { areas, enemies } = props;
  return (
    <div>
      <Dropdown
        label="Areas"
        placeholder="Area"
        value={props.currentArea}
        options={areas.map((name) => { return { key: name, value: name, text: name }; })}
        onChange={(e: React.SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
          props.switchArea(data.value as string);
        }}
        open={true}
        selection={true}
      />
      {areas.map((area) => {
        return <Button key={area} content={area} onClick={() => props.switchArea(area)}/>;
      })}
      {enemies.map((enemy) => {
        return <Button key={enemy} content={enemy}/>;
      })}
      <Button content="+100" onClick={() => props.jumpRNG(100)}/>
      <Button content="+500" onClick={() => props.jumpRNG(500)}/>
      <Button content="+1000" onClick={() => props.jumpRNG(1000)}/>
      <Button content="Previous" onClick={() => props.previousFight()}/>
      <Button content="Next" onClick={() => props.nextFight()}/>
    </div>
  );
};

const ConnectedControls = connect(mapStateToProps, mapDispatchToProps)(Controls);

export default ConnectedControls;
