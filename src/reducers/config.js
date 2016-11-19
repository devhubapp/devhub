// @flow

import { combineReducers } from 'redux';

import { SET_THEME } from '../utils/constants/actions';
import { DEFAULT_THEME } from '../utils/constants/defaults';
import { Action, Config } from '../utils/types';

const theme = (state: Theme = DEFAULT_THEME, { type, payload: theme }: Action<Theme>) => {
  switch (type) {
    case SET_THEME: return theme;
    default: return state;
  }
};

export default combineReducers({
  theme,
});
