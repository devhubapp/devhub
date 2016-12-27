// @flow

import moment from 'moment';
import { fromJS, Map, Set } from 'immutable';

import { ApiRequestType, getUniquePath } from '../../api/github';
import {
  CLEAR_EVENTS,
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
const initialState = Map();

export default (state: State = initialState, { type, payload, error }: Action<any>): State => {
  switch (type) {
    case CREATE_SUBSCRIPTION:
      return (({ id: subscriptionId, requestType, params, ...restOfPayload }: Subscription) => {
        const id = subscriptionId || generateSubscriptionId(requestType, params);
        const subscription = state.get(id);

        // already exists
        if (subscription) return state;

        return state.set(id, fromJS({
          id,
          requestType,
          params: Map(params),
          createdAt: new Date(),
          ...restOfPayload,
        }));
      })(payload || {});

    case DELETE_SUBSCRIPTION:
      // TODO: Delete all events that are not being used elsewhere
      return state.delete(payload.id);

    case LOAD_SUBSCRIPTION_DATA_REQUEST:
      return (({ subscriptionId }: ApiRequestPayload) => (
        state.setIn([subscriptionId, 'loading'], true)
      ))(payload || {});

    case LOAD_SUBSCRIPTION_DATA_FAILURE:
      return (({ request: { subscriptionId } }: ApiResponsePayload) => (
        state
          .setIn([subscriptionId, 'loading'], false)
          .setIn([subscriptionId, 'error'], error)
      ))(payload || {});

    case LOAD_SUBSCRIPTION_DATA_SUCCESS:
      return (({ request: { subscriptionId }, data: { result }, meta }: ApiResponsePayload) => {
        const subscription = state.get(subscriptionId);
        if (!subscription) return state;

        const eventIds = Set(subscription.get('events'));
        const newEventIds = Set(result).union(eventIds);

        const newSubscription = subscription.mergeDeep(fromJS({
          events: newEventIds,
          updatedAt: new Date(),
          lastModifiedAt: meta['last-modified'],
          pollInterval: Number(meta['x-poll-interval']),
          rateLimit: Number(meta['x-ratelimit-limit']),
          rateLimitRemaining: Number(meta['x-ratelimit-remaining']),
          rateLimitReset: meta['x-ratelimit-reset'],
          loading: false,
          error: null,
        }));

        return state.set(subscriptionId, newSubscription);
      })(payload || {});

    case CLEAR_EVENTS:
      return (({ eventIds }: SeenEvents) => (
        state.map(subscription => {
          // if (payload.subscriptionId !== subscription.get('id')) return subscription;

          const currentEventIds = Set(subscription.get('events'));
          const newEventIds = currentEventIds.subtract(eventIds);

          return subscription.set('events', newEventIds);
        })
      ))(payload || {});

    default:
      return state;
  }
};
