import { darken, getLuminance, invert, lighten, rgba } from 'polished'

import { createTheme, Theme } from '../utils'

export function createThemeFromColor(
  color: string,
  name: Theme['name'] = 'custom',
): Theme {
  const luminance = getLuminance(color)
  const isDark = luminance <= 0.5

  const backgroundColor = color
  const backgroundColor1 =
    luminance >= 0.8 ? lighten(0.08, color) : darken(0.08, color)
  const backgroundColor2 =
    luminance >= 0.8 ? darken(0.08, color) : lighten(0.08, color)
  const backgroundColorTransparent10 = rgba(backgroundColor, 0.1)
  const foregroundColor = isDark ? lighten(0.8, color) : darken(0.8, color)
  const foregroundColorMuted50 = isDark
    ? lighten(0.4, color)
    : darken(0.4, color)
  const foregroundColorTransparent50 = rgba(foregroundColor, 0.5)

  let invertedTheme: Theme
  return createTheme({
    name,
    isDark,
    invert: () => {
      if (invertedTheme) return invertedTheme

      invertedTheme = createThemeFromColor(invert(color))
      return invertedTheme
    },
    backgroundColor,
    backgroundColor1,
    backgroundColor2,
    backgroundColorTransparent10,
    foregroundColor,
    foregroundColorMuted50,
    foregroundColorTransparent50,
  })
}
