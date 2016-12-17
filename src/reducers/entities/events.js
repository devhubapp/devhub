// @flow

import { Map } from 'immutable';

import {
  CLEAR_EVENTS,
} from '../../utils/constants/actions';

import type { Action, Normalized } from '../../utils/types';

type State = Normalized<Object>;
const initialState = Map();

export default (state: State = initialState, action: Action<any>): State => {
  const { type, payload: { eventIds } = {} } = action || {};

  switch (type) {
    case CLEAR_EVENTS:
      // return state.mergeDeep(arrayOfIdsToMergeableMap(eventIds, Map({ hidden: true })));
      return eventIds ? state.filterNot(event => eventIds.includes(event.get('id'))) : state;

    default:
      return state;
  }
};
