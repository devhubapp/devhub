import { getStaticColors } from '../colors'
import { createThemeFromColor } from './custom'

export const theme = createThemeFromColor(
  '#F9F8FA',
  'light-purple',
  'Light Purple',
  {
    override: {
      primaryBackgroundColor: getStaticColors({ isDark: false }).purple,
    },
  },
)
