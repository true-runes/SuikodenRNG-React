import { Column } from '../../interfaces/Table';

const reducer = (state: { columns: Column[] } = { columns: [] }, action: any) => {
  switch (action.type) {
    case 'SHOW_COLUMN':
      return {
        ...state,
        columns: state.columns.map((column, index) => {
          if (index !== action.index) {
            return column;
          }
          return {...column, show: true };
        })
      };
    case 'HIDE_COLUMN':
      return {
        ...state,
        columns: state.columns.map((column, index) => {
          if (index !== action.index) {
            return column;
          }
          return {...column, show: false };
        })
      };
    case 'TOGGLE_COLUMN':
      return {
        ...state,
        columns: state.columns.map((column, index) => {
          if (index !== action.index) {
            return column;
          }
          return {...column, show: column.show === false ? true : false };
        })
      };
    default:
      return state;
  }
};

export default reducer;
