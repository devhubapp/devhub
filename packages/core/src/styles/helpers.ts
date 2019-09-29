import _ from 'lodash'

import { isNight } from '../helpers'
import {
  StaticThemeColors,
  Theme,
  ThemeColors,
  ThemePair,
  ThemeTransformer,
} from '../types'
import { constants } from '../utils'
import { themes } from './themes'
import { createThemeFromColor } from './themes/custom'

export function loadCustomTheme(color: string) {
  return createThemeFromColor(color, 'custom', 'Custom')
}

export function loadTheme(
  theme?: ThemePair,
  preferredDarkTheme?: ThemePair,
  preferredLightTheme?: ThemePair,
): Theme {
  const _theme = theme || constants.DEFAULT_THEME_PAIR

  if (_theme.id === 'custom' && _theme.color) {
    return loadCustomTheme(_theme.color)
  }

  if (_theme.id === 'auto' || !_theme.id) {
    const _preferredDarkTheme = preferredDarkTheme
      ? preferredDarkTheme.id === 'custom' && preferredDarkTheme.color
        ? loadCustomTheme(preferredDarkTheme.color)
        : themes[preferredDarkTheme.id]
      : undefined

    const _preferredLightTheme = preferredLightTheme
      ? preferredLightTheme.id === 'custom' && preferredLightTheme.color
        ? loadCustomTheme(preferredLightTheme.color)
        : themes[preferredLightTheme.id]
      : undefined

    const darkTheme: Theme =
      _preferredDarkTheme || themes[constants.DEFAULT_DARK_THEME]!
    const lightTheme: Theme =
      _preferredLightTheme || themes[constants.DEFAULT_LIGHT_THEME]!

    return isNight() ? darkTheme : lightTheme
  }

  return (
    themes[_theme.id] ||
    loadTheme(
      { id: 'auto', color: _theme.color },
      preferredDarkTheme,
      preferredLightTheme,
    )
  )
}

export const defaultTheme = loadTheme(constants.DEFAULT_THEME_PAIR)

export const staticColorFields: Array<keyof StaticThemeColors> = [
  'black',
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
  'white',
  'yellow',
]

export const themeColorFields: Array<keyof ThemeColors> = [
  'primaryBackgroundColor',
  'primaryForegroundColor',

  'backgroundColor',
  'backgroundColorDarker1',
  'backgroundColorDarker2',
  'backgroundColorDarker3',
  'backgroundColorDarker4',
  'backgroundColorDarker5',
  'backgroundColorLess1',
  'backgroundColorLess2',
  'backgroundColorLess3',
  'backgroundColorLess4',
  'backgroundColorLess5',
  'backgroundColorLighther1',
  'backgroundColorLighther2',
  'backgroundColorLighther3',
  'backgroundColorLighther4',
  'backgroundColorLighther5',
  'backgroundColorMore1',
  'backgroundColorMore2',
  'backgroundColorMore3',
  'backgroundColorMore4',
  'backgroundColorMore5',
  'backgroundColorTransparent05',
  'backgroundColorTransparent10',
  'backgroundColorTintedRed',

  'foregroundColor',
  'foregroundColorMuted10',
  'foregroundColorMuted25',
  'foregroundColorMuted40',
  'foregroundColorMuted65',
  'foregroundColorTransparent05',
  'foregroundColorTransparent10',

  ...staticColorFields,
]

export const pickThemeColors = (theme: Theme) => _.pick(theme, themeColorFields)

const cssVariablesTheme = {} as Record<string, string>
themeColorFields.forEach(field => {
  cssVariablesTheme[field] = `var(--theme-${_.kebabCase(field)})`
  cssVariablesTheme[`inverted-${field}`] = `var(--theme-inverted-${_.kebabCase(
    field,
  )})`
})

export function getCSSVariable(color: keyof ThemeColors, isInverted?: boolean) {
  const field =
    color && typeof color === 'string'
      ? isInverted
        ? `inverted-${color}`
        : color
      : undefined

  if (field && field in cssVariablesTheme) return cssVariablesTheme[field]

  return color
}

export function transformTheme(
  theme: Theme,
  themeTransformer: ThemeTransformer,
) {
  if (
    themeTransformer === 'invert' ||
    (themeTransformer === 'force-dark' && !theme.isDark) ||
    (themeTransformer === 'force-light' && theme.isDark)
  ) {
    return theme.invert()
  }

  return theme
}
