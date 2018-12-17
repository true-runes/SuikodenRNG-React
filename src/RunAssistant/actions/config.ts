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

export const changeTableRowHeight = (height: number) => ({
  type: 'CHANGE_TABLE_ROW_HEIGHT',
  height
});

export const changeTableHeaderHeight = (height: number) => ({
  type: 'CHANGE_TABLE_HEADER_HEIGHT',
  height
});

export const resetToDefault = () => ({
  type: 'RESET_TO_DEFAULT'
});

export const changeRowFontSize = (size: number) => ({
  type: 'CHANGE_ROW_FONT_SIZE',
  size: size
});
