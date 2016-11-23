// @flow
/* eslint-disable import/prefer-default-export */

import themes, { DARK_THEME, LIGHT_THEME } from '../../styles/themes';
import type { Theme } from '../types';

export function isNight() {
  const hours = (new Date()).getHours();
  return hours >= 18 || hours <= 6;
}

export function loadTheme(theme: Theme) {
  if (theme && themes[theme]) return themes[theme];
  return isNight() ? DARK_THEME : LIGHT_THEME;
}
