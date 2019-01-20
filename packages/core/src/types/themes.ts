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

export interface ThemeColors {
  backgroundColor: string
  backgroundColorDarker1: string
  backgroundColorDarker2: string
  backgroundColorDarker3: string
  backgroundColorLess1: string
  backgroundColorLess2: string
  backgroundColorLess3: string
  backgroundColorLighther1: string
  backgroundColorLighther2: string
  backgroundColorLighther3: string
  backgroundColorMore1: string
  backgroundColorMore2: string
  backgroundColorMore3: string
  backgroundColorTransparent10: string
  foregroundColor: string
  foregroundColorMuted50: string
}

export interface Theme extends ThemeColors {
  id: ThemeName
  displayName: string
  isDark: boolean
  invert: () => Theme
}
