// @flow

import moment from 'moment';
import { fromJS, Map, Set } from 'immutable';

import { ApiRequestType, getUniquePath } from '../../api/github';
import {
  CREATE_SUBSCRIPTION,
  DELETE_EVENTS,
  DELETE_SUBSCRIPTION,
  LOAD_SUBSCRIPTION_DATA_REQUEST,
  LOAD_SUBSCRIPTION_DATA_SUCCESS,
  LOAD_SUBSCRIPTION_DATA_FAILURE,
} from '../../utils/constants/actions';

import type {
  Action,
  ApiRequestPayload,
  ApiResponsePayload,
  Normalized,
  Subscription,
} from '../../utils/types';

export function generateSubscriptionId(
  requestType: ApiRequestType,
  params: Object,
) {
  return getUniquePath(requestType, params);
}

type State = Normalized<Subscription> & {
  updatedAt: Date,
  lastModifiedAt?: string,
  pollInterval?: number,
  rateLimit?: number,
  rateLimitRemaining?: number,
  rateLimitReset?: number,
  loading: boolean,
  error?: string,
};

const initialState = Map();

export default (
  state: State = initialState,
  { type, payload, error }: ?Action<any> = {},
): State => {
  switch (type) {
    case CREATE_SUBSCRIPTION:
      return (({
        id: subscriptionId,
        requestType,
        params,
        ...restOfPayload
      }: Subscription) => {
        const id =
          subscriptionId || generateSubscriptionId(requestType, params);
        const subscription = state.get(id);

        // already exists
        if (subscription) return state;

        return state.set(
          id,
          fromJS({
            id,
            requestType,
            params: Map(params),
            createdAt: moment().toISOString(),
            ...restOfPayload,
          }),
        );
      })(payload || {});

    case DELETE_EVENTS:
      return state.map(subscription =>
        subscription.update('events', events =>
          (events || Set()).toSet().subtract(payload.eventIds),
        ),
      );

    case DELETE_SUBSCRIPTION:
      // TODO: Delete all events that are not being used elsewhere
      return state.delete(payload.id);

    case LOAD_SUBSCRIPTION_DATA_REQUEST:
      return (({ subscriptionId }: ApiRequestPayload) =>
        state.setIn([subscriptionId, 'loading'], true))(payload || {});

    case LOAD_SUBSCRIPTION_DATA_FAILURE:
      return (({ request: { subscriptionId } }: ApiResponsePayload) =>
        state
          .setIn([subscriptionId, 'loading'], false)
          .setIn([subscriptionId, 'error'], error))(payload || {});

    case LOAD_SUBSCRIPTION_DATA_SUCCESS:
      return (({
        request: { subscriptionId },
        data,
        meta,
      }: ApiResponsePayload) => {
        const { result } = data || {};

        const subscription = state.get(subscriptionId);
        if (!subscription) return state;

        const eventIds = Set(subscription.get('events'));
        const newEventIds = result ? Set(result).union(eventIds) : eventIds;

        const newSubscription = subscription.mergeDeep(
          fromJS({
            events: newEventIds,
            updatedAt: moment().toISOString(),
            ...(meta && meta['last-modified']
              ? {
                  lastModifiedAt: meta['last-modified'],
                  pollInterval: Number(meta['x-poll-interval']) ||
                    subscription.get('pollInterval') ||
                    null,
                  rateLimit: Number(meta['x-ratelimit-limit']) ||
                    subscription.get('rateLimit') ||
                    null,
                  rateLimitRemaining: Number(meta['x-ratelimit-remaining']) ||
                    subscription.get('rateLimitRemaining') ||
                    null,
                  rateLimitReset: meta['x-ratelimit-reset'],
                }
              : {}),
            loading: false,
            error: null,
          }),
        );

        return state.set(subscriptionId, newSubscription);
      })(payload || {});

    default:
      return state;
  }
};
