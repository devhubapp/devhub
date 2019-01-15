import { darken, getLuminance, invert, lighten, rgba } from 'polished'

import { Theme } from '@devhub/core'

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

  const backgroundColorDarker08 = darken(0.08, color)
  const backgroundColorDarker16 = darken(0.16, color)
  const backgroundColorLighther08 = lighten(0.08, color)
  const backgroundColorLighther16 = lighten(0.16, color)

  const backgroundColorMore08 = isDark
    ? darken(0.08, color)
    : lighten(0.08, color)
  const backgroundColorMore16 = isDark
    ? darken(0.16, color)
    : lighten(0.16, color)

  const backgroundColorLess08 = isDark
    ? lighten(0.08, color)
    : darken(0.08, color)
  const backgroundColorLess16 = isDark
    ? lighten(0.16, color)
    : darken(0.16, color)

  const backgroundColorTransparent10 = rgba(backgroundColor, 0.1)
  const foregroundColor = isDark ? lighten(0.8, color) : darken(0.8, color)
  const foregroundColorMuted50 = isDark
    ? lighten(0.5, color)
    : darken(0.5, color)

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
    backgroundColorDarker16,
    backgroundColorLess08,
    backgroundColorLess16,
    backgroundColorLighther08,
    backgroundColorLighther16,
    backgroundColorMore08,
    backgroundColorMore16,
    backgroundColorTransparent10,
    foregroundColor,
    foregroundColorMuted50,
  })
}
