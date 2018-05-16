import * as React from 'react';
import { Button, Container, Segment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { findFight } from './actions';
import { getCurrentEnemies } from './reducers';
import { RunAssistState } from './interfaces';
import { EnemyGroupData } from '../lib/interfaces';
import styled, { StyledFunction } from 'styled-components';

const mapStateToProps = (state: RunAssistState) => {
  return {
    enemies: getCurrentEnemies(state),
  };
};

const mapDispatchToProps = {
  findFight
};

interface Props {
  enemies: EnemyGroupData[];
  findFight: (name: string) => any;
}

const evenColumnDiv: StyledFunction<{ columns: number} & React.HTMLProps<HTMLDivElement>> = styled.div;

const EvenColumnDiv = evenColumnDiv`
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, 1fr);
  grid-gap: 10px;
`;

const EnemyButtonContainer = (props: Props) => {
  const enemiesGroupedByEnemyCount = props.enemies
    .reduce(
      (groups, enemyData) => {
        const enemyCount: number = enemyData.enemies.length - 1;
        if (groups[enemyCount] === undefined) {
          groups[enemyCount] = [];
        }
        if (!groups[enemyCount].some(currentEnemyData => enemyData.name === currentEnemyData.name)) {
          groups[enemyCount].push(enemyData);
        }
        return groups;
      },
      new Array(6))
    .reduce(
      (arr, enemyGroup) => {
        if (enemyGroup !== undefined) {
          arr.push(enemyGroup);
        }
        return arr;
      },
      []);

  return (
    <Container style={{ width: '100%' }}>
      <Segment>
        <EvenColumnDiv
          columns={enemiesGroupedByEnemyCount.length}
        >
          {enemiesGroupedByEnemyCount.map((enemiesGroup, index) => {
            return (
              <Button.Group
                vertical={true}
                key={index}
              >
                {enemiesGroup.map((enemy) => {
                  return (
                    <Button
                      key={enemy.name}
                      style={{ width: '100%' }}
                      content={enemy.name}
                      onClick={() => props.findFight(enemy.name)}
                    />
                  );
                })}
              </Button.Group>
            );
          })}
        </EvenColumnDiv>
      </Segment>
    </Container>
  );
};

const ConnectedEnemyButtonContainer = connect(mapStateToProps, mapDispatchToProps)(EnemyButtonContainer);

export default ConnectedEnemyButtonContainer;
