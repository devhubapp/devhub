import { Theme, ThemePair } from '../types/themes'
import { isNight } from '../utils/helpers/shared'
import { themes } from './themes'
import { createThemeFromColor } from './themes/custom'
import { defaultThemeName } from './variables'

export function loadCustomTheme(color: string) {
  return createThemeFromColor(color, 'custom', 'Custom')
}

export function loadTheme(
  theme?: ThemePair,
  preferredDarkTheme?: ThemePair,
  preferredLightTheme?: ThemePair,
): Theme {
  const _theme = theme || { id: defaultThemeName }

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

    const darkTheme: Theme = _preferredDarkTheme || themes['dark-gray']!
    const lightTheme: Theme = _preferredLightTheme || themes['light-gray']!

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
