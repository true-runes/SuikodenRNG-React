import * as React from 'react';
import VirtTable from '../Table';

interface NPCInfo {
  rng: string;
  direction: string;
  advance: number;
}

const Presenter = (props: { NPCInfo: NPCInfo[]}) => {
  const data = props.NPCInfo.map((info, index) => ({ ...info, index, move: info.direction !== '' ? 'Yes' : 'No' }));
  const columns = [
    { key: 'index', label: 'Index', width: 100 },
    { key: 'rng', label: 'RNG', width: 150 },
    { key: 'direction', label: 'Direction', width: 150 },
    { key: 'advance', label: 'Advance RNG', width: 150 },
    { key: 'move', label: 'Move?', width: 100 }

  ];
  return <VirtTable columns={columns} data={data}/>;
};

export default Presenter;
