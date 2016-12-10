// @flow

import { fromJS, List, Map, Set } from 'immutable';

import { ApiRequestType, getUniquePath } from '../../api/github';
import {
  HIDE_EVENTS,
  CREATE_SUBSCRIPTION,
  DELETE_SUBSCRIPTION,
  LOAD_SUBSCRIPTION_DATA_REQUEST,
  LOAD_SUBSCRIPTION_DATA_SUCCESS,
  LOAD_SUBSCRIPTION_DATA_FAILURE,
  } from '../../utils/constants/actions';

import type { SeenEvents } from '../../utils/constants/actions';

import type {
  Action,
  ApiRequestPayload,
  ApiResponsePayload,
  Normalized,
  Subscription,
} from '../../utils/types';

export function generateSubscriptionId(requestType: ApiRequestType, params: Object) {
  return getUniquePath(requestType, params);
}

type State = Normalized<Subscription>;
export default (state: State = Map(), { type, payload, error }: Action<any>): State => {
  switch (type) {
    case CREATE_SUBSCRIPTION:
      return (({ id: subscriptionId, requestType, params, ...restOfPayload }: Subscription) => {
        const id = subscriptionId || generateSubscriptionId(requestType, params);

        return state.set(id, fromJS({
          id,
          requestType,
          params: params || {},
          createdAt: new Date(),
          updatedAt: null,
          ...restOfPayload,
        }));
      })(payload);

    case DELETE_SUBSCRIPTION:
      // TODO: Delete all events that are not being used elsewhere
      return state.delete(payload.id);

    case LOAD_SUBSCRIPTION_DATA_REQUEST:
      return (({ subscriptionId }: ApiRequestPayload) => (
        state.setIn([subscriptionId, 'loading'], true)
      ))(payload);

    case LOAD_SUBSCRIPTION_DATA_FAILURE:
      return (({ subscriptionId }: ApiRequestPayload, error) => (
        state
          .setIn([subscriptionId, 'loading'], false)
          .setIn([subscriptionId, 'error'], error)
      ))(payload, error);

    case LOAD_SUBSCRIPTION_DATA_SUCCESS:
      return (({ request: { subscriptionId }, data: { result } }: ApiResponsePayload) => {
        if (!state.get(subscriptionId)) return state;

        const eventsIds = state.getIn([subscriptionId, 'events']) || List();
        const newEventsIds = Set(result).union(Set(eventsIds)).toList();

        return state
          .setIn([subscriptionId, 'events'], newEventsIds)
          .setIn([subscriptionId, 'updatedAt'], new Date())
          .setIn([subscriptionId, 'loading'], false)
          .setIn([subscriptionId, 'error'], null)
        ;
      })(payload);

    case HIDE_EVENTS:
      return (({ eventIds }: SeenEvents) => {
        if (!eventIds) return state;

        return state.map(subscription => {
          // if (payload.subscriptionId !== subscription.get('id')) return subscription;

          const hideEventIds = List(eventIds);
          const currentEventIds = subscription.get('events');
          const newEventIds = currentEventIds.filterNot(eventId => hideEventIds.includes(eventId));

          return subscription.set('events', newEventIds);
        });
      })(payload);

    default:
      return state;
  }
};
