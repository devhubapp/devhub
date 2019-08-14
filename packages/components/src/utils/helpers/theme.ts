import { Platform } from '../../libs/platform'

const _window = typeof window !== 'undefined' ? (window as any) : undefined
export const supportsCSSVariables =
  Platform.OS === 'web' &&
  _window &&
  _window.CSS &&
  _window.CSS.supports &&
  _window.CSS.supports('color', 'var(--fake-var)')
