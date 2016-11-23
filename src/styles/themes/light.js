import warna from 'warna';

import base from './base';

export const base16 = {
  base00: '#f7f7f5', // page background
  base01: '#ededed', // card background -1
  base02: '#ffffff', // card background 0
  base03: '#f7f7f5', // card background +1
  base04: '#222222', // color
  base05: warna.lighten('#222222', 0.6).hex, // muted color
  base06: undefined, //
  base07: base.brand, // brand 1
  base08: base.brandSecondary, // brand 2
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
  theme: 'light',
  isDark: false,
  ...base16,
};
