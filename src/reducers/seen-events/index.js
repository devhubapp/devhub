// @flow

import { Set } from 'immutable';

import {
  MARK_EVENTS_AS_SEEN,
  MARK_EVENTS_AS_NOT_SEEN,
  TOGGLE_EVENTS_SEEN_STATUS,
} from '../../utils/constants/actions';
import type { Action } from '../../utils/types';

type State = Array<string>;
const initialState = Set();

export default (state: State = initialState, { type, payload }: Action<any> = {}): State => {
  const { eventIds } = payload || {};

  switch (type) {
    case MARK_EVENTS_AS_SEEN:
      return Set(state).concat(eventIds);

    case MARK_EVENTS_AS_NOT_SEEN:
      return Set(state).subtract(eventIds);

    case TOGGLE_EVENTS_SEEN_STATUS:
      return (() => {
        const newSeenValue = !Set(state).includes(eventIds.first());
        return newSeenValue ? Set(state).concat(eventIds) : Set(state).subtract(eventIds);
      })();

    default: return Set(state);
  }
};
