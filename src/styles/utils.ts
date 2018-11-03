import { Theme, ThemePair } from '../types/themes'
import * as constants from '../utils/constants'
import { isNight } from '../utils/helpers/shared'
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
  const _theme = theme || { id: constants.DEFAULT_THEME }

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
