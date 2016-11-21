// @flow
/* eslint-disable import/prefer-default-export */

import { DARK_THEME, DARK_BLUE_THEME, LIGHT_THEME } from '../../themes';
import type { Theme } from '../types';

export function isNight() {
  const hours = (new Date()).getHours();
  return hours >= 18 || hours <= 6;
}

export function loadTheme(theme: Theme) {
  switch (theme) {
    case 'dark': return DARK_THEME;
    case 'dark-blue': return DARK_BLUE_THEME;
    case 'light': return LIGHT_THEME;
    default: return isNight() ? DARK_THEME : LIGHT_THEME;
  }
}
