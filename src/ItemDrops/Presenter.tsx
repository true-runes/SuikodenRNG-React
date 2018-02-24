import * as React from 'react';
import { numToHexString } from '../lib/lib';
import VirtTable from '../Table';

const Presenter = (props: { drops: { index: number, rng: number, drop: string }[] }) => {
  const data = props.drops.map((drop) => {
    return {...drop, rng: numToHexString(drop.rng) };
  });
  const columns = [
    { label: 'Index', key: 'index', width: 100 },
    { label: 'Drop', key: 'drop', width: 300 },
    { label: 'RNG', key: 'rng', width: 150 }
  ];
  return <VirtTable data={data} columns={columns}/>;
};

export default Presenter;
