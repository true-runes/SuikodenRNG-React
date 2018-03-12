import * as React from 'react';
import VirtTable from '../Table';

const Presenter = (props: { encounters: any[]}) => {
  const columns = [
    { label: 'Area', key: 'area', width: 200 },
    { label: 'Enemy Group', key: 'enemy', width: 300 },
    { label: 'Index', key: 'index', width: 100 },
    { label: 'Run', key: 'run', width: 100 },
    { label: 'Encounter RNG', key: 'startRNG', width: 150 },
    { label: 'Battle RNG', key: 'battleRNG', width: 150 },
    { label: 'Wheel Attempts', key: 'wheel', width: 150 }
  ];
  return <VirtTable columns={columns} data={props.encounters}/>;
};

export default Presenter;
