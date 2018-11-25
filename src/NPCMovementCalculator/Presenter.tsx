import * as React from 'react';
import VirtTable from '../Table';

interface NPCInfo {
  rng: string;
  direction: string;
  npc: number;
  index: number;
}

const Presenter = (props: { NPCInfo: NPCInfo[]}) => {
  const data = props.NPCInfo;
  const columns = [
    { key: 'index', label: 'Index', width: 100 },
    { key: 'npc', label: 'NPC #', width: 50 },
    { key: 'direction', label: 'Direction', width: 150 },
    { key: 'rng', label: 'RNG', width: 150 }

  ];
  return <VirtTable columns={columns} data={data}/>;
};

export default Presenter;
