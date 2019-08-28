import {
  darken,
  getLuminance,
  hsl,
  invert,
  lighten,
  parseToHsl,
  rgba,
  setLightness,
} from 'polished'

import { Theme, ThemeColors } from '../../types'
import { getStaticColors } from '../colors'

function createTheme(theme: Theme): Theme {
  return theme
}

export function createThemeFromColor(
  color: string,
  id: Theme['id'],
  displayName: Theme['displayName'],
  {
    invertedTheme,
    isInverted,
    override = {},
    tintColor,
  }: {
    invertedTheme?: Theme
    isInverted?: boolean
    override?: Partial<ThemeColors>
    tintColor?: string
  } = {},
): Theme {
  const luminance = getLuminance(color)
  const isDark = luminance <= 0.4

  let primaryBackgroundColor = '#49D3B4'
  let primaryForegroundColor = '#141C26'

  if (override) {
    if (override.primaryBackgroundColor)
      primaryBackgroundColor = override.primaryBackgroundColor

    if (override.primaryForegroundColor)
      primaryForegroundColor = override.primaryForegroundColor
    else if (override.primaryBackgroundColor) {
      primaryForegroundColor = isDark
        ? darken(0.05, color)
        : lighten(0.05, color)
    }
  }

  const colorHsl = parseToHsl(color)
  const tintHsl = parseToHsl(tintColor || color)

  const h = tintHsl.hue
  const s = tintHsl.saturation
  const l = colorHsl.lightness
  const backgroundColor = hsl(h, s, l)

  const backgroundColorDarker1 = hsl(h, s, Math.max(0, l - 0.05))
  const backgroundColorDarker2 = hsl(h, s, Math.max(0, l - 0.1))
  const backgroundColorDarker3 = hsl(h, s, Math.max(0, l - 0.2))
  const backgroundColorDarker4 = hsl(h, s, Math.max(0, l - 0.3))
  const backgroundColorDarker5 = hsl(h, s, Math.max(0, l - 0.5))

  const backgroundColorLighther1 = hsl(h, s, Math.min(l + 0.05, 1))
  const backgroundColorLighther2 = hsl(h, s, Math.min(l + 0.1, 1))
  const backgroundColorLighther3 = hsl(h, s, Math.min(l + 0.2, 1))
  const backgroundColorLighther4 = hsl(h, s, Math.min(l + 0.3, 1))
  const backgroundColorLighther5 = hsl(h, s, Math.min(l + 0.5, 1))

  const backgroundColorMore1 = isDark
    ? backgroundColorDarker1
    : backgroundColorLighther1
  const backgroundColorMore2 = isDark
    ? backgroundColorDarker2
    : backgroundColorLighther2
  const backgroundColorMore3 = isDark
    ? backgroundColorDarker3
    : backgroundColorLighther3
  const backgroundColorMore4 = isDark
    ? backgroundColorDarker4
    : backgroundColorLighther4
  const backgroundColorMore5 = isDark
    ? backgroundColorDarker5
    : backgroundColorLighther5

  const backgroundColorLess1 = !isDark
    ? backgroundColorDarker1
    : backgroundColorLighther1
  const backgroundColorLess2 = !isDark
    ? backgroundColorDarker2
    : backgroundColorLighther2
  const backgroundColorLess3 = !isDark
    ? backgroundColorDarker3
    : backgroundColorLighther3
  const backgroundColorLess4 = !isDark
    ? backgroundColorDarker4
    : backgroundColorLighther4
  const backgroundColorLess5 = !isDark
    ? backgroundColorDarker5
    : backgroundColorLighther5
  const backgroundColorTransparent05 = rgba(backgroundColor, 0.05)
  const backgroundColorTransparent10 = rgba(backgroundColor, 0.1)

  const foregroundColor = isDark
    ? setLightness(0.9, backgroundColorLess5)
    : setLightness(0.2, backgroundColorLess5)
  const foregroundColorMuted10 = isDark
    ? setLightness(0.1, foregroundColor)
    : setLightness(1 - 0.1, foregroundColor)
  const foregroundColorMuted25 = isDark
    ? setLightness(0.25, foregroundColor)
    : setLightness(1 - 0.25, foregroundColor)
  const foregroundColorMuted40 = isDark
    ? setLightness(0.4, foregroundColor)
    : setLightness(1 - 0.4, foregroundColor)
  const foregroundColorMuted65 = isDark
    ? setLightness(0.65, foregroundColor)
    : setLightness(1 - 0.65, foregroundColor)
  const foregroundColorTransparent05 = rgba(foregroundColor, 0.05)
  const foregroundColorTransparent10 = rgba(foregroundColor, 0.1)

  const theme = createTheme({
    id: id || 'custom',
    displayName: displayName || 'Custom',
    isDark,
    isInverted: typeof isInverted === 'boolean' ? isInverted : false,
    invert: () => {
      // implementation overriden below
      return theme
    },

    primaryBackgroundColor,
    primaryForegroundColor,

    backgroundColor,
    backgroundColorDarker1,
    backgroundColorDarker2,
    backgroundColorDarker3,
    backgroundColorDarker4,
    backgroundColorDarker5,
    backgroundColorLess1,
    backgroundColorLess2,
    backgroundColorLess3,
    backgroundColorLess4,
    backgroundColorLess5,
    backgroundColorLighther1,
    backgroundColorLighther2,
    backgroundColorLighther3,
    backgroundColorLighther4,
    backgroundColorLighther5,
    backgroundColorMore1,
    backgroundColorMore2,
    backgroundColorMore3,
    backgroundColorMore4,
    backgroundColorMore5,
    backgroundColorTransparent10,
    backgroundColorTransparent05,

    foregroundColor,
    foregroundColorMuted10,
    foregroundColorMuted25,
    foregroundColorMuted40,
    foregroundColorMuted65,
    foregroundColorTransparent05,
    foregroundColorTransparent10,

    ...getStaticColors({ isDark }),

    ...override,
  })

  const _t = theme as any
  if (invertedTheme) _t._invertedTheme = invertedTheme

  theme.invert = () => {
    if (!_t._invertedTheme) {
      _t._invertedTheme = createThemeFromColor(
        invert(color),
        'custom',
        `${displayName} (inverted)`,
        {
          override,
          isInverted: true,
          invertedTheme: theme,
        },
      )
    }

    return _t._invertedTheme
  }

  return theme
}
