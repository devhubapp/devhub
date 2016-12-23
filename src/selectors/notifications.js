// @flow
/*  eslint-disable import/prefer-default-export */

import { denormalize } from 'denormalizr';
import { arrayOf } from 'normalizr';

import { createImmutableSelector, entitiesSelector } from './shared';
import { NotificationSchema } from '../utils/normalizr/schemas';

export const notificationIdSelector = (state, { notificationId }) => notificationId;
export const notificationsSelector = (state) => entitiesSelector(state).get('notifications');

export const notificationIdsSelector = createImmutableSelector(
  notificationsSelector,
  (notifications) => notifications.map(notification => notification.get('id')),
);

export const seenNotificationIdsSelector = createImmutableSelector(
  notificationsSelector,
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
  (notificationId, entities) => denormalize(notificationId, entities, NotificationSchema),
);

export const denormalizedNotificationsSelector = createImmutableSelector(
  notificationIdsSelector,
  entitiesSelector,
  (notificationIds, entities) => (
    denormalize(notificationIds, entities, arrayOf(NotificationSchema))
      .sort(sortNotificationsByDate)
  ),
);
