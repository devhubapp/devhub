// @flow
/* eslint-disable import/prefer-default-export */

import {
  CLEAR_APP_DATA,
  CREATE_COLUMN,
  DELETE_COLUMN,
  SET_THEME,
  STAR_REPO,
  UNSTAR_REPO,
} from '../utils/constants/actions';

import { action } from '../utils/helpers/actions';

import type {
  Column,
  Theme,
} from '../utils/types';

export * from './auth';
export * from './events';
export * from './notifications';
export * from './subscriptions';

export const clearAppData = (other?: Object) => (
  action(CLEAR_APP_DATA, undefined, other)
);

// COLUMN

export const createColumn = (title: string, subscriptionIds: Array<string>, other?: Object) => (
  action(CREATE_COLUMN, ({ title, subscriptionIds }: Column), other)
);

export const deleteColumn = (id: string, other?: Object) => (
  action(DELETE_COLUMN, ({ id }: Column), other)
);

// THEME

export const setTheme = (theme: Theme, other?: Object) => (
  action(SET_THEME, theme, other)
);

// STAR

export const starRepo = ({ repoId, repoFullName }, other?: Object) => (
  action(STAR_REPO, { repoId: `${repoId}`, repoFullName }, other)
);

export const unstarRepo = ({ repoId, repoFullName }, other?: Object) => (
  action(UNSTAR_REPO, { repoId: `${repoId}`, repoFullName }, other)
);
