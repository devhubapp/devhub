import _ from 'lodash'

import { Theme, ThemeColors } from '@devhub/core'
import { Platform } from '../../libs/platform'

export const themeColorFields: Array<keyof ThemeColors> = [
  'primaryBackgroundColor',
  'primaryForegroundColor',

  'backgroundColor',
  'backgroundColorDarker1',
  'backgroundColorDarker2',
  'backgroundColorDarker3',
  'backgroundColorDarker4',
  'backgroundColorLess1',
  'backgroundColorLess2',
  'backgroundColorLess3',
  'backgroundColorLess4',
  'backgroundColorLighther1',
  'backgroundColorLighther2',
  'backgroundColorLighther3',
  'backgroundColorLighther4',
  'backgroundColorMore1',
  'backgroundColorMore2',
  'backgroundColorMore3',
  'backgroundColorMore4',
  'backgroundColorTransparent10',

  'foregroundColor',
  'foregroundColorMuted25',
  'foregroundColorMuted50',

  'blue',
  'blueGray',
  'brown',
  'gray',
  'green',
  'lightRed',
  'orange',
  'pink',
  'purple',
  'red',
  'teal',
  'yellow',
]

export const pickThemeColors = (theme: Theme) => _.pick(theme, themeColorFields)

const _window = typeof window !== 'undefined' ? (window as any) : undefined
export const supportsCSSVariables =
  Platform.OS === 'web' &&
  _window &&
  _window.CSS &&
  _window.CSS.supports &&
  _window.CSS.supports('color', 'var(--fake-var)')

const cssVariablesTheme = {} as ThemeColors
themeColorFields.forEach(field => {
  cssVariablesTheme[field] = `var(--theme_${field})`
})

export function getCSSVariable(color: keyof ThemeColors) {
  if (color && typeof color === 'string' && color in cssVariablesTheme)
    return cssVariablesTheme[color]

  return color
}
