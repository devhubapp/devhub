// @flow

import { Map } from 'immutable';

import {
  LOAD_NOTIFICATIONS_REQUEST,
  LOAD_NOTIFICATIONS_FAILURE,
  LOAD_NOTIFICATIONS_SUCCESS,
} from '../../utils/constants/actions';

import type {
  Action,
  ApiRequestPayload,
  ApiResponsePayload,
} from '../../utils/types'

type State = {
  updatedAt: Date,
  lastModifiedAt?: string,
  pollInterval?: number,
  rateLimit?: number,
  rateLimitRemaining?: number,
  rateLimitReset?: number,
  loading: boolean,
  error?: string,
};

const initialState: State = Map({
  lastModifiedAt: undefined,
});

export default (state: State = initialState, { type, payload }: Action<any>): State => {
  switch (type) {
    case LOAD_NOTIFICATIONS_REQUEST:
      return (({ subscriptionId }: ApiRequestPayload) => (
        state.setIn([subscriptionId, 'loading'], true)
      ))(payload || {});

    case LOAD_NOTIFICATIONS_FAILURE:
      return (({ request: { subscriptionId } }: ApiResponsePayload) => (
        state
          .setIn([subscriptionId, 'loading'], false)
          .setIn([subscriptionId, 'error'], error)
      ))(payload || {});

    case LOAD_NOTIFICATIONS_SUCCESS:
      return (({ meta }: ApiResponsePayload) => {
        return state.mergeDeep({
          updatedAt: new Date(),
          ...( meta && meta['last-modified'] ? {
              lastModifiedAt: meta['last-modified'],
              pollInterval: Number(meta['x-poll-interval']),
              rateLimit: Number(meta['x-ratelimit-limit']),
              rateLimitRemaining: Number(meta['x-ratelimit-remaining']),
              rateLimitReset: meta['x-ratelimit-reset'],
            } : {}),
          loading: false,
          error: null,
        });
      })(payload || {});

    default:
      return state;
  }
};
