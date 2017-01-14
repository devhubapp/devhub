// @flow

import { Map } from 'immutable';

import {
  ARCHIVE_EVENTS,
  MARK_EVENTS_AS_READ,
  MARK_EVENTS_AS_UNREAD,
} from '../../utils/constants/actions';

import {
  markIdsAsRead,
  markIdsAsUnread,
  markIdsAsArchived,
} from './_shared';

import type { Action, Normalized } from '../../utils/types';

type State = Normalized<Object>;
const initialState = Map();

export default (state: State = initialState, action: Action<any>): State => {
  const { type, payload } = action || {};

  switch (type) {
    case ARCHIVE_EVENTS:
      return markIdsAsArchived(state, payload.eventIds, payload.archivedAt);

    case MARK_EVENTS_AS_READ:
      return markIdsAsRead(state, payload.eventIds, payload.lastReadAt, true);

    case MARK_EVENTS_AS_UNREAD:
      return markIdsAsUnread(state, payload.eventIds, payload.lastUnreadAt);

    default:
      return state;
  }
};
