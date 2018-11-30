import { ConfigState as State } from '../interfaces';
import { handleActions } from 'redux-actions';

const initialState: State = {
  useImages: false
};

export default handleActions(
  {
    CHANGE_USE_IMAGES: (state: State, action) => {
      return { ...state, useImages: action.useImages };
    }
  },
  initialState);
