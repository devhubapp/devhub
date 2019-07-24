import { getStaticColors } from '../colors'
import { createThemeFromColor } from './custom'

export const theme = createThemeFromColor(
  '#F8F9FA',
  'light-blue',
  'Light Blue',
  {
    primaryBackgroundColor: getStaticColors({ isDark: false }).blue,
  },
)
