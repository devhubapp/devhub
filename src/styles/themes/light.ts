import { Platform } from 'react-native'

import { ITheme } from '../../types'
import { fade, lighten } from '../../utils/helpers/color'
import { mutedOpacity } from '../variables'
import * as base from './base'

export const base00 = '#ffffff' // page background
export const base01 = '#ededed' // card background -1
export const base02 = '#ffffff' // card background 0
export const base03 = '#f0f0f0' // card background +1
export const base04 = '#222222' // color
export const base05 = lighten('#222222', mutedOpacity).hex // muted color
export const base06 = '#000000' // color high contrast
export const base07 = base.brand // brand 1
export const base08 = base.brandSecondary // brand 2
export const base09 = fade(base04, 0.05) // image background when loading
export const base0A = undefined
export const base0B = undefined
export const base0C = undefined
export const base0D = undefined
export const base0E = undefined
export const base0F = undefined

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
}

export const cardBackground = base02
export const tabBarBackground = base02
export const statusBarBackground = Platform.select({
  android: tabBarBackground,
  default: base01,
})

export default {
  ...base,
  ...base16,
  cardBackground,
  statusBarBackground,
  tabBarBackground,
  invert: () => require('./dark').default, // tslint:disable-line
  isDark: false,
  name: 'light',
} as ITheme
