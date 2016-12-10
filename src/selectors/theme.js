// @flow
/*  eslint-disable import/prefer-default-export */

import { createSelector } from 'reselect';

import { loadTheme } from '../utils/helpers';

export const themeNameSelector = state => state.getIn(['config', 'theme']);

export const themeSelector = createSelector(
  themeNameSelector,
  theme => loadTheme(theme),
);
