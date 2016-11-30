// @flow
/* eslint-disable import/prefer-default-export */

import {
  CREATE_COLUMN,
  SET_THEME,
  STAR_REPO,
  UNSTAR_REPO,
  LOAD_USER_FEED_REQUEST,
  LOAD_USER_FEED_SUCCESS,
  LOAD_USER_FEED_FAILURE,
} from '../utils/constants/actions';

import { action, errorAction } from '../utils/helpers/actions';
import type { Column, Theme, ApiRequestPayload, ApiResponsePayload } from '../utils/types';

export const createColumn = (title: string, subscriptions: ?Array<string>) => (
  action(CREATE_COLUMN, ({ title, subscriptions }: Column))
);

export const setTheme = (theme: Theme) => action(SET_THEME, theme);
export const starRepo = (repoFullName: string) => action(STAR_REPO, repoFullName);
export const unstarRepo = (repoFullName: string) => action(UNSTAR_REPO, repoFullName);

export const loadUserFeedRequest = (username: string) => (
  action(LOAD_USER_FEED_REQUEST, ({
    path: `/users/${username}/received_events`,
    params: {
      username,
    },
  }: ApiRequestPayload))
);

export const loadUserFeedSuccess = (request: ApiRequestPayload, data: Object, meta: Object) => (
  action(LOAD_USER_FEED_SUCCESS, ({ request, data, meta }: ApiResponsePayload))
);

export const loadUserFeedFailure = (request: ApiRequestPayload, error: any) => (
  errorAction(LOAD_USER_FEED_FAILURE, error)
);
