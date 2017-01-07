// @flow

import { Set } from 'immutable';

import {
  MARK_EVENTS_AS_SEEN,
  MARK_EVENTS_AS_NOT_SEEN,
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

    default: return Set(state);
  }
};
