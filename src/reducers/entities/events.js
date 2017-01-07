// @flow

import { Map } from 'immutable';

import {
  CLEAR_EVENTS,
} from '../../utils/constants/actions';

import { arrayOfIdsToMergeableMap } from '../../utils/helpers';
import type { Action, Normalized } from '../../utils/types';

type State = Normalized<Object>;
const initialState = Map();

export default (state: State = initialState, action: Action<any>): State => {
  const { type, payload } = action || {};
  const { eventIds } = payload || {};

  switch (type) {
    case CLEAR_EVENTS:
      return state.mergeDeep(arrayOfIdsToMergeableMap(
        eventIds,
        Map({ archived_at: new Date() }),
      ));
      // return eventIds ? state.filterNot(event => eventIds.includes(event.get('id'))) : state;

    default:
      return state;
  }
};
