import * as base from './base';
import { lighten } from '../../utils/helpers/color';

export const base00 = '#f0f0f0'; // page background
export const base01 = '#ededed'; // card background -1
export const base02 = '#ffffff'; // card background 0
export const base03 = '#f7f7f5'; // card background +1
export const base04 = '#222222'; // color
export const base05 = lighten('#222222', 0.6).hex; // muted color
export const base06 = undefined; //
export const base07 = base.brand; // brand 1
export const base08 = base.brandSecondary; // brand 2
export const base09 = undefined;
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

export default {
  ...base,
  name: 'light',
  isDark: false,
  ...base16,
  invert: () => require('./dark').default, // eslint-disable-line global-require
  cardBackground: base02,
};
