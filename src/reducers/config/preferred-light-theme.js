// @flow

import { SET_THEME } from '../../utils/constants/actions';
import { loadTheme } from '../../utils/helpers';
import type { Action, Theme } from '../../utils/types';

export default (state: Theme = '', { type, payload }: Action<Theme>): Theme => {
  switch (type) {
    case SET_THEME:
      return ((themeName) => {
        const theme = loadTheme(themeName);
        if (!theme.isDark && theme.name && theme.name === payload) {
          return theme.name;
        }

        return state;
      })(payload);

    default:
      return state;
  }
};
