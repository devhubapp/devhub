// @flow
/*  eslint-disable import/prefer-default-export */

import memoize from 'lodash/memoize';
import { createSelector } from 'reselect';

import { get, sizeOf } from '../utils/immutable';

export const navigationEntitySelector = state => get(state, 'navigation');

export const getMainNavigationState = createSelector(
  navigationEntitySelector,
  navigation => navigation && get(navigation, 'main'),
);

export const getPublicNavigationState = createSelector(
  navigationEntitySelector,
  navigation => navigation && get(navigation, 'public'),
);

export const getSelectedRouteFromNavigationState = memoize(navigationState => {
  if (!navigationState) return null;

  const index = get(navigationState, 'index');
  const routes = get(navigationState, 'routes');

  if (!(routes && sizeOf(routes) > 0)) return null;
  if (!(index >= 0 && index < sizeOf(routes))) return null;

  return get(routes, index);
});

export const getNavigatorSelectedRoute = createSelector(
  (state, { navigationState }) => navigationState,
  getSelectedRouteFromNavigationState,
);
