// @flow

import { fromJS, List, Map, Set } from 'immutable';

import { guid } from '../../utils/helpers';

import {
  // CLEAR_EVENTS,
  TOGGLE_SEEN,
  CREATE_COLUMN,
  DELETE_COLUMN,
  LOAD_SUBSCRIPTION_DATA_REQUEST,
  LOAD_SUBSCRIPTION_DATA_SUCCESS,
  LOAD_SUBSCRIPTION_DATA_FAILURE,
  MARK_EVENTS_AS_SEEN,
  MARK_EVENTS_AS_NOT_SEEN,
} from '../../utils/constants/actions';

import type {
  ApiRequestPayload,
  ApiResponsePayload,
  Action,
  Column,
  Normalized,
} from '../../utils/types';

type State = Normalized<Column>;
export default (state: State = Map(), { type, payload }: Action<any>): State => {
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

    case MARK_EVENTS_AS_SEEN:
      return state.setIn([payload.columnId, 'allSeen'], true);

    case MARK_EVENTS_AS_NOT_SEEN:
      return state.setIn([payload.columnId, 'allSeen'], false);

    case TOGGLE_SEEN:
      return state.map(column => (
        column.get('events').includes(payload)
          ? column.set('allSeen', false)
          : column
      ));

    // case CLEAR_EVENTS:
    //   return state.map(column => {
    //     // if (payload.columnId !== column.get('id')) return column;

    //     const clearEventIds = List(payload.eventIds);
    //     const currentEventIds = column.get('events');
    //     const newEventIds = currentEventIds.filterNot(eventId => clearEventIds.includes(eventId));

    //     return column.set('events', newEventIds);
    //   });

    default:
      return state;
  }
};
