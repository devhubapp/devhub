import { getStaticColors } from '../colors'
import { createThemeFromColor } from './custom'

export const theme = createThemeFromColor(
  '#F8F9FA',
  'light-blue',
  'Light Blue',
  {
    override: {
      primaryBackgroundColor: getStaticColors({ isDark: false }).blue,
    },
  },
)
