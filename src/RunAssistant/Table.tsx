import * as React from 'react';
import { Column } from '../interfaces/Table';
import { Container } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { RunAssistState } from './interfaces';
import { Fight } from '../lib/interfaces';
import { numToHexString } from '../lib/lib';
import { selectFight } from './actions';
import VirtTable from '../Table';

interface Props {
  fights: Fight[];
  currentRow: number;
  selectFight: (index: number) => any;
}

const mapStateToProps = (state: RunAssistState) => {
  return {
    fights: state.fightsList[state.currentArea],
    currentRow: state.fightIndex
  };
};

const mapDispatchToProps = {
  selectFight
};

const RunAssistantTable = (props: Props) => {
  const columns: Column[] = [
    { label: 'Area', key: 'area', width: 200 },
    { label: 'Enemy Group', key: 'enemyGroup', width: 300 },
    { label: 'Index', key: 'index', width: 100 },
    { label: 'Run', key: 'run', width: 100 },
    { label: 'Encounter RNG', key: 'startRNG', width: 150 },
    { label: 'Battle RNG', key: 'battleRNG', width: 150 },
    { label: 'Wheel Attempts', key: 'wheel', width: 150 }
  ];

  const fights = props.fights.map(fight => ({
      ...fight,
      enemyGroup: fight.enemyGroup.name,
      run: fight.run ? 'Run' : 'Fail',
      startRNG: numToHexString(fight.startRNG),
      battleRNG: numToHexString(fight.battleRNG)
  }));

  return (
      <Container textAlign="center" style={{ display: 'block', height: '100%' }}>
        <VirtTable
          currentRow={props.currentRow}
          columns={columns}
          data={fights}
          onRowClick={(index: number) => props.selectFight(index)}
        />
      </Container>
  );
};

export const ConnectedTable = connect(mapStateToProps, mapDispatchToProps)(RunAssistantTable);
