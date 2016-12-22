// @flow
/*  eslint-disable import/prefer-default-export */

import { createSelector } from 'reselect';

export const userSelector = state => state.get('user');

export const accessTokenSelector = createSelector(
  userSelector,
  user => user && user.get('accessToken'),
);

export const isLoggedSelector = createSelector(
  accessTokenSelector,
  accessToken => !!accessToken,
);

export const isLoggingSelector = createSelector(
  userSelector,
  user => !!(user && user.get('isLogging')),
);
