// @flow

import { Map } from 'immutable';

import {
  ARCHIVE_NOTIFICATIONS,
  DELETE_NOTIFICATIONS,
  MARK_NOTIFICATIONS_AS_READ_REQUEST,
  MARK_NOTIFICATIONS_AS_READ_FAILURE,
  MARK_NOTIFICATIONS_AS_READ_SUCCESS,
  MARK_NOTIFICATIONS_AS_UNREAD,
} from '../../utils/constants/actions';

import {
  deleteByIds,
  markAsReadByIds,
  markAsUnreadByIds,
  markAsArchivedByIds,
  undoMarkAsReadByIds,
} from './_shared';

import type { Action, Normalized } from '../../utils/types';

type State = Normalized<Object>;
const initialState = Map();

export default (
  state: State = initialState,
  { type, payload }: ?Action<any> = {},
): State => {
  switch (type) {
    case ARCHIVE_NOTIFICATIONS:
      return markAsArchivedByIds(
        state,
        payload.notificationIds,
        payload.archivedAt,
      );

    case DELETE_NOTIFICATIONS:
      return deleteByIds(
        state,
        payload.notificationIds,
        payload.deletedAt,
        true,
      );

    case MARK_NOTIFICATIONS_AS_READ_REQUEST:
      return markAsReadByIds(
        state,
        payload.notificationIds,
        payload.lastReadAt,
        false,
      );

    case MARK_NOTIFICATIONS_AS_READ_FAILURE:
      return undoMarkAsReadByIds(state, payload.notificationIds);

    case MARK_NOTIFICATIONS_AS_READ_SUCCESS:
      return markAsReadByIds(
        state,
        payload.notificationIds,
        payload.lastReadAt,
        true,
      );

    case MARK_NOTIFICATIONS_AS_UNREAD:
      return markAsUnreadByIds(
        state,
        payload.notificationIds,
        payload.lastUnreadAt,
      );

    default:
      return state;
  }
};
