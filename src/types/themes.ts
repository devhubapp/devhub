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
  id: ThemeName
  color?: string
}

export interface Theme {
  id: ThemeName
  displayName: string
  isDark: boolean
  invert: () => Theme

  backgroundColor: string
  backgroundColorDarker08: string
  backgroundColorLess08: string
  backgroundColorLighther08: string
  backgroundColorMore08: string
  backgroundColorTransparent10: string
  foregroundColor: string
  foregroundColorMuted50: string
  foregroundColorTransparent50: string
}
