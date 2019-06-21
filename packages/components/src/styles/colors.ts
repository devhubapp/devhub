import { StaticThemeColors } from '@devhub/core'

export function getStaticColors({
  isDark,
}: {
  isDark: boolean
}): StaticThemeColors {
  return {
    black: '#000000',
    blue: isDark ? '#6E9BEA' : '#3666B9',
    blueGray: isDark ? '#7493A2' : '#607D8B',
    brown: isDark ? '#9C7162' : '#795548',
    gray: isDark ? '#ACACB0' : '#A4A4A8',
    green: isDark ? '#69DF73' : '#2ECE45',
    lightRed: isDark ? '#FF6E64' : '#FF665C',
    orange: isDark ? '#FFB251' : '#FFAA4D',
    pink: isDark ? '#FF6496' : '#FF5C91',
    purple: isDark ? '#A772Ef' : '#562992',
    red: isDark ? '#DE4A40' : '#FF3F34',
    teal: isDark ? '#49D3B4' : '#43C3A7',
    white: '#FFFFFF',
    yellow: isDark ? '#FFDE57' : '#F1CC52',
  }
}
