import { Theme, ThemePair } from '../types/themes'
import { isNight } from '../utils/helpers/shared'
import { themes } from './themes'
import { createThemeFromColor } from './themes/custom'
import { defaultThemeName } from './variables'

export function loadCustomTheme(color: string) {
  return createThemeFromColor(color)
}

export function loadTheme(
  theme?: ThemePair,
  preferredDarkTheme?: ThemePair,
  preferredLightTheme?: ThemePair,
): Theme {
  const _theme = theme || { name: defaultThemeName }

  if (_theme.name === 'custom' && _theme.color) {
    return loadCustomTheme(_theme.color)
  }

  if (_theme.name === 'auto' || !_theme.name) {
    const _preferredDarkTheme = preferredDarkTheme
      ? preferredDarkTheme.name === 'custom' && preferredDarkTheme.color
        ? loadCustomTheme(preferredDarkTheme.color)
        : themes[preferredDarkTheme.name]
      : undefined

    const _preferredLightTheme = preferredLightTheme
      ? preferredLightTheme.name === 'custom' && preferredLightTheme.color
        ? loadCustomTheme(preferredLightTheme.color)
        : themes[preferredLightTheme.name]
      : undefined

    const darkTheme: Theme = _preferredDarkTheme || themes['dark-gray']!
    const lightTheme: Theme = _preferredLightTheme || themes['light-gray']!

    return isNight() ? darkTheme : lightTheme
  }

  return (
    themes[_theme.name] ||
    loadTheme(
      { name: 'auto', color: _theme.color },
      preferredDarkTheme,
      preferredLightTheme,
    )
  )
}
