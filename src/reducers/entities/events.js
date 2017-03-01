// @flow

import { Map } from 'immutable';

import {
  ARCHIVE_EVENTS,
  DELETE_EVENTS,
  MARK_EVENTS_AS_READ,
  MARK_EVENTS_AS_UNREAD,
} from '../../utils/constants/actions';

import {
  deleteByIds,
  markAsReadByIds,
  markAsUnreadByIds,
  markAsArchivedByIds,
} from './_shared';

import type { Action, Normalized } from '../../utils/types';

type State = Normalized<Object>;
const initialState = Map();

export default (state: State = initialState, action: Action<any>): State => {
  const { type, payload } = action || {};

  switch (type) {
    case ARCHIVE_EVENTS:
      return markAsArchivedByIds(state, payload.eventIds, payload.archivedAt);

    case DELETE_EVENTS:
      return deleteByIds(state, payload.eventIds, payload.deletedAt, false);

    case MARK_EVENTS_AS_READ:
      return markAsReadByIds(state, payload.eventIds, payload.lastReadAt, true);

    case MARK_EVENTS_AS_UNREAD:
      return markAsUnreadByIds(state, payload.eventIds, payload.lastUnreadAt);

    default:
      return state;
  }
};
