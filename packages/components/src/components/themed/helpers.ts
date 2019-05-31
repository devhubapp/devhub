import { ThemeColors } from '@devhub/core'
import { getCSSVariable, supportsCSSVariables } from '../../utils/helpers/theme'

export function getThemeColorOrItself(
  theme: ThemeColors,
  color:
    | keyof ThemeColors
    | ((theme: ThemeColors) => string | undefined)
    | string
    | undefined,
  { enableCSSVariable = false } = {},
) {
  const _color = typeof color === 'function' ? color(theme) : color

  if (_color && typeof _color === 'string' && _color in theme)
    return enableCSSVariable && supportsCSSVariables
      ? getCSSVariable(_color as keyof ThemeColors)
      : theme[_color as keyof ThemeColors]

  return _color
}
