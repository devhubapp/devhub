export type ThemeName =
  | 'custom'
  | 'light-white'
  | 'light-blue'
  | 'dark-black'
  | 'dark-blue'
  | 'dark-gray'

export interface Theme {
  name: ThemeName
  isDark: boolean
  invert: () => Theme

  backgroundColor: string
  backgroundColor1: string
  backgroundColor2: string
  backgroundColorTransparent10: string
  foregroundColor: string
  foregroundColorMuted50: string
  foregroundColorTransparent50: string
}

export function createTheme(theme: Theme): Theme {
  return theme
}
