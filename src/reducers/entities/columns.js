// @flow

import { fromJS, List, Map, Set } from 'immutable';

import { guid } from '../../utils/helpers';

import {
  CREATE_COLUMN,
  DELETE_COLUMN,
  LOAD_SUBSCRIPTION_DATA_REQUEST,
  LOAD_SUBSCRIPTION_DATA_SUCCESS,
  LOAD_SUBSCRIPTION_DATA_FAILURE,
} from '../../utils/constants/actions';

import type {
  ApiRequestPayload,
  ApiResponsePayload,
  Action,
  Column,
  Normalized,
} from '../../utils/types';

type State = Normalized<Column>;
export default (state: State = Map({}), { type, payload }: Action<any>): State => {
  switch (type) {
    case CREATE_COLUMN:
      return (({ title, events, subscriptions, ...restOfPayload }: Column) => {
        const id = guid();

        return state.set(id, Map(fromJS({
          id,
          title,
          events: List(events),
          subscriptions: List(subscriptions),
          createdAt: new Date(),
          ...restOfPayload,
        })));
      })(payload);

    case DELETE_COLUMN:
      return state.delete(payload.id);

    case LOAD_SUBSCRIPTION_DATA_REQUEST:
      return (({ subscriptionId }: ApiRequestPayload) => (
        state.map(column => {
          if (!column.get('subscriptions').includes(subscriptionId)) return column;

          return column
            .set('loading', true)
          ;
        })
      ))(payload);

    case LOAD_SUBSCRIPTION_DATA_SUCCESS:
      return (({ request: { subscriptionId }, data: { result } }: ApiResponsePayload) => (
        state.map(column => {
          if (!column.get('subscriptions').includes(subscriptionId)) return column;

          return column
            .set('events', Set(result).union(Set(column.get('events')).toList()))
            .set('loading', false)
            .set('updatedAt', new Date())
          ;
        })
      ))(payload);

    case LOAD_SUBSCRIPTION_DATA_FAILURE:
      return (({ request: { subscriptionId } }: ApiResponsePayload) => (
        state.map(column => {
          if (!column.get('subscriptions').includes(subscriptionId)) return column;

          return column
            .set('loading', false)
          ;
        })
      ))(payload);

    default:
      return state;
  }
};
