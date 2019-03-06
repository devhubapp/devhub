import { darken, getLuminance, invert, lighten, mix, rgba } from 'polished'

import { Theme } from '@devhub/core'
import * as colors from '../colors'

function createTheme(theme: Theme): Theme {
  return theme
}

export function createThemeFromColor(
  color: string,
  id: Theme['id'],
  displayName: Theme['displayName'],
  options: {
    primaryBackgroundColor?: string
    primaryForegroundColor?: string
  } = {},
): Theme {
  const {
    primaryBackgroundColor = colors.defaultBrandBackgroundColor,
    primaryForegroundColor = colors.defaultBrandForegroundColor,
  } = options

  const luminance = getLuminance(color)
  const isDark = luminance <= 0.5

  const backgroundColor = color

  const amount1 = luminance <= 0.02 ? 0.05 : 0.04
  const amount2 = 2 * amount1
  const amount3 = 3 * amount1
  const amount4 = 4 * amount1

  const backgroundColorDarker1 = darken(amount1, color)
  const backgroundColorDarker2 = darken(amount2, color)
  const backgroundColorDarker3 = darken(amount3, color)
  const backgroundColorDarker4 = darken(amount4, color)
  const backgroundColorLighther1 = lighten(amount1, color)
  const backgroundColorLighther2 = lighten(amount2, color)
  const backgroundColorLighther3 = lighten(amount3, color)
  const backgroundColorLighther4 = lighten(amount4, color)

  const backgroundColorMore1 = isDark
    ? darken(amount1, color)
    : lighten(amount1, color)
  const backgroundColorMore2 = isDark
    ? darken(amount2, color)
    : lighten(amount2, color)
  const backgroundColorMore3 = isDark
    ? darken(amount3, color)
    : lighten(amount3, color)
  const backgroundColorMore4 = isDark
    ? darken(amount4, color)
    : lighten(amount4, color)

  const backgroundColorLess1 = isDark
    ? lighten(amount1, color)
    : darken(amount1, color)
  const backgroundColorLess2 = isDark
    ? lighten(amount2, color)
    : darken(amount2, color)
  const backgroundColorLess3 = isDark
    ? lighten(amount3, color)
    : darken(amount3, color)
  const backgroundColorLess4 = isDark
    ? lighten(amount4, color)
    : darken(amount4, color)

  const backgroundColorTransparent10 = rgba(backgroundColor, 0.1)
  const foregroundColor = isDark ? lighten(0.95, color) : darken(0.95, color)
  const foregroundColorMuted20 = isDark
    ? lighten(0.2, color)
    : darken(0.2, color)
  const foregroundColorMuted50 = isDark
    ? lighten(0.6, color)
    : darken(0.6, color)

  let invertedTheme: Theme
  return createTheme({
    id: id || 'custom',
    displayName: displayName || 'Custom',
    isDark,
    invert: () => {
      if (invertedTheme) return invertedTheme

      invertedTheme = createThemeFromColor(
        invert(color),
        id,
        displayName,
        options,
      )
      return invertedTheme
    },
    primaryBackgroundColor,
    primaryForegroundColor,
    backgroundColor,
    backgroundColorDarker1,
    backgroundColorDarker2,
    backgroundColorDarker3,
    backgroundColorDarker4,
    backgroundColorLess1,
    backgroundColorLess2,
    backgroundColorLess3,
    backgroundColorLess4,
    backgroundColorLighther1,
    backgroundColorLighther2,
    backgroundColorLighther3,
    backgroundColorLighther4,
    backgroundColorMore1,
    backgroundColorMore2,
    backgroundColorMore3,
    backgroundColorMore4,
    backgroundColorTransparent10,
    foregroundColor,
    foregroundColorMuted20,
    foregroundColorMuted50,
  })
}
