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

export interface StaticThemeColors {
  black: string
  blue: string
  blueGray: string
  brown: string
  gray: string
  green: string
  lightRed: string
  orange: string
  pink: string
  purple: string
  red: string
  teal: string
  white: string
  yellow: string
}

export interface ThemeColors extends StaticThemeColors {
  primaryBackgroundColor: string
  primaryForegroundColor: string

  backgroundColor: string
  backgroundColorDarker1: string
  backgroundColorDarker2: string
  backgroundColorDarker3: string
  backgroundColorDarker4: string
  backgroundColorDarker5: string
  backgroundColorLess1: string
  backgroundColorLess2: string
  backgroundColorLess3: string
  backgroundColorLess4: string
  backgroundColorLess5: string
  backgroundColorLighther1: string
  backgroundColorLighther2: string
  backgroundColorLighther3: string
  backgroundColorLighther4: string
  backgroundColorLighther5: string
  backgroundColorMore1: string
  backgroundColorMore2: string
  backgroundColorMore3: string
  backgroundColorMore4: string
  backgroundColorMore5: string
  backgroundColorTransparent10: string

  foregroundColor: string
  foregroundColorMuted10: string
  foregroundColorMuted25: string
  foregroundColorMuted40: string
  foregroundColorMuted65: string
}

export interface Theme extends ThemeColors {
  id: ThemeName
  displayName: string
  isDark: boolean
  isInverted: boolean
  invert: () => Theme
}

export type ThemeTransformer = 'invert' | 'force-dark' | 'force-light'
