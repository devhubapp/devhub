/**
 * @flow
 */

import type { SET_THEME } from './actions';

export type Theme = 'auto' | 'light' | 'dark' | 'dark-blue';

export type ThemeObject = {
  base00: string,
  base01: string,
  base02: string,
  base03: string,
  base04: string,
  base05: string,
  base06: ?string,
  base07: string,
  base08: string,
  base09: ?string,
  base0A: ?string,
  base0B: ?string,
  base0C: ?string,
  base0D: ?string,
  base0E: ?string,
  base0F: ?string,
};

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
