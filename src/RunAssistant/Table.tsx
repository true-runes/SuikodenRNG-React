import * as React from 'react';
import { AutoSizer, Column as VirtColumn, Table } from 'react-virtualized';
import { Container } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { RunAssistState } from './interfaces';
import { Fight } from '../lib/interfaces';
import { numToHexString } from '../lib/lib';
import { selectFight } from './actions';

interface Column {
  key: string | number;
  label: string;
  width: number;
  show: boolean;
}

interface Props {
  fights: Fight[];
  currentRow: number;
  selectFight: (index: number) => any;
}

interface State {
  columns: Column[];
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

class RunAssistantTable extends React.Component<Props, State> {
  state = {
    columns: [
      { label: 'Area', key: 'area', width: 200, show: true },
      { label: 'Enemy Group', key: 'enemyGroup', width: 300, show: true },
      { label: 'Index', key: 'index', width: 100, show: true },
      { label: 'Run', key: 'run', width: 100, show: true },
      { label: 'Encounter RNG', key: 'startRNG', width: 150, show: true },
      { label: 'Battle RNG', key: 'battleRNG', width: 150, show: true },
      { label: 'Wheel Attempts', key: 'wheel', width: 150, show: true }
    ]
  };

  render() {
    const fights = this.props.fights.map(fight => ({
      ...fight,
      run: fight.run ? 'Run' : 'Fail',
      startRNG: numToHexString(fight.startRNG),
      battleRNG: numToHexString(fight.battleRNG)
    }));
    return (
      <div style={{ flex: 1}}>
        <Container textAlign="center" style={{ display: 'block', height: '100%' }}>
          <AutoSizer>
            {({ height, width }) => (
              <Table
                headerHeight={30}
                height={height}
                onRowClick={({index}) => this.props.selectFight(index)}
                rowCount={fights.length}
                rowGetter={({ index }) => fights[index]}
                rowHeight={30}
                width={width}
              >
                {this.state.columns.map((column: Column) => {
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
        </Container>
      </div>
    );
  }
}

export const ConnectedTable = connect(mapStateToProps, mapDispatchToProps)(RunAssistantTable);
