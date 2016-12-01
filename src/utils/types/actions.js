// @flow
/*  eslint-disable import/prefer-default-export */

export type CREATE_COLUMN = 'CREATE_COLUMN';
export type UPDATE_COLUMN = 'UPDATE_COLUMN';
export type DELETE_COLUMN = 'DELETE_COLUMN';
export type SET_THEME = 'SET_THEME';
export type STAR_REPO = 'STAR_REPO';
export type UNSTAR_REPO = 'UNSTAR_REPO';
export type LOAD_USER_FEED_REQUEST = 'LOAD_USER_FEED_REQUEST';
export type LOAD_USER_FEED_SUCCESS = 'LOAD_USER_FEED_SUCCESS';
export type LOAD_USER_FEED_FAILURE = 'LOAD_USER_FEED_FAILURE';

export type ActionType =
  | CREATE_COLUMN
  | UPDATE_COLUMN
  | DELETE_COLUMN
  | SET_THEME
  | STAR_REPO
  | UNSTAR_REPO
  | LOAD_USER_FEED_REQUEST
  | LOAD_USER_FEED_SUCCESS
  | LOAD_USER_FEED_FAILURE
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
  path: string,
  params: Object,
};

export type ApiResponsePayload = {
  request: ApiRequestPayload,
  data: Object,
  meta: Object,
};
