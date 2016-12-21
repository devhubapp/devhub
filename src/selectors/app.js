// @flow
/*  eslint-disable import/prefer-default-export */

import { createSelector } from 'reselect';

export const appSelector = state => state.get('app');

export const rehydratedSelector = createSelector(
  appSelector,
  app => app && app.get('rehydrated'),
);
