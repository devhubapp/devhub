// @flow

import { fromJS, List, Map } from 'immutable';

import { guid } from '../../utils/helpers';

import {
  CREATE_COLUMN,
  DELETE_COLUMN,
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

    default:
      return state;
  }
};
