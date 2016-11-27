// @flow
/* eslint-disable import/prefer-default-export */

import {
  SET_THEME,
  LOAD_FEED_REQUEST,
} from '../utils/constants/actions';

import { action } from '../utils/helpers/actions';
import type { Theme } from '../utils/types';

export const setTheme = (theme: Theme) => action(SET_THEME, theme);
export const loadFeedRequest = () => action(LOAD_FEED_REQUEST);
