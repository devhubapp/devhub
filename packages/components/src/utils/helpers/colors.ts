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
