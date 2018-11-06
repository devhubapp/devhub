import { darken, getLuminance, invert, lighten, rgba } from 'polished'

import { Theme } from '../../types/themes'

function createTheme(theme: Theme): Theme {
  return theme
}

export function createThemeFromColor(
  color: string,
  id: Theme['id'],
  displayName: Theme['displayName'],
): Theme {
  const luminance = getLuminance(color)
  const isDark = luminance <= 0.5

  const backgroundColor = color
  const backgroundColorDarker08 =
    luminance <= 0.02 ? lighten(0.08, color) : darken(0.08, color)
  const backgroundColorLighther08 =
    luminance >= 0.95 ? darken(0.08, color) : lighten(0.08, color)
  const backgroundColorMore08 = isDark
    ? backgroundColorDarker08
    : backgroundColorLighther08
  const backgroundColorLess08 = isDark
    ? backgroundColorLighther08
    : backgroundColorDarker08
  const backgroundColorTransparent10 = rgba(backgroundColor, 0.1)
  const foregroundColor = isDark ? lighten(0.8, color) : darken(0.8, color)
  const foregroundColorMuted50 = isDark
    ? lighten(0.5, color)
    : darken(0.5, color)
  const foregroundColorTransparent50 = rgba(foregroundColor, 0.5)
  const foregroundColorTransparent80 = rgba(foregroundColor, 0.8)

  let invertedTheme: Theme
  return createTheme({
    id: id || 'custom',
    displayName: displayName || 'Custom',
    isDark,
    invert: () => {
      if (invertedTheme) return invertedTheme

      invertedTheme = createThemeFromColor(invert(color), id, displayName)
      return invertedTheme
    },
    backgroundColor,
    backgroundColorDarker08,
    backgroundColorLess08,
    backgroundColorLighther08,
    backgroundColorMore08,
    backgroundColorTransparent10,
    foregroundColor,
    foregroundColorMuted50,
    foregroundColorTransparent50,
    foregroundColorTransparent80,
  })
}
