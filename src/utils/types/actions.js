// @flow
/*  eslint-disable import/prefer-default-export */

import * as actions from '../constants/actions';

export type CREATE_COLUMN = typeof actions.CREATE_COLUMN;
export type UPDATE_COLUMN = typeof actions.UPDATE_COLUMN;
export type UPDATE_ALL_COLUMNS_SUBSCRIPTIONS = typeof actions.UPDATE_ALL_COLUMNS_SUBSCRIPTIONS;
export type UPDATE_COLUMN_SUBSCRIPTIONS = typeof actions.UPDATE_COLUMN_SUBSCRIPTIONS;
export type DELETE_COLUMN = typeof actions.DELETE_COLUMN;
export type CREATE_SUBSCRIPTION = typeof actions.CREATE_SUBSCRIPTION;
export type UPDATE_SUBSCRIPTION = typeof actions.UPDATE_SUBSCRIPTION;
export type DELETE_SUBSCRIPTION = typeof actions.DELETE_SUBSCRIPTION;
export type SET_THEME = typeof actions.SET_THEME;
export type STAR_REPO = typeof actions.STAR_REPO;
export type UNSTAR_REPO = typeof actions.UNSTAR_REPO;
export type LOAD_SUBSCRIPTION_DATA_REQUEST = typeof actions.LOAD_SUBSCRIPTION_DATA_REQUEST;
export type LOAD_SUBSCRIPTION_DATA_SUCCESS = typeof actions.LOAD_SUBSCRIPTION_DATA_SUCCESS;
export type LOAD_SUBSCRIPTION_DATA_FAILURE = typeof actions.LOAD_SUBSCRIPTION_DATA_FAILURE;

export type ActionType =
  | typeof actions.CREATE_COLUMN
  | typeof actions.UPDATE_COLUMN
  | typeof actions.UPDATE_ALL_COLUMNS_SUBSCRIPTIONS
  | typeof actions.UPDATE_COLUMN_SUBSCRIPTIONS
  | typeof actions.DELETE_COLUMN
  | typeof actions.CREATE_SUBSCRIPTION
  | typeof actions.UPDATE_SUBSCRIPTION
  | typeof actions.DELETE_SUBSCRIPTION
  | typeof actions.SET_THEME
  | typeof actions.STAR_REPO
  | typeof actions.UNSTAR_REPO
  | typeof actions.LOAD_SUBSCRIPTION_DATA_REQUEST
  | typeof actions.LOAD_SUBSCRIPTION_DATA_SUCCESS
  | typeof actions.LOAD_SUBSCRIPTION_DATA_FAILURE
;

export type Action<T> = {
  type: ActionType,
  payload: T,
};

export type ActionCreator = Function;

export type ActionCreators = {
  [key: string]: ActionCreator,
};

export type ApiRequestPayload = {
  params: Object,
  requestType: string,
  subscriptionId: string,
};

export type ApiResponsePayload = {
  request: ApiRequestPayload,
  data: Object,
  meta: Object,
  error?: ?Object,
};

export type LoginRequestPayload = {
  scopes: string,
};

export type LoginResponsePayload = {
  request: LoginRequestPayload,
  data: {
    accessToken: string,
  },
  error?: ?Object,
};
