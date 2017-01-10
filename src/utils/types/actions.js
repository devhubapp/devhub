// @flow
/*  eslint-disable import/prefer-default-export */

import * as actions from '../constants/actions';

// app data
export type CLEAR_APP_DATA = typeof actions.CLEAR_APP_DATA;

// auth
export type LOGIN_REQUEST = typeof actions.LOGIN_REQUEST;
export type LOGIN_SUCCESS = typeof actions.LOGIN_SUCCESS;
export type LOGIN_FAILURE = typeof actions.LOGIN_FAILURE;
export type LOGOUT = typeof actions.LOGOUT;
export type UPDATE_CURRENT_USER = typeof actions.UPDATE_CURRENT_USER;

// columns
export type CREATE_COLUMN = typeof actions.CREATE_COLUMN;
export type UPDATE_COLUMN = typeof actions.UPDATE_COLUMN;
export type DELETE_COLUMN = typeof actions.DELETE_COLUMN;

// configs
export type SET_THEME = typeof actions.SET_THEME;

// events
export type ARCHIVE_EVENTS = typeof actions.ARCHIVE_EVENTS;
export type MARK_EVENTS_AS_READ = typeof actions.MARK_EVENTS_AS_READ;
export type MARK_EVENTS_AS_UNREAD = typeof actions.MARK_EVENTS_AS_UNREAD;

// notifications
export type LOAD_NOTIFICATIONS_REQUEST = typeof actions.LOAD_NOTIFICATIONS_REQUEST;
export type LOAD_NOTIFICATIONS_SUCCESS = typeof actions.LOAD_NOTIFICATIONS_SUCCESS;
export type LOAD_NOTIFICATIONS_FAILURE = typeof actions.LOAD_NOTIFICATIONS_FAILURE;

// repo
export type STAR_REPO = typeof actions.STAR_REPO;
export type UNSTAR_REPO = typeof actions.UNSTAR_REPO;

// subscriptions
export type CREATE_SUBSCRIPTION = typeof actions.CREATE_SUBSCRIPTION;
export type UPDATE_SUBSCRIPTION = typeof actions.UPDATE_SUBSCRIPTION;
export type DELETE_SUBSCRIPTION = typeof actions.DELETE_SUBSCRIPTION;
export type UPDATE_COLUMN_SUBSCRIPTIONS = typeof actions.UPDATE_COLUMN_SUBSCRIPTIONS;
export type UPDATE_ALL_COLUMNS_SUBSCRIPTIONS = typeof actions.UPDATE_ALL_COLUMNS_SUBSCRIPTIONS;
export type LOAD_SUBSCRIPTION_DATA_REQUEST = typeof actions.LOAD_SUBSCRIPTION_DATA_REQUEST;
export type LOAD_SUBSCRIPTION_DATA_SUCCESS = typeof actions.LOAD_SUBSCRIPTION_DATA_SUCCESS;
export type LOAD_SUBSCRIPTION_DATA_FAILURE = typeof actions.LOAD_SUBSCRIPTION_DATA_FAILURE;

export type ActionType =
  // app data
  | CLEAR_APP_DATA

  // auth
  | LOGIN_REQUEST
  | LOGIN_SUCCESS
  | LOGIN_FAILURE
  | LOGOUT
  | UPDATE_CURRENT_USER

  // columns
  | CREATE_COLUMN
  | UPDATE_COLUMN
  | DELETE_COLUMN

  // configs
  | SET_THEME

  // events
  | ARCHIVE_EVENTS
  | MARK_EVENTS_AS_READ
  | MARK_EVENTS_AS_UNREAD

  // notifications
  | LOAD_NOTIFICATIONS_REQUEST
  | LOAD_NOTIFICATIONS_SUCCESS
  | LOAD_NOTIFICATIONS_FAILURE

  // repo
  | STAR_REPO
  | UNSTAR_REPO

  // subscriptions
  | CREATE_SUBSCRIPTION
  | UPDATE_SUBSCRIPTION
  | DELETE_SUBSCRIPTION
  | UPDATE_COLUMN_SUBSCRIPTIONS
  | UPDATE_ALL_COLUMNS_SUBSCRIPTIONS
  | LOAD_SUBSCRIPTION_DATA_REQUEST
  | LOAD_SUBSCRIPTION_DATA_SUCCESS
  | LOAD_SUBSCRIPTION_DATA_FAILURE
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
    restored: boolean,
    uid?: string,
    providerId?: string,
    displayName?: string,
    email?: string,
    avatarURL?: string,
  },
  error?: ?Object,
};
