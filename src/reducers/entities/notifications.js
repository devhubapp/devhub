// @flow

import { Map } from 'immutable';

import {
  ARCHIVE_NOTIFICATIONS,
  MARK_NOTIFICATIONS_AS_READ,
  MARK_NOTIFICATIONS_AS_UNREAD,
} from '../../utils/constants/actions';

import { archiveIds } from './_shared';
import type { Action, Normalized } from '../../utils/types';

const markAsRead = (notification, lastReadAt) => (
  notification
    .set('last_read_at', lastReadAt || new Date())

  // we mark the last_unread_at as null
  // because when the notifications are updated,
  // the last_read_at from github would replace the last_read_at from the app,
  // and would make the notification be always marked as unread
  // because the last_read_at from github is always before last_unread_at from the app
  // (unread = last_unread_at && last_unread_at > last_read_at)
    .set('last_unread_at', null)
);

const markAsUnread = (notification, lastUnreadAt) => (
  notification.set('last_unread_at', lastUnreadAt || new Date())
);

type State = Normalized<Object>;
const initialState = Map();

export default (state: State = initialState, { type, payload }: Action<any>): State => {
  switch (type) {
    case ARCHIVE_NOTIFICATIONS:
      return archiveIds(state, payload.notificationIds);

    case MARK_NOTIFICATIONS_AS_READ:
      return (({ lastReadAt: _lastReadAt, notificationIds }) => {
        const lastReadAt = _lastReadAt || new Date();

        let newState = state;
        notificationIds.forEach((notificationId) => {
          const notification = newState.get(notificationId);
          if (!notification) return;

          const newNotification = markAsRead(notification, lastReadAt);
          newState = newState.set(notificationId, newNotification);
        });

        return newState;
      })(payload);

    case MARK_NOTIFICATIONS_AS_UNREAD:
      return (({ lastUnreadAt: _lastUnreadAt, notificationIds }) => {
        const lastUnreadAt = _lastUnreadAt || new Date();

        let newState = state;
        notificationIds.forEach((notificationId) => {
          const notification = newState.get(notificationId);
          if (!notification) return;

          const newNotification = markAsUnread(notification, lastUnreadAt);
          newState = newState.set(notificationId, newNotification);
        });

        return newState;
      })(payload);

    default:
      return state;
  }
};
