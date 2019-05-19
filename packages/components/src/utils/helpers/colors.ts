import { darken, getLuminance, lighten } from 'polished'

import { Platform } from '../../libs/platform'

export function computeThemeColor(color: string) {
  return Platform.OS === 'web' && color && color.includes('var(--')
    ? typeof getComputedStyle === 'function'
      ? getComputedStyle(document.body)
          .getPropertyValue(color.replace(/var\((.+)\)$/, '$1'))
          .trim()
      : undefined
    : color
}

export function getLuminanceDifference(colorA: string, colorB: string) {
  return getLuminance(colorA) - getLuminance(colorB)
}

export function getReadableColor(
  color: string,
  backgroundColor: string,
  minimumContrastRatio = 0.4,
) {
  if (!(color && backgroundColor && minimumContrastRatio > 0)) return color

  const luminanceDiff = getLuminanceDifference(color, backgroundColor)
  const luminanceDiffAbs = Math.abs(luminanceDiff)
  if (luminanceDiffAbs >= minimumContrastRatio) return color

  const isDark = getLuminance(backgroundColor) <= 0.4
  return isDark
    ? lighten(Math.abs(minimumContrastRatio - luminanceDiffAbs), color)
    : darken(Math.abs(minimumContrastRatio - luminanceDiffAbs), color)
}
