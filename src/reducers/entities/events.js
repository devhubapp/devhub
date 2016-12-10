// @flow

import { Map, List } from 'immutable';

import {
  MARK_EVENTS_AS_SEEN,
  MARK_EVENTS_AS_NOT_SEEN,
  TOGGLE_SEEN,
  HIDE_EVENTS,
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
export default (state: State = Map(), action: Action<any>): State => {
  const { type, payload } = action || {};
  const eventIds = payload ? List(payload.eventIds) : List();

  switch (type) {
    case MARK_EVENTS_AS_SEEN:
      return state.merge(arrayOfIdsToMergeableMap(eventIds, Map({ seen: true })));

    case MARK_EVENTS_AS_NOT_SEEN:
      return state.merge(arrayOfIdsToMergeableMap(eventIds, Map({ seen: false })));

    case TOGGLE_SEEN:
      return state.setIn([payload, 'seen'], !state.getIn([payload, 'seen']));

    case HIDE_EVENTS:
      return state.merge(arrayOfIdsToMergeableMap(eventIds, Map({ hidden: true })));
      // return state.filterNot(event => eventIds.includes(event.get('id')));

    default:
      return state;
  }
};
