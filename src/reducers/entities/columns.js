// @flow

import { fromJS, List, Map, Set } from 'immutable';

import { guid } from '../../utils/helpers';

import {
  CREATE_COLUMN,
  DELETE_COLUMN,
  MARK_EVENTS_AS_SEEN,
  MARK_EVENTS_AS_NOT_SEEN,
} from '../../utils/constants/actions';

import type {
  Action,
  Column,
  Normalized,
} from '../../utils/types';

type State = Normalized<Column>;
const initialState = Map();

export default (state: State = initialState, { type, payload }: Action<any>): State => {
  switch (type) {
    case CREATE_COLUMN:
      return (({ title, subscriptionIds, ...restOfPayload }: Column) => {
        const id = guid();

        return state.set(id, fromJS({
          id,
          title,
          subscriptions: List(subscriptionIds),
          createdAt: new Date(),
          ...restOfPayload,
        }));
      })(payload);

    case DELETE_COLUMN:
      // TODO: Delete subscription and its events
      return state.delete(payload.id);

    case MARK_EVENTS_AS_SEEN:
      return state.setIn([payload.columnId, 'allSeen'], true);

    case MARK_EVENTS_AS_NOT_SEEN:
      return state.setIn([payload.columnId, 'allSeen'], false);

    default:
      return state;
  }
};
