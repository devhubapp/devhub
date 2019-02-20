export type ThemeName =
  | 'auto'
  | 'custom'
  | 'dark-black'
  | 'dark-blue'
  | 'dark-gray'
  | 'dark-purple'
  | 'light-blue'
  | 'light-gray'
  | 'light-purple'
  | 'light-white'

export interface ThemePair {
  id: ThemeName
  color?: string
}

export interface ThemeColors {
  primaryBackgroundColor: string
  primaryForegroundColor: string
  backgroundColor: string
  backgroundColorDarker1: string
  backgroundColorDarker2: string
  backgroundColorDarker3: string
  backgroundColorDarker4: string
  backgroundColorLess1: string
  backgroundColorLess2: string
  backgroundColorLess3: string
  backgroundColorLess4: string
  backgroundColorLighther1: string
  backgroundColorLighther2: string
  backgroundColorLighther3: string
  backgroundColorLighther4: string
  backgroundColorMore1: string
  backgroundColorMore2: string
  backgroundColorMore3: string
  backgroundColorMore4: string
  backgroundColorTransparent10: string
  foregroundColor: string
  foregroundColorMuted20: string
  foregroundColorMuted50: string
}

export interface Theme extends ThemeColors {
  id: ThemeName
  displayName: string
  isDark: boolean
  invert: () => Theme
}
