// @flow
/*  eslint-disable import/prefer-default-export */

import { denormalize } from 'denormalizr';

import {
  createImmutableSelectorCreator,
  createImmutableSelector,
  entitiesSelector,
  isArchivedFilter,
  isReadFilter,
} from './shared';

import { groupNotificationsByRepository, notificationsToFilterColumnData } from '../utils/helpers/github';
import { NotificationSchema } from '../utils/normalizr/schemas';

export const notificationIdSelector = (state, { notificationId }) => notificationId;
export const notificationDetailsSelector = (state) => state.get('notifications');
export const notificationEntitiesSelector = (state) => entitiesSelector(state).get('notifications');

export const notificationSelector = (state, { notificationId }) => (
  notificationEntitiesSelector(state).get(notificationId)
);

export const notificationIdsSelector = createImmutableSelector(
  notificationEntitiesSelector,
  (notifications) => (
    notifications
      .filter(Boolean)
      .map(notification => notification.get('id'))
      .toList()
  ),
);

export const unarchivedNotificationIdsSelector = createImmutableSelector(
  notificationEntitiesSelector,
  (notifications) => (
    notifications
      .filter(Boolean)
      .filterNot(isArchivedFilter)
      .map(notification => notification.get('id'))
      .toList()
  ),
);

export const readNotificationIdsSelector = createImmutableSelector(
  notificationEntitiesSelector,
  (notifications) => (
    notifications
      .filter(Boolean)
      .filter(isReadFilter)
      .map(notification => notification.get('id'))
      .toList()
  ),
);

export const sortNotificationsByDate = (b, a) => (a.get('updated_at') > b.get('updated_at') ? 1 : -1);

export const makeIsArchivedNotificationSelector = () => createImmutableSelector(
  notificationSelector,
  isArchivedFilter,
);

export const makeIsReadNotificationSelector = () => createImmutableSelector(
  notificationIdSelector,
  readNotificationIdsSelector,
  (notificationId, readIds) => readIds.includes(notificationId),
);

export const makeDenormalizedNotificationSelector = () => createImmutableSelector(
  notificationSelector,
  entitiesSelector,
  (notification, entities) => (
    denormalize(notification, entities, NotificationSchema)
  ),
);

// with memoization of first argument
// to prevent calling this again unless new notifications were added
export const orderedUnarchivedNotificationsSelector = createImmutableSelectorCreator(1)(
  unarchivedNotificationIdsSelector,
  notificationEntitiesSelector,
  (notificationIds, notificationEntities) => (
    notificationIds
      .map(notificationId => notificationEntities.get(notificationId))
      .sort(sortNotificationsByDate)
  ),
);

export const groupedUnarchivedNotificationsSelector = createImmutableSelector(
  orderedUnarchivedNotificationsSelector,
  (state, params) => params,
  (notifications, params) => groupNotificationsByRepository(notifications, params),
);

export const notificationsFiltersSelector = createImmutableSelector(
  unarchivedNotificationIdsSelector,
  entitiesSelector,
  (notificationIds, entities) => (
    notificationsToFilterColumnData(
      denormalize(notificationIds, entities, [NotificationSchema])
        .sort(sortNotificationsByDate),
    )
  ),
);

export const notificationsIsLoadingSelector = createImmutableSelector(
  notificationDetailsSelector,
  (notifications) => !!notifications.get('loading'),
);

export const notificationsLastModifiedAtSelector = createImmutableSelector(
  notificationDetailsSelector,
  (notifications) => notifications.get('lastModifiedAt'),
);

export const notificationsUpdatedAtSelector = createImmutableSelector(
  notificationDetailsSelector,
  (notifications) => notifications.get('updatedAt'),
);

export const notificationsErrorSelector = createImmutableSelector(
  notificationDetailsSelector,
  (notifications) => notifications.get('error'),
);
