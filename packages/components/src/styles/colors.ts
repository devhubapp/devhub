import { StaticThemeColors } from '@devhub/core'

export function getStaticColors({
  isDark,
}: {
  isDark: boolean
}): StaticThemeColors {
  return {
    blue: isDark ? '#4C9DFF' : '#4895FF',
    blueGray: isDark ? '#7493A2' : '#607D8B',
    brown: isDark ? '#9C7162' : '#795548',
    gray: isDark ? '#ACACB0' : '#A4A4A8',
    green: isDark ? '#69DF73' : '#2ECE45',
    lightRed: isDark ? '#FF6E64' : '#FF665C',
    orange: isDark ? '#FFB251' : '#FFAA4D',
    pink: isDark ? '#FF6496' : '#FF5C91',
    purple: isDark ? '#8569AF' : '#6E5494',
    red: isDark ? '#DE4A40' : '#FF3F34',
    teal: isDark ? '#49D3B4' : '#43C3A7',
    yellow: isDark ? '#FFDE57' : '#F1CC52',
  }
}
