// @flow

import { SET_THEME } from '../../utils/constants/actions';
import type { Action, Theme } from '../../utils/types';

export default (state: Theme = '', { type, payload }: Action<Theme>): Theme => {
  switch (type) {
    case SET_THEME:
      return payload;

    default:
      return state;
  }
};
