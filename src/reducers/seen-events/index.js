// @flow

import { Set } from 'immutable';

import {
  MARK_EVENTS_AS_SEEN,
  MARK_EVENTS_AS_NOT_SEEN,
  TOGGLE_SEEN,
} from '../../utils/constants/actions';
import type { Action } from '../../utils/types';

type State = Array<string>;
const initialState = Set();

export default (state: State = initialState, action: Action<any>): State => {
  const { type, payload: { eventIds } = {} } = action || {};

  switch (type) {
    case MARK_EVENTS_AS_SEEN:
      return Set(state).concat(eventIds);

    case MARK_EVENTS_AS_NOT_SEEN:
      return Set(state).subtract(eventIds);

    case TOGGLE_SEEN:
      return (() => {
        const newSeenValue = !Set(state).includes(eventIds.first());
        return newSeenValue ? Set(state).concat(eventIds) : Set(state).subtract(eventIds);
      })();

    default: return Set(state);
  }
};
