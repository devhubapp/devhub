// @flow

import { combineReducers } from 'redux';

import { SET_THEME } from '../utils/constants/actions';
import { DEFAULT_THEME } from '../utils/constants/defaults';
import type { Action, Theme } from '../utils/types';

const theme = (state: Theme = DEFAULT_THEME, { type, payload }: Action<Theme>) => {
  switch (type) {
    case SET_THEME: return payload;
    default: return state;
  }
};

export default combineReducers({
  theme,
});
