// @flow

import { Map } from 'immutable';

import {
  ARCHIVE_NOTIFICATIONS,
  MARK_NOTIFICATIONS_AS_READ_REQUEST,
  MARK_NOTIFICATIONS_AS_READ_FAILURE,
  MARK_NOTIFICATIONS_AS_READ_SUCCESS,
  MARK_NOTIFICATIONS_AS_UNREAD,
} from '../../utils/constants/actions';

import {
  markIdsAsRead,
  markIdsAsUnread,
  markIdsAsArchived,
  undoMarkIdsAsRead,
} from './_shared';

import type { Action, Normalized } from '../../utils/types';

type State = Normalized<Object>;
const initialState = Map();

export default (state: State = initialState, { type, payload }: Action<any>): State => {
  switch (type) {
    case ARCHIVE_NOTIFICATIONS:
      return markIdsAsArchived(state, payload.notificationIds, payload.archivedAt);

    case MARK_NOTIFICATIONS_AS_READ_REQUEST:
      return markIdsAsRead(state, payload.notificationIds, payload.lastReadAt);

    case MARK_NOTIFICATIONS_AS_READ_FAILURE:
      return undoMarkIdsAsRead(state, payload.notificationIds);

    case MARK_NOTIFICATIONS_AS_READ_SUCCESS:
      return (({ notificationIds }) => {
        let newState = state;
        notificationIds.forEach((notificationId) => {
          const notification = newState.get(notificationId);
          if (!notification) return;

          const newNotification = notification.set('unread', false);
          newState = newState.set(notificationId, newNotification);
        });

        return newState;
      })(payload);

    case MARK_NOTIFICATIONS_AS_UNREAD:
      return markIdsAsUnread(state, payload.notificationIds, payload.lastUnreadAt);

    default:
      return state;
  }
};
