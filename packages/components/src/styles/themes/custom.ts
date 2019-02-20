import { darken, getLuminance, invert, lighten, mix, rgba } from 'polished'

import { Theme } from '@devhub/core'
import * as colors from '../colors'

function _mixWithBrand(
  primaryBackgroundColor: string,
  color: string,
  weight: number = 0.01,
) {
  return mix(weight, primaryBackgroundColor, color)
}

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

  const amount1 = 0.02
  const amount2 = 2 * amount1
  const amount3 = 3 * amount1
  const amount4 = 4 * amount1

  const mixWithBrand = _mixWithBrand.bind(null, primaryBackgroundColor)

  const backgroundColorDarker1 = mixWithBrand(darken(amount1, color))
  const backgroundColorDarker2 = mixWithBrand(darken(amount2, color))
  const backgroundColorDarker3 = mixWithBrand(darken(amount3, color))
  const backgroundColorDarker4 = mixWithBrand(darken(amount4, color))
  const backgroundColorLighther1 = mixWithBrand(lighten(amount1, color))
  const backgroundColorLighther2 = mixWithBrand(lighten(amount2, color))
  const backgroundColorLighther3 = mixWithBrand(lighten(amount3, color))
  const backgroundColorLighther4 = mixWithBrand(lighten(amount4, color))

  const backgroundColorMore1 = mixWithBrand(
    isDark ? darken(amount1, color) : lighten(amount1, color),
  )
  const backgroundColorMore2 = mixWithBrand(
    isDark ? darken(amount2, color) : lighten(amount2, color),
  )
  const backgroundColorMore3 = mixWithBrand(
    isDark ? darken(amount3, color) : lighten(amount3, color),
  )
  const backgroundColorMore4 = mixWithBrand(
    isDark ? darken(amount4, color) : lighten(amount4, color),
  )

  const backgroundColorLess1 = mixWithBrand(
    isDark ? lighten(amount1, color) : darken(amount1, color),
  )
  const backgroundColorLess2 = mixWithBrand(
    isDark ? lighten(amount2, color) : darken(amount2, color),
  )
  const backgroundColorLess3 = mixWithBrand(
    isDark ? lighten(amount3, color) : darken(amount3, color),
  )
  const backgroundColorLess4 = mixWithBrand(
    isDark ? lighten(amount4, color) : darken(amount4, color),
  )

  const backgroundColorTransparent10 = rgba(backgroundColor, 0.1)
  const foregroundColor = isDark ? lighten(0.75, color) : darken(0.75, color)
  const foregroundColorMuted20 = mixWithBrand(
    isDark ? lighten(0.2, color) : darken(0.2, color),
  )
  const foregroundColorMuted50 = mixWithBrand(
    isDark ? lighten(0.5, color) : darken(0.5, color),
  )

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
