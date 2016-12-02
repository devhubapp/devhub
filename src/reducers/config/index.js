// @flow

import { combineReducers } from 'redux-immutable';

import { loadTheme as _loadTheme } from '../../utils/helpers';
import type { Config } from '../../utils/types';

import theme from './theme';

export default combineReducers({
  theme,
});

export function loadTheme(state: Config) {
  return _loadTheme(state.theme);
}
