// @flow
/*  eslint-disable import/prefer-default-export */

import { denormalize } from 'denormalizr'
import { List, Set } from 'immutable'

import {
  createImmutableSelectorCreator,
  createImmutableSelector,
  entitiesSelector,
  isArchivedFilter,
  isDeletedFilter,
  isReadFilter,
} from './shared'

import { groupNotificationsByRepository } from '../utils/helpers/github/notifications'
import { NotificationSchema } from '../utils/normalizr/schemas'

export const sortNotificationsByDate = (b, a) =>
  a.get('updated_at') > b.get('updated_at') ? 1 : -1

export const notificationIdSelector = (state, { notificationId }) =>
  notificationId
export const notificationDetailsSelector = state => state.get('notifications')
export const notificationEntitiesSelector = state =>
  entitiesSelector(state).get('notifications').filter(Boolean)

export const notificationSelector = (state, { notificationId }) =>
  notificationEntitiesSelector(state).get(notificationId)

export const notificationIdsSelector = createImmutableSelector(
  notificationEntitiesSelector,
  notifications =>
    notifications
      .filter(Boolean)
      .filterNot(isDeletedFilter)
      .sort(sortNotificationsByDate)
      .map(notification => notification.get('id'))
      .toList(),
)

export const unarchivedNotificationIdsSelector = createImmutableSelector(
  notificationEntitiesSelector,
  notifications =>
    notifications
      .filter(Boolean)
      .filterNot(isDeletedFilter)
      .filterNot(isArchivedFilter)
      .sort(sortNotificationsByDate)
      .map(notification => notification.get('id'))
      .toList(),
)

export const makeDenormalizedNotificationsSelector = (n = 1) =>
  createImmutableSelectorCreator(n)(
    (state, { notifications, notificationIds }) =>
      notifications || notificationIds || notificationIdsSelector(state),
    entitiesSelector,
    (notifications, entities) =>
      denormalize(notifications, entities, [NotificationSchema])
        .filter(Boolean)
        .filterNot(isDeletedFilter)
        .toList()
        .sort(sortNotificationsByDate),
  )

export const readNotificationIdsSelector = createImmutableSelector(
  notificationEntitiesSelector,
  notifications =>
    notifications
      .filter(isReadFilter)
      .map(notification => notification.get('id'))
      .toList(),
)

export const makeIsArchivedNotificationSelector = () =>
  createImmutableSelector(notificationSelector, isArchivedFilter)

export const makeIsReadNotificationSelector = () =>
  createImmutableSelector(
    notificationIdSelector,
    readNotificationIdsSelector,
    (notificationId, readIds) => readIds.includes(notificationId),
  )

export const makeDenormalizedNotificationSelector = (n = 1) =>
  createImmutableSelectorCreator(
    n,
  )(notificationSelector, entitiesSelector, (notification, entities) =>
    denormalize(notification, entities, NotificationSchema),
  )

// with memoization of first argument
// to prevent calling this again unless new notifications were added
export const orderedUnarchivedNotificationsSelector = createImmutableSelectorCreator(
  1,
)(
  unarchivedNotificationIdsSelector,
  notificationEntitiesSelector,
  (notificationIds, notificationEntities) =>
    notificationIds
      .map(notificationId => notificationEntities.get(notificationId))
      .filter(Boolean)
      .filterNot(isDeletedFilter)
      .toList()
      .sort(sortNotificationsByDate),
)

export const makeGroupedUnarchivedNotificationsSelector = () =>
  createImmutableSelectorCreator(1)(
    notificationIdsSelector, // just for memoization purposes
    orderedUnarchivedNotificationsSelector,
    (state, params) => params,
    (notificationIds, notifications, params) =>
      groupNotificationsByRepository(notifications, params).toList(),
  )

export const notificationsIsLoadingSelector = createImmutableSelector(
  notificationDetailsSelector,
  notifications => !!notifications.get('loading'),
)

export const notificationsLastModifiedAtSelector = createImmutableSelector(
  notificationDetailsSelector,
  notifications => notifications.get('lastModifiedAt'),
)

export const notificationsUpdatedAtSelector = createImmutableSelector(
  notificationDetailsSelector,
  notifications => notifications.get('updatedAt'),
)

export const notificationsErrorsSelector = createImmutableSelector(
  notificationDetailsSelector,
  notifications => List([notifications.get('error')]).filter(Boolean),
)

export const notificationsUnreadCountSelector = createImmutableSelector(
  unarchivedNotificationIdsSelector,
  readNotificationIdsSelector,
  (unarchivedNotificationIds, readNotificationIds) =>
    Set(unarchivedNotificationIds).subtract(readNotificationIds).size,
)
