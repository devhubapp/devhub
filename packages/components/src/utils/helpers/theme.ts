import { isNight, loadThemeBase, Theme, ThemePair } from '@devhub/core/src'
import { Appearance } from '../../libs/appearence'
import { Platform } from '../../libs/platform'

const _window = typeof window !== 'undefined' ? (window as any) : undefined
export const supportsCSSVariables =
  Platform.OS === 'web' &&
  _window &&
  _window.CSS &&
  _window.CSS.supports &&
  _window.CSS.supports('color', 'var(--fake-var)')

export function loadTheme(
  theme: ThemePair,
  {
    preferredDarkTheme,
    preferredLightTheme,
    prefersDarkTheme,
  }: {
    preferredDarkTheme?: ThemePair
    preferredLightTheme?: ThemePair
    prefersDarkTheme?: boolean
  } = {},
): Theme {
  return loadThemeBase(theme, {
    preferredDarkTheme,
    preferredLightTheme,
    prefersDarkTheme:
      typeof prefersDarkTheme === 'boolean'
        ? prefersDarkTheme
        : Appearance.getColorScheme() === 'dark' ||
          (Appearance.getColorScheme() !== 'light' && isNight()),
  })
}
