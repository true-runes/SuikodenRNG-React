import { ConfigState as State } from '../interfaces';
import { Column } from '../../Table/interfaces';
import { handleActions } from 'redux-actions';

const columns: Column[] = [
  { label: 'Area', key: 'area', width: 200, show: false },
  { label: 'Enemy Group', key: 'enemyGroup', width: 300, show: true },
  { label: 'Enemy Group Image', key: 'enemyGroupImage', width: 300, show: false },
  { label: 'Index', key: 'index', width: 100, show: true },
  { label: 'Run', key: 'run', width: 100, show: true },
  { label: 'Encounter RNG', key: 'startRNG', width: 150, show: false },
  { label: 'Battle RNG', key: 'battleRNG', width: 150, show: true },
  { label: 'Wheel Attempts', key: 'wheel', width: 150, show: true },
  { label: 'Champion Value', key: 'champVal', width: 150, show: false }
];

export const initialState: State = {
  useImages: false,
  columns,
  table: {
    rowHeight: 30,
    headerHeight: 30,
    rowStyle: {
      fontSize: 16
    }
  }
};

export default handleActions(
  {
    CHANGE_USE_IMAGES: (state: State, action) => (
      { ...state, useImages: action.useImages }
    ),
    CHANGE_COLUMN_VISIBILITY: (state: State, action) => (
      {
        ...state,
        columns: state.columns.map((column, index) => {
          if (index !== action.index) {
            return column;
          }
          return { ...column, show: action.show };
        })
      }
    ),
    CHANGE_TABLE_ROW_HEIGHT: (state: State, action) => (
      { ...state, table: { ...state.table, rowHeight: action.height } }
    ),
    CHANGE_TABLE_HEADER_HEIGHT: (state: State, action) => (
      { ...state, table: { ...state.table, headerHeight: action.height } }
    ),
    CHANGE_ROW_FONT_SIZE: (state: State, action) => (
      { ...state,
        table: {
          ...state.table,
          rowStyle: {
            ...state.table.rowStyle,
            fontSize: action.size
          }
        }
      }
    ),
    RESET_TO_DEFAULT: (state: State, action) => initialState
  },
  initialState);
