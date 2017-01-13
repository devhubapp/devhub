// @flow

import { Map } from 'immutable';

import {
  ARCHIVE_EVENTS,
} from '../../utils/constants/actions';

import { archiveIds } from './_shared';
import type { Action, Normalized } from '../../utils/types';

type State = Normalized<Object>;
const initialState = Map();

export default (state: State = initialState, action: Action<any>): State => {
  const { type, payload } = action || {};

  switch (type) {
    case ARCHIVE_EVENTS:
      return archiveIds(state, payload.eventIds);

    default:
      return state;
  }
};
