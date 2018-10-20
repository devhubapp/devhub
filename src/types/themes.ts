export type ThemeName =
  | 'auto'
  | 'custom'
  | 'dark-black'
  | 'dark-blue'
  | 'dark-gray'
  | 'light-blue'
  | 'light-gray'
  | 'light-white'

export interface ThemePair {
  name: ThemeName
  color?: string
}

export interface Theme {
  name: ThemeName
  isDark: boolean
  invert: () => Theme

  backgroundColor: string
  backgroundColorLess08: string
  backgroundColorMore08: string
  backgroundColorTransparent10: string
  foregroundColor: string
  foregroundColorMuted50: string
  foregroundColorTransparent50: string
}
