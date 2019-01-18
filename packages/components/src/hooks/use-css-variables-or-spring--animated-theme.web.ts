import { Platform } from '../libs/platform'

import { ThemeColors } from '@devhub/core'
import { useSpringAnimatedTheme } from '../components/context/SpringAnimatedThemeContext'
import { themeColorFields } from '../utils/helpers/theme'

const cssVariablesTheme = {} as ThemeColors
themeColorFields.forEach(field => {
  cssVariablesTheme[field] = `var(--theme_${field})`
})

function useCSSVariableTheme() {
  return cssVariablesTheme
}

const _window = typeof window !== 'undefined' ? (window as any) : undefined
const supportsCSSVariables =
  Platform.OS === 'web' &&
  _window &&
  _window.CSS &&
  _window.CSS.supports &&
  _window.CSS.supports('color', 'var(--fake-var)')

export const useCSSVariablesOrSpringAnimatedTheme = supportsCSSVariables
  ? useCSSVariableTheme
  : useSpringAnimatedTheme
