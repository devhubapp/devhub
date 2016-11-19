// @flow

import { REHYDRATE } from 'redux-persist/lib/constants';

import { SET_THEME } from '../utils/constants/actions';
import { DEFAULT_THEME } from '../utils/constants/defaults';
import { loadTheme } from '../utils/helpers';
import { Action, State } from '../utils/types';

export const defaultState = loadTheme(DEFAULT_THEME);

export default (state = defaultState, { type, payload }: Action<State | Theme>) => {
  switch (type) {
    case SET_THEME: return loadTheme(payload);
    case REHYDRATE: return loadTheme(((payload || {}).config || {}).theme);
    default: return state;
  }
};
