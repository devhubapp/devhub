// @flow

import { Set } from 'immutable';

import {
  MARK_EVENTS_AS_READ,
  MARK_EVENTS_AS_UNREAD,
} from '../../utils/constants/actions';
import type { Action } from '../../utils/types';

type State = Array<string>;
const initialState = Set();

export default (state: State = initialState, { type, payload }: Action<any> = {}): State => {
  const { eventIds } = payload || {};

  switch (type) {
    case MARK_EVENTS_AS_READ:
      return Set(state).concat(eventIds);

    case MARK_EVENTS_AS_UNREAD:
      return Set(state).subtract(eventIds);

    default: return Set(state);
  }
};
