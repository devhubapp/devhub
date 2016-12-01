import base from './base';

export const base00 = '#141d26'; // page background
export const base01 = '#141d26'; // card background -1
export const base02 = '#1b2836'; // card background 0
export const base03 = '#243447'; // card background +1
export const base04 = '#dddddd'; // color (to mute, use opacity 0.9 = #666666, #888888)
export const base05 = '#6b7d8c'; // muted color
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
  theme: 'dark-blue',
  isDark: true,
  ...base16,
};
