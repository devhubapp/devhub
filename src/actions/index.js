// @flow

import { SET_THEME } from '../utils/constants/actions';
import { Theme } from '../utils/types';

const a = (type: string, payload: T): Action<T> => ({ type, payload });

export const setTheme = (theme: Theme) => a(SET_THEME, { theme });
