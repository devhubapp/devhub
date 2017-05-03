import { Platform } from 'react-native';

import * as base from './base';
import { mutedOpacity } from '../variables';
import { fade } from '../../utils/helpers/color';

export const base00 = '#1c1c1c'; // page background
export const base01 = '#111111'; // card background -1
export const base02 = '#1c1c1c'; // card background 0
export const base03 = '#353535'; // card background +1
export const base04 = '#dddddd'; // color (to mute, use opacity 0.9 = #666666, #888888)
export const base05 = fade(base04, mutedOpacity); // muted color
export const base06 = '#ffffff'; // color high contrast
export const base07 = base.brand; // brand 1
export const base08 = base.brandSecondary; // brand 2
export const base09 = undefined; // unread card background
export const base0A = undefined;
export const base0B = undefined;
export const base0C = undefined;
export const base0D = undefined;
export const base0E = undefined;
export const base0F = undefined;

export const base16 = {
  base00,
  base01,
  base02,
  base03,
  base04,
  base05,
  base06,
  base07,
  base08,
  base09,
  base0A,
  base0B,
  base0C,
  base0D,
  base0E,
  base0F,
};

export const cardBackground = base03;
export const tabBarBackground = Platform.select({
  android: base01,
  default: base02,
});
export const statusBarBackground = Platform.select({
  android: tabBarBackground,
  default: base01,
});

export default {
  ...base,
  name: 'dark',
  isDark: true,
  ...base16,
  invert: () => require('./light').default, // eslint-disable-line global-require
  cardBackground,
  statusBarBackground,
  tabBarBackground,
};
