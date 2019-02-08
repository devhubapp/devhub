import { getLuminance } from 'polished'

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
