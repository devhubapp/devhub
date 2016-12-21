// @flow
/*  eslint-disable import/prefer-default-export */

import { createSelector } from 'reselect';

export const authSelector = state => state.get('auth');

export const tokenSelector = createSelector(
  authSelector,
  auth => auth && auth.get('token'),
);

export const isLoggedSelector = createSelector(
  tokenSelector,
  token => !!token,
);

export const isLoggingInSelector = createSelector(
  authSelector,
  auth => auth && auth.get('loading'),
);
