// @flow
/* eslint-disable import/prefer-default-export */

import {
  SET_THEME,
  LOAD_USER_FEED_REQUEST,
  LOAD_USER_FEED_SUCCESS,
  LOAD_USER_FEED_FAILURE,
} from '../utils/constants/actions';

import { action, errorAction } from '../utils/helpers/actions';
import type { Theme } from '../utils/types';

export const setTheme = (theme: Theme) => action(SET_THEME, theme);

export const loadUserFeedRequest = (username: string) => (
  action(LOAD_USER_FEED_REQUEST, { username })
);

export const loadUserFeedSuccess = (username: string, data: any, meta: Object) => (
  action(LOAD_USER_FEED_SUCCESS, { username, data, meta })
);

export const loadUserFeedFailure = (error: any) => errorAction(LOAD_USER_FEED_FAILURE, error);
