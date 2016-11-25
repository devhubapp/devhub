// @flow
/* eslint-disable import/prefer-default-export */

import warna from 'warna';

export function fade(color: string, opacity: number = 1) {
  const rgb = warna.parse(color).rgb;
  return `rgba(${rgb.red}, ${rgb.green}, ${rgb.blue}, ${opacity})`;
}
