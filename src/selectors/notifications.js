// @flow
/*  eslint-disable import/prefer-default-export */

import { denormalize } from 'denormalizr';

import { createImmutableSelector, entitiesSelector } from './shared';
import { groupNotificationsByRepository } from '../utils/helpers/github';
import { NotificationSchema } from '../utils/normalizr/schemas';

export const notificationIdSelector = (state, { notificationId }) => notificationId;
export const notificationDetailsSelector = (state) => state.get('notifications');
export const notificationEntitiesSelector = (state) => entitiesSelector(state).get('notifications');

export const notificationIdsSelector = createImmutableSelector(
  notificationEntitiesSelector,
  (notifications) => notifications.map(notification => notification.get('id')),
);

export const seenNotificationIdsSelector = createImmutableSelector(
  notificationEntitiesSelector,
  (notifications) => (
    notifications
      .filter(notification => notification.get('unread') === false)
      .map(notification => notification.get('id'))
  ),
);

export const sortNotificationsByDate = (b, a) => (a.get('updated_at') > b.get('updated_at') ? 1 : -1);

export const makeSeenNotificationSelector = () => createImmutableSelector(
  notificationIdSelector,
  seenNotificationIdsSelector,
  (notificationId, seenIds) => seenIds.includes(notificationId),
);

export const makeDenormalizedNotificationSelector = () => createImmutableSelector(
  notificationIdSelector,
  entitiesSelector,
  (notificationId, entities) => (
    denormalize(notificationId, entities, NotificationSchema)
  ),
);

export const denormalizedOrderedNotificationsSelector = createImmutableSelector(
  notificationIdsSelector,
  entitiesSelector,
  (notificationIds, entities) => (
    denormalize(notificationIds, entities, [NotificationSchema])
      .sort(sortNotificationsByDate)
  ),
);

export const denormalizedGroupedNotificationsSelector = createImmutableSelector(
  denormalizedOrderedNotificationsSelector,
  (notifications) => groupNotificationsByRepository(notifications),
);

export const updatedAtSelector = createImmutableSelector(
  notificationDetailsSelector,
  (notifications) => notifications.get('updatedAt'),
);
