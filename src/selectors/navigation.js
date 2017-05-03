// @flow
/*  eslint-disable import/prefer-default-export */

import { createSelector } from 'reselect'

import { fromJS, get, sizeOf } from '../utils/immutable'

export const navigationEntitySelector = state => get(state, 'navigation')

export const getNavigationState = createSelector(
  navigationEntitySelector,
  navigation => fromJS(navigation),
)

export const getMainNavigationState = createSelector(
  getNavigationState,
  navigation =>
    navigation &&
    get(navigation, 'routes').find(route => get(route, 'routeName') === 'main'),
)

export const getSelectedRouteFromNavigationState = (
  navigationState,
  deep = false,
) => {
  if (!navigationState) return null

  const index = get(navigationState, 'index')
  const routes = get(navigationState, 'routes')

  if (!(routes && sizeOf(routes) > 0)) return navigationState
  if (!(index >= 0 && index < sizeOf(routes))) return navigationState

  const routeState = get(routes, index)
  return deep ? getSelectedRouteFromNavigationState(routeState) : routeState
}

export const getNavigatorSelectedRoute = createSelector(
  (state, { navigationState }) => navigationState,
  getSelectedRouteFromNavigationState,
)
