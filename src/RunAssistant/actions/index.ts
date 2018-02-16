export const switchArea = (area: string) => ({
  type: 'SWITCH_AREA',
  area
});

export const previousFight = () => ({
  type: 'PREVIOUS_FIGHT'
});

export const nextFight = () => ({
  type: 'NEXT_FIGHT'
});

export const selectFight = (index: number) => ({
  type: 'SELECT_FIGHT',
  index
});

export const jumpRNG = (jump: number) => ({
  type: 'JUMP_RNG',
  jump
});
