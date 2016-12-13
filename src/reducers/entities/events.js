// @flow

import { Map, List } from 'immutable';

import {
  MARK_EVENTS_AS_SEEN,
  MARK_EVENTS_AS_NOT_SEEN,
  TOGGLE_SEEN,
  CLEAR_EVENTS,
} from '../../utils/constants/actions';

import type { Action, Normalized } from '../../utils/types';

function arrayOfIdsToMergeableMap(ids, newValue) {
  return List(ids)
    .filter(Boolean)
    .toMap()
    .mapKeys((key, value) => value.toString())
    .map(() => newValue)
  ;
}

type State = Normalized<Object>;
const initialState = Map();

export default (state: State = initialState, action: Action<any>): State => {
  const { type, payload } = action || {};
  const eventIds = payload ? List(payload.eventIds) : List();

  switch (type) {
    case MARK_EVENTS_AS_SEEN:
      return state.mergeDeep(arrayOfIdsToMergeableMap(eventIds, Map({ seen: true })));

    case MARK_EVENTS_AS_NOT_SEEN:
      return state.mergeDeep(arrayOfIdsToMergeableMap(eventIds, Map({ seen: false })));

    case TOGGLE_SEEN:
      return (() => {
        const eventIds = payload instanceof List ? payload : (Array.isArray(payload) ? List(payload) : List([payload]));
        const newSeenValue = !state.getIn([eventIds.first(), 'seen']);

        let newState = state;

        eventIds.forEach(eventId => {
          newState = newState.setIn([eventId, 'seen'], newSeenValue);
        });

        return newState;
      })();

    case CLEAR_EVENTS:
      // return state.mergeDeep(arrayOfIdsToMergeableMap(eventIds, Map({ hidden: true })));
      return state.filterNot(event => eventIds.includes(event.get('id')));

    default:
      return state;
  }
};
