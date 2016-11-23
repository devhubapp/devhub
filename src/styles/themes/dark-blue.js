import warna from 'warna';

import base from './base';

export const base16 = {
  base00: '#141d26', // page background
  base01: '#141d26', // card background -1
  base02: '#1b2836', // card background 0
  base03: '#243447', // card background +1
  base04: '#ffffff', // color (to mute, use opacity 0.9 = #666666, #888888)
  base05: warna.darken('#ffffff', 0.6).hex, // muted color
  base06: undefined, //
  base07: base.brandSecondary, // brand 1
  base08: base.brand, // brand 2
  base09: undefined,
  base0A: undefined,
  base0B: undefined,
  base0C: undefined,
  base0D: undefined,
  base0E: undefined,
  base0F: undefined,
};

export default {
  ...base,
  theme: 'dark-blue',
  isDark: true,
  ...base16,
};
