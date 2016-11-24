// @flow
/* eslint-disable import/prefer-default-export */

import moment from 'moment';

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

export function getDateSmallText(date) {
  if (!date) return '';

  const momentDate = moment(date);
  if (!momentDate.isValid()) return '';

  const momentNow = moment(new Date());
  const daysDiff = momentNow.diff(momentDate, 'days');
  const hoursDiff = momentNow.diff(momentDate, 'hours');
  const minutesDiff = momentNow.diff(momentDate, 'minutes');

  if (daysDiff < 1) {
    if (hoursDiff < 1) {
      if (minutesDiff < 1) return 'now';
      return `${minutesDiff}m`
    }

    return `${hoursDiff}h`
  } else if (daysDiff <= 3) {
    return `${daysDiff}d`
  } else {
    momentDate.format('l');
  }

  // if (daysDiff < 300) return momentDate.format('MMM Do h:mm').toLowerCase();
  // return momentDate.format('ll').toLowerCase();
}
