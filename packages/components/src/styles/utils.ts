import { constants, isNight, Theme, ThemePair } from '@devhub/core'
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
