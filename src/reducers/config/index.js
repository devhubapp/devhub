// @flow

import { combineReducers } from 'redux-immutable';

import preferredDarkTheme from './preferred-dark-theme';
import preferredLightTheme from './preferred-light-theme';
import theme from './theme';

export default combineReducers({
  preferredDarkTheme,
  preferredLightTheme,
  theme,
});
