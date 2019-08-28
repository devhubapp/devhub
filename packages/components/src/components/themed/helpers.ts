import { getCSSVariable, Theme, ThemeColors } from '@devhub/core'
import { supportsCSSVariables } from '../../utils/helpers/theme'

export function getThemeColorOrItself(
  theme: ThemeColors & { isDark: boolean | 0 | 1; isInverted: boolean | 0 | 1 },
  color:
    | keyof ThemeColors
    | ((theme: Theme) => string | undefined)
    | string
    | undefined
    | null,
  { enableCSSVariable = false } = {},
) {
  const _color = typeof color === 'function' ? color(theme as any) : color

  if (_color && typeof _color === 'string' && _color in theme)
    return enableCSSVariable && supportsCSSVariables
      ? getCSSVariable(_color as keyof ThemeColors, !!theme.isInverted)
      : theme[_color as keyof ThemeColors]

  return _color || undefined
}
