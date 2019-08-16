import { getStaticColors } from '../colors'
import { createThemeFromColor } from './custom'

export const theme = createThemeFromColor(
  '#F8F9FA',
  'light-blue',
  'Light Blue',
  {
    tintColor: '#1F3247',
    override: {
      primaryBackgroundColor: getStaticColors({ isDark: false }).blue,
    },
  },
)
