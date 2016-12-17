// @flow
/* eslint-disable import/prefer-default-export */

import { Set } from 'immutable';

import {
  CLEAR_APP_DATA,
  CREATE_COLUMN,
  DELETE_COLUMN,
  UPDATE_ALL_COLUMNS_SUBSCRIPTIONS,
  UPDATE_COLUMN_SUBSCRIPTIONS,
  CREATE_SUBSCRIPTION,
  DELETE_SUBSCRIPTION,
  SET_THEME,
  STAR_REPO,
  UNSTAR_REPO,
  TOGGLE_SEEN,
  CLEAR_EVENTS,
  MARK_EVENTS_AS_SEEN,
  MARK_EVENTS_AS_NOT_SEEN,
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

export const clearAppData = (other?: Object = {}) => (
  action(CLEAR_APP_DATA, undefined, other)
);

export const createColumn = (title: string, subscriptionIds: Array<Object>, other?: Object = {}) => (
  action(CREATE_COLUMN, ({ title, subscriptionIds }: Column), other)
);

export const deleteColumn = (id: string, other?: Object = {}) => (
  action(DELETE_COLUMN, ({ id }: Column), other)
);

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

export const setTheme = (theme: Theme, other?: Object = {}) => (
  action(SET_THEME, theme, other)
);

export const starRepo = (repoId: number | string, other?: Object = {}) => (
  action(STAR_REPO, `${repoId}`, other)
);

export const unstarRepo = (repoId: number | string, other?: Object = {}) => (
  action(UNSTAR_REPO, `${repoId}`, other)
);

export const toggleSeen = (eventIds: Array<string>, other?: Object = {}) => (
  action(TOGGLE_SEEN, { eventIds: Set(eventIds) }, other)
);

export type SeenEvents = { columnId: string, eventIds: Array<string> };
export const clearEvents = ({ columnId, eventIds }: SeenEvents, other?: Object = {}) => (
  action(CLEAR_EVENTS, { columnId, eventIds: Set(eventIds) }, other)
);

export const markEventsAsSeen = ({ columnId, eventIds }: SeenEvents, other?: Object = {}) => (
  action(MARK_EVENTS_AS_SEEN, { columnId, eventIds: Set(eventIds) }, other)
);

export const markEventsAsUnseen = ({ columnId, eventIds }: SeenEvents, other?: Object = {}) => (
  action(MARK_EVENTS_AS_NOT_SEEN, { columnId, eventIds: Set(eventIds) }, other)
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

export const loadUserReceivedEvents = (username: string, other?: Object = {}) => (
  loadSubscriptionDataRequest(requestTypes.USER_RECEIVED_EVENTS, { username }, other)
);

export const loadUserEvents = (username: string, other?: Object = {}) => (
  loadSubscriptionDataRequest(requestTypes.USER_EVENTS, { username }, other)
);

export const loadUserOrgEvents = (username: string, org: string, other?: Object = {}) => (
  loadSubscriptionDataRequest(requestTypes.USER_ORG_EVENTS, { username, org }, other)
);

export const loadRepoEvents = (owner: string, repo: string, other?: Object = {}) => (
  loadSubscriptionDataRequest(requestTypes.REPO_EVENTS, { owner, repo }, other)
);

export const loadOrgEvents = (org: string, other?: Object = {}) => (
  loadSubscriptionDataRequest(requestTypes.ORG_PUBLIC_EVENTS, { org }, other)
);

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
