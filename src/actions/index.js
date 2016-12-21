// @flow
/* eslint-disable import/prefer-default-export */

import { Set } from 'immutable';

import {
  CLEAR_APP_DATA,
  CREATE_COLUMN,
  DELETE_COLUMN,
  SET_THEME,
  STAR_REPO,
  UNSTAR_REPO,
  TOGGLE_SEEN,
  CLEAR_EVENTS,
  MARK_EVENTS_AS_SEEN,
  MARK_EVENTS_AS_NOT_SEEN,
} from '../utils/constants/actions';

import { action } from '../utils/helpers/actions';
import type {
  Column,
  Theme,
} from '../utils/types';

export * from './api';
export * from './auth';
export * from './subscriptions';

export const clearAppData = (other?: Object) => (
  action(CLEAR_APP_DATA, undefined, other)
);

export const createColumn = (title: string, subscriptionIds: Array<string>, other?: Object) => (
  action(CREATE_COLUMN, ({ title, subscriptionIds }: Column), other)
);

export const deleteColumn = (id: string, other?: Object) => (
  action(DELETE_COLUMN, ({ id }: Column), other)
);

export const setTheme = (theme: Theme, other?: Object) => (
  action(SET_THEME, theme, other)
);

export const starRepo = (repoId: number | string, other?: Object) => (
  action(STAR_REPO, `${repoId}`, other)
);

export const unstarRepo = (repoId: number | string, other?: Object) => (
  action(UNSTAR_REPO, `${repoId}`, other)
);

export const toggleSeen = (eventIds: Array<string>, other?: Object) => (
  action(TOGGLE_SEEN, { eventIds: Set(eventIds) }, other)
);

export type SeenEvents = { columnId: string, eventIds: Array<string> };
export const clearEvents = ({ columnId, eventIds }: SeenEvents, other?: Object) => (
  action(CLEAR_EVENTS, { columnId, eventIds: Set(eventIds) }, other)
);

export const markEventsAsSeen = ({ columnId, eventIds }: SeenEvents, other?: Object) => (
  action(MARK_EVENTS_AS_SEEN, { columnId, eventIds: Set(eventIds) }, other)
);

export const markEventsAsUnseen = ({ columnId, eventIds }: SeenEvents, other?: Object) => (
  action(MARK_EVENTS_AS_NOT_SEEN, { columnId, eventIds: Set(eventIds) }, other)
);
