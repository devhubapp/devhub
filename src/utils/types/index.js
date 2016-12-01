// @flow

import { ApiRequestType } from '../../api/github';

export * from './actions';
export * from './github';

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

export type Config = {
  theme: Theme,
};

export type Normalized<T> = {
  [key: string]: T
};

export type Subscription = {
  id: string,
  requestType: ApiRequestType,
  params: Object,
};

export type Column = {
  id: string,
  title: string,
  events: Array<string>,
  subscriptions: Array<Subscription>,
};

export type State = {
  config: Config,
  entities: {
    columns: Normalized<Column>,
    comments: Object,
    events: Object,
    issues: Object,
    orgs: Object,
    pullRequests: Object,
    repos: Object,
    users: Object,
  },
};
