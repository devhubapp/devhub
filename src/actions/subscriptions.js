// @flow
/* eslint-disable import/prefer-default-export */

import {
  UPDATE_ALL_COLUMNS_SUBSCRIPTIONS,
  UPDATE_COLUMN_SUBSCRIPTIONS,
  CREATE_SUBSCRIPTION,
  DELETE_SUBSCRIPTION,
  LOAD_SUBSCRIPTION_DATA_REQUEST,
  LOAD_SUBSCRIPTION_DATA_SUCCESS,
  LOAD_SUBSCRIPTION_DATA_FAILURE,
} from '../utils/constants/actions';

import { ApiRequestType } from '../api/github';
import { generateSubscriptionId } from '../reducers/entities/subscriptions';
import { action, errorAction } from '../utils/helpers/actions';
import type {
  ApiRequestPayload,
  ApiResponsePayload,
  Subscription,
} from '../utils/types';

export const createSubscription = (
  id: string,
  requestType: ApiRequestType,
  params: Object,
  other?: Object = {},
) => (
  action(CREATE_SUBSCRIPTION, ({ id, requestType, params }: Subscription), other)
);

export const deleteSubscription = (id: string, other?: Object = {}) => (
  action(DELETE_SUBSCRIPTION, ({ id }: Subscription), other)
);

export const updateAllColumnsSubscriptions = (other?: Object = {}) => (
  action(UPDATE_ALL_COLUMNS_SUBSCRIPTIONS, undefined, other)
);

export const updateColumnSubscriptions = (id: string, other?: Object = {}) => (
  action(UPDATE_COLUMN_SUBSCRIPTIONS, ({ id }: Subscription), other)
);

export const loadSubscriptionDataRequest = (
  requestType: ApiRequestType,
  params: Object,
  other?: Object = {},
) => {
  const subscriptionId = generateSubscriptionId(requestType, params);

  return (
    action(LOAD_SUBSCRIPTION_DATA_REQUEST, ({
      params,
      requestType,
      subscriptionId,
    }: ApiRequestPayload), other)
  );
};

export const loadSubscriptionDataSuccess = (
  request: ApiRequestPayload,
  data: Object,
  meta: Object,
  other?: Object = {},
) => (
  action(LOAD_SUBSCRIPTION_DATA_SUCCESS, ({ request, data, meta }: ApiResponsePayload), other)
);

export const loadSubscriptionDataFailure = (
  request: ApiRequestPayload,
  error: any,
  other?: Object = {},
) => (
  errorAction(LOAD_SUBSCRIPTION_DATA_FAILURE, { request }, error, other)
);
