// @flow
/*  eslint-disable import/prefer-default-export */

import { denormalize } from 'denormalizr';

import {
  createImmutableSelectorCreator,
  createImmutableSelector,
  entitiesSelector,
  isArchivedFilter,
} from './shared';

import { groupNotificationsByRepository } from '../utils/helpers/github';
import { NotificationSchema } from '../utils/normalizr/schemas';

export const notificationIdSelector = (state, { notificationId }) => notificationId;
export const notificationDetailsSelector = (state) => state.get('notifications');
export const notificationEntitiesSelector = (state) => entitiesSelector(state).get('notifications');

export const notificationIdsSelector = createImmutableSelector(
  notificationEntitiesSelector,
  (notifications) => (
    notifications
      .filter(Boolean)
      .filterNot(isArchivedFilter)
      .map(notification => notification.get('id')).toList()
  ),
);

export const readNotificationIdsSelector = createImmutableSelector(
  notificationEntitiesSelector,
  (notifications) => (
    notifications
      .filter(notification => notification.get('unread') === false)
      .map(notification => notification.get('id'))
      .toList()
  ),
);

export const sortNotificationsByDate = (b, a) => (a.get('updated_at') > b.get('updated_at') ? 1 : -1);

export const makeReadNotificationSelector = () => createImmutableSelector(
  notificationIdSelector,
  readNotificationIdsSelector,
  (notificationId, readIds) => readIds.includes(notificationId),
);

export const makeDenormalizedNotificationSelector = () => createImmutableSelector(
  notificationIdSelector,
  entitiesSelector,
  (notificationId, entities) => (
    denormalize(notificationId, entities, NotificationSchema)
  ),
);

export const denormalizedOrderedNotificationsSelector = createImmutableSelectorCreator(1)(
  notificationIdsSelector,
  entitiesSelector,
  (notificationIds, entities) => (
    denormalize(notificationIds, entities, [NotificationSchema])
      .sort(sortNotificationsByDate)
  ),
);

export const denormalizedGroupedNotificationsSelector = createImmutableSelector(
  denormalizedOrderedNotificationsSelector,
  (state, params) => params,
  (notifications, params) => groupNotificationsByRepository(notifications, params),
);

export const isLoadingSelector = createImmutableSelector(
  notificationDetailsSelector,
  (notifications) => !!notifications.get('loading'),
);

export const lastModifiedAtSelector = createImmutableSelector(
  notificationDetailsSelector,
  (notifications) => notifications.get('lastModifiedAt'),
);

export const updatedAtSelector = createImmutableSelector(
  notificationDetailsSelector,
  (notifications) => notifications.get('updatedAt'),
);
