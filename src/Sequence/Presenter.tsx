import * as React from 'react';
import VirtTable from '../VirtTable';

const Presenter = (props: { sequence: string[]}) => {
  const data = props.sequence.map((rng, index) => { return { index, rng }; });
  const columns = [
    { key: 'index', label: 'Index', width: 100 },
    { key: 'rng', label: 'RNG', width: 150 }
  ];
  return <VirtTable columns={columns} data={data}/>;
};

export default Presenter;
