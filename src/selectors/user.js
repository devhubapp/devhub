// @flow
/*  eslint-disable import/prefer-default-export */

import { createSelector } from 'reselect';

import { createImmutableSelector } from './shared';

export const userSelector = state => state.get('user');

export const accessTokenSelector = createSelector(
  userSelector,
  user => user && user.get('accessToken'),
);

export const isLoggedSelector = createImmutableSelector(
  accessTokenSelector,
  accessToken => !!accessToken,
);

export const isLoggingSelector = createImmutableSelector(
  userSelector,
  user => !!(user && user.get('isLogging')),
);

export const userErrorSelector = createImmutableSelector(
  userSelector,
  user => user && user.get('error'),
);
