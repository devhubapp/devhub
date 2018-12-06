import _ from 'lodash'

import { Platform } from '../libs/platform'

const cssVariablesTheme = {
  backgroundColor: 'var(--theme_backgroundColor)',
  backgroundColorDarker08: 'var(--theme_backgroundColorDarker08)',
  backgroundColorLess08: 'var(--theme_backgroundColorLess08)',
  backgroundColorLighther08: 'var(--theme_backgroundColorLighther08)',
  backgroundColorMore08: 'var(--theme_backgroundColorMore08)',
  backgroundColorTransparent10: 'var(--theme_backgroundColorTransparent10)',
  foregroundColor: 'var(--theme_foregroundColor)',
  foregroundColorMuted50: 'var(--theme_foregroundColorMuted50)',
  foregroundColorTransparent50: 'var(--theme_foregroundColorTransparent50)',
  foregroundColorTransparent80: 'var(--theme_foregroundColorTransparent80)',
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
