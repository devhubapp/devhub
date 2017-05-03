// @flow
/*  eslint-disable import/prefer-default-export */

import { createSelector } from 'reselect'

import { notificationsIsLoadingSelector } from './notifications'
import { subscriptionsIsLoadingSelector } from './subscriptions'

export const appEntitySelector = state => state.get('app')

export const isReadySelector = createSelector(
  appEntitySelector,
  app => app && app.get('ready'),
)

export const rehydratedSelector = createSelector(
  appEntitySelector,
  app => app && app.get('rehydrated'),
)

export const isFetchingSelector = createSelector(
  notificationsIsLoadingSelector,
  subscriptionsIsLoadingSelector,
  (isLoadingNotifications, isLoadingSubscriptions) =>
    isLoadingNotifications || isLoadingSubscriptions,
)
