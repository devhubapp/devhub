// @flow
/* eslint-disable import/prefer-default-export */

import {
  CREATE_COLUMN,
  DELETE_COLUMN,
  UPDATE_ALL_COLUMNS_SUBSCRIPTIONS,
  UPDATE_COLUMN_SUBSCRIPTIONS,
  CREATE_SUBSCRIPTION,
  DELETE_SUBSCRIPTION,
  SET_THEME,
  STAR_REPO,
  UNSTAR_REPO,
  LOAD_SUBSCRIPTION_DATA_REQUEST,
  LOAD_SUBSCRIPTION_DATA_SUCCESS,
  LOAD_SUBSCRIPTION_DATA_FAILURE,
} from '../utils/constants/actions';

import { ApiRequestType, requestTypes } from '../api/github';
import { generateSubscriptionId } from '../reducers/entities/subscriptions';
import { action, errorAction } from '../utils/helpers/actions';
import type {
  ApiRequestPayload,
  ApiResponsePayload,
  Column,
  Subscription,
  Theme,
} from '../utils/types';

export const createColumn = (title: string, subscriptions: Array<Object>, other?: Object = {}) => (
  action(CREATE_COLUMN, ({ title, subscriptions, ...other }: Column))
);

export const deleteColumn = (id: string) => (
  action(DELETE_COLUMN, ({ id }: Column))
);

export const createSubscription = (
  id: string,
  requestType: ApiRequestType,
  params: Object,
  other?: Object = {},
) => (
  action(CREATE_SUBSCRIPTION, ({ id, requestType, params, ...other }: Subscription))
);

export const deleteSubscription = (id: string) => (
  action(DELETE_SUBSCRIPTION, ({ id }: Subscription))
);

export const updateAllColumnsSubscriptions = () => action(UPDATE_ALL_COLUMNS_SUBSCRIPTIONS);

export const updateColumnSubscriptions = (id: string) => (
  action(UPDATE_COLUMN_SUBSCRIPTIONS, ({ id }: Subscription))
);

export const setTheme = (theme: Theme) => action(SET_THEME, theme);
export const starRepo = (repoFullName: string) => action(STAR_REPO, repoFullName);
export const unstarRepo = (repoFullName: string) => action(UNSTAR_REPO, repoFullName);

export const loadSubscriptionDataRequest = (requestType: ApiRequestType, params: Object) => {
  const subscriptionId = generateSubscriptionId(requestType, params);

  return (
    action(LOAD_SUBSCRIPTION_DATA_REQUEST, ({
      params,
      requestType,
      subscriptionId,
    }: ApiRequestPayload))
  );
};

export const loadUserReceivedEvents = (username: string) => (
  loadSubscriptionDataRequest(requestTypes.USER_RECEIVED_EVENTS, { username })
);

export const loadUserEvents = (username: string) => (
  loadSubscriptionDataRequest(requestTypes.USER_EVENTS, { username })
);

export const loadUserOrgEvents = (username: string, org: string) => (
  loadSubscriptionDataRequest(requestTypes.USER_ORG_EVENTS, { username, org })
);

export const loadRepoEvents = (owner: string, repo: string) => (
  loadSubscriptionDataRequest(requestTypes.REPO_EVENTS, { owner, repo })
);

export const loadOrgEvents = (org: string) => (
  loadSubscriptionDataRequest(requestTypes.ORG_PUBLIC_EVENTS, { org })
);

export const loadSubscriptionDataSuccess = (
  request: ApiRequestPayload,
  data: Object,
  meta: Object,
) => (
  action(LOAD_SUBSCRIPTION_DATA_SUCCESS, ({ request, data, meta }: ApiResponsePayload))
);

export const loadSubscriptionDataFailure = (request: ApiRequestPayload, error: any) => (
  errorAction(LOAD_SUBSCRIPTION_DATA_FAILURE, error)
);
