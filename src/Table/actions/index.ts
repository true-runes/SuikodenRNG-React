export const showColumn = (index: number) => ({
  type: 'SHOW_COLUMN',
  index
});

export const hideColumn = (index: number) => ({
  type: 'HIDE_COLUMN',
  index
});

export const toggleColumn = (index: number) => ({
  type: 'TOGGLE_COLUMN',
  index
});
