import { Platform } from '../libs/platform'

const cssVariablesTheme = {
  backgroundColor: 'var(--theme_backgroundColor)',
  backgroundColorDarker08: 'var(--theme_backgroundColorDarker08)',
  backgroundColorDarker16: 'var(--theme_backgroundColorDarker16)',
  backgroundColorLess08: 'var(--theme_backgroundColorLess08)',
  backgroundColorLess16: 'var(--theme_backgroundColorLess16)',
  backgroundColorLighther08: 'var(--theme_backgroundColorLighther08)',
  backgroundColorLighther16: 'var(--theme_backgroundColorLighther16)',
  backgroundColorMore08: 'var(--theme_backgroundColorMore08)',
  backgroundColorMore16: 'var(--theme_backgroundColorMore16)',
  backgroundColorTransparent10: 'var(--theme_backgroundColorTransparent10)',
  foregroundColor: 'var(--theme_foregroundColor)',
  foregroundColorMuted50: 'var(--theme_foregroundColorMuted50)',
}

function useCSSVariableTheme() {
  return cssVariablesTheme
}
const _window = typeof window !== 'undefined' ? (window as any) : undefined
const supportsCSSVariables =
  Platform.OS === 'web' &&
  _window &&
  _window.CSS &&
  _window.CSS.supports &&
  _window.CSS.supports('--fake-var', 0)

export const useAnimatedTheme = (supportsCSSVariables
  ? () => useCSSVariableTheme
  : () => require('./use-animated-theme.shared').useAnimatedTheme)() // tslint:disable-line
