export const changeUseImages = (useImages: boolean) => ({
  type: 'CHANGE_USE_IMAGES',
  useImages
});

export const changeColumnVisibility = (index: number, show: boolean) => ({
  type: 'CHANGE_COLUMN_VISIBILITY',
  index,
  show
});

export const changeColumnWidth = (index: number, width: number) => ({
  type: 'CHANGE_COLUMN_WIDTH',
  index,
  width
});

export const updateTableRowHeight = (height: number) => ({
  type: 'UPDATE_TABLE_ROW_HEIGHT',
  height
});

export const resetToDefault = () => ({
  type: 'RESET_TO_DEFAULT'
});
