// @flow

import type { SET_THEME } from './actions';

export type Theme = 'auto' | 'light' | 'dark';

export type ActionType =
  | SET_THEME
;

export type Action<T> = {
  type: ActionType,
  payload: T,
};

export type Config = {
  theme: Theme,
};

export type State = {
  config: Config,
};
