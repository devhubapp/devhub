// @flow
/* eslint-disable import/prefer-default-export */

import moment from 'moment';
import { List } from 'immutable';

import themes, { DARK_THEME, LIGHT_THEME } from '../../styles/themes';
import { AUTO_THEME, DEFAULT_THEME } from '../constants/defaults';
import type { Theme } from '../types';

// export * from './actions';
// export * from './color';
// export * from './github';

export function guid() {
  const str4 = () =>
    (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line no-bitwise, max-len
  return `${str4() + str4()}-${str4()}-${str4()}-${str4()}-${str4()}${str4()}${str4()}`;
}

export function isNight() {
  const hours = new Date().getHours();
  return hours >= 18 || hours <= 6;
}

export function loadTheme(
  theme?: Theme,
  preferredDarkTheme?: ?Theme = null,
  preferredLightTheme?: ?Theme = null,
): Object {
  const _theme = theme || DEFAULT_THEME;
  const exists = _theme && themes[_theme];

  if (!exists || _theme === AUTO_THEME) {
    const darkTheme = themes[preferredDarkTheme] || DARK_THEME;
    const lightTheme = themes[preferredLightTheme] || LIGHT_THEME;
    return isNight() ? darkTheme : lightTheme;
  }

  return themes[_theme];
}

export function trimNewLinesAndSpaces(text: string, maxLength?: number = 100) {
  if (!text || typeof text !== 'string') return '';

  let newText = text.replace(/\s+/g, ' ').trim();
  if (maxLength > 0 && newText.length > maxLength) {
    newText = `${newText.substr(0, maxLength).trim()}...`;
  }

  return newText;
}

// export function getDateFromNowText(date) {
//   if (!date) return '';
//
//   const momentDate = moment(date);
//   if (!momentDate.isValid()) return '';
//   // return `${moment(new Date()).diff(momentDate, 'seconds')}s`;
//
//   return momentDate.fromNow();
// }

export function getDateWithHourAndMinuteText(date: Date) {
  if (!date) return '';

  const momentDate = moment(date);
  if (!momentDate.isValid()) return '';

  const momentNow = moment(new Date());
  const timeText = momentDate.format('HH:mm');
  const daysDiff = momentNow.diff(momentDate, 'days');

  if (daysDiff < 1) return timeText;

  const dateText = momentDate.format('MMM Do').toLowerCase();
  return `${dateText} ${timeText}`;
}

export function getDateSmallText(date: Date) {
  // , separator = '•'
  if (!date) return '';

  const momentDate = moment(date);
  if (!momentDate.isValid()) return '';
  // return `${moment(new Date()).diff(momentDate, 'seconds')}s`;

  const momentNow = moment(new Date());
  const daysDiff = momentNow.diff(momentDate, 'days');
  const timeText = momentDate.format('HH:mm');

  if (daysDiff < 1) {
    const hoursDiff = momentNow.diff(momentDate, 'hours');

    if (hoursDiff < 1) {
      const minutesDiff = momentNow.diff(momentDate, 'minutes');

      if (minutesDiff < 1) {
        const secondsDiff = momentNow.diff(momentDate, 'seconds');
        if (secondsDiff < 10) {
          return 'now';
        }

        return `${secondsDiff}s`;
      }

      // if (minutesDiff < 30) {
      //   return `${minutesDiff}m`;
      // }

      return `${minutesDiff}m (${timeText})`;
    }

    return `${hoursDiff}h (${timeText})`;
  } else if (daysDiff <= 3) {
    return `${daysDiff}d (${timeText})`;
  }

  return momentDate.format('MMM Do').toLowerCase();
}

export function dateToHeaderFormat(date: Date | string): string {
  const _date = typeof date === 'string' ? new Date(date) : date;
  return moment(_date)
    .utc()
    .format('ddd, DD MMM YYYY HH:mm:ss z')
    .replace('UTC', 'GMT');
}

export function arrayOfIdsToMergeableMap(ids: Array<string>, newValue: any) {
  return List(ids)
    .filter(Boolean)
    .toMap()
    .mapKeys((key, value) => value.toString())
    .map(() => newValue);
}
