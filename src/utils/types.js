// @flow

export type Theme = 'auto' | 'light' | 'dark';

export type Action<T> = {
  type: string,
  payload: T,
};

export type Config = {
  theme: Theme,
};

export type State = {
  config: Config,
};
