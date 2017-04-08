// @flow
/*  eslint-disable import/prefer-default-export */

import { createSelector } from 'reselect';

import { isNight, loadTheme } from '../utils/helpers';

export const themeNameSelector = state => state.getIn(['config', 'theme']);

export const preferredDarkThemeNameSelector = (
  state => state.getIn(['config', 'preferredDarkTheme'])
);

export const preferredLightThemeNameSelector = (
  state => state.getIn(['config', 'preferredLightTheme'])
);

export const themeSelector = createSelector(
  themeNameSelector,
  preferredDarkThemeNameSelector,
  preferredLightThemeNameSelector,
  isNight,
  loadTheme,
);
